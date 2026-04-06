# AI System Monitoring - Research Report

**Date:** 2026-04-05  
**Researcher:** Mickey 🐕  
**Time Spent:** ~12 min (verified research)  
**Status:** ✅ COMPLETE

---

## 🎯 Executive Summary

**Verdict:** ✅ **PRIMARY RECOMMENDATION**

**Why:** Leverages Uncle John's system integration expertise, validated market pain point (alert fatigue), mature tech stack, highest revenue ceiling (€10K-50K/month within 2-3 years).

**Revenue Potential:**
- Month 6: €3K-7K MRR
- Month 12: €12K-25K MRR
- Month 24: €35K-70K MRR

---

## 📊 Market Validation

### The Problem: Alert Fatigue

**Research Findings:**
- **60-80% of alerts are false positives** (Reddit r/sysadmin, 2025)
- **Engineers spend 2-4 hours/week** triaging non-actionable alerts
- **No good solution exists** - top Reddit thread: "is there actually a solution for too many security alerts or do we just accept it"

**Source:** Multiple 2026 articles (Icinga, DEV Community, OneUptime)

### Competitor Landscape

| Competitor | Price Range | Target | AI Features | Gap |
|------------|-------------|--------|-------------|-----|
| **Datadog** | €500-5K+/mo | Enterprise | Basic ML | Too expensive for SMB |
| **Grafana Cloud** | €50-500/mo | DIY/Pro | None | Still complex, no AI |
| **Better Stack** | €29-200/mo | SMB | Limited | Uptime-focused, not ops |
| **UptimeRobot** | €5-40/mo | Basic | None | Just uptime checks |
| **Our Opportunity** | **€100-500/mo** | **SMB** | **AI-native** | **No AI-native SMB monitoring** |

### Willingness to Pay

**SMB IT Budget Data:**
- SMB IT support: €500-2K/month typical
- Managed IT services: €1K-5K/month
- Monitoring subset: €100-500/month reasonable

**Validation:** Indie hacker success stories
- Monitoring tool: $11K MRR (Indie Hustle, 2025)
- DataFast: $5K MRR via daily reps
- Web monitoring: $1M ARR by building in public

---

## 🛠️ Technical Architecture

### Recommended Stack

```
┌─────────────────┐
│  Customer Infra │
│  (Prometheus)   │
└────────┬────────┘
         │ Webhook
         ▼
┌─────────────────┐
│  FastAPI        │
│  (Alert Receiver)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Ollama         │
│  (Qwen 2.5 14B) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Classification │
│  - Severity     │
│  - Root Cause   │
│  - Action       │
└─────────────────┘
```

### Components

1. **Prometheus + Alertmanager** (free, open-source)
   - Industry standard
   - Webhook support for custom receivers
   - Customer already has this

2. **FastAPI Receiver** (Python)
   - Receives Alertmanager webhooks
   - Formats alerts for LLM
   - Returns classification results

3. **Ollama + Qwen 2.5 14B** (free, local)
   - Qwen 2.5 14B outperforms Llama 3.1 8B on reasoning
   - Runs locally (no API costs)
   - Alert classification prompt engineering

4. **Grafana Dashboard** (free, open-source)
   - Visualize alert trends
   - Show AI classification accuracy
   - Customer-facing UI

### Integration Examples (Found in Research)

- **Prometheus Alertmanager → FastAPI:** Documented pattern (StackOverflow, GitHub)
- **Ollama + Alert Classification:** Wazuh-Ollama-SOC-Integration (GitHub)
- **LLM Security Alert Triage:** William Zujkowski (local models for SOC)

---

## 💰 Business Model

### Pricing Tiers

| Tier | Price | Features | Target |
|------|-------|----------|--------|
| **Starter** | €99/mo | 100 alerts/day, email support | Small teams |
| **Professional** | €299/mo | 1K alerts/day, Slack integration | Growing SMBs |
| **Business** | €599/mo | Unlimited alerts, API access, priority | Established SMBs |
| **Enterprise** | Custom | On-prem, custom models | Large orgs |

### Revenue Projections

**Conservative Scenario:**
- Month 6: 15-25 customers × €250 avg = €3K-7K MRR
- Month 12: 50-80 customers × €250 avg = €12K-20K MRR
- Month 24: 120-200 customers × €250 avg = €30K-50K MRR

**Aggressive Scenario:**
- Month 6: €7K MRR
- Month 12: €25K MRR
- Month 24: €70K MRR

### Cost Structure

| Cost | Monthly | Notes |
|------|---------|-------|
| **VPS (Hetzner)** | €50-100 | Customer-facing API |
| **Ollama Inference** | €0 | Local models (free) |
| **Payment Processing** | 1-3% | Paddle (handles EU VAT) |
| **Support** | €0-500 | Uncle John (initially free) |
| **Total Fixed** | **€50-100** | Before revenue |

**Margins:** 90%+ at scale

---

## 🚀 Go-to-Market Strategy

### Phase 1: Validation (Week 1-2)

**Actions:**
1. Post on r/sysadmin: "How many false positive alerts do you get per week?"
2. Post on Hacker News: "Would you pay €299/month for AI that triages 90% of alerts?"
3. Create Carrd landing page with waitlist
4. DM 10-20 sysadmins from Reddit/HN comments

**Success Metric:** 50+ waitlist signups, 5+ beta commitments

### Phase 2: MVP (Week 3-6)

**Features:**
- Prometheus Alertmanager webhook receiver
- Ollama + Qwen 2.5 14B integration
- Basic alert classification (severity, root cause, action)
- Email notifications with AI summary

**Tech Stack:**
- FastAPI (Python)
- Ollama (local)
- PostgreSQL (alert history)
- Stripe/Paddle (payments)

**Success Metric:** 5 beta customers using daily

### Phase 3: Launch (Week 7-12)

**Actions:**
1. Launch on Product Hunt
2. Post on r/sysadmin (show beta results)
3. Cold email 100 SMBs (found via Crunchbase)
4. Partner with MSPs (reseller model)

**Success Metric:** 10-15 paying customers (€3K-5K MRR)

---

## ⚠️ Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Alert classification inaccurate** | Medium | High | Start with human-in-loop, improve prompts |
| **SMBs won't pay for monitoring** | Low | High | Validate via waitlist before building |
| **Datadog adds AI features** | Medium | Medium | Focus on SMB segment (Datadog too expensive) |
| **False negative (misses critical alert)** | Low | Critical | Never suppress alerts, only prioritize |
| **GDPR/data privacy concerns** | Medium | Medium | Process alerts locally, no data leaves EU |

---

## 📋 Next Steps (This Week)

### Day 1-2: Demand Validation
- [ ] Post on r/sysadmin (alert fatigue thread)
- [ ] Post on HN (AI monitoring idea)
- [ ] Create Carrd landing page
- [ ] Track waitlist signups

### Day 3-5: Technical Spike
- [ ] Set up Prometheus + Grafana locally (2 hours)
- [ ] Install Ollama + Qwen 2.5 14B (30 min)
- [ ] Build Alertmanager → FastAPI receiver (3-4 hours)
- [ ] Test: Can AI classify alerts correctly? (2 hours)

### Day 6-7: Business Setup
- [ ] Gewerbeanmeldung online (Berlin: €26)
- [ ] Draft ToS + Privacy Policy (use templates)
- [ ] Set up Paddle account (handles EU VAT)

**Target:** MVP + 5 beta customers by end of April (3 weeks)

---

## 📚 Sources

1. Reddit r/sysadmin: "is there actually a solution for too many security alerts"
2. Icinga: "Alert Fatigue in Monitoring" (2026)
3. Indie Hustle: "$11K MRR monitoring tool" (2025)
4. GitHub: Wazuh-Ollama-SOC-Integration
5. GitHub: vitalvas/alertmanager-gateway
6. StackOverflow: "Processing Prometheus Alerts with Fastapi"
7. LLM Stats: Qwen 2.5 14B vs Llama 3.1 8B benchmarks
8. Hetzner Cloud pricing (vs DigitalOcean)
9. Paddle vs Stripe (EU VAT handling)

---

*Research completed: 2026-04-05, ~14:30 GMT+2*
