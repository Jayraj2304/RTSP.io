import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Settings, Plus, Trash2, Eye, EyeOff, Type, Image, Link } from 'lucide-react'
import { Rnd } from 'react-rnd'
import { Overlay, overlaysApi } from '../api/overlays'

interface VideoPlayerWithOverlaysProps {
  embedUrl?: string
  title?: string
  className?: string
  streamId?: string
}

const VideoPlayerWithOverlays: React.FC<VideoPlayerWithOverlaysProps> = ({ 
  embedUrl, 
  title, 
  className = '',
  streamId = 'default'
}) => {
  const [showOverlayEditor, setShowOverlayEditor] = useState(false)
  const [overlays, setOverlays] = useState<Overlay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOverlayId, setSelectedOverlayId] = useState<string | undefined>()
  const [editingOverlayId, setEditingOverlayId] = useState<string | undefined>()
  const [editingText, setEditingText] = useState('')
  const [showAddOverlayMenu, setShowAddOverlayMenu] = useState(false)
  const [showImageUrlInput, setShowImageUrlInput] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageUrlError, setImageUrlError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Load overlays from backend on component mount
  useEffect(() => {
    loadOverlays()
  }, [streamId])

  const loadOverlays = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await overlaysApi.getOverlays(streamId)
      setOverlays(response.overlays)
    } catch (err: any) {
      console.error('Failed to load overlays:', err)
      setError('Failed to load overlays')
    } finally {
      setLoading(false)
    }
  }

  const handleOverlayUpdate = useCallback(async (overlayId: string, updates: Partial<Overlay>) => {
    try {
      const response = await overlaysApi.updateOverlay(overlayId, updates)
      setOverlays(prev => prev.map(overlay => 
        overlay._id === overlayId 
          ? { ...overlay, ...response.overlay }
          : overlay
      ))
    } catch (err: any) {
      console.error('Failed to update overlay:', err)
      // Revert local state on error
      await loadOverlays()
    }
  }, [])

  const handleOverlaySelect = useCallback((overlay: Overlay) => {
    setSelectedOverlayId(overlay._id)
  }, [])

  const addTextOverlay = useCallback(async () => {
    try {
      const newOverlayData = {
        stream_id: streamId,
        type: 'text' as const,
        content: 'New Text Overlay',
        position: { x: 100, y: 100 },
        size: { w: 200, h: 50 },
        zIndex: overlays.length + 1,
        visible: true,
        style: {
          color: '#ffffff',
          fontSize: 16,
          background: 'transparent',
          borderRadius: 4
        }
      }
      
      const response = await overlaysApi.createOverlay(newOverlayData)
      setOverlays(prev => [...prev, response.overlay])
      setSelectedOverlayId(response.overlay._id)
      setShowAddOverlayMenu(false)
    } catch (err: any) {
      console.error('Failed to create text overlay:', err)
    }
  }, [overlays.length, streamId])

  const addImageOverlay = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
    setShowAddOverlayMenu(false)
  }, [])

  const addImageFromUrl = useCallback(() => {
    setShowImageUrlInput(true)
    setShowAddOverlayMenu(false)
  }, [])

  const handleImageUrlSubmit = useCallback(async () => {
    if (!imageUrl.trim()) {
      setImageUrlError('Please enter an image URL')
      return
    }

    // Basic URL validation
    try {
      new URL(imageUrl.trim())
    } catch {
      setImageUrlError('Please enter a valid URL')
      return
    }

    // Test if the image loads
    const img = new window.Image()
    img.onload = async () => {
      try {
        const newOverlayData = {
          stream_id: streamId,
          type: 'image' as const,
          content: imageUrl.trim(),
          position: { x: 150, y: 150 },
          size: { w: 200, h: 150 },
          zIndex: overlays.length + 1,
          visible: true,
          style: {
            borderRadius: 4
          }
        }
        
        const response = await overlaysApi.createOverlay(newOverlayData)
        setOverlays(prev => [...prev, response.overlay])
        setSelectedOverlayId(response.overlay._id)
        setImageUrl('')
        setImageUrlError('')
        setShowImageUrlInput(false)
      } catch (err: any) {
        console.error('Failed to create image overlay:', err)
        setImageUrlError('Failed to create overlay')
      }
    }
    img.onerror = () => {
      setImageUrlError('Failed to load image. Please check the URL.')
    }
    img.src = imageUrl.trim()
  }, [imageUrl, overlays.length, streamId])

  const cancelImageUrlInput = useCallback(() => {
    setImageUrl('')
    setImageUrlError('')
    setShowImageUrlInput(false)
  }, [])

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          const imageUrl = event.target?.result as string
          const newOverlayData = {
            stream_id: streamId,
            type: 'image' as const,
            content: imageUrl,
            position: { x: 150, y: 150 },
            size: { w: 200, h: 150 },
            zIndex: overlays.length + 1,
            visible: true,
            style: {
              borderRadius: 4
            }
          }
          
          const response = await overlaysApi.createOverlay(newOverlayData)
          setOverlays(prev => [...prev, response.overlay])
          setSelectedOverlayId(response.overlay._id)
        } catch (err: any) {
          console.error('Failed to create image overlay:', err)
        }
      }
      reader.readAsDataURL(file)
    }
    // Reset the input
    if (e.target) {
      e.target.value = ''
    }
  }, [overlays.length, streamId])

  const deleteOverlay = useCallback(async (overlayId: string) => {
    try {
      await overlaysApi.deleteOverlay(overlayId)
      setOverlays(prev => prev.filter(o => o._id !== overlayId))
      if (selectedOverlayId === overlayId) {
        setSelectedOverlayId(undefined)
      }
      if (editingOverlayId === overlayId) {
        setEditingOverlayId(undefined)
      }
    } catch (err: any) {
      console.error('Failed to delete overlay:', err)
    }
  }, [selectedOverlayId, editingOverlayId])

  const toggleOverlayVisibility = useCallback(async (overlayId: string) => {
    const overlay = overlays.find(o => o._id === overlayId)
    if (overlay) {
      await handleOverlayUpdate(overlayId, { 
        visible: !overlay.visible 
      })
    }
  }, [handleOverlayUpdate, overlays])

  const startTextEditing = useCallback((overlay: Overlay) => {
    if (overlay.type === 'text') {
      setEditingOverlayId(overlay._id)
      setEditingText(overlay.content)
    }
  }, [])

  const saveTextEdit = useCallback(async () => {
    if (editingOverlayId) {
      await handleOverlayUpdate(editingOverlayId, { content: editingText })
      setEditingOverlayId(undefined)
      setEditingText('')
    }
  }, [editingOverlayId, editingText, handleOverlayUpdate])

  const cancelTextEdit = useCallback(() => {
    setEditingOverlayId(undefined)
    setEditingText('')
  }, [])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveTextEdit()
    } else if (e.key === 'Escape') {
      cancelTextEdit()
    }
  }, [saveTextEdit, cancelTextEdit])

  if (!embedUrl) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ aspectRatio: '16/9' }}>
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">No Stream Selected</div>
          <div className="text-gray-400 text-sm">
            Please provide a valid RTSP.me embed URL
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ aspectRatio: '16/9' }}>
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">Loading Overlays...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`} style={{ aspectRatio: '16/9' }}>
      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Video Container */}
      <div ref={containerRef} className="relative w-full h-full">
        {/* RTSP.me iframe */}
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={title || 'RTSP Stream'}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen"
        />
        
        {/* Overlays */}
        {overlays
          .filter(overlay => overlay.visible)
          .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
          .map(overlay => (
            <Rnd
              key={overlay._id}
              position={{ x: overlay.position.x, y: overlay.position.y }}
              size={{ width: overlay.size.w, height: overlay.size.h }}
              onDragStop={(_e, d) => {
                handleOverlayUpdate(overlay._id!, {
                  position: { x: d.x, y: d.y }
                })
              }}
              onResizeStop={(_e, _direction, ref, _delta, position) => {
                handleOverlayUpdate(overlay._id!, {
                  position: { x: position.x, y: position.y },
                  size: { w: ref.offsetWidth, h: ref.offsetHeight }
                })
              }}
              bounds="parent"
              enableResizing={showOverlayEditor ? {
                top: true,
                right: true,
                bottom: true,
                left: true,
                topRight: true,
                bottomRight: true,
                bottomLeft: true,
                topLeft: true,
              } : false}
              style={{
                zIndex: overlay.zIndex || 1,
                border: showOverlayEditor && selectedOverlayId === overlay._id ? '2px solid #3b82f6' : 'none',
                cursor: showOverlayEditor ? 'move' : 'default',
                pointerEvents: showOverlayEditor ? 'auto' : 'none',
                background: 'transparent',
              }}
              onClick={() => showOverlayEditor && handleOverlaySelect(overlay)}
              disableDragging={!showOverlayEditor}
            >
              {overlay.type === 'text' ? (
                <div
                  className="w-full h-full flex items-center justify-center cursor-pointer"
                  style={{
                    color: overlay.style?.color || '#ffffff',
                    fontSize: `${overlay.style?.fontSize || 16}px`,
                    background: overlay.style?.background || 'transparent',
                    borderRadius: `${overlay.style?.borderRadius || 4}px`,
                    padding: '8px',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    fontWeight: 'bold'
                  }}
                  onClick={() => {
                    if (showOverlayEditor) {
                      startTextEditing(overlay)
                    }
                  }}
                >
                  {editingOverlayId === overlay._id ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={handleKeyPress}
                      onBlur={saveTextEdit}
                      className="w-full h-full bg-transparent border-none outline-none text-center"
                      style={{
                        color: overlay.style?.color || '#ffffff',
                        fontSize: `${overlay.style?.fontSize || 16}px`,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        fontWeight: 'bold',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        boxShadow: 'none'
                      }}
                      autoFocus
                    />
                  ) : (
                    <span>{overlay.content}</span>
                  )}
                </div>
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center cursor-pointer"
                  style={{
                    borderRadius: `${overlay.style?.borderRadius || 4}px`,
                    overflow: 'hidden'
                  }}
                  onClick={() => {
                    if (showOverlayEditor) {
                      handleOverlaySelect(overlay)
                    }
                  }}
                >
                  <img
                    src={overlay.content}
                    alt="Overlay"
                    className="w-full h-full object-cover"
                    style={{
                      borderRadius: `${overlay.style?.borderRadius || 4}px`,
                    }}
                    onError={(e) => {
                      // Handle image load errors
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-red-500 text-xs">Image failed to load</div>'
                      }
                    }}
                  />
                </div>
              )}
            </Rnd>
          ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* Overlay Editor Toggle */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={() => setShowOverlayEditor(!showOverlayEditor)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors shadow-lg ${
            showOverlayEditor 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
          title="Toggle Overlay Editor"
        >
          <Settings size={16} />
          <span className="text-sm">Overlays</span>
        </button>
      </div>

      {/* Overlay Editor Panel */}
      {showOverlayEditor && (
        <div className="absolute top-0 right-0 bg-white/95 backdrop-blur-sm rounded-bl-lg p-4 max-w-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Overlay Editor</h3>
              <button
                onClick={() => setShowOverlayEditor(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <button
                  onClick={() => setShowAddOverlayMenu(!showAddOverlayMenu)}
                  className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus size={14} />
                  <span>Add Overlay</span>
                </button>
                
                {/* Add Overlay Menu */}
                {showAddOverlayMenu && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <button
                      onClick={addTextOverlay}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Type size={14} />
                      <span>Text Overlay</span>
                    </button>
                    <button
                      onClick={addImageOverlay}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Image size={14} />
                      <span>Upload Image</span>
                    </button>
                    <button
                      onClick={addImageFromUrl}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Link size={14} />
                      <span>Image from URL</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Image URL Input */}
              {showImageUrlInput && (
                <div className="space-y-2 p-3 bg-gray-50 rounded-md border">
                  <div className="flex items-center space-x-2">
                    <Link size={14} className="text-gray-500" />
                    <span className="text-xs font-medium text-gray-700">Image URL</span>
                  </div>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value)
                      setImageUrlError('')
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleImageUrlSubmit()
                      } else if (e.key === 'Escape') {
                        cancelImageUrlInput()
                      }
                    }}
                  />
                  {imageUrlError && (
                    <div className="text-xs text-red-600">{imageUrlError}</div>
                  )}
                  <div className="flex space-x-2">
                    <button
                      onClick={handleImageUrlSubmit}
                      className="flex-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      Add
                    </button>
                    <button
                      onClick={cancelImageUrlInput}
                      className="flex-1 px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Overlay List */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {overlays.map(overlay => (
                <div
                  key={overlay._id}
                  className={`p-2 rounded border cursor-pointer transition-colors ${
                    selectedOverlayId === overlay._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleOverlaySelect(overlay)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleOverlayVisibility(overlay._id!)
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {overlay.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <div className="flex items-center space-x-1">
                        {overlay.type === 'text' ? (
                          <Type size={12} className="text-gray-400" />
                        ) : (
                          <Image size={12} className="text-gray-400" />
                        )}
                        <span className="text-xs truncate max-w-24">
                          {overlay.type === 'text' ? overlay.content : 'Image'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteOverlay(overlay._id!)
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Overlay Properties */}
            {selectedOverlayId && (
              <div className="space-y-2 pt-2 border-t">
                <h4 className="text-xs font-medium text-gray-700">Selected Overlay</h4>
                <div className="text-xs text-gray-600">
                  <div>Type: {overlays.find(o => o._id === selectedOverlayId)?.type}</div>
                  <div>Position: ({overlays.find(o => o._id === selectedOverlayId)?.position.x}, {overlays.find(o => o._id === selectedOverlayId)?.position.y})</div>
                  <div>Size: {overlays.find(o => o._id === selectedOverlayId)?.size.w}×{overlays.find(o => o._id === selectedOverlayId)?.size.h}</div>
                </div>
                
                {/* Text Overlay Color Picker */}
                {overlays.find(o => o._id === selectedOverlayId)?.type === 'text' && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600">Text Color:</span>
                      <input
                        type="color"
                        value={overlays.find(o => o._id === selectedOverlayId)?.style?.color || '#ffffff'}
                        onChange={(e) => {
                          const overlay = overlays.find(o => o._id === selectedOverlayId)
                          if (overlay) {
                            handleOverlayUpdate(selectedOverlayId, {
                              style: {
                                ...overlay.style,
                                color: e.target.value
                              }
                            })
                          }
                        }}
                        className="w-8 h-6 border border-gray-300 rounded cursor-pointer"
                        title="Choose text color"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600">Font Size:</span>
                      <input
                        type="range"
                        min="12"
                        max="48"
                        value={overlays.find(o => o._id === selectedOverlayId)?.style?.fontSize || 16}
                        onChange={(e) => {
                          const overlay = overlays.find(o => o._id === selectedOverlayId)
                          if (overlay) {
                            handleOverlayUpdate(selectedOverlayId, {
                              style: {
                                ...overlay.style,
                                fontSize: parseInt(e.target.value)
                              }
                            })
                          }
                        }}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-xs text-gray-500 w-8 text-center">
                        {overlays.find(o => o._id === selectedOverlayId)?.style?.fontSize || 16}px
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleOverlayVisibility(selectedOverlayId)}
                    className="flex-1 px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                  >
                    {overlays.find(o => o._id === selectedOverlayId)?.visible ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => deleteOverlay(selectedOverlayId)}
                    className="flex-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoPlayerWithOverlays
