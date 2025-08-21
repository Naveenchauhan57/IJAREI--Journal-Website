import React, { useState } from 'react';
import '../styles/Contact.css'; // Changed from styles import to direct CSS import

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    enquiry: ''
    // file: null - REMOVED
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Removed files destructuring and file handling
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.enquiry.trim()) {
      newErrors.enquiry = 'Enquiry message is required';
    } else if (formData.enquiry.trim().length < 10) {
      newErrors.enquiry = 'Please provide more details (minimum 10 characters)';
    }

    // Optional phone validation (only if provided)
    if (formData.contactNumber.trim() && !validatePhoneNumber(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid phone number';
    }

    // File validation - REMOVED COMPLETELY

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Focus on first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // Simple object for form data - no FormData needed
      const submitData = {
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
        enquiry: formData.enquiry
      };

      // Simulate API call - replace with actual backend integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', submitData);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        contactNumber: '',
        enquiry: ''
        // file: null - REMOVED
      });

      // File input reset code - REMOVED

      setSubmitSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'There was an error submitting your message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format file size function - REMOVED COMPLETELY

  return (
    <div className="contactUs-container">
      {/* Success Message */}
      {submitSuccess && (
        <div className="contactUs-successMessage">
          ✅ Thank you! Your message has been sent successfully.
        </div>
      )}

      {/* Professional Header Section */}
      <header className="contactUs-header">
        <div className="contactUs-headerContent">
          <h1 className="contactUs-headerTitle">Contact Us</h1>
          <p className="contactUs-headerSubtitle">
            We're here to assist you. Please fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="contactUs-mainContent">
        <div className="contactUs-contentWrapper">
          {/* Contact Form Card */}
          <div className="contactUs-formCard">
            <form className="contactUs-form" onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="contactUs-fieldGroup">
                <label htmlFor="name" className="contactUs-label">
                  <span></span> Name <span className="contactUs-required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`contactUs-input ${errors.name ? 'contactUs-inputError' : ''}`}
                  placeholder="Enter your full name"
                  maxLength={100}
                  autoComplete="name"
                />
                {errors.name && <span className="contactUs-errorText">⚠️ {errors.name}</span>}
              </div>

              {/* Email Field */}
              <div className="contactUs-fieldGroup">
                <label htmlFor="email" className="contactUs-label">
                  <span></span> Email Address <span className="contactUs-required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`contactUs-input ${errors.email ? 'contactUs-inputError' : ''}`}
                  placeholder="Enter your email address"
                  maxLength={255}
                  autoComplete="email"
                />
                {errors.email && <span className="contactUs-errorText">⚠️ {errors.email}</span>}
              </div>

              {/* Contact Number Field */}
              <div className="contactUs-fieldGroup">
                <label htmlFor="contactNumber" className="contactUs-label">
                  <span></span> Contact Number
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className={`contactUs-input ${errors.contactNumber ? 'contactUs-inputError' : ''}`}
                  placeholder="Enter your phone number (optional)"
                  maxLength={20}
                  autoComplete="tel"
                />
                {errors.contactNumber && <span className="contactUs-errorText">⚠️ {errors.contactNumber}</span>}
              </div>

              {/* Enquiry Field */}
              <div className="contactUs-fieldGroup">
                <label htmlFor="enquiry" className="contactUs-label">
                  <span></span> Enquiry <span className="contactUs-required">*</span>
                </label>
                <textarea
                  id="enquiry"
                  name="enquiry"
                  value={formData.enquiry}
                  onChange={handleChange}
                  rows="6"
                  className={`contactUs-textarea ${errors.enquiry ? 'contactUs-inputError' : ''}`}
                  placeholder="Please describe your enquiry or message in detail..."
                  maxLength={1000}
                />
                <div className="contactUs-characterCounter">
                  {formData.enquiry.length}/1000 characters
                </div>
                {errors.enquiry && <span className="contactUs-errorText">⚠️ {errors.enquiry}</span>}
              </div>

              {/* File Upload Field - COMPLETELY REMOVED */}

              {/* Submit Error */}
              {errors.submit && (
                <div className="contactUs-errorMessage">
                  ❌ {errors.submit}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`contactUs-submitButton ${isSubmitting ? 'contactUs-submitting' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <span style={{ marginRight: '0.5rem' }}>⏳</span>
                    Sending...
                  </>
                ) : (
                  <>
                    <span style={{ marginRight: '0.5rem' }}>📧</span>
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ContactUs;