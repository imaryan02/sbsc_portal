import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function ReviewSubmissions() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [mentorId, setMentorId] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<Record<string, { comment: string; rating: number }>>({});

  useEffect(() => {
    const fetchMentor = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setMentorId(user?.id || null);
    };
    fetchMentor();
  }, []);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!mentorId) return;

      const { data, error } = await supabase
        .from('submissions')
        .select('id, github_link, file_url, mentee_id, project_id, projects(title, mentor_id)')
        .in('project_id', 
          (
            await supabase
              .from('projects')
              .select('id')
              .eq('mentor_id', mentorId)
          ).data?.map(p => p.id) || []
        );

      if (error) console.error('Error:', error.message);
      else setSubmissions(data || []);
    };

    fetchSubmissions();
  }, [mentorId]);

  const handleFeedbackSubmit = async (submissionId: string) => {
    const fb = feedbacks[submissionId];
    if (!fb?.comment || !fb.rating) {
      alert('Please enter comment and rating.');
      return;
    }

    const { error } = await supabase.from('feedback').insert([
      {
        submission_id: submissionId,
        mentor_id: mentorId,
        comment: fb.comment,
        rating: fb.rating,
      },
    ]);

    if (error) alert('Failed to submit feedback: ' + error.message);
    else alert('Feedback submitted!');
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Review Submissions</h2>
      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <div className="space-y-6">
          {submissions.map((s) => (
            <div key={s.id} className="border p-4 rounded">
              <p><strong>GitHub:</strong> <a href={s.github_link} target="_blank">{s.github_link}</a></p>
              {s.file_url && (
                <p><strong>File:</strong> <a href={s.file_url} target="_blank">Download</a></p>
              )}
              <div className="mt-2 space-y-2">
                <textarea
                  placeholder="Write feedback..."
                  className="w-full border p-2"
                  value={feedbacks[s.id]?.comment || ''}
                  onChange={(e) =>
                    setFeedbacks((prev) => ({
                      ...prev,
                      [s.id]: { ...prev[s.id], comment: e.target.value },
                    }))
                  }
                />
                <input
                  type="number"
                  placeholder="Rating (1–5)"
                  min={1}
                  max={5}
                  className="w-full border p-2"
                  value={feedbacks[s.id]?.rating || ''}
                  onChange={(e) =>
                    setFeedbacks((prev) => ({
                      ...prev,
                      [s.id]: { ...prev[s.id], rating: Number(e.target.value) },
                    }))
                  }
                />
                <button
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                  onClick={() => handleFeedbackSubmit(s.id)}
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
