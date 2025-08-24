import React, { useState, useEffect } from 'react';
import "../styles/ManuscriptSubmissions.css";
import { 
  Eye, 
  Download, 
  X, 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  FileText, 
  Calendar,
  Search,
  Filter,
  File
} from 'lucide-react';

const ManuscriptAdmin = () => {
  const [manuscripts, setManuscripts] = useState([]);
  const [selectedManuscript, setSelectedManuscript] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setManuscripts([
        {
          id: 1,
          name: "Dr. Rajesh Kumar Singh",
          email: "rajesh.singh@agri-university.edu",
          contactNumber: "+91 98765 43210",
          articleTitle: "Impact of Organic Farming on Soil Health and Crop Productivity in Northern India",
          subject: "This research investigates the long-term effects of organic farming practices on soil health indicators and crop productivity across different agro-climatic zones in Northern India. The study was conducted over a period of 5 years (2019-2024) covering 150 farms transitioning from conventional to organic farming methods. Key parameters analyzed include soil organic carbon, microbial activity, nutrient availability, and yield variations in major crops like wheat, rice, and sugarcane. Results indicate a significant improvement in soil health with 25% increase in organic matter content and 40% enhancement in beneficial microbial population. Crop yields showed initial decline in the first two years but stabilized and improved by 15-20% in years 3-5 compared to conventional methods.",
          file: "organic_farming_soil_health_research.pdf",
          submittedAt: "2024-12-15T14:30:00Z",
          status: "pending"
        },
        {
          id: 2,
          name: "Prof. Priya Sharma",
          email: "priya.sharma@iari.res.in",
          contactNumber: "+91 87654 32109",
          articleTitle: "Development of Drought-Resistant Wheat Varieties Using CRISPR-Cas9 Technology",
          subject: "Climate change has intensified drought conditions globally, severely affecting wheat production. This study presents the development of drought-resistant wheat varieties using CRISPR-Cas9 gene editing technology. We targeted specific genes responsible for water use efficiency and stress tolerance mechanisms in wheat. The research involved creating transgenic lines with enhanced drought tolerance through precise gene modifications. Field trials conducted across three drought-prone regions showed remarkable results with 30-35% better survival rates and maintained grain quality under water stress conditions. The developed varieties demonstrated 45% less water requirement while maintaining comparable yields to traditional varieties under normal conditions. This breakthrough has significant implications for sustainable wheat production in arid and semi-arid regions.",
          file: "drought_resistant_wheat_crispr_study.pdf",
          submittedAt: "2024-12-14T11:22:00Z",
          status: "pending"
        },
        {
          id: 3,
          name: "Dr. Mohammed Ali Hassan",
          email: "m.hassan@agricultural-college.org",
          contactNumber: "+91 96543 21087",
          articleTitle: "Smart Irrigation Systems: IoT-Based Precision Water Management in Cotton Cultivation",
          subject: "Water scarcity and inefficient irrigation practices are major challenges in cotton cultivation. This research presents an innovative IoT-based smart irrigation system designed specifically for cotton farming. The system integrates soil moisture sensors, weather data, plant growth stages, and machine learning algorithms to optimize irrigation scheduling. Implementation across 50 cotton farms in Gujarat and Maharashtra showed significant improvements in water use efficiency and crop outcomes. The system reduced water consumption by 40% while increasing cotton yield by 22% compared to traditional flood irrigation methods. Real-time monitoring capabilities allowed farmers to make data-driven decisions, resulting in improved fiber quality and reduced input costs. The study also includes economic analysis showing 35% increase in net profit margins for adopting farmers.",
          file: "smart_irrigation_iot_cotton_farming.docx",
          submittedAt: "2024-12-13T16:45:00Z",
          status: "pending"
        },
        {
          id: 4,
          name: "Dr. Anita Kumari",
          email: "anita.kumari@horticulture.ac.in",
          contactNumber: "+91 94321 87650",
          articleTitle: "Biofortification of Tomatoes with Zinc and Iron: Nutritional Enhancement Through Selective Breeding",
          subject: "Micronutrient deficiency is a global health concern, particularly zinc and iron deficiency affecting over 2 billion people worldwide. This study focuses on biofortification of tomatoes through selective breeding techniques to enhance zinc and iron content. We developed new tomato varieties with significantly higher micronutrient levels without compromising taste, texture, or shelf life. The research involved screening 200 tomato genotypes for mineral content and selecting superior lines for further breeding. Advanced analytical techniques were used to quantify mineral bioavailability in the developed varieties. Results show 60% increase in zinc content and 45% increase in iron content compared to conventional varieties. Consumer acceptance trials indicated no significant difference in taste preferences. This research contributes to addressing malnutrition through biofortified crops and provides a sustainable solution for improving nutritional security.",
          file: "tomato_biofortification_zinc_iron.pdf",
          submittedAt: "2024-12-12T09:15:00Z",
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

  const handleView = (manuscript) => {
    setSelectedManuscript(manuscript);
    setIsPopupOpen(true);
  };

  const handleDownload = (filename, manuscriptTitle) => {
    // Simulate file download
    const link = document.createElement('a');
    link.href = `#`; // Replace with actual file URL
    link.download = filename;
    link.click();
    
    // Show success message
    alert(`Downloading ${filename} for "${manuscriptTitle}"`);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedManuscript(null);
  };

  const filteredManuscripts = manuscripts.filter(manuscript =>
    manuscript.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manuscript.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manuscript.articleTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="ma-admin-panel">
        <div className="ma-main-content">
          <div className="ma-content-header">
            <h1 className="ma-content-title">Manuscript Submissions</h1>
            <div className="ma-breadcrumb">
              <span>Admin</span>
              <span>›</span>
              <span>Manuscripts</span>
            </div>
          </div>
          <div className="ma-content-body">
            <div className="ma-loading-container">
              <div className="ma-loading-spinner"></div>
              <p>Loading manuscript submissions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ma-admin-panel">
      <div className="ma-main-content">
        <div className="ma-content-header">
          <h1 className="ma-content-title">Manuscript Submissions</h1>
          <div className="ma-breadcrumb">
            <span>Admin</span>
            <span>›</span>
            <span>Manuscripts</span>
          </div>
        </div>
        
        <div className="ma-content-body">
          {/* Search and Filter Section */}
          <div className="ma-controls-section">
            <div className="ma-stats-container">
              <div className="ma-stat-item">
                <span className="ma-stat-number">{manuscripts.length}</span>
                <span className="ma-stat-label">Total Submissions</span>
              </div>
            </div>
          </div>

          {/* Manuscripts Table */}
          <div className="ma-table-container">
            <div className="ma-table-header">
              <h2>Recent Manuscript Submissions</h2>
              <p>Review and manage submitted research manuscripts</p>
            </div>
            
            <div className="ma-table-wrapper">
              <table className="ma-manuscripts-table">
                <thead>
                  <tr>
                    <th>Author</th>
                    <th>Article Title</th>
                    <th>Abstract Preview</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredManuscripts.map((manuscript) => (
                    <tr key={manuscript.id} className="ma-table-row">
                      <td>
                        <div className="ma-author-info">
                          <div className="ma-author-avatar">
                            {manuscript.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ma-author-details">
                            <div className="ma-author-name">{manuscript.name}</div>
                            <div className="ma-author-email">{manuscript.email}</div>
                            <div className="ma-author-contact">{manuscript.contactNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="ma-article-title">
                          {truncateText(manuscript.articleTitle, 80)}
                        </div>
                      </td>
                      <td>
                        <div className="ma-abstract-preview">
                          {truncateText(manuscript.subject, 120)}
                        </div>
                      </td>
                      <td>
                        <div className="ma-date-info">
                          {formatDate(manuscript.submittedAt)}
                        </div>
                      </td>
                      <td>
                        <div className="ma-actions">
                          <button
                            onClick={() => handleView(manuscript)}
                            className="ma-action-btn ma-view-btn"
                            title="View Details"
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <button
                            onClick={() => handleDownload(manuscript.file, manuscript.articleTitle)}
                            className="ma-action-btn ma-download-btn"
                            title="Download Manuscript"
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
        </div>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && selectedManuscript && (
        <div className="ma-modal-overlay" onClick={closePopup}>
          <div className="ma-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="ma-modal-header">
              <h2>Manuscript Details</h2>
              <button onClick={closePopup} className="ma-modal-close">
                <X size={20} />
              </button>
            </div>
            
            <div className="ma-modal-body">
              <div className="ma-modal-section">
                <h3><User size={18} /> Author Information</h3>
                <div className="ma-info-grid">
                  <div className="ma-info-item">
                    <span className="ma-info-label">Author Name:</span>
                    <span className="ma-info-value">{selectedManuscript.name}</span>
                  </div>
                  <div className="ma-info-item">
                    <span className="ma-info-label">Email:</span>
                    <span className="ma-info-value">{selectedManuscript.email}</span>
                  </div>
                  <div className="ma-info-item">
                    <span className="ma-info-label">Contact:</span>
                    <span className="ma-info-value">{selectedManuscript.contactNumber}</span>
                  </div>
                  <div className="ma-info-item">
                    <span className="ma-info-label">Submitted:</span>
                    <span className="ma-info-value">{formatDate(selectedManuscript.submittedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="ma-modal-section">
                <h3><BookOpen size={18} /> Article Information</h3>
                <div className="ma-info-grid">
                  <div className="ma-info-item ma-full-width">
                    <span className="ma-info-label">Article Title:</span>
                    <span className="ma-info-value">{selectedManuscript.articleTitle}</span>
                  </div>
                </div>
              </div>

              <div className="ma-modal-section">
                <h3><FileText size={18} /> Abstract / Subject</h3>
                <div className="ma-abstract-text">
                  {selectedManuscript.subject}
                </div>
              </div>

              <div className="ma-modal-section">
                <h3><File size={18} /> Attached Manuscript</h3>
                <div className="ma-file-container">
                  <div className="ma-file-item">
                    <div className="ma-file-info">
                      <div className="ma-file-icon">
                        {selectedManuscript.file.endsWith('.pdf') ? '📄' : '📝'}
                      </div>
                      <div>
                        <div className="ma-file-name">Research Manuscript</div>
                        <div className="ma-file-size">{selectedManuscript.file}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(selectedManuscript.file, selectedManuscript.articleTitle)}
                      className="ma-file-download-btn"
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

export default ManuscriptAdmin;