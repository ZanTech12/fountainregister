// frontend/app/page.tsx
'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Gender: '',
    ClassName: '',
  });

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // ✅ NEW: Countdown States
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Updated list of classes based on your provided data
  const classes = [
    'Creche', 'Kindergarten 1', 'Kindergarten 2', 'Nursery 1', 'Nursery 2',
    'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5',
    'JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'
  ];

  // ✅ NEW: Countdown Logic
  useEffect(() => {
    let deadlineStr = localStorage.getItem('registrationDeadline');
    
    // If no deadline exists, set it to 3 hours from now and save it
    if (!deadlineStr) {
      const deadline = Date.now() + 3 * 60 * 60 * 1000; // 3 hours in milliseconds
      deadlineStr = deadline.toString();
      localStorage.setItem('registrationDeadline', deadlineStr);
    }

    const checkTime = () => {
      const remaining = parseInt(deadlineStr!) - Date.now();
      if (remaining <= 0) {
        setTimeLeft(0);
        setIsLocked(true);
        return false; // Stop the interval
      } else {
        setTimeLeft(remaining);
        return true; // Continue the interval
      }
    };

    // Check immediately on load
    const isStillActive = checkTime();
    if (!isStillActive) return;

    // Set up the interval to tick every second
    const interval = setInterval(() => {
      if (!checkTime()) clearInterval(interval);
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // ✅ NEW: Helper to format milliseconds into HH:MM:SS
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ NEW: Hard block submission if locked
    if (isLocked) {
      setMessage('Registration is locked. The 3-hour time limit has expired.');
      setIsError(true);
      return;
    }

    setMessage('');
    setIsError(false);

    // Validation: Prevent acronyms/initials and numbers
    const nameRegex = /^[A-Za-z\s'-]+$/;
    if (formData.FirstName.trim().length < 3 || !nameRegex.test(formData.FirstName.trim())) {
      setMessage('Please enter a valid full First Name (no acronyms, initials, or numbers).');
      setIsError(true);
      return;
    }
    if (formData.LastName.trim().length < 3 || !nameRegex.test(formData.LastName.trim())) {
      setMessage('Please enter a valid full Last Name (no acronyms, initials, or numbers).');
      setIsError(true);
      return;
    }
    
    try {
      // Updated to use environment variable
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setMessage('Student registered successfully!');
        setIsError(false);
        setFormData({ FirstName: '', LastName: '', Gender: '', ClassName: '' });
      } else {
        setMessage('Failed to register student.');
        setIsError(true);
      }
    } catch (error) {
      setMessage('Network error.');
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">Student Registration</h1>
        
        {/* ✅ NEW: Countdown / Lock UI */}
        {isLocked ? (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
            <h2 className="text-xl font-bold">Registration Locked</h2>
            <p className="text-sm mt-1">The 3-hour registration window has expired.</p>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-md text-center">
            <p className="text-sm font-medium uppercase tracking-wide">Time Remaining</p>
            <p className="text-3xl font-mono font-bold tracking-wider mt-1">
              {formatTime(timeLeft)}
            </p>
            <p className="text-xs text-blue-500 mt-1">Page will lock automatically when timer hits 00:00:00</p>
          </div>
        )}

        {/* Conditional styling for success (green) or error (red) messages */}
        {message && (
          <p className={`mb-4 text-center font-medium ${isError ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input 
              type="text" 
              name="FirstName" 
              required 
              value={formData.FirstName} 
              onChange={handleChange} 
              disabled={isLocked}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 bg-white focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input 
              type="text" 
              name="LastName" 
              required 
              value={formData.LastName} 
              onChange={handleChange} 
              disabled={isLocked}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 bg-white focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select 
              name="Gender" 
              required 
              value={formData.Gender} 
              onChange={handleChange} 
              disabled={isLocked}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Class Name</label>
            <select 
              name="ClassName" 
              required 
              value={formData.ClassName} 
              onChange={handleChange} 
              disabled={isLocked}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Class</option>
              {classes.map((cls, i) => (
                <option key={i} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Section</label>
            <input 
              type="text" 
              value="A" 
              readOnly 
              required
              className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm p-2 cursor-not-allowed text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500">Section is fixed to A for all students.</p>
          </div>

          <button 
            type="submit" 
            disabled={isLocked}
            className={`w-full py-2 rounded-md transition font-semibold text-white ${isLocked ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLocked ? 'Registration Locked' : 'Register Student'}
          </button>
        </form>
      </div>
    </div>
  );
}