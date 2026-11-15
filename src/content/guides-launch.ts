import type { Guide } from "./schema";

/* StepGUIDES :: the Launch shelf.
   Four guides written for the thin places the Launch Review found (docs/SPINE.md): statements in the checks
   that no lesson taught, and Recover, the function the corpus taught least. Each one is a short procedure a
   small team can finish, and each source was read at the source on the date it carries. */

export const GUIDES_LAUNCH: Guide[] = [
  {
    id: "sg-domain-defense",
    title: "Holding The Name: Domain Locks, DNS And Certificates",
    domain: "Domains and DNS",
    kind: "playbook",
    statement: "Whoever controls the domain controls the site, the email and every link that points to them.",
    summary:
      "An afternoon's procedure for a project's domain: the locks a registrar and a registry can set, the DNS records to write down and watch, a CAA record that names which certificate authorities may issue, and a Certificate Transparency watch that says when one does. Each step names what it guards against and how to confirm it is in place.",
    minutes: 14,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "Three ways to lose a domain",
        body:
          "A domain can be transferred to another registrar, its records can be changed to point somewhere else, or it can lapse and be registered by someone else. In 2019 CISA's Emergency Directive 19-01 described the second at scale: attackers took the login of an account that could change DNS records, pointed agency domains at servers they controlled, and obtained valid certificates for them, so visitors saw no warning. Each step below closes one of the three, or makes it visible within a day."
      },
      {
        kind: "numbered",
        title: "The locks, in order",
        items: [
          "Ask the registrar to set clientTransferProhibited, clientUpdateProhibited and clientDeleteProhibited. ICANN says these help prevent unauthorized transfers, updates and deletions. With them set, a transfer or a change waits until the registrar lifts the lock.",
          "Ask whether the registry offers a registry lock. ICANN describes the server statuses as an extra protection some registries set at the registrant's request, through the registrar, and notes that removing them takes longer than removing the client locks.",
          "Turn on automatic renewal, pay with a card that will not expire first, and put the renewal date in the project calendar a month ahead.",
          "Confirm the locks in the domain's public RDAP record. The accounts and access check reads it for you and says which locks are set."
        ]
      },
      {
        kind: "checklist",
        title: "The DNS records, written down",
        items: [
          "Every record the domain should have, where it points and why: the site, the mail servers, and any verification records.",
          "Every account that can change those records, at the registrar and at the DNS host, each with a passkey or a security key.",
          "Change alerts turned on at the DNS host, reaching two people.",
          "A check on a schedule that the live records still match the list. CISA's first required action in 2019 was to audit every DNS record and confirm it resolved where it should."
        ]
      },
      {
        kind: "prose",
        title: "Name who may issue: CAA",
        body:
          "A CAA record in DNS names the certificate authorities allowed to issue certificates for the domain. RFC 8659 says publishing it lets a public CA add controls that reduce the risk of unintended mis-issue. Let's Encrypt explains why that matters: by default every public CA may issue a certificate for any domain once it validates control, so a flaw in any one CA's validation affects every domain. Publish CAA records for the CAs you use. RFC 8659's iodef property gives a CA an address to report requests that break your policy."
      },
      {
        kind: "prose",
        title: "Watch what is issued: Certificate Transparency",
        body:
          "Public CAs are expected to submit the certificates they issue to Certificate Transparency logs. RFC 6962 says the logs do not prevent mis-issue; they let the parties named in certificates detect it, and anyone concerned can monitor the logs for certificates issued for their domains that they did not expect. Set up a monitor for the domain and its subdomains, send its alerts to two people, and write down who reports an unexpected certificate to the CA that issued it. CISA asked agencies to do the same in 2019."
      },
      {
        kind: "callout",
        title: "Done means",
        body:
          "The three client locks show in the public record, renewal is automatic, every DNS record is on a list with its owner, CAA names your CAs, and a Certificate Transparency alert reaches two people. Answer the domain statements of the accounts and access check again when all five hold."
      }
    ],
    sources: [
      { label: "ICANN: EPP status codes", note: "The client and server lock statuses, what each prevents, and the registry lock some registries offer at the registrant's request.", url: "https://www.icann.org/resources/pages/epp-status-codes-2014-06-16-en", checked: "2026-11-08" },
      { label: "CISA: Emergency Directive 19-01, DNS infrastructure tampering (2019)", note: "The DNS hijacking campaign, the audit of DNS records as the first required action, multi-factor sign-in for DNS accounts, and watching Certificate Transparency logs.", url: "https://www.cisa.gov/news-events/directives/ed-19-01-mitigate-dns-infrastructure-tampering-closed", checked: "2026-11-04" },
      { label: "RFC 8659: DNS Certification Authority Authorization (CAA) Resource Record", note: "CAA lets a domain holder name the CAs authorized to issue for it, so a public CA can reduce unintended mis-issue; the iodef property for reports.", url: "https://www.rfc-editor.org/rfc/rfc8659", checked: "2026-11-08" },
      { label: "RFC 6962: Certificate Transparency", note: "The logs let the parties named in certificates detect mis-issue, and domain holders can monitor them for certificates they did not expect.", url: "https://www.rfc-editor.org/rfc/rfc6962", checked: "2026-11-08" },
      { label: "Let's Encrypt: Certification Authority Authorization (CAA)", note: "By default every public CA may issue for any domain after validating control; CAA is how a domain holder reduces that risk.", url: "https://letsencrypt.org/docs/caa/", checked: "2026-11-08" }
    ]
  },
  {
    id: "sg-verify-new-people",
    title: "Who Is Joining: Checking A New Person Before They Get Access",
    domain: "Identity",
    kind: "checklist",
    statement: "Give access to the person you checked, and keep confirming that it is the same person.",
    summary:
      "A short checklist for hiring or contracting anyone who will hold a project's access, built from the FBI's July 2025 warning about North Korean IT workers hired under false identities. It covers the checks before an offer, the video call, the first days of access, and the signs that the person doing the work is not the person who was hired.",
    minutes: 9,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "Why this check exists",
        body:
          "In July 2025 the FBI warned that North Korean IT workers are hired by companies under false identities, helped by facilitators in the United States who receive company laptops, set up remote access to them, and attend interviews on the workers' behalf. A crypto project that pays contractors and gives them access to its code is the kind of employer the scheme looks for. The checks below come from the FBI's own list of protections."
      },
      {
        kind: "checklist",
        title: "Before an offer",
        items: [
          "Check identity documents for misspellings, and compare the photo and contact details with the person's social profiles, portfolio and payment accounts.",
          "Confirm past employment and education directly with the employer or the school.",
          "Meet in person when you can. When you cannot, require video with the camera on and the background visible."
        ]
      },
      {
        kind: "checklist",
        title: "On the video call",
        items: [
          "Ask about the place they say they live, and compare it with the address on their documents.",
          "Ask them to wave a hand in front of their face. The FBI notes this can make AI-generated video glitch.",
          "Keep images to compare with later meetings, as the FBI suggests, and tell the person you are doing so."
        ]
      },
      {
        kind: "checklist",
        title: "The first days of access",
        items: [
          "Grant no access to any system until the checks are complete.",
          "Send a laptop only to the address on their identity documents. If they ask for another address, ask for documents that confirm it.",
          "Start with the smallest access their first task needs.",
          "If they came through an agency, share this guidance with the agency. The FBI notes contract work is a common way in."
        ]
      },
      {
        kind: "callout",
        title: "Signs to stop and check again",
        body:
          "A different face or voice on later calls than in the interview. A request to ship equipment somewhere else. A payment account that changes often, or a request to be paid in cryptocurrency. Remote access software nobody approved. The FBI names each of these; any one is a reason to pause access and verify again."
      },
      {
        kind: "prose",
        title: "The same checks for everyone",
        body:
          "Run these checks for every person who will hold access, in the same way and at the same point in hiring. They confirm a person's identity and work history, and nothing else."
      }
    ],
    sources: [
      { label: "FBI: North Korean IT worker threats to U.S. businesses, July 2025", note: "The facilitator scheme and the FBI's protections: document checks, direct verification of employment and education, in-person or video meetings, images for comparison, payment monitoring, shipping only to the documented address, no access before the background check, and the contractor route.", url: "https://www.ic3.gov/PSA/2025/PSA250723-4", checked: "2026-11-08" },
      { label: "FBI: North Korea aggressively targeting crypto industry with well-disguised social engineering attacks, September 2024", note: "Verify a contact's identity through separate, unconnected platforms.", url: "https://www.ic3.gov/PSA/2024/PSA240903", checked: "2026-11-08" }
    ]
  },
  {
    id: "sg-never-ask-line",
    title: "The Line You Publish: We Will Never Ask For Your Seed Phrase",
    domain: "Blockchain Security",
    kind: "playbook",
    statement: "Say once, in public, what your project will never ask for, so that anyone who asks is plainly not you.",
    summary:
      "How a project writes and keeps one public promise: it will never ask a user for a seed phrase, a private key, a password or a payment in order to help. The guide covers where the line goes, how support works inside it, and what to tell a user who has already been scammed, including the recovery scam that often follows.",
    minutes: 8,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "Why one line works",
        body:
          "Scammers pose as the people users trust for help: a project's support team, a moderator, a recovery service. SEAL 911, the volunteer emergency service for crypto, says it will never ask for a seed phrase, private keys or payment, and that anyone claiming to be SEAL who asks for them is running a scam. A project that says the same thing in the same words everywhere it talks to users gives every user a test they can run in a second."
      },
      {
        kind: "checklist",
        title: "Where the line goes",
        items: [
          "The website's support page and its footer.",
          "The pinned message in every community channel.",
          "The first reply in every support conversation.",
          "Inside the app, beside the screen that restores a wallet: the phrase goes into that screen and to no person."
        ]
      },
      {
        kind: "checklist",
        title: "How support works inside it",
        items: [
          "Support can help without a seed phrase, a key, a password or a one-time code. When a user offers one, stop them, and if they have already shared it, tell them to move their funds to a new wallet.",
          "Support answers in the project's own channels and does not open conversations by direct message, so a direct message offering help is a warning sign.",
          "A request for payment to unlock, verify or release funds is a scam, and the team says so."
        ]
      },
      {
        kind: "prose",
        title: "When a user has already been scammed",
        body:
          "Tell them to report it to the FBI's IC3 straight away, with the transaction details: the addresses, the amounts, the dates and times, and the transaction ids. The FBI's 2023 guidance for crypto scam victims asks for exactly these. Then warn them about the second scam: the FBI says to be wary of anyone who claims they can recover the funds, because that may be another scam. SEAL 911 helps in an emergency, free and in confidence."
      },
      {
        kind: "callout",
        title: "A line to adapt",
        body:
          "We will never ask for your seed phrase, your private keys, your passwords or a payment to help you. Anyone who does is not us."
      }
    ],
    sources: [
      { label: "SEAL 911: Did you lose crypto?", note: "SEAL never asks for a seed phrase, private keys or payment, and anyone claiming to be SEAL who asks is running a scam; the service is free and confidential.", url: "https://securityalliance.org/sos", checked: "2026-11-08" },
      { label: "FBI: Guidance for cryptocurrency scam victims, August 2023", note: "Report to IC3 with the transaction details (addresses, amount and type, dates and times, transaction ids), and be wary of anyone claiming they can recover the funds.", url: "https://www.ic3.gov/PSA/2023/PSA230824", checked: "2026-11-08" }
    ]
  },
  {
    id: "sg-coming-back",
    title: "Coming Back: Restore, Verify, Then Return",
    domain: "Incident Command",
    kind: "playbook",
    statement: "Nothing restored goes back online until someone other than the person who restored it has checked it.",
    summary:
      "The recovery half of an incident, for a small team: choosing what comes back first, checking a backup before using it, checking a restored system before it goes live, telling users plainly, and declaring the end on written criteria. Built from NIST's contingency planning guide (SP 800-34), its incident response guide (SP 800-61 Revision 3) and the Recover outcomes of CSF 2.0.",
    minutes: 12,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "Recovery has its own outcomes",
        body:
          "Recovery starts once the attacker is out, and NIST CSF 2.0 gives it outcomes of its own: recovery actions are selected, scoped and prioritized; the integrity of backups is verified before they are used; the integrity of restored assets is verified before normal operation is confirmed; and the end of recovery is declared on criteria, with its documentation complete. The order below follows those outcomes."
      },
      {
        kind: "numbered",
        title: "The order",
        items: [
          "Choose what comes back first. List the services users depend on most, such as the site, withdrawals or the node, and restore them in that order.",
          "Check the backup before you use it. Restore from a copy made before the attacker arrived, and compare it with the checksum recorded when it was made.",
          "Rebuild, then look for the attacker. NIST's incident response guide says to check restored assets for signs of compromise and fix the root cause before they return to use.",
          "Test it before users do. SP 800-34 describes two tests: data testing, that the data is complete and current to the last backup, and functionality testing, that the system is ready for normal operation.",
          "Change what the attacker could have seen: every key, password and token on the affected systems.",
          "Return, and tell users. SP 800-34 has users notified when normal operation returns, and CSF 2.0 asks that public updates on recovery use approved methods and messaging.",
          "Declare the end on criteria written before the incident: which services are back, which checks passed, and who decides."
        ]
      },
      {
        kind: "checklist",
        title: "Before anything goes back online",
        items: [
          "The backup used matched its recorded checksum.",
          "The restored system was checked for the attacker's tools and accounts.",
          "The cause is fixed, as well as the damage.",
          "Every exposed secret has been changed.",
          "The data is complete to the last good backup, and the system works end to end.",
          "A second person checked the work."
        ]
      },
      {
        kind: "callout",
        title: "For a treasury",
        body:
          "On a chain there is nothing to restore: funds that moved stay moved. Recovery for a treasury is new keys on new devices, a new multisig if any signer is in doubt, and a plain message to the community about what changed. The treasury check asks for a tested restore before the day it is needed."
      }
    ],
    sources: [
      { label: "NIST Cybersecurity Framework 2.0", note: "The Recover outcomes: RC.RP-02 recovery actions selected, scoped and prioritized; RC.RP-03 backups verified before use; RC.RP-05 restored assets verified; RC.RP-06 the end declared on criteria; RC.CO-04 public updates by approved methods.", url: "https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf", checked: "2026-11-08" },
      { label: "NIST SP 800-61 Rev. 3: Incident Response Recommendations and Considerations for Cyber Risk Management, April 2025", note: "Check restored assets for indicators of compromise and remediate root causes before production use; verify the restoration before a system goes back online.", url: "https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r3.pdf", checked: "2026-11-08" },
      { label: "NIST SP 800-34 Rev. 1: Contingency Planning Guide for Federal Information Systems", note: "The reconstitution phase: validation data testing, validation functionality testing, and notifying users when normal operations return.", url: "https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-34r1.pdf", checked: "2026-11-08" }
    ]
  }
];
