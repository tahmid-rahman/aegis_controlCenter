// src/pages/Evidence.jsx
import React, { useState } from 'react'
import { 
  Video,
  Play,
  Download,
  MapPin,
  Calendar,
  User,
  Eye,
  EyeOff,
  Filter,
  Search,
  MoreVertical,
  Clock,
  FileText,
  Trash2,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

const Evidence = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedEvidence, setSelectedEvidence] = useState(null)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Mock evidence data based on your Django model
  const evidenceList = [
    {
      id: 1,
      title: 'Silently Captured Evidence - Harassment Incident',
      video_file: '/videos/evidence_001.mp4',
      location_lat: 23.7806,
      location_lng: 90.4143,
      location_address: 'Gulshan 1, Road 45, Dhaka, Bangladesh',
      recorded_at: '2024-01-15T14:30:00Z',
      is_anonymous: false,
      duration_seconds: 127,
      file_size: 15482931, // 15.5 MB
      created_at: '2024-01-15T14:35:00Z',
      updated_at: '2024-01-15T14:35:00Z',
      user: {
        id: 1,
        email: 'user@example.com',
        name: 'Anonymous User'
      },
      related_emergency: 'EMG-2024-0012',
      status: 'verified',
      type: 'harassment',
      description: 'Video evidence of verbal harassment near shopping area',
      tags: ['harassment', 'public_space', 'verbal_abuse']
    },
    {
      id: 2,
      title: 'Silently Captured Evidence - Stalking Evidence',
      video_file: '/videos/evidence_002.mp4',
      location_lat: 23.7465,
      location_lng: 90.3760,
      location_address: 'Dhanmondi Road 27, Dhaka, Bangladesh',
      recorded_at: '2024-01-14T20:15:00Z',
      is_anonymous: true,
      duration_seconds: 45,
      file_size: 8321456, // 8.3 MB
      created_at: '2024-01-14T20:20:00Z',
      updated_at: '2024-01-14T20:20:00Z',
      user: {
        id: 2,
        email: 'anonymous@shieldplus.bd',
        name: 'Anonymous'
      },
      related_emergency: 'EMG-2024-0011',
      status: 'pending',
      type: 'stalking',
      description: 'Footage of individual following victim',
      tags: ['stalking', 'following', 'night_time']
    },
    {
      id: 3,
      title: 'Silently Captured Evidence - Robbery Attempt',
      video_file: '/videos/evidence_003.mp4',
      location_lat: 23.7550,
      location_lng: 90.3840,
      location_address: 'Farmgate Bus Stand, Dhaka, Bangladesh',
      recorded_at: '2024-01-13T18:45:00Z',
      is_anonymous: false,
      duration_seconds: 89,
      file_size: 12458742, // 12.5 MB
      created_at: '2024-01-13T18:50:00Z',
      updated_at: '2024-01-13T18:50:00Z',
      user: {
        id: 3,
        email: 'reporter@example.com',
        name: 'Rahman Khan'
      },
      related_emergency: 'EMG-2024-0010',
      status: 'verified',
      type: 'robbery',
      description: 'Attempted bag snatching incident',
      tags: ['robbery', 'bus_stand', 'public_transport']
    },
    {
      id: 4,
      title: 'Silently Captured Evidence - Assault Evidence',
      video_file: '/videos/evidence_004.mp4',
      location_lat: 23.8759,
      location_lng: 90.3795,
      location_address: 'Uttara Sector 7, Dhaka, Bangladesh',
      recorded_at: '2024-01-12T22:30:00Z',
      is_anonymous: false,
      duration_seconds: 156,
      file_size: 19874523, // 19.9 MB
      created_at: '2024-01-12T22:35:00Z',
      updated_at: '2024-01-12T22:35:00Z',
      user: {
        id: 4,
        email: 'victim@example.com',
        name: 'Fatima Begum'
      },
      status: 'under_review',
      type: 'assault',
      description: 'Physical assault near residential area',
      tags: ['assault', 'physical_violence', 'residential']
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-green-500 bg-green-500/10'
      case 'pending': return 'text-yellow-500 bg-yellow-500/10'
      case 'under_review': return 'text-blue-500 bg-blue-500/10'
      case 'rejected': return 'text-red-500 bg-red-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'harassment': return 'text-purple-500 bg-purple-500/10'
      case 'stalking': return 'text-orange-500 bg-orange-500/10'
      case 'robbery': return 'text-red-500 bg-red-500/10'
      case 'assault': return 'text-pink-500 bg-pink-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'under_review': return <Eye className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getFileSizeDisplay = (fileSize) => {
    if (fileSize < 1024) {
      return `${fileSize} B`
    } else if (fileSize < 1024 * 1024) {
      return `${(fileSize / 1024).toFixed(1)} KB`
    } else if (fileSize < 1024 * 1024 * 1024) {
      return `${(fileSize / (1024 * 1024)).toFixed(1)} MB`
    } else {
      return `${(fileSize / (1024 * 1024 * 1024)).toFixed(1)} GB`
    }
  }

  const getDurationDisplay = (seconds) => {
    if (seconds < 60) {
      return `${seconds}s`
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}m ${remainingSeconds}s`
    } else {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      return `${hours}h ${minutes}m`
    }
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredEvidence = evidenceList.filter(evidence => {
    const matchesSearch = evidence.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evidence.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evidence.location_address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || evidence.status === statusFilter
    const matchesType = typeFilter === 'all' || evidence.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    total: evidenceList.length,
    verified: evidenceList.filter(e => e.status === 'verified').length,
    pending: evidenceList.filter(e => e.status === 'pending').length,
    under_review: evidenceList.filter(e => e.status === 'under_review').length
  }

  const handleDownload = (evidence) => {
    // Simulate download
    alert(`Downloading ${evidence.title}...`)
  }

  const handleDelete = (evidenceId) => {
    // Simulate delete
    alert(`Evidence #${evidenceId} marked for deletion`)
    setShowDeleteModal(false)
  }

  const handleStatusUpdate = (evidenceId, newStatus) => {
    // Simulate status update
    alert(`Evidence #${evidenceId} status updated to ${newStatus}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Evidence Management</h1>
          <p className="text-on-surface-variant mt-1">
            Review and manage silently captured video evidence
          </p>
        </div>
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <button className="btn-primary flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Total Evidence</p>
              <p className="text-2xl font-bold text-on-surface mt-1">{stats.total}</p>
            </div>
            <Video className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Verified</p>
              <p className="text-2xl font-bold text-green-500 mt-1">{stats.verified}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-500 mt-1">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Under Review</p>
              <p className="text-2xl font-bold text-blue-500 mt-1">{stats.under_review}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-500" />
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
                placeholder="Search evidence by title, description, or location..."
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
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="harassment">Harassment</option>
              <option value="stalking">Stalking</option>
              <option value="robbery">Robbery</option>
              <option value="assault">Assault</option>
            </select>
            
            <button className="btn-primary flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Evidence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEvidence.map(evidence => (
          <div key={evidence.id} className="card p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-on-surface line-clamp-2">
                    {evidence.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    #{evidence.id} • {formatDateTime(evidence.recorded_at)}
                  </p>
                </div>
              </div>
              <button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            {/* Status and Type */}
            <div className="flex items-center space-x-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(evidence.status)}`}>
                {getStatusIcon(evidence.status)}
                <span className="capitalize">{evidence.status.replace('_', ' ')}</span>
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(evidence.type)}`}>
                {evidence.type}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">
              {evidence.description}
            </p>

            {/* Video Preview */}
            <div 
              className="relative bg-surface-variant rounded-lg h-40 mb-4 cursor-pointer group overflow-hidden"
              onClick={() => {
                setSelectedEvidence(evidence)
                setShowVideoModal(true)
              }}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="h-6 w-6 text-gray-900 ml-1" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                  {getDurationDisplay(evidence.duration_seconds)}
                </span>
                <span className="text-white text-sm bg-black/50 px-2 py-1 rounded">
                  {getFileSizeDisplay(evidence.file_size)}
                </span>
              </div>
            </div>

            {/* Location and User Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-on-surface-variant">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{evidence.location_address}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-on-surface-variant">
                  <User className="h-4 w-4" />
                  <span>
                    {evidence.is_anonymous ? 'Anonymous User' : evidence.user.name}
                  </span>
                  {evidence.is_anonymous && (
                    <Shield className="h-3 w-3 text-green-500" />
                  )}
                </div>
                
                {evidence.related_emergency && (
                  <span className="text-primary font-medium">
                    {evidence.related_emergency}
                  </span>
                )}
              </div>
            </div>

            {/* Tags */}
            {evidence.tags && evidence.tags.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {evidence.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-surface-variant text-on-surface text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setSelectedEvidence(evidence)
                  setShowVideoModal(true)
                }}
                className="flex-1 bg-surface-variant text-on-surface py-2 px-3 rounded-lg hover:bg-surface transition-colors text-sm font-medium flex items-center justify-center space-x-1"
              >
                <Play className="h-4 w-4" />
                <span>Play</span>
              </button>
              
              <button
                onClick={() => handleDownload(evidence)}
                className="flex-1 bg-surface-variant text-on-surface py-2 px-3 rounded-lg hover:bg-surface transition-colors text-sm font-medium flex items-center justify-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              
              <button
                onClick={() => {
                  setSelectedEvidence(evidence)
                  setShowDeleteModal(true)
                }}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEvidence.length === 0 && (
        <div className="card p-12 text-center">
          <Video className="h-16 w-16 text-on-surface-variant mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-on-surface mb-2">No evidence found</h3>
          <p className="text-on-surface-variant">
            {evidenceList.length === 0 
              ? "No video evidence has been uploaded yet."
              : "Try adjusting your search criteria."
            }
          </p>
        </div>
      )}

      {/* Video Player Modal */}
      {showVideoModal && selectedEvidence && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-outline">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-on-surface">
                  {selectedEvidence.title}
                </h3>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Video Player Placeholder */}
              <div className="bg-black rounded-lg aspect-video flex items-center justify-center mb-6">
                <div className="text-center">
                  <Video className="h-16 w-16 text-white/50 mx-auto mb-4" />
                  <p className="text-white/70">Video Player</p>
                  <p className="text-white/50 text-sm mt-2">
                    {getDurationDisplay(selectedEvidence.duration_seconds)} • {getFileSizeDisplay(selectedEvidence.file_size)}
                  </p>
                </div>
              </div>
              
              {/* Evidence Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-on-surface mb-3">Evidence Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Evidence ID:</span>
                      <span className="text-on-surface font-medium">#{selectedEvidence.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Type:</span>
                      <span className="text-on-surface capitalize">{selectedEvidence.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEvidence.status)}`}>
                        {selectedEvidence.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Recorded:</span>
                      <span className="text-on-surface">{formatDateTime(selectedEvidence.recorded_at)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-on-surface mb-3">Location & User</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Location:</span>
                      <span className="text-on-surface text-right">{selectedEvidence.location_address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">User:</span>
                      <span className="text-on-surface">
                        {selectedEvidence.is_anonymous ? 'Anonymous' : selectedEvidence.user.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Anonymity:</span>
                      <span className="text-on-surface">
                        {selectedEvidence.is_anonymous ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    {selectedEvidence.related_emergency && (
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Emergency:</span>
                        <span className="text-primary font-medium">{selectedEvidence.related_emergency}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div className="mt-6">
                <h4 className="font-medium text-on-surface mb-2">Description</h4>
                <p className="text-on-surface-variant text-sm">
                  {selectedEvidence.description}
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-3 mt-6 pt-6 border-t border-outline">
                <button
                  onClick={() => handleDownload(selectedEvidence)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Evidence</span>
                </button>
                
                <button className="bg-surface-variant text-on-surface px-4 py-2 rounded-lg hover:bg-surface transition-colors flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Generate Report</span>
                </button>
                
                {selectedEvidence.status !== 'verified' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedEvidence.id, 'verified')}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Verify</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEvidence && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-on-surface">Delete Evidence</h3>
                <p className="text-on-surface-variant text-sm">
                  This action cannot be undone
                </p>
              </div>
            </div>
            
            <p className="text-on-surface-variant mb-6">
              Are you sure you want to delete evidence <strong>"{selectedEvidence.title}"</strong>? 
              This will permanently remove the video file and all associated data.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-surface-variant text-on-surface py-2 rounded-lg hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedEvidence.id)}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Evidence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Evidence