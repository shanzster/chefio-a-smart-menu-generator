import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiMessageSquare, 
  FiSearch, 
  FiMoreVertical,
  FiTrash2,
  FiEye,
  FiAlertCircle,
  FiUser,
  FiStar,
  FiAlertTriangle,
  FiFilter,
  FiCheckSquare,
  FiSquare
} from 'react-icons/fi';
import { ArrowLeft } from 'lucide-react';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import Badge from '../../../components/common/Badge/Badge';
import Modal from '../../../components/common/Modal/Modal';
import { getAllFeedback, deleteFeedback, bulkDeleteFeedback } from '../../../services/firebase/adminService';
import { toast } from '../../../store/toastStore';
import { 
  containsProfanity, 
  getProfaneWords, 
  getProfanitySeverity,
  highlightProfanity 
} from '../../../utils/profanityFilter';
import '../../../styles/profanity.css';

const FeedbackManagement = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [filterRating, setFilterRating] = useState('all');
  const [filterProfanity, setFilterProfanity] = useState('all'); // 'all', 'clean', 'profane'
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  useEffect(() => {
    loadFeedback();
  }, []);

  useEffect(() => {
    filterFeedbackList();
  }, [searchQuery, feedback, filterRating, filterProfanity]);

  const loadFeedback = async () => {
    setLoading(true);
    try {
      console.log('🔍 [FEEDBACK] Starting to load all feedback...');
      const feedbackData = await getAllFeedback();
      console.log('✅ [FEEDBACK] Loaded feedback:', feedbackData.length, 'items');
      setFeedback(feedbackData);
      setFilteredFeedback(feedbackData);
    } catch (error) {
      console.error('❌ [FEEDBACK] Error loading feedback:', error);
      toast.error(`Failed to load feedback: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filterFeedbackList = () => {
    let filtered = feedback;

    // Filter by rating
    if (filterRating !== 'all') {
      filtered = filtered.filter(f => f.rating === parseInt(filterRating));
    }

    // Filter by profanity
    if (filterProfanity === 'profane') {
      filtered = filtered.filter(f => containsProfanity(f.comment));
    } else if (filterProfanity === 'clean') {
      filtered = filtered.filter(f => !containsProfanity(f.comment));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(f => 
        f.comment?.toLowerCase().includes(query) ||
        f.recipeName?.toLowerCase().includes(query) ||
        f.userName?.toLowerCase().includes(query) ||
        f.userId?.toLowerCase().includes(query)
      );
    }

    setFilteredFeedback(filtered);
  };

  const handleDeleteFeedback = async () => {
    try {
      await deleteFeedback(selectedFeedback.id, selectedFeedback.collectionPath);
      toast.success('Feedback deleted successfully');
      setShowDeleteModal(false);
      setSelectedFeedback(null);
      loadFeedback();
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('Failed to delete feedback');
    }
  };

  const handleBulkDelete = async () => {
    try {
      const itemsToDelete = feedback.filter(f => selectedItems.includes(f.id));
      await bulkDeleteFeedback(itemsToDelete);
      toast.success(`${selectedItems.length} feedback items deleted successfully`);
      setShowBulkDeleteModal(false);
      setSelectedItems([]);
      loadFeedback();
    } catch (error) {
      console.error('Error bulk deleting feedback:', error);
      toast.error('Failed to delete feedback');
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredFeedback.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredFeedback.map(f => f.id));
    }
  };

  const confirmDelete = (feedbackItem) => {
    setSelectedFeedback(feedbackItem);
    setShowDeleteModal(true);
    setShowActionsMenu(null);
  };

  const viewFeedback = (feedbackItem) => {
    setSelectedFeedback(feedbackItem);
    setShowViewModal(true);
    setShowActionsMenu(null);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
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
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <FiMessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Feedback Management</h1>
              <p className="text-sm text-gray-500">{feedback.length} total feedback entries</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Feedback</p>
                <p className="text-2xl font-bold text-gray-900">{feedback.length}</p>
              </div>
              <FiMessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">With Profanity</p>
                <p className="text-2xl font-bold text-red-600">
                  {feedback.filter(f => containsProfanity(f.comment)).length}
                </p>
              </div>
              <FiAlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {feedback.length > 0 
                    ? (feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
              <FiStar className="w-8 h-8 text-yellow-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Selected</p>
                <p className="text-2xl font-bold text-purple-600">{selectedItems.length}</p>
              </div>
              <FiCheckSquare className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <Card className="flex-1 min-w-[300px] p-4">
            <Input
              placeholder="Search by comment, recipe, or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<FiSearch />}
            />
          </Card>
          <Card className="p-4">
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-4 py-2 border-0 bg-transparent focus:ring-0 text-gray-700 cursor-pointer"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </Card>
          <Card className="p-4">
            <select
              value={filterProfanity}
              onChange={(e) => setFilterProfanity(e.target.value)}
              className="px-4 py-2 border-0 bg-transparent focus:ring-0 text-gray-700 cursor-pointer"
            >
              <option value="all">All Content</option>
              <option value="profane">⚠️ With Profanity</option>
              <option value="clean">✓ Clean Only</option>
            </select>
          </Card>
          {selectedItems.length > 0 && (
            <Button
              variant="danger"
              icon={<FiTrash2 />}
              onClick={() => setShowBulkDeleteModal(true)}
            >
              Delete Selected ({selectedItems.length})
            </Button>
          )}
        </div>

        {/* Feedback Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={toggleSelectAll}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {selectedItems.length === filteredFeedback.length && filteredFeedback.length > 0 ? (
                        <FiCheckSquare className="w-5 h-5" />
                      ) : (
                        <FiSquare className="w-5 h-5" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      Loading feedback...
                    </td>
                  </tr>
                ) : filteredFeedback.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      No feedback found
                    </td>
                  </tr>
                ) : (
                  filteredFeedback.map((item) => {
                    const hasProfanity = containsProfanity(item.comment);
                    const profanityLevel = getProfanitySeverity(item.comment);
                    
                    return (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-gray-50 cursor-pointer ${hasProfanity ? 'bg-red-50/30' : ''}`}
                        onClick={() => viewFeedback(item)}
                      >
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => toggleSelectItem(item.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {selectedItems.includes(item.id) ? (
                              <FiCheckSquare className="w-5 h-5 text-purple-600" />
                            ) : (
                              <FiSquare className="w-5 h-5" />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {item.recipeName || 'Unknown Recipe'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStars(item.rating || 0)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-2">
                            {hasProfanity && (
                              <FiAlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-1" />
                            )}
                            <div className="text-sm text-gray-600 line-clamp-2 max-w-md">
                              {item.comment || 'No comment'}
                            </div>
                          </div>
                          {hasProfanity && (
                            <Badge 
                              variant="danger" 
                              size="small" 
                              className="mt-1"
                            >
                              {profanityLevel} profanity
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FiUser className="text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {item.userName || (item.userId ? item.userId.substring(0, 8) + '...' : 'Anonymous')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant={item.source === 'qr_code' ? 'secondary' : 'primary'}
                            size="small"
                          >
                            {item.source === 'qr_code' ? 'QR Code' : 'Recipe'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowActionsMenu(showActionsMenu === item.id ? null : item.id);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <FiMoreVertical />
                          </button>
                          
                          {showActionsMenu === item.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewFeedback(item);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <FiEye className="text-blue-600" />
                                View Details
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  confirmDelete(item);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <FiTrash2 />
                                Delete Feedback
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
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
        title="Delete Feedback"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4 p-4 bg-red-50 rounded-lg">
            <FiAlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-red-900">Warning: This action cannot be undone</p>
              <p className="text-xs text-red-700">The feedback will be permanently deleted.</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete this feedback?
          </p>

          {selectedFeedback?.comment && (
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-gray-600 italic">"{selectedFeedback.comment}"</p>
            </div>
          )}

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
              onClick={handleDeleteFeedback}
              fullWidth
              icon={<FiTrash2 />}
            >
              Delete Feedback
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Feedback Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Feedback Details"
      >
        <div className="p-6 space-y-4">
          {selectedFeedback && containsProfanity(selectedFeedback.comment) && (
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
              <FiAlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-900">Profanity Detected</p>
                <p className="text-xs text-red-700">
                  This feedback contains inappropriate language: {getProfaneWords(selectedFeedback.comment).join(', ')}
                </p>
                <Badge variant="danger" size="small" className="mt-1">
                  {getProfanitySeverity(selectedFeedback.comment)} severity
                </Badge>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Recipe</h3>
            <p className="text-base text-gray-900">{selectedFeedback?.recipeName || 'Unknown Recipe'}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Rating</h3>
            <div className="flex items-center gap-2">
              {renderStars(selectedFeedback?.rating || 0)}
              <span className="text-sm text-gray-600">
                ({selectedFeedback?.rating || 0} out of 5)
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Comment</h3>
            <div className={`p-4 rounded-lg ${containsProfanity(selectedFeedback?.comment) ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
              <div 
                className="text-sm text-gray-700 whitespace-pre-wrap profanity-container"
                dangerouslySetInnerHTML={{ 
                  __html: highlightProfanity(selectedFeedback?.comment || 'No comment provided')
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">User</h3>
              <p className="text-sm text-gray-600 break-all">
                {selectedFeedback?.userName || (selectedFeedback?.userId || 'Anonymous')}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Date</h3>
              <p className="text-sm text-gray-600">
                {formatDate(selectedFeedback?.createdAt)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Source</h3>
              <Badge 
                variant={selectedFeedback?.source === 'qr_code' ? 'secondary' : 'primary'}
              >
                {selectedFeedback?.source === 'qr_code' ? 'QR Code' : 'Recipe'}
              </Badge>
            </div>
            {selectedFeedback?.recipeId && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Recipe ID</h3>
                <p className="text-xs text-gray-600 break-all">
                  {selectedFeedback.recipeId}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowViewModal(false)}
              fullWidth
            >
              Close
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setShowViewModal(false);
                confirmDelete(selectedFeedback);
              }}
              icon={<FiTrash2 />}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Delete Modal */}
      <Modal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        title="Bulk Delete Feedback"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4 p-4 bg-red-50 rounded-lg">
            <FiAlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-red-900">Warning: This action cannot be undone</p>
              <p className="text-xs text-red-700">
                {selectedItems.length} feedback items will be permanently deleted.
              </p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete {selectedItems.length} feedback items?
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowBulkDeleteModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleBulkDelete}
              fullWidth
              icon={<FiTrash2 />}
            >
              Delete {selectedItems.length} Items
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FeedbackManagement;
