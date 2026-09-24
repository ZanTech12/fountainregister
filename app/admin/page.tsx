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

        {/* Class Statistics Section */}
        <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Class Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
          {classCounts.map((cls) => (
            <div key={cls.className} className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
              <h3 className="font-semibold text-sm text-blue-800">{cls.className}</h3>
              <p className="text-3xl font-bold text-blue-600 my-1">{cls.count}</p>
              <p className="text-xs text-gray-500">Students</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Student List Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">All Registered Students</h2>

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
              {students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">No students registered yet.</td>
                </tr>
              ) : (
                students.map((student, index) => (
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