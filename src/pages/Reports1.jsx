// src/pages/Reports.jsx
import React, { useState } from 'react'
import { 
  Download,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  MapPin,
  Users,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  FileText,
  Printer,
  Share2
} from 'lucide-react'
import { useEmergencies } from '../contexts/EmergencyContext'

const Reports = () => {
  const { emergencies } = useEmergencies()
  const [dateRange, setDateRange] = useState('7d')
  const [reportType, setReportType] = useState('overview')
  const [exportFormat, setExportFormat] = useState('pdf')
  const [generating, setGenerating] = useState(false)

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalEmergencies: 156,
      avgResponseTime: '4.2 min',
      completionRate: '92%',
      responderEfficiency: '88%'
    },
    trends: {
      weekly: [45, 52, 48, 61, 55, 58, 52],
      monthly: [156, 142, 168, 189, 175, 162],
      types: {
        harassment: 42,
        robbery: 28,
        stalking: 35,
        assault: 24,
        domestic: 18,
        cyber: 9
      }
    },
    hotspots: [
      { area: 'Gulshan', incidents: 45, trend: 'up' },
      { area: 'Dhanmondi', incidents: 38, trend: 'up' },
      { area: 'Mirpur', incidents: 52, trend: 'stable' },
      { area: 'Uttara', incidents: 28, trend: 'down' },
      { area: 'Banani', incidents: 32, trend: 'up' }
    ],
    responders: [
      { name: 'Officer Khan', cases: 42, rating: 4.8, efficiency: '95%' },
      { name: 'NGO Team A', cases: 28, rating: 4.6, efficiency: '89%' },
      { name: 'Medical Unit 7', cases: 35, rating: 4.9, efficiency: '92%' },
      { name: 'Community Watch', cases: 15, rating: 4.4, efficiency: '82%' }
    ]
  }

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      trend === 'down' ? 
      <TrendingDown className="h-4 w-4 text-red-500" /> :
      <span className="w-4 h-4 text-gray-500">→</span>
  }

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-500' : 
           trend === 'down' ? 'text-red-500' : 'text-gray-500'
  }

  const generateReport = async () => {
    setGenerating(true)
    // Simulate report generation
    setTimeout(() => {
      setGenerating(false)
      alert(`Report generated successfully! Would download as ${exportFormat.toUpperCase()}`)
    }, 2000)
  }

  const printReport = () => {
    window.print()
  }

  const shareReport = () => {
    alert('Share functionality would be implemented here')
  }

  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Total Emergencies</p>
              <p className="text-3xl font-bold text-on-surface mt-2">{analyticsData.overview.totalEmergencies}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-primary" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">+12% from last period</span>
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
          <div className="mt-4 flex items-center text-sm">
            <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">Faster by 0.8min</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Completion Rate</p>
              <p className="text-3xl font-bold text-on-surface mt-2">{analyticsData.overview.completionRate}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-4 text-sm text-on-surface-variant">
            +3% improvement
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Responder Efficiency</p>
              <p className="text-3xl font-bold text-on-surface mt-2">{analyticsData.overview.responderEfficiency}</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-4 text-sm text-on-surface-variant">
            High performance
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Types */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-on-surface mb-4">Incident Types Distribution</h3>
          <div className="space-y-4">
            {Object.entries(analyticsData.trends.types).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-on-surface capitalize">{type}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-on-surface font-medium">{count}</span>
                  <span className="text-on-surface-variant text-sm">
                    {((count / analyticsData.overview.totalEmergencies) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Trends */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-on-surface mb-4">Weekly Incident Trends</h3>
          <div className="space-y-3">
            {analyticsData.trends.weekly.map((count, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-on-surface-variant text-sm">Day {index + 1}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-surface-variant rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2"
                      style={{ width: `${(count / 70) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-on-surface text-sm font-medium">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hotspot Areas */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-4">Incident Hotspots</h3>
        <div className="space-y-3">
          {analyticsData.hotspots.map((area, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-surface-variant rounded-lg">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-on-surface-variant" />
                <span className="font-medium text-on-surface">{area.area}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-on-surface">{area.incidents} incidents</span>
                <div className={`flex items-center space-x-1 ${getTrendColor(area.trend)}`}>
                  {getTrendIcon(area.trend)}
                  <span className="text-sm capitalize">{area.trend}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderPerformanceReport = () => (
    <div className="space-y-6">
      {/* Responder Performance */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-4">Responder Performance</h3>
        <div className="space-y-4">
          {analyticsData.responders.map((responder, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-surface-variant rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-on-surface">{responder.name}</div>
                  <div className="text-sm text-on-surface-variant">{responder.cases} cases handled</div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-sm text-on-surface-variant">Rating</div>
                  <div className="font-semibold text-on-surface">{responder.rating}/5</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-on-surface-variant">Efficiency</div>
                  <div className="font-semibold text-green-500">{responder.efficiency}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Response Time Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-on-surface mb-4">Response Time by Type</h3>
          <div className="space-y-4">
            {[
              { type: 'Harassment', time: '3.8 min' },
              { type: 'Robbery', time: '5.2 min' },
              { type: 'Stalking', time: '4.1 min' },
              { type: 'Assault', time: '4.5 min' },
              { type: 'Domestic', time: '3.9 min' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-on-surface">{item.type}</span>
                <span className="font-medium text-on-surface">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-on-surface mb-4">Completion Rate Trends</h3>
          <div className="space-y-4">
            {[
              { period: 'This Week', rate: '94%' },
              { period: 'Last Week', rate: '91%' },
              { period: 'This Month', rate: '92%' },
              { period: 'Last Month', rate: '89%' },
              { period: 'Quarter', rate: '90%' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-on-surface">{item.period}</span>
                <span className="font-medium text-green-500">{item.rate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderDetailedReport = () => (
    <div className="space-y-6">
      {/* Emergency Timeline */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-4">Recent Emergency Timeline</h3>
        <div className="space-y-4">
          {emergencies.slice(0, 5).map((emergency, index) => (
            <div key={index} className="flex items-start space-x-4 p-3 bg-surface-variant rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-on-surface">#{emergency.id}</span>
                  <span className="text-sm text-on-surface-variant">
                    {new Date(emergency.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-on-surface-variant mt-1">
                  {emergency.type} • {emergency.location}
                </div>
                <div className="flex items-center space-x-4 mt-2 text-xs text-on-surface-variant">
                  <span>Status: {emergency.status}</span>
                  <span>Priority: {emergency.priority}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistical Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h4 className="font-semibold text-on-surface mb-3">Time Analysis</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Peak Hours:</span>
              <span className="text-on-surface">18:00-22:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Avg Resolution:</span>
              <span className="text-on-surface">28 min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Fastest Response:</span>
              <span className="text-on-surface">1.2 min</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h4 className="font-semibold text-on-surface mb-3">Geographic Data</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Most Active Area:</span>
              <span className="text-on-surface">Mirpur</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Coverage Area:</span>
              <span className="text-on-surface">85%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">New Hotspots:</span>
              <span className="text-on-surface">+2</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h4 className="font-semibold text-on-surface mb-3">System Performance</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Uptime:</span>
              <span className="text-green-500">99.8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Alert Accuracy:</span>
              <span className="text-on-surface">96.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Data Sync:</span>
              <span className="text-green-500">100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Reports & Analytics</h1>
          <p className="text-on-surface-variant mt-1">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <button 
            onClick={printReport}
            className="bg-surface-variant text-on-surface px-4 py-2 rounded-lg hover:bg-surface transition-colors flex items-center space-x-2"
          >
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </button>
          <button 
            onClick={shareReport}
            className="bg-surface-variant text-on-surface px-4 py-2 rounded-lg hover:bg-surface transition-colors flex items-center space-x-2"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
          <button 
            onClick={generateReport}
            disabled={generating}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>{generating ? 'Generating...' : 'Export Report'}</span>
          </button>
        </div>
      </div>

      {/* Report Controls */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-wrap gap-4">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="input-field"
            >
              <option value="overview">Overview Report</option>
              <option value="performance">Performance Report</option>
              <option value="detailed">Detailed Analysis</option>
              <option value="custom">Custom Report</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input-field"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>

            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="input-field"
            >
              <option value="pdf">PDF Format</option>
              <option value="excel">Excel Format</option>
              <option value="csv">CSV Format</option>
              <option value="json">JSON Format</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 text-sm text-on-surface-variant">
            <Calendar className="h-4 w-4" />
            <span>Report Period: {dateRange}</span>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="card p-6">
        {reportType === 'overview' && renderOverviewReport()}
        {reportType === 'performance' && renderPerformanceReport()}
        {reportType === 'detailed' && renderDetailedReport()}
        {reportType === 'custom' && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-on-surface-variant mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-on-surface mb-2">Custom Report Builder</h3>
            <p className="text-on-surface-variant mb-6">
              Build custom reports with specific metrics and filters
            </p>
            <button className="btn-primary">
              Launch Report Builder
            </button>
          </div>
        )}
      </div>

      {/* Report Summary */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-4">Report Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="text-on-surface-variant mb-2">Generated On</div>
            <div className="text-on-surface">{new Date().toLocaleString()}</div>
          </div>
          <div>
            <div className="text-on-surface-variant mb-2">Data Source</div>
            <div className="text-on-surface">Aegis Emergency Database</div>
          </div>
          <div>
            <div className="text-on-surface-variant mb-2">Records Analyzed</div>
            <div className="text-on-surface">{analyticsData.overview.totalEmergencies} emergencies</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports