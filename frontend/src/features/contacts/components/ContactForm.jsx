import { useMemo, useState } from 'react';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';

export default function ContactForm({ initialValue, onSubmit, onCancel }) {
  const initial = useMemo(
    () => ({
      name: initialValue?.name || '',
      email: initialValue?.email || '',
      phone: initialValue?.phone || '',
      company: initialValue?.company || ''
    }),
    [initialValue]
  );

  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = 'Name is required';
    if (values.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) {
      next.email = 'Email is invalid';
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
      await onSubmit(values);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className='space-y-3' onSubmit={submit}>
      <Input
        label='Name'
        value={values.name}
        onChange={e => setValues(v => ({ ...v, name: e.target.value }))}
        error={errors.name}
      />
      <Input
        label='Email'
        type='email'
        value={values.email}
        onChange={e => setValues(v => ({ ...v, email: e.target.value }))}
        error={errors.email}
      />
      <Input
        label='Phone'
        value={values.phone}
        onChange={e => setValues(v => ({ ...v, phone: e.target.value }))}
      />
      <Input
        label='Company'
        value={values.company}
        onChange={e => setValues(v => ({ ...v, company: e.target.value }))}
      />

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
