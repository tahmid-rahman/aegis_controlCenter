// src/pages/Settings.jsx
import React, { useState } from 'react'
import { 
  Settings as SettingsIcon,
  Save,
  Bell,
  Shield,
  Users,
  MapPin,
  Database,
  Download,
  Upload,
  Key,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Globe,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const Settings = () => {
  const { isDark, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Form states
  const [settings, setSettings] = useState({
    // General Settings
    systemName: 'Aegis Control Center',
    adminEmail: 'admin@aegis.bd',
    contactNumber: '+880 2-XXXX-XXXX',
    language: 'en',
    timezone: 'Asia/Dhaka',
    dateFormat: 'DD/MM/YYYY',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    emergencyAlerts: true,
    responderUpdates: true,
    systemAlerts: true,
    lowPriorityAlerts: false,
    
    // Security Settings
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordHistory: 5,
    failedAttempts: 5,
    autoLogout: true,
    
    // System Settings
    dataRetention: 365,
    backupFrequency: 'daily',
    autoBackup: true,
    maxFileSize: 10,
    apiRateLimit: 1000,
    
    // Appearance Settings
    theme: isDark ? 'dark' : 'light',
    sidebarCollapsed: false,
    compactMode: false,
    highContrast: false
  })

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      // Show success message
      alert('Settings saved successfully!')
    }, 1000)
  }

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleExportData = () => {
    // Simulate data export
    alert('Data export started. You will receive an email when it\'s ready.')
  }

  const handleImportData = () => {
    // Simulate data import
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,.csv'
    input.onchange = (e) => {
      alert('Data import process started.')
    }
    input.click()
  }

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'system', name: 'System', icon: Database },
    { id: 'appearance', name: 'Appearance', icon: Monitor }
  ]

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            System Name
          </label>
          <input
            type="text"
            value={settings.systemName}
            onChange={(e) => handleInputChange('general', 'systemName', e.target.value)}
            className="input-field w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            Admin Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant h-4 w-4" />
            <input
              type="email"
              value={settings.adminEmail}
              onChange={(e) => handleInputChange('general', 'adminEmail', e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            Contact Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant h-4 w-4" />
            <input
              type="tel"
              value={settings.contactNumber}
              onChange={(e) => handleInputChange('general', 'contactNumber', e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            Language
          </label>
          <select
            value={settings.language}
            onChange={(e) => handleInputChange('general', 'language', e.target.value)}
            className="input-field w-full"
          >
            <option value="en">English</option>
            <option value="bn">Bengali</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            Timezone
          </label>
          <select
            value={settings.timezone}
            onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
            className="input-field w-full"
          >
            <option value="Asia/Dhaka">Bangladesh Standard Time (UTC+6)</option>
            <option value="UTC">Coordinated Universal Time (UTC)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            Date Format
          </label>
          <select
            value={settings.dateFormat}
            onChange={(e) => handleInputChange('general', 'dateFormat', e.target.value)}
            className="input-field w-full"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-on-surface">Notification Channels</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-surface-variant rounded-lg">
            <div>
              <div className="font-medium text-on-surface">Email Notifications</div>
              <div className="text-sm text-on-surface-variant">Receive alerts via email</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-surface-variant rounded-lg">
            <div>
              <div className="font-medium text-on-surface">SMS Notifications</div>
              <div className="text-sm text-on-surface-variant">Receive alerts via SMS</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => handleInputChange('notifications', 'smsNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-surface-variant rounded-lg">
            <div>
              <div className="font-medium text-on-surface">Push Notifications</div>
              <div className="text-sm text-on-surface-variant">Browser push notifications</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => handleInputChange('notifications', 'pushNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-on-surface">Alert Types</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-surface-variant rounded-lg">
            <div>
              <div className="font-medium text-on-surface">Emergency Alerts</div>
              <div className="text-sm text-on-surface-variant">New emergency notifications</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emergencyAlerts}
                onChange={(e) => handleInputChange('notifications', 'emergencyAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-surface-variant rounded-lg">
            <div>
              <div className="font-medium text-on-surface">Responder Updates</div>
              <div className="text-sm text-on-surface-variant">Responder status changes</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.responderUpdates}
                onChange={(e) => handleInputChange('notifications', 'responderUpdates', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-surface-variant rounded-lg">
            <div>
              <div className="font-medium text-on-surface">System Alerts</div>
              <div className="text-sm text-on-surface-variant">System maintenance & updates</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.systemAlerts}
                onChange={(e) => handleInputChange('notifications', 'systemAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-on-surface">Authentication</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-surface-variant rounded-lg">
            <div>
              <div className="font-medium text-on-surface">Two-Factor Authentication</div>
              <div className="text-sm text-on-surface-variant">Require 2FA for all logins</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-surface-variant rounded-lg">
            <div>
              <div className="font-medium text-on-surface">Auto Logout</div>
              <div className="text-sm text-on-surface-variant">Automatically logout inactive sessions</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoLogout}
                onChange={(e) => handleInputChange('security', 'autoLogout', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            min="5"
            max="120"
            value={settings.sessionTimeout}
            onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
            className="input-field w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            Password History
          </label>
          <input
            type="number"
            min="0"
            max="10"
            value={settings.passwordHistory}
            onChange={(e) => handleInputChange('security', 'passwordHistory', parseInt(e.target.value))}
            className="input-field w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            Failed Login Attempts
          </label>
          <input
            type="number"
            min="3"
            max="10"
            value={settings.failedAttempts}
            onChange={(e) => handleInputChange('security', 'failedAttempts', parseInt(e.target.value))}
            className="input-field w-full"
          />
        </div>
      </div>

      <div className="border-t border-outline pt-6">
        <h3 className="text-lg font-medium text-on-surface mb-4">Change Password</h3>
        <div className="grid grid-cols-1 gap-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">
              Current Password
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant h-4 w-4" />
              <input
                type={showPassword ? "text" : "password"}
                className="input-field w-full pl-10 pr-10"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="input-field w-full"
              placeholder="Enter new password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">
              Confirm New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="input-field w-full"
              placeholder="Confirm new password"
            />
          </div>
          
          <button className="btn-primary w-full max-w-xs">
            Update Password
          </button>
        </div>
      </div>
    </div>
  )

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            Data Retention (days)
          </label>
          <input
            type="number"
            min="30"
            max="1095"
            value={settings.dataRetention}
            onChange={(e) => handleInputChange('system', 'dataRetention', parseInt(e.target.value))}
            className="input-field w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            Backup Frequency
          </label>
          <select
            value={settings.backupFrequency}
            onChange={(e) => handleInputChange('system', 'backupFrequency', e.target.value)}
            className="input-field w-full"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            Max File Size (MB)
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={settings.maxFileSize}
            onChange={(e) => handleInputChange('system', 'maxFileSize', parseInt(e.target.value))}
            className="input-field w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            API Rate Limit (requests/hour)
          </label>
          <input
            type="number"
            min="100"
            max="10000"
            value={settings.apiRateLimit}
            onChange={(e) => handleInputChange('system', 'apiRateLimit', parseInt(e.target.value))}
            className="input-field w-full"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-surface-variant rounded-lg">
          <div>
            <div className="font-medium text-on-surface">Automatic Backups</div>
            <div className="text-sm text-on-surface-variant">Automatically backup system data</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoBackup}
              onChange={(e) => handleInputChange('system', 'autoBackup', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      <div className="border-t border-outline pt-6">
        <h3 className="text-lg font-medium text-on-surface mb-4">Data Management</h3>
        <div className="flex space-x-4">
          <button
            onClick={handleExportData}
            className="btn-primary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </button>
          
          <button
            onClick={handleImportData}
            className="bg-surface-variant text-on-surface px-4 py-2 rounded-lg hover:bg-surface transition-colors flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Import Data</span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-on-surface">Theme</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleInputChange('appearance', 'theme', 'light')}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              settings.theme === 'light' 
                ? 'border-primary bg-primary/10' 
                : 'border-outline hover:border-primary/50'
            }`}
          >
            <Sun className="h-6 w-6 mb-2" />
            <div className="font-medium text-on-surface">Light</div>
            <div className="text-sm text-on-surface-variant">Bright theme for daytime</div>
          </button>
          
          <button
            onClick={() => handleInputChange('appearance', 'theme', 'dark')}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              settings.theme === 'dark' 
                ? 'border-primary bg-primary/10' 
                : 'border-outline hover:border-primary/50'
            }`}
          >
            <Moon className="h-6 w-6 mb-2" />
            <div className="font-medium text-on-surface">Dark</div>
            <div className="text-sm text-on-surface-variant">Dark theme for nighttime</div>
          </button>
          
          <button
            onClick={() => handleInputChange('appearance', 'theme', 'system')}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              settings.theme === 'system' 
                ? 'border-primary bg-primary/10' 
                : 'border-outline hover:border-primary/50'
            }`}
          >
            <Monitor className="h-6 w-6 mb-2" />
            <div className="font-medium text-on-surface">System</div>
            <div className="text-sm text-on-surface-variant">Follow system preference</div>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-on-surface">Interface</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-surface-variant rounded-lg">
            <div>
              <div className="font-medium text-on-surface">Collapsed Sidebar</div>
              <div className="text-sm text-on-surface-variant">Compact sidebar navigation</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.sidebarCollapsed}
                onChange={(e) => handleInputChange('appearance', 'sidebarCollapsed', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-surface-variant rounded-lg">
            <div>
              <div className="font-medium text-on-surface">Compact Mode</div>
              <div className="text-sm text-on-surface-variant">Denser information display</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.compactMode}
                onChange={(e) => handleInputChange('appearance', 'compactMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-surface-variant rounded-lg">
            <div>
              <div className="font-medium text-on-surface">High Contrast</div>
              <div className="text-sm text-on-surface-variant">Enhanced color contrast</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => handleInputChange('appearance', 'highContrast', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
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
          <h1 className="text-3xl font-bold text-on-surface">System Settings</h1>
          <p className="text-on-surface-variant mt-1">
            Configure and customize your Aegis control center
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="btn-primary mt-4 lg:mt-0 flex items-center space-x-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64">
          <div className="card p-4">
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary border-r-2 border-primary'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="card p-6">
            {activeTab === 'general' && renderGeneralSettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'security' && renderSecuritySettings()}
            {activeTab === 'system' && renderSystemSettings()}
            {activeTab === 'appearance' && renderAppearanceSettings()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings