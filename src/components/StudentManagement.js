import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaEye, FaTrash, FaUserGraduate, FaPlus, FaUsers, FaCalendarAlt, FaIdCard } from 'react-icons/fa';

const StudentManagement = () => {
  const { studentAPI } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentAPI.getStudents();
      setStudents(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentAPI.deleteStudent(id);
        setStudents(students.filter(student => student._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="p-3 bg-indigo-100 rounded-xl mr-4 shadow-sm">
            <FaUsers className="text-3xl text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Student Management</h1>
            <p className="text-gray-600 mt-1">Manage all registered students in the system</p>
          </div>
        </div>
        
        {students.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 shadow-lg">
            <div className="flex items-center">
              <FaUserGraduate className="text-white text-2xl mr-2" />
              <span className="text-white font-semibold">{students.length} Students</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {students.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-lg mr-4">
                <FaUsers className="text-xl text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <h3 className="text-2xl font-bold text-gray-800">{students.length}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-lg mr-4">
                <FaCalendarAlt className="text-xl text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">New This Month</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {students.filter(student => {
                    const created = new Date(student.createdAt);
                    const now = new Date();
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                  }).length}
                </h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-50 rounded-lg mr-4">
                <FaIdCard className="text-xl text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Accounts</p>
                <h3 className="text-2xl font-bold text-gray-800">{students.length}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {students.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
            <FaUserGraduate className="text-3xl text-gray-400" />
          </div>
          <h3 className="mt-5 text-xl font-medium text-gray-900">No students found</h3>
          <p className="mt-2 text-gray-500">There are no students registered in the system yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-medium text-gray-900">All Students</h2>
            <p className="mt-1 text-sm text-gray-500">List of all registered students</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">ID: {student._id.substring(0, 8)}...</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/students/${student._id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center"
                      >
                      
                      </Link>
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;