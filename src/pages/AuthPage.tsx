import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('mentee');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return alert(error.message);

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user?.id)
        .single();

      const r = userData?.role;
      if (r === 'mentee') navigate('/dashboard/mentee');
      else if (r === 'mentor') navigate('/dashboard/mentor');
      else if (r === 'coordinator') navigate('/dashboard/coordinator');
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return alert(error.message);

      const user = data.user;
      if (user) {
        await supabase.from('users').insert([{ id: user.id, email, full_name: fullName, role }]);
        alert('Signup successful! Please log in.');
        setIsLogin(true);
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-blue-600 text-white flex items-center justify-center p-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Mentor Project Hub</h1>
          <p className="mt-4 text-lg">Manage academic projects, feedback, and submissions seamlessly.</p>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center p-10 bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6 bg-white p-8 shadow-xl rounded-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800">
            {isLogin ? 'Welcome Back 👋' : 'Create Your Account'}
          </h2>

          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border p-2 rounded"
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <select
                className="w-full border p-2 rounded"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="mentee">Mentee</option>
                <option value="mentor">Mentor</option>
                <option value="coordinator">Coordinator</option>
              </select>
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>

          <p className="text-sm text-gray-600 text-center">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:underline font-medium"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
