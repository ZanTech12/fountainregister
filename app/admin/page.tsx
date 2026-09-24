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

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // Updated to use environment variable
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`);
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error('Failed to fetch students', error);
    }
  };

  const handleDownload = () => {
    // Updated to use environment variable
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/students/download`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <button 
            onClick={handleDownload}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Download CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-600">FirstName</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">LastName</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Gender</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">ClassName</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Section</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">No students registered yet.</td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{student.FirstName}</td>
                    <td className="py-3 px-4">{student.LastName}</td>
                    <td className="py-3 px-4">{student.Gender}</td>
                    <td className="py-3 px-4">{student.ClassName}</td>
                    <td className="py-3 px-4">{student.Section}</td>
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