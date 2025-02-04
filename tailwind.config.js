/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ... other extensions
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.custom-scrollbar': {
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555',
          },
        },
        '.custom-scrollbar-dark': {
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#374151',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#4B5563',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#6B7280',
          },
        },
      });
    },
  ],
}

