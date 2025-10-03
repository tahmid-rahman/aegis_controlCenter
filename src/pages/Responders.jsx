// src/pages/Responders.jsx
import React, { useState } from 'react'
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
  Navigation
} from 'lucide-react'

const Responders = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showAddResponder, setShowAddResponder] = useState(false)

  // Mock responder data
  const responders = [
    {
      id: 1,
      name: 'Officer Ahmed Khan',
      type: 'police',
      badgeNumber: 'PD-2456',
      phone: '+880 1712-345678',
      email: 'ahmed.khan@police.bd',
      location: 'Gulshan Police Station',
      status: 'available',
      lastActive: '2 minutes ago',
      assignedEmergency: null,
      rating: 4.8,
      totalCases: 42,
      specialization: ['Harassment', 'Robbery'],
      coordinates: { lat: 23.7806, lng: 90.4143 }
    },
    {
      id: 2,
      name: 'NGO Team Alpha',
      type: 'ngo',
      badgeNumber: 'NGO-0123',
      phone: '+880 1812-345679',
      email: 'response@ngoteamalpha.org',
      location: 'Dhanmondi Office',
      status: 'busy',
      lastActive: '5 minutes ago',
      assignedEmergency: 'EMG-2024-0012',
      rating: 4.6,
      totalCases: 28,
      specialization: ['Women Safety', 'Legal Aid'],
      coordinates: { lat: 23.7465, lng: 90.3760 }
    },
    {
      id: 3,
      name: 'Medical Unit 7',
      type: 'medical',
      badgeNumber: 'MED-0789',
      phone: '+880 1912-345680',
      email: 'unit7@medicalresponse.bd',
      location: 'Uttara Sector 7',
      status: 'available',
      lastActive: '1 minute ago',
      assignedEmergency: null,
      rating: 4.9,
      totalCases: 35,
      specialization: ['First Aid', 'Trauma Care'],
      coordinates: { lat: 23.8759, lng: 90.3795 }
    },
    {
      id: 4,
      name: 'Community Watch Group',
      type: 'volunteer',
      badgeNumber: 'VOL-4567',
      phone: '+880 1612-345681',
      email: 'watch@community.bd',
      location: 'Mirpur Section 10',
      status: 'offline',
      lastActive: '2 hours ago',
      assignedEmergency: null,
      rating: 4.4,
      totalCases: 15,
      specialization: ['Neighborhood Watch', 'Rapid Response'],
      coordinates: { lat: 23.8056, lng: 90.3685 }
    },
    {
      id: 5,
      name: 'Officer Fatima Begum',
      type: 'police',
      badgeNumber: 'PD-3891',
      phone: '+880 1712-345682',
      email: 'fatima.begum@police.bd',
      location: 'Banani Police Station',
      status: 'available',
      lastActive: 'Just now',
      assignedEmergency: null,
      rating: 4.7,
      totalCases: 38,
      specialization: ['Domestic Violence', 'Child Protection'],
      coordinates: { lat: 23.7940, lng: 90.4053 }
    }
  ]

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

  const filteredResponders = responders.filter(responder => {
    const matchesSearch = responder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         responder.badgeNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || responder.status === statusFilter
    const matchesType = typeFilter === 'all' || responder.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    total: responders.length,
    available: responders.filter(r => r.status === 'available').length,
    busy: responders.filter(r => r.status === 'busy').length,
    offline: responders.filter(r => r.status === 'offline').length
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
        <button 
          onClick={() => setShowAddResponder(true)}
          className="btn-primary mt-4 lg:mt-0 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Responder</span>
        </button>
      </div>

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
                placeholder="Search responders by name or badge..."
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
            
            <button className="btn-primary flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
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
                  {getTypeIcon(responder.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-on-surface">{responder.name}</h3>
                  <p className="text-sm text-on-surface-variant">{responder.badgeNumber}</p>
                </div>
              </div>
              <button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            {/* Status and Type */}
            <div className="flex items-center space-x-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(responder.status)}`}>
                {responder.status}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(responder.type)}`}>
                {responder.type}
              </span>
              {responder.assignedEmergency && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                  Assigned: {responder.assignedEmergency}
                </span>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-on-surface-variant">
                <Phone className="h-4 w-4" />
                <span>{responder.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-on-surface-variant">
                <Mail className="h-4 w-4" />
                <span className="truncate">{responder.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-on-surface-variant">
                <MapPin className="h-4 w-4" />
                <span>{responder.location}</span>
              </div>
            </div>

            {/* Specialization */}
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

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-on-surface-variant mb-4">
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4" />
                <span>Rating: {responder.rating}/5</span>
              </div>
              <div className="flex items-center space-x-1">
                <AlertTriangle className="h-4 w-4" />
                <span>Cases: {responder.totalCases}</span>
              </div>
            </div>

            {/* Last Active */}
            <div className="text-xs text-on-surface-variant mb-4">
              Last active: {responder.lastActive}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button className="flex-1 bg-surface-variant text-on-surface py-2 px-3 rounded-lg hover:bg-surface transition-colors text-sm font-medium flex items-center justify-center space-x-1">
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
          <h3 className="text-lg font-semibold text-on-surface mb-2">No responders found</h3>
          <p className="text-on-surface-variant mb-6">
            Try adjusting your search criteria or add new responders to the system.
          </p>
          <button 
            onClick={() => setShowAddResponder(true)}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Responder</span>
          </button>
        </div>
      )}

      {/* Add Responder Modal (Simplified) */}
      {showAddResponder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-on-surface mb-4">Add New Responder</h3>
            <p className="text-on-surface-variant mb-6">
              This would open a form to add new emergency responders to the system.
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowAddResponder(false)}
                className="flex-1 bg-surface-variant text-on-surface py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 btn-primary">
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Responders