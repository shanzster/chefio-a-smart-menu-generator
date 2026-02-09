import React, { useState } from 'react';
import { FiHelpCircle, FiPlus, FiClock, FiCheckCircle, FiAlertCircle, FiMessageSquare, FiX } from 'react-icons/fi';
import { LifeBuoy, Send } from 'lucide-react';
import Layout from '../../../components/layout/Layout/Layout';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';

const Support = () => {
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newTicket, setNewTicket] = useState({
    category: '',
    subject: '',
    description: '',
    priority: 'medium',
  });

  // Mock ticket data
  const tickets = [
    {
      id: 'TKT-001',
      subject: 'Unable to generate QR code',
      category: 'Menu Sharing',
      description: 'When I try to generate a QR code for my recipe, the system shows an error message.',
      status: 'open',
      priority: 'high',
      createdAt: '2026-02-03',
      updatedAt: '2026-02-03',
      responses: [
        {
          id: 1,
          from: 'Support Team',
          message: 'Thank you for reporting this issue. We are investigating the QR code generation problem. Could you please provide the recipe name you were trying to share?',
          timestamp: '2026-02-03 14:30',
          isSupport: true,
        }
      ]
    },
    {
      id: 'TKT-002',
      subject: 'Nutrition calculation seems incorrect',
      category: 'Nutritional Analysis',
      description: 'The calorie count for my pasta recipe seems too high. Can you verify the calculation?',
      status: 'in-progress',
      priority: 'medium',
      createdAt: '2026-02-02',
      updatedAt: '2026-02-03',
      responses: [
        {
          id: 1,
          from: 'Support Team',
          message: 'We have reviewed your recipe and the nutritional calculations. The values are based on standard ingredient databases. However, we will double-check the pasta serving size calculation.',
          timestamp: '2026-02-02 16:45',
          isSupport: true,
        },
        {
          id: 2,
          from: 'You',
          message: 'Thank you! I used 400g of pasta for 4 servings.',
          timestamp: '2026-02-03 09:15',
          isSupport: false,
        },
        {
          id: 3,
          from: 'Support Team',
          message: 'Thank you for the details. The calculation is correct - 400g of dry pasta is approximately 1400 calories. When divided by 4 servings, that\'s 350 calories just from the pasta. We\'ll update our system to show a breakdown by ingredient to make this clearer.',
          timestamp: '2026-02-03 11:20',
          isSupport: true,
        }
      ]
    },
    {
      id: 'TKT-003',
      subject: 'Feature request: Meal planning',
      category: 'Feature Request',
      description: 'It would be great to have a weekly meal planning feature where I can schedule recipes for the week.',
      status: 'resolved',
      priority: 'low',
      createdAt: '2026-01-28',
      updatedAt: '2026-02-01',
      responses: [
        {
          id: 1,
          from: 'Support Team',
          message: 'Thank you for your suggestion! We have added this to our feature roadmap. Meal planning is something we are actively working on and hope to release in the next quarter.',
          timestamp: '2026-02-01 10:00',
          isSupport: true,
        }
      ]
    },
  ];

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

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    // Handle ticket submission
    console.log('New ticket:', newTicket);
    setShowNewTicketForm(false);
    setNewTicket({ category: '', subject: '', description: '', priority: 'medium' });
  };

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
          {tickets.map((ticket) => {
            const StatusIcon = getStatusIcon(ticket.status);
            return (
              <Card
                key={ticket.id}
                variant="glass"
                hover
                className="border border-white/50 cursor-pointer"
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono text-text-tertiary">{ticket.id}</span>
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
                        <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <FiMessageSquare className="w-4 h-4" />
                      <span>{ticket.responses.length}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
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
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      fullWidth
                      icon={<Send className="w-4 h-4" />}
                    >
                      Submit Ticket
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
                      <span className="text-sm font-mono text-text-tertiary">{selectedTicket.id}</span>
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
                      <span>Created: {new Date(selectedTicket.createdAt).toLocaleDateString()}</span>
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
                  {selectedTicket.responses.map((response) => (
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
                        <span className="text-xs text-text-tertiary">{response.timestamp}</span>
                      </div>
                      <p className="text-text-secondary">{response.message}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                {selectedTicket.status !== 'resolved' && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Type your reply..."
                        className="flex-1 px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl text-text placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                      />
                      <Button icon={<Send className="w-4 h-4" />}>
                        Send
                      </Button>
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
