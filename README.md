# Trace AI

Build a complete, modern, hackathon-ready web application called:

CYBERTRACE AI

Intelligent Digital Forensics & Cyber Triage Platform

SMART INDIA HACKATHON 2026 – INTERNAL HACKATHON

PROBLEM STATEMENT:

SIH26037 – Creating a cyber triage tool to streamline digital forensic investigation.

The core purpose is to help authorized investigators import, organize, analyze, prioritize, and report digital evidence efficiently.

IMPORTANT:

This is a defensive cybersecurity and digital-forensics platform.

Do NOT build:

- hacking tools

- credential theft

- malware

- exploit generation

- unauthorized access

- attack automation

The system must only assist authorized investigators with digital evidence analysis and investigation workflow.

==================================================

1. PRODUCT VISION

==================================================

Build an end-to-end investigation platform:

LOGIN

 ↓

INVESTIGATION CASE

 ↓

EVIDENCE UPLOAD

 ↓

EVIDENCE INTEGRITY

 ↓

METADATA EXTRACTION

 ↓

AUTOMATED TRIAGE

 ↓

AI-ASSISTED ANALYSIS

 ↓

TIMELINE

 ↓

INVESTIGATOR REVIEW

 ↓

FORENSIC REPORT

The application must feel like a professional cybersecurity investigation product, NOT a generic college CRUD application.

==================================================

2. DESIGN SYSTEM

==================================================

Create a premium cybersecurity/SOC-style interface.

Theme:

- dark professional interface

- deep charcoal/black background

- subtle blue/cyan accents

- red for high-risk indicators

- amber/yellow for warnings

- green for verified/safe

- white/light-gray typography

Style:

- modern

- minimal

- enterprise-grade

- clean

- responsive

- visually impressive

- subtle animations only

Avoid:

- excessive neon

- gaming-style UI

- excessive gradients

- unnecessary animations

- clutter

- generic admin dashboard appearance

Use:

- cards

- tables

- charts

- badges

- timeline components

- modal dialogs

- drawers

- tooltips

- command/search interface where useful

Use Lucide icons consistently.

==================================================

3. TECHNOLOGY

==================================================

Use:

Frontend:

- React

- Vite

- TypeScript

- Tailwind CSS

- React Router

- TanStack Query

- Recharts

- Lucide React

Backend/database integration:

Prefer Supabase if supported by the environment for:

- Authentication

- PostgreSQL database

- Storage

If Supabase is not available, create a clean service layer with mock/demo data so the frontend remains fully functional and easy to connect later to a Node.js + Express + MongoDB backend.

IMPORTANT:

Do NOT create a fake-looking application.

All major interactions should work.

==================================================

4. APPLICATION STRUCTURE

==================================================

Create these main routes:

/login

/register

/dashboard

/cases

/cases/new

/cases/:id

/cases/:id/evidence

/cases/:id/timeline

/evidence

/evidence/:id

/ai-analysis

/reports

/reports/:id

/audit-logs

/settings

Protected routes must require authentication.

==================================================

5. LOGIN PAGE

==================================================

Create a premium cybersecurity login page.

Logo:

CYBERTRACE AI

Subtitle:

Intelligent Digital Forensics & Cyber Triage

Tagline:

"Secure. Analyze. Investigate."

Show a subtle abstract cybersecurity visual.

Login fields:

- Email

- Password

Buttons:

- Sign In

- Create Account

Also include:

- Remember session

- Forgot password UI

Do not use fake credentials in the visible UI.

==================================================

6. SIDEBAR

==================================================

Create a collapsible sidebar.

Header:

CYBERTRACE AI

Digital Forensics

Navigation:

Dashboard

Cases

Evidence Explorer

Timeline

AI Analysis

Reports

Audit Logs

Settings

Bottom:

Current User

Role

Logout

On mobile:

- collapsible drawer

- hamburger menu

==================================================

7. DASHBOARD

==================================================

Create a highly polished investigation dashboard.

Header:

Good evening, Investigator

Subtitle:

"Monitor active investigations and prioritize critical evidence."

Top cards:

TOTAL CASES

24

EVIDENCE FILES

1,248

HIGH RISK

37

PENDING REVIEW

18

Use realistic synthetic demo data.

Charts:

1. Risk Distribution

- Low

- Medium

- High

2. Evidence Type Distribution

- Documents

- Images

- Logs

- Archives

- Other

3. Investigation Activity

4. Evidence Processing Status

Recent Cases table:

Case ID

Case Name

Priority

Evidence

Status

Updated

Action

Recent High-Risk Evidence:

Filename

Case

Risk

Score

Integrity

Action

Include:

- View Case

- View Evidence

==================================================

8. CASE MANAGEMENT

==================================================

Create /cases.

Features:

- Search

- Filter

- Sort

- Pagination

- Create case

- Open case

- Change status

- Change priority

Case fields:

Case ID

Title

Description

Investigator

Priority

Status

Evidence Count

Created

Updated

Statuses:

OPEN

IN PROGRESS

CLOSED

Priorities:

LOW

MEDIUM

HIGH

CRITICAL

Create a beautiful "Create Investigation" form.

==================================================

9. CASE DETAIL PAGE

==================================================

When opening a case, show:

Case ID

Case title

Status

Priority

Investigator

Created date

Last updated

Tabs:

Overview

Evidence

Timeline

AI Analysis

Notes

Report

Overview should show:

Evidence count

High-risk evidence

Medium-risk evidence

Low-risk evidence

Integrity status

Recent activity

==================================================

10. EVIDENCE EXPLORER

==================================================

Create a professional evidence management interface.

Features:

- Upload Evidence

- Search

- Filter

- Sort

- Risk filter

- Case filter

- Evidence type filter

- Integrity filter

Table:

Evidence ID

Filename

Type

Case

Risk Score

Risk Level

Integrity

Uploaded

Status

Risk badges:

LOW → green

MEDIUM → amber

HIGH → red

==================================================

11. EVIDENCE UPLOAD

==================================================

Create a polished upload interface.

Supported demo formats:

PDF

TXT

CSV

JPG

PNG

JSON

LOG

ZIP

Show:

Drag & Drop area

"Drop evidence files here"

or

"Browse Files"

After upload show processing:

Uploading

Processing

Extracting Metadata

Calculating Hash

Analyzing

Complete

Do NOT execute uploaded files.

The UI should clearly communicate:

"Uploaded files are treated as evidence and are never executed."

==================================================

12. EVIDENCE DETAIL

==================================================

Create:

/evidence/:id

Display:

Filename

Evidence ID

Case

File Type

File Size

Upload Date

SHA-256 Hash

Integrity Status

Risk Score

Risk Level

Analysis Status

Sections:

Metadata

Risk Indicators

AI Analysis

Timeline Events

Investigator Notes

Audit History

Buttons:

Verify Integrity

Run Analysis

Add Note

Generate Report

==================================================

13. SHA-256 EVIDENCE INTEGRITY

==================================================

This must be a major feature.

Display:

SHA-256 HASH

Example:

8f4d9c...a73b

Status:

✓ INTEGRITY VERIFIED

Add:

"Verify Integrity"

button.

Explain visually:

Original Hash

vs

Current Hash

If identical:

INTEGRITY VERIFIED

If different:

INTEGRITY COMPROMISED

Use professional security indicators.

Do not claim legal admissibility.

==================================================

14. AUTOMATED TRIAGE

==================================================

Every evidence item should receive:

Risk Score:

0–100

Risk levels:

0–30 = LOW

31–70 = MEDIUM

71–100 = HIGH

Show a circular score visualization.

Example:

91

HIGH RISK

Below it show indicators:

- Suspicious timestamp pattern

- Unknown file type

- Multiple authentication failures

- Unusual activity

Important wording:

"Potentially suspicious artifact"

"Requires investigator review"

Never say:

"Criminal activity confirmed."

==================================================

15. AI ANALYSIS PAGE

==================================================

Create /ai-analysis.

Header:

AI-Assisted Evidence Analysis

Description:

"Use automated analysis to identify patterns and prioritize evidence for investigator review."

Features:

Evidence Summary

Risk Explanation

Detected Indicators

Timeline Extraction

Log Anomaly Detection

Recommended Review Priority

Create an AI analysis panel.

Example:

Evidence:

authentication.log

AI Summary:

"Multiple failed authentication attempts were detected within a short time window."

Risk:

HIGH

Score:

84

Indicators:

Multiple failed login attempts

Repeated source pattern

Unusual time window

Recommendation:

"Prioritize this artifact for manual investigator review."

Make it clear that AI is assistive and not a final decision-maker.

==================================================

16. TIMELINE

==================================================

This should be one of the most impressive parts of the application.

Create a visual investigation timeline.

Example:

10:32

Evidence uploaded

10:41

Suspicious artifact detected

10:45

Authentication anomaly detected

11:02

File modification detected

11:21

AI analysis completed

Each timeline item:

Timestamp

Event Type

Evidence

Description

Risk

Filters:

All

Low

Medium

High

Authentication

File Activity

System Activity

Network Indicator

Use a polished vertical timeline.

==================================================

17. INVESTIGATION NOTES

==================================================

Allow investigators to add notes.

Fields:

Note

Author

Timestamp

Show chronological notes.

Example:

"Artifact requires manual verification."

"Timestamp correlation observed."

==================================================

18. AUDIT LOG

==================================================

Create /audit-logs.

Display:

Timestamp

User

Action

Resource

Details

IP/Session indicator where appropriate

Actions:

Login

Logout

Case Created

Evidence Uploaded

Evidence Analyzed

Integrity Verified

Report Generated

Note Added

This gives the system an investigation accountability layer.

==================================================

19. REPORT GENERATION

==================================================

Create /reports.

Show:

Available Investigation Reports

Columns:

Report ID

Case

Generated By

Generated Date

Evidence Count

Risk Level

Status

Action

Create:

"Generate Forensic Report"

The report preview should contain:

CYBERTRACE AI

DIGITAL FORENSIC INVESTIGATION REPORT

1. Case Information

2. Investigation Summary

3. Evidence Summary

4. Evidence Integrity

5. Risk Distribution

6. Suspicious Evidence

7. Investigation Timeline

8. AI-Assisted Analysis

9. Investigator Notes

10. Audit Summary

11. Conclusion

Include SHA-256 hashes.

Use a professional report design.

Add:

Download PDF

If real PDF generation is not available initially, create a print-ready report page that can later be connected to PDF generation.

==================================================

20. DATA VISUALIZATION

==================================================

Use charts for:

Risk Distribution

Evidence Categories

Case Status

Evidence Processing

Investigation Activity

Charts must be readable and professional.

Do not overload the dashboard.

==================================================

21. DEMO MODE

==================================================

This is extremely important for the hackathon.

Create a:

"Load Demo Investigation"

button.

When clicked, load realistic synthetic data.

Create demo cases:

CYB-001

Unauthorized Access Investigation

CYB-002

Suspicious Document Investigation

CYB-003

Digital Evidence Review

Create approximately 15–25 synthetic evidence records.

Include:

Low risk

Medium risk

High risk

Create synthetic timeline events.

Create synthetic AI analysis results.

Create synthetic audit logs.

DO NOT use real personal information.

==================================================

22. EMPTY STATES

==================================================

Every page must have a professional empty state.

Example:

"No investigations found."

Actions:

Create Investigation

Load Demo Data

Never leave blank white/dark screens.

==================================================

23. LOADING STATES

==================================================

Use:

Skeleton loaders

Progress indicators

Processing states

Toast notifications

Examples:

"Evidence uploaded successfully."

"Integrity verified."

"Analysis completed."

"Report generated."

==================================================

24. RESPONSIVE DESIGN

==================================================

Desktop:

Full dashboard + sidebar.

Tablet:

Collapsible sidebar.

Mobile:

Drawer navigation.

Tables:

Responsive cards or horizontal scrolling.

Charts:

Responsive.

==================================================

25. SETTINGS

==================================================

Create settings page.

Sections:

Profile

Security

System Status

AI Service

Show status indicators:

Backend

Database

AI Analysis

Use:

Operational

Warning

Offline

==================================================

26. FUTURE BACKEND READY

==================================================

Structure frontend code so it can easily connect to:

Node.js

Express

MongoDB

Create a service layer such as:

src/services/api.ts

Keep API calls separated from UI components.

Do NOT hardcode API logic inside components.

Use environment variables:

VITE_API_URL

==================================================

27. COMPONENT ARCHITECTURE

==================================================

Create reusable components:

Sidebar

Topbar

StatCard

RiskBadge

CaseCard

EvidenceTable

EvidenceUploader

RiskScore

Timeline

TimelineEvent

ChartCard

StatusBadge

SearchBar

FilterPanel

Modal

ConfirmDialog

LoadingState

EmptyState

Toast

ReportPreview

Keep components modular.

==================================================

28. SECURITY UX

==================================================

Show security indicators prominently.

Examples:

✓ Evidence Integrity Verified

⚠ Requires Investigator Review

HIGH RISK

AI Analysis Complete

Secure Session

Do not make unsupported legal claims.

==================================================

29. LANDING EXPERIENCE

==================================================

The dashboard should immediately communicate:

What CyberTrace AI does.

Use a short description:

"CyberTrace AI helps authorized investigators organize digital evidence, identify potential risk indicators, reconstruct investigation timelines, and generate structured forensic reports."

==================================================

30. HACKATHON PRESENTATION QUALITY

==================================================

The application must be visually strong enough for:

- faculty judges

- technical judges

- cybersecurity reviewers

- Smart India Hackathon internal selection

The demo should communicate the entire workflow within 3–5 minutes.

Suggested demo:

1. Login

2. Open Case

3. Upload Evidence

4. Evidence Processing

5. SHA-256 Integrity

6. Risk Score

7. AI Analysis

8. Timeline

9. Dashboard

10. Generate Report

==================================================

31. IMPORTANT DEVELOPMENT RULES

==================================================

Do not create only static pages.

Buttons must work.

Navigation must work.

Forms must work.

Demo data must work.

Filters must work.

Search must work.

Risk badges must work.

Timeline must work.

The dashboard must use consistent data.

Avoid duplicate components.

Avoid unnecessary dependencies.

Keep code clean and maintainable.

Do not leave core features as "Coming Soon".

If a backend feature cannot be implemented in the current environment, create a clean mock service abstraction so it can be replaced with a real API later.

==================================================

32. FINAL QUALITY CHECK

==================================================

Before finishing:

- Check all routes

- Check all buttons

- Check all forms

- Check responsive design

- Check console errors

- Check TypeScript errors

- Check authentication flow

- Check demo mode

- Check evidence workflow

- Check timeline

- Check report preview

- Check charts

- Check loading states

- Check empty states

- Check error states

Fix all obvious issues.

The final result must feel like a polished cybersecurity SaaS product.

==================================================

33. FINAL DELIVERABLE

==================================================

Deliver a complete working frontend application with:

- Premium cybersecurity UI

- Authentication

- Dashboard

- Case Management

- Evidence Explorer

- Evidence Upload UI

- SHA-256 Integrity workflow UI

- Automated Triage

- AI Analysis

- Investigation Timeline

- Notes

- Audit Logs

- Reports

- Demo Mode

- Responsive design

- Backend-ready service architecture

Most importantly:

DO NOT make this look like a simple CRUD project.

Make CYBERTRACE AI feel like a real digital-forensics investigation platform designed for a Smart India Hackathon solution.

Start building the application now.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0c5afb4b-3826-47ba-8b1c-4864cd733052).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
