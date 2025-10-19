// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, Calendar, Shield, Edit2, Camera, Home } from 'lucide-react'
import api from '../services/api'

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    user_type: '',
    agent_id: '',
    responder_type: '',
    status: '',
    badge_number: '',
    specialization: [],
    rating: 0,
    total_cases: 0,
    gender: '',
    id_type: '',
    id_number: '',
    dob: '',
    blood_group: '',
    address: '',
    emergency_medical_note: '',
    profile_picture: '',
    last_active: ''
  })

  const baseUrl = process.env.REACT_APP_MEDIA_URL

  const getProfilePictureUrl = (profilePicturePath) => {
    if (!profilePicturePath) return null
    return `${baseUrl}${profilePicturePath}`
  }

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const response = await api.get('/auth/profile/')
      setProfile(response.data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const updateData = {
        name: profile.name,
        address: profile.address,
      }

      await api.put('/auth/profile/', updateData)
      setIsEditing(false)
      await fetchUserProfile()
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfilePictureUpdate = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('profile_picture', file)

      await api.patch('/auth/profile/picture/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      
      await fetchUserProfile()
    } catch (error) {
      console.error('Error updating profile picture:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProfilePicture = async () => {
    try {
      setLoading(true)
      await api.delete('/auth/profile/picture/delete/')
      await fetchUserProfile()
    } catch (error) {
      console.error('Error deleting profile picture:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatLastActive = (dateString) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const stats = [
    { label: 'Total Cases', value: profile.total_cases || '0' },
    { label: 'Response Rating', value: `${profile.rating || '0'}/5` },
    { label: 'Current Status', value: profile.status ? profile.status.charAt(0).toUpperCase() + profile.status.slice(1) : 'Offline' },
    { label: 'Specializations', value: profile.specialization?.length || '0' }
  ]

  if (loading && !profile.email) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center h-64">
        <div className="text-on-surface-variant">Loading profile...</div>
      </div>
    )
  }

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
          disabled={loading}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50"
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
                <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center overflow-hidden">
                  {profile.profile_picture ? (
                    <img 
                      src={getProfilePictureUrl(profile.profile_picture)} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center ${profile.profile_picture ? 'hidden' : 'flex'}`}>
                    <User className="h-10 w-10 text-primary" />
                  </div>
                </div>
                {isEditing && (
                  <>
                    <input
                      type="file"
                      id="profile-picture"
                      accept="image/*"
                      onChange={handleProfilePictureUpdate}
                      className="hidden"
                    />
                    <label 
                      htmlFor="profile-picture"
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-4 border-surface cursor-pointer hover:bg-primary-dark transition-colors"
                    >
                      <Camera className="h-4 w-4 text-on-primary" />
                    </label>
                    {profile.profile_picture && (
                      <button
                        onClick={handleDeleteProfilePicture}
                        className="absolute -bottom-2 -right-12 w-8 h-8 bg-error rounded-full flex items-center justify-center border-4 border-surface cursor-pointer hover:bg-error-dark transition-colors"
                      >
                        <span className="text-on-primary text-sm">×</span>
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Profile Details */}
              <div className="flex-1 space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={profile.name || ''}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="input-field w-full"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-2">
                        Address
                      </label>
                      <textarea
                        value={profile.address || ''}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        className="input-field w-full resize-none"
                        rows="3"
                        placeholder="Enter your address"
                      />
                    </div>

                    <button
                      onClick={handleSave}
                      disabled={loading || !profile.name}
                      className="btn-primary disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-on-surface">{profile.name || 'No Name Provided'}</h2>
                      <p className="text-on-surface-variant capitalize">
                        {profile.user_type || 'User'} 
                        {profile.responder_type && ` • ${profile.responder_type}`}
                        {profile.agent_id && ` • ${profile.agent_id}`}
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-on-surface-variant" />
                        <div>
                          <p className="text-sm text-on-surface-variant">Email</p>
                          <p className="text-on-surface">{profile.email || 'Not provided'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-on-surface-variant" />
                        <div>
                          <p className="text-sm text-on-surface-variant">Phone</p>
                          <p className="text-on-surface">{profile.phone || 'Not provided'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Home className="h-5 w-5 text-on-surface-variant" />
                        <div>
                          <p className="text-sm text-on-surface-variant">Address</p>
                          <p className="text-on-surface">{profile.address || 'Not provided'}</p>
                        </div>
                      </div>

                      {profile.dob && (
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-on-surface-variant" />
                          <div>
                            <p className="text-sm text-on-surface-variant">Date of Birth</p>
                            <p className="text-on-surface">{formatDate(profile.dob)}</p>
                          </div>
                        </div>
                      )}

                      {profile.blood_group && (
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 text-on-surface-variant">🩸</div>
                          <div>
                            <p className="text-sm text-on-surface-variant">Blood Group</p>
                            <p className="text-on-surface">{profile.blood_group}</p>
                          </div>
                        </div>
                      )}
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
              <h3 className="text-lg font-semibold text-on-surface">Role Information</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-on-surface-variant mb-1">User Type</p>
                <p className="text-on-surface font-medium capitalize">{profile.user_type || 'User'}</p>
              </div>
              
              {profile.responder_type && (
                <div>
                  <p className="text-sm text-on-surface-variant mb-1">Responder Type</p>
                  <p className="text-on-surface font-medium capitalize">{profile.responder_type}</p>
                </div>
              )}

              {profile.badge_number && (
                <div>
                  <p className="text-sm text-on-surface-variant mb-1">Badge Number</p>
                  <p className="text-on-surface font-medium">{profile.badge_number}</p>
                </div>
              )}

              {profile.specialization && profile.specialization.length > 0 && (
                <div>
                  <p className="text-sm text-on-surface-variant mb-2">Specializations</p>
                  <div className="space-y-2">
                    {profile.specialization.map((spec, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-on-surface capitalize">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* System Info */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-on-surface mb-4">Activity Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Last Active</span>
                <span className="text-on-surface">{formatLastActive(profile.last_active)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Account Status</span>
                <span className="text-green-500 font-medium capitalize">{profile.status || 'offline'}</span>
              </div>
              {profile.id_number && (
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">ID Number</span>
                  <span className="text-on-surface">{profile.id_number}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile