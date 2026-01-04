import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../../components/layout/PageHeader.jsx';
import Button from '../../../components/ui/Button.jsx';
import Modal from '../../../components/ui/Modal.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import Input from '../../../components/ui/Input.jsx';
import { useToast } from '../../../components/common/ToastProvider.jsx';
import { listContacts } from '../../contacts/api.js';
import { listDeals } from '../../deals/api.js';
import {
  createTask,
  deleteTask,
  listMyTasks,
  listTasks,
  updateTask
} from '../api.js';
import TaskForm from '../components/TaskForm.jsx';
import TaskList from '../components/TaskList.jsx';

export default function MyTasksPage() {
  const { showToast } = useToast();
  const [params, setParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);

  const [mode, setMode] = useState('mine'); // mine=open only, all=all tasks
  const [dueBefore, setDueBefore] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const shouldOpenNew = params.get('new') === '1';

  const contactsById = useMemo(() => {
    const m = new Map();
    for (const c of contacts) m.set(c.id, c.name);
    return m;
  }, [contacts]);

  const dealsById = useMemo(() => {
    const m = new Map();
    for (const d of deals) m.set(d.id, d.title);
    return m;
  }, [deals]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [cRes, dRes] = await Promise.all([listContacts(), listDeals()]);
      setContacts(cRes.contacts || []);
      setDeals(dRes.deals || []);

      const tRes =
        mode === 'mine'
          ? await listMyTasks({ dueBefore: dueBefore || undefined })
          : await listTasks();
      setTasks(tRes.tasks || []);
    } catch (e) {
      showToast({ type: 'error', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    if (shouldOpenNew) {
      setEditing(null);
      setModalOpen(true);
      params.delete('new');
      setParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldOpenNew]);

  const onCreate = async payload => {
    const res = await createTask(payload);
    showToast({ type: 'success', message: res.message || 'Task created' });
    setModalOpen(false);
    await fetchAll();
  };

  const onUpdate = async payload => {
    const updatePayload = { ...payload };
    Object.keys(updatePayload).forEach(k => {
      if (updatePayload[k] === undefined) delete updatePayload[k];
    });
    const res = await updateTask(editing.id, updatePayload);
    showToast({ type: 'success', message: res.message || 'Task updated' });
    setModalOpen(false);
    setEditing(null);
    await fetchAll();
  };

  const onToggleStatus = async task => {
    const nextStatus = task.status === 'open' ? 'done' : 'open';
    try {
      await updateTask(task.id, { status: nextStatus });
      showToast({ type: 'success', message: 'Status updated' });
      await fetchAll();
    } catch (e) {
      showToast({ type: 'error', message: e.message });
    }
  };

  const onDelete = async task => {
    const ok = window.confirm(`Delete task “${task.title}”?`);
    if (!ok) return;
    try {
      const res = await deleteTask(task.id);
      showToast({ type: 'success', message: res.message || 'Task deleted' });
      await fetchAll();
    } catch (e) {
      showToast({ type: 'error', message: e.message });
    }
  };

  const displayTasks = useMemo(() => {
    if (mode === 'all') return tasks;
    return tasks;
  }, [tasks, mode]);

  return (
    <div className='space-y-4'>
      <PageHeader
        title='Tasks'
        subtitle='Follow-ups linked to contacts or deals'
        actions={
          <>
            <Button
              variant='secondary'
              onClick={() => setMode(m => (m === 'mine' ? 'all' : 'mine'))}
            >
              {mode === 'mine' ? 'Show all tasks' : 'Show my open tasks'}
            </Button>
            <Button
              variant='primary'
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
            >
              New Task
            </Button>
          </>
        }
      />

      {mode === 'mine' ? (
        <div className='secondary-card'>
          <div className='card-body'>
            <div className='grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end text-slate-700'>
              <Input
                label='Due Before'
                type='date'
                value={dueBefore}
                onChange={e => setDueBefore(e.target.value)}
              />
              <Button variant='primary' onClick={fetchAll}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {loading ? (
        <Spinner />
      ) : displayTasks.length === 0 ? (
        <EmptyState
          title={mode === 'mine' ? 'No open tasks' : 'No tasks'}
          description='Create a task and link it to a contact or deal.'
          actionLabel='New Task'
          onAction={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        />
      ) : (
        <TaskList
          tasks={displayTasks}
          contactsById={contactsById}
          dealsById={dealsById}
          onToggleStatus={onToggleStatus}
          onEdit={t => {
            setEditing(t);
            setModalOpen(true);
          }}
          onDelete={onDelete}
        />
      )}

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Task' : 'New Task'}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
      >
        <TaskForm
          contacts={contacts}
          deals={deals}
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
