import '../styles/Archive.css';
import React, { 
  useState, 
  useEffect, 
  useCallback, 
  useMemo, 
  useReducer,
  createContext,
  useContext,
  lazy,
  Suspense,
  memo,
  Component
} from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Download, 
  Calendar, 
  User, 
  BookOpen, 
  X, 
  Search,
  AlertCircle,
  Book,
  Users,
  FileText
} from 'lucide-react';


// Types (JSDoc typedefs for JS compatibility)

/**
 * @typedef {Object} Article
 * @property {number} id
 * @property {string} title
 * @property {string[]} authors
 * @property {string} publishedDate
 * @property {string} [thumbnail]
 * @property {string} abstract
 * @property {number} [volumeNumber]
 * @property {number} [issueNumber]
 * @property {string} [partName]
 * @property {number} [year]
 * @property {string} [fullArticleUrl]
 * @property {string} [abstractUrl]
 * @property {string} [doi]
 * @property {string} [pages]
 * @property {string[]} [keywords]
 */

/**
 * @typedef {Object} Part
 * @property {number} id
 * @property {string} name
 * @property {string} description
 */

/**
 * @typedef {Object} Issue
 * @property {number} id
 * @property {number} issueNumber
 * @property {string} publishedDate
 * @property {Part[]} parts
 */

/**
 * @typedef {Object} Volume
 * @property {number} id
 * @property {number} volumeNumber
 * @property {number} year
 * @property {Issue[]} issues
 */

/**
 * @typedef {Object} ArchiveData
 * @property {Volume[]} volumes
 */

/**
 * @typedef {Object} ArchiveState
 * @property {Volume[]} volumes
 * @property {Volume[]} filteredVolumes
 * @property {Article[]} allArticles
 * @property {boolean} loading
 * @property {string|null} error
 * @property {Set<number>} expandedVolumes
 * @property {Set<number>} expandedIssues
 * @property {Set<number>} expandedParts
 * @property {string} searchTerm
 * @property {string} selectedYear
 * @property {Article|null} selectedArticle
 * @property {boolean} modalOpen
 * @property {Set<string>} downloadingArticles
 */

/**
 * @typedef {Object} ArchiveContextValue
 * @property {ArchiveState} state
 * @property {Function} dispatch
 */

// Context
const ArchiveContext = createContext(/** @type {ArchiveContextValue|null} */ (null));

// Custom Hook
const useArchive = () => {
  const context = useContext(ArchiveContext);
  if (!context) {
    throw new Error('useArchive must be used within ArchiveProvider');
  }
  return context;
};

// Reducer
const archiveReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_VOLUMES':
      return { ...state, volumes: action.payload };
    case 'SET_FILTERED_VOLUMES':
      return { ...state, filteredVolumes: action.payload };
    case 'SET_ALL_ARTICLES':
      return { ...state, allArticles: action.payload };
    case 'TOGGLE_VOLUME':
      const newExpandedVolumes = new Set(state.expandedVolumes);
      if (newExpandedVolumes.has(action.payload)) {
        newExpandedVolumes.delete(action.payload);
      } else {
        newExpandedVolumes.add(action.payload);
      }
      return { ...state, expandedVolumes: newExpandedVolumes };
    case 'TOGGLE_ISSUE':
      const newExpandedIssues = new Set(state.expandedIssues);
      if (newExpandedIssues.has(action.payload)) {
        newExpandedIssues.delete(action.payload);
      } else {
        newExpandedIssues.add(action.payload);
      }
      return { ...state, expandedIssues: newExpandedIssues };
    case 'TOGGLE_PART':
      const newExpandedParts = new Set(state.expandedParts);
      if (newExpandedParts.has(action.payload)) {
        newExpandedParts.delete(action.payload);
      } else {
        newExpandedParts.add(action.payload);
      }
      return { ...state, expandedParts: newExpandedParts };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_SELECTED_YEAR':
      return { ...state, selectedYear: action.payload };
    case 'SET_SELECTED_ARTICLE':
      return { ...state, selectedArticle: action.payload };
    case 'SET_MODAL_OPEN':
      return { ...state, modalOpen: action.payload };
    case 'ADD_DOWNLOADING_ARTICLE':
      return { 
        ...state, 
        downloadingArticles: new Set([...state.downloadingArticles, action.payload])
      };
    case 'REMOVE_DOWNLOADING_ARTICLE':
      const newDownloading = new Set(state.downloadingArticles);
      newDownloading.delete(action.payload);
      return { ...state, downloadingArticles: newDownloading };
    default:
      return state;
  }
};

// Mock Data Service
const DataService = {
  async fetchArchive() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          volumes: [
            {
              id: 1,
              volumeNumber: 5,
              year: 2024,
              issues: [
                {
                  id: 1,
                  issueNumber: 1,
                  publishedDate: '2024-03-15',
                  parts: [
                    { id: 1, name: 'Part A', description: 'Research Articles' },
                    { id: 2, name: 'Part B', description: 'Review Articles' }
                  ]
                },
                {
                  id: 2,
                  issueNumber: 2,
                  publishedDate: '2024-06-15',
                  parts: [
                    { id: 3, name: 'Part A', description: 'Research Articles' }
                  ]
                }
              ]
            },
            {
              id: 2,
              volumeNumber: 4,
              year: 2023,
              issues: [
                {
                  id: 3,
                  issueNumber: 1,
                  publishedDate: '2023-03-15',
                  parts: [
                    { id: 4, name: 'Part A', description: 'Research Articles' }
                  ]
                }
              ]
            }
          ]
        });
      }, 100);
    });
  },

  async fetchArticles(partId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const articles = {
          1: [
            {
              id: 1,
              title: 'Advanced Machine Learning Techniques in Biomedical Research',
              authors: ['Dr. Sarah Johnson', 'Prof. Michael Chen'],
              publishedDate: '2024-03-01',
              abstract: 'This paper explores the application of advanced machine learning techniques...',
              fullArticleUrl: '/downloads/articles/article-1-full.pdf',
              abstractUrl: '/downloads/abstracts/article-1-abstract.pdf',
              doi: '10.1234/journal.2024.001',
              keywords: ['machine learning', 'biomedical research']
            },
            {
              id: 2,
              title: 'Quantum Computing Applications in Drug Discovery',
              authors: ['Dr. Emily Rodriguez'],
              publishedDate: '2024-03-05',
              abstract: 'Recent developments in quantum computing have opened new possibilities...',
              fullArticleUrl: '/downloads/articles/article-2-full.pdf',
              abstractUrl: '/downloads/abstracts/article-2-abstract.pdf'
            }
          ],
          2: [
            {
              id: 3,
              title: 'Systematic Review of Neural Network Architectures',
              authors: ['Prof. David Kim', 'Dr. Lisa Wang'],
              publishedDate: '2024-03-10',
              abstract: 'This comprehensive review examines the evolution of neural network architectures...',
              fullArticleUrl: '/downloads/articles/article-3-full.pdf',
              abstractUrl: '/downloads/abstracts/article-3-abstract.pdf'
            }
          ],
          3: [
            {
              id: 4,
              title: 'Climate Change Impact on Marine Ecosystems',
              authors: ['Dr. Robert Thompson', 'Dr. Maria Garcia'],
              publishedDate: '2024-06-01',
              abstract: 'Global climate change continues to pose significant threats to marine biodiversity...',
              fullArticleUrl: '/downloads/articles/article-4-full.pdf',
              abstractUrl: '/downloads/abstracts/article-4-abstract.pdf'
            }
          ],
          4: [
            {
              id: 5,
              title: 'Renewable Energy Storage Solutions',
              authors: ['Prof. James Wilson'],
              publishedDate: '2023-03-15',
              abstract: 'The transition to renewable energy sources requires efficient storage solutions...',
              fullArticleUrl: '/downloads/articles/article-5-full.pdf',
              abstractUrl: '/downloads/abstracts/article-5-abstract.pdf'
            }
          ]
        };
        resolve({ articles: articles[partId] || [] });
      }, 200);
    });
  },

  async fetchArticleDetails(articleId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const details = {
          1: {
            id: 1,
            title: 'Advanced Machine Learning Techniques in Biomedical Research',
            authors: ['Dr. Sarah Johnson', 'Prof. Michael Chen'],
            publishedDate: '2024-03-01',
            abstract: 'This paper explores the application of advanced machine learning techniques in biomedical research, focusing on deep learning algorithms for medical image analysis, natural language processing for clinical data extraction, and predictive modeling for patient outcomes. We present novel approaches that have shown significant improvements over traditional statistical methods, with applications in radiology, pathology, and personalized medicine. Our findings demonstrate the potential of AI-driven solutions to enhance diagnostic accuracy and treatment efficacy.',
            fullArticleUrl: '/downloads/articles/article-1-full.pdf',
            abstractUrl: '/downloads/abstracts/article-1-abstract.pdf',
            doi: '10.1234/journal.2024.001',
            pages: '1-15',
            keywords: ['machine learning', 'biomedical research', 'deep learning', 'medical imaging']
          }
        };
        resolve(details[articleId] || null);
      }, 150);
    });
  }
};

// Utility Functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Error Boundary
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Archive component error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent 
          error={this.state.error} 
          errorInfo={this.state.errorInfo}
          reset={() => this.setState({ hasError: false, error: null, errorInfo: null })} 
        />
      );
    }
    return this.props.children;
  }
}

// Default Error Fallback
const DefaultErrorFallback = ({ error, reset }) => (
  <div className="error-container">
    <div className="error-content">
      <AlertCircle className="error-icon" size={48} />
      <h2>Something went wrong!</h2>
      <p>{error?.message || 'An unexpected error occurred'}</p>
      <button onClick={reset} className="retry-btn">
        Try Again
      </button>
    </div>
  </div>
);

// Loading Skeleton
const LoadingSkeleton = memo(() => (
  <div className="loading-container">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="skeleton-item">
        <div className="skeleton-header" />
        <div className="skeleton-content">
          <div className="skeleton-line" />
          <div className="skeleton-line short" />
        </div>
      </div>
    ))}
  </div>
));

// Components
const SearchControls = memo(() => {
  const { state, dispatch } = useArchive();

  const debouncedSearch = useMemo(
    () => debounce((term) => {
      dispatch({ type: 'SET_SEARCH_TERM', payload: sanitizeInput(term) });
    }, 300),
    [dispatch]
  );

  const handleSearchChange = useCallback((e) => {
    debouncedSearch(e.target.value);
  }, [debouncedSearch]);

  const handleYearChange = useCallback((e) => {
    dispatch({ type: 'SET_SELECTED_YEAR', payload: e.target.value });
  }, [dispatch]);

  const availableYears = useMemo(() => 
    [...new Set(state.volumes.map(volume => volume.year))].sort((a, b) => b - a)
  , [state.volumes]);

  return (
    <div className="search-controls" role="search" aria-label="Archive search">
      <div className="search-input-wrapper">
        <div className="search-icon" aria-hidden="true">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Search articles by title or author..."
          className="search-input"
          onChange={handleSearchChange}
          aria-label="Search articles by title or author"
        />
      </div>
      <div className="filter-wrapper">
        <select
          className="year-filter"
          value={state.selectedYear}
          onChange={handleYearChange}
          aria-label="Filter articles by year"
        >
          <option value="all">All Years</option>
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
    </div>
  );
});

SearchControls.displayName = 'SearchControls';

const StatsSection = memo(() => {
  const { state } = useArchive();

  const stats = useMemo(() => {
    const totalIssues = state.volumes.reduce((sum, vol) => sum + vol.issues.length, 0);
    const totalAuthors = [...new Set(state.allArticles.flatMap(article => article.authors))].length;
    
    return {
      articles: state.allArticles.length,
      issues: totalIssues,
      authors: totalAuthors
    };
  }, [state.volumes, state.allArticles]);

  return (
    <div className="stats-section" role="region" aria-label="Archive statistics">
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">{stats.articles}+</div>
          <div className="stat-label">Articles</div>
          <FileText className="stat-icon" aria-hidden="true" />
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.issues}+</div>
          <div className="stat-label">Issues</div>
          <Book className="stat-icon" aria-hidden="true" />
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.authors}+</div>
          <div className="stat-label">Authors</div>
          <Users className="stat-icon" aria-hidden="true" />
        </div>
        <div className="stat-card highlight">
          <div className="stat-number">Free</div>
          <div className="stat-label">Access</div>
          <BookOpen className="stat-icon" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
});

StatsSection.displayName = 'StatsSection';

const ArticleCard = memo(({ 
  article, 
  onClick 
}) => {
  const handleClick = useCallback(() => onClick(article), [article, onClick]);
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(article);
    }
  }, [article, onClick]);

  return (
    <div 
      className="article-card" 
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View article: ${article.title}`}
    >
      <div className="article-content">
        <h4 className="article-title">{article.title}</h4>
        <div className="article-meta">
          <div className="meta-item">
            <User size={14} aria-hidden="true" />
            <span>{article.authors.join(', ')}</span>
          </div>
          <div className="meta-item">
            <Calendar size={14} aria-hidden="true" />
            <time dateTime={article.publishedDate}>
              {new Date(article.publishedDate).toLocaleDateString()}
            </time>
          </div>
        </div>
      </div>
      {article.thumbnail && (
        <div className="article-thumbnail">
          <img src={article.thumbnail} alt="" loading="lazy" />
        </div>
      )}
    </div>
  );
});

ArticleCard.displayName = 'ArticleCard';

const ArticleModal = memo(() => {
  const { state, dispatch } = useArchive();

  const handleClose = useCallback(() => {
    dispatch({ type: 'SET_MODAL_OPEN', payload: false });
    dispatch({ type: 'SET_SELECTED_ARTICLE', payload: null });
  }, [dispatch]);

  const handleDownload = useCallback((url, type) => {
    const downloadKey = `${url}-${type}`;
    dispatch({ type: 'ADD_DOWNLOADING_ARTICLE', payload: downloadKey });
    
    // Simulate download
    setTimeout(() => {
      dispatch({ type: 'REMOVE_DOWNLOADING_ARTICLE', payload: downloadKey });
    }, 2000);
  }, [dispatch]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  }, [handleClose]);

  useEffect(() => {
    if (state.modalOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [state.modalOpen, handleKeyDown]);

  if (!state.modalOpen || !state.selectedArticle) return null;

  const article = state.selectedArticle;
  const isDownloading = (url, type) => 
    state.downloadingArticles.has(`${url}-${type}`);

  return (
    <div 
      className="modal-overlay" 
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">{article.title}</h2>
          <button 
            className="modal-close" 
            onClick={handleClose} 
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="article-info">
            <div className="info-item">
              <User size={16} aria-hidden="true" />
              <span>Authors: {article.authors.join(', ')}</span>
            </div>
            <div className="info-item">
              <Calendar size={16} aria-hidden="true" />
              <span>Published: {new Date(article.publishedDate).toLocaleDateString()}</span>
            </div>
            {article.doi && (
              <div className="info-item">
                <BookOpen size={16} aria-hidden="true" />
                <span>DOI: {article.doi}</span>
              </div>
            )}
          </div>

          <div className="abstract-section">
            <h3>Abstract</h3>
            <p>{article.abstract}</p>
          </div>

          <div className="download-actions">
            {article.fullArticleUrl && (
              <button
                className={`download-btn primary ${isDownloading(article.fullArticleUrl, 'full') ? 'downloading' : ''}`}
                onClick={() => handleDownload(article.fullArticleUrl, 'full')}
                disabled={isDownloading(article.fullArticleUrl, 'full')}
                aria-describedby="download-full-desc"
              >
                <Download size={18} aria-hidden="true" />
                {isDownloading(article.fullArticleUrl, 'full') ? 'Downloading...' : 'Download Full Article'}
              </button>
            )}
            {article.abstractUrl && (
              <button
                className={`download-btn secondary ${isDownloading(article.abstractUrl, 'abstract') ? 'downloading' : ''}`}
                onClick={() => handleDownload(article.abstractUrl, 'abstract')}
                disabled={isDownloading(article.abstractUrl, 'abstract')}
                aria-describedby="download-abstract-desc"
              >
                <Download size={18} aria-hidden="true" />
                {isDownloading(article.abstractUrl, 'abstract') ? 'Downloading...' : 'Download Abstract'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ArticleModal.displayName = 'ArticleModal';

const PartSection = memo(({ part, isExpanded, onToggle, articleCount }) => {
  const { dispatch } = useArchive();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchData = async () => {
      if (isExpanded && articles.length === 0) {
        setLoading(true);
        try {
          const response = await DataService.fetchArticles(part.id);
          if (isMounted && !abortController.signal.aborted) {
            setArticles(response.articles);
          }
        } catch (error) {
          if (isMounted && !abortController.signal.aborted) {
            console.error('Failed to fetch articles:', error);
          }
        } finally {
          if (isMounted && !abortController.signal.aborted) {
            setLoading(false);
          }
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [isExpanded, articles.length, part.id]);

  const handleArticleClick = useCallback(async (article) => {
    try {
      const fullArticle = await DataService.fetchArticleDetails(article.id);
      if (fullArticle) {
        dispatch({ type: 'SET_SELECTED_ARTICLE', payload: fullArticle });
        dispatch({ type: 'SET_MODAL_OPEN', payload: true });
      }
    } catch (error) {
      console.error('Failed to fetch article details:', error);
    }
  }, [dispatch]);

  return (
    <div className="part-section">
      <button 
        className="part-header" 
        onClick={onToggle} 
        aria-expanded={isExpanded}
        aria-controls={`part-content-${part.id}`}
        aria-describedby={`part-description-${part.id}`}
      >
        <div className="part-info">
          <span className="part-name">{part.name}</span>
          <div className="part-meta">
            <span className="part-description" id={`part-description-${part.id}`}>
              {part.description}
            </span>
            <span className="article-count">({articleCount} articles)</span>
          </div>
        </div>
        <div className="chevron-icon" aria-hidden="true">
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </button>

      {isExpanded && (
        <div className="part-content" id={`part-content-${part.id}`}>
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div className="articles-grid">
              {articles.map(article => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onClick={handleArticleClick}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

PartSection.displayName = 'PartSection';

const IssueSection = memo(({ issue, volumeNumber, isExpanded, onToggle, getArticleCount }) => {
  const { state, dispatch } = useArchive();

  const togglePart = useCallback((partId) => {
    dispatch({ type: 'TOGGLE_PART', payload: partId });
  }, [dispatch]);

  return (
    <div className="issue-section">
      <button 
        className="issue-header" 
        onClick={onToggle} 
        aria-expanded={isExpanded}
        aria-controls={`issue-content-${issue.id}`}
      >
        <div className="issue-title-section">
          <h3 className="issue-title">
            Volume {volumeNumber} – Issue {issue.issueNumber}
          </h3>
          <time className="issue-date" dateTime={issue.publishedDate}>
            {new Date(issue.publishedDate).toLocaleDateString()}
          </time>
        </div>
        <div className="chevron-icon" aria-hidden="true">
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </button>

      {isExpanded && (
        <div className="issue-content" id={`issue-content-${issue.id}`}>
          {issue.parts.map(part => (
            <PartSection
              key={part.id}
              part={part}
              isExpanded={state.expandedParts.has(part.id)}
              onToggle={() => togglePart(part.id)}
              articleCount={getArticleCount(part.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
});

IssueSection.displayName = 'IssueSection';

const VolumeSection = memo(({ volume, isExpanded, onToggle, getArticleCount }) => {
  const { state, dispatch } = useArchive();

  const toggleIssue = useCallback((issueId) => {
    dispatch({ type: 'TOGGLE_ISSUE', payload: issueId });
  }, [dispatch]);

  return (
    <div className="volume-section">
      <button 
        className="volume-header" 
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`volume-content-${volume.id}`}
      >
        <h2 className="volume-title">Volume {volume.volumeNumber} ({volume.year})</h2>
        <div className="chevron-icon" aria-hidden="true">
          {isExpanded ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
        </div>
      </button>

      {isExpanded && (
        <div className="volume-content" id={`volume-content-${volume.id}`}>
          {volume.issues.map(issue => (
            <IssueSection
              key={issue.id}
              issue={issue}
              volumeNumber={volume.volumeNumber}
              isExpanded={state.expandedIssues.has(issue.id)}
              onToggle={() => toggleIssue(issue.id)}
              getArticleCount={getArticleCount}
            />
          ))}
        </div>
      )}
    </div>
  );
});

VolumeSection.displayName = 'VolumeSection';

// Main Archive Hook
const useArchiveLogic = () => {
  const { state, dispatch } = useArchive();

  const loadArchiveData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const data = await DataService.fetchArchive();
      dispatch({ type: 'SET_VOLUMES', payload: data.volumes });

      // Load all articles for search functionality
      const articles = [];
      for (const volume of data.volumes) {
        for (const issue of volume.issues) {
          for (const part of issue.parts) {
            try {
              const articleData = await DataService.fetchArticles(part.id);
              articles.push(...articleData.articles.map(article => ({
                ...article,
                volumeNumber: volume.volumeNumber,
                issueNumber: issue.issueNumber,
                partName: part.name,
                year: volume.year
              })));
            } catch (err) {
              console.error('Failed to fetch articles for part:', part.id, err);
            }
          }
        }
      }
      dispatch({ type: 'SET_ALL_ARTICLES', payload: articles });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load archive data' });
      console.error('Archive data loading failed:', err);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  const filterContent = useCallback(() => {
    let filtered = [...state.volumes];

    if (state.selectedYear !== 'all') {
      filtered = filtered.filter(volume => volume.year.toString() === state.selectedYear);
    }

    if (state.searchTerm.trim()) {
      const searchLower = state.searchTerm.toLowerCase();
      const matchingArticles = state.allArticles.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        article.authors.some(author => author.toLowerCase().includes(searchLower))
      );

      if (matchingArticles.length > 0) {
        filtered = filtered.map(volume => {
          const volumeArticles = matchingArticles.filter(article => article.volumeNumber === volume.volumeNumber);
          if (volumeArticles.length === 0) return null;

          const filteredIssues = volume.issues.map(issue => {
            const issueArticles = volumeArticles.filter(article => article.issueNumber === issue.issueNumber);
            if (issueArticles.length === 0) return null;

            const filteredParts = issue.parts.filter(part =>
              issueArticles.some(article => article.partName === part.name)
            );

            return filteredParts.length > 0 ? { ...issue, parts: filteredParts } : null;
          }).filter(Boolean);

          return filteredIssues.length > 0 ? { ...volume, issues: filteredIssues } : null;
        }).filter(Boolean);
      } else {
        filtered = [];
      }
    }

    dispatch({ type: 'SET_FILTERED_VOLUMES', payload: filtered });
  }, [state.volumes, state.searchTerm, state.selectedYear, state.allArticles, dispatch]);

  const getArticleCount = useCallback((partId) => {
    return state.allArticles.filter(article => {
      const matchingVolume = state.volumes.find(v => v.volumeNumber === article.volumeNumber);
      if (!matchingVolume) return false;
      const matchingIssue = matchingVolume.issues.find(i => i.issueNumber === article.issueNumber);
      if (!matchingIssue) return false;
      const matchingPart = matchingIssue.parts.find(p => p.name === article.partName);
      return matchingPart && matchingPart.id === partId;
    }).length;
  }, [state.allArticles, state.volumes]);

  const toggleVolume = useCallback((volumeId) => {
    dispatch({ type: 'TOGGLE_VOLUME', payload: volumeId });
  }, [dispatch]);

  useEffect(() => {
    loadArchiveData();
  }, [loadArchiveData]);

  useEffect(() => {
    filterContent();
  }, [filterContent]);

  return {
    loadArchiveData,
    getArticleCount,
    toggleVolume
  };
};

const ArchiveProvider = ({ children }) => {
  const initialState = {
    volumes: [],
    filteredVolumes: [],
    allArticles: [],
    loading: false,
    error: null,
    expandedVolumes: new Set(),
    expandedIssues: new Set(),
    expandedParts: new Set(),
    searchTerm: '',
    selectedYear: 'all',
    selectedArticle: null,
    modalOpen: false,
    downloadingArticles: new Set()
  };

  const [state, dispatch] = useReducer(archiveReducer, initialState);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <ArchiveContext.Provider value={contextValue}>
      {children}
    </ArchiveContext.Provider>
  );
};

ArchiveProvider.displayName = 'ArchiveProvider';

// Archive Content Component
const ArchiveContent = memo(() => {
  const { state } = useArchive();
  const { loadArchiveData, getArticleCount, toggleVolume } = useArchiveLogic();

  if (state.loading) {
    return (
      <div className="archive-container">
        <div className="archive-header">
          <h1>Journal Archive</h1>
        </div>
        <div className="archive-content">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="archive-container">
        <div className="archive-header">
          <h1>Journal Archive</h1>
        </div>
        <div className="archive-content">
          <div className="error-message">
            <AlertCircle size={48} className="error-icon" />
            <h2>Error Loading Archive</h2>
            <p>{state.error}</p>
            <button onClick={loadArchiveData} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="archive-container">
      {/* Header */}
      <header className="archive-header">
        <div className="header-content">
          <h1>Journal Archive</h1>
          <p className="archive-header-subtitle">
            Explore our comprehensive collection of peer-reviewed research articles, 
            spanning multiple volumes and covering cutting-edge developments in science and technology.
          </p>
        </div>
      </header>

      {/* Statistics */}
      <StatsSection />

      {/* Main Content */}
      <main className="archive-content">
        {/* Search Controls */}
        <SearchControls />

        {/* Results */}
        {state.filteredVolumes.length === 0 ? (
          <div className="no-results" role="status">
            <div className="no-results-content">
              <div className="no-results-icon" aria-hidden="true">📚</div>
              <h3>No Results Found</h3>
              <p>
                No articles found matching your search criteria. 
                Try adjusting your search terms or year filter.
              </p>
            </div>
          </div>
        ) : (
          <div className="volumes-list" role="region" aria-label="Archive volumes">
            {state.filteredVolumes.map(volume => (
              <VolumeSection
                key={volume.id}
                volume={volume}
                isExpanded={state.expandedVolumes.has(volume.id)}
                onToggle={() => toggleVolume(volume.id)}
                getArticleCount={getArticleCount}
              />
            ))}
          </div>
        )}
      </main>

      {/* Article Modal */}
      <ArticleModal />

      {/* Footer */}
      <footer className="archive-footer">
        <div className="footer-content">
          <div className="footer-main">
            <h2>About Our Archive</h2>
            <p>
              The International Journal of Agricultural Research and Emerging Innovations (IJAREI)
              maintains a comprehensive digital archive of peer-reviewed research articles,
              review papers, and scholarly contributions. Our archive serves researchers,
              academicians, and professionals worldwide with free access to cutting-edge
              agricultural research and innovations.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">🔓</div>
              <h3>Open Access Policy</h3>
              <p>All articles are freely available for download without subscription or payment.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">📖</div>
              <h3>Citation Guidelines</h3>
              <p>Proper citation format and DOI links are provided for academic referencing.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">✅</div>
              <h3>Quality Assurance</h3>
              <p>All published articles undergo rigorous peer-review process.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
});

ArchiveContent.displayName = 'ArchiveContent';

// Main Archive Component
const Archive = () => {
  return (
    <ErrorBoundary>
      <ArchiveProvider>
        <Suspense fallback={<LoadingSkeleton />}>
          <ArchiveContent />
        </Suspense>
      </ArchiveProvider>
    </ErrorBoundary>
  );
};

Archive.displayName = 'Archive';

export default Archive;