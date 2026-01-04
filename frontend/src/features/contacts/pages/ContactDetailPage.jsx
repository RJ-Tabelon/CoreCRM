import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../../components/layout/PageHeader.jsx';
import Button from '../../../components/ui/Button.jsx';
import Modal from '../../../components/ui/Modal.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import { useToast } from '../../../components/common/ToastProvider.jsx';
import ContactForm from '../components/ContactForm.jsx';
import ContactNotes from '../components/ContactNotes.jsx';
import {
  addContactNote,
  deleteContact,
  getContact,
  listContactNotes,
  updateContact
} from '../api.js';

export default function ContactDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState(null);
  const [notes, setNotes] = useState([]);
  const [editOpen, setEditOpen] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [cRes, nRes] = await Promise.all([
        getContact(id),
        listContactNotes(id)
      ]);
      setContact(cRes.contact);
      setNotes(nRes.notes || []);
    } catch (e) {
      showToast({ type: 'error', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onUpdate = async values => {
    const payload = {
      name: values.name.trim() || undefined,
      email: values.email.trim() || undefined,
      phone: values.phone.trim() || undefined,
      company: values.company.trim() || undefined
    };
    Object.keys(payload).forEach(k => {
      if (payload[k] === undefined) delete payload[k];
    });
    const res = await updateContact(id, payload);
    showToast({ type: 'success', message: res.message || 'Contact updated' });
    setEditOpen(false);
    await fetchAll();
  };

  const onDelete = async () => {
    const ok = window.confirm(`Delete contact “${contact?.name}”?`);
    if (!ok) return;
    try {
      const res = await deleteContact(id);
      showToast({ type: 'success', message: res.message || 'Contact deleted' });
      navigate('/contacts');
    } catch (e) {
      showToast({ type: 'error', message: e.message });
    }
  };

  const onAddNote = async payload => {
    const res = await addContactNote(id, payload);
    showToast({ type: 'success', message: res.message || 'Note added' });
    const nRes = await listContactNotes(id);
    setNotes(nRes.notes || []);
  };

  if (loading) return <Spinner />;
  if (!contact) {
    return (
      <div className='space-y-3'>
        <div className='text-sm text-slate-600'>Contact not found.</div>
        <Link className='underline' to='/contacts'>
          Back to contacts
        </Link>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <PageHeader
        title={contact.name}
        subtitle={
          [contact.email, contact.phone, contact.company]
            .filter(Boolean)
            .join(' • ') || '—'
        }
        actions={
          <>
            <Button variant='secondary' onClick={() => setEditOpen(true)}>
              Edit
            </Button>
            <Button variant='danger' onClick={onDelete}>
              Delete
            </Button>
          </>
        }
      />

      <div className='grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4'>
        <div className='card'>
          <div className='card-body'>
            <div className='text-sm font-bold'>Contact details</div>
            <div className='mt-3 grid grid-cols-1 gap-2 text-sm'>
              <div>
                <div className='text-xs text-slate-500'>Email</div>
                <div className='font-medium'>{contact.email || '—'}</div>
              </div>
              <div>
                <div className='text-xs text-slate-500'>Phone</div>
                <div className='font-medium'>{contact.phone || '—'}</div>
              </div>
              <div>
                <div className='text-xs text-slate-500'>Company</div>
                <div className='font-medium'>{contact.company || '—'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className='card'>
          <div className='card-body'>
            <ContactNotes notes={notes} onAdd={onAddNote} />
          </div>
        </div>
      </div>

      <Modal
        open={editOpen}
        title='Edit Contact'
        onClose={() => setEditOpen(false)}
      >
        <ContactForm
          initialValue={contact}
          onSubmit={onUpdate}
          onCancel={() => setEditOpen(false)}
        />
      </Modal>
    </div>
  );
}
