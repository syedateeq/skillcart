export default function EmptyState({ title, message, action }) {
  return <div className="empty"><div className="empty-icon">📖</div><h2>{title}</h2><p>{message}</p>{action}</div>
}
