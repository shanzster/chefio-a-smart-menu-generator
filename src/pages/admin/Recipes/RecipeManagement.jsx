import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiFileText, 
  FiSearch, 
  FiMoreVertical,
  FiTrash2,
  FiEye,
  FiAlertCircle,
  FiUser,
  FiEdit,
  FiPlus
} from 'react-icons/fi';
import { ArrowLeft, ChefHat } from 'lucide-react';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import Modal from '../../../components/common/Modal/Modal';
import { collection, getDocs, deleteDoc, doc, query, orderBy, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { toast } from '../../../store/toastStore';

const RecipeManagement = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [searchQuery, recipes]);

  const loadRecipes = async () => {
    try {
      const q = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'));
      const recipesSnapshot = await getDocs(q);
      const recipesData = [];
      
      recipesSnapshot.forEach((doc) => {
        const data = doc.data();
        // Only include recipes that were created by users (have userId field)
        // Exclude saved recipes from API
        if (data.userId) {
          recipesData.push({ id: doc.id, ...data });
        }
      });

      setRecipes(recipesData);
      setFilteredRecipes(recipesData);
    } catch (error) {
      console.error('Error loading recipes:', error);
      toast.error('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    if (!searchQuery.trim()) {
      setFilteredRecipes(recipes);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = recipes.filter(recipe => 
      recipe.name?.toLowerCase().includes(query) ||
      recipe.category?.toLowerCase().includes(query) ||
      recipe.description?.toLowerCase().includes(query)
    );
    setFilteredRecipes(filtered);
  };

  const handleDeleteRecipe = async () => {
    try {
      await deleteDoc(doc(db, 'recipes', selectedRecipe.id));
      toast.success('Recipe deleted successfully');
      setShowDeleteModal(false);
      setSelectedRecipe(null);
      loadRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
    }
  };

  const confirmDelete = (recipe) => {
    setSelectedRecipe(recipe);
    setShowDeleteModal(true);
    setShowActionsMenu(null);
  };

  const viewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setShowViewModal(true);
    setShowActionsMenu(null);
  };

  const openEditModal = (recipe) => {
    setSelectedRecipe(recipe);
    setFormData({
      name: recipe.name || '',
      description: recipe.description || '',
      category: recipe.category || 'Dinner',
      difficulty: recipe.difficulty || 'Medium',
      prepTime: recipe.prepTime || '',
      servings: recipe.servings || '',
      image: recipe.image || '',
      ingredients: recipe.ingredients || [''],
      instructions: recipe.instructions || [''],
      nutrition: recipe.nutrition || {
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
      }
    });
    setShowEditModal(true);
    setShowActionsMenu(null);
  };

  const handleCreateRecipe = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'recipes'), {
        ...formData,
        userId: 'admin',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Recipe created successfully!');
      setShowCreateModal(false);
      resetForm();
      loadRecipes();
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast.error('Failed to create recipe');
    }
  };

  const handleUpdateRecipe = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'recipes', selectedRecipe.id), {
        ...formData,
        updatedAt: serverTimestamp()
      });
      toast.success('Recipe updated successfully!');
      setShowEditModal(false);
      setSelectedRecipe(null);
      resetForm();
      loadRecipes();
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast.error('Failed to update recipe');
    }
  };

  const resetForm = () => {
    setFormData({
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

  const updateIngredient = (index, value) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }));
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

  const updateInstruction = (index, value) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => i === index ? value : inst)
    }));
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/dashboard')}
              icon={<ArrowLeft />}
            />
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <FiFileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Recipe Management</h1>
              <p className="text-sm text-gray-500">{recipes.length} total recipes</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar and Create Button */}
        <div className="flex gap-4 mb-6">
          <Card className="flex-1 p-4">
            <Input
              placeholder="Search by name, category, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<FiSearch />}
            />
          </Card>
          <Button
            variant="primary"
            icon={<FiPlus />}
            onClick={() => setShowCreateModal(true)}
          >
            Create Recipe
          </Button>
        </div>

        {/* Recipes Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      Loading recipes...
                    </td>
                  </tr>
                ) : filteredRecipes.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No user-created recipes found
                    </td>
                  </tr>
                ) : (
                  filteredRecipes.map((recipe) => (
                    <tr 
                      key={recipe.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => viewRecipe(recipe)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {recipe.image ? (
                            <img 
                              src={recipe.image} 
                              alt={recipe.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                              <ChefHat className="w-6 h-6 text-white" />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {recipe.name || 'Untitled Recipe'}
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-1">
                              {recipe.description || 'No description'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FiUser className="text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {recipe.userId ? recipe.userId.substring(0, 8) + '...' : 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {recipe.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                          recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {recipe.difficulty || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {recipe.servings || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(recipe.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowActionsMenu(showActionsMenu === recipe.id ? null : recipe.id);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <FiMoreVertical />
                        </button>
                        
                        {showActionsMenu === recipe.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                viewRecipe(recipe);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <FiEye className="text-blue-600" />
                              View Details
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(recipe);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <FiEdit className="text-green-600" />
                              Edit Recipe
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDelete(recipe);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <FiTrash2 />
                              Delete Recipe
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Recipe"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4 p-4 bg-red-50 rounded-lg">
            <FiAlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-red-900">Warning: This action cannot be undone</p>
              <p className="text-xs text-red-700">The recipe will be permanently deleted.</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete <strong>{selectedRecipe?.name}</strong>?
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteRecipe}
              fullWidth
              icon={<FiTrash2 />}
            >
              Delete Recipe
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Recipe Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title={selectedRecipe?.name || 'Recipe Details'}
      >
        <div className="p-6 space-y-4">
          {selectedRecipe?.image && (
            <img 
              src={selectedRecipe.image} 
              alt={selectedRecipe.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Description</h3>
            <p className="text-sm text-gray-600">{selectedRecipe?.description || 'No description'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Category</h3>
              <p className="text-sm text-gray-600">{selectedRecipe?.category || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Difficulty</h3>
              <p className="text-sm text-gray-600">{selectedRecipe?.difficulty || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Prep Time</h3>
              <p className="text-sm text-gray-600">{selectedRecipe?.prepTime || 'N/A'} mins</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Servings</h3>
              <p className="text-sm text-gray-600">{selectedRecipe?.servings || 'N/A'}</p>
            </div>
          </div>

          {selectedRecipe?.ingredients && selectedRecipe.ingredients.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Ingredients</h3>
              <ul className="space-y-1">
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedRecipe?.instructions && selectedRecipe.instructions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Instructions</h3>
              <ol className="space-y-2">
                {selectedRecipe.instructions.map((instruction, index) => (
                  <li key={index} className="text-sm text-gray-600 flex gap-2">
                    <span className="font-semibold text-orange-500">{index + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {selectedRecipe?.nutrition && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Nutrition (per serving)</h3>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-orange-50 p-2 rounded text-center">
                  <div className="text-lg font-bold text-orange-600">{selectedRecipe.nutrition.calories || 0}</div>
                  <div className="text-xs text-gray-600">Calories</div>
                </div>
                <div className="bg-blue-50 p-2 rounded text-center">
                  <div className="text-lg font-bold text-blue-600">{selectedRecipe.nutrition.protein || 0}g</div>
                  <div className="text-xs text-gray-600">Protein</div>
                </div>
                <div className="bg-green-50 p-2 rounded text-center">
                  <div className="text-lg font-bold text-green-600">{selectedRecipe.nutrition.carbs || 0}g</div>
                  <div className="text-xs text-gray-600">Carbs</div>
                </div>
                <div className="bg-purple-50 p-2 rounded text-center">
                  <div className="text-lg font-bold text-purple-600">{selectedRecipe.nutrition.fat || 0}g</div>
                  <div className="text-xs text-gray-600">Fat</div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button
              variant="outline"
              onClick={() => setShowViewModal(false)}
              fullWidth
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Recipe Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Recipe"
      >
        <form onSubmit={handleCreateRecipe} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <Input
            label="Recipe Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Spaghetti Carbonara"
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your recipe..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snacks">Snacks</option>
                <option value="Desserts">Desserts</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Prep Time (minutes)"
              type="number"
              value={formData.prepTime}
              onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
              placeholder="30"
              required
            />
            <Input
              label="Servings"
              type="number"
              value={formData.servings}
              onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
              placeholder="4"
              required
            />
          </div>

          <Input
            label="Image URL"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://..."
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Ingredients</label>
              <button type="button" onClick={addIngredient} className="text-sm text-blue-600 hover:text-blue-700">
                + Add
              </button>
            </div>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  placeholder={`Ingredient ${index + 1}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Instructions</label>
              <button type="button" onClick={addInstruction} className="text-sm text-blue-600 hover:text-blue-700">
                + Add
              </button>
            </div>
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <textarea
                  value={instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  placeholder={`Step ${index + 1}`}
                  rows={2}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              icon={<FiPlus />}
            >
              Create Recipe
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Recipe Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Recipe"
      >
        <form onSubmit={handleUpdateRecipe} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <Input
            label="Recipe Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Spaghetti Carbonara"
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your recipe..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snacks">Snacks</option>
                <option value="Desserts">Desserts</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Prep Time (minutes)"
              type="number"
              value={formData.prepTime}
              onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
              placeholder="30"
              required
            />
            <Input
              label="Servings"
              type="number"
              value={formData.servings}
              onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
              placeholder="4"
              required
            />
          </div>

          <Input
            label="Image URL"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://..."
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Ingredients</label>
              <button type="button" onClick={addIngredient} className="text-sm text-blue-600 hover:text-blue-700">
                + Add
              </button>
            </div>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  placeholder={`Ingredient ${index + 1}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Instructions</label>
              <button type="button" onClick={addInstruction} className="text-sm text-blue-600 hover:text-blue-700">
                + Add
              </button>
            </div>
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <textarea
                  value={instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  placeholder={`Step ${index + 1}`}
                  rows={2}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              icon={<FiEdit />}
            >
              Update Recipe
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RecipeManagement;
