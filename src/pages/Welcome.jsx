// src/pages/Welcome.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, AlertTriangle, Users, MapPin, BarChart3, Eye } from 'lucide-react'

const Welcome = () => {
  const features = [
    {
      icon: AlertTriangle,
      title: 'Real-time Emergency Alerts',
      description: 'Instant notifications with live location tracking and media capture'
    },
    {
      icon: Users,
      title: 'Responder Coordination',
      description: 'Smart assignment of police, NGOs, and community responders'
    },
    {
      icon: MapPin,
      title: 'Live Location Tracking',
      description: 'Real-time GPS tracking of victims and responders on interactive maps'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Incident hotspots, response metrics, and performance insights'
    },
    {
      icon: Shield,
      title: 'Secure & Anonymous',
      description: 'End-to-end encryption with optional anonymous reporting'
    },
    {
      icon: Eye,
      title: 'Stealth Mode',
      description: 'Discreet emergency activation with fake UI for user safety'
    }
  ]

  const stats = [
    { number: '2.4K', label: 'Emergencies Prevented' },
    { number: '98%', label: 'Response Rate' },
    { number: '4.2min', label: 'Avg Response Time' },
    { number: '500+', label: 'Active Responders' }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-background py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="h-10 w-10 text-on-primary" />
              </div>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-on-surface mb-6">
              Aegis
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant max-w-3xl mx-auto mb-8">
              Smart Safety & Emergency Response System Against Violence and Harassment
            </p>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-12">
              Protecting communities through real-time emergency coordination, 
              intelligent responder dispatch, and comprehensive safety analytics.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/login"
                className="btn-primary text-lg px-8 py-4 rounded-xl font-semibold"
              >
                Access Control Center
              </Link>
              <button className="border-2 border-primary text-primary hover:bg-primary/10 text-lg px-8 py-4 rounded-xl font-semibold transition-colors">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-on-surface-variant text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">
              Comprehensive Safety Ecosystem
            </h2>
            <p className="text-xl text-on-surface-variant max-w-3xl mx-auto">
              Three integrated platforms working together to create safer communities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Victim App Card */}
            <div className="card p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-4">Victim Safety App</h3>
              <p className="text-on-surface-variant mb-6">
                One-tap emergency alerts, discreet media capture, and real-time location sharing with stealth protection.
              </p>
              <ul className="text-left text-on-surface-variant space-y-2 mb-6">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Panic button with fake crash screen
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Automatic location & media sharing
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Anonymous reporting options
                </li>
              </ul>
            </div>

            {/* Control Center Card */}
            <div className="card p-8 text-center hover:shadow-lg transition-shadow border-2 border-primary/20">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-on-primary" />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-4">Control Center</h3>
              <p className="text-on-surface-variant mb-6">
                Central command hub for monitoring emergencies, coordinating responders, and managing incidents in real-time.
              </p>
              <ul className="text-left text-on-surface-variant space-y-2 mb-6">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Live emergency map with tracking
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Smart responder assignment
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Comprehensive analytics dashboard
                </li>
              </ul>
              <Link
                to="/login"
                className="btn-primary w-full"
              >
                Access Dashboard
              </Link>
            </div>

            {/* Responder App Card */}
            <div className="card p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-4">Responder Network</h3>
              <p className="text-on-surface-variant mb-6">
                Mobile platform for police, NGOs, and community responders to receive and manage emergency assignments.
              </p>
              <ul className="text-left text-on-surface-variant space-y-2 mb-6">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Instant emergency notifications
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Built-in navigation to victims
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Status updates and reporting
                </li>
              </ul>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-on-surface mb-3">
                  {feature.title}
                </h3>
                <p className="text-on-surface-variant text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Flow Section */}
      <div className="py-20 px-6 bg-surface-variant">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">
              How Aegis Works
            </h2>
            <p className="text-xl text-on-surface-variant max-w-3xl mx-auto">
              From emergency trigger to resolution - a seamless safety response system
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8 items-center">
            {[
              { step: '1', title: 'Emergency Triggered', desc: 'User activates panic button or app detects distress' },
              { step: '2', title: 'Data Captured', desc: 'Location, audio, images sent to control center' },
              { step: '3', title: 'Control Center Alert', desc: 'Real-time notification with victim details' },
              { step: '4', title: 'Responder Dispatch', desc: 'Nearest available units assigned automatically' },
              { step: '5', title: 'Resolution', desc: 'Incident resolved with full documentation' }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-on-primary font-bold text-xl">
                  {step.step}
                </div>
                <h3 className="font-semibold text-on-surface mb-2">{step.title}</h3>
                <p className="text-sm text-on-surface-variant">{step.desc}</p>
                {index < 4 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-primary/20 -z-10"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-6">
            Ready to Enhance Community Safety?
          </h2>
          <p className="text-xl text-on-surface-variant mb-8 max-w-2xl mx-auto">
            Join the Aegis network and be part of the next generation of emergency response technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="btn-primary text-lg px-8 py-4 rounded-xl font-semibold"
            >
              Access Control Center
            </Link>
            <button className="border-2 border-primary text-primary hover:bg-primary/10 text-lg px-8 py-4 rounded-xl font-semibold transition-colors">
              Request Demo
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-surface border-t border-outline py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-on-primary" />
              </div>
              <div>
                <h3 className="font-bold text-on-surface">Aegis</h3>
                <p className="text-sm text-on-surface-variant">Safety Shield System</p>
              </div>
            </div>
            <div className="text-on-surface-variant text-sm">
              © 2024 Aegis Safety System. Protecting communities worldwide.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Welcome