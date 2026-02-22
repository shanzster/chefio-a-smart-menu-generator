/**
 * Generate enhanced QR code with Chefio branding, recipe image, and Poppins font
 * @param {string} qrCodeUrl - URL to encode in QR
 * @param {Object} recipeData - Recipe information
 * @returns {Promise<Blob>} - PNG blob of the QR code
 */
export const generateEnhancedQRCode = async (qrCodeUrl, recipeData) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Canvas dimensions
    const width = 800;
    const height = 1200;
    canvas.width = width;
    canvas.height = height;

    // Load Poppins font
    const loadFont = () => {
      return new Promise((resolve) => {
        if (document.fonts.check('16px Poppins')) {
          resolve();
        } else {
          document.fonts.load('16px Poppins').then(resolve);
        }
      });
    };

    const drawQRCode = async () => {
      try {
        await loadFont();

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, '#f9fafb');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        let currentY = 40;

        // Chefio Logo (text-based since we don't have the image)
        ctx.fillStyle = '#FF6B35';
        ctx.font = 'bold 48px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Chefio', width / 2, currentY + 48);
        currentY += 80;

        // Tagline
        ctx.fillStyle = '#6b7280';
        ctx.font = '18px Poppins, sans-serif';
        ctx.fillText('Smart Recipe Sharing', width / 2, currentY);
        currentY += 60;

        // Recipe Image (if available)
        if (recipeData.image) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          await new Promise((resolveImg, rejectImg) => {
            img.onload = () => {
              const imgSize = 300;
              const imgX = (width - imgSize) / 2;
              
              // Draw rounded rectangle for image
              ctx.save();
              ctx.beginPath();
              ctx.roundRect(imgX, currentY, imgSize, imgSize, 20);
              ctx.clip();
              ctx.drawImage(img, imgX, currentY, imgSize, imgSize);
              ctx.restore();
              
              // Image border
              ctx.strokeStyle = '#e5e7eb';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.roundRect(imgX, currentY, imgSize, imgSize, 20);
              ctx.stroke();
              
              currentY += imgSize + 40;
              resolveImg();
            };
            img.onerror = () => {
              console.warn('Failed to load recipe image');
              resolveImg(); // Continue without image
            };
            img.src = recipeData.image;
          });
        }

        // Recipe Name
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 32px Poppins, sans-serif';
        ctx.textAlign = 'center';
        
        // Word wrap for long recipe names
        const maxWidth = width - 100;
        const words = recipeData.name.split(' ');
        let line = '';
        const lines = [];
        
        for (let word of words) {
          const testLine = line + word + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && line !== '') {
            lines.push(line);
            line = word + ' ';
          } else {
            line = testLine;
          }
        }
        lines.push(line);
        
        lines.forEach((line, index) => {
          ctx.fillText(line.trim(), width / 2, currentY + (index * 40));
        });
        currentY += lines.length * 40 + 20;

        // Servings info
        if (recipeData.servings) {
          ctx.fillStyle = '#6b7280';
          ctx.font = '20px Poppins, sans-serif';
          ctx.fillText(`Serves ${recipeData.servings}`, width / 2, currentY);
          currentY += 50;
        }

        // QR Code
        const qrElement = document.getElementById('qr-code-svg');
        if (qrElement) {
          const svgData = new XMLSerializer().serializeToString(qrElement);
          const qrImg = new Image();
          
          await new Promise((resolveQR) => {
            qrImg.onload = () => {
              const qrSize = 350;
              const qrX = (width - qrSize) / 2;
              
              // QR background
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(qrX - 20, currentY - 20, qrSize + 40, qrSize + 40);
              
              // QR border
              ctx.strokeStyle = '#e5e7eb';
              ctx.lineWidth = 3;
              ctx.strokeRect(qrX - 20, currentY - 20, qrSize + 40, qrSize + 40);
              
              // Draw QR
              ctx.drawImage(qrImg, qrX, currentY, qrSize, qrSize);
              currentY += qrSize + 60;
              resolveQR();
            };
            qrImg.src = 'data:image/svg+xml;base64,' + btoa(svgData);
          });
        }

        // Call to action
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 28px Poppins, sans-serif';
        ctx.fillText('Scan to Rate & Review', width / 2, currentY);
        currentY += 40;

        ctx.fillStyle = '#6b7280';
        ctx.font = '20px Poppins, sans-serif';
        ctx.fillText('Share your feedback with the cook', width / 2, currentY);

        // Convert to blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to generate QR code image'));
          }
        }, 'image/png', 1.0);

      } catch (error) {
        reject(error);
      }
    };

    drawQRCode();
  });
};

/**
 * Helper to add rounded rectangle to canvas context
 */
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + width, y, x + width, y + height, radius);
    this.arcTo(x + width, y + height, x, y + height, radius);
    this.arcTo(x, y + height, x, y, radius);
    this.arcTo(x, y, x + width, y, radius);
    this.closePath();
    return this;
  };
}
