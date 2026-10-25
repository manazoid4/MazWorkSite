import { FLAGSHIP_PROJECTS, type Project } from './projects';
import './b2b.css';

/**
 * Reusable proof components for /proof. Add a real project to projects.ts, a real
 * quote to TESTIMONIALS, and the page picks them up. Nothing here invents a
 * result: cards say what it is and link to it, nothing more. Every card carries one of three labels, so a prototype or a
 * concept demo can never be mistaken for client work:
 * REAL CLIENT WORK, INTERNAL PROJECT, INTERACTIVE CONCEPT DEMO.
 */
export type Testimonial = { quote: string; name: string; role: string; business: string };

/** Add a quote ONLY with the client's written permission, their name and role. Empty on purpose today. */
export const TESTIMONIALS: Testimonial[] = [];

type Kind = 'own' | 'client' | 'demo';
export const KIND_LABEL: Record<Kind, string> = { own: 'Internal project', client: 'Real client work', demo: 'Interactive concept demo' };

export type DemoItem = { name: string; href: string; note: string };

/** Demonstrations built by Maz Works with invented data. Shown separately from real projects. */
export const DEMOS: DemoItem[] = [
  { name: 'Complaints dashboard, board report and staff toolkit', href: '/professional-teams#more-demos', note: 'Turns complaint records into decisions for managers and the board. Invented data for a fictional firm; no client uses these.' },
];

function Card({ kind, name, image, line, href, hrefLabel }: { kind: Kind; name: string; image?: Project['image']; line: string; href: string; hrefLabel: string }) {
  return (
    <li className="pf-card">
      {image && (
        <picture>
          {image.mobileSrc && <source media="(max-width: 600px)" srcSet={image.mobileSrc} />}
          <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
        </picture>
      )}
      <div className="pf-body">
        <span className={`pf-kind is-${kind}`}>{KIND_LABEL[kind]}</span>
        <h3>{name}</h3>
        <p>{line}</p>
        <a href={href}>{hrefLabel} <span aria-hidden="true">↗</span></a>
      </div>
    </li>
  );
}

/** `show` picks one group: client work, my own internal projects, or the concept demos. */
export function CaseStudyGrid({ show }: { show: Kind }) {
  const projects = FLAGSHIP_PROJECTS.filter((project) => (project.relationship === 'Product' ? 'own' : 'client') === show);
  const demos = show === 'demo' ? DEMOS : [];
  return (
    <ul className="pf-grid">
      {projects.map((project) => (
        <Card
          key={project.id}
          kind={show}
          name={project.name}
          image={project.image}
          line={project.summary}
          href={project.links[0].href}
          hrefLabel={`See ${project.name} live`}
        />
      ))}
      {demos.map((demo) => (
        <Card key={demo.name} kind="demo" name={demo.name} line={demo.note} href={demo.href} hrefLabel="See the sample" />
      ))}
    </ul>
  );
}

export function TestimonialList() {
  if (TESTIMONIALS.length === 0) return <p className="pf-empty">No client quotes yet. They appear here only with the client’s written permission, their name and their role.</p>;
  return (
    <div className="pf-grid">
      {TESTIMONIALS.map((item) => (
        <blockquote key={`${item.name}-${item.business}`} className="pf-quote">
          <p>“{item.quote}”</p>
          <footer>{item.name}, {item.role}, {item.business}</footer>
        </blockquote>
      ))}
    </div>
  );
}

/** What a client receives before paying. The format is real; the figures in it are placeholders. */
export function ScopeSheetPreview() {
  return (
    <details className="b2b-box">
      <summary><strong>View a scope sheet (the format you receive)</strong></summary>
      <dl className="pf-facts" style={{ marginTop: 12 }}>
        <dt>The job</dt><dd>One sentence on what will be set up and which of your tools it uses.</dd>
        <dt>What happens</dt><dd>The steps from trigger to result, in plain words, so you can check it matches how you work.</dd>
        <dt>What you will see working</dt><dd>The test you can run yourself before paying.</dd>
        <dt>Not included</dt><dd>What is deliberately left out, so there are no surprises.</dd>
        <dt>Running costs that aren’t mine</dt><dd>The apps you pay directly and roughly what they cost.</dd>
        <dt>Price and date</dt><dd>One fixed price and a delivery date. You sign it off before any work starts.</dd>
      </dl>
      <p className="b2b-fine">A blank template. <a href="/contact#scope">See the scope sheet page</a>.</p>
    </details>
  );
}
