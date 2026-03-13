import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { isAdmin } from './adminService';

/**
 * Get API configuration from Firestore
 */
export const getAPIConfig = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const isUserAdmin = await isAdmin(user.uid);
    if (!isUserAdmin) throw new Error('Unauthorized: Admin access required');

    const configDoc = await getDoc(doc(db, 'system_config', 'api_keys'));
    
    if (configDoc.exists()) {
      return configDoc.data();
    }

    // Return default empty config
    return {
      spoonacular: { key: '', status: 'unknown', usage: null },
      edamam: { appId: '', appKey: '', status: 'unknown', usage: null },
      usda: { key: '', status: 'unknown', usage: null },
      cloudinary: { cloudName: '', uploadPreset: '', status: 'unknown' },
      firebase: { 
        apiKey: '', 
        authDomain: '', 
        projectId: '', 
        storageBucket: '',
        messagingSenderId: '',
        appId: '',
        status: 'unknown' 
      }
    };
  } catch (error) {
    console.error('Error getting API config:', error);
    throw error;
  }
};

/**
 * Update API configuration in Firestore
 */
export const updateAPIConfig = async (config) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const isUserAdmin = await isAdmin(user.uid);
    if (!isUserAdmin) throw new Error('Unauthorized: Admin access required');

    await setDoc(doc(db, 'system_config', 'api_keys'), {
      ...config,
      updatedAt: serverTimestamp(),
      updatedBy: user.uid
    });

    // Log admin action
    await logConfigChange(user.uid, 'api_config_updated');

    return true;
  } catch (error) {
    console.error('Error updating API config:', error);
    throw error;
  }
};

/**
 * Test API key validity
 */
export const testAPIKey = async (service, config) => {
  try {
    switch (service) {
      case 'spoonacular':
        return await testSpoonacularAPI(config.key);
      case 'edamam':
        return await testEdamamAPI(config.appId, config.appKey);
      case 'usda':
        return await testUSDAAPI(config.key);
      case 'cloudinary':
        return await testCloudinaryAPI(config.cloudName, config.uploadPreset);
      case 'firebase':
        return await testFirebaseAPI(config);
      default:
        throw new Error('Unknown service');
    }
  } catch (error) {
    console.error(`Error testing ${service} API:`, error);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Test Spoonacular API
 */
const testSpoonacularAPI = async (apiKey) => {
  try {
    if (!apiKey) {
      return { success: false, message: 'API key is required' };
    }

    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=1`
    );

    if (!response.ok) {
      const error = await response.json();
      return { 
        success: false, 
        message: error.message || 'Invalid API key' 
      };
    }

    const data = await response.json();
    
    // Get usage from headers
    const usage = {
      used: parseInt(response.headers.get('X-API-Quota-Used') || '0'),
      limit: parseInt(response.headers.get('X-API-Quota-Limit') || '150')
    };

    return {
      success: true,
      message: `API is working! Found ${data.totalResults} recipes`,
      usage
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Test Edamam API
 */
const testEdamamAPI = async (appId, appKey) => {
  try {
    if (!appId || !appKey) {
      return { success: false, message: 'App ID and App Key are required' };
    }

    const response = await fetch(
      `https://api.edamam.com/api/recipes/v2?type=public&q=chicken&app_id=${appId}&app_key=${appKey}`
    );

    if (!response.ok) {
      return { 
        success: false, 
        message: 'Invalid credentials' 
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: `API is working! Found ${data.count} recipes`
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Test USDA API
 */
const testUSDAAPI = async (apiKey) => {
  try {
    if (!apiKey) {
      return { success: false, message: 'API key is required' };
    }

    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=apple&api_key=${apiKey}`
    );

    if (!response.ok) {
      return { 
        success: false, 
        message: 'Invalid API key' 
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: `API is working! Found ${data.totalHits} food items`
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Test Cloudinary API
 */
const testCloudinaryAPI = async (cloudName, uploadPreset) => {
  try {
    if (!cloudName || !uploadPreset) {
      return { success: false, message: 'Cloud name and upload preset are required' };
    }

    // Test by checking if the cloud exists
    const response = await fetch(
      `https://res.cloudinary.com/${cloudName}/image/upload/sample.jpg`
    );

    if (!response.ok) {
      return { 
        success: false, 
        message: 'Invalid cloud name' 
      };
    }

    return {
      success: true,
      message: 'Cloudinary configuration is valid'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Test Firebase API
 */
const testFirebaseAPI = async (config) => {
  try {
    if (!config.apiKey || !config.projectId) {
      return { success: false, message: 'API key and Project ID are required' };
    }

    // Check if current Firebase connection is working
    const user = auth.currentUser;
    if (user) {
      return {
        success: true,
        message: 'Firebase connection is active'
      };
    }

    return {
      success: true,
      message: 'Firebase configuration looks valid'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Get API usage statistics
 */
export const getAPIUsage = async (service, config) => {
  try {
    switch (service) {
      case 'spoonacular':
        return await getSpoonacularUsage(config.key);
      default:
        return null;
    }
  } catch (error) {
    console.error(`Error getting ${service} usage:`, error);
    return null;
  }
};

/**
 * Get Spoonacular usage
 */
const getSpoonacularUsage = async (apiKey) => {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=1`
    );

    return {
      used: parseInt(response.headers.get('X-API-Quota-Used') || '0'),
      limit: parseInt(response.headers.get('X-API-Quota-Limit') || '150')
    };
  } catch (error) {
    return null;
  }
};

/**
 * Upload .env file and parse it
 */
export const uploadEnvFile = async (file) => {
  try {
    const text = await file.text();
    const lines = text.split('\n');
    const config = {
      spoonacular: { key: '', status: 'unknown', usage: null },
      edamam: { appId: '', appKey: '', status: 'unknown', usage: null },
      usda: { key: '', status: 'unknown', usage: null },
      cloudinary: { cloudName: '', uploadPreset: '', status: 'unknown' },
      firebase: { 
        apiKey: '', 
        authDomain: '', 
        projectId: '', 
        storageBucket: '',
        messagingSenderId: '',
        appId: '',
        status: 'unknown' 
      }
    };

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').trim();

        switch (key.trim()) {
          case 'VITE_SPOONACULAR_API_KEY':
            config.spoonacular.key = value;
            break;
          case 'VITE_EDAMAM_APP_ID':
            config.edamam.appId = value;
            break;
          case 'VITE_EDAMAM_APP_KEY':
            config.edamam.appKey = value;
            break;
          case 'VITE_USDA_API_KEY':
            config.usda.key = value;
            break;
          case 'VITE_CLOUDINARY_CLOUD_NAME':
            config.cloudinary.cloudName = value;
            break;
          case 'VITE_CLOUDINARY_UPLOAD_PRESET':
            config.cloudinary.uploadPreset = value;
            break;
          case 'VITE_FIREBASE_API_KEY':
            config.firebase.apiKey = value;
            break;
          case 'VITE_FIREBASE_AUTH_DOMAIN':
            config.firebase.authDomain = value;
            break;
          case 'VITE_FIREBASE_PROJECT_ID':
            config.firebase.projectId = value;
            break;
          case 'VITE_FIREBASE_STORAGE_BUCKET':
            config.firebase.storageBucket = value;
            break;
          case 'VITE_FIREBASE_MESSAGING_SENDER_ID':
            config.firebase.messagingSenderId = value;
            break;
          case 'VITE_FIREBASE_APP_ID':
            config.firebase.appId = value;
            break;
        }
      }
    });

    return config;
  } catch (error) {
    console.error('Error parsing env file:', error);
    throw error;
  }
};

/**
 * Download .env file
 */
export const downloadEnvFile = async (config) => {
  try {
    const envContent = `# Spoonacular API (Menu Generator - Primary)
VITE_SPOONACULAR_API_KEY=${config.spoonacular.key}

# Edamam Recipe Search API (Menu Generator - Fallback)
VITE_EDAMAM_APP_ID=${config.edamam.appId}
VITE_EDAMAM_APP_KEY=${config.edamam.appKey}

# USDA FoodData Central API (Nutrition Analysis)
VITE_USDA_API_KEY=${config.usda.key}

# Cloudinary Configuration (for image uploads)
VITE_CLOUDINARY_CLOUD_NAME=${config.cloudinary.cloudName}
VITE_CLOUDINARY_UPLOAD_PRESET=${config.cloudinary.uploadPreset}

# Firebase Configuration
VITE_FIREBASE_API_KEY=${config.firebase.apiKey}
VITE_FIREBASE_AUTH_DOMAIN=${config.firebase.authDomain}
VITE_FIREBASE_PROJECT_ID=${config.firebase.projectId}
VITE_FIREBASE_STORAGE_BUCKET=${config.firebase.storageBucket}
VITE_FIREBASE_MESSAGING_SENDER_ID=${config.firebase.messagingSenderId}
VITE_FIREBASE_APP_ID=${config.firebase.appId}
`;

    const blob = new Blob([envContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error downloading env file:', error);
    throw error;
  }
};

/**
 * Log configuration change
 */
const logConfigChange = async (adminId, action) => {
  try {
    const { addDoc, collection } = await import('firebase/firestore');
    
    await addDoc(collection(db, 'admin_logs'), {
      adminId,
      action,
      targetType: 'system_config',
      targetId: 'api_keys',
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error logging config change:', error);
    // Don't throw - logging failure shouldn't stop the main action
  }
};

export default {
  getAPIConfig,
  updateAPIConfig,
  testAPIKey,
  getAPIUsage,
  uploadEnvFile,
  downloadEnvFile
};
