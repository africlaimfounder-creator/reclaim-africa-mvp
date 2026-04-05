import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    } else if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-6" style={{ backgroundColor: '#0A0908' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#D4AF37' }}
            >
              <span className="text-[#0A0908] font-bold text-2xl" style={{ fontFamily: 'Outfit, sans-serif' }}>
                RA
              </span>
            </div>
          </div>
          <h1
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: 'Outfit, sans-serif' }}
            data-testid="login-title"
          >
            Welcome Back
          </h1>
          <p className="text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Login to track your claims
          </p>
        </div>

        <div
          className="rounded-2xl p-8 border"
          style={{ backgroundColor: '#12100E', borderColor: '#2B2823' }}
        >
          {error && (
            <div
              className="mb-6 p-4 rounded-xl flex items-start gap-3"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444' }}
              data-testid="login-error"
            >
              <AlertCircle size={20} style={{ color: '#EF4444' }} />
              <span className="text-sm" style={{ color: '#EF4444' }}>
                {error}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white mb-2 text-sm font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300"
                style={{
                  backgroundColor: '#1A1815',
                  borderColor: '#2B2823',
                  color: '#FFFFFF',
                  fontFamily: 'Manrope, sans-serif'
                }}
                onFocus={(e) => (e.target.style.borderColor = '#D4AF37')}
                onBlur={(e) => (e.target.style.borderColor = '#2B2823')}
                data-testid="login-email-input"
              />
            </div>

            <div>
              <label className="block text-white mb-2 text-sm font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300"
                style={{
                  backgroundColor: '#1A1815',
                  borderColor: '#2B2823',
                  color: '#FFFFFF',
                  fontFamily: 'Manrope, sans-serif'
                }}
                onFocus={(e) => (e.target.style.borderColor = '#D4AF37')}
                onBlur={(e) => (e.target.style.borderColor = '#2B2823')}
                data-testid="login-password-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#D4AF37',
                color: '#0A0908',
                fontFamily: 'Manrope, sans-serif'
              }}
              data-testid="login-submit-btn"
            >
              {loading ? 'Logging in...' : 'Login'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#D4AF37] hover:underline" data-testid="login-signup-link">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
