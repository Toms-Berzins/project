import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card, { CardHeader, CardContent, CardTitle } from '../ui/Card';

interface LoginModalProps {
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string, name: string) => void;
  onSocialLogin: (provider: 'google' | 'facebook') => void;
  onClose: () => void;
  error?: string;
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>{isLoginView ? 'Login' : 'Sign Up'}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-red-500 mb-4">{error}</p>
          )}

          <div className="space-y-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => onSocialLogin('google')}
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
              }
            >
              Continue with Google
            </Button>
            <p className="text-xs text-gray-500 text-center">Note: If you experience issues logging in with Google, you may need to temporarily disable Grammarly.</p>

            <Button
              variant="outline"
              fullWidth
              onClick={() => onSocialLogin('facebook')}
              icon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              }
            >
              Continue with Facebook
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          {isLoginView ? (
            <>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                onLogin(
                  (form.elements.namedItem('email') as HTMLInputElement).value,
                  (form.elements.namedItem('password') as HTMLInputElement).value
                );
              }} className="space-y-4">
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  defaultValue={prefillEmail}
                  fullWidth
                  required
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  fullWidth
                  required
                />
                <Button type="submit" variant="primary" fullWidth>
                  Login
                </Button>
              </form>

              <div className="text-center my-4">
                <span className="text-gray-500">Don't have an account? </span>
                <Button variant="ghost" onClick={() => setIsLoginView(false)}>
                  Sign up
                </Button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                onSignup(
                  (form.elements.namedItem('email') as HTMLInputElement).value,
                  (form.elements.namedItem('password') as HTMLInputElement).value,
                  (form.elements.namedItem('name') as HTMLInputElement).value
                );
              }} className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  defaultValue={prefillName}
                  fullWidth
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  id="signup-email"
                  name="email"
                  placeholder="Enter your email"
                  defaultValue={prefillEmail}
                  fullWidth
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  id="signup-password"
                  name="password"
                  placeholder="Create a password"
                  fullWidth
                  required
                />
                <Button type="submit" variant="primary" fullWidth>
                  Sign Up
                </Button>
              </form>

              <div className="text-center my-4">
                <span className="text-gray-500">Already have an account? </span>
                <Button variant="ghost" onClick={() => setIsLoginView(true)}>
                  Login
                </Button>
              </div>
            </>
          )}

          <Button variant="ghost" onClick={onClose} fullWidth>
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}; 