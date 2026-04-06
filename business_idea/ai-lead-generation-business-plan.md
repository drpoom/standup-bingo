# AI Lead Generation Business Plan
**Prepared for:** Uncle John (Dr. Poom)  
**Date:** April 5, 2026  
**Business Model:** AI-Agent-Run Lead Generation Service

---

## Executive Summary

**Business:** AI-powered lead generation service for B2B companies  
**Value Proposition:** "We book you 5-15 qualified meetings per month using AI agents"  
**Pricing:** €2,000-5,000/month per client (97% margins)  
**Time to Revenue:** 1-2 weeks  
**Uncle John's Role:** Supervisor only (1-2 hours/day), AI agents do 90%+ of work

---

## The Business Model

### What We Sell

**Lead Generation = Finding and contacting potential customers to book meetings for our client's sales team**

### What AI Agents Do (90%+ of work)

```
Agent 1 (Research): 
  - Scrape company data from Apollo.io, LinkedIn
  - Identify decision makers (CTOs, Directors, VPs)
  - Enrich with email addresses, company info

Agent 2 (Personalization):
  - Write custom outreach messages based on prospect data
  - Reference recent news, company events, pain points

Agent 3 (Outreach):
  - Send personalized emails via Instantly.ai
  - Track opens, clicks, responses
  - A/B test subject lines, messaging

Agent 4 (Qualification):
  - Handle inbound replies
  - Answer basic questions
  - Book meetings on client's calendar

Human Supervision (Uncle John):
  - Review edge cases (1-2 hrs/day)
  - Adjust targeting/messaging
  - Client check-in calls (weekly, 30 min each)
```

### Who Pays Us

**Ideal Customer Profile:**

| Criteria | Why |
|----------|-----|
| B2B company (sells to businesses) | Higher deal values = can afford us |
| Product price €10,000+ | One closed deal pays for months of our service |
| 10-200 employees | Big enough for budget, small enough to need help |
| Already doing sales | They understand meeting value |
| Using CRM (HubSpot, Salesforce) | Serious about sales |
| Revenue €1M-10M/year | Can afford €2-5k/month |

**Examples:**
- B2B SaaS companies (selling software to businesses)
- Marketing agencies (selling SEO, ads, content services)
- Consulting firms (digital transformation, strategy)
- Manufacturing companies (industrial equipment)
- Professional services (legal, finance, compliance)

### Why They Pay

**Example: B2B SaaS Company**

| Metric | Value |
|--------|-------|
| Their product price | €50,000/year |
| They need | 20 new customers this year |
| Sales team closes | 20% of meetings |
| So they need | 100 meetings/year (8-9/month) |
| Their salesperson cost | €80,000/year |

**Our offer:**
- "We'll book you 10 qualified meetings/month"
- "You pay us €3,000/month"
- "If you close 2 deals = €100,000 revenue"
- **ROI: Pay €3k, make €100k**

---

## Pricing Models

### Option 1: Monthly Retainer (Recommended)
- **€2,000-5,000/month** per client
- Guaranteed 5-15 qualified meetings/month
- Predictable revenue
- **Best for:** Stable, long-term clients

### Option 2: Pay Per Meeting
- **€150-300 per qualified meeting**
- Risk on us (if we book 0, we earn 0)
- **Best for:** Testing, skeptical clients

### Option 3: Retainer + Performance
- **€1,500/month base + €100/meeting** beyond 5
- Aligns incentives
- **Best for:** Scaling clients

---

## Financial Projections

### Startup Costs

| Item | Cost |
|------|------|
| Domains (5x for email warmup) | €50 |
| Google Workspace / email hosting | €30/month |
| Apollo.io (prospect data) | €99/month |
| Instantly.ai (email sending) | €97/month |
| Claude API (AI writing) | ~€200/month |
| Landing page (Carrd/Notion) | €20/month |
| **Total Month 1:** | **~€500** |
| **Total Ongoing:** | **~€400/month** |

### Unit Economics (Per Client)

| Metric | Value |
|--------|-------|
| Revenue | €3,000/month |
| AI + Infrastructure cost | ~€50/month |
| **Profit** | **€2,950/month** |
| **Margin** | **98%** |

### Path to €10k/Month

| Clients | Revenue | Cost | Profit |
|---------|---------|------|--------|
| 1 | €3,000 | €50 | €2,950 |
| 3 | €9,000 | €150 | €8,850 |
| 5 | €15,000 | €250 | €14,750 |
| 10 | €30,000 | €500 | €29,500 |

**Goal: 5 clients = €15,000/month revenue, ~€13,000 profit**

---

## Tech Stack

### Core Tools

| Tool | Purpose | Cost |
|------|---------|------|
| Apollo.io | Prospect data, contact info | €99/month |
| Instantly.ai | Email infrastructure, sending, warmup | €97/month |
| Claude API (Anthropic) | AI writing, personalization, responses | ~€200/month |
| Calendly | Meeting booking | Free |
| Google Workspace | Email accounts | €30/month |

### Optional (Later)

| Tool | Purpose | Cost |
|------|---------|------|
| Make.com | Automation workflows | €30/month |
| HubSpot CRM | Client pipeline tracking | Free tier |
| Lemlist | Alternative to Instantly | €79/month |
| Expandi | LinkedIn automation | €99/month |

---

## AI Agent Workflows

### Agent 1: Research Agent

**Task:** Find and enrich prospect data

**Workflow:**
```
1. Query Apollo.io API for target companies
2. Extract: Company name, industry, size, revenue
3. Identify decision makers: CTO, VP Sales, Director level
4. Enrich with: Email, LinkedIn, recent company news
5. Output: CSV with 500 prospects/week
```

**AI Prompt:**
```
You are a B2B research specialist. For each prospect:
1. Identify their role and decision-making power
2. Find 1-2 personalization hooks (recent news, company event)
3. Assess fit based on: industry, company size, tech stack
4. Score each prospect 1-10 (10 = perfect fit)
Output: Structured data for personalization agent
```

---

### Agent 2: Personalization Agent

**Task:** Write custom outreach messages

**Workflow:**
```
1. Read prospect data from Research Agent
2. Generate subject line (A/B test 2 versions)
3. Write email body (3-4 sentences max)
4. Include personalization hook
5. Clear CTA (book a meeting)
6. Output: Ready-to-send email
```

**AI Prompt:**
```
You are a B2B copywriting expert. Write outreach emails that:
- Subject: 5-7 words, intriguing but not clickbaity
- Opening: Reference specific prospect detail (company news, role)
- Value prop: One clear benefit (not features)
- CTA: Simple ask (15-min call, demo)
- Tone: Professional but conversational
- Length: 75-125 words max
Generate 2 versions for A/B testing
```

---

### Agent 3: Outreach Agent

**Task:** Send emails, track responses

**Workflow:**
```
1. Load emails from Personalization Agent
2. Send via Instantly.ai API (rate-limited)
3. Track: Sent, opened, clicked, replied
4. A/B test: Subject lines, messaging
5. Pause sequences on reply
6. Notify Qualification Agent of responses
```

**Key Settings:**
- 50-100 emails/day per domain (warmup period)
- 3-5 follow-ups per prospect (spaced 3-4 days)
- Unsubscribe handling (automatic)

---

### Agent 4: Qualification Agent

**Task:** Handle replies, book meetings

**Workflow:**
```
1. Monitor inbox for replies
2. Classify: Interested, Not Interested, Need Info, Wrong Person
3. For "Interested": Send calendar link, answer questions
4. For "Need Info": Send case study, follow up
5. For "Not Interested": Polite close, remove from list
6. Book meetings on client's Calendly
7. Notify client of booked meeting
```

**AI Prompt:**
```
You are a sales qualification specialist. For each reply:
1. Assess interest level (Hot, Warm, Cold)
2. Answer questions briefly (don't oversell)
3. If interested: "Great! Here's a calendar link: [Calendly]"
4. If unsure: "Happy to share a quick case study first"
5. If not interested: "No problem, thanks for letting me know"
6. Log all interactions in CRM
```

---

## Launch Plan

### Week 1: Infrastructure Setup

**Day 1-2: Email Infrastructure**
- [ ] Buy 5 domains (for email warmup)
- [ ] Set up Google Workspace (5 email accounts)
- [ ] Configure DNS (SPF, DKIM, DMARC)
- [ ] Create Instantly.ai account
- [ ] Connect domains to Instantly
- [ ] Start email warmup (automated, 2-3 weeks)

**Day 3-4: AI Agent Setup**
- [ ] Create Apollo.io account
- [ ] Build Research Agent workflow
- [ ] Build Personalization Agent workflow
- [ ] Build Outreach Agent workflow
- [ ] Build Qualification Agent workflow
- [ ] Test end-to-end with 50 prospects (internal)

**Day 5: Landing Page + Materials**
- [ ] Create simple landing page (Carrd or Notion)
- [ ] Headline: "AI-Powered Lead Gen - 5-10 Meetings/Month"
- [ ] Add 3 bullet points on benefits
- [ ] Add Calendly link for discovery calls
- [ ] Prepare outreach template (for getting clients)

---

### Week 2: First Client Outreach

**Goal:** Book 5-10 discovery calls

**Target:** 100 prospects (companies who need lead gen)

**Outreach Template:**
```
Subject: Quick question about your pipeline

Hi [Name],

Saw [Company] is [recent event - hiring, funding, product launch]. 
Quick question: are you currently getting enough qualified meetings 
for your sales team, or is pipeline a challenge?

I run a small AI-powered lead gen service. We book 5-10 qualified 
meetings/month for B2B companies like yours. Pay only if we deliver.

Open to a 15-min chat to see if it's a fit?

Best,
John
```

**Channels:**
- LinkedIn (search: "Founder" + "B2B" + company size 10-200)
- Email (find via Apollo.io)
- Twitter/X (founders posting about sales challenges)

**Target Conversion:**
- 100 outreach → 10-15 replies → 5-10 calls booked

---

### Week 3: Close Pilot Clients

**Goal:** Close 2-3 pilot clients

**Discovery Call Script:**
```
1. Understand their situation (5 min)
   - "What's your current lead gen process?"
   - "How many meetings/month do you need?"
   - "What's a meeting worth to you?"

2. Present our solution (5 min)
   - "We use AI agents to book 5-10 meetings/month"
   - "You focus on closing, we handle prospecting"
   - "€2,000-3,000/month, cancel anytime"

3. Handle objections (5 min)
   - "We've tested this extensively"
   - "Pilot pricing for first 3 clients"
   - "No long-term contract"

4. Close (5 min)
   - "Want to start with a 1-month pilot?"
   - "I'll send the agreement, we start Monday"
```

**Pilot Pricing:**
- €1,500-2,000/month (discounted for case study)
- 1-month commitment
- Testimonial + case study required if happy

---

### Week 4: Deliver + Get Testimonials

**Goal:** Book meetings for pilot clients, get testimonials

**Deliver:**
- [ ] Launch campaigns for pilot clients
- [ ] Monitor daily, adjust messaging
- [ ] Book 5-10 meetings per client
- [ ] Weekly check-in calls

**Get Testimonials:**
- [ ] After first meetings booked: "Happy with the results?"
- [ ] Request written testimonial
- [ ] Request permission for case study
- [ ] Add to landing page

**Raise Prices:**
- New clients: €2,500-3,000/month
- Based on proven results

---

## Month 2-3: Scale

### Goals
- 5 total clients
- €10,000-15,000/month revenue
- 5+ case studies

### Actions
- [ ] Increase outreach volume (200 prospects/week)
- [ ] Add LinkedIn automation (Expandi)
- [ ] Hire VA for edge cases (€500/month)
- [ ] Build referral program (€500 per referral)
- [ ] Create content (LinkedIn posts on lead gen)

---

## Month 4-6: Specialize

### Pick ONE Vertical

**Options:**
- German SaaS companies (€1M-10M revenue)
- Manufacturing companies exporting to EU
- Professional services (consulting, legal, finance)
- Marketing agencies (B2B focus)

**Why Specialize:**
- Messaging gets better (industry-specific)
- Higher conversion rates
- Referrals within industry
- Start building DATA MOAT

### Raise Prices
- Specialized service: €3,000-5,000/month
- Performance bonus: €100-200/meeting beyond guarantee

---

## Year 2+: Build Moat

### What You Have by Now
- 30-50 clients in one industry
- Proprietary data: What messaging works by company size, role
- Case studies: "We booked 500+ meetings for [industry]"
- Reputation: THE lead gen expert for this vertical

### Expansion Options
1. **Higher-tier service:** €10,000-20,000/month (full sales pipeline)
2. **Productize:** Sell AI workflows as SaaS
3. **Consulting:** Teach other agencies your system
4. **Adjacent services:** Compliance, CRM setup, sales training

---

## Risk Assessment

### Technical Risks
| Risk | Probability | Mitigation |
|------|-------------|------------|
| Email deliverability issues | Medium | Multiple domains, warmup, follow best practices |
| AI writes bad messages | Low | Human review first week, iterate prompts |
| Apollo/Instantly API changes | Low | Have backups (ZoomInfo, Lemlist) |

### Market Risks
| Risk | Probability | Mitigation |
|------|-------------|------------|
| Can't find clients | Low | High demand, results-based selling |
| Clients churn quickly | Medium | Deliver results, communicate weekly |
| Price pressure from competitors | Medium | Specialize, build reputation |

### Overall Risk: **Low-Medium**
- No trust/credibility barrier (results speak)
- Fast to first revenue (1-2 weeks)
- Low investment (<€500)
- Clear demand (every B2B company needs leads)

---

## Success Metrics

### Week 1-2 (Setup + First Outreach)
- [ ] Email infrastructure live
- [ ] AI agents working end-to-end
- [ ] 100 prospects contacted
- [ ] 5-10 discovery calls booked

### Month 1 (First Clients)
- [ ] 2-3 pilot clients closed
- [ ] 10-20 meetings booked for clients
- [ ] 2+ testimonials collected
- [ ] €3,000-6,000 revenue

### Month 2-3 (Scale)
- [ ] 5 total clients
- [ ] 50+ meetings booked total
- [ ] €10,000-15,000/month revenue
- [ ] 5+ case studies

### Month 4-6 (Specialize)
- [ ] Picked one vertical
- [ ] Raised prices 30-50%
- [ ] 70%+ clients from referrals
- [ ] €20,000-30,000/month revenue

---

## Key Success Factors

### Must Work:
1. **Email deliverability** - Follow warmup, don't spam
2. **Message quality** - AI must write good, personalized emails
3. **Meeting quality** - Booked meetings must be qualified (not random)
4. **Client communication** - Weekly updates, transparent reporting

### Where Human Supervision Needed:
- First week: Review all AI output, adjust prompts
- Ongoing: Edge cases (unusual replies, complex questions)
- Client calls: Weekly check-ins (30 min each)
- **Total time:** 1-2 hours/day max

### Kill Signals:
- <5% reply rate after 200 emails (messaging problem)
- <20% of booked meetings are qualified (targeting problem)
- >50% client churn in first 3 months (delivery problem)

---

## Competitive Landscape

### Direct Competitors

| Competitor | Pricing | Weakness | Our Edge |
|------------|---------|----------|----------|
| Traditional agencies | €5,000-15,000/month | Human labor, slow, expensive | 3x cheaper, AI speed |
| Freelancers (Upwork) | €1,000-3,000/month | Inconsistent, turnover | Consistent AI quality |
| Apollo.io (self-serve) | €99/month | Tool only, no done-for-you | Full service |
| In-house SDR | €4,000-6,000/month | One person, limited capacity | Scalable AI |

### Our Differentiation:
- **AI-native:** Built for AI from ground up (not humans + AI tools)
- **Results-based:** Pay for meetings, not effort
- **Scalable:** AI can handle 10x volume without hiring
- **Transparent:** Real-time dashboard, see everything

---

## FAQ

**Q: Isn't this just spam?**  
A: No - personalized outreach to relevant prospects who might benefit. We follow GDPR, include unsubscribe, respect "no thanks."

**Q: What if clients don't close the meetings we book?**  
A: Our job is qualified meetings, not closed deals. We qualify for: budget, authority, need, timeline. If their sales team can't close, that's on them.

**Q: Can't clients just do this themselves?**  
A: Yes, but they'd need to: hire SDRs (€60k/year), buy tools (€500/month), train them (months). We're cheaper, faster, proven.

**Q: What industries work best?**  
A: B2B with €10k+ deal values. SaaS, consulting, professional services, manufacturing. Avoid B2C, low-ticket, very niche markets.

**Q: How long until we can replace Uncle John's supervision?**  
A: Realistically 6-12 months. Need to build edge case handling, quality assurance. Goal: <30 min/day by month 6.

---

## Next Steps (Tuesday Morning)

### Day 1 (Tuesday): Infrastructure
- [ ] Buy 5 domains
- [ ] Set up Google Workspace
- [ ] Create Instantly.ai account
- [ ] Start email warmup

### Day 2-3: AI Agents
- [ ] Create Apollo.io account
- [ ] Build 4 agent workflows
- [ ] Test end-to-end

### Day 4-5: Client Outreach
- [ ] Create landing page
- [ ] Write outreach template
- [ ] Contact 100 prospects
- [ ] Book 5-10 discovery calls

### Week 2: Close Pilots
- [ ] Conduct discovery calls
- [ ] Close 2-3 pilot clients
- [ ] Start their campaigns

---

**Report saved:** `/home/poomk/.openclaw/workspace/business_idea/ai-lead-generation-business-plan.md`

🐕
