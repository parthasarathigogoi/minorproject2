import React, { useState } from 'react';
import { FaSchool, FaUserPlus, FaEye, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';

const InstituteManagement = () => {
  const [activeTab, setActiveTab] = useState('view');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Dummy data for institutes
  const [institutes, setInstitutes] = useState([
    { 
      id: 1, 
      name: 'Springfield Elementary', 
      admin: 'Principal Skinner', 
      email: 'skinner@springfield.edu', 
      teachers: 15, 
      students: 324, 
      status: 'active',
      created: '2023-05-12'
    },
    { 
      id: 2, 
      name: 'Riverdale High School', 
      admin: 'Dr. Johnson', 
      email: 'johnson@riverdale.edu', 
      teachers: 42, 
      students: 756, 
      status: 'active',
      created: '2023-01-25'
    },
    { 
      id: 3, 
      name: 'Lincoln Academy', 
      admin: 'Prof. Wilson', 
      email: 'wilson@lincoln.edu', 
      teachers: 28, 
      students: 512, 
      status: 'pending',
      created: '2023-06-30'
    }
  ]);
  
  // Form state for creating new institute
  const [newInstitute, setNewInstitute] = useState({
    name: '',
    adminName: '',
    adminEmail: '',
    address: '',
    phone: '',
    type: 'k12',
    maxTeachers: 50,
    maxStudents: 1000
  });

  // Form state for inviting teachers
  const [teacherInvites, setTeacherInvites] = useState({
    instituteId: '',
    emails: '',
    role: 'teacher'
  });

  // Handle form changes for new institute
  const handleInstituteChange = (e) => {
    const { name, value } = e.target;
    setNewInstitute(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle teacher invite changes
  const handleInviteChange = (e) => {
    const { name, value } = e.target;
    setTeacherInvites(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit handler for creating institute
  const handleCreateInstitute = (e) => {
    e.preventDefault();
    // In a real application, this would make an API call
    const newInstituteEntry = {
      id: institutes.length + 1,
      name: newInstitute.name,
      admin: newInstitute.adminName,
      email: newInstitute.adminEmail,
      teachers: 0,
      students: 0,
      status: 'pending',
      created: new Date().toISOString().split('T')[0]
    };
    setInstitutes([...institutes, newInstituteEntry]);
    
    // Reset form
    setNewInstitute({
      name: '',
      adminName: '',
      adminEmail: '',
      address: '',
      phone: '',
      type: 'k12',
      maxTeachers: 50,
      maxStudents: 1000
    });
    
    // Switch to view tab
    setActiveTab('view');
  };

  // Submit handler for inviting teachers
  const handleInviteTeachers = (e) => {
    e.preventDefault();
    // In a real application, this would send invites
    alert(`Invitations sent to: ${teacherInvites.emails}`);
    
    // Reset form
    setTeacherInvites({
      instituteId: '',
      emails: '',
      role: 'teacher'
    });
  };

  // Filter institutes based on search and filter
  const filteredInstitutes = institutes.filter(institute => {
    const matchesSearch = 
      institute.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      institute.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      institute.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || institute.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="institute-management">
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          <FaEye /> View Institutes
        </button>
        <button 
          className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          <FaSchool /> Create Institute
        </button>
        <button 
          className={`tab-btn ${activeTab === 'invite' ? 'active' : ''}`}
          onClick={() => setActiveTab('invite')}
        >
          <FaUserPlus /> Invite Teachers
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'view' && (
          <div className="view-institutes">
            <div className="controls-bar">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input 
                  type="text"
                  placeholder="Search institutes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter-dropdown">
                <FaFilter className="filter-icon" />
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="institutes-table">
              <table>
                <thead>
                  <tr>
                    <th>Institute Name</th>
                    <th>Administrator</th>
                    <th>Email</th>
                    <th>Teachers</th>
                    <th>Students</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInstitutes.map(institute => (
                    <tr key={institute.id}>
                      <td>{institute.name}</td>
                      <td>{institute.admin}</td>
                      <td>{institute.email}</td>
                      <td>{institute.teachers}</td>
                      <td>{institute.students}</td>
                      <td>
                        <span className={`status-badge ${institute.status}`}>
                          {institute.status.charAt(0).toUpperCase() + institute.status.slice(1)}
                        </span>
                      </td>
                      <td>{institute.created}</td>
                      <td className="action-buttons">
                        <button className="icon-btn edit">
                          <FaEdit />
                        </button>
                        <button className="icon-btn delete">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="create-institute">
            <h3>Create New Institute</h3>
            <form onSubmit={handleCreateInstitute}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Institute Name*</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={newInstitute.name}
                    onChange={handleInstituteChange}
                    placeholder="Enter institute name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="type">Institute Type</label>
                  <select
                    id="type"
                    name="type"
                    value={newInstitute.type}
                    onChange={handleInstituteChange}
                  >
                    <option value="k12">K-12 School</option>
                    <option value="university">University</option>
                    <option value="college">College</option>
                    <option value="training">Training Center</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="adminName">Administrator Name*</label>
                  <input
                    id="adminName"
                    name="adminName"
                    type="text"
                    required
                    value={newInstitute.adminName}
                    onChange={handleInstituteChange}
                    placeholder="Enter administrator name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="adminEmail">Administrator Email*</label>
                  <input
                    id="adminEmail"
                    name="adminEmail"
                    type="email"
                    required
                    value={newInstitute.adminEmail}
                    onChange={handleInstituteChange}
                    placeholder="Enter administrator email"
                  />
                </div>
                
                <div className="form-group full-width">
                  <label htmlFor="address">Address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={newInstitute.address}
                    onChange={handleInstituteChange}
                    placeholder="Enter institute address"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={newInstitute.phone}
                    onChange={handleInstituteChange}
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="maxTeachers">Max Teachers</label>
                  <input
                    id="maxTeachers"
                    name="maxTeachers"
                    type="number"
                    min="1"
                    max="1000"
                    value={newInstitute.maxTeachers}
                    onChange={handleInstituteChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="maxStudents">Max Students</label>
                  <input
                    id="maxStudents"
                    name="maxStudents"
                    type="number"
                    min="1"
                    max="10000"
                    value={newInstitute.maxStudents}
                    onChange={handleInstituteChange}
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="primary-btn">Create Institute</button>
                <button type="button" className="secondary-btn" onClick={() => setActiveTab('view')}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'invite' && (
          <div className="invite-teachers">
            <h3>Invite Teachers</h3>
            <form onSubmit={handleInviteTeachers}>
              <div className="form-group">
                <label htmlFor="instituteId">Select Institute*</label>
                <select
                  id="instituteId"
                  name="instituteId"
                  required
                  value={teacherInvites.instituteId}
                  onChange={handleInviteChange}
                >
                  <option value="">-- Select Institute --</option>
                  {institutes.map(institute => (
                    <option key={institute.id} value={institute.id}>
                      {institute.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="emails">Email Addresses*</label>
                <textarea
                  id="emails"
                  name="emails"
                  required
                  value={teacherInvites.emails}
                  onChange={handleInviteChange}
                  placeholder="Enter email addresses, separated by commas"
                  rows="4"
                />
                <p className="help-text">Enter multiple email addresses separated by commas</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={teacherInvites.role}
                  onChange={handleInviteChange}
                >
                  <option value="teacher">Teacher</option>
                  <option value="department_head">Department Head</option>
                  <option value="assistant_admin">Assistant Administrator</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="primary-btn">Send Invitations</button>
                <button type="button" className="secondary-btn" onClick={() => setActiveTab('view')}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstituteManagement; 