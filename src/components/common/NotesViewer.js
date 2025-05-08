import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaDownload, FaBookOpen, FaPrint, FaShareAlt, FaFolder, FaFolderOpen } from 'react-icons/fa';
import '../../styles/NotesViewer.css';

const NotesViewer = ({ userRole }) => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState('root');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for notes
  useEffect(() => {
    // This would be replaced with an actual API call in a real app
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const mockFolders = [
        { id: 'f1', name: 'Mathematics', parent: 'root' },
        { id: 'f2', name: 'Physics', parent: 'root' },
        { id: 'f3', name: 'Computer Science', parent: 'root' },
        { id: 'f4', name: 'Calculus', parent: 'f1' },
        { id: 'f5', name: 'Mechanics', parent: 'f2' },
      ];
      
      const mockNotes = [
        { 
          id: 1, 
          title: 'Introduction to Calculus', 
          folder: 'f4',
          type: 'pdf', 
          content: `# Introduction to Calculus
          
Calculus is the mathematical study of continuous change. 
It has two major branches: differential calculus and integral calculus.

## Key Concepts:
- Limits
- Derivatives
- Integrals
- Series

Calculus is fundamental to many fields including physics, engineering, economics, and computer science.`,
          dateUploaded: '2023-05-15',
          teacher: 'Prof. Smith',
          size: '1.2 MB'
        },
        { 
          id: 2, 
          title: 'Physics Formulas', 
          folder: 'f5',
          type: 'doc', 
          content: `# Essential Physics Formulas

## Mechanics:
- Force: F = ma
- Kinetic Energy: KE = ½mv²
- Potential Energy: PE = mgh
- Work: W = Fd

## Thermodynamics:
- First Law: ΔU = Q - W
- Ideal Gas Law: PV = nRT

## Electromagnetism:
- Coulomb's Law: F = kq₁q₂/r²
- Ohm's Law: V = IR`,
          dateUploaded: '2023-05-18',
          teacher: 'Dr. Johnson',
          size: '850 KB'
        },
        { 
          id: 3, 
          title: 'Programming Concepts', 
          folder: 'f3',
          type: 'ppt', 
          content: `# Programming Fundamentals

## Variables and Data Types
Variables store data for processing.
Data types include integers, strings, floats, booleans.

## Control Structures
- Conditionals (if/else)
- Loops (for, while)
- Switch statements

## Functions
Reusable blocks of code that perform specific tasks.
Parameters allow functions to work with different inputs.

## Object-Oriented Programming
- Classes
- Inheritance
- Encapsulation
- Polymorphism`,
          dateUploaded: '2023-05-20',
          teacher: 'Prof. Davis',
          size: '3.5 MB'
        },
      ];
      
      setFolders(mockFolders);
      setNotes(mockNotes);
      setIsLoading(false);
    }, 800);
  }, []);

  const filteredNotes = notes
    .filter(note => 
      (currentFolder === 'root' || note.folder === currentFolder) &&
      (searchQuery === '' || note.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const getCurrentFolderName = () => {
    if (currentFolder === 'root') return 'All Notes';
    const folder = folders.find(f => f.id === currentFolder);
    return folder ? folder.name : 'Unknown Folder';
  };

  const getChildFolders = (parentId) => {
    return folders.filter(folder => folder.parent === parentId);
  };

  const handleFolderClick = (folderId) => {
    setCurrentFolder(folderId);
    setSelectedNote(null);
  };

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
  };

  const handleBackClick = () => {
    if (currentFolder !== 'root') {
      const currentFolderObj = folders.find(f => f.id === currentFolder);
      setCurrentFolder(currentFolderObj ? currentFolderObj.parent : 'root');
    }
  };

  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf':
        return <FaFileAlt className="file-icon pdf" />;
      case 'doc':
        return <FaFileAlt className="file-icon doc" />;
      case 'ppt':
        return <FaFileAlt className="file-icon ppt" />;
      default:
        return <FaFileAlt className="file-icon" />;
    }
  };

  return (
    <div className="notes-viewer">
      <div className="notes-header">
        <h2>Course Notes & Materials</h2>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search notes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="notes-main">
        <div className="notes-sidebar">
          <div className="sidebar-header">
            <h3>Folders</h3>
            {userRole === 'teacher' && (
              <button className="add-folder-btn">+ New Folder</button>
            )}
          </div>
          
          <div className="folder-list">
            <div 
              className={`folder-item ${currentFolder === 'root' ? 'active' : ''}`}
              onClick={() => setCurrentFolder('root')}
            >
              <FaFolder /> All Notes
            </div>
            
            {folders
              .filter(folder => folder.parent === 'root')
              .map(folder => (
                <div 
                  key={folder.id}
                  className={`folder-item ${currentFolder === folder.id ? 'active' : ''}`}
                  onClick={() => handleFolderClick(folder.id)}
                >
                  {currentFolder === folder.id ? <FaFolderOpen /> : <FaFolder />} {folder.name}
                </div>
              ))
            }
          </div>
          
          {userRole === 'teacher' && (
            <div className="upload-section">
              <button className="upload-btn">
                <FaFileAlt /> Upload New Note
              </button>
            </div>
          )}
        </div>
        
        <div className="notes-content">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading notes...</p>
            </div>
          ) : selectedNote ? (
            <div className="note-viewer">
              <div className="note-viewer-header">
                <button className="back-btn" onClick={() => setSelectedNote(null)}>
                  &larr; Back to notes
                </button>
                <div className="note-actions">
                  <button className="action-btn"><FaPrint /> Print</button>
                  <button className="action-btn"><FaDownload /> Download</button>
                  {userRole === 'teacher' && (
                    <button className="action-btn"><FaShareAlt /> Share</button>
                  )}
                </div>
              </div>
              
              <div className="note-details">
                <h2>{selectedNote.title}</h2>
                <div className="note-meta">
                  <span>Uploaded by: {selectedNote.teacher}</span>
                  <span>Date: {selectedNote.dateUploaded}</span>
                  <span>Size: {selectedNote.size}</span>
                </div>
              </div>
              
              <div className="note-content">
                {/* In a real app, this would render the actual content in the appropriate format */}
                <pre>{selectedNote.content}</pre>
              </div>
            </div>
          ) : (
            <>
              <div className="folder-navigation">
                {currentFolder !== 'root' && (
                  <button className="back-btn" onClick={handleBackClick}>
                    &larr; Back
                  </button>
                )}
                <h3>{getCurrentFolderName()}</h3>
              </div>
              
              <div className="subfolders">
                {getChildFolders(currentFolder).map(folder => (
                  <div 
                    key={folder.id}
                    className="folder-card"
                    onClick={() => handleFolderClick(folder.id)}
                  >
                    <FaFolder className="folder-icon" />
                    <span>{folder.name}</span>
                  </div>
                ))}
              </div>
              
              {filteredNotes.length > 0 ? (
                <div className="notes-list">
                  {filteredNotes.map(note => (
                    <div 
                      key={note.id}
                      className="note-card"
                      onClick={() => handleNoteSelect(note)}
                    >
                      {getFileIcon(note.type)}
                      <div className="note-info">
                        <h4>{note.title}</h4>
                        <div className="note-meta">
                          <span>{note.teacher}</span>
                          <span>•</span>
                          <span>{note.dateUploaded}</span>
                          <span>•</span>
                          <span>{note.size}</span>
                        </div>
                      </div>
                      <div className="note-actions">
                        <button className="icon-btn read">
                          <FaBookOpen />
                        </button>
                        <button className="icon-btn download">
                          <FaDownload />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-notes">
                  <div className="empty-icon">
                    <FaFileAlt />
                  </div>
                  <p>No notes found in this folder.</p>
                  {userRole === 'teacher' && (
                    <button className="upload-btn">
                      <FaFileAlt /> Upload New Note
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesViewer; 