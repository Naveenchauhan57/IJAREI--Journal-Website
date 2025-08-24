import React, { useState, useEffect } from 'react';
import "../styles/Contactpageenquiries.css";
import { 
    Eye, 
    Trash2, 
    X, 
    Mail, 
    Phone, 
    User,
    Calendar,
    AlertCircle
} from 'lucide-react';

const Contactpageenquiries = ({ onBack }) => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    // Placeholder async functions for backend integration
    const fetchAllEnquiries = async () => {
        try {
            const response = await fetch('/api/enquiries');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching enquiries:', error);
            // Return mock data for demonstration
            return [
                {
                    id: 1,
                    name: 'Dr. Sarah Johnson',
                    email: 'sarah.johnson@university.edu',
                    contactNumber: '+1-555-0123',
                    enquiry: 'I am interested in submitting a research paper on sustainable agriculture practices in developing countries. Could you please provide information about your submission guidelines and review process? I have been working on this research for the past two years.',
                    createdAt: '2024-08-20T10:30:00Z'
                },
                {
                    id: 2,
                    name: 'Prof. Michael Chen',
                    email: 'mchen@research.org',
                    contactNumber: '+1-555-0456',
                    enquiry: 'Hello, I would like to inquire about joining your editorial board. I have 15 years of experience in agricultural research.',
                    createdAt: '2024-08-19T14:15:00Z'
                },
                {
                    id: 3,
                    name: 'Lisa Rodriguez',
                    email: 'lisa.rodriguez@gmail.com',
                    contactNumber: '+1-555-0789',
                    enquiry: 'I am a graduate student and would like to know if you accept papers from students. Also, what are your publication fees?',
                    createdAt: '2024-08-18T09:45:00Z'
                }
            ];
        }
    };

    const deleteEnquiry = async (id) => {
        try {
            const response = await fetch(`/api/enquiries/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete enquiry');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error deleting enquiry:', error);
            throw error;
        }
    };

    // Load enquiries on component mount
    useEffect(() => {
        loadEnquiries();
    }, []);

    const loadEnquiries = async () => {
        try {
            setLoading(true);
            const data = await fetchAllEnquiries();
            setEnquiries(data);
        } catch (error) {
            showToast('Failed to load enquiries', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this enquiry?')) {
            try {
                await deleteEnquiry(id);
                setEnquiries(prevEnquiries =>
                    prevEnquiries.filter(enquiry => enquiry.id !== id)
                );
                showToast('Enquiry deleted successfully', 'success');
            } catch (error) {
                showToast('Failed to delete enquiry', 'error');
            }
        }
    };

    const handleViewDetails = (enquiry) => {
        setSelectedEnquiry(enquiry);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedEnquiry(null);
    };

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 3000);
    };

    const truncateText = (text, maxLength = 100) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="cpe-loading-container">
                <div className="cpe-loading-spinner"></div>
                <p>Loading enquiries...</p>
            </div>
        );
    }

    return (
        <div className="cpe-container">
            {/* Header */}
            <div className="cpe-header">
                {onBack && (
                    <button 
                        className="cpe-back-button"
                        onClick={onBack}
                        style={{
                            position: 'absolute',
                            left: '2.5rem',
                            top: '2rem',
                            background: 'none',
                            border: 'none',
                            color: 'var(--cpe-gray-600)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                        }}
                    >
                        ← Back to Enquiries
                    </button>
                )}
                <h1 className="cpe-title">Contact Page Enquiries</h1>
                <p className="cpe-subtitle">
                    Manage user messages and enquiries submitted from Contact Us page
                </p>
            </div>

            {/* Table Container */}
            <div className="cpe-table-container">
                <div className="cpe-table-wrapper">
                    <table className="cpe-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact Number</th>
                                <th>Enquiry</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enquiries.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="cpe-no-data">
                                        <div className="cpe-no-data-content">
                                            <Mail size={48} />
                                            <p>No enquiries found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                enquiries.map((enquiry) => (
                                    <tr key={enquiry.id}>
                                        <td>
                                            <div className="cpe-name-cell">
                                                <User size={16} />
                                                <span>{enquiry.name}</span>
                                            </div>
                                        </td>
                                        <td>{enquiry.email}</td>
                                        <td>{enquiry.contactNumber}</td>
                                        <td>
                                            <div className="cpe-enquiry-cell">
                                                <span>{truncateText(enquiry.enquiry)}</span>
                                                <button
                                                    className="cpe-view-btn"
                                                    onClick={() => handleViewDetails(enquiry)}
                                                >
                                                    <Eye size={14} />
                                                    View Details
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="cpe-date-cell">
                                                <Calendar size={14} />
                                                <span>{formatDate(enquiry.createdAt)}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="cpe-actions">
                                                <button
                                                    className="cpe-delete-btn"
                                                    onClick={() => handleDelete(enquiry.id)}
                                                    title="Delete Enquiry"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && selectedEnquiry && (
                <div className="cpe-modal-overlay" onClick={closeModal}>
                    <div className="cpe-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="cpe-modal-header">
                            <h3>Enquiry Details</h3>
                            <button className="cpe-modal-close" onClick={closeModal}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="cpe-modal-content">
                            <div className="cpe-detail-row">
                                <label>Name:</label>
                                <span>{selectedEnquiry.name}</span>
                            </div>
                            <div className="cpe-detail-row">
                                <label>Email:</label>
                                <span>{selectedEnquiry.email}</span>
                            </div>
                            <div className="cpe-detail-row">
                                <label>Contact Number:</label>
                                <span>{selectedEnquiry.contactNumber}</span>
                            </div>
                            <div className="cpe-detail-row">
                                <label>Date Submitted:</label>
                                <span>{formatDate(selectedEnquiry.createdAt)}</span>
                            </div>
                            <div className="cpe-detail-full">
                                <label>Full Enquiry:</label>
                                <p>{selectedEnquiry.enquiry}</p>
                            </div>
                        </div>
                        <div className="cpe-modal-footer">
                            <button className="cpe-modal-cancel-btn" onClick={closeModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast.show && (
                <div className={`cpe-toast cpe-toast-${toast.type}`}>
                    <div className="cpe-toast-content">
                        <AlertCircle size={20} />
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contactpageenquiries;