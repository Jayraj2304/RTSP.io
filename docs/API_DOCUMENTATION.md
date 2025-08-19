# RTSP.io API Documentation

## Overview

The RTSP.io API provides endpoints for managing video streams and overlays. The API is built with Flask and uses MongoDB for data persistence.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Endpoints

### Health Check

#### GET /
Returns the health status of the API.

**Response:**
```json
{
  "status": "healthy",
  "message": "RTSP.io API is running"
}
```

#### GET /api/health
Returns detailed health information including MongoDB connection status.

**Response:**
```json
{
  "status": "healthy",
  "mongodb": "connected",
  "version": "1.0.0"
}
```

### RTSP.me Integration

#### POST /api/rtspme/convert-rtsp
Converts an RTSP URL to an RTSP.me embed URL.

**Request Body:**
```json
{
  "rtsp_url": "rtsp://username:password@ip:port/stream",
  "name": "My Camera Stream",
  "ip": "192.168.1.100"
}
```

**Response:**
```json
{
  "success": true,
  "rtsp_url": "rtsp://username:password@ip:port/stream",
  "stream_id": "K68Zhiyr",
  "name": "My Camera Stream",
  "embed_url": "https://rtsp.me/embed/K68Zhiyr/",
  "access_url": "https://rtsp.me/personal/K68Zhiyr/...",
  "stream_url": "https://rtsp.me/personal/K68Zhiyr/...",
  "poster_url": "https://rtsp.me/poster/K68Zhiyr.jpg",
  "monthly_counter": "0",
  "iframe_code": "<iframe width=\"640\" height=\"480\" src=\"https://rtsp.me/embed/K68Zhiyr/\" frameborder=\"0\" title=\"RTSP Stream Player\" allowfullscreen></iframe>",
  "note": "Standard RTSP.me embed URL generated. Each RTSP URL will play its specific video content."
}
```

### Overlays CRUD Operations

#### GET /api/overlays/
Retrieves all overlays for a specific stream.

**Query Parameters:**
- `stream_id` (optional): Stream identifier (default: "default")

**Response:**
```json
{
  "success": true,
  "overlays": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "stream_id": "default",
      "type": "text",
      "content": "Sample Text Overlay",
      "position": {
        "x": 50,
        "y": 50
      },
      "size": {
        "w": 200,
        "h": 50
      },
      "zIndex": 1,
      "visible": true,
      "style": {
        "color": "#ffffff",
        "fontSize": 16,
        "background": "rgba(0,0,0,0.5)",
        "borderRadius": 4
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### GET /api/overlays/{overlay_id}
Retrieves a specific overlay by ID.

**Path Parameters:**
- `overlay_id`: MongoDB ObjectId of the overlay

**Response:**
```json
{
  "success": true,
  "overlay": {
    "_id": "507f1f77bcf86cd799439011",
    "stream_id": "default",
    "type": "text",
    "content": "Sample Text Overlay",
    "position": {
      "x": 50,
      "y": 50
    },
    "size": {
      "w": 200,
      "h": 50
    },
    "zIndex": 1,
    "visible": true,
    "style": {
      "color": "#ffffff",
      "fontSize": 16,
      "background": "rgba(0,0,0,0.5)",
      "borderRadius": 4
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/overlays/
Creates a new overlay.

**Request Body:**
```json
{
  "stream_id": "default",
  "type": "text",
  "content": "New Text Overlay",
  "position": {
    "x": 100,
    "y": 100
  },
  "size": {
    "w": 200,
    "h": 50
  },
  "zIndex": 1,
  "visible": true,
  "style": {
    "color": "#ffffff",
    "fontSize": 16,
    "background": "rgba(0,0,0,0.5)",
    "borderRadius": 4
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Overlay created successfully",
  "overlay": {
    "_id": "507f1f77bcf86cd799439011",
    "stream_id": "default",
    "type": "text",
    "content": "New Text Overlay",
    "position": {
      "x": 100,
      "y": 100
    },
    "size": {
      "w": 200,
      "h": 50
    },
    "zIndex": 1,
    "visible": true,
    "style": {
      "color": "#ffffff",
      "fontSize": 16,
      "background": "rgba(0,0,0,0.5)",
      "borderRadius": 4
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /api/overlays/{overlay_id}
Updates an existing overlay.

**Path Parameters:**
- `overlay_id`: MongoDB ObjectId of the overlay

**Request Body:**
```json
{
  "content": "Updated Text Content",
  "position": {
    "x": 150,
    "y": 150
  },
  "visible": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Overlay updated successfully",
  "overlay": {
    "_id": "507f1f77bcf86cd799439011",
    "stream_id": "default",
    "type": "text",
    "content": "Updated Text Content",
    "position": {
      "x": 150,
      "y": 150
    },
    "size": {
      "w": 200,
      "h": 50
    },
    "zIndex": 1,
    "visible": false,
    "style": {
      "color": "#ffffff",
      "fontSize": 16,
      "background": "rgba(0,0,0,0.5)",
      "borderRadius": 4
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

#### DELETE /api/overlays/{overlay_id}
Deletes a specific overlay.

**Path Parameters:**
- `overlay_id`: MongoDB ObjectId of the overlay

**Response:**
```json
{
  "success": true,
  "message": "Overlay deleted successfully"
}
```

#### DELETE /api/overlays/stream/{stream_id}
Deletes all overlays for a specific stream.

**Path Parameters:**
- `stream_id`: Stream identifier

**Response:**
```json
{
  "success": true,
  "message": "Deleted 3 overlays for stream default"
}
```

## Data Models

### Overlay Object

```json
{
  "_id": "MongoDB ObjectId",
  "stream_id": "string",
  "type": "text|image",
  "content": "string",
  "position": {
    "x": "number",
    "y": "number"
  },
  "size": {
    "w": "number",
    "h": "number"
  },
  "zIndex": "number",
  "visible": "boolean",
  "style": {
    "color": "string (hex color)",
    "fontSize": "number",
    "background": "string (CSS background)",
    "borderRadius": "number"
  },
  "createdAt": "ISO 8601 date string",
  "updatedAt": "ISO 8601 date string"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "message": "Additional error details"
}
```

### Common HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Rate Limiting

Currently, no rate limiting is implemented.

## CORS

The API supports CORS for the following origins:
- `http://localhost:5173`
- `http://127.0.0.1:5173`

## Environment Variables

The following environment variables can be configured:

- `MONGODB_URL`: MongoDB connection string (default: `mongodb://localhost:27017/rtspio`)
- `RTSPME_EMAIL`: RTSP.me account email
- `RTSPME_PASSWORD`: RTSP.me account password
- `FLASK_DEBUG`: Enable Flask debug mode (default: `True`)
