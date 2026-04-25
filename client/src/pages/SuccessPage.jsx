// client/src/pages/SuccessPage.jsx
export default function SuccessPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <article className="card auth-card">
          <div className="kicker" style={{ color: 'var(--text)', background: 'var(--bg-soft)', borderColor: 'var(--line)' }}>Order confirmed</div>
          <h2>Your CanWear order was placed.</h2>
          <p className="muted">The server is ready to send confirmation emails and order-status notifications after PayPal capture.</p>
          <div className="grid cards-3">
            <div className="card review-card"><strong>Paid</strong><p className="muted">Payment captured through PayPal.</p></div>
            <div className="card review-card"><strong>Queued</strong><p className="muted">Ready for print + can packing.</p></div>
            <div className="card review-card"><strong>Notify</strong><p className="muted">Email hooks can send updates later.</p></div>
          </div>
        </article>
      </div>
    </section>
  );
}
