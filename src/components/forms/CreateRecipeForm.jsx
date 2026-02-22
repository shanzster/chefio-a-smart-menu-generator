import React, { useState } from 'react';
import { FiPlus, FiX, FiUpload, FiImage } from 'react-icons/fi';
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';
import Badge from '../common/Badge/Badge';
import { uploadImageToCloudinary, validateImageFile } from '../../services/cloudinary/imageUpload';
import { toast } from '../../store/toastStore';

const CreateRecipeForm = ({ onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Dinner',
    difficulty: 'Medium',
    prepTime: '',
    servings: '',
    image: '',
    ingredients: [''],
    instructions: [''],
    nutrition: {
      calories: '',
      protein: '',
      carbs: '',
      fat: ''
    }
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setUploadingImage(true);
    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const imageUrl = await uploadImageToCloudinary(file, 'chefio/recipes');
      setFormData(prev => ({ ...prev, image: imageUrl }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setImagePreview(null);
  };

  const handleNutritionChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      nutrition: { ...prev.nutrition, [name]: value }
    }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData(prev => ({ ...prev, instructions: newInstructions }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeInstruction = (index) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty ingredients and instructions
    const cleanedData = {
      ...formData,
      prepTime: parseInt(formData.prepTime) || 0,
      servings: parseInt(formData.servings) || 1,
      ingredients: formData.ingredients.filter(i => i.trim() !== ''),
      instructions: formData.instructions.filter(i => i.trim() !== ''),
      nutrition: {
        calories: parseInt(formData.nutrition.calories) || 0,
        protein: parseInt(formData.nutrition.protein) || 0,
        carbs: parseInt(formData.nutrition.carbs) || 0,
        fat: parseInt(formData.nutrition.fat) || 0
      }
    };

    onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text">Basic Information</h3>
        
        <Input
          label="Recipe Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Spaghetti Carbonara"
          required
        />

        <div>
          <label className="block text-sm font-medium text-text mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your recipe..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">Recipe Image</label>
          
          {!imagePreview && !formData.image ? (
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="recipe-image-upload"
                disabled={uploadingImage}
              />
              <label
                htmlFor="recipe-image-upload"
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all ${
                  uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {uploadingImage ? (
                  <div className="text-center">
                    <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                    <p className="text-sm text-text-secondary">Uploading image...</p>
                  </div>
                ) : (
                  <>
                    <FiUpload className="w-10 h-10 text-text-tertiary mb-3" />
                    <p className="text-sm font-medium text-text mb-1">Click to upload recipe image</p>
                    <p className="text-xs text-text-tertiary">PNG, JPG, GIF or WebP (max 5MB)</p>
                  </>
                )}
              </label>
            </div>
          ) : (
            <div className="relative">
              <img
                src={imagePreview || formData.image}
                alt="Recipe preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 w-8 h-8 bg-error text-white rounded-full flex items-center justify-center hover:bg-error-dark transition-colors shadow-lg"
              >
                <FiX />
              </button>
              <div className="absolute bottom-2 left-2 bg-success text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <FiImage className="w-3 h-3" />
                Image uploaded
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Prep Time (minutes)"
            name="prepTime"
            type="number"
            value={formData.prepTime}
            onChange={handleChange}
            placeholder="30"
            required
          />

          <Input
            label="Servings"
            name="servings"
            type="number"
            value={formData.servings}
            onChange={handleChange}
            placeholder="4"
            required
          />
        </div>
      </div>

      {/* Nutrition */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text">Nutrition (per serving)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Input
            label="Calories"
            name="calories"
            type="number"
            value={formData.nutrition.calories}
            onChange={handleNutritionChange}
            placeholder="250"
          />
          <Input
            label="Protein (g)"
            name="protein"
            type="number"
            value={formData.nutrition.protein}
            onChange={handleNutritionChange}
            placeholder="15"
          />
          <Input
            label="Carbs (g)"
            name="carbs"
            type="number"
            value={formData.nutrition.carbs}
            onChange={handleNutritionChange}
            placeholder="30"
          />
          <Input
            label="Fat (g)"
            name="fat"
            type="number"
            value={formData.nutrition.fat}
            onChange={handleNutritionChange}
            placeholder="10"
          />
        </div>
      </div>

      {/* Ingredients */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text">Ingredients</h3>
          <Button
            type="button"
            variant="secondary"
            size="small"
            icon={<FiPlus />}
            onClick={addIngredient}
          >
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                placeholder={`Ingredient ${index + 1}`}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              {formData.ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors"
                >
                  <FiX />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text">Instructions</h3>
          <Button
            type="button"
            variant="secondary"
            size="small"
            icon={<FiPlus />}
            onClick={addInstruction}
          >
            Add Step
          </Button>
        </div>
        <div className="space-y-3">
          {formData.instructions.map((instruction, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold mt-2">
                {index + 1}
              </div>
              <textarea
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                rows={2}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              />
              {formData.instructions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors"
                >
                  <FiX />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          disabled={isLoading || uploadingImage}
        >
          {isLoading ? 'Creating...' : 'Create Recipe'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading || uploadingImage}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CreateRecipeForm;
