import { useState, useEffect, useRef, useCallback } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import SearchBar from './components/SearchBar';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';
import ConfirmationDialog from './components/ConfirmationDialog';
import SuccessDialog from './components/SuccessDialog';
import ErrorDialog from './components/ErrorDialog';
import Toaster from './components/Toaster';
import BackgroundFX from './components/BackgroundFX';
import { StatsSkeleton, TableSkeleton } from './components/Skeletons';
import ErrorState from './components/ErrorState';
import { greeting } from './utils/helpers';

const API_URL = 'https://new-crud-tau.vercel.app/api/users';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const toast = useToast().toast;
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteAllConfirmation, setShowDeleteAllConfirmation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorData, setErrorData] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      const sortedUsers = Array.isArray(data) ? data.reverse() : [];
      setAllUsers(sortedUsers);
      setUsers(sortedUsers);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleCreate = useCallback(
    async (userData) => {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (response.ok) {
          setUsers((prev) => [data, ...prev]);
          setAllUsers((prev) => [data, ...prev]);
          return { success: true };
        }

        if (data.message.includes('email already exists')) {
          throw {
            message: `User with email ${userData.email} already exists`,
            email: true,
            existingUser: data.existingUser?.name || 'another user',
          };
        }
        if (data.message.includes('mobile already exists')) {
          throw {
            message: `User with mobile ${userData.mobile} already exists`,
            mobile: true,
            existingUser: data.existingUser?.name || 'another user',
          };
        }
        throw new Error(data.message || 'Failed to create user');
      } catch (err) {
        console.error('Error creating user:', err);
        throw err;
      }
    },
    [],
  );

  const handleUpdate = useCallback(async (userData) => {
    try {
      const response = await fetch(`${API_URL}/${userData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        fetchUsers();
        return { success: true };
      }
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to update user');
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  }, [fetchUsers]);

  const handleDelete = useCallback(
    async (userId) => {
      try {
        const response = await fetch(`${API_URL}/${userId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchUsers();
          toast.success('User deleted successfully');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete user');
        }
      } catch (err) {
        console.error('Error deleting user:', err);
        toast.error('Failed to delete user. Please try again.');
      }
    },
    [fetchUsers, toast],
  );

  const handleDeleteAll = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/delete-all`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Successfully deleted ${data.deletedCount} users`);
        fetchUsers();
      } else {
        throw new Error(data.message || 'Failed to delete all users');
      }
    } catch (err) {
      console.error('Error deleting all users:', err);
      toast.error('Failed to delete all users. Please try again.');
    }
    setShowDeleteAllConfirmation(false);
  }, [fetchUsers, toast]);

  const handleSearch = useCallback(
    async (query) => {
      try {
        setIsSearching(true);
        const response = await fetch(`${API_URL}/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (response.ok) {
          setUsers(data.users);
        } else {
          throw new Error(data.message || 'Failed to search users');
        }
      } catch (err) {
        console.error('Error searching users:', err);
        toast.error('Failed to search users. Please try again.');
      } finally {
        setIsSearching(false);
      }
    },
    [toast],
  );

  const loadedRef = useRef(false);
  const prevQueryRef = useRef(searchQuery);

  useEffect(() => {
    const queryChanged = prevQueryRef.current !== searchQuery;
    prevQueryRef.current = searchQuery;

    if (!queryChanged) {
      if (!loadedRef.current) {
        loadedRef.current = true;
        fetchUsers();
      }
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        fetchUsers();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch, fetchUsers]);

  const openCreate = () => {
    setSelectedUser(null);
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleFormSuccess = (message) => {
    setShowForm(false);
    setSelectedUser(null);
    setSuccessMessage(message);
    setShowSuccessDialog(true);
  };

  const handleFormError = ({ message, errorData: data }) => {
    setErrorMessage(message);
    setErrorData(data);
    setShowErrorDialog(true);
  };

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const showSkeleton = loading && users.length === 0;

  return (
    <div className="min-h-screen">
      <BackgroundFX />

      <Navbar onRefresh={fetchUsers} refreshing={refreshing} />

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <div className="mb-6 flex animate-slide-up flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-app-text sm:text-3xl">
              {greeting()}, <span className="text-gradient">Admin</span>
            </h1>
            <p className="mt-1.5 text-sm text-app-text-2">
              {searchQuery
                ? `Showing results for “${searchQuery}”.`
                : 'Manage and monitor your user directory in one place.'}
            </p>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-app-text-3">{todayLabel}</p>
        </div>

        <section aria-label="Statistics" className="animate-fade-in">
          {showSkeleton ? <StatsSkeleton /> : <DashboardStats users={allUsers} />}
        </section>

        <div className="mb-5 mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar
            className="w-full sm:min-w-0 sm:flex-1"
            value={searchQuery}
            onChange={setSearchQuery}
            isSearching={isSearching}
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={openCreate} className="btn-primary px-5 py-2.5 text-sm">
              <PlusIcon className="h-4 w-4" />
              Create User
            </button>
            {users.length > 0 && (
              <button
                type="button"
                onClick={() => setShowDeleteAllConfirmation(true)}
                className="btn-danger px-5 py-2.5 text-sm"
              >
                <TrashIcon className="h-4 w-4" />
                Delete All Users
              </button>
            )}
          </div>
        </div>

        {showSkeleton ? (
          <TableSkeleton />
        ) : error && users.length === 0 ? (
          <ErrorState message={error} onRetry={fetchUsers} />
        ) : (
          <UserTable
            users={users}
            totalCount={allUsers.length}
            searchQuery={searchQuery}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefresh={fetchUsers}
            onOpenCreate={openCreate}
            onClearSearch={() => setSearchQuery('')}
          />
        )}
      </main>

      <footer className="relative z-10 border-t border-app-border-2 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-app-text-3 sm:flex-row sm:px-6 lg:px-8">
          <p>
            ProfileHub <span className="mx-1">·</span> Profile Management Dashboard
          </p>
          <p>Built with React, Vite &amp; Tailwind CSS</p>
        </div>
      </footer>

      {showForm && (
        <UserForm
          user={selectedUser}
          onSubmit={selectedUser ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setSelectedUser(null);
          }}
          onSuccess={handleFormSuccess}
          onError={handleFormError}
        />
      )}

      <ConfirmationDialog
        isOpen={showDeleteAllConfirmation}
        title="Delete All Users"
        message={`Are you sure you want to delete all ${users.length} users? This action cannot be undone.`}
        confirmText="Delete All"
        onConfirm={handleDeleteAll}
        onCancel={() => setShowDeleteAllConfirmation(false)}
      />

      <SuccessDialog
        isOpen={showSuccessDialog}
        message={successMessage}
        duration={3000}
        onClose={() => setShowSuccessDialog(false)}
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

      <Toaster />
    </div>
  );
}

export default App;
