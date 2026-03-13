import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiKey, 
  FiCheck, 
  FiX, 
  FiRefreshCw,
  FiEye,
  FiEyeOff,
  FiUpload,
  FiDownload,
  FiAlertCircle,
  FiActivity
} from 'react-icons/fi';
import { ArrowLeft, Shield } from 'lucide-react';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { toast } from '../../../store/toastStore';
import { 
  getAPIConfig, 
  updateAPIConfig, 
  testAPIKey,
  getAPIUsage,
  uploadEnvFile,
  downloadEnvFile
} from '../../../services/firebase/apiConfigService';

const APIConfig = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState({});
  const [showKeys, setShowKeys] = useState({});
  const [apiConfig, setApiConfig] = useState({
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
  });

  useEffect(() => {
    loadAPIConfig();
  }, []);

  const loadAPIConfig = async () => {
    try {
      const config = await getAPIConfig();
      setApiConfig(config);
    } catch (error) {
      console.error('Error loading API config:', error);
      toast.error('Failed to load API configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateKey = async (service, field, value) => {
    setApiConfig(prev => ({
      ...prev,
      [service]: {
        ...prev[service],
        [field]: value
      }
    }));
  };

  const handleSaveConfig = async () => {
    try {
      await updateAPIConfig(apiConfig);
      toast.success('API configuration saved successfully');
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Failed to save configuration');
    }
  };

  const handleTestAPI = async (service) => {
    setTesting(prev => ({ ...prev, [service]: true }));
    try {
      const result = await testAPIKey(service, apiConfig[service]);
      
      setApiConfig(prev => ({
        ...prev,
        [service]: {
          ...prev[service],
          status: result.success ? 'valid' : 'invalid',
          usage: result.usage || null
        }
      }));

      if (result.success) {
        toast.success(`${service} API is working! ${result.message || ''}`);
      } else {
        toast.error(`${service} API test failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Error testing API:', error);
      toast.error(`Failed to test ${service} API`);
      setApiConfig(prev => ({
        ...prev,
        [service]: {
          ...prev[service],
          status: 'error'
        }
      }));
    } finally {
      setTesting(prev => ({ ...prev, [service]: false }));
    }
  };

  const handleRefreshUsage = async (service) => {
    try {
      const usage = await getAPIUsage(service, apiConfig[service]);
      setApiConfig(prev => ({
        ...prev,
        [service]: {
          ...prev[service],
          usage
        }
      }));
      toast.success(`${service} usage updated`);
    } catch (error) {
      console.error('Error refreshing usage:', error);
      toast.error('Failed to refresh usage');
    }
  };

  const handleUploadEnv = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const config = await uploadEnvFile(file);
      setApiConfig(config);
      toast.success('Environment file uploaded successfully');
    } catch (error) {
      console.error('Error uploading env file:', error);
      toast.error('Failed to upload environment file');
    }
  };

  const handleDownloadEnv = async () => {
    try {
      await downloadEnvFile(apiConfig);
      toast.success('Environment file downloaded');
    } catch (error) {
      console.error('Error downloading env file:', error);
      toast.error('Failed to download environment file');
    }
  };

  const toggleShowKey = (service) => {
    setShowKeys(prev => ({ ...prev, [service]: !prev[service] }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'valid': return 'text-green-600 bg-green-100';
      case 'invalid': return 'text-red-600 bg-red-100';
      case 'error': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'valid': return <FiCheck className="w-4 h-4" />;
      case 'invalid': return <FiX className="w-4 h-4" />;
      case 'error': return <FiAlertCircle className="w-4 h-4" />;
      default: return <FiKey className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin/dashboard')}
                icon={<ArrowLeft />}
              />
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <FiKey className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">API Configuration</h1>
                <p className="text-sm text-gray-500">Manage API keys and monitor usage</p>
              </div>
            </div>
            <div className="flex gap-3">
              <label>
                <input
                  type="file"
                  accept=".env"
                  onChange={handleUploadEnv}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  icon={<FiUpload />}
                  as="span"
                >
                  Upload .env
                </Button>
              </label>
              <Button
                variant="outline"
                onClick={handleDownloadEnv}
                icon={<FiDownload />}
              >
                Download .env
              </Button>
              <Button
                onClick={handleSaveConfig}
                icon={<FiCheck />}
              >
                Save Configuration
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <Card className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading API configuration...</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Spoonacular API */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    Spoonacular API
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(apiConfig.spoonacular.status)}`}>
                      {getStatusIcon(apiConfig.spoonacular.status)}
                      {apiConfig.spoonacular.status}
                    </span>
                  </h2>
                  <p className="text-sm text-gray-500">Recipe search and menu generation</p>
                </div>
                <div className="flex gap-2">
                  {apiConfig.spoonacular.usage && (
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleRefreshUsage('spoonacular')}
                      icon={<FiRefreshCw />}
                    />
                  )}
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handleTestAPI('spoonacular')}
                    loading={testing.spoonacular}
                    icon={<FiActivity />}
                  >
                    Test API
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Input
                    label="API Key"
                    type={showKeys.spoonacular ? 'text' : 'password'}
                    value={apiConfig.spoonacular.key}
                    onChange={(e) => handleUpdateKey('spoonacular', 'key', e.target.value)}
                    placeholder="Enter Spoonacular API key"
                  />
                  <button
                    onClick={() => toggleShowKey('spoonacular')}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showKeys.spoonacular ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {apiConfig.spoonacular.usage && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Usage Statistics</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Used Today</p>
                        <p className="text-lg font-bold text-gray-900">{apiConfig.spoonacular.usage.used || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Daily Limit</p>
                        <p className="text-lg font-bold text-gray-900">{apiConfig.spoonacular.usage.limit || 150}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Remaining</p>
                        <p className="text-lg font-bold text-green-600">
                          {(apiConfig.spoonacular.usage.limit || 150) - (apiConfig.spoonacular.usage.used || 0)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${((apiConfig.spoonacular.usage.used || 0) / (apiConfig.spoonacular.usage.limit || 150)) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Edamam API */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    Edamam API
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(apiConfig.edamam.status)}`}>
                      {getStatusIcon(apiConfig.edamam.status)}
                      {apiConfig.edamam.status}
                    </span>
                  </h2>
                  <p className="text-sm text-gray-500">Recipe search fallback</p>
                </div>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handleTestAPI('edamam')}
                  loading={testing.edamam}
                  icon={<FiActivity />}
                >
                  Test API
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    label="App ID"
                    type={showKeys.edamam ? 'text' : 'password'}
                    value={apiConfig.edamam.appId}
                    onChange={(e) => handleUpdateKey('edamam', 'appId', e.target.value)}
                    placeholder="Enter Edamam App ID"
                  />
                  <button
                    onClick={() => toggleShowKey('edamam')}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showKeys.edamam ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                <Input
                  label="App Key"
                  type={showKeys.edamam ? 'text' : 'password'}
                  value={apiConfig.edamam.appKey}
                  onChange={(e) => handleUpdateKey('edamam', 'appKey', e.target.value)}
                  placeholder="Enter Edamam App Key"
                />
              </div>
            </Card>

            {/* USDA API */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    USDA FoodData API
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(apiConfig.usda.status)}`}>
                      {getStatusIcon(apiConfig.usda.status)}
                      {apiConfig.usda.status}
                    </span>
                  </h2>
                  <p className="text-sm text-gray-500">Nutrition analysis</p>
                </div>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handleTestAPI('usda')}
                  loading={testing.usda}
                  icon={<FiActivity />}
                >
                  Test API
                </Button>
              </div>

              <div className="relative">
                <Input
                  label="API Key"
                  type={showKeys.usda ? 'text' : 'password'}
                  value={apiConfig.usda.key}
                  onChange={(e) => handleUpdateKey('usda', 'key', e.target.value)}
                  placeholder="Enter USDA API key"
                />
                <button
                  onClick={() => toggleShowKey('usda')}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showKeys.usda ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </Card>

            {/* Cloudinary */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    Cloudinary
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(apiConfig.cloudinary.status)}`}>
                      {getStatusIcon(apiConfig.cloudinary.status)}
                      {apiConfig.cloudinary.status}
                    </span>
                  </h2>
                  <p className="text-sm text-gray-500">Image storage and CDN</p>
                </div>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handleTestAPI('cloudinary')}
                  loading={testing.cloudinary}
                  icon={<FiActivity />}
                >
                  Test API
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Cloud Name"
                  value={apiConfig.cloudinary.cloudName}
                  onChange={(e) => handleUpdateKey('cloudinary', 'cloudName', e.target.value)}
                  placeholder="Enter Cloudinary cloud name"
                />
                <Input
                  label="Upload Preset"
                  value={apiConfig.cloudinary.uploadPreset}
                  onChange={(e) => handleUpdateKey('cloudinary', 'uploadPreset', e.target.value)}
                  placeholder="Enter upload preset"
                />
              </div>
            </Card>

            {/* Firebase */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    Firebase Configuration
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(apiConfig.firebase.status)}`}>
                      {getStatusIcon(apiConfig.firebase.status)}
                      {apiConfig.firebase.status}
                    </span>
                  </h2>
                  <p className="text-sm text-gray-500">Database and authentication</p>
                </div>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handleTestAPI('firebase')}
                  loading={testing.firebase}
                  icon={<FiActivity />}
                >
                  Test Connection
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="API Key"
                  type={showKeys.firebase ? 'text' : 'password'}
                  value={apiConfig.firebase.apiKey}
                  onChange={(e) => handleUpdateKey('firebase', 'apiKey', e.target.value)}
                  placeholder="Enter Firebase API key"
                />
                <Input
                  label="Auth Domain"
                  value={apiConfig.firebase.authDomain}
                  onChange={(e) => handleUpdateKey('firebase', 'authDomain', e.target.value)}
                  placeholder="your-app.firebaseapp.com"
                />
                <Input
                  label="Project ID"
                  value={apiConfig.firebase.projectId}
                  onChange={(e) => handleUpdateKey('firebase', 'projectId', e.target.value)}
                  placeholder="your-project-id"
                />
                <Input
                  label="Storage Bucket"
                  value={apiConfig.firebase.storageBucket}
                  onChange={(e) => handleUpdateKey('firebase', 'storageBucket', e.target.value)}
                  placeholder="your-app.appspot.com"
                />
                <Input
                  label="Messaging Sender ID"
                  value={apiConfig.firebase.messagingSenderId}
                  onChange={(e) => handleUpdateKey('firebase', 'messagingSenderId', e.target.value)}
                  placeholder="123456789"
                />
                <Input
                  label="App ID"
                  value={apiConfig.firebase.appId}
                  onChange={(e) => handleUpdateKey('firebase', 'appId', e.target.value)}
                  placeholder="1:123456789:web:abc123"
                />
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default APIConfig;
