import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../styles/Dashboard.css';
import {
    FileText,
    Users,
    Database,
    MessageSquare,
    BarChart3,
    Upload,
    UserCheck,
    List,
    Mail,
    TrendingUp,
    Activity
} from 'lucide-react';

// Stats Cards Component
const StatsSection = ({ stats }) => {
    return (
        <div className="dashboard-stats-section">
            <div className="dashboard-stats-grid">
                <div className="dashboard-card dashboard-stats-card">
                    <div className="dashboard-card-icon-wrapper dashboard-card-articles">
                        <FileText className="dashboard-card-icon" />
                    </div>
                    <div className="dashboard-card-content">
                        <div className="dashboard-card-value">{stats.totalArticles}</div>
                        <div className="dashboard-card-label">Total Articles</div>
                        <div className="dashboard-card-trend dashboard-card-trend-up">
                        </div>
                    </div>
                </div>

                <div className="dashboard-card dashboard-stats-card">
                    <div className="dashboard-card-icon-wrapper dashboard-card-members">
                        <Users className="dashboard-card-icon" />
                    </div>
                    <div className="dashboard-card-content">
                        <div className="dashboard-card-value">{stats.editorialMembers}</div>
                        <div className="dashboard-card-label">Editorial Members</div>
                        <div className="dashboard-card-trend dashboard-card-trend-neutral">
                        </div>
                    </div>
                </div>

                <div className="dashboard-card dashboard-stats-card">
                    <div className="dashboard-card-icon-wrapper dashboard-card-indexings">
                        <Database className="dashboard-card-icon" />
                    </div>
                    <div className="dashboard-card-content">
                        <div className="dashboard-card-value">{stats.indexings}</div>
                        <div className="dashboard-card-label">Indexings</div>
                        <div className="dashboard-card-trend dashboard-card-trend-up">
                        </div>
                    </div>
                </div>

                <div className="dashboard-card dashboard-stats-card">
                    <div className="dashboard-card-icon-wrapper dashboard-card-enquiries">
                        <MessageSquare className="dashboard-card-icon" />
                    </div>
                    <div className="dashboard-card-content">
                        <div className="dashboard-card-value">{stats.enquiries}</div>
                        <div className="dashboard-card-label">Enquiries</div>
                        <div className="dashboard-card-trend dashboard-card-trend-up">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Navigation Shortcuts Component


const NavigationShortcuts = ({ onNavigate }) => {
    const shortcuts = [
        {
            title: 'Dashboard',
            description: 'Overview and analytics',
            icon: BarChart3,
            id: 'dashboard',
            color: 'dashboard-shortcut-primary'
        },
        {
            title: 'Article Upload',
            description: 'Submit new articles',
            icon: Upload,
            id: 'article-upload',
            color: 'dashboard-shortcut-success'
        },
        {
            title: 'Editorial Board',
            description: 'Manage editorial team',
            icon: UserCheck,
            id: 'editorial-board-management',
            color: 'dashboard-shortcut-info'
        },
        {
            title: 'Indexing',
            description: 'Database management',
            icon: Database,
            id: 'indexing',
            color: 'dashboard-shortcut-warning'
        },
        {
            title: 'All Articles',
            description: 'Browse article library',
            icon: List,
            id: 'all-articles',
            color: 'dashboard-shortcut-secondary'
        },
        {
            title: 'Enquiries',
            description: 'Review submissions',
            icon: Mail,
            id: 'enquiries',
            color: 'dashboard-shortcut-accent'
        }
    ];

    return (
        <div className="dashboard-shortcuts-section">
            <div className="dashboard-section-header">
                <h2 className="dashboard-section-title">Quick Navigation</h2>
                <p className="dashboard-section-subtitle">Access key features and tools</p>
            </div>

            <div className="dashboard-shortcuts-grid">
                {shortcuts.map((shortcut, index) => {
                    const IconComponent = shortcut.icon;
                    return (
                        <button
                            key={index}
                            onClick={() => onNavigate(shortcut.id)}
                            className={`dashboard-shortcut-card ${shortcut.color}`}
                        >
                            <div className="dashboard-shortcut-icon-wrapper">
                                <IconComponent className="dashboard-shortcut-icon" />
                            </div>
                            <div className="dashboard-shortcut-content">
                                <h3 className="dashboard-shortcut-title">{shortcut.title}</h3>
                                <p className="dashboard-shortcut-description">{shortcut.description}</p>
                            </div>
                            <div className="dashboard-shortcut-arrow">
                                <span className="dashboard-arrow-indicator">→</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// Main Dashboard Component
const AdminDashboard = ({ onNavigate }) => {
    // Backend-ready state variables for stats
    const [dashboardStats, setDashboardStats] = useState({
        totalArticles: 25,
        editorialMembers: 10,
        indexings: 5,
        enquiries: 12
    });

    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // TODO: Replace with actual API call
    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // Simulate API call
                // const response = await fetch('/api/dashboard/stats');
                // const data = await response.json();
                // setDashboardStats(data);

                // For now, using dummy data
                setTimeout(() => {
                    setLastUpdated(new Date());
                    setIsLoading(false);
                }, 1000);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                setIsLoading(false);
            }
        };

        fetchDashboardData();

        // Set up auto-refresh every 5 minutes
        const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const handleRefreshData = () => {
        // TODO: Implement manual refresh functionality
        setIsLoading(true);
        setTimeout(() => {
            setLastUpdated(new Date());
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-wrapper">
                {/* Dashboard Header */}
                <div className="dashboard-header">
                    <div className="dashboard-header-content">
                        <div className="dashboard-title-section">
                            <h1 className="dashboard-title">Admin Dashboard</h1>
                            <p className="dashboard-subtitle">
                                Welcome back! Here's an overview of your journal management system.
                            </p>
                        </div>

                        <div className="dashboard-header-actions">
                            <div className="dashboard-last-updated">
                                Last Seen: {lastUpdated.toLocaleTimeString()}
                            </div>
                            <button
                                className="dashboard-refresh-btn"
                                onClick={handleRefreshData}
                                disabled={isLoading}
                            >
                                <Activity className={`dashboard-refresh-icon ${isLoading ? 'dashboard-refreshing' : ''}`} />
                                {isLoading ? 'Updating...' : 'Refresh'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="dashboard-loading-overlay">
                        <div className="dashboard-loading-spinner"></div>
                        <p className="dashboard-loading-text">Loading dashboard data...</p>
                    </div>
                )}

                {/* Main Dashboard Content */}
                <div className="dashboard-main-content">
                    {/* Stats Section */}
                    <StatsSection stats={dashboardStats} />

                    {/* Content Grid */}
                    <div className="dashboard-content-grid">
                        {/* Navigation Shortcuts */}
                        <div className="dashboard-content-primary">
                            <NavigationShortcuts onNavigate={onNavigate} />
                        </div>
                    </div>
                </div>

                {/* Dashboard Footer */}
                <div className="dashboard-footer">
                    <div className="dashboard-footer-content">
                        <p className="dashboard-footer-text">
                            Journal Management System v2.1.0 •
                            <a href="/help" className="dashboard-footer-link" onClick={(e) => {
                                e.preventDefault();
                                console.log('Navigate to: /help');
                            }}>Help & Support</a> •
                            <a href="/settings" className="dashboard-footer-link" onClick={(e) => {
                                e.preventDefault();
                                console.log('Navigate to: /settings');
                            }}>Settings</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;