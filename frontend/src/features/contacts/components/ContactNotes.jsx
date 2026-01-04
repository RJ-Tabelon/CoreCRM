import { useState } from 'react';
import Button from '../../../components/ui/Button.jsx';

export default function ContactNotes({ notes, onAdd }) {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async e => {
    e.preventDefault();
    if (!content.trim()) return;
    setSaving(true);
    try {
      await onAdd({ content });
      setContent('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='space-y-3'>
      <form onSubmit={submit} className='space-y-2'>
        <div className='text-sm font-bold'>Add note</div>
        <textarea
          className='textarea'
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder='Write a note…'
        />
        <div className='flex justify-end'>
          <Button type='submit' variant='secondary' disabled={saving}>
            {saving ? 'Adding…' : 'Add note'}
          </Button>
        </div>
      </form>

      <div className='text-sm font-bold'>Notes</div>
      {notes.length === 0 ? (
        <div className='text-sm text-slate-600'>No notes yet.</div>
      ) : (
        <div className='space-y-2'>
          {notes.map(n => (
            <div key={n.id} className='glass-card p-3'>
              <div className='text-sm text-slate-800 whitespace-pre-wrap'>
                {n.content}
              </div>
              <div className='mt-2 text-xs text-slate-500'>
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
