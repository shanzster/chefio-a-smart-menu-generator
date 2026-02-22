import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiAlertCircle, 
  FiCheck,
  FiTrash2,
  FiEye
} from 'react-icons/fi';
import { ArrowLeft, Flag } from 'lucide-react';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import Modal from '../../../components/common/Modal/Modal';
import { getFlaggedRecipes, moderateRecipe } from '../../../services/firebase/adminService';
import { toast } from '../../../store/toastStore';

const ContentModeration = () => {
  const navigate = useNavigate();
  const [flaggedRecipes, setFlaggedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadFlaggedRecipes();
  }, []);

  const loadFlaggedRecipes = async () => {
    try {
      const data = await getFlaggedRecipes();
      setFlaggedRecipes(data);
    } catch (error) {
      console.error('Error loading flagged recipes:', error);
      toast.error('Failed to load flagged content');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (recipe) => {
    setSelectedRecipe(recipe);
    setShowPreviewModal(true);
  };

  const handleApprove = async (recipeId) => {
    try {
      await moderateRecipe(recipeId, 'approve');
      toast.success('Recipe approved');
      loadFlaggedRecipes();
    } catch (error) {
      toast.error('Failed to approve recipe');
    }
  };

  const confirmDelete = (recipe) => {
    setSelectedRecipe(recipe);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await moderateRecipe(selectedRecipe.id, 'delete');
      toast.success('Recipe deleted');
      setShowDeleteModal(false);
      setSelectedRecipe(null);
      loadFlaggedRecipes();
    } catch (error) {
      toast.error('Failed to delete recipe');
    }
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
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <FiAlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
              <p className="text-sm text-gray-500">{flaggedRecipes.length} flagged items</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <Card className="p-8 text-center text-gray-500">
            Loading flagged content...
          </Card>
        ) : flaggedRecipes.length === 0 ? (
          <Card className="p-8 text-center">
            <FiCheck className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">All Clear!</h3>
            <p className="text-gray-500">No flagged content at this time</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flaggedRecipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Recipe Image */}
                {recipe.image && (
                  <div className="relative h-48 bg-gray-200">
                    <img 
                      src={recipe.image} 
                      alt={recipe.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                        <Flag className="w-3 h-3" />
                        Flagged
                      </span>
                    </div>
                  </div>
                )}

                {/* Recipe Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                    {recipe.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {recipe.description}
                  </p>

                  {/* Flag Reason */}
                  {recipe.flagReason && (
                    <div className="mb-3 p-2 bg-red-50 rounded-lg">
                      <p className="text-xs font-semibold text-red-900 mb-1">Reason:</p>
                      <p className="text-xs text-red-700">{recipe.flagReason}</p>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="text-xs text-gray-500 mb-4 space-y-1">
                    <p>Flagged: {recipe.flaggedAt ? new Date(recipe.flaggedAt.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
                    <p>Category: {recipe.category}</p>
                    <p>Servings: {recipe.servings}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => handlePreview(recipe)}
                      icon={<FiEye />}
                      fullWidth
                    >
                      View
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleApprove(recipe.id)}
                      icon={<FiCheck />}
                      fullWidth
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => confirmDelete(recipe)}
                      icon={<FiTrash2 />}
                      fullWidth
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title={selectedRecipe?.name}
      >
        <div className="p-6">
          {selectedRecipe?.image && (
            <img 
              src={selectedRecipe.image} 
              alt={selectedRecipe.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          )}

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600">{selectedRecipe?.description}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Ingredients</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {selectedRecipe?.ingredients?.map((ing, idx) => (
                <li key={idx}>{ing.original || `${ing.amount} ${ing.unit} ${ing.name}`}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Instructions</h3>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
              {selectedRecipe?.instructions?.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>

          {selectedRecipe?.flagReason && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xs font-semibold text-red-900 mb-1">Flag Reason:</p>
              <p className="text-sm text-red-700">{selectedRecipe.flagReason}</p>
            </div>
          )}
        </div>
      </Modal>

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
              onClick={handleDelete}
              fullWidth
              icon={<FiTrash2 />}
            >
              Delete Recipe
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContentModeration;
