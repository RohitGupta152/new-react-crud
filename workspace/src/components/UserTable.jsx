import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import {
  EnvelopeIcon,
  PhoneIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ArrowPathIcon,
  UsersIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import ConfirmationDialog from './ConfirmationDialog';
import SuccessDialog from './SuccessDialog';
import ErrorDialog from './ErrorDialog';
import EmptyState from './EmptyState';
import Avatar from './Avatar';
import IconButton from './IconButton';
import { formatDate, timeAgo } from '../utils/helpers';

const API_URL = 'https://new-crud-tau.vercel.app/api/users';

function UserTable({
  users,
  totalCount,
  searchQuery,
  onEdit,
  onDelete,
  onRefresh,
  onOpenCreate,
  onClearSearch,
}) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorData, setErrorData] = useState(null);

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
        const response = await fetch(`${API_URL}/import`, {
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
        onRefresh();
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

  const handleDownload = () => {
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
  };

  if (!users.length) {
    return (
      <>
        <EmptyState
          icon={searchQuery ? MagnifyingGlassIcon : UsersIcon}
          title={searchQuery ? 'No results found' : 'No users found'}
          message={
            searchQuery
              ? `No users match "${searchQuery}". Try a different search term.`
              : 'Create a new user to get started, or import existing users from a JSON file.'
          }
        >
          {searchQuery ? (
            <button type="button" onClick={onClearSearch} className="btn-secondary px-5 py-2.5 text-sm">
              Clear search
            </button>
          ) : (
            <>
              <button type="button" onClick={onOpenCreate} className="btn-primary px-5 py-2.5 text-sm">
                <UserPlusIcon className="h-4 w-4" />
                Create User
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportJSON}
                accept="application/json"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                className="btn-secondary px-5 py-2.5 text-sm"
              >
                <ArrowUpTrayIcon className="h-4 w-4" />
                {importing ? 'Importing…' : 'Import JSON'}
              </button>
            </>
          )}
        </EmptyState>

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
  }

  const showAll = !searchQuery;

  return (
    <>
      <div className="card mb-4 flex flex-col gap-3 rounded-2xl p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-glow">
            <UsersIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-medium text-app-text-2">
              {showAll ? 'Total Entries' : 'Search Results'}
            </p>
            <p className="text-xl font-extrabold tabular-nums text-app-text">
              {users.length.toLocaleString()}
              {!showAll && (
                <span className="text-sm font-medium text-app-text-3">
                  {' '}/ {totalCount.toLocaleString()} total
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJSON}
            accept="application/json"
            className="hidden"
          />
          <button type="button" onClick={onRefresh} className="btn-secondary px-3.5 py-2 text-xs sm:text-sm">
            <ArrowPathIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button type="button" onClick={handleDownload} className="btn-secondary px-3.5 py-2 text-xs sm:text-sm">
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Download JSON</span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="btn-secondary px-3.5 py-2 text-xs sm:text-sm"
          >
            <ArrowUpTrayIcon className={`h-4 w-4 ${importing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{importing ? 'Importing…' : 'Import JSON'}</span>
          </button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="table-glass hidden overflow-hidden rounded-2xl md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-app-border bg-app-surface-2 text-xs uppercase tracking-wider text-app-text-3">
                <th scope="col" className="px-6 py-4 font-semibold">User</th>
                <th scope="col" className="px-6 py-4 font-semibold">Email</th>
                <th scope="col" className="px-6 py-4 font-semibold">Mobile</th>
                <th scope="col" className="px-6 py-4 font-semibold">Joined</th>
                <th scope="col" className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border-2">
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className="group animate-fade-in transition-colors duration-150 hover:bg-app-primary-softer"
                  style={{ animationDelay: `${Math.min(index * 35, 350)}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-app-text">{user.name}</p>
                        <p className="truncate text-xs text-app-text-3">
                          ID · {String(user._id).slice(-8)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-app-text-2">
                      <EnvelopeIcon className="h-4 w-4 shrink-0 text-app-text-3" />
                      <span className="break-all">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-app-text-2">
                      <PhoneIcon className="h-4 w-4 shrink-0 text-app-text-3" />
                      <span className="tabular-nums">{user.mobile}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-app-text-2">
                      <CalendarDaysIcon className="h-4 w-4 shrink-0 text-app-text-3" />
                      <div>
                        <p>{formatDate(user.createdAt)}</p>
                        <p className="text-xs text-app-text-3">{timeAgo(user.createdAt)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <IconButton
                        label={`Edit ${user.name}`}
                        icon={PencilSquareIcon}
                        onClick={() => onEdit(user)}
                        size="sm"
                      />
                      <IconButton
                        label={`Delete ${user.name}`}
                        icon={TrashIcon}
                        onClick={() => handleDeleteClick(user)}
                        size="sm"
                        tone="danger"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {users.map((user, index) => (
          <article
            key={user._id}
            className="card animate-fade-in rounded-2xl p-4 transition-colors duration-150 hover:bg-app-surface-2"
            style={{ animationDelay: `${Math.min(index * 35, 350)}ms` }}
          >
            <div className="flex items-start gap-3">
              <Avatar name={user.name} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-app-text">{user.name}</p>
                <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-app-text-3">
                  <CalendarDaysIcon className="h-3.5 w-3.5 shrink-0" />
                  Joined {formatDate(user.createdAt)} · {timeAgo(user.createdAt)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <IconButton
                  label={`Edit ${user.name}`}
                  icon={PencilSquareIcon}
                  onClick={() => onEdit(user)}
                  size="sm"
                />
                <IconButton
                  label={`Delete ${user.name}`}
                  icon={TrashIcon}
                  onClick={() => handleDeleteClick(user)}
                  size="sm"
                  tone="danger"
                />
              </div>
            </div>
            <div className="mt-3 space-y-2 border-t border-app-border-2 pt-3">
              <div className="flex items-center gap-2 text-sm text-app-text-2">
                <EnvelopeIcon className="h-4 w-4 shrink-0 text-app-text-3" />
                <span className="break-all">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-app-text-2">
                <PhoneIcon className="h-4 w-4 shrink-0 text-app-text-3" />
                <span className="tabular-nums">{user.mobile}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <ConfirmationDialog
        isOpen={showDeleteConfirmation}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
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
}

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  totalCount: PropTypes.number,
  searchQuery: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onOpenCreate: PropTypes.func.isRequired,
  onClearSearch: PropTypes.func.isRequired,
};

export default UserTable;
