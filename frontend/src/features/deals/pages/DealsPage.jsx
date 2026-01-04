import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../../components/layout/PageHeader.jsx';
import Button from '../../../components/ui/Button.jsx';
import Modal from '../../../components/ui/Modal.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import Select from '../../../components/ui/Select.jsx';
import { useToast } from '../../../components/common/ToastProvider.jsx';
import { listContacts } from '../../contacts/api.js';
import { createDeal, deleteDeal, listDeals, updateDeal } from '../api.js';
import DealForm from '../components/DealForm.jsx';
import DealKanban from '../components/DealKanban.jsx';
import { formatCurrency } from '../../../utils/formatCurrency.js';

const STAGES = ['new', 'in_progress', 'won', 'lost'];

export default function DealsPage() {
  const { showToast } = useToast();
  const [params, setParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [view, setView] = useState('kanban');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  const shouldOpenNew = params.get('new') === '1';

  const contactsById = useMemo(() => {
    const m = new Map();
    for (const c of contacts) m.set(c.id, c.name);
    return m;
  }, [contacts]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [dRes, cRes] = await Promise.all([listDeals(), listContacts()]);
      setDeals(dRes.deals || []);
      setContacts(cRes.contacts || []);
    } catch (e) {
      showToast({ type: 'error', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (shouldOpenNew) {
      setSelectedDeal(null);
      setModalOpen(true);
      params.delete('new');
      setParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldOpenNew]);

  const onCreate = async payload => {
    const res = await createDeal(payload);
    showToast({ type: 'success', message: res.message || 'Deal created' });
    setModalOpen(false);
    await fetchAll();
  };

  const onUpdate = async payload => {
    const updatePayload = { ...payload };
    Object.keys(updatePayload).forEach(k => {
      if (updatePayload[k] === undefined) delete updatePayload[k];
    });
    const res = await updateDeal(selectedDeal.id, updatePayload);
    showToast({ type: 'success', message: res.message || 'Deal updated' });
    setModalOpen(false);
    setSelectedDeal(null);
    await fetchAll();
  };

  const onDelete = async () => {
    const ok = window.confirm(`Delete deal “${selectedDeal?.title}”?`);
    if (!ok) return;
    try {
      const res = await deleteDeal(selectedDeal.id);
      showToast({ type: 'success', message: res.message || 'Deal deleted' });
      setModalOpen(false);
      setSelectedDeal(null);
      await fetchAll();
    } catch (e) {
      showToast({ type: 'error', message: e.message });
    }
  };

  const onDropDeal = async (dealId, stage) => {
    if (!STAGES.includes(stage)) return;
    const deal = deals.find(d => d.id === dealId);
    if (!deal || deal.stage === stage) return;

    const previous = deals;
    setDeals(prev => prev.map(d => (d.id === dealId ? { ...d, stage } : d)));

    try {
      await updateDeal(dealId, { stage });
      showToast({ type: 'success', message: 'Stage updated' });
    } catch (e) {
      setDeals(previous);
      showToast({ type: 'error', message: e.message });
    }
  };

  const openEdit = deal => {
    setSelectedDeal(deal);
    setModalOpen(true);
  };

  return (
    <div className='space-y-4'>
      <PageHeader
        title='Deals'
        subtitle='Pipeline view with drag-and-drop'
        actions={
          <>
            <Button
              variant='secondary'
              onClick={() => setView(v => (v === 'kanban' ? 'list' : 'kanban'))}
            >
              {view === 'kanban' ? 'List view' : 'Kanban view'}
            </Button>
            <Button
              variant='primary'
              onClick={() => {
                setSelectedDeal(null);
                setModalOpen(true);
              }}
            >
              New Deal
            </Button>
          </>
        }
      />

      {loading ? (
        <Spinner />
      ) : deals.length === 0 ? (
        <EmptyState
          title='No deals'
          description='Create a deal and move it across stages.'
          actionLabel='New Deal'
          onAction={() => {
            setSelectedDeal(null);
            setModalOpen(true);
          }}
        />
      ) : view === 'kanban' ? (
        <DealKanban
          deals={deals}
          contactsById={contactsById}
          onDropDeal={onDropDeal}
          onSelectDeal={openEdit}
        />
      ) : (
        <div className='card'>
          <div className='card-body'>
            <div className='overflow-x-auto'>
              <table className='min-w-full text-sm'>
                <thead>
                  <tr className='text-left text-slate-500'>
                    <th className='py-2'>Title</th>
                    <th className='py-2'>Contact</th>
                    <th className='py-2'>Amount</th>
                    <th className='py-2'>Stage</th>
                    <th className='py-2'></th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map(d => (
                    <tr key={d.id} className='table-row'>
                      <td className='py-2 font-semibold'>{d.title}</td>
                      <td className='py-2 text-slate-700'>
                        {contactsById.get(d.contactId) ||
                          `Contact #${d.contactId}`}
                      </td>
                      <td className='py-2'>{formatCurrency(d.amount)}</td>
                      <td className='py-2'>
                        <Badge stage={d.stage} />
                      </td>
                      <td className='py-2 text-right'>
                        <Button variant='ghost' onClick={() => openEdit(d)}>
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        title={selectedDeal ? 'Deal details' : 'New Deal'}
        onClose={() => {
          setModalOpen(false);
          setSelectedDeal(null);
        }}
      >
        {selectedDeal ? (
          <div className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <div className='card'>
                <div className='card-body'>
                  <div className='text-xs text-slate-600'>Current stage</div>
                  <div className='mt-1'>
                    <Badge stage={selectedDeal.stage} />
                  </div>
                  <div className='mt-4'>
                    <Select
                      label='Change stage'
                      value={selectedDeal.stage}
                      onChange={async e => {
                        const stage = e.target.value;
                        setSelectedDeal(d => ({ ...d, stage }));
                        await onDropDeal(selectedDeal.id, stage);
                      }}
                    >
                      <option value='new'>New</option>
                      <option value='in_progress'>In Progress</option>
                      <option value='won'>Won</option>
                      <option value='lost'>Lost</option>
                    </Select>
                  </div>
                </div>
              </div>
              <div className='card'>
                <div className='card-body'>
                  <div className='text-xs text-slate-600'>Contact</div>
                  <div className='mt-1 text-sm font-semibold'>
                    {contactsById.get(selectedDeal.contactId) ||
                      `Contact #${selectedDeal.contactId}`}
                  </div>
                  <div className='mt-4 text-xs text-slate-600'>Amount</div>
                  <div className='mt-1 text-sm font-semibold'>
                    {formatCurrency(selectedDeal.amount)}
                  </div>
                </div>
              </div>
            </div>

            <DealForm
              contacts={contacts}
              initialValue={selectedDeal}
              onCancel={() => {
                setModalOpen(false);
                setSelectedDeal(null);
              }}
              onDelete={onDelete}
              onSubmit={onUpdate}
            />
          </div>
        ) : (
          <DealForm
            contacts={contacts}
            onCancel={() => setModalOpen(false)}
            onSubmit={onCreate}
          />
        )}
      </Modal>
    </div>
  );
}
