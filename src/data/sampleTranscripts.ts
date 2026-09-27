export interface SampleTranscript {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
}

export const SAMPLE_TRANSCRIPTS: SampleTranscript[] = [
  {
    id: 'project-sync',
    title: 'Project Sync (PRD Sample)',
    category: 'Engineering',
    description: 'Alice, Bob, Charlie, and David discussing dashboard redesign, API integration, testing, and performance.',
    content: `Project Sync Meeting

Alice:
We need to complete the dashboard redesign before July 30.

Bob:
I'll finish the API integration by next Tuesday.

Charlie:
I'll prepare the testing report before Friday.

Alice:
Let's postpone mobile development until Phase 2.

David:
We should improve application performance.

Alice:
Bob will review Charlie's report after testing.

Meeting ended.`
  },
  {
    id: 'q3-roadmap',
    title: 'Q3 Strategy & Roadmap Planning',
    category: 'Strategy',
    description: 'Sarah, Marcus, and Lena evaluating Legacy Auth Modernization vs. AI Workspace priorities.',
    content: `[00:00:15] Sarah: Thanks everyone for joining the Q3 Strategy sync. Today we need to decide on our platform roadmap priorities for Q4 and allocate engineering resources accordingly.
[00:00:32] Marcus: Before we dive in, I want to confirm that the security audit report came back clean. All critical vulnerabilities from last month have been resolved by the DevOps team.
[00:00:48] Sarah: That's great news, Marcus. Now onto the main agenda. Option A is modernizing our legacy authentication system to support SSO and OAuth2. Option B is launching the new AI-powered workspace features first.
[00:01:10] Lena: From an enterprise sales perspective, SSO is a hard blocker for three major prospective deals worth $250k ARR combined. They won't sign without SAML integration.
[00:01:28] Marcus: Engineering-wise, Auth modernization will take about 6 weeks with two senior devs. The AI features will take 8 weeks and depend on the new API gateway being deployed.
[00:01:45] Sarah: Okay, decision made: We are prioritizing Legacy Auth Modernization for Q4. Marcus, you'll lead this initiative starting next Monday, October 14th. Target completion is November 22nd.
[00:02:05] Marcus: Understood. I'll draft the architecture spec by this Friday, October 11th, and share it with the team for review.
[00:02:20] Lena: What about the AI Workspace feature? Should we pause it entirely?
[00:02:32] Sarah: We'll defer the AI Workspace launch to Q1 next year. However, Lena, I want you to run a closed beta with 5 selected customers using our current prototype to gather feedback in the meantime. Please set up those beta calls by October 25th.
[00:02:55] Lena: Will do. I'll reach out to AcroCorp, TechStart, and three others today.
[00:03:08] Marcus: One risk item: We need the infrastructure team to provision the dedicated Redis cluster for session caching by October 18th, otherwise Auth testing will be delayed.
[00:03:25] Sarah: Good call. I'll escalate the Redis provisioning request to David in Infra today before EOD. Let's reconvene on Monday for the sprint planning.`
  },
  {
    id: 'sprint-retro',
    title: 'Sprint Retrospective',
    category: 'Agile & DevOps',
    description: 'Engineering lead, QA, and Product reviewing sprint metrics, CI/CD pipeline bottlenecks, and action items.',
    content: `Sprint Retrospective - Frontend & Platform Team

John (Engineering Lead):
Overall sprint velocity was strong, but deployment pipeline delays caused a 2-day delay on the release.

Emily (QA Lead):
We found 4 regression bugs in the checkout flow. Emily will complete re-testing by Wednesday.

Mark (DevOps):
I will upgrade the GitHub Actions runner configuration by Thursday to cut build times in half.

John:
Great. Mark, please also document the runner changes in Notion by Friday.

Rachel (Product):
Customer support reported intermittent 504 errors on the search endpoint. John, please assign someone to investigate this urgently.

John:
I will personally investigate the search endpoint 504 timeouts by tomorrow afternoon. We'll also hold a technical post-mortem next Monday.`
  },
  {
    id: 'product-launch',
    title: 'Product Launch & GTM Sync',
    category: 'Marketing & Sales',
    description: 'Cross-functional launch alignment covering press releases, influencer embargoes, pricing tiers, and collateral.',
    content: `Product Launch & Go-To-Market Alignment Meeting

Elena (VP Marketing):
Welcome team. We have 14 days before the MeetWise AI 2.0 public launch. Today we must lock in the PR schedule, partner enablement, and webinar dates.

Raj (Product Marketing):
The press release draft is ready. I will distribute the press release to our media embargo list by Monday morning at 9 AM PST.

Chloe (Design Director):
All landing page illustrations and video demo assets are finalized. Chloe will deliver the final social media graphics pack to Raj by Wednesday.

Tom (Sales Enablement):
The enterprise sales team needs customer battlecards and updated pricing sheets. Can we get those before next week's sales all-hands?

Raj:
Yes, I'll update the battlecards with the new AI compliance tier and upload them to Highspot by Friday EOD.

Elena:
Decision: We will host the launch keynote live webinar on Thursday, November 7th. Elena will send speaker invites to our guest panel by tomorrow.

Chloe:
One blocker: The animated hero video on the homepage needs CDN caching setup so page load remains under 1.2 seconds.

Tom:
I'll file an urgent ticket with the web infra team today to configure Cloudflare caching for all video assets.`
  },
  {
    id: 'incident-postmortem',
    title: 'Production Incident Post-Mortem',
    category: 'SRE & Security',
    description: 'Root cause analysis of the database connection pool exhaustion and remediation commitments.',
    content: `Post-Mortem: Incident INC-8492 - API Gateway & DB Connection Pool Saturation

Liam (SRE Incident Commander):
Let's review the root cause and remediation items from yesterday's 42-minute API gateway latency degradation.

Maya (Principal Backend Architect):
At 14:15 UTC, an unindexed query in the notification dispatcher triggered table locks on the PostgreSQL cluster. Connection pools filled within 3 minutes, causing 503 errors across dependent microservices.

Liam:
What was the resolution and immediate mitigation?

Carlos (Database Administrator):
We manually terminated long-running locking queries and temporarily boosted pool capacity to 300 connections. Service restored at 14:57 UTC.

Maya:
Action item: Maya will add the missing composite index on the notifications table and deploy the patch to staging by Tuesday.

Carlos:
Action item: Carlos will implement strict 5-second query statement timeouts across all read replicas by Thursday to prevent pool cascading failures.

Liam:
Action item: Liam will configure PagerDuty alerts for connection pool utilization above 75% by Friday.

Maya:
Decision made: We will mandate database query reviews for all schema alterations in PR templates going forward.`
  }
];
