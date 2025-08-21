import React, { useState, useEffect, useMemo } from 'react';
import '../styles/ALLAdminArticlesPanel.css'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Plus,
  Calendar,
  User,
  FileText,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  BookOpen,
  Globe,
  Tag,
  Hash
} from 'lucide-react';

// Mock API service - replace with actual API calls
const ArticleService = {
  async fetchArticles(params = {}) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - only published articles
    const mockArticles = [
      {
        id: 'ART-001',
        title: 'Machine Learning Applications in Healthcare Data Analysis',
        authorName: 'Dr. Sarah Johnson',
        abstract: 'This study explores the implementation of machine learning algorithms in healthcare data analysis...',
        keywords: 'machine learning, healthcare, data analysis, AI',
        subject: 'Computer Science',
        country: 'USA',
        doi: '10.1234/example.2024.001',
        month: 'March',
        year: '2024',
        volume: '15',
        issue: '3',
        part: '1',
        pageNo: '45-67',
        referenceNo: 'REF-2024-001',
        specialIssue: true,
        status: 'published',
        publishDate: '2024-03-15',
        fileSize: '2.4 MB',
        downloadCount: 156,
        createdAt: '2024-03-01T10:30:00Z',
        updatedAt: '2024-03-15T14:45:00Z'
      },
      {
        id: 'ART-002',
        title: 'Climate Change Impact on Agricultural Productivity',
        authorName: 'Prof. Michael Chen',
        abstract: 'An comprehensive analysis of climate change effects on global agricultural systems...',
        keywords: 'climate change, agriculture, sustainability, environment',
        subject: 'Environmental Science',
        country: 'Canada',
        doi: '10.1234/example.2024.002',
        month: 'February',
        year: '2024',
        volume: '12',
        issue: '2',
        part: '1',
        pageNo: '23-41',
        referenceNo: 'REF-2024-002',
        specialIssue: false,
        status: 'published',
        publishDate: '2024-02-15',
        fileSize: '3.1 MB',
        downloadCount: 89,
        createdAt: '2024-02-15T09:20:00Z',
        updatedAt: '2024-02-20T11:30:00Z'
      }
    ];

    // Simulate filtering and pagination
    let filteredArticles = [...mockArticles];
    
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredArticles = filteredArticles.filter(article => 
        article.title.toLowerCase().includes(searchTerm) ||
        article.authorName.toLowerCase().includes(searchTerm) ||
        article.subject.toLowerCase().includes(searchTerm) ||
        article.keywords.toLowerCase().includes(searchTerm)
      );
    }

    if (params.year) {
      filteredArticles = filteredArticles.filter(article => article.year === params.year);
    }

    if (params.specialIssue) {
      const isSpecialIssue = params.specialIssue === 'true';
      filteredArticles = filteredArticles.filter(article => article.specialIssue === isSpecialIssue);
    }

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    return {
      articles: paginatedArticles,
      total: filteredArticles.length,
      page,
      limit,
      totalPages: Math.ceil(filteredArticles.length / limit)
    };
  },

  async deleteArticle(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Article deleted successfully' };
  },

  async downloadArticle(id) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate file download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `article_${id}.pdf`;
    link.click();
    return { success: true };
  }
};

const AdminArticlesPanel = () => {
  // State management
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedArticles, setSelectedArticles] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search state
  const [filters, setFilters] = useState({
    search: '',
    year: '',
    specialIssue: ''
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Load articles
  const loadArticles = async (newFilters = {}) => {
    try {
      setLoading(true);
      const params = { 
        ...filters, 
        ...newFilters,
        page: pagination.page,
        limit: pagination.limit 
      };
      
      const response = await ArticleService.fetchArticles(params);
      
      setArticles(response.articles);
      setPagination({
        ...pagination,
        total: response.total,
        totalPages: response.totalPages
      });
    } catch (error) {
      console.error('Error loading articles:', error);
      // Handle error (show notification, etc.)
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh data
  const handleRefresh = () => {
    setRefreshing(true);
    loadArticles();
  };

  // Initial load
  useEffect(() => {
    loadArticles();
  }, [pagination.page, pagination.limit]);

  // Filter change handler
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    loadArticles({ ...newFilters, page: 1 });
  };

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedArticles.size === articles.length) {
      setSelectedArticles(new Set());
    } else {
      setSelectedArticles(new Set(articles.map(article => article.id)));
    }
  };

  const handleSelectArticle = (id) => {
    const newSelected = new Set(selectedArticles);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedArticles(newSelected);
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await ArticleService.deleteArticle(id);
        setArticles(articles.filter(article => article.id !== id));
        // Show success notification
      } catch (error) {
        console.error('Error deleting article:', error);
        // Show error notification
      }
    }
  };

  // Download handler
  const handleDownload = async (id) => {
    try {
      await ArticleService.downloadArticle(id);
      // Show success notification
    } catch (error) {
      console.error('Error downloading article:', error);
      // Show error notification
    }
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      published: { label: 'Published', color: 'aap-status-published', icon: CheckCircle }
    };

    const config = statusConfig[status] || statusConfig.published;
    const Icon = config.icon;

    return (
      <span className={`aap-status-badge ${config.color}`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  // Memoized filter options
  const filterOptions = useMemo(() => {
    const years = [...new Set(articles.map(a => a.year))];
    
    return { years };
  }, [articles]);

  return (
    <div className="aap-container">
      {/* Header Section */}
      <div className="aap-header">
        <div className="aap-header-left">
          <div className="aap-header-icon">
            <BookOpen size={32} />
          </div>
          <div>
            <h1 className="aap-title">Articles Management</h1>
            <p className="aap-subtitle">
              Manage all published articles and submissions
            </p>
          </div>
        </div>
        <div className="aap-header-right">
          <button 
            className="aap-btn aap-btn-secondary"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? 'aap-spinning' : ''} />
            Refresh
          </button>
          <button className="aap-btn aap-btn-primary">
            <Plus size={16} />
            Add New Article
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="aap-stats-grid">
        <div className="aap-stat-card">
          <div className="aap-stat-icon aap-stat-icon-primary">
            <FileText size={24} />
          </div>
          <div className="aap-stat-content">
            <h3 className="aap-stat-number">{pagination.total}</h3>
            <p className="aap-stat-label">Total Articles</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="aap-filters-section">
        <div className="aap-search-bar">
          <Search size={20} className="aap-search-icon" />
          <input
            type="text"
            placeholder="Search articles by title, author, subject, or keywords..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="aap-search-input"
          />
        </div>
        
        <div className="aap-filter-controls">
          <button 
            className={`aap-btn aap-btn-outline ${showFilters ? 'aap-active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filters
          </button>
          
          {selectedArticles.size > 0 && (
            <div className="aap-bulk-actions">
              <span className="aap-selected-count">
                {selectedArticles.size} selected
              </span>
              <button className="aap-btn aap-btn-danger aap-btn-sm">
                <Trash2 size={14} />
                Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="aap-advanced-filters">
          <div className="aap-filter-grid">
            <div className="aap-filter-item">
              <label className="aap-filter-label">Year</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="aap-filter-select"
              >
                <option value="">All Years</option>
                {filterOptions.years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div className="aap-filter-item">
              <label className="aap-filter-label">Special Issue</label>
              <select
                value={filters.specialIssue}
                onChange={(e) => handleFilterChange('specialIssue', e.target.value)}
                className="aap-filter-select"
              >
                <option value="">All Articles</option>
                <option value="true">Special Issue Only</option>
                <option value="false">Regular Issue Only</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Articles Table */}
      <div className="aap-table-container">
        {loading ? (
          <div className="aap-loading">
            <div className="aap-spinner-large"></div>
            <p>Loading articles...</p>
          </div>
        ) : (
          <table className="aap-table">
            <thead>
              <tr>
                <th className="aap-th aap-th-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedArticles.size === articles.length && articles.length > 0}
                    onChange={handleSelectAll}
                    className="aap-checkbox"
                  />
                </th>
                <th className="aap-th">Article Details</th>
                <th className="aap-th">Author</th>
                <th className="aap-th">Publication Info</th>
                <th className="aap-th">Status</th>
                <th className="aap-th">Stats</th>
                <th className="aap-th aap-th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="aap-tr">
                  <td className="aap-td">
                    <input
                      type="checkbox"
                      checked={selectedArticles.has(article.id)}
                      onChange={() => handleSelectArticle(article.id)}
                      className="aap-checkbox"
                    />
                  </td>
                  
                  <td className="aap-td">
                    <div className="aap-article-info">
                      <h3 className="aap-article-title">{article.title}</h3>
                      <p className="aap-article-abstract">
                        {article.abstract.substring(0, 120)}...
                      </p>
                      <div className="aap-article-meta">
                        <span className="aap-meta-item">
                          <Hash size={12} />
                          {article.id}
                        </span>
                        <span className="aap-meta-item">
                          <Tag size={12} />
                          {article.keywords.split(',').slice(0, 2).join(', ')}
                          {article.keywords.split(',').length > 2 && '...'}
                        </span>
                        {article.specialIssue && (
                          <span className="aap-special-badge">Special Issue</span>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="aap-td">
                    <div className="aap-author-info">
                      <div className="aap-author-name">{article.authorName}</div>
                      <div className="aap-author-meta">
                        <Globe size={12} />
                        {article.country || 'Not specified'}
                      </div>
                    </div>
                  </td>
                  
                  <td className="aap-td">
                    <div className="aap-publication-info">
                      <div className="aap-pub-item">
                        <strong>Vol {article.volume}</strong>
                        {article.issue && `, Issue ${article.issue}`}
                      </div>
                      <div className="aap-pub-item">
                        {article.month} {article.year}
                      </div>
                      {article.pageNo && (
                        <div className="aap-pub-item">Pages: {article.pageNo}</div>
                      )}
                      <div className="aap-pub-subject">{article.subject}</div>
                    </div>
                  </td>
                  
                  <td className="aap-td">
                    <StatusBadge status={article.status} />
                    {article.publishDate && (
                      <div className="aap-publish-date">
                        <Calendar size={12} />
                        {new Date(article.publishDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  
                  <td className="aap-td">
                    <div className="aap-stats">
                      <div className="aap-stat-item">
                        <Download size={12} />
                        {article.downloadCount || 0}
                      </div>
                      <div className="aap-stat-item">
                        <FileText size={12} />
                        {article.fileSize}
                      </div>
                    </div>
                  </td>
                  
                  <td className="aap-td">
                    <div className="aap-actions">
                      <button
                        className="aap-action-btn aap-action-btn-primary"
                        onClick={() => handleDownload(article.id)}
                        title="Download PDF"
                      >
                        <Download size={16} />
                      </button>
                      
                      <button
                        className="aap-action-btn aap-action-btn-secondary"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      
                      <button
                        className="aap-action-btn aap-action-btn-secondary"
                        title="Edit Article"
                      >
                        <Edit size={16} />
                      </button>
                      
                      <button
                        className="aap-action-btn aap-action-btn-danger"
                        onClick={() => handleDelete(article.id)}
                        title="Delete Article"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && articles.length === 0 && (
          <div className="aap-empty-state">
            <FileText size={48} />
            <h3>No articles found</h3>
            <p>No articles match your current filters. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="aap-pagination">
          <div className="aap-pagination-info">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} articles
          </div>
          
          <div className="aap-pagination-controls">
            <button
              className="aap-pagination-btn"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            
            <div className="aap-pagination-numbers">
              {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
                const pageNum = Math.max(1, pagination.page - 2) + index;
                if (pageNum <= pagination.totalPages) {
                  return (
                    <button
                      key={pageNum}
                      className={`aap-pagination-number ${
                        pageNum === pagination.page ? 'aap-active' : ''
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}
            </div>
            
            <button
              className="aap-pagination-btn"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArticlesPanel;