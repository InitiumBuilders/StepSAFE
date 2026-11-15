# Chapter 2.6.8: Built In The Open

Coming SOON in StepSAFE :: The Praxis. How open source software is written, coordinated, funded and secured, read as a system.

Written by Davara on 2026-10-18 from the synthesis of the 28 outlier systems in Chapter 2.6.7. The same text shows on the Chapters page under the 2.6.8 card.

## The preview

Modern software is assembled from open code written by people its builders never meet. This chapter reads that commons as a system, from how projects coordinate and pay for themselves to when opening code makes it harder to break.

## The intro, in draft

Modern software is assembled from code written by people its builders never meet. Much of that code lives in open projects that anyone can read, copy and change. GitHub carries a large share of the work, and it has to make each account, tag and package trustworthy enough for strangers to build on. This chapter reads open source as a system with stocks, flows and loops of its own.

It starts with coordination. Maintainers, contributors and users form loops that can grow a project or wear its maintainers out. Gitcoin and Giveth tried to pay for code anyone can use, and each met people gaming the count. Farcaster and Dash publish their rules and code, so anyone can run a client or a node and check the others.

Then it turns to security. Opening code brings in reviewers and attackers alike. The Shai-Hulud worm spread through npm publishing in 2025, and Hugging Face learned that a shared model file can run code when it loads. The same openness let NSA give Ghidra to defenders everywhere, with 90.8k GitHub stars on 18 October 2026, and it lets anyone rerun the open code that scores X's Community Notes.

Last comes the question of when openness makes software stronger. The chapter weighs the evidence on when public code is safer and how many people actually review it. It asks what a fork owes its upstream, with the Mastodon code under Truth Social as one case. It ends with structures a security leader can adopt, from signed builds and short-lived publish credentials to funded maintainers.

## The questions it will answer

1. How does a project that no one owns decide what code gets in, and who can change that rule?
2. Which stocks does an open project's health depend on, and which drain first when maintainers leave?
3. When does opening code to everyone make it harder to break, and when does it give attackers a map?
4. Who holds the right to publish a release that millions will install, and how is that right protected?
5. How can a community pay for code anyone may use, when the count of supporters can be faked?
6. What does a fork owe the project it came from, and how does it keep up with that project's security fixes?
7. How do signed builds, reproducible builds and provenance let a stranger check that a release matches its source?
8. Why do agencies release their own code, and what changes for defenders once they do?
9. Which structures from open projects can a security leader adopt inside a closed organisation?

## The pages it will hold

1. **How Open Code Gets Made.** The roles, rules and loops of an open project: maintainers, contributors, review, release, and the governance that decides who merges.
2. **Coordination And Emergence.** How strangers coordinate without a manager, why some projects grow while others stall, and what the research on commons governance says about it.
3. **Paying For The Commons.** Funding models from company sponsorship to quadratic rounds, read through Gitcoin and Giveth, and what each one invites people to fake.
4. **The Publish Path.** Accounts, tokens, tags and registries as the supply chain of open code, read through GitHub, npm and the Hugging Face Hub.
5. **When Open Is Safer.** The evidence on outside review, open advisories, released tools such as Ghidra and open scoring such as Community Notes.
6. **Forks, Upstreams And Protocols.** What a fork inherits and owes, read through the Mastodon code under Truth Social, and how Dash and Farcaster let anyone run and check a node.
7. **Structures To Adopt.** Signed and reproducible builds, provenance, short-lived publish credentials, dependency cooldowns and funded maintainers, matched to the Modux catalog.

## The research prompt

You are researching Chapter 2.6.8 of StepSAFE :: The Praxis, a security leadership course. The chapter reads open source software as a system: how it is written, reviewed, released, funded, coordinated and secured, and when opening code to inspection makes it harder to break. Hold every project, company, foundation and agency to the same standard, and keep the writing neutral and factual.

Read first. Start with the Modux catalog in research/outlier/catalog.txt and the final entries for GitHub, Hugging Face, Gitcoin, Giveth, Farcaster, Dash, NSA, X and Truth Social in research/outlier/final. Then read primary sources on the web: GitHub's Octoverse reports and its security posts on npm tokens and trusted publishing; the OpenSSF Scorecard, SLSA and Sigstore documentation; the Reproducible Builds project; the CHAOSS project health metrics; the Trail of Bits audit of safetensors; the quadratic funding paper and Gitcoin's round fraud reports; the Giveth documentation; Farcaster's improvement proposals and the Snapchain design; Dash's improvement proposals, starting with DIP-0008; the Ghidra repository and NSA's other open source releases; the Community Notes repository and the bridging-based ranking paper; the Mastodon repository and its licence, and the Software Freedom Conservancy's statement on Truth Social's source code; the post-incident records for the Heartbleed flaw in OpenSSL, Log4Shell and the xz utils backdoor; and the research on Linus's law, on commons governance in the tradition of Elinor Ostrom, and on paying maintainers.

Angles to cover. How a project decides what code gets in, and who can change that rule. How contributors and maintainers form loops that grow a project or wear it out, and what the data says about bus factor and maintainer turnover. How each funding model changes behaviour, and what it invites people to fake. How the publish path works, from account to token to tag to registry, and where attackers have entered it. When public code is safer, with the evidence for and against the claim that many eyes find bugs. What a fork inherits from its upstream, and how it tracks the upstream's security fixes. Why agencies release their code, and what changes for them and for defenders once they do.

What to verify. Check each figure against a primary source and give it a date and a URL. For each project you cite, record its licence, who holds publish rights and how many maintainers were active on the date you read it. Treat vendor marketing as a claim to check, and report each incident by what its post-incident record shows. Mark anything you could not confirm as uncertain, and say what would settle it.

What to deliver. Five to eight pages, each with a keystone question; a map of its stocks, flows and loops; the strongest security moves, matched to catalog structure ids; two or three pressures a map can carry, each with its target part kind and counters from the catalog; a source list with URLs and access dates; and an uncertain list. Close with the structures a security leader can adopt inside a closed organisation, matched to the catalog.
