import React, { useState, useEffect } from 'react';
import '../styles/VolumeManagement.css'; 
import { ChevronRight, Plus, Trash2, ArrowLeft } from 'lucide-react';

const VolumeManagement = () => {
  // States
  const [currentView, setCurrentView] = useState('volumes'); // 'volumes', 'issues', 'parts'
  const [selectedVolume, setSelectedVolume] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  
  // Data states
  const [volumes, setVolumes] = useState([]);
  const [issues, setIssues] = useState([]);
  const [parts, setParts] = useState([]);
  
  // Modal states
  const [showVolumeModal, setShowVolumeModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showPartModal, setShowPartModal] = useState(false);
  
  // Form states
  const [volumeForm, setVolumeForm] = useState({ number: '', year: '' });
  const [issueForm, setIssueForm] = useState({ number: '' });
  const [partForm, setPartForm] = useState({ title: '' });
  
  // Enhanced functionality
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Sample data for testing
  const sampleVolumes = [
    { id: 1, number: '1', year: '2024', created_at: '2024-01-15T00:00:00Z' },
    { id: 2, number: '2', year: '2024', created_at: '2024-02-15T00:00:00Z' },
    { id: 3, number: '3', year: '2023', created_at: '2023-12-15T00:00:00Z' }
  ];

  const sampleIssues = [
    { id: 1, volume_id: 1, number: '1', created_at: '2024-01-20T00:00:00Z' },
    { id: 2, volume_id: 1, number: '2', created_at: '2024-01-25T00:00:00Z' },
    { id: 3, volume_id: 2, number: '1', created_at: '2024-02-20T00:00:00Z' }
  ];

  const sampleParts = [
    { id: 1, issue_id: 1, title: 'Editorial', created_at: '2024-01-22T00:00:00Z' },
    { id: 2, issue_id: 1, title: 'Article 1', created_at: '2024-01-23T00:00:00Z' },
    { id: 3, issue_id: 2, title: 'Feature Story', created_at: '2024-01-26T00:00:00Z' }
  ];

  // Utility functions
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const validateVolumeForm = () => {
    if (!volumeForm.number.trim()) {
      showToast('Please enter volume number', 'error');
      return false;
    }
    if (!volumeForm.year.trim()) {
      showToast('Please enter year', 'error');
      return false;
    }
    if (!/^\d{4}$/.test(volumeForm.year)) {
      showToast('Please enter a valid year (4 digits)', 'error');
      return false;
    }
    return true;
  };

  const validateIssueForm = () => {
    if (!issueForm.number.trim()) {
      showToast('Please enter issue number', 'error');
      return false;
    }
    return true;
  };

  const validatePartForm = () => {
    if (!partForm.title.trim()) {
      showToast('Please enter part title', 'error');
      return false;
    }
    return true;
  };

  const showConfirm = (message) => {
    return window.confirm(message);
  };

  // Load data functions
  const loadVolumes = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setVolumes(sampleVolumes);
    } catch (error) {
      showToast('Failed to load volumes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadIssues = async (volumeId) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const filteredIssues = sampleIssues.filter(issue => issue.volume_id === volumeId);
      setIssues(filteredIssues);
    } catch (error) {
      showToast('Failed to load issues', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadParts = async (issueId) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const filteredParts = sampleParts.filter(part => part.issue_id === issueId);
      setParts(filteredParts);
    } catch (error) {
      showToast('Failed to load parts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVolumes();
  }, []);

  // Volume operations
  const handleAddVolume = async () => {
    if (!validateVolumeForm()) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newVolume = {
        id: Date.now(),
        number: volumeForm.number,
        year: volumeForm.year,
        created_at: new Date().toISOString()
      };
      
      setVolumes([...volumes, newVolume]);
      setVolumeForm({ number: '', year: '' });
      setShowVolumeModal(false);
      showToast('Volume added successfully');
      
    } catch (error) {
      showToast('Error adding volume', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVolume = async (volumeId) => {
    if (!showConfirm('Are you sure you want to delete this volume?')) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setVolumes(volumes.filter(vol => vol.id !== volumeId));
      showToast('Volume deleted successfully');
    } catch (error) {
      showToast('Error deleting volume', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Issue operations
  const handleAddIssue = async () => {
    if (!validateIssueForm()) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newIssue = {
        id: Date.now(),
        volume_id: selectedVolume.id,
        number: issueForm.number,
        created_at: new Date().toISOString()
      };
      
      setIssues([...issues, newIssue]);
      setIssueForm({ number: '' });
      setShowIssueModal(false);
      showToast('Issue added successfully');
      
    } catch (error) {
      showToast('Error adding issue', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIssue = async (issueId) => {
    if (!showConfirm('Are you sure you want to delete this issue?')) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setIssues(issues.filter(issue => issue.id !== issueId));
      showToast('Issue deleted successfully');
    } catch (error) {
      showToast('Error deleting issue', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Part operations
  const handleAddPart = async () => {
    if (!validatePartForm()) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newPart = {
        id: Date.now(),
        issue_id: selectedIssue.id,
        title: partForm.title,
        created_at: new Date().toISOString()
      };
      
      setParts([...parts, newPart]);
      setPartForm({ title: '' });
      setShowPartModal(false);
      showToast('Part added successfully');
      
    } catch (error) {
      showToast('Error adding part', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePart = async (partId) => {
    if (!showConfirm('Are you sure you want to delete this part?')) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setParts(parts.filter(part => part.id !== partId));
      showToast('Part deleted successfully');
    } catch (error) {
      showToast('Error deleting part', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Navigation functions
  const openVolume = (volume) => {
    setSelectedVolume(volume);
    setCurrentView('issues');
    loadIssues(volume.id);
  };

  const openIssue = (issue) => {
    setSelectedIssue(issue);
    setCurrentView('parts');
    loadParts(issue.id);
  };

  const goBack = () => {
    if (currentView === 'parts') {
      setCurrentView('issues');
      setSelectedIssue(null);
    } else if (currentView === 'issues') {
      setCurrentView('volumes');
      setSelectedVolume(null);
    }
  };

  const Breadcrumb = () => (
    <div className="volume-breadcrumb">
      <span onClick={() => {
        setCurrentView('volumes');
        setSelectedVolume(null);
        setSelectedIssue(null);
      }}>
        Volumes
      </span>
      {selectedVolume && (
        <>
          <ChevronRight size={16} className="volume-breadcrumb-chevron" />
          <span onClick={() => setCurrentView('issues')}>
            Volume {selectedVolume.number} ({selectedVolume.year})
          </span>
        </>
      )}
      {selectedIssue && (
        <>
          <ChevronRight size={16} className="volume-breadcrumb-chevron" />
          <span>Issue {selectedIssue.number}</span>
        </>
      )}
    </div>
  );

  return (
    <div className="volume-management">
      {toast.show && (
        <div className={`volume-toast ${toast.type === 'error' ? 'volume-toast-error' : 'volume-toast-success'}`}>
          <p className="volume-toast-message">{toast.message}</p>
        </div>
      )}
      
      <Breadcrumb />
      
      {currentView !== 'volumes' && (
        <button className="volume-back-button" onClick={goBack} disabled={loading}>
          <ArrowLeft size={16} />
          Back
        </button>
      )}

      {loading && (
        <div className="volume-loading">
          <div className="volume-loading-spinner"></div>
          <p className="volume-loading-text">Loading...</p>
        </div>
      )}

      {/* Volumes View */}
      {currentView === 'volumes' && !loading && (
        <div className="volume-view-container">
          <div className="volume-view-header">
            <h2 className="volume-view-title">Volumes ({volumes.length})</h2>
            <button className="volume-add-button" onClick={() => setShowVolumeModal(true)}>
              <Plus size={16} />
              Add New Volume
            </button>
          </div>
          
          {volumes.length === 0 ? (
            <div className="volume-empty-state">
              <p className="volume-empty-message">No volumes available. Add a new volume to get started.</p>
            </div>
          ) : (
            <div className="volume-table-container">
              <table className="volume-table">
                <thead>
                  <tr>
                    <th>Volume Number</th>
                    <th>Year</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {volumes.map((volume) => (
                    <tr key={volume.id}>
                      <td className="volume-table-clickable" onClick={() => openVolume(volume)}>
                        Volume {volume.number}
                      </td>
                      <td>{volume.year}</td>
                      <td>{new Date(volume.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="volume-table-actions">
                          <button className="volume-delete-button" onClick={() => handleDeleteVolume(volume.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Issues View */}
      {currentView === 'issues' && selectedVolume && !loading && (
        <div className="volume-view-container">
          <div className="volume-view-header">
            <h2 className="volume-view-title">Issues - Volume {selectedVolume.number} ({selectedVolume.year}) ({issues.length})</h2>
            <button className="volume-add-button" onClick={() => setShowIssueModal(true)}>
              <Plus size={16} />
              Add New Issue
            </button>
          </div>
          
          {issues.length === 0 ? (
            <div className="volume-empty-state">
              <p className="volume-empty-message">No issues available for this volume. Add a new issue to get started.</p>
            </div>
          ) : (
            <div className="volume-table-container">
              <table className="volume-table">
                <thead>
                  <tr>
                    <th>Issue Number</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue) => (
                    <tr key={issue.id}>
                      <td className="volume-table-clickable" onClick={() => openIssue(issue)}>
                        Issue {issue.number}
                      </td>
                      <td>{new Date(issue.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="volume-table-actions">
                          <button className="volume-delete-button" onClick={() => handleDeleteIssue(issue.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Parts View */}
      {currentView === 'parts' && selectedIssue && !loading && (
        <div className="volume-view-container">
          <div className="volume-view-header">
            <h2 className="volume-view-title">Parts - Issue {selectedIssue.number} ({parts.length})</h2>
            <button className="volume-add-button" onClick={() => setShowPartModal(true)}>
              <Plus size={16} />
              Add New Part
            </button>
          </div>
          
          {parts.length === 0 ? (
            <div className="volume-empty-state">
              <p className="volume-empty-message">No parts available for this issue. Add a new part to get started.</p>
            </div>
          ) : (
            <div className="volume-table-container">
              <table className="volume-table">
                <thead>
                  <tr>
                    <th>Part Title</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.map((part) => (
                    <tr key={part.id}>
                      <td>{part.title}</td>
                      <td>{new Date(part.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="volume-table-actions">
                          <button className="volume-delete-button" onClick={() => handleDeletePart(part.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Volume Modal */}
      {showVolumeModal && (
        <div className="volume-modal-overlay">
          <div className="volume-modal">
            <div className="volume-modal-header">
              <h3 className="volume-modal-title">Add New Volume</h3>
            </div>
            <div className="volume-modal-body">
              <div className="volume-form-group">
                <label className="volume-form-label">Volume Number:</label>
                <input
                  className="volume-form-input"
                  type="text"
                  value={volumeForm.number}
                  onChange={(e) => setVolumeForm({ ...volumeForm, number: e.target.value })}
                  placeholder="Enter volume number"
                  disabled={loading}
                />
              </div>
              <div className="volume-form-group">
                <label className="volume-form-label">Year:</label>
                <input
                  className="volume-form-input"
                  type="text"
                  value={volumeForm.year}
                  onChange={(e) => setVolumeForm({ ...volumeForm, year: e.target.value })}
                  placeholder="Enter year (e.g., 2024)"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="volume-modal-footer">
              <button
                className="volume-modal-button volume-modal-button-cancel"
                onClick={() => {
                  setShowVolumeModal(false);
                  setVolumeForm({ number: '', year: '' });
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button className="volume-modal-button volume-modal-button-primary" onClick={handleAddVolume} disabled={loading}>
                {loading ? 'Processing...' : 'Add Volume'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Issue Modal */}
      {showIssueModal && (
        <div className="volume-modal-overlay">
          <div className="volume-modal">
            <div className="volume-modal-header">
              <h3 className="volume-modal-title">Add New Issue</h3>
            </div>
            <div className="volume-modal-body">
              <div className="volume-form-group">
                <label className="volume-form-label">Issue Number:</label>
                <input
                  className="volume-form-input"
                  type="text"
                  value={issueForm.number}
                  onChange={(e) => setIssueForm({ ...issueForm, number: e.target.value })}
                  placeholder="Enter issue number"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="volume-modal-footer">
              <button
                className="volume-modal-button volume-modal-button-cancel"
                onClick={() => {
                  setShowIssueModal(false);
                  setIssueForm({ number: '' });
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button className="volume-modal-button volume-modal-button-primary" onClick={handleAddIssue} disabled={loading}>
                {loading ? 'Processing...' : 'Add Issue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Part Modal */}
      {showPartModal && (
        <div className="volume-modal-overlay">
          <div className="volume-modal">
            <div className="volume-modal-header">
              <h3 className="volume-modal-title">Add New Part</h3>
            </div>
            <div className="volume-modal-body">
              <div className="volume-form-group">
                <label className="volume-form-label">Part Title:</label>
                <input
                  className="volume-form-input"
                  type="text"
                  value={partForm.title}
                  onChange={(e) => setPartForm({ ...partForm, title: e.target.value })}
                  placeholder="Enter part title"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="volume-modal-footer">
              <button
                className="volume-modal-button volume-modal-button-cancel"
                onClick={() => {
                  setShowPartModal(false);
                  setPartForm({ title: '' });
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button className="volume-modal-button volume-modal-button-primary" onClick={handleAddPart} disabled={loading}>
                {loading ? 'Processing...' : 'Add Part'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolumeManagement;