import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useToast } from '../../components/common/ToastProvider.jsx';
import { listContacts } from '../contacts/api.js';
import { listDeals } from '../deals/api.js';
import { listMyTasks } from '../tasks/api.js';
import Badge from '../../components/ui/Badge.jsx';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function DashboardPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [openTasks, setOpenTasks] = useState([]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const [cRes, dRes, tRes] = await Promise.all([
          listContacts(),
          listDeals(),
          listMyTasks()
        ]);
        setContacts(cRes.contacts || []);
        setDeals(dRes.deals || []);
        setOpenTasks(tRes.tasks || []);
      } catch (e) {
        showToast({ type: 'error', message: e.message });
      } finally {
        setLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dealsByStage = useMemo(() => {
    const counts = { new: 0, in_progress: 0, won: 0, lost: 0 };
    for (const d of deals) counts[d.stage] = (counts[d.stage] || 0) + 1;
    return counts;
  }, [deals]);

  const recentContacts = useMemo(() => contacts.slice(0, 6), [contacts]);
  const recentDeals = useMemo(() => deals.slice(0, 6), [deals]);

  if (loading) return <Spinner />;

  return (
    <div className='space-y-4'>
      <PageHeader title='Dashboard' subtitle='Quick overview of your CRM' />

      <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
        <div className='secondary-card h-full'>
          <div className='card-body flex flex-col h-full'>
            <div className='text-sm text-slate-900'>Open Tasks</div>
            <div className='flex-1 flex items-center justify-start'>
              <div className='text-6xl font-extrabold text-slate-100'>
                {openTasks.length}
              </div>
            </div>
            <div className='pt-3 self-start'>
              <Link
                className='text-sm font-semibold underline text-slate-800'
                to='/tasks'
              >
                View tasks
              </Link>
            </div>
          </div>
        </div>

        <div className='secondary-card h-full'>
          <div className='card-body flex flex-col h-full'>
            <div className='text-sm text-slate-900'>Deals (Pipeline)</div>
            <div className='mt-3 grid grid-cols-2 gap-2 text-sm bg-slate-100/70 border border-black rounded-xl p-3'>
              <div className='flex items-center justify-between '>
                <Badge stage='new' />{' '}
                <span className='font-bold'>{dealsByStage.new}</span>
              </div>
              <div className='flex items-center justify-between'>
                <Badge stage='in_progress' />{' '}
                <span className='font-bold'>{dealsByStage.in_progress}</span>
              </div>
              <div className='flex items-center justify-between'>
                <Badge stage='won' />{' '}
                <span className='font-bold'>{dealsByStage.won}</span>
              </div>
              <div className='flex items-center justify-between'>
                <Badge stage='lost' />{' '}
                <span className='font-bold'>{dealsByStage.lost}</span>
              </div>
            </div>
            <div className='mt-auto pt-3 self-start'>
              <Link
                className='text-sm font-semibold underline text-slate-800'
                to='/deals'
              >
                View deals
              </Link>
            </div>
          </div>
        </div>

        <div className='secondary-card h-full'>
          <div className='card-body flex flex-col h-full'>
            <div className='text-sm text-slate-900'>Contacts</div>
            <div className='flex-1 flex items-center justify-start'>
              <div className='text-6xl font-extrabold text-slate-100'>
                {contacts.length}
              </div>
            </div>
            <div className='pt-3 self-start'>
              <Link
                className='text-sm font-semibold underline text-slate-800'
                to='/contacts'
              >
                View contacts
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
        <div className='card'>
          <div className='card-body'>
            <div className='flex items-center justify-between'>
              <div className='text-sm font-bold'>Recent Contacts</div>
              <Link className='text-sm font-semibold underline' to='/contacts'>
                All
              </Link>
            </div>
            <div className='mt-3 space-y-2'>
              {recentContacts.length === 0 ? (
                <div className='text-sm text-slate-600'>No contacts yet.</div>
              ) : (
                recentContacts.map(c => (
                  <Link
                    key={c.id}
                    className='block glass-item glass-interactive p-3'
                    to={`/contacts/${c.id}`}
                  >
                    <div className='text-sm font-bold'>{c.name}</div>
                    <div className='text-xs text-slate-600'>
                      {[c.email, c.company].filter(Boolean).join(' • ') || '—'}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        <div className='card'>
          <div className='card-body'>
            <div className='flex items-center justify-between'>
              <div className='text-sm font-bold'>Recent Deals</div>
              <Link className='text-sm font-semibold underline' to='/deals'>
                All
              </Link>
            </div>
            <div className='mt-3 space-y-2'>
              {recentDeals.length === 0 ? (
                <div className='text-sm text-slate-600'>No deals yet.</div>
              ) : (
                recentDeals.map(d => (
                  <div key={d.id} className='glass-item p-3'>
                    <div className='flex items-start justify-between gap-2'>
                      <div>
                        <div className='text-sm font-bold'>{d.title}</div>
                        <div className='mt-1 text-xs text-slate-600'>
                          {formatCurrency(d.amount)}
                        </div>
                      </div>
                      <Badge stage={d.stage} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
