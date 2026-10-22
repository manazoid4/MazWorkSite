'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { NewsletterSignup } from '../newsletter-signup';

/**
 * Members-only items open once this browser has joined the list.
 * shortcut: a soft gate kept in localStorage (the text still ships in the page
 * data); move it behind an API if the content ever needs to be truly private.
 */
const KEY = 'mw-member';
const Member = createContext<{ member: boolean; join: () => void }>({ member: false, join: () => {} });

export function MemberProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState(false);
  useEffect(() => {
    try { setMember(localStorage.getItem(KEY) === '1'); } catch { /* storage blocked: stays locked until they join */ }
  }, []);
  const join = () => {
    setMember(true);
    try { localStorage.setItem(KEY, '1'); } catch { /* still open for this visit */ }
  };
  return <Member.Provider value={{ member, join }}>{children}</Member.Provider>;
}

export function MemberJoin({ count }: { count: number }) {
  const { member, join } = useContext(Member);
  if (member) return <p className="mw-member-in" role="status">You&rsquo;re a member. Everything below is open.</p>;
  return (
    <NewsletterSignup
      id="join"
      source="membership"
      title="Join free. Unlock everything."
      text={`${count} letters, checklists and guides for getting paid, tax, staff, data and safety, all checked against GOV.UK. Plus an email when the rules change. No fee, no catch.`}
      doneText="You’re in. Everything below is now open."
      onDone={join}
    />
  );
}

export function MemberOnly({ children }: { children: ReactNode }) {
  const { member } = useContext(Member);
  if (member) return <>{children}</>;
  return (
    <p className="mw-member-locked">
      Free for members. <a href="#join">Join with your email</a> and this opens straight away.
    </p>
  );
}

export function MemberBadge() {
  const { member } = useContext(Member);
  return member ? null : <span className="mw-kit-lock">Members</span>;
}
