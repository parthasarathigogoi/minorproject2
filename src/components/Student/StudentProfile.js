import React from 'react';
import { useAuth } from '../../context/AuthContext';

const StudentProfile = () => {
  const { currentUser } = useAuth();

  return (
    <div className="student-profile">
      <h2>Student Profile</h2>
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {currentUser?.fullName?.charAt(0) || 'S'}
          </div>
          <div className="profile-info">
            <h3>{currentUser?.fullName || 'Student'}</h3>
            <p>Student ID: {currentUser?._id || 'N/A'}</p>
          </div>
        </div>
        
        <div className="profile-details">
          <div className="detail-group">
            <label>Email</label>
            <p>{currentUser?.email || 'N/A'}</p>
          </div>
          
          <div className="detail-group">
            <label>Class Section</label>
            <p>{currentUser?.classSection?.name || 'N/A'}</p>
          </div>
          
          <div className="detail-group">
            <label>Joined On</label>
            <p>{currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;

 