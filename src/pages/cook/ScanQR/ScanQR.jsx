import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { QrCode } from 'lucide-react';
import Layout from '../../../components/layout/Layout/Layout';
import QRScanner from '../../../components/common/QRScanner/QRScanner';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import { toast } from '../../../store/toastStore';

const ScanQR = () => {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  const handleScan = (data) => {
    console.log('QR Code scanned:', data);
    setScannedData(data);
    setShowScanner(false);

    // Check if it's a recipe URL
    if (data.includes('/recipe/') || data.includes('/guest/recipe')) {
      // Extract recipe ID or navigate to the URL
      toast.success('Recipe QR code detected! Redirecting...');
      
      // If it's a full URL, navigate to it
      if (data.startsWith('http')) {
        window.location.href = data;
      } else {
        // If it's just a path, navigate within the app
        navigate(data);
      }
    } else {
      // Show the scanned data
      toast.info('QR code scanned successfully!');
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-[800px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-text-secondary hover:text-text mb-4 transition-colors"
          >
            <FiArrowLeft />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-text mb-2">Scan QR Code</h1>
          <p className="text-base text-text-secondary">
            Scan recipe QR codes to view full details, ingredients, and nutrition info
          </p>
        </div>

        {/* Main Content */}
        <Card variant="glass" className="text-center p-12">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl" />
            <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center">
              <QrCode className="w-12 h-12 text-primary" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-text mb-3">Ready to Scan</h2>
          <p className="text-base text-text-secondary mb-8 max-w-md mx-auto">
            Point your camera at a recipe QR code to instantly view the full recipe with ingredients and nutrition information
          </p>

          <Button
            size="large"
            icon={<QrCode />}
            onClick={() => setShowScanner(true)}
            className="shadow-lg"
          >
            Start QR Scanner
          </Button>

          {/* Scanned Data Display */}
          {scannedData && (
            <div className="mt-8 p-4 bg-success/10 border-2 border-success/20 rounded-xl text-left">
              <h3 className="text-sm font-semibold text-success mb-2">Scanned Data:</h3>
              <p className="text-sm text-text break-all">{scannedData}</p>
            </div>
          )}
        </Card>

        {/* How it Works */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card variant="default" className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-base font-semibold text-text mb-2">Open Scanner</h3>
            <p className="text-sm text-text-secondary">
              Click the button above to activate your camera
            </p>
          </Card>

          <Card variant="default" className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-base font-semibold text-text mb-2">Point at QR Code</h3>
            <p className="text-sm text-text-secondary">
              Position the QR code within the frame
            </p>
          </Card>

          <Card variant="default" className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-base font-semibold text-text mb-2">View Recipe</h3>
            <p className="text-sm text-text-secondary">
              Automatically redirects to the recipe page
            </p>
          </Card>
        </div>

        {/* Features */}
        <Card variant="glass" className="mt-8 p-6">
          <h3 className="text-lg font-bold text-text mb-4">Scanner Features</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-success text-sm">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-text">Camera Selection</p>
                <p className="text-xs text-text-secondary">Switch between front and back camera on mobile devices</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-success text-sm">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-text">Fast Scanning</p>
                <p className="text-xs text-text-secondary">Instantly detects and reads QR codes</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-success text-sm">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-text">Auto-Redirect</p>
                <p className="text-xs text-text-secondary">Automatically opens recipe pages after scanning</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-success text-sm">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-text">Mobile Optimized</p>
                <p className="text-xs text-text-secondary">Works perfectly on smartphones and tablets</p>
              </div>
            </li>
          </ul>
        </Card>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </Layout>
  );
};

export default ScanQR;
