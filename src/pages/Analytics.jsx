// src/pages/Analytics.jsx
import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  PieChart,
  TrendingUp,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  Filter,
  Calendar,
  Download,
  Eye,
  RefreshCw,
  Target,
  Activity,
  Shield,
  TrendingDown
} from 'lucide-react'
import { useEmergencies } from '../contexts/EmergencyContext'
import api from '../services/api'

const Analytics = () => {
  const { emergencies } = useEmergencies()
  const [timeRange, setTimeRange] = useState('30d')
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [analyticsData, setAnalyticsData] = useState(null)
  const [error, setError] = useState(null)

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.get('aegis/dashboard-analytics/')
      if (response.data.success) {
        setAnalyticsData(response.data.data)
      } else {
        throw new Error(response.data.message || 'Failed to fetch analytics data')
      }
    } catch (err) {
      setError(err.message || 'Failed to load analytics data')
      console.error('Error fetching analytics data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  // Auto-refresh
  useEffect(() => {
    let interval
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchAnalyticsData()
      }, 30000) // Refresh every 30 seconds
    }
    return () => clearInterval(interval)
  }, [autoRefresh])

  const refreshData = () => {
    fetchAnalyticsData()
  }

  // Transform API data to match component structure
  const transformAnalyticsData = (data) => {
    if (!data) return null

    return {
      overview: {
        totalIncidents: data.overview?.totalIncidents || 0,
        activeNow: data.overview?.activeNow || 0,
        avgResponseTime: data.overview?.avgResponseTime || 'N/A',
        resolutionRate: data.overview?.resolutionRate || '0%',
        trend: data.overview?.trend || '0%',
        peakHours: data.overview?.peakHours || [],
        responseTimeTrend: data.overview?.responseTimeTrend || '0min',
        resolutionTrend: data.overview?.resolutionTrend || '0%'
      },
      trends: {
        daily: data.trends?.daily || [],
        weekly: data.trends?.weekly || [],
        monthly: data.trends?.monthly || [],
        hourly: data.trends?.hourly || [],
        types: data.trends?.incidentTypes || {}
      },
      geographic: {
        hotspots: data.geographic?.hotspots?.map(hotspot => ({
          area: hotspot.area,
          incidents: hotspot.incidents,
          trend: hotspot.trend,
          density: hotspot.density,
          highSeverityCount: hotspot.high_severity_count,
          activeCount: hotspot.active_count
        })) || [],
        coverage: data.geographic?.coverage || '0%',
        newAreas: data.geographic?.newAreas || 0,
        totalLocations: data.geographic?.totalLocations || 0
      },
      performance: {
        responders: data.performance?.responders?.map(responder => ({
          name: responder.name,
          type: responder.type,
          efficiency: responder.efficiency,
          avgTime: responder.avgTime,
          cases: responder.cases,
          rating: responder.rating,
          totalLifetimeCases: responder.totalLifetimeCases
        })) || [],
        overallEfficiency: data.performance?.overallEfficiency || '0%',
        totalResponders: data.performance?.totalResponders || 0,
        avgResponderRating: data.performance?.avgResponderRating || 0,
        improvement: data.performance?.improvement || '0%'
      },
      userMetrics: {
        activeUsers: data.userMetrics?.activeUsers || 0,
        safetyComplianceRate: data.userMetrics?.safetyComplianceRate || '0%',
        totalSafetyChecks: data.userMetrics?.totalSafetyChecks || 0
      },
      predictions: {
        nextWeek: data.predictions?.nextWeek || 0,
        riskAreas: data.predictions?.riskAreas || [],
        seasonalTrend: data.predictions?.seasonalTrend || 'stable',
        confidence: data.predictions?.confidence || '0%'
      },
      metadata: data.metadata || {}
    }
  }

  const transformedData = transformAnalyticsData(analyticsData)

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      trend === 'down' ? 
      <TrendingDown className="h-4 w-4 text-red-500" /> :
      <span className="w-4 h-4 text-yellow-500">→</span>
  }

  const getDensityColor = (density) => {
    switch (density) {
      case 'high': return 'text-red-500 bg-red-500/10'
      case 'medium': return 'text-orange-500 bg-orange-500/10'
      case 'low': return 'text-green-500 bg-green-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  // Map component for geographic visualization
  const MapVisualization = ({ hotspots }) => {
    const getAreaColor = (density) => {
      switch (density) {
        case 'high': return '#DC2626'
        case 'medium': return '#EA580C'
        case 'low': return '#16A34A'
        default: return '#6B7280'
      }
    }

    const getAreaSize = (incidents) => {
      if (incidents > 30) return 'w-16 h-16'
      if (incidents > 20) return 'w-12 h-12'
      if (incidents > 10) return 'w-10 h-10'
      if (incidents > 5) return 'w-8 h-8'
      return 'w-6 h-6'
    }

    return (
      <div className="relative bg-surface-variant rounded-lg h-64 overflow-hidden">
        {/* Simplified Dhaka map representation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-64 h-48 bg-blue-50 rounded-lg border-2 border-blue-200">
            {/* Mirpur Area */}
            {hotspots.find(h => h.area.includes('Mirpur')) && (
              <div 
                className={`absolute left-4 top-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${getAreaSize(hotspots.find(h => h.area.includes('Mirpur')).incidents)}`}
                style={{ 
                  backgroundColor: getAreaColor(hotspots.find(h => h.area.includes('Mirpur')).density)
                }}
                title={`Mirpur: ${hotspots.find(h => h.area.includes('Mirpur')).incidents} incidents`}
              >
                <span className="text-white text-xs font-bold">M</span>
              </div>
            )}
            
            {/* Gulshan Area */}
            {hotspots.find(h => h.area.includes('Gulshan')) && (
              <div 
                className={`absolute right-12 top-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${getAreaSize(hotspots.find(h => h.area.includes('Gulshan')).incidents)}`}
                style={{ 
                  backgroundColor: getAreaColor(hotspots.find(h => h.area.includes('Gulshan')).density)
                }}
                title={`Gulshan: ${hotspots.find(h => h.area.includes('Gulshan')).incidents} incidents`}
              >
                <span className="text-white text-xs font-bold">G</span>
              </div>
            )}
            
            {/* Dhanmondi Area */}
            {hotspots.find(h => h.area.includes('Dhanmondi')) && (
              <div 
                className={`absolute left-16 top-20 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${getAreaSize(hotspots.find(h => h.area.includes('Dhanmondi')).incidents)}`}
                style={{ 
                  backgroundColor: getAreaColor(hotspots.find(h => h.area.includes('Dhanmondi')).density)
                }}
                title={`Dhanmondi: ${hotspots.find(h => h.area.includes('Dhanmondi')).incidents} incidents`}
              >
                <span className="text-white text-xs font-bold">D</span>
              </div>
            )}
            
            {/* Uttara Area */}
            {hotspots.find(h => h.area.includes('Uttara')) && (
              <div 
                className={`absolute right-8 bottom-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${getAreaSize(hotspots.find(h => h.area.includes('Uttara')).incidents)}`}
                style={{ 
                  backgroundColor: getAreaColor(hotspots.find(h => h.area.includes('Uttara')).density)
                }}
                title={`Uttara: ${hotspots.find(h => h.area.includes('Uttara')).incidents} incidents`}
              >
                <span className="text-white text-xs font-bold">U</span>
              </div>
            )}
            
            {/* Generic hotspots for other areas */}
            {hotspots.filter(h => !['Mirpur', 'Gulshan', 'Dhanmondi', 'Uttara'].some(area => h.area.includes(area))).map((hotspot, index) => (
              <div 
                key={index}
                className={`absolute rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${getAreaSize(hotspot.incidents)}`}
                style={{ 
                  backgroundColor: getAreaColor(hotspot.density),
                  left: `${20 + (index * 15)}%`,
                  top: `${30 + (index * 10)}%`
                }}
                title={`${hotspot.area}: ${hotspot.incidents} incidents`}
              >
                <span className="text-white text-xs font-bold">H</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="text-xs font-semibold text-gray-700 mb-2">Incident Density</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-600">High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Low</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Total Incidents</p>
              <p className="text-3xl font-bold text-on-surface mt-2">{transformedData?.overview.totalIncidents || 0}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-primary" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            {getTrendIcon(transformedData?.overview.trend.includes('+') ? 'up' : 'stable')}
            <span className={transformedData?.overview.trend.includes('+') ? 'text-green-500' : 'text-yellow-500'}>
              {transformedData?.overview.trend} this month
            </span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Active Now</p>
              <p className="text-3xl font-bold text-red-500 mt-2">{transformedData?.overview.activeNow || 0}</p>
            </div>
            <Activity className="h-8 w-8 text-red-500" />
          </div>
          <div className="mt-4 text-sm text-on-surface-variant">
            Real-time monitoring
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Avg Response Time</p>
              <p className="text-3xl font-bold text-on-surface mt-2">{transformedData?.overview.avgResponseTime || 'N/A'}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-4 text-sm text-on-surface-variant">
            {transformedData?.overview.responseTimeTrend || '0min'} from last month
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Resolution Rate</p>
              <p className="text-3xl font-bold text-green-500 mt-2">{transformedData?.overview.resolutionRate || '0%'}</p>
            </div>
            <Target className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-4 text-sm text-on-surface-variant">
            {transformedData?.overview.resolutionTrend || '0%'} improvement
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Trends */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-on-surface mb-4">Daily Incident Trends</h3>
          <div className="space-y-3">
            {(transformedData?.trends.daily.slice(-7) || []).map((count, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-on-surface-variant text-sm">Day {index + 1}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-surface-variant rounded-full h-3">
                    <div 
                      className="bg-primary rounded-full h-3"
                      style={{ width: `${(count / Math.max(...transformedData?.trends.daily.slice(-7) || [1])) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-on-surface text-sm font-medium w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Types */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-on-surface mb-4">Incident Type Distribution</h3>
          <div className="space-y-4">
            {Object.entries(transformedData?.trends.types || {}).map(([type, data]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    type === 'harassment' ? 'bg-red-500' :
                    type === 'robbery' ? 'bg-orange-500' :
                    type === 'stalking' ? 'bg-yellow-500' :
                    type === 'assault' ? 'bg-purple-500' :
                    type === 'domestic' ? 'bg-pink-500' :
                    type === 'cyber' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-on-surface capitalize">{type}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-on-surface font-medium">{data.count}</span>
                  <span className="text-on-surface-variant text-sm">{data.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peak Hours */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-4">Peak Activity Hours</h3>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
          {(transformedData?.trends.hourly || []).map((count, hour) => (
            <div key={hour} className="text-center">
              <div className="text-xs text-on-surface-variant mb-1">{hour}:00</div>
              <div 
                className="bg-primary rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                style={{ 
                  height: `${(count / Math.max(...transformedData?.trends.hourly || [1])) * 60}px`,
                  backgroundColor: transformedData?.overview.peakHours?.includes(`${hour}:00`) ? '#DC2626' : '#6750A4'
                }}
                title={`${count} incidents at ${hour}:00`}
              ></div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-on-surface-variant text-center">
          Peak hours: {(transformedData?.overview.peakHours || []).join(' - ')}
        </div>
      </div>
    </div>
  )

  const renderGeographic = () => (
    <div className="space-y-6">
      {/* Hotspot Areas */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-4">Geographic Hotspots</h3>
        <div className="space-y-4">
          {(transformedData?.geographic.hotspots || []).map((area, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-surface-variant rounded-lg">
              <div className="flex items-center space-x-4">
                <MapPin className="h-5 w-5 text-on-surface-variant" />
                <div>
                  <div className="font-medium text-on-surface">{area.area}</div>
                  <div className="text-sm text-on-surface-variant">
                    {area.incidents} incidents • {area.activeCount || 0} active
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDensityColor(area.density)}`}>
                  {area.density} density
                </span>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(area.trend)}
                  <span className="text-sm text-on-surface-variant capitalize">{area.trend}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3 bg-surface-variant rounded-lg">
            <div className="text-on-surface-variant">Coverage Area</div>
            <div className="text-2xl font-bold text-green-500 mt-1">{transformedData?.geographic.coverage || '0%'}</div>
          </div>
          <div className="text-center p-3 bg-surface-variant rounded-lg">
            <div className="text-on-surface-variant">Total Locations</div>
            <div className="text-2xl font-bold text-blue-500 mt-1">{transformedData?.geographic.totalLocations || 0}</div>
          </div>
          <div className="text-center p-3 bg-surface-variant rounded-lg">
            <div className="text-on-surface-variant">New Areas</div>
            <div className="text-2xl font-bold text-orange-500 mt-1">+{transformedData?.geographic.newAreas || 0}</div>
          </div>
        </div>
      </div>

      {/* Map Visualization */}
      {/* <div className="card p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-4">Incident Density Map</h3>
        <MapVisualization hotspots={transformedData?.geographic.hotspots || []} />
      </div> */}
    </div>
  )

  const renderPerformance = () => (
    <div className="space-y-6">
      {/* Responder Performance */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-4">Responder Team Performance</h3>
        <div className="space-y-4">
          {(transformedData?.performance.responders || []).map((team, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-surface-variant rounded-lg">
              <div className="flex items-center space-x-4">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium text-on-surface">{team.name}</div>
                  <div className="text-sm text-on-surface-variant">
                    {team.cases || 0} cases handled • Rating: {team.rating || 0}/5
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-sm text-on-surface-variant">Efficiency</div>
                  <div className="font-semibold text-green-500">{team.efficiency || '0%'}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-on-surface-variant">Avg Time</div>
                  <div className="font-semibold text-on-surface">{team.avgTime || 'N/A'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-primary/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-on-surface">Overall System Efficiency</div>
              <div className="text-sm text-on-surface-variant">
                {transformedData?.performance.totalResponders || 0} responders • Avg rating: {transformedData?.performance.avgResponderRating || 0}/5
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-500">{transformedData?.performance.overallEfficiency || '0%'}</div>
              <div className="text-sm text-green-500">+{transformedData?.performance.improvement || '0%'} improvement</div>
            </div>
          </div>
        </div>
      </div>

      {/* User Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-on-surface mb-4">User Safety Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-on-surface">Active Users</span>
              <span className="font-medium text-blue-500">{transformedData?.userMetrics.activeUsers || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface">Safety Compliance</span>
              <span className="font-medium text-green-500">{transformedData?.userMetrics.safetyComplianceRate || '0%'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface">Safety Checks</span>
              <span className="font-medium text-purple-500">{transformedData?.userMetrics.totalSafetyChecks || 0}</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-on-surface mb-4">Response Time Analysis</h3>
          <div className="space-y-4">
            {[
              { period: 'Current', time: transformedData?.overview.avgResponseTime || 'N/A', trend: 'current' },
              { period: 'Target', time: '15 min', trend: 'target' },
              { period: 'Improvement', time: transformedData?.overview.responseTimeTrend || '0min', trend: 'improvement' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-on-surface">{item.period}</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${
                    item.trend === 'current' ? 'text-orange-500' :
                    item.trend === 'target' ? 'text-green-500' :
                    item.trend === 'improvement' ? 'text-blue-500' : 'text-on-surface'
                  }`}>
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderPredictive = () => (
    <div className="space-y-6">
      {/* Predictions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-4">Predictive Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-surface-variant rounded-lg">
            <div className="text-on-surface-variant">Expected Incidents Next Week</div>
            <div className="text-3xl font-bold text-orange-500 mt-2">{transformedData?.predictions.nextWeek || 0}</div>
            <div className="text-sm text-on-surface-variant mt-1">Based on current trends</div>
          </div>
          <div className="text-center p-4 bg-surface-variant rounded-lg">
            <div className="text-on-surface-variant">Seasonal Trend</div>
            <div className="text-3xl font-bold text-red-500 mt-2 capitalize">{transformedData?.predictions.seasonalTrend || 'stable'}</div>
            <div className="text-sm text-on-surface-variant mt-1">Pattern analysis</div>
          </div>
          <div className="text-center p-4 bg-surface-variant rounded-lg">
            <div className="text-on-surface-variant">Prediction Confidence</div>
            <div className="text-3xl font-bold text-green-500 mt-2">{transformedData?.predictions.confidence || '0%'}</div>
            <div className="text-sm text-on-surface-variant mt-1">Model accuracy</div>
          </div>
        </div>

        {(transformedData?.predictions.riskAreas || []).length > 0 && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <h4 className="font-medium text-yellow-500 mb-2">High-Risk Areas Next Week</h4>
            <div className="flex flex-wrap gap-2">
              {transformedData.predictions.riskAreas.map((area, index) => (
                <span key={index} className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm">
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trend Projections */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-4">Trend Projections</h3>
        <div className="space-y-4">
          {[
            { category: 'Total Incidents', current: transformedData?.overview.totalIncidents || 0, projected: transformedData?.predictions.nextWeek || 0, trend: 'up' },
            { category: 'Response Time', current: transformedData?.overview.avgResponseTime || 'N/A', projected: '15 min', trend: 'down' },
            { category: 'Resolution Rate', current: transformedData?.overview.resolutionRate || '0%', projected: '25%', trend: 'up' },
            { category: 'Coverage Area', current: transformedData?.geographic.coverage || '0%', projected: '30%', trend: 'up' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-surface-variant rounded-lg">
              <span className="text-on-surface">{item.category}</span>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-on-surface-variant">Current</div>
                  <div className="font-medium text-on-surface">{item.current}</div>
                </div>
                <div className="text-primary">→</div>
                <div className="text-right">
                  <div className="text-sm text-on-surface-variant">Projected</div>
                  <div className="font-medium text-green-500">{item.projected}</div>
                </div>
                {getTrendIcon(item.trend)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'geographic', name: 'Geographic', icon: MapPin },
    { id: 'performance', name: 'Performance', icon: Target },
    { id: 'predictive', name: 'Predictive', icon: TrendingUp }
  ]

  if (isLoading && !analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-on-surface-variant">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error && !analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-on-surface mb-2">Error loading analytics</h2>
          <p className="text-on-surface-variant mb-4">{error}</p>
          <button 
            onClick={fetchAnalyticsData}
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
          <h1 className="text-3xl font-bold text-on-surface">Analytics & Insights</h1>
          <p className="text-on-surface-variant mt-1">
            Deep insights and predictive analytics for emergency response
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button 
            onClick={refreshData}
            disabled={isLoading}
            className="bg-surface-variant text-on-surface px-4 py-2 rounded-lg hover:bg-surface transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            <span className="ml-2 text-sm text-on-surface-variant">Auto-refresh</span>
          </label>
        </div>
      </div>

      {/* Controls */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-wrap gap-4">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-surface-variant p-1 rounded-lg">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>

            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input-field"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last 1 Year</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 text-sm text-on-surface-variant">
            <Calendar className="h-4 w-4" />
            <span>Data up to: {new Date(transformedData?.metadata?.endDate || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Analytics Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'geographic' && renderGeographic()}
        {activeTab === 'performance' && renderPerformance()}
        {activeTab === 'predictive' && renderPredictive()}
      </div>

      {/* Data Quality Indicator */}
      <div className="card p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-on-surface-variant">
              Data Quality: {transformedData?.metadata?.dataPoints ? 'Good' : 'Unknown'}
            </span>
          </div>
          <div className="text-on-surface-variant">
            Last updated: {new Date(transformedData?.metadata?.lastUpdated || Date.now()).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics