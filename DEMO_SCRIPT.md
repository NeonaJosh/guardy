# 🎤 Guardy AI - Hackathon Demo Script (3-5 min)

## Opening (30 seconds)
```
"Hi! I'm presenting Guardy AI - a security-first AI email assistant built on Auth0.

The problem: Email overload. The average professional spends 28% of their day on email.

The solution: AI that YOU control, not an AI that controls you.

Let me show you 5 killer features."
```

---

## **Feature 1: Real AI Replies in Any Language (1 min)**

**Action:**
1. Click language dropdown → Select **"🇮🇳 HI"** (Hindi)
2. Click **"🤖 Summarize"** on first email
   - *System shows loading spinner*
3. Wait 3-5 seconds for OpenAI response
4. **BOOM** - Hindi summary appears
5. Click **"✍️ AI Reply"**
6. Wait for reply to generate
7. Show generated Hindi reply in compose box

**Say:**
```
"This is REAL AI - powered by OpenAI's GPT-3.5.

Notice: We selected HINDI and got a Hindi-language response.
The email content is analyzed in context, not template-based.

Behind the scenes:
- OpenAI API call with email content
- Language-aware prompt engineering
- Multi-language support: 5 languages today, unlimited tomorrow

This shows production-grade AI integration."
```

---

## **Feature 2: Auth0 Organizations for Teams (1.5 min)**

**Action:**
1. Click **"👥 Teams"** button in navbar
2. Enter team name: `"Sales Dream Team"`
3. Click **"Create"**
   - *Modal shows success*
4. Show organization in left side
5. Click on team → Invite email
6. Enter: `teammate@example.com`
7. Click **"Invite"**

**Say:**
```
"Watch me create a team and invite a colleague - all powered by Auth0 Organizations.

Step 1: Create team '

Sales Dream Team'
- This creates an Auth0 Org in the backend
- Check our Auth0 dashboard [optional], the organization is REAL

Step 2: Invite a teammate
- We just sent an Auth0 invitation email
- They'll receive it and join our organization
- This is Auth0 Organizations in action

Why this matters for Auth0 judges:
- Real multi-tenancy - not simulated
- Organization-scoped data access
- Team members get org-specific permissions
- Ready for enterprise SSO

This is what enterprise SaaS looks like."
```

---

## **Feature 3: Permission Control - The Token Vault (1 min)**

**Action:**
1. Show left sidebar: "🔐 Token Vault"
2. Point to toggles: "👁 Read", "📝 Summarize", "📤 Send"
3. Toggle **"📤 Send"** OFF
4. Click **"AI Reply"** on an email
5. See **🔴 Blocked** modal: "You have not granted permission..."
6. Toggle **"📤 Send"** back ON
7. Click **"AI Reply"** again → Works!

**Say:**
```
"Here's where Guardy AI is DIFFERENT from every other AI tool.

Most AI assistants ask 'forgiveness' after the fact.
Guardy AI asks for 'permission' FIRST.

In the Token Vault, YOU decide what the AI can do:
- 👁 Read emails? YES/NO
- 📝 Summarize? YES/NO  
- 📤 Send replies? YES/NO

When we toggle SEND off and try to reply, the system blocks it.
When we toggle it back on, suddenly it works.

This is not a UI trick - it's backed by Auth0 custom claims.
Every action checks: 'Does this user have permission for this?'

Then it goes through our 3-tier Risk Engine:
- 🟢 Safe = Auto-execute (like Read)
- 🟡 Sensitive = Need approval (like Reply to trusted domain)
- 🔴 Dangerous = Blocked (like Reply to spam)

This is enterprise security."
```

---

## **Feature 4: Audit Logging for Compliance (45 seconds)**

**Action:**
1. Do 3-5 actions (Read, Summarize, Reply, etc)
2. Click **"📋 Audit Log"** button
3. Shows: "Audit log exported!"
4. Check Downloads folder → Opens JSON file
5. Show JSON structure: `[{sequence, timestamp, action, userId}]`

**Say:**
```
"One more Auth0 feature: Audit Logging for compliance.

After taking actions, I can export a complete audit trail.

[Show JSON]

Look at the structure:
- Sequence number (order of actions)
- Timestamp (when it happened)
- Action (what the user did)
- User ID (WHO did it - from Auth0 token)

This is HIPAA/SOC2 complaint audit logging.
Perfect for enterprises that need to prove 'who did what when.'"
```

---

## **Feature 5: Multi-Language Showcase (30 seconds)**

**Action:**
1. Change language to **"🇪🇸 ES"** (Spanish)
2. Show language badge updated in sidebar
3. Send a reply → See it in Spanish
4. Change to **"🇫🇷 FR"** (French)
5. Send another → See it in French

**Say:**
```
"Same AI, multiple languages.

Switch to Spanish → AI replies in Spanish.
Switch to French → AI replies in French.

This is production-ready internationalization.
Built for global teams."
```

---

## Closing Statement (30 seconds)

```
"Guardy AI demonstrates:
✅ Real OpenAI integration
✅ Auth0 Organizations for teams
✅ Permission-controlled architecture
✅ Audit logging for compliance
✅ Multi-language support

This isn't just a demo - it's production-ready SaaS.

Thank you!"
```

---

## 🎯 Demo Troubleshooting

**If OpenAI reply is slow:**
- "Network can slow down AI... let me try again"
- Have backup screenshot ready

**If organization creation fails:**
- "Sometimes Auth0 takes a moment... let me refresh"
- Explain the API call while waiting

**If email doesn't send:**
- "We're in demo mode without real email configured"
- "In production, this would actually send via EmailJS"

---

## ⏱️ Timing

- Opening: 30 sec
- Feature 1 (AI + Language): 1 min
- Feature 2 (Teams): 1.5 min
- Feature 3 (Permissions): 1 min
- Feature 4 (Audit): 45 sec
- Feature 5 (Multi-lang): 30 sec
- Closing: 30 sec

**Total: 5 minutes** ✅

