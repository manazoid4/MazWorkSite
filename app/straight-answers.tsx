import { THIRD_PARTY_NOTE } from './offers';

/**
 * The four questions that stop a busy owner before they ask for a plan
 * (conversion fixes, 2 Oct 2026). Said once here and reused on type pages and
 * trade guides. Every answer is something Maz already does; nothing here is a
 * new promise.
 */
export const STRAIGHT_ANSWERS: { q: string; a: string }[] = [
  { q: 'Will it work with my phone and booking app?', a: 'Usually, yes: I build on the apps you already have. If yours can’t do it, the free preview stage says so before you pay anything.' },
  { q: 'What will it cost me each month?', a: `Nothing to me unless you choose a care plan. ${THIRD_PARTY_NOTE}` },
  { q: 'My app already does this.', a: 'Then I’ll tell you how to switch it on, and you don’t pay me for it.' },
  { q: 'What if you’re ill or stop trading?', a: 'Everything runs in accounts in your name, with a short written guide, so it keeps working without me.' },
];

function Answers() {
  return (
    <div className="s-faq">
      {STRAIGHT_ANSWERS.map((item) => (
        <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>
      ))}
    </div>
  );
}

/** Its own section (trade guides), or `inline` inside another section (type pages keep 5 blocks). */
export function StraightAnswers({ inline = false }: { inline?: boolean }) {
  if (inline) return <div id="answers"><h3>What owners ask before they start</h3><Answers /></div>;
  return (
    <section className="s-section" id="answers" aria-labelledby="answers-title">
      <p className="eyebrow">Straight answers</p>
      <h2 id="answers-title">What owners ask before they start.</h2>
      <Answers />
    </section>
  );
}
