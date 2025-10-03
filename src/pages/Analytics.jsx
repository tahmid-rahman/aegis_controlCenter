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

const Analytics = () => {
  const { emergencies } = useEmergencies()
  const [timeRange, setTimeRange] = useState('30d')
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalIncidents: 1247,
      activeNow: 8,
      avgResponseTime: '4.2 min',
      resolutionRate: '94%',
      trend: '+12%',
      peakHours: ['18:00', '22:00']
    },
    trends: {
      daily: [45, 52, 48, 61, 55, 58, 52, 49, 53, 60, 55, 57, 52, 50],
      weekly: [312, 298, 345, 328, 361, 342, 355],
      monthly: [1247, 1128, 1356, 1289, 1423, 1387],
      hourly: [23, 18, 15, 12, 8, 6, 9, 15, 28, 35, 42, 48, 52, 55, 58, 61, 65, 68, 72, 75, 68, 55, 42, 32]
    },
    geographic: {
      hotspots: [
        { area: 'Mirpur', incidents: 245, trend: 'up', density: 'high' },
        { area: 'Gulshan', incidents: 189, trend: 'up', density: 'high' },
        { area: 'Dhanmondi', incidents: 167, trend: 'stable', density: 'medium' },
        { area: 'Uttara', incidents: 142, trend: 'down', density: 'medium' },
        { area: 'Banani', incidents: 128, trend: 'up', density: 'medium' },
        { area: 'Mohakhali', incidents: 98, trend: 'stable', density: 'low' }
      ],
      coverage: '87%',
      newAreas: 3
    },
    types: {
      harassment: { count: 342, trend: 'up', responseTime: '3.8 min' },
      robbery: { count: 228, trend: 'down', responseTime: '5.2 min' },
      stalking: { count: 195, trend: 'stable', responseTime: '4.1 min' },
      assault: { count: 168, trend: 'up', responseTime: '4.5 min' },
      domestic: { count: 156, trend: 'up', responseTime: '3.9 min' },
      cyber: { count: 78, trend: 'up', responseTime: '6.1 min' },
      other: { count: 80, trend: 'stable', responseTime: '4.8 min' }
    },
    performance: {
      responders: [
        { name: 'Police Units', efficiency: '92%', avgTime: '3.8 min', cases: 645 },
        { name: 'NGO Teams', efficiency: '88%', avgTime: '4.5 min', cases: 342 },
        { name: 'Medical Units', efficiency: '95%', avgTime: '4.1 min', cases: 156 },
        { name: 'Volunteers', efficiency: '82%', avgTime: '5.2 min', cases: 104 }
      ],
      overallEfficiency: '89%',
      improvement: '+5%'
    },
    predictions: {
      nextWeek: 285,
      riskAreas: ['Mirpur', 'Gulshan', 'Dhanmondi'],
      seasonalTrend: 'increasing',
      confidence: '85%'
    }
  }

  // Auto-refresh simulation
  useEffect(() => {
    let interval
    if (autoRefresh) {
      interval = setInterval(() => {
        setIsLoading(true)
        setTimeout(() => setIsLoading(false), 1000)
      }, 30000) // Refresh every 30 seconds
    }
    return () => clearInterval(interval)
  }, [autoRefresh])

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

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

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Total Incidents</p>
              <p className="text-3xl font-bold text-on-surface mt-2">{analyticsData.overview.totalIncidents}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-primary" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">{analyticsData.overview.trend} this month</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Active Now</p>
              <p className="text-3xl font-bold text-red-500 mt-2">{analyticsData.overview.activeNow}</p>
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
              <p className="text-3xl font-bold text-on-surface mt-2">{analyticsData.overview.avgResponseTime}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-4 text-sm text-on-surface-variant">
            -0.3min from last month
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Resolution Rate</p>
              <p className="text-3xl font-bold text-green-500 mt-2">{analyticsData.overview.resolutionRate}</p>
            </div>
            <Target className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-4 text-sm text-on-surface-variant">
            +2% improvement
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Trends */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-on-surface mb-4">Daily Incident Trends</h3>
          <div className="space-y-3">
            {analyticsData.trends.daily.slice(-7).map((count, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-on-surface-variant text-sm">Day {index + 1}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-surface-variant rounded-full h-3">
                    <div 
                      className="bg-primary rounded-full h-3"
                      style={{ width: `${(count / 70) * 100}%` }}
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
            {Object.entries(analyticsData.types).map(([type, data]) => (
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
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(data.trend)}
                    <span className="text-on-surface-variant text-sm">{data.responseTime}</span>
                  </div>
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
          {analyticsData.trends.hourly.map((count, hour) => (
            <div key={hour} className="text-center">
              <div className="text-xs text-on-surface-variant mb-1">{hour}:00</div>
              <div 
                className="bg-primary rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                style={{ 
                  height: `${(count / 80) * 60}px`,
                  backgroundColor: hour >= 18 && hour <= 22 ? '#DC2626' : '#6750A4'
                }}
                title={`${count} incidents at ${hour}:00`}
              ></div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-on-surface-variant text-center">
          Peak hours: {analyticsData.overview.peakHours.join(' - ')}
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
          {analyticsData.geographic.hotspots.map((area, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-surface-variant rounded-lg">
              <div className="flex items-center space-x-4">
                <MapPin className="h-5 w-5 text-on-surface-variant" />
                <div>
                  <div className="font-medium text-on-surface">{area.area}</div>
                  <div className="text-sm text-on-surface-variant">{area.incidents} incidents</div>
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
        
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 bg-surface-variant rounded-lg">
            <div className="text-on-surface-variant">Coverage Area</div>
            <div className="text-2xl font-bold text-green-500 mt-1">{analyticsData.geographic.coverage}</div>
          </div>
          <div className="text-center p-3 bg-surface-variant rounded-lg">
            <div className="text-on-surface-variant">New Areas</div>
            <div className="text-2xl font-bold text-blue-500 mt-1">+{analyticsData.geographic.newAreas}</div>
          </div>
        </div>
      </div>

      {/* Map Visualization Placeholder */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-4">Incident Density Map</h3>
        <div className="bg-surface-variant rounded-lg h-64 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-on-surface-variant mx-auto mb-3" />
            <p className="text-on-surface-variant">Interactive map visualization</p>
            <p className="text-sm text-on-surface-variant mt-1">Showing incident density across Dhaka</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPerformance = () => (
    <div className="space-y-6">
      {/* Responder Performance */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-4">Responder Team Performance</h3>
        <div className="space-y-4">
          {analyticsData.performance.responders.map((team, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-surface-variant rounded-lg">
              <div className="flex items-center space-x-4">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium text-on-surface">{team.name}</div>
                  <div className="text-sm text-on-surface-variant">{team.cases} cases handled</div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-sm text-on-surface-variant">Efficiency</div>
                  <div className="font-semibold text-green-500">{team.efficiency}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-on-surface-variant">Avg Time</div>
                  <div className="font-semibold text-on-surface">{team.avgTime}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-primary/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-on-surface">Overall System Efficiency</div>
              <div className="text-sm text-on-surface-variant">Combined performance across all teams</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-500">{analyticsData.performance.overallEfficiency}</div>
              <div className="text-sm text-green-500">+{analyticsData.performance.improvement} improvement</div>
            </div>
          </div>
        </div>
      </div>

      {/* Response Time Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-on-surface mb-4">Response Time Trends</h3>
          <div className="space-y-4">
            {[
              { period: 'Last 24h', time: '4.1 min', trend: 'down' },
              { period: 'Last 7d', time: '4.3 min', trend: 'down' },
              { period: 'Last 30d', time: '4.2 min', trend: 'stable' },
              { period: 'Last 90d', time: '4.5 min', trend: 'down' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-on-surface">{item.period}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-on-surface">{item.time}</span>
                  {getTrendIcon(item.trend)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-on-surface mb-4">Efficiency Metrics</h3>
          <div className="space-y-4">
            {[
              { metric: 'First Response', value: '98%', target: '95%' },
              { metric: 'Case Completion', value: '94%', target: '90%' },
              { metric: 'Follow-up Rate', value: '89%', target: '85%' },
              { metric: 'User Satisfaction', value: '92%', target: '88%' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-on-surface">{item.metric}</span>
                <div className="text-right">
                  <div className="font-medium text-green-500">{item.value}</div>
                  <div className="text-xs text-on-surface-variant">Target: {item.target}</div>
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
            <div className="text-3xl font-bold text-orange-500 mt-2">{analyticsData.predictions.nextWeek}</div>
            <div className="text-sm text-on-surface-variant mt-1">Based on current trends</div>
          </div>
          <div className="text-center p-4 bg-surface-variant rounded-lg">
            <div className="text-on-surface-variant">Seasonal Trend</div>
            <div className="text-3xl font-bold text-red-500 mt-2 capitalize">{analyticsData.predictions.seasonalTrend}</div>
            <div className="text-sm text-on-surface-variant mt-1">Pattern analysis</div>
          </div>
          <div className="text-center p-4 bg-surface-variant rounded-lg">
            <div className="text-on-surface-variant">Prediction Confidence</div>
            <div className="text-3xl font-bold text-green-500 mt-2">{analyticsData.predictions.confidence}</div>
            <div className="text-sm text-on-surface-variant mt-1">Model accuracy</div>
          </div>
        </div>

        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <h4 className="font-medium text-yellow-500 mb-2">High-Risk Areas Next Week</h4>
          <div className="flex flex-wrap gap-2">
            {analyticsData.predictions.riskAreas.map((area, index) => (
              <span key={index} className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm">
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Trend Projections */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-4">Trend Projections</h3>
        <div className="space-y-4">
          {[
            { category: 'Harassment Cases', current: 45, projected: 52, trend: 'up' },
            { category: 'Response Time', current: '4.2min', projected: '3.9min', trend: 'down' },
            { category: 'Coverage Area', current: '87%', projected: '91%', trend: 'up' },
            { category: 'Resolution Rate', current: '94%', projected: '96%', trend: 'up' }
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
            <span>Data up to: {new Date().toLocaleDateString()}</span>
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
            <span className="text-on-surface-variant">Data Quality: Excellent</span>
          </div>
          <div className="text-on-surface-variant">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics