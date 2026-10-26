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

/** The live projects: client work first, then my own product. */
export function CaseStudyGrid() {
  const projects = [...FLAGSHIP_PROJECTS].sort((a, b) => Number(a.relationship === 'Product') - Number(b.relationship === 'Product'));
  return (
    <ul className="pf-grid">
      {projects.map((project) => (
        <Card
          key={project.id}
          kind={project.relationship === 'Product' ? 'own' : 'client'}
          name={project.name}
          image={project.image}
          line={project.summary}
          href={project.links[0].href}
          hrefLabel={`See ${project.name} live`}
        />
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
