import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Modal from './Modal';

const formatName = (name) =>
  name
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/[^a-zA-Z\s]/g, '');

const validateName = (name) => {
  const nameRegex = /^[A-Z][a-z]+ [A-Z][a-z]+$/;
  return nameRegex.test(name);
};

const validateMobile = (mobile) => /^\d{10}$/.test(mobile);

function UserForm({ user, onSubmit, onCancel, onSuccess, onError }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
  });
  const [errors, setErrors] = useState({ name: false, email: false, mobile: false });
  const [submitting, setSubmitting] = useState(false);

  const handleNameChange = (e) => {
    const formattedName = formatName(e.target.value);
    setFormData({ ...formData, name: formattedName });
    setErrors({ ...errors, name: formattedName.trim() === '' || !validateName(formattedName) });
  };

  const handleMobileChange = (e) => {
    const formattedMobile = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
    setFormData({ ...formData, mobile: formattedMobile });
    setErrors({ ...errors, mobile: formattedMobile.length !== 10 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: !formData.name.trim() || !validateName(formData.name),
      email: !formData.email.trim(),
      mobile: !formData.mobile.trim() || !validateMobile(formData.mobile),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) return;

    setSubmitting(true);
    try {
      const result = await onSubmit(formData);
      if (result?.success) {
        onSuccess(user ? 'User updated successfully!' : 'User created successfully!');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      onError({
        message: error.message || 'An error occurred',
        errorData: {
          existingInDatabase: {
            emails: error.email ? [{ value: formData.email, existingUser: { name: error.existingUser } }] : [],
            mobiles: error.mobile ? [{ value: formData.mobile, existingUser: { name: error.existingUser } }] : [],
          },
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (invalid) =>
    `input-field h-11 pl-11 pr-4 text-sm ${invalid ? 'invalid' : ''}`;

  return (
    <Modal
      isOpen
      onClose={onCancel}
      maxWidth="max-w-md"
      bottomSheet
      titleId="user-form-title"
    >
      <div className="flex items-start justify-between gap-3 border-b border-app-border-2 px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-glow">
            <UserIcon className="h-5 w-5" />
          </span>
          <div>
            <h3 id="user-form-title" className="text-lg font-bold leading-tight text-app-text">
              {user ? 'Edit User' : 'Create New User'}
            </h3>
            <p className="text-xs text-app-text-3">
              {user ? 'Update the details below' : 'Add a new member to your directory'}
            </p>
          </div>
        </div>
        <button type="button" onClick={onCancel} aria-label="Close" className="icon-btn shrink-0">
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
        <div>
          <label htmlFor="user-name" className="mb-1.5 block text-sm font-semibold text-app-text">
            Full Name
            <span className="ml-1 text-app-danger" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-app-text-3">
              <UserIcon className="h-5 w-5" />
            </span>
            <input
              id="user-name"
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              data-autofocus
              aria-invalid={errors.name || undefined}
              aria-describedby={errors.name ? 'user-name-error' : undefined}
              placeholder="e.g. John Doe"
              autoComplete="name"
              className={fieldClass(errors.name)}
            />
          </div>
          {errors.name && (
            <p id="user-name-error" className="mt-1.5 text-xs font-medium text-app-danger">
              Please enter a valid name in the format: First Last (letters only)
            </p>
          )}
        </div>

        <div>
          <label htmlFor="user-email" className="mb-1.5 block text-sm font-semibold text-app-text">
            Email Address
            <span className="ml-1 text-app-danger" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-app-text-3">
              <EnvelopeIcon className="h-5 w-5" />
            </span>
            <input
              id="user-email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setErrors({ ...errors, email: false });
              }}
              aria-invalid={errors.email || undefined}
              aria-describedby={errors.email ? 'user-email-error' : undefined}
              placeholder="name@company.com"
              autoComplete="email"
              className={fieldClass(errors.email)}
            />
          </div>
          {errors.email && (
            <p id="user-email-error" className="mt-1.5 text-xs font-medium text-app-danger">
              Please enter an email address
            </p>
          )}
        </div>

        <div>
          <label htmlFor="user-mobile" className="mb-1.5 block text-sm font-semibold text-app-text">
            Mobile Number
            <span className="ml-1 text-app-danger" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-app-text-3">
              <PhoneIcon className="h-5 w-5" />
            </span>
            <input
              id="user-mobile"
              type="tel"
              value={formData.mobile}
              onChange={handleMobileChange}
              aria-invalid={errors.mobile || undefined}
              aria-describedby={errors.mobile ? 'user-mobile-error' : undefined}
              placeholder="10 digit mobile number"
              maxLength="10"
              pattern="\d{10}"
              autoComplete="tel"
              className={fieldClass(errors.mobile)}
            />
          </div>
          {errors.mobile && (
            <p id="user-mobile-error" className="mt-1.5 text-xs font-medium text-app-danger">
              {formData.mobile.length === 0
                ? 'Please enter a mobile number'
                : 'Mobile number must be exactly 10 digits'}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="btn-secondary px-5 py-2.5 text-sm"
          >
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1 px-5 py-2.5 text-sm">
            {submitting ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                {user ? 'Updating…' : 'Creating…'}
              </>
            ) : user ? (
              'Update User'
            ) : (
              'Create User'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

UserForm.propTypes = {
  user: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

export default UserForm;
