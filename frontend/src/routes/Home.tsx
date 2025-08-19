import React from 'react'
import VideoPlayerWithOverlays from '../components/VideoPlayerWithOverlays'

export const Home: React.FC = () => {
  // Use a default RTSP.me embed URL
  const defaultEmbedUrl = "https://rtsp.me/embed/K68Zhiyr/"

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">RTSP Video Player</h1>
        <p className="text-lg text-gray-600">
          Watch your video stream with interactive overlay editor
        </p>
      </div>

      {/* Video Player with Overlays */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Video Stream</h2>
        <VideoPlayerWithOverlays 
          embedUrl={defaultEmbedUrl}
          title="RTSP Stream"
        />
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          ℹ️ How to Use Overlays
        </h3>
        
                 <div className="space-y-3 text-sm text-blue-800">
           <div>
             <strong>1. Video Controls:</strong> Use the built-in RTSP.me player controls for play/pause/volume
           </div>
           
           <div>
             <strong>2. Enable Overlay Editor:</strong> Click the "Overlays" button in the bottom-right corner
           </div>
           
           <div>
             <strong>3. Add Overlays:</strong> Click "Add Overlay" to choose between text or image overlays
           </div>
           
           <div>
             <strong>4. Text Overlays:</strong> Add text overlays that you can edit by clicking on them
           </div>
           
           <div>
             <strong>5. Image Overlays:</strong> Upload images or add images from URLs to display as overlays
           </div>
           
           <div>
             <strong>6. Drag & Resize:</strong> Drag overlays to move them, use corner handles to resize
           </div>
           
           <div>
             <strong>7. Hide/Delete:</strong> Use the overlay panel to hide or delete overlays
           </div>
         </div>
      </div>
    </div>
  )
}
