import React, { useState } from 'react';
import { FiDownload, FiShare2, FiCopy, FiCheck } from 'react-icons/fi';
import { Phone, Camera, Circle, Leaf, Star, Lightbulb } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Button from '../../../components/common/Button/Button';
import Card from '../../../components/common/Card/Card';
import Layout from '../../../components/layout/Layout/Layout';

const recipes = [
  { id: 1, name: 'Avocado Toast', icon: Circle },
  { id: 2, name: 'Caesar Salad', icon: Leaf },
  { id: 3, name: 'Beef Steak', icon: Circle },
  { id: 4, name: 'Chocolate Cake', icon: Star },
  { id: 5, name: 'Pancakes', icon: Circle },
];

const QRGenerator = () => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!selectedRecipe) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setQrGenerated(true);
    }, 1000);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                <recipe.icon className="w-6 h-6 text-primary" />
                <span className="flex-1 text-base font-medium text-text">{recipe.name}</span>
                {selectedRecipe?.id === recipe.id && (
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center animate-scale-in">
                    <FiCheck className="text-sm" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* QR Preview */}
        <section className="mb-8 lg:mb-12">
          <Card variant="glass" className="text-center p-8 lg:p-12">
            {qrGenerated ? (
              <div className="animate-fade-in">
                <div className="inline-block p-4 bg-white rounded-lg shadow-md mb-4">
                  <div className="relative w-[180px] h-[180px] bg-white">
                    {/* QR Pattern simulation */}
                    <div className="absolute top-0 left-0 w-10 h-10 border-[8px] border-text rounded-lg" />
                    <div className="absolute top-0 right-0 w-10 h-10 border-[8px] border-text rounded-lg" />
                    <div className="absolute bottom-0 left-0 w-10 h-10 border-[8px] border-text rounded-lg" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="w-12 h-12 bg-primary rounded-md flex items-center justify-center z-10">
                        {selectedRecipe && <selectedRecipe.icon className="w-6 h-6 text-white" />}
                      </span>
                    </div>
                    <div className="absolute inset-[45px] grid grid-cols-7 gap-1">
                      {[...Array(49)].map((_, i) => (
                        <div key={i} className={`bg-text rounded-sm ${Math.random() > 0.3 ? '' : 'opacity-0'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-text mb-1">{selectedRecipe?.name}</h3>
                <p className="text-sm text-text-tertiary mb-6">Scan to view recipe</p>
                
                {/* Share Link */}
                <div className="flex items-center gap-2 bg-black/5 rounded-md px-4 py-2 mb-6">
                  <input 
                    type="text" 
                    value={`chefio.app/r/${selectedRecipe?.id}`}
                    readOnly
                    className="flex-1 bg-transparent border-none text-sm text-text-secondary outline-none"
                  />
                  <button onClick={handleCopy} className="w-8 h-8 flex items-center justify-center bg-white rounded-sm text-text-secondary hover:bg-primary hover:text-white transition-colors">
                    {copied ? <FiCheck /> : <FiCopy />}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" icon={<FiDownload />} className="flex-1">Save Image</Button>
                  <Button icon={<FiShare2 />} className="flex-1">Share</Button>
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
