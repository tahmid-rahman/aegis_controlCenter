// src/pages/Profile.jsx
import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit2, Camera } from 'lucide-react'

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Control Center Admin',
    email: 'admin@aegis.org',
    phone: '+880 1XXX-XXXXXX',
    role: 'Administrator',
    department: 'Emergency Response',
    location: 'Dhaka, Bangladesh',
    joinDate: 'January 15, 2024',
    permissions: ['Full Access', 'User Management', 'Responder Coordination', 'Analytics']
  })

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to backend
  }

  const stats = [
    { label: 'Emergencies Handled', value: '247' },
    { label: 'Response Rate', value: '98.2%' },
    { label: 'Avg Assignment Time', value: '2.1min' },
    { label: 'Team Members', value: '12' }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Profile</h1>
          <p className="text-on-surface-variant mt-1">Manage your account information</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-primary flex items-center space-x-2"
        >
          <Edit2 className="h-4 w-4" />
          <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="card p-6">
            <div className="flex items-start space-x-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
                {isEditing && (
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-4 border-surface">
                    <Camera className="h-4 w-4 text-on-primary" />
                  </button>
                )}
              </div>

              {/* Profile Details */}
              <div className="flex-1 space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="input-field w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="input-field w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="input-field w-full"
                      />
                    </div>
                    <button
                      onClick={handleSave}
                      className="btn-primary"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-on-surface">{profile.name}</h2>
                      <p className="text-on-surface-variant">{profile.role}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-on-surface-variant" />
                        <div>
                          <p className="text-sm text-on-surface-variant">Email</p>
                          <p className="text-on-surface">{profile.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-on-surface-variant" />
                        <div>
                          <p className="text-sm text-on-surface-variant">Phone</p>
                          <p className="text-on-surface">{profile.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-on-surface-variant" />
                        <div>
                          <p className="text-sm text-on-surface-variant">Location</p>
                          <p className="text-on-surface">{profile.location}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-on-surface-variant" />
                        <div>
                          <p className="text-sm text-on-surface-variant">Member Since</p>
                          <p className="text-on-surface">{profile.joinDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-on-surface mb-6">Performance Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-surface-variant rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-on-surface-variant">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Role & Permissions */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-on-surface">Role & Permissions</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-on-surface-variant mb-1">Department</p>
                <p className="text-on-surface font-medium">{profile.department}</p>
              </div>
              
              <div>
                <p className="text-sm text-on-surface-variant mb-2">Permissions</p>
                <div className="space-y-2">
                  {profile.permissions.map((permission, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-on-surface">{permission}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-on-surface mb-4">System Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Last Login</span>
                <span className="text-on-surface">Today, 09:24 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Account Status</span>
                <span className="text-green-500 font-medium">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Session Duration</span>
                <span className="text-on-surface">4h 12m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile