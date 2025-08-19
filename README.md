# RTSP.io - Stream Management with Overlays

A production-ready web application for managing RTSP streams with customizable text and image overlays.

## Features

- **Stream Management**: Add, edit, and manage RTSP streams via rtsp.me embed URLs
- **Live Streaming**: View streams in real-time using rtsp.me iframe embeds
- **Overlay System**: Add text and image overlays with drag/resize capabilities
- **Persistent Settings**: Save overlay positions, styles, and visibility states
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **Python 3.11+** with Flask
- **MongoDB** (local or Atlas)
- **PyMongo** for database operations
- **Pydantic** for data validation
- **Flask-CORS** for cross-origin requests

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TanStack Query** for API state management
- **React Router** for navigation
- **TailwindCSS** for styling
- **React-RND** for drag/resize functionality

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB (local installation or Atlas cluster)

### MongoDB Setup

#### Option 1: Local MongoDB Installation
1. **Download and Install MongoDB Community Server**:
   - Visit [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Download MongoDB Community Server for your OS
   - Follow installation instructions for your platform

2. **Start MongoDB Service**:
   ```bash
   # Windows (as Administrator)
   net start MongoDB
   
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Linux (Ubuntu/Debian)
   sudo systemctl start mongod
   ```

3. **Verify Installation**:
   ```bash
   mongosh
   # or
   mongo
   ```

#### Option 2: MongoDB Atlas (Cloud)
1. **Create Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create Cluster**:
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select cloud provider and region
   - Click "Create"

3. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv .venv
   # Windows
   .venv\Scripts\activate
   # macOS/Linux
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and other settings
   ```
   
   **MongoDB Configuration**:
   - For local MongoDB: `MONGO_URI=mongodb://localhost:27017/rtsp_app`
   - For MongoDB Atlas: `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/rtsp_app`
   - Replace `username`, `password`, and `cluster` with your actual Atlas credentials

5. Run the backend:
   ```bash
   python app.py
   ```
   Backend will be available at http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your backend API URL
   ```

4. Run the frontend:
   ```bash
   npm run dev
   ```
   Frontend will be available at http://localhost:5173

## Usage

1. **Create a Stream**: Go to rtsp.me dashboard, create a stream with your RTSP URL, and copy the embed URL
2. **Add Stream**: In the app, add the stream with title and embed URL
3. **Add Overlays**: Select a stream and add text or image overlays
4. **Customize**: Drag, resize, and style overlays as needed
5. **Save**: Changes are automatically saved to the database

## API Documentation

See `docs/API.md` for complete API documentation.

## Development

### Backend Testing
```bash
cd backend
pytest
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Code Formatting

Backend:
```bash
cd backend
black .
isort .
flake8
```

Frontend:
```bash
cd frontend
npm run lint
npm run format
```

## Project Structure

```
RTSP.io/
├── backend/                 # Flask backend
│   ├── app.py              # Flask application factory
│   ├── config.py           # Configuration management
│   ├── extensions.py       # Flask extensions
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── schemas/            # Pydantic schemas
│   ├── utils/              # Utility functions
│   └── tests/              # Backend tests
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── routes/         # Page components
│   │   ├── api/            # API client
│   │   └── styles/         # CSS styles
│   └── tests/              # Frontend tests
└── docs/                   # Documentation
```

## Troubleshooting

### MongoDB Connection Issues
- **Local MongoDB**: Ensure MongoDB service is running
  ```bash
  # Windows
  net start MongoDB
  
  # macOS/Linux
  sudo systemctl status mongod
  ```
- **Atlas Connection**: Verify your IP is whitelisted in Atlas Network Access
- **Connection String**: Double-check username, password, and cluster name
- **Database Name**: The app will create the database automatically

### Common Issues
- **Port 27017 blocked**: Check firewall settings
- **Authentication failed**: Verify username/password in connection string
- **Network timeout**: Check internet connection for Atlas

## Security Notes

- Never commit `.env` files or secrets
- All user inputs are validated and sanitized
- CORS is configured to allow only specified origins
- RTSP.me credentials are optional and only used for listing streams

## License

MIT License
