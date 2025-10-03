// src/pages/Messages.jsx
import React, { useState, useRef, useEffect } from 'react'
import { 
  Search,
  Filter,
  MoreVertical,
  Phone,
  Video,
  MapPin,
  User,
  Send,
  Paperclip,
  Image,
  Mic,
  Smile,
  Check,
  CheckCheck,
  Clock,
  Mail,
  MessageCircle,
  AlertTriangle,
  Users,
  Archive,
  Trash2
} from 'lucide-react'

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messageInput, setMessageInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const messagesEndRef = useRef(null)

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      type: 'victim',
      name: 'Sarah Johnson',
      phone: '+880 1712-345678',
      emergencyId: 'EMG-2024-0012',
      status: 'active',
      lastMessage: 'I can see the responder approaching my location',
      timestamp: '2 min ago',
      unread: 3,
      avatar: '👩',
      location: 'Gulshan 1, Dhaka'
    },
    {
      id: 2,
      type: 'responder',
      name: 'Officer Ahmed Khan',
      badge: 'PD-2456',
      status: 'available',
      lastMessage: 'Reached the location. Situation under control.',
      timestamp: '5 min ago',
      unread: 0,
      avatar: '👮',
      assignment: 'EMG-2024-0012'
    },
    {
      id: 3,
      type: 'victim',
      name: 'Anonymous User',
      phone: 'Hidden',
      emergencyId: 'EMG-2024-0013',
      status: 'resolved',
      lastMessage: 'Thank you for your help',
      timestamp: '1 hour ago',
      unread: 0,
      avatar: '👤',
      location: 'Dhanmondi, Dhaka'
    },
    {
      id: 4,
      type: 'responder',
      name: 'NGO Team Alpha',
      badge: 'NGO-0123',
      status: 'busy',
      lastMessage: 'Medical assistance provided to victim',
      timestamp: '2 hours ago',
      unread: 1,
      avatar: '🏢',
      assignment: 'EMG-2024-0014'
    },
    {
      id: 5,
      type: 'control',
      name: 'Central Dispatch',
      badge: 'DISP-001',
      status: 'online',
      lastMessage: 'System alert: New emergency in Mirpur area',
      timestamp: '3 hours ago',
      unread: 0,
      avatar: '🛡️'
    }
  ]

  // Mock messages data
  const messagesData = {
    1: [
      {
        id: 1,
        sender: 'victim',
        content: 'Hello? Is anyone there? I need help immediately.',
        timestamp: '14:20',
        status: 'delivered'
      },
      {
        id: 2,
        sender: 'control',
        content: 'Yes, we\'re here. Help is on the way. Can you describe your situation?',
        timestamp: '14:21',
        status: 'read'
      },
      {
        id: 3,
        sender: 'victim',
        content: 'There\'s someone following me near Gulshan 1. I\'m scared.',
        timestamp: '14:22',
        status: 'delivered'
      },
      {
        id: 4,
        sender: 'control',
        content: 'Stay on the line. Officer Khan is 2 minutes away. Can you see any landmarks?',
        timestamp: '14:23',
        status: 'read'
      },
      {
        id: 5,
        sender: 'victim',
        content: 'I\'m near the shopping mall. I can see the responder approaching my location',
        timestamp: '14:24',
        status: 'delivered'
      }
    ],
    2: [
      {
        id: 1,
        sender: 'control',
        content: 'Officer Khan, proceed to Gulshan 1 for emergency EMG-2024-0012',
        timestamp: '14:15',
        status: 'read'
      },
      {
        id: 2,
        sender: 'responder',
        content: 'Acknowledged. En route with ETA 3 minutes.',
        timestamp: '14:16',
        status: 'read'
      },
      {
        id: 3,
        sender: 'control',
        content: 'Victim reports being followed. Exercise caution.',
        timestamp: '14:18',
        status: 'read'
      },
      {
        id: 4,
        sender: 'responder',
        content: 'Reached the location. Situation under control.',
        timestamp: '14:22',
        status: 'read'
      }
    ]
  }

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || conv.type === filter
    return matchesSearch && matchesFilter
  })

  const currentMessages = selectedConversation ? messagesData[selectedConversation.id] || [] : []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentMessages])

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return
    
    // In a real app, this would send the message to the backend
    console.log('Sending message:', messageInput)
    setMessageInput('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCheck className="h-3 w-3 text-blue-500" />
      case 'read': return <CheckCheck className="h-3 w-3 text-green-500" />
      case 'sent': return <Check className="h-3 w-3 text-gray-500" />
      default: return <Clock className="h-3 w-3 text-gray-500" />
    }
  }

  const getConversationStatus = (conversation) => {
    switch (conversation.type) {
      case 'victim':
        return conversation.status === 'active' ? 
          <div className="flex items-center space-x-1">
            <AlertTriangle className="h-3 w-3 text-red-500" />
            <span className="text-red-500 text-xs">Active Emergency</span>
          </div> :
          <span className="text-green-500 text-xs">Resolved</span>
      case 'responder':
        return conversation.status === 'available' ?
          <span className="text-green-500 text-xs">Available</span> :
          <span className="text-orange-500 text-xs">On Duty</span>
      case 'control':
        return <span className="text-blue-500 text-xs">Online</span>
      default:
        return null
    }
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-surface rounded-xl overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-outline flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-outline">
          <h2 className="text-xl font-semibold text-on-surface">Messages</h2>
          <div className="mt-3 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant h-4 w-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full pl-10 pr-4"
              />
            </div>
            
            {/* Filters */}
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                  filter === 'all' 
                    ? 'bg-primary text-on-primary' 
                    : 'bg-surface-variant text-on-surface-variant hover:bg-surface'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('victim')}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                  filter === 'victim' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-surface-variant text-on-surface-variant hover:bg-surface'
                }`}
              >
                Victims
              </button>
              <button
                onClick={() => setFilter('responder')}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                  filter === 'responder' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-surface-variant text-on-surface-variant hover:bg-surface'
                }`}
              >
                Responders
              </button>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            <div className="divide-y divide-outline">
              {filteredConversations.map(conversation => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-primary/10 border-r-2 border-primary'
                      : 'hover:bg-surface-variant'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-xl">
                      {conversation.avatar}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-on-surface truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-on-surface-variant">
                          {conversation.timestamp}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-on-surface-variant truncate">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        {getConversationStatus(conversation)}
                        {conversation.emergencyId && (
                          <span className="text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded-full">
                            {conversation.emergencyId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <MessageCircle className="h-12 w-12 text-on-surface-variant mb-4" />
              <h3 className="text-lg font-semibold text-on-surface mb-2">No conversations</h3>
              <p className="text-on-surface-variant">
                {searchTerm ? 'No conversations match your search' : 'Start a conversation from an emergency'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-outline">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-lg">
                    {selectedConversation.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-on-surface">
                      {selectedConversation.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-on-surface-variant">
                      {getConversationStatus(selectedConversation)}
                      {selectedConversation.phone && (
                        <span className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{selectedConversation.phone}</span>
                        </span>
                      )}
                      {selectedConversation.location && (
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{selectedConversation.location}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors">
                    <Phone className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors">
                    <Video className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'control' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
                      message.sender === 'control'
                        ? 'bg-primary text-on-primary rounded-br-none'
                        : 'bg-surface-variant text-on-surface rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className={`flex items-center justify-end space-x-1 mt-1 text-xs ${
                      message.sender === 'control' ? 'text-on-primary/80' : 'text-on-surface-variant'
                    }`}>
                      <span>{message.timestamp}</span>
                      {message.sender === 'control' && getStatusIcon(message.status)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-outline">
              <div className="flex items-end space-x-3">
                <div className="flex-1 bg-surface-variant rounded-lg border border-outline">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows="1"
                    className="w-full bg-transparent border-none resize-none focus:ring-0 text-on-surface placeholder-on-surface-variant p-3"
                  />
                  <div className="flex items-center justify-between px-3 py-2 border-t border-outline">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-on-surface-variant hover:text-on-surface transition-colors">
                        <Paperclip className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-on-surface-variant hover:text-on-surface transition-colors">
                        <Image className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-on-surface-variant hover:text-on-surface transition-colors">
                        <Smile className="h-4 w-4" />
                      </button>
                    </div>
                    <button className="p-1 text-on-surface-variant hover:text-on-surface transition-colors">
                      <Mic className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={sendMessage}
                  disabled={!messageInput.trim()}
                  className="bg-primary text-on-primary p-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between mt-2 text-xs text-on-surface-variant">
                <div className="flex items-center space-x-4">
                  <span>Emergency communication channel</span>
                  <span>•</span>
                  <span>All messages are logged</span>
                </div>
                <span>Secure connection 🔒</span>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <MessageCircle className="h-16 w-16 text-on-surface-variant mb-4" />
            <h3 className="text-xl font-semibold text-on-surface mb-2">No conversation selected</h3>
            <p className="text-on-surface-variant mb-6 max-w-md">
              Select a conversation from the list to start messaging with victims, responders, or other control center staff.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-surface-variant p-4 rounded-lg">
                <Users className="h-6 w-6 text-primary mb-2 mx-auto" />
                <div className="font-medium text-on-surface">Victim Communication</div>
                <div className="text-on-surface-variant mt-1">Provide real-time support and guidance</div>
              </div>
              <div className="bg-surface-variant p-4 rounded-lg">
                <User className="h-6 w-6 text-blue-500 mb-2 mx-auto" />
                <div className="font-medium text-on-surface">Responder Coordination</div>
                <div className="text-on-surface-variant mt-1">Coordinate emergency response teams</div>
              </div>
              <div className="bg-surface-variant p-4 rounded-lg">
                <Mail className="h-6 w-6 text-green-500 mb-2 mx-auto" />
                <div className="font-medium text-on-surface">Team Collaboration</div>
                <div className="text-on-surface-variant mt-1">Internal communication and updates</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Messages