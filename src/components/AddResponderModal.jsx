// src/components/AddResponderModal.jsx
import React, { useState } from 'react'
import { X, Loader } from 'lucide-react'

const AddResponderModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'police',
    badgeNumber: 'PD-',
    agentId: '',
    location: '',
    specialization: [],
    gender: 'male',
    address: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentSpecialization, setCurrentSpecialization] = useState('')

  const responderTypes = [
    { value: 'police', label: 'Police', prefix: 'PD-' },
    { value: 'ngo', label: 'NGO', prefix: 'NGO-' },
    { value: 'medical', label: 'Medical', prefix: 'MED-' },
    { value: 'volunteer', label: 'Volunteer', prefix: 'VOL-' }
  ]

  // Handle type change - auto update badge number prefix
  const handleTypeChange = (type) => {
    const selectedType = responderTypes.find(t => t.value === type)
    const currentPrefix = selectedType ? selectedType.prefix : ''
    
    // Get the current number part (remove existing prefix)
    const currentValue = formData.badgeNumber
    const currentNumber = currentValue.replace(/^(PD-|NGO-|MED-|VOL-)/, '')
    
    setFormData(prev => ({
      ...prev,
      type,
      badgeNumber: currentPrefix + currentNumber
    }))
  }

  // Handle badge number input - prevent removing prefix
  const handleBadgeNumberChange = (value) => {
    const selectedType = responderTypes.find(t => t.value === formData.type)
    const prefix = selectedType ? selectedType.prefix : ''
    
    // Ensure the value starts with the correct prefix
    if (!value.startsWith(prefix)) {
      // If user tries to remove prefix, keep it and add their input
      const numberPart = value.replace(/^(PD-|NGO-|MED-|VOL-)/, '')
      setFormData(prev => ({ ...prev, badgeNumber: prefix + numberPart }))
    } else {
      setFormData(prev => ({ ...prev, badgeNumber: value }))
    }
  }

  // Handle badge number input events
  const handleBadgeNumberInput = (e) => {
    const value = e.target.value
    handleBadgeNumberChange(value)
  }

  // Prevent backspace from deleting prefix
  const handleBadgeNumberKeyDown = (e) => {
    const selectedType = responderTypes.find(t => t.value === formData.type)
    const prefix = selectedType ? selectedType.prefix : ''
    const cursorPosition = e.target.selectionStart

    // If backspace is pressed and cursor is at or before prefix length, prevent default
    if (e.key === 'Backspace' && cursorPosition <= prefix.length) {
      e.preventDefault()
    }

    // If delete is pressed and cursor is before prefix length, prevent default
    if (e.key === 'Delete' && cursorPosition < prefix.length) {
      e.preventDefault()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    // Validate badge number has numbers after prefix
    const numberPart = formData.badgeNumber.replace(/^(PD-|NGO-|MED-|VOL-)/, '')
    if (!numberPart || !/^\d+$/.test(numberPart)) {
      setError('Badge number must contain numbers after the prefix')
      return
    }

    setLoading(true)
    const result = await onSubmit(formData)
    setLoading(false)

    if (result.success) {
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        type: 'police',
        badgeNumber: 'PD-',
        agentId: '',
        location: '',
        specialization: [],
        gender: 'male',
        address: '',
        password: '',
        confirmPassword: ''
      })
      setCurrentSpecialization('')
    } else {
      setError(result.message)
    }
  }

  const handleAddSpecialization = () => {
    if (currentSpecialization.trim() && !formData.specialization.includes(currentSpecialization.trim())) {
      setFormData(prev => ({
        ...prev,
        specialization: [...prev.specialization, currentSpecialization.trim()]
      }))
      setCurrentSpecialization('')
    }
  }

  const handleRemoveSpecialization = (spec) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.filter(s => s !== spec)
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-surface-variant">
          <h3 className="text-xl font-semibold text-on-surface">Add New Responder</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-variant rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-on-surface-variant" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-on-surface">Basic Information</h4>
              
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field w-full"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="input-field w-full"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="input-field w-full"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  className="input-field w-full"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-on-surface">Professional Information</h4>
              
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                  Responder Type *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="input-field w-full"
                >
                  {responderTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                  Badge Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.badgeNumber}
                  onChange={handleBadgeNumberInput}
                  onKeyDown={handleBadgeNumberKeyDown}
                  className="input-field w-full font-mono"
                  placeholder="Enter numbers after prefix"
                />
                <p className="text-xs text-on-surface-variant mt-1">
                  Prefix: {responderTypes.find(t => t.value === formData.type)?.prefix}
                  <span className="text-green-600">(numbers only)</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                  Agent ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.agentId}
                  onChange={(e) => setFormData(prev => ({ ...prev, agentId: e.target.value }))}
                  className="input-field w-full"
                  placeholder="Enter unique agent ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="input-field w-full"
                  placeholder="Enter base location"
                />
              </div>
            </div>
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-2">
              Specialization
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentSpecialization}
                onChange={(e) => setCurrentSpecialization(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialization())}
                className="input-field flex-1"
                placeholder="Add specialization"
              />
              <button
                type="button"
                onClick={handleAddSpecialization}
                className="btn-secondary whitespace-nowrap"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.specialization.map((spec, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center space-x-1"
                >
                  <span>{spec}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecialization(spec)}
                    className="hover:text-primary/70"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="input-field w-full resize-none"
              rows={3}
              placeholder="Enter full address"
            />
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="input-field w-full"
                placeholder="Enter password"
                minLength={8}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="input-field w-full"
                placeholder="Confirm password"
                minLength={8}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t border-surface-variant">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-surface-variant text-on-surface py-3 rounded-lg hover:bg-surface transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading && <Loader className="h-4 w-4 animate-spin" />}
              <span>{loading ? 'Creating...' : 'Create Responder'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddResponderModal