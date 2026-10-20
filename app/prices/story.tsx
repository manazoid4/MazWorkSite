import { CHECK_REPLY_TIME } from '../site';
import { CHANGES_WINDOW, FREE_STEP, PAYMENT_TERMS } from '../offers';

export function Founder() {
  return (
    <section className="pz-band pz-founder" id="about" aria-labelledby="about-title">
      <figure className="pz-portrait">
        <img src="/maz.webp" alt="Manazir, the founder of Maz Works" width={240} height={240} loading="lazy" />
        <figcaption>Manazir, 26<br />Computer Science graduate</figcaption>
      </figure>
      <div className="pz-founder-copy">
        <h2 id="about-title">I’m Manazir. I started Maz Works because I like fixing things that don’t work.</h2>
        <p>I’ve spent about five years in finance and complaints, managing business accounts across the UK and Europe. I’ve spoken to thousands of customers who were frustrated, and plenty who were angry. Almost every time, the cause was the same: a process that failed, a customer left without an update, or a team without the right tools.</p>
        <p>Now I’m putting that experience, and my Computer Science degree, into something of my own. Yes, I build websites. But I care just as much about what happens after someone visits. Do they get an answer? Does your team know what to do next? Is the customer kept up to date?</p>
        <p className="pz-pull">Maz Works is new. The experience behind it isn’t. You deal with me directly, from the first message to the finished work.</p>
        <a className="pz-textlink" href="/free-plan?src=prices-founder#leak-check-form">Tell me what’s going wrong <span aria-hidden="true">→</span></a>
      </div>
    </section>
  );
}

const STEPS = [
  { title: 'Tell me what’s going wrong', body: 'Or what you’d like to improve. A few lines is plenty. You don’t need to know the solution.' },
  { title: 'I suggest a practical fix, with a price', body: `You get a ${FREE_STEP.short} within ${CHECK_REPLY_TIME}. Nothing to pay.` },
  { title: 'We agree it, then I build and test it', body: 'You see it working before you pay. Bigger jobs are billed in stages you sign off.' },
  { title: 'You get something useful', body: `${CHANGES_WINDOW.name}, and care plans if you want them.` },
];

export function Route() {
  return (
    <section className="pz-section pz-start" id="start" aria-labelledby="start-title">
      <h2 id="start-title">You don’t need to know what you need.</h2>
      <ol className="pz-steps">
        {STEPS.map((step, index) => (
          <li key={step.title}>
            <span className="pz-big" aria-hidden="true">{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
      <p className="pz-fine">{PAYMENT_TERMS}</p>
      <div className="pz-final">
        <p>Not sure which one you need? That’s normal. Start with what’s going wrong.</p>
        <a className="button button-signal s-button-lg" href="/free-plan?src=prices-final#leak-check-form">Get my free preview</a>
      </div>
    </section>
  );
}
