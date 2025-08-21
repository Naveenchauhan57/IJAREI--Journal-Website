import React, { useState, useEffect } from 'react';
import { ExternalLink, Award, Check, Globe, BookOpen, Users, Shield } from 'lucide-react';
import '../styles/IndexingRecognitionPage.css';

const IndexingRecognitionPage = () => {
  // State management for backend data
  const [indexingData, setIndexingData] = useState([]);
  const [trustBadges, setTrustBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for demonstration (replace with actual API endpoints)
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
    },
    {
      id: 5,
      name: "ResearchGate",
      logo: "https://www.researchgate.net/favicon.ico",
      description: "Social networking platform for researchers and academics worldwide.",
      profileLink: "https://www.researchgate.net/journal/Journal-Name",
      yearIndexed: 2020,
      hasProfile: true
    },
    {
      id: 6,
      name: "Dimensions",
      logo: "https://www.dimensions.ai/favicon.ico",
      description: "Research information platform linking publications, grants, and policy documents.",
      profileLink: "https://app.dimensions.ai/discover/publication",
      yearIndexed: 2023,
      hasProfile: true
    }
  ];

  const mockTrustBadges = [
    { id: 1, name: "Peer-Reviewed", icon: Users, description: "Rigorous peer review process" },
    { id: 2, name: "Open Access", icon: BookOpen, description: "Free access to all content" },
    { id: 3, name: "ISSN Registered", icon: Globe, description: "Official ISSN registration" },
    { id: 4, name: "CrossRef Member", icon: Check, description: "DOI assignment capability" },
    { id: 5, name: "Quality Assured", icon: Shield, description: "Meets international standards" }
  ];

  // Simulate API call to fetch indexing data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Replace these with actual API endpoints
        // const indexingResponse = await fetch('/api/indexing-data');
        // const indexingJson = await indexingResponse.json();
        // const badgesResponse = await fetch('/api/trust-badges');
        // const badgesJson = await badgesResponse.json();
        
        // Simulate network delay
        
        
        // Use mock data (replace with actual API responses)
        setIndexingData(mockIndexingData);
        setTrustBadges(mockTrustBadges);
        
      } catch (err) {
        setError('Failed to load indexing data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-message">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="indexing-recognition-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Our Journal is Indexed & Recognized Globally
          </h1>
          <p className="hero-subtitle">
            We are proud to be listed in globally recognized academic and research databases,
            ensuring maximum visibility and accessibility for published research.
          </p>
        </div>
      </section>

      {/* Logo Grid Section */}
      <section className="logo-grid-section">
        <div className="container">
          <h2 className="section-title">
            Indexed In Leading Academic Databases
          </h2>
          <div className="indexing-grid">
            {indexingData.map((platform) => (
              <div key={platform.id} className="indexing-logo">
                <div className="logo-container">
                  <img 
                    src={platform.logo} 
                    alt={`${platform.name} logo`}
                    className="logo-image"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="logo-fallback">
                    <span>{platform.name.charAt(0)}</span>
                  </div>
                </div>
                <span className="logo-name">{platform.name}</span>
                {platform.hasProfile && (
                  <a 
                    href={platform.profileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-link"
                  >
                    <ExternalLink className="external-link-icon" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Indexing Cards Section */}
      <section className="indexing-cards-section">
        <div className="container">
          <h2 className="section-title">Database Profiles & Recognition</h2>
          <p className="section-description">
            Explore our presence across major academic and research platforms
          </p>
          <div className="cards-grid">
            {indexingData.map((platform) => (
              <div key={platform.id} className="indexing-card">
                <div className="card-header">
                  <div className="card-logo-container">
                    <img 
                      src={platform.logo} 
                      alt={`${platform.name} logo`}
                      className="card-logo-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="card-logo-fallback">
                      <span>{platform.name.charAt(0)}</span>
                    </div>
                  </div>
                  <h3 className="card-title">{platform.name}</h3>
                </div>
                <p className="card-description">{platform.description}</p>
                {platform.hasProfile && (
                  <a 
                    href={platform.profileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-link"
                  >
                    View Profile
                    <ExternalLink className="card-link-icon" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Indexed Table Section */}
      <section className="indexed-table-section">
        <div className="container">
          <h2 className="section-title">Complete Indexing Overview</h2>
          <div className="table-wrapper">
            <table className="indexing-table">
              <thead>
                <tr>
                  <th>Database Name</th>
                  <th>Profile Link</th>
                  <th>Year Indexed</th>
                </tr>
              </thead>
              <tbody>
                {indexingData.map((platform) => (
                  <tr key={platform.id}>
                    <td>
                      <div className="table-name-cell">
                        <div className="table-logo-container">
                          <img 
                            src={platform.logo} 
                            alt={`${platform.name} logo`}
                            className="table-logo-image"
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="table-logo-fallback">
                            <span>{platform.name.charAt(0)}</span>
                          </div>
                        </div>
                        <span className="table-name">{platform.name}</span>
                      </div>
                    </td>
                    <td>
                      {platform.hasProfile ? (
                        <a 
                          href={platform.profileLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="table-link"
                        >
                          View Profile
                          <ExternalLink className="table-link-icon" />
                        </a>
                      ) : (
                        <span className="coming-soon">Coming Soon</span>
                      )}
                    </td>
                    <td className="year-cell">{platform.yearIndexed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="trust-badges-section">
        <div className="container">
          <h2 className="section-title">Quality & Trust Indicators</h2>
          <p className="section-description">
            Our commitment to academic excellence and publishing standards
          </p>
          <div className="trust-badges">
            {trustBadges.map((badge) => {
              const IconComponent = badge.icon;
              return (
                <div key={badge.id} className="trust-badge">
                  <div className="badge-icon-container">
                    <IconComponent className="badge-icon" />
                  </div>
                  <h3 className="badge-title">{badge.name}</h3>
                  <p className="badge-description">{badge.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Join Our Global Research Community</h2>
          <p className="cta-description">
            Submit your research to a journal that's recognized worldwide
          </p>
          <div className="cta-buttons">
            <button className="cta-button-primary">Submit Article</button>
            <button className="cta-button-secondary">Learn More</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IndexingRecognitionPage;