# Phone Screen Viewer

A real-time phone screen viewing application built with Node.js, Express, Socket.IO, and WebRTC.

## Features

- 🔐 User authentication system
- 📱 Real-time screen sharing from phone to web viewer
- 🎥 WebRTC-based peer-to-peer connection
- 👀 Multiple viewer support
- 💻 Responsive web interface

## Installation

1. Install Node.js (if not already installed)

2. Install dependencies:
```bash
npm install
```

## Usage

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. Login with test credentials:

**Viewer Account:**
- Username: `admin`
- Password: `admin123`

**Phone/Streamer Account:**
- Username: `phone1`
- Password: `phone123`

## How It Works

### For Viewers (Desktop)
1. Login with the viewer account (`admin/admin123`)
2. You'll see a list of available devices
3. Click on a device to start viewing its screen
4. The phone screen will appear in real-time

### For Streamers (Phone/Desktop)
1. Login with the streamer account (`phone1/phone123`)
2. Click "Start Streaming"
3. Grant permission to share your screen
4. Your screen is now being broadcasted to viewers

## Using on Android Phone

1. Open Chrome browser on your Android phone
2. Navigate to `http://[YOUR-IP]:3000` (replace [YOUR-IP] with your computer's IP address)
3. Login as phone1/phone123
4. Start streaming your screen

To find your IP address:
- Windows: Open Command Prompt and type `ipconfig`
- Look for "IPv4 Address" under your network adapter

## Technical Stack

- **Backend**: Node.js + Express
- **Real-time Communication**: Socket.IO
- **Video Streaming**: WebRTC
- **Session Management**: express-session

## Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Phone/    │  WebRTC │   Server    │  WebRTC │   Viewer    │
│  Streamer   │◄───────►│  (Signaling)│◄───────►│  (Desktop)  │
└─────────────┘         └─────────────┘         └─────────────┘
      │                                                │
      └────────────── P2P Video Stream ───────────────┘
```

## Security Notes

⚠️ **This is a demo application. For production use:**
- Replace mock authentication with a real database
- Implement proper password hashing
- Use HTTPS/WSS
- Add proper session security
- Implement access controls
- Use environment variables for secrets

## Troubleshooting

**Cannot connect to server:**
- Ensure the server is running on port 3000
- Check firewall settings
- Make sure both devices are on the same network (or configure port forwarding)

**No video appearing:**
- Grant screen sharing permissions when prompted
- Try a different browser (Chrome recommended)
- Check browser console for errors

**Mobile issues:**
- Use Chrome browser on Android
- Ensure you're using HTTPS or same local network
- Some mobile browsers may have limited WebRTC support

## License

MIT
