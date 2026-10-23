/**
 * What each trade actually says and worries about. This is what makes a /for page
 * read as its own: the hub hook, the words customers use, and the objection an
 * owner in that trade would raise. Examples of language, never client quotes.
 * No prices here (they live in app/offers.ts).
 */
export type IndustryVoice = {
  /** One line for the hub tile. */
  hook: string;
  /** Heading for the "in your week" block. */
  week: string;
  /** Things customers really say, in their words. */
  words: [string, string, string];
  /** The worry an owner in this trade would raise, and a straight answer. */
  objection: { q: string; a: string };
};

export const INDUSTRY_VOICE: Record<string, IndustryVoice> = {
  'heating-and-plumbing': {
    hook: 'Service season, no-heat calls and landlords who want a time.',
    week: 'Your week in the cold months.',
    words: ['“Boiler’s due its yearly service.”', '“Can you do Thursday, I’m a landlord with two flats.”', '“You quoted me last week for the bathroom.”'],
    objection: { q: 'I can’t have a text giving gas advice.', a: 'It doesn’t. It collects routine service details and tells people it isn’t for emergencies. Anything involving gas stays with a Gas Safe registered engineer.' },
  },
  roofers: {
    hook: 'Storm weeks, leaks, and quotes that go quiet after the rain.',
    week: 'Your week after a storm.',
    words: ['“A few tiles have come off at the back.”', '“There’s a drip in the bedroom ceiling.”', '“Can you just have a look at the flat roof?”'],
    objection: { q: 'I don’t want customers climbing up to take photos.', a: 'The text asks for photos from the ground and says not to climb. The photos help you decide on a survey; they never replace one.' },
  },
  builders: {
    hook: 'Big quotes, long gaps and the job going to whoever replied first.',
    week: 'Your week between site visits.',
    words: ['“We’re comparing three quotes.”', '“Can you come and look before we decide?”', '“What’s the earliest you could start?”'],
    objection: { q: 'A chaser feels pushy on a big job.', a: 'It’s one polite line, in your words, with an easy way to book a visit. It stops the moment they reply, and it never marks a quote as accepted.' },
  },
  electricians: {
    hook: 'Landlord reports, extra sockets and callers who need it done.',
    week: 'Your week across the jobs.',
    words: ['“I need an electrical report before my tenant moves in.”', '“Can you add sockets in the kitchen?”', '“Is this something you do?”'],
    objection: { q: 'I can’t quote without seeing it.', a: 'You don’t have to. The card gives you the job, the property and the deadline so you can decide what needs a visit before any price is mentioned.' },
  },
  'salons-and-beauty': {
    hook: 'Full Saturdays, late-night bookings and the empty chair.',
    week: 'Your week behind the chair.',
    words: ['“Can I move to Friday instead?”', '“Running ten minutes late!”', '“Do you have anything this Saturday?”'],
    objection: { q: 'I already use a booking app.', a: 'Then I start there. I check what it already does first, and only add what’s missing, like a clearer reminder reply.' },
  },
  'dog-groomers': {
    hook: 'Wet dogs, ringing phones and matted coats that need a look first.',
    week: 'Your week on the grooming table.',
    words: ['“She’s a cockapoo and a bit matted.”', '“Can you fit us in before the holidays?”', '“How long will he be?”'],
    objection: { q: 'Every dog is different. A form can’t judge that.', a: 'It doesn’t try to. It collects size, coat and service so you can judge, and nothing is booked until you say so.' },
  },
  garages: {
    hook: 'MOT deadlines, drivers in a rush and cars on the ramp.',
    week: 'Your week under the cars.',
    words: ['“My MOT runs out on Monday.”', '“How much for a service on a Fiesta?”', '“Is my car ready yet?”'],
    objection: { q: 'I need to see the live ramp diary.', a: 'You do. The request is a preferred slot, not a booking. You check the diary and confirm it yourself.' },
  },
  'cafes-and-food': {
    hook: 'Lunch queues, group orders and allergen questions.',
    week: 'Your week behind the counter.',
    words: ['“Can you do sandwiches for a team lunch?”', '“Do you do anything gluten-free?”', '“Is there room for twelve on Saturday?”'],
    objection: { q: 'Allergens are too important for an automatic reply.', a: 'Agreed. The reply never talks about allergens. It passes the question to your staff, who talk it through with the customer.' },
  },
  'clinics-and-therapists': {
    hook: 'Calm replies, no phone tag and nothing clinical collected.',
    week: 'Your week in the practice.',
    words: ['“Do you have anything next week?”', '“I’d like to book a first appointment.”', '“Can I move my appointment?”'],
    objection: { q: 'I can’t have health details sitting in a text.', a: 'None are collected. The example asks for the kind of appointment and a time window, and tells people not to send health details.' },
  },
  architects: {
    hook: 'Portfolio interest, vague emails and enquiries that start cold.',
    week: 'Your week between projects.',
    words: ['“We’d like something like your extension project.”', '“What would it cost to start?”', '“We’re not sure where to begin.”'],
    objection: { q: 'My clients don’t fill in forms.', a: 'This is three plain taps, not a form to complete. It gives you a brief to open instead of a blank email.' },
  },
  trades: {
    hook: 'Missed calls, quiet quotes and chasing payment.',
    week: 'Your week across the jobs.',
    words: ['“Are you free for a quick job?”', '“Did you get my message?”', '“Can you send me a quote?”'],
    objection: { q: 'I’m not techy and I don’t want another app.', a: 'You don’t learn a new app. The reply goes out, and the details land where you already look.' },
  },
  appointments: {
    hook: 'Cancellations by text, voicemail and DM, and gaps in the day.',
    week: 'Your week in the diary.',
    words: ['“Can we move it to Thursday?”', '“I can’t make it any more.”', '“Do you have a gap this week?”'],
    objection: { q: 'I don’t want clients changing my diary.', a: 'They can’t. A change is a request on a card. The original appointment stays until you agree a new time.' },
  },
  creators: {
    hook: 'Comments that ask for the guide, and a list that is yours.',
    week: 'Your week after a post lands.',
    words: ['“GUIDE please!”', '“Where do I get the worksheet?”', '“Can I join your emails?”'],
    objection: { q: 'I only want to email people who said yes.', a: 'That’s how it’s set up. The resource and the emails are two separate choices, and nothing goes out without a yes.' },
  },
  offices: {
    hook: 'Missing documents, “did you get my email?” and slow onboarding.',
    week: 'Your week with new clients.',
    words: ['“Which documents do you still need?”', '“I sent that last week.”', '“Where are we up to?”'],
    objection: { q: 'Documents are sensitive and must stay in our system.', a: 'They do. The checklist tracks status only. No documents are uploaded here and nobody’s ID is collected.' },
  },
};
