import React, { useState, useEffect } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [timer, setTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Timer effect for OTP resend
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0 && otpSent) {
      setCanResendOtp(true);
    }
    return () => clearInterval(interval);
  }, [timer, otpSent]);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '15px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    formCard: {
      backgroundColor: '#ffffff',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '420px',
      border: '1px solid #e9ecef'
    },
    title: {
      fontSize: 'clamp(24px, 5vw, 32px)',
      fontWeight: '700',
      color: '#2c3e50',
      marginBottom: '25px',
      textAlign: 'center',
      letterSpacing: '-0.5px'
    },
    inputGroup: {
      marginBottom: '20px',
      position: 'relative'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: 'clamp(13px, 2.5vw, 14px)',
      fontWeight: '600',
      color: '#2c3e50'
    },
    input: {
      width: '100%',
      padding: 'clamp(12px, 3vw, 14px)',
      paddingRight: '45px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: 'clamp(14px, 3vw, 16px)',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      backgroundColor: '#ffffff'
    },
    inputError: {
      borderColor: '#e74c3c'
    },
    inputFocus: {
      borderColor: '#3498db',
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.1)'
    },
    eyeButton: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '18px',
      color: '#7f8c8d',
      padding: '5px'
    },
    button: {
      width: '100%',
      padding: 'clamp(12px, 3vw, 15px)',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: 'clamp(14px, 3vw, 16px)',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '15px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      position: 'relative'
    },
    buttonHover: {
      backgroundColor: '#2980b9',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)'
    },
    buttonDisabled: {
      backgroundColor: '#bdc3c7',
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none'
    },
    buttonLoading: {
      opacity: 0.7,
      cursor: 'not-allowed'
    },
    googleButton: {
      width: '100%',
      padding: 'clamp(12px, 3vw, 15px)',
      backgroundColor: '#ffffff',
      color: '#2c3e50',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: 'clamp(14px, 3vw, 16px)',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '25px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    },
    googleButtonHover: {
      backgroundColor: '#f8f9fa',
      borderColor: '#3498db',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    divider: {
      textAlign: 'center',
      margin: '25px 0',
      position: 'relative',
      color: '#7f8c8d',
      fontSize: 'clamp(12px, 2.5vw, 14px)'
    },
    dividerLine: {
      position: 'absolute',
      top: '50%',
      left: '0',
      right: '0',
      height: '1px',
      backgroundColor: '#e9ecef',
      zIndex: '1'
    },
    dividerText: {
      backgroundColor: '#ffffff',
      padding: '0 15px',
      position: 'relative',
      zIndex: '2'
    },
    forgotLink: {
      color: '#3498db',
      textDecoration: 'none',
      fontSize: 'clamp(12px, 2.5vw, 14px)',
      cursor: 'pointer',
      textAlign: 'center',
      display: 'block',
      marginTop: '15px',
      fontWeight: '500',
      transition: 'color 0.3s ease'
    },
    forgotLinkHover: {
      color: '#2980b9',
      textDecoration: 'underline'
    },
    otpNote: {
      fontSize: 'clamp(11px, 2vw, 12px)',
      color: '#7f8c8d',
      textAlign: 'center',
      marginTop: '8px',
      lineHeight: '1.4'
    },
    timerText: {
      fontSize: 'clamp(11px, 2vw, 12px)',
      color: '#e74c3c',
      textAlign: 'center',
      marginTop: '8px',
      fontWeight: '600'
    },
    errorMessage: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '10px',
      borderRadius: '6px',
      fontSize: '14px',
      marginBottom: '15px',
      border: '1px solid #f5c6cb'
    },
    successMessage: {
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: 'clamp(12px, 3vw, 15px)',
      borderRadius: '8px',
      textAlign: 'center',
      marginBottom: '20px',
      border: '1px solid #c3e6cb',
      fontSize: 'clamp(13px, 2.5vw, 14px)',
      fontWeight: '500'
    },
    fieldError: {
      color: '#e74c3c',
      fontSize: '12px',
      marginTop: '5px'
    },
    resendButton: {
      background: 'none',
      border: 'none',
      color: '#3498db',
      cursor: 'pointer',
      fontSize: '12px',
      textDecoration: 'underline',
      marginTop: '5px'
    },
    loadingSpinner: {
      display: 'inline-block',
      width: '16px',
      height: '16px',
      border: '2px solid #ffffff',
      borderRadius: '50%',
      borderTopColor: 'transparent',
      animation: 'spin 1s linear infinite',
      marginRight: '8px'
    }
  };

  // Add CSS animation for spinner
  const spinnerCSS = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateOTP = (otp) => {
    return otp.length === 6 && /^\d+$/.test(otp);
  };

  // API simulation functions
  const apiCall = async (endpoint, data) => {
    console.log(`API Call to ${endpoint}:`, data);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate different responses based on endpoint
    switch(endpoint) {
      case '/api/auth/login':
        if (data.email === 'test@example.com' && data.password === 'password') {
          return { success: true, token: 'mock_token_123', user: { email: data.email, name: 'Test User' } };
        } else {
          throw new Error('Invalid email or password');
        }
      
      case '/api/auth/google':
        return { success: true, token: 'mock_google_token_123', user: { email: 'user@gmail.com', name: 'Google User' } };
      
      case '/api/auth/send-otp':
        if (validateEmail(data.email)) {
          return { success: true, message: 'OTP sent successfully' };
        } else {
          throw new Error('Invalid email address');
        }
      
      case '/api/auth/reset-password':
        if (data.otp === '123456') {
          return { success: true, message: 'Password reset successfully' };
        } else {
          throw new Error('Invalid OTP code');
        }
      
      default:
        throw new Error('API endpoint not found');
    }
  };

  const handleLogin = async () => {
    setErrors({});
    
    // Validation
    const newErrors = {};
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiCall('/api/auth/login', { email, password });
      console.log('Login successful:', response);
      
      // Store token in real app (not localStorage in artifacts)
      // localStorage.setItem('token', response.token);
      
      setIsAuthenticated(true);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      const response = await apiCall('/api/auth/google', {});
      console.log('Google login successful:', response);
      setIsAuthenticated(true);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    setErrors({});
    
    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);
    
    try {
      await apiCall('/api/auth/send-otp', { email });
      setOtpSent(true);
      setTimer(60);
      setCanResendOtp(false);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResendOtp) return;
    
    setLoading(true);
    
    try {
      await apiCall('/api/auth/send-otp', { email });
      setTimer(60);
      setCanResendOtp(false);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setErrors({});
    
    // Validation
    const newErrors = {};
    if (!validateOTP(otp)) {
      newErrors.otp = 'Please enter a valid 6-digit OTP';
    }
    if (!validatePassword(newPassword)) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      await apiCall('/api/auth/reset-password', { email, otp, newPassword });
      
      // Reset form
      setShowForgotPassword(false);
      setOtpSent(false);
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setTimer(0);
      
      setErrors({ success: 'Password reset successfully! You can now login with your new password.' });
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // In real app: localStorage.removeItem('token');
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setErrors({});
  };

  // Render authenticated state (Dashboard)
  if (isAuthenticated) {
    return (
      <div style={styles.container}>
        <div style={styles.formCard}>
          <h2 style={styles.title}>Dashboard 📊</h2>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '25px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Welcome to your Dashboard!</h3>
            <p style={{ color: '#7f8c8d', margin: '0' }}>
              You are successfully logged in as: <strong>{email}</strong>
            </p>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              padding: '15px',
              backgroundColor: '#e8f5e8',
              borderRadius: '6px',
              marginBottom: '10px',
              borderLeft: '4px solid #27ae60'
            }}>
              <h4 style={{ margin: '0 0 5px 0', color: '#27ae60' }}>Quick Stats</h4>
              <p style={{ margin: '0', fontSize: '14px', color: '#2c3e50' }}>
                Last login: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <button 
            style={{...styles.button, backgroundColor: '#e74c3c'}}
            onClick={handleLogout}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#c0392b';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#e74c3c';
              e.target.style.transform = 'none';
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{spinnerCSS}</style>
      <div style={styles.formCard}>
        <h2 style={styles.title}>
          {showForgotPassword ? '🔐 Reset Password' : '👋 Welcome Back'}
        </h2>

        {errors.general && (
          <div style={styles.errorMessage}>
            {errors.general}
          </div>
        )}

        {errors.success && (
          <div style={styles.successMessage}>
            {errors.success}
          </div>
        )}

        {!showForgotPassword ? (
          <div>
            <button 
              type="button"
              style={loading ? {...styles.googleButton, ...styles.buttonLoading} : styles.googleButton}
              onClick={handleGoogleLogin}
              disabled={loading}
              onMouseOver={(e) => {
                if (!loading) Object.assign(e.target.style, styles.googleButtonHover);
              }}
              onMouseOut={(e) => {
                if (!loading) Object.assign(e.target.style, styles.googleButton);
              }}
            >
              {loading ? (
                <>
                  <div style={styles.loadingSpinner}></div>
                  Signing in...
                </>
              ) : (
                <>
                  <span style={{ fontSize: '18px' }}>🔍</span>
                  Continue with Google
                </>
              )}
            </button>

            <div style={styles.divider}>
              <div style={styles.dividerLine}></div>
              <span style={styles.dividerText}>or login with email</span>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                style={{...styles.input, ...(errors.email ? styles.inputError : {})}}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
                placeholder="Enter your email"
                required
              />
              {errors.email && <div style={styles.fieldError}>{errors.email}</div>}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  style={{...styles.input, ...(errors.password ? styles.inputError : {})}}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  style={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              </div>
              {errors.password && <div style={styles.fieldError}>{errors.password}</div>}
            </div>

            <button 
              type="button" 
              style={
                (email && password && !loading) ? 
                styles.button : 
                {...styles.button, ...styles.buttonDisabled}
              }
              onClick={handleLogin}
              disabled={!email || !password || loading}
              onMouseOver={(e) => {
                if (email && password && !loading) Object.assign(e.target.style, styles.buttonHover);
              }}
              onMouseOut={(e) => {
                if (email && password && !loading) Object.assign(e.target.style, styles.button);
              }}
            >
              {loading ? (
                <>
                  <div style={styles.loadingSpinner}></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <a 
              style={styles.forgotLink}
              onClick={() => {
                setShowForgotPassword(true);
                setErrors({});
              }}
              onMouseOver={(e) => Object.assign(e.target.style, styles.forgotLinkHover)}
              onMouseOut={(e) => Object.assign(e.target.style, styles.forgotLink)}
            >
              Forgot your password?
            </a>
          </div>
        ) : (
          <div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                style={{...styles.input, ...(errors.email ? styles.inputError : {})}}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
                placeholder="Enter your email"
                disabled={otpSent}
                required
              />
              {errors.email && <div style={styles.fieldError}>{errors.email}</div>}
            </div>

            {!otpSent ? (
              <button 
                type="button"
                style={
                  (email && !loading) ? 
                  styles.button : 
                  {...styles.button, ...styles.buttonDisabled}
                }
                onClick={handleSendOTP}
                disabled={!email || loading}
                onMouseOver={(e) => {
                  if (email && !loading) Object.assign(e.target.style, styles.buttonHover);
                }}
                onMouseOut={(e) => {
                  if (email && !loading) Object.assign(e.target.style, styles.button);
                }}
              >
                {loading ? (
                  <>
                    <div style={styles.loadingSpinner}></div>
                    Sending...
                  </>
                ) : (
                  'Send OTP Code'
                )}
              </button>
            ) : (
              <>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>OTP Code</label>
                  <input
                    type="text"
                    style={{...styles.input, ...(errors.otp ? styles.inputError : {})}}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                    onBlur={(e) => Object.assign(e.target.style, styles.input)}
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    required
                  />
                  {errors.otp && <div style={styles.fieldError}>{errors.otp}</div>}
                  
                  <div style={styles.otpNote}>
                    📧 OTP sent to your email address
                  </div>
                  
                  {timer > 0 ? (
                    <div style={styles.timerText}>
                      Resend available in {timer} seconds
                    </div>
                  ) : (
                    <button
                      type="button"
                      style={styles.resendButton}
                      onClick={handleResendOTP}
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Resend OTP'}
                    </button>
                  )}
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      style={{...styles.input, ...(errors.newPassword ? styles.inputError : {})}}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                      onBlur={(e) => Object.assign(e.target.style, styles.input)}
                      placeholder="Enter new password (min 6 chars)"
                      required
                    />
                    <button
                      type="button"
                      style={styles.eyeButton}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? '👁️' : '🙈'}
                    </button>
                  </div>
                  {errors.newPassword && <div style={styles.fieldError}>{errors.newPassword}</div>}
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Confirm New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      style={{...styles.input, ...(errors.confirmPassword ? styles.inputError : {})}}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                      onBlur={(e) => Object.assign(e.target.style, styles.input)}
                      placeholder="Confirm your new password"
                      required
                    />
                    <button
                      type="button"
                      style={styles.eyeButton}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? '👁️' : '🙈'}
                    </button>
                  </div>
                  {errors.confirmPassword && <div style={styles.fieldError}>{errors.confirmPassword}</div>}
                </div>

                <button 
                  type="button" 
                  style={
                    (otp && newPassword && confirmPassword && !loading) ? 
                    styles.button : 
                    {...styles.button, ...styles.buttonDisabled}
                  }
                  onClick={handleResetPassword}
                  disabled={!otp || !newPassword || !confirmPassword || loading}
                  onMouseOver={(e) => {
                    if (otp && newPassword && confirmPassword && !loading) Object.assign(e.target.style, styles.buttonHover);
                  }}
                  onMouseOut={(e) => {
                    if (otp && newPassword && confirmPassword && !loading) Object.assign(e.target.style, styles.button);
                  }}
                >
                  {loading ? (
                    <>
                      <div style={styles.loadingSpinner}></div>
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </>
            )}

            <a 
              style={styles.forgotLink}
              onClick={() => {
                setShowForgotPassword(false);
                setOtpSent(false);
                setOtp('');
                setNewPassword('');
                setConfirmPassword('');
                setTimer(0);
                setCanResendOtp(false);
                setErrors({});
              }}
              onMouseOver={(e) => Object.assign(e.target.style, styles.forgotLinkHover)}
              onMouseOut={(e) => Object.assign(e.target.style, styles.forgotLink)}
            >
              ← Back to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;