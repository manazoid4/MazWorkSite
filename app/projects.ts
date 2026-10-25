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

export const FEATURED_PROJECTS: Project[] = [
  {
    id: 'agent-nudge', name: 'Agent Nudge', eyebrow: 'Featured / Agent coordination', status: 'Released Windows MVP',
    relationship: 'Product',
    summary: 'A local preflight layer that helps AI coding agents avoid stale context and file collisions.',
    problem: 'Parallel coding agents can act on information that has already changed or edit work another agent has claimed.',
    insight: 'Coordination needs a deterministic check before action, not another model guessing about hidden state.',
    built: ['Windows desktop app, background service, and provider hooks.', 'Project-scoped activity records and three explicit preflight outcomes.', 'Installer, portable release, checksums, and a public scenario demo.'],
    proof: 'A downloadable Windows release, checksums, public code, and a browser-based fixture demo.',
    limitation: 'Provider hooks can be bypassed when an agent skips preflight; the app does not call a model itself.',
    image: { src: '/agent-nudge-demo.webp', alt: 'Agent Nudge demo showing two coding agents and a conflict review outcome', caption: 'Public fixture demo / desktop runtime remains local', width: 1440, height: 900 },
    links: [{ label: 'Try the demo', href: 'https://agent-nudge-bay.vercel.app/#demo' }, { label: 'Windows release', href: 'https://github.com/manazoid4/agent-nudge/releases' }, { label: 'View code', href: 'https://github.com/manazoid4/agent-nudge' }],
  },
  {
    id: 'openflowkit', name: 'OpenFlowKit', eyebrow: 'Featured / Open source', status: 'Browser MVP',
    relationship: 'Lab',
    summary: 'A voice-to-text workbench with deterministic cleanup and a terminal bridge.',
    problem: 'Typing is slow for drafting, prompting, and other writing-heavy work.', insight: 'Browser speech capture plus explicit cleanup rules could prove the workflow without a vague AI layer.',
    built: ['Browser speech capture and typed transcription contracts.', 'Deterministic refinement rules and latency tracking.', 'WebSocket terminal bridge with test coverage.'],
    proof: 'A public web MVP and open repository with the refinement and bridge implementation.',
    limitation: 'Native desktop text injection and hosted AI-provider routing are future work, not shipped capabilities.',
    links: [{ label: 'Try the MVP', href: 'https://openflowkit-dusky.vercel.app' }, { label: 'View code', href: 'https://github.com/manazoid4/openflowkit' }],
  },
  {
    id: 'khutba-io', name: 'Khutba.io', eyebrow: 'Featured / Live prototype', status: 'Live prototype with public demo',
    relationship: 'Product',
    summary: 'A screen-first live captioning platform for mosques with a mixed-language congregation.',
    problem: 'A mosque serving several first languages has no calm way to put live translation on the screen it already owns, and general-purpose captioning tools assume a meeting room rather than a worship hall.',
    insight: 'The product is the Friday workflow, not the transcription: pair the existing screen, confirm it is ready before anyone is waiting, start explicitly, and keep the typography readable from the back of the hall.',
    built: [
      'A pairing and readiness check for the screen a mosque already has, so failures surface before the khutbah rather than during it.',
      'An explicit start step instead of an always-listening session.',
      'A presentation layer sized and paced for worship-hall viewing distance.',
      'An account-free public demo that shows the flow without a signup.',
    ],
    proof: 'A deployed site and an account-free demo anyone can open, plus the public repository and a written product and commercial decision record.',
    limitation: 'This is an early product prototype and demo deployment, not a hardened multi-mosque service; live transcription quality and long-session behaviour still need proving in a real hall.',
    links: [{ label: 'Try the demo', href: 'https://khutba-io.vercel.app/demo' }, { label: 'View code', href: 'https://github.com/manazoid4/khutba-io' }],
  },
  {
    id: 'maz-pocket', name: 'MAZ Pocket', eyebrow: 'Featured / Hardware', status: 'v0.8.0 release candidate, field validation pending',
    relationship: 'Lab',
    summary: 'A card-sized handheld and a paired PC service that together turn a held key into a spoken answer, a recorded workflow, or an approved action on the machine.',
    problem: 'Capturing a thought, checking a long-running job, or approving something on the PC away from the desk usually costs a lock screen, an app, and often the thought itself.',
    insight: 'The handheld only earns its place by doing what a phone cannot: a physical push-to-talk key on a device with nothing else running, with the heavy work pushed to a paired service on the PC rather than onto the microcontroller.',
    built: [
      'A six-tile interface covering the voice loop, capture, agent status, device control, memory and focus, with no seventh top-level app.',
      'A hold-to-talk voice loop with spoken replies, replay, and a cloud/local/auto routing choice made on the device itself.',
      'Teach-by-demonstration capture: record a chosen PC display with narration and marked moments, then extract frames and transcribe on the paired service.',
      'A phone approval broker that issues short-lived, scoped grants before any shell command or agent subprocess runs, so the model can request control but cannot approve itself.',
      'Packaged installers, checksummed release artefacts, and CI covering host tests, packaging and firmware compilation.',
    ],
    proof: 'A tagged v0.8.0 release with installers, checksums and release notes, a host test suite, and CI that compiles the firmware on every change.',
    limitation: 'CI proves the host tests, packaging and firmware compilation; it cannot prove physical device behaviour. Full field validation on the hardware is still outstanding, so this is a release candidate rather than a finished product.',
    links: [{ label: 'Ask about this build', href: '/contact#contact' }],
  },
];
