import type { Chapter } from "../schema";

export const chapter: Chapter = {
  id: "ch-identity",
  act: "ACT I — GROUND",
  order: 2,
  title: "THE KEEPER",
  subtitle: "Identity, access, applied cryptography and the custody of keys",
  essence: "cyan",
  thesis: "Networks stopped being the boundary a decade ago. What decides whether an attacker becomes an insider is now a chain of three questions asked millions of times a day: who is this, what may they do, and which key vouches for the answer. Most organisations answer the first question with something phishable, the second with permissions nobody has read since 2019, and the third with a key whose custody nobody can describe out loud. This chapter makes you the person who can describe it.",
  statement: "Identity is the perimeter, authorization is the blast radius, and key custody is the last thing standing between a bad day and an unrecoverable one.",
  why: "The 2025 Verizon DBIR put credential abuse at 22 percent of breaches as the single most common initial access vector, and 88 percent of basic web application attacks involved stolen credentials. Mandiant traced roughly 165 victim organisations in the 2024 Snowflake campaign to nothing more exotic than infostealer logs meeting accounts without enforced MFA. The Cyber Safety Review Board found that a single unrotated Microsoft signing key let a nation-state forge tokens into federal mailboxes. None of these were zero days. All three were failures of identity, authorization or key custody — the three things in this chapter.",
  outcomes: [
    "Explain, from the protocol upward, why SMS and TOTP fall to real-time phishing proxies and why origin-bound WebAuthn credentials do not.",
    "Sequence a phishing-resistant rollout that does not leave the account-recovery path as an unguarded back door.",
    "Model an authorization domain in RBAC, ABAC and ReBAC terms and choose deliberately rather than by vendor default.",
    "Walk a cloud privilege graph and find the escalation edges — PassRole, trust policy self-assumption, policy-version rollback — before an attacker does.",
    "Separate what NIST SP 800-207 and BeyondCorp actually require from what the zero trust market claims they require.",
    "State exactly what AEAD guarantees, why nonce reuse is a total collapse rather than a degradation, and how to build a key hierarchy that can survive rotation.",
    "Design custody for a signing key: quorum, ceremony, hardware boundary, revocation path and the evidence trail that proves it happened.",
    "Brief a board on standing privilege and on a key compromise without either minimising or catastrophising."
  ],
  prereq: ["ch-foundations"],
  unitUnlock: "u-keeper",
  sources: [
    {
      label: "NIST SP 800-63B-4, Digital Identity Guidelines: Authentication and Authenticator Management",
      note: "The only place to get the vocabulary right. Read the phishing-resistance definition (channel binding and verifier name binding), the AAL2 versus AAL3 split, the treatment of syncable authenticators, and why PSTN out-of-band is classed as restricted. Cite this, not a vendor blog, when someone claims their push app is phishing resistant."
    },
    {
      label: "NIST SP 800-207, Zero Trust Architecture",
      note: "Short, unglamorous, and the antidote to zero trust marketing. Use it for the PE/PA/PEP decomposition, the seven tenets, and the deployment-model taxonomy. Section 3 is the part vendors quote; section 5 (threats to a ZTA, including the risk of the policy engine itself) is the part they skip."
    },
    {
      label: "Lang, Czeskis, Balfanz et al., Security Keys: Practical Cryptographic Second Factors for the Modern Web (Financial Cryptography 2016) plus Google's subsequent internal deployment reporting",
      note: "The primary source behind the widely repeated claim that Google saw no successful phishing takeovers of employee accounts after mandating security keys across 85,000+ staff. It also has the usability data: authentication time cut substantially versus OTP, and second-factor authentication failures driven to zero. Good for convincing an exec that security and friction are not always trading."
    },
    {
      label: "Pang, Caceres, Burrows et al., Zanzibar: Google's Consistent, Global Authorization System (USENIX ATC 2019)",
      note: "The reference design for ReBAC at scale. Read it for zookies and the new-enemy problem, the Leopard index for deeply nested groups, and the honest latency and consistency tradeoffs. Everything sold as fine-grained authorization today is a descendant or a reaction to this paper."
    },
    {
      label: "Cutler, Dodds, Eidelman et al., Cedar: A New Language for Expressive, Fast, Safe, and Analyzable Authorization (arXiv 2403.04651)",
      note: "Why a deliberately non-Turing-complete policy language buys you static analysis — the ability to prove one policy never grants more than another. Read alongside OPA/Rego docs to understand what expressiveness costs you in reviewability."
    },
    {
      label: "Verizon 2025 Data Breach Investigations Report",
      note: "Use the initial-access-vector breakdown (credential abuse 22 percent, exploitation of vulnerabilities 20 percent, phishing 16 percent) and the infostealer findings on unmanaged devices. Best source for arguing budget in numbers an audit committee already trusts."
    },
    {
      label: "Google Cloud / Mandiant, UNC5537 Targets Snowflake Customer Instances for Data Theft and Extortion (2024)",
      note: "The cleanest modern case study in what happens when a data platform is protected only by a password. Roughly 165 organisations, credentials from commodity infostealers, no vendor breach involved. Use it to kill the argument that MFA on a service account is optional."
    },
    {
      label: "CISA/FBI joint advisory AA23-320A on Scattered Spider (UNC3944), updated July 2025",
      note: "Authoritative TTP list for help-desk social engineering, SIM swap, push bombing, adversary-in-the-middle kits, and abuse of federation by adding an attacker-controlled identity provider. The mitigations section is a ready-made control list for an identity programme."
    },
    {
      label: "Cyber Safety Review Board, Review of the Summer 2023 Microsoft Exchange Online Intrusion (Storm-0558)",
      note: "Read the whole thing once a year. Key-rotation decay, missing alerting on key age, a consumer key accepted for enterprise tokens, and detection that came from a customer rather than the vendor. It is the best public document on how key custody actually fails inside a competent organisation."
    },
    {
      label: "NIST FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), FIPS 205 (SLH-DSA) and NIST IR 8547, Transition to Post-Quantum Cryptography Standards",
      note: "The standards plus the transition schedule. IR 8547 is the one to quote when someone asks for a date: it moves RSA-2048 and ECC P-256 to deprecated around 2030 and disallowed by 2035. CNSA 2.0 timelines bind national security systems earlier."
    },
    {
      label: "Böck, Zauner, Devlin, Somorovsky, Nonce-Disrespecting Adversaries: Practical Forgery Attacks on GCM in TLS (USENIX WOOT 2016)",
      note: "Empirical proof that nonce reuse in AES-GCM is not theoretical. They scanned the internet, found repeated nonces in production TLS stacks, recovered the authentication key and forged traffic. Show this to anyone who wants to generate nonces from a request counter shared across replicas."
    },
    {
      label: "SPIFFE and SPIRE project documentation (spiffe.io)",
      note: "The concrete answer to secret zero. SPIFFE ID format, X509-SVID versus JWT-SVID and why the project prefers the former (tokens replay, certificates bind to a channel), node and workload attestation, and automatic short-lived rotation."
    },
    {
      label: "AWS Key Management Service Cryptographic Details and the KMS Developer Guide",
      note: "Read the key-hierarchy section: domain keys rotated daily in HSM memory, HSM backing keys rotated yearly, derived encryption keys used once. It is the clearest public description of a production key hierarchy, and it makes precise what automatic rotation does and does not do to your existing ciphertext."
    },
    {
      label: "MITRE ATT&CK Enterprise, especially TA0006 Credential Access and T1556 Modify Authentication Process, together with MITRE D3FEND",
      note: "Use ATT&CK to enumerate how identity is actually attacked (forged web credentials, MFA request generation, steal application access token) and D3FEND to name the countermeasure you are proposing rather than describing it in prose."
    }
  ],
  pages: [
    {
      id: "ch-identity-p1",
      title: "PAGE I — PROOF OF PERSON",
      credential: "Certified in Phishing-Resistant Authentication Design",
      summary: "Authentication factors, their true failure modes under a real-time proxy, the protocol reason origin binding works, and how to sequence a rollout so the recovery path does not quietly reopen everything you just closed.",
      competencies: [
        "Classify authenticators by what an adversary-in-the-middle proxy can and cannot relay",
        "Explain origin binding, RP ID hashing and challenge freshness at the protocol level",
        "Design help-desk and account-recovery verification that resists a fluent, well-briefed caller",
        "Sequence a phishing-resistant rollout by population risk rather than by convenience",
        "Instrument authentication so downgrade and fallback are visible as events, not gaps"
      ],
      seal: "SEAL OF THE FIRST GATE",
      steps: [
        {
          id: "ch-identity-p1-s1",
          kind: "construct",
          title: "The Perimeter Moved and Nobody Sent a Memo",
          statement: "The network boundary did not weaken; it stopped being where the decision happens, and identity became the only control plane an attacker has to defeat.",
          minutes: 18,
          respect: 60,
          trust: 2,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "For roughly thirty years the mental model of enterprise security was a shape: inside and outside, with a firewall drawing the line. That model died for a boring reason rather than a dramatic one. The applications left the building, the workforce left the building, and the identity provider became the single thing that both the laptop in a kitchen in Porto and the payroll SaaS in someone else's data centre agree to trust. When one component is the arbiter for everything, that component is the perimeter, whatever the network diagram says."
            },
            {
              kind: "metric",
              title: "What the 2025 incident data says about the front door",
              items: [
                "Credential abuse was the single most common initial access vector in the Verizon 2025 DBIR at 22 percent of breaches, ahead of vulnerability exploitation at 20 percent and phishing at 16 percent.",
                "In the basic web application attack pattern, 88 percent of breaches involved stolen credentials.",
                "Infostealer telemetry in the same report showed corporate credentials present on a substantial share of unmanaged devices — the personal laptop used for one work login is a credential source, not an edge case.",
                "Mandiant attributed data theft from roughly 165 Snowflake customer tenants in 2024 to credentials from commodity infostealer logs used against accounts with no enforced MFA. There was no breach of the platform itself."
              ],
              source: "Verizon 2025 DBIR; Mandiant/Google Cloud UNC5537 reporting"
            },
            {
              kind: "principle",
              title: "The Arbiter Rule",
              body: "Whatever component all other components defer to is your perimeter. Draw your controls, your logging and your paranoia around that component, not around the network segment that used to hold it."
            },
            {
              kind: "compare",
              title: "Two ways to read the same breach",
              left: {
                title: "The comfortable reading",
                items: [
                  "An employee got phished, which is a training problem",
                  "The attacker was sophisticated and used advanced techniques",
                  "We need better email filtering at the gateway",
                  "Our MFA was bypassed, so MFA is not effective",
                  "This was unlucky and unlikely to recur"
                ]
              },
              right: {
                title: "The operational reading",
                items: [
                  "A phishable factor was accepted for a high-value resource, which is a design choice we made",
                  "The attacker used a commodity proxy kit that costs less than a monitoring licence",
                  "Filtering reduces volume; it never reduces the probability to zero at scale",
                  "A relayable factor was bypassed. An origin-bound factor would not have been relayed",
                  "The same path is being walked against us right now by someone else"
                ]
              }
            },
            {
              kind: "list",
              title: "Four things that are now identity problems even though they do not look like it",
              items: [
                "Data exfiltration from a warehouse: usually a service account with a password and no conditional access, not an exploit.",
                "Ransomware deployment at scale: usually a domain or tenant admin path obtained through help desk manipulation or token theft.",
                "Supply-chain compromise of a build: usually a stolen CI credential or a long-lived personal access token with no expiry.",
                "Insider misuse: usually standing privilege that was never revoked after a role change, which is an access review failure, not a personality failure."
              ]
            },
            {
              kind: "callout",
              title: "The question that reorders a programme",
              body: "Ask your team: if an attacker held a valid session for our most privileged administrator right now, which control would notice, and how long would it take? If the honest answer is that nothing would notice until something broke, then identity is not a project for next quarter. It is the project."
            }
          ],
          awards: ["aw-perimeter-relocated"],
          glossary: ["identity-perimeter", "initial-access-vector", "infostealer", "standing-privilege"]
        },
        {
          id: "ch-identity-p1-s2",
          kind: "lesson",
          title: "Factors, and the Exact Way Each One Dies",
          statement: "Do not rank factors by how many there are; rank them by whether a live proxy in the middle can relay them to the real service.",
          minutes: 26,
          respect: 90,
          trust: 3,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "The phrase two-factor authentication encodes the wrong idea. It counts. What matters is not how many proofs the user produced but whether an attacker sitting between the user and the service can take those proofs and present them to the service as their own. A one-time code is a bearer secret: whoever holds it, uses it. A push approval is a bearer decision: whoever triggers it, benefits from it. Neither knows which website it is being used against. That single missing piece of context — which site am I authenticating to — is the whole story of modern credential attacks."
            },
            {
              kind: "table",
              title: "Authenticator failure modes, stated precisely",
              headers: ["Authenticator", "What it proves", "Primary real-world failure", "Relayable by an AiTM proxy"],
              rows: [
                ["Password alone", "Knowledge of a string", "Reuse plus infostealer logs plus credential stuffing", "Yes, trivially"],
                ["SMS one-time code", "Control of a phone number at that moment", "SIM swap, SS7 interception, and simple relay. NIST SP 800-63B classes PSTN out-of-band as restricted", "Yes"],
                ["TOTP authenticator app", "Possession of a shared seed", "Seed theft from backups or screenshots, and relay. The code carries no site context", "Yes"],
                ["Push approval, plain", "That a human tapped approve", "Push bombing and fatigue; the user cannot see which site requested it", "Yes"],
                ["Push with number matching", "That a human read two digits", "Better against fatigue, still relayable because the digits come from the attacker session", "Yes"],
                ["Smartcard or PIV certificate", "Possession of a non-exportable private key", "Middleware and enrolment weaknesses; strong when the TLS channel is bound", "No, when channel-bound"],
                ["FIDO2/WebAuthn passkey", "Possession of a private key bound to one origin", "Recovery-path abuse, unmanaged enrolment, and fallback methods left enabled", "No"]
              ]
            },
            {
              kind: "prose",
              title: "Why the proxy wins against everything in the top half",
              body: "An adversary-in-the-middle kit is not clever. It is a reverse proxy that serves the real login page to the victim, forwards every keystroke and code to the genuine service, and captures the resulting session cookie. The victim sees the real branding because it is the real page. The one-time code works because it is being submitted to the real service, within its validity window, by the attacker. The push notification is approved because from the identity provider's point of view a legitimate login is in progress. The stolen artefact is not the password; it is the session. CISA's Scattered Spider advisory documents exactly this progression, from voice-based help-desk manipulation and SIM swap to AiTM kits that intercept MFA in real time."
            },
            {
              kind: "principle",
              title: "The Context Law",
              body: "A credential that does not know which site it is being presented to can always be presented to a different site. Phishing resistance is not strength, secrecy or hardware. It is the credential carrying the verifier's identity inside the signed material."
            },
            {
              kind: "list",
              title: "Vocabulary worth being pedantic about, from SP 800-63B-4",
              items: [
                "Phishing resistance: the authentication protocol prevents disclosure of authentication secrets and valid authenticator outputs to an impostor verifier.",
                "Channel binding: the protocol binds an identifier for the communication channel irreversibly into the authenticator output.",
                "Verifier name binding: the authenticator output is cryptographically bound to a verifier identifier authenticated as part of the protocol. This is what WebAuthn does with the relying party identifier.",
                "Syncable authenticator: an authenticator whose secret can be cloned to other devices through a sync fabric. SP 800-63B-4 permits these at AAL2 but states they shall not be used at AAL3, which requires non-exportable keys.",
                "Restricted authenticator: one whose risk is elevated enough that the verifier must consider risk indicators before using it, and must offer an alternative. Out-of-band over the PSTN falls here."
              ]
            },
            {
              kind: "callout",
              title: "The sentence that ends the meeting",
              body: "When a vendor says their product is phishing resistant, ask one question: what verifier identifier is inside the signature, and where does it come from? If the answer is anything other than the origin the browser observed, the product is phishing resistant in marketing only."
            }
          ],
          awards: ["aw-factor-taxonomy"],
          glossary: ["aitm-proxy", "channel-binding", "verifier-name-binding", "syncable-authenticator", "restricted-authenticator"]
        },
        {
          id: "ch-identity-p1-s3",
          kind: "lab",
          title: "Relay a Code, Fail to Relay a Passkey",
          statement: "You do not understand origin binding until you have watched a proxy succeed against a one-time code and then hit a wall it cannot proxy around.",
          minutes: 40,
          respect: 170,
          trust: 8,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "This lab runs entirely against your own test identity provider and your own test relying party. Do not run a phishing proxy against a service you do not own, including your employer's, without written authorisation naming the systems and the window. The purpose is not to build a phishing kit; it is to see the exact line in the verification code that stops the attack, so you can later check whether that line exists in your own stack."
            },
            {
              kind: "numbered",
              title: "Build order",
              items: [
                "Stand up a local relying party on a hostname you control, for example login.acme.internal, with TLS. WebAuthn requires a secure context and a real origin; running on plain http breaks the very property you are studying.",
                "Enrol two authenticators for one test user: a TOTP seed, and a FIDO2 security key or a platform passkey.",
                "Stand up a reverse proxy on a lookalike hostname, for example login.acme-sso.internal, that forwards to the real relying party and logs every request and response. A basic nginx or mitmproxy configuration is enough; you do not need a purpose-built kit.",
                "Authenticate through the proxy using the password plus TOTP. Record what the proxy captured, and confirm the resulting session cookie works from a completely different browser profile and network egress.",
                "Now attempt the same flow using the passkey. Record the exact failure, and read the browser console message rather than guessing at it.",
                "Instrument the relying party verification path and prove to yourself which check fired."
              ]
            },
            {
              kind: "code",
              title: "The verification code that makes the attack impossible",
              lang: "python",
              body: "import json\nimport hashlib\nimport base64\n\nRP_ID = 'login.acme.internal'\nEXPECTED_ORIGIN = 'https://login.acme.internal'\n\ndef b64url(raw: bytes) -> str:\n    return base64.urlsafe_b64encode(raw).rstrip(b'=').decode()\n\ndef verify_assertion(assertion, expected_challenge_b64url, stored_sign_count):\n    client_data = json.loads(assertion['client_data_json'])\n\n    if client_data['type'] != 'webauthn.get':\n        raise ValueError('wrong ceremony type')\n\n    if client_data['challenge'] != expected_challenge_b64url:\n        raise ValueError('challenge replay or stale challenge')\n\n    if client_data['origin'] != EXPECTED_ORIGIN:\n        raise ValueError('origin mismatch: a proxy is in the path')\n\n    auth_data = assertion['authenticator_data']\n    rp_id_hash = auth_data[0:32]\n    if rp_id_hash != hashlib.sha256(RP_ID.encode()).digest():\n        raise ValueError('rpIdHash mismatch: credential is not for this RP')\n\n    flags = auth_data[32]\n    user_present = bool(flags & 0x01)\n    user_verified = bool(flags & 0x04)\n    if not user_present:\n        raise ValueError('no user presence')\n    if not user_verified:\n        raise ValueError('user verification required for this resource')\n\n    sign_count = int.from_bytes(auth_data[33:37], 'big')\n    if sign_count != 0 and sign_count <= stored_sign_count:\n        raise ValueError('signature counter did not advance: possible cloned authenticator')\n\n    return {'ok': True, 'sign_count': sign_count}\n"
            },
            {
              kind: "prose",
              title: "Read the two checks that matter",
              body: "The origin check compares a value the browser computed, not a value the page supplied. A script on the lookalike host cannot make the browser write the real origin into clientDataJSON, and it cannot read a credential scoped to a different relying party identifier, because the browser enforces the RP ID against the actual document origin before it will even talk to the authenticator. The rpIdHash check is the server-side mirror of that: the authenticator signed over the hash of the relying party it believes it is talking to. The proxy has no way to produce a signature over the real RP ID without the private key, and the private key never leaves the authenticator. This is not a filter that an attacker gets better at evading. It is an equality test on a value they do not control."
            },
            {
              kind: "checklist",
              title: "Prove it, do not assume it",
              items: [
                "Capture the TOTP session cookie in the proxy log and successfully replay it from a second browser profile. If you cannot, your test RP is doing token binding or device binding and you should note that as a mitigating control.",
                "Trigger the passkey flow through the proxy and record the browser error verbatim.",
                "Comment out the origin check alone, leave the rpIdHash check in place, and observe that the attack still fails. Then restore it. Understand that these are two independent defences.",
                "Comment out both, and watch a relayed assertion succeed. This is the bug you are hunting for in real code reviews.",
                "Check whether your real production relying party validates the signature counter, and what it does when the counter does not advance. Many platform authenticators always report zero; know which of yours do before you alert on it.",
                "Confirm your production identity provider cannot be configured to accept an assertion for a wildcard or parent-domain RP ID broader than intended."
              ]
            },
            {
              kind: "callout",
              title: "Carry this back to work",
              body: "The deliverable from this lab is not the proxy. It is a one-page note naming, for each of your top ten applications, whether authentication terminates at an origin-bound credential or at a relayable one, and who owns the decision. That note is worth more than any tooling purchase you will make this year."
            }
          ],
          awards: ["aw-origin-bound", "aw-lab-honest"],
          glossary: ["rp-id", "client-data-json", "signature-counter", "user-verification", "device-bound-session-credentials"]
        },
        {
          id: "ch-identity-p1-s4",
          kind: "drill",
          title: "The Voice on the Help Desk Line",
          statement: "Your strongest authenticator is only as strong as the process that replaces it when someone says they lost it.",
          minutes: 22,
          respect: 140,
          trust: 7,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Scattered Spider, tracked by MITRE as G1015 and by others as UNC3944 or Octo Tempest, did not defeat hardware-backed authentication. They routed around it by calling the service desk. CISA and the FBI documented the pattern in advisory AA23-320A and updated it in July 2025: native-fluency English callers, detailed open-source reconnaissance on the person they impersonate, and requests that sound entirely ordinary — a password reset, an MFA device change, a remote support tool. The technical control was never attacked. The human procedure that can override it was."
            },
            {
              kind: "list",
              title: "What the caller already knows before dialling",
              items: [
                "Full name, job title, manager, start date and office location, from a professional network profile and the company site.",
                "Employee ID format and often the actual number, from a leaked document, a badge photo posted publicly, or a prior low-value breach.",
                "Last four digits of national identifiers and dates of birth, from any of a dozen commodity data sets.",
                "The internal name of the ticketing system and the help desk script, from a former employee, a screenshot on a support forum, or a previous call to that same desk.",
                "Whether the target is currently travelling, which makes urgency plausible."
              ]
            },
            {
              kind: "principle",
              title: "The Recovery Law",
              body: "Every authentication system has a second, weaker authentication system hidden inside it, called account recovery. Attackers do not attack the strong one. Measure your programme by the strength of the recovery path, not the enrolment path."
            },
            {
              kind: "callout",
              title: "The only two questions that a caller cannot research",
              body: "Can you receive something on a device already bound to your identity, and can you be seen by a human who can compare you to a record you did not supply? Everything else in a verification script is knowledge, and knowledge is for sale. Design the escalation path so that these two questions are the ones being asked, and make it fast enough that legitimate users prefer it."
            }
          ],
          drill: {
            id: "ch-identity-p1-s4-drill",
            scene: "16:52 on a Friday. You are the on-call identity engineer. A service desk agent escalates a live call: a caller identifying as the VP of Corporate Development says her security key is in a hotel safe in Frankfurt and she needs access to the deal room within the hour or a signing deadline slips. She has already given her employee ID, her manager's name, her start month, and the last four digits of her national ID, all of which match the directory. Caller ID shows a mobile number that is not the one on file. She is calm, specific and slightly apologetic. The agent is one escalation away from resetting the authenticator.",
            clock: "You have about ninety seconds before the agent decides on their own.",
            pressure: "The named executive is real, is genuinely travelling, and has previously complained in writing about security friction. The deal is real. The deadline is real.",
            prompt: "What do you instruct the agent to do?",
            options: [
              {
                id: "ch-identity-p1-s4-o1",
                label: "Approve the reset — the knowledge checks all passed and the directory data matches",
                detail: "Employee ID, manager name, start month and last four digits are exactly what the runbook asks for.",
                score: -3,
                outcome: "You reset the authenticator for an attacker. Within four minutes a new passkey is enrolled on their device, the deal room is downloaded, and a mail rule is created to hide the enrolment notification. The real VP notices nothing until Monday.",
                ripple: "Every knowledge-based check in your runbook is now evidence in the post-incident review that the control was decorative. You will spend the next quarter rewriting the process under legal supervision instead of designing it calmly.",
                isBest: false
              },
              {
                id: "ch-identity-p1-s4-o2",
                label: "Refuse the reset, tell the caller to file a ticket through normal channels, and end the call",
                detail: "Hold the line on policy. No exceptions on a Friday.",
                score: 0,
                outcome: "This particular attempt fails. Nothing else happens. The caller thanks the agent politely and hangs up.",
                ripple: "They call back in twenty minutes and reach a different agent in a different region who has not been briefed. You captured no indicators, raised no alert, and learned nothing. Meanwhile the real VP, who genuinely is locked out, has a legitimate grievance that will be used against you in the next budget conversation.",
                isBest: false
              },
              {
                id: "ch-identity-p1-s4-o3",
                label: "Hold the reset, initiate an out-of-band callback to the number of record plus a live video identity match against the badge photo, page IR because this matches an active campaign pattern, and keep the caller engaged while indicators are collected",
                detail: "Verification moves to a channel the caller did not choose, on a device already bound to the identity, with a second human observing. Detection runs in parallel with the denial.",
                score: 3,
                outcome: "The caller declines the video step and disconnects. The callback to the number of record reaches the real VP, who is asleep and has not lost anything. IR now has a caller number, a voice recording, a timestamp and a target — and a specific executive to protect for the next 72 hours.",
                ripple: "The indicators feed a tenant-wide hunt that finds two earlier attempts against other executives that were refused but never reported. The out-of-band callback becomes standing policy for privileged resets, which is exactly the mitigation CISA recommends. Your service desk stops being a single point of failure and becomes a sensor.",
                isBest: true
              },
              {
                id: "ch-identity-p1-s4-o4",
                label: "Issue a four-hour temporary access bypass code so she is not blocked, and require full re-enrolment on Monday",
                detail: "Split the difference: time-boxed, reversible, and the executive is unblocked.",
                score: -3,
                outcome: "The bypass code is the compromise. It is a bearer secret with no origin binding, delivered over the phone, valid for four hours — you have voluntarily downgraded a hardware-backed account to something weaker than a password. The attacker uses it in ninety seconds and enrols persistence well before Monday.",
                ripple: "Worse, you have created precedent. Temporary bypass becomes the path of least resistance for every future escalation, and it will not be logged as an authentication downgrade because your telemetry does not have a name for it. Six months later an auditor asks how many bypass codes were issued last year and nobody can answer.",
                isBest: false
              }
            ],
            debrief: "Option three is best because it changes the channel, not the question. Every knowledge-based check in option one is data the attacker already has; adding more of them raises effort for the attacker by minutes and raises friction for legitimate users by hours. The decisive property of the callback is that the attacker does not control the destination — you dial the number already bound to the identity, or better, you push a verification to a device already enrolled. The video match against the badge photo adds a second modality that a voice-only attacker cannot satisfy, and it is cheap because you only invoke it for privileged resets. Option two is not wrong so much as inert: it protects this transaction and forfeits the intelligence, and it leaves the legitimate user genuinely stranded, which is how exception paths get built by executives instead of by you. Option four is the classic plausible-but-fatal answer, and it is the one experienced engineers pick under time pressure because it feels like a compromise between security and service. It is not a compromise. It is a full downgrade, dressed as one. Note also what option three does that none of the others do: it treats a single call as a campaign signal and pages detection. Scattered Spider-style operators do not make one call.",
            principle: "When identity is in doubt, change the channel rather than adding questions — and treat every recovery request against a privileged account as a detection opportunity, not just an authorization decision."
          },
          awards: ["aw-recovery-hardened", "aw-first-drill"],
          glossary: ["account-recovery", "out-of-band-verification", "help-desk-social-engineering", "authentication-downgrade"]
        },
        {
          id: "ch-identity-p1-s5",
          kind: "lesson",
          title: "Rollout Sequencing, and the Hole Underneath It",
          statement: "A phishing-resistant rollout that leaves any fallback enabled has not raised the floor; it has only added a step attackers will decline to take.",
          minutes: 30,
          respect: 120,
          trust: 5,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Most passkey programmes fail in the same way. Enrolment goes well, adoption charts look excellent, and then someone reads the authentication logs and discovers that a meaningful fraction of privileged sign-ins still complete with a one-time code because the fallback was never turned off. The fallback was never turned off because turning it off produces lockouts, and lockouts produce escalations, and escalations produce exceptions. The sequencing problem is therefore not technical. It is about ordering the work so that removing the weak path is the easy, obvious, low-drama step at the end rather than the terrifying one at the start."
            },
            {
              kind: "timeline",
              title: "A sequence that survives contact with an organisation",
              items: [
                "Week 0 — Instrument first. Emit an event for every authentication with the method used, the application, the AAL achieved, and whether a fallback was invoked. You cannot manage what you cannot see, and you will need this data to argue with people later.",
                "Week 2 — Define the population by blast radius, not by job title. Identity administrators, cloud administrators, source control and CI administrators, finance payment approvers, and anyone who can change the identity provider configuration. This is usually far more people than the org chart suggests.",
                "Week 4 — Enrol two authenticators per person in that population before requiring anything. Two keys, or one key plus one platform authenticator. A single-authenticator user is a lockout waiting to be resolved by an exception.",
                "Week 6 — Turn on enforcement for that population only, in report-only mode first, and read the failures. Every failure is either a missing enrolment or an application that cannot speak the protocol. Both are findings, not obstacles.",
                "Week 8 — Enforce. Simultaneously replace the recovery path with an in-person or verified-video process, because this is the moment the attacker's cost calculation shifts from phishing to help desk.",
                "Week 10 onward — Expand outward by application sensitivity rather than by user count. The last mile is legacy protocols: IMAP, SMTP AUTH, legacy database drivers, and anything using a static token. These need a different answer, not a passkey.",
                "Ongoing — Alert on downgrade. Any authentication to a protected resource that completed with a non-phishing-resistant method is an event, whether or not it was allowed."
              ]
            },
            {
              kind: "table",
              title: "The recovery paths that quietly reopen the door",
              headers: ["Path", "How it undoes the rollout", "What to do instead"],
              rows: [
                ["Help desk authenticator reset", "Re-enrols an attacker-controlled credential using knowledge checks", "Out-of-band callback to the number of record plus video identity match; two-person approval for privileged accounts"],
                ["Self-service password reset with email or SMS", "Re-establishes a phishable path to a phishing-resistant account", "Require an existing phishing-resistant authenticator to reset; never allow a weaker factor to bootstrap a stronger one"],
                ["Temporary access pass or bypass code", "Issues a bearer secret valid for hours with no origin binding", "Time-box to minutes, restrict to on-site issuance, log as a first-class downgrade event, and alert on every issuance"],
                ["Legacy protocol endpoints still enabled", "Attacker simply chooses the endpoint that never sees your policy", "Block legacy authentication at the tenant level; migrate the few real dependencies to modern auth or an isolated broker"],
                ["Break-glass accounts excluded from policy", "A permanent, deliberately unprotected admin account", "Hardware-backed and split-knowledge, stored physically, alarmed on any use, and exercised quarterly so the alarm is trusted"],
                ["Federation trust added to the tenant", "An attacker adds their own identity provider and signs in as anyone. Documented in the Scattered Spider advisory", "Alert on any change to federation configuration, domain verification or token-signing settings, and require two-person change control"],
                ["Third-party OAuth grants and app passwords", "Long-lived refresh tokens survive both password reset and MFA change", "Inventory grants, cap refresh token lifetime, and include explicit token revocation in every offboarding and containment runbook"]
              ]
            },
            {
              kind: "principle",
              title: "The Monotonicity Rule",
              body: "A weaker factor must never be sufficient to establish, reset or recover a stronger one. Every credential lifecycle transition should require an assurance level equal to or greater than the credential being changed."
            },
            {
              kind: "prose",
              title: "The syncable versus device-bound argument, resolved",
              body: "Synced passkeys can be cloned to a user's other devices through a platform sync fabric, which is exactly what makes them survivable for consumers and exactly what makes them unsuitable for the highest assurance. SP 800-63B-4 states plainly that syncable authenticators shall not be used at AAL3, which requires non-exportable authentication keys. The correct posture is usually both: synced passkeys for the general workforce because they eliminate phishing at scale and the recovery burden is manageable, and device-bound hardware authenticators for the population whose compromise is an enterprise-level event. Arguing this as a single organisation-wide choice is how these programmes stall for a year. Segment by consequence and decide twice."
            },
            {
              kind: "callout",
              title: "The metric that tells the truth",
              body: "Do not report percentage of users enrolled. Report percentage of authentications to tier-one applications by privileged users that completed with an origin-bound credential and no fallback. Enrolment is an input. That number is an outcome, and it is usually far lower than the enrolment chart implies."
            }
          ],
          awards: ["aw-rollout-sequencer"],
          glossary: ["temporary-access-pass", "legacy-authentication", "federation-trust", "aal2", "aal3", "oauth"]
        },
        {
          id: "ch-identity-p1-s6",
          kind: "field",
          title: "Map Your Own Front Door",
          statement: "You cannot claim an identity posture you have not personally enumerated, application by application, path by path.",
          minutes: 40,
          respect: 190,
          trust: 10,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "This is the first Praxis Profile artefact of the chapter. The work is unglamorous and it is the single highest-leverage week most identity engineers ever spend, because almost nobody has actually done it. You are producing an evidence-backed map of every way a human or machine can obtain an authenticated session in your environment, ranked by the consequence of that session being an attacker's."
            },
            {
              kind: "numbered",
              title: "The procedure",
              items: [
                "Enumerate every authentication surface, not every application. One application may have four surfaces: browser SSO, a mobile client, a legacy protocol endpoint, and an API token path. Each is a separate row.",
                "For each surface, record the strongest method it enforces and the weakest method it accepts. The second number is your real posture; the first is your marketing.",
                "Enumerate every credential lifecycle transition: initial enrolment, additional authenticator, authenticator reset, password reset, bypass issuance, and de-provisioning. For each, record what assurance level is required to perform it.",
                "Enumerate machine identities separately: service accounts, CI tokens, API keys, OAuth client credentials, and any account excluded from conditional access. Record who owns each one and when its credential last changed.",
                "Identify every path that violates the Monotonicity Rule, where a weaker credential can establish or reset a stronger one. These are your findings.",
                "Rank findings by consequence: what could the holder of this session do in the first hour? Not by CVSS, not by count.",
                "Pick the single highest-consequence violation and close it, end to end, with a named owner and a verification test. One closed path is worth more than a twenty-page report."
              ]
            },
            {
              kind: "checklist",
              title: "Quality bar for the artefact",
              items: [
                "Every row cites where the data came from: a policy export, a log query, or a screenshot with a timestamp. No row is from memory.",
                "The weakest-accepted-method column has no blanks and no unknowns. An unknown is itself a finding and must be recorded as one.",
                "Machine identities are counted and the count is defensible. If you cannot count them, that is the headline finding.",
                "At least one finding is uncomfortable for your own team. A map that only indicts other teams is not a map, it is a position paper.",
                "The closed finding has a before-and-after test that a colleague could rerun without you."
              ]
            },
            {
              kind: "callout",
              title: "Scope discipline",
              body: "If your environment is large, scope to one business unit or one product and say so explicitly. A complete map of a bounded scope is a professional artefact. An incomplete map of everything is noise, and the reviewer will treat it as noise."
            }
          ],
          praxis: "Produce an Authentication Surface Map for a named, bounded scope in a real environment you have authorisation to assess. Enumerate every authentication surface and every credential lifecycle transition, record the strongest enforced and weakest accepted method for each, identify every violation of the Monotonicity Rule, rank by first-hour consequence, then select and fully remediate the highest-consequence violation with a named owner and a repeatable verification test.",
          evidence: "Attach to your Praxis Profile: the surface map itself with a source citation on every row; the machine-identity inventory with counts and owners; the ranked findings list; and a before-and-after verification record for the one violation you closed, showing the weak path failing after remediation. Redact organisation identifiers if required, but do not redact the structure.",
          awards: ["aw-surface-mapper", "aw-first-field"],
          glossary: ["authentication-surface", "machine-identity", "conditional-access", "credential-lifecycle"]
        }
      ]
    },
    {
      id: "ch-identity-p2",
      title: "PAGE II — THE RIGHT TO ACT",
      credential: "Certified in Authorization Architecture and Privilege Graph Analysis",
      summary: "RBAC, ABAC and ReBAC as three different grammars for the same question; what Google learned building one authorizer for everything; policy engines and the price of expressiveness; the confused deputy in its modern cloud clothing; and break-glass design that an auditor and an attacker both take seriously.",
      competencies: [
        "Choose an authorization model from the shape of the domain rather than from vendor default",
        "Reason about authorization consistency, staleness and the new-enemy problem",
        "Express the same policy in a relationship model and in an attribute model, and defend the difference",
        "Trace privilege escalation edges in a cloud IAM graph and cut them with boundaries and organisation policy",
        "Design break-glass access that is usable at 03:00 and unusable quietly",
        "Explain standing privilege to a non-technical board in terms of consequence and time"
      ],
      seal: "SEAL OF THE SECOND GATE",
      steps: [
        {
          id: "ch-identity-p2-s1",
          kind: "construct",
          title: "Three Grammars for One Question",
          statement: "RBAC asks what you are, ABAC asks what is true right now, and ReBAC asks how you are connected — and picking the wrong grammar guarantees a decade of exceptions.",
          minutes: 22,
          respect: 70,
          trust: 3,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "Every authorization decision reduces to a single sentence: may this subject perform this action on this resource in this context. The models differ only in what they consider the natural way to store the facts that answer it. That sounds like an implementation detail. It is not. The model you choose determines which questions are cheap, which are expensive, and which are impossible without a migration. Organisations that chose roles for a domain that was really about relationships end up with role names like editor-of-project-4417-except-finance, which is a relationship encoded as a string, badly."
            },
            {
              kind: "table",
              title: "The three grammars, side by side",
              headers: ["Model", "Core fact stored", "Natural question", "Where it breaks"],
              rows: [
                ["RBAC", "Subject holds role; role grants permission", "What can a finance analyst do", "Role explosion once permissions vary per resource instance; nobody can answer who can see this specific document"],
                ["ABAC", "Attributes of subject, resource, action and environment", "Is this request permissible given current conditions", "Attribute sourcing and freshness; policies become unreviewable; hard to answer who has access without evaluating against every possible subject"],
                ["ReBAC", "Tuples of the form subject relates-to object", "Who can view this document, and why", "Deeply nested groups create expensive graph walks; consistency across a distributed store becomes a first-class problem"]
              ]
            },
            {
              kind: "compare",
              title: "The same requirement in two grammars",
              left: {
                title: "Attribute framing",
                items: [
                  "Permit read when subject.department equals resource.owning_department",
                  "And subject.clearance is greater than or equal to resource.classification",
                  "And context.device.managed is true",
                  "Cheap to evaluate, no relationship store required",
                  "Answering who has access requires enumerating all subjects and evaluating each",
                  "Attribute drift is silent: a stale department field grants or denies invisibly"
                ]
              },
              right: {
                title: "Relationship framing",
                items: [
                  "Tuple: document:q3-forecast viewer group:finance-analysts",
                  "Tuple: group:finance-analysts member user:mira",
                  "Permission view is computed by walking the graph",
                  "Answering who has access is a direct reverse query, which auditors love",
                  "Requires a consistent, low-latency relationship store you now operate",
                  "Contextual conditions such as device posture still need an attribute layer on top"
                ]
              }
            },
            {
              kind: "principle",
              title: "The Grammar Rule",
              body: "Choose the model that makes your most frequent and most audited question a direct lookup. If the question you are asked weekly is who can see this, you need relationships. If it is may this request proceed under current conditions, you need attributes. Most real systems need a relationship core with an attribute layer for context, and pretending otherwise produces a decade of workarounds."
            },
            {
              kind: "list",
              title: "Signals you chose wrong",
              items: [
                "Role names contain resource identifiers, project codes or the word except.",
                "The count of roles is growing faster than the count of people.",
                "Access reviews are performed by asking application owners rather than by querying the system, because the system cannot answer.",
                "There is a spreadsheet that is the real source of truth for who can approve payments.",
                "Answering a regulator's question about who could have seen a record requires an engineer to write a one-off script."
              ]
            },
            {
              kind: "callout",
              title: "One decision that costs nothing today and everything later",
              body: "Whatever model you pick, store the reason alongside the grant. A tuple or a role assignment with no linked justification, requester and expiry is an orphan the moment its author leaves. Systems that record why access exists can be pruned automatically. Systems that do not can only be pruned by asking humans, which is why they are never pruned."
            }
          ],
          awards: ["aw-grammar-chosen"],
          glossary: ["rbac", "abac", "rebac", "role-explosion", "access-review"]
        },
        {
          id: "ch-identity-p2-s2",
          kind: "lesson",
          title: "Zanzibar, and the Cost of Being Right Everywhere at Once",
          statement: "Google's answer to fine-grained authorization was not a clever data model; it was an explicit, per-request contract about how stale an answer may be.",
          minutes: 32,
          respect: 130,
          trust: 6,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Zanzibar, published at USENIX ATC in 2019, is the authorization system behind Drive, YouTube, Cloud and most of Google's consumer surface. It is worth studying not because you should build one, but because the paper is unusually honest about the problem that every authorization system eventually hits and most vendors do not mention: a distributed permission store is a database, databases have replication lag, and replication lag in an authorization system means the window between revoking access and access actually being denied."
            },
            {
              kind: "prose",
              title: "The new-enemy problem, stated plainly",
              body: "Suppose Mira removes Tomas from a document's viewer list and then adds sensitive content to the document. If the permission check for Tomas is served by a replica that has not yet seen the removal, Tomas reads content that was added specifically after his removal. This is not merely a stale read; it is a stale read that leaks information the owner deliberately gated on the revocation. Zanzibar addresses it with an opaque consistency token, informally a zookie, that the content service obtains when content changes and passes back on subsequent checks. The token encodes a global timestamp, and the check is evaluated at a snapshot at least that fresh. The application therefore states its freshness requirement per request instead of the system guessing."
            },
            {
              kind: "table",
              title: "The design tensions Zanzibar makes explicit",
              headers: ["Tension", "Naive answer", "What the paper actually does"],
              rows: [
                ["Consistency versus latency", "Always read the leader", "Per-request consistency choice via a consistency token; most checks can be served from a slightly stale snapshot, the ones that matter cannot"],
                ["Deeply nested groups", "Recursive lookups at check time", "A separate index structure for group membership so that deep nesting does not turn every check into an unbounded graph walk"],
                ["Hot resources", "Cache more", "Distributed caching plus request hedging and de-duplication, because a single viral document can concentrate load on one server"],
                ["Schema evolution", "Migrate all tuples", "Namespace configurations versioned so that checks evaluate against a consistent view of the schema and the data together"],
                ["Auditability", "Query the application", "The relationship store itself answers reverse queries: list everyone who can view this object"]
              ]
            },
            {
              kind: "principle",
              title: "The Freshness Contract",
              body: "An authorization answer without a stated freshness guarantee is not an answer, it is an opinion. Decide per operation how stale a permit may be, and make that decision visible in the API rather than hidden in a cache TTL."
            },
            {
              kind: "list",
              title: "What to take from the paper if you are not Google",
              items: [
                "Separate the relationship store from the application. Once permissions live inside each service's database, you can never answer a cross-service access question.",
                "Model permissions as computed from relations rather than stored directly. Storing computed results means every schema change is a data migration.",
                "Demand reverse queries from any authorization product you evaluate. If it can only answer can X do Y and not who can do Y, your access reviews will remain manual forever.",
                "Ask the vendor what their consistency model is under replica lag, and what happens to a revocation during a regional failover. The quality of the answer tells you whether they have operated the system or only sold it.",
                "Expect the caching layer to be where your incidents come from. Authorization caches fail closed if you are lucky and open if you were not careful."
              ]
            },
            {
              kind: "callout",
              title: "The revocation question",
              body: "Time-to-revoke is a security metric that almost nobody measures. Instrument it: from the moment access is removed in the source of truth, how long until every enforcement point denies. If the answer includes a token lifetime, a cache TTL and a replication lag, add them up honestly and put the total on a dashboard. That number, not the number of policies, is the health of your authorization system."
            }
          ],
          awards: ["aw-freshness-contract"],
          glossary: ["zookie", "new-enemy-problem", "reverse-query", "time-to-revoke", "relationship-tuple"]
        },
        {
          id: "ch-identity-p2-s3",
          kind: "lab",
          title: "Model It Twice: Relationships and Conditions",
          statement: "Write the same access requirement in a relationship schema and in a policy language, and the shape of your real problem stops being a matter of opinion.",
          minutes: 38,
          respect: 175,
          trust: 9,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "Take one requirement from a real system you know and express it in both grammars. The exercise takes an afternoon and settles arguments that otherwise run for months. The requirement used here is deliberately ordinary: analysts may view reports in folders belonging to their organisation, editors and owners may edit, organisation admins inherit edit on everything in the organisation, and no access at all is permitted from an unmanaged device or without a phishing-resistant authentication."
            },
            {
              kind: "callout",
              title: "Typography note before you copy anything",
              body: "String delimiters in this Page are rendered as typographic quotation marks so the course text stays consistent. Retype them as ASCII straight quotes before running any of it. This is the only place in the chapter where that matters."
            },
            {
              kind: "code",
              title: "Relationship schema, SpiceDB dialect of the Zanzibar model",
              lang: "zed",
              body: "definition user {}\n\ndefinition organization {\n    relation member: user\n    relation admin: user\n}\n\ndefinition folder {\n    relation org: organization\n    relation parent: folder\n\n    permission admin_access = org->admin + parent->admin_access\n}\n\ndefinition report {\n    relation folder: folder\n    relation owner: user\n    relation editor: user | organization#member\n    relation viewer: user | organization#member\n\n    permission edit = owner + editor + folder->admin_access\n    permission view = viewer + edit\n}\n"
            },
            {
              kind: "code",
              title: "Exercise the model and prove the inheritance actually works",
              lang: "bash",
              body: "zed schema write schema.zed\n\nzed relationship create report:q3-forecast folder folder:fy26-close\nzed relationship create folder:fy26-close org organization:acme\nzed relationship create organization:acme admin user:priya\nzed relationship create report:q3-forecast viewer organization:acme#member\nzed relationship create organization:acme member user:tomas\n\nzed permission check report:q3-forecast view user:tomas\nzed permission check report:q3-forecast edit user:tomas\nzed permission check report:q3-forecast edit user:priya\n\nzed permission lookup-subjects report:q3-forecast view user\n\nzed relationship delete organization:acme member user:tomas\nzed permission check report:q3-forecast view user:tomas --consistency-full\n"
            },
            {
              kind: "prose",
              title: "What to notice in the output",
              body: "The lookup-subjects call is the one that matters professionally. It answers who can view this, directly, from the authorization system, which is the question every access review and every regulator actually asks. Note also the final check: with full consistency requested, the revocation is immediately visible; without it, you are reading a snapshot and the answer may lag. That flag is the zookie idea made operational. Run the check both ways and watch the difference under load."
            },
            {
              kind: "code",
              title: "The contextual half, in Cedar",
              lang: "cedar",
              body: "permit (\n    principal,\n    action == Action::“ViewReport”,\n    resource\n)\nwhen {\n    context.authn.phishingResistant == true &&\n    context.device.managed == true &&\n    context.device.lastPostureCheckAgeSeconds <= 900\n};\n\nforbid (\n    principal,\n    action in [Action::“ViewReport”, Action::“EditReport”],\n    resource\n)\nunless {\n    context.network.egressCountry in [“PT”, “IE”, “DE”]\n};\n"
            },
            {
              kind: "prose",
              title: "Why two systems and not one",
              body: "The relationship store answers who is connected to what, and it answers it in both directions. The policy language answers whether the conditions of this specific request are acceptable, and because Cedar is deliberately not Turing-complete it can be statically analysed: you can ask whether one policy version ever grants more than another, which is a property you cannot get from an arbitrarily expressive language. Rego buys you generality — the same engine validates Kubernetes admission and Terraform plans — at the cost of that analysability and with a much wider surface for a policy author to write something that is subtly non-deterministic. Neither is wrong. Choosing both, with relationships underneath and conditions on top, is what most mature systems converge on, and it is worth arriving there deliberately rather than after two rewrites."
            },
            {
              kind: "checklist",
              title: "Lab completion bar",
              items: [
                "You can demonstrate an inherited permission arriving through two hops of the graph and explain the exact traversal.",
                "You have run a reverse query and captured the output.",
                "You have shown a revocation being visible under full consistency and stale under minimum consistency, with timings.",
                "You have written at least one forbid rule and confirmed that a forbid overrides a permit in Cedar's evaluation order.",
                "You can state, for your own system, which of the two layers is missing today and what question that makes unanswerable."
              ]
            }
          ],
          awards: ["aw-two-grammars", "aw-policy-author"],
          glossary: ["relationship-schema", "lookup-subjects", "policy-analysability", "forbid-overrides-permit"]
        },
        {
          id: "ch-identity-p2-s4",
          kind: "lesson",
          title: "The Confused Deputy Moved to the Cloud",
          statement: "Most cloud privilege escalation is not a flaw in IAM; it is IAM faithfully executing a permission you granted to a component that cannot tell whose behalf it is acting on.",
          minutes: 34,
          respect: 150,
          trust: 7,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Norm Hardy named the confused deputy in 1988 with a compiler that could write to a billing file. A user asked the compiler to write its output there; the compiler had the authority, the user did not, and the compiler had no way to know it was being used as a tool. Every cloud privilege escalation path is a version of that story. A service that can start compute is a deputy. A service that can assume a role on your behalf is a deputy. Continuous integration is the largest deputy most organisations own. The permission is never obviously dangerous in isolation; it becomes dangerous when combined with the ability to hand it a payload."
            },
            {
              kind: "table",
              title: "Escalation edges that appear in nearly every assessment",
              headers: ["Edge", "The permission pair", "Why it is invisible in review", "The cut"],
              rows: [
                ["Pass and run", "iam:PassRole plus a compute-start action such as ec2:RunInstances, lambda:CreateFunction or ecs:RunTask", "PassRole reads like plumbing and is granted with a wildcard resource", "Scope PassRole to specific role ARNs and add a condition on iam:PassedToService so a role passable to Lambda is not passable to EC2"],
                ["Policy version rollback", "iam:CreatePolicyVersion or iam:SetDefaultPolicyVersion", "Looks like ordinary policy maintenance; the escalation is setting an older, broader version as default", "Deny both actions outside a change-controlled principal; alert on any default version change"],
                ["Trust policy self-service", "iam:UpdateAssumeRolePolicy on a privileged role", "Editing a trust policy is not obviously the same as granting yourself the role", "Deny at organisation level for privileged roles; treat trust policy changes as tier-zero changes"],
                ["Attach and escalate", "iam:AttachUserPolicy, iam:AttachRolePolicy or iam:PutRolePolicy", "Granted to platform teams so they can self-serve", "Permission boundary on every principal that holds iam: write permissions, capping what they can grant downstream"],
                ["Infrastructure as a weapon", "cloudformation:CreateStack, glue:CreateDevEndpoint, codebuild:CreateProject, ssm:SendCommand", "These are build and operations permissions, reviewed by a different team than IAM", "Constrain the service roles these can assume; do not let a build role be a general-purpose deputy"],
                ["Metadata reachable from the application", "Any SSRF plus an instance profile", "The IAM policy is fine; the web application is the deputy", "Enforce IMDSv2 session tokens and a hop limit; scope instance profiles narrowly; assume any internet-facing service can be induced to make requests"],
                ["Cross-account without an external identifier", "sts:AssumeRole from a third party's account", "The third party is trusted, and the confused deputy is their multi-tenant service", "Require a unique external ID per customer in the trust policy, and verify the third party actually enforces it rather than accepting your word for it"]
              ]
            },
            {
              kind: "code",
              title: "Find the edges before someone else does",
              lang: "bash",
              body: "aws iam get-account-authorization-details --output json > auth-details.json\n\naws accessanalyzer create-analyzer --analyzer-name org-external --type ORGANIZATION\naws accessanalyzer list-findings --analyzer-arn $ANALYZER_ARN --filter status={eq=[ACTIVE]}\n\npmapper graph create\npmapper query 'preset privesc *'\npmapper visualize --filetype svg\n\ncloudsplaining scan --input-file auth-details.json --output findings/\n\naws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=UpdateAssumeRolePolicy --max-results 50\naws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=SetDefaultPolicyVersion --max-results 50\n"
            },
            {
              kind: "prose",
              title: "Boundaries, control policies and the difference nobody explains well",
              body: "A permission boundary is a ceiling attached to a principal: the effective permissions are the intersection of the identity policy and the boundary, so a platform engineer who can create roles cannot create a role more powerful than their own ceiling. A service control policy is a ceiling attached to an account or organisational unit: no principal in that account, including the account root, can exceed it. They compose, and the useful pattern is specific. Use SCPs for statements that should be true forever regardless of who is administering the account: no disabling of logging, no deletion of the organisation trail, no use of unapproved regions, no modification of the roles that IR depends on. Use permission boundaries for delegation: give teams the ability to create their own roles safely by making it structurally impossible for them to create a role that exceeds their ceiling. Teams that skip boundaries end up with a central platform team as a permanent bottleneck, which is why boundaries are a productivity control as much as a security one."
            },
            {
              kind: "principle",
              title: "The Deputy Test",
              body: "For every component that can act with authority it did not derive from the caller, ask: what stops it from acting on behalf of the wrong caller? If the answer is that callers are trusted, you have not answered the question, you have restated the assumption.",
            },
            {
              kind: "callout",
              title: "The finding that always lands",
              body: "Run the privilege graph and find the shortest path from a developer role to organisation administrator. Present it as a path with edge names, not as a list of risky permissions. Nobody funds a list of risky permissions. Everybody funds a four-hop diagram that ends at their own crown jewels."
            }
          ],
          awards: ["aw-graph-walker", "aw-least-privilege"],
          glossary: ["confused-deputy", "pass-role", "permission-boundary", "service-control-policy", "imds", "external-id"]
        },
        {
          id: "ch-identity-p2-s5",
          kind: "drill",
          title: "Break Glass at 02:40",
          statement: "Break-glass access is not an exception to your controls; it is a control with its own design, its own alarm and its own rehearsal schedule.",
          minutes: 24,
          respect: 145,
          trust: 7,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Every environment needs a path that works when the identity provider does not. Every environment therefore has an account that bypasses the controls you spent two years building. How that account is designed is one of the clearest signals of a mature programme, because it is the one place where availability and security are in genuine, irreducible tension and cannot both be maximised."
            },
            {
              kind: "list",
              title: "What good break-glass looks like before you need it",
              items: [
                "Credential split across two custodians so no single person can use it, stored physically, with tamper-evident seals.",
                "Hardware-backed second factor stored separately from the credential, under different custody.",
                "Excluded from conditional access by design and documented as such, because a policy that can lock out break-glass has defeated the purpose.",
                "Every authentication generates a high-severity alert to a channel that is not dependent on the systems that might be down, and the alert routes to someone whose job is to ask why.",
                "Exercised quarterly, in a scheduled test, so that the alarm is known to work and the runbook is known to be current.",
                "Rotated after every use, with the rotation itself two-person and evidenced."
              ]
            },
            {
              kind: "principle",
              title: "The Alarm Rule",
              body: "An emergency access path with no alarm is a backdoor. An emergency access path with an alarm nobody has ever seen fire is also a backdoor, because the first time it fires everyone will assume it is a false positive."
            },
            {
              kind: "table",
              title: "Three break-glass designs and how each one actually fails",
              headers: ["Design", "Availability under a failed identity provider", "How it fails in practice"],
              rows: [
                ["Cloud-native root account with hardware factor in a safe", "High, independent of federation", "Custodian unavailable; the safe is in an office nobody can reach; the alarm routes to a channel that depends on the failed identity provider"],
                ["Standing emergency admin identity excluded from all policy", "High", "It is a permanent unmonitored administrator. Over time it becomes the account automation uses because it never gets blocked"],
                ["Just-in-time elevation requiring approval from a second identity provider", "Medium, depends on the second provider being genuinely independent", "The second provider federates back to the first, so both fail together. Test this assumption explicitly, because it is usually false"]
              ]
            }
          ],
          drill: {
            id: "ch-identity-p2-s5-drill",
            scene: "02:40. A misapplied change has broken SAML federation into your cloud organisation. No human can obtain a console or CLI session through the normal path. A payment reconciliation batch must complete before 05:00 or the business misses a settlement window, and fixing it requires an administrative action in the management account. You are the senior engineer on the bridge with four other people, two of whom are executives who joined because a settlement is at risk.",
            clock: "Two hours and twenty minutes until the settlement window closes.",
            pressure: "The break-glass procedure requires two custodians. One custodian is reachable. The other is on a flight. An SCP blocks the specific action you need from every principal except a role that is itself reachable only through federation.",
            prompt: "What do you do first?",
            options: [
              {
                id: "ch-identity-p2-s5-o1",
                label: "Temporarily detach the SCP that blocks the action, perform the fix, and reattach it afterwards",
                detail: "The organisation management role can still edit policies. It is a five-minute change and fully reversible.",
                score: -3,
                outcome: "The fix works and the settlement completes. The SCP is reattached at 04:15. Nobody records why it was detached, because everyone is exhausted and the incident is closed as resolved.",
                ripple: "You have proven that your strongest structural control is removable under time pressure by one tired engineer at night. That precedent will be cited every subsequent incident. Worse, the detach-reattach window is now a known technique inside your organisation, and it is exactly the technique an attacker with a foothold in the management account would use — you have made it look normal in the logs.",
                isBest: false
              },
              {
                id: "ch-identity-p2-s5-o2",
                label: "Wait for the second custodian to land and follow the two-person procedure exactly",
                detail: "The procedure exists for a reason. Discipline under pressure is the whole point.",
                score: -1,
                outcome: "The custodian lands at 04:50. The settlement window is missed. The procedure was followed perfectly.",
                ripple: "Within a week, an executive sponsors an initiative to make emergency access faster, and it will be designed by people whose primary memory of security is that it cost the company a settlement. You will lose control of the design. Rigid adherence to a procedure that has no availability answer is not discipline; it is a design failure you are choosing to absorb at the worst moment.",
                isBest: false
              },
              {
                id: "ch-identity-p2-s5-o3",
                label: "Invoke break-glass using the documented alternate custodian, announce the invocation in the incident channel before using it, confirm the alarm fired and is acknowledged rather than suppressed, perform the minimum action within a time-boxed window, and schedule rotation before closing the incident",
                detail: "Use the control as designed, in the open, with the detection path deliberately left loud.",
                score: 3,
                outcome: "The alternate custodian, named in the runbook for exactly this case, is reached in eleven minutes. The alarm fires, is acknowledged by the on-call security engineer with a link to the incident, and the fix completes by 03:40. The settlement clears. Rotation is scheduled and completed within 24 hours.",
                ripple: "The incident review has clean evidence: an emergency path that worked, an alarm that fired and was trusted, and a rotation that closed the loop. The SCP was never touched, so the structural control remains credible. Your quarterly break-glass exercise is now something the executives actively support, because they watched it save a settlement rather than block one.",
                isBest: true
              },
              {
                id: "ch-identity-p2-s5-o4",
                label: "Create a new administrative IAM user with a long-lived access key so the team is not blocked again tonight",
                detail: "Pragmatic. Unblocks everyone immediately, and it can be cleaned up in the morning.",
                score: -3,
                outcome: "The fix completes quickly. The user is not cleaned up in the morning, because the morning is spent writing the incident report.",
                ripple: "Eleven months later a penetration test finds an IAM user named temp-fix-0240 with AdministratorAccess and an access key that has never been rotated, in the management account, excluded from every conditional access policy because it predates them. Every long-lived emergency credential ever created was created by a competent engineer under pressure who intended to remove it.",
                isBest: false
              }
            ],
            debrief: "Option three wins because it treats break-glass as a control being exercised rather than as a rule being broken. Three specific behaviours carry it. First, announcing before use: the announcement is what converts an anomalous authentication into an expected one for the responder, and it means the alarm can stay loud instead of being suppressed. Second, confirming the alarm fired: most organisations discover their break-glass alerting is broken during the incident where it mattered, and the only way to avoid that is to check every single time, which is also why the quarterly exercise exists. Third, time-boxing and scheduling rotation before closing: the incident is not over when the system works, it is over when the emergency credential is no longer valid. Option one is the tempting one, and it is tempting precisely because it is efficient and reversible. The damage is not to this incident; it is to the credibility of the SCP as a structural guarantee, and structural guarantees only work if nobody has ever seen one removed for convenience. Option two deserves attention because it looks like rigour. It is not. A procedure with a single point of custodial failure and no documented alternate is an incomplete design, and following an incomplete design into a business loss will cost you the authority to design the replacement. Option four is how essentially every orphaned admin credential in the world was born.",
            principle: "Design the emergency path so that using it correctly is faster than circumventing it — then make the alarm loud, rehearse it on a schedule, and never let a structural control be removed as an incident workaround."
          },
          awards: ["aw-break-glass", "aw-alarm-trusted"],
          glossary: ["break-glass", "two-person-rule", "scp-guardrail", "credential-rotation"]
        },
        {
          id: "ch-identity-p2-s6",
          kind: "council",
          title: "Explaining Standing Privilege to People Who Approve Budgets",
          statement: "A board does not fund least privilege; it funds a reduction in the number of people who could end the company on a bad Tuesday.",
          minutes: 28,
          respect: 135,
          trust: 6,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "The single most common failure in security communication at board level is describing controls instead of consequences. Nobody outside the function has an intuition for what least privilege means, and the phrase has been used so loosely for so long that it now reads as a synonym for being careful. What a board does have an intuition for is counting: how many people, how long, how bad, and what would we notice. Translate everything into those four."
            },
            {
              kind: "table",
              title: "The translation table",
              headers: ["What you would say to an engineer", "What the board hears", "What to say instead"],
              rows: [
                ["We have too much standing privilege", "Vague grumbling about permissions", "Today, 214 people can delete our production data without a second approval. Our target is under 20, and every one of those under a time-limited grant."],
                ["We are implementing just-in-time access", "An IT project with a name", "We are moving from permanent keys to keys that expire in four hours and require a reason. The reason field is what makes an insider incident investigable."],
                ["Our privilege graph has escalation paths", "Technical jargon", "There is a four-step path from a new developer's laptop to full control of every account we own. Here it is. Closing step two costs one engineer for six weeks."],
                ["Access reviews are manual", "A process complaint", "We certify access by asking managers to confirm lists they do not understand. Roughly 98 percent are approved unchanged. That control produces no signal and we should say so rather than reporting it as green."],
                ["We need budget for an identity platform", "A cost", "The last three material breaches in our sector all began with a valid credential. We currently cannot answer, within a day, who could have read a given customer record. Both statements come from the same gap."]
              ]
            },
            {
              kind: "quote",
              body: "The finding that changes a decision is never the count of vulnerabilities. It is the shortest path from something ordinary to something unrecoverable, drawn on one page, with the cost of removing one edge.",
              source: "Working doctrine for security briefings"
            },
            {
              kind: "numbered",
              title: "Structure for a fifteen-minute privilege briefing",
              items: [
                "One sentence of stance. Standing administrative access is our largest unmitigated concentration of risk, and we are proposing to reduce it by a specific number by a specific date.",
                "One number they can hold. The count of principals with irreversible authority today, and the target.",
                "One diagram. The shortest escalation path, four hops or fewer, from an ordinary starting point to that authority.",
                "One honest limitation. What this programme does not fix — for example, that it reduces standing access but does not address a compromised session on an administrator's laptop, which is the next chapter of work.",
                "One decision request, with the cost, the owner and the date. Not a menu of options; a recommendation you will defend, with the alternatives named and dismissed in one line each.",
                "One measurement commitment. What you will report next quarter and what number would tell them it is not working."
              ]
            },
            {
              kind: "principle",
              title: "The Consequence Frame",
              body: "Executives do not evaluate controls, they evaluate exposure and the credibility of the person describing it. Lead with what could happen, follow with how many people could cause it, and only then describe what you propose to change."
            },
            {
              kind: "callout",
              title: "The trap in this room",
              body: "Someone will ask whether a competitor's breach could happen here. The wrong answers are no and yes. The right answer names the specific control that differs and the specific control that does not: our accounts require phishing-resistant authentication, which theirs did not; our third-party integration access is comparable to theirs and is the subject of item three. Precision under that question is what buys you the budget."
            }
          ],
          praxis: "Draft a fifteen-minute privilege briefing for a real or realistic audit committee using the six-part structure, including one genuine escalation path diagram and one honest limitation.",
          evidence: "Attach the briefing outline, the one-page escalation diagram, and a written record of the three hardest questions you were asked when you rehearsed it with a non-security colleague, plus how you would answer each in under thirty seconds.",
          awards: ["aw-council-voice", "aw-consequence-frame"],
          glossary: ["standing-privilege", "just-in-time-access", "access-certification", "irreversible-authority"]
        }
      ]
    },
    {
      id: "ch-identity-p3",
      title: "PAGE III — ZERO TRUST, HONESTLY",
      credential: "Certified in Zero Trust Architecture and Workload Identity",
      summary: "What NIST SP 800-207 actually specifies, what BeyondCorp actually required Google to build, why device trust is an inventory problem before it is a security problem, how continuous evaluation works when a session must be able to die, and how SPIFFE removes the bootstrap secret from machine identity.",
      competencies: [
        "Decompose an architecture into policy engine, policy administrator and enforcement points and locate the trust dependencies",
        "Distinguish the tenets of SP 800-207 from vendor claims made in its name",
        "Design device trust that degrades gracefully when inventory is imperfect",
        "Implement session revocation that survives token lifetimes and caching",
        "Bootstrap workload identity through attestation rather than through an injected secret"
      ],
      seal: "SEAL OF THE THIRD GATE",
      steps: [
        {
          id: "ch-identity-p3-s1",
          kind: "lesson",
          title: "SP 800-207 Without the Costume",
          statement: "Zero trust is not a product category and not a network topology; it is the decision to move authorization from the network layer to a policy engine that is consulted for every request.",
          minutes: 28,
          respect: 100,
          trust: 4,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "NIST SP 800-207 is a short document and reading it once immunises you against most of what is sold in its name. Its core is a decomposition, not a technology. A policy engine makes the decision. A policy administrator establishes or tears down the communication path based on that decision. A policy enforcement point sits on the data path and does what it is told. Policy information points supply the signals the engine reasons over: identity assurance, device posture, threat intelligence, activity logs, data classification. That is the whole architecture. Everything else is choices about where those components live and what signals you can actually source."
            },
            {
              kind: "list",
              title: "The tenets, compressed to what they demand of you",
              items: [
                "All data sources and computing services are resources. If you cannot enumerate them, you cannot protect them, and the enumeration is the hard part.",
                "All communication is secured regardless of network location. There is no inside. A request from the office and a request from a cafe get the same scrutiny.",
                "Access is granted per session. Not per network connection, not per day, per session — and a session must therefore be terminable.",
                "Access is determined by dynamic policy including observable client state, which means you must have a source for device posture that is more trustworthy than the device's own claim about itself.",
                "The enterprise monitors and measures the integrity and security posture of all owned and associated assets. Associated is doing heavy lifting there: contractor laptops, personal devices, third-party systems.",
                "Authentication and authorization are dynamic and strictly enforced before access is allowed, and re-evaluated during the session.",
                "The enterprise collects as much information as possible about current state and uses it to improve posture. Zero trust without telemetry is a slogan."
              ]
            },
            {
              kind: "table",
              title: "What is claimed versus what SP 800-207 says",
              headers: ["Common vendor claim", "What the document actually supports", "The gap that bites"],
              rows: [
                ["Zero trust means replacing the VPN", "A resource portal or software-defined perimeter is one deployment model among several; identity-governance and micro-segmentation models are equally valid", "Replacing a VPN with a proxy that trusts any authenticated user has moved the perimeter, not removed it"],
                ["Our agent provides device trust", "Observable client state is an input to the policy engine; the standard does not specify the source", "An agent reporting on the health of the machine it runs on is attestation by the subject. Prefer signals from a management plane the endpoint cannot forge"],
                ["Zero trust eliminates lateral movement", "Per-request authorization reduces implicit trust between resources", "Only if east-west traffic is also enforced. Most deployments enforce north-south and leave the service mesh wide open"],
                ["Zero trust is a compliance state you reach", "The document describes a journey with hybrid coexistence as the normal steady state", "Declaring completion stops the funding at roughly the halfway point, which is the least secure position"],
                ["The policy engine is a security improvement", "Section 5 explicitly treats the policy engine and administrator as high-value targets and single points of failure", "You have concentrated all authorization into one component. Its compromise is total, and its outage is total. Both need answers before deployment"]
              ]
            },
            {
              kind: "principle",
              title: "The Consultation Rule",
              body: "In a zero trust architecture the question is never where did this request come from. It is: for this specific request, what did the policy engine decide, on what signals, how fresh were they, and can I show the decision afterwards? If a request can succeed without producing that record, that path is not in your architecture, it is a hole in it."
            },
            {
              kind: "callout",
              title: "The uncomfortable second-order effect",
              body: "Centralising authorization creates a component whose availability is now the availability of everything. Design the failure mode explicitly and in writing: does the enforcement point fail open or fail closed when it cannot reach the engine, does it use a cached decision and for how long, and who is allowed to change that setting. Teams that never decided this discover the answer during an outage, and it is usually fail open, configured by a vendor default."
            }
          ],
          awards: ["aw-zero-trust-honest"],
          glossary: ["policy-decision-point", "policy-enforcement-point", "policy-information-point", "per-session-access", "fail-closed"]
        },
        {
          id: "ch-identity-p3-s2",
          kind: "lesson",
          title: "BeyondCorp, and Why Device Trust Is an Inventory Problem",
          statement: "Google's hardest problem in removing the corporate network was not cryptography or policy; it was knowing, with confidence, which physical machine a request came from.",
          minutes: 30,
          respect: 110,
          trust: 5,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "BeyondCorp is described across a series of papers Google published from 2014 onward, and the sequence matters more than any single one. The architecture is simple to state: an access proxy in front of every application, a device inventory service, a user and group database, an access control engine, and a trust inferer that assigns each device a trust tier. Requests carry a device identity from a certificate on the machine and a user identity from the identity provider, and the proxy asks the engine. The papers that follow the architecture paper are mostly about migration, because the architecture was never the difficulty."
            },
            {
              kind: "numbered",
              title: "The order Google actually had to work in",
              items: [
                "Build an authoritative device inventory by unifying dozens of existing sources: procurement records, imaging systems, endpoint management, certificate authorities, network observations. Reconcile the duplicates and the ghosts.",
                "Issue a device certificate to a hardware-backed store on each managed machine, so that device identity is a cryptographic claim rather than a self-reported hostname.",
                "Instrument every application behind a proxy so that there is a single enforcement point that can be reasoned about.",
                "Run in monitoring mode against real traffic for a long time, mapping which users and devices reach which services, because nobody knows this in advance and the surprises are the whole project.",
                "Move traffic off the privileged network in waves, using the observed map to predict breakage, with an explicit rollback for each wave.",
                "Only then remove the privileged network itself, which is the point at which the security benefit is actually realised."
              ]
            },
            {
              kind: "prose",
              title: "Why the inventory is the hard part, permanently",
              body: "Device trust rests entirely on the claim that this request comes from that machine, and that machine is in this state. Both halves decay. Machines are re-imaged, transferred, retired without being retired in the system, cloned into virtual machines, and shared. Posture signals are collected by software running on the very device whose integrity is in question, which is attestation by the subject and worth much less than it appears. The signals worth most are the ones the endpoint cannot influence: a certificate in a TPM or secure enclave that cannot be exported, a management-plane assertion from a system the user does not control, a hardware attestation quote. The signals worth least are a registry key, a running process check, or a header the client sets. Build your tiers accordingly, and be explicit that a device claiming to be healthy is not the same as a device demonstrated to be enrolled."
            },
            {
              kind: "table",
              title: "Trust tiers that survive contact with reality",
              headers: ["Tier", "Evidence required", "Typical access", "Failure mode to plan for"],
              rows: [
                ["Untrusted", "None beyond user authentication", "Public and low-sensitivity resources only", "Users treat this as the normal path if the higher tiers are painful"],
                ["Known", "Device present in inventory, identified by a non-exportable key", "Internal tools without regulated data", "Inventory drift; stale entries for machines that no longer exist"],
                ["Managed", "Inventory plus a management-plane assertion of enrolment, encryption and patch level, recently refreshed", "Most business applications", "Posture staleness. A signal from six hours ago is not a signal about now"],
                ["Attested", "Hardware attestation of boot state plus non-exportable credential plus recent posture", "Production administrative access, key material, regulated data", "Small population, high friction; must be genuinely usable or exceptions will grow around it"]
              ]
            },
            {
              kind: "principle",
              title: "The Inventory Precedes The Policy",
              body: "You cannot enforce device trust you cannot measure, and you cannot measure devices you cannot enumerate. Any zero trust programme that begins with policy design rather than inventory reconciliation will spend its second year discovering that a third of its allow decisions were made on ghost records."
            },
            {
              kind: "callout",
              title: "What this means for the contractor question",
              body: "Every organisation eventually asks how to handle unmanaged devices belonging to contractors and partners. The honest answers are: give them a managed device, give them a remote environment where the sensitive data never lands on their machine, or accept a lower trust tier and scope the data accordingly. What does not work is asking them to install an agent and treating its output as equivalent evidence, because you have no control over that endpoint and the agent's report is a claim made by an untrusted party about itself."
            }
          ],
          awards: ["aw-device-inventory"],
          glossary: ["access-proxy", "device-trust-tier", "trust-inferer", "hardware-attestation", "posture-staleness"]
        },
        {
          id: "ch-identity-p3-s3",
          kind: "lab",
          title: "Build a Session That Can Die",
          statement: "If your only revocation mechanism is waiting for a token to expire, you do not have revocation; you have patience.",
          minutes: 36,
          respect: 165,
          trust: 9,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "Continuous evaluation is the tenet everyone agrees with and almost nobody implements, because implementing it means confronting the fact that bearer tokens are, by design, valid until they expire. The standards work here is the OpenID Foundation's Shared Signals Framework, with the Continuous Access Evaluation Profile carrying events such as session-revoked, credential-change and device-compliance-change between a transmitter and a receiver. The engineering work is making every enforcement point in your path capable of acting on such an event within seconds rather than within a token lifetime."
            },
            {
              kind: "code",
              title: "A revocation budget, written down before it is implemented",
              lang: "yaml",
              body: "revocation_budget:\n  target_seconds: 60\n  components:\n    - name: source_of_truth_write\n      description: HR or IdP records the termination\n      budget_seconds: 5\n    - name: signal_emission\n      description: CAEP session-revoked event published to subscribers\n      budget_seconds: 5\n    - name: proxy_enforcement\n      description: access proxy drops cached decision and denies\n      budget_seconds: 10\n    - name: resource_server_token_check\n      description: introspection or revocation list consulted\n      budget_seconds: 20\n    - name: downstream_app_refresh_token\n      description: connected apps revoke refresh grants\n      budget_seconds: 20\n  known_gaps:\n    - component: legacy_reporting_tool\n      reason: validates JWT signature only, no introspection\n      current_worst_case_seconds: 3600\n      compensating_control: network egress deny at proxy on revocation event\n      owner: data-platform\n      due: 2026-Q4\n"
            },
            {
              kind: "prose",
              title: "Why the gap list is the most valuable part",
              body: "Any competent team can make the happy path revoke quickly. What separates a real programme is the enumerated list of components that cannot, with the worst-case number written next to each one and a compensating control named. That document is what you hand to an incident commander at 03:00 so they know which systems still hold a live session for a terminated employee, rather than guessing. It is also, uncomfortably, the document that shows your published time-to-revoke of sixty seconds applies to eighty percent of traffic and not to the reporting tool that holds all the customer data."
            },
            {
              kind: "code",
              title: "Containment sequence for a suspected session compromise",
              lang: "bash",
              body: "set -euo pipefail\nUSER_ID=$1\nREASON=$2\n\necho 'step 1: disable the principal at the source of truth'\nidpctl user disable --id $USER_ID --reason $REASON\n\necho 'step 2: revoke sessions and refresh grants, not just the password'\nidpctl sessions revoke --user $USER_ID --all\nidpctl tokens revoke --user $USER_ID --type refresh\nidpctl tokens revoke --user $USER_ID --type access\n\necho 'step 3: revoke third-party OAuth grants the user consented to'\nidpctl oauth grants list --user $USER_ID --format json > grants-$USER_ID.json\nidpctl oauth grants revoke --user $USER_ID --all\n\necho 'step 4: emit the shared signal so downstream receivers act'\nssfctl event publish \\\n  --type https://schemas.openid.net/secevent/caep/event-type/session-revoked \\\n  --subject-format iss_sub \\\n  --subject $USER_ID \\\n  --reason-admin $REASON\n\necho 'step 5: revoke device credentials, not only user credentials'\nmdmctl device list --user $USER_ID --format json > devices-$USER_ID.json\nmdmctl cert revoke --user $USER_ID --all\n\necho 'step 6: verify, do not assume'\nfor svc in proxy warehouse crm repo ci; do\n  echo checking $svc\n  authprobe --service $svc --subject $USER_ID --expect deny --timeout 30\ndone\n"
            },
            {
              kind: "checklist",
              title: "What to verify in your own environment this week",
              items: [
                "Disable a test user and measure, with timestamps, how long each enforcement point takes to deny. Record the real number, not the configured one.",
                "Confirm that revoking the password does not leave refresh tokens valid. In most identity providers, by default, it does.",
                "Enumerate third-party OAuth grants for one user and confirm your offboarding automation revokes them. This is the most commonly missed step in the industry.",
                "Confirm that a device certificate revocation is actually consulted by the proxy, and find out whether it uses a CRL with a cache and what that cache lifetime is.",
                "Find at least one system that validates a signed token offline and cannot be told to stop trusting it. Write it into the gap list with a compensating control.",
                "Test what happens to the enforcement path when the policy engine is unreachable, and confirm the behaviour is the one you chose rather than the one the vendor shipped."
              ]
            },
            {
              kind: "callout",
              title: "The cheapest large win",
              body: "Cut refresh token lifetimes for privileged applications and require re-authentication with a phishing-resistant factor for privilege elevation. It costs a policy change and a week of complaints, and it converts an indefinite stolen session into a bounded one. Do this before you buy anything."
            }
          ],
          awards: ["aw-revocation-budget", "aw-continuous-eval"],
          glossary: ["shared-signals-framework", "caep", "refresh-token", "token-introspection", "time-to-revoke"]
        },
        {
          id: "ch-identity-p3-s4",
          kind: "lab",
          title: "Kill Secret Zero with Attestation",
          statement: "Every secrets manager answers the question of how a workload gets its secrets and creates the question of how it authenticates to get them; attestation is the only answer that does not simply move the problem.",
          minutes: 40,
          respect: 185,
          trust: 11,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "Secret zero is the bootstrap credential a workload needs in order to fetch its real credentials. Teams solve it by baking a token into an image, mounting it from a file, or passing it as an environment variable — all of which mean a copy of that token exists somewhere durable, is readable by anything that can read the process environment, and rarely expires. SPIFFE takes a different route: identity is not something you hand the workload, it is something the platform proves about the workload. A SPIRE agent on the node attests the node to the server, then attests each workload locally by inspecting properties the workload cannot fabricate about itself, and issues a short-lived credential over a local socket that requires no credential to call."
            },
            {
              kind: "list",
              title: "The concepts, precisely",
              items: [
                "A SPIFFE ID is a URI of the form spiffe://trust-domain/path, for example spiffe://acme.io/ns/payments/sa/ledger. It names a workload, not a machine and not a human.",
                "A trust domain is the root of trust, typically one per security environment. Production and staging should not share one.",
                "An SVID is the document that proves the ID. X509-SVID is a short-lived certificate with a private key; JWT-SVID is a token.",
                "The project prefers X509-SVID because tokens replay: anyone who intercepts a JWT-SVID in transit can present it, whereas a certificate binds to a channel through the TLS handshake. Use JWT-SVID only where an L7 proxy makes mutual TLS impossible, and keep its lifetime short.",
                "The Workload API is a local socket. The act of calling it from a specific process on a specific node, combined with OS-level attestation of that process, is the proof of identity. There is no bootstrap secret to steal.",
                "Rotation is automatic and frequent. A stolen SVID has a lifetime measured in minutes to an hour, which converts credential theft from a persistent foothold into a race."
              ]
            },
            {
              kind: "code",
              title: "Registration entries are where the security actually lives",
              lang: "bash",
              body: "spire-server entry create \\\n  -parentID spiffe://acme.io/spire/agent/k8s_psat/prod-eu/node-7 \\\n  -spiffeID spiffe://acme.io/ns/payments/sa/ledger \\\n  -selector k8s:ns:payments \\\n  -selector k8s:sa:ledger \\\n  -selector k8s:container-image:registry.acme.io/ledger@sha256:9f2c1a \\\n  -x509SVIDTTL 3600 \\\n  -dnsName ledger.payments.svc\n\nspire-server entry show -spiffeID spiffe://acme.io/ns/payments/sa/ledger\n\nspire-agent api fetch x509 -socketPath /run/spire/sockets/agent.sock -write /tmp/svid\n\nopenssl x509 -in /tmp/svid/svid.0.pem -noout -text | grep -A2 'Subject Alternative Name'\nopenssl x509 -in /tmp/svid/svid.0.pem -noout -dates\n"
            },
            {
              kind: "prose",
              title: "The selector is the control, and it is where teams get lazy",
              body: "An entry selected only on Kubernetes namespace means any workload in that namespace can obtain that identity, which in a shared namespace is close to no control at all. Selecting on namespace plus service account is better. Selecting additionally on the container image digest ties the identity to a specific artefact, which is what lets you say that only this build, from this pipeline, can talk to the ledger. That last selector is also the one that breaks deployments when the digest changes, which is why teams remove it. Removing it is the moment the system stops being workload identity and becomes namespace identity. If you take one thing from this lab, take this: review registration entry selectors the way you would review firewall rules, because that is what they are."
            },
            {
              kind: "code",
              title: "Federating workload identity out to a cloud provider so no static key exists",
              lang: "bash",
              body: "aws iam create-open-id-connect-provider \\\n  --url https://oidc.acme.io/prod \\\n  --client-id-list sts.amazonaws.com \\\n  --thumbprint-list 9e99a48a9960b14926bb7f3b02e22da2b0ab7280\n\naws sts assume-role-with-web-identity \\\n  --role-arn arn:aws:iam::111122223333:role/ledger-writer \\\n  --role-session-name ledger \\\n  --web-identity-token file:///run/spire/jwt/svid.token \\\n  --duration-seconds 900\n\naws cloudtrail lookup-events \\\n  --lookup-attributes AttributeKey=EventName,AttributeValue=AssumeRoleWithWebIdentity \\\n  --max-results 20\n"
            },
            {
              kind: "checklist",
              title: "Completion bar",
              items: [
                "You can articulate what an attacker who fully compromises one pod obtains, and for how long it is useful.",
                "Your registration entries include an artefact-level selector for at least one production service, and you have documented what happens at deploy time.",
                "You have proven that a workload in a different namespace cannot obtain the identity, by trying it.",
                "You have replaced at least one long-lived static cloud credential with a federated, attestation-derived one, and confirmed the old credential is deleted rather than merely unused.",
                "You know what happens to running workloads if the SPIRE server is unavailable, and for how long existing SVIDs remain valid.",
                "You can explain to a platform engineer why this is less operational burden than rotating static secrets, using their own incident history as evidence."
              ]
            }
          ],
          awards: ["aw-secret-zero-slain", "aw-workload-identity"],
          glossary: ["secret-zero", "spiffe-id", "svid", "node-attestation", "workload-attestation", "trust-domain"]
        },
        {
          id: "ch-identity-p3-s5",
          kind: "drill",
          title: "The Session That Would Not Die",
          statement: "Disabling an account is a statement of intent; revoking every artefact that account minted is the actual control.",
          minutes: 24,
          respect: 150,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Termination for cause is the cleanest test of an identity programme because the adversary is known, motivated, informed, and operating on a clock you set. It is also where the difference between disabling and revoking becomes expensive. Access tokens outlive account state. Refresh tokens outlive password changes. Third-party OAuth grants outlive both. Device certificates outlive all of it. MITRE catalogues the technique as steal application access token, and it is not exotic; it is the default behaviour of the protocols you deployed."
            },
            {
              kind: "list",
              title: "Artefacts that survive a naive disable",
              items: [
                "Issued access tokens until natural expiry, at every resource server that validates signatures offline.",
                "Refresh tokens held by desktop and mobile clients, and by any third-party app the user consented to.",
                "Application passwords and legacy protocol credentials, which frequently sit outside the main credential store.",
                "Personal access tokens in source control and CI, which are owned by the user but authenticate as the user.",
                "Device certificates and enrolled authenticators, which continue to satisfy device trust checks.",
                "Any long-lived cloud access key created by that user, which is a separate identity that does not reference their account state.",
                "Session cookies already present on a machine the organisation does not control."
              ]
            },
            {
              kind: "principle",
              title: "The Artefact Rule",
              body: "Offboarding is not an account operation, it is an artefact operation. Enumerate every credential and every token the identity ever minted or consented to, revoke each explicitly, and then verify by probing rather than by trusting the console's green checkmark."
            },
            {
              kind: "checklist",
              title: "The probe set every organisation should be able to run in under five minutes",
              items: [
                "Attempt an authenticated call to the primary data warehouse as the terminated identity and record the result and the latency.",
                "Attempt a git push and an API call to the source control platform using any personal access token belonging to that identity.",
                "Attempt to refresh an access token using a refresh token issued before the disable, and record whether a new token is issued.",
                "Query the cloud provider for access keys owned by that identity and confirm each is deactivated, not merely unused.",
                "Confirm the device certificate is revoked and that the access proxy consults revocation rather than caching validity."
              ]
            }
          ],
          drill: {
            id: "ch-identity-p3-s5-drill",
            scene: "16:00, a senior data engineer is terminated for cause. HR disables the account in the identity provider at 16:04. At 16:22 your data loss monitoring shows 40 GB moving from the analytics warehouse to a consumer cloud storage domain, authenticated by an OAuth application the engineer authorised eight months ago for a legitimate notebook integration. The application holds a refresh token. The warehouse validates tokens offline against the tenant signing key and does not call introspection.",
            clock: "Egress is running at roughly 900 MB per minute.",
            pressure: "Legal is on the bridge and wants preservation, not disruption. The warehouse is also serving three production pipelines that must not break. The engineer's laptop is not on your network and cannot be reached.",
            prompt: "What is your first action?",
            options: [
              {
                id: "ch-identity-p3-s5-o1",
                label: "Confirm the account is disabled, escalate to the warehouse team to investigate, and continue monitoring the egress for evidence",
                detail: "The account is already disabled. Preserve evidence and understand the scope before acting.",
                score: -3,
                outcome: "Egress continues for another nineteen minutes while the warehouse team is paged and briefed. Roughly 17 GB more leaves. The account being disabled has no effect at all, because the OAuth application is a separate principal holding its own grant.",
                ripple: "Your incident timeline will show that the organisation detected the exfiltration at 16:22 and stopped it at 16:41, and every regulator and customer will ask what happened in those nineteen minutes. Monitoring for evidence while data leaves is the single most common way a contained incident becomes a notifiable one.",
                isBest: false
              },
              {
                id: "ch-identity-p3-s5-o2",
                label: "Revoke the specific OAuth grant and its refresh token, force token revocation at the warehouse for that client, and simultaneously block the destination domain at the egress proxy while the revocation propagates",
                detail: "Cut the credential at the source and cut the path at the same time, because the warehouse validates offline and revocation will not be instant there.",
                score: 3,
                outcome: "The egress proxy block takes effect in under a minute and stops the flow. The grant revocation removes the refresh token so no new access token can be minted. The current access token remains technically valid at the warehouse until expiry, which you now know and have compensated for.",
                ripple: "The incident review has a clean answer to the hardest question: you understood that revocation was not instantaneous in that path and you compensated with a network control rather than assuming. That single decision becomes the template for your containment runbook, and the gap in the warehouse's offline validation becomes a funded piece of work rather than an argument.",
                isBest: true
              },
              {
                id: "ch-identity-p3-s5-o3",
                label: "Rotate the tenant token-signing key so that every token issued under it becomes invalid immediately",
                detail: "Comprehensive and immediate. Nothing signed by the old key will validate anywhere.",
                score: -2,
                outcome: "Every session for every user and every service in the tenant is invalidated at once. The egress does stop. So do the three production pipelines, the on-call team's own access to the tooling they need, and the incident bridge's authentication.",
                ripple: "You converted a targeted data theft into a tenant-wide outage during an active incident, and you did it with an action that is itself irreversible in the short term. Signing key rotation is a legitimate response to a suspected key compromise; using it as a session revocation mechanism is using a demolition charge to open a door. Expect the next incident to feature significant hesitation before anyone touches identity controls at all.",
                isBest: false
              },
              {
                id: "ch-identity-p3-s5-o4",
                label: "Suspend the warehouse service account used by the notebook integration and open a change request to remove the OAuth application",
                detail: "Target the effective permission at the data layer, and handle the application through change control.",
                score: -1,
                outcome: "The warehouse account suspension is applied at 16:34 after the on-call DBA is located. Egress stops. The OAuth application remains authorised and its refresh token remains valid.",
                ripple: "You have stopped this instance and left the mechanism intact. Two weeks later the same application is used against a different data source, and the second incident is much harder to explain because the first one is in your own ticket history. Routing an active containment action through change control is how organisations lose the second half of an incident.",
                isBest: false
              }
            ],
            debrief: "Option two is correct because it acts on both the credential and the path, and it does so because you understand the specific propagation characteristics of the systems involved. The insight that separates a senior responder here is knowing that the warehouse validates offline: that single fact means grant revocation, which is the right structural action, will not stop the bytes currently moving. So you take the structural action and a compensating network action together. Option one is the failure of the analyst mindset in an operational role — evidence is valuable, but data leaving the building is also evidence, and you can preserve logs while stopping flow. Option three is the trap for people who know the protocol well: it is genuinely effective and genuinely catastrophic, and the fact that it works is exactly why it is tempting at 16:22. Reserve signing key rotation for suspected key compromise, and note that if you had needed it, the fact that it causes a tenant-wide outage is itself a finding about your architecture. Option four is the most institutionally plausible wrong answer, because in most organisations it is what actually happens: a targeted fix goes in, and the mechanism is left for a change window that arrives after the next incident. The broader lesson is the Artefact Rule. The account was disabled within four minutes and it did not matter, because the thing exfiltrating data was never authenticating as the account.",
            principle: "Contain the credential and the path simultaneously, and let your knowledge of each system's revocation latency decide which compensating control you need — never assume that disabling an identity revokes what that identity issued."
          },
          awards: ["aw-artefact-revoker", "aw-containment-discipline"],
          glossary: ["oauth-grant", "offline-token-validation", "egress-control", "containment-runbook"]
        }
      ]
    },
    {
      id: "ch-identity-p4",
      title: "PAGE IV — THE CIPHER DISCIPLINE",
      credential: "Certified in Applied Cryptography for Production Systems",
      summary: "What authenticated encryption actually guarantees and what it silently does not, why nonce reuse is a total collapse, how to build a key hierarchy that can be rotated without a data migration, and how to plan a post-quantum transition using evidence rather than vendor urgency.",
      competencies: [
        "State the precise security property of an AEAD scheme and identify what it leaves to the application",
        "Recognise and prevent nonce management failures across distributed writers",
        "Design a KEK and DEK hierarchy with an authenticated encryption context and a real rotation story",
        "Distinguish rotating a key from re-encrypting data, and choose correctly under incident conditions",
        "Build a cryptographic inventory and a defensible post-quantum migration sequence"
      ],
      seal: "SEAL OF THE FOURTH GATE",
      steps: [
        {
          id: "ch-identity-p4-s1",
          kind: "construct",
          title: "What AEAD Promises, and What It Quietly Does Not",
          statement: "Authenticated encryption gives you confidentiality and integrity of a message; every other property you assumed you were getting is your job.",
          minutes: 22,
          respect: 75,
          trust: 3,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "An AEAD scheme takes a key, a nonce, a plaintext and some associated data, and produces a ciphertext and a tag. It guarantees that an adversary without the key learns nothing about the plaintext beyond its length, and cannot produce a ciphertext and tag pair that decrypts successfully. That is the entire promise. It is a strong promise and it is narrower than most engineers assume, and nearly every real cryptographic failure lives in the gap between the promise and the assumption."
            },
            {
              kind: "compare",
              title: "The promise versus the assumption",
              left: {
                title: "What AEAD gives you",
                items: [
                  "Confidentiality of the plaintext against an adversary without the key",
                  "Integrity and authenticity of the ciphertext, associated data and tag as a unit",
                  "Detection of any modification, including bit flips in the associated data",
                  "A clean failure: decryption returns an error rather than garbage plaintext",
                  "All of the above only under the condition that the nonce is never repeated for a given key"
                ]
              },
              right: {
                title: "What you still have to build",
                items: [
                  "Freshness. A valid old ciphertext replayed is still valid; bind a sequence number or timestamp into the associated data",
                  "Binding to context. Ciphertext for tenant A decrypts fine if moved to tenant B's record unless the tenant identifier is in the associated data",
                  "Length hiding. Message and record sizes leak; pad if the size is meaningful",
                  "Key separation. One key used for two purposes creates cross-protocol attacks; derive per-purpose subkeys",
                  "Ordering and deletion detection. AEAD says this message is authentic, never these are all the messages, in order"
                ]
              }
            },
            {
              kind: "list",
              title: "The associated data field is the most underused tool in applied cryptography",
              items: [
                "It is authenticated but not encrypted, which makes it the correct place for routing metadata that must be visible and must not be tampered with.",
                "Bind the tenant identifier, the record identifier, the field name, the schema version and the key identifier into it. Then a ciphertext lifted from one row cannot be pasted into another.",
                "AWS KMS exposes exactly this as the encryption context, and requires the same context on decrypt. It also appears in CloudTrail, which makes it a free audit dimension.",
                "The cost is that changing your context format is a breaking change for existing ciphertext, so version it from the first day.",
                "Teams that skip it discover the gap during a penetration test, when the tester swaps two encrypted records and both decrypt successfully."
              ]
            },
            {
              kind: "table",
              title: "Choosing a scheme, with the reason rather than the fashion",
              headers: ["Scheme", "Nonce", "Choose when", "Watch out for"],
              rows: [
                ["AES-GCM", "96-bit, must never repeat per key", "Hardware AES is available and you fully control nonce generation", "Random 96-bit nonces have a birthday bound; the practical message limit per key is large but finite, and counters shared across replicas collide"],
                ["ChaCha20-Poly1305", "96-bit, must never repeat per key", "No AES hardware acceleration, or you want constant-time software by construction", "Same nonce discipline as GCM; no misuse resistance"],
                ["XChaCha20-Poly1305", "192-bit, random is safe", "You cannot coordinate a counter across writers", "Not a NIST-approved primitive, which matters in some regulated contexts"],
                ["AES-GCM-SIV", "96-bit, repetition degrades rather than destroys", "Distributed writers, or any design where you cannot prove uniqueness", "Slower; repeated nonce with repeated plaintext still reveals equality of plaintexts"],
                ["AES-CBC plus separate HMAC", "IV, random", "Legacy interoperability only", "Encrypt-then-MAC ordering must be correct, and getting it wrong is how padding oracle bugs are born. Do not build new systems on this"]
              ]
            },
            {
              kind: "principle",
              title: "The Gap Law",
              body: "Cryptographic primitives are almost never broken in production. The protocol built around them is. Before choosing an algorithm, write down every property you are relying on, then mark which ones the primitive actually provides. The unmarked ones are your design work."
            },
            {
              kind: "callout",
              title: "One sentence to bring to every design review",
              body: "Ask: what is in the associated data? If the answer is nothing, the design has no binding between ciphertext and context, and somewhere in that system a ciphertext can be moved and will still decrypt."
            }
          ],
          awards: ["aw-aead-precise"],
          glossary: ["aead", "associated-data", "encryption-context", "nonce-misuse-resistance", "key-separation"]
        },
        {
          id: "ch-identity-p4-s2",
          kind: "lesson",
          title: "Nonce Reuse Is Not a Weakening, It Is a Collapse",
          statement: "Repeat a nonce under an AES-GCM key once and you have not lowered the security margin; you have given away the authentication key and every plaintext relationship in that pair.",
          minutes: 30,
          respect: 155,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Most cryptographic misuse produces gradual degradation. Nonce reuse in a counter-mode AEAD does not. If two messages are encrypted under the same key and the same nonce, the same keystream is used twice, so the exclusive-or of the two ciphertexts equals the exclusive-or of the two plaintexts. An adversary who knows or can guess one plaintext obtains the other immediately. That is the confidentiality half, and it is the less serious half. The integrity half is worse: GCM's authentication is a polynomial evaluation over a field with the authentication key H as the variable, and two tags produced under the same nonce give the adversary a polynomial whose roots include H. Recovering H means the adversary can forge valid tags for arbitrary messages under that key, indefinitely, without ever recovering the encryption key."
            },
            {
              kind: "prose",
              title: "It is not theoretical, and that is the point",
              body: "Böck, Zauner, Devlin and Somorovsky presented this at USENIX WOOT in 2016 after scanning the public internet for TLS servers repeating GCM nonces. They found them, in shipped products from real vendors, recovered authentication keys, and demonstrated forgery. The bugs were not in AES or in GCM. They were in nonce generation: broken random sources, counters that reset on process restart, and implementations that derived a nonce from a value that was not actually unique. The lesson to internalise is that nonce uniqueness is a distributed systems property, and distributed systems properties fail under exactly the conditions where you are least able to observe them."
            },
            {
              kind: "list",
              title: "The specific ways a nonce repeats in real systems",
              items: [
                "A counter stored in memory, and the process restarts. The counter starts at zero again under the same key.",
                "A counter per key, and the key is loaded into three replicas that each maintain their own counter. All three write nonce one.",
                "A virtual machine snapshot is restored, replaying the counter and the random number generator state together.",
                "Random 96-bit nonces at very high message volume. The birthday bound is real: at roughly 2 to the 32 messages under one key the collision probability is no longer negligible, which sounds enormous until a high-throughput service reaches it in a week.",
                "A nonce derived from a timestamp with second granularity on a system that writes more than once per second.",
                "A nonce derived from a request identifier that turns out to be reused across a retry.",
                "A key copied between environments so that test and production share a key while maintaining independent counters."
              ]
            },
            {
              kind: "code",
              title: "Two patterns: one that fails, one that does not",
              lang: "python",
              body: "import os\nimport struct\nfrom cryptography.hazmat.primitives.ciphers.aead import AESGCM\n\n# FAILS in production. The counter is per-process, the key is shared.\nclass NaiveWriter:\n    def __init__(self, key: bytes):\n        self.aead = AESGCM(key)\n        self.counter = 0\n\n    def seal(self, plaintext: bytes, aad: bytes) -> bytes:\n        self.counter += 1\n        nonce = struct.pack('>IQ', 0, self.counter)\n        return nonce + self.aead.encrypt(nonce, plaintext, aad)\n\n\n# SAFE. A fresh data key per object removes the coordination problem entirely.\n# The nonce is only ever used once because the key is only ever used once.\nclass PerObjectKeyWriter:\n    def __init__(self, kms_client, kek_id: str):\n        self.kms = kms_client\n        self.kek_id = kek_id\n\n    def seal(self, plaintext: bytes, context: dict) -> dict:\n        resp = self.kms.generate_data_key(\n            KeyId=self.kek_id,\n            KeySpec='AES_256',\n            EncryptionContext=context,\n        )\n        data_key = resp['Plaintext']\n        wrapped = resp['CiphertextBlob']\n        try:\n            nonce = os.urandom(12)\n            aad = canonical_context_bytes(context)\n            ciphertext = AESGCM(data_key).encrypt(nonce, plaintext, aad)\n        finally:\n            del data_key\n        return {\n            'wrapped_key': wrapped,\n            'nonce': nonce,\n            'ciphertext': ciphertext,\n            'context': context,\n            'scheme': 'aes-256-gcm/v3',\n        }\n"
            },
            {
              kind: "principle",
              title: "The Uniqueness Burden",
              body: "Never make nonce uniqueness a coordination problem across processes. Either use a scheme where random nonces are safe at your volume, or reduce the number of messages per key until uniqueness is trivially guaranteed. A fresh data key per object is the cheapest correct answer available to most systems, and its real cost is a KMS call you were probably already making."
            },
            {
              kind: "metric",
              title: "Practical limits worth knowing rather than deriving at 02:00",
              items: [
                "AES-GCM with random 96-bit nonces: keep messages per key well below the birthday bound region. If you cannot bound message count per key, do not use random GCM nonces.",
                "AES-GCM plaintext length per message is bounded by the counter construction at just under 64 GiB. Streaming large objects requires chunking with distinct nonces, and the chunking scheme itself must prevent reordering and truncation.",
                "AES-GCM-SIV: nonce repetition leaks only whether two identical plaintexts were encrypted under the same nonce, which is a survivable failure rather than a total one.",
                "XChaCha20-Poly1305: 192-bit nonce means random generation is safe without volume analysis, which is why it is popular in systems with many uncoordinated writers."
              ],
              source: "NIST SP 800-38D and the AEAD scheme specifications"
            },
            {
              kind: "callout",
              title: "How to find this bug in a code review in ninety seconds",
              body: "Search the codebase for where nonces or initialisation vectors are constructed. If the construction involves a counter, ask how many processes hold the key. If it involves a timestamp, ask the maximum write rate. If it involves a random source, ask how many messages will ever be written under one key. Three questions, and they find nearly every instance."
            }
          ],
          awards: ["aw-nonce-discipline", "aw-crypto-reviewer"],
          glossary: ["forbidden-attack", "keystream-reuse", "authentication-key-h", "birthday-bound", "per-object-key", "csprng"]
        },
        {
          id: "ch-identity-p4-s3",
          kind: "lab",
          title: "A Key Hierarchy That Can Actually Be Rotated",
          statement: "Design the hierarchy so that rotation is a metadata change for almost everything and a re-encryption job for almost nothing.",
          minutes: 40,
          respect: 180,
          trust: 10,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "Envelope encryption exists because the two things you want from a key are in tension. You want the key that protects data to be used rarely and stored in hardware, and you want encryption to be fast and local. The resolution is a hierarchy: a key encryption key that lives in an HSM and never leaves it, and data encryption keys generated per object, per record or per tenant, used locally and stored wrapped alongside the ciphertext they protect. AWS KMS publishes its own hierarchy in the Cryptographic Details document — domain keys rotated daily in HSM memory, HSM backing keys rotated yearly, derived encryption keys used once per encryption — and it is worth reading precisely because it makes the layering concrete."
            },
            {
              kind: "code",
              title: "The operations, with the encryption context doing real work",
              lang: "bash",
              body: "aws kms create-key \\\n  --description 'tenant-4417 KEK, pii scope' \\\n  --key-usage ENCRYPT_DECRYPT \\\n  --key-spec SYMMETRIC_DEFAULT \\\n  --multi-region false\n\naws kms create-alias --alias-name alias/tenant-4417-pii --target-key-id $KEY_ID\n\naws kms generate-data-key \\\n  --key-id alias/tenant-4417-pii \\\n  --key-spec AES_256 \\\n  --encryption-context tenant=4417,scope=pii,schema=v3,field=national_id\n\naws kms decrypt \\\n  --ciphertext-blob fileb://wrapped.key \\\n  --encryption-context tenant=4417,scope=pii,schema=v3,field=national_id\n\naws kms enable-key-rotation --key-id $KEY_ID --rotation-period-in-days 180\n\naws kms list-key-rotations --key-id $KEY_ID\n\naws cloudtrail lookup-events \\\n  --lookup-attributes AttributeKey=ResourceName,AttributeValue=$KEY_ARN \\\n  --max-results 50\n"
            },
            {
              kind: "prose",
              title: "The thing about automatic rotation that surprises people",
              body: "Enabling automatic rotation on a KMS key creates new key material and makes it active for new encryption. It does not re-encrypt anything. Every existing ciphertext remains decryptable because the old backing key material is retained and selected automatically by the key identifier embedded in the ciphertext. This is the correct engineering tradeoff and it is also why automatic rotation provides much less than most compliance narratives claim. If your threat model is that the key material was exposed, retaining the old material means rotation has not removed the exposure for any existing data. Rotation limits the amount of data encrypted under any single key version. Removing exposure requires re-encryption, and re-encryption requires that you can find every ciphertext, which is a data engineering problem you should solve before you need it."
            },
            {
              kind: "table",
              title: "Rotation decisions, stated in terms of what actually changes",
              headers: ["Situation", "Rotate KEK", "Rotate DEKs", "Re-encrypt data", "Why"],
              rows: [
                ["Routine hygiene and compliance cadence", "Yes", "No", "No", "Bounds the data volume under one key version at negligible cost"],
                ["Employee with KMS decrypt permission departs", "No", "No", "No", "This is an access control change, not a key change. Remove the grant and audit usage"],
                ["A wrapped DEK leaked but the KEK is intact", "No", "Yes for affected objects", "Yes for affected objects", "The wrapped key is useless without the KEK, but assume the attacker also obtained plaintext at some point"],
                ["Plaintext DEK observed in a log or crash dump", "No", "Yes", "Yes, for everything that DEK protected", "The data under that DEK is compromised regardless of what you do to the KEK"],
                ["KEK material suspected exposed", "Yes, and disable the old version", "Yes", "Yes, all of it", "This is the expensive case, and the only way to be ready for it is to have practised finding all ciphertext"],
                ["Nonce reuse detected under a DEK", "No", "Yes", "Yes", "Both confidentiality and forgeability are lost for that key; existing ciphertext must be treated as untrusted"]
              ]
            },
            {
              kind: "code",
              title: "Data key caching, and the safety rail people forget",
              lang: "python",
              body: "from aws_encryption_sdk.caches.local import LocalCryptoMaterialsCache\nfrom aws_encryption_sdk.materials_managers.caching import CachingCryptoMaterialsManager\n\ncache = LocalCryptoMaterialsCache(capacity=200)\n\ncaching_cmm = CachingCryptoMaterialsManager(\n    master_key_provider=kms_provider,\n    cache=cache,\n    max_age=300.0,\n    max_messages_encrypted=4096,\n    max_bytes_encrypted=1024 * 1024 * 1024,\n    partition_name='ledger-writer-eu',\n)\n"
            },
            {
              kind: "prose",
              title: "Read those three limits as a security policy, not a performance setting",
              body: "Caching a data key trades key hygiene for cost and latency, and the three limits are exactly the dials of that trade. Maximum age bounds how long a compromised process holds a usable key. Maximum messages bounds how much data a single key version protects, which is also your nonce-collision headroom. Maximum bytes bounds the value of a single key to an attacker. The partition name matters because sharing a cache across tenants would let one tenant's key be used for another's data, which is a confused deputy wearing a performance optimisation. Teams routinely set max_age to an hour because latency looked better, without recording that they extended the useful life of a stolen in-memory key by a factor of twelve."
            },
            {
              kind: "checklist",
              title: "Lab completion bar",
              items: [
                "You have encrypted an object with an encryption context and proven that decryption fails when any context value is altered.",
                "You have found the encryption context in CloudTrail and can explain why that makes it an audit dimension.",
                "You have enabled rotation and demonstrated that ciphertext written before rotation still decrypts, and can explain exactly why.",
                "You can state where in your own system a plaintext data key exists in memory, for how long, and what would place it in a crash dump.",
                "You have written the re-encryption plan for one dataset, including how you would enumerate every ciphertext, and you have estimated the runtime.",
                "You have set caching limits deliberately and documented the security reasoning for each of the three values."
              ]
            }
          ],
          awards: ["aw-envelope-architect", "aw-rotation-real"],
          glossary: ["envelope-encryption", "key-encryption-key", "data-encryption-key", "data-key-caching", "re-encryption"]
        },
        {
          id: "ch-identity-p4-s4",
          kind: "drill",
          title: "Rotate the Key, or Rotate the Data",
          statement: "Under pressure, teams reach for the rotation that is easy rather than the one that removes the exposure — and the two are almost never the same.",
          minutes: 24,
          respect: 160,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "This drill exists because rotate the key is the phrase everyone reaches for when cryptographic material is implicated, and it is frequently the wrong action, or the right action applied at the wrong level of the hierarchy. Being precise about which key, and about whether the data must move, is the difference between an incident that closes in a week and one that is reopened by an auditor two years later."
            },
            {
              kind: "list",
              title: "Ask these four questions before touching anything",
              items: [
                "Which key in the hierarchy is implicated: the KEK in hardware, or a data key that existed in process memory?",
                "Is the exposure prospective only, or does it apply retroactively to data already written?",
                "Is confidentiality lost, integrity lost, or both? Nonce reuse loses both, and the integrity loss means existing ciphertext can be forged, not merely read.",
                "Can you enumerate every ciphertext protected by the implicated key? If not, that is your first engineering task and it is not optional."
              ]
            },
            {
              kind: "principle",
              title: "The Level Rule",
              body: "Rotate at the level where the exposure occurred, and re-encrypt everything below it. Rotating a key higher in the hierarchy than the exposure feels thorough and changes nothing about the compromised material."
            },
            {
              kind: "callout",
              title: "The tell that you are about to make the wrong call",
              body: "If the proposed action can be completed in an afternoon and produces a clean audit entry, check whether it touches the material that was actually exposed. Cryptographic remediation that is both cheap and auditable is usually remediation of the wrong layer, because the expensive part of a key compromise is always the data, never the key."
            }
          ],
          drill: {
            id: "ch-identity-p4-s4-drill",
            scene: "A platform engineer opens a ticket at 11:15: the document storage service has been running three replicas that each independently initialise a 64-bit nonce counter from zero, and all three share a single AES-256-GCM data key that was generated eleven months ago and cached with no age limit. Roughly 41 million documents have been written. Sampling confirms nonce collisions across replicas. The key is wrapped under a KMS key encryption key that has never been exposed.",
            clock: "The service is live and writing about 900 documents per minute.",
            pressure: "The documents include customer contracts subject to a regulatory integrity requirement. Legal wants to know within the day whether stored documents can be considered tamper-evident. The storage team has never run a bulk re-encryption.",
            prompt: "What do you direct the team to do?",
            options: [
              {
                id: "ch-identity-p4-s4-o1",
                label: "Switch nonce generation to 96-bit random values immediately and keep using the existing data key",
                detail: "Fixes the collision source at once with a one-line change, no data migration, no downtime.",
                score: -3,
                outcome: "New writes stop colliding. The existing key remains in use, and it is a key whose authentication subkey an adversary with access to two same-nonce ciphertexts can already recover.",
                ripple: "You have fixed the symptom and preserved the compromise. Every document ever written under that key, including all future ones, remains forgeable by anyone who obtained a colliding pair. When legal asks whether stored contracts are tamper-evident, the honest answer is now no, and it will remain no for as long as this key is in use. Also note the second bug you did not fix: 96-bit random nonces at 900 writes per minute under a single long-lived key is a birthday problem you have merely deferred.",
                isBest: false
              },
              {
                id: "ch-identity-p4-s4-o2",
                label: "Rotate the KMS key encryption key and re-wrap the data key under the new KEK",
                detail: "Rotation at the KMS layer is a supported operation, is fast, is auditable, and produces a clean rotation record for compliance.",
                score: -2,
                outcome: "The wrapped key blob changes. The data key itself is byte-for-byte identical, and every collision, every recoverable authentication subkey and every forgeable document is exactly as it was fifteen minutes ago.",
                ripple: "This is the most dangerous option in the set, because it produces an artefact — a rotation event in CloudTrail with a timestamp — that looks like remediation to everyone who was not in the room. Someone will cite it in an audit response. Rotating a key that wraps a compromised key changes the wrapping, not the compromise.",
                isBest: false
              },
              {
                id: "ch-identity-p4-s4-o3",
                label: "Treat the data key as fully compromised: stop writes under it, move to a per-object data key with a fresh nonce per key, re-encrypt the corpus under new keys, and independently re-establish integrity for existing documents rather than relying on their existing tags",
                detail: "Accept that both confidentiality and integrity are gone for the affected corpus, and rebuild both rather than patching the writer.",
                score: 3,
                outcome: "Writes cut over to per-object keys within the hour, which removes the coordination problem permanently rather than moving it. A re-encryption job runs over 41 million documents. Because the existing GCM tags cannot be trusted, integrity for the historical corpus is re-established from an independent source — the storage layer's own content hashes and the immutable write-ahead log — and documented as such.",
                ripple: "Legal receives a precise answer: documents written before the cutover have tamper evidence derived from an independent integrity record rather than from their AEAD tags, and documents after the cutover have both. That precision is what survives a regulator's follow-up question. The per-object key design also removes the nonce coordination problem for every future service that copies this pattern, which turns an incident into a platform improvement.",
                isBest: true
              },
              {
                id: "ch-identity-p4-s4-o4",
                label: "Add a separate HMAC over each ciphertext using a new key, so integrity is restored without a full re-encryption",
                detail: "Cheaper than re-encrypting 41 million objects, restores tamper evidence going forward, and can be applied as a background job.",
                score: -1,
                outcome: "New tamper evidence exists from the moment the HMAC is applied. Confidentiality is not restored: any adversary who captured colliding ciphertext pairs can still recover plaintext relationships. And the HMAC attests only that the ciphertext has not changed since the HMAC was computed, which is after the compromise window.",
                ripple: "This is a genuinely clever answer and it is the one a strong engineer proposes at hour six when the re-encryption estimate comes back at nine days. It is worth having in the plan as a stopgap while re-encryption runs. It is not a substitute, and presenting it as one means signing your name to an integrity claim that begins after the exposure rather than covering it.",
                isBest: false
              }
            ],
            debrief: "Option three is correct because it matches the level of the response to the level of the exposure. The compromised material is the data key, so the data key and everything it protects must move. Two subtleties make this a senior answer rather than an obvious one. First, integrity: nonce reuse in GCM leaks the authentication subkey, which means existing tags are forgeable and therefore worthless as evidence. A team that only re-encrypts has restored confidentiality and quietly left a false integrity claim in place. Re-establishing integrity from an independent record, and being explicit that it is independent, is what makes the answer defensible to a regulator. Second, the design change: moving to per-object data keys does not just fix this instance, it removes the class of bug, because a key used once can never have a nonce reused under it. Option two deserves the most attention because it is the trap. It is a real operation, it produces a real audit artefact, and it accomplishes nothing — and precisely because it produces an artefact, it is the option most likely to be defended after the fact by people who need the incident to be over. Option one is the speed trap and option four is the cleverness trap; both are useful as components of a plan and fatal as the whole plan.",
            principle: "Match the remediation to the level of the hierarchy where the exposure occurred, and never let an action that produces a compliance artefact substitute for one that removes the compromise."
          },
          awards: ["aw-level-rule", "aw-integrity-honest"],
          glossary: ["key-hierarchy-level", "tamper-evidence", "bulk-re-encryption", "compensating-integrity"]
        },
        {
          id: "ch-identity-p4-s5",
          kind: "lesson",
          title: "Post-Quantum: Reason About It Like an Engineer, Not a Salesperson",
          statement: "The decision is not whether a quantum computer will break RSA; it is whether any data you encrypt today still needs to be secret in fifteen years, and whether you could find all of it if the answer is yes.",
          minutes: 32,
          respect: 145,
          trust: 7,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "NIST finalised the first post-quantum standards in August 2024: FIPS 203 for ML-KEM, the key encapsulation mechanism derived from CRYSTALS-Kyber; FIPS 204 for ML-DSA, the lattice signature scheme derived from CRYSTALS-Dilithium; and FIPS 205 for SLH-DSA, a stateless hash-based signature scheme held in reserve because its security rests on entirely different assumptions. NIST IR 8547 then set the transition expectation, moving RSA-2048 and ECC P-256 toward deprecation around 2030 and disallowed status by 2035. CNSA 2.0 binds national security systems on an earlier schedule, with new acquisitions expected to use ML-KEM-1024 and ML-DSA-87. If you supply those systems, your timeline is already set for you."
            },
            {
              kind: "prose",
              title: "The harvest-now-decrypt-later calculation, done properly",
              body: "Mosca's inequality is the only framing worth using. If the time your data must remain confidential, plus the time your organisation needs to migrate, exceeds the time until a cryptographically relevant quantum computer exists, you are already late. Notice that two of the three terms are entirely within your knowledge. You know how long a customer health record, a merger document, or a national identity number must stay secret. You know, or can find out, how long it takes your organisation to change a TLS configuration across every system including the embedded ones. Only the third term is uncertain, and the uncertainty is asymmetric: being early costs performance, being late costs data that was already stolen years ago and is sitting in someone's archive."
            },
            {
              kind: "table",
              title: "Where the urgency actually is, ranked",
              headers: ["Asset", "Exposed to harvest now", "Confidentiality lifetime", "Priority"],
              rows: [
                ["Long-lived confidential data crossing public networks: health records, genomic data, legal and diplomatic traffic", "Yes, in transit today", "Decades", "First. Deploy hybrid key exchange now"],
                ["VPN and site-to-site tunnels carrying bulk internal traffic", "Yes, high volume, easy to capture at a chokepoint", "Years", "First"],
                ["Data at rest encrypted with symmetric keys", "No, symmetric algorithms are not broken by Shor", "Any", "Low. AES-256 is fine; the risk is the asymmetric key that wraps it"],
                ["Code signing and firmware signing keys", "No harvesting benefit, but signature forgery is catastrophic and long-lived devices cannot be updated later", "Device lifetime, often 10 to 20 years", "High, and it is a hardware roadmap problem, not a software one"],
                ["Ordinary web session TLS", "Yes, but content has short value", "Minutes to hours", "Low urgency, but it is where hybrid deploys most easily, so it happens first in practice"],
                ["Certificate authority root keys and PKI hierarchies", "No harvesting benefit; migration lead time is enormous", "Decades", "High. The lead time is the risk, not the algorithm"]
              ]
            },
            {
              kind: "list",
              title: "Engineering realities to plan around",
              items: [
                "Hybrid key exchange is the sane default for transport: combine X25519 with ML-KEM-768 so the connection is at least as strong as the stronger of the two. Major browsers and TLS libraries have shipped this, and it is the single highest-value change available today.",
                "Post-quantum signatures are large. ML-DSA signatures and public keys are substantially bigger than ECDSA, which matters for certificate chains, for constrained devices and for any protocol with a size budget. Measure before you commit.",
                "Handshake size increases can push messages past network and middlebox assumptions. Expect a class of failures that look like network problems and are actually size problems.",
                "SLH-DSA is conservative and slow with large signatures, and it exists precisely so that a break in lattice assumptions does not leave you with nothing. Consider it for firmware signing where verification is infrequent and the device lifetime is long.",
                "Crypto-agility is the actual deliverable. Most organisations cannot answer which algorithm a given service negotiates, let alone change it. Build the inventory and the ability to change, and the algorithm choice becomes a configuration decision rather than a programme.",
                "Do not deploy a post-quantum algorithm alone in place of a classical one until the ecosystem has more operational history. Hybrid gives you the guarantee without betting the connection on a young implementation."
              ]
            },
            {
              kind: "principle",
              title: "The Mosca Frame",
              body: "Confidentiality lifetime plus migration time versus time to a capable adversary. Two of the three numbers are yours to measure. Any post-quantum conversation that starts with the third number is a sales conversation."
            },
            {
              kind: "callout",
              title: "What to say when an executive asks if you are quantum-ready",
              body: "Do not say yes and do not say no. Say: we have inventoried where public-key cryptography protects data with a confidentiality lifetime beyond 2035, that inventory covers this percentage of our estate, we have deployed hybrid key exchange on these paths, and our critical gap is here with this owner and this date. That answer is credible because it is falsifiable."
            }
          ],
          awards: ["aw-pq-ready", "aw-mosca-frame"],
          glossary: ["ml-kem", "ml-dsa", "slh-dsa", "hybrid-key-exchange", "harvest-now-decrypt-later", "crypto-agility"]
        },
        {
          id: "ch-identity-p4-s6",
          kind: "field",
          title: "Build a Cryptographic Bill of Materials",
          statement: "You cannot migrate, rotate or defend cryptography you cannot enumerate, and almost no organisation can enumerate theirs.",
          minutes: 40,
          respect: 195,
          trust: 11,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "A cryptographic bill of materials is the answer to a question every regulator, every post-quantum programme and every key compromise eventually asks: where is cryptography used, with which algorithms, protecting what, under whose keys, and who owns each instance. Building one is tedious and it is the artefact that turns cryptographic security from an opinion into an engineering discipline. It also happens to be the prerequisite for every other piece of work in this Page: you cannot re-encrypt what you cannot find, and you cannot plan a transition across an estate you have never counted."
            },
            {
              kind: "numbered",
              title: "How to build one without boiling the ocean",
              items: [
                "Bound the scope explicitly: one product, one business unit, or one data classification. Say so in the document. A complete narrow inventory is useful; an incomplete broad one is not.",
                "Collect from four sources and reconcile: dependency manifests and software composition scans for libraries; TLS and certificate scanning for what is actually negotiated on the wire; cloud key management inventories for managed keys; and code search for direct primitive usage, which is where the surprises live.",
                "For each instance record: purpose, algorithm and parameters, key length, key location and custody, key lifetime and rotation status, the data classification it protects, the confidentiality lifetime of that data, and a named owner.",
                "Flag every instance where the algorithm is deprecated, the key has never rotated, the custody is unclear, or the owner is a team that no longer exists. These four flags find most of the real risk.",
                "Compute the Mosca assessment per instance: confidentiality lifetime plus estimated migration time. Anything crossing 2035 goes on the post-quantum list with a date.",
                "Identify the instances that are hardest to change — embedded firmware, hardware security modules, partner integrations, anything with a certificate pinned in a mobile app — and start those first, because lead time is the binding constraint.",
                "Publish it somewhere it will be maintained, wired to a build-time check so that a new cryptographic dependency appears in the inventory automatically rather than by human diligence."
              ]
            },
            {
              kind: "checklist",
              title: "Evidence quality bar",
              items: [
                "Every row is sourced from a scan, an export or a code reference, never from a conversation.",
                "At least one instance was discovered that nobody on the team knew existed. If not, the scope was too narrow or the search was too shallow.",
                "Custody is recorded for every key, including the uncomfortable entries where custody is a file on a build server.",
                "The confidentiality lifetime column is populated by someone from the business, not guessed by an engineer.",
                "The document names the three instances that would take longest to change and explains why.",
                "There is an automated mechanism, however simple, that will cause the next new cryptographic dependency to appear in this inventory without anyone remembering to add it."
              ]
            },
            {
              kind: "callout",
              title: "The moment this artefact pays for itself",
              body: "It pays the first time a library advisory lands and someone asks whether you are affected. Organisations with a CBOM answer in an hour with a list of services and owners. Organisations without one spend a week producing an answer that is still a guess. That contrast is also the strongest argument you will ever make for funding the work."
            }
          ],
          praxis: "Build a cryptographic bill of materials for a bounded, named scope in a real system, reconciling at least three independent discovery sources. Record purpose, algorithm, key custody, rotation status, data classification, confidentiality lifetime and owner for every instance. Produce a Mosca assessment, identify the three hardest-to-change instances, and wire at least one automated check that keeps the inventory current.",
          evidence: "Attach the inventory itself with source citations per row, the reconciliation notes showing what each discovery method found that the others missed, the Mosca assessment with the post-quantum priority list and dates, and the configuration or pipeline change that keeps the inventory updated automatically. Include at least one instance you discovered that was previously unknown, with a note on how it was found.",
          awards: ["aw-cbom-builder", "aw-inventory-discipline"],
          glossary: ["cbom", "crypto-inventory", "confidentiality-lifetime", "software-composition-analysis"]
        }
      ]
    },
    {
      id: "ch-identity-p5",
      title: "PAGE V — CUSTODY",
      credential: "Certified in Key Custody, Threshold Signing and Cryptographic Incident Response",
      summary: "Custody as a systems problem: hardware boundaries, quorum and ceremony; threshold signatures and MPC and what they genuinely remove; seeds, hierarchical deterministic derivation and hardware wallet threat models; and how to run and communicate a key compromise without either minimising it or setting fire to the room.",
      competencies: [
        "Design custody for a high-value key including quorum, hardware boundary, ceremony and revocation",
        "Evaluate threshold signing and MPC honestly against their operational and audit costs",
        "Threat model a hardware signing device including supply chain, firmware and blind signing",
        "Run a key compromise investigation when the logs you need have already aged out",
        "Communicate a cryptographic compromise to executives, customers and regulators with precision"
      ],
      seal: "SEAL OF THE KEEPER",
      steps: [
        {
          id: "ch-identity-p5-s1",
          kind: "lesson",
          title: "Custody Is a Systems Problem, Not a Storage Problem",
          statement: "The question is never where is the key; it is who can cause it to be used, under what quorum, with what record, and how you would prove afterwards that only intended uses occurred.",
          minutes: 30,
          respect: 120,
          trust: 6,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "Ask a team where their signing key lives and they will name a technology: an HSM, a cloud KMS, a file with restrictive permissions. That answer describes storage, and storage is the least interesting part of custody. A key in an HSM that any of forty service accounts can invoke without a second approval and without a distinguishable audit record is less well protected than a key in a safe that requires two people and produces a signed log. Custody is the full set of conditions under which the key can produce output."
            },
            {
              kind: "table",
              title: "The custody questions, and what a weak answer sounds like",
              headers: ["Question", "Weak answer", "Strong answer"],
              rows: [
                ["Where does the private key exist in plaintext", "In the application when it needs to sign", "Never outside the hardware boundary; the application sends data and receives a signature"],
                ["Who can cause a signature", "The service account with the key policy", "A named quorum, or an automated path constrained by policy on what may be signed, with everything else requiring human approval"],
                ["What is the record of each use", "CloudTrail shows the API call", "The record includes what was signed, requested by whom, approved by whom, and correlates to a change or incident identifier"],
                ["How is the key rotated", "Automatic rotation is enabled", "There is a rehearsed procedure with a named quorum, a rollback, and a verification that the old key is no longer accepted anywhere"],
                ["How would you know if it were misused", "We would see unusual activity", "There is a specific detection: signatures outside expected volume, key identifiers not on the allowlist, or use outside the approved window"],
                ["How old is the key and who tracks that", "It has been fine so far", "Key age is a monitored metric with an alert threshold, because the failure mode is decay rather than a single event"]
              ]
            },
            {
              kind: "prose",
              title: "The last row is the Storm-0558 row",
              body: "The Cyber Safety Review Board found that Microsoft had stopped its manual rotation of consumer signing keys in 2021 after a rotation caused a major outage, and had no automated alerting on the age of active signing keys. A key issued in 2016 was still able to sign tokens years later. The board also found that a consumer key was accepted by systems validating enterprise tokens, and that detection came from a customer rather than from Microsoft. Read that as three separate custody failures compounding: no rotation, no age monitoring, and no scope validation on the key identifier. Any one of them alone would have been survivable."
            },
            {
              kind: "principle",
              title: "The Ceremony Principle",
              body: "For any key whose compromise is an organisation-level event, the operations that create, rotate, back up or destroy it must be ceremonies: scripted, multi-person, witnessed, recorded, and rehearsed. Ceremony is not theatre. It is the mechanism that makes an irreversible operation reviewable afterwards by someone who was not there."
            },
            {
              kind: "list",
              title: "What a real ceremony contains",
              items: [
                "A written script, reviewed in advance, that names every step and every participant by role.",
                "Separation of duties: the person who operates the hardware is not the person who authorises the operation is not the person who witnesses it.",
                "Tamper-evident handling of any physical material, with seal numbers recorded before and after.",
                "A recording or an independent witness whose only job is to observe and attest, ideally from outside the team that owns the key.",
                "A verification step at the end that proves the intended outcome occurred, not just that the steps were performed.",
                "An artefact: a signed attestation of what happened, stored where it will be found in five years by someone who was not present.",
                "A rehearsal cadence, because a ceremony performed for the first time during an incident is not a ceremony, it is an improvisation with witnesses."
              ]
            },
            {
              kind: "callout",
              title: "The public example worth studying",
              body: "The DNSSEC root key signing key ceremonies are livestreamed, scripted in public, witnessed by trusted community representatives, and produce published transcripts. Read one script end to end. You will not need that level of rigour, but seeing what maximal looks like calibrates what proportionate looks like for your own root of trust."
            }
          ],
          awards: ["aw-custody-designer"],
          glossary: ["key-ceremony", "separation-of-duties", "hardware-boundary", "key-age-monitoring", "quorum"]
        },
        {
          id: "ch-identity-p5-s2",
          kind: "lesson",
          title: "Threshold Signatures, MPC, and What They Actually Remove",
          statement: "Splitting a key removes the single point of compromise and replaces it with a protocol whose bugs are far harder to see than a missing lock.",
          minutes: 34,
          respect: 165,
          trust: 9,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "There are three commonly conflated techniques and the differences matter operationally. Shamir secret sharing splits a key into shares that must be recombined to use it, which means at the moment of use the whole key exists in one place — you have protected storage, not use. Threshold signatures let a subset of parties produce a valid signature without the private key ever being reconstructed anywhere. Multi-party computation is the broader family of protocols that make this possible, including distributed key generation so that the full key never existed even at creation. Choosing between them is choosing where you are willing to have a moment of concentration."
            },
            {
              kind: "compare",
              title: "What each approach genuinely buys and costs",
              left: {
                title: "Threshold or MPC signing",
                items: [
                  "The full private key never exists at any single point, including at generation if distributed key generation is used",
                  "Compromise of fewer than the threshold number of shares yields nothing usable",
                  "Signatures are indistinguishable from single-key signatures on-chain or on the wire, which preserves privacy and compatibility",
                  "Cost: the protocol is the attack surface. Nonce generation, share refresh and abort handling have all produced real vulnerabilities",
                  "Cost: auditability suffers because the policy lives in software rather than in an observable multi-signature record",
                  "Cost: very few people in your organisation will be able to review the implementation"
                ]
              },
              right: {
                title: "On-chain or protocol-level multi-signature and quorum HSMs",
                items: [
                  "Policy is explicit and externally verifiable: the record shows which keys signed",
                  "Each participant can use ordinary, well-reviewed hardware",
                  "Failure of one participant is visible and recoverable through an understood path",
                  "Cost: larger footprint, higher fees or overhead, and the signing set is public where that matters",
                  "Cost: changing the quorum is itself a privileged operation needing its own custody",
                  "Cost: slower, which pushes teams toward automation that erodes the human quorum"
                ]
              }
            },
            {
              kind: "prose",
              title: "The nonce problem returns, in a worse form",
              body: "Every ECDSA and Schnorr signature requires a per-signature secret nonce. If that nonce is reused across two signatures with the same key, the private key is recoverable with simple algebra — this is the failure that has emptied wallets and broken game consoles, and it is the same class of failure you studied in AEAD, appearing again at the signature layer. In a threshold protocol, nonce generation is distributed, which means it is now a protocol with multiple rounds, and biased or leaked nonce contributions can allow key extraction over many signatures. Research on covert nonce exfiltration has shown that a malicious or backdoored signing device can leak key material through the nonces of ordinary-looking valid signatures, recoverable by an attacker who observes only the signatures. This is why deterministic nonce derivation, anti-exfiltration protocols and audited implementations matter more than the elegance of the scheme."
            },
            {
              kind: "list",
              title: "Questions that separate a serious vendor from a demo",
              items: [
                "Is key generation distributed, or is a full key generated somewhere and then split? If the latter, name the moment and the machine.",
                "How are signing nonces generated, and what prevents a compromised participant from biasing or leaking them?",
                "Is there proactive share refresh, so that an attacker must compromise the threshold within one refresh period rather than accumulating shares over years?",
                "What happens when a participant is permanently lost? Show the recovery procedure and the last time it was rehearsed.",
                "Who has reviewed the implementation, is the review public, and what were the findings?",
                "What does the audit record contain, and can an auditor verify from it which parties approved a specific signature without trusting the vendor's own log?",
                "What is the failure mode if the coordination service is unavailable or malicious?"
              ]
            },
            {
              kind: "principle",
              title: "The Concentration Question",
              body: "Every custody design has a moment or a place where compromise is total. Find it and name it out loud. If a design claims not to have one, you have not found it yet — look at key generation, at recovery, at the coordinator, and at whoever can change the quorum."
            },
            {
              kind: "callout",
              title: "The organisational failure that outlives the cryptography",
              body: "Threshold custody usually fails socially rather than mathematically. Shares end up held by three people who sit on the same floor, or by three service accounts on the same orchestration platform, or by two humans and one automated signer that will approve anything. Diversity of custodians is the property that makes the threshold real, and it is the property that decays first because it is inconvenient."
            }
          ],
          awards: ["aw-threshold-honest", "aw-concentration-found"],
          glossary: ["threshold-signature", "distributed-key-generation", "shamir-secret-sharing", "proactive-share-refresh", "nonce-exfiltration"]
        },
        {
          id: "ch-identity-p5-s3",
          kind: "lab",
          title: "Seeds, Derivation and the Hardware Wallet Threat Model",
          statement: "A hardware signer protects the key from the host; it does not protect the human from signing the wrong thing, and that gap is where the money goes.",
          minutes: 38,
          respect: 180,
          trust: 10,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "Hierarchical deterministic derivation solved a real problem: one seed produces an unbounded tree of keys, so backup is a single artefact and address reuse is unnecessary. BIP-32 defines the derivation, BIP-39 defines the mnemonic encoding and the optional passphrase, and BIP-44 defines the path convention. The security consequences of that design are specific and worth stating: the seed is the entire wallet forever, hardened derivation exists because a non-hardened extended public key combined with any child private key reveals the parent private key, and the optional passphrase is not a password on the seed but an input that produces an entirely different wallet."
            },
            {
              kind: "code",
              title: "Derive on an air-gapped machine and verify the path semantics yourself",
              lang: "python",
              body: "from bip_utils import (\n    Bip39SeedGenerator,\n    Bip44,\n    Bip44Coins,\n    Bip44Changes,\n)\n\nmnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'\n\nseed = Bip39SeedGenerator(mnemonic).Generate(passphrase='')\nseed_with_pass = Bip39SeedGenerator(mnemonic).Generate(passphrase='second-wallet')\n\nprint('seeds differ:', seed != seed_with_pass)\n\nctx = Bip44.FromSeed(seed, Bip44Coins.BITCOIN)\nacct = ctx.Purpose().Coin().Account(0)\nchain = acct.Change(Bip44Changes.CHAIN_EXT)\n\nfor i in range(3):\n    addr_ctx = chain.AddressIndex(i)\n    print(i, addr_ctx.PublicKey().ToAddress())\n\nprint('account xpub:', acct.PublicKey().ToExtended())\nprint('note: this xpub reveals every future address in this account')\n"
            },
            {
              kind: "prose",
              title: "Three consequences engineers routinely miss",
              body: "First, an account-level extended public key is a privacy disclosure of the entire account's future address set, and combined with a single leaked child private key from non-hardened derivation it becomes a key disclosure. Treat an xpub as sensitive, not as a public identifier. Second, the BIP-39 passphrase creates a distinct wallet with no error signal: a typo does not fail, it silently opens an empty wallet, which is a usability property that has destroyed real funds. Third, the mnemonic word list is a checksum-protected encoding, not encryption. Anyone who reads the words has the wallet, which means the threat model for a piece of paper is now identical to the threat model for a key."
            },
            {
              kind: "table",
              title: "Hardware signer threat model, layer by layer",
              headers: ["Threat", "What the device does defend", "What it does not", "Practical control"],
              rows: [
                ["Compromised host computer", "Key never leaves the secure element; malware cannot read it", "Malware can alter what the host displays and what it asks you to sign", "Verify every detail on the device screen, never on the host. If the device has no screen, the host is your screen and you have no defence"],
                ["Blind signing of opaque payloads", "Nothing. The device signs what it is told", "Any complex transaction the device cannot parse into human-readable terms", "Refuse to sign what the device cannot display. This single rule prevents most large losses in practice"],
                ["Supply chain interdiction", "Genuine devices attest firmware authenticity at boot and on connection", "A device bought from a marketplace reseller, or one with a pre-printed recovery sheet in the box", "Buy direct, verify the attestation, always generate the seed yourself on the device, and treat any supplied seed as compromised"],
                ["Physical extraction", "Secure elements resist extraction and rate-limit PIN attempts", "A determined, funded laboratory attack on some models", "A BIP-39 passphrase held separately means physical possession alone is insufficient"],
                ["Malicious or backdoored firmware", "Signed firmware and verified boot on reputable devices", "A device whose randomness or nonce generation is subverted can leak key material through valid signatures", "Prefer devices with reproducible builds and published audits; consider multi-vendor quorum so no single firmware supply chain is decisive"],
                ["Coercion", "Nothing", "Nothing", "Passphrase-derived decoy wallets, geographic and custodial separation, and organisational policy that no single person can move value"]
              ]
            },
            {
              kind: "checklist",
              title: "Do these on real hardware you own",
              items: [
                "Generate a seed on the device itself and confirm the device never accepted a seed from the host.",
                "Verify the firmware attestation and record what the verification actually proves and what it does not.",
                "Derive the same first address on an air-gapped machine from the mnemonic and confirm it matches the device. This proves your backup is correct, which is the only test that matters.",
                "Add a passphrase, confirm it produces a different wallet, and then deliberately mistype it and observe that you get a third, empty wallet with no error.",
                "Attempt a transaction the device cannot fully display, and practise refusing it.",
                "Write the recovery procedure and have a colleague execute it from your written instructions alone, with you silent in the room. Almost every recovery document fails this test the first time."
              ]
            },
            {
              kind: "callout",
              title: "The organisational translation",
              body: "Everything in this step applies unchanged to enterprise signing keys. Blind signing is a code signing service that will sign any artefact submitted by CI. Supply chain interdiction is a build agent nobody has rebuilt in two years. The decoy wallet is your break-glass design. If you work only in enterprise contexts, do this lab anyway — the tactile version teaches the abstraction faster than any document."
            }
          ],
          awards: ["aw-seed-custody", "aw-blind-signing-refused"],
          glossary: ["bip32", "bip39-passphrase", "hardened-derivation", "extended-public-key", "blind-signing", "secure-element", "hd-wallet"]
        },
        {
          id: "ch-identity-p5-s4",
          kind: "drill",
          title: "The Signing Key in the Crash Dump",
          statement: "When the evidence you need aged out eighteen months ago, the professional move is to reason from consequence rather than to wait for a confirmation that will never arrive.",
          minutes: 26,
          respect: 175,
          trust: 10,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "This drill is modelled on the structure of the Storm-0558 investigation, which is the best-documented public example of a key compromise inside a competent, well-resourced organisation. The details are changed; the shape is not. Note in advance what made that case hard: the suspected exposure was old, the environment it moved into had shorter log retention than the investigation needed, and the public statements made early had to be corrected later."
            },
            {
              kind: "list",
              title: "What makes cryptographic incidents different from ordinary ones",
              items: [
                "The compromise is silent. A stolen key produces valid output, so there is no error, no failed login and no anomaly unless you built one deliberately.",
                "The blast radius is defined by what will accept the key's signature, which is frequently broader than the team that owns it believes.",
                "Retroactive scope is unbounded: every artefact ever signed by that key must be reconsidered, not just recent ones.",
                "Detection typically depends on evidence that predates your retention window, because key exposure and key exploitation are separated by months or years.",
                "The remediation is public in a way most incidents are not: revoking a signing key is visible to every relying party."
              ]
            },
            {
              kind: "principle",
              title: "The Silence Rule",
              body: "Build detection for the successful use of a key, not for its theft. Alert on signatures outside expected volume, on key identifiers not on an allowlist, and on tokens whose issuing key does not match the scope they claim. Theft leaves no trace; use always does."
            }
          ],
          drill: {
            id: "ch-identity-p5-s4-drill",
            scene: "You are incident lead. An engineer reviewing an old ticket finds that a process crash in a signing service, eighteen months ago, produced a memory dump that was moved to a lower-trust debugging environment so a vendor could analyse it. The crash occurred in the process that holds the token-signing key for your customer-facing authentication service. Log retention in the debugging environment is 90 days and the relevant period is long gone. Two engineers who had access to that environment have since left the company. There is no evidence of misuse, and no capability to look for it, because your resource servers validate token signatures offline and do not log the key identifier used.",
            clock: "The executive team has been informed and wants a position within four hours.",
            pressure: "Revoking the signing key will invalidate every active session for every customer. A customer conference is in progress. The general counsel has asked, in writing, what you can state as fact.",
            prompt: "What do you drive as the incident position?",
            options: [
              {
                id: "ch-identity-p5-s4-o1",
                label: "Rotate the signing key quietly during the next maintenance window and continue investigating without external communication",
                detail: "Reduces exposure without causing customer disruption or alarming anyone before the facts are established.",
                score: -2,
                outcome: "The key is rotated in nine days. During those nine days, and for the entire eighteen months before, any forged token signed by the old key remains valid at every resource server. Rotation without revocation does not invalidate the old key; it only stops issuing new tokens under it.",
                ripple: "Two problems compound. Operationally, you have confused rotation with revocation, which is the single most common technical error in key incidents. Organisationally, a decision to delay disclosure that was made informally at hour three will be examined later with the assumption that it was made to avoid embarrassment, whatever your actual reasoning. Both are avoidable.",
                isBest: false
              },
              {
                id: "ch-identity-p5-s4-o2",
                label: "Wait for forensic confirmation that the key was present in the dump before taking disruptive action",
                detail: "Do not cause a customer-wide outage on a hypothesis. Establish the facts first, then act proportionately.",
                score: -3,
                outcome: "The forensic work returns what it was always going to return: the dump no longer exists, the environment's logs aged out fifteen months ago, and the two people who could speak to it have left. There is no confirmation available, and there never will be.",
                ripple: "You have made the decision contingent on evidence that cannot exist, which in practice means you have decided to do nothing while believing you have decided to be rigorous. The Cyber Safety Review Board's finding in the analogous real case was that the organisation could not demonstrate how the key was obtained — the absence of evidence was itself the finding, not a reason to defer. Meanwhile the executive team is told the investigation is ongoing, which they will remember as reassurance.",
                isBest: false
              },
              {
                id: "ch-identity-p5-s4-o3",
                label: "Treat the key as compromised: revoke rather than merely rotate, force every resource server to validate the key identifier against an allowlist, hunt retroactively for tokens signed by that key across every log you do have, publish the key identifier as an indicator to customers, and fix the validation gap that let a key be trusted without scope checking",
                detail: "Reason from consequence. Take the disruption deliberately and use the incident to close the structural gap that made detection impossible.",
                score: 3,
                outcome: "Sessions are invalidated during a communicated window, with the conference audience warned in advance. The allowlist change means that from now on a token signed by an unexpected key is rejected and logged, which is the detection capability you did not have. Retroactive hunting across the logs that do exist finds nothing, and you can now say precisely which logs you searched and which did not exist.",
                ripple: "The lasting value is the validation gap. Storm-0558 was catastrophic not because a key leaked but because a key from one scope was accepted for another, and nothing checked. Closing that turns your next key incident from an unbounded question into a bounded one. Your disclosure is also defensible: you stated what you knew, what you could not determine, and what you changed, and none of it required correction later.",
                isBest: true
              },
              {
                id: "ch-identity-p5-s4-o4",
                label: "Rotate the key, notify customers, and state that there is no evidence of any impact to customer data",
                detail: "Act decisively and communicate transparently, while being clear that no misuse has been observed.",
                score: -1,
                outcome: "The action is right and the sentence is wrong. There is no evidence of impact because you have no capability to detect impact, and those are different statements. A journalist or a regulator will find the difference within a day.",
                ripple: "The CSRB specifically criticised public statements in the analogous case that were inaccurate and required later correction. A correction costs more credibility than the original disclosure ever would have. The precise formulation is: our resource servers do not log the key identifier used to validate tokens, so we cannot rule out use of this key; we are deploying that logging now and will report what it shows. Harder to say, impossible to be caught by.",
                isBest: false
              }
            ],
            debrief: "Option three is best for three reasons that generalise well beyond this scenario. First, revocation and rotation are not synonyms: rotation changes what you sign with, revocation changes what relying parties accept, and only the second reduces exposure from artefacts already signed. Any incident position that says rotate without specifying how relying parties stop trusting the old key is incomplete. Second, the incident is an opportunity to install the detection you lacked. Validating the key identifier against an allowlist at every resource server is cheap, and it is precisely the control whose absence made a token forged with a consumer key acceptable for enterprise access in the real case. An incident that closes with the same blind spot it opened with was not resolved, it was survived. Third, communication precision. Option four is very nearly right and fails on one clause, and that clause is the exact clause that generated the harshest public criticism in the real incident. The discipline is to distinguish we found no evidence of impact from we have no capability to detect impact, and to say which one is true. Option two is the most seductive to careful people. Waiting for confirmation is the correct instinct in most investigations and the wrong one here, because the evidentiary window closed before you knew there was a question. When evidence cannot exist, the absence of evidence is not information, and reasoning from consequence is the only rigorous path available.",
            principle: "When a key may have been exposed, act on consequence rather than confirmation: revoke rather than rotate, install the detection whose absence blinded you, and state precisely what you cannot determine rather than describing an absence of detection as an absence of impact."
          },
          awards: ["aw-key-incident-lead", "aw-precision-under-pressure"],
          glossary: ["key-revocation", "key-identifier-allowlist", "scope-confusion", "retention-gap", "retroactive-hunt"]
        },
        {
          id: "ch-identity-p5-s5",
          kind: "field",
          title: "Run a Real Ceremony and a Real Custody Drill",
          statement: "A custody design you have never executed under observation is a document, and documents do not survive the night the key is needed.",
          minutes: 40,
          respect: 210,
          trust: 13,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "This is the heaviest field project in the chapter and the one that changes how people see you. You will design custody for one genuinely important key, execute a ceremony for it with real participants, and then run an unannounced-to-the-participants custody drill in which that key must be used or recovered under conditions you did not tell them about. Almost everyone discovers on the first attempt that their written procedure has a step nobody can perform, a person who is unreachable, or an assumption about a system that is no longer true."
            },
            {
              kind: "numbered",
              title: "The project",
              items: [
                "Select a key whose compromise would be an organisation-level event: a code signing key, a token signing key, a root certificate authority key, a payment authorisation key, or a treasury key. Get explicit written authorisation before touching anything.",
                "Write the custody design: hardware boundary, quorum for each operation, who may request, who may approve, who may operate, who witnesses, what the audit record contains, and how detection of misuse works.",
                "Write the ceremony script for one operation — generation, rotation or recovery — step by step, with each step attributable to a named role. Have it reviewed by someone outside the team.",
                "Execute the ceremony with real participants, real hardware and an independent witness. Record it. Do not skip steps because they feel unnecessary in a rehearsal; the point is to find out which ones are unnecessary by executing them.",
                "Produce the attestation artefact and store it where it will be found in five years by a stranger.",
                "Two weeks later, run the drill: present the quorum with a realistic scenario at an inconvenient time and require them to perform a recovery or an emergency signing using only the written procedure. Observe silently. Do not help.",
                "Write the after-action honestly, including every step that failed, every person who could not be reached, and every assumption that was wrong. Then revise the procedure and schedule the next drill."
              ]
            },
            {
              kind: "checklist",
              title: "What a strong submission contains",
              items: [
                "A custody design that names the concentration point — the moment or place where compromise would be total — rather than claiming there is none.",
                "A ceremony script detailed enough that a competent stranger could execute it, with roles rather than names in the steps and names in the appendix.",
                "Evidence the ceremony actually happened: the attestation artefact, seal numbers or hardware identifiers, and the witness statement.",
                "A drill after-action that records at least two genuine failures. A drill with no failures was either not realistic or not honest, and reviewers will read it that way.",
                "A revised procedure showing exactly what changed as a result of the drill, with the diff visible.",
                "A detection design: the specific alert that would fire on unauthorised use of this key, and evidence that you tested it firing."
              ]
            },
            {
              kind: "callout",
              title: "Scope honestly if you must",
              body: "If you cannot get authorisation to touch a production key, run the entire project against a realistic stand-in: a code signing key for an internal tool, or a purpose-built key with the same custody design. State the substitution plainly. A rigorously executed ceremony on a stand-in key is a professional artefact. A theoretical design for a production key is not."
            }
          ],
          praxis: "Design custody for one high-consequence key, write and execute a ceremony script with real participants and an independent witness, produce the attestation artefact, then run an unannounced custody drill two weeks later in which the quorum must recover or use the key from the written procedure alone while you observe without assisting. Revise the procedure from what actually failed.",
          evidence: "Attach the custody design naming its concentration point; the ceremony script as reviewed; the attestation artefact with hardware or seal identifiers; the drill after-action recording at least two genuine failures with timings; the revised procedure with changes visible; and evidence that your misuse detection alert was tested and fired. Redact identifiers as required, never the structure or the failures.",
          awards: ["aw-custody-ceremony", "aw-drill-honest", "aw-keeper-seal"],
          glossary: ["custody-drill", "attestation-artefact", "witness-statement", "after-action-review"]
        },
        {
          id: "ch-identity-p5-s6",
          kind: "council",
          title: "The Call: Communicating a Key Compromise",
          statement: "In a cryptographic incident your credibility is spent in the first sentence, and the only currency that holds its value is a precise statement of what you do not know.",
          minutes: 30,
          respect: 165,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Key compromise communication is uniquely difficult because the audience wants a binary answer to a question that is genuinely probabilistic, the remediation is visibly disruptive, and the scope is retroactive in a way that other incidents are not. Three audiences need three different things from you in the same hour: executives need a decision and its consequence, customers need to know what to do, and regulators need a factual record that will not need correcting. Trying to write one message for all three is how organisations end up with a statement that satisfies none of them and has to be revised."
            },
            {
              kind: "table",
              title: "Three audiences, three messages, one set of facts",
              headers: ["Audience", "What they actually need", "What goes wrong"],
              rows: [
                ["Executive team", "The decision in front of them, its business consequence, the alternatives you rejected and why, and what you need from them", "Technical narrative with no decision request; they fill the gap with their own decision"],
                ["Customers", "Whether they are affected, what they must do, by when, and what you are doing", "Reassurance language that outruns the facts and must be walked back a week later"],
                ["Regulators and auditors", "A factual chronology with timestamps, what was determined, what could not be determined, and why", "Conclusions stated as facts; anything you assert here becomes a commitment you will be measured against"],
                ["Your own responders", "Clear authority, a single incident commander, and permission to take disruptive action", "Consensus-seeking during an active incident, which converts minutes into hours"],
                ["The press, if it reaches them", "One spokesperson, one prepared position, no speculation", "Engineers answering technical questions helpfully and creating quotable uncertainty"]
              ]
            },
            {
              kind: "numbered",
              title: "The five sentences of a key compromise briefing",
              items: [
                "The fact. A signing key used by our authentication service may have been exposed in a memory dump moved to a lower-trust environment in March of last year.",
                "The consequence, bounded. Anyone holding that key could have created authentication tokens that our systems would have accepted. That capability existed for as long as the key was valid.",
                "What we cannot determine, and why. Our resource servers do not record which key validated each token, and the relevant logs in that environment aged out. We therefore cannot rule out use, and we will not claim that we can.",
                "What we have done and what it costs. We have revoked the key rather than only rotating it, which ended all active sessions at 14:20 today. We have deployed key identifier logging so that this question is answerable in the future.",
                "The decision we need from you. We recommend customer notification today with this wording, and we need a decision on that within the hour. The alternative, waiting for the retroactive hunt to complete, delays notification by four days and we do not believe the additional information will change the conclusion."
              ]
            },
            {
              kind: "quote",
              body: "The organisations that recover fastest from a cryptographic incident are not the ones with the fewest unknowns. They are the ones whose first public statement was still accurate six months later.",
              source: "Working doctrine, derived from the CSRB findings on public communications"
            },
            {
              kind: "principle",
              title: "The Non-Correction Standard",
              body: "Write every external statement so that it will not need correcting when the investigation completes. This means stating uncertainty explicitly and resisting every request to make the sentence more reassuring. A statement you have to correct costs more trust than the incident itself."
            },
            {
              kind: "list",
              title: "Phrases to strike, and what to say instead",
              items: [
                "Strike: there is no evidence of impact. Say: we do not currently have the logging necessary to determine whether this key was used, and we are deploying it now.",
                "Strike: the issue has been fully remediated. Say: the key has been revoked and is no longer accepted by any of our systems as of this timestamp; the retroactive review is ongoing.",
                "Strike: a sophisticated actor. Say what is known about the access path, or say the access path has not been determined.",
                "Strike: customer data was not accessed. Say precisely which data stores were in scope of the capability and what you have and have not been able to review.",
                "Strike: out of an abundance of caution. It signals that you do not believe the action was necessary, which invites the question of why you took it."
              ]
            },
            {
              kind: "callout",
              title: "Rehearse the hardest question",
              body: "Someone will ask: how long could this have been going on? The answer is a date, not an adjective. Practise saying: the key was valid from this date, so the outer bound of the capability is that entire period, and here is the portion of it for which we have logs. Delivering that sentence calmly, with the two dates ready, is worth more to your organisation than any control you will implement this year."
            }
          ],
          praxis: "Write the full communication set for a realistic key compromise in your own environment: the executive briefing in five sentences with a decision request, the customer notification, the regulator chronology, and the internal incident authority statement. Then have a colleague play a hostile journalist and a sceptical regulator against it.",
          evidence: "Attach all four documents, the list of questions your colleague asked that you could not answer well, and the revised versions. Include an explicit statement of which sentences in your draft would have required correction if the investigation later found evidence of key use, and how you rewrote them so they would not.",
          awards: ["aw-non-correction", "aw-council-voice", "aw-keeper-seal"],
          glossary: ["incident-commander", "regulator-chronology", "disclosure-precision", "notification-threshold", "crisis-communication"]
        }
      ]
    }
  ]
};
