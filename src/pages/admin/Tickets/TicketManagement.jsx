import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiMessageSquare, 
  FiSend,
  FiClock,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import { ArrowLeft } from 'lucide-react';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import Modal from '../../../components/common/Modal/Modal';
import { getAllTickets, respondToTicket } from '../../../services/firebase/adminService';
import { toast } from '../../../store/toastStore';

const TicketManagement = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [response, setResponse] = useState('');
  const [newStatus, setNewStatus] = useState('in-progress');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTickets();
  }, [filter]);

  const loadTickets = async () => {
    try {
      const filterStatus = filter === 'all' ? null : filter;
      const data = await getAllTickets(filterStatus);
      setTickets(data);
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = (ticket) => {
    setSelectedTicket(ticket);
    setResponse('');
    setNewStatus(ticket.status === 'open' ? 'in-progress' : ticket.status);
    setShowResponseModal(true);
  };

  const submitResponse = async () => {
    if (!response.trim()) {
      toast.error('Please enter a response');
      return;
    }

    try {
      await respondToTicket(selectedTicket.id, {
        message: response,
        status: newStatus
      });
      toast.success('Response sent successfully');
      setShowResponseModal(false);
      setSelectedTicket(null);
      setResponse('');
      loadTickets();
    } catch (error) {
      toast.error('Failed to send response');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <FiAlertCircle className="text-red-500" />;
      case 'in-progress':
        return <FiClock className="text-yellow-500" />;
      case 'resolved':
        return <FiCheckCircle className="text-green-500" />;
      default:
        return <FiMessageSquare className="text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-red-100 text-red-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[priority] || 'bg-gray-100 text-gray-800'}`}>
        {priority?.toUpperCase() || 'MEDIUM'}
      </span>
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
            <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
              <FiMessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
              <p className="text-sm text-gray-500">{tickets.length} total tickets</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <Card className="p-4 mb-6">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilter('all')}
              size="small"
            >
              All
            </Button>
            <Button
              variant={filter === 'open' ? 'primary' : 'outline'}
              onClick={() => setFilter('open')}
              size="small"
            >
              Open
            </Button>
            <Button
              variant={filter === 'in-progress' ? 'primary' : 'outline'}
              onClick={() => setFilter('in-progress')}
              size="small"
            >
              In Progress
            </Button>
            <Button
              variant={filter === 'resolved' ? 'primary' : 'outline'}
              onClick={() => setFilter('resolved')}
              size="small"
            >
              Resolved
            </Button>
          </div>
        </Card>

        {/* Tickets List */}
        <div className="space-y-4">
          {loading ? (
            <Card className="p-8 text-center text-gray-500">
              Loading tickets...
            </Card>
          ) : tickets.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              No tickets found
            </Card>
          ) : (
            tickets.map((ticket) => (
              <Card key={ticket.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {ticket.subject}
                      </h3>
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{ticket.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Category: {ticket.category}</span>
                      <span>•</span>
                      <span>Created: {ticket.createdAt ? new Date(ticket.createdAt.seconds * 1000).toLocaleString() : 'N/A'}</span>
                      {ticket.assignedTo && (
                        <>
                          <span>•</span>
                          <span>Assigned</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRespond(ticket)}
                    icon={<FiSend />}
                    size="small"
                  >
                    Respond
                  </Button>
                </div>

                {/* Previous Responses */}
                {ticket.responses && ticket.responses.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Responses ({ticket.responses.length}):</p>
                    <div className="space-y-2">
                      {ticket.responses.map((resp, idx) => (
                        <div key={idx} className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-blue-900">{resp.adminName}</span>
                            <span className="text-xs text-blue-600">
                              {resp.timestamp ? new Date(resp.timestamp.seconds * 1000).toLocaleString() : 'Just now'}
                            </span>
                          </div>
                          <p className="text-sm text-blue-800">{resp.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Response Modal */}
      <Modal
        isOpen={showResponseModal}
        onClose={() => setShowResponseModal(false)}
        title={`Respond to: ${selectedTicket?.subject}`}
      >
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response Message
            </label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Type your response here..."
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowResponseModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              onClick={submitResponse}
              fullWidth
              icon={<FiSend />}
            >
              Send Response
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TicketManagement;
