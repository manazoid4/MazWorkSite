import './manazir-line.css';
/** The one short bio. Default: the face-and-credential line under a main button (trade pages). `block`: the home About section. */
export function ManazirLine({ block = false }: { block?: boolean }) {
  if (!block) {
    return (
      <p className="s-face-cta"><img src="/maz.webp" alt="" width={56} height={56} /><span><strong>Manazir Hussain</strong>. Computer Science graduate, five years in finance complaints. I build every job myself.</span></p>
    );
  }
  return (
    <section className="mw-about-block" aria-labelledby="about-title">
      <img src="/maz.webp" alt="Manazir Hussain, who scopes and builds the work" width={112} height={112} loading="lazy" />
      <div>
        <h2 id="about-title">Hi, I’m Maz.</h2>
        <p>I started my own business because I love fixing problems and helping businesses succeed. I’m there for the whole journey, not just the website.</p>
        <p>I worked in finance handling complaints and escalations, with thousands of unhappy customers. I know what it’s like when something goes wrong.</p>
        <p>I’m just starting out, and I’ll always be honest about what I can and can’t do.</p>
        <a href="/about">More about me <span aria-hidden="true">→</span></a>
      </div>
    </section>
  );
}
