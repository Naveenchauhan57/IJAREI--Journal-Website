import React, { useState, useEffect } from 'react';
import '../styles/EditorialBoardManagement.css';    
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Power, 
  Trash2, 
  Upload,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

const EditorialBoardManagement = () => {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Sample data - only required columns
  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      post: 'Professor of Agricultural Sciences',
      affiliation: 'Harvard University',
      contact: '+1-617-495-1000',
      universityProfileLink: 'https://harvard.edu/profile/sarah-johnson',
      status: 'Active',
      joinDate: '2023-01-15'
    },
    {
      id: 2,
      name: 'Prof. Michael Chen',
      email: 'michael.chen@stanford.edu',
      post: 'Associate Professor',
      affiliation: 'Stanford University',
      contact: '+1-650-723-2300',
      universityProfileLink: 'https://stanford.edu/profile/michael-chen',
      status: 'Active',
      joinDate: '2023-02-20'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@mit.edu',
      post: 'Research Scientist',
      affiliation: 'MIT',
      contact: '+1-617-253-1000',
      universityProfileLink: 'https://mit.edu/profile/emily-rodriguez',
      status: 'Deactive',
      joinDate: '2023-03-10'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    post: '',
    affiliation: '',
    contact: '',
    universityProfileLink: '',
    profilePicture: null
  });

  const [errors, setErrors] = useState({});

  const statuses = ['Active', 'Deactive'];

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      // Only allow JPG files
      if (file && file.type !== 'image/jpeg') {
        setErrors(prev => ({ ...prev, profilePicture: 'Only JPG files are allowed' }));
        return;
      }
      // Check file size (max 2MB)
      if (file && file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profilePicture: 'File size must be less than 2MB' }));
        return;
      }
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.post.trim()) newErrors.post = 'Post is required';
    if (!formData.affiliation.trim()) newErrors.affiliation = 'Affiliation is required';
    if (!formData.contact.trim()) newErrors.contact = 'Contact is required';
    if (!formData.universityProfileLink.trim()) newErrors.universityProfileLink = 'University Profile Link is required';
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.universityProfileLink && !/^https?:\/\/.+/.test(formData.universityProfileLink)) {
      newErrors.universityProfileLink = 'Please enter a valid URL (starting with http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (editingMember) {
        // Update existing member
        setMembers(prev => prev.map(member => 
          member.id === editingMember.id 
            ? { ...member, ...formData, id: editingMember.id }
            : member
        ));
        alert('Editorial board member updated successfully!');
      } else {
        // Add new member
        const newMember = {
          ...formData,
          id: members.length + 1,
          status: 'Active',
          joinDate: new Date().toISOString().split('T')[0]
        };
        setMembers(prev => [...prev, newMember]);
        alert('Editorial board member added successfully!');
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        post: '',
        affiliation: '',
        contact: '',
        universityProfileLink: '',
        profilePicture: null
      });
      setIsAddingMember(false);
      setEditingMember(null);
      
    } catch (error) {
      alert('Error saving member. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (member) => {
    setFormData({
      name: member.name,
      email: member.email,
      post: member.post,
      affiliation: member.affiliation,
      contact: member.contact,
      universityProfileLink: member.universityProfileLink,
      profilePicture: null
    });
    setEditingMember(member);
    setIsAddingMember(true);
  };

  const handleStatusToggle = (id) => {
    setMembers(prev => prev.map(member => 
      member.id === id 
        ? { ...member, status: member.status === 'Active' ? 'Deactive' : 'Active' }
        : member
    ));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      setMembers(prev => prev.filter(member => member.id !== id));
    }
  };

  const handleCancel = () => {
    setIsAddingMember(false);
    setEditingMember(null);
    setFormData({
      name: '',
      email: '',
      post: '',
      affiliation: '',
      contact: '',
      universityProfileLink: '',
      profilePicture: null
    });
    setErrors({});
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.affiliation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.post.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="ebm-container">
      {/* Header */}
      <div className="ebm-header">
        <div className="ebm-header-icon">
          <Users size={32} />
        </div>
        <div>
          <h1 className="ebm-title">Editorial Board Management</h1>
          <p className="ebm-subtitle">Manage editorial board members, their roles, and status</p>
        </div>
      </div>

      {/* Add/Edit Member Form */}
      {isAddingMember && (
        <div className="ebm-form-section">
          <div className="ebm-section-header">
            <h2 className="ebm-section-title">
              {editingMember ? 'Edit Editorial Board Member' : 'Add New Editorial Board Member'}
            </h2>
            <button 
              type="button" 
              className="ebm-cancel-btn"
              onClick={handleCancel}
            >
              <X size={16} /> Cancel
            </button>
          </div>
          
          <div className="ebm-form">
            {/* Member Information */}
            <div className="ebm-form-section-group">
              <h3 className="ebm-group-title">Member Information</h3>
              
              <div className="ebm-row">
                <div className="ebm-form-group">
                  <label className="ebm-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`ebm-input ${errors.name ? 'ebm-error' : ''}`}
                    placeholder="Enter full name"
                  />
                  {errors.name && <span className="ebm-error-text">{errors.name}</span>}
                </div>
                
                <div className="ebm-form-group">
                  <label className="ebm-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`ebm-input ${errors.email ? 'ebm-error' : ''}`}
                    placeholder="Enter email address"
                  />
                  {errors.email && <span className="ebm-error-text">{errors.email}</span>}
                </div>
              </div>

              <div className="ebm-row">
                <div className="ebm-form-group">
                  <label className="ebm-label">Post *</label>
                  <input
                    type="text"
                    name="post"
                    value={formData.post}
                    onChange={handleInputChange}
                    className={`ebm-input ${errors.post ? 'ebm-error' : ''}`}
                    placeholder="Enter post/designation"
                  />
                  {errors.post && <span className="ebm-error-text">{errors.post}</span>}
                </div>
                
                <div className="ebm-form-group">
                  <label className="ebm-label">Affiliation *</label>
                  <input
                    type="text"
                    name="affiliation"
                    value={formData.affiliation}
                    onChange={handleInputChange}
                    className={`ebm-input ${errors.affiliation ? 'ebm-error' : ''}`}
                    placeholder="Enter institution/organization"
                  />
                  {errors.affiliation && <span className="ebm-error-text">{errors.affiliation}</span>}
                </div>
              </div>

              <div className="ebm-row">
                <div className="ebm-form-group">
                  <label className="ebm-label">Contact *</label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className={`ebm-input ${errors.contact ? 'ebm-error' : ''}`}
                    placeholder="Enter phone number"
                  />
                  {errors.contact && <span className="ebm-error-text">{errors.contact}</span>}
                </div>
                
                <div className="ebm-form-group">
                  <label className="ebm-label">University Profile Link *</label>
                  <input
                    type="url"
                    name="universityProfileLink"
                    value={formData.universityProfileLink}
                    onChange={handleInputChange}
                    className={`ebm-input ${errors.universityProfileLink ? 'ebm-error' : ''}`}
                    placeholder="https://university.edu/profile/..."
                  />
                  {errors.universityProfileLink && <span className="ebm-error-text">{errors.universityProfileLink}</span>}
                </div>
              </div>

              <div className="ebm-form-group">
                <label className="ebm-label">Profile Picture (JPG only)</label>
                <div className={`ebm-file-upload ${errors.profilePicture ? 'ebm-error' : ''}`}>
                  <input
                    type="file"
                    name="profilePicture"
                    accept=".jpg,.jpeg"
                    onChange={handleInputChange}
                    className="ebm-file-input"
                  />
                  <label className="ebm-file-label">
                    <Upload size={24} />
                    <span className="ebm-file-text">
                      {formData.profilePicture ? formData.profilePicture.name : 'Choose JPG image or drag and drop'}
                    </span>
                    <span className="ebm-file-subtext">Maximum file size: 2MB (JPG only)</span>
                  </label>
                </div>
                {errors.profilePicture && <span className="ebm-error-text">{errors.profilePicture}</span>}
              </div>
            </div>

            {/* Submit Section */}
            <div className="ebm-submit-section">
              <button
                type="button"
                className="ebm-submit-btn"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <div className="ebm-spinner"></div>
                    {editingMember ? 'Updating Member...' : 'Adding Member...'}
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    {editingMember ? 'Update Member' : 'Add Member'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members List */}
      <div className="ebm-list-section">
        <div className="ebm-list-header">
          <div className="ebm-section-header" style={{ border: 'none', padding: 0, background: 'none' }}>
            <h2 className="ebm-section-title">Editorial Board Members ({members.length})</h2>
            {!isAddingMember && (
              <button 
                type="button" 
                className="ebm-submit-btn"
                style={{ fontSize: '14px', padding: '12px 24px', minWidth: 'auto' }}
                onClick={() => setIsAddingMember(true)}
              >
                <Plus size={16} />
                Add New Member
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="ebm-controls">
            <div className="ebm-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by name, email, affiliation, or post..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ebm-search-input"
              />
            </div>
            
            <div className="ebm-filters">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="ebm-filter-select"
              >
                <option value="all">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="ebm-table-container">
          {filteredMembers.length > 0 ? (
            <table className="ebm-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Post</th>
                  <th>Affiliation</th>
                  <th>Contact</th>
                  <th>University Profile</th>
                  <th>Status</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="ebm-member-info">
                        <div className="ebm-profile-pic">
                          {member.profilePicture ? (
                            <img 
                              src={typeof member.profilePicture === 'string' ? member.profilePicture : URL.createObjectURL(member.profilePicture)} 
                              alt={member.name} 
                              className="ebm-profile-img" 
                            />
                          ) : (
                            <div style={{ 
                              width: '100%', 
                              height: '100%', 
                              background: 'linear-gradient(135deg, #d4c4a8, #c9a876)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '14px',
                              fontWeight: '600'
                            }}>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="ebm-member-name">{member.name}</div>
                        </div>
                      </div>
                    </td>
                    <td>{member.email}</td>
                    <td>{member.post}</td>
                    <td>{member.affiliation}</td>
                    <td>{member.contact}</td>
                    <td>
                      <a 
                        href={member.universityProfileLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ebm-profile-link"
                        style={{
                          color: '#22c55e',
                          textDecoration: 'none',
                          fontSize: '12px',
                          padding: '4px 8px',
                          background: '#f0fdf4',
                          borderRadius: '4px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#dcfce7';
                          e.target.style.color = '#15803d';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#f0fdf4';
                          e.target.style.color = '#22c55e';
                        }}
                      >
                        View Profile
                      </a>
                    </td>
                    <td>
                      <span className={`ebm-status-badge ebm-status-${member.status.toLowerCase()}`}>
                        {member.status}
                      </span>
                    </td>
                    <td>{new Date(member.joinDate).toLocaleDateString()}</td>
                    <td>
                      <div className="ebm-actions">
                        <button
                          className="ebm-action-btn ebm-edit-btn"
                          onClick={() => handleEdit(member)}
                          title="Edit Member"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="ebm-action-btn ebm-status-btn"
                          onClick={() => handleStatusToggle(member.id)}
                          title={`${member.status === 'Active' ? 'Deactivate' : 'Activate'} Member`}
                        >
                          <Power size={14} />
                        </button>
                        <button
                          className="ebm-action-btn ebm-delete-btn"
                          onClick={() => handleDelete(member.id)}
                          title="Delete Member"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="ebm-no-data">
              <div className="ebm-no-data-content">
                <AlertCircle size={48} />
                <h3>No members found</h3>
                <p>No editorial board members match your current search and filter criteria.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorialBoardManagement;