import '../styles/IndexingManagement.css';
import React, { useState, useEffect } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    ExternalLink,
    Image,
    Calendar,
    Link,
    FileText,
    Database,
    Search,
    Check,
    AlertCircle
} from 'lucide-react';

const IndexingManagement = () => {
    const [indexingList, setIndexingList] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        logo: '',
        description: '',
        profileLink: '',
        yearIndexed: new Date().getFullYear(),
        hasProfile: true
    });

    const [formErrors, setFormErrors] = useState({});

    const mockIndexingData = [
        {
            id: 1,
            name: "Google Scholar",
            logo: "https://scholar.google.com/favicon.ico",
            description: "Comprehensive academic search engine for scholarly literature across disciplines.",
            profileLink: "https://scholar.google.com/citations?user=example",
            yearIndexed: 2020,
            hasProfile: true
        },
        {
            id: 2,
            name: "CrossRef",
            logo: "https://www.crossref.org/favicon.ico",
            description: "Official Digital Object Identifier (DOI) registration agency for academic content.",
            profileLink: "https://search.crossref.org/?q=journal-name",
            yearIndexed: 2019,
            hasProfile: true
        },
        {
            id: 3,
            name: "DOAJ",
            logo: "https://doaj.org/static/doaj/images/favicon.ico",
            description: "Directory of Open Access Journals promoting quality open access publishing.",
            profileLink: "https://doaj.org/toc/1234-5678",
            yearIndexed: 2021,
            hasProfile: true
        },
        {
            id: 4,
            name: "Scopus",
            logo: "https://www.elsevier.com/favicon.ico",
            description: "Elsevier's abstract and citation database covering peer-reviewed literature.",
            profileLink: "https://www.scopus.com/sourceid/12345",
            yearIndexed: 2022,
            hasProfile: true
        }
    ];

    useEffect(() => {
        setIndexingList(mockIndexingData);
    }, []);

    const validateForm = () => {
        const errors = {};
        
        if (!formData.name.trim()) {
            errors.name = 'Database name is required';
        }
        
        if (!formData.description.trim()) {
            errors.description = 'Description is required';
        }
        
        if (formData.hasProfile && !formData.profileLink.trim()) {
            errors.profileLink = 'Profile link is required when profile is enabled';
        }
        
        if (formData.profileLink && !isValidURL(formData.profileLink)) {
            errors.profileLink = 'Please enter a valid URL';
        }
        
        if (!formData.yearIndexed || formData.yearIndexed < 1990 || formData.yearIndexed > new Date().getFullYear() + 1) {
            errors.yearIndexed = 'Please enter a valid year';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const isValidURL = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        if (editingIndex !== null) {
            setIndexingList(prev => prev.map((item, index) => 
                index === editingIndex 
                    ? { ...formData, id: item.id }
                    : item
            ));
        } else {
            const newEntry = {
                ...formData,
                id: Date.now()
            };
            setIndexingList(prev => [...prev, newEntry]);
        }

        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            logo: '',
            description: '',
            profileLink: '',
            yearIndexed: new Date().getFullYear(),
            hasProfile: true
        });
        setFormErrors({});
        setIsFormOpen(false);
        setEditingIndex(null);
    };

    const handleEdit = (index) => {
        const item = indexingList[index];
        setFormData(item);
        setEditingIndex(index);
        setIsFormOpen(true);
    };

    const handleDelete = (index) => {
        setIndexingList(prev => prev.filter((_, i) => i !== index));
        setShowDeleteConfirm(null);
    };

    const filteredData = indexingList.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesYear = !selectedYear || item.yearIndexed.toString() === selectedYear;
        return matchesSearch && matchesYear;
    });

    const uniqueYears = [...new Set(indexingList.map(item => item.yearIndexed))].sort((a, b) => b - a);

    return (
        <div className="idx-mgmt-container">
            <div className="idx-mgmt-wrapper">
                {/* Header */}
                <div className="idx-mgmt-header">
                    <div className="idx-mgmt-header-content">
                        <div>
                            <div className="idx-mgmt-title-section">
                                <div className="idx-mgmt-icon-wrapper">
                                    <Database className="idx-mgmt-title-icon" />
                                </div>
                                <h1 className="idx-mgmt-title">
                                    Indexing Management
                                </h1>
                            </div>
                            <p className="idx-mgmt-subtitle">
                                Manage journal indexing databases and their information
                            </p>
                        </div>
                        <button 
                            className="idx-mgmt-add-btn"
                            onClick={() => setIsFormOpen(true)}
                        >
                            <Plus size={20} />
                            Add Indexing Database
                        </button>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="idx-mgmt-filters-section">
                    <div className="idx-mgmt-filters-content">
                        <div className="idx-mgmt-search-controls">
                            <div className="idx-mgmt-search-wrapper">
                                <Search className="idx-mgmt-search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search databases..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="idx-mgmt-search-input"
                                />
                            </div>
                            
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="idx-mgmt-year-select"
                            >
                                <option value="">All Years</option>
                                {uniqueYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        <div className="idx-mgmt-view-toggle">
                            <button
                                className={`idx-mgmt-view-btn ${viewMode === 'grid' ? 'idx-mgmt-view-active' : 'idx-mgmt-view-inactive'}`}
                                onClick={() => setViewMode('grid')}
                            >
                                Grid View
                            </button>
                            <button
                                className={`idx-mgmt-view-btn idx-mgmt-view-btn-right ${viewMode === 'table' ? 'idx-mgmt-view-active' : 'idx-mgmt-view-inactive'}`}
                                onClick={() => setViewMode('table')}
                            >
                                Table View
                            </button>
                        </div>
                    </div>

                    <div className="idx-mgmt-results-count">
                        {filteredData.length} database{filteredData.length !== 1 ? 's' : ''} found
                    </div>
                </div>

                {/* Content Area */}
                {viewMode === 'grid' ? (
                    <div className="idx-mgmt-grid">
                        {filteredData.map((item, index) => (
                            <div key={item.id} className="idx-mgmt-card">
                                <div className="idx-mgmt-card-content">
                                    <div className="idx-mgmt-card-header">
                                        <div className="idx-mgmt-card-logo-section">
                                            <div className="idx-mgmt-logo-wrapper">
                                                {item.logo ? (
                                                    <img 
                                                        src={item.logo} 
                                                        alt={`${item.name} logo`}
                                                        className="idx-mgmt-logo-img"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.parentNode.innerHTML = `<div class="idx-mgmt-logo-fallback">${item.name.charAt(0)}</div>`;
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="idx-mgmt-logo-fallback">
                                                        {item.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="idx-mgmt-card-actions">
                                            <button
                                                className="idx-mgmt-action-btn idx-mgmt-edit-btn"
                                                onClick={() => handleEdit(indexingList.findIndex(i => i.id === item.id))}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="idx-mgmt-action-btn idx-mgmt-delete-btn"
                                                onClick={() => setShowDeleteConfirm(item.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="idx-mgmt-card-title">
                                        {item.name}
                                    </h3>
                                    <p className="idx-mgmt-card-description">
                                        {item.description}
                                    </p>
                                    
                                    <div className="idx-mgmt-card-badges">
                                        <span className="idx-mgmt-badge idx-mgmt-year-badge">
                                            <Calendar size={10} />
                                            {item.yearIndexed}
                                        </span>
                                        {item.hasProfile && (
                                            <span className="idx-mgmt-badge idx-mgmt-profile-badge">
                                                <Check size={10} />
                                                Has Profile
                                            </span>
                                        )}
                                    </div>

                                    {item.hasProfile && item.profileLink && (
                                        <a
                                            href={item.profileLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="idx-mgmt-profile-link"
                                        >
                                            <ExternalLink size={14} />
                                            View Profile
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="idx-mgmt-table-container">
                        <div className="idx-mgmt-table-wrapper">
                            <table className="idx-mgmt-table">
                                <thead className="idx-mgmt-table-header">
                                    <tr>
                                        <th className="idx-mgmt-table-th">Database</th>
                                        <th className="idx-mgmt-table-th">Description</th>
                                        <th className="idx-mgmt-table-th">Year</th>
                                        <th className="idx-mgmt-table-th">Profile</th>
                                        <th className="idx-mgmt-table-th">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="idx-mgmt-table-body">
                                    {filteredData.map((item) => (
                                        <tr key={item.id} className="idx-mgmt-table-row">
                                            <td className="idx-mgmt-table-td">
                                                <div className="idx-mgmt-table-name-cell">
                                                    <div className="idx-mgmt-table-logo-wrapper">
                                                        {item.logo ? (
                                                            <img 
                                                                src={item.logo} 
                                                                alt={`${item.name} logo`}
                                                                className="idx-mgmt-table-logo-img"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.parentNode.innerHTML = `<div class="idx-mgmt-table-logo-fallback">${item.name.charAt(0)}</div>`;
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="idx-mgmt-table-logo-fallback">
                                                                {item.name.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="idx-mgmt-table-name">{item.name}</div>
                                                </div>
                                            </td>
                                            <td className="idx-mgmt-table-td">
                                                <div className="idx-mgmt-table-description">{item.description}</div>
                                            </td>
                                            <td className="idx-mgmt-table-td">
                                                <span className="idx-mgmt-table-year-badge">
                                                    {item.yearIndexed}
                                                </span>
                                            </td>
                                            <td className="idx-mgmt-table-td">
                                                {item.hasProfile && item.profileLink ? (
                                                    <a
                                                        href={item.profileLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="idx-mgmt-table-profile-link"
                                                    >
                                                        <ExternalLink size={12} />
                                                        View
                                                    </a>
                                                ) : (
                                                    <span className="idx-mgmt-table-no-profile">No Profile</span>
                                                )}
                                            </td>
                                            <td className="idx-mgmt-table-td">
                                                <div className="idx-mgmt-table-actions">
                                                    <button
                                                        className="idx-mgmt-action-btn idx-mgmt-edit-btn"
                                                        onClick={() => handleEdit(indexingList.findIndex(i => i.id === item.id))}
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        className="idx-mgmt-action-btn idx-mgmt-delete-btn"
                                                        onClick={() => setShowDeleteConfirm(item.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Form Modal */}
                {isFormOpen && (
                    <div className="idx-mgmt-modal-overlay">
                        <div className="idx-mgmt-modal">
                            <div className="idx-mgmt-modal-header">
                                <h2 className="idx-mgmt-modal-title">
                                    {editingIndex !== null ? 'Edit Indexing Database' : 'Add Indexing Database'}
                                </h2>
                                <button className="idx-mgmt-modal-close" onClick={resetForm}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="idx-mgmt-modal-content">
                                <div className="idx-mgmt-form-grid">
                                    <div>
                                        <label className="idx-mgmt-form-label">
                                            <div className="idx-mgmt-label-with-icon">
                                                <Database size={16} />
                                                Database Name *
                                            </div>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className={`idx-mgmt-form-input ${formErrors.name ? 'idx-mgmt-input-error' : ''}`}
                                            placeholder="e.g., Google Scholar"
                                        />
                                        {formErrors.name && (
                                            <div className="idx-mgmt-error-message">
                                                <AlertCircle size={14} />
                                                {formErrors.name}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="idx-mgmt-form-label">
                                            <div className="idx-mgmt-label-with-icon">
                                                <Calendar size={16} />
                                                Year Indexed *
                                            </div>
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.yearIndexed}
                                            onChange={(e) => handleInputChange('yearIndexed', parseInt(e.target.value))}
                                            className={`idx-mgmt-form-input ${formErrors.yearIndexed ? 'idx-mgmt-input-error' : ''}`}
                                            min="1990"
                                            max={new Date().getFullYear() + 1}
                                        />
                                        {formErrors.yearIndexed && (
                                            <div className="idx-mgmt-error-message">
                                                <AlertCircle size={14} />
                                                {formErrors.yearIndexed}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="idx-mgmt-form-field">
                                    <label className="idx-mgmt-form-label">
                                        <div className="idx-mgmt-label-with-icon">
                                            <Image size={16} />
                                            Logo URL
                                        </div>
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.logo}
                                        onChange={(e) => handleInputChange('logo', e.target.value)}
                                        className="idx-mgmt-form-input"
                                        placeholder="https://example.com/logo.png"
                                    />
                                    <p className="idx-mgmt-form-help">
                                        Provide a direct link to the database logo (optional)
                                    </p>
                                </div>

                                <div className="idx-mgmt-form-field">
                                    <label className="idx-mgmt-form-label">
                                        <div className="idx-mgmt-label-with-icon">
                                            <FileText size={16} />
                                            Description *
                                        </div>
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className={`idx-mgmt-form-textarea ${formErrors.description ? 'idx-mgmt-input-error' : ''}`}
                                        rows={3}
                                        placeholder="Brief description of the database..."
                                    />
                                    {formErrors.description && (
                                        <div className="idx-mgmt-error-message">
                                            <AlertCircle size={14} />
                                            {formErrors.description}
                                        </div>
                                    )}
                                </div>

                                <div className="idx-mgmt-form-field">
                                    <label className="idx-mgmt-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.hasProfile}
                                            onChange={(e) => handleInputChange('hasProfile', e.target.checked)}
                                            className="idx-mgmt-checkbox"
                                        />
                                        <span className="idx-mgmt-checkbox-text">
                                            This database has a profile/listing page
                                        </span>
                                    </label>
                                </div>

                                {formData.hasProfile && (
                                    <div className="idx-mgmt-form-field">
                                        <label className="idx-mgmt-form-label">
                                            <div className="idx-mgmt-label-with-icon">
                                                <Link size={16} />
                                                Profile Link *
                                            </div>
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.profileLink}
                                            onChange={(e) => handleInputChange('profileLink', e.target.value)}
                                            className={`idx-mgmt-form-input ${formErrors.profileLink ? 'idx-mgmt-input-error' : ''}`}
                                            placeholder="https://example.com/journal-profile"
                                        />
                                        {formErrors.profileLink && (
                                            <div className="idx-mgmt-error-message">
                                                <AlertCircle size={14} />
                                                {formErrors.profileLink}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="idx-mgmt-form-actions">
                                    <button 
                                        type="button" 
                                        className="idx-mgmt-cancel-btn"
                                        onClick={resetForm}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="button" 
                                        className="idx-mgmt-submit-btn"
                                        onClick={handleSubmit}
                                    >
                                        <Save size={16} />
                                        {editingIndex !== null ? 'Update Database' : 'Add Database'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="idx-mgmt-modal-overlay">
                        <div className="idx-mgmt-confirm-modal">
                            <div className="idx-mgmt-confirm-content">
                                <h3 className="idx-mgmt-confirm-title">Confirm Delete</h3>
                                <p className="idx-mgmt-confirm-text">Are you sure you want to delete this indexing database?</p>
                                <p className="idx-mgmt-confirm-warning">This action cannot be undone.</p>
                                <div className="idx-mgmt-confirm-actions">
                                    <button 
                                        className="idx-mgmt-cancel-btn"
                                        onClick={() => setShowDeleteConfirm(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        className="idx-mgmt-confirm-delete-btn"
                                        onClick={() => handleDelete(indexingList.findIndex(i => i.id === showDeleteConfirm))}
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {filteredData.length === 0 && (
                    <div className="idx-mgmt-empty-state">
                        <Database size={48} className="idx-mgmt-empty-icon" />
                        <h3 className="idx-mgmt-empty-title">No Indexing Databases Found</h3>
                        <p className="idx-mgmt-empty-text">
                            {searchTerm || selectedYear 
                                ? 'No databases match your current filters.' 
                                : 'Start by adding your first indexing database.'
                            }
                        </p>
                        {!searchTerm && !selectedYear && (
                            <button 
                                className="idx-mgmt-empty-btn"
                                onClick={() => setIsFormOpen(true)}
                            >
                                <Plus size={16} />
                                Add First Database
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default IndexingManagement;