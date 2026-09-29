// frontend/app/page.tsx
'use client';
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Gender: '',
    ClassName: '',
  });

  const [message, setMessage] = useState('');

  // Updated list of classes based on your provided data
  const classes = [
    'Creche',
    'Kindergarten 1',
    'Kindergarten 2',
    'Nursery 1',
    'Nursery 2',
    'Basic 1',
    'Basic 2',
    'Basic 3',
    'Basic 4',
    'Basic 5',
    'JSS 1',
    'JSS 2',
    'JSS 3',
    'SSS 1',
    'SSS 2',
    'SSS 3'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    
    try {
      // Updated to use environment variable
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setMessage('Student registered successfully!');
        setFormData({ FirstName: '', LastName: '', Gender: '', ClassName: '' });
      } else {
        setMessage('Failed to register student.');
      }
    } catch (error) {
      setMessage('Network error.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Student Registration</h1>
        
        {message && <p className="mb-4 text-center text-green-600 font-medium">{message}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input 
              type="text" 
              name="FirstName" 
              required 
              value={formData.FirstName} 
              onChange={handleChange} 
              // Added text-gray-900 and bg-white to fix mobile transparency
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 bg-white focus:ring-blue-500 focus:border-blue-500"
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
              // Added text-gray-900 and bg-white to fix mobile transparency
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 bg-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select 
              name="Gender" 
              required 
              value={formData.Gender} 
              onChange={handleChange} 
              // Added text-gray-900 to ensure dropdown text is black on mobile
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
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
              // Added text-gray-900 to ensure dropdown text is black on mobile
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
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
              className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm p-2 cursor-not-allowed text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500">Section is fixed to A for all students.</p>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-semibold"
          >
            Register Student
          </button>
        </form>
      </div>
    </div>
  );
}