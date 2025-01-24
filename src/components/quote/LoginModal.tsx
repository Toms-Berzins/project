interface LoginModalProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (email: string, password: string, name: string) => Promise<void>;
  onClose: () => void;
  error?: string | null;
}

export const LoginModal = ({ onLogin, onSignup, onClose, error }: LoginModalProps) => (
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
          className="w-full bg-blue-600 text-white py-2 rounded mb-2"
        >
          Login
        </button>
      </form>

      <div className="text-center my-4">
        <span className="text-gray-500">or</span>
      </div>

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
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full p-2 border rounded mb-2"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
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
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Sign Up
        </button>
      </form>

      <button
        onClick={onClose}
        className="mt-4 text-gray-500 hover:text-gray-700"
      >
        Cancel
      </button>
    </div>
  </div>
); 