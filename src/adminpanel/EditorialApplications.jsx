import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Download, 
  X, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Building, 
  FileText, 
  Calendar,
  Search,
  Filter,
  ArrowLeft
} from 'lucide-react';
import "../styles/EditorialApplications.css";

const EditorialApplications = ({ onBack }) => {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setInquiries([
        {
          id: 1,
          name: "Dr. Sarah Johnson",
          email: "sarah.johnson@university.edu",
          contactNumber: "+1 (555) 123-4567",
          degree: "Ph.D. in Agricultural Sciences",
          department: "Department of Plant Sciences, Harvard University",
          post: "Professor with 15+ years of experience in sustainable agriculture and crop genetics. Research focus on developing drought-resistant crops and sustainable farming practices. Published over 50 peer-reviewed papers in high-impact journals.",
          file: "dr_sarah_johnson_cv.pdf",
          imgf: "dr_sarah_johnson_photo.jpg",
          submittedAt: "2024-12-15T10:30:00Z",
          status: "pending"
        },
        {
          id: 2,
          name: "Prof. Michael Chen",
          email: "m.chen@agri-tech.org",
          contactNumber: "+86 138 0013 8000",
          degree: "Ph.D. in Agricultural Engineering",
          department: "Institute of Agricultural Technology, Beijing Agricultural University",
          post: "Senior Research Scientist specializing in precision agriculture and IoT applications in farming. 12 years of experience in agricultural technology development. Author of 3 books and 40+ research papers on smart farming solutions.",
          file: "prof_michael_chen_resume.pdf",
          imgf: "prof_michael_chen_photo.jpg",
          submittedAt: "2024-12-14T14:22:00Z",
          status: "pending"
        },
        {
          id: 3,
          name: "Dr. Priya Sharma",
          email: "priya.sharma@iari.res.in",
          contactNumber: "+91 98765 43210",
          degree: "Ph.D. in Soil Science",
          department: "Division of Soil Science, Indian Agricultural Research Institute",
          post: "Senior Scientist with expertise in soil health management and organic farming. 10 years of research experience in soil microbiology and sustainable agriculture practices. Published 35+ research papers and received Excellence in Research Award 2023.",
          file: "dr_priya_sharma_cv.pdf",
          imgf: "dr_priya_sharma_photo.jpg",
          submittedAt: "2024-12-13T09:15:00Z",
          status: "pending"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleView = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsPopupOpen(true);
  };

  const handleDownload = (filename, inquiryName) => {
    // Simulate file download
    const link = document.createElement('a');
    link.href = `#`; // Replace with actual file URL
    link.download = filename;
    link.click();
    
    // Show success message
    alert(`Downloading ${filename} for ${inquiryName}`);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedInquiry(null);
  };

  const filteredInquiries = inquiries.filter(inquiry =>
    inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="ea-container">
        <div className="ea-loading-container">
          <div className="ea-loading-spinner"></div>
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ea-container">
      {/* Header */}
      <div className="ea-header">
        {onBack && (
          <button 
            className="ea-back-button"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            Back to Enquiries
          </button>
        )}
        <h1 className="ea-title">Editorial Board Applications</h1>
        <p className="ea-subtitle">
          Review and manage editorial board applications from researchers and academics
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="ea-controls-section">
        <div className="ea-stats-container">
          <div className="ea-stat-item">
            <span className="ea-stat-number">{inquiries.length}</span>
            <span className="ea-stat-label">Total Applications</span>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="ea-table-container">
        <div className="ea-table-header">
          <h2>Recent Applications</h2>
          <p>Review and manage editorial board applications</p>
        </div>
        
        <div className="ea-table-wrapper">
          <table className="ea-applications-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Institution</th>
                <th>Degree</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="ea-table-row">
                  <td>
                    <div className="ea-applicant-info">
                      <div className="ea-applicant-avatar">
                        {inquiry.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ea-applicant-details">
                        <div className="ea-applicant-name">{inquiry.name}</div>
                        <div className="ea-applicant-email">{inquiry.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="ea-institution-info">
                      <div className="ea-institution-name">
                        {inquiry.department.split(',')[1]?.trim() || inquiry.department}
                      </div>
                      <div className="ea-department-name">
                        {inquiry.department.split(',')[0]?.trim()}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="ea-degree-badge">
                      {inquiry.degree}
                    </div>
                  </td>
                  <td>
                    <div className="ea-date-info">
                      {formatDate(inquiry.submittedAt)}
                    </div>
                  </td>
                  <td>
                    <div className="ea-actions">
                      <button
                        onClick={() => handleView(inquiry)}
                        className="ea-action-btn ea-view-btn"
                        title="View Details"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      <button
                        onClick={() => handleDownload(inquiry.file, inquiry.name)}
                        className="ea-action-btn ea-download-btn"
                        title="Download CV"
                      >
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && selectedInquiry && (
        <div className="ea-modal-overlay" onClick={closePopup}>
          <div className="ea-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="ea-modal-header">
              <h2>Application Details</h2>
              <button onClick={closePopup} className="ea-modal-close">
                <X size={20} />
              </button>
            </div>
            
            <div className="ea-modal-body">
              <div className="ea-modal-section">
                <h3><User size={18} /> Personal Information</h3>
                <div className="ea-info-grid">
                  <div className="ea-info-item">
                    <span className="ea-info-label">Full Name:</span>
                    <span className="ea-info-value">{selectedInquiry.name}</span>
                  </div>
                  <div className="ea-info-item">
                    <span className="ea-info-label">Email:</span>
                    <span className="ea-info-value">{selectedInquiry.email}</span>
                  </div>
                  <div className="ea-info-item">
                    <span className="ea-info-label">Contact:</span>
                    <span className="ea-info-value">{selectedInquiry.contactNumber}</span>
                  </div>
                  <div className="ea-info-item">
                    <span className="ea-info-label">Submitted:</span>
                    <span className="ea-info-value">{formatDate(selectedInquiry.submittedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="ea-modal-section">
                <h3><GraduationCap size={18} /> Academic Information</h3>
                <div className="ea-info-grid">
                  <div className="ea-info-item ea-full-width">
                    <span className="ea-info-label">Degree:</span>
                    <span className="ea-info-value">{selectedInquiry.degree}</span>
                  </div>
                  <div className="ea-info-item ea-full-width">
                    <span className="ea-info-label">Department & Institution:</span>
                    <span className="ea-info-value">{selectedInquiry.department}</span>
                  </div>
                </div>
              </div>

              <div className="ea-modal-section">
                <h3><FileText size={18} /> Professional Experience</h3>
                <div className="ea-experience-text">
                  {selectedInquiry.post}
                </div>
              </div>

              <div className="ea-modal-section">
                <h3><Download size={18} /> Attached Files</h3>
                <div className="ea-files-grid">
                  <div className="ea-file-item">
                    <div className="ea-file-info">
                      <div className="ea-file-icon">📄</div>
                      <div>
                        <div className="ea-file-name">CV/Resume</div>
                        <div className="ea-file-size">{selectedInquiry.file}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(selectedInquiry.file, selectedInquiry.name)}
                      className="ea-file-download-btn"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                  <div className="ea-file-item">
                    <div className="ea-file-info">
                      <div className="ea-file-icon">🖼️</div>
                      <div>
                        <div className="ea-file-name">Professional Photo</div>
                        <div className="ea-file-size">{selectedInquiry.imgf}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(selectedInquiry.imgf, selectedInquiry.name)}
                      className="ea-file-download-btn"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorialApplications;