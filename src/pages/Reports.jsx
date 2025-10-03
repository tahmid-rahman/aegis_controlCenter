// src/pages/Reports.jsx
import React, { useState } from 'react'
import { 
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  MessageSquare,
  MapPin,
  Calendar,
  User,
  Shield,
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  BarChart3,
  TrendingUp
} from 'lucide-react'

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [selectedReport, setSelectedReport] = useState(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [updateMessage, setUpdateMessage] = useState('')

  // Mock incident reports data based on your Django model
  const incidentReports = [
    {
      id: 1,
      incident_type: 'harassment',
      title: 'Verbal harassment near Gulshan market',
      description: 'I was walking home from work when a group of men started making inappropriate comments and following me. I had to run into a nearby shop for safety.',
      location: 'Gulshan 2, near Aarong, Dhaka',
      incident_date: '2024-01-15T18:30:00Z',
      latitude: 23.7806,
      longitude: 90.4143,
      is_anonymous: false,
      status: 'under_review',
      priority: 'high',
      created_at: '2024-01-15T19:00:00Z',
      updated_at: '2024-01-15T19:30:00Z',
      user: {
        id: 101,
        name: 'Fatima Begum',
        phone: '+880 1712-345678',
        email: 'fatima@example.com'
      },
      media: [
        { id: 1, media_type: 'photo', file: 'photo1.jpg', caption: 'Location photo' }
      ],
      updates: [
        {
          id: 1,
          status: 'under_review',
          message: 'Report has been received and is under review by our team.',
          created_by: 'Control Center Admin',
          created_at: '2024-01-15T19:15:00Z'
        }
      ]
    },
    {
      id: 2,
      incident_type: 'robbery',
      title: 'Phone snatched in Dhanmondi',
      description: 'Two men on a motorcycle snatched my phone while I was talking near Dhanmondi Lake. They were wearing black helmets.',
      location: 'Dhanmondi Lake Road, Dhaka',
      incident_date: '2024-01-14T20:15:00Z',
      latitude: 23.7465,
      longitude: 90.3760,
      is_anonymous: true,
      status: 'submitted',
      priority: 'urgent',
      created_at: '2024-01-14T20:30:00Z',
      updated_at: '2024-01-14T20:30:00Z',
      user: null, // Anonymous report
      media: [],
      updates: []
    },
    {
      id: 3,
      incident_type: 'stalking',
      title: 'Being followed for several days',
      description: 'I have noticed the same person following me from my workplace to home for the past three days. They maintain distance but always seem to be there.',
      location: 'Banani Road 11, Dhaka',
      incident_date: '2024-01-13T17:45:00Z',
      latitude: 23.7940,
      longitude: 90.4053,
      is_anonymous: false,
      status: 'resolved',
      priority: 'medium',
      created_at: '2024-01-13T18:00:00Z',
      updated_at: '2024-01-14T10:00:00Z',
      user: {
        id: 102,
        name: 'Ayesha Rahman',
        phone: '+880 1812-345679',
        email: 'ayesha@example.com'
      },
      media: [
        { id: 2, media_type: 'photo', file: 'stalker.jpg', caption: 'Person following me' },
        { id: 3, media_type: 'audio', file: 'recording.mp3', caption: 'Voice recording' }
      ],
      updates: [
        {
          id: 2,
          status: 'under_review',
          message: 'Report received and being investigated.',
          created_by: 'Control Center Admin',
          created_at: '2024-01-13T18:30:00Z'
        },
        {
          id: 3,
          status: 'resolved',
          message: 'Local police have been notified and are monitoring the area. Victim has been provided with safety guidelines.',
          created_by: 'Officer Khan',
          created_at: '2024-01-14T10:00:00Z'
        }
      ]
    },
    {
      id: 4,
      incident_type: 'assault',
      title: 'Physical assault in public transport',
      description: 'I was physically assaulted by a fellow passenger on the bus when I objected to inappropriate touching.',
      location: 'Mirpur to Uttara bus route',
      incident_date: '2024-01-12T08:20:00Z',
      latitude: 23.8056,
      longitude: 90.3685,
      is_anonymous: false,
      status: 'dismissed',
      priority: 'high',
      created_at: '2024-01-12T08:45:00Z',
      updated_at: '2024-01-12T14:00:00Z',
      user: {
        id: 103,
        name: 'Rahima Akter',
        phone: '+880 1912-345680',
        email: 'rahima@example.com'
      },
      media: [],
      updates: [
        {
          id: 4,
          status: 'dismissed',
          message: 'Insufficient evidence to proceed with investigation. Victim advised to contact local police station directly.',
          created_by: 'Control Center Admin',
          created_at: '2024-01-12T14:00:00Z'
        }
      ]
    }
  ]

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

  // Statistics
  const stats = {
    total: incidentReports.length,
    submitted: incidentReports.filter(r => r.status === 'submitted').length,
    under_review: incidentReports.filter(r => r.status === 'under_review').length,
    resolved: incidentReports.filter(r => r.status === 'resolved').length,
    dismissed: incidentReports.filter(r => r.status === 'dismissed').length
  }

  const typeDistribution = {
    harassment: incidentReports.filter(r => r.incident_type === 'harassment').length,
    robbery: incidentReports.filter(r => r.incident_type === 'robbery').length,
    stalking: incidentReports.filter(r => r.incident_type === 'stalking').length,
    assault: incidentReports.filter(r => r.incident_type === 'assault').length,
    theft: incidentReports.filter(r => r.incident_type === 'theft').length,
    vandalism: incidentReports.filter(r => r.incident_type === 'vandalism').length,
    other: incidentReports.filter(r => r.incident_type === 'other').length
  }

  const handleUpdateStatus = (reportId, newStatus, message) => {
    // This would call API to update status
    console.log(`Updating report ${reportId} to ${newStatus}: ${message}`)
    setShowUpdateModal(false)
    setUpdateMessage('')
    setSelectedReport(null)
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
          <button className="btn-primary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Reports</span>
          </button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Total Reports</p>
              <p className="text-2xl font-bold text-on-surface mt-1">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Submitted</p>
              <p className="text-2xl font-bold text-blue-500 mt-1">{stats.submitted}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Under Review</p>
              <p className="text-2xl font-bold text-orange-500 mt-1">{stats.under_review}</p>
            </div>
            <Eye className="h-8 w-8 text-orange-500" />
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
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Dismissed</p>
              <p className="text-2xl font-bold text-gray-500 mt-1">{stats.dismissed}</p>
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
            {Object.entries(typeDistribution).map(([type, count]) => (
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
            <span>Weekly Trend</span>
          </h3>
          <div className="text-center py-8">
            <p className="text-on-surface-variant">Reports trend visualization</p>
            <p className="text-sm text-on-surface-variant mt-2">(Chart would be integrated here)</p>
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
            
            <button className="btn-primary flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
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
                      <span>{report.is_anonymous ? 'Anonymous' : report.user.name}</span>
                    </div>
                    {report.media.length > 0 && (
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
                    setShowUpdateModal(true)
                  }}
                  className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors"
                  title="Update Status"
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
                <button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Latest Update */}
            {report.updates.length > 0 && (
              <div className="border-t border-outline pt-4">
                <div className="flex items-start space-x-3">
                  {getStatusIcon(report.status)}
                  <div className="flex-1">
                    <p className="text-sm text-on-surface">
                      {report.updates[report.updates.length - 1].message}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      By {report.updates[report.updates.length - 1].created_by} • {formatTimeAgo(report.updates[report.updates.length - 1].created_at)}
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
                <div className="flex items-center space-x-2 text-on-surface">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedReport.location}</span>
                </div>
                {selectedReport.latitude && selectedReport.longitude && (
                  <div className="mt-2 h-48 bg-surface-variant rounded-lg flex items-center justify-center">
                    <p className="text-on-surface-variant">Map would be displayed here</p>
                  </div>
                )}
              </div>

              {/* Reporter Information */}
              {!selectedReport.is_anonymous && selectedReport.user && (
                <div>
                  <h4 className="font-medium text-on-surface mb-3">Reporter Information</h4>
                  <div className="bg-surface-variant rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-on-surface-variant">Name:</span>
                        <span className="text-on-surface ml-2">{selectedReport.user.name}</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant">Phone:</span>
                        <span className="text-on-surface ml-2">{selectedReport.user.phone}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-on-surface-variant">Email:</span>
                        <span className="text-on-surface ml-2">{selectedReport.user.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Media Files */}
              {selectedReport.media.length > 0 && (
                <div>
                  <h4 className="font-medium text-on-surface mb-3">Attached Media</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {selectedReport.media.map(media => (
                      <div key={media.id} className="bg-surface-variant rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="h-4 w-4 text-on-surface-variant" />
                          <span className="text-sm font-medium text-on-surface capitalize">{media.media_type}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant">{media.caption}</p>
                        <button className="text-primary text-xs mt-2 hover:underline">
                          View File
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Updates */}
              {selectedReport.updates.length > 0 && (
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
                            By {update.created_by}
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
                <select className="input-field w-full">
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
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
                }}
                className="flex-1 bg-surface-variant text-on-surface py-2 rounded-lg hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedReport.id, 'under_review', updateMessage)}
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