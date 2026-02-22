/**
 * Generate a custom styled QR code with logo, recipe image, and Poppins font
 * @param {string} qrCodeUrl - The URL to encode in QR
 * @param {Object} recipeData - Recipe information
 * @returns {Promise<Blob>} - PNG blob of the styled QR code
 */
export const generateStyledQRCode = async (qrCodeUrl, recipeData) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Canvas dimensions
    const width = 800;
    const height = 1200;
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    let imagesLoaded = 0;
    const totalImages = recipeData.image ? 3 : 2; // logo, qr, and optionally recipe image

    const checkComplete = () => {
      imagesLoaded++;
      if (imagesLoaded === totalImages) {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      }
    };

    // Load and draw Chefio logo
    const logo = new Image();
    logo.crossOrigin = 'anonymous';
    logo.onload = () => {
      // Draw logo at top
      const logoHeight = 60;
      const logoWidth = (logo.width / logo.height) * logoHeight;
      const logoX = (width - logoWidth) / 2;
      ctx.drawImage(logo, logoX, 40, logoWidth, logoHeight);

      // Add "Chefio" text below logo with Poppins font
      ctx.font = 'bold 48px Poppins, Arial, sans-serif';
      ctx.fillStyle = '#FF6B35';
      ctx.textAlign = 'center';
      ctx.fillText('Chefio', width / 2, 140);

      checkComplete();
    };
    logo.onerror = () => {
      // Fallback: just draw text if logo fails
      ctx.font = 'bold 48px Poppins, Arial, sans-serif';
      ctx.fillStyle = '#FF6B35';
      ctx.textAlign = 'center';
      ctx.fillText('Chefio', width / 2, 80);
      checkComplete();
    };
    logo.src = '/chefio.png'; // Make sure this exists in public folder

    // Load and draw recipe image if available
    if (recipeData.image) {
      const recipeImg = new Image();
      recipeImg.crossOrigin = 'anonymous';
      recipeImg.onload = () => {
        // Draw recipe image
        const imgHeight = 200;
        const imgWidth = width - 100;
        const imgX = 50;
        const imgY = 180;
        
        // Draw rounded rectangle for image
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(imgX, imgY, imgWidth, imgHeight, 20);
        ctx.clip();
        ctx.drawImage(recipeImg, imgX, imgY, imgWidth, imgHeight);
        ctx.restore();

        // Add border
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(imgX, imgY, imgWidth, imgHeight, 20);
        ctx.stroke();

        checkComplete();
      };
      recipeImg.onerror = () => {
        checkComplete(); // Continue even if image fails
      };
      recipeImg.src = recipeData.image;
    }

    // Generate QR code and draw it
    const qrElement = document.getElementById('qr-code-svg');
    if (!qrElement) {
      reject(new Error('QR code element not found'));
      return;
    }

    const svgData = new XMLSerializer().serializeToString(qrElement);
    const qrImg = new Image();
    
    qrImg.onload = () => {
      const qrSize = 400;
      const qrX = (width - qrSize) / 2;
      const qrY = recipeData.image ? 420 : 220;
      
      // Draw white background for QR
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40);
      
      // Draw QR code
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

      // Recipe name with Poppins font
      ctx.font = 'bold 36px Poppins, Arial, sans-serif';
      ctx.fillStyle = '#1f2937';
      ctx.textAlign = 'center';
      const nameY = qrY + qrSize + 60;
      ctx.fillText(recipeData.name, width / 2, nameY);

      // Subtitle with Poppins font
      ctx.font = '24px Poppins, Arial, sans-serif';
      ctx.fillStyle = '#6b7280';
      ctx.fillText('Scan to Rate & Review', width / 2, nameY + 40);

      // Servings info if available
      if (recipeData.servings) {
        ctx.font = '20px Poppins, Arial, sans-serif';
        ctx.fillStyle = '#9ca3af';
        ctx.fillText(`Serves ${recipeData.servings}`, width / 2, nameY + 75);
      }

      // Footer
      ctx.font = '18px Poppins, Arial, sans-serif';
      ctx.fillStyle = '#d1d5db';
      ctx.fillText('Powered by Chefio', width / 2, height - 30);

      checkComplete();
    };
    qrImg.onerror = () => {
      reject(new Error('Failed to load QR code'));
    };
    qrImg.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  });
};
