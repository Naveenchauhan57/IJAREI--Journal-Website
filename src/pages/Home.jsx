import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BookOpen, Users, Globe, Leaf, Award, ArrowRight, Download, Eye, FileText, CheckCircle, Calendar, Mail, Phone, ChevronRight, Star, TrendingUp, Shield, Play, ExternalLink, Search, Quote, BarChart3, Microscope, Wheat, Droplets, Sun, Zap, AlertCircle, Loader2, Clock, Heart, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// API Configuration
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  ENDPOINTS: {
    ARTICLES: '/articles/latest',
    NEWSLETTER: '/newsletter/subscribe'
  }
};

// Custom Hook for Recent Articles
const useRecentArticles = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ARTICLES}?limit=3`);
      if (!response.ok) throw new Error('Failed to fetch articles');
      const result = await response.json();
      setData(result.articles || []);
    } catch (err) {
      setError(err.message);
      console.error('API Error for recent articles:', err);
      // Fallback to demo data if API fails
      setData([
        {
          id: 1,
          title: "Climate-Smart Agriculture Practices in South Asia: A Comprehensive Review",
          authors: "Kumar, R., Sharma, P., Singh, A.",
          date: "2025-08-10",
          views: "2,450",
          downloads: "1,230",
          slug: "climate-smart-agriculture-south-asia",
          abstract: "This comprehensive review examines climate-smart agriculture practices across South Asian countries..."
        },
        {
          id: 2,
          title: "Precision Agriculture Technologies for Sustainable Crop Production",
          authors: "Johnson, S., Williams, M., Brown, K.",
          date: "2025-08-05",
          views: "1,890",
          downloads: "950",
          slug: "precision-agriculture-sustainable-crop",
          abstract: "Exploring the integration of IoT sensors, AI, and data analytics in modern farming practices..."
        },
        {
          id: 3,
          title: "Organic Farming and Soil Health: Long-term Impact Analysis",
          authors: "Patel, N., Gupta, S., Mishra, V.",
          date: "2025-07-28",
          views: "3,120",
          downloads: "1,680",
          slug: "organic-farming-soil-health",
          abstract: "A 10-year longitudinal study examining the effects of organic farming practices on soil microbiome..."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();

    // Set up polling for new articles every 5 minutes
    const interval = setInterval(fetchArticles, 300000);
    return () => clearInterval(interval);
  }, [fetchArticles]);

  return { data, loading, error, refetch: fetchArticles };
};

// Image Components with Fallback
const OptimizedImage = ({ src, alt, className, style, fallback, onError }) => {
  const [imgError, setImgError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleError = () => {
    setImgError(true);
    onError?.();
  };

  if (imgError && fallback) {
    return fallback;
  }

  return (
    <div style={{ position: 'relative', ...style }}>
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
        onLoad={() => setLoaded(true)}
        onError={handleError}
      />
      {!loaded && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0fdf4'
        }}>
          <Loader2 size={24} className="animate-spin" color="#166534" />
        </div>
      )}
    </div>
  );
};

// Video Component with Fallback
const HeroVideo = ({ onError }) => {
  const [videoError, setVideoError] = useState(false);

  const handleVideoError = () => {
    setVideoError(true);
    onError?.();
  };

  if (videoError) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #166534 0%, #15803d 50%, #22c55e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: 'white', opacity: 0.8 }}>
          <Leaf size={64} />
          <p style={{ marginTop: '16px', fontSize: '1.1rem' }}>Agricultural Innovation</p>
        </div>
      </div>
    );
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      onError={handleVideoError}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        filter: 'blur(0.5px)',
        zIndex: 1
      }}
    >
      <source src="/videos/hero-background.mp4" type="video/mp4" />
    </video>
  );
};

// Error Boundary Component
const ErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error) => {
      console.error('Error caught by boundary:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  if (hasError) {
    return fallback || (
      <div style={{ padding: '20px', textAlign: 'center', color: '#ef4444' }}>
        <AlertCircle size={48} />
        <p style={{ marginTop: '16px' }}>Something went wrong. Please refresh the page.</p>
      </div>
    );
  }

  return children;
};

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Recent Articles Hook
  const { data: recentArticles, loading: articlesLoading, error: articlesError } = useRecentArticles();

  // Hardcoded Value/Strengths Showcase
  const valueShowcase = useMemo(() => [
    {
      icon: <Clock size={32} />,
      title: 'Fastest Publication',
      description: 'Quickest Journal Publication for Quality Research',
      color: '#3b82f6'
    },
    {
      icon: <Heart size={32} />,
      title: 'Trusted by Researchers',
      description: 'A Global Platform Trusted by Researchers Worldwide',
      color: '#ef4444'
    },
    {
      icon: <Globe size={32} />,
      title: 'Global Impact',
      description: 'Indexed in major databases with worldwide accessibility and citation tracking',
      color: '#10b981'
    },
    {
      icon: <Award size={32} />,
      title: 'Excellence Recognized',
      description: 'Rigorous peer-review process ensuring highest quality academic standards',
      color: '#f59e0b'
    }
  ], []);

  // Hardcoded Blog Links
  const blogPosts = useMemo(() => [
    {
      id: 1,
      title: "Future of Sustainable Agriculture: Trends and Innovations",
      excerpt: "Exploring cutting-edge technologies and practices shaping the future of sustainable farming worldwide...",
      link: "https://blog.example.com/future-sustainable-agriculture",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=250&fit=crop",
      date: "2025-08-12",
      category: "Technology"
    },
    {
      id: 2,
      title: "Climate-Resilient Crops: Genetic Solutions for Food Security",
      excerpt: "How genetic engineering and traditional breeding methods are creating crops that can withstand climate challenges...",
      link: "https://blog.example.com/climate-resilient-crops",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=250&fit=crop",
      date: "2025-08-10",
      category: "Research"
    },
    {
      id: 3,
      title: "Precision Agriculture: IoT and AI in Modern Farming",
      excerpt: "Discover how Internet of Things sensors and artificial intelligence are revolutionizing farm management...",
      link: "https://blog.example.com/precision-agriculture-iot-ai",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=250&fit=crop",
      date: "2025-08-08",
      category: "Innovation"
    },
    {
      id: 4,
      title: "Water Management in Arid Regions: Sustainable Solutions",
      excerpt: "Innovative irrigation techniques and water conservation methods for agriculture in water-scarce areas...",
      link: "https://blog.example.com/water-management-arid-regions",
      image: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=400&h=250&fit=crop",
      date: "2025-08-05",
      category: "Sustainability"
    }
  ], []);

  const testimonials = useMemo(() => [
    {
      id: 1,
      text: "IJAREI has been instrumental in disseminating our research on climate-resilient crops to a global audience.",
      author: "Dr. Rajesh Kumar",
      position: "Agricultural Scientist, ICAR",
      rating: 5,
      avatar: "/images/avatars/dr-rajesh.jpg"
    },
    {
      id: 2,
      text: "The peer-review process is thorough and the editorial team is incredibly supportive throughout the publication journey.",
      author: "Prof. Sarah Johnson",
      position: "University of California, Davis",
      rating: 5,
      avatar: "/images/avatars/prof-sarah.jpg"
    },
    {
      id: 3,
      text: "As a young researcher, IJAREI provided the perfect platform to showcase my work on precision agriculture.",
      author: "Dr. Priya Sharma",
      position: "IIT Delhi",
      rating: 5,
      avatar: "/images/avatars/dr-priya.jpg"
    }
  ], []);

  const researchAreas = [
    { icon: <Wheat size={24} />, title: "Crop Science" },
    { icon: <Droplets size={24} />, title: "Water Management" },
    { icon: <Microscope size={24} />, title: "Biotechnology" },
    { icon: <Leaf size={24} />, title: "Sustainable Agriculture" },
    { icon: <Sun size={24} />, title: "Climate Adaptation" },
    { icon: <Zap size={24} />, title: "Smart Farming" }
  ];

  // Navigation Handler
  const handleNavigation = useCallback((path) => {
    navigate(path);  // ✅ Real navigation instead of console.log
  }, [navigate]);

  // External Link Handler
  const handleExternalLink = useCallback((url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  // Form Submission Handler
  const handleNewsletterSubmit = useCallback(async (email) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NEWSLETTER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!response.ok) throw new Error('Subscription failed');
      alert('Successfully subscribed to newsletter!');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      alert('Subscription failed. Please try again.');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const styles = {
    // Loading Animation
    loader: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#166534',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      opacity: isLoading ? 1 : 0,
      visibility: isLoading ? 'visible' : 'hidden',
      transition: 'all 0.6s ease-in-out'
    },
    loaderContent: {
      textAlign: 'center',
      color: 'white'
    },
    spinner: {
      width: '50px',
      height: '50px',
      border: '3px solid rgba(255,255,255,0.2)',
      borderTop: '3px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 20px'
    },

    // Main Container
    container: {
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      lineHeight: 1.6,
      color: '#1a202c',
      opacity: isLoading ? 0 : 1,
      transition: 'opacity 0.8s ease-in-out'
    },

    // Header Hero Section
    heroBanner: {
      position: 'relative',
      height: '70vh',
      minHeight: '500px',
      maxHeight: '600px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      color: 'white'
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(1px)',
      zIndex: 2
    },
    heroContent: {
      textAlign: 'center',
      maxWidth: '800px',
      padding: '0 20px',
      position: 'relative',
      zIndex: 3
    },
    heroTitle: {
      fontSize: 'clamp(1.8rem, 4vw, 3rem)',
      fontWeight: '800',
      marginBottom: '15px',
      letterSpacing: '-0.02em',
      textShadow: '2px 4px 6px rgba(0,0,0,0.3)'
    },
    heroSubtitle: {
      fontSize: 'clamp(1rem, 2vw, 1.2rem)',
      fontWeight: '400',
      marginBottom: '12px',
      opacity: 0.9
    },
    heroDescription: {
      fontSize: '1rem',
      marginBottom: '30px',
      opacity: 0.85,
      maxWidth: '600px',
      margin: '0 auto 30px'
    },
    heroButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      padding: '14px 28px',
      backgroundColor: '#22c55e',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(34,197,94,0.3)',
      cursor: 'pointer',
      border: 'none'
    },

    // Value Showcase Section
    showcaseSection: {
      padding: '60px 20px',
      backgroundColor: '#f0fdf4',
    },
    showcaseContainer: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    showcaseGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '30px'
    },
    showcaseCard: {
      backgroundColor: 'white',
      padding: '35px 30px',
      borderRadius: '16px',
      textAlign: 'center',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    showcaseIcon: {
      marginBottom: '20px'
    },
    showcaseTitle: {
      fontSize: '1.3rem',
      fontWeight: '700',
      marginBottom: '12px',
      color: '#1a202c'
    },
    showcaseDescription: {
      fontSize: '1rem',
      color: '#64748b',
      lineHeight: '1.6'
    },

    // Loading State
    loadingState: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      color: '#64748b'
    },

    // Error State
    errorState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      color: '#ef4444',
      backgroundColor: '#fef2f2',
      borderRadius: '8px',
      border: '1px solid #fecaca'
    },

    // Current Issue Section
    currentIssueSection: {
      padding: '80px 20px',
      backgroundColor: '#fefce8',
    },
    sectionTitle: {
      fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
      fontWeight: '700',
      marginBottom: '50px',
      color: '#1a202c',
      textAlign: 'center'
    },
    issueContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: '60px',
      alignItems: 'center'
    },
    issueCard: {
      backgroundColor: '#f8fafc',
      borderRadius: '16px',
      padding: '30px',
      textAlign: 'center',
      border: '1px solid #e2e8f0'
    },
    issueCover: {
      width: '200px',
      height: '280px',
      borderRadius: '12px',
      margin: '0 auto 25px',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
      position: 'relative',
      overflow: 'hidden'
    },
    issueContent: {
      textAlign: 'left'
    },
    issueTitle: {
      fontSize: '1.8rem',
      fontWeight: '700',
      marginBottom: '20px',
      color: '#1a202c'
    },
    issueDescription: {
      fontSize: '1.1rem',
      color: '#4a5568',
      marginBottom: '25px',
      lineHeight: '1.7'
    },

    readButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      backgroundColor: '#166534',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: 'none'
    },

    // About Section
    aboutSection: {
      padding: '80px 20px',
      backgroundColor: '#f0fdf4',
    },
    aboutContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '60px',
      alignItems: 'center'
    },
    aboutTitle: {
      fontSize: 'clamp(1.6rem, 2.5vw, 2rem)',
      fontWeight: '700',
      marginBottom: '20px',
      color: '#1a202c'
    },
    aboutText: {
      fontSize: '1.05rem',
      color: '#4a5568',
      marginBottom: '20px',
      lineHeight: 1.7
    },
    readMoreLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: '#166534',
      textDecoration: 'none',
      fontSize: '1rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    aboutImagePlaceholder: {
      width: '100%',
      height: '350px',
      backgroundColor: '#e2e8f0',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#64748b',
      fontSize: '1.1rem',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    },

    // Research Areas Section
    researchSection: {
      padding: '80px 20px',
      backgroundColor: 'white'
    },
    researchGrid: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '25px'
    },
    researchCard: {
      backgroundColor: '#fefce8',
      padding: '25px 20px',
      borderRadius: '12px',
      textAlign: 'center',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    researchIcon: {
      color: '#166534',
      marginBottom: '15px'
    },
    researchTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#1a202c',
      marginBottom: '8px'
    },
    researchCount: {
      fontSize: '0.9rem',
      color: '#64748b'
    },

    // Recent Articles Section
    articlesSection: {
      padding: '80px 20px',
      backgroundColor: '#f8fafc'
    },
    articlesList: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gap: '25px'
    },
    articleCard: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    articleTitle: {
      fontSize: '1.3rem',
      fontWeight: '600',
      color: '#1a202c',
      marginBottom: '12px',
      textDecoration: 'none',
      lineHeight: '1.4'
    },
    articleAuthors: {
      fontSize: '0.95rem',
      color: '#64748b',
      marginBottom: '12px'
    },
    articleAbstract: {
      fontSize: '0.9rem',
      color: '#6b7280',
      marginBottom: '15px',
      lineHeight: '1.5'
    },
    articleMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.9rem',
      color: '#64748b'
    },
    articleStats: {
      display: 'flex',
      gap: '20px'
    },

    // Blogs Section
    blogsSection: {
      padding: '80px 20px',
      backgroundColor: 'white'
    },
    blogsGrid: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px'
    },
    blogCard: {
      backgroundColor: '#fafafa',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    blogImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    },
    blogContent: {
      padding: '25px'
    },
    blogCategory: {
      display: 'inline-block',
      padding: '4px 12px',
      backgroundColor: '#166534',
      color: 'white',
      fontSize: '0.8rem',
      borderRadius: '20px',
      marginBottom: '12px',
      fontWeight: '500'
    },
    blogTitle: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#1a202c',
      marginBottom: '10px',
      lineHeight: '1.4'
    },
    blogExcerpt: {
      fontSize: '0.95rem',
      color: '#64748b',
      marginBottom: '15px',
      lineHeight: '1.5'
    },
    blogMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.85rem',
      color: '#9ca3af'
    },

    // Testimonials Section
    testimonialsSection: {
      padding: '80px 20px',
      backgroundColor: '#f8fafc'
    },
    testimonialCard: {
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: 'white',
      padding: '40px',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      textAlign: 'center',
      border: '1px solid #d1fae5',
    },
    testimonialText: {
      fontSize: '1.2rem',
      color: '#4a5568',
      fontStyle: 'italic',
      marginBottom: '25px',
      lineHeight: '1.6'
    },
    testimonialAuthor: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#1a202c',
      marginBottom: '5px'
    },
    testimonialPosition: {
      fontSize: '0.9rem',
      color: '#64748b',
      marginBottom: '15px'
    },
    stars: {
      display: 'flex',
      justifyContent: 'center',
      gap: '3px'
    },

    // CTA Section
    ctaSection: {
      padding: '80px 20px',
      background: 'linear-gradient(135deg, #166534 0%, #15803d 100%)',
      color: 'white',
      textAlign: 'center'
    },
    ctaContent: {
      maxWidth: '700px',
      margin: '0 auto'
    },
    ctaTitle: {
      fontSize: 'clamp(1.8rem, 3vw, 2.2rem)',
      fontWeight: '700',
      marginBottom: '20px'
    },
    ctaText: {
      fontSize: '1.1rem',
      marginBottom: '35px',
      opacity: 0.9
    },
    ctaButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      padding: '16px 32px',
      backgroundColor: 'white',
      color: '#166534',
      textDecoration: 'none',
      borderRadius: '8px',
      fontSize: '1.1rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 6px 20px rgba(255,255,255,0.2)',
      cursor: 'pointer',
      border: 'none'
    }
  };

  return (
    <ErrorBoundary>
      <div style={styles.container}>
        {/* CSS Keyframes and Styles */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .hero-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(34,197,94,0.4);
            background-color: #16a34a;
          }
          
          .showcase-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          }
          
          .showcase-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--card-color, #166534);
            border-radius: 16px 16px 0 0;
          }
          
          .read-button:hover {
            background-color: #14532d;
            transform: translateY(-2px);
          }
          
          .read-more:hover {
            transform: translateX(5px);
          }
          
          .research-card:hover {
            background-color: #ecfdf5;
            border-color: #86efac;
            transform: translateY(-3px);
          }
          
          .article-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            border-color: #86efac;
          }
          
          .blog-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          }
          
          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(255,255,255,0.3);
            background-color: #f8fafc;
          }
          
          @media (max-width: 1024px) {
            .issue-container {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
              text-align: center !important;
            }
            
            .about-container {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }
            
            .showcase-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          
          @media (max-width: 768px) {
            .hero-banner {
              height: 60vh !important;
              min-height: 400px !important;
            }
            
            .showcase-grid {
              grid-template-columns: 1fr !important;
            }
            
            .research-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            
            .blogs-grid {
              grid-template-columns: 1fr !important;
            }
            
            .article-meta {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 10px !important;
            }
          }
          
          @media (max-width: 480px) {
            .research-grid {
              grid-template-columns: 1fr !important;
            }
            
            .hero-content,
            .testimonial-card,
            .issue-card {
              padding: 20px !important;
            }
            
            .current-issue-section,
            .about-section,
            .research-section,
            .articles-section,
            .blogs-section,
            .testimonials-section,
            .cta-section {
              padding: 60px 15px !important;
            }
          }
        `}</style>

        {/* Loading Animation */}
        {isLoading && (
          <div style={styles.loader}>
            <div style={styles.loaderContent}>
              <div style={styles.spinner}></div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>IJAREI</h2>
              <p style={{ fontSize: '0.9rem', margin: '8px 0 0', opacity: 0.9 }}>Loading...</p>
            </div>
          </div>
        )}

        {/* Hero Banner Section - With Video */}
        <section style={styles.heroBanner}>
          <HeroVideo onError={() => console.log('Video failed to load')} />
          <div style={styles.heroOverlay}></div>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              International Journal of Agricultural Research and Emerging Innovations
            </h1>
            <p style={styles.heroSubtitle}>
              IJAREI • Open Access • Peer-Reviewed • Global Impact
            </p>
            <p style={styles.heroDescription}>
              Advancing agricultural science through rigorous research, innovative practices, and global collaboration.
            </p>
            <button
              onClick={() => handleNavigation('/archive')}
              style={styles.heroButton}
              className="hero-button"
            >
              <Eye size={18} />
              View Latest Issue
            </button>
          </div>
        </section>

        {/* Value Showcase Section */}
        <section style={styles.showcaseSection}>
          <div style={styles.showcaseContainer}>
            <div style={styles.showcaseGrid}>
              {valueShowcase.map((item, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.showcaseCard,
                    '--card-color': item.color
                  }}
                  className="showcase-card"
                >
                  <div style={{ ...styles.showcaseIcon, color: item.color }}>
                    {item.icon}
                  </div>
                  <h3 style={styles.showcaseTitle}>{item.title}</h3>
                  <p style={styles.showcaseDescription}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Current Issue Section */}
        <section id="current-issue" style={styles.currentIssueSection}>
          <h2 style={styles.sectionTitle}>Current Issue</h2>
          <div style={styles.issueContainer} className="issue-container">
            <div style={styles.issueCard}>
              <div style={styles.issueCover}>
                <OptimizedImage
                  src="/Images/International Journal of Agricultural Research and Emerging Innovations (IJAREI) Cover page.png"
                  alt="Current Issue Cover"
                  fallback={
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#15803d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      color: 'white'
                    }}>
                      <BookOpen size={48} />
                      <p style={{ marginTop: '12px', fontSize: '0.9rem' }}>Issue Cover</p>
                    </div>
                  }
                />
              </div>
              <button
                onClick={() => handleNavigation('/current-issue/download')}
                style={styles.readButton}
                className="read-button"
              >
                <Download size={16} />
                Download PDF
              </button>
            </div>
            <div style={styles.issueContent}>
              <h3 style={styles.issueTitle}>Agricultural Innovation in Climate Change Era</h3>
              <p style={styles.issueDescription}>
                This issue features groundbreaking research on climate-resilient agriculture, sustainable farming practices,
                and emerging technologies that are transforming the agricultural landscape. Our peer-reviewed articles cover
                precision agriculture, crop biotechnology, water management, and rural development strategies.
              </p>

              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleNavigation('/archive')}
                  style={styles.readButton}
                  className="read-button"
                >
                  <Eye size={16} />
                  Browse Articles
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section style={styles.aboutSection}>
          <div style={styles.aboutContainer} className="about-container">
            <div>
              <h2 style={styles.aboutTitle}>About IJAREI</h2>
              <p style={styles.aboutText}>
                The International Journal of Agricultural Research and Emerging Innovations (IJAREI) is a premier
                peer-reviewed, open-access publication dedicated to advancing agricultural science through cutting-edge
                research and innovative practices.
              </p>
              <p style={styles.aboutText}>
                Established in 2025, IJAREI publishes original research articles, comprehensive reviews, and case studies
                that contribute to sustainable agriculture, food security, climate adaptation, and rural development worldwide.
                Our editorial board comprises distinguished researchers from many countries across the globe.
              </p>
              <p style={styles.aboutText}>
                With a strong focus on interdisciplinary approaches, we welcome submissions from all fields of agriculture, 
                including but not limited to crop science, agricultural biotechnology, precision farming, sustainable agriculture, 
                water management, and agribusiness innovation.
              </p>
              <button
                onClick={() => handleNavigation('/about-journal')}
                style={styles.readMoreLink}
                className="read-more"
              >
                Read Complete About Us
                <ArrowRight size={16} />
              </button>
            </div>
            <OptimizedImage
              src="/Images/AboutIJAREIimage.jpg"
              alt="Agricultural Research"
              style={{ height: '350px', borderRadius: '16px' }}
              fallback={
                <div style={{
                  height: '350px',
                  background: 'linear-gradient(135deg, #166534 0%, #22c55e 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <BookOpen size={64} />
                </div>
              }
            />
          </div>
        </section>

        {/* Research Areas Section */}
        <section style={styles.researchSection}>
          <h2 style={styles.sectionTitle}>Research Areas</h2>
          <div style={styles.researchGrid}>
            {researchAreas.map((area, index) => (
              <div
                key={index}
                style={styles.researchCard}
                className="research-card"
              >
                <div style={styles.researchIcon}>{area.icon}</div>
                <h3 style={styles.researchTitle}>{area.title}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Articles Section - Connected to Backend */}
        <section style={styles.articlesSection}>
          <h2 style={styles.sectionTitle}>Recent Publications</h2>
          {articlesLoading ? (
            <div style={styles.loadingState}>
              <Loader2 size={32} className="animate-spin" />
              <span style={{ marginLeft: '12px' }}>Loading latest articles...</span>
            </div>
          ) : articlesError ? (
            <div style={styles.errorState}>
              <AlertCircle size={32} />
              <p style={{ marginTop: '12px' }}>Failed to load articles. Showing cached content.</p>
            </div>
          ) : null}

          <div style={styles.articlesList}>
            {recentArticles.map((article, index) => (
              <div
                key={article.id || index}
                style={styles.articleCard}
                className="article-card"
                onClick={() => handleNavigation(`/article/${article.slug}`)}
              >
                <h3 style={styles.articleTitle}>{article.title}</h3>
                <p style={styles.articleAuthors}>By: {article.authors}</p>
                {article.abstract && (
                  <p style={styles.articleAbstract}>
                    {article.abstract.length > 150
                      ? `${article.abstract.substring(0, 150)}...`
                      : article.abstract
                    }
                  </p>
                )}
                <div style={styles.articleMeta}>
                  <span>Published: {new Date(article.date).toLocaleDateString()}</span>
                  <div style={styles.articleStats}>
                    <span>
                      <Eye size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                      {article.views} views
                    </span>
                    <span>
                      <Download size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                      {article.downloads} downloads
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              onClick={() => handleNavigation('/archive')}
              style={styles.readButton}
              className="read-button"
            >
              <FileText size={16} />
              View All Articles
            </button>
          </div>
        </section>

        {/* Our Blogs Section - Hardcoded */}
        <section style={styles.blogsSection} className="blogs-section">
          <h2 style={styles.sectionTitle}>Our Blogs</h2>
          <div style={styles.blogsGrid} className="blogs-grid">
            {blogPosts.map((blog, index) => (
              <div
                key={blog.id}
                style={styles.blogCard}
                className="blog-card"
                onClick={() => handleExternalLink(blog.link)}
              >
                <OptimizedImage
                  src={blog.image}
                  alt={blog.title}
                  style={{ height: '200px' }}
                  fallback={
                    <div style={{
                      width: '100%',
                      height: '200px',
                      backgroundColor: '#f0fdf4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      color: '#64748b'
                    }}>
                      <Lightbulb size={48} color="#166534" />
                      <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>Blog Image</p>
                    </div>
                  }
                />
                <div style={styles.blogContent}>
                  <span style={styles.blogCategory}>{blog.category}</span>
                  <h3 style={styles.blogTitle}>{blog.title}</h3>
                  <p style={styles.blogExcerpt}>{blog.excerpt}</p>
                  <div style={styles.blogMeta}>
                    <span>{new Date(blog.date).toLocaleDateString()}</span>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: '#166534',
                      fontWeight: '500'
                    }}>
                      Read More
                      <ExternalLink size={12} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              onClick={() => handleExternalLink('https://blog.example.com')}
              style={{
                ...styles.readButton,
                backgroundColor: 'transparent',
                color: '#166534',
                border: '2px solid #166534'
              }}
              className="read-button"
            >
              <ExternalLink size={16} />
              Visit Our Blog
            </button>
          </div>
        </section>

        {/* Testimonials Section */}
        <section style={styles.testimonialsSection}>
          <h2 style={styles.sectionTitle}>What Researchers Say</h2>
          <div style={styles.testimonialCard}>
            <Quote size={32} color="#166534" style={{ marginBottom: '20px' }} />
            <p style={styles.testimonialText}>
              "{testimonials[currentTestimonial]?.text}"
            </p>
            <div style={styles.testimonialAuthor}>
              {testimonials[currentTestimonial]?.author}
            </div>
            <div style={styles.testimonialPosition}>
              {testimonials[currentTestimonial]?.position}
            </div>
            <div style={styles.stars}>
              {[...Array(testimonials[currentTestimonial]?.rating || 5)].map((_, i) => (
                <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={styles.researchSection}>
          <h2 style={styles.sectionTitle}>Why Choose IJAREI?</h2>
          <div style={styles.showcaseGrid}>
            <div style={styles.showcaseCard} className="showcase-card">
              <div style={styles.showcaseIcon}><Globe size={32} color="#166534" /></div>
              <h3 style={{ ...styles.showcaseTitle, marginBottom: '10px' }}>Open Access</h3>
              <p style={styles.showcaseDescription}>
                Free access to all published research worldwide with no subscription barriers
              </p>
            </div>
            <div style={styles.showcaseCard} className="showcase-card">
              <div style={styles.showcaseIcon}><Users size={32} color="#166534" /></div>
              <h3 style={{ ...styles.showcaseTitle, marginBottom: '10px' }}>Expert Review</h3>
              <p style={styles.showcaseDescription}>
                Rigorous double-blind peer review by leading agricultural researchers
              </p>
            </div>
            <div style={styles.showcaseCard} className="showcase-card">
              <div style={styles.showcaseIcon}><Award size={32} color="#166534" /></div>
              <h3 style={{ ...styles.showcaseTitle, marginBottom: '10px' }}>Global Indexing</h3>
              <p style={styles.showcaseDescription}>
                Indexed in major databases including Google Scholar, DOAJ, and ResearchGate
              </p>
            </div>
            <div style={styles.showcaseCard} className="showcase-card">
              <div style={styles.showcaseIcon}><TrendingUp size={32} color="#166534" /></div>
              <h3 style={{ ...styles.showcaseTitle, marginBottom: '10px' }}>High Impact</h3>
              <p style={styles.showcaseDescription}>
                Promoting research that drives real-world agricultural innovations
              </p>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section style={styles.aboutSection}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={styles.sectionTitle}>Agricultural Research Excellence</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '40px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: '#1a202c',
                  marginBottom: '15px'
                }}>
                  Sustainable Agriculture Research
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#4a5568',
                  lineHeight: '1.7',
                  marginBottom: '15px'
                }}>
                  Our journal focuses on sustainable agriculture practices that address climate change challenges,
                  promote biodiversity conservation, and ensure food security for growing global populations.
                  We publish cutting-edge research on organic farming, agroecology, and regenerative agriculture.
                </p>
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: '#1a202c',
                  marginBottom: '15px'
                }}>
                  Precision Agriculture Technology
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#4a5568',
                  lineHeight: '1.7',
                  marginBottom: '15px'
                }}>
                  Explore the latest developments in precision agriculture, including IoT sensors, drone technology,
                  satellite imagery analysis, and AI-driven crop monitoring systems. Our articles cover smart
                  irrigation, variable rate technology, and data-driven farm management solutions.
                </p>
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: '#1a202c',
                  marginBottom: '15px'
                }}>
                  Crop Biotechnology Innovation
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#4a5568',
                  lineHeight: '1.7',
                  marginBottom: '15px'
                }}>
                  Discover groundbreaking research in plant genetics, molecular breeding, CRISPR gene editing,
                  and development of climate-resilient crop varieties. Our publications advance understanding
                  of plant-microbe interactions and stress tolerance mechanisms.
                </p>
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: '#1a202c',
                  marginBottom: '15px'
                }}>
                  Water Resource Management
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#4a5568',
                  lineHeight: '1.7',
                  marginBottom: '15px'
                }}>
                  Access comprehensive research on efficient irrigation systems, water-use efficiency,
                  drought management strategies, and watershed conservation. Our articles address critical
                  water scarcity challenges facing modern agriculture worldwide.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={styles.ctaSection}>
          <div style={styles.ctaContent}>
            <h2 style={styles.ctaTitle}>Ready to Publish Your Research?</h2>
            <p style={styles.ctaText}>
              Join our global community of agricultural researchers and contribute to advancing
              sustainable farming practices worldwide. Fast-track review available.
            </p>
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => handleNavigation('/manuscript')}
                style={styles.ctaButton}
                className="cta-button"
              >
                <FileText size={18} />
                Submit Your Paper
              </button>
              <button
                onClick={() => handleNavigation('/instructions')}
                style={{
                  ...styles.ctaButton,
                  backgroundColor: 'transparent',
                  border: '2px solid white',
                  color: 'white'
                }}
                className="cta-button"
              >
                <CheckCircle size={18} />
                Submission Guidelines
              </button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section style={{ ...styles.aboutSection, backgroundColor: 'white' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={styles.sectionTitle}>Get in Touch</h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#4a5568',
              marginBottom: '40px'
            }}>
              Have questions about submission or need editorial support? We're here to help.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '30px'
            }}>
              <div style={{
                backgroundColor: '#f8fafc',
                padding: '30px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <Mail size={32} color="#166534" style={{ marginBottom: '15px' }} />
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#1a202c',
                  marginBottom: '10px'
                }}>
                  Editorial Office
                </h3>
                <a
                  href="mailto:editor.ijterdjournal@gmail.com"
                  style={{
                    color: '#166534',
                    textDecoration: 'none',
                    fontSize: '1rem'
                  }}
                >
                  editor.ijterdjournal@gmail.com
                </a>
              </div>
              <div style={{
                backgroundColor: '#f8fafc',
                padding: '30px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <Phone size={32} color="#166534" style={{ marginBottom: '15px' }} />
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#1a202c',
                  marginBottom: '10px'
                }}>
                  WhatsApp Support
                </h3>
                <a
                  href="https://wa.me/917053938407"
                  style={{
                    color: '#166534',
                    textDecoration: 'none',
                    fontSize: '1rem'
                  }}
                >
                  +91 7053938407
                </a>
              </div>
            </div>
          </div>
        </section>


      </div>
    </ErrorBoundary>
  );
};

export default HomePage; 