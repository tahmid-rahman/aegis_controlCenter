// src/pages/Responders.jsx
import React, { useState, useEffect } from 'react'
import { 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Shield, 
  Plus,
  Search,
  Filter,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Navigation,
  Loader,
  RefreshCw
} from 'lucide-react'
import api from '../services/api'
import AddResponderModal from '../components/AddResponderModal'

const Responders = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showAddResponder, setShowAddResponder] = useState(false)
  const [responders, setResponders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch responders from API
  const fetchResponders = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/auth/responders/')
      console.log(localStorage.getItem('token'))
      console.log('Responders data:', response.data)
      setResponders(response.data)
    } catch (err) {
      console.error('Error fetching responders:', err)
      setError('Failed to load responders')
      // Fallback to mock data if API fails
      setResponders(getMockData())
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Mock data fallback
  const getMockData = () => {
    return [
      {
        id: 1,
        name: 'Officer Ahmed Khan',
        responder_type: 'police',
        badge_number: 'PD-2456',
        phone: '+880 1712-345678',
        email: 'ahmed.khan@police.bd',
        location: 'Gulshan Police Station',
        status: 'available',
        last_active: new Date(Date.now() - 2 * 60000).toISOString(),
        assigned_emergency: null,
        rating: 4.8,
        total_cases: 42,
        specialization: ['Harassment', 'Robbery'],
        latitude: 23.7806,
        longitude: 90.4143
      },
      {
        id: 2,
        name: 'NGO Team Alpha',
        responder_type: 'ngo',
        badge_number: 'NGO-0123',
        phone: '+880 1812-345679',
        email: 'response@ngoteamalpha.org',
        location: 'Dhanmondi Office',
        status: 'busy',
        last_active: new Date(Date.now() - 5 * 60000).toISOString(),
        assigned_emergency: 'EMG-2024-0012',
        rating: 4.6,
        total_cases: 28,
        specialization: ['Women Safety', 'Legal Aid'],
        latitude: 23.7465,
        longitude: 90.3760
      }
    ]
  }

  // Refresh data
  const handleRefresh = () => {
    setRefreshing(true)
    fetchResponders()
  }

  // Create new responder
  const handleCreateResponder = async (responderData) => {
    try {
      // Prepare data for API
      const apiData = {
        ...responderData,
        user_type: 'agent',
        password: responderData.password,
        full_name: responderData.name,
        badge_number: responderData.badgeNumber,
        responder_type: responderData.type,
        specialization: responderData.specialization || [],
        agent_id: responderData.agentId,
      }

      const response = await api.post('/auth/register/', apiData)
      setResponders(prev => [response.data.user, ...prev])
      setShowAddResponder(false)
      return { success: true, message: 'Responder created successfully' }
    } catch (err) {
      console.error('Error creating responder:', err)
      const errorMessage = err.response?.data || 'Failed to create responder'
      return { success: false, message: errorMessage }
    }
  }


  // Format last active time
  const formatLastActive = (lastActive) => {
    if (!lastActive) return 'Never'
    
    const lastActiveDate = new Date(lastActive)
    const now = new Date()
    const diffMs = now - lastActiveDate
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    
    return lastActiveDate.toLocaleDateString()
  }

  // Filter responders based on search
  const filteredResponders = responders.filter(responder => {
    const matchesSearch = 
      responder.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      responder.badge_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      responder.agent_id?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || responder.status === statusFilter
    const matchesType = typeFilter === 'all' || responder.responder_type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  // Calculate stats
  const stats = {
    total: responders.length,
    available: responders.filter(r => r.status === 'available').length,
    busy: responders.filter(r => r.status === 'busy').length,
    offline: responders.filter(r => r.status === 'offline').length
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-green-500 bg-green-500/10'
      case 'busy': return 'text-orange-500 bg-orange-500/10'
      case 'offline': return 'text-gray-500 bg-gray-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'police': return 'text-blue-500 bg-blue-500/10'
      case 'ngo': return 'text-purple-500 bg-purple-500/10'
      case 'medical': return 'text-red-500 bg-red-500/10'
      case 'volunteer': return 'text-green-500 bg-green-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'police': return '👮'
      case 'ngo': return '🏢'
      case 'medical': return '🏥'
      case 'volunteer': return '👥'
      default: return '🛡️'
    }
  }

  // Load responders on component mount and when filters change
  useEffect(() => {
    fetchResponders()
  }, [statusFilter, typeFilter])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Emergency Responders</h1>
          <p className="text-on-surface-variant mt-1">
            Manage and coordinate emergency response teams
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button 
            onClick={() => setShowAddResponder(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Responder</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-500 text-sm">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Total Responders</p>
              <p className="text-2xl font-bold text-on-surface mt-1">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Available</p>
              <p className="text-2xl font-bold text-green-500 mt-1">{stats.available}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">On Duty</p>
              <p className="text-2xl font-bold text-orange-500 mt-1">{stats.busy}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Offline</p>
              <p className="text-2xl font-bold text-gray-500 mt-1">{stats.offline}</p>
            </div>
            <XCircle className="h-8 w-8 text-gray-500" />
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
                placeholder="Search responders by name, badge, or agent ID..."
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
              <option value="available">Available</option>
              <option value="busy">On Duty</option>
              <option value="offline">Offline</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="police">Police</option>
              <option value="ngo">NGO</option>
              <option value="medical">Medical</option>
              <option value="volunteer">Volunteer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Responders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredResponders.map(responder => (
          <div key={responder.id} className="card p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-xl">
                  {getTypeIcon(responder.responder_type)}
                </div>
                <div>
                  <h3 className="font-semibold text-on-surface">{responder.name}</h3>
                  <p className="text-sm text-on-surface-variant">
                    {responder.badge_number || responder.agent_id}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {/* <select
                  value={responder.status}
                  onChange={(e) => handleUpdateStatus(responder.id, e.target.value)}
                  className="text-xs border rounded p-1 bg-surface"
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </select> */}
                <button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Status and Type */}
            <div className="flex items-center space-x-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(responder.status)}`}>
                {responder.status}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(responder.responder_type)}`}>
                {responder.responder_type}
              </span>
              {responder.assigned_emergency && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                  Assigned: {responder.assigned_emergency}
                </span>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-on-surface-variant">
                <Phone className="h-4 w-4" />
                <span>{responder.phone || 'No phone'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-on-surface-variant">
                <Mail className="h-4 w-4" />
                <span className="truncate">{responder.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-on-surface-variant">
                <MapPin className="h-4 w-4" />
                <span>{responder.location || 'No location'}</span>
              </div>
            </div>

            {/* Specialization */}
            {responder.specialization && responder.specialization.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-on-surface mb-2">Specialization:</p>
                <div className="flex flex-wrap gap-1">
                  {responder.specialization.map((spec, index) => (
                    <span key={index} className="px-2 py-1 bg-surface-variant text-on-surface text-xs rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-on-surface-variant mb-4">
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4" />
                <span>Rating: {responder.rating || 'N/A'}/5</span>
              </div>
              <div className="flex items-center space-x-1">
                <AlertTriangle className="h-4 w-4" />
                <span>Cases: {responder.total_cases || 0}</span>
              </div>
            </div>

            {/* Last Active */}
            <div className="text-xs text-on-surface-variant mb-4">
              Last active: {formatLastActive(responder.last_active)}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => window.open(`tel:${responder.phone}`)}
                disabled={!responder.phone}
                className="flex-1 bg-surface-variant text-on-surface py-2 px-3 rounded-lg hover:bg-surface transition-colors text-sm font-medium flex items-center justify-center space-x-1 disabled:opacity-50"
              >
                <Phone className="h-4 w-4" />
                <span>Call</span>
              </button>
              <button className="flex-1 bg-surface-variant text-on-surface py-2 px-3 rounded-lg hover:bg-surface transition-colors text-sm font-medium flex items-center justify-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>Message</span>
              </button>
              <button className="flex-1 bg-surface-variant text-on-surface py-2 px-3 rounded-lg hover:bg-surface transition-colors text-sm font-medium flex items-center justify-center space-x-1">
                <Navigation className="h-4 w-4" />
                <span>Track</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredResponders.length === 0 && (
        <div className="card p-12 text-center">
          <Users className="h-16 w-16 text-on-surface-variant mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-on-surface mb-2">
            {responders.length === 0 ? 'No responders found' : 'No matching responders'}
          </h3>
          <p className="text-on-surface-variant mb-6">
            {responders.length === 0 
              ? 'Get started by adding your first emergency responder to the system.'
              : 'Try adjusting your search criteria to find what you\'re looking for.'
            }
          </p>
          {responders.length === 0 && (
            <button 
              onClick={() => setShowAddResponder(true)}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Responder</span>
            </button>
          )}
        </div>
      )}

      {/* Add Responder Modal */}
      <AddResponderModal
        isOpen={showAddResponder}
        onClose={() => setShowAddResponder(false)}
        onSubmit={handleCreateResponder}
      />
    </div>
  )
}

export default Responders