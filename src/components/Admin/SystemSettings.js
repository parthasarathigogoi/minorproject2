import React from 'react';
import BrandingManager from './BrandingManager';

const SystemSettings = () => {
  return (
    <div className="system-settings-container">
      <h3>System Settings</h3>
      
      <div className="settings-section">
        <BrandingManager />
      </div>
      
      <div className="settings-section">
        <h4>General Settings</h4>
        <div className="setting-item">
          <label>Site Name</label>
          <input type="text" defaultValue="DigiClass" />
        </div>
        <div className="setting-item">
          <label>Contact Email</label>
          <input type="email" defaultValue="admin@example.edu" />
        </div>
      </div>
      
      <div className="settings-section">
        <h4>Access Control</h4>
        <div className="setting-item">
          <label>Allow Self-Registration</label>
          <input type="checkbox" defaultChecked />
        </div>
        <div className="setting-item">
          <label>Require Email Verification</label>
          <input type="checkbox" defaultChecked />
        </div>
        <div className="setting-item">
          <label>Allow Password Reset</label>
          <input type="checkbox" defaultChecked />
        </div>
      </div>
      
      <div className="settings-section">
        <h4>Maintenance</h4>
        <div className="setting-item">
          <label>Enable Maintenance Mode</label>
          <input type="checkbox" />
        </div>
        <div className="setting-item">
          <label>Maintenance Message</label>
          <textarea defaultValue="The system is currently undergoing maintenance. Please check back later."></textarea>
        </div>
      </div>
      
      <div className="actions">
        <button className="save-settings-btn">Save Settings</button>
        <button className="reset-settings-btn">Reset to Default</button>
      </div>
    </div>
  );
};

export default SystemSettings; 