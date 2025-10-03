// src/pages/Emergencies.jsx
import React, { useState } from 'react'
import { 
  AlertTriangle, 
  Search,
  Filter,
  Plus,
  MapPin,
  Clock,
  Phone,
  Navigation,
  User,
  Shield,
  MoreVertical,
  MessageCircle,
  CheckCircle,
  XCircle,
  Eye,
  Download
} from 'lucide-react'
import { useEmergencies } from '../contexts/EmergencyContext'

const Emergencies = () => {
  const { emergencies, dispatch } = useEmergencies()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedEmergency, setSelectedEmergency] = useState(null)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)

  // Mock responder data for assignment
  const availableResponders = [
    { id: 1, name: 'Officer Ahmed Khan', type: 'police', eta: '2 min', distance: '0.8 km' },
    { id: 2, name: 'NGO Team Alpha', type: 'ngo', eta: '5 min', distance: '2.1 km' },
    { id: 3, name: 'Medical Unit 7', type: 'medical', eta: '8 min', distance: '3.5 km' },
    { id: 4, name: 'Community Watch', type: 'volunteer', eta: '12 min', distance: '5.2 km' }
  ]

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
      case 'harassment': return '🚨'
      case 'robbery': return '💰'
      case 'stalking': return '👁️'
      case 'assault': return '👊'
      case 'domestic': return '🏠'
      case 'cyber': return '💻'
      default: return '⚠️'
    }
  }

  const filteredEmergencies = emergencies.filter(emergency => {
    const matchesSearch = emergency.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emergency.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || emergency.status === statusFilter
    const matchesType = typeFilter === 'all' || emergency.type === typeFilter
    const matchesPriority = priorityFilter === 'all' || emergency.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority
  })

  const stats = {
    total: emergencies.length,
    active: emergencies.filter(e => e.status === 'active').length,
    assigned: emergencies.filter(e => e.status === 'assigned').length,
    resolved: emergencies.filter(e => e.status === 'resolved' || e.status === 'completed').length
  }

  const handleAssignResponder = (emergencyId, responderId) => {
    // This would call API to assign responder
    dispatch({
      type: 'UPDATE_EMERGENCY',
      payload: {
        id: emergencyId,
        status: 'assigned',
        assignedResponder: responderId,
        assignedAt: new Date().toISOString()
      }
    })
    setShowAssignmentModal(false)
    setSelectedEmergency(null)
  }

  const handleUpdateStatus = (emergencyId, newStatus) => {
    dispatch({
      type: 'UPDATE_EMERGENCY',
      payload: {
        id: emergencyId,
        status: newStatus,
        ...(newStatus === 'completed' && { completedAt: new Date().toISOString() })
      }
    })
  }

  const handleViewDetails = (emergency) => {
    setSelectedEmergency(emergency)
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now - time) / (1000 * 60))
    
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
          <h1 className="text-3xl font-bold text-on-surface">Emergency Management</h1>
          <p className="text-on-surface-variant mt-1">
            Monitor and coordinate emergency response operations
          </p>
        </div>
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <button className="btn-primary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
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
                placeholder="Search by emergency ID or location..."
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
              <option value="harassment">Harassment</option>
              <option value="robbery">Robbery</option>
              <option value="stalking">Stalking</option>
              <option value="assault">Assault</option>
              <option value="domestic">Domestic</option>
              <option value="cyber">Cyber Crime</option>
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
            
            <button className="btn-primary flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Emergencies Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline">
                <th className="text-left py-4 px-6 text-sm font-medium text-on-surface-variant">Emergency</th>
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
                <tr key={emergency.id} className="hover:bg-surface-variant transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {getTypeIcon(emergency.type)}
                      </div>
                      <div>
                        <div className="font-medium text-on-surface">{emergency.id}</div>
                        <div className="text-sm text-on-surface-variant">
                          {emergency.victimInfo ? `${emergency.victimInfo.gender}, ${emergency.victimInfo.age}` : 'Anonymous'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="capitalize text-on-surface">{emergency.type}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-on-surface-variant" />
                      <span className="text-on-surface">{emergency.location}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(emergency.priority)}`}>
                      {emergency.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(emergency.status)}`}>
                      {emergency.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-on-surface-variant">
                      {formatTimeAgo(emergency.createdAt)}
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
                      <button
                        onClick={() => setShowAssignmentModal(true)}
                        className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface rounded-lg transition-colors"
                        title="Assign Responder"
                      >
                        <User className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredEmergencies.length === 0 && (
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

      {/* Emergency Details Modal */}
      {selectedEmergency && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-outline">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-on-surface">Emergency Details</h3>
                <button
                  onClick={() => setSelectedEmergency(null)}
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
                  <h4 className="font-medium text-on-surface mb-3">Emergency Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Emergency ID:</span>
                      <span className="text-on-surface font-medium">{selectedEmergency.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Type:</span>
                      <span className="text-on-surface capitalize">{selectedEmergency.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Priority:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedEmergency.priority)}`}>
                        {selectedEmergency.priority}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEmergency.status)}`}>
                        {selectedEmergency.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-on-surface mb-3">Location & Time</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Location:</span>
                      <span className="text-on-surface text-right">{selectedEmergency.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Reported:</span>
                      <span className="text-on-surface">{formatTimeAgo(selectedEmergency.createdAt)}</span>
                    </div>
                    {selectedEmergency.assignedAt && (
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Assigned:</span>
                        <span className="text-on-surface">{formatTimeAgo(selectedEmergency.assignedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Victim Information */}
              {selectedEmergency.victimInfo && (
                <div>
                  <h4 className="font-medium text-on-surface mb-3">Victim Information</h4>
                  <div className="bg-surface-variant rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-on-surface-variant">Gender:</span>
                        <span className="text-on-surface ml-2">{selectedEmergency.victimInfo.gender}</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant">Age:</span>
                        <span className="text-on-surface ml-2">{selectedEmergency.victimInfo.age}</span>
                      </div>
                      {selectedEmergency.victimInfo.phone && (
                        <div className="col-span-2">
                          <span className="text-on-surface-variant">Phone:</span>
                          <span className="text-on-surface ml-2">{selectedEmergency.victimInfo.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button className="flex-1 btn-primary flex items-center justify-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Call Victim</span>
                </button>
                <button className="flex-1 bg-surface-variant text-on-surface py-2 rounded-lg hover:bg-surface transition-colors flex items-center justify-center space-x-2">
                  <Navigation className="h-4 w-4" />
                  <span>View on Map</span>
                </button>
                <button className="flex-1 bg-surface-variant text-on-surface py-2 rounded-lg hover:bg-surface transition-colors flex items-center justify-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Send Update</span>
                </button>
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
              <h3 className="text-xl font-semibold text-on-surface">Assign Responder</h3>
              <p className="text-on-surface-variant mt-1">Select a responder for this emergency</p>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {availableResponders.map(responder => (
                  <div
                    key={responder.id}
                    className="flex items-center justify-between p-3 bg-surface-variant rounded-lg hover:bg-surface transition-colors cursor-pointer"
                    onClick={() => handleAssignResponder(selectedEmergency?.id, responder.id)}
                  >
                    <div>
                      <div className="font-medium text-on-surface">{responder.name}</div>
                      <div className="text-sm text-on-surface-variant capitalize">{responder.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-on-surface">{responder.eta}</div>
                      <div className="text-xs text-on-surface-variant">{responder.distance}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-outline">
              <button
                onClick={() => setShowAssignmentModal(false)}
                className="w-full bg-surface-variant text-on-surface py-2 rounded-lg hover:bg-surface transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Emergencies