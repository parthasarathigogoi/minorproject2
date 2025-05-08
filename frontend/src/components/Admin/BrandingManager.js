import React, { useState } from 'react';
import { useBranding } from '../../context/BrandingContext';

const BrandingManager = () => {
  const { branding, updateBranding } = useBranding();
  const [institutionName, setInstitutionName] = useState(branding.institutionName);
  const [previewLogo, setPreviewLogo] = useState(branding.logo);
  const [successMessage, setSuccessMessage] = useState('');

  const handleNameChange = (e) => {
    setInstitutionName(e.target.value);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    updateBranding({
      institutionName,
      logo: previewLogo,
    });
    setSuccessMessage('Branding settings updated successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleRemoveLogo = () => {
    setPreviewLogo(null);
  };

  return (
    <div className="branding-manager">
      <h3>Institution Branding</h3>
      
      {successMessage && (
        <div className="success-message">{successMessage}</div>
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
          />
          <p className="help-text">This name will appear throughout the application</p>
        </div>

        <div className="form-group">
          <label>Institution Logo</label>
          <div className="logo-container">
            {previewLogo ? (
              <div className="logo-preview">
                <img src={previewLogo} alt="Institution Logo" />
                <button type="button" onClick={handleRemoveLogo}>Remove Logo</button>
              </div>
            ) : (
              <div className="logo-placeholder">No logo uploaded</div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
            />
            <p className="help-text">Recommended size: 200x60 pixels, PNG or SVG with transparent background</p>
          </div>
        </div>

        <div className="action-buttons">
          <button type="button" className="primary-btn" onClick={handleSaveSettings}>
            Save Branding Settings
          </button>
          <button 
            type="button" 
            className="reset-btn"
            onClick={() => {
              setInstitutionName('DigiClass');
              setPreviewLogo(null);
            }}
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

export default BrandingManager; 