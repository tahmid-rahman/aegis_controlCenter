// src/pages/Resources.jsx
import React, { useState } from 'react'
import { 
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  Play,
  FileText,
  Video,
  HelpCircle,
  Bookmark,
  BookmarkCheck,
  Filter,
  Search,
  Download,
  Upload,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Save,
  X,
  Link,
  Image
} from 'lucide-react'

const Resources = () => {
  const [activeTab, setActiveTab] = useState('resources')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [selectedResource, setSelectedResource] = useState(null)
  const [editingResource, setEditingResource] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)

  // Mock data based on your Django models
  const resourceCategories = [
    { id: 1, name: 'Self Defense', description: 'Personal protection techniques', icon: '🥋', order: 1, is_active: true },
    { id: 2, name: 'Legal Rights', description: 'Know your legal protections', icon: '⚖️', order: 2, is_active: true },
    { id: 3, name: 'Emergency Procedures', description: 'What to do in emergencies', icon: '🚨', order: 3, is_active: true },
    { id: 4, name: 'Digital Safety', description: 'Online protection guides', icon: '💻', order: 4, is_active: true },
    { id: 5, name: 'Community Resources', description: 'Local support organizations', icon: '🏘️', order: 5, is_active: true }
  ]

  const learningResources = [
    {
      id: 1,
      title: 'Basic Self-Defense Techniques',
      description: 'Learn fundamental self-defense moves for personal protection',
      content: '# Basic Self-Defense Techniques\n\n## Introduction\nSelf-defense is about using simple, effective techniques to protect yourself...',
      resource_type: 'article',
      difficulty: 'beginner',
      duration: '8 min read',
      icon: '📄',
      category: 1,
      video_url: null,
      thumbnail: null,
      is_published: true,
      order: 1,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      external_links: [
        { id: 1, title: 'Self-Defense Video Tutorial', url: 'https://example.com/video1', description: 'Complementary video tutorial' }
      ],
      quiz_questions: [
        {
          id: 1,
          question: 'What is the primary goal of self-defense?',
          explanation: 'The main goal is to create an opportunity to escape safely, not to defeat the attacker.',
          order: 1,
          options: [
            { id: 1, text: 'To defeat the attacker completely', is_correct: false, order: 1 },
            { id: 2, text: 'To create an opportunity to escape', is_correct: true, order: 2 },
            { id: 3, text: 'To prove your strength', is_correct: false, order: 3 }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Understanding Your Legal Rights',
      description: 'Comprehensive guide to legal protections against harassment',
      content: '# Your Legal Rights\n\n## Introduction\nIn Bangladesh, several laws protect individuals from harassment and violence...',
      resource_type: 'guide',
      difficulty: 'intermediate',
      duration: '15 min read',
      icon: '📖',
      category: 2,
      video_url: null,
      thumbnail: null,
      is_published: true,
      order: 1,
      created_at: '2024-01-10T14:30:00Z',
      updated_at: '2024-01-12T09:15:00Z',
      external_links: [],
      quiz_questions: []
    },
    {
      id: 3,
      title: 'Emergency Response Quiz',
      description: 'Test your knowledge of emergency procedures',
      resource_type: 'quiz',
      difficulty: 'beginner',
      duration: '5 min',
      icon: '❓',
      category: 3,
      content: '',
      video_url: null,
      thumbnail: null,
      is_published: true,
      order: 1,
      created_at: '2024-01-08T16:45:00Z',
      updated_at: '2024-01-08T16:45:00Z',
      external_links: [],
      quiz_questions: [
        {
          id: 2,
          question: 'What should be your first action when activating emergency mode?',
          explanation: 'Your safety is the priority. First ensure you are in a safe position, then activate emergency features.',
          order: 1,
          options: [
            { id: 4, text: 'Start recording video immediately', is_correct: false, order: 1 },
            { id: 5, text: 'Ensure you are in a safe position', is_correct: true, order: 2 },
            { id: 6, text: 'Call your family first', is_correct: false, order: 3 }
          ]
        }
      ]
    }
  ]

  // Form states
  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    content: '',
    resource_type: 'article',
    difficulty: 'beginner',
    duration: '',
    category: '',
    video_url: '',
    is_published: false,
    external_links: [{ title: '', url: '', description: '' }]
  })

  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    difficulty: 'beginner',
    duration: '5 min',
    category: '',
    is_published: false,
    questions: [
      {
        question: '',
        explanation: '',
        options: [
          { text: '', is_correct: false },
          { text: '', is_correct: false },
          { text: '', is_correct: false },
          { text: '', is_correct: false }
        ]
      }
    ]
  })

  const userProgress = [
    { resource_id: 1, completed: true, progress_percentage: 100, bookmarked: true, time_spent: 480 },
    { resource_id: 2, completed: false, progress_percentage: 60, bookmarked: false, time_spent: 540 }
  ]

  const getResourceIcon = (resourceType) => {
    switch (resourceType) {
      case 'article': return '📄'
      case 'video': return '🎥'
      case 'quiz': return '❓'
      case 'guide': return '📖'
      case 'tutorial': return '🎯'
      default: return '📚'
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-500 bg-green-500/10'
      case 'intermediate': return 'text-yellow-500 bg-yellow-500/10'
      case 'advanced': return 'text-red-500 bg-red-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getTypeColor = (resourceType) => {
    switch (resourceType) {
      case 'article': return 'text-blue-500 bg-blue-500/10'
      case 'video': return 'text-purple-500 bg-purple-500/10'
      case 'quiz': return 'text-orange-500 bg-orange-500/10'
      case 'guide': return 'text-green-500 bg-green-500/10'
      case 'tutorial': return 'text-pink-500 bg-pink-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  const filteredResources = learningResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || resource.category?.toString() === categoryFilter
    const matchesType = typeFilter === 'all' || resource.resource_type === typeFilter
    const matchesDifficulty = difficultyFilter === 'all' || resource.difficulty === difficultyFilter
    
    return matchesSearch && matchesCategory && matchesType && matchesDifficulty
  })

  const stats = {
    totalResources: learningResources.length,
    publishedResources: learningResources.filter(r => r.is_published).length,
    totalQuizzes: learningResources.filter(r => r.resource_type === 'quiz').length,
    activeUsers: 1542
  }

  const handleDeleteResource = (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      // API call to delete resource
      console.log('Deleting resource:', resourceId)
    }
  }

  const handleTogglePublish = (resource) => {
    // API call to toggle publish status
    console.log('Toggling publish status for:', resource.id)
  }

  const handleResourceInputChange = (field, value) => {
    setResourceForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleQuizInputChange = (field, value) => {
    setQuizForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddExternalLink = () => {
    setResourceForm(prev => ({
      ...prev,
      external_links: [...prev.external_links, { title: '', url: '', description: '' }]
    }))
  }

  const handleRemoveExternalLink = (index) => {
    setResourceForm(prev => ({
      ...prev,
      external_links: prev.external_links.filter((_, i) => i !== index)
    }))
  }

  const handleExternalLinkChange = (index, field, value) => {
    const updatedLinks = [...resourceForm.external_links]
    updatedLinks[index][field] = value
    setResourceForm(prev => ({
      ...prev,
      external_links: updatedLinks
    }))
  }

  const handleAddQuestion = () => {
    setQuizForm(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: '',
          explanation: '',
          options: [
            { text: '', is_correct: false },
            { text: '', is_correct: false },
            { text: '', is_correct: false },
            { text: '', is_correct: false }
          ]
        }
      ]
    }))
  }

  const handleRemoveQuestion = (index) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }))
  }

  const handleQuestionChange = (questionIndex, field, value) => {
    const updatedQuestions = [...quizForm.questions]
    updatedQuestions[questionIndex][field] = value
    setQuizForm(prev => ({
      ...prev,
      questions: updatedQuestions
    }))
  }

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...quizForm.questions]
    updatedQuestions[questionIndex].options[optionIndex][field] = value
    setQuizForm(prev => ({
      ...prev,
      questions: updatedQuestions
    }))
  }

  const handleSetCorrectAnswer = (questionIndex, optionIndex) => {
    const updatedQuestions = [...quizForm.questions]
    // Set all options to false first
    updatedQuestions[questionIndex].options.forEach(option => {
      option.is_correct = false
    })
    // Set the selected option to correct
    updatedQuestions[questionIndex].options[optionIndex].is_correct = true
    setQuizForm(prev => ({
      ...prev,
      questions: updatedQuestions
    }))
  }

  const handleCreateResource = () => {
    // Validate form
    if (!resourceForm.title || !resourceForm.description || !resourceForm.category) {
      alert('Please fill in all required fields')
      return
    }

    if (resourceForm.resource_type === 'video' && !resourceForm.video_url) {
      alert('Video resources require a video URL')
      return
    }

    // API call to create resource
    console.log('Creating resource:', resourceForm)
    setShowAddModal(false)
    setResourceForm({
      title: '',
      description: '',
      content: '',
      resource_type: 'article',
      difficulty: 'beginner',
      duration: '',
      category: '',
      video_url: '',
      is_published: false,
      external_links: [{ title: '', url: '', description: '' }]
    })
  }

  const handleCreateQuiz = () => {
    // Validate form
    if (!quizForm.title || !quizForm.description || !quizForm.category) {
      alert('Please fill in all required fields')
      return
    }

    // Validate questions
    for (let question of quizForm.questions) {
      if (!question.question.trim()) {
        alert('All questions must have text')
        return
      }
      const hasCorrectAnswer = question.options.some(opt => opt.is_correct)
      if (!hasCorrectAnswer) {
        alert('Each question must have one correct answer')
        return
      }
    }

    // API call to create quiz
    console.log('Creating quiz:', quizForm)
    setShowQuizModal(false)
    setQuizForm({
      title: '',
      description: '',
      difficulty: 'beginner',
      duration: '5 min',
      category: '',
      is_published: false,
      questions: [
        {
          question: '',
          explanation: '',
          options: [
            { text: '', is_correct: false },
            { text: '', is_correct: false },
            { text: '', is_correct: false },
            { text: '', is_correct: false }
          ]
        }
      ]
    })
  }

  const renderResourcesTab = () => (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant h-4 w-4" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full pl-10 pr-4"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Categories</option>
              {resourceCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="article">Articles</option>
              <option value="video">Videos</option>
              <option value="quiz">Quizzes</option>
              <option value="guide">Guides</option>
              <option value="tutorial">Tutorials</option>
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => {
          const progress = userProgress.find(p => p.resource_id === resource.id)
          const category = resourceCategories.find(c => c.id === resource.category)
          
          return (
            <div key={resource.id} className="card p-6 group hover:shadow-lg transition-all">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {getResourceIcon(resource.resource_type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant">
                      {category?.name || 'Uncategorized'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setEditingResource(resource)}
                    className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteResource(resource.id)}
                    className="p-1 text-on-surface-variant hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">
                {resource.description}
              </p>

              {/* Metadata */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.resource_type)}`}>
                    {resource.resource_type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                    {resource.difficulty}
                  </span>
                </div>
                <div className="text-sm text-on-surface-variant">
                  {resource.duration}
                </div>
              </div>

              {/* Progress */}
              {progress && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-on-surface-variant mb-1">
                    <span>Progress</span>
                    <span>{progress.progress_percentage}%</span>
                  </div>
                  <div className="w-full bg-surface-variant rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${progress.progress_percentage}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button className="flex-1 btn-primary py-2 text-sm flex items-center justify-center space-x-1">
                  {resource.resource_type === 'quiz' ? (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Start Quiz</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </>
                  )}
                </button>
                
                <button className="p-2 bg-surface-variant text-on-surface hover:bg-surface rounded transition-colors">
                  {progress?.bookmarked ? (
                    <BookmarkCheck className="h-4 w-4 text-primary" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </button>

                <button
                  onClick={() => handleTogglePublish(resource)}
                  className={`p-2 rounded transition-colors ${
                    resource.is_published 
                      ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                      : 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
                  }`}
                >
                  {resource.is_published ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Quiz Info */}
              {resource.resource_type === 'quiz' && resource.quiz_questions && (
                <div className="mt-3 pt-3 border-t border-outline">
                  <div className="text-xs text-on-surface-variant">
                    {resource.quiz_questions.length} questions
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <div className="card p-12 text-center">
          <BookOpen className="h-16 w-16 text-on-surface-variant mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-on-surface mb-2">No resources found</h3>
          <p className="text-on-surface-variant mb-6">
            {learningResources.length === 0 
              ? "Get started by creating your first learning resource."
              : "Try adjusting your search criteria."
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Resource</span>
            </button>
            <button 
              onClick={() => setShowQuizModal(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center space-x-2"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Create Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Total Resources</p>
              <p className="text-2xl font-bold text-on-surface mt-1">{stats.totalResources}</p>
            </div>
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Published</p>
              <p className="text-2xl font-bold text-green-500 mt-1">{stats.publishedResources}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Quizzes</p>
              <p className="text-2xl font-bold text-orange-500 mt-1">{stats.totalQuizzes}</p>
            </div>
            <HelpCircle className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Active Learners</p>
              <p className="text-2xl font-bold text-blue-500 mt-1">{stats.activeUsers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Popular Resources */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold text-on-surface mb-4">Popular Resources</h3>
        <div className="space-y-3">
          {learningResources.slice(0, 3).map(resource => {
            const progress = userProgress.find(p => p.resource_id === resource.id)
            return (
              <div key={resource.id} className="flex items-center justify-between p-3 bg-surface-variant rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-xl">
                    {getResourceIcon(resource.resource_type)}
                  </div>
                  <div>
                    <div className="font-medium text-on-surface">{resource.title}</div>
                    <div className="text-sm text-on-surface-variant">
                      {progress?.progress_percentage || 0}% completion rate
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-on-surface">
                    {progress?.time_spent ? Math.floor(progress.time_spent / 60) : 0} min
                  </div>
                  <div className="text-xs text-on-surface-variant">avg. time</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderCreateResourceModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-outline">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-on-surface">Create New Resource</h3>
            <button
              onClick={() => setShowAddModal(false)}
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-on-surface-variant mt-1">Add new educational content</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Resource Type *
                </label>
                <select 
                  value={resourceForm.resource_type}
                  onChange={(e) => handleResourceInputChange('resource_type', e.target.value)}
                  className="input-field w-full"
                >
                  <option value="article">Article</option>
                  <option value="video">Video</option>
                  <option value="guide">Guide</option>
                  <option value="tutorial">Tutorial</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Title *
                </label>
                <input 
                  type="text" 
                  value={resourceForm.title}
                  onChange={(e) => handleResourceInputChange('title', e.target.value)}
                  className="input-field w-full" 
                  placeholder="Enter resource title" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Description *
                </label>
                <textarea 
                  value={resourceForm.description}
                  onChange={(e) => handleResourceInputChange('description', e.target.value)}
                  className="input-field w-full h-24" 
                  placeholder="Enter resource description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Category *
                  </label>
                  <select 
                    value={resourceForm.category}
                    onChange={(e) => handleResourceInputChange('category', e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="">Select Category</option>
                    {resourceCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Difficulty
                  </label>
                  <select 
                    value={resourceForm.difficulty}
                    onChange={(e) => handleResourceInputChange('difficulty', e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Duration
                </label>
                <input 
                  type="text" 
                  value={resourceForm.duration}
                  onChange={(e) => handleResourceInputChange('duration', e.target.value)}
                  className="input-field w-full" 
                  placeholder="e.g., '5 min read', '10 min video'" 
                />
              </div>

              {resourceForm.resource_type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Video URL *
                  </label>
                  <div className="relative">
                    <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant h-4 w-4" />
                    <input 
                      type="url" 
                      value={resourceForm.video_url}
                      onChange={(e) => handleResourceInputChange('video_url', e.target.value)}
                      className="input-field w-full pl-10" 
                      placeholder="https://example.com/video" 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Content & Links */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Content (Markdown)
                </label>
                <textarea 
                  value={resourceForm.content}
                  onChange={(e) => handleResourceInputChange('content', e.target.value)}
                  className="input-field w-full h-48 font-mono text-sm" 
                  placeholder="# Your content here...&#10;## Use markdown formatting"
                />
              </div>

              {/* External Links */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-on-surface">
                    External Links
                  </label>
                  <button
                    onClick={handleAddExternalLink}
                    className="text-primary hover:text-primary/80 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Link</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {resourceForm.external_links.map((link, index) => (
                    <div key={index} className="p-3 bg-surface-variant rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-on-surface">Link {index + 1}</h4>
                        {resourceForm.external_links.length > 1 && (
                          <button
                            onClick={() => handleRemoveExternalLink(index)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      
                      <input
                        type="text"
                        value={link.title}
                        onChange={(e) => handleExternalLinkChange(index, 'title', e.target.value)}
                        className="input-field w-full text-sm"
                        placeholder="Link title"
                      />
                      
                      <div className="relative">
                        <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant h-4 w-4" />
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => handleExternalLinkChange(index, 'url', e.target.value)}
                          className="input-field w-full text-sm pl-10"
                          placeholder="https://example.com"
                        />
                      </div>
                      
                      <textarea
                        value={link.description}
                        onChange={(e) => handleExternalLinkChange(index, 'description', e.target.value)}
                        className="input-field w-full text-sm h-16"
                        placeholder="Link description (optional)"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center justify-between p-3 bg-surface-variant rounded-lg">
                <div>
                  <div className="font-medium text-on-surface">Publish Resource</div>
                  <div className="text-sm text-on-surface-variant">Make this resource available to users</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={resourceForm.is_published}
                    onChange={(e) => handleResourceInputChange('is_published', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button 
              onClick={() => setShowAddModal(false)}
              className="flex-1 bg-surface-variant text-on-surface py-2 rounded-lg hover:bg-surface transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreateResource}
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Create Resource</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCreateQuizModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-outline">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-on-surface">Create New Quiz</h3>
            <button
              onClick={() => setShowQuizModal(false)}
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-on-surface-variant mt-1">Create an interactive quiz to test knowledge</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Title *
                </label>
                <input 
                  type="text" 
                  value={quizForm.title}
                  onChange={(e) => handleQuizInputChange('title', e.target.value)}
                  className="input-field w-full" 
                  placeholder="Enter quiz title" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Description *
                </label>
                <textarea 
                  value={quizForm.description}
                  onChange={(e) => handleQuizInputChange('description', e.target.value)}
                  className="input-field w-full h-24" 
                  placeholder="Enter quiz description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Category *
                  </label>
                  <select 
                    value={quizForm.category}
                    onChange={(e) => handleQuizInputChange('category', e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="">Select Category</option>
                    {resourceCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Difficulty
                  </label>
                  <select 
                    value={quizForm.difficulty}
                    onChange={(e) => handleQuizInputChange('difficulty', e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Duration
                </label>
                <input 
                  type="text" 
                  value={quizForm.duration}
                  onChange={(e) => handleQuizInputChange('duration', e.target.value)}
                  className="input-field w-full" 
                  placeholder="e.g., '5 min', '10 min'" 
                />
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center justify-between p-3 bg-surface-variant rounded-lg">
                <div>
                  <div className="font-medium text-on-surface">Publish Quiz</div>
                  <div className="text-sm text-on-surface-variant">Make this quiz available to users</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quizForm.is_published}
                    onChange={(e) => handleQuizInputChange('is_published', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            {/* Right Column - Questions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-on-surface">
                  Quiz Questions
                </label>
                <button
                  onClick={handleAddQuestion}
                  className="text-primary hover:text-primary/80 text-sm flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Question</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {quizForm.questions.map((question, questionIndex) => (
                  <div key={questionIndex} className="p-4 bg-surface-variant rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium text-on-surface">Question {questionIndex + 1}</h4>
                      {quizForm.questions.length > 1 && (
                        <button
                          onClick={() => handleRemoveQuestion(questionIndex)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-on-surface mb-1">
                        Question Text *
                      </label>
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
                        className="input-field w-full text-sm"
                        placeholder="Enter your question"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-on-surface mb-1">
                        Explanation
                      </label>
                      <textarea
                        value={question.explanation}
                        onChange={(e) => handleQuestionChange(questionIndex, 'explanation', e.target.value)}
                        className="input-field w-full text-sm h-16"
                        placeholder="Explanation for the correct answer (optional)"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-on-surface">
                        Options * (Select one correct answer)
                      </label>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <button
                            onClick={() => handleSetCorrectAnswer(questionIndex, optionIndex)}
                            className={`flex-shrink-0 w-4 h-4 rounded-full border-2 ${
                              option.is_correct 
                                ? 'bg-primary border-primary' 
                                : 'border-on-surface-variant'
                            }`}
                          />
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) => handleOptionChange(questionIndex, optionIndex, 'text', e.target.value)}
                            className="input-field flex-1 text-sm"
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button 
              onClick={() => setShowQuizModal(false)}
              className="flex-1 bg-surface-variant text-on-surface py-2 rounded-lg hover:bg-surface transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreateQuiz}
              className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Create Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-on-surface mb-2">Learning Resources</h1>
            <p className="text-on-surface-variant">
              Educational content and quizzes for safety and awareness
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
            <button 
              onClick={() => setShowQuizModal(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center space-x-2"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Create Quiz</span>
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Resource</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-surface-variant p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'resources'
                ? 'bg-surface text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Resources
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-surface text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Content */}
        {activeTab === 'resources' && renderResourcesTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}

        {/* Modals */}
        {showAddModal && renderCreateResourceModal()}
        {showQuizModal && renderCreateQuizModal()}
      </div>
    </div>
  )
}

export default Resources