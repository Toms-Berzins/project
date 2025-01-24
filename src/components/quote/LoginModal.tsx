import { useState } from 'react';

interface LoginModalProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (email: string, password: string, name: string) => Promise<void>;
  onSocialLogin: (provider: 'google' | 'facebook') => Promise<void>;
  onClose: () => void;
  error?: string | null;
  prefillName?: string;
  prefillEmail?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onLogin,
  onSignup,
  onSocialLogin,
  onClose,
  error,
  prefillName,
  prefillEmail,
}) => {
  const [isLoginView, setIsLoginView] = useState(true);

  // Switch to login view if duplicate email error occurs
  if (error?.includes('already exists') && !isLoginView) {
    setIsLoginView(true);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Login or Sign Up</h2>
        <p className="text-gray-600 mb-4">
          Please login or create an account to save your quote
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => onSocialLogin('google')}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
          <p className="text-xs text-gray-500 mt-2">Note: If you experience issues logging in with Google, you may need to temporarily disable Grammarly.</p>
          
          <button
            type="button"
            onClick={() => onSocialLogin('facebook')}
            className="w-full flex items-center justify-center gap-2 bg-[#1877F2] text-white px-4 py-2 rounded hover:bg-[#1874E8] transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>
        
        {isLoginView ? (
          <>
            {/* Login Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              onLogin(
                (form.elements.namedItem('email') as HTMLInputElement).value,
                (form.elements.namedItem('password') as HTMLInputElement).value
              );
            }}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                defaultValue={prefillEmail}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-2 border rounded mb-4"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded mb-2 hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            </form>

            <div className="text-center my-4">
              <span className="text-gray-500">Don't have an account? </span>
              <button
                onClick={() => setIsLoginView(false)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Sign Up Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              onSignup(
                (form.elements.namedItem('email') as HTMLInputElement).value,
                (form.elements.namedItem('password') as HTMLInputElement).value,
                (form.elements.namedItem('name') as HTMLInputElement).value
              );
            }}>
              <div className="mb-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  defaultValue={prefillName}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  placeholder="Enter your email"
                  defaultValue={prefillEmail}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="signup-password"
                  name="password"
                  placeholder="Create a password"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
              >
                Sign Up
              </button>
            </form>

            <div className="text-center my-4">
              <span className="text-gray-500">Already have an account? </span>
              <button
                onClick={() => setIsLoginView(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Login
              </button>
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}; 