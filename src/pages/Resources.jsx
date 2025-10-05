// src/pages/Resources.jsx
import React, { useState, useEffect } from 'react'
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
  Image,
  Loader,
  FolderPlus
} from 'lucide-react'
import api from '../services/api'

const Resources = () => {
  const [activeTab, setActiveTab] = useState('resources')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [selectedResource, setSelectedResource] = useState(null)
  const [editingResource, setEditingResource] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [resourceCategories, setResourceCategories] = useState([])
  const [learningResources, setLearningResources] = useState([])
  const [userProgress, setUserProgress] = useState([])
  const [showViewModal, setShowViewModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showStartQuizModal, setShowStartQuizModal] = useState(false)
  const [showUpdateQuizModal, setShowUpdateQuizModal] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
    const [quizResults, setQuizResults] = useState(null)
  const [quizTimer, setQuizTimer] = useState(0);
  const [quizTimeLimit, setQuizTimeLimit] = useState(null);
  const [isTimeUp, setIsTimeUp] = useState(false); 
  const [stats, setStats] = useState({
    totalResources: 0,
    publishedResources: 0,
    totalQuizzes: 0,
    activeUsers: 0
  })

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

  const parseDurationToSeconds = (duration) => {
  if (!duration) return null;
  
  const timeUnits = {
    'min': 60,
    'mins': 60,
    'minute': 60,
    'minutes': 60,
    'hour': 3600,
    'hours': 3600,
    'sec': 1,
    'secs': 1,
    'second': 1,
    'seconds': 1
  };

  // Extract numbers and units from the duration string
  const match = duration.match(/(\d+)\s*(\w+)/);
  if (match) {
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    return value * (timeUnits[unit] || 60); // Default to minutes if unit not recognized
  }
  
  // Fallback: try to extract just numbers
  const numbers = duration.match(/\d+/);
  if (numbers) {
    return parseInt(numbers[0]) * 60; // Assume minutes if no unit specified
  }
  
  return null; // Could not parse duration
};

const handleAutoSubmit = async () => {
  if (isTimeUp) return; // Prevent multiple submissions
  
  setIsTimeUp(true);
  await handleSubmitQuiz();
};
  
useEffect(() => {
  let interval;
  if (showStartQuizModal && !quizResults && !isTimeUp) {
    interval = setInterval(() => {
      setQuizTimer(prev => {
        const newTime = prev + 1;
        
        // Check if time limit is reached
        if (quizTimeLimit && newTime >= quizTimeLimit) {
          setIsTimeUp(true);
          handleAutoSubmit(); // Auto-submit when time is up
          return quizTimeLimit;
        }
        
        return newTime;
      });
    }, 1000);
  }
  return () => clearInterval(interval);
}, [showStartQuizModal, quizResults, isTimeUp, quizTimeLimit]);


  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    content: 'Quiz content', // Required field for backend
    resource_type: 'quiz',
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

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    icon: '📚',
    order: 0,
    is_active: true
  })

  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [categoriesRes, resourcesRes, progressRes] = await Promise.all([
        api.get('/aegis/learn/categories/'),
        api.get('/aegis/learn/resources/'),
        api.get('/aegis/learn/progress/')
      ])

      setResourceCategories(categoriesRes.data)
      setLearningResources(resourcesRes.data)
      setUserProgress(progressRes.data)

      // Calculate stats
      const totalResources = resourcesRes.data.length
      const publishedResources = resourcesRes.data.filter(r => r.is_published).length
      const totalQuizzes = resourcesRes.data.filter(r => r.resource_type === 'quiz').length

      setStats({
        totalResources,
        publishedResources,
        totalQuizzes,
        activeUsers: 1542
      })
    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

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

  const handleDeleteResource = async (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      try {
        await api.delete(`/aegis/learn/resources/${resourceId}/delete/`)
        setLearningResources(prev => prev.filter(r => r.id !== resourceId))
      } catch (error) {
        console.error('Error deleting resource:', error)
        alert('Failed to delete resource', error.response?.data?.message || '')
      }
    }
  }

  const handleTogglePublish = async (resource) => {
    try {
      const updatedResource = { ...resource, is_published: !resource.is_published }
      await api.put(`/aegis/learn/resources/${resource.id}/update-visibility/`, updatedResource)
      
      setLearningResources(prev => 
        prev.map(r => r.id === resource.id ? updatedResource : r)
      )
    } catch (error) {
      console.error('Error updating resource:', error)
      alert('Failed to update resource')
    }
  }

  const handleToggleBookmark = async (resourceId) => {
    try {
      const response = await api.post(`/aegis/learn/resources/${resourceId}/bookmark/`)
      const { bookmarked } = response.data
      
      setUserProgress(prev => 
        prev.map(p => 
          p.resource === resourceId 
            ? { ...p, bookmarked }
            : p
        )
      )
    } catch (error) {
      console.error('Error toggling bookmark:', error)
      alert('Failed to update bookmark')
    }
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

  const handleCategoryInputChange = (field, value) => {
    setCategoryForm(prev => ({
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
    updatedQuestions[questionIndex].options.forEach(option => {
      option.is_correct = false
    })
    updatedQuestions[questionIndex].options[optionIndex].is_correct = true
    setQuizForm(prev => ({
      ...prev,
      questions: updatedQuestions
    }))
  }

  const handleCreateResource = async () => {
    if (!resourceForm.title || !resourceForm.description || !resourceForm.category) {
      alert('Please fill in all required fields')
      return
    }

    if (resourceForm.resource_type === 'video' && !resourceForm.video_url) {
      alert('Video resources require a video URL')
      return
    }

    try {
      const resourceData = {
        title: resourceForm.title,
        description: resourceForm.description,
        content: resourceForm.content,
        resource_type: resourceForm.resource_type,
        difficulty: resourceForm.difficulty,
        duration: resourceForm.duration,
        category: parseInt(resourceForm.category),
        video_url: resourceForm.video_url || '',
        is_published: resourceForm.is_published
      }

      const response = await api.post('/aegis/learn/resources/create/', resourceData)
      
      // Create external links if any
      if (resourceForm.external_links.length > 0) {
        const resourceId = response.data.data.id
        for (let link of resourceForm.external_links) {
          if (link.title && link.url) {
            await api.post(`/aegis/learn/resources/${resourceId}/external-links/create/`, {
              title: link.title,
              url: link.url,
              description: link.description || ''
            })
          }
        }
      }

      setLearningResources(prev => [...prev, response.data.data])
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
      
      // alert('Resource created successfully')
    } catch (error) {
      console.error('Error creating resource:', error)
      console.log('Error details:', error.response?.data)
      alert(`Failed to create resource: ${error.response?.data?.message || 'Unknown error'}`)
    }
  }

  const handleCreateQuiz = async () => {
    if (!quizForm.title || !quizForm.description || !quizForm.category) {
      alert('Please fill in all required fields')
      return
    }

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

    try {
      const quizResourceData = {
        title: quizForm.title,
        description: quizForm.description,
        content: quizForm.content,
        resource_type: 'quiz',
        difficulty: quizForm.difficulty,
        duration: quizForm.duration,
        category: parseInt(quizForm.category),
        is_published: quizForm.is_published
      }

      const resourceResponse = await api.post('/aegis/learn/resources/create/', quizResourceData)
      const resourceId = resourceResponse.data.data.id

      // Create questions and options
      for (let question of quizForm.questions) {
        const questionData = {
          question: question.question,
          explanation: question.explanation,
          order: 0
        }

        const questionResponse = await api.post(`/aegis/learn/resources/${resourceId}/quiz-questions/create/`, questionData)
        const questionId = questionResponse.data.data.id

        // Create options for this question
        for (let option of question.options) {
          if (option.text.trim()) {
            await api.post(`/aegis/learn/quiz-questions/${questionId}/options/create/`, {
              text: option.text,
              is_correct: option.is_correct,
              order: 0
            })
          }
        }
      }

      await fetchData()
      setShowQuizModal(false)
      setQuizForm({
        title: '',
        description: '',
        content: 'Quiz content',
        resource_type: 'quiz',
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
      
      // alert('Quiz created successfully')
    } catch (error) {
      console.error('Error creating quiz:', error)
      console.log('Error details:', error.response?.data)
      alert(`Failed to create quiz: ${error.response?.data?.message || 'Unknown error'}`)
    }
  }

  const handleCreateCategory = async () => {
    if (!categoryForm.name.trim()) {
      alert('Please enter a category name')
      return
    }

    try {
      const categoryData = {
        name: categoryForm.name,
        description: categoryForm.description,
        icon: categoryForm.icon,
        order: parseInt(categoryForm.order) || 0,
        is_active: categoryForm.is_active
      }

      await api.post('/aegis/learn/categories/create/', categoryData)
      await fetchData()
      setShowCategoryModal(false)
      setCategoryForm({
        name: '',
        description: '',
        icon: '📚',
        order: 0,
        is_active: true
      })
      // alert('Category created successfully')
    } catch (error) {
      console.error('Error creating category:', error)
      console.log('Error details:', error.response?.data)
      alert(`Failed to create category: ${error.response?.data?.message || 'Unknown error'}`)
    }
  }

  const getProgressForResource = (resourceId) => {
    return userProgress.find(p => p.resource === resourceId)
  }

  const isBookmarked = (resourceId) => {
    const progress = getProgressForResource(resourceId)
    return progress?.bookmarked || false
  }
  const handleEditResource = (resource) => {
  setEditingResource(resource)
  setResourceForm({
    title: resource.title,
    description: resource.description,
    content: resource.content,
    resource_type: resource.resource_type,
    difficulty: resource.difficulty,
    duration: resource.duration,
    category: resource.category?.toString() || '',
    video_url: resource.video_url || '',
    is_published: resource.is_published,
    external_links: resource.external_links?.length > 0 
      ? resource.external_links 
      : [{ title: '', url: '', description: '' }]
  })
  setShowUpdateModal(true)
}

const handleStartQuiz = (resource) => {

  if (!resource.quiz_questions || resource.quiz_questions.length === 0) {
    alert('This quiz has no questions yet.');
    return;
  }
  const timeLimit = parseDurationToSeconds(resource.duration);

  setCurrentQuiz(resource);
  setCurrentQuestionIndex(0);
  setUserAnswers({});
  setQuizResults(null);
  setQuizTimer(0);
  setQuizTimeLimit(timeLimit);
  setIsTimeUp(false);
  setShowStartQuizModal(true);
}

const handleViewResource = (resource) => {
  setSelectedResource(resource)
  setShowViewModal(true)
}

const handleEditQuiz = (resource) => {
  setEditingResource(resource)
  // Fetch quiz details including questions and options
  fetchQuizDetails(resource.id)
}

const fetchQuizDetails = async (quizId) => {
  try {
    setLoading(true)
    const response = await api.get(`/aegis/learn/resources/${quizId}/`)
    const quiz = response.data
    
    // Transform quiz data to match quizForm structure
    const questions = quiz.quiz_questions?.map(q => ({
      question: q.question,
      explanation: q.explanation,
      options: q.options?.map(opt => ({
        text: opt.text,
        is_correct: opt.is_correct
      })) || [
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false }
      ]
    })) || [
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

    setQuizForm({
      title: quiz.title,
      description: quiz.description,
      content: quiz.content,
      resource_type: 'quiz',
      difficulty: quiz.difficulty,
      duration: quiz.duration,
      category: quiz.category?.toString() || '',
      is_published: quiz.is_published,
      questions: questions
    })
    
    setShowUpdateQuizModal(true)
  } catch (error) {
    console.error('Error fetching quiz details:', error)
    alert('Failed to load quiz details')
  } finally {
    setLoading(false)
  }
}

const handleUpdateResource = async () => {
  if (!resourceForm.title || !resourceForm.description || !resourceForm.category) {
    alert('Please fill in all required fields')
    return
  }

  try {
    const resourceData = {
      title: resourceForm.title,
      description: resourceForm.description,
      content: resourceForm.content,
      resource_type: resourceForm.resource_type,
      difficulty: resourceForm.difficulty,
      duration: resourceForm.duration,
      category: parseInt(resourceForm.category),
      video_url: resourceForm.video_url || '',
      is_published: resourceForm.is_published
    }

    console.log('Updating resource with data:', resourceData)
    
    // Update the main resource
    const response = await api.put(`/aegis/learn/resources/${editingResource.id}/update/`, resourceData)
    console.log('Resource update response:', response.data)

    // Update external links
    if (resourceForm.external_links.length > 0) {
      // First, delete existing links
      const existingLinks = editingResource.external_links || []
      console.log('Deleting existing links:', existingLinks.length)
      
      for (let link of existingLinks) {
        try {
          await api.delete(`/aegis/learn/external-links/${link.id}/delete/`)
          console.log('Deleted link:', link.id)
        } catch (error) {
          console.error('Error deleting link:', link.id, error)
          // Continue with other links even if one fails
        }
      }
      
      // Create new links
      console.log('Creating new links:', resourceForm.external_links.length)
      for (let link of resourceForm.external_links) {
        if (link.title && link.url) {
          try {
            const linkResponse = await api.post(`/aegis/learn/resources/${editingResource.id}/external-links/create/`, {
              title: link.title,
              url: link.url,
              description: link.description || ''
            })
            console.log('Created link:', linkResponse.data)
          } catch (error) {
            console.error('Error creating link:', link, error)
            // Continue with other links even if one fails
          }
        }
      }
    }

    await fetchData()
    setShowUpdateModal(false)
    setEditingResource(null)
    
  } catch (error) {
    console.error('Error updating resource:', error)
    console.error('Error details:', error.response?.data)
    alert(`Failed to update resource: ${error.response?.data?.message || error.response?.data?.error || 'Unknown error'}`)
  }
}

const handleUpdateQuiz = async () => {
  if (!quizForm.title || !quizForm.description || !quizForm.category) {
    alert('Please fill in all required fields')
    return
  }

  try {
    // Update quiz resource
    const quizResourceData = {
      title: quizForm.title,
      description: quizForm.description,
      content: quizForm.content,
      resource_type: 'quiz',
      difficulty: quizForm.difficulty,
      duration: quizForm.duration,
      category: parseInt(quizForm.category),
      is_published: quizForm.is_published
    }

    console.log('Updating quiz resource with data:', quizResourceData)
    const resourceResponse = await api.put(`/aegis/learn/resources/${editingResource.id}/update/`, quizResourceData)
    console.log('Quiz resource update response:', resourceResponse.data)

    // Update questions and options
    const existingQuestions = editingResource.quiz_questions || []
    
    // Delete existing questions and options
    console.log('Deleting existing questions:', existingQuestions.length)
    for (let question of existingQuestions) {
      try {
        await api.delete(`/aegis/learn/quiz-questions/${question.id}/delete/`)
        console.log('Deleted question:', question.id)
      } catch (error) {
        console.error('Error deleting question:', question.id, error)
        // Continue with other questions even if one fails
      }
    }

    // Create new questions and options
    console.log('Creating new questions:', quizForm.questions.length)
    for (let [index, question] of quizForm.questions.entries()) {
      const questionData = {
        question: question.question,
        explanation: question.explanation,
        order: index
      }

      console.log('Creating question:', questionData)
      const questionResponse = await api.post(`/aegis/learn/resources/${editingResource.id}/quiz-questions/create/`, questionData)
      const questionId = questionResponse.data.data.id
      console.log('Question created with ID:', questionId)

      // Create options for this question
      console.log('Creating options for question:', question.options.length)
      for (let [optIndex, option] of question.options.entries()) {
        if (option.text.trim()) {
          const optionData = {
            text: option.text,
            is_correct: option.is_correct,
            order: optIndex
          }
          
          console.log('Creating option:', optionData)
          try {
            const optionResponse = await api.post(`/aegis/learn/quiz-questions/${questionId}/options/create/`, optionData)
            console.log('Option created:', optionResponse.data)
          } catch (error) {
            console.error('Error creating option:', optionData, error)
          }
        }
      }
    }

    await fetchData()
    setShowUpdateQuizModal(false)
    setEditingResource(null)
    
  } catch (error) {
    console.error('Error updating quiz:', error)
    console.error('Error details:', error.response?.data)
    alert(`Failed to update quiz: ${error.response?.data?.message || error.response?.data?.error || 'Unknown error'}`)
  }
}

const handleAnswerSelect = (questionIndex, optionIndex) => {
  setUserAnswers(prev => ({
    ...prev,
    [questionIndex]: optionIndex
  }))
}

const handleNextQuestion = () => {
  if (currentQuestionIndex < currentQuiz.quiz_questions.length - 1) {
    setCurrentQuestionIndex(prev => prev + 1)
  }
}

const handlePreviousQuestion = () => {
  if (currentQuestionIndex > 0) {
    setCurrentQuestionIndex(prev => prev - 1)
  }
}

const handleSubmitQuiz = async () => {
  if (isTimeUp) return;
  try {
    let correctAnswers = 0
    const totalQuestions = currentQuiz?.quiz_questions?.length || 0
    const answers = []

    // Build answers array and calculate correct answers
    currentQuiz.quiz_questions.forEach((question, index) => {
      const userAnswerIndex = userAnswers[index]
      if (userAnswerIndex !== undefined) {
        const selectedOption = question.options[userAnswerIndex]
        const answerData = {
          question_id: question.id,
          option_id: selectedOption?.id
        }
        answers.push(answerData)
        
        // Check if the selected option is correct
        if (selectedOption?.is_correct) {
          correctAnswers++
        }
      }
    })

    const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0
    const timeSpent = isTimeUp ? quizTimeLimit : quizTimer;
    console.log('Submitting quiz with data:', {
      answers,
      time_spent: timeSpent,
      correct_answers: correctAnswers,
      total_questions: totalQuestions,
      score: score
    })

    // Submit quiz to backend
    const response = await api.post(
      `/aegis/learn/resources/${currentQuiz.id}/quiz/submit/`, 
      {
        answers: answers,
        time_spent: timeSpent
      }
    )

    console.log('Quiz submission response:', response.data)

    // Update local state with results from backend response
    setQuizResults({
      score: response.data.score || score,
      correct_answers: response.data.correct_answers || correctAnswers,
      total_questions: response.data.total_questions || totalQuestions,
      percentage: response.data.score || score,
      attempt_id: response.data.attempt_id
    })

    // Refresh user progress data
    await fetchData()

    // Stop the timer
    setQuizTimer(0)

  } catch (error) {
    console.error('Error submitting quiz:', error)
    console.error('Error details:', error.response?.data)
    
    // Fallback: Calculate results locally if backend fails
    const totalQuestions = currentQuiz?.quiz_questions?.length || 0
    let correctAnswers = 0
    
    currentQuiz.quiz_questions.forEach((question, index) => {
      const userAnswerIndex = userAnswers[index]
      if (userAnswerIndex !== undefined) {
        const selectedOption = question.options[userAnswerIndex]
        if (selectedOption?.is_correct) {
          correctAnswers++
        }
      }
    })
    
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
    
    setQuizResults({
      score: percentage,
      correct_answers: correctAnswers,
      total_questions: totalQuestions,
      percentage: percentage
    })
    
    alert('Quiz submitted locally. There was an issue saving to the server.')
  }
}


const handleRetryQuiz = () => {
  setCurrentQuestionIndex(0)
  setUserAnswers({})
  setQuizResults(null)
}

// Add these modal rendering functions

const renderViewResourceModal = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-surface rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-outline">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">
              {getResourceIcon(selectedResource?.resource_type)}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-on-surface">{selectedResource?.title}</h3>
              <p className="text-on-surface-variant">
                {resourceCategories.find(c => c.id === selectedResource?.category)?.name}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleEditResource(selectedResource)}
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors"
              title="Edit Resource"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowViewModal(false)}
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedResource?.resource_type)}`}>
            {selectedResource?.resource_type}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedResource?.difficulty)}`}>
            {selectedResource?.difficulty}
          </span>
          <span className="text-on-surface-variant text-sm">
            {selectedResource?.duration}
          </span>
        </div>

        <div className="prose prose-invert max-w-none mb-6">
          <p className="text-on-surface-variant text-lg mb-4">{selectedResource?.description}</p>
          
          {selectedResource?.content && (
            <div className="bg-surface-variant rounded-lg p-4">
              <h4 className="font-semibold text-on-surface mb-3">Content</h4>
              <div className="text-on-surface-variant whitespace-pre-wrap">
                {selectedResource.content}
              </div>
            </div>
          )}

          {selectedResource?.resource_type === 'video' && selectedResource?.video_url && (
            <div className="mt-4">
              <h4 className="font-semibold text-on-surface mb-3">Video</h4>
              <div className="aspect-w-16 aspect-h-9 bg-surface-variant rounded-lg flex items-center justify-center">
                <a 
                  href={selectedResource.video_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 flex items-center space-x-2"
                >
                  <Video className="h-6 w-6" />
                  <span>Watch Video</span>
                </a>
              </div>
            </div>
          )}

          {selectedResource?.external_links && selectedResource.external_links.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-on-surface mb-3">External Links</h4>
              <div className="space-y-2">
                {selectedResource.external_links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-surface-variant rounded-lg hover:bg-surface transition-colors"
                  >
                    <Link className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-on-surface truncate">{link.title}</div>
                      {link.description && (
                        <div className="text-sm text-on-surface-variant truncate">{link.description}</div>
                      )}
                      <div className="text-xs text-primary truncate">{link.url}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-3 p-6 border-t border-outline">
        <button 
          onClick={() => setShowViewModal(false)}
          className="flex-1 bg-surface-variant text-on-surface py-2 rounded-lg hover:bg-surface transition-colors"
        >
          Close
        </button>
        {selectedResource?.resource_type !== 'quiz' && (
          <button 
            onClick={() => {
              setShowViewModal(false)
              // Mark as completed or track progress
            }}
            className="flex-1 btn-primary flex items-center justify-center space-x-2"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Mark as Completed</span>
          </button>
        )}
      </div>
    </div>
  </div>
)

const renderUpdateResourceModal = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-surface rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-outline">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-on-surface">Update Resource</h3>
          <button
            onClick={() => setShowUpdateModal(false)}
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-on-surface-variant mt-1">Update educational content</p>
      </div>
      
      <div className="p-6">
        {/* Same form structure as create resource modal */}
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

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Category *
              </label>
              {renderResourceFormCategorySection()}
            </div>

            <div className="grid grid-cols-2 gap-4">
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
            onClick={() => setShowUpdateModal(false)}
            className="flex-1 bg-surface-variant text-on-surface py-2 rounded-lg hover:bg-surface transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpdateResource}
            className="flex-1 btn-primary flex items-center justify-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Update Resource</span>
          </button>
        </div>
      </div>
    </div>
  </div>
)

const renderStartQuizModal = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-surface rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-outline">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-on-surface">{currentQuiz?.title}</h3>
            <p className="text-on-surface-variant">{currentQuiz?.description}</p>
          </div>
          <button
            onClick={() => setShowStartQuizModal(false)}
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      
      <div className="p-6">
        {!quizResults ? (
          <>
            {/* Quiz Progress */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-on-surface-variant">
                Question {currentQuestionIndex + 1} of {currentQuiz?.quiz_questions?.length}
              </div>
              <div className="flex items-center space-x-4">
                <div className={`text-sm font-medium ${
                  quizTimeLimit && quizTimer >= quizTimeLimit * 0.8 
                    ? 'text-red-500' 
                    : 'text-on-surface-variant'
                }`}>
                  Time: {Math.floor(quizTimer / 60)}:{(quizTimer % 60).toString().padStart(2, '0')}
                  {quizTimeLimit && (
                    <span className="text-xs ml-1">
                      / {Math.floor(quizTimeLimit / 60)}:{(quizTimeLimit % 60).toString().padStart(2, '0')}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  {currentQuiz?.quiz_questions?.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index === currentQuestionIndex
                          ? 'bg-primary'
                          : userAnswers[index] !== undefined
                          ? 'bg-green-500'
                          : 'bg-surface-variant'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Time Warning */}
            {quizTimeLimit && quizTimer >= quizTimeLimit * 0.8 && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center space-x-2 text-red-500 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>
                    {isTimeUp 
                      ? "Time's up! Submitting your quiz..." 
                      : "Time is running out!"}
                  </span>
                </div>
              </div>
            )}

            {/* Current Question */}
            {currentQuiz?.quiz_questions?.[currentQuestionIndex] && (
              <div className="space-y-4">
                <div className="bg-surface-variant rounded-lg p-4">
                  <h4 className="font-semibold text-on-surface text-lg mb-2">
                    {currentQuiz.quiz_questions[currentQuestionIndex].question}
                  </h4>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuiz.quiz_questions[currentQuestionIndex].options.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      onClick={() => handleAnswerSelect(currentQuestionIndex, optionIndex)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        userAnswers[currentQuestionIndex] === optionIndex
                          ? 'border-primary bg-primary/10'
                          : 'border-outline hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          userAnswers[currentQuestionIndex] === optionIndex
                            ? 'border-primary bg-primary'
                            : 'border-on-surface-variant'
                        }`}>
                          {userAnswers[currentQuestionIndex] === optionIndex && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="text-on-surface">{option.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentQuestionIndex === 0
                    ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                Previous
              </button>

              {currentQuestionIndex === currentQuiz?.quiz_questions?.length - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(userAnswers).length !== currentQuiz?.quiz_questions?.length || isTimeUp}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    Object.keys(userAnswers).length !== currentQuiz?.quiz_questions?.length || isTimeUp
                      ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {isTimeUp ? 'Submitting...' : 'Submit Quiz'}
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </>
        ) : (
          /* Quiz Results */
          <div className="text-center py-8">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              quizResults.percentage >= 70 ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              <div className={`text-2xl font-bold ${
                quizResults.percentage >= 70 ? 'text-green-500' : 'text-red-500'
              }`}>
                {quizResults.percentage}%
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-on-surface mb-2">
              {quizResults.percentage >= 70 ? 'Congratulations!' : 'Keep Practicing!'}
            </h3>
            <p className="text-on-surface-variant mb-6">
              You scored {quizResults.score} out of {quizResults.totalQuestions} questions correctly.
            </p>

            <div className="flex space-x-3 justify-center">
              <button
                onClick={handleRetryQuiz}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Retry Quiz
              </button>
              <button
                onClick={() => setShowStartQuizModal(false)}
                className="bg-surface-variant text-on-surface px-6 py-2 rounded-lg hover:bg-surface transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)

const renderUpdateQuizModal = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-surface rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-outline">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-on-surface">Update Quiz</h3>
          <button
            onClick={() => setShowUpdateQuizModal(false)}
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-on-surface-variant mt-1">Update quiz questions and settings</p>
      </div>
      
      <div className="p-6">
        {/* Same form structure as create quiz modal */}
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

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Content
              </label>
              <textarea 
                value={quizForm.content}
                onChange={(e) => handleQuizInputChange('content', e.target.value)}
                className="input-field w-full h-20" 
                placeholder="Quiz content (optional)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Category *
                </label>
                {renderQuizFormCategorySection()}
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
            onClick={() => setShowUpdateQuizModal(false)}
            className="flex-1 bg-surface-variant text-on-surface py-2 rounded-lg hover:bg-surface transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpdateQuiz}
            className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Update Quiz</span>
          </button>
        </div>
      </div>
    </div>
  </div>
)

  const renderCreateCategoryModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-outline">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-on-surface">Create New Category</h3>
            <button
              onClick={() => setShowCategoryModal(false)}
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-on-surface-variant mt-1">Add a new resource category</p>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">
              Category Name *
            </label>
            <input 
              type="text" 
              value={categoryForm.name}
              onChange={(e) => handleCategoryInputChange('name', e.target.value)}
              className="input-field w-full" 
              placeholder="Enter category name" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">
              Description
            </label>
            <textarea 
              value={categoryForm.description}
              onChange={(e) => handleCategoryInputChange('description', e.target.value)}
              className="input-field w-full h-20" 
              placeholder="Enter category description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Icon
              </label>
              <input 
                type="text" 
                value={categoryForm.icon}
                onChange={(e) => handleCategoryInputChange('icon', e.target.value)}
                className="input-field w-full" 
                placeholder="e.g., 📚" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Order
              </label>
              <input 
                type="number" 
                value={categoryForm.order}
                onChange={(e) => handleCategoryInputChange('order', parseInt(e.target.value) || 0)}
                className="input-field w-full" 
                placeholder="0" 
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-surface-variant rounded-lg">
            <div>
              <div className="font-medium text-on-surface">Active</div>
              <div className="text-sm text-on-surface-variant">Show this category to users</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={categoryForm.is_active}
                onChange={(e) => handleCategoryInputChange('is_active', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
        
        <div className="flex space-x-3 p-6 border-t border-outline">
          <button 
            onClick={() => setShowCategoryModal(false)}
            className="flex-1 bg-surface-variant text-on-surface py-2 rounded-lg hover:bg-surface transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleCreateCategory}
            className="flex-1 btn-primary flex items-center justify-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Create Category</span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderCategoryFilterWithCreate = () => (
    <div className="flex items-center space-x-2">
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
      
      <button
        onClick={() => setShowCategoryModal(true)}
        className="p-2 bg-surface-variant text-on-surface hover:bg-surface rounded-lg transition-colors"
        title="Create New Category"
      >
        <FolderPlus className="h-4 w-4" />
      </button>
    </div>
  )

  const renderResourceFormCategorySection = () => (
    <div className="flex items-center space-x-2">
      <select 
        value={resourceForm.category}
        onChange={(e) => handleResourceInputChange('category', e.target.value)}
        className="input-field flex-1"
      >
        <option value="">Select Category</option>
        {resourceCategories.map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      
      <button
        onClick={() => setShowCategoryModal(true)}
        className="p-2 bg-surface-variant text-on-surface hover:bg-surface rounded-lg transition-colors"
        title="Create New Category"
      >
        <FolderPlus className="h-4 w-4" />
      </button>
    </div>
  )

  const renderQuizFormCategorySection = () => (
    <div className="flex items-center space-x-2">
      <select 
        value={quizForm.category}
        onChange={(e) => handleQuizInputChange('category', e.target.value)}
        className="input-field flex-1"
      >
        <option value="">Select Category</option>
        {resourceCategories.map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      
      <button
        onClick={() => setShowCategoryModal(true)}
        className="p-2 bg-surface-variant text-on-surface hover:bg-surface rounded-lg transition-colors"
        title="Create New Category"
      >
        <FolderPlus className="h-4 w-4" />
      </button>
    </div>
  )

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
            {renderCategoryFilterWithCreate()}
            
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

      {/* Loading State */}
      {loading && (
        <div className="card p-12 text-center">
          <Loader className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-on-surface-variant">Loading resources...</p>
        </div>
      )}

      {/* Resources Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => {
            const progress = getProgressForResource(resource.id)
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
                      onClick={() => resource.resource_type === 'quiz' ? handleEditQuiz(resource) : handleEditResource(resource)}
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
                  <button 
                    onClick={() => resource.resource_type === 'quiz' ? handleStartQuiz(resource) : handleViewResource(resource)}
                    className="flex-1 btn-primary py-2 text-sm flex items-center justify-center space-x-1"
                  >
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
                  
                  <button 
                    onClick={() => handleToggleBookmark(resource.id)}
                    className="p-2 bg-surface-variant text-on-surface hover:bg-surface rounded transition-colors"
                  >
                    {isBookmarked(resource.id) ? (
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
      )}

      {/* Empty State */}
      {!loading && filteredResources.length === 0 && (
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
            const progress = getProgressForResource(resource.id)
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

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Category *
                </label>
                {renderResourceFormCategorySection()}
              </div>

              <div className="grid grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Content
                </label>
                <textarea 
                  value={quizForm.content}
                  onChange={(e) => handleQuizInputChange('content', e.target.value)}
                  className="input-field w-full h-20" 
                  placeholder="Quiz content (optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Category *
                  </label>
                  {renderQuizFormCategorySection()}
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
            {/* <button 
              onClick={() => setShowCategoryModal(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors inline-flex items-center space-x-2"
            >
              <FolderPlus className="h-4 w-4" />
              <span>Create Category</span>
            </button> */}
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
        {showCategoryModal && renderCreateCategoryModal()}
        {showViewModal && renderViewResourceModal()}
        {showUpdateModal && renderUpdateResourceModal()}
        {showStartQuizModal && renderStartQuizModal()}
        {showUpdateQuizModal && renderUpdateQuizModal()}

      </div>
    </div>
  )
}

export default Resources