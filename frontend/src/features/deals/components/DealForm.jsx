import { useMemo, useState } from 'react';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';

const STAGES = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' }
];

export default function DealForm({
  contacts,
  initialValue,
  onSubmit,
  onCancel,
  onDelete
}) {
  const initial = useMemo(
    () => ({
      title: initialValue?.title || '',
      amount: initialValue?.amount ?? '',
      contactId: initialValue?.contactId ?? '',
      stage: initialValue?.stage || 'new'
    }),
    [initialValue]
  );

  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const next = {};
    if (!values.title.trim()) next.title = 'Title is required';
    if (!String(values.contactId).trim())
      next.contactId = 'Contact is required';
    const amountNum = Number(values.amount);
    if (Number.isNaN(amountNum) || amountNum < 0)
      next.amount = 'Amount must be a non-negative number';
    if (!STAGES.some(s => s.value === values.stage))
      next.stage = 'Stage is invalid';
    return next;
  };

  const submit = async e => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    try {
      await onSubmit({
        title: values.title.trim(),
        amount: Number(values.amount),
        contactId: Number(values.contactId),
        stage: values.stage
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className='space-y-3' onSubmit={submit}>
      <Input
        label='Title'
        value={values.title}
        onChange={e => setValues(v => ({ ...v, title: e.target.value }))}
        error={errors.title}
      />
      <Input
        label='Amount'
        type='number'
        step='0.01'
        value={values.amount}
        onChange={e => setValues(v => ({ ...v, amount: e.target.value }))}
        error={errors.amount}
      />
      <Select
        label='Contact'
        value={values.contactId}
        onChange={e => setValues(v => ({ ...v, contactId: e.target.value }))}
        error={errors.contactId}
      >
        <option value=''>Select a contact…</option>
        {contacts.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>
      <Select
        label='Stage'
        value={values.stage}
        onChange={e => setValues(v => ({ ...v, stage: e.target.value }))}
        error={errors.stage}
      >
        {STAGES.map(s => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </Select>

      <div
        className={`flex items-center gap-2 pt-2 ${
          onDelete ? 'justify-between' : 'justify-end'
        }`}
      >
        {onDelete ? (
          <Button variant='danger' onClick={onDelete}>
            Delete Deal
          </Button>
        ) : null}

        <div className='flex items-center justify-end gap-2'>
          <Button variant='ghost' onClick={onCancel}>
            Cancel
          </Button>
          <Button type='submit' variant='primary' disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>
    </form>
  );
}
