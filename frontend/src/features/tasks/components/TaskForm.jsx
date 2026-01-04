import { useMemo, useState } from 'react';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';

export default function TaskForm({
  contacts,
  deals,
  initialValue,
  onSubmit,
  onCancel
}) {
  const initial = useMemo(
    () => ({
      title: initialValue?.title || '',
      dueDate: initialValue?.dueDate || '',
      status: initialValue?.status || 'open',
      contactId: initialValue?.contactId ?? '',
      dealId: initialValue?.dealId ?? ''
    }),
    [initialValue]
  );

  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const next = {};
    if (!values.title.trim()) next.title = 'Title is required';
    if (values.status !== 'open' && values.status !== 'done')
      next.status = 'Status is invalid';
    if (!String(values.contactId).trim() && !String(values.dealId).trim()) {
      next.link = 'Link to a contact or a deal';
    }
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
        dueDate: values.dueDate || undefined,
        status: values.status,
        contactId: values.contactId ? Number(values.contactId) : undefined,
        dealId: values.dealId ? Number(values.dealId) : undefined
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
        label='Due date'
        type='date'
        value={values.dueDate || ''}
        onChange={e => setValues(v => ({ ...v, dueDate: e.target.value }))}
      />
      <Select
        label='Status'
        value={values.status}
        onChange={e => setValues(v => ({ ...v, status: e.target.value }))}
        error={errors.status}
      >
        <option value='open'>Open</option>
        <option value='done'>Done</option>
      </Select>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        <Select
          label='Link to contact (optional)'
          value={values.contactId}
          onChange={e => setValues(v => ({ ...v, contactId: e.target.value }))}
        >
          <option value=''>None</option>
          {contacts.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Select
          label='Link to deal (optional)'
          value={values.dealId}
          onChange={e => setValues(v => ({ ...v, dealId: e.target.value }))}
        >
          <option value=''>None</option>
          {deals.map(d => (
            <option key={d.id} value={d.id}>
              {d.title}
            </option>
          ))}
        </Select>
      </div>
      {errors.link ? (
        <div className='text-xs text-rose-700'>{errors.link}</div>
      ) : null}

      <div className='flex items-center justify-end gap-2 pt-2'>
        <Button variant='ghost' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit' variant='primary' disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
