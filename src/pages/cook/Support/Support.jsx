import React, { useState, useEffect } from 'react';
import { FiHelpCircle, FiPlus, FiClock, FiCheckCircle, FiAlertCircle, FiMessageSquare, FiX } from 'react-icons/fi';
import { LifeBuoy, Send } from 'lucide-react';
import Layout from '../../../components/layout/Layout/Layout';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { useAuthStore } from '../../../store/authStore';
import { toast } from '../../../store/toastStore';
import { 
  createTicket, 
  getUserTickets, 
  getTicketResponses, 
  addTicketResponse 
} from '../../../services/firebase/ticketService';

const Support = () => {
  const user = useAuthStore((state) => state.user);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [newTicket, setNewTicket] = useState({
    category: '',
    subject: '',
    description: '',
    priority: 'medium',
  });

  const categories = [
    'Meal Generation',
    'Nutritional Analysis',
    'Recipe Recommendation',
    'Menu Sharing',
    'Account & Settings',
    'Feature Request',
    'Bug Report',
    'Other'
  ];

  // Load user tickets
  useEffect(() => {
    const loadTickets = async () => {
      if (!user) return;

      try {
        const userTickets = await getUserTickets(user.uid);
        setTickets(userTickets);
      } catch (error) {
        console.error('Error loading tickets:', error);
        toast.error('Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [user]);

  // Load responses when ticket is selected
  useEffect(() => {
    const loadResponses = async () => {
      if (!selectedTicket) return;

      try {
        const ticketResponses = await getTicketResponses(selectedTicket.id);
        setResponses(ticketResponses);
      } catch (error) {
        console.error('Error loading responses:', error);
        toast.error('Failed to load conversation');
      }
    };

    loadResponses();
  }, [selectedTicket]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'error';
      case 'in-progress': return 'warning';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return FiAlertCircle;
      case 'in-progress': return FiClock;
      case 'resolved': return FiCheckCircle;
      default: return FiHelpCircle;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-text-secondary';
      default: return 'text-text-secondary';
    }
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to submit a ticket');
      return;
    }

    setSubmitting(true);
    try {
      const ticketData = {
        ...newTicket,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email
      };

      await createTicket(ticketData);
      toast.success('Ticket submitted successfully!');
      
      // Reload tickets
      const userTickets = await getUserTickets(user.uid);
      setTickets(userTickets);
      
      // Reset form
      setShowNewTicketForm(false);
      setNewTicket({ category: '', subject: '', description: '', priority: 'medium' });
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast.error('Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;

    try {
      const responseData = {
        from: user.displayName || user.email,
        userId: user.uid,
        message: replyText,
        isSupport: false
      };

      await addTicketResponse(selectedTicket.id, responseData);
      
      // Reload responses
      const ticketResponses = await getTicketResponses(selectedTicket.id);
      setResponses(ticketResponses);
      
      // Reload tickets to update response count
      const userTickets = await getUserTickets(user.uid);
      setTickets(userTickets);
      
      setReplyText('');
      toast.success('Reply sent!');
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading tickets...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <LifeBuoy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text">Support</h1>
                <p className="text-base text-text-secondary">Submit and track your support tickets</p>
              </div>
            </div>
            <Button
              icon={<FiPlus />}
              onClick={() => setShowNewTicketForm(true)}
            >
              New Ticket
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card variant="glass" className="border border-white/50">
            <div className="p-4">
              <div className="text-2xl font-bold text-error mb-1">
                {tickets.filter(t => t.status === 'open').length}
              </div>
              <div className="text-sm text-text-secondary">Open Tickets</div>
            </div>
          </Card>
          <Card variant="glass" className="border border-white/50">
            <div className="p-4">
              <div className="text-2xl font-bold text-warning mb-1">
                {tickets.filter(t => t.status === 'in-progress').length}
              </div>
              <div className="text-sm text-text-secondary">In Progress</div>
            </div>
          </Card>
          <Card variant="glass" className="border border-white/50">
            <div className="p-4">
              <div className="text-2xl font-bold text-success mb-1">
                {tickets.filter(t => t.status === 'resolved').length}
              </div>
              <div className="text-sm text-text-secondary">Resolved</div>
            </div>
          </Card>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-text">Your Tickets</h2>
          
          {tickets.length === 0 ? (
            <Card variant="glass" className="p-12 text-center border border-white/50">
              <LifeBuoy className="w-16 h-16 text-text-tertiary mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-text mb-2">No Tickets Yet</h3>
              <p className="text-text-secondary mb-6">
                Need help? Submit a support ticket and our team will assist you.
              </p>
              <Button
                icon={<FiPlus />}
                onClick={() => setShowNewTicketForm(true)}
              >
                Submit Your First Ticket
              </Button>
            </Card>
          ) : (
            tickets.map((ticket) => {
              const StatusIcon = getStatusIcon(ticket.status);
              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="cursor-pointer"
                >
                  <Card
                    variant="glass"
                    hover
                    className="border border-white/50"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-mono text-text-tertiary">#{ticket.id.slice(0, 8)}</span>
                            <Badge variant={getStatusColor(ticket.status)} size="small">
                              <StatusIcon className="w-3 h-3 mr-1 inline" />
                              {ticket.status}
                            </Badge>
                            <span className={`text-xs font-semibold uppercase ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority} priority
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-text mb-2">{ticket.subject}</h3>
                          <p className="text-sm text-text-secondary mb-3 line-clamp-2">{ticket.description}</p>
                          <div className="flex items-center gap-4 text-xs text-text-tertiary">
                            <span>Category: {ticket.category}</span>
                            <span>•</span>
                            <span>Created: {formatDate(ticket.createdAt)}</span>
                            <span>•</span>
                            <span>Updated: {formatDate(ticket.updatedAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                          <FiMessageSquare className="w-4 h-4" />
                          <span>{ticket.responseCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })
          )}
        </div>

        {/* New Ticket Form Modal */}
        {showNewTicketForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNewTicketForm(false)} />
            
            <Card variant="glass" className="relative w-full max-w-2xl border border-white/50">
              <div className="p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-text">Submit New Ticket</h2>
                  <button
                    onClick={() => setShowNewTicketForm(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitTicket} className="space-y-5">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Category</label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl text-text focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Priority</label>
                    <div className="flex gap-3">
                      {['low', 'medium', 'high'].map((priority) => (
                        <button
                          key={priority}
                          type="button"
                          onClick={() => setNewTicket({ ...newTicket, priority })}
                          className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            newTicket.priority === priority
                              ? 'bg-primary text-white shadow-lg'
                              : 'bg-white/60 text-text-secondary border border-gray-200 hover:bg-white'
                          }`}
                        >
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subject */}
                  <Input
                    label="Subject"
                    type="text"
                    placeholder="Brief description of your issue"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    variant="glass"
                    required
                  />

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Description</label>
                    <textarea
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                      placeholder="Please provide detailed information about your issue..."
                      rows={6}
                      className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl text-text placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      fullWidth
                      onClick={() => setShowNewTicketForm(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      fullWidth
                      icon={<Send className="w-4 h-4" />}
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Ticket'}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        )}

        {/* Ticket Detail Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTicket(null)} />
            
            <Card variant="glass" className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-white/50">
              <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-mono text-text-tertiary">#{selectedTicket.id.slice(0, 8)}</span>
                      <Badge variant={getStatusColor(selectedTicket.status)} size="medium">
                        {selectedTicket.status}
                      </Badge>
                      <span className={`text-xs font-semibold uppercase ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority} priority
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-text mb-2">{selectedTicket.subject}</h2>
                    <p className="text-text-secondary mb-3">{selectedTicket.description}</p>
                    <div className="flex items-center gap-3 text-sm text-text-tertiary">
                      <Badge variant="default" size="small">{selectedTicket.category}</Badge>
                      <span>Created: {formatDate(selectedTicket.createdAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Conversation */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text">Conversation</h3>
                  
                  {responses.length === 0 ? (
                    <div className="text-center py-8 text-text-secondary">
                      <FiMessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No responses yet. Our support team will respond soon.</p>
                    </div>
                  ) : (
                    responses.map((response) => (
                      <div
                        key={response.id}
                        className={`p-4 rounded-xl ${
                          response.isSupport
                            ? 'bg-blue-50 border border-blue-200'
                            : 'bg-white/50 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-semibold ${response.isSupport ? 'text-blue-600' : 'text-text'}`}>
                            {response.from}
                          </span>
                          <span className="text-xs text-text-tertiary">{formatDateTime(response.createdAt)}</span>
                        </div>
                        <p className="text-text-secondary">{response.message}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Reply Form */}
                {selectedTicket.status !== 'resolved' && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Type your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendReply();
                          }
                        }}
                        className="flex-1 px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl text-text placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                      />
                      <Button 
                        icon={<Send className="w-4 h-4" />}
                        onClick={handleSendReply}
                        disabled={!replyText.trim()}
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                )}

                {selectedTicket.status === 'resolved' && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-success">
                      <FiCheckCircle className="w-5 h-5" />
                      <span className="font-medium">This ticket has been resolved</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Support;
