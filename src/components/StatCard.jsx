function StatCard({ title, value, colorClass }) {
  return (
    <div className="col-12 col-md-6 col-lg-3">
      <div className="surface-card p-3 h-100">
        <p className="text-muted-soft mb-1">{title}</p>
        <h3 className={`mb-0 ${colorClass}`}>{value}</h3>
      </div>
    </div>
  );
}

export default StatCard;
