import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function SubmitProject() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    fetchUser();
  }, []);

  // Fetch only approved applications for this mentee
  useEffect(() => {
    const fetchAppliedProjects = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from('applications')
        .select('id, project_id, status, projects ( id, title )')
        .eq('mentee_id', userId)
        .eq('status', 'approved');

      if (error) {
        console.error(error.message);
      } else {
        setProjects(data || []);
      }
    };

    fetchAppliedProjects();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProject || !userId) {
      alert('Select a project.');
      return;
    }

    let fileUrl = '';
    if (file) {
      const { data, error } = await supabase.storage
        .from('project-files')
        .upload(`submissions/${Date.now()}-${file.name}`, file);

      if (error) {
        alert('File upload failed: ' + error.message);
        return;
      }

      fileUrl = data?.path
        ? supabase.storage.from('project-files').getPublicUrl(data.path).data.publicUrl
        : '';
    }

    const { error: insertError } = await supabase.from('submissions').insert([
      {
        project_id: selectedProject,
        mentee_id: userId,
        github_link: githubLink,
        file_url: fileUrl,
      },
    ]);

    if (insertError) {
      alert('Submission failed: ' + insertError.message);
    } else {
      alert('Project submitted successfully!');
      setGithubLink('');
      setFile(null);
      setSelectedProject('');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Submit Your Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Select Approved Project:</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="block mt-1 border p-2"
          >
            <option value="">-- Select a Project --</option>
            {projects.map((p) => (
              <option key={p.project_id} value={p.project_id}>
                {p.projects?.title || 'Unnamed Project'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>GitHub Repository Link:</label>
          <input
            type="url"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
            className="block w-full border p-2"
            placeholder="https://github.com/your-repo"
            required
          />
        </div>

        <div>
          <label>Upload Project File (PDF/ZIP):</label>
          <input
            type="file"
            accept=".pdf,.zip,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block mt-1"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
