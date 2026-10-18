import { AUTOMATION_MENU, getMenuJob, type MenuJob } from '../offers';

/**
 * Search-intent pages for the most-searched jobs on the automation menu.
 * Job names, one-line descriptions and which customer types they suit come
 * from AUTOMATION_MENU in app/offers.ts. Prices are never typed here: the page
 * reads Starter Automation from OFFERS. No invented stats, results or clients.
 */
export type ServiceJob = {
  /** Must match an id in AUTOMATION_MENU. */
  id: string;
  /** H1, in the buyer's words. */
  h1: string;
  /** Page <title> (absolute, under 60 characters). */
  title: string;
  /** Short lede under the H1. */
  lede: string;
  /** What it does, 2 short paragraphs. */
  does: string[];
  /** How it works, exactly 3 steps. */
  steps: { name: string; body: string }[];
  /** Plain-words description of who it suits. */
  suits: string;
  /** Specific to this job, on top of the shared list. */
  notIncluded: string[];
  faqs: { q: string; a: string }[];
};

export const SERVICE_JOBS: ServiceJob[] = [
  {
    id: 'missed-call',
    h1: 'Missed-call text-back for UK small businesses',
    title: 'Missed-call text-back for UK small businesses | Maz Works',
    lede: 'You can’t answer every call when you’re on a job or with a customer. This sends the caller a text straight away, so they book with you instead of ringing the next business on the list.',
    does: [
      'When a call goes unanswered, the caller gets a short text from your business number with your booking or quote link, and you get a note of who rang.',
      'The wording is yours: friendly, in your voice, and written with you before it goes live.',
    ],
    steps: [
      { name: 'You tell me how you take calls', body: 'Which number customers ring, which phone or phone system you use, and where you want people sent: a booking page, a quote form or a WhatsApp chat.' },
      { name: 'I set it up and test it', body: 'I write the text with you, connect it to your phone setup, and ring it myself to check it fires and the link works.' },
      { name: 'It runs by itself', body: 'Every missed call gets the text. You get a note of who rang, so you can call back when you’re free.' },
    ],
    suits: 'Anyone who can’t always pick up: tradespeople on site, salons and clinics with someone in the chair, garages, and small teams where the phone rings while everyone is busy.',
    notIncluded: ['Changing your phone provider or phone system. If yours can’t send a text on a missed call, the free preview stage tells you before you pay anything.'],
    faqs: [
      { q: 'Will it work with my phone number?', a: 'Usually, yes. It depends on your phone provider and how you take calls. Tell me what you use in the free preview form and I’ll say plainly whether it works, and what it would need, before you pay anything.' },
      { q: 'Who pays for the texts?', a: 'The texts are sent through a texting service you pay directly, at its own price. I tell you the cost up front in your scope sheet, before you pay me anything. You own the account.' },
      { q: 'What does the caller see?', a: 'A short text from your business with your link, worded the way you’d say it. You approve the wording before it goes live.' },
      { q: 'What if someone isn’t a customer, like a sales caller?', a: 'We can set it to skip numbers you choose. Anything beyond the agreed set-up is priced first, never added without telling you.' },
    ],
  },
  {
    id: 'reminders',
    h1: 'Appointment reminders to cut no-shows, for UK small businesses',
    title: 'Appointment reminders for UK small businesses | Maz Works',
    lede: 'An empty slot costs you the time and the money. A reminder the day before lets customers confirm or move their booking, so you aren’t left waiting for someone who forgot.',
    does: [
      'The day before each appointment, your customer gets a text or email with the time and a simple way to confirm or rearrange.',
      'It works from the booking app or calendar you already use, so there’s nothing new for your customers to learn.',
    ],
    steps: [
      { name: 'You show me where bookings live', body: 'Your booking app, diary or calendar. I add myself as a user and never need your passwords.' },
      { name: 'I set up the reminder', body: 'I write the message with you, choose the timing, and decide what happens if someone wants to move or cancel.' },
      { name: 'It goes out for every booking', body: 'Reminders send by themselves. You see the confirmations and changes without chasing anyone.' },
    ],
    suits: 'Salons and beauty, groomers, clinics and therapists, garages with booked-in jobs, and trades who book site visits.',
    notIncluded: ['A new booking system. If you don’t have one yet, Online booking is a separate task from the menu.'],
    faqs: [
      { q: 'Does it work with my booking app?', a: 'Usually, because I build on the apps you already have. If yours can’t send what’s needed, the free preview stage says so before you pay.' },
      { q: 'Will customers be able to rearrange?', a: 'Yes. The message gives them a way to confirm or ask to move, and you see the reply. How automatic the move is depends on your booking app.' },
      { q: 'Does it guarantee no-shows go away?', a: 'No. A reminder makes it easy to confirm or move, which helps, but I can’t promise a particular number and I won’t quote one.' },
      { q: 'Who pays for the texts?', a: 'Text-message costs, if you use texts, are paid directly to the provider at its own price, and I quote them in your scope sheet before you pay me.' },
    ],
  },
  {
    id: 'reviews',
    h1: 'Automatic Google review requests for UK small businesses',
    title: 'Google review requests for UK small businesses | Maz Works',
    lede: 'Happy customers rarely think to leave a review unless they’re asked. This asks every one of them, at the right moment, with a link that goes straight to your Google review page.',
    does: [
      'After each job or appointment, the customer gets a friendly message with a one-tap link to review you on Google, and you’re told when a review arrives.',
      'You choose the wording and the timing, so it reads like you, not like a robot.',
    ],
    steps: [
      { name: 'You tell me when a job counts as done', body: 'A booking marked complete, an invoice paid, or a time after the visit. I use whatever you already have.' },
      { name: 'I set up the message and your review link', body: 'I find your Google review link, write the message with you, and test it on my own phone.' },
      { name: 'Every customer gets asked', body: 'The request goes out by itself, and you get a note when a review comes in so you can reply.' },
    ],
    suits: 'Trades, salons, clinics, garages and professional firms where local trust decides who gets the call.',
    notIncluded: ['Writing reviews or buying them. Only real customers are asked, and what they write is up to them.'],
    faqs: [
      { q: 'Is this allowed by Google?', a: 'Asking real customers for an honest review is fine. I don’t set anything up that offers rewards for reviews or filters out unhappy customers, because that breaks Google’s rules.' },
      { q: 'What if a customer leaves a bad review?', a: 'You’re told when any review arrives, so you can reply properly. The request goes to everyone, not only the happy ones.' },
      { q: 'Does it work with my invoicing or booking app?', a: 'Usually, yes. I build on the tools you already use. If yours can’t trigger a message, the free preview stage says so up front.' },
      { q: 'How many reviews will I get?', a: 'I can’t promise a number. It makes asking effortless and consistent; how many people respond is up to them.' },
    ],
  },
  {
    id: 'quote-follow-up',
    h1: 'Automatic quote follow-up for UK small businesses',
    title: 'Quote follow-up for UK small businesses | Maz Works',
    lede: 'Most quotes go quiet because the customer got busy, not because they said no. A friendly reminder after a few days brings them back without you having to remember to chase.',
    does: [
      'When a quote goes out and nobody replies, a polite reminder is sent after 3 days and again after 7, from your own address, in your own words.',
      'The reminders stop the moment the customer replies or accepts, so nobody gets nudged twice.',
    ],
    steps: [
      { name: 'You show me how quotes are sent', body: 'Email, a quoting app or a template. I work with what you use now.' },
      { name: 'I write the two reminders with you', body: 'Short, friendly and clear about the next step. You approve them before anything is sent.' },
      { name: 'Quiet quotes get nudged', body: 'Reminders go out on their own and stop when the customer answers. You see which quotes are still waiting.' },
    ],
    suits: 'Trades and installers, architects and designers, agencies and professional services: anyone who sends quotes and waits.',
    notIncluded: ['Writing your quotes. A quote template is a free small set-up with a package; the follow-up is the automated part.'],
    faqs: [
      { q: 'Will it feel pushy?', a: 'Not if we word it well. Two short, polite reminders is the default, and you can change the timing or the tone.' },
      { q: 'Does it work with my quoting app?', a: 'Usually, as I build on what you already use. If your app can’t do it, the free preview stage tells you before you pay.' },
      { q: 'What happens when they reply?', a: 'The reminders stop straight away and you carry on the conversation yourself.' },
      { q: 'Can it follow up by text or WhatsApp too?', a: 'Email is the usual route. Text costs are paid direct to the provider, and anything extra is quoted in the scope sheet first.' },
    ],
  },
  {
    id: 'payment-reminders',
    h1: 'Automatic invoice and payment reminders for UK small businesses',
    title: 'Invoice reminders for UK small businesses | Maz Works',
    lede: 'Chasing money is awkward and easy to put off. This nudges customers before and after the due date, with a pay link, so you get paid without sending the awkward message yourself.',
    does: [
      'A polite reminder goes out shortly before an invoice is due and again if it’s overdue, with the pay link in the message.',
      'It stops as soon as the invoice is paid, so you never chase someone who already has.',
    ],
    steps: [
      { name: 'You show me your invoicing', body: 'Your accounts or invoicing app. I connect to what you use and never need your passwords.' },
      { name: 'I set the timing and wording with you', body: 'Before the due date, on the day, and after. The tone is yours, from gentle to firm.' },
      { name: 'Reminders run and stop on payment', body: 'They send themselves and stop when the invoice is marked paid.' },
    ],
    suits: 'Trades, agencies, consultants and professional firms who invoice after the work and wait for payment.',
    notIncluded: ['Taking payment or debt recovery. This reminds people to pay; it does not collect money or take legal steps.'],
    faqs: [
      { q: 'Which invoicing apps does it work with?', a: 'Most mainstream ones can send reminders in some form. Tell me yours in the free preview form and I’ll say plainly what’s possible before you pay anything.' },
      { q: 'Will it upset my customers?', a: 'It’s a polite reminder in your own words. You choose how gentle or firm it is, and you approve it first.' },
      { q: 'Does it guarantee I’ll be paid?', a: 'No. It makes sure no one is forgotten, but I can’t promise anyone will pay, or by when.' },
      { q: 'Are there extra monthly costs?', a: 'Not from me. If your invoicing app charges for reminders, that’s paid direct to them and I’d tell you first.' },
    ],
  },
  {
    id: 'online-booking',
    h1: 'Online booking for UK small businesses',
    title: 'Online booking for UK small businesses | Maz Works',
    lede: 'Let customers book themselves, day or night, from your website, Google or Instagram. You stop playing phone tag and wake up to a diary that has filled itself.',
    does: [
      'Customers pick a service and a time from one booking page, and the booking lands in your diary. Up to 10 services are covered.',
      'You can put the booking link on your website, your Google listing and your social profiles so it’s one tap from wherever they find you.',
    ],
    steps: [
      { name: 'You list your services and hours', body: 'What you offer, how long each takes, and when you’re free. I also ask about breaks and days off.' },
      { name: 'I set up the booking page', body: 'I connect it to your calendar, test a few bookings, and add the link to the places you choose.' },
      { name: 'Customers book, you turn up', body: 'Bookings arrive in your diary and customers get a confirmation. Reminders are a separate task from the menu.' },
    ],
    suits: 'Salons and beauty, clinics and therapists, groomers, coaches and creators selling sessions or classes, and anyone who books by appointment.',
    notIncluded: ['Taking card payments or deposits beyond what the booking tool already offers. Ask in the free preview request and I’ll say what’s possible.'],
    faqs: [
      { q: 'Do I have to swap my current booking system?', a: 'Not necessarily. If you already have one, I’ll often connect it instead. If you need one, I tell you the cost before you pay anything.' },
      { q: 'Will it connect to my calendar?', a: 'Usually, yes. Google and Outlook calendars are common. If yours isn’t supported, the free preview stage says so up front.' },
      { q: 'Can customers book from Instagram?', a: 'Yes, your booking link goes in your bio and replies. Auto-replies in DMs are a separate menu task.' },
      { q: 'Who pays for the booking tool?', a: 'If the tool has a paid plan, you pay that company directly and I tell you the price first. You own the account.' },
    ],
  },
  {
    id: 'one-list',
    h1: 'All your enquiries in one list, with an instant reply, for UK small businesses',
    title: 'All enquiries in one list, UK small business | Maz Works',
    lede: 'Enquiries scattered across phone messages, email, forms and DMs get lost. This gathers them in one list and sends an instant reply, so nothing slips and nobody waits.',
    does: [
      'Phone, email, website forms and DMs all land in a single list, and each new enquiry gets a quick acknowledgement so the customer knows you have it.',
      'You see who is waiting for a reply, instead of searching five apps to find out.',
    ],
    steps: [
      { name: 'You tell me where enquiries arrive', body: 'Email, your website form, social DMs, WhatsApp: whichever your customers use.' },
      { name: 'I bring them into one list', body: 'I connect those channels to a simple list you own, and write an instant reply with you.' },
      { name: 'You work from one place', body: 'Every new enquiry appears in the list with a reply already sent, so you can pick up where it matters.' },
    ],
    suits: 'Trades and offices that get enquiries from several places, and any small team that loses track of who has been answered.',
    notIncluded: ['Replying to enquiries for you. The instant reply acknowledges; you or your team still handle the conversation.'],
    faqs: [
      { q: 'Which channels can it bring together?', a: 'Email and website forms are straightforward. Some social apps limit what can be connected, so I say plainly in the free preview request what is possible for yours.' },
      { q: 'Where does the list live?', a: 'In an account in your name, so you own it and can keep using it without me.' },
      { q: 'Will the instant reply sound robotic?', a: 'It’s written with you, in your voice, and you approve it before it goes live.' },
      { q: 'Are there monthly app costs?', a: 'Some tools have a free tier; some don’t. Any paid app is paid direct to the provider and quoted in the scope sheet before you pay me.' },
    ],
  },
  {
    id: 'job-updates',
    h1: 'Automatic job update texts for UK trades and small businesses',
    title: 'Job update texts for UK trades and firms | Maz Works',
    lede: 'Customers ring because they want to know what’s happening. Send them “booked”, “on the way” and “done” texts automatically and the calls stop, without you stopping work.',
    does: [
      'At each stage of a job, the customer gets a short text: booked in, on the way, and finished.',
      'The messages are written in your voice, and triggered from your diary or job list, so there’s nothing extra to remember.',
    ],
    steps: [
      { name: 'You tell me your job stages', body: 'Booked, on the way, done: or whichever steps your jobs actually have.' },
      { name: 'I write and connect the messages', body: 'I word each text with you and tie it to your diary or job list, then test it with a dummy job.' },
      { name: 'Customers stay informed', body: 'Texts go out at each stage by themselves, so fewer “where are you?” calls land while you work.' },
    ],
    suits: 'Trades, installers, garages and any business that visits customers or holds their property for a job.',
    notIncluded: ['Live GPS tracking or a customer app. This sends plain stage texts only; anything bigger is priced as custom software.'],
    faqs: [
      { q: 'Can it say exactly when I’ll arrive?', a: 'It can send an “on the way” text when you trigger it. Exact arrival times depend on your tools, and I’ll say what’s possible in the free preview request.' },
      { q: 'Who pays for the texts?', a: 'The texting service is paid direct to the provider at its own price, quoted in your scope sheet before you pay me. You own the account.' },
      { q: 'Does it replace my diary?', a: 'No. It reads from the diary or job list you already use.' },
      { q: 'Can I change the wording later?', a: 'Yes. You get 30 days of tweaks after it goes live, and a 90-day fix promise if anything isn’t working the way we agreed.' },
    ],
  },
];

export function getServiceJob(id: string): ServiceJob | undefined {
  return SERVICE_JOBS.find((job) => job.id === id);
}

export function menuJobFor(job: ServiceJob): MenuJob {
  return getMenuJob(job.id);
}

/** Service jobs that suit a customer type, for the "Jobs I set up" block on /for pages. */
export function serviceJobsForType(typeId: string): ServiceJob[] {
  return SERVICE_JOBS.filter((job) => AUTOMATION_MENU.find((item) => item.id === job.id)?.types.includes(typeId as MenuJob['types'][number]));
}
