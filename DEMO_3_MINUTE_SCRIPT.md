# 🎬 3-Minute Hackathon Demo Script

## Pre-Demo (1 minute before)
- ✅ Click "🎬 Setup Demo" button → Loads demo data
- ✅ Refresh page to load "Sales Team" 
- ✅ Grant notifications permission (optional)
- ✅ Ensure "SEND" permission is OFF in Token Vault

---

## Demo Timeline (3:00 total)

### **0:00-0:20 | Login & Orientation**
**What to show:**
- You're logged in via Auth0
- Point to navbar: "Powered by Auth0 authentication"
- Show user email in top-right
- **Say:** "Guardy AI is a secure email agent. Everything is authenticated and audited."

### **0:20-0:45 | Show Token Vault (Permissions)**
**What to show:**
- Point to left sidebar "Token Vault"
- Show 3 toggles: READ (✅ ON), SUMMARIZE (✅ ON), SEND (❌ OFF)
- **Say:** "This is role-based access control. Users can only do actions we grant them. Right now, sending is blocked."

### **0:45-1:30 | Demo Permission Enforcement**
**What to show:**
1. Click on first email (Sarah Johnson)
2. Click "✍️ AI Reply" button
3. **Expected:** 🔴 Danger modal appears - "SEND permission blocked"
4. **Say:** "Permission denied. Guardy AI tried to act, but RBAC stopped it. This is enterprise security."
5. Turn ON "SEND" permission toggle
6. Click "✍️ AI Reply" on same email again
7. Change language to Hindi (🇮🇳 HI)
8. **Expected:** AI generates reply in Hindi automatically
9. **Say:** "Now it works! Multi-language AI, permission-based access. This scales across organizations."

### **1:30-2:30 | Show Auth0 Organizations**
**What to show:**
1. Click "👥 Teams" button
2. Show pre-created "Sales Team" with 3 members listed
3. Point out: alice@company.com, bob@company.com, carol@company.com
4. **Say:** "This is Auth0 Organizations - multi-tenant architecture. Each team is isolated. RBAC applies per-org. In production, each customer gets their own organization."
5. Optional: Create new team "Support Team" to show creation flow (takes 10 seconds)
6. **Say:** "Creating organizations in real-time. Auth0 handles multi-tenancy, we focus on the experience."

### **2:30-2:50 | Audit Logging**
**What to show:**
1. Click "📋 Audit Log" button
2. Show JSON export with timestamps, user IDs, actions
3. **Say:** "Complete audit trail. Every action logged - who did what, when. User ID tracked. GDPR-ready. For compliance."

### **2:50-3:00 | Closing**
**Say:** 
"That's Guardy AI on Auth0. 
- Secure authentication
- Role-based access control
- Multi-tenant organizations
- Audit logging
- Real AI integration
- Production-ready architecture.

Auth0 does the heavy lifting. We focus on user experience."

---

## Backup Talking Points (if asked)

**"How does this scale?"**
- Auth0 Organizations handles 1000+ tenants
- Each has independent RBAC + audit trail
- M2M authentication keeps it secure

**"Production ready?"**
- No, this is a demo. Production version would add:
  - Real email backend (SMTP)
  - Persistent database
  - Advanced workflow automation
- But the Auth0 architecture is production-grade

**"What makes this different?"**
- Real M2M auth (not mocked)
- Real Organizations (not fake)
- Real audit logging (exportable)
- Real OpenAI (not placeholder)

---

## Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| "I forgot to setup demo" | Click 🎬 Setup Demo in navbar → Refresh |
| "Permission still blocked" | Make sure SEND toggle is ON before clicking Reply |
| "AI reply didn't generate" | Check OpenAI key in .env |
| "Teams don't show" | Click 🎬 Setup Demo → Refresh page |
| "Audit log won't export" | Make sure you have actions in the log first |

---

## Remember
- **Pace:** Slow, confident. Judges want to understand, not impressed by speed.
- **Focus:** Auth0 features. That's what they score.
- **Confidence:** You understand enterprise architecture.
- **Time:** 3 minutes max. Practice this script 10x.

Good luck. You're going to win. 🚀
