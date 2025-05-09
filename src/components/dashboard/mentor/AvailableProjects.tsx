import { useEffect, useState } from 'react';

import { supabase } from '../../../lib/supabaseClient';


interface Project {
  id: string;
  title: string;
  description: string;
  domain: string;
  status: string;
}

export default function AvailableProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [applying, setApplying] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Get logged-in user ID
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    fetchUser();
  }, []);

  // Fetch available projects
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'available');

      if (error) console.error('Error fetching projects:', error.message);
      else setProjects(data || []);
    };

    fetchProjects();
  }, []);

  // Apply to project
  const applyToProject = async (projectId: string) => {
    if (!userId) return;

    setApplying(projectId);
    const { error } = await supabase.from('applications').insert([
      {
        mentee_id: userId,
        project_id: projectId,
        status: 'pending',
      },
    ]);
    setApplying(null);

    if (error) {
      alert('Failed to apply: ' + error.message);
    } else {
      alert('Application sent!');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Available Projects</h2>
      {projects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li key={project.id} className="border p-4 rounded">
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="text-sm text-gray-700">{project.description}</p>
              <p className="text-sm text-blue-600">Domain: {project.domain}</p>
              <button
                className="mt-2 px-4 py-1 bg-green-600 text-white rounded"
                onClick={() => applyToProject(project.id)}
                disabled={applying === project.id}
              >
                {applying === project.id ? 'Applying...' : 'Apply'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
