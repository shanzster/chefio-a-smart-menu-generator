import React, { useState, useRef, useEffect } from 'react';
import { FiCamera, FiX, FiRefreshCw } from 'react-icons/fi';
import { QrCode, FlipHorizontal } from 'lucide-react';
import Button from '../Button/Button';
import Card from '../Card/Card';
import { toast } from '../../../store/toastStore';
import jsQR from 'jsqr';

const QRScanner = ({ onScan, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' for front, 'environment' for back
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  useEffect(() => {
    // Check if device has multiple cameras
    checkCameras();
    
    return () => {
      stopScanning();
    };
  }, []);

  useEffect(() => {
    if (isScanning) {
      startScanning();
    }
  }, [facingMode]);

  const checkCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setHasMultipleCameras(videoDevices.length > 1);
    } catch (error) {
      console.error('Error checking cameras:', error);
    }
  };

  const startScanning = async () => {
    try {
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        // Start scanning for QR codes
        scanIntervalRef.current = setInterval(scanQRCode, 300);
      }

      setIsScanning(true);
      toast.success('Camera started! Point at a QR code');
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsScanning(false);
      
      if (error.name === 'NotAllowedError') {
        toast.error('Camera permission denied. Please allow camera access.');
      } else if (error.name === 'NotFoundError') {
        toast.error('No camera found on this device.');
      } else {
        toast.error('Failed to access camera. Please try again.');
      }
    }
  };

  const stopScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Check if video is ready
    if (video.readyState !== video.HAVE_ENOUGH_DATA) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Scan for QR code
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code) {
      setIsProcessing(true);
      handleQRCodeDetected(code.data);
    }
  };

  const handleQRCodeDetected = (data) => {
    // Stop scanning
    stopScanning();

    // Vibrate if supported (mobile)
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }

    // Show success message
    toast.success('QR Code scanned successfully!');

    // Call the onScan callback
    if (onScan) {
      onScan(data);
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    toast.info(`Switching to ${facingMode === 'environment' ? 'front' : 'back'} camera...`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card variant="default" className="overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-text">Scan QR Code</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-text-tertiary hover:text-text rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Scanner Area */}
          <div className="relative aspect-square bg-black">
            {isScanning ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Scanning overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-64 h-64">
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary rounded-br-xl" />

                    {/* Scanning line animation */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />
                    </div>
                  </div>
                </div>

                {/* Instruction */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 rounded-full text-white text-sm font-medium">
                  Position QR code in frame
                </div>

                {/* Camera Switch Button (Mobile) */}
                {hasMultipleCameras && (
                  <button
                    onClick={switchCamera}
                    className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white active:scale-95 transition-all"
                    title={`Switch to ${facingMode === 'environment' ? 'front' : 'back'} camera`}
                  >
                    <FlipHorizontal className="w-5 h-5 text-text" />
                  </button>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mb-4">
                  <QrCode className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Ready to Scan</h3>
                <p className="text-sm text-white/70 text-center mb-6">
                  Point your camera at a QR code to scan it
                </p>
                <Button
                  size="large"
                  icon={<FiCamera />}
                  onClick={startScanning}
                  className="shadow-lg"
                >
                  Start Camera
                </Button>
              </div>
            )}
          </div>

          {/* Controls */}
          {isScanning && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={stopScanning}
                  className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-text font-semibold hover:bg-gray-50 active:scale-95 transition-all"
                >
                  Cancel
                </button>
                {hasMultipleCameras && (
                  <button
                    onClick={switchCamera}
                    className="px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark active:scale-95 transition-all flex items-center gap-2"
                  >
                    <FlipHorizontal className="w-5 h-5" />
                    Switch Camera
                  </button>
                )}
              </div>
              <p className="text-xs text-text-tertiary text-center mt-3">
                Using {facingMode === 'environment' ? 'back' : 'front'} camera
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default QRScanner;
