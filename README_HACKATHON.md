# 🛡️ Guardy AI - Auth0 Hackathon Entry

**Security-First AI Email Agent Powered by Auth0**

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Opens at: http://localhost:3000

---

## 🔧 Configuration

All credentials are in `.env`:

```env
REACT_APP_AUTH0_DOMAIN=dev-y8cutz08vkihgrds.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=dGUmAoflp7MMY27jI8PhBKqL1D7W50Aw
REACT_APP_AUTH0_M2M_CLIENT_ID=TpP3jBs4HyU7vdcpyrfdLwdrBbGUNafM
REACT_APP_OPENAI_KEY=sk-proj-xxxxx
REACT_APP_GMAIL_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

---

## 🎯 Demo Walkthrough

**See DEMO_SCRIPT.md for step-by-step demo** (5 minutes)

### Quick Demo:
1. ✅ Login with Auth0
2. ✅ Select language → Try "AI Reply"
3. ✅ Create a Team (👥 Teams)
4. ✅ Toggle permissions OFF/ON
5. ✅ Export audit log

---

## 🏆 Auth0 Features Showcased

| Feature | Implementation | Value |
|---------|---|---|
| **Organizations** | Create teams, invite members | Multi-tenancy |
| **M2M Auth** | Backend token authentication | Service-to-service security |
| **RBAC** | Permission-based action control | Fine-grained access |
| **Custom Claims** | Store permissions in token | Scalable permission system |
| **Audit Logging** | Complete action history export | Compliance ready |
| **Social Login** | Auth0 OAuth integration | Enterprise ready |

---

## 🚀 Technology Stack

- **Frontend:** React 18, Auth0 React SDK
- **AI:** OpenAI API (GPT-3.5-turbo)
- **Auth:** Auth0 with Organizations
- **Core Features:** Real-time AI, multi-language, teams

---

## 📊 Key Metrics

- **5 Languages:** English, Hindi, Tamil, French, Spanish
- **3-Tier Risk Engine:** Safe → Sensitive → Dangerous
- **100% Permission-Based:** Zero unauthorized actions
- **Multi-Tenant:** Unlimited teams
- **Audit Trail:** Complete action history

---

## 📚 Documentation

- **DEMO_SCRIPT.md** - Detailed demo guide (5 min)
- **HACKATHON_FEATURES.md** - Full feature explanation
- **README.md** - This file

---

## 🔐 Security Highlights

1. **Permission (not Forgiveness)**
   - User grants permissions upfront
   - AI respects boundaries
   - 🔐 Token Vault controls AI capabilities

2. **Audit Everything**
   - Every action logged with timestamp
   - User ID attached (from Auth0)
   - Exportable audit reports

3. **Risk-Based Approval**
   - Automated risk assessment
   - User approval for sensitive actions
   - Blocked for dangerous domains

4. **Auth0 Multi-Tenancy**
   - Organizations for team isolation
   - Role-based access levels
   - Compliance-ready architecture

---

## 👤 Demo Account

Use the Auth0 login screen:
- Any email/password creates account
- Or use social login (Google, GitHub, etc.)
- First time shows onboarding tutorial

---

## 🎮 How to Use

### **1. Select Language**
Click language dropdown (top-right) → Pick language → AI replies in that language

### **2. Try AI Actions**
- **👁 Read** - Mark email as read
- **📝 Summarize** - AI generates summary
- **✍️ AI Reply** - AI drafts a reply

### **3. Create a Team**
Click **👥 Teams** → Enter name → Invite colleagues via email

### **4. Control Permissions**
Toggle permissions in **Token Vault** (left sidebar) → See AI respect your choices

### **5. Export Audit Log**
Click **📋 Audit Log** → Download JSON with complete action history

---

## 💡 Use Cases

**For Enterprises:**
- Control what AI can do (via permissions)
- Track every action (audit logs)
- Manage teams with roles (orgs)
- Multi-language support

**For Developers:**
- Reference real Auth0 implementation
- Multi-tenant SaaS architecture
- Permission-based access control
- OpenAI integration patterns

**For Users:**
- AI that respects privacy
- Email replies in seconds
- Multi-language support
- Team collaboration

---

## 📞 Support

For questions or issues:

1. **Auth0 Setup Issues?**
   - Check `.env` has all credentials
   - Verify M2M app has permissions

2. **OpenAI Not Working?**
   - Ensure API key is valid
   - Check account has credits
   - Review API usage limits

3. **Login Issues?**
   - Clear browser cache
   - Verify Auth0 domain is correct
   - Check CORS settings

---

## 🎯 Judges: Focus On

1. **Real Auth0 Integration** - Not a tutorial, production patterns
2. **Multi-Tenancy** - Organizations, teams, isolation
3. **Permission Model** - RBAC done right
4. **Audit Trail** - Compliance ready
5. **Real AI** - Not templated, actual OpenAI
6. **Security First** - Permission, not forgiveness

---

## 📝 License

MIT

---

**Good luck! 🚀**

Questions? Check HACKATHON_FEATURES.md or DEMO_SCRIPT.md
