import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, UserPlus, Calendar, Trash2, AlertTriangle, Check, X } from 'lucide-react';
import "../styles/Assignadmin.css";

// Mock data for demonstration
const mockUsers = [
  {
    id: 1,
    username: 'admin@company.com',
    role: 'Super Admin',
    status: 'active',
    createdAt: '2023-01-15',
    lastLogin: '2024-08-24'
  },
  {
    id: 2,
    username: 'editor.john@university.edu',
    role: 'Editor Admin',
    status: 'active',
    createdAt: '2023-03-22',
    lastLogin: '2024-08-23'
  },
  {
    id: 3,
    username: 'content.manager@organization.org',
    role: 'Content Admin',
    status: 'active',
    createdAt: '2023-05-10',
    lastLogin: '2024-08-20'
  }
];

const Assignadmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [toast, setToast] = useState(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.username.trim()) {
      errors.username = 'Email is required';
    } else if (!emailRegex.test(formData.username)) {
      errors.username = 'Please enter a valid email address';
    } else if (users.some(user => user.username.toLowerCase() === formData.username.toLowerCase())) {
      errors.username = 'Email already exists';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newUser = {
        id: users.length + 1,
        username: formData.username,
        role: 'Editor Admin',
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: 'Never'
      };

      setUsers(prev => [...prev, newUser]);
      setFormData({ username: '', password: '' });
      setIsSubmitting(false);
      showToast('Admin user created successfully!');
    }, 1000);
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({ username: '', password: '' });
    setFormErrors({});
  };

  // Handle user actions
  const handleDeleteUser = (userId) => {
    setConfirmAction({
      type: 'delete',
      userId,
      message: 'Are you sure you want to delete this admin user? This action cannot be undone.'
    });
    setShowConfirmModal(true);
  };

  // Execute confirmed action
  const executeConfirmedAction = () => {
    if (confirmAction.type === 'delete') {
      setUsers(prev => prev.filter(user => user.id !== confirmAction.userId));
      showToast('Admin user deleted successfully!');
    }
    
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  // Get user initials for avatar
  const getUserInitials = (email) => {
    return email.slice(0, 2).toUpperCase();
  };

  // Format date
  const formatDate = (dateString) => {
    if (dateString === 'Never') return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const totalUsersCount = users.length;

  return (
    <div className="aum-container">
      {/* Header */}
      <div className="aum-header">
        <button className="aum-back-button">
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
        <h1 className="aum-title">Admin User Management</h1>
        <p className="aum-subtitle">
          Create and manage administrative users with access to the system
        </p>
      </div>

      {/* Add New User Section */}
      <div className="aum-add-section">
        <div className="aum-add-header">
          <h2>Add New Admin User</h2>
          <p>Create a new administrative user account with system access</p>
        </div>
        
        <div className="aum-add-form">
          <form onSubmit={handleSubmit}>
            <div className="aum-form-grid">
              <div className="aum-form-group">
                <label className="aum-form-label" htmlFor="username">
                  Email *
                </label>
                <input
                  type="email"
                  id="username"
                  name="username"
                  className={`aum-form-input ${formErrors.username ? 'error' : ''}`}
                  placeholder="Enter email address"
                  value={formData.username}
                  onChange={handleInputChange}
                />
                {formErrors.username && (
                  <div className="aum-error-message">{formErrors.username}</div>
                )}
              </div>

              <div className="aum-form-group">
                <label className="aum-form-label" htmlFor="password">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`aum-form-input ${formErrors.password ? 'error' : ''}`}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {formErrors.password && (
                  <div className="aum-error-message">{formErrors.password}</div>
                )}
              </div>
            </div>

            <div className="aum-form-actions">
              <button 
                type="button" 
                className="aum-btn aum-btn-secondary"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                <X size={16} />
                Reset
              </button>
              <button 
                type="submit" 
                className="aum-btn aum-btn-primary"
                disabled={isSubmitting}
              >
                <UserPlus size={16} />
                {isSubmitting ? 'Creating...' : 'Create Admin User'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Users Table */}
      <div className="aum-table-container">
        <div className="aum-table-header">
          <div className="aum-table-header-content">
            <h2>Admin Users</h2>
            <p>Manage existing administrative users and their access permissions</p>
          </div>
          <div className="aum-stats-container">
            <div className="aum-stat-item">
              <span className="aum-stat-number">{totalUsersCount}</span>
              <span className="aum-stat-label">Total Users</span>
            </div>
          </div>
        </div>

        <div className="aum-table-wrapper">
          {loading ? (
            <div className="aum-loading-container">
              <div className="aum-loading-spinner"></div>
              <p>Loading admin users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="aum-no-data">
              <div className="aum-no-data-content">
                <Users size={64} />
                <p>No admin users found. Create your first admin user above.</p>
              </div>
            </div>
          ) : (
            <table className="aum-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Created</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="aum-table-row">
                    <td>
                      <div className="aum-user-info">
                        <div className="aum-user-avatar">
                          {getUserInitials(user.username)}
                        </div>
                        <div className="aum-user-details">
                          <div className="aum-user-name">{user.username}</div>
                          <div className="aum-user-role">{user.role}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="aum-date-cell">
                        <Calendar size={14} />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td>
                      <div className="aum-date-cell">
                        <Calendar size={14} />
                        {formatDate(user.lastLogin)}
                      </div>
                    </td>
                    <td>
                      <div className="aum-actions">
                        <button
                          className="aum-action-btn aum-delete-btn"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="aum-modal-overlay">
          <div className="aum-modal">
            <div className="aum-modal-header">
              <AlertTriangle size={20} style={{ color: 'var(--cpe-accent-red)' }} />
              <h3>Confirm Action</h3>
            </div>
            <div className="aum-modal-content">
              <p>{confirmAction?.message}</p>
            </div>
            <div className="aum-modal-actions">
              <button 
                className="aum-btn aum-btn-secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                <X size={16} />
                Cancel
              </button>
              <button 
                className="aum-btn aum-btn-primary"
                onClick={executeConfirmedAction}
              >
                <Check size={16} />
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`aum-toast aum-toast-${toast.type}`}>
          <div className="aum-toast-content">
            <Check size={16} />
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignadmin;