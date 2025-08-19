# RTSP.io User Guide

## Getting Started

### Prerequisites
- Python 3.11+ installed
- Node.js 18+ installed
- MongoDB (local installation or Atlas cluster)
- RTSP camera or stream source

### Setup Instructions

1. **Clone and Setup Backend**
   ```bash
   cd backend
   python -m venv .venv
   # Windows
   .venv\Scripts\activate
   # macOS/Linux
   source .venv/bin/activate
   pip install -r requirements.txt
   cp env.example .env
   # Edit .env with your MongoDB URI and other settings
   python app.py
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp env.example .env
   # Edit .env with your backend API URL
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Creating a Stream on rtsp.me

1. **Sign up/Login to rtsp.me**
   - Go to https://rtsp.me
   - Create an account or log in

2. **Add a New Stream**
   - Click "Add Stream" or "New Stream"
   - Enter a name for your stream
   - Enter your RTSP URL (e.g., `rtsp://192.168.1.100:554/stream`)
   - Click "Create" or "Save"

3. **Get the Embed URL**
   - Once the stream is created, find the "Embed" or "Share" section
   - Copy the embed URL (format: `https://rtsp.me/embed/abc123`)
   - This URL will be used in the RTSP.io application

## Using RTSP.io

### Managing Streams

1. **Add a Stream**
   - Navigate to "Manage Streams"
   - Click "Add Stream"
   - Enter a title for your stream
   - Paste the embed URL from rtsp.me
   - Optionally add the original RTSP URL for reference
   - Click "Create Stream"

2. **Edit a Stream**
   - Find the stream in the list
   - Click the edit icon
   - Modify the title or embed URL
   - Click "Update Stream"

3. **Delete a Stream**
   - Find the stream in the list
   - Click the delete icon
   - Confirm deletion
   - Note: This will also delete all associated overlays

### Managing Overlays

1. **Add an Overlay**
   - Navigate to "Manage Overlays"
   - Select a stream from the dropdown
   - Click "Add Overlay"
   - Choose overlay type (Text or Image)
   - Configure the overlay:
     - **Text Overlays**: Enter text content, set color, font size, opacity
     - **Image Overlays**: Enter image URL (must be HTTPS)
   - Set position (X, Y coordinates)
   - Set size (width, height)
   - Set Z-index (higher numbers appear on top)
   - Choose visibility
   - Click "Create Overlay"

2. **Edit Overlays**
   - Find the overlay in the list
   - Click the edit icon
   - Modify any properties
   - Click "Update Overlay"

3. **Delete Overlays**
   - Find the overlay in the list
   - Click the delete icon
   - Confirm deletion

### Viewing Streams with Overlays

1. **Select a Stream**
   - Go to the main page (Live Stream)
   - Choose a stream from the dropdown
   - The stream will load in the player

2. **Edit Mode**
   - Click "Edit Mode" to enable overlay editing
   - Drag overlays to move them
   - Use corner handles to resize overlays
   - Click overlays to select them
   - Use toolbar buttons to:
     - Show/hide overlays
     - Delete selected overlay
     - Save changes
     - Cancel changes

3. **View Mode**
   - Exit edit mode to view the stream normally
   - Overlays will be displayed but not editable

## Overlay Types

### Text Overlays
- **Content**: Any text string
- **Styling**: Color, font family, font size, opacity, background, border radius
- **Use Cases**: Titles, labels, timestamps, status messages

### Image Overlays
- **Content**: HTTPS URL to an image
- **Styling**: Opacity, border radius
- **Use Cases**: Logos, watermarks, icons, graphics

## Best Practices

### Stream Management
- Use descriptive titles for streams
- Keep RTSP URLs secure and private
- Test embed URLs before adding to the system
- Regularly update stream information

### Overlay Design
- Use high contrast colors for text overlays
- Keep text overlays concise and readable
- Position overlays to avoid covering important content
- Use appropriate Z-index values for layering
- Test overlay visibility on different backgrounds

### Performance
- Limit the number of overlays per stream
- Use optimized image formats (PNG, WebP)
- Keep image file sizes reasonable
- Monitor stream performance with overlays

## Troubleshooting

### Stream Not Loading
- Verify the embed URL is correct
- Check if the rtsp.me stream is active
- Ensure the original RTSP source is accessible
- Try refreshing the page

### Overlays Not Appearing
- Check if overlays are set to visible
- Verify Z-index values (higher numbers appear on top)
- Ensure overlay positions are within the player bounds
- Check browser console for errors

### Image Overlays Not Loading
- Verify the image URL uses HTTPS
- Check if the image URL is accessible
- Ensure the image format is supported by browsers
- Try a different image URL

### Edit Mode Issues
- Make sure you're in edit mode to move/resize overlays
- Click on overlays to select them before editing
- Use the toolbar buttons for specific actions
- Save changes before exiting edit mode

### Database Issues
- Check MongoDB connection in backend logs
- Verify environment variables are set correctly
- Restart the backend if needed
- Check database permissions

## Security Considerations

- Never share RTSP URLs publicly
- Use HTTPS for image overlay URLs
- Keep environment variables secure
- Regularly update dependencies
- Monitor application logs for issues

## Support

For technical issues:
1. Check the browser console for errors
2. Review backend logs for server errors
3. Verify all environment variables are set
4. Ensure MongoDB is running and accessible
5. Test with a simple stream first

For feature requests or bugs, please create an issue in the project repository.
