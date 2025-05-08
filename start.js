const { spawn } = require('child_process');
const path = require('path');
const isWindows = process.platform === 'win32';

console.log('Starting DigiClassroom application...');
console.log('Starting backend server on port 5000...');

// Start the backend server
const backendProcess = spawn(
  isWindows ? 'nodemon.cmd' : 'nodemon',
  ['server/server.js'],
  {
    shell: true,
    cwd: __dirname,
    stdio: 'inherit'
  }
);

console.log('Starting frontend client on port 3000...');

// Start the frontend client
const frontendProcess = spawn(
  isWindows ? 'react-scripts.cmd' : 'react-scripts',
  ['start'],
  {
    shell: true, 
    cwd: __dirname,
    stdio: 'inherit',
    env: { 
      ...process.env,
      BROWSER: 'none',
      PORT: 3000
    }
  }
);

// Handle process termination
const cleanUp = () => {
  console.log('\nShutting down DigiClassroom application...');
  
  if (backendProcess) {
    backendProcess.kill();
  }
  
  if (frontendProcess) {
    frontendProcess.kill();
  }
  
  process.exit(0);
};

// Handle termination signals
process.on('SIGINT', cleanUp);
process.on('SIGTERM', cleanUp);
process.on('SIGQUIT', cleanUp);

console.log('\nDiGiClassroom is running!');
console.log('- Backend: http://localhost:5000');
console.log('- Frontend: http://localhost:3000');
console.log('\nPress Ctrl+C to stop all processes.\n'); 