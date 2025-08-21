import React, { useState, useEffect } from 'react';
import '../styles/AdminLoginPage.css'; // Assuming you have a CSS file for styling  

const AdminLoginPage = () => {
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
      case '/api/admin/login':
        if (data.email === 'admin@company.com' && data.password === 'admin123') {
          return { 
            success: true, 
            token: 'admin_token_xyz789', 
            user: { 
              email: data.email, 
              name: 'Admin User',
              role: 'administrator',
              permissions: ['read', 'write', 'delete', 'manage_users']
            } 
          };
        } else {
          throw new Error('Invalid admin credentials. Please check your email and password.');
        }
      
      case '/api/admin/google-auth':
        return { 
          success: true, 
          token: 'admin_google_token_456', 
          user: { 
            email: 'admin@gmail.com', 
            name: 'Google Admin',
            role: 'administrator',
            permissions: ['read', 'write', 'manage_users']
          } 
        };
      
      case '/api/admin/send-reset-otp':
        if (validateEmail(data.email)) {
          return { success: true, message: 'Admin password reset OTP sent successfully' };
        } else {
          throw new Error('Invalid admin email address');
        }
      
      case '/api/admin/reset-password':
        if (data.otp === '123456') {
          return { success: true, message: 'Admin password reset successfully' };
        } else {
          throw new Error('Invalid OTP code. Please try again.');
        }
      
      default:
        throw new Error('Admin API endpoint not found');
    }
  };

  const handleAdminLogin = async () => {
    setErrors({});
    
    // Validation
    const newErrors = {};
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid admin email address';
    }
    if (!validatePassword(password)) {
      newErrors.password = 'Admin password must be at least 6 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiCall('/api/admin/login', { email, password });
      console.log('Admin login successful:', response);
      
      setIsAuthenticated(true);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminGoogleLogin = async () => {
    setLoading(true);
    
    try {
      const response = await apiCall('/api/admin/google-auth', {});
      console.log('Admin Google login successful:', response);
      setIsAuthenticated(true);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSendAdminOTP = async () => {
    setErrors({});
    
    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid admin email address' });
      return;
    }

    setLoading(true);
    
    try {
      await apiCall('/api/admin/send-reset-otp', { email });
      setOtpSent(true);
      setTimer(60);
      setCanResendOtp(false);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResendAdminOTP = async () => {
    if (!canResendOtp) return;
    
    setLoading(true);
    
    try {
      await apiCall('/api/admin/send-reset-otp', { email });
      setTimer(60);
      setCanResendOtp(false);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminPasswordReset = async () => {
    setErrors({});
    
    // Validation
    const newErrors = {};
    if (!validateOTP(otp)) {
      newErrors.otp = 'Please enter a valid 6-digit OTP';
    }
    if (!validatePassword(newPassword)) {
      newErrors.newPassword = 'New admin password must be at least 6 characters';
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Admin passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      await apiCall('/api/admin/reset-password', { email, otp, newPassword });
      
      // Reset form
      setShowForgotPassword(false);
      setOtpSent(false);
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setTimer(0);
      
      setErrors({ success: 'Admin password reset successfully! You can now login with your new password.' });
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setErrors({});
  };

  // Render authenticated admin dashboard
  if (isAuthenticated) {
    return (
      <div className="admin-dashboard-container-xyz123">
        <div className="admin-dashboard-card-abc789">
          <h2 className="admin-dashboard-title-def456">Admin Dashboard</h2>
          
          <div className="admin-welcome-section-ghi321">
            <h3 className="admin-welcome-heading-jkl654">Welcome to Admin Panel!</h3>
            <p className="admin-user-info-mno987">
              You are successfully logged in as Administrator: <strong>{email}</strong>
            </p>
          </div>
          
          <div className="admin-stats-container-pqr135">
            <div className="admin-stats-card-stu246">
              <h4 className="admin-stats-heading-vwx357">Admin Quick Stats</h4>
              <p className="admin-last-login-yzab468">
                Last admin login: {new Date().toLocaleDateString()}
              </p>
              <p className="admin-role-info-cdef579">
                Role: Administrator
              </p>
            </div>
            
            <div className="admin-actions-card-ghij680">
              <h4 className="admin-actions-heading-klmn791">Quick Actions</h4>
              <div className="admin-action-buttons-opqr802">
                <button className="admin-action-btn-users-stuv913">
                  Manage Users
                </button>
                <button className="admin-action-btn-settings-wxyz024">
                  System Settings
                </button>
                <button className="admin-action-btn-reports-abcd135">
                  View Reports
                </button>
              </div>
            </div>
          </div>

          <button 
            className="admin-logout-button-efgh246"
            onClick={handleAdminLogout}
          >
            Admin Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-main-container-ijkl357">
      <div className="admin-login-form-card-mnop468">
        <h2 className="admin-login-title-qrst579">
          {showForgotPassword ? 'Reset Admin Password' : 'Admin Login Portal'}
        </h2>

        {errors.general && (
          <div className="admin-error-message-uvwx680">
            {errors.general}
          </div>
        )}

        {errors.success && (
          <div className="admin-success-message-yzab791">
            {errors.success}
          </div>
        )}

        {!showForgotPassword ? (
          <div className="admin-login-form-section-cdef802">
            <button 
              type="button"
              className="admin-google-login-btn-ghij913"
              onClick={handleAdminGoogleLogin}
              disabled={loading}
            >
              {loading ? 'Authenticating Admin...' : 'Continue with Google (Admin)'}
            </button>

            <div className="admin-divider-section-klmn024">
              <div className="admin-divider-line-opqr135"></div>
              <span className="admin-divider-text-stuv246">or login with admin credentials</span>
            </div>

            <div className="admin-email-input-group-wxyz357">
              <label className="admin-email-label-abcd468">Admin Email Address</label>
              <input
                type="email"
                className="admin-email-input-efgh579"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your admin email"
                required
              />
              {errors.email && <div className="admin-email-error-ijkl680">{errors.email}</div>}
            </div>

            <div className="admin-password-input-group-mnop791">
              <label className="admin-password-label-qrst802">Admin Password</label>
              <div className="admin-password-wrapper-uvwx913">
                <input
                  type={showPassword ? "text" : "password"}
                  className="admin-password-input-yzab024"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your admin password"
                  required
                />
                <button
                  type="button"
                  className="admin-password-toggle-cdef135"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <div className="admin-password-error-ghij246">{errors.password}</div>}
            </div>

            <button 
              type="button" 
              className="admin-signin-button-klmn357"
              onClick={handleAdminLogin}
              disabled={!email || !password || loading}
            >
              {loading ? 'Signing in to Admin Panel...' : 'Sign In as Admin'}
            </button>

            <a 
              className="admin-forgot-password-link-opqr468"
              onClick={() => {
                setShowForgotPassword(true);
                setErrors({});
              }}
            >
              Forgot admin password?
            </a>
          </div>
        ) : (
          <div className="admin-password-reset-section-stuv579">
            <div className="admin-reset-email-group-wxyz680">
              <label className="admin-reset-email-label-abcd791">Admin Email Address</label>
              <input
                type="email"
                className="admin-reset-email-input-efgh802"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your admin email"
                disabled={otpSent}
                required
              />
              {errors.email && <div className="admin-reset-email-error-ijkl913">{errors.email}</div>}
            </div>

            {!otpSent ? (
              <button 
                type="button"
                className="admin-send-otp-button-mnop024"
                onClick={handleSendAdminOTP}
                disabled={!email || loading}
              >
                {loading ? 'Sending Admin OTP...' : 'Send Admin Reset OTP'}
              </button>
            ) : (
              <div className="admin-otp-reset-form-qrst135">
                <div className="admin-otp-input-group-uvwx246">
                  <label className="admin-otp-label-yzab357">Admin OTP Code</label>
                  <input
                    type="text"
                    className="admin-otp-input-cdef468"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit admin OTP"
                    maxLength="6"
                    required
                  />
                  {errors.otp && <div className="admin-otp-error-ghij579">{errors.otp}</div>}
                  
                  <div className="admin-otp-info-klmn680">
                    Admin OTP sent to your registered email
                  </div>
                  
                  {timer > 0 ? (
                    <div className="admin-otp-timer-opqr791">
                      Admin OTP resend available in {timer} seconds
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="admin-resend-otp-btn-stuv802"
                      onClick={handleResendAdminOTP}
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Resend Admin OTP'}
                    </button>
                  )}
                </div>

                <div className="admin-new-password-group-wxyz913">
                  <label className="admin-new-password-label-abcd024">New Admin Password</label>
                  <div className="admin-new-password-wrapper-efgh135">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="admin-new-password-input-ijkl246"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new admin password (min 6 chars)"
                      required
                    />
                    <button
                      type="button"
                      className="admin-new-password-toggle-mnop357"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {errors.newPassword && <div className="admin-new-password-error-qrst468">{errors.newPassword}</div>}
                </div>

                <div className="admin-confirm-password-group-uvwx579">
                  <label className="admin-confirm-password-label-yzab680">Confirm New Admin Password</label>
                  <div className="admin-confirm-password-wrapper-cdef791">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="admin-confirm-password-input-ghij802"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new admin password"
                      required
                    />
                    <button
                      type="button"
                      className="admin-confirm-password-toggle-klmn913"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {errors.confirmPassword && <div className="admin-confirm-password-error-opqr024">{errors.confirmPassword}</div>}
                </div>

                <button 
                  type="button" 
                  className="admin-reset-password-btn-stuv135"
                  onClick={handleAdminPasswordReset}
                  disabled={!otp || !newPassword || !confirmPassword || loading}
                >
                  {loading ? 'Resetting Admin Password...' : 'Reset Admin Password'}
                </button>
              </div>
            )}

            <a 
              className="admin-back-to-login-link-wxyz246"
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
            >
              Back to Admin Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLoginPage;