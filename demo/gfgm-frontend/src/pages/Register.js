import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuth = localStorage.getItem('user');
    if (storedAuth) {
      navigate("/recipes");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register');
    }
  };

  return (
      <div
          className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-8 shadow-lg">
              <span className="text-2xl">🍏</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Join Our Community</h2>
            <p className="text-lg text-slate-600">Create your account and start your fitness nutrition journey</p>
            <p className="mt-4 text-slate-600">
              Already have an account?{" "}
              <Link
                  to="/login"
                  className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-12 px-8 shadow-2xl rounded-3xl border border-slate-200">
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <i className="fas fa-exclamation-circle text-red-500 text-lg"></i>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
            )}

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-user text-slate-400"></i>
                      </div>
                      <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John"
                          className="block w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-user text-slate-400"></i>
                      </div>
                      <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe"
                          className="block w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-at text-slate-400"></i>
                    </div>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="johndoe"
                        className="block w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-lg"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-envelope text-slate-400"></i>
                    </div>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="block w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-lg"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-lock text-slate-400"></i>
                    </div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a strong password"
                        className="block w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded-lg"
                />
                <label htmlFor="terms" className="ml-3 block text-sm text-slate-700">
                  I agree to the{" "}
                  <a href="#" className="font-semibold text-emerald-600 hover:text-emerald-700">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-semibold text-emerald-600 hover:text-emerald-700">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <div>
                <button
                    type="submit"
                    className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                  <i className="fas fa-user-plus group-hover:scale-110 transition-transform duration-300"></i>
                </span>
                  Create Account
                </button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"/>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                    className="group w-full inline-flex justify-center items-center py-3 px-4 border-2 border-slate-200 rounded-2xl shadow-sm bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                    />
                  </svg>
                  Google
                </button>

                <button
                    className="group w-full inline-flex justify-center items-center py-3 px-4 border-2 border-slate-200 rounded-2xl shadow-sm bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                  Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Register; 