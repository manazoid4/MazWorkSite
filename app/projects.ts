export type ProjectLink = { label: string; href: string };
export type ProjectImage = {
  src: string;
  mobileSrc?: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};
export type Project = {
  id: string;
  name: string;
  relationship: 'Product' | 'Client work' | 'Lab';
  eyebrow: string;
  status: string;
  summary: string;
  problem: string;
  insight: string;
  built: string[];
  proof: string;
  limitation: string;
  image?: ProjectImage;
  links: ProjectLink[];
};

export const FLAGSHIP_PROJECTS: Project[] = [
  {
    id: 'jobfilter', name: 'JobFilter', eyebrow: 'Flagship 01 / Full build and setup', status: 'Live product / Built end to end',
    relationship: 'Product',
    summary: 'My own product. It finds public contracts that fit a small building firm’s trade, area and deadline.',
    problem: 'Small building firms lose hours checking tender sites. Deciding what fits and tracking deadlines takes even longer.',
    insight: 'A list of tenders is not enough. Firms need weak matches removed and a clear next step.',
    built: [
      'Pulls official public tenders and removes duplicates.',
      'Checks each job against the firm’s trade, area and deadline.',
      'Free scans, email alerts, calendar export and reply templates.',
      'Own domain, hosting, a £39/month plan and checkout.',
    ],
    proof: 'The live product and its code are public. You can run a free scan now.',
    limitation: 'It helps firms find and chase work. It does not guarantee a contract.',
    image: { src: '/jobfilter-scan-result.webp', alt: 'JobFilter’s live scanner: enter a postcode, pick a trade and radius, then scan for public contracts', caption: 'Live site / jobfilter.uk', width: 1280, height: 800 },
    links: [
      { label: 'Try a free scan', href: 'https://jobfilter.uk/find-jobs' },
      { label: 'View code', href: 'https://github.com/manazoid4/JobFilterV1' },
    ],
  },
  {
    id: 'scrap-finance-partners', name: 'Scrap Finance Partners', eyebrow: 'Flagship 02 / Client website', status: 'Client website / Live',
    relationship: 'Client work',
    // Truth rule (context pack, 25 Sep): a delivered client build, but the client did not pay.
    // Say "client build". Never "paid client", "paying client" or anything implying money changed hands.
    summary: 'A website for a finance firm serving UK scrap and recycling businesses, with one short enquiry form.',
    problem: 'The client needed a clear, credible way to explain a specialist service and to capture enquiries without extra admin.',
    insight: 'Keep it simple: clear positioning, plain pricing and one obvious way to enquire.',
    built: [
      'Clear positioning, service pages and pricing.',
      'Lead capture: one short enquiry form, so every enquiry arrives in one place.',
      'A mobile-friendly design, launched live.',
    ],
    proof: 'The live site is public.',
    limitation: 'This shows what was built. It makes no claims about revenue or leads.',
    image: { src: '/scrap-finance-partners.webp', alt: 'Scrap Finance Partners homepage: “Your best-selling grade might be your worst deal”, with a Request a Health Check button', caption: 'Live client site', width: 1280, height: 800 },
    links: [
      { label: 'View the live site', href: 'https://scrap-finance-partners.vercel.app' },
    ],
  },
];
