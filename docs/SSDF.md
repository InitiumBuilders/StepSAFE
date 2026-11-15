# StepSAFE against NIST's Secure Software Development Framework

A draft, written 2026-11-14, for the attestation a federal buyer asks for. Software producers attest on CISA's
Secure Software Development Attestation Form that they follow practices drawn from NIST SP 800-218 (SSDF 1.1). The
producer signs the form. That is August's decision; nothing here is signed.

Each practice's ID and name are NIST's, read from the published PDF on 2026-11-14
(https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf). SSDF 1.1 has nineteen practices; PW.3
was folded into PO.1.3 and PW.4. Each row says what StepSAFE does, where the evidence is, and what is missing.
Statuses: **Met**, **Partly**, **Not yet**, **For August to confirm**.

The public side of this is StepSAFE's own record at #/trust (views/TrustView.tsx), which reads what a browser can.

## Prepare the Organization (PO)

| Practice | Status | StepSAFE today | Missing |
| --- | --- | --- | --- |
| PO.1 Define Security Requirements for Software Development | Partly | docs/SECURITY-REQUIREMENTS.md lists each requirement for the software with the test that holds it (PO.1.2). PO.1.3 does not apply: StepSAFE takes no commercial components. | The development infrastructure's own requirements, written the same way (PO.1.1). |
| PO.2 Implement Roles and Responsibilities | Partly | One maintainer holds every role. A production release waits for his own go-ahead for that build. | The roles written down: who builds, reviews, approves, publishes and answers reports. |
| PO.3 Implement Supporting Toolchains | Partly | TypeScript in strict mode, Vite, the gate (scripts/gate/gate.sh), the secret scan, scripts/sbom.mjs, scripts/vulns.mjs, prebuilt deploys to Vercel. | The gate's log kept with each release as its artifact (PO.3.3). |
| PO.4 Define and Use Criteria for Software Security Checks | Partly | Every line of the gate must say exit 0. ship.sh refuses on a placeholder contact, a stale bill of materials or a known flaw. | The gate's results kept and safeguarded per release (PO.4.2). |
| PO.5 Implement and Maintain Secure Environments for Software Development | For August to confirm | Production runs on Vercel; previews are separate deployments; the repository is private. | Two-factor sign-in on GitHub and Vercel, and disk encryption and updates on the build machine (PO.5.2). |

## Protect the Software (PS)

| Practice | Status | StepSAFE today | Missing |
| --- | --- | --- | --- |
| PS.1 Protect All Forms of Code from Unauthorized Access and Tampering | Partly | A private repository under one account. Every push runs the secret scan, and a hit stops it. | Branch protection (GitHub's free plan offers none for private repositories) and signed commits. |
| PS.2 Provide a Mechanism for Verifying Software Release Integrity | Partly | The bill of materials carries a SHA-512 hash for each shipped package. The live site is compared file by file with the gated build after each release. | Published, signed hashes of each release's own files (PS.2.1). |
| PS.3 Archive and Protect Each Software Release | Partly | Vercel keeps every deployment; each release is a commit. The bill of materials is the provenance for third-party components (PS.3.2). | The integrity data and the gate log archived with each release (PS.3.1). |

## Produce Well-Secured Software (PW)

| Practice | Status | StepSAFE today | Missing |
| --- | --- | --- | --- |
| PW.1 Design Software to Meet Security Requirements and Mitigate Security Risks | Partly | Keys held in memory by default and sealed only by choice (AES-256-GCM, PBKDF2-SHA256 at 600,000 rounds); the guides' server door checks origin, content type, rate and size; a strict security policy; no accounts and no cookies. | A written threat model of StepSAFE itself: the browser app, /api/seva, the outside services (PW.1.1). |
| PW.2 Review the Software Design | Not yet | | A review of the design by a qualified person who did not build it (PW.2.1). |
| PW.4 Reuse Existing, Well-Secured Software When Feasible | Met | Three direct dependencies (React, React DOM, three.js), six shipped packages, the lockfile committed, each package asked of OSV.dev before every release (PW.4.4). | |
| PW.5 Create Source Code by Adhering to Secure Coding Practices | Partly | TypeScript strict mode; React's escaping for every outside text; no `dangerouslySetInnerHTML`; `innerHTML` only for two fixed templates in the 3D world; the policy refuses inline scripts. | A short written secure coding standard (PW.5.1). |
| PW.6 Configure the Compilation, Interpreter, and Build Processes | Partly | `npm run build` type-checks before Vite builds; production ships no source maps. | The approved build configuration written down (PW.6.2). |
| PW.7 Review and/or Analyze Human-Readable Code | Partly | The type check, the secret scan and the content probes run on every build. | A second person's review, and static security analysis (CodeQL is free on public repositories). |
| PW.8 Test Executable Code to Identify Vulnerabilities | Partly | Fifteen walks test the built site in a real browser under its real headers; probe-seva-door attacks the server door; probe-keyring attacks the keyring. | An outside penetration test (PW.8.2). |
| PW.9 Configure Software to Have Secure Settings by Default | Met | No key is stored by default; sealing needs a passphrase; the headers and policy are strict by default; nothing to sign in to. | |

## Respond to Vulnerabilities (RV)

| Practice | Status | StepSAFE today | Missing |
| --- | --- | --- | --- |
| RV.1 Identify and Confirm Vulnerabilities on an Ongoing Basis | Partly | A published disclosure policy and security.txt (RV.1.3, live once the contact is set); OSV.dev asked before every release and from #/trust (RV.1.1). | Alerts between releases: Dependabot is off on the repository. |
| RV.2 Assess, Prioritize, and Remediate Vulnerabilities | Not yet | | Written triage steps and fix times by severity. |
| RV.3 Analyze Vulnerabilities to Identify Their Root Causes | Partly | Misses are written down with the rule each became (docs/NEXT-MOVE.md and the review log). | The same for each reported vulnerability, once there is one (RV.3.1 to RV.3.4). |

## The shortest path to signing

In order of what a reviewer weighs most:

1. **August confirms PO.5.2**: two-factor sign-in on GitHub and Vercel, disk encryption and automatic updates on the
   build machine.
2. **Write the two short documents still missing**: the roles (PO.2), and the triage steps with fix times (RV.2),
   whose times are August's to set. The security requirements with their tests (PO.1) are written.
3. **Keep each release's evidence**: the gate log and the list of the release's file hashes in the repository, with
   the commit (PO.3.3, PO.4.2, PS.3.1).
4. **A public code mirror, if August chooses it**: branch protection, push protection, Dependabot, CodeQL and OpenSSF
   Scorecard are free on a public repository, which moves PS.1, PW.7 and RV.1 forward together.
5. **Sign releases** (PS.2.1), then an outside design review and penetration test (PW.2, PW.8).
