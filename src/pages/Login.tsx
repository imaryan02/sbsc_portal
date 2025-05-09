import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;
    if (user) {
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (userData?.role === 'mentee') navigate('/dashboard/mentee');
      else if (userData?.role === 'mentor') navigate('/dashboard/mentor');
      else if (userData?.role === 'coordinator') navigate('/dashboard/coordinator');
      else navigate('/not-found');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section (optional branding/text) */}
      <div className="w-1/2 bg-blue-600 text-white flex items-center justify-center p-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Mentor Project Hub</h1>
          <p className="mt-4 text-lg">Empowering students and mentors to collaborate effortlessly.</p>
        </div>
      </div>

      {/* Right Section (form) */}
      <div className="w-1/2 flex items-center justify-center p-10 bg-gray-50">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back 👋</h2>

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition"
          >
            Log In
          </button>

          <p className="text-sm text-center text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline font-medium">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
