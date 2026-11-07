import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      toast.error('Username is required.');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match! Please verify your password.');
      return;
    }

    const newUser = {
      name: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: 'Store Administrator',
    };

    try {
      localStorage.setItem('registeredUser', JSON.stringify(newUser));
      toast.success('Account created successfully! Please login.');
      navigate('/login');
    } catch {
      toast.error('Failed to create account. Storage quota exceeded.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-800">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto text-2xl font-black mb-4">
            <i className="fas fa-user-plus"></i>
          </div>
          <h2 className="text-3xl font-black text-white">Create Account</h2>
          <p className="text-xs text-slate-400 mt-2">
            Register your store administrator profile
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
              Username *
            </label>
            <input
              required
              type="text"
              value={formData.username}
              placeholder="e.g. Mahmoud Ali"
              className="w-full p-4 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
              Email Address *
            </label>
            <input
              required
              type="email"
              value={formData.email}
              placeholder="user@store.com"
              className="w-full p-4 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
              Password *
            </label>
            <input
              required
              type="password"
              value={formData.password}
              placeholder="Min 6 characters"
              className="w-full p-4 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
              Confirm Password *
            </label>
            <input
              required
              type="password"
              value={formData.confirmPassword}
              placeholder="Re-enter password"
              className="w-full p-4 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/25 active:scale-95 text-sm uppercase tracking-wider mt-4"
          >
            Create Store Profile
          </button>
        </form>

        <p className="text-slate-400 text-center mt-6 text-xs">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-indigo-400 font-bold ml-1 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;