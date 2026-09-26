export interface SampleTranscript {
  id: string;
  title: string;
  description: string;
  content: string;
}

export const SAMPLE_TRANSCRIPTS: SampleTranscript[] = [
  {
    id: 'project-sync',
    title: 'Project Sync Meeting (PRD Sample)',
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
    title: 'Engineering Sprint Retrospective',
    description: 'Team discussing sprint metrics, bug triage, CI/CD pipeline bottlenecks, and task assignments.',
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
  }
];
