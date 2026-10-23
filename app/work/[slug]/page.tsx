import { fitDescription } from '../../seo';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectLinks } from '../../project-elements';
import { CASE_STUDY_PROJECTS, getCaseStudyProject } from '../../projects';
import { SiteFooter, SiteHeader } from '../../site-chrome';

export const dynamicParams = false;

export function generateStaticParams() {
  return CASE_STUDY_PROJECTS.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getCaseStudyProject(slug);
  if (!project) return {};
  return {
    title: `${project.name} case study`,
    description: fitDescription(`${project.caseStudy.lede} See what I built and where it stands.`),
    alternates: { canonical: `/work/${project.id}` },
    openGraph: {
      title: `${project.name} case study — Maz Works`,
      description: project.caseStudy.lede,
      url: `/work/${project.id}`,
      images: project.image ? [{ url: project.image.src, width: project.image.width, height: project.image.height, alt: project.image.alt }] : [{ url: '/social-card.png', width: 1200, height: 630, alt: `${project.name} — Maz Works` }],
    },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getCaseStudyProject(slug);
  if (!project) notFound();
  const otherStudy = CASE_STUDY_PROJECTS.find((candidate) => candidate.id !== project.id);

  return (
    <main>
      <SiteHeader />
      <article className="case-study" id="main-content" tabIndex={-1}>
        <header className="case-hero">
          <a className="case-back" href="/proof"><span aria-hidden="true">←</span>&nbsp; Proof</a>
          <p className="eyebrow">{project.relationship} / {project.status}</p>
          <h1>{project.name}</h1>
          <p className="case-lede">{project.caseStudy.lede}</p>
          <ProjectLinks project={project} />
          <div className="case-meta">
            <div><p className="eyebrow">What I handled</p><p>{project.caseStudy.role}</p></div>
            <div><p className="eyebrow">Included</p><ul>{project.caseStudy.scope.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </div>
        </header>

        <section className="case-section" aria-labelledby="built-title">
          <header><p className="eyebrow">01 / What I built</p><h2 id="built-title">The work delivered.</h2></header>
          <ol className="case-built">{project.built.map((item) => <li key={item}>{item}</li>)}</ol>
        </section>

        <section className="case-section" aria-labelledby="problem-title">
          <header><p className="eyebrow">02 / The problem</p><h2 id="problem-title">What it had to solve.</h2></header>
          <div className="case-pair">
            <div><h3>Problem</h3><p>{project.problem}</p></div>
            <div><h3>Approach</h3><p>{project.insight}</p></div>
          </div>
        </section>

        <section className="case-section" aria-labelledby="status-title">
          <header><p className="eyebrow">03 / Current status</p><h2 id="status-title">Where it stands.</h2></header>
          <div className="case-proof">
            <div><h3>Working now</h3><p>{project.proof}</p></div>
            <div className="limitation-panel"><h3>Still to prove</h3><p>{project.limitation}</p></div>
          </div>
          {project.caseStudy.results?.length ? <ul className="case-built">{project.caseStudy.results.map((item) => <li key={item}>{item}</li>)}</ul> : null}
          {project.caseStudy.quote ? <blockquote className="case-quote"><p>{project.caseStudy.quote.text}</p><footer>{project.caseStudy.quote.who}</footer></blockquote> : null}
        </section>

        <footer className="case-cta">
          <div>
            <h2>Have a similar problem?</h2>
            <p>Tell me the job. You get a plan and a fixed price before any paid work.</p>
          </div>
          <div className="case-cta-actions">
            <a className="button button-signal" href={`/contact?src=case-${project.id}#contact`}>Get my free preview</a>
            {otherStudy && <a className="text-link" href={`/work/${otherStudy.id}`}>Read {otherStudy.name} <span aria-hidden="true">→</span></a>}
          </div>
        </footer>
      </article>
      <SiteFooter />
    </main>
  );
}
