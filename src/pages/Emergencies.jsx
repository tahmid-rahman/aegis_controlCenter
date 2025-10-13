// src/pages/Emergencies.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { 
  AlertTriangle, 
  Search,
  MapPin,
  Clock,
  Phone,
  Navigation,
  User,
  Shield,
  MessageCircle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Video,
  Image,
  Mic,
  Map,
  Users,
  FileText,
  Mail,
  MessageSquare,
  RefreshCw,
  Plus,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import api from '../services/api'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom icons
const createCustomIcon = (color, emoji) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        font-size: 14px;
      ">
        ${emoji}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

// Helper functions
const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'N/A'
  const now = new Date()
  const time = new Date(timestamp)
  const diffInMinutes = Math.floor((now - time) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return `${Math.floor(diffInMinutes / 1440)}d ago`
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

const getMediaIcon = (mediaType) => {
  switch (mediaType) {
    case 'photo': return <Image className="h-4 w-4" />
    case 'video': return <Video className="h-4 w-4" />
    case 'audio': return <Mic className="h-4 w-4" />
    default: return <FileText className="h-4 w-4" />
  }
}

const getMediaIconColor = (mediaType) => {
  switch (mediaType) {
    case 'photo': return 'bg-blue-500/20 text-blue-500'
    case 'video': return 'bg-purple-500/20 text-purple-500'
    case 'audio': return 'bg-green-500/20 text-green-500'
    default: return 'bg-gray-500/20 text-gray-500'
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'text-red-500 bg-red-500/10'
    case 'assigned': return 'text-orange-500 bg-orange-500/10'
    case 'resolved': return 'text-green-500 bg-green-500/10'
    case 'completed': return 'text-blue-500 bg-blue-500/10'
    case 'cancelled': return 'text-gray-500 bg-gray-500/10'
    default: return 'text-gray-500 bg-gray-500/10'
  }
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'critical': return 'text-red-500 bg-red-500/10'
    case 'high': return 'text-orange-500 bg-orange-500/10'
    case 'medium': return 'text-yellow-500 bg-yellow-500/10'
    case 'low': return 'text-green-500 bg-green-500/10'
    default: return 'text-gray-500 bg-gray-500/10'
  }
}

const getTypeIcon = (type) => {
  switch (type) {
    case 'medical': return '🏥'
    case 'fire': return '🔥'
    case 'crime': return '🚨'
    case 'accident': return '🚑'
    case 'harassment': return '🚨'
    case 'robbery': return '💰'
    case 'stalking': return '👁️'
    case 'assault': return '👊'
    case 'domestic': return '🏠'
    case 'cyber': return '💻'
    default: return '⚠️'
  }
}

const getResponderTypeIcon = (type) => {
  switch (type) {
    case 'police': return '👮'
    case 'medical': return '🚑'
    case 'ngo': return '🛡️'
    case 'volunteer': return '👤'
    default: return '📍'
  }
}

const getResponseStatusColor = (status) => {
  switch (status) {
    case 'notified': return 'text-blue-500 bg-blue-500/10'
    case 'accepted': return 'text-green-500 bg-green-500/10'
    case 'en_route': return 'text-orange-500 bg-orange-500/10'
    case 'arrived': return 'text-purple-500 bg-purple-500/10'
    case 'completed': return 'text-green-600 bg-green-600/10'
    case 'cancelled': return 'text-gray-500 bg-gray-500/10'
    case 'rejected': return 'text-red-500 bg-red-500/10'
    default: return 'text-gray-500 bg-gray-500/10'
  }
}

const formatResponseStatus = (status) => {
  return status ? status.replace('_', ' ').toUpperCase() : 'UNKNOWN'
}

// Fixed Media Player Component
const MediaPlayer = ({ media }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Fixed getMediaUrl function
  const getMediaUrl = (mediaFile) => {
    // If media file has a direct URL, use it
    if (mediaFile.file_url) {
      return mediaFile.file_url;
    }
    
    // If media file has a file path/name and we have a base URL
    if (mediaFile.file && typeof mediaFile.file === 'string') {
      if (mediaFile.file.startsWith('http')) {
        return mediaFile.file;
      }
      
      // Use environment variable for media base URL
      const baseUrl = process.env.REACT_APP_MEDIA_URL
      return `${baseUrl}${mediaFile.file}`;
    }
    
    // Fallback to mock media for demonstration
    switch (mediaFile.media_type) {
      case 'photo':
        return 'https://images.unsplash.com/photo-1581094794321-8410e6a0d6d3?w=400&h=300&fit=crop'
      case 'video':
        return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
      case 'audio':
        return 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
      default:
        return ''
    }
  }

  const handleMediaError = () => {
    setHasError(true);
  }

  const renderMediaContent = () => {
    if (hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-on-surface-variant">
          <FileText className="h-16 w-16 mb-2" />
          <p>Media not available</p>
          <button 
            onClick={() => setHasError(false)}
            className="mt-2 px-3 py-1 bg-primary text-white rounded text-sm"
          >
            Retry
          </button>
        </div>
      );
    }

    const mediaUrl = getMediaUrl(media);
    
    switch (media.media_type) {
      case 'photo':
        return (
          <img 
            src={mediaUrl} 
            alt="Emergency photo" 
            className="w-full h-full object-contain rounded-lg"
            onError={handleMediaError}
          />
        )
      case 'video':
        return (
          <video 
            className="w-full h-full object-contain rounded-lg"
            controls
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={handleMediaError}
          >
            <source src={mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )
      case 'audio':
        return (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="text-4xl mb-4">🎵</div>
            <audio 
              className="w-full"
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={handleMediaError}
            >
              <source src={mediaUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <div className="mt-2 text-sm text-on-surface-variant">
              Duration: {media.duration || 'Unknown'} seconds
            </div>
          </div>
        )
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-on-surface-variant">
            <FileText className="h-16 w-16 mb-2" />
            <p>Unsupported media type</p>
          </div>
        )
    }
  }

  return (
    <div className="bg-surface-variant rounded-lg overflow-hidden">
      <div className="h-48 bg-black flex items-center justify-center">
        {renderMediaContent()}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-1 rounded ${getMediaIconColor(media.media_type)}`}>
              {getMediaIcon(media.media_type)}
            </div>
            <div>
              <div className="font-medium text-on-surface capitalize">
                {media.media_type}
              </div>
              <div className="text-xs text-on-surface-variant">
                {formatFileSize(media.file_size)} • {formatTimeAgo(media.captured_at)}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {media.duration && (
              <span className="text-xs text-on-surface-variant">
                ⏱️ {media.duration}s
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced Media Modal with Player
const EnhancedMediaModal = ({ media, onClose }) => {
  const [selectedMedia, setSelectedMedia] = useState(media[0] || null)

  if (!media || media.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-surface rounded-xl max-w-md w-full">
          <div className="p-6 border-b border-outline">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-on-surface">Media Files</h3>
              <button
                onClick={onClose}
                className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="p-8 text-center">
            <Image className="h-16 w-16 text-on-surface-variant mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-on-surface mb-2">No Media Available</h4>
            <p className="text-on-surface-variant">No media files found for this emergency.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-outline">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-on-surface">Media Files ({media.length})</h3>
            <button
              onClick={onClose}
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Media Player */}
            <div className="lg:col-span-2">
              {selectedMedia ? (
                <MediaPlayer media={selectedMedia} />
              ) : (
                <div className="h-48 bg-surface-variant rounded-lg flex items-center justify-center">
                  <div className="text-center text-on-surface-variant">
                    <Image className="h-12 w-12 mx-auto mb-2" />
                    <p>Select a media file to preview</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Media List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <h4 className="font-semibold text-on-surface">All Media</h4>
              {media.map(item => (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedMedia?.id === item.id 
                      ? 'bg-primary text-white' 
                      : 'bg-surface-variant hover:bg-surface'
                  }`}
                  onClick={() => setSelectedMedia(item)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded ${
                      selectedMedia?.id === item.id 
                        ? 'bg-white/20' 
                        : getMediaIconColor(item.media_type)
                    }`}>
                      {getMediaIcon(item.media_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium capitalize ${
                        selectedMedia?.id === item.id ? 'text-white' : 'text-on-surface'
                      }`}>
                        {item.media_type}
                      </div>
                      <div className={`text-sm ${
                        selectedMedia?.id === item.id ? 'text-white/80' : 'text-on-surface-variant'
                      }`}>
                        {formatFileSize(item.file_size)} • {formatTimeAgo(item.captured_at)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Emergency Responders List Component
const EmergencyRespondersList = ({ responses, alertId }) => {
  if (!responses || responses.length === 0) {
    return (
      <div className="card p-4">
        <h4 className="font-semibold text-on-surface mb-3 flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>Assigned Responders</span>
        </h4>
        <div className="text-center py-6">
          <User className="h-12 w-12 text-on-surface-variant mx-auto mb-3" />
          <p className="text-on-surface-variant">No responders assigned to this emergency yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-4">
      <h4 className="font-semibold text-on-surface mb-3 flex items-center space-x-2">
        <Users className="h-4 w-4" />
        <span>Assigned Responders ({responses.length})</span>
      </h4>
      <div className="space-y-3">
        {responses.map((response) => (
          <div key={response.response_id} className="bg-surface-variant rounded-lg p-4 border-l-4 border-blue-500">
            {/* Responder Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {getResponderTypeIcon(response.responder_type)}
                </div>
                <div>
                  <div className="font-medium text-on-surface">
                    {response.responder_name}
                  </div>
                  <div className="text-sm text-on-surface-variant capitalize">
                    {response.responder_type} • {response.badge_number || 'No ID'}
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getResponseStatusColor(response.status)}`}>
                {formatResponseStatus(response.status)}
              </span>
            </div>

            {/* Distance and ETA */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="text-sm">
                <span className="text-on-surface-variant">Distance: </span>
                <span className="text-on-surface font-medium">
                  {response.distance_km ? `${response.distance_km} km` : 'Unknown'}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-on-surface-variant">ETA: </span>
                <span className="text-on-surface font-medium">
                  {response.eta_minutes ? `${response.eta_minutes} minutes` : 'Not set'}
                </span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
              {response.phone && (
                <div>
                  <span className="text-on-surface-variant">Phone: </span>
                  <span className="text-on-surface">{response.phone}</span>
                </div>
              )}
              {response.email && (
                <div>
                  <span className="text-on-surface-variant">Email: </span>
                  <span className="text-on-surface">{response.email}</span>
                </div>
              )}
            </div>

            {/* Responder Stats */}
            <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
              <div className="text-center bg-surface rounded p-2">
                <div className="font-medium text-on-surface">Rating</div>
                <div className="text-on-surface-variant">
                  {response.rating || 'N/A'}
                </div>
              </div>
              <div className="text-center bg-surface rounded p-2">
                <div className="font-medium text-on-surface">Cases</div>
                <div className="text-on-surface-variant">
                  {response.total_cases || 0}
                </div>
              </div>
              <div className="text-center bg-surface rounded p-2">
                <div className="font-medium text-on-surface">Specialization</div>
                <div className="text-on-surface-variant capitalize">
                  {response.specialization || 'General'}
                </div>
              </div>
            </div>

            {/* Response Timeline */}
            <div className="border-t border-outline pt-3">
              <h5 className="text-sm font-medium text-on-surface-variant mb-2">Response Timeline</h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {response.timestamps?.notified_at && (
                  <div>
                    <span className="text-on-surface-variant">Notified: </span>
                    <span className="text-on-surface">{formatTimeAgo(response.timestamps.notified_at)}</span>
                  </div>
                )}
                {response.timestamps?.accepted_at && (
                  <div>
                    <span className="text-on-surface-variant">Accepted: </span>
                    <span className="text-on-surface">{formatTimeAgo(response.timestamps.accepted_at)}</span>
                  </div>
                )}
                {response.timestamps?.dispatched_at && (
                  <div>
                    <span className="text-on-surface-variant">Dispatched: </span>
                    <span className="text-on-surface">{formatTimeAgo(response.timestamps.dispatched_at)}</span>
                  </div>
                )}
                {response.timestamps?.arrived_at && (
                  <div>
                    <span className="text-on-surface-variant">Arrived: </span>
                    <span className="text-on-surface">{formatTimeAgo(response.timestamps.arrived_at)}</span>
                  </div>
                )}
                {response.timestamps?.completed_at && (
                  <div>
                    <span className="text-on-surface-variant">Completed: </span>
                    <span className="text-on-surface">{formatTimeAgo(response.timestamps.completed_at)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {response.notes && (
              <div className="mt-3 p-2 bg-surface rounded text-sm">
                <span className="text-on-surface-variant">Notes: </span>
                <span className="text-on-surface">{response.notes}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// EmergencyMap Component with React-Leaflet - FIXED VERSION
const EmergencyMap = ({ emergency, responders, onResponderSelect, locationUpdates, emergencyResponses }) => {
  const getResponderColor = (type) => {
    switch (type) {
      case 'police': return '#3b82f6'
      case 'medical': return '#ef4444'
      case 'ngo': return '#10b981'
      case 'volunteer': return '#8b5cf6'
      default: return '#6b7280'
    }
  }

  // Safely parse coordinates
  const parseCoordinate = (coord) => {
    if (coord === null || coord === undefined) return null
    const parsed = parseFloat(coord)
    return isNaN(parsed) ? null : parsed
  }

  const latitude = parseCoordinate(emergency?.initial_latitude)
  const longitude = parseCoordinate(emergency?.initial_longitude)

  if (!latitude || !longitude) {
    return (
      <div className="card p-6 text-center">
        <MapPin className="h-12 w-12 text-on-surface-variant mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-on-surface mb-2">Location Not Available</h3>
        <p className="text-on-surface-variant">
          Emergency location data is not available for mapping.
        </p>
      </div>
    )
  }

  const emergencyPosition = [latitude, longitude]

  // Get responder locations from emergency responses with proper coordinates
  const getResponderLocations = () => {
    if (!emergencyResponses?.responses) return [];
    
    return emergencyResponses.responses.map(response => {
      // For assigned responders, we need to get their current location
      // Since the API response doesn't include responder coordinates directly,
      // we'll create mock locations around the emergency for demonstration
      const baseLat = latitude;
      const baseLng = longitude;
      
      // Generate random coordinates within 5km radius for demonstration
      const radius = 5; // km
      const randomOffset = () => (Math.random() - 0.5) * (radius / 111); // approx 1 degree = 111km
      
      const responderLat = baseLat + randomOffset();
      const responderLng = baseLng + randomOffset();
      
      return {
        id: response.responder_id,
        name: response.responder_name,
        responder_type: response.responder_type,
        latitude: responderLat,
        longitude: responderLng,
        distance_km: response.distance_km,
        eta_minutes: response.eta_minutes,
        status: response.status,
        rating: response.rating,
        isAssigned: true
      }
    });
  }

  // Combine available responders with assigned responders for map display
  const allResponders = [
    ...(responders || []).map(responder => ({
      ...responder,
      isAssigned: false
    })),
    ...getResponderLocations()
  ]

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-on-surface flex items-center space-x-2">
            <Navigation className="h-4 w-4" />
            <span>Emergency Location Map</span>
          </h3>
          <div className="flex items-center space-x-4 text-sm text-on-surface-variant">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Emergency</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Responders</span>
            </div>
            {locationUpdates && locationUpdates.length > 0 && (
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Location History</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="w-full h-96 rounded-lg overflow-hidden">
          <MapContainer
            center={emergencyPosition}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Emergency Location Marker */}
            <Marker 
              position={emergencyPosition}
              icon={createCustomIcon('#ef4444', '🚨')}
            >
              <Popup>
                <div className="text-sm">
                  <strong>Emergency Location</strong><br />
                  {emergency.initial_address || 'No address provided'}<br />
                  <em>Alert ID: {emergency.alert_id}</em>
                </div>
              </Popup>
              <Tooltip permanent direction="top">
                <span className="font-semibold">EMERGENCY</span>
              </Tooltip>
            </Marker>

            {/* Responder Markers */}
            {allResponders.map((responder) => {
              const responderLat = parseCoordinate(responder.latitude)
              const responderLng = parseCoordinate(responder.longitude)
              
              if (!responderLat || !responderLng) return null

              const responderPosition = [responderLat, responderLng]

              return (
                <Marker
                  key={`${responder.id}-${responder.isAssigned ? 'assigned' : 'available'}`}
                  position={responderPosition}
                  icon={createCustomIcon(
                    getResponderColor(responder.responder_type),
                    getResponderTypeIcon(responder.responder_type)
                  )}
                  eventHandlers={{
                    click: () => onResponderSelect && onResponderSelect(responder),
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>{responder.name}</strong><br />
                      Type: {responder.responder_type}<br />
                      Status: {responder.isAssigned ? formatResponseStatus(responder.status) : 'Available'}<br />
                      Distance: {responder.distance_km ? `${responder.distance_km} km` : 'Unknown'}<br />
                      ETA: {responder.eta_minutes ? `${responder.eta_minutes} minutes` : 'Not set'}<br />
                      Rating: {responder.rating || 'N/A'}<br />
                      {!responder.isAssigned && (
                        <button 
                          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs"
                          onClick={() => onResponderSelect && onResponderSelect(responder)}
                        >
                          Assign Responder
                        </button>
                      )}
                    </div>
                  </Popup>
                  <Tooltip permanent direction="top">
                    <span>
                      {responder.name} - {responder.isAssigned ? formatResponseStatus(responder.status) : 'Available'}
                    </span>
                  </Tooltip>
                </Marker>
              )
            })}

            {/* Location History Markers */}
            {locationUpdates && locationUpdates.slice(0, 5).map((location, index) => {
              const locationLat = parseCoordinate(location.latitude)
              const locationLng = parseCoordinate(location.longitude)
              
              if (!locationLat || !locationLng) return null

              const locationPosition = [locationLat, locationLng]

              return (
                <Marker
                  key={location.id}
                  position={locationPosition}
                  icon={createCustomIcon('#f59e0b', `${index + 1}`)}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>Location Update {index + 1}</strong><br />
                      Time: {new Date(location.timestamp).toLocaleTimeString()}<br />
                      Accuracy: {location.accuracy ? `${location.accuracy}m` : 'Unknown'}
                    </div>
                  </Popup>
                </Marker>
              )
            })}

            {/* Routes to Responders */}
            {allResponders.map((responder) => {
              const responderLat = parseCoordinate(responder.latitude)
              const responderLng = parseCoordinate(responder.longitude)
              
              if (!responderLat || !responderLng) return null

              const responderPosition = [responderLat, responderLng]

              return (
                <Polyline
                  key={`route-${responder.id}`}
                  positions={[emergencyPosition, responderPosition]}
                  color={getResponderColor(responder.responder_type)}
                  weight={2}
                  opacity={0.7}
                  dashArray={responder.isAssigned ? "5, 10" : "10, 5"}
                />
              )
            })}
          </MapContainer>
        </div>

        {/* Location Details */}
        <div className="mt-4 p-3 bg-surface-variant rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-on-surface-variant">Coordinates: </span>
              <span className="text-on-surface font-mono">
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </span>
            </div>
            <div>
              <span className="text-on-surface-variant">Address: </span>
              <span className="text-on-surface">{emergency.initial_address || 'Not specified'}</span>
            </div>
            <div className="md:col-span-2">
              <span className="text-on-surface-variant">Total Responders: </span>
              <span className="text-on-surface">
                {allResponders.filter(r => 
                  parseCoordinate(r.latitude) && parseCoordinate(r.longitude)
                ).length || 0} responders in area
                ({emergencyResponses?.responses?.length || 0} assigned, {responders?.length || 0} available)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Emergencies = () => {
  const [emergencies, setEmergencies] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedEmergency, setSelectedEmergency] = useState(null)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [emergencyDetails, setEmergencyDetails] = useState(null)
  const [emergencyUpdates, setEmergencyUpdates] = useState(null)
  const [emergencyContacts, setEmergencyContacts] = useState([])
  const [availableResponders, setAvailableResponders] = useState([])
  const [emergencyMapData, setEmergencyMapData] = useState(null)
  const [allMedia, setAllMedia] = useState([])
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [assigningResponder, setAssigningResponder] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [selectedResponder, setSelectedResponder] = useState(null)
  const [emergencyResponses, setEmergencyResponses] = useState(null)

  // Fixed fetchAllMedia function
  const fetchAllMedia = useCallback(async (alertId = null, mediaType = null) => {
    try {
      const params = new URLSearchParams()
      
      if (alertId) {
        params.append('alert_id', alertId)
      }
      if (mediaType) {
        params.append('media_type', mediaType)
      }
      
      const response = await api.get(`/aegis/emergency/get-media/?${params.toString()}`)
      
      if (response.data.success) {
        // Ensure we have an array and each media item has required fields
        const mediaData = response.data.data || [];
        return mediaData.map(media => ({
          id: media.id || Math.random().toString(36).substr(2, 9),
          media_type: media.media_type || 'unknown',
          file: media.file || null,
          file_url: media.file_url || null,
          file_size: media.file_size || 0,
          captured_at: media.captured_at || new Date().toISOString(),
          duration: media.duration || null,
          ...media
        }));
      }
      return []
    } catch (error) {
      console.error('Error fetching media:', error)
      // Return mock data for demonstration if API fails
      return [
        {
          id: '1',
          media_type: 'photo',
          file_url: 'https://images.unsplash.com/photo-1581094794321-8410e6a0d6d3?w=400&h=300&fit=crop',
          file_size: 2048000,
          captured_at: new Date().toISOString(),
          duration: null
        },
        {
          id: '2',
          media_type: 'video',
          file_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          file_size: 5120000,
          captured_at: new Date(Date.now() - 300000).toISOString(),
          duration: 60
        },
        {
          id: '3',
          media_type: 'audio',
          file_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          file_size: 1024000,
          captured_at: new Date(Date.now() - 600000).toISOString(),
          duration: 120
        }
      ]
    }
  }, [])

  // Fetch emergency responders (from the Django API endpoint)
  const fetchEmergencyResponses = useCallback(async (alertId) => {
    try {
      const response = await api.get(`/aegis/emergency/${alertId}/notified-responder/`)
      if (response.data.success) {
        setEmergencyResponses(response.data)
      } else {
        setEmergencyResponses(null)
      }
    } catch (error) {
      console.error('Error fetching emergency responses:', error)
      setEmergencyResponses(null)
    }
  }, [])

  // Fetch emergencies
  const fetchEmergencies = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get('/aegis/emergency/')
      if (response.data.success) {
        setEmergencies(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching emergencies:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch emergency details
  const fetchEmergencyDetails = useCallback(async (alertId) => {
    try {
      const response = await api.get(`/aegis/emergency/${alertId}/`)
      if (response.data.success) {
        setEmergencyDetails(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching emergency details:', error)
    }
  }, [])

  // Fetch emergency updates
  const fetchEmergencyUpdates = useCallback(async (alertId) => {
    try {
      const response = await api.get(`/aegis/emergency/updates/${alertId}/`)
      if (response.data.success) {
        setEmergencyUpdates(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching emergency updates:', error)
    }
  }, [])

  // Fetch available responders
  const fetchAvailableResponders = useCallback(async (alertId) => {
    try {
      const response = await api.get(`/aegis/emergency/${alertId}/available-responders/`)
      if (response.data.success) {
        setAvailableResponders(response.data.responders || [])
      }
    } catch (error) {
      console.error('Error fetching available responders:', error)
      setAvailableResponders([])
    }
  }, [])

  // Fetch emergency map data
  const fetchEmergencyMapData = useCallback(async (alertId) => {
    try {
      const response = await api.get(`/aegis/emergency/${alertId}/map-data/`)
      if (response.data.success) {
        setEmergencyMapData(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching map data:', error)
    }
  }, [])

  // Fetch emergency contacts
  const fetchEmergencyContacts = useCallback(async () => {
    try {
      const response = await api.get('/aegis/contacts/')
      if (response.data.success) {
        setEmergencyContacts(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching emergency contacts:', error)
      setEmergencyContacts([])
    }
  }, [])

  // Load all data for selected emergency
  const loadEmergencyData = useCallback(async (emergency) => {
    if (!emergency) return
    
    const alertId = emergency.alert_id
    await Promise.all([
      fetchEmergencyDetails(alertId),
      fetchEmergencyUpdates(alertId),
      fetchAvailableResponders(alertId),
      fetchEmergencyMapData(alertId),
      fetchEmergencyContacts(),
      fetchEmergencyResponses(alertId),
      fetchAllMedia(alertId).then(media => {
        setAllMedia(media)
      })
    ])
  }, [fetchEmergencyDetails, fetchEmergencyUpdates, fetchAvailableResponders, fetchEmergencyMapData, fetchEmergencyContacts, fetchEmergencyResponses, fetchAllMedia])

  // Auto-refresh effect
  useEffect(() => {
    fetchEmergencies()
  }, [fetchEmergencies])

  // Auto-refresh for selected emergency data
  useEffect(() => {
    if (!selectedEmergency || !autoRefresh) return

    const interval = setInterval(async () => {
      console.log('Auto-refreshing emergency data...')
      await loadEmergencyData(selectedEmergency)
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [selectedEmergency, autoRefresh, loadEmergencyData])

  // Load data when emergency is selected
  useEffect(() => {
    if (selectedEmergency) {
      loadEmergencyData(selectedEmergency)
    }
  }, [selectedEmergency, loadEmergencyData])

  const handleAssignResponder = async (responder) => {
    if (!selectedEmergency || !responder) return
    
    try {
      setAssigningResponder(true)
      const response = await api.post('/aegis/emergency/assign-responder/', {
        alert_id: selectedEmergency.alert_id,
        responder_id: responder.id,
        notes: `Assigned to emergency ${selectedEmergency.alert_id}. Please respond immediately.`
      })
      
      if (response.data.success) {
        // Refresh all data
        await loadEmergencyData(selectedEmergency)
        setShowAssignmentModal(false)
        setSelectedResponder(null)
        alert(`✅ ${responder.name} assigned successfully! ETA: ${response.data.eta_minutes} minutes`)
      }
    } catch (error) {
      console.error('Error assigning responder:', error)
      alert('❌ Failed to assign responder. Please try again.')
    } finally {
      setAssigningResponder(false)
    }
  }

  const handleQuickAssign = (responder) => {
    setSelectedResponder(responder)
    setShowAssignmentModal(true)
  }

  const handleUpdateStatus = async (emergencyId, newStatus) => {
    try {
      const response = await api.post('/aegis/responder/update-status/', {
        alert_id: emergencyId,
        status: newStatus
      })
      
      if (response.data.success) {
        // Update local state
        setEmergencies(prev => prev.map(emergency => 
          emergency.alert_id === emergencyId 
            ? { ...emergency, status: newStatus }
            : emergency
        ))
        
        if (selectedEmergency && selectedEmergency.alert_id === emergencyId) {
          setSelectedEmergency(prev => ({ ...prev, status: newStatus }))
          // Refresh details
          fetchEmergencyDetails(emergencyId)
          fetchEmergencyUpdates(emergencyId)
        }
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleViewDetails = async (emergency) => {
    setSelectedEmergency(emergency)
    setAutoRefresh(true) // Enable auto-refresh when viewing details
  }

  const handleViewMedia = async (alertId = null) => {
    const media = await fetchAllMedia(alertId)
    setAllMedia(media)
    setShowMediaModal(true)
  }

  const handleCallUser = (phoneNumber) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_blank')
    } else {
      alert('Phone number not available')
    }
  }

  const handleSendMessage = (phoneNumber) => {
    if (phoneNumber) {
      window.open(`sms:${phoneNumber}`, '_blank')
    } else {
      alert('Phone number not available')
    }
  }

  const handleSendEmail = (email) => {
    if (email) {
      window.open(`mailto:${email}`, '_blank')
    } else {
      alert('Email not available')
    }
  }

  const handleManualRefresh = async () => {
    await fetchEmergencies()
    if (selectedEmergency) {
      await loadEmergencyData(selectedEmergency)
    }
  }

  const renderEnhancedMediaPreview = () => {
    if (allMedia.length === 0) return null

    return (
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-on-surface">Recent Media</h4>
          <button
            onClick={() => handleViewMedia(selectedEmergency.alert_id)}
            className="text-primary hover:text-primary-dark text-sm font-medium flex items-center space-x-1"
          >
            <span>View All ({allMedia.length})</span>
            <Play className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {allMedia.slice(0, 3).map(media => (
            <div 
              key={media.id} 
              className="aspect-video bg-surface-variant rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleViewMedia(selectedEmergency.alert_id)}
            >
              <div className="h-full flex flex-col items-center justify-center p-2">
                <div className={`p-2 rounded-full ${getMediaIconColor(media.media_type)} mb-1`}>
                  {getMediaIcon(media.media_type)}
                </div>
                <div className="text-xs text-on-surface text-center capitalize">
                  {media.media_type}
                </div>
                <div className="text-xs text-on-surface-variant mt-1">
                  {formatTimeAgo(media.captured_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const filteredEmergencies = emergencies.filter(emergency => {
    const matchesSearch = emergency.alert_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emergency.initial_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emergency.user_info?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || emergency.status === statusFilter
    const matchesType = typeFilter === 'all' || emergency.emergency_type === typeFilter
    const matchesPriority = priorityFilter === 'all' || emergency.severity_level === priorityFilter
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority
  })

  const stats = {
    total: emergencies.length,
    active: emergencies.filter(e => e.status === 'active').length,
    assigned: emergencies.filter(e => e.status === 'assigned').length,
    resolved: emergencies.filter(e => e.status === 'resolved' || e.status === 'completed').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Emergency Management</h1>
          <p className="text-on-surface-variant mt-1">
            Monitor and coordinate emergency response operations
            {autoRefresh && <span className="text-green-500 ml-2">• Auto-refresh ON (30s)</span>}
          </p>
        </div>
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <button 
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              autoRefresh 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-surface-variant text-on-surface hover:bg-surface'
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Auto: {autoRefresh ? 'ON' : 'OFF'}</span>
          </button>
          <button 
            onClick={handleManualRefresh}
            className="btn-primary flex items-center space-x-2"
            disabled={loading}
          >
            <Download className="h-4 w-4" />
            <span>{loading ? 'Refreshing...' : 'Refresh Now'}</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Total Emergencies</p>
              <p className="text-2xl font-bold text-on-surface mt-1">{stats.total}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Active</p>
              <p className="text-2xl font-bold text-red-500 mt-1">{stats.active}</p>
            </div>
            <Clock className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Assigned</p>
              <p className="text-2xl font-bold text-orange-500 mt-1">{stats.assigned}</p>
            </div>
            <Shield className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Resolved</p>
              <p className="text-2xl font-bold text-green-500 mt-1">{stats.resolved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant h-4 w-4" />
              <input
                type="text"
                placeholder="Search by emergency ID, location, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full pl-10 pr-4"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="assigned">Assigned</option>
              <option value="resolved">Resolved</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="medical">Medical</option>
              <option value="fire">Fire</option>
              <option value="crime">Crime</option>
              <option value="accident">Accident</option>
              <option value="general">General</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Emergencies Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline">
                <th className="text-left py-4 px-6 text-sm font-medium text-on-surface-variant">Emergency ID</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-on-surface-variant">Type</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-on-surface-variant">Location</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-on-surface-variant">Priority</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-on-surface-variant">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-on-surface-variant">Time</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {filteredEmergencies.map(emergency => (
                <tr key={emergency.alert_id} className="hover:bg-surface-variant transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {getTypeIcon(emergency.emergency_type)}
                      </div>
                      <div>
                        <div className="font-medium text-on-surface">{emergency.alert_id}</div>
                        <div className="text-sm text-on-surface-variant">
                          {emergency.user_info ? `${emergency.user_info.full_name}` : 'Anonymous'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="capitalize text-on-surface">{emergency.emergency_type}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-on-surface-variant" />
                      <span className="text-on-surface">{emergency.initial_address || 'Location not available'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(emergency.severity_level)}`}>
                      {emergency.severity_level}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(emergency.status)}`}>
                      {emergency.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-on-surface-variant">
                      {formatTimeAgo(emergency.activated_at)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(emergency)}
                        className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {emergency.status === 'active' && (
                        <button
                          onClick={() => {
                            setSelectedEmergency(emergency)
                            setShowAssignmentModal(true)
                          }}
                          className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface rounded-lg transition-colors"
                          title="Assign Responder"
                        >
                          <User className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-on-surface-variant mt-2">Loading emergencies...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredEmergencies.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-on-surface-variant mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-on-surface mb-2">No emergencies found</h3>
            <p className="text-on-surface-variant">
              {emergencies.length === 0 
                ? "No emergencies have been reported yet."
                : "Try adjusting your search criteria."
              }
            </p>
          </div>
        )}
      </div>

      {/* Enhanced Emergency Details Modal */}
      {selectedEmergency && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-outline">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">
                    {getTypeIcon(selectedEmergency.emergency_type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-on-surface">Emergency Details</h3>
                    <p className="text-on-surface-variant mt-1">{selectedEmergency.alert_id}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEmergency.status)}`}>
                        {selectedEmergency.status}
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleManualRefresh}
                    className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors"
                    title="Refresh Data"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEmergency(null)
                      setEmergencyDetails(null)
                      setEmergencyUpdates(null)
                      setAvailableResponders([])
                      setEmergencyMapData(null)
                      setAllMedia([])
                      setEmergencyResponses(null)
                    }}
                    className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Map and Responders */}
                <div className="space-y-6">
                  <EmergencyMap 
                    emergency={selectedEmergency}
                    responders={availableResponders}
                    locationUpdates={emergencyUpdates?.location_updates}
                    emergencyResponses={emergencyResponses}
                    onResponderSelect={handleQuickAssign}
                  />
                  
                  {/* Quick Actions */}
                  <div className="card p-4">
                    <h4 className="font-semibold text-on-surface mb-3">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => handleCallUser(emergencyDetails?.user_info?.phone)}
                        className="btn-primary flex items-center justify-center space-x-2 py-2"
                      >
                        <Phone className="h-4 w-4" />
                        <span>Call User</span>
                      </button>
                      <button className="bg-surface-variant text-on-surface py-2 rounded-lg hover:bg-surface transition-colors flex items-center justify-center space-x-2">
                        <Navigation className="h-4 w-4" />
                        <span>Navigate</span>
                      </button>
                      <button 
                        onClick={() => handleSendMessage(emergencyDetails?.user_info?.phone)}
                        className="bg-surface-variant text-on-surface py-2 rounded-lg hover:bg-surface transition-colors flex items-center justify-center space-x-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Message</span>
                      </button>
                      <button 
                        onClick={() => handleSendEmail(emergencyDetails?.user_info?.email)}
                        className="bg-surface-variant text-on-surface py-2 rounded-lg hover:bg-surface transition-colors flex items-center justify-center space-x-2"
                      >
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                      </button>
                    </div>
                  </div>

                  {/* Media Preview */}
                  {renderEnhancedMediaPreview()}
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="card p-4">
                    <h4 className="font-semibold text-on-surface mb-3">Emergency Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-on-surface-variant">Emergency ID:</span>
                        <span className="text-on-surface ml-2 font-medium">{selectedEmergency.alert_id}</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant">Type:</span>
                        <span className="text-on-surface ml-2 capitalize">{selectedEmergency.emergency_type}</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant">Priority:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedEmergency.severity_level)}`}>
                          {selectedEmergency.severity_level}
                        </span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEmergency.status)}`}>
                          {selectedEmergency.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant">Activation Method:</span>
                        <span className="text-on-surface ml-2 capitalize">{selectedEmergency.activation_method}</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant">Silent Mode:</span>
                        <span className="text-on-surface ml-2">{selectedEmergency.is_silent ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-on-surface-variant">Coordinates:</span>
                        <span className="text-on-surface ml-2 font-mono">
                          {selectedEmergency.initial_latitude && selectedEmergency.initial_longitude 
                            ? `${parseFloat(selectedEmergency.initial_latitude).toFixed(6)}, ${parseFloat(selectedEmergency.initial_longitude).toFixed(6)}`
                            : 'Not available'
                          }
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-on-surface-variant">Description:</span>
                        <span className="text-on-surface ml-2">{selectedEmergency.description || 'No description provided'}</span>
                      </div>
                    </div>
                  </div>

                  {/* User Information */}
                  {emergencyDetails?.user_info && (
                    <div className="card p-4">
                      <h4 className="font-semibold text-on-surface mb-3 flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>User Information</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-on-surface-variant">Name:</span>
                          <span className="text-on-surface ml-2 font-medium">{emergencyDetails.user_info.full_name}</span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant">Email:</span>
                          <span className="text-on-surface ml-2">{emergencyDetails.user_info.email}</span>
                        </div>
                        {emergencyDetails.user_info.phone && (
                          <div className="col-span-2">
                            <span className="text-on-surface-variant">Phone:</span>
                            <span className="text-on-surface ml-2 font-medium">{emergencyDetails.user_info.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Emergency Responders List */}
                  <EmergencyRespondersList 
                    responses={emergencyResponses?.responses} 
                    alertId={selectedEmergency.alert_id}
                  />

                  {/* Emergency Contacts */}
                  {emergencyContacts.length > 0 && (
                    <div className="card p-4">
                      <h4 className="font-semibold text-on-surface mb-3 flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Emergency Contacts ({emergencyContacts.length})</span>
                      </h4>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {emergencyContacts.map(contact => (
                          <div key={contact.id} className="bg-surface-variant rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-on-surface">{contact.name}</div>
                                <div className="text-sm text-on-surface-variant">{contact.relationship}</div>
                              </div>
                              {contact.is_primary && (
                                <span className="px-2 py-1 bg-primary text-white rounded-full text-xs">Primary</span>
                              )}
                            </div>
                            <div className="mt-2 text-sm">
                              <div className="text-on-surface">{contact.phone}</div>
                              {contact.email && (
                                <div className="text-on-surface-variant">{contact.email}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-outline">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-on-surface">Assign Responder</h3>
                  <p className="text-on-surface-variant mt-1">
                    Emergency: {selectedEmergency?.alert_id}
                  </p>
                </div>
                {selectedResponder && (
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl">
                      {getResponderTypeIcon(selectedResponder.responder_type)}
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-on-surface text-sm">{selectedResponder.name}</div>
                      <div className="text-xs text-on-surface-variant capitalize">{selectedResponder.responder_type}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6">
              {!selectedResponder ? (
                <div className="space-y-3">
                  <h4 className="font-medium text-on-surface mb-3">Select a responder:</h4>
                  {availableResponders.length === 0 ? (
                    <div className="text-center py-8">
                      <User className="h-12 w-12 text-on-surface-variant mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-on-surface mb-2">No Available Responders</h4>
                      <p className="text-on-surface-variant">
                        All responders are currently busy or no responders are available in the area.
                      </p>
                    </div>
                  ) : (
                    availableResponders.map(responder => (
                      <div
                        key={responder.id}
                        className="flex items-center justify-between p-3 bg-surface-variant rounded-lg hover:bg-surface transition-colors cursor-pointer border-l-4 border-blue-500"
                        onClick={() => setSelectedResponder(responder)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">
                            {getResponderTypeIcon(responder.responder_type)}
                          </div>
                          <div>
                            <div className="font-medium text-on-surface">{responder.name}</div>
                            <div className="text-sm text-on-surface-variant capitalize">
                              {responder.responder_type} • {responder.distance_km} km away
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-sm text-on-surface">
                            <Clock className="h-3 w-3" />
                            <span>{responder.eta_minutes} min</span>
                          </div>
                          <div className="text-xs text-on-surface-variant">
                            ETA
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-surface-variant rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-3xl">
                        {getResponderTypeIcon(selectedResponder.responder_type)}
                      </div>
                      <div>
                        <div className="font-medium text-on-surface">{selectedResponder.name}</div>
                        <div className="text-sm text-on-surface-variant capitalize">{selectedResponder.responder_type}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-on-surface-variant">Distance:</span>
                        <span className="text-on-surface ml-2">{selectedResponder.distance_km} km</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant">ETA:</span>
                        <span className="text-on-surface ml-2">{selectedResponder.eta_minutes} minutes</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant">Rating:</span>
                        <span className="text-on-surface ml-2">{selectedResponder.rating || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant">Cases:</span>
                        <span className="text-on-surface ml-2">{selectedResponder.total_cases || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-on-surface">
                      Assignment Notes (Optional)
                    </label>
                    <textarea
                      placeholder="Add any specific instructions for the responder..."
                      className="input-field w-full h-20 resize-none"
                      defaultValue={`Please respond to emergency ${selectedEmergency?.alert_id}. ${selectedEmergency?.description ? `Details: ${selectedEmergency.description}` : ''}`}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-outline flex space-x-3">
              {selectedResponder ? (
                <>
                  <button
                    onClick={() => setSelectedResponder(null)}
                    className="flex-1 bg-surface-variant text-on-surface py-2 rounded-lg hover:bg-surface transition-colors"
                    disabled={assigningResponder}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => handleAssignResponder(selectedResponder)}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                    disabled={assigningResponder}
                  >
                    {assigningResponder ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Assigning...</span>
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4" />
                        <span>Confirm Assignment</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAssignmentModal(false)}
                  className="w-full bg-surface-variant text-on-surface py-2 rounded-lg hover:bg-surface transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Media Modal */}
      {showMediaModal && (
        <EnhancedMediaModal 
          media={allMedia} 
          onClose={() => setShowMediaModal(false)} 
        />
      )}
    </div>
  )
}

export default Emergencies