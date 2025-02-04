import React, { useState } from 'react';
import SuccessDialog from './SuccessDialog';
import ErrorDialog from './ErrorDialog';

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || ''
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    mobile: false
  });

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorData, setErrorData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Function to format name (capitalize first letter of each word)
  const formatName = (name) => {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/[^a-zA-Z\s]/g, ''); // Remove any non-letter characters except spaces
  };

  const validateName = (name) => {
    // At least two words, only letters and spaces, each word capitalized
    const nameRegex = /^[A-Z][a-z]+ [A-Z][a-z]+$/;
    return nameRegex.test(name);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
  };

  const handleNameChange = (e) => {
    let formattedName = formatName(e.target.value);
    setFormData({ ...formData, name: formattedName });
    setErrors({ 
      ...errors, 
      name: formattedName.trim() === '' || !validateName(formattedName)
    });
  };

  const handleMobileChange = (e) => {
    // Only allow numbers and limit to 10 digits
    const formattedMobile = e.target.value
      .replace(/[^\d]/g, '')  // Remove non-digits
      .slice(0, 10);          // Limit to 10 digits

    setFormData({ ...formData, mobile: formattedMobile });
    setErrors({
      ...errors,
      mobile: formattedMobile.length !== 10
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {
      name: !formData.name.trim() || !validateName(formData.name),
      email: !formData.email.trim(),
      mobile: !formData.mobile.trim() || !validateMobile(formData.mobile)
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    try {
      const result = await onSubmit(formData);
      if (result.success) {
        setSuccessMessage(user ? 'User updated successfully!' : 'User created successfully!');
        setShowSuccessDialog(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(error.message || 'An error occurred');
      setErrorData({
        existingInDatabase: {
          emails: error.email ? [{ value: formData.email, existingUser: { name: error.existingUser } }] : [],
          mobiles: error.mobile ? [{ value: formData.mobile, existingUser: { name: error.existingUser } }] : []
        }
      });
      setShowErrorDialog(true);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {user ? 'Edit User' : 'Create New User'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                  {errors.name && (
                    <span className="text-red-600 dark:text-red-400 ml-1">*Format: First Last (e.g. John Doe)</span>
                  )}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 
                    ${errors.name 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white'
                    }`}
                  placeholder="Enter name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    Please enter a valid name in the format: First Last
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                  {errors.email && (
                    <span className="text-red-600 dark:text-red-400 ml-1">*Required</span>
                  )}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors({ ...errors, email: false });
                  }}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 
                    ${errors.email 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white'
                    }`}
                  placeholder="Enter email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">Please enter an email address</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mobile
                  {errors.mobile && (
                    <span className="text-red-600 dark:text-red-400 ml-1">*Must be 10 digits</span>
                  )}
                </label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={handleMobileChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 
                    ${errors.mobile 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white'
                    }`}
                  placeholder="Enter 10 digit mobile number"
                  maxLength="10"
                  pattern="\d{10}"
                />
                {errors.mobile && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formData.mobile.length === 0 
                      ? "Please enter a mobile number"
                      : "Mobile number must be exactly 10 digits"
                    }
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                >
                  {user ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <SuccessDialog
        isOpen={showSuccessDialog}
        message={successMessage}
        duration={3000}
        onClose={() => {
          setShowSuccessDialog(false);
          setSuccessMessage('');
          onCancel();
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

export default UserForm; 