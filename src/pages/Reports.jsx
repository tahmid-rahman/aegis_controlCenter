// src/pages/Reports.jsx
import React, { useState, useEffect } from 'react'
import { 
  FileText,
  Search,
  Download,
  Eye,
  MessageSquare,
  MapPin,
  Calendar,
  User,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  RefreshCw,
} from 'lucide-react'
import api from '../services/api'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'


delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedReport, setSelectedReport] = useState(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [updateMessage, setUpdateMessage] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [newPriority, setNewPriority] = useState('')
  const [incidentReports, setIncidentReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [recent, setRecent] = useState([])
  const [stats, setStats] = useState({
    total_reports: 0,
    status_counts: {
      submitted: 0,
      under_review: 0,
      resolved: 0,
      dismissed: 0
    },
    type_counts: {
      harassment: 0,
      robbery: 0,
      assault: 0,
      stalking: 0,
      theft: 0,
      vandalism: 0,
      other: 0
    },
    last_submission: null
  })
  const [error, setError] = useState('')

  // Fetch incident reports
  const fetchIncidentReports = async () => {
    try {
      setLoading(true)
      const response = await api.get('/aegis/reports/')
      console.log(localStorage.getItem('token'))
      // console.log(response.data)
      setIncidentReports(response.data)
      setError('')
    } catch (err) {
      console.error('Error fetching reports:', err)
      setError('Failed to load incident reports')
      // Fallback to mock data if API fails
      setIncidentReports(getMockData())
    } finally {
      setLoading(false)
    }
  }

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const response = await api.get('/aegis/reports/statistics/')
      setStats(response.data)
    } catch (err) {
      console.error('Error fetching statistics:', err)
      // Fallback to calculated stats from local data
      setStats(calculateStats(incidentReports))
    }
  }
  const fetchRecentReports = async () => {
  try {
    const response = await api.get('/aegis/reports/recent/')

    const recentReports = Array.isArray(response.data) ? response.data : []

    setRecent(recentReports)
    console.log('Recent reports fetched:', recentReports)
  } catch (err) {
    console.error('Error fetching recent reports:', err)

    const fallbackReports = incidentReports.slice(0, 5)
    setRecent(fallbackReports)
  }
}



  // Calculate stats from local data
  const calculateStats = (reports) => {
    const statusCounts = {
      submitted: reports.filter(r => r.status === 'submitted').length,
      under_review: reports.filter(r => r.status === 'under_review').length,
      resolved: reports.filter(r => r.status === 'resolved').length,
      dismissed: reports.filter(r => r.status === 'dismissed').length
    }

    const typeCounts = {
      harassment: reports.filter(r => r.incident_type === 'harassment').length,
      robbery: reports.filter(r => r.incident_type === 'robbery').length,
      assault: reports.filter(r => r.incident_type === 'assault').length,
      stalking: reports.filter(r => r.incident_type === 'stalking').length,
      theft: reports.filter(r => r.incident_type === 'theft').length,
      vandalism: reports.filter(r => r.incident_type === 'vandalism').length,
      other: reports.filter(r => r.incident_type === 'other').length
    }

    return {
      total_reports: reports.length,
      status_counts: statusCounts,
      type_counts: typeCounts,
      last_submission: reports.length > 0 ? reports[0].created_at : null
    }
  }

  useEffect(() => {
    fetchIncidentReports()
  }, [])
  
  useEffect(() => {
    fetchRecentReports()
  }, [])

  useEffect(() => {
    if (incidentReports.length > 0) {
      fetchStatistics()
    }
  }, [incidentReports])

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'text-blue-500 bg-blue-500/10'
      case 'under_review': return 'text-orange-500 bg-orange-500/10'
      case 'resolved': return 'text-green-500 bg-green-500/10'
      case 'dismissed': return 'text-gray-500 bg-gray-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 bg-red-500/10'
      case 'high': return 'text-orange-500 bg-orange-500/10'
      case 'medium': return 'text-yellow-500 bg-yellow-500/10'
      case 'low': return 'text-green-500 bg-green-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'harassment': return '🚨'
      case 'robbery': return '💰'
      case 'stalking': return '👁️'
      case 'assault': return '👊'
      case 'theft': return '📱'
      case 'vandalism': return '🏚️'
      case 'other': return '⚠️'
      default: return '📄'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted': return <Clock className="h-4 w-4" />
      case 'under_review': return <Eye className="h-4 w-4" />
      case 'resolved': return <CheckCircle className="h-4 w-4" />
      case 'dismissed': return <XCircle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const filteredReports = incidentReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter
    const matchesType = typeFilter === 'all' || report.incident_type === typeFilter
    const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority
  })

  const handleUpdateStatus = async (reportId, status, message) => {
    try {
      // This would call your API to update status
      await api.post(`/aegis/reports/${reportId}/update-status/`, {
        status: status,
        priority: newPriority,
        message: message
      })
      
      // Refresh the data
      fetchIncidentReports()
      setShowUpdateModal(false)
      setUpdateMessage('')
      setSelectedReport(null)
      setNewStatus('')
      setNewPriority('')
    } catch (err) {
      console.error('Error updating status:', err)
      setError('Failed to update report status')
    }
  }


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTimeAgo = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  // Mock data fallback
  const getMockData = () => {
    return [
      {
        id: 1,
        incident_type: 'harassment',
        title: 'Verbal harassment near Gulshan market',
        description: 'I was walking home from work when a group of men started making inappropriate comments and following me.',
        location: 'Gulshan 2, near Aarong, Dhaka',
        incident_date: '2024-01-15T18:30:00Z',
        latitude: 23.7806,
        longitude: 90.4143,
        is_anonymous: false,
        status: 'under_review',
        priority: 'high',
        created_at: '2024-01-15T19:00:00Z',
        updated_at: '2024-01-15T19:30:00Z',
        user_name: 'Fatima Begum',
        media: [
          { id: 1, media_type: 'photo', file: 'photo1.jpg', caption: 'Location photo', created_at: '2024-01-15T19:00:00Z' }
        ],
        updates: [
          {
            id: 1,
            status: 'under_review',
            message: 'Report has been received and is under review by our team.',
            created_by_name: 'Control Center Admin',
            created_at: '2024-01-15T19:15:00Z'
          }
        ]
      }
    ]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-on-surface-variant">Loading incident reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Reports & Complaints</h1>
          <p className="text-on-surface-variant mt-1">
            Manage incident reports and complaints from users
          </p>
        </div>
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <button 
            onClick={fetchIncidentReports}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-500">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Total Reports</p>
              <p className="text-2xl font-bold text-on-surface mt-1">{stats.total_reports}</p>
            </div>
            <FileText className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Submitted</p>
              <p className="text-2xl font-bold text-blue-500 mt-1">{stats.status_counts.submitted}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Under Review</p>
              <p className="text-2xl font-bold text-orange-500 mt-1">{stats.status_counts.under_review}</p>
            </div>
            <Eye className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Resolved</p>
              <p className="text-2xl font-bold text-green-500 mt-1">{stats.status_counts.resolved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Dismissed</p>
              <p className="text-2xl font-bold text-gray-500 mt-1">{stats.status_counts.dismissed}</p>
            </div>
            <XCircle className="h-8 w-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-on-surface mb-4 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Report Types Distribution</span>
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.type_counts).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getTypeIcon(type)}</span>
                  <span className="text-on-surface capitalize">{type}</span>
                </div>
                <span className="font-medium text-on-surface">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-on-surface mb-4 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Recent Activity</span>
          </h3>
          <div className="space-y-3">
            {recent && recent.length > 0 && (
              <div className="space-y-2 py-4">
                {recent.map((report) => (
                  <div key={report.id} className="bg-surface-variant p-3 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                    <div className="flex items-center space-x-3">
                      {/* Type Icon */}
                      <span className="text-xl">
                        {report.incident_type === "harassment" ? "🚨" :
                        report.incident_type === "robbery" ? "💰" :
                        report.incident_type === "stalking" ? "👁️" :
                        report.incident_type === "assault" ? "👊" :
                        report.incident_type === "theft" ? "📱" :
                        report.incident_type === "vandalism" ? "🏚️" :
                        report.incident_type === "other" ? "⚠️" : "📄"}
                      </span>

                      {/* Title & Info */}
                      <div className="flex flex-col">
                        <span className="font-semibold text-on-surface">{report.title}</span>
                        <span className="text-xs text-on-surface-variant">
                          {report.is_anonymous ? 'Anonymous' : report.user_name} • {report.status.replace('_', ' ')} • {formatTimeAgo(report.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!recent && ( 
            <div className="text-center">
              <button 
                onClick={fetchIncidentReports}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh Data</span>
              </button>
            </div>)}
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
                placeholder="Search reports by title, description, or location..."
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
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="harassment">Harassment</option>
              <option value="robbery">Robbery</option>
              <option value="stalking">Stalking</option>
              <option value="assault">Assault</option>
              <option value="theft">Theft</option>
              <option value="vandalism">Vandalism</option>
              <option value="other">Other</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map(report => (
          <div key={report.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4 flex-1">
                <div className="text-3xl">
                  {getTypeIcon(report.incident_type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-on-surface">{report.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                      {report.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <p className="text-on-surface-variant mb-3 line-clamp-2">
                    {report.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{report.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(report.incident_date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{report.is_anonymous ? 'Anonymous' : report.user_name}</span>
                    </div>
                    {report.media && report.media.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>{report.media.length} media files</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedReport(report)}
                  className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedReport(report)
                    setNewStatus(report.status)
                    setNewPriority(report.priority)
                    setShowUpdateModal(true)
                  }}
                  className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors"
                  title="Update Status"
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Latest Update */}
            {report.updates && report.updates.length > 0 && (
              <div className="border-t border-outline pt-4">
                <div className="flex items-start space-x-3">
                  {getStatusIcon(report.status)}
                  <div className="flex-1">
                    <p className="text-sm text-on-surface">
                      {report.updates[report.updates.length - 1].message}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      By {report.updates[report.updates.length - 1].created_by_name} • {formatTimeAgo(report.updates[report.updates.length - 1].created_at)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <div className="card p-12 text-center">
          <FileText className="h-16 w-16 text-on-surface-variant mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-on-surface mb-2">No reports found</h3>
          <p className="text-on-surface-variant">
            {incidentReports.length === 0 
              ? "No incident reports have been submitted yet."
              : "Try adjusting your search criteria."
            }
          </p>
        </div>
      )}

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-outline">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-on-surface">Report Details</h3>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-on-surface mb-3">Incident Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Report ID:</span>
                      <span className="text-on-surface font-medium">#{selectedReport.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Type:</span>
                      <span className="text-on-surface capitalize">{selectedReport.incident_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Priority:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedReport.priority)}`}>
                        {selectedReport.priority}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                        {selectedReport.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-on-surface mb-3">Location & Time</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Incident Date:</span>
                      <span className="text-on-surface">{formatDate(selectedReport.incident_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Reported:</span>
                      <span className="text-on-surface">{formatTimeAgo(selectedReport.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Last Updated:</span>
                      <span className="text-on-surface">{formatTimeAgo(selectedReport.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-medium text-on-surface mb-3">Description</h4>
                <div className="bg-surface-variant rounded-lg p-4">
                  <p className="text-on-surface whitespace-pre-wrap">{selectedReport.description}</p>
                </div>
              </div>

              {/* Location */}
              <div>
                <h4 className="font-medium text-on-surface mb-3">Location</h4>
                <div className="flex items-center space-x-2 text-on-surface mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedReport.location}</span>
                </div>

                {selectedReport.latitude && selectedReport.longitude ? (
                  <MapContainer
                    center={[selectedReport.latitude, selectedReport.longitude]}
                    zoom={15}
                    scrollWheelZoom={false}
                    className="w-full h-48 rounded-lg"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[selectedReport.latitude, selectedReport.longitude]}>
                      <Popup>
                        {selectedReport.location}
                      </Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <div className="mt-2 h-48 bg-surface-variant rounded-lg flex items-center justify-center">
                    <p className="text-on-surface-variant">No map coordinates available</p>
                  </div>
                )}
              </div>


              {/* Reporter Information */}
              {!selectedReport.is_anonymous && selectedReport.user_name && (
                <div>
                  <h4 className="font-medium text-on-surface mb-3">Reporter Information</h4>
                  <div className="bg-surface-variant rounded-lg p-4">
                    <div className="text-sm">
                      <div className="mb-2">
                        <span className="text-on-surface-variant">Name:</span>
                        <span className="text-on-surface ml-2">{selectedReport.user_name}</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant">Report Type:</span>
                        <span className="text-on-surface ml-2">
                          {selectedReport.is_anonymous ? 'Anonymous' : 'Identified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Media Files */}
              {selectedReport.media && selectedReport.media.length > 0 && (
              <div>
                <h4 className="font-medium text-on-surface mb-3">Attached Media</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedReport.media.map(media => (
                    <div key={media.id} className="bg-surface-variant rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="h-4 w-4 text-on-surface-variant" />
                        <span className="text-sm font-medium text-on-surface capitalize">
                          {media.media_type}
                        </span>
                      </div>

                      {/* If media is a photo, show thumbnail */}
                      {media.media_type === "photo" && media.file && (
                        <img
                          src={media.file}
                          alt={media.caption || "Media file"}
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                      )}
                      {media.media_type === "video" && media.file && (
                        <video
                          src={media.file}
                          controls
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                      )}
                      {media.media_type === "audio" && media.file && (
                        <audio
                          src={media.file}
                          controls
                          className="w-full mb-2"
                        />
                      )}
                      <p className="text-xs text-on-surface-variant">{media.caption}</p>

                      {/* View File link */}
                      {media.file && (
                        <a
                          href={media.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary text-xs mt-2 hover:underline inline-block"
                        >
                          View File
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}


              {/* Status Updates */}
              {selectedReport.updates && selectedReport.updates.length > 0 && (
                <div>
                  <h4 className="font-medium text-on-surface mb-3">Status History</h4>
                  <div className="space-y-3">
                    {selectedReport.updates.map(update => (
                      <div key={update.id} className="flex items-start space-x-3 p-3 bg-surface-variant rounded-lg">
                        {getStatusIcon(update.status)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(update.status)}`}>
                              {update.status.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-on-surface-variant">
                              {formatTimeAgo(update.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-on-surface">{update.message}</p>
                          <p className="text-xs text-on-surface-variant mt-1">
                            By {update.created_by_name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showUpdateModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-outline">
              <h3 className="text-xl font-semibold text-on-surface">Update Report Status</h3>
              <p className="text-on-surface-variant mt-1">Update status for report #{selectedReport.id}</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  New Status
                </label>
                <select 
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="input-field w-full"
                >
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  New Priority
                </label>
                <select 
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="input-field w-full"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Update Message
                </label>
                <textarea
                  value={updateMessage}
                  onChange={(e) => setUpdateMessage(e.target.value)}
                  placeholder="Enter update message..."
                  rows="4"
                  className="input-field w-full resize-none"
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-outline flex space-x-3">
              <button
                onClick={() => {
                  setShowUpdateModal(false)
                  setUpdateMessage('')
                  setNewStatus('')
                }}
                className="flex-1 bg-surface-variant text-on-surface py-2 rounded-lg hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedReport.id, newStatus, updateMessage)}
                className="flex-1 btn-primary"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports