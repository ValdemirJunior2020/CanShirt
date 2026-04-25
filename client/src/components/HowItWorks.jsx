// client/src/components/HowItWorks.jsx
export default function HowItWorks() {
  const steps = [
    "Pick a cute tee design or custom drop.",
    "We print it on a soft premium shirt.",
    "We fold it into a branded collectible can.",
    "You unbox it, wear it, and share it."
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2>How it works</h2>
            <p>Keep the storefront clean. Keep the experience memorable.</p>
          </div>
        </div>
        <div className="grid cards-3">
          {steps.map((step, index) => (
            <article key={step} className="card review-card">
              <div className="kicker" style={{ color: 'var(--text)', background: 'var(--bg-soft)', borderColor: 'var(--line)' }}>Step {index + 1}</div>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
