import React, { useState, useCallback, useEffect } from 'react';
import { useBranding } from '../../context/BrandingContext';

const BrandingManager = () => {
  const { branding, updateBranding } = useBranding();
  const [institutionName, setInstitutionName] = useState('');
  const [previewLogo, setPreviewLogo] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with context values when component mounts or context changes
  useEffect(() => {
    setInstitutionName(branding.institutionName || '');
    setPreviewLogo(branding.logo || null);
  }, [branding]);

  const handleNameChange = useCallback((e) => {
    setInstitutionName(e.target.value);
  }, []);

  const handleLogoChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Logo image is too large. Maximum size is 2MB.');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Invalid file type. Please upload a JPEG, PNG, SVG, or GIF image.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewLogo(reader.result);
      setErrorMessage('');
    };
    reader.onerror = () => {
      setErrorMessage('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSaveSettings = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await updateBranding({
        institutionName,
        logo: previewLogo,
      });
      setSuccessMessage('Branding settings updated successfully!');
      
      // Auto-dismiss success message after 3 seconds
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      return () => clearTimeout(timer);
    } catch (error) {
      setErrorMessage(`Failed to update branding: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [institutionName, previewLogo, updateBranding]);

  const handleRemoveLogo = useCallback(() => {
    setPreviewLogo(null);
  }, []);

  const handleResetToDefault = useCallback(() => {
    setInstitutionName('DigiClass');
    setPreviewLogo(null);
    setErrorMessage('');
  }, []);

  return (
    <div className="branding-manager">
      <h3>Institution Branding</h3>
      
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}

      <div className="branding-form">
        <div className="form-group">
          <label htmlFor="institutionName">Institution Name</label>
          <input
            id="institutionName"
            type="text"
            value={institutionName}
            onChange={handleNameChange}
            placeholder="Enter your institution name"
            disabled={isLoading}
          />
          <p className="help-text">This name will appear throughout the application</p>
        </div>

        <div className="form-group">
          <label>Institution Logo</label>
          <div className="logo-container">
            {previewLogo ? (
              <div className="logo-preview">
                <img src={previewLogo} alt="Institution Logo" />
                <button 
                  type="button" 
                  onClick={handleRemoveLogo}
                  disabled={isLoading}
                >
                  Remove Logo
                </button>
              </div>
            ) : (
              <div className="logo-placeholder">No logo uploaded</div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              disabled={isLoading}
            />
            <p className="help-text">Recommended size: 200x60 pixels, PNG or SVG with transparent background</p>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            type="button" 
            className="primary-btn" 
            onClick={handleSaveSettings}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Branding Settings'}
          </button>
          <button 
            type="button" 
            className="reset-btn"
            onClick={handleResetToDefault}
            disabled={isLoading}
          >
            Reset to Default
          </button>
        </div>
      </div>

      <div className="branding-preview">
        <h4>Preview</h4>
        <div className="preview-box">
          <div className="header-preview">
            {previewLogo && <img src={previewLogo} alt="Logo Preview" className="preview-logo" />}
            <h2>{institutionName} - Admin Portal</h2>
          </div>
          <div className="login-button-preview">
            <button disabled>Login to {institutionName}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BrandingManager); 