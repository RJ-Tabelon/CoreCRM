export default function Badge({ stage }) {
  if (!stage) return null;

  const cls =
    stage === 'new'
      ? 'badge-stage-new'
      : stage === 'in_progress'
      ? 'badge-stage-in-progress'
      : stage === 'won'
      ? 'badge-stage-won'
      : 'badge-stage-lost';

  const text =
    stage === 'new'
      ? 'New'
      : stage === 'in_progress'
      ? 'In Progress'
      : stage === 'won'
      ? 'Won'
      : 'Lost';

  return <span className={cls}>{text}</span>;
}
