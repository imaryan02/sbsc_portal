import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('mentee');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;
    if (user) {
      await supabase.from('users').insert([
        {
          id: user.id,
          email,
          full_name: fullName,
          role,
        },
      ]);
    }

    alert('Signup successful! Redirecting...');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section (branding) */}
      <div className="w-1/2 bg-green-600 text-white flex items-center justify-center p-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Join Mentor Project Hub</h1>
          <p className="mt-4 text-lg">Build your future with guided project collaboration.</p>
        </div>
      </div>

      {/* Right Section (form) */}
      <div className="w-1/2 flex items-center justify-center p-10 bg-gray-50">
        <form
          onSubmit={handleSignup}
          className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-800">Create Your Account</h2>

          <input
            type="text"
            placeholder="Full Name"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="mentee">Mentee</option>
            <option value="mentor">Mentor</option>
            <option value="coordinator">Coordinator</option>
          </select>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold transition"
          >
            Sign Up
          </button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-green-600 hover:underline font-medium">
              Log In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
