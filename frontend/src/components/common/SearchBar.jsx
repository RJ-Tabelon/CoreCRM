import Input from '../ui/Input.jsx';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search…'
}) {
  return (
    <Input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label='Search'
    />
  );
}
