import { CHECK_REPLY_TIME, VAT_NOTE } from './site';
import { OFFERS, CARE_PLANS, CHANGES_WINDOW, DELIVERY_PROMISE, PAYMENT_TERMS, SETUP_PRICE, STARTER_GUARANTEE, getExtra, getOffer, REFERRAL_REWARD } from './offers';
export type MazWorksFaq = {
  question: string;
  answer: string;
};

export const MAZ_WORKS_FAQS: MazWorksFaq[] = [
  {
    question: 'What’s in the free preview?',
    answer: `Tell me the job you want off your plate and, usually within ${CHECK_REPLY_TIME}, I send a working preview of it with your business name on, plus a fixed price and a written scope sheet. It’s built from a template on my own test setup, so it’s not on your apps yet; that happens once you say yes. There’s no catch: no call, no automated sales emails, no obligation. If it isn’t worth automating, I say so.`,
  },
  {
    question: 'What do you actually build?',
    answer: 'Automation, connected tools and custom software for small businesses: enquiries gathered and answered, quotes and invoices that follow themselves up, reminders, shared customer records, internal tools, customer portals and websites with the system built in.',
  },
  {
    question: 'How much does it cost?',
    answer: `Starter Automation ${OFFERS[0].price}. Business System from ${OFFERS[1].price.replace('From ', '')}. Custom Software from ${OFFERS[2].price.replace('From ', '')}. Launch Page ${getOffer('creator-launch').price}. Website from ${getOffer('website').price.replace('From ', '')}. Care plans ${CARE_PLANS[0].price} or ${CARE_PLANS[1].price}. Video and filming is priced on its own page. ${VAT_NOTE}`,
  },
  {
    question: `What can the ${OFFERS[0].price} Starter do?`,
    answer: `One task from the automation menu, set up to run itself on the tools you already use: missed-call text-back, appointment reminders, review requests, quote follow-up, payment reminders, online booking and more. Usually working within 7 working days of you adding me to your apps. ${STARTER_GUARANTEE}`,
  },
  {
    question: 'Can I buy an add-on on its own?',
    answer: `Add-ons go with a package, on the same invoice. Small set-ups are free with every package (two with a Starter, three with a Business System); extra ones are ${SETUP_PRICE} each. Extra automation is ${getExtra('Extra automation').price}.`,
  },
  {
    question: 'What isn’t included?',
    answer: `Paid apps or text-message costs, which you pay those companies directly (I tell you the cost up front). Changes after the 30-day tweaks window, unless you have a care plan (from ${CARE_PLANS[0].price}). And new features beyond the agreed plan, which get their own fixed price first.`,
  },
  {
    question: 'How long does it take?',
    answer: `${DELIVERY_PROMISE} After it goes live you get ${CHANGES_WINDOW.short}, and anything not working as agreed is fixed free for 90 days.`,
  },
  {
    question: 'How does payment work?',
    answer: `${PAYMENT_TERMS} Software subscriptions or text-message costs, if any, are paid by you directly at cost.`,
  },
  {
    question: 'What if we disagree about the work?',
    answer: 'Before any work I send a one-page written scope: what you get, what it costs and what done looks like. You pay once you have seen it working. If something is not what we agreed, I fix it free for 90 days, and you do not pay for any part that does not work. I spent five years handling complaints and escalations in regulated finance, including ombudsman cases, so I write scopes that cannot be misread. That protects you as much as me.',
  },
  {
    question: 'Why should I trust you?',
    answer: 'You always deal with me directly. I studied Computer Science, then spent five years in complaints and finance in regulated settings. At an internet service provider I was the main contact for escalations from business park owners and company directors on accounts worth hundreds of thousands of pounds. Everything I build lives in accounts in your name with a written guide, so it keeps working without me.',
  },
  {
    question: 'Do I own what you build?',
    answer: 'Yes. Every account stays yours. I never need your passwords; add me as a user, then remove me after.',
  },
  {
    question: 'What if you’re ill or stop trading?',
    answer: 'Everything I build runs in accounts in your name, with a short written guide, so it keeps working without me. You can remove my access at any time, and anyone you choose can pick it up from the guide.',
  },
  {
    question: 'What if an app I use changes or it stops working?',
    answer: `For 90 days after it goes live, anything I built that isn’t working the way we agreed is fixed free. If another company changes their app, that isn’t my build: I quote the fix first, or a care plan covers it. ${CHANGES_WINDOW.howItWorks}`,
  },
  {
    question: 'Am I tied in?',
    answer: `No. Every package is a one-off you own, with no contract. ${CARE_PLANS[0].name} (${CARE_PLANS[0].price}) and ${CARE_PLANS[1].name} (${CARE_PLANS[1].price}) are monthly, optional and can be cancelled any time.`,
  },
  {
    question: 'What will the texts or apps cost each month?',
    answer: 'Paid apps and text-message costs are paid directly to the provider, not to me. I put the expected cost in your scope sheet before you pay, so there are no surprises. You own the accounts.',
  },
  {
    question: 'Is this only for certain trades?',
    answer: 'No. If your business has customers, enquiries and admin, it fits: trades, salons, clinics, cafés, shops, agencies, charities and professional services, anywhere in the UK.',
  },
  {
    question: 'Do I need a new website?',
    answer: "Often not. Most of this works with the website and tools you already have. I'll say plainly if a new site or a custom system would genuinely help.",
  },
  {
    question: 'Do I need to book a call?',
    answer: "No. Send one line about the job with the form and I reply by email. Book the 15-minute call only if you'd rather talk it through.",
  },
  {
    question: 'Can you work with what I already use?',
    answer: 'Yes. Google Workspace, Microsoft 365, spreadsheets, Wix, Squarespace, WordPress, Square, Fresha, Booksy, Xero, QuickBooks and most others. I build on what you have wherever practical.',
  },
  {
    question: 'Do you pay for referrals?',
    answer: `Yes, ${REFERRAL_REWARD} by bank transfer, no limit, bigger jobs pay more. Ask the business to put your name in their first message. I pay within 7 days of their first invoice being paid. Details on the <a href="/refer">Refer a business</a> page.`,
  },
];

const pick = (question: string) => {
  const faq = MAZ_WORKS_FAQS.find((item) => item.question === question);
  if (!faq) throw new Error(`Missing homepage FAQ: ${question}`);
  return faq;
};

export const HOMEPAGE_FAQS = [
  pick('What’s in the free preview?'),
  pick('Can I buy an add-on on its own?'),
  pick('What isn’t included?'),
  pick('Is this only for certain trades?'),
];
