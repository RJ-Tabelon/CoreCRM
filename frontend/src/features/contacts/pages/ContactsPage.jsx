import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../../components/layout/PageHeader.jsx';
import Button from '../../../components/ui/Button.jsx';
import Modal from '../../../components/ui/Modal.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import SearchBar from '../../../components/common/SearchBar.jsx';
import { useToast } from '../../../components/common/ToastProvider.jsx';
import ContactForm from '../components/ContactForm.jsx';
import ContactList from '../components/ContactList.jsx';
import {
  createContact,
  deleteContact,
  listContacts,
  updateContact
} from '../api.js';

export default function ContactsPage() {
  const { showToast } = useToast();
  const [params, setParams] = useSearchParams();

  const [q, setQ] = useState(params.get('q') || '');
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const shouldOpenNew = params.get('new') === '1';

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await listContacts({ q: q.trim() || undefined });
      setContacts(res.contacts || []);
    } catch (e) {
      showToast({ type: 'error', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (shouldOpenNew) {
      setEditing(null);
      setModalOpen(true);
      params.delete('new');
      setParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldOpenNew]);

  const filtered = useMemo(() => contacts, [contacts]);

  const applySearch = async nextQ => {
    setQ(nextQ);
    const next = new URLSearchParams(params);
    if (nextQ.trim()) next.set('q', nextQ.trim());
    else next.delete('q');
    setParams(next, { replace: true });
    await fetchData();
  };

  const onCreate = async values => {
    const payload = {
      name: values.name.trim(),
      email: values.email.trim() || undefined,
      phone: values.phone.trim() || undefined,
      company: values.company.trim() || undefined
    };
    const res = await createContact(payload);
    showToast({ type: 'success', message: res.message || 'Contact created' });
    setModalOpen(false);
    await fetchData();
  };

  const onUpdate = async values => {
    const payload = {
      name: values.name.trim() || undefined,
      email: values.email.trim() || undefined,
      phone: values.phone.trim() || undefined,
      company: values.company.trim() || undefined
    };
    // Remove empty values so backend sees at least one field.
    Object.keys(payload).forEach(k => {
      if (payload[k] === undefined) delete payload[k];
    });
    const res = await updateContact(editing.id, payload);
    showToast({ type: 'success', message: res.message || 'Contact updated' });
    setModalOpen(false);
    setEditing(null);
    await fetchData();
  };

  const onDelete = async contact => {
    const ok = window.confirm(`Delete contact “${contact.name}”?`);
    if (!ok) return;
    try {
      const res = await deleteContact(contact.id);
      showToast({ type: 'success', message: res.message || 'Contact deleted' });
      await fetchData();
    } catch (e) {
      showToast({ type: 'error', message: e.message });
    }
  };

  return (
    <div className='space-y-4'>
      <PageHeader
        title='Contacts'
        subtitle='Search and manage your contacts'
        actions={
          <Button
            variant='primary'
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            New Contact
          </Button>
        }
      />

      <div className='secondary-panel'>
        <div className='grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end'>
          <div>
            <div className='text-sm font-semibold mb-1 text-slate-700'>Search</div>
            <SearchBar
              value={q}
              onChange={setQ}
              placeholder='Search name, email, company…'
            />
          </div>
          <div className='flex gap-2'>
            <Button variant='primary' onClick={() => applySearch(q)}>
              Search
            </Button>
            <Button
              variant='ghost'
              onClick={() => {
                setQ('');
                setParams(new URLSearchParams(), { replace: true });
                fetchData();
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          title='No contacts'
          description='Create your first contact to get started.'
          actionLabel='New Contact'
          onAction={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        />
      ) : (
        <ContactList
          contacts={filtered}
          onEdit={c => {
            setEditing(c);
            setModalOpen(true);
          }}
          onDelete={onDelete}
        />
      )}

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Contact' : 'New Contact'}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
      >
        <ContactForm
          initialValue={editing}
          onCancel={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSubmit={editing ? onUpdate : onCreate}
        />
      </Modal>
    </div>
  );
}
