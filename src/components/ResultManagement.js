import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaEye, FaTrash, FaEdit, FaPlus, FaChartBar, FaUserGraduate, FaBook, FaCalendarAlt, FaGraduationCap } from 'react-icons/fa';
import AddEditResult from './AddEditResult';

const ResultManagement = () => {
  const { studentAPI, resultAPI } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [results, setResults] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      loadStudentResults(selectedStudent);
    }
  }, [selectedStudent]);

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

  const loadStudentResults = async (studentId) => {
    try {
      setLoading(true);
      const data = await resultAPI.getStudentResults(studentId);
      setResults(data.results || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        await resultAPI.deleteResult(id);
        setResults(results.filter(result => result._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    if (selectedStudent) {
      loadStudentResults(selectedStudent);
    }
  };

  const handleEditSuccess = () => {
    setEditingResult(null);
    if (selectedStudent) {
      loadStudentResults(selectedStudent);
    }
  };

  const calculateGPA = () => {
    if (results.length === 0) return 0;
    
    const gradePoints = {
      'A': 4.0,
      'B': 3.0,
      'C': 2.0,
      'D': 1.0,
      'F': 0.0,
      'I': 0.0
    };
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    results.forEach(result => {
      if (result.grade !== 'I') {
        const credits = result.course?.credits || 0;
        totalPoints += gradePoints[result.grade] * credits;
        totalCredits += credits;
      }
    });
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  if (loading && students.length === 0) {
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
            <FaChartBar className="text-3xl text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Result Management</h1>
            <p className="text-gray-600 mt-1">Manage student grades and academic results</p>
          </div>
        </div>
        
        {selectedStudent && results.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl p-4 shadow-lg">
            <div className="flex items-center">
              <FaGraduationCap className="text-white text-2xl mr-2" />
              <span className="text-white font-semibold">GPA: {calculateGPA()}</span>
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

      {/* Student Selection Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaUserGraduate className="mr-2 text-indigo-600" />
          Select Student
        </h2>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
        >
          <option value="">Select a student</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name} - {student.email}
            </option>
          ))}
        </select>
      </div>

      {showAddForm && (
        <AddEditResult
          studentId={selectedStudent}
          onSuccess={handleAddSuccess}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingResult && (
        <AddEditResult
          result={editingResult}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditingResult(null)}
        />
      )}

      {selectedStudent && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-lg mr-4">
                <FaBook className="text-xl text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Courses Completed</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {results.filter(r => r.grade !== 'I').length}
                </h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-lg mr-4">
                <FaGraduationCap className="text-xl text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Current GPA</p>
                <h3 className="text-2xl font-bold text-gray-800">{calculateGPA()}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-lg mr-4">
                <FaCalendarAlt className="text-xl text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Results</p>
                <h3 className="text-2xl font-bold text-gray-800">{results.length}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedStudent && results.length === 0 && !showAddForm && !editingResult ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
            <FaChartBar className="text-3xl text-gray-400" />
          </div>
          <h3 className="mt-5 text-xl font-medium text-gray-900">No results found</h3>
          <p className="mt-2 text-gray-500">This student doesn't have any results yet.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center mx-auto transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <FaPlus className="mr-2" /> Add First Result
          </button>
        </div>
      ) : selectedStudent && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Student Results</h2>
              <p className="mt-1 text-sm text-gray-500">List of all academic results</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <FaPlus className="mr-2" /> Add Result
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {result.course?.code}
                        </div>
                        <div className="text-sm text-gray-500">
                          {result.course?.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                        ${result.grade === 'A' ? 'bg-green-100 text-green-800' : 
                          result.grade === 'B' ? 'bg-blue-100 text-blue-800' : 
                          result.grade === 'C' ? 'bg-yellow-100 text-yellow-800' : 
                          result.grade === 'D' ? 'bg-orange-100 text-orange-800' : 
                          result.grade === 'F' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'}`}
                      >
                        {result.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{result.score || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{result.semester}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{result.academicYear}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setEditingResult(result)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(result._id)}
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

export default ResultManagement;