import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu,
    X,
    BarChart3,
    FileText,
    Users,
    Bookmark,
    Archive,
    MessageCircle,
    Bell,
    PlusIcon,
    ChevronRight
} from 'lucide-react';
import '../styles/AdminPanel.css';

// Import the ArticleUploadForm component
import ArticleUploadForm from '../adminpanel/ArticleUploadForm';
import EditorialBoardManagement from '../adminpanel/EditorialBoardManagement';
import IndexingManagement from '../adminpanel/IndexingManagement';
import Dashboard from '../adminpanel/Dashboard';
import AllArticles from '../adminpanel/AllArticles';
import EnquiriesManagement from '../adminpanel/EnquiriesManagement';
import Volumeissue from '../adminpanel/Volumeissue';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);

    const updateNotificationCount = (count) => {
        setNotificationCount(count);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminSession');
        localStorage.removeItem('isAdminLoggedIn');
        navigate('/admin-login');
    };

    const navigationItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'volume-issues', label: 'Volume & Issues', icon: PlusIcon },
        { id: 'article-upload', label: 'Article Upload', icon: FileText },
        { id: 'editorial-board-management', label: 'Editorial Board Management', icon: Users },
        { id: 'indexing', label: 'Indexing Management', icon: Bookmark },
        { id: 'all-articles', label: 'All Articles', icon: Archive },
        { id: 'enquiries', label: 'Enquiries Management', icon: MessageCircle }
    ];

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleSectionChange = (sectionId) => {
        setActiveSection(sectionId);
        setMobileMenuOpen(false);
    };

    const getCurrentSectionLabel = () => {
        const currentItem = navigationItems.find(item => item.id === activeSection);
        return currentItem ? currentItem.label : 'Dashboard';
    };

    // Function to render content based on active section
    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return <Dashboard onNavigate={handleSectionChange} />;
                
            case 'volume-issues':
                return <Volumeissue />;

            case 'article-upload':
                return <ArticleUploadForm />;

            case 'editorial-board-management':
                return <EditorialBoardManagement />;

            case 'indexing':
                return <IndexingManagement />;

            case 'all-articles':
                return <AllArticles />;
            case 'enquiries':
                return <EnquiriesManagement updateNotificationCount={updateNotificationCount} />;


            default:
                return (
                    <div className="ap-placeholder-content">
                        <div className="ap-placeholder-icon">
                            <FileText size={48} />
                        </div>
                        <h3>Selected Page Content Here</h3>
                        <p>This is where the content for "{getCurrentSectionLabel()}" will be displayed.</p>
                    </div>
                );
        }
    };

    return (
        <div className="ap-admin-panel">
            {/* Topbar */}
            <header className="ap-topbar">
                <div className="ap-topbar-left">
                    <button
                        className="ap-mobile-menu-toggle"
                        onClick={toggleMobileMenu}
                    >
                        <Menu size={24} />
                    </button>
                    <div className="ap-logo-section">
                        <h1>International Journal of Agricultural Research and Emerging Innovations</h1>
                        <span className="ap-journal-subtitle">Editorial System</span>
                    </div>
                </div>
                <div className="ap-topbar-right">
                    <button
                        className="ap-topbar-icon"
                        onClick={() => handleSectionChange('enquiries')}
                    >
                        <Bell size={20} />
                        <span className="ap-notification-badge">{notificationCount}</span>
                    </button>

                    <button 
                        className="ap-logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Sidebar */}
            <aside className={`ap-sidebar ${sidebarCollapsed ? 'ap-collapsed' : ''} ${mobileMenuOpen ? 'ap-mobile-open' : ''}`}>
                <div className="ap-sidebar-header">
                    <button
                        className="ap-sidebar-toggle ap-desktop-only"
                        onClick={toggleSidebar}
                    >
                        <Menu size={20} />
                    </button>
                    <button
                        className="ap-sidebar-close ap-mobile-only"
                        onClick={toggleMobileMenu}
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="ap-sidebar-nav">
                    {navigationItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <button
                                key={item.id}
                                className={`ap-nav-item ${activeSection === item.id ? 'ap-active' : ''}`}
                                onClick={() => handleSectionChange(item.id)}
                                title={sidebarCollapsed ? item.label : ''}
                            >
                                <IconComponent size={20} />
                                {!sidebarCollapsed && (
                                    <>
                                        <span className="ap-nav-label">{item.label}</span>
                                        <ChevronRight size={16} className="ap-nav-arrow" />
                                    </>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile Overlay */}
            {mobileMenuOpen && <div className="ap-mobile-overlay" onClick={toggleMobileMenu}></div>}

            {/* Main Content */}
            <main className={`ap-main-content ${sidebarCollapsed ? 'ap-sidebar-collapsed' : ''}`}>
                {/* Only show header for non-article-upload sections */}
                {!['article-upload', 'editorial-board-management'].includes(activeSection) && (
                    <div className="ap-content-header">
                        <h2 className="ap-content-title">{getCurrentSectionLabel()}</h2>
                        <div className="ap-breadcrumb">
                            <span>Admin Panel</span>
                            <ChevronRight size={14} />
                            <span>{getCurrentSectionLabel()}</span>
                        </div>
                    </div>
                )}

                <div className={`ap-content-body ${['article-upload', 'editorial-board-management'].includes(activeSection) ? 'ap-no-padding' : ''}`}>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;