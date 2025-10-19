// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { 
  AlertTriangle, 
  Users, 
  Clock, 
  CheckCircle, 
  MapPin, 
  TrendingUp,
  MoreVertical,
  Phone,
  Navigation
} from 'lucide-react'
import { useEmergencies } from '../contexts/EmergencyContext'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { emergencies } = useEmergencies()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await api.get('aegis/dashboard-details/')
      if (response.data.success) {
        setDashboardData(response.data.data)
      } else {
        throw new Error(response.data.message || 'Failed to fetch dashboard data')
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics from API data
  const activeEmergencies = dashboardData?.active_alerts?.list || []
  const availableResponders = dashboardData?.agent_statistics?.agents_list || []
  const completionRate = dashboardData?.completion_analysis?.completion_rate ? 
    `${dashboardData.completion_analysis.completion_rate}%` : '0%'
  const avgResponseTime = dashboardData?.response_time_analysis?.avg_response_minutes ? 
    `${Math.round(dashboardData.response_time_analysis.avg_response_minutes)} min` : 'N/A'
  
  const completedToday = dashboardData?.completion_analysis?.todays_alerts || 0

  // Transform hotspot areas from API data
  const hotspotAreas = dashboardData?.location_analysis?.top_locations_detail?.map(location => ({
    area: location.address.split(',')[0], // Get first part of address
    incidents: location.summary.total_alerts,
    trend: location.summary.active_alerts > 0 ? 'up' : 'stable'
  })) || []

  // Transform emergencies data for the component
  const transformedEmergencies = activeEmergencies.map(alert => ({
    id: alert.alert_id,
    type: alert.emergency_type,
    priority: alert.severity_level,
    status: alert.status,
    location: alert.initial_address,
    createdAt: alert.activated_at,
    user: {
      name: alert.user__full_name,
      email: alert.user__email
    }
  }))

  // Transform responders data for the component
  const transformedResponders = availableResponders.map(agent => ({
    id: agent.id,
    name: agent.full_name,
    type: agent.responder_type,
    status: agent.status,
    location: 'Location not provided', // API doesn't provide location
    eta: 'N/A', // API doesn't provide ETA
    badgeNumber: agent.badge_number,
    rating: agent.rating
  }))

  const getEmergencyIcon = (type) => {
    switch (type) {
      case 'harassment': return '🚨'
      case 'robbery': return '💰'
      case 'stalking': return '👁️'
      case 'assault': return '👊'
      case 'general': return '⚠️'
      default: return '⚠️'
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-red-500 bg-red-500/10'
      case 'assigned': return 'text-orange-500 bg-orange-500/10'
      case 'resolved': return 'text-green-500 bg-green-500/10'
      case 'cancelled': return 'text-gray-500 bg-gray-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-on-surface-variant">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-on-surface mb-2">Error loading dashboard</h2>
          <p className="text-on-surface-variant mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Control Center Dashboard</h1>
          <p className="text-on-surface-variant mt-1">
            Real-time emergency monitoring and response coordination
          </p>
        </div>
        <div className="mt-2 lg:mt-0 text-sm text-on-surface-variant">
          Last updated: {currentTime.toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Emergencies */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Active Emergencies</p>
              <p className="text-3xl font-bold text-on-surface mt-2">
                {dashboardData?.quick_stats?.total_active_alerts || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-on-surface-variant">
              {dashboardData?.active_alerts?.high_severity_active_count || 0} high severity
            </span>
          </div>
        </div>

        {/* Available Responders */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Available Responders</p>
              <p className="text-3xl font-bold text-on-surface mt-2">
                {dashboardData?.quick_stats?.available_agents || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="mt-4 text-sm text-on-surface-variant">
            Total: {dashboardData?.quick_stats?.total_agents || 0} units
          </div>
        </div>

        {/* Avg Response Time */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Avg Response Time</p>
              <p className="text-3xl font-bold text-on-surface mt-2">{avgResponseTime}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 text-sm text-on-surface-variant">
            Based on {dashboardData?.response_time_analysis?.alerts_with_time_data || 0} alerts
          </div>
        </div>

        {/* Completion Rate */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Completion Rate</p>
              <p className="text-3xl font-bold text-on-surface mt-2">{completionRate}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <div className="mt-4 text-sm text-on-surface-variant">
            {completedToday} alerts today
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Active Emergencies List */}
        <div className="xl:col-span-2 space-y-6">
          {/* Active Emergencies */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-on-surface">Active Emergencies</h2>
              <Link to="/emergencies" className="text-primary hover:text-primary/80 text-sm font-medium">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {transformedEmergencies.length > 0 ? (
                transformedEmergencies.map(emergency => (
                  <div key={emergency.id} className="flex items-center justify-between p-4 bg-surface-variant rounded-lg border-l-4 border-red-500">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">
                        {getEmergencyIcon(emergency.type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-on-surface">#{emergency.id}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(emergency.priority || 'medium')}`}>
                            {emergency.priority || 'medium'}
                          </span>
                        </div>
                        <p className="text-sm text-on-surface-variant mt-1">
                          {emergency.user.name} • {emergency.type} • {emergency.location}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-on-surface-variant">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(emergency.createdAt).toLocaleTimeString()}
                          </span>
                          <span className={`px-2 py-1 rounded-full ${getStatusColor(emergency.status)}`}>
                            {emergency.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* <div className="flex items-center space-x-2">
                      <button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface rounded-lg transition-colors">
                        <Phone className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface rounded-lg transition-colors">
                        <Navigation className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div> */}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-on-surface-variant mx-auto mb-4" />
                  <p className="text-on-surface-variant">No active emergencies</p>
                  <p className="text-sm text-on-surface-variant mt-1">All clear for now</p>
                </div>
              )}
            </div>
          </div>

          {/* Hotspot Areas */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-on-surface mb-6">Incident Hotspots</h2>
            <div className="space-y-4">
              {hotspotAreas.map((area, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-surface-variant rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-on-surface">{area.area}</h3>
                      <p className="text-sm text-on-surface-variant">{area.incidents} total incidents</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    area.trend === 'up' ? 'bg-red-500/10 text-red-500' :
                    area.trend === 'down' ? 'bg-green-500/10 text-green-500' :
                    'bg-gray-500/10 text-gray-500'
                  }`}>
                    {area.trend === 'up' ? '↑ Active' : '→ Stable'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Available Responders */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-on-surface">Available Responders</h2>
              <Link to="/responders"className="text-primary hover:text-primary/80 text-sm font-medium">
                Manage
              </Link>
            </div>
            
            <div className="space-y-4">
              {transformedResponders.map(responder => (
                <div key={responder.id} className="p-3 bg-surface-variant rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-on-surface">{responder.name}</h3>
                      <p className="text-sm text-on-surface-variant">
                        {responder.type} • {responder.badgeNumber}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      responder.status === 'available' 
                        ? 'bg-green-500/10 text-green-500' 
                        : 'bg-orange-500/10 text-orange-500'
                    }`}>
                      {responder.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-on-surface-variant">
                    <span>Rating: {responder.rating || 'N/A'}</span>
                    <span>Cases: {responder.totalCases || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          {/* <div className="card p-6">
            <h2 className="text-xl font-semibold text-on-surface mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors group">
                <Users className="h-6 w-6 text-primary mb-2" />
                <p className="text-sm font-medium text-on-surface">Assign Responder</p>
              </button>
              <button className="p-4 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-colors group">
                <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                <p className="text-sm font-medium text-on-surface">Resolve Case</p>
              </button>
              <button className="p-4 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors group">
                <MapPin className="h-6 w-6 text-blue-500 mb-2" />
                <p className="text-sm font-medium text-on-surface">View Map</p>
              </button>
              <button className="p-4 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-colors group">
                <TrendingUp className="h-6 w-6 text-purple-500 mb-2" />
                <p className="text-sm font-medium text-on-surface">Reports</p>
              </button>
            </div>
          </div> */}

          {/* System Status */}
          {/* <div className="card p-6">
            <h2 className="text-xl font-semibold text-on-surface mb-4">System Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Emergency Alerts</span>
                <span className="text-green-500 font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">GPS Tracking</span>
                <span className="text-green-500 font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Responder Network</span>
                <span className="text-green-500 font-medium">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Database</span>
                <span className="text-green-500 font-medium">Synced</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Dashboard