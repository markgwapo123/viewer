const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Trust proxy for production (Render uses proxies)
app.set('trust proxy', 1);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'screen-viewer-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files
app.use(express.static('public'));

// Mock user database (replace with real database in production)
const users = {
  'admin': { password: 'admin123', role: 'viewer' },
  'phone1': { password: 'phone123', role: 'streamer' }
};

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (users[username] && users[username].password === password) {
    req.session.user = {
      username,
      role: users[username].role
    };
    res.json({ 
      success: true, 
      user: { username, role: users[username].role }
    });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.get('/api/user', requireAuth, (req, res) => {
  res.json({ user: req.session.user });
});

// Serve pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/viewer', requireAuth, (req, res) => {
  if (req.session.user.role === 'viewer') {
    res.sendFile(path.join(__dirname, 'public', 'viewer.html'));
  } else {
    res.redirect('/streamer');
  }
});

app.get('/streamer', requireAuth, (req, res) => {
  if (req.session.user.role === 'streamer') {
    res.sendFile(path.join(__dirname, 'public', 'streamer.html'));
  } else {
    res.redirect('/viewer');
  }
});

// WebRTC signaling
const streamers = new Map();
const viewers = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('register-streamer', (data) => {
    streamers.set(socket.id, { username: data.username });
    console.log('Streamer registered:', data.username);
    
    // Notify all viewers that a new streamer is available
    io.emit('streamer-available', { 
      streamerId: socket.id, 
      username: data.username 
    });
  });

  socket.on('register-viewer', (data) => {
    viewers.set(socket.id, { username: data.username });
    console.log('Viewer registered:', data.username);
    
    // Send list of available streamers to the viewer
    const availableStreamers = Array.from(streamers.entries()).map(([id, data]) => ({
      streamerId: id,
      username: data.username
    }));
    socket.emit('streamers-list', availableStreamers);
  });

  socket.on('request-stream', (data) => {
    const { streamerId } = data;
    console.log('Viewer requesting stream from:', streamerId);
    
    // Forward request to streamer
    io.to(streamerId).emit('stream-requested', { 
      viewerId: socket.id 
    });
  });

  socket.on('offer', (data) => {
    const { targetId, offer } = data;
    console.log('Forwarding offer to:', targetId);
    io.to(targetId).emit('offer', { 
      senderId: socket.id, 
      offer 
    });
  });

  socket.on('answer', (data) => {
    const { targetId, answer } = data;
    console.log('Forwarding answer to:', targetId);
    io.to(targetId).emit('answer', { 
      senderId: socket.id, 
      answer 
    });
  });

  socket.on('ice-candidate', (data) => {
    const { targetId, candidate } = data;
    io.to(targetId).emit('ice-candidate', { 
      senderId: socket.id, 
      candidate 
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    if (streamers.has(socket.id)) {
      streamers.delete(socket.id);
      io.emit('streamer-unavailable', { streamerId: socket.id });
    }
    
    if (viewers.has(socket.id)) {
      viewers.delete(socket.id);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('\nTest credentials:');
  console.log('Viewer - Username: admin, Password: admin123');
  console.log('Phone/Streamer - Username: phone1, Password: phone123');
});
