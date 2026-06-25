import React, { useState } from 'react';
import { useAdminAuth } from '../../lib/AdminAuthContext';
import FormField from '../../components/admin/FormField';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const { login, error: authError } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-zinc-950 to-zinc-950 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center font-bold text-white text-xl mx-auto mb-4 shadow-lg shadow-accent/30">
            A
          </div>
          <h2 className="text-2xl font-bold text-zinc-100 mb-1">Welcome Back</h2>
          <p className="text-zinc-500 text-sm">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Email Address"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
          />

          <FormField
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {(error || authError) && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-semibold text-center"
            >
              {error || authError}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:opacity-90 active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-accent/20 hover:shadow-accent/30 flex items-center justify-center text-sm disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// Set layout to none/custom layout
LoginPage.layout = 'none';

export default LoginPage;
