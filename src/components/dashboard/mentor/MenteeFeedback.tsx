import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function MenteeFeedback() {
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!userId) return;

      // Get all submissions by this mentee
      const { data: subs, error: subError } = await supabase
        .from('submissions')
        .select('id, github_link, file_url, project_id, projects(title)')
        .eq('mentee_id', userId);

      if (subError) {
        console.error(subError.message);
        return;
      }

      const allFeedbacks: any[] = [];

      // For each submission, fetch feedback
      for (const submission of subs || []) {
        const { data: feedbacks } = await supabase
          .from('feedback')
          .select('*')
          .eq('submission_id', submission.id);

        if (feedbacks?.length) {
          feedbacks.forEach((fb) =>
            allFeedbacks.push({ ...fb, submission })
          );
        }
      }

      setFeedbackList(allFeedbacks);
    };

    fetchFeedback();
  }, [userId]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Feedback</h2>
      {feedbackList.length === 0 ? (
        <p>No feedback yet.</p>
      ) : (
        <ul className="space-y-4">
          {feedbackList.map((fb) => (
            <li key={fb.id} className="border p-4 rounded">
              <p><strong>Project:</strong> {fb.submission.projects?.title}</p>
              <p><strong>GitHub:</strong> <a href={fb.submission.github_link} target="_blank">{fb.submission.github_link}</a></p>
              {fb.submission.file_url && (
                <p><strong>File:</strong> <a href={fb.submission.file_url} target="_blank">Download</a></p>
              )}
              <p><strong>Rating:</strong> {fb.rating}/5</p>
              <p><strong>Feedback:</strong> {fb.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
