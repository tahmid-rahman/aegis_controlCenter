// src/pages/Evidence.jsx
import React, { useState, useEffect } from 'react'
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
  XCircle,
  Plus,
  Upload
} from 'lucide-react'
import api from '../services/api'

const Evidence = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedEvidence, setSelectedEvidence] = useState(null)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [evidenceList, setEvidenceList] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    under_review: 0,
    total_duration_seconds: 0,
    total_file_size: 0
  })

  // Form state for new evidence
  const [newEvidence, setNewEvidence] = useState({
    title: 'Silently Captured Evidence',
    location_lat: '',
    location_lng: '',
    location_address: '',
    recorded_at: new Date().toISOString().slice(0, 16),
    is_anonymous: false,
    duration_seconds: 0
  })
  const [videoFile, setVideoFile] = useState(null)

  // Fetch evidence data
  useEffect(() => {
    fetchEvidence()
    fetchStatistics()
  }, [])

  const fetchEvidence = async () => {
    try {
      setLoading(true)
      const response = await api.get('/aegis/evidence/list/')
      setEvidenceList(response.data)
    } catch (error) {
      console.error('Error fetching evidence:', error)
      alert('Failed to load evidence data')
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/aegis/evidence/statistics/')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching statistics:', error)
    }
  }

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
    // Map evidence types based on your data structure
    const typeMap = {
      harassment: 'text-purple-500 bg-purple-500/10',
      stalking: 'text-orange-500 bg-orange-500/10',
      robbery: 'text-red-500 bg-red-500/10',
      assault: 'text-pink-500 bg-pink-500/10'
    }
    return typeMap[type] || 'text-gray-500 bg-gray-500/10'
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
    if (!fileSize) return '0 B'
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
    if (!seconds) return '0s'
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
                         (evidence.description && evidence.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         evidence.location_address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || evidence.status === statusFilter
    const matchesType = typeFilter === 'all' || evidence.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const handleDownload = async (evidence) => {
    try {
      if (evidence.video_file) {
        // Create a temporary link to download the file
        const link = document.createElement('a')
        link.href = evidence.video_file
        link.download = evidence.title + '.mp4'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        alert('No video file available for download')
      }
    } catch (error) {
      console.error('Error downloading evidence:', error)
      alert('Failed to download evidence')
    }
  }

  const handleDelete = async (evidenceId) => {
    try {
      await api.delete(`/aegis/evidence/${evidenceId}/delete/`)
      setEvidenceList(evidenceList.filter(evidence => evidence.id !== evidenceId))
      fetchStatistics()
      setShowDeleteModal(false)
      alert('Evidence deleted successfully')
    } catch (error) {
      console.error('Error deleting evidence:', error)
      alert('Failed to delete evidence')
    }
  }

  const handleSubmitEvidence = async () => {
    try {
      setUploading(true)
      
      // First create the evidence record
      const evidenceResponse = await api.post('/aegis/evidence/submit/', newEvidence)
      const evidenceId = evidenceResponse.data.evidence_id
      
      // Then upload the video file if provided
      if (videoFile) {
        const formData = new FormData()
        formData.append('video_file', videoFile)
        formData.append('media_type', 'video')
        
        await api.post(`/evidence/${evidenceId}/upload/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }
      
      // Refresh the evidence list
      await fetchEvidence()
      await fetchStatistics()
      
      setShowUploadModal(false)
      setNewEvidence({
        title: 'Silently Captured Evidence',
        location_lat: '',
        location_lng: '',
        location_address: '',
        recorded_at: new Date().toISOString().slice(0, 16),
        is_anonymous: false,
        duration_seconds: 0
      })
      setVideoFile(null)
      
      alert('Evidence submitted successfully')
    } catch (error) {
      console.error('Error submitting evidence:', error)
      alert('Failed to submit evidence: ' + (error.response?.data?.error || error.message))
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file size (100MB max)
      if (file.size > 100 * 1024 * 1024) {
        alert('File size cannot exceed 100MB')
        return
      }
      
      // Validate file type
      const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm']
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid video file (MP4, MOV, AVI, MKV, or WebM)')
        return
      }
      
      setVideoFile(file)

      const video = document.createElement('video')
      video.preload = 'metadata'
      
      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src)
        setNewEvidence(prev => ({
          ...prev,
          duration_seconds: Math.floor(video.duration)
        }))
      }
      
      video.src = URL.createObjectURL(file)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-on-surface-variant mt-4">Loading evidence...</p>
        </div>
      </div>
    )
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
          <button 
            onClick={() => setShowUploadModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Evidence</span>
          </button>
          <button className="btn-secondary flex items-center space-x-2">
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
              <p className="text-2xl font-bold text-on-surface mt-1">{stats.total_videos || 0}</p>
            </div>
            <Video className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Total Duration</p>
              <p className="text-2xl font-bold text-blue-500 mt-1">
                {stats.total_duration_display || '0h 0m'}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Total Storage</p>
              <p className="text-2xl font-bold text-purple-500 mt-1">
                {stats.total_file_size_display || '0 GB'}
              </p>
            </div>
            <FileText className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Recent (7d)</p>
              <p className="text-2xl font-bold text-green-500 mt-1">{stats.recent_count || 0}</p>
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
                <span className="capitalize">{evidence.status?.replace('_', ' ') || 'unknown'}</span>
              </span>
              {evidence.type && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(evidence.type)}`}>
                  {evidence.type}
                </span>
              )}
            </div>

            {/* Description */}
            {evidence.description && (
              <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">
                {evidence.description}
              </p>
            )}

            {/* Video Preview */}
            <div 
              className="relative bg-surface-variant rounded-lg h-40 mb-4 cursor-pointer group overflow-hidden"
              onClick={() => {
                setSelectedEvidence(evidence)
                setShowVideoModal(true)
              }}
            >
              {evidence.video_file ? (
                <>
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
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant">
                  <div className="text-center">
                    <Video className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">No video uploaded</p>
                  </div>
                </div>
              )}
            </div>

            {/* Location and User Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-on-surface-variant">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{evidence.location_address || 'No location specified'}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-on-surface-variant">
                  <User className="h-4 w-4" />
                  <span>
                    {evidence.is_anonymous ? 'Anonymous User' : evidence.user_email}
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
                <span>View</span>
              </button>
              
              <button
                onClick={() => handleDownload(evidence)}
                disabled={!evidence.video_file}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 ${
                  evidence.video_file 
                    ? 'bg-surface-variant text-on-surface hover:bg-surface' 
                    : 'bg-surface-variant/50 text-on-surface-variant cursor-not-allowed'
                }`}
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
          <p className="text-on-surface-variant mb-6">
            {evidenceList.length === 0 
              ? "No video evidence has been uploaded yet. Start by uploading your first evidence."
              : "Try adjusting your search criteria."
            }
          </p>
          {evidenceList.length === 0 && (
            <button 
              onClick={() => setShowUploadModal(true)}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <Upload className="h-4 w-4" />
              <span>Upload First Evidence</span>
            </button>
          )}
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
              {/* Video Player */}
              <div className="bg-black rounded-lg aspect-video flex items-center justify-center mb-6">
                {selectedEvidence.video_file ? (
                  <video 
                    controls 
                    className="w-full h-full rounded-lg"
                    poster={selectedEvidence.thumbnail}
                  >
                    {/* <source src={selectedEvidence.video_file} type="video/mp4" /> */} 
                    <source src={`${process.env.REACT_APP_MEDIA_URL}${selectedEvidence.video_file}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="text-center text-white/70">
                    <Video className="h-16 w-16 mx-auto mb-4" />
                    <p>No video file available</p>
                  </div>
                )}
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
                      <span className="text-on-surface-variant">Duration:</span>
                      <span className="text-on-surface">{getDurationDisplay(selectedEvidence.duration_seconds)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">File Size:</span>
                      <span className="text-on-surface">{getFileSizeDisplay(selectedEvidence.file_size)}</span>
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
                      <span className="text-on-surface-variant">Location: </span>
                      <span className="text-on-surface text-right">{selectedEvidence.location_address || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">User:</span>
                      <span className="text-on-surface">
                        {selectedEvidence.is_anonymous ? 'Anonymous' : selectedEvidence.user_email}
                        
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Anonymity:</span>
                      <span className="text-on-surface">
                        {selectedEvidence.is_anonymous ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Uploaded:</span>
                      <span className="text-on-surface">{formatDateTime(selectedEvidence.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-3 mt-6 pt-6 border-t border-outline">
                <button
                  onClick={() => handleDownload(selectedEvidence)}
                  disabled={!selectedEvidence.video_file}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    selectedEvidence.video_file
                      ? 'btn-primary'
                      : 'bg-surface-variant/50 text-on-surface-variant cursor-not-allowed'
                  }`}
                >
                  <Download className="h-4 w-4" />
                  <span>Download Evidence</span>
                </button>
                
                <button 
                  onClick={() => {
                    setShowVideoModal(false)
                    setSelectedEvidence(selectedEvidence)
                    setShowDeleteModal(true)
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Evidence</span>
                </button>
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

      {/* Upload Evidence Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-outline">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-on-surface">
                  Upload New Evidence
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Video File Upload */}
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-3">
                    Video File *
                  </label>
                  <div className="border-2 border-dashed border-outline rounded-lg p-6 text-center">
                    {videoFile ? (
                      <div className="text-center">
                        <Video className="h-12 w-12 text-primary mx-auto mb-2" />
                        <p className="text-on-surface font-medium">{videoFile.name}</p>
                        <p className="text-on-surface-variant text-sm">
                          {getFileSizeDisplay(videoFile.size)} • {getDurationDisplay(newEvidence.duration_seconds)}
                        </p>
                        <button
                          onClick={() => setVideoFile(null)}
                          className="text-red-500 text-sm mt-2"
                        >
                          Remove File
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-on-surface-variant mx-auto mb-3" />
                        <p className="text-on-surface font-medium mb-1">Select video file</p>
                        <p className="text-on-surface-variant text-sm mb-4">
                          MP4, MOV, AVI, MKV, or WebM • Max 100MB
                        </p>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="video-upload"
                        />
                        <label
                          htmlFor="video-upload"
                          className="btn-primary cursor-pointer inline-flex items-center space-x-2"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Select File</span>
                        </label>
                      </>
                    )}
                  </div>
                </div>

                {/* Evidence Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={newEvidence.title}
                      onChange={(e) => setNewEvidence(prev => ({...prev, title: e.target.value}))}
                      className="input-field w-full"
                      placeholder="Evidence title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">
                      Recorded Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={newEvidence.recorded_at}
                      onChange={(e) => setNewEvidence(prev => ({...prev, recorded_at: e.target.value}))}
                      className="input-field w-full"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-on-surface mb-2">
                      Location Address
                    </label>
                    <input
                      type="text"
                      value={newEvidence.location_address}
                      onChange={(e) => setNewEvidence(prev => ({...prev, location_address: e.target.value}))}
                      className="input-field w-full"
                      placeholder="Enter location address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={newEvidence.location_lat}
                      onChange={(e) => setNewEvidence(prev => ({...prev, location_lat: e.target.value}))}
                      className="input-field w-full"
                      placeholder="23.8103"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={newEvidence.location_lng}
                      onChange={(e) => setNewEvidence(prev => ({...prev, location_lng: e.target.value}))}
                      className="input-field w-full"
                      placeholder="90.4125"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newEvidence.is_anonymous}
                        onChange={(e) => setNewEvidence(prev => ({...prev, is_anonymous: e.target.checked}))}
                        className="rounded border-outline text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-on-surface">Submit anonymously</span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-6 border-t border-outline">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 bg-surface-variant text-on-surface py-2 rounded-lg hover:bg-surface transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitEvidence}
                    disabled={!videoFile || uploading}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-2 ${
                      !videoFile || uploading
                        ? 'bg-primary/50 text-white cursor-not-allowed'
                        : 'btn-primary'
                    }`}
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        <span>Submit Evidence</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Evidence