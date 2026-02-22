import React, { useState, useEffect } from 'react';
import { FiDownload, FiShare2, FiCopy, FiCheck } from 'react-icons/fi';
import { Phone, Camera, Lightbulb } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Button from '../../../components/common/Button/Button';
import Card from '../../../components/common/Card/Card';
import Layout from '../../../components/layout/Layout/Layout';
import { useAuthStore } from '../../../store/authStore';
import { getUserSavedRecipes } from '../../../services/firebase/recipeService';
import { createQRCode } from '../../../services/firebase/qrCodeService';
import { generateEnhancedQRCode } from '../../../utils/enhancedQRGenerator';
import { toast } from '../../../store/toastStore';

const QRGenerator = () => {
  const user = useAuthStore((state) => state.user);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [qrCodeId, setQrCodeId] = useState(null);
  const [copied, setCopied] = useState(false);

  // Load user's saved recipes
  useEffect(() => {
    const loadRecipes = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const savedRecipes = await getUserSavedRecipes(user.uid);
        setRecipes(savedRecipes);
      } catch (error) {
        console.error('Error loading recipes:', error);
        toast.error('Failed to load recipes');
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [user]);

  const handleGenerate = async () => {
    if (!selectedRecipe) return;
    setIsGenerating(true);
    
    try {
      // Create QR code entry in Firebase
      const qrData = {
        recipeId: selectedRecipe.id,
        recipeName: selectedRecipe.name,
        recipeImage: selectedRecipe.image || null,
        cookId: user.uid,
        cookName: user.displayName || user.email || 'Anonymous Cook',
        title: selectedRecipe.name,
        description: selectedRecipe.description || '',
        servings: selectedRecipe.servings || null,
        ingredients: selectedRecipe.ingredients || [],
        instructions: selectedRecipe.instructions || [],
        nutrition: selectedRecipe.nutrition || null
      };
      
      const qrCode = await createQRCode(qrData);
      setQrCodeId(qrCode.id);
      setQrGenerated(true);
      toast.success('QR code generated successfully!');
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const url = `${window.location.origin}/feedback/${qrCodeId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = async () => {
    try {
      const qrCodeUrl = `${window.location.origin}/feedback/${qrCodeId}`;
      const recipeData = {
        name: selectedRecipe.name,
        image: selectedRecipe.image,
        servings: selectedRecipe.servings
      };

      const blob = await generateEnhancedQRCode(qrCodeUrl, recipeData);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chefio-qr-${selectedRecipe.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('QR code downloaded!');
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Failed to download QR code');
    }
  };

  return (
    <Layout>
      <div className="p-6 lg:p-12 lg:py-16 max-w-[700px] mx-auto">
        {/* Header */}
        <header className="text-center mb-10 lg:mb-16 animate-fade-in-down">
          <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
            <Phone className="w-12 h-12 lg:w-16 lg:h-16 text-primary" />
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold text-text mb-3">QR Share</h1>
          <p className="text-base lg:text-lg text-text-secondary leading-relaxed max-w-[400px] lg:max-w-[500px] mx-auto">
            Generate QR codes to share your recipes with anyone
          </p>
        </header>

        {/* Recipe Selection */}
        <section className="mb-8 lg:mb-12">
          <h2 className="text-lg lg:text-xl font-semibold text-text mb-6 lg:mb-8">Select a Recipe</h2>
          
          {loading ? (
            <Card variant="glass" className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-sm text-text-secondary">Loading recipes...</p>
            </Card>
          ) : recipes.length === 0 ? (
            <Card variant="glass" className="p-8 text-center">
              <Camera className="w-12 h-12 text-text-tertiary mx-auto mb-3 opacity-50" />
              <h3 className="font-semibold text-text mb-2">No Saved Recipes</h3>
              <p className="text-sm text-text-secondary mb-4">
                Save recipes from Menu Generator to create QR codes
              </p>
              <Button to="/menu-generator" size="small" variant="outline">
                Go to Menu Generator
              </Button>
            </Card>
          ) : (
            <div className="flex flex-col gap-2">
              {recipes.map((recipe) => (
                <button
                  key={recipe.id}
                  className={`flex items-center gap-4 p-4 w-full text-left bg-white border-2 rounded-lg transition-all active:scale-[0.98] ${
                    selectedRecipe?.id === recipe.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-primary'
                  }`}
                  onClick={() => { setSelectedRecipe(recipe); setQrGenerated(false); }}
                >
                  {recipe.image && (
                    <img src={recipe.image} alt={recipe.name} className="w-12 h-12 rounded-lg object-cover" />
                  )}
                  <div className="flex-1">
                    <span className="block text-base font-medium text-text">{recipe.name}</span>
                    {recipe.servings && (
                      <span className="text-sm text-text-secondary">{recipe.servings} servings</span>
                    )}
                  </div>
                  {selectedRecipe?.id === recipe.id && (
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center animate-scale-in">
                      <FiCheck className="text-sm" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* QR Preview */}
        <section className="mb-8 lg:mb-12">
          <Card variant="glass" className="text-center p-8 lg:p-12">
            {qrGenerated ? (
              <div className="animate-fade-in">
                <div className="inline-block p-6 bg-white rounded-lg shadow-lg mb-4">
                  <QRCodeSVG
                    id="qr-code-svg"
                    value={`${window.location.origin}/feedback/${qrCodeId}`}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <h3 className="text-lg font-semibold text-text mb-1">{selectedRecipe?.name}</h3>
                <p className="text-sm text-text-tertiary mb-6">Scan to rate & review this dish</p>
                
                {/* Share Link */}
                <div className="flex items-center gap-2 bg-black/5 rounded-md px-4 py-2 mb-6">
                  <input 
                    type="text" 
                    value={`${window.location.origin}/feedback/${qrCodeId}`}
                    readOnly
                    className="flex-1 bg-transparent border-none text-sm text-text-secondary outline-none"
                  />
                  <button onClick={handleCopy} className="w-8 h-8 flex items-center justify-center bg-white rounded-sm text-text-secondary hover:bg-primary hover:text-white transition-colors">
                    {copied ? <FiCheck /> : <FiCopy />}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" icon={<FiDownload />} className="flex-1" onClick={handleDownload}>
                    Save Image
                  </Button>
                  <Button icon={<FiShare2 />} className="flex-1" onClick={handleCopy}>
                    Share Link
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-8">
                <div className="w-[120px] h-[120px] bg-black/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-14 h-14 opacity-30 text-text-tertiary" />
                </div>
                <p className="text-base text-text-tertiary">
                  {selectedRecipe ? 'Click generate to create QR code' : 'Select a recipe to generate QR code'}
                </p>
              </div>
            )}
          </Card>

          {!qrGenerated && (
            <Button fullWidth size="large" onClick={handleGenerate} loading={isGenerating} disabled={!selectedRecipe} className="mt-4">
              Generate QR Code
            </Button>
          )}
        </section>

        {/* Info Card */}
        <Card variant="default" className="bg-gradient-to-br from-blue-50 to-blue-100 border-none">
          <div className="flex gap-4 p-2">
            <Lightbulb className="w-8 h-8 flex-shrink-0 text-amber-600" />
            <div>
              <h3 className="text-base font-semibold text-text mb-1">How it works</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Share your recipes instantly! Anyone can scan the QR code to view the full recipe with ingredients and nutrition info.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default QRGenerator;
