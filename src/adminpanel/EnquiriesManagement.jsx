import React, { useState, useEffect } from 'react';
import '../styles/EnquiryPage.css';
import { Search, Filter, Eye, Download, Mail, Phone, User, Calendar, FileText, GraduationCap, BookOpen, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const EnquiryPage = ({ updateNotificationCount }) => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Fetch enquiries from backend
    useEffect(() => {
        const fetchEnquiries = async () => {
            setLoading(true);
            try {
                // Replace with actual API endpoints
                const contactResponse = await fetch('/api/contact-enquiries');
                const editorialResponse = await fetch('/api/editorial-board-applications');
                const manuscriptResponse = await fetch('/api/manuscript-submissions');
                
                // const contactData = await contactResponse.json();
                // const editorialData = await editorialResponse.json();
                // const manuscriptData = await manuscriptResponse.json();
                
                // Mock data for demonstration - remove when connecting to backend
                const mockData = [
                    {
                        id: 1,
                        type: 'contact',
                        name: 'Dr. Rajesh Kumar',
                        email: 'rajesh.kumar@university.edu',
                        contactNumber: '+91 98765 43210',
                        enquiry: 'I would like to know more about the submission guidelines for agricultural research papers.',
                        file: 'research_proposal.pdf',
                        submittedAt: '2024-01-15T10:30:00Z',
                        status: 'pending'
                    },
                    {
                        id: 2,
                        type: 'editorial',
                        name: 'Prof. Priya Sharma',
                        email: 'priya.sharma@agricollege.in',
                        contactNumber: '+91 87654 32109',
                        degree: 'Ph.D. in Agricultural Sciences',
                        department: 'Department of Soil Science, Agricultural University',
                        post: 'Professor with 15+ years experience in sustainable farming practices',
                        file: 'cv_priya_sharma.pdf',
                        imgf: 'profile_photo.jpg',
                        submittedAt: '2024-01-14T14:20:00Z',
                        status: 'approved'
                    },
                    {
                        id: 3,
                        type: 'manuscript',
                        name: 'Dr. Amit Patel',
                        email: 'amit.patel@researchinst.org',
                        contactNumber: '+91 76543 21098',
                        articleTitle: 'Impact of Organic Fertilizers on Crop Yield and Soil Health',
                        subject: 'This research study examines the long-term effects of organic fertilizers on agricultural productivity and soil microbiome diversity across different crop types.',
                        file: 'manuscript_organic_fertilizers.pdf',
                        submittedAt: '2024-01-13T09:15:00Z',
                        status: 'under_review'
                    },
                    {
                        id: 4,
                        type: 'contact',
                        name: 'Sarah Johnson',
                        email: 'sarah.j@farmtech.com',
                        contactNumber: '+1 555 123 4567',
                        enquiry: 'We are interested in publishing our research on precision agriculture technologies.',
                        file: null,
                        submittedAt: '2024-01-12T16:45:00Z',
                        status: 'responded'
                    },
                    {
                        id: 5,
                        type: 'manuscript',
                        name: 'Dr. Ravi Gupta',
                        email: 'ravi.gupta@agritech.ac.in',
                        contactNumber: '+91 65432 10987',
                        articleTitle: 'Climate Change Adaptation Strategies in Indian Agriculture',
                        subject: 'Comprehensive analysis of climate-resilient farming techniques adopted by farmers in different agro-climatic zones of India.',
                        file: 'climate_adaptation_manuscript.pdf',
                        submittedAt: '2024-01-11T11:30:00Z',
                        status: 'pending'
                    }
                ];
                
                // Combine all enquiries with type identification
                // const allEnquiries = [
                //     ...contactData.map(item => ({ ...item, type: 'contact' })),
                //     ...editorialData.map(item => ({ ...item, type: 'editorial' })),
                //     ...manuscriptData.map(item => ({ ...item, type: 'manuscript' }))
                // ];
                
                setEnquiries(mockData);
            } catch (error) {
                console.error('Error fetching enquiries:', error);
                // Handle error - maybe show error message to user
            } finally {
                setLoading(false);
            }
        };

        fetchEnquiries();
    }, []);

    // Filter enquiries based on search and filters
    const filteredEnquiries = enquiries.filter(enquiry => {
        const matchesSearch = 
            enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (enquiry.articleTitle && enquiry.articleTitle.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesType = filterType === 'all' || enquiry.type === filterType;
        const matchesStatus = filterStatus === 'all' || enquiry.status === filterStatus;
        
        return matchesSearch && matchesType && matchesStatus;
    });

    const handleViewDetails = (enquiry) => {
        setSelectedEnquiry(enquiry);
        setShowModal(true);
    };

    const handleStatusChange = async (enquiryId, newStatus) => {
        try {
            // Update status in backend
            await fetch(`/api/enquiries/${enquiryId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            // Update local state
            setEnquiries(prev => 
                prev.map(enquiry => 
                    enquiry.id === enquiryId 
                        ? { ...enquiry, status: newStatus }
                        : enquiry
                )
            );
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const handleDelete = async (enquiryId) => {
        if (window.confirm('Are you sure you want to delete this enquiry?')) {
            try {
                await fetch(`/api/enquiries/${enquiryId}`, { 
                    method: 'DELETE' 
                });
                
                setEnquiries(prev => prev.filter(enquiry => enquiry.id !== enquiryId));
                alert('Enquiry deleted successfully');
            } catch (error) {
                console.error('Error deleting enquiry:', error);
                alert('Failed to delete enquiry');
            }
        }
    };

    const handleDownloadFile = async (enquiryId, filename) => {
        try {
            const response = await fetch(`/api/enquiries/${enquiryId}/download/${filename}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download file');
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: '#f59e0b', text: 'PENDING', icon: Clock },
            under_review: { color: '#3b82f6', text: 'UNDER REVIEW', icon: Eye },
            approved: { color: '#10b981', text: 'APPROVED', icon: CheckCircle },
            responded: { color: '#10b981', text: 'RESPONDED', icon: CheckCircle },
            rejected: { color: '#ef4444', text: 'REJECTED', icon: AlertCircle }
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <span className="enquiryPageStatusBadge" style={{ color: config.color }}>
                <Icon size={14} />
                {config.text}
            </span>
        );
    };

    const getTypeIcon = (type) => {
        const icons = {
            contact: Mail,
            editorial: GraduationCap,
            manuscript: BookOpen
        };
        const Icon = icons[type] || FileText;
        return <Icon size={20} />;
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
            <div className="enquiryPageLoadingContainer">
                <div className="enquiryPageLoadingSpinner"></div>
                <p className="enquiryPageLoadingText">Loading enquiries...</p>
            </div>
        );
    }

    return (
        <div className="enquiryPageContainer">
            {/* Header */}
            <div className="enquiryPageHeader">
                <div className="enquiryPageHeaderContent">
                    <h1 className="enquiryPageTitle">Enquiry Management Dashboard</h1>
                    <p className="enquiryPageSubtitle">
                        Manage all submissions and enquiries from contact forms, editorial board applications, and manuscript submissions
                    </p>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="enquiryPageStatsGrid">
                <div className="enquiryPageStatCard">
                    <div className="enquiryPageStatIcon">
                        <FileText size={24} />
                    </div>
                    <div className="enquiryPageStatContent">
                        <h3 className="enquiryPageStatNumber">{enquiries.length}</h3>
                        <p className="enquiryPageStatLabel">Total Enquiries</p>
                    </div>
                </div>

                <div className="enquiryPageStatCard">
                    <div className="enquiryPageStatIcon">
                        <Clock size={24} />
                    </div>
                    <div className="enquiryPageStatContent">
                        <h3 className="enquiryPageStatNumber">
                            {enquiries.filter(e => e.status === 'pending').length}
                        </h3>
                        <p className="enquiryPageStatLabel">Pending</p>
                    </div>
                </div>

                <div className="enquiryPageStatCard">
                    <div className="enquiryPageStatIcon">
                        <CheckCircle size={24} />
                    </div>
                    <div className="enquiryPageStatContent">
                        <h3 className="enquiryPageStatNumber">
                            {enquiries.filter(e => e.status === 'approved' || e.status === 'responded').length}
                        </h3>
                        <p className="enquiryPageStatLabel">Completed</p>
                    </div>
                </div>

                <div className="enquiryPageStatCard">
                    <div className="enquiryPageStatIcon">
                        <Eye size={24} />
                    </div>
                    <div className="enquiryPageStatContent">
                        <h3 className="enquiryPageStatNumber">
                            {enquiries.filter(e => e.status === 'under_review').length}
                        </h3>
                        <p className="enquiryPageStatLabel">Under Review</p>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="enquiryPageFiltersSection">
                <div className="enquiryPageSearchContainer">
                    <Search className="enquiryPageSearchIcon" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or article title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="enquiryPageSearchInput"
                    />
                </div>

                <div className="enquiryPageFilterContainer">
                    <div className="enquiryPageFilterGroup">
                        <Filter size={16} />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="enquiryPageFilterSelect"
                        >
                            <option value="all">All Types</option>
                            <option value="contact">Contact Enquiries</option>
                            <option value="editorial">Editorial Board</option>
                            <option value="manuscript">Manuscripts</option>
                        </select>
                    </div>

                    <div className="enquiryPageFilterGroup">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="enquiryPageFilterSelect"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="under_review">Under Review</option>
                            <option value="approved">Approved</option>
                            <option value="responded">Responded</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Enquiries List */}
            <div className="enquiryPageTableContainer">
                <div className="enquiryPageTableHeader">
                    <h2 className="enquiryPageTableTitle">
                        Recent Enquiries ({filteredEnquiries.length})
                    </h2>
                </div>

                {filteredEnquiries.length === 0 ? (
                    <div className="enquiryPageEmptyState">
                        <FileText size={48} className="enquiryPageEmptyIcon" />
                        <h3 className="enquiryPageEmptyTitle">No enquiries found</h3>
                        <p className="enquiryPageEmptyText">
                            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'No enquiries have been submitted yet'}
                        </p>
                    </div>
                ) : (
                    <div className="enquiryPageTable">
                        {filteredEnquiries.map((enquiry) => (
                            <div key={enquiry.id} className="enquiryPageTableRow">
                                <div className="enquiryPageEnquiryCard">
                                    <div className="enquiryPageCardHeader">
                                        <div className="enquiryPageCardInfo">
                                            <div className="enquiryPageTypeIcon">
                                                {getTypeIcon(enquiry.type)}
                                            </div>
                                            <div>
                                                <h3 className="enquiryPageEnquiryName">{enquiry.name}</h3>
                                                <p className="enquiryPageEnquiryEmail">{enquiry.email}</p>
                                            </div>
                                        </div>
                                        <div className="enquiryPageCardMeta">
                                            <span className="enquiryPageTypeLabel">
                                                {enquiry.type.charAt(0).toUpperCase() + enquiry.type.slice(1)}
                                            </span>
                                            {getStatusBadge(enquiry.status)}
                                        </div>
                                    </div>

                                    <div className="enquiryPageCardContent">
                                        {enquiry.type === 'contact' && (
                                            <p className="enquiryPageEnquiryText">
                                                {enquiry.enquiry.length > 150 
                                                    ? enquiry.enquiry.substring(0, 150) + '...'
                                                    : enquiry.enquiry}
                                            </p>
                                        )}
                                        
                                        {enquiry.type === 'manuscript' && (
                                            <div className="enquiryPageManuscriptInfo">
                                                <h4 className="enquiryPageArticleTitle">{enquiry.articleTitle}</h4>
                                                <p className="enquiryPageEnquiryText">
                                                    {enquiry.subject.length > 120 
                                                        ? enquiry.subject.substring(0, 120) + '...'
                                                        : enquiry.subject}
                                                </p>
                                            </div>
                                        )}

                                        {enquiry.type === 'editorial' && (
                                            <div className="enquiryPageEditorialInfo">
                                                <p className="enquiryPageDegree">{enquiry.degree}</p>
                                                <p className="enquiryPageDepartment">{enquiry.department}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="enquiryPageCardFooter">
                                        <div className="enquiryPageCardMeta">
                                            <div className="enquiryPageContactInfo">
                                                <Phone size={14} />
                                                <span>{enquiry.contactNumber}</span>
                                            </div>
                                            <div className="enquiryPageDateInfo">
                                                <Calendar size={14} />
                                                <span>{formatDate(enquiry.submittedAt)}</span>
                                            </div>
                                        </div>

                                        <div className="enquiryPageCardActions">
                                            <button
                                                onClick={() => handleViewDetails(enquiry)}
                                                className="enquiryPageActionBtn enquiryPageViewBtn"
                                            >
                                                <Eye size={16} />
                                                View
                                            </button>

                                            {enquiry.file && (
                                                <button
                                                    onClick={() => handleDownloadFile(enquiry.id, enquiry.file)}
                                                    className="enquiryPageActionBtn enquiryPageDownloadBtn"
                                                >
                                                    <Download size={16} />
                                                    File
                                                </button>
                                            )}

                                            <select
                                                value={enquiry.status}
                                                onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                                                className="enquiryPageStatusSelect"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="under_review">Under Review</option>
                                                <option value="approved">Approved</option>
                                                <option value="responded">Responded</option>
                                                <option value="rejected">Rejected</option>
                                            </select>

                                            <button
                                                onClick={() => handleDelete(enquiry.id)}
                                                className="enquiryPageActionBtn enquiryPageDeleteBtn"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal for viewing enquiry details */}
            {showModal && selectedEnquiry && (
                <div className="enquiryPageModalOverlay" onClick={() => setShowModal(false)}>
                    <div className="enquiryPageModalContent" onClick={(e) => e.stopPropagation()}>
                        <div className="enquiryPageModalHeader">
                            <h2 className="enquiryPageModalTitle">Enquiry Details</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="enquiryPageModalClose"
                            >
                                ×
                            </button>
                        </div>

                        <div className="enquiryPageModalBody">
                            <div className="enquiryPageDetailsGrid">
                                <div className="enquiryPageDetailItem">
                                    <User size={16} />
                                    <span className="enquiryPageDetailLabel">Name:</span>
                                    <span className="enquiryPageDetailValue">{selectedEnquiry.name}</span>
                                </div>

                                <div className="enquiryPageDetailItem">
                                    <Mail size={16} />
                                    <span className="enquiryPageDetailLabel">Email:</span>
                                    <span className="enquiryPageDetailValue">{selectedEnquiry.email}</span>
                                </div>

                                <div className="enquiryPageDetailItem">
                                    <Phone size={16} />
                                    <span className="enquiryPageDetailLabel">Contact:</span>
                                    <span className="enquiryPageDetailValue">{selectedEnquiry.contactNumber}</span>
                                </div>

                                <div className="enquiryPageDetailItem">
                                    <Calendar size={16} />
                                    <span className="enquiryPageDetailLabel">Submitted:</span>
                                    <span className="enquiryPageDetailValue">{formatDate(selectedEnquiry.submittedAt)}</span>
                                </div>

                                {selectedEnquiry.type === 'manuscript' && (
                                    <>
                                        <div className="enquiryPageDetailItem enquiryPageFullWidth">
                                            <BookOpen size={16} />
                                            <span className="enquiryPageDetailLabel">Article Title:</span>
                                            <span className="enquiryPageDetailValue">{selectedEnquiry.articleTitle}</span>
                                        </div>
                                        <div className="enquiryPageDetailItem enquiryPageFullWidth">
                                            <FileText size={16} />
                                            <span className="enquiryPageDetailLabel">Subject/Abstract:</span>
                                            <span className="enquiryPageDetailValue">{selectedEnquiry.subject}</span>
                                        </div>
                                    </>
                                )}

                                {selectedEnquiry.type === 'editorial' && (
                                    <>
                                        <div className="enquiryPageDetailItem enquiryPageFullWidth">
                                            <GraduationCap size={16} />
                                            <span className="enquiryPageDetailLabel">Degree:</span>
                                            <span className="enquiryPageDetailValue">{selectedEnquiry.degree}</span>
                                        </div>
                                        <div className="enquiryPageDetailItem enquiryPageFullWidth">
                                            <span className="enquiryPageDetailLabel">Department:</span>
                                            <span className="enquiryPageDetailValue">{selectedEnquiry.department}</span>
                                        </div>
                                        <div className="enquiryPageDetailItem enquiryPageFullWidth">
                                            <span className="enquiryPageDetailLabel">Experience:</span>
                                            <span className="enquiryPageDetailValue">{selectedEnquiry.post}</span>
                                        </div>
                                        {selectedEnquiry.imgf && (
                                            <div className="enquiryPageDetailItem">
                                                <span className="enquiryPageDetailLabel">Profile Photo:</span>
                                                <button 
                                                    onClick={() => handleDownloadFile(selectedEnquiry.id, selectedEnquiry.imgf)}
                                                    className="enquiryPageFileLink"
                                                >
                                                    {selectedEnquiry.imgf}
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}

                                {selectedEnquiry.type === 'contact' && (
                                    <div className="enquiryPageDetailItem enquiryPageFullWidth">
                                        <FileText size={16} />
                                        <span className="enquiryPageDetailLabel">Enquiry:</span>
                                        <span className="enquiryPageDetailValue">{selectedEnquiry.enquiry}</span>
                                    </div>
                                )}

                                {selectedEnquiry.file && (
                                    <div className="enquiryPageDetailItem">
                                        <Download size={16} />
                                        <span className="enquiryPageDetailLabel">Attached File:</span>
                                        <button 
                                            onClick={() => handleDownloadFile(selectedEnquiry.id, selectedEnquiry.file)}
                                            className="enquiryPageFileLink"
                                        >
                                            {selectedEnquiry.file}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="enquiryPageModalFooter">
                            <button
                                onClick={() => setShowModal(false)}
                                className="enquiryPageModalBtn enquiryPageModalBtnSecondary"
                            >
                                Close
                            </button>
                            <button 
                                className="enquiryPageModalBtn enquiryPageModalBtnPrimary"
                                onClick={() => window.open(`mailto:${selectedEnquiry.email}`, '_blank')}
                            >
                                <Mail size={16} />
                                Send Reply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnquiryPage;