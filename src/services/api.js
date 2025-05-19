// Base API URL - change this to your actual backend URL
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to create a timeout signal
const createTimeoutSignal = (timeoutMs) => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
};

// Helper function for making API requests
const fetchWithAuth = async (endpoint, options = {}) => {
  // Get auth token from localStorage (you would implement your auth system)
  const token = localStorage.getItem('authToken');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      // Add a timeout to prevent long waits
      signal: options.signal || createTimeoutSignal(10000),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An unknown error occurred',
      }));
      throw new Error(error.message || `API Error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    
    // Handle timeout errors specifically
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again later.');
    }
    
    throw error;
  }
};

// Question-related API calls
export const questionApi = {
  // Get all subjects available to the current student
  getStudentSubjects: async () => {
    return fetchWithAuth('subjects/student');
  },
  
  // Get questions for practice test based on criteria
  getQuestionsByFilters: async (filters) => {
    return fetchWithAuth('questions/practice', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  },
  
  // Get questions by subject and filters for students
  getStudentQuestions: async (filters) => {
    return fetchWithAuth('questions/student/filter', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  },
  
  // Create a custom test from selected questions
  createCustomTest: async (testData) => {
    return fetchWithAuth('practice-tests/custom', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
  },
  
  // Save exam result to the backend
  saveExamResult: async (examResult) => {
    return fetchWithAuth('exams/results', {
      method: 'POST',
      body: JSON.stringify(examResult),
    });
  },
  
  // Get student's previous exam results
  getExamHistory: async () => {
    return fetchWithAuth('exams/history');
  },
  
  // Get a specific exam result by ID
  getExamResultById: async (examId) => {
    return fetchWithAuth(`exams/results/${examId}`);
  },
};

// Practice Test API calls
export const practiceTestApi = {
  // Get all practice tests available to the current user
  getAllTests: async () => {
    return fetchWithAuth('practice-tests');
  },
  
  // Get a specific practice test by ID
  getTestById: async (testId) => {
    return fetchWithAuth(`practice-tests/${testId}`);
  },
  
  // Create a new practice test (teacher only)
  createTest: async (testData) => {
    return fetchWithAuth('practice-tests', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
  },
  
  // Create a custom test from selected questions (student)
  createCustomTest: async (testData) => {
    return fetchWithAuth('practice-tests/custom', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
  },
  
  // Update a practice test (teacher only)
  updateTest: async (testId, testData) => {
    return fetchWithAuth(`practice-tests/${testId}`, {
      method: 'PUT',
      body: JSON.stringify(testData),
    });
  },
  
  // Delete a practice test (teacher only)
  deleteTest: async (testId) => {
    return fetchWithAuth(`practice-tests/${testId}`, {
      method: 'DELETE',
    });
  },
  
  // Toggle publish status of a practice test (teacher only)
  togglePublishStatus: async (testId) => {
    return fetchWithAuth(`practice-tests/${testId}/publish`, {
      method: 'PATCH',
    });
  },
};

// Mock API for development/testing without a backend
export const mockQuestionApi = {
  getStudentSubjects: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      "Mathematics 101",
      "Physics",
      "Computer Science",
      "Biology",
      "Chemistry"
    ];
  },
  
  getQuestionsByFilters: async (filters) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock questions database
    const questionPool = [
      {
        id: 1,
        text: "What is the time complexity of binary search?",
        type: "multiple_choice",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
        correctAnswer: 1,
        marks: 2,
        subject: "Computer Science"
      },
      {
        id: 2,
        text: "Which of the following is not a fundamental force in physics?",
        type: "multiple_choice",
        options: ["Gravity", "Electromagnetism", "Strong Nuclear Force", "Centrifugal Force"],
        correctAnswer: 3,
        marks: 2,
        subject: "Physics"
      },
      {
        id: 3,
        text: "What is the derivative of f(x) = x²?",
        type: "multiple_choice",
        options: ["f'(x) = x", "f'(x) = 2x", "f'(x) = 2", "f'(x) = x²"],
        correctAnswer: 1,
        marks: 2,
        subject: "Mathematics 101"
      },
      {
        id: 4,
        text: "Which data structure follows LIFO principle?",
        type: "multiple_choice",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        correctAnswer: 1,
        marks: 2,
        subject: "Computer Science"
      },
      {
        id: 5,
        text: "What is the SI unit of force?",
        type: "multiple_choice",
        options: ["Watt", "Joule", "Newton", "Pascal"],
        correctAnswer: 2,
        marks: 3,
        subject: "Physics"
      },
      {
        id: 6,
        text: "Which of the following is a prime number?",
        type: "multiple_choice",
        options: ["91", "97", "99", "111"],
        correctAnswer: 1,
        marks: 3,
        subject: "Mathematics 101"
      },
      {
        id: 7,
        text: "Which sorting algorithm has the best average-case time complexity?",
        type: "multiple_choice",
        options: ["Bubble Sort", "Selection Sort", "QuickSort", "Insertion Sort"],
        correctAnswer: 2,
        marks: 4,
        subject: "Computer Science"
      },
      {
        id: 8,
        text: "Which of the following is an example of potential energy?",
        type: "multiple_choice",
        options: ["A car moving at constant speed", "A ball rolling down a hill", "A book resting on a shelf", "A person running"],
        correctAnswer: 2,
        marks: 3,
        subject: "Physics"
      },
      {
        id: 9,
        text: "What is the solution to the equation 2x + 5 = 13?",
        type: "multiple_choice",
        options: ["x = 3", "x = 4", "x = 5", "x = 6"],
        correctAnswer: 1,
        marks: 2,
        subject: "Mathematics 101"
      },
      {
        id: 10,
        text: "Which of the following is not a principle of Object-Oriented Programming?",
        type: "multiple_choice",
        options: ["Encapsulation", "Inheritance", "Normalization", "Polymorphism"],
        correctAnswer: 2,
        marks: 4,
        subject: "Computer Science"
      },
      {
        id: 11,
        text: "Explain the concept of quantum entanglement and its implications for quantum computing.",
        type: "descriptive",
        correctAnswer: "Quantum entanglement is a physical phenomenon where pairs of particles remain connected regardless of distance...",
        marks: 10,
        subject: "Physics"
      },
      {
        id: 12,
        text: "Analyze the time and space complexity of the quicksort algorithm and explain its best-case and worst-case scenarios.",
        type: "descriptive",
        correctAnswer: "Quicksort has an average time complexity of O(n log n)...",
        marks: 10,
        subject: "Computer Science"
      },
      {
        id: 13,
        text: "Prove that any odd integer can be expressed as the difference of two perfect squares.",
        type: "descriptive",
        correctAnswer: "Consider an odd integer 2n+1...",
        marks: 10,
        subject: "Mathematics 101"
      },
      {
        id: 14,
        text: "Describe the process of DNA replication and its importance in cell division.",
        type: "descriptive",
        correctAnswer: "DNA replication is the biological process of producing two identical replicas of DNA from one original DNA molecule...",
        marks: 10,
        subject: "Biology"
      },
      // Additional questions for Biology and Chemistry
      {
        id: 15,
        text: "What is the primary function of mitochondria in a cell?",
        type: "multiple_choice",
        options: ["Protein synthesis", "Energy production", "Cell division", "Waste removal"],
        correctAnswer: 1,
        marks: 2,
        subject: "Biology"
      },
      {
        id: 16,
        text: "What is the pH of a neutral solution at 25°C?",
        type: "multiple_choice",
        options: ["0", "7", "14", "1"],
        correctAnswer: 1,
        marks: 2,
        subject: "Chemistry"
      },
      {
        id: 17,
        text: "What is the molecular formula for glucose?",
        type: "multiple_choice",
        options: ["C6H12O6", "C6H6O6", "C12H22O11", "C2H6O"],
        correctAnswer: 0,
        marks: 3,
        subject: "Chemistry"
      },
      {
        id: 18,
        text: "Explain in detail the process of photosynthesis and its importance for life on Earth.",
        type: "descriptive",
        correctAnswer: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water...",
        marks: 10,
        subject: "Biology"
      },
      {
        id: 19,
        text: "Explain the concept of chemical equilibrium and Le Chatelier's principle with examples.",
        type: "descriptive",
        correctAnswer: "Chemical equilibrium is the state in which both reactants and products are present in concentrations which have no further tendency to change with time...",
        marks: 10,
        subject: "Chemistry"
      },
      {
        id: 20,
        text: "What is the difference between organic and inorganic compounds?",
        type: "multiple_choice",
        options: [
          "Organic compounds always contain carbon, inorganic compounds never do",
          "Organic compounds contain carbon-hydrogen bonds, inorganic compounds typically don't",
          "Organic compounds are only found in living organisms",
          "Organic compounds are always solid at room temperature"
        ],
        correctAnswer: 1,
        marks: 4,
        subject: "Chemistry"
      }
    ];

    // Create filtered questions based on requested filters
    let filteredQuestions = [...questionPool];
    
    // Filter by subjects
    if (filters.subjects && filters.subjects.length > 0) {
      filteredQuestions = filteredQuestions.filter(q => 
        filters.subjects.includes(q.subject)
      );
    }
    
    // Create a result object with questions for each mark value
    const result = {
      questions: {}
    };
    
    // Organize by mark values
    for (const markValue in filters.questionCounts) {
      const count = filters.questionCounts[markValue];
      
      if (count > 0) {
        // Get questions with this mark value
        const questionsWithMark = filteredQuestions.filter(
          q => q.marks === parseInt(markValue, 10)
        );
        
        // Shuffle and pick requested number
        const shuffled = [...questionsWithMark].sort(() => 0.5 - Math.random());
        
        // Get as many as available up to the requested count
        result.questions[markValue] = shuffled.slice(0, count);
      }
    }
    
    return result;
  },
  
  saveExamResult: async (examResult) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real implementation, this would save to a backend
    console.log('Saving exam result:', examResult);
    
    // Generate a fake ID for the saved result
    return {
      id: 'exam_' + Date.now(),
      savedAt: new Date().toISOString(),
      ...examResult
    };
  },
  
  getExamHistory: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Return empty array - in a real implementation this would come from backend
    return [];
  }
};

// Export either the real API or the mock API based on environment
export default process.env.REACT_APP_USE_MOCK_API === 'true' 
  ? mockQuestionApi 
  : questionApi; 