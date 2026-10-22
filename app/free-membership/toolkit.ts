/**
 * Free toolkit content (22 Oct 2026). Researched, then fact-checked by a second
 * pass against the official page in each item's sources. Recheck every April
 * (tax year, minimum wage, ICO fee) and when Bank Rate changes.
 */
export type ToolkitItem = {
  kind: 'checklist' | 'template' | 'facts';
  title: string;
  when: string;
  points?: string[];
  text?: string;
  sources: string[];
};

export type ToolkitCategory = { id: string; title: string; blurb: string; icon: string; items: ToolkitItem[] };

export const CHECKED = '22 October 2026';

export const CATEGORIES: ToolkitCategory[] = [
  {
    "id": "getting-paid",
    "title": "Getting paid",
    "blurb": "Clear terms, polite chasing, and the law on late payment.",
    "items": [
      {
        "kind": "template",
        "title": "Payment terms for your invoices",
        "when": "At the bottom of every invoice. If the customer is a member of the public, leave out the last paragraph.",
        "sources": [
          "https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include",
          "https://www.gov.uk/late-commercial-payments-interest-debt-recovery/print"
        ],
        "text": "Payment due: [due date] ([30] days from the invoice date).\n\nPlease pay by bank transfer to:\nAccount name: [Account name]\nSort code: [00-00-00]\nAccount number: [00000000]\nReference: [Invoice number]\n\nQuestions about this invoice? Call [name] on [number] or email [email] within 7 days, so we can sort it out before the due date.\n\nLate payment: if this invoice is paid late, we may claim statutory interest at 8% above the Bank of England base rate, plus fixed compensation and reasonable recovery costs, under the Late Payment of Commercial Debts (Interest) Act 1998."
      },
      {
        "kind": "checklist",
        "title": "Chasing timeline: from invoice to court",
        "when": "Follow it the same way for every customer, so chasing is routine, not personal. Court steps are for England and Wales.",
        "sources": [
          "https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include",
          "https://www.gov.uk/make-court-claim-for-money/print",
          "https://www.justice.gov.uk/documents/debt-pap.pdf",
          "https://www.justice.gov.uk/courts/procedure-rules/civil/rules/pd_pre-action_conduct"
        ],
        "points": [
          "Day the job is done: send the invoice. It needs a unique number, your business name, address and contact details, the customer's name and address, a clear description, the supply date, the invoice date, the amounts, VAT if it applies, and the total.",
          "Sole trader using a business name? Also show your own name and an address where legal documents can reach you. Limited company? Use the full name on your certificate of incorporation.",
          "A week before it is due: check the right person has it and whether they need a purchase order number.",
          "3 days late: send the friendly reminder with a copy of the invoice.",
          "14 days late: send the second reminder, then phone them the same day.",
          "30 days late, customer is a company or partnership: send the final demand and give them 14 days.",
          "30 days late, customer is a person or a sole trader: send a Letter of Claim by post under the Pre-Action Protocol for Debt Claims, then wait at least 30 days from the date on the letter.",
          "Still unpaid: claim online at gov.uk/make-court-claim-for-money. You cannot claim online if you or they have no address in England or Wales.",
          "If you claim £10,000 or less and they dispute it, you must attend the court's free mediation.",
          "Court fee examples (claim plus interest): £35 up to £300, £80 for £1,000.01 to £1,500, £455 for £5,000.01 to £10,000.",
          "Keep a log of every invoice, email and call. You will need it if you go to court."
        ]
      },
      {
        "kind": "template",
        "title": "Friendly payment reminder",
        "when": "About 3 days after the due date. Works for any customer. Most late payers have simply forgotten.",
        "sources": [],
        "text": "Subject: Invoice [number]: friendly reminder\n\nHi [Name],\n\nJust a quick reminder that invoice [number] for £[amount] was due on [due date].\n\nI've attached a copy in case it went astray. You can pay by bank transfer:\n[Account name], sort code [00-00-00], account [00000000], reference [invoice number].\n\nIf it's already on its way, thank you, and please ignore this.\n\nThanks,\n[Your name]\n[Business name]\n[Phone number]"
      },
      {
        "kind": "template",
        "title": "Second reminder (overdue)",
        "when": "About 14 days late, when the first reminder got no reply. Phone them the same day. If the customer is a member of the public, delete the interest paragraph: the late payment law only covers business customers.",
        "sources": [
          "https://www.gov.uk/late-commercial-payments-interest-debt-recovery/print"
        ],
        "text": "Subject: Invoice [number]: now [X] days overdue\n\nHi [Name],\n\nInvoice [number] for £[amount] was due on [due date] and is now [X] days overdue. I sent a reminder on [date] and haven't had a reply.\n\nPlease pay it by [date, 7 days from today].\n\nIf there is a problem with the invoice or the work, please tell me today so we can put it right.\n\nIf payment has not arrived by [date], I will add statutory interest and fixed compensation of £[40 / 70 / 100], as the Late Payment of Commercial Debts (Interest) Act 1998 allows.\n\nThanks,\n[Your name]\n[Business name]\n[Phone number]"
      },
      {
        "kind": "template",
        "title": "Final demand to a business (letter before action)",
        "when": "Last step before court, only when your customer is a company or partnership. If they are a person or a sole trader, use the Pre-Action Protocol for Debt Claims instead. If your contract sets its own interest rate, use that rate instead of the statutory one.",
        "sources": [
          "https://www.gov.uk/late-commercial-payments-interest-debt-recovery/print",
          "https://www.legislation.gov.uk/uksi/2002/1675/article/4/made",
          "https://www.justice.gov.uk/courts/procedure-rules/civil/rules/pd_pre-action_conduct",
          "https://www.gov.uk/make-court-claim-for-money/print"
        ],
        "text": "Subject: Final demand: invoice [number]\n\nDear [Name],\n\nInvoice [number] for £[amount], due on [due date], is still unpaid. I sent reminders on [dates] and called on [date].\n\nUnder the Late Payment of Commercial Debts (Interest) Act 1998, I am now claiming the amounts below. A separate invoice for the interest and compensation is attached.\n\nUnpaid invoice: £[amount]\nFixed compensation: £[40 / 70 / 100]\nStatutory interest at [11.75]% a year from the day after [due date] to today: £[interest so far]\nTotal due today: £[total]\n\nInterest continues at £[daily amount] a day until you pay.\n\nPlease pay the total within 14 days of the date of this letter, by bank transfer to [Account name], sort code [00-00-00], account [00000000], reference [invoice number].\n\nIf you dispute any part of this, tell me in writing by [date] and say why. If you need to pay in instalments, or would like to try mediation, contact me by the same date.\n\nIf I do not receive payment or hear from you by [date], I intend to start a court claim. I will ask the court to order you to pay the court fee and my costs as well.\n\nYours sincerely,\n[Your name]\n[Business name]\n[Address]\n[Date]"
      },
      {
        "kind": "facts",
        "title": "Late payment law in plain English",
        "when": "Before you add interest, or when a customer argues about what you can charge.",
        "sources": [
          "https://www.gov.uk/late-commercial-payments-interest-debt-recovery/print",
          "https://www.legislation.gov.uk/uksi/2002/1675/article/4/made",
          "https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp",
          "https://www.bankofengland.co.uk/monetary-policy/the-interest-rate-bank-rate",
          "https://www.justice.gov.uk/documents/debt-pap.pdf",
          "https://www.gov.uk/make-court-claim-for-money/print"
        ],
        "points": [
          "Statutory interest and compensation apply when another business pays you late. They do not apply to sales to members of the public.",
          "The rate is 8% plus the Bank of England base rate on 30 June or 31 December just before the debt went overdue. It stays fixed for that debt.",
          "Overdue between 1 January and 31 December 2026: 11.75% a year (8% + 3.75%).",
          "Overdue between 1 July and 31 December 2025: 12.25% a year (8% + 4.25%).",
          "Daily interest = debt x yearly rate ÷ 365. £1,000 at 11.75% is about 32p a day, about £16 after 50 days.",
          "Fixed compensation, once for each payment: £40 for debts up to £999.99, £70 for £1,000 to £9,999.99, £100 for £10,000 or more.",
          "You can also claim reasonable costs each time you try to recover the debt.",
          "If your contract sets a different interest rate, you cannot claim statutory interest. Use the contract rate.",
          "No payment date agreed? The bill is late 30 days after the customer gets the invoice or you deliver, whichever is later.",
          "Agreed terms should usually be no more than 60 days between businesses, or 30 days for public authorities.",
          "To add interest, send the customer a new invoice for it.",
          "Owed by a person or a sole trader? Follow the Pre-Action Protocol for Debt Claims: a dated Letter of Claim, posted the same day, with an Information Sheet, a Reply Form and a Financial Statement. Wait 30 days from the letter date before going to court.",
          "If they say they are getting debt advice, give them reasonable time. If they reply but you cannot agree, give 14 days' notice before you claim.",
          "Scotland and Northern Ireland have different court processes."
        ]
      }
    ],
    "icon": "pound"
  },
  {
    "id": "customers",
    "title": "Customers",
    "blurb": "Clear quotes, calm complaint replies, and honest review requests.",
    "items": [
      {
        "kind": "template",
        "title": "Simple quote with clear terms",
        "when": "Before any job. A written quote with a deposit and a valid until date stops most arguments. If the customer accepts by email, phone or text, they may have a legal right to cancel: tell them how, and include a cancellation form.",
        "sources": [
          "https://www.gov.uk/online-and-distance-selling-for-businesses/print",
          "https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include"
        ],
        "text": "QUOTE [number]\nDate: [date]\nValid until: [date, e.g. 30 days from today]\n\nFor: [Customer name]\n[Customer address]\n\nFrom: [Business name]\n[Address] | [Phone] | [Email]\n\nTHE JOB\n[Plain description of the work or goods, and where]\n\nWHAT IS INCLUDED\n[Item 1]\n[Item 2]\n[Clearing up and taking away waste]\n\nWHAT IS NOT INCLUDED\n[e.g. decorating, parking charges, extra parts if hidden damage is found]\n\nPRICE\n[Item]: £[amount]\n[Item]: £[amount]\nTotal: £[total] [including VAT of £[amount] / no VAT charged]\n\nDEPOSIT AND PAYMENT\nDeposit: £[amount] due when you accept, to book your date.\nBalance: £[amount] due [on completion / within [X] days of the invoice].\nPay by bank transfer to [Account name], sort code [00-00-00], account [00000000], reference [quote number].\n\nTIMING\nStart date: [date]. Expected to take [X days].\n\nCHANGES\nAny extra work will be priced and agreed with you in writing before I do it.\n\nCANCELLING\n[How and by when you can cancel, and what happens to your deposit. If you accept by email, phone or text, add your legal right to cancel and a cancellation form.]\n\nTO ACCEPT\nReply \"I accept quote [number]\" or sign below.\n\nSigned: ____________  Date: ________"
      },
      {
        "kind": "template",
        "title": "Reply to a complaint",
        "when": "Within one working day. Short, calm and specific beats long and defensive. If it is getting heated, phone instead. Never make a fix or refund depend on them not leaving a bad review.",
        "sources": [
          "https://www.gov.uk/accepting-returns-and-giving-refunds",
          "https://assets.publishing.service.gov.uk/media/67eeb64fe9c76fa33048c790/CMA208_-_Fake_reviews_guidance.pdf"
        ],
        "text": "Subject: Your [order / job] on [date]: what I'm doing about it\n\nHi [Name],\n\nThank you for telling me about [the problem, in their words]. I'm sorry. That isn't the standard I aim for.\n\nHere's what I'll do: [the fix: repair, redo the work, replace or refund], by [date].\n\n[If you'd rather have a refund, just reply and say so.]\n\nIf this doesn't put it right, reply to this email or call me directly on [number] and I'll deal with it personally.\n\nThanks for giving me the chance to fix it.\n\n[Your name]\n[Business name]"
      },
      {
        "kind": "template",
        "title": "Asking customers for a review",
        "when": "The same day the job is done. Send it to every customer in the same way, not only the ones you think are happy. Email version first, text message below.",
        "sources": [
          "https://assets.publishing.service.gov.uk/media/67eeb64fe9c76fa33048c790/CMA208_-_Fake_reviews_guidance.pdf",
          "https://www.gov.uk/government/publications/fake-reviews"
        ],
        "text": "EMAIL\nSubject: Thank you from [Business name]\n\nHi [Name],\n\nThanks again for choosing [Business name] for [the job].\n\nWould you leave an honest review? It takes about a minute, and it helps other people decide whether to use a small business like mine:\n[Review link]\n\nIf anything wasn't right, please tell me directly as well, so I can fix it.\n\nThank you,\n[Your name]\n\nTEXT MESSAGE\nHi [Name], thanks for choosing [Business name] today. If you have a minute, an honest review of [the job] would really help: [Review link]. Thank you, [Your name]"
      },
      {
        "kind": "facts",
        "title": "The rules behind refunds and reviews",
        "when": "Before you reply to a complaint about faulty goods, or ask anyone for a review.",
        "sources": [
          "https://www.gov.uk/accepting-returns-and-giving-refunds",
          "https://www.gov.uk/online-and-distance-selling-for-businesses/print",
          "https://www.gov.uk/government/publications/fake-reviews/short-guide-for-businesses-publishing-consumer-reviews-and-complying-with-consumer-protection-law",
          "https://assets.publishing.service.gov.uk/media/67eeb64fe9c76fa33048c790/CMA208_-_Fake_reviews_guidance.pdf"
        ],
        "points": [
          "You must offer a full refund if an item is faulty, not as described, or does not do what it should.",
          "Sale items carry the same rights. A \"no refunds\" sign that takes away those rights is illegal.",
          "If it comes back within 6 months, you must repair or replace it, unless you can prove it was not faulty when sold.",
          "Customers have up to 6 years to claim for something they bought (5 years in Scotland).",
          "Selling online, by phone or by mail order? Customers can cancel up to 14 days after delivery, then have another 14 days to send it back. Refund within 14 days of getting it back, including standard delivery.",
          "If you do not tell them about their right to cancel, they can cancel at any time in the next 12 months.",
          "Never write fake reviews, or pay or ask anyone else to write them.",
          "Never offer a reward for a positive or five star review. If you give anything for an honest review, the review must say it was incentivised.",
          "Do not hide bad reviews: no threats, no deals that depend on a good review, and no stopping review requests when things go wrong."
        ]
      }
    ],
    "icon": "star"
  },
  {
    "id": "tax",
    "title": "Tax and HMRC",
    "blurb": "Key dates, thresholds and record rules so HMRC never surprises you",
    "items": [
      {
        "kind": "facts",
        "title": "Sole trader tax calendar for the 2025 to 2026 tax year",
        "when": "Pin this up if you file self assessment as a sole trader",
        "points": [
          "The tax year ran from 6 April 2025 to 5 April 2026.",
          "New to self assessment, or did not need a 2024 to 2025 return? You had to tell HMRC by 5 October 2026. Register now if you missed it, as you could get a penalty.",
          "Registered after 5 October 2026? HMRC will give you a filing deadline 3 months from the date on its letter or email. You still have to pay by 31 January 2027.",
          "Paper tax return deadline: 11:59pm on 31 October 2026.",
          "Online tax return deadline: 11:59pm on 31 January 2027.",
          "Want HMRC to collect what you owe through your tax code? File online by 11:59pm on 30 December 2026.",
          "Pay the tax you owe by 11:59pm on 31 January 2027.",
          "Do not know your profit for the whole year yet? You still have to send a return."
        ],
        "sources": [
          "https://www.gov.uk/self-assessment-tax-returns/deadlines",
          "https://www.gov.uk/register-for-self-assessment"
        ]
      },
      {
        "kind": "facts",
        "title": "Payments on account: the bill that catches new sole traders out",
        "when": "Read before your first self assessment bill so the January total is not a shock",
        "points": [
          "Payments on account are 2 advance payments towards your next tax bill, including Class 4 National Insurance.",
          "Each one is usually half of last year's tax bill.",
          "They are due by midnight on 31 January and 31 July.",
          "You do not have to make them if last year's bill was under £1,000.",
          "You also skip them if over 80% of last year's tax was paid outside self assessment, for example through your tax code.",
          "First year in self assessment? On 31 January you pay the full bill plus your first payment on account. Example from HMRC: a £3,000 bill means £4,500 due that January.",
          "Earning less this year? Ask HMRC to reduce them online or by post with form SA303. If your final bill is higher, you pay interest on the difference."
        ],
        "sources": [
          "https://www.gov.uk/understand-self-assessment-bill/payments-on-account"
        ]
      },
      {
        "kind": "checklist",
        "title": "Limited company annual deadlines",
        "when": "Add these to your calendar as soon as your company is set up",
        "points": [
          "First accounts to Companies House: 21 months after the date you registered the company.",
          "Annual accounts after that: 9 months after your company's financial year ends.",
          "Pay Corporation Tax, or tell HMRC you owe none: 9 months and 1 day after your accounting period ends. This applies if taxable profits are up to £1.5 million. Above that you pay in instalments.",
          "File your Company Tax Return: 12 months after your accounting period ends. You do not get a Corporation Tax bill, so work out what you owe yourself.",
          "You must still file a return if you made a loss or owe no tax. Late filing penalties apply even when there is no tax to pay.",
          "Confirmation statement: file at least once a year, up to 14 days after your review period ends, even if nothing has changed.",
          "Every director must verify their identity with Companies House first. Companies House will not accept the statement until they have.",
          "Fee: £50 online or £110 on paper, paid with your first statement in each 12 month payment period."
        ],
        "sources": [
          "https://www.gov.uk/prepare-file-annual-accounts-for-limited-company",
          "https://www.gov.uk/pay-corporation-tax",
          "https://www.gov.uk/company-tax-returns",
          "https://www.gov.uk/corporation-tax",
          "https://www.gov.uk/guidance/confirmation-statement-guidance"
        ]
      },
      {
        "kind": "facts",
        "title": "VAT and Making Tax Digital thresholds to watch",
        "when": "Check your rolling turnover every month against these numbers",
        "points": [
          "VAT: you must register if your taxable turnover for the last 12 months goes over £90,000.",
          "You must also register if you expect to go over £90,000 in the next 30 days alone.",
          "Went over on a rolling 12 months? Register within 30 days of the end of that month.",
          "Register late and you still owe VAT on sales made since the date you should have registered. You might also get a penalty.",
          "Making Tax Digital for Income Tax applies to sole traders and landlords in self assessment.",
          "It is based on qualifying income: your total self employment and property income BEFORE expenses. Not your profit.",
          "Over £50,000 in 2024 to 2025: you should have started from 6 April 2026. You can still sign up.",
          "Over £30,000 in 2025 to 2026: you start from 6 April 2027.",
          "Over £20,000 in 2026 to 2027: you start from 6 April 2028.",
          "No letter from HMRC? It is still your job to check and sign up in time."
        ],
        "sources": [
          "https://www.gov.uk/vat-registration/when-to-register",
          "https://www.gov.uk/guidance/check-if-youre-eligible-for-making-tax-digital-for-income-tax",
          "https://www.gov.uk/guidance/work-out-your-qualifying-income-for-making-tax-digital-for-income-tax"
        ]
      },
      {
        "kind": "facts",
        "title": "How long to keep your records",
        "when": "Use this before you shred anything or switch software",
        "points": [
          "Sole traders: keep records for at least 5 years after the 31 January deadline for that tax year. Example: a 2022 to 2023 return sent by 31 January 2024 means keeping records until at least the end of January 2029.",
          "Limited companies: keep records for 6 years from the end of the last company financial year they relate to.",
          "Keep company records longer if they cover more than one accounting period, relate to something bought to last over 6 years, your Company Tax Return was late, or HMRC has started a compliance check.",
          "No company accounting records? HMRC can fine you £3,000, or you can be disqualified as a director.",
          "Payroll records: keep for 3 years from the end of the tax year they relate to. Incomplete payroll records can mean a penalty of up to £3,000.",
          "Sole trader records lost, stolen or destroyed? Do your best to provide figures, and tell HMRC on your return if you used estimated or provisional figures."
        ],
        "sources": [
          "https://www.gov.uk/self-employed-records/how-long-to-keep-your-records",
          "https://www.gov.uk/running-a-limited-company/company-and-accounting-records",
          "https://www.gov.uk/paye-for-employers/keeping-records"
        ]
      }
    ],
    "icon": "calendar"
  },
  {
    "id": "staff",
    "title": "Taking on staff",
    "blurb": "Everything to sort before, and on, your first employee's first day",
    "items": [
      {
        "kind": "checklist",
        "title": "First employee checklist",
        "when": "Work through this before your first hire starts",
        "points": [
          "Check their right to work in the UK before they start. Use their share code online, or check their original documents with them present.",
          "British and Irish citizens cannot get a share code. Check their original passport or passport card instead.",
          "Keep a clear copy that cannot be changed, record the date of the check, and keep it during their job and for 2 years after they leave.",
          "No proper check? You risk a civil penalty of up to £60,000 per illegal worker.",
          "Register as an employer with HMRC before the first payday. You cannot register more than 2 months before you start paying people.",
          "Only director of your own limited company? You still need to register, even if you only employ yourself.",
          "Tell HMRC about your new employee on or before their first payday. Get their P45, or use HMRC's starter checklist.",
          "Get employers' liability insurance as soon as you become an employer: at least £5 million cover, from an authorised insurer. Not having it can mean a £2,500 fine for every day.",
          "Display the insurance certificate where staff can access it and show it to inspectors. Failing to can mean a £1,000 fine.",
          "Workplace pension duties start the day your first member of staff starts work."
        ],
        "sources": [
          "https://www.gov.uk/check-job-applicant-right-to-work",
          "https://www.gov.uk/penalties-for-employing-illegal-workers",
          "https://www.gov.uk/register-employer",
          "https://www.gov.uk/employers-liability-insurance",
          "https://www.gov.uk/national-minimum-wage-rates",
          "https://www.gov.uk/workplace-pensions-employers"
        ]
      },
      {
        "kind": "facts",
        "title": "Minimum wage and pension basics from April 2026",
        "when": "Check before you set an hourly rate or run your first payroll",
        "points": [
          "Aged 21 and over (National Living Wage): £12.71 an hour.",
          "Aged 18 to 20: £10.85 an hour.",
          "Under 18: £8 an hour.",
          "Apprentices: £8 an hour if under 19, or 19 and over in the first year of their apprenticeship. After that, they get the rate for their age.",
          "Rates change on 1 April every year.",
          "Pension: enrol staff aged 22 to State Pension age who earn at least £10,000 a year and normally work in the UK.",
          "Someone becomes eligible later through age or pay? Enrol them and write to them within 6 weeks.",
          "You must pay at least 3% of their qualifying earnings. Under most schemes that is earnings between £6,240 and £50,270 a year. Check your own scheme.",
          "Pay contributions to the scheme by the 22nd of the next month, or the 19th if paying by cheque."
        ],
        "sources": [
          "https://www.gov.uk/national-minimum-wage-rates",
          "https://www.gov.uk/workplace-pensions-employers",
          "https://www.gov.uk/workplace-pensions-employers/how-to-enrol-staff"
        ]
      },
      {
        "kind": "checklist",
        "title": "Day one paperwork: the written statement",
        "when": "Have this ready to hand over on your new starter's first day",
        "points": [
          "Every employee and worker must get a principal written statement on day one. It is not the same as a contract.",
          "Include: your business name, their name, job title or description, and start date.",
          "Include: how much and how often they are paid.",
          "Include: hours and days of work, how they may vary, and whether Sundays, nights or overtime are involved.",
          "Include: holiday entitlement, and whether it includes public holidays.",
          "Include: where they will work, and how long the job is expected to last.",
          "Include: any probation period and its conditions, other benefits, and any training they must do.",
          "Also on day one: sick pay and procedures, other paid leave, and notice periods.",
          "Within 2 months: pensions, collective agreements, other training rights, and disciplinary and grievance procedures.",
          "Changed something? Tell them in writing within one month of the change."
        ],
        "sources": [
          "https://www.gov.uk/employment-contracts-and-conditions/written-statement-of-employment-particulars"
        ]
      },
      {
        "kind": "template",
        "title": "Simple job offer letter",
        "when": "Send this when you offer someone a job, before their written statement",
        "sources": [
          "https://www.gov.uk/employment-contracts-and-conditions/written-statement-of-employment-particulars",
          "https://www.gov.uk/check-job-applicant-right-to-work",
          "https://www.gov.uk/national-minimum-wage-rates",
          "https://www.gov.uk/workplace-pensions-employers"
        ],
        "text": "[Your business name]\n[Your address]\n[Date]\n\nDear [Candidate name],\n\nJob offer: [Job title]\n\nThank you for meeting us. I am pleased to offer you the job of [job title] at [business name].\n\nThe main details are:\n\nStart date: [date]\nPlace of work: [address]\nHours: [number] hours a week, usually [days and times]\nPay: £[amount, at least the minimum wage for their age] per [hour / year], paid [weekly / monthly] on [payday]\nHoliday: [number] days a year, [including / plus] bank holidays\nProbation period: [number] months\nNotice period: [notice period]\n\nThis offer depends on:\n\n1. You showing us proof of your right to work in the UK before your first day.\n2. [Satisfactory references / any other condition, or delete]\n\nOn your first day you will get your written statement setting out the main terms of your job. We will also enrol you in our workplace pension if you are eligible.\n\nPlease reply by [date] to accept. On your first day, please bring [documents, your P45 if you have one, bank details].\n\nIf you have any questions, call me on [phone number] or email [email address].\n\nWe look forward to working with you.\n\nYours sincerely,\n\n[Your name]\n[Your role]\n[Business name]"
      }
    ],
    "icon": "users"
  },
  {
    "id": "data",
    "title": "Data protection",
    "blurb": "ICO fee, privacy notices, breaches and cookies made simple",
    "items": [
      {
        "kind": "facts",
        "title": "Do you need to pay the ICO data protection fee?",
        "when": "Check before you start, then every year when it renews",
        "points": [
          "Organisations that use personal data, sole traders included, must pay a data protection fee to the ICO unless they are exempt.",
          "It is a yearly fee. Renew it, or tell the ICO you no longer need to be registered.",
          "Tier 1, micro: turnover up to £632,000 or no more than 10 staff. Fee is £52.",
          "Tier 2, small and medium: turnover up to £36 million or no more than 250 staff. Fee is £78.",
          "Tier 3, large: anyone not in tier 1 or 2. Fee is £3,763.",
          "Pay by direct debit and the fee is £5 less.",
          "You may be exempt if you use personal data only for staff admin, your own advertising and marketing, or accounts and records.",
          "You are also exempt if you handle personal data without a computer or other automated system.",
          "Use CCTV for crime prevention? You must pay. The ICO says the answer is always yes.",
          "A dashcam on a vehicle you use for work means you are likely to need to pay.",
          "Should pay but do not? The ICO can fine you £400 to £4,000 on top of the fee.",
          "Exempt from the fee? You still have to follow the rest of data protection law.",
          "Not sure? The free ICO fee self assessment gives you the answer."
        ],
        "sources": [
          "https://ico.org.uk/for-organisations/data-protection-fee/",
          "https://ico.org.uk/for-organisations/data-protection-fee/faqs-data-protection-fee-payment-and-online-registration/",
          "https://ico.org.uk/for-organisations/data-protection-fee/data-protection-fee/exemptions/",
          "https://ico.org.uk/for-organisations/data-protection-fee/changes-to-the-data-protection-fee/"
        ]
      },
      {
        "kind": "checklist",
        "title": "Had a data breach? Your first 72 hours",
        "when": "The moment you spot personal data that is lost, stolen, sent to the wrong person or hacked",
        "points": [
          "The 72 hour clock starts when you discover the breach, not when it happened.",
          "Start a written log now: what happened, when, who is affected and what you have done. Keep it even if you end up not reporting. The ICO has a free log template.",
          "Contain it. Ask anyone who got data by mistake to delete it or send it back securely. Remotely wipe a stolen laptop if you can. After a cyber incident, change all passwords and make staff do the same.",
          "Assess the risk to the people affected, such as identity theft, safeguarding problems or real distress.",
          "If there is likely to be a risk to people, report it to the ICO without undue delay and within 72 hours.",
          "Do not wait for the full picture. Report what you know and send more details later.",
          "The ICO online form takes about 30 minutes and cannot be saved halfway, so have your facts ready.",
          "Unsure if you need to report? Use the ICO breach self assessment or call the ICO on 0303 123 1113.",
          "If the risk to people is high, you must also tell them without undue delay, with clear steps to protect themselves.",
          "Low risk, like a hair appointment reminder sent to the wrong customer who deleted it? You are unlikely to need to tell anyone, but log it."
        ],
        "sources": [
          "https://ico.org.uk/for-organisations/report-a-breach/personal-data-breach/",
          "https://ico.org.uk/for-organisations/advice-for-small-organisations/personal-data-breaches/72-hours-how-to-respond-to-a-personal-data-breach/"
        ]
      },
      {
        "kind": "template",
        "title": "Website privacy notice starter",
        "when": "A first draft for a small business website. Decide your lawful basis before you use the data, fill every bracket, delete what you do not do, and write it so anyone, including children if you use their data, can understand it. The ICO has a free privacy notice generator and lawful basis checker.",
        "sources": [
          "https://ico.org.uk/for-organisations/advice-for-small-organisations/privacy-notices-and-cookies/how-to-write-a-privacy-notice-and-what-goes-in-it/"
        ],
        "text": "Privacy notice for [Business name]\nLast updated: [date]\n\nWho we are\n[Business name] is [a sole trader / a limited company, number [company number]]. We are based at [address]. If you have any questions about your data, contact [name] at [email] or [phone].\n\nWhat we collect\nWe collect [your name, email address, phone number, address, booking details, payment records].\n[Only if you get data from somewhere else: We also receive [type of data] from [source].]\n\nWhy we use it and our lawful basis\n[Purpose 1, for example to take and manage your booking]. Lawful basis: [contract].\n[Purpose 2, for example to keep tax records]. Lawful basis: [legal obligation].\n[Purpose 3, for example to send you our newsletter]. Lawful basis: [consent]. You can withdraw your consent at any time by [clicking unsubscribe / emailing us].\n[If you rely on legitimate interests, say what the interest is here.]\n\nWho we share it with\nWe share your data only with [booking software provider, payment provider, accountant, delivery company].\n[Only if true: We do not sell your data.]\n\nHow long we keep it\nWe keep [type of data] for [period], then delete or destroy it securely.\n\nYour rights\nYou have rights over your data, including asking for a copy of it, asking us to correct it, asking us to delete it and objecting to how we use it. [Where we rely on consent, you can withdraw it at any time.] To use any of these rights, contact us at [email].\n\nCookies\n[Only if your site sets cookies: Our website uses cookies. See [link to cookie information] for what they do and how to turn them off.]\n\nComplaints\nIf you are unhappy with how we use your data, please tell us first at [email]. You can also complain to the Information Commissioner's Office at ico.org.uk."
      },
      {
        "kind": "facts",
        "title": "Cookies on your website: the basics",
        "when": "Before you add analytics, a booking widget, video embeds or ad pixels to your site",
        "points": [
          "Tell people what cookies you use and why, in clear words that are easy to find. A hard to find privacy policy is not enough.",
          "For most cookies you need consent, given by a clear action such as clicking accept. Carrying on browsing is not consent.",
          "Do not set non essential cookies before the visitor has said yes.",
          "No consent is needed for cookies strictly necessary for something the visitor asked for, such as a shopping basket, staying logged in, or remembering their cookie choice.",
          "Simple analytics used only to count how your site is used, so you can improve it, can now run without consent.",
          "That only works if your analytics provider uses the data just to help you. If it uses it for its own purposes, advertising, or to track people, you need consent.",
          "For that analytics exception, and for cookies that remember look and layout choices, you must explain them clearly and give a simple, free way to object.",
          "Advertising, social media tracking pixels and cross site tracking always need consent.",
          "Embedded videos and plugins can set cookies too. Use privacy mode where it exists and check what your website tools do.",
          "The ICO guide to PECR has a free cookie checklist."
        ],
        "sources": [
          "https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/",
          "https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/"
        ]
      }
    ],
    "icon": "lock"
  },
  {
    "id": "safety",
    "title": "Health and safety",
    "blurb": "The legal basics, accident reporting, fire safety and risk assessment",
    "items": [
      {
        "kind": "checklist",
        "title": "Health and safety legal basics for small businesses",
        "when": "When you take on your first worker, then check it once a year",
        "points": [
          "Do a risk assessment: find what could cause harm, decide how likely and how serious, then control it.",
          "5 or more employees? You must write down the significant findings of your risk assessment.",
          "Have a health and safety policy saying who does what, when and how.",
          "5 or more employees? Your policy must be written down. Share it, and any changes, with your staff.",
          "Employ anyone? Display the health and safety law poster where staff can easily read it, or give each worker the matching leaflet.",
          "First aid: have a suitably stocked first aid kit, someone appointed to take charge of first aid, and tell all staff the arrangements. This applies to every workplace and to the self employed.",
          "A basic low risk kit: first aid guidance leaflet, assorted sterile plasters, sterile eye pads, triangular bandages, safety pins, sterile wound dressings and disposable gloves. Base it on your own first aid needs.",
          "Buying a kit? British Standard BS 8599 is a useful guide, but the law does not require it.",
          "More than 10 employees? You must keep an accident book. A paper book or your own record system both work.",
          "Give workers information and training, consult them, and provide toilets, washbasins and other welfare facilities.",
          "Appoint a competent person to help you manage health and safety. You can do it yourself."
        ],
        "sources": [
          "https://www.hse.gov.uk/simple-health-safety/index.htm",
          "https://www.hse.gov.uk/simple-health-safety/risk/steps-needed-to-manage-risk.htm",
          "https://www.hse.gov.uk/simple-health-safety/policy/index.htm",
          "https://www.hse.gov.uk/simple-health-safety/display.htm",
          "https://www.hse.gov.uk/simple-health-safety/firstaid/index.htm",
          "https://www.hse.gov.uk/simple-health-safety/firstaid/what-to-put-in-your-first-aid-kit.htm",
          "https://www.hse.gov.uk/simple-health-safety/reporting-accidents-ill-health.htm",
          "https://www.hse.gov.uk/firstaid/what-employers-need-to-do.htm"
        ]
      },
      {
        "kind": "facts",
        "title": "RIDDOR: which accidents you must report, and by when",
        "when": "Straight after any serious accident, injury or dangerous near miss at work",
        "points": [
          "RIDDOR is the law that says some work accidents, diseases and dangerous near misses must be reported to HSE.",
          "It is reportable even if nobody broke the rules and nobody was to blame.",
          "Report deaths, specified injuries to workers, dangerous occurrences, and accidents where a customer or other member of the public is taken straight to hospital for treatment.",
          "Specified injuries include broken bones (not fingers, thumbs or toes), amputations, injuries likely to cause permanent loss of sight, serious burns, and losing consciousness from a head injury or lack of oxygen.",
          "Tell HSE without delay. The report must reach HSE within 10 days. Report online, or phone 0345 300 9923 for deaths and specified injuries only.",
          "A worker off work, or unable to do their normal job, for more than 7 days in a row after a work accident: report within 15 days of the accident.",
          "Count weekends and rest days in those 7 days, but not the day of the accident.",
          "Off for more than 3 days in a row: you do not report it, but you must record it. Your accident book is enough.",
          "Occupational diseases: report as soon as you get a diagnosis."
        ],
        "sources": [
          "https://www.hse.gov.uk/riddor/when-do-i-report.htm",
          "https://www.hse.gov.uk/riddor/types-of-reportable-incidents.htm",
          "https://www.hse.gov.uk/riddor/key-definitions.htm"
        ]
      },
      {
        "kind": "checklist",
        "title": "Fire risk assessment basics",
        "when": "If you employ people, or own, rent, run or manage any business premises",
        "points": [
          "If you control business premises you are the responsible person for fire safety. That includes employers, owners, landlords and occupiers.",
          "More than one responsible person, such as in a shared building? By law you must work together.",
          "Step 1: identify the fire hazards.",
          "Step 2: identify the people at risk.",
          "Step 3: evaluate, remove or reduce the risks.",
          "Step 4: record your findings, make an emergency plan and train your staff.",
          "Step 5: review and update the assessment regularly.",
          "You must keep a written record of your fire risk assessment, whatever your size.",
          "Your emergency plan needs clear, marked escape routes, exits that open easily, and a safe meeting point.",
          "Tell staff about the risks and give them fire safety instruction and training.",
          "You can do it yourself using the free GOV.UK guides for your type of premises. If you lack the time or know how, appoint a competent person.",
          "Fire services inspect premises and can issue notices. Minor penalties can be up to £5,000. Serious ones can mean unlimited fines and up to 2 years in prison.",
          "These rules cover England and Wales. Scotland and Northern Ireland have their own."
        ],
        "sources": [
          "https://www.gov.uk/workplace-fire-safety-your-responsibilities",
          "https://www.gov.uk/workplace-fire-safety-your-responsibilities/fire-risk-assessments",
          "https://www.gov.uk/workplace-fire-safety-your-responsibilities/fire-safety-and-evacuation-plans",
          "https://www.gov.uk/workplace-fire-safety-your-responsibilities/enforcement-appeals-and-penalties",
          "https://www.legislation.gov.uk/uksi/2005/1541/article/1"
        ]
      },
      {
        "kind": "checklist",
        "title": "Risk assessment starter: the HSE 5 steps",
        "when": "Your first risk assessment, or a yearly refresh",
        "points": [
          "1. Identify hazards. Walk round and note what could cause harm: slips, ladders, chemicals, hot equipment, heavy lifting, stress. Check your accident records and think about cleaning and maintenance too.",
          "2. Assess the risks. For each one, note who could be harmed (staff, contractors, customers, visitors) and how, how likely and how serious it is, and what you already do about it.",
          "3. Control the risks. Do everything reasonably practicable, for example change the job, swap the material or machine, train people, or provide gloves and other protective kit.",
          "4. Record your findings. With 5 or more employees you must write down the hazards, who might be harmed and how, and what you are doing about it. HSE has a free template.",
          "5. Review the controls. Check they work, and look again after an accident or when something changes.",
          "Paperwork is not the point. Controlling the risks in practice is.",
          "Ask your staff. They often know the risks best."
        ],
        "sources": [
          "https://www.hse.gov.uk/simple-health-safety/risk/steps-needed-to-manage-risk.htm"
        ]
      }
    ],
    "icon": "shield"
  }
];
