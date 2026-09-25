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

  // ✅ NEW: Global Countdown States
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // ✅ FIXED GLOBAL DEADLINE: Sept 25th, 2026 at 11:00 AM (WAT / UTC+1)
  // 10:00:00Z in UTC is equal to 11:00 AM in Nigeria Time.
  const REGISTRATION_DEADLINE = new Date('2026-09-25T10:00:00Z').getTime();

  // Updated list of classes
  const classes = [
    'Creche', 'Kindergarten 1', 'Kindergarten 2', 'Nursery 1', 'Nursery 2',
    'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5',
    'JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'
  ];

  // ✅ NEW: Global Countdown Logic
  useEffect(() => {
    const checkTime = () => {
      const remaining = REGISTRATION_DEADLINE - Date.now();
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
  }, [REGISTRATION_DEADLINE]);

  // ✅ Helper to format milliseconds into DD:HH:MM:SS
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(days)}d : ${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ Hard block submission if locked
    if (isLocked) {
      setMessage('Registration is locked. The registration window has closed.');
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
        
        {/* ✅ Countdown / Lock UI */}
        {isLocked ? (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
            <h2 className="text-xl font-bold">Registration Closed</h2>
            <p className="text-sm mt-1">The registration window expired on Sept 25, 2026, at 11:00 AM.</p>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-md text-center">
            <p className="text-sm font-medium uppercase tracking-wide">Time Remaining</p>
            <p className="text-2xl md:text-3xl font-mono font-bold tracking-wider mt-1 break-all">
              {formatTime(timeLeft)}
            </p>
            <p className="text-xs text-blue-500 mt-2">Registration locks automatically on Sept 25, 2026, at 11:00 AM.</p>
          </div>
        )}

        {message && (
          <p className={`mb-4 text-center font-medium ${isError ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input 
              type="text" name="FirstName" required value={formData.FirstName} onChange={handleChange} 
              disabled={isLocked}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 bg-white focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input 
              type="text" name="LastName" required value={formData.LastName} onChange={handleChange} 
              disabled={isLocked}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 bg-white focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select 
              name="Gender" required value={formData.Gender} onChange={handleChange} 
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
              name="ClassName" required value={formData.ClassName} onChange={handleChange} 
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
              type="text" value="A" readOnly required
              className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm p-2 cursor-not-allowed text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500">Section is fixed to A for all students.</p>
          </div>

          <button 
            type="submit" disabled={isLocked}
            className={`w-full py-2 rounded-md transition font-semibold text-white ${isLocked ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLocked ? 'Registration Locked' : 'Register Student'}
          </button>
        </form>
      </div>
    </div>
  );
}