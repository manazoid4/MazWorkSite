import { FLAGSHIP_PROJECTS, type Project } from './projects';
import './b2b.css';

/**
 * Reusable proof components for /proof. Add a real project to projects.ts, a real
 * quote to TESTIMONIALS, and the page picks them up. Nothing here invents a
 * result: the impact line shows only confirmed `results`, otherwise it says none
 * are published yet. Internal demonstrations are labelled so they cannot be
 * mistaken for client work.
 */
export type Testimonial = { quote: string; name: string; role: string; business: string };

/** Add a quote ONLY with the client's written permission, their name and role. Empty on purpose today. */
export const TESTIMONIALS: Testimonial[] = [];

type Kind = 'own' | 'client' | 'demo';
const KIND_LABEL: Record<Kind, string> = { own: 'My own product', client: 'Client build', demo: 'Internal demonstration, not a client' };

export type DemoItem = { name: string; bottleneck: string; built: string[]; href: string; note: string };

/** Demonstrations built by Maz Works with invented data. Shown separately from real projects. */
export const DEMOS: DemoItem[] = [
  { name: 'Complaints dashboard, board report and staff toolkit', bottleneck: 'Complaint records that nobody has turned into decisions for management or the board.', built: ['A tracker and dashboard', 'A board-ready slide deck and PDF', 'An action tracker, escalation tree and staff guides'], href: '/professional-teams#more-demos', note: 'Invented data for a fictional firm. No client uses these yet.' },
];

function Card({ kind, name, image, bottleneck, built, impact, href, hrefLabel, limit }: { kind: Kind; name: string; image?: Project['image']; bottleneck: string; built: readonly string[]; impact: string; href: string; hrefLabel: string; limit: string }) {
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
        <dl className="pf-facts">
          <dt>The problem</dt><dd>{bottleneck}</dd>
          <dt>What was built</dt><dd>{built.join(' ')}</dd>
          <dt>What you can check</dt><dd>{impact}</dd>
        </dl>
        <p>{limit}</p>
        <a href={href}>{hrefLabel} →</a>
      </div>
    </li>
  );
}

export function CaseStudyGrid() {
  return (
    <ul className="pf-grid">
      {FLAGSHIP_PROJECTS.map((project) => (
        <Card
          key={project.id}
          kind={project.relationship === 'Product' ? 'own' : 'client'}
          name={project.name}
          image={project.image}
          bottleneck={project.problem}
          built={project.built}
          impact={project.caseStudy?.results?.length ? project.caseStudy.results.join(' ') : `No results are published yet. ${project.proof}`}
          href={`/work/${project.id}`}
          hrefLabel={`Open ${project.name}`}
          limit={project.limitation}
        />
      ))}
      {DEMOS.map((demo) => (
        <Card key={demo.name} kind="demo" name={demo.name} bottleneck={demo.bottleneck} built={demo.built.map((item) => `${item}.`)} impact={demo.note} href={demo.href} hrefLabel="Try the demo" limit="Shown so you can see how I would approach it. It is not evidence of results." />
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
