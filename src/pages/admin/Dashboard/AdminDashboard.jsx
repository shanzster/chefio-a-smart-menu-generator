import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUsers, 
  FiFileText, 
  FiAlertCircle, 
  FiMessageSquare,
  FiTrendingUp,
  FiActivity
} from 'react-icons/fi';
import { Shield, LogOut } from 'lucide-react';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import { useAuthStore } from '../../../store/authStore';
import { getSystemAnalytics } from '../../../services/firebase/adminService';
import { toast } from '../../../store/toastStore';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await getSystemAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const stats = [
    {
      title: 'Total Users',
      value: analytics?.totalUsers || 0,
      icon: <FiUsers />,
      color: 'bg-blue-500',
      link: '/admin/users'
    },
    {
      title: 'Total Recipes',
      value: analytics?.totalRecipes || 0,
      icon: <FiFileText />,
      color: 'bg-green-500',
      link: '/admin/recipes'
    },
    {
      title: 'Open Tickets',
      value: analytics?.openTickets || 0,
      icon: <FiMessageSquare />,
      color: 'bg-yellow-500',
      link: '/admin/tickets'
    },
    {
      title: 'Total Feedback',
      value: analytics?.totalFeedback || 0,
      icon: <FiTrendingUp />,
      color: 'bg-purple-500',
      link: '/admin/feedback'
    },
    {
      title: 'All Tickets',
      value: analytics?.totalTickets || 0,
      icon: <FiActivity />,
      color: 'bg-indigo-500',
      link: '/admin/tickets'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.displayName || 'Admin'}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              icon={<LogOut />}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className={`p-6 transition-shadow ${stat.link ? 'hover:shadow-lg cursor-pointer' : ''}`}
              onClick={() => stat.link && navigate(stat.link)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{loading ? '...' : stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              fullWidth
              onClick={() => navigate('/admin/users')}
              icon={<FiUsers />}
            >
              Manage Users
            </Button>
            <Button
              fullWidth
              onClick={() => navigate('/admin/tickets')}
              icon={<FiMessageSquare />}
              variant="secondary"
            >
              View Tickets
            </Button>
            <Button
              fullWidth
              onClick={() => navigate('/admin/feedback')}
              icon={<FiTrendingUp />}
              variant="outline"
            >
              View Feedback
            </Button>
            <Button
              fullWidth
              onClick={() => navigate('/admin/api-config')}
              icon={<FiActivity />}
              variant="outline"
            >
              API Configuration
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-700">System Status</span>
              <span className="text-sm font-semibold text-green-600">● Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-700">Database</span>
              <span className="text-sm font-semibold text-blue-600">● Connected</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-sm text-gray-700">Last Update</span>
              <span className="text-sm font-semibold text-purple-600">
                {analytics?.timestamp ? new Date(analytics.timestamp).toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
