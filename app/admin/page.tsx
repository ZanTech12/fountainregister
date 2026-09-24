// frontend/app/admin/page.tsx
'use client';
import { useState, useEffect } from 'react';

interface Student {
  _id: string;
  FirstName: string;
  LastName: string;
  Gender: string;
  ClassName: string;
  Section: string;
}

export default function AdminPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  // Keep track of the exact classes you offer to display them in order
  const classList = [
    'Creche', 'Kindergarten 1', 'Kindergarten 2', 'Nursery 1', 'Nursery 2',
    'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5',
    'JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`);
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error('Failed to fetch students', error);
    }
  };

  const handleDownload = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/students/download`;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          setStudents(students.filter(student => student._id !== id));
          alert("Student deleted successfully.");
        } else {
          alert("Failed to delete student.");
        }
      } catch (error) {
        console.error('Failed to delete student', error);
        alert("Network error while deleting.");
      }
    }
  };

  // Calculate the total number of students per class
  const classCounts = classList.map(className => {
    return {
      className: className,
      count: students.filter(student => student.ClassName === className).length
    };
  });

  // Filter students based on the selected class card
  const displayedStudents = selectedClass 
    ? students.filter(student => student.ClassName === selectedClass)
    : students;

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <button 
            onClick={handleDownload}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Download CSV
          </button>
        </div>

        {/* Class Statistics Section (Clickable) */}
        <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Class Statistics (Click to Filter)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
          {classCounts.map((cls) => (
            <div 
              key={cls.className} 
              onClick={() => setSelectedClass(selectedClass === cls.className ? null : cls.className)}
              className={`cursor-pointer p-4 rounded-lg border text-center transition duration-200 ${
                selectedClass === cls.className 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' 
                  : 'bg-blue-50 border-blue-100 hover:bg-blue-100 text-gray-800'
              }`}
            >
              <h3 className={`font-semibold text-sm ${selectedClass === cls.className ? 'text-white' : 'text-blue-800'}`}>{cls.className}</h3>
              <p className="text-3xl font-bold my-1">{cls.count}</p>
              <p className={`text-xs ${selectedClass === cls.className ? 'text-blue-100' : 'text-gray-500'}`}>Students</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Student List Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-bold text-gray-700">
            {selectedClass ? `Students in ${selectedClass}` : "All Registered Students"}
          </h2>
          {selectedClass && (
            <button 
              onClick={() => setSelectedClass(null)}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              ← Show All Students
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-600">S/N</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">FirstName</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">LastName</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Gender</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">ClassName</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Section</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    {selectedClass ? `No students registered in ${selectedClass} yet.` : "No students registered yet."}
                  </td>
                </tr>
              ) : (
                displayedStudents.map((student, index) => (
                  <tr key={student._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-500">{index + 1}</td>
                    <td className="py-3 px-4">{student.FirstName}</td>
                    <td className="py-3 px-4">{student.LastName}</td>
                    <td className="py-3 px-4">{student.Gender}</td>
                    <td className="py-3 px-4">{student.ClassName}</td>
                    <td className="py-3 px-4">{student.Section}</td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => handleDelete(student._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}