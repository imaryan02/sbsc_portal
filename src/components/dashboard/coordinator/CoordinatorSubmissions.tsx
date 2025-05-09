import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function CoordinatorSubmissions() {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const { data: subs, error } = await supabase
        .from('submissions')
        .select(`id, github_link, file_url, submitted_at,
                 mentee_id,
                 projects ( title, mentor_id ),
                 users!submissions_mentee_id_fkey ( full_name )`);

      if (error) {
        console.error(error.message);
      } else {
        setRecords(subs || []);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Submissions</h2>
      {records.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <ul className="space-y-4">
          {records.map((r) => (
            <li key={r.id} className="border p-4 rounded">
              <p><strong>Project:</strong> {r.projects?.title}</p>
              <p><strong>Mentee:</strong> {r.users?.full_name}</p>
              <p><strong>GitHub:</strong> <a href={r.github_link} target="_blank">{r.github_link}</a></p>
              {r.file_url && (
                <p><strong>File:</strong> <a href={r.file_url} target="_blank">Download</a></p>
              )}
              <p><strong>Submitted On:</strong> {new Date(r.submitted_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
