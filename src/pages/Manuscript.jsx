import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, FileText, Upload, CheckCircle, Send, Info, HelpCircle, AlertCircle, BookOpen } from 'lucide-react';

const ManuscriptForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactNumber: '',
        articleTitle: '',
        subject: '',
        file: null
    });

    const [showGuide, setShowGuide] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            file: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            const res = await fetch("https://YOUR_BACKEND_URL/api/manuscript/submit", {
                method: "POST",
                body: formDataToSend
            });

            if (res.ok) {
                alert("Manuscript submitted successfully!");
            } else {
                alert("Submission failed!");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred.");
        }
    };

    const styles = {
        container: {
            minHeight: '100vh',
            backgroundColor: '#f9fafb',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            lineHeight: '1.6'
        },
        header: {
            marginTop: '50px',
            backgroundColor: '#166534',
            color: 'white',
            padding: '4rem 1rem 3rem',
            textAlign: 'center'
        },
        headerContent: {
            maxWidth: '64rem',
            margin: '0 auto'
        },
        headerTitle: {
            fontSize: 'clamp(1.875rem, 5vw, 3.75rem)',
            fontWeight: 'bold',
            marginBottom: '1rem',
            lineHeight: '1.1'
        },
        headerSubtitle: {
            fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
            color: '#bbf7d0',
            lineHeight: '1.5'
        },
        main: {
            maxWidth: '72rem',
            margin: '0 auto',
            padding: '2rem 1rem'
        },
        section: {
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            padding: '1.5rem',
            marginBottom: '2rem'
        },
        sectionTitle: {
            fontSize: 'clamp(1.5rem, 4vw, 1.875rem)',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '1.5rem',
            textAlign: 'center'
        },
        text: {
            fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
            color: '#374151',
            lineHeight: '1.7',
            marginBottom: '1rem'
        },
        formSection: {
            backgroundColor: '#f0fdf4', 
            border: '2px solid #bbf7d0',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            marginBottom: '2rem'
        },
        formTitle: {
            fontSize: 'clamp(1.5rem, 4vw, 1.875rem)',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '2rem',
            textAlign: 'center'
        },
        guideButton: {
            backgroundColor: '#16a34a',
            color: 'white',
            padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            margin: '0 auto 2rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
        guideBox: {
            backgroundColor: '#cffede',
            border: '2px solid #86efac',
            borderRadius: '0.5rem',
            padding: 'clamp(1rem, 3vw, 1.5rem)',
            marginBottom: '2rem',
            display: showGuide ? 'block' : 'none'
        },
        formGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1.5rem',
            marginBottom: '1.5rem'
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
        },
        label: {
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
            fontWeight: '600',
            color: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        },
        input: {
            padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 2.5vw, 1rem)',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
            backgroundColor: 'white',
            outline: 'none',
            transition: 'all 0.2s ease',
            width: '100%',
            boxSizing: 'border-box'
        },
        inputFocus: {
            borderColor: '#166534',
            boxShadow: '0 0 0 3px rgba(108, 62, 232, 0.1)'
        },
        textarea: {
            padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 2.5vw, 1rem)',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
            backgroundColor: 'white',
            outline: 'none',
            resize: 'vertical',
            minHeight: 'clamp(100px, 15vw, 140px)',
            fontFamily: 'inherit',
            width: '100%',
            boxSizing: 'border-box',
            transition: 'all 0.2s ease'
        },
        fileInput: {
            padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 2.5vw, 1rem)',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
            backgroundColor: 'white',
            outline: 'none',
            width: '100%',
            boxSizing: 'border-box',
            transition: 'all 0.2s ease'
        },
        fileStatus: {
            color: '#6b7280',
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
            fontStyle: 'italic',
            marginTop: '0.25rem'
        },
        submitButton: {
            backgroundColor: '#166534',
            color: 'white',
            padding: 'clamp(0.75rem, 2.5vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            width: '100%',
            maxWidth: '400px',
            margin: '2rem auto 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(0)'
        },
        submitButtonHover: {
            backgroundColor: '#166534',
            boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
            transform: 'translateY(-2px)'
        },
        requirementItem: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'clamp(0.75rem, 2vw, 1rem)',
            padding: 'clamp(0.75rem, 2vw, 1rem)',
            backgroundColor: '#f0fdf4',
            borderRadius: '0.5rem',
            marginBottom: '1rem'
        },
        requirementTitle: {
            fontWeight: '600',
            color: '#1f2937',
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
            marginBottom: '0.25rem'
        },
        requirementDesc: {
            color: '#6b7280',
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
            lineHeight: '1.5'
        },
        highlightBox: {
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '0.5rem',
            padding: 'clamp(1rem, 3vw, 1.5rem)',
            marginBottom: '1.5rem'
        },
        bulletPoint: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            marginBottom: '1rem'
        },
        bullet: {
            width: '0.5rem',
            height: '0.5rem',
            backgroundColor: '#166534',
            borderRadius: '50%',
            marginTop: '0.5rem',
            flexShrink: 0
        },
        alertCard: {
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '0.5rem',
            padding: 'clamp(1rem, 3vw, 1.5rem)'
        },
        alertContent: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
        },
        tipsGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'clamp(1rem, 3vw, 1.5rem)'
        },
        tipCard: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'clamp(0.75rem, 2vw, 1rem)',
            padding: 'clamp(0.75rem, 2vw, 1rem)',
            backgroundColor: '#dcfce7',
            borderRadius: '0.5rem',
            border: '1px solid #16a34a'
        },
        tipTitle: {
            fontWeight: '600',
            color: '#1f2937',
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
            marginBottom: '0.5rem'
        },
        tipDesc: {
            color: '#6b7280',
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
            lineHeight: '1.5'
        },
        contactItem: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '1rem',
            padding: 'clamp(1rem, 3vw, 1.5rem)',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb'
        },
        iconCircle: {
            width: 'clamp(2.5rem, 6vw, 3rem)',
            height: 'clamp(2.5rem, 6vw, 3rem)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#166534',
            flexShrink: 0
        },
        contactTitle: {
            fontWeight: '600',
            color: '#1f2937',
            fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
            marginBottom: '0.25rem'
        },
        link: {
            color: '#166534',
            textDecoration: 'none',
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
            wordBreak: 'break-all',
            transition: 'color 0.2s ease'
        },
        linkHover: {
            color: '#1e40af'
        }
    };

    // Media query styles applied via JavaScript
    useEffect(() => {
        const updateStyles = () => {
            const width = window.innerWidth;

            // Update form grid for larger screens
            const formGrids = document.querySelectorAll('.form-grid');
            formGrids.forEach(grid => {
                if (width >= 1024) {
                    grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                } else {
                    grid.style.gridTemplateColumns = '1fr';
                }
            });

            // Update tips grid
            const tipsGrids = document.querySelectorAll('.tips-grid');
            tipsGrids.forEach(grid => {
                if (width >= 768) {
                    grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                } else {
                    grid.style.gridTemplateColumns = '1fr';
                }
            });

            // Update contact item flex direction
            const contactItems = document.querySelectorAll('.contact-item');
            contactItems.forEach(item => {
                if (width >= 640) {
                    item.style.flexDirection = 'row';
                    item.style.alignItems = 'center';
                } else {
                    item.style.flexDirection = 'column';
                    item.style.alignItems = 'flex-start';
                }
            });

            // Update section padding
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => {
                if (width >= 1024) {
                    section.style.padding = '2rem';
                } else if (width >= 640) {
                    section.style.padding = '1.5rem';
                } else {
                    section.style.padding = '1rem';
                }
            });
        };

        updateStyles();
        window.addEventListener('resize', updateStyles);

        return () => window.removeEventListener('resize', updateStyles);
    }, []);

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <h1 style={styles.headerTitle}>
                        Submit Your Manuscript Here
                    </h1>
                    <p style={styles.headerSubtitle}>
                        International Journal of Agricultural Research and Emerging Innovations (IJAREI)
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main style={styles.main}>

                {/* Form Guide Section */}
                <section style={{ ...styles.formSection, ...styles.section }} className="section">
                    <h2 style={styles.formTitle}>
                        📄 Manuscript Submission Form
                    </h2>

                    {/* Guide Toggle Button */}
                    <button
                        style={styles.guideButton}
                        onClick={() => setShowGuide(!showGuide)}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#15803d'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#16a34a'}
                    >
                        <HelpCircle size={20} />
                        {showGuide ? 'Hide Form Guide' : 'Show Form Guide'}
                    </button>

                    {/* Form Filling Guide */}
                    <div style={styles.guideBox}>
                        <h3 style={{ ...styles.tipTitle, fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', marginBottom: '1rem', color: '#0c4a6e' }}>
                            📝 How to Fill This Form - Complete Guide
                        </h3>

                        <div style={styles.tipsGrid} className="tips-grid">
                            <div style={styles.tipCard}>
                                <User color="#16a34a" size={20} style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                                <div>
                                    <div style={styles.tipTitle}>Name Field</div>
                                    <p style={styles.tipDesc}>
                                        Write your full name as it appears in your research papers.
                                        Example: 'Dr. Rajesh Kumar Singh' or 'Prof. Priya Sharma"
                                    </p>
                                </div>
                            </div>

                            <div style={styles.tipCard}>
                                <Mail color="#16a34a" size={20} style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                                <div>
                                    <div style={styles.tipTitle}>Email Address</div>
                                    <p style={styles.tipDesc}>
                                        Provide an active email ID that you check regularly.
                                        Institutional email preferred: 'name@university.edu"
                                    </p>
                                </div>
                            </div>

                            <div style={styles.tipCard}>
                                <Phone color="#16a34a" size={20} style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                                <div>
                                    <div style={styles.tipTitle}>Contact Number</div>
                                    <p style={styles.tipDesc}>
                                        10-digit mobile number with country code।
                                        Format: "+91 98765 43210" - WhatsApp number preferable
                                    </p>
                                </div>
                            </div>

                            <div style={styles.tipCard}>
                                <BookOpen color="#16a34a" size={20} style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                                <div>
                                    <div style={styles.tipTitle}>Article Title</div>
                                    <p style={styles.tipDesc}>
                                        Write the exact title of the research paper. It should be clear and descriptive.
                                        Example: 'Impact of Organic Farming on Soil Health"
                                    </p>
                                </div>
                            </div>

                            <div style={styles.tipCard}>
                                <FileText color="#16a34a" size={20} style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                                <div>
                                    <div style={styles.tipTitle}>Subject/Abstract</div>
                                    <p style={styles.tipDesc}>
                                        Write a brief summary of your research (200–300 words). Include: Research objective, methodology, and key findings.
                                    </p>
                                </div>
                            </div>

                            <div style={styles.tipCard}>
                                <Upload color="#16a34a" size={20} style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                                <div>
                                    <div style={styles.tipTitle}>File Upload</div>
                                    <p style={styles.tipDesc}>
                                        Upload the complete manuscript. Accepted formats: PDF, DOC, DOCX. File size should not exceed 10MB.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div style={{ ...styles.alertCard, marginTop: '1.5rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                            <div style={styles.alertContent}>
                                <AlertCircle color="#0891b2" size={20} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                                <p style={{ color: '#166534', margin: 0, fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
                                    <strong>Important Tips:</strong> Carefully check all fields before submitting the form.
                                    Incorrect information may lead to manuscript rejection.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        {/* Name and Email Row */}
                        <div style={styles.formGrid} className="form-grid">
                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    <User size={18} color="#166534" />
                                    Name *
                                </label>
                                <input
                                    style={styles.input}
                                    type="text"
                                    name="name"
                                    placeholder="Your Name.."
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    <Mail size={18} color="#166534" />
                                    Email *
                                </label>
                                <input
                                    style={styles.input}
                                    type="email"
                                    name="email"
                                    placeholder="Email.."
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    required
                                />
                            </div>
                        </div>

                        {/* Contact and Article Title Row */}
                        <div style={styles.formGrid} className="form-grid">
                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    <Phone size={18} color="#166534" />
                                    Contact Number *
                                </label>
                                <input
                                    style={styles.input}
                                    type="tel"
                                    name="contactNumber"
                                    placeholder="Contact Number.."
                                    value={formData.contactNumber}
                                    onChange={handleInputChange}
                                    onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    <BookOpen size={18} color="#166534" />
                                    Title of the Article *
                                </label>
                                <input
                                    style={styles.input}
                                    type="text"
                                    name="articleTitle"
                                    placeholder="Article name.."
                                    value={formData.articleTitle}
                                    onChange={handleInputChange}
                                    onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    required
                                />
                            </div>
                        </div>

                        {/* Subject - Full Width */}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <FileText size={18} color="#166534" />
                                Subject/Abstract *
                            </label>
                            <textarea
                                style={styles.textarea}
                                name="subject"
                                placeholder="Write something.."
                                value={formData.subject}
                                onChange={handleInputChange}
                                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                required
                            />
                        </div>

                        {/* File Upload - Full Width */}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <Upload size={18} color="#166534" />
                                Choose Files * (PDF, DOC, DOCX)
                            </label>
                            <input
                                style={styles.fileInput}
                                type="file"
                                name="file"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.txt"
                                required
                            />
                            <span style={styles.fileStatus}>
                                {formData.file ? `✓ ${formData.file.name}` : 'No file chosen'}
                            </span>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="button"
                            style={styles.submitButton}
                            onClick={handleSubmit}
                            onMouseEnter={(e) => Object.assign(e.target.style, styles.submitButtonHover)}
                            onMouseLeave={(e) => Object.assign(e.target.style, styles.submitButton)}
                        >
                            <Send size={20} />
                            Submit Manuscript
                        </button>
                    </div>
                </section>

                {/* Submission Guidelines */}
                <section style={styles.section} className="section">
                    <h2 style={styles.sectionTitle}>
                        Manuscript Submission Guidelines
                    </h2>
                    <p style={styles.text}>
                        The <strong>International Journal of Agricultural Research and Emerging Innovations (IJAREI)</strong>
                        welcomes original research articles, review papers, and case studies in the field of
                        agriculture and allied sciences. Please follow these guidelines for successful submission.
                    </p>
                </section>

                {/* Submission Requirements */}
                <section style={styles.section} className="section">
                    <h2 style={styles.sectionTitle}>
                        Submission Requirements
                    </h2>
                    <p style={styles.text}>
                        <strong>Before submitting your manuscript, please ensure:</strong>
                    </p>

                    <div>
                        {[
                            {
                                title: 'Original Research',
                                desc: 'Your manuscript should contain original, unpublished research work not submitted elsewhere simultaneously.'
                            },
                            {
                                title: 'Proper Formatting',
                                desc: 'Follow standard academic format with proper citations, references, and structured sections (Abstract, Introduction, Methodology, Results, Conclusion).'
                            },
                            {
                                title: 'Language & Grammar',
                                desc: 'Manuscript should be written in clear, grammatically correct English with proper academic writing style.'
                            },
                            {
                                title: 'File Requirements',
                                desc: 'Submit in PDF, DOC, or DOCX format. Maximum file size 10MB. Include all figures, tables, and supplementary materials.'
                            }
                        ].map((item, index) => (
                            <div key={index} style={styles.requirementItem}>
                                <CheckCircle color="#166534" size={20} style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                                <div>
                                    <div style={styles.requirementTitle}>{item.title}</div>
                                    <p style={styles.requirementDesc}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Submission Process */}
                <section style={styles.section} className="section">
                    <h2 style={styles.sectionTitle}>
                        Submission Process
                    </h2>

                    <div style={styles.highlightBox}>
                        <p style={styles.text}>
                            <strong>📋 Step-by-Step Process:</strong>
                        </p>
                        <div>
                            {[
                                'Fill out the manuscript submission form above with accurate details',
                                'Upload your complete manuscript file in the specified format',
                                'Provide a comprehensive abstract/summary of your research work',
                                'Submit the form and wait for our acknowledgment email (within 24-48 hours)',
                                'Our editorial team will review and provide feedback within 2-4 weeks'
                            ].map((step, index) => (
                                <div key={index} style={styles.bulletPoint}>
                                    <div style={styles.bullet}></div>
                                    <p style={{ color: '#374151', margin: 0, fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={styles.alertCard}>
                        <div style={styles.alertContent}>
                            <CheckCircle color="#16a34a" size={20} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                            <p style={{ color: '#166534', margin: 0, fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
                                <strong>Note:</strong> After submission, you will receive a manuscript ID for tracking.
                                Keep this ID safe for future correspondence regarding your submission.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section style={styles.section} className="section">
                    <h2 style={styles.sectionTitle}>
                        Contact Information
                    </h2>
                    <p style={{ ...styles.text, textAlign: 'center', marginBottom: '2rem' }}>
                        For queries regarding <strong>manuscript submission</strong>, please contact us:
                    </p>

                    <div style={styles.contactItem} className="contact-item">
                        <div style={styles.iconCircle}>
                            <Mail color="white" size={24} />
                        </div>
                        <div>
                            <h3 style={styles.contactTitle}>Email Support</h3>
                            <a
                                href="mailto:editor.ijterdjournal@gmail.com"
                                style={styles.link}
                                onMouseEnter={(e) => e.target.style.color = styles.linkHover.color}
                                onMouseLeave={(e) => e.target.style.color = styles.link.color}
                            >
                                editor.ijterdjournal@gmail.com
                            </a>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default ManuscriptForm;