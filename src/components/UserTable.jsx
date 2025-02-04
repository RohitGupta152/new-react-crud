import React, { useState, useRef } from 'react';
import ConfirmationDialog from './ConfirmationDialog';
import SuccessDialog from './SuccessDialog';
import ErrorDialog from './ErrorDialog';
import { useTheme } from '../context/ThemeContext';

const UserTable = ({ users, onEdit, onDelete }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorData, setErrorData] = useState(null);
  const { darkMode } = useTheme();

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(userToDelete._id);
    setShowDeleteConfirmation(false);
    setUserToDelete(null);
  };

  const handleImportJSON = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      if (file.type !== 'application/json') {
        setErrorMessage('Please upload a JSON file');
        setShowErrorDialog(true);
        return;
      }

      setImporting(true);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:5000/api/users/import', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          setErrorMessage(result.message || 'Failed to import users');
          setErrorData(result);
          setShowErrorDialog(true);
          throw new Error(result.message);
        }

        setSuccessMessage(`Successfully imported ${result.count} users`);
        setShowSuccessDialog(true);
        
        window.location.reload();
      } catch (error) {
        console.error('Error importing users:', error);
        setErrorMessage(error.message || 'Error importing users. Please check your JSON file format.');
        setShowErrorDialog(true);
      } finally {
        setImporting(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Error reading file:', error);
      setImporting(false);
      setErrorMessage('Error reading file. Please try again.');
      setShowErrorDialog(true);
    }
  };

  if (!users.length) {
    return (
      <div className="text-center py-12 dark:text-gray-200">
        <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No users found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create a new user to get started.</p>
        
        <div className="mt-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJSON}
            accept="application/json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="inline-flex items-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors duration-200"
          >
            {importing ? (
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16v-1a3 3 0 013-3h10a3 3 0 013 3v1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            )}
            <span className="font-medium">
              {importing ? 'Importing...' : 'Import Users from JSON'}
            </span>
          </button>
        </div>

        <SuccessDialog
          isOpen={showSuccessDialog}
          message={successMessage}
          duration={3000}
          onClose={() => {
            setShowSuccessDialog(false);
            setSuccessMessage('');
          }}
        />
      </div>
    );
  }

  return (
    <>
      {users.length > 0 && (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 w-full lg:w-auto">
            <div className="bg-indigo-100 dark:bg-indigo-900 rounded-full p-2">
              <svg 
                className="h-5 w-5 text-indigo-600 dark:text-indigo-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Entries</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto justify-center">
            <button
              onClick={() => {
                const jsonData = JSON.stringify(users, null, 2);
                const blob = new Blob([jsonData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'users-data.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="flex items-center justify-center px-4 py-2 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-colors duration-200 w-full sm:w-auto"
            >
              <svg 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span className="font-medium">Download JSON</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJSON}
              accept="application/json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="flex items-center justify-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors duration-200 w-full sm:w-auto"
            >
              {importing ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 16v-1a3 3 0 013-3h10a3 3 0 013 3v1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              )}
              <span className="font-medium">
                {importing ? 'Importing...' : 'Import JSON'}
              </span>
            </button>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center px-4 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200 w-full lg:w-auto"
          >
            <svg 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            <span className="font-medium">Refresh</span>
          </button>
        </div>
      )}

      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <div className="hidden md:block">
            <div className="bg-gray-50 dark:bg-gray-800">
              <div className="grid grid-cols-4 divide-x divide-gray-200 dark:divide-gray-700">
                <div className="px-6 py-4 text-center text-base font-bold text-gray-700 dark:text-gray-200">Name</div>
                <div className="px-6 py-4 text-center text-base font-bold text-gray-700 dark:text-gray-200">Email</div>
                <div className="px-6 py-4 text-center text-base font-bold text-gray-700 dark:text-gray-200">Mobile</div>
                <div className="px-6 py-4 text-center text-base font-bold text-gray-700 dark:text-gray-200">Actions</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user, index) => (
              <div 
                key={user._id}
                className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}`}
              >
                <div className="block md:hidden p-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-500 dark:text-gray-400">Name:</span>
                      <span className="text-gray-900 dark:text-gray-100">{user.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-500 dark:text-gray-400">Email:</span>
                      <span className="text-gray-900 dark:text-gray-100">{user.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-500 dark:text-gray-400">Mobile:</span>
                      <span className="text-gray-900 dark:text-gray-100">{user.mobile}</span>
                    </div>
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="inline-flex items-center px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-white rounded-md border border-indigo-200 dark:border-indigo-800 text-sm"
                      >
                        <svg className="h-4 w-4 mr-1" /* ... svg props ... */ />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="inline-flex items-center px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-white rounded-md border border-red-200 dark:border-red-800 text-sm"
                      >
                        <svg className="h-4 w-4 mr-1" /* ... svg props ... */ />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div className="hidden md:grid md:grid-cols-4 md:divide-x md:divide-gray-200 dark:divide-gray-700">
                  <div className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 text-center">
                      {user.name}
                    </div>
                  </div>
                  <div className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 text-center">
                      {user.email}
                    </div>
                  </div>
                  <div className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 text-center">
                      {user.mobile}
                    </div>
                  </div>
                  <div className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-center items-center space-x-4">
                      <button
                        onClick={() => onEdit(user)}
                        className="inline-flex items-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-white hover:text-indigo-900 dark:hover:text-white rounded-md border border-indigo-200 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 mr-2" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        <span className="font-semibold">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="inline-flex items-center px-4 py-2 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-white hover:text-red-900 dark:hover:text-white rounded-md border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 shadow-sm"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 mr-2" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showDeleteConfirmation}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteConfirmation(false);
          setUserToDelete(null);
        }}
      />

      <SuccessDialog
        isOpen={showSuccessDialog}
        message={successMessage}
        duration={3000}
        onClose={() => {
          setShowSuccessDialog(false);
          setSuccessMessage('');
        }}
      />

      <ErrorDialog
        isOpen={showErrorDialog}
        message={errorMessage}
        errorData={errorData}
        duration={10000}
        onClose={() => {
          setShowErrorDialog(false);
          setErrorMessage('');
          setErrorData(null);
        }}
      />
    </>
  );
};

export default UserTable; 