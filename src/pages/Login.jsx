import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginSuccess } from '../store/authSlice';

const Login = () => {
  const [email, setEmail] = useState('admin@store.com');
  const [password, setPassword] = useState('password123');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    let registeredUser = null;
    try {
      const raw = localStorage.getItem('registeredUser');
      if (raw) registeredUser = JSON.parse(raw);
    } catch {
      registeredUser = null;
    }

    // Allow registered user credentials OR default demo credentials
    const isRegisteredMatch =
      registeredUser &&
      email.toLowerCase() === registeredUser.email.toLowerCase() &&
      password === registeredUser.password;

    const isDemoMatch =
      email.toLowerCase() === 'admin@store.com' && password === 'password123';

    if (isRegisteredMatch || isDemoMatch) {
      const activeUser = isRegisteredMatch
        ? registeredUser
        : { name: 'Admin Manager', email: 'admin@store.com', role: 'Store Owner' };

      const authPayload = {
        user: activeUser,
        token: `JWT_${Math.random().toString(36).substring(2)}_${Date.now()}`,
      };

      dispatch(loginSuccess(authPayload));
      toast.success(`Welcome back, ${activeUser.name}!`);
      navigate('/');
    } else {
      toast.error('Invalid email or password. Use demo: admin@store.com / password123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-800">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto text-2xl font-black mb-4">
            <i className="fas fa-boxes"></i>
          </div>
          <h2 className="text-3xl font-black text-white">System Login</h2>
          <p className="text-xs text-slate-400 mt-2">
            Sign in to access your inventory management workspace
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="admin@store.com"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-3 text-[11px] text-indigo-300">
            <strong>Demo Credentials:</strong> admin@store.com / password123
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-600/25 transition active:scale-95 text-sm uppercase tracking-wider mt-2"
          >
            Login to Dashboard
          </button>

          <p className="text-slate-400 text-center text-xs pt-4">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-indigo-400 hover:text-indigo-300 font-bold ml-1 underline"
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
