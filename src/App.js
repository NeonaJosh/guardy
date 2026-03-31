import React, { useState, useRef, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import emailjs from '@emailjs/browser';
import { generateAIReply, generateAISummary } from './services/openaiService';
import { createOrganization, inviteUserToOrganization, getOrganizationMembers, getUserOrganizations, acceptOrganizationInvite } from './services/auth0OrganizationsService';
import { setupDemoData, resetDemoData } from './utils/demoSetup';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  :root {
    --bg:#060612; --card:#11112a; --card2:#16163a;
    --border:rgba(255,255,255,0.07);
    --accent:#6c63ff; --accent2:#00d4ff; --accent3:#ff6b9d;
    --text:#f0f0ff; --muted:#7b7b9d; --success:#00e5a0;
    --warn:#f0a500; --danger:#ff4d4d;
  }
  html,body,#root{min-height:100%; overflow-y:auto;}
  body{background:var(--bg);font-family:'DM Sans',sans-serif;color:var(--text);}
  .bg-canvas{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none;}
  .orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:0.25;animation:drift 12s ease-in-out infinite alternate;}
  .orb-1{width:600px;height:600px;background:radial-gradient(circle,#6c63ff,transparent 70%);top:-200px;left:-100px;}
  .orb-2{width:500px;height:500px;background:radial-gradient(circle,#00d4ff,transparent 70%);top:100px;right:-150px;animation-delay:-4s;}
  .orb-3{width:400px;height:400px;background:radial-gradient(circle,#ff6b9d,transparent 70%);bottom:-100px;left:30%;animation-delay:-8s;}
  @keyframes drift{from{transform:translate(0,0) scale(1)}to{transform:translate(40px,30px) scale(1.1)}}
  .bg-grid{position:fixed;inset:0;z-index:0;background-image:linear-gradient(rgba(108,99,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(108,99,255,0.04) 1px,transparent 1px);background-size:48px 48px;pointer-events:none;}
  .guardy-root{min-height:100vh;background:var(--bg);color:var(--text);overflow-x:hidden;position:relative;}
  .page{position:relative;z-index:1;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;overflow-y:auto;}
  .badge{display:inline-flex;align-items:center;gap:8px;background:rgba(108,99,255,0.12);border:1px solid rgba(108,99,255,0.3);border-radius:100px;padding:6px 16px;font-size:12px;color:#a9a4ff;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:28px;animation:fadeUp 0.6s ease both;}
  .badge-dot{width:6px;height:6px;border-radius:50%;background:var(--success);box-shadow:0 0 8px var(--success);animation:pulse 2s infinite;}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.4)}}
  .hero-title{font-family:'Syne',sans-serif;font-size:clamp(52px,9vw,96px);font-weight:800;line-height:0.95;text-align:center;margin-bottom:24px;animation:fadeUp 0.6s ease 0.1s both;}
  .hero-title .line-1{display:block;color:var(--text);}
  .hero-title .line-2{display:block;background:linear-gradient(135deg,var(--accent),var(--accent2),var(--accent3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .hero-sub{font-size:17px;color:var(--muted);text-align:center;max-width:440px;line-height:1.7;margin-bottom:40px;animation:fadeUp 0.6s ease 0.2s both;}
  .features{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-bottom:40px;animation:fadeUp 0.6s ease 0.25s both;}
  .feature-pill{display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:100px;border:1px solid var(--border);background:rgba(255,255,255,0.03);font-size:13px;color:var(--muted);}
  .auth-card{width:100%;max-width:420px;background:var(--card);border:1px solid var(--border);border-radius:24px;padding:36px;box-shadow:0 40px 80px rgba(0,0,0,0.5);animation:fadeUp 0.6s ease 0.3s both;position:relative;overflow:hidden;}
  .auth-card::before{content:'';position:absolute;top:0;left:10%;right:10%;height:1px;background:linear-gradient(90deg,transparent,var(--accent),var(--accent2),transparent);opacity:0.6;}
  .tabs{display:flex;background:rgba(255,255,255,0.04);border-radius:12px;padding:4px;margin-bottom:28px;gap:4px;}
  .tab-btn{flex:1;padding:10px;border:none;border-radius:9px;background:transparent;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.2s;}
  .tab-btn.active{background:var(--accent);color:#fff;box-shadow:0 4px 16px rgba(108,99,255,0.4);}
  .btn-google{width:100%;display:flex;align-items:center;justify-content:center;gap:12px;padding:13px;background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:12px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;cursor:pointer;transition:all 0.2s;margin-bottom:20px;}
  .btn-google:hover{background:rgba(255,255,255,0.09);transform:translateY(-1px);}
  .divider{display:flex;align-items:center;gap:12px;margin-bottom:20px;color:var(--muted);font-size:12px;}
  .divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border);}
  .input-group{margin-bottom:14px;}
  .input-label{font-size:12px;color:var(--muted);margin-bottom:6px;display:block;letter-spacing:0.04em;}
  .input-field{width:100%;padding:12px 16px;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:15px;outline:none;transition:all 0.2s;}
  .input-field::placeholder{color:var(--muted);}
  .input-field:focus{border-color:var(--accent);background:rgba(108,99,255,0.06);box-shadow:0 0 0 3px rgba(108,99,255,0.15);}
  .btn-primary{width:100%;padding:14px;background:linear-gradient(135deg,var(--accent),#8b85ff);border:none;border-radius:12px;color:#fff;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.2s;margin-top:6px;}
  .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(108,99,255,0.45);}
  .terms{text-align:center;font-size:12px;color:var(--muted);margin-top:20px;line-height:1.6;}
  .terms-link{background:none;border:none;color:#a9a4ff;cursor:pointer;padding:0;font-size:12px;font-family:'DM Sans',sans-serif;text-decoration:underline;}
  .stats{display:flex;gap:40px;margin-top:48px;animation:fadeUp 0.6s ease 0.5s both;}
  .stat{text-align:center;}
  .stat-num{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .stat-label{font-size:12px;color:var(--muted);margin-top:2px;}
  .shield-wrap{display:inline-flex;align-items:center;justify-content:center;margin-bottom:20px;animation:fadeUp 0.5s ease both;}
  .shield-ring{width:72px;height:72px;border-radius:50%;background:rgba(108,99,255,0.1);border:1px solid rgba(108,99,255,0.3);display:flex;align-items:center;justify-content:center;animation:spin-ring 8s linear infinite;position:relative;}
  .shield-ring::before{content:'';position:absolute;width:6px;height:6px;border-radius:50%;background:var(--accent);top:-3px;left:50%;transform:translateX(-50%);box-shadow:0 0 10px var(--accent);}
  @keyframes spin-ring{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .shield-icon{font-size:28px;}
  .loading-screen{min-height:100vh;background:#060612;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;}
  .spinner{width:40px;height:40px;border:2px solid rgba(255,255,255,0.1);border-top-color:#6c63ff;border-radius:50%;animation:spin 0.8s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg)}}
  .loading-text{font-family:'Syne',sans-serif;color:#7b7b9d;font-size:14px;}
  .dash-wrap{position:relative;z-index:1;height:100vh;display:flex;flex-direction:column;}
  .dash-nav{display:flex;justify-content:space-between;align-items:center;padding:12px 24px;border-bottom:1px solid var(--border);background:rgba(6,6,18,0.8);backdrop-filter:blur(12px);position:sticky;top:0;z-index:100;flex-shrink:0;gap:8px;}
  .dash-logo{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;white-space:nowrap;}
  .dash-user{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
  .user-avatar{width:32px;height:32px;border-radius:50%;border:2px solid var(--accent);object-fit:cover;}
  .user-name{font-size:13px;color:var(--muted);max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .nav-btn{padding:6px 12px;background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:8px;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:12px;cursor:pointer;transition:all 0.2s;white-space:nowrap;}
  .nav-btn:hover{border-color:rgba(255,255,255,0.2);color:var(--text);}
  .nav-btn.active{border-color:var(--accent);color:var(--accent);}
  .btn-logout{padding:6px 12px;background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:8px;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:12px;cursor:pointer;transition:all 0.2s;}
  .btn-logout:hover{border-color:rgba(255,255,255,0.2);color:var(--text);}
  .dash-body{display:grid;grid-template-columns:260px 1fr 300px;flex:1;height:calc(100vh - 57px);overflow:hidden;}
  .sidebar{border-right:1px solid var(--border);padding:20px 14px;overflow-y:scroll;height:100%;background:rgba(13,13,32,0.5);}
  .sidebar-title{font-size:11px;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px;padding:0 8px;}
  .perm-item{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:10px;margin-bottom:6px;background:rgba(255,255,255,0.02);border:1px solid var(--border);}
  .perm-label{font-size:13px;display:flex;align-items:center;gap:8px;}
  .toggle{position:relative;width:36px;height:20px;cursor:pointer;}
  .toggle input{opacity:0;width:0;height:0;}
  .toggle-slider{position:absolute;inset:0;background:rgba(255,255,255,0.1);border-radius:20px;transition:0.3s;}
  .toggle-slider::before{content:'';position:absolute;width:14px;height:14px;left:3px;top:3px;background:#fff;border-radius:50%;transition:0.3s;}
  .toggle input:checked + .toggle-slider{background:var(--accent);}
  .toggle input:checked + .toggle-slider::before{transform:translateX(16px);}
  .vault-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(0,229,160,0.1);border:1px solid rgba(0,229,160,0.3);border-radius:8px;padding:8px 12px;margin-top:12px;font-size:12px;color:var(--success);width:100%;}
  .main-panel{overflow-y:scroll;height:100%;padding:20px;}
  .panel-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px;}
  .panel-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;}
  .new-email-btn{padding:7px 14px;background:linear-gradient(135deg,var(--accent),#8b85ff);border:none;border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;}
  .new-email-btn:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(108,99,255,0.4);}
  .email-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:10px;transition:all 0.2s;cursor:pointer;}
  .email-card:hover{border-color:rgba(108,99,255,0.4);background:var(--card2);}
  .email-card.unread{border-left:3px solid var(--accent);}
  .email-card.selected{border-color:var(--accent);background:var(--card2);}
  .email-meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;}
  .email-from{font-size:13px;font-weight:500;}
  .email-time{font-size:11px;color:var(--muted);}
  .email-subject{font-size:14px;font-weight:600;margin-bottom:4px;}
  .email-preview{font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .email-actions{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap;}
  .action-btn{padding:5px 12px;border-radius:8px;border:1px solid var(--border);background:rgba(255,255,255,0.04);color:var(--text);font-family:'DM Sans',sans-serif;font-size:12px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:5px;}
  .action-btn:hover{background:rgba(108,99,255,0.15);border-color:var(--accent);}
  .action-btn.loading{opacity:0.6;cursor:not-allowed;}
  .detail-panel{border-left:1px solid var(--border);padding:20px;overflow-y:scroll;height:100%;background:rgba(13,13,32,0.3);}
  .detail-title{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;margin-bottom:4px;}
  .detail-from{font-size:12px;color:var(--muted);margin-bottom:14px;}
  .detail-body{font-size:13px;line-height:1.8;color:var(--text);background:rgba(255,255,255,0.02);border-radius:10px;padding:14px;margin-bottom:14px;}
  .ai-result{background:rgba(108,99,255,0.08);border:1px solid rgba(108,99,255,0.2);border-radius:10px;padding:14px;margin-bottom:12px;}
  .ai-result-label{font-size:11px;color:var(--accent);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:8px;}
  .ai-result-text{font-size:13px;line-height:1.7;}
  .compose-section{margin-top:14px;}
  .compose-header{font-size:13px;font-weight:600;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--border);}
  .compose-label{font-size:11px;color:var(--muted);margin-bottom:5px;display:block;letter-spacing:0.04em;}
  .compose-input{width:100%;padding:9px 12px;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:8px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:13px;outline:none;margin-bottom:8px;transition:all 0.2s;}
  .compose-input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(108,99,255,0.15);}
  .compose-textarea{width:100%;padding:9px 12px;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:8px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:13px;outline:none;resize:vertical;min-height:120px;transition:all 0.2s;}
  .compose-textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(108,99,255,0.15);}
  .send-btn{width:100%;padding:11px;background:linear-gradient(135deg,var(--accent),#8b85ff);border:none;border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;margin-top:4px;}
  .send-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(108,99,255,0.4);}
  .send-btn:disabled{opacity:0.6;cursor:not-allowed;transform:none;}
  .log-section{margin-top:16px;}
  .log-title{font-size:11px;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;}
  .log-item{font-size:11px;padding:6px 8px;border-radius:6px;margin-bottom:4px;background:rgba(255,255,255,0.02);border:1px solid var(--border);line-height:1.5;}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(4px);}
  .modal-box{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:28px;max-width:480px;width:90%;box-shadow:0 40px 80px rgba(0,0,0,0.5);max-height:90vh;overflow-y:auto;}
  .modal-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;margin-bottom:6px;}
  .modal-msg{font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:20px;}
  .modal-btns{display:flex;gap:10px;flex-wrap:wrap;}
  .modal-confirm{flex:1;padding:11px;background:linear-gradient(135deg,var(--accent),#8b85ff);border:none;border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;min-width:100px;}
  .modal-cancel{flex:1;padding:11px;background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:10px;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;min-width:80px;}
  .modal-block{width:100%;padding:11px;background:rgba(255,77,77,0.1);border:1px solid rgba(255,77,77,0.3);border-radius:10px;color:var(--danger);font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;}
  .toast{position:fixed;bottom:24px;right:24px;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px 18px;font-size:13px;z-index:2000;animation:slideIn 0.3s ease;box-shadow:0 20px 40px rgba(0,0,0,0.4);max-width:320px;}
  .toast.success{border-color:rgba(0,229,160,0.4);color:var(--success);}
  .toast.error{border-color:rgba(255,77,77,0.4);color:var(--danger);}
  @keyframes slideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

  /* Onboarding overlay */
  .onboard-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:3000;display:flex;align-items:center;justify-content:center;}
  .onboard-box{background:var(--card);border:1px solid rgba(108,99,255,0.4);border-radius:20px;padding:32px;max-width:440px;width:90%;text-align:center;}
  .onboard-icon{font-size:48px;margin-bottom:16px;}
  .onboard-title{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;margin-bottom:10px;background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .onboard-text{font-size:14px;color:var(--muted);line-height:1.7;margin-bottom:24px;}
  .onboard-steps{display:flex;justify-content:center;gap:8px;margin-bottom:24px;}
  .onboard-dot{width:8px;height:8px;border-radius:50%;background:var(--border);}
  .onboard-dot.active{background:var(--accent);}
  .onboard-btn{padding:12px 32px;background:linear-gradient(135deg,var(--accent),#8b85ff);border:none;border-radius:12px;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s;}
  .onboard-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(108,99,255,0.45);}
  .onboard-skip{background:none;border:none;color:var(--muted);font-size:12px;cursor:pointer;margin-top:12px;text-decoration:underline;}

  /* Voice button */
  .voice-btn{padding:6px 12px;border-radius:8px;border:1px solid var(--border);background:rgba(255,255,255,0.04);color:var(--muted);font-family:'DM Sans',sans-serif;font-size:12px;cursor:pointer;transition:all 0.2s;}
  .voice-btn.listening{border-color:var(--danger);color:var(--danger);animation:pulse-border 1s infinite;}
  @keyframes pulse-border{0%,100%{box-shadow:0 0 0 0 rgba(255,77,77,0.4)}50%{box-shadow:0 0 0 6px rgba(255,77,77,0)}}

  /* Lang selector */
  .lang-select{padding:5px 10px;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:8px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:12px;outline:none;cursor:pointer;}

  /* Password toggle */
  .password-wrapper{position:relative;display:flex;align-items:center;}
  .password-field{flex:1;}
  .toggle-password{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:4px 8px;transition:color 0.2s;}
  .toggle-password:hover{color:var(--accent);}


  /* Chart canvas */
  .chart-wrap{background:rgba(255,255,255,0.02);border-radius:12px;padding:16px;margin-bottom:16px;}
  .chart-title{font-size:12px;color:var(--muted);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:12px;}
`;

// ── Multi-language summaries ─────────────────────────────
const LANG_SUMMARIES = {
  en: {
    1:'Sarah needs sign-off on 3 Q4 deliverables: mobile redesign, API rate limiting, onboarding flow. Engineering team blocked. Response needed this week.',
    2:'Partnership proposal from Rahul Mehta (CEO, ClientCo). 20% revenue share + co-marketing. Needs response by Thursday.',
    3:'Personal invite from Priya for a weekend trip to Pondicherry — Friday to Sunday. Needs headcount tonight.',
    4:'⚠️ SPAM: Fraudulent prize scam. Claims you won $5,000. Do NOT click any links.',
    5:'HR: Annual performance review next Tuesday 2PM in Conference Room B.',
  },
  hi: {
    1:'सारा को Q4 के 3 डिलीवरेबल्स पर साइन-ऑफ चाहिए। इंजीनियरिंग टीम रुकी हुई है। इस सप्ताह जवाब दें।',
    2:'राहुल मेहता (CEO, ClientCo) से साझेदारी प्रस्ताव। 20% रेवेन्यू शेयर। गुरुवार तक जवाब चाहिए।',
    3:'प्रिया की पुदुच्चेरी वीकेंड ट्रिप का न्योता। आज रात तक पुष्टि करें।',
    4:'⚠️ स्पैम: धोखाधड़ी वाला ईमेल। $5,000 जीत का झूठा दावा। किसी भी लिंक पर क्लिक न करें।',
    5:'HR: अगले मंगलवार 2 बजे वार्षिक प्रदर्शन समीक्षा।',
  },
  fr: {
    1:'Sarah a besoin d\'une approbation pour 3 livrables Q4. L\'équipe engineering est bloquée. Réponse nécessaire cette semaine.',
    2:'Proposition de partenariat de Rahul Mehta. Partage de revenus 20%. Réponse requise avant jeudi.',
    3:'Invitation de Priya pour un week-end à Pondichéry. Confirmer ce soir.',
    4:'⚠️ SPAM: Escroquerie frauduleuse. Prétend que vous avez gagné 5 000 $. Ne cliquez sur aucun lien.',
    5:'RH: Évaluation annuelle mardi prochain à 14h, Salle B.',
  },
  es: {
    1:'Sarah necesita aprobación para 3 entregables del Q4. El equipo de ingeniería está bloqueado. Respuesta necesaria esta semana.',
    2:'Propuesta de sociedad de Rahul Mehta. 20% de ingresos compartidos. Respuesta requerida antes del jueves.',
    3:'Invitación de Priya para un viaje de fin de semana a Pondicherry. Confirmar esta noche.',
    4:'⚠️ SPAM: Estafa fraudulenta. Afirma que ganaste $5,000. No hagas clic en ningún enlace.',
    5:'RRHH: Revisión anual el próximo martes a las 2PM en la Sala B.',
  },
  ta: {
    1:'சாரா Q4 3 பணிகளுக்கு ஒப்புதல் கேட்கிறார். பொறியியல் குழு தடுக்கப்பட்டுள்ளது. இந்த வாரம் பதில் தேவை.',
    2:'ராகுல் மேஹ்தாவிடமிருந்து கூட்டாண்மை திட்டம். 20% வருவாய் பங்கு. வியாழன் வரை பதில் தேவை.',
    3:'பிரியாவிடமிருந்து புதுச்சேரி வார இறுதி பயண அழைப்பு. இன்றிரவு உறுதிப்படுத்தவும்.',
    4:'⚠️ ஸ்பேம்: மோசடி மின்னஞ்சல். $5,000 வென்றதாக கூறுகிறது. எந்த இணைப்பையும் கிளிக் செய்யாதீர்கள்.',
    5:'HR: அடுத்த செவ்வாய் மதியம் 2 மணிக்கு வருடாந்திர மதிப்பாய்வு.',
  },
};

const LANG_REPLIES = {
  en: {
    1:'Hi Sarah,\n\nThank you for the follow-up. I am happy to provide my sign-off.\n\n1. Mobile app redesign specs — Approved\n2. API rate limiting strategy — Approved\n3. User onboarding flow — Minor revisions needed, will share by EOD.\n\nBest regards',
    2:'Dear Rahul,\n\nThank you for the partnership proposal. The terms look interesting.\n\nCould we schedule a 30-minute call this week? I am available Wednesday or Thursday morning.\n\nBest regards',
    3:'Hey Priya!\n\nCount me in! Pondicherry sounds amazing. See you Friday!\n\nCheers',
    4:'',
    5:'Hi,\n\nThank you for the reminder. I will be there on Tuesday at 2PM.\n\nBest regards',
  },
  hi: {
    1:'नमस्ते सारा,\n\nफॉलो-अप के लिए धन्यवाद। मैं अपनी स्वीकृति देने के लिए तैयार हूं।\n\n1. मोबाइल ऐप रिडिजाइन — स्वीकृत\n2. API दर सीमा — स्वीकृत\n3. ऑनबोर्डिंग फ्लो — मामूली बदलाव, आज EOD तक शेयर करूंगा।\n\nसादर',
    2:'प्रिय राहुल,\n\nसाझेदारी प्रस्ताव के लिए धन्यवाद। शर्तें दिलचस्प लगती हैं।\n\nक्या हम इस सप्ताह एक कॉल शेड्यूल कर सकते हैं?\n\nसादर',
    3:'नमस्ते प्रिया!\n\nमैं आ रहा हूं! पुदुच्चेरी की यात्रा शानदार होगी।\n\nधन्यवाद',
    4:'',
    5:'नमस्ते,\n\nयाद दिलाने के लिए धन्यवाद। मैं मंगलवार को 2 बजे वहां रहूंगा।\n\nसादर',
  },
  fr: {
    1:'Bonjour Sarah,\n\nMerci pour le suivi. Je suis heureux de donner mon approbation.\n\n1. Spécifications de refonte — Approuvé\n2. Stratégie API — Approuvé\n3. Flux d\'intégration — Révisions mineures, partagerai avant EOD.\n\nCordialement',
    2:'Cher Rahul,\n\nMerci pour la proposition de partenariat. Les termes semblent intéressants.\n\nPouvons-nous planifier un appel cette semaine?\n\nCordialement',
    3:'Salut Priya!\n\nJe suis partant! Pondichéry semble incroyable. À vendredi!\n\nAmicalement',
    4:'',
    5:'Bonjour,\n\nMerci pour le rappel. Je serai là mardi à 14h.\n\nCordialement',
  },
  es: {
    1:'Hola Sarah,\n\nGracias por el seguimiento. Estoy feliz de dar mi aprobación.\n\n1. Especificaciones de rediseño — Aprobado\n2. Estrategia de API — Aprobado\n3. Flujo de incorporación — Revisiones menores, compartiré antes del EOD.\n\nSaludos',
    2:'Estimado Rahul,\n\nGracias por la propuesta de asociación. Los términos parecen interesantes.\n\n¿Podríamos programar una llamada esta semana?\n\nSaludos',
    3:'¡Hola Priya!\n\n¡Cuenta conmigo! Pondicherry suena increíble. ¡Hasta el viernes!\n\nSaludos',
    4:'',
    5:'Hola,\n\nGracias por el recordatorio. Estaré allí el martes a las 2PM.\n\nSaludos',
  },
  ta: {
    1:'வணக்கம் சாரா,\n\nதொடர்புக்கு நன்றி. நான் என் ஒப்புதல் தர மகிழ்ச்சியாக இருக்கிறேன்.\n\n1. மொபைல் ரீடிசைன் — அங்கீகரிக்கப்பட்டது\n2. API விதி — அங்கீகரிக்கப்பட்டது\n3. ஆன்போர்டிங் ஃப்ளோ — சிறிய மாற்றங்கள், EOD க்குள் பகிர்வேன்.\n\nவணக்கம்',
    2:'அன்புள்ள ராகுல்,\n\nகூட்டாண்மை திட்டத்திற்கு நன்றி. விதிமுறைகள் சுவாரஸ்யமாக உள்ளன.\n\nஇந்த வாரம் ஒரு அழைப்பை திட்டமிட முடியுமா?\n\nவணக்கம்',
    3:'வணக்கம் பிரியா!\n\nநான் வருகிறேன்! புதுச்சேரி அருமையாக இருக்கும். வெள்ளியன்று சந்திப்போம்!\n\nநன்றி',
    4:'',
    5:'வணக்கம்,\n\nநினைவூட்டலுக்கு நன்றி. செவ்வாய் 2 மணிக்கு அங்கே இருப்பேன்.\n\nவணக்கம்',
  },
};

// ── Onboarding steps ────────────────────────────────────
const ONBOARD_STEPS = [
  { icon:'🛡️', title:'Welcome to Guardy AI!', text:'Your secure AI email agent powered by Auth0. Everything you do is protected and under your control.' },
  { icon:'�', title:'Teams & Organizations', text:'Click "👥 Teams" to create teams and invite colleagues. Powered by Auth0 Organizations for enterprise-grade multi-tenancy.' },
  { icon:'🔐', title:'Token Vault', text:'The left panel is your Token Vault. Toggle Read, Summarize, and Send permissions on or off. The AI can only do what YOU allow.' },
  { icon:'🤖', title:'AI Actions', text:'Click Read, AI Summarize, or AI Reply on any email. Real AI powered by OpenAI generates contextual responses.' },
  { icon:'🌍', title:'Multi-Language', text:'Change language in the top-right dropdown. AI replies automatically in your selected language - English, Hindi, Tamil, French, or Spanish.' },
  { icon:'⚡', title:'Risk Engine', text:'Every action is classified as 🟢 Safe, 🟡 Sensitive, or 🔴 Dangerous before execution. You approve sensitive ones, dangerous ones are blocked.' },
  { icon:'📋', title:'Audit Logging', text:'Click "📋 Audit Log" to export complete action history. Perfect for compliance and accountability tracking.' },
];

const MOCK_EMAILS = [
  { id:1, unread:true, from:'sarah.johnson@techcorp.com', name:'Sarah Johnson', subject:'Q4 Product Roadmap Review — Action Required', preview:'Hi, I wanted to follow up on the Q4 roadmap items we discussed...', body:'Hi,\n\nI wanted to follow up on the Q4 roadmap items we discussed in last Thursday\'s meeting. We need your sign-off on the three key deliverables before the end of this week:\n\n1. Mobile app redesign specs\n2. API rate limiting strategy\n3. User onboarding flow update\n\nCould you please review and let me know your thoughts? The engineering team is blocked until we get your approval.\n\nBest regards,\nSarah Johnson\nProduct Manager, TechCorp', time:'10:42 AM', category:'work' },
  { id:2, unread:true, from:'rahul.mehta@clientco.in', name:'Rahul Mehta', subject:'Partnership Proposal — Urgent Response Needed', preview:'Dear team, we have been reviewing your platform and believe there is a strong synergy...', body:'Dear team,\n\nWe have been reviewing your platform extensively and believe there is a strong synergy between our companies. We would like to propose a formal partnership arrangement.\n\nOur offer includes:\n- Revenue sharing: 20% on referred clients\n- Co-marketing opportunities\n- Priority API access for our 50,000 users\n\nWe have a board meeting on Friday and would love to present this partnership. Could you respond by Thursday EOD?\n\nWarm regards,\nRahul Mehta\nCEO, ClientCo', time:'9:15 AM', category:'business' },
  { id:3, unread:false, from:'priya@gmail.com', name:'Priya S', subject:'Weekend trip to Pondicherry?', preview:'Hey! A few of us are planning a quick trip this weekend, are you in?', body:'Hey!\n\nA few of us are planning a quick trip to Pondicherry this weekend — leaving Friday night, back Sunday evening. Budget friendly, beach house stay, amazing food.\n\nAre you in? Need to confirm numbers by tonight so we can book.\n\nLet me know!\nPriya', time:'Yesterday', category:'personal' },
  { id:4, unread:true, from:'noreply@suspicious-deals.xyz', name:'Prize Center', subject:'YOU HAVE WON $5,000!!! CLAIM NOW!!!', preview:'Congratulations! Your email has been selected for our grand prize draw...', body:'CONGRATULATIONS!!!\n\nYour email has been RANDOMLY SELECTED for our grand prize draw!\n\nYou have WON $5,000 USD!!!\n\nTo CLAIM your prize, click the link below and provide your bank details within 24 hours or the prize will be forfeited.\n\nPrize Committee', time:'Yesterday', category:'spam' },
  { id:5, unread:false, from:'hr@company.com', name:'HR Department', subject:'Performance Review — Scheduled for Next Week', preview:'This is a reminder that your annual performance review is scheduled...', body:'Hi,\n\nThis is a reminder that your annual performance review is scheduled for next Tuesday at 2:00 PM with your manager.\n\nPlease come prepared with:\n- A summary of your key achievements this year\n- Any challenges you faced\n- Your goals for the upcoming year\n\nThe meeting will be held in Conference Room B.\n\nBest,\nHR Department', time:'Mon', category:'work' },
  { id:6, unread:true, from:'boss@company.com', name:'Boss', subject:'Urgent Meeting Tomorrow at 10 AM', preview:'We need to have an urgent meeting tomorrow at 10 AM...', body:'Team,\n\nThere is an urgent matter that requires immediate attention. We will have a meeting tomorrow at 10 AM in the main conference room.\n\nPlease come prepared with status updates on your current projects.\n\nRegards,\nBoss', time:'3 hours ago', category:'work' },
  { id:7, unread:false, from:'friend@gmail.com', name:'Alex Friend', subject:'How are you doing?', preview:'Just checking in, how have you been lately?', body:'Hey,\n\nJust wanted to check in and see how you\'ve been. It\'s been a while since we last caught up.\n\nLet\'s grab coffee sometime this week!\n\nCheers,\nAlex', time:'2 days ago', category:'personal' },
];

function evaluateRisk(action, permissions) {
  // Map 'reply' action to 'send' permission since replying is sending
  const permissionType = action.type === 'reply' ? 'send' : action.type;
  if (!permissions[permissionType]) return { level:'dangerous', label:'🔴 Blocked', message:`You have not granted permission for the AI to "${action.type}" emails. Enable it in the Token Vault.` };
  if (action.type === 'read' || action.type === 'summarize') return { level:'safe', label:'🟢 Safe', message:'This is a read-only action. Executing automatically.' };
  if (action.type === 'send' || action.type === 'reply') {
    if (action.email && action.email.category === 'spam') return { level:'dangerous', label:'🔴 Dangerous', message:'This email looks like spam. Sending a reply is blocked to protect you.' };
    const trusted = ['gmail.com','techcorp.com','clientco.in','company.com'];
    if (trusted.some(d => action.to && action.to.includes(d))) return { level:'sensitive', label:'🟡 Sensitive', message:`AI wants to send an email to ${action.to}. This requires your approval.` };
    return { level:'dangerous', label:'🔴 Dangerous', message:'Recipient domain is not trusted. Sending blocked for your security.' };
  }
  return { level:'safe', label:'🟢 Safe', message:'Action is safe.' };
}

// ── Components ───────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return <div className={'toast ' + type}>{message}</div>;
}

function RiskModal({ risk, onConfirm, onCancel }) {
  if (!risk) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-title">{risk.label}</div>
        <div className="modal-msg">{risk.message}</div>
        {risk.level === 'dangerous'
          ? <button className="modal-block" onClick={onCancel}>Understood — Block this action</button>
          : <div className="modal-btns"><button className="modal-confirm" onClick={onConfirm}>✅ Approve and Send</button><button className="modal-cancel" onClick={onCancel}>❌ Cancel</button></div>
        }
      </div>
    </div>
  );
}

function TeamModal({ teams, selectedTeam, teamMembers, newTeamName, setNewTeamName, inviteEmail, setInviteEmail, onCreateTeam, onInvite, onAccept, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">👥 Team Management</div>
        
        <div style={{marginBottom:20}}>
          <div className="modal-msg" style={{marginBottom:12}}>Create or manage teams. Teams allow secure collaboration with role-based access control.</div>
          
          <div style={{marginBottom:16}}>
            <div className="compose-label">NEW TEAM NAME</div>
            <div style={{display:'flex',gap:8}}>
              <input className="compose-input" value={newTeamName} onChange={e=>setNewTeamName(e.target.value)} placeholder="e.g., Sales Team" style={{flex:1}}/>
              <button className="send-btn" onClick={onCreateTeam} style={{flex:0.3}}>Create</button>
            </div>
          </div>

          {teams.length > 0 && (
            <div style={{marginBottom:16}}>
              <div className="compose-label">TEAMS</div>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {teams.map(team=>(
                  <button key={team.id} onClick={()=>{}} className={'action-btn'+(selectedTeam?.id===team.id?'':' ')} style={{background:selectedTeam?.id===team.id?'var(--accent)':'rgba(255,255,255,0.04)',color:selectedTeam?.id===team.id?'#fff':'var(--text)',justifyContent:'flex-start'}}>{team.display_name || team.name}</button>
                ))}
              </div>
            </div>
          )}

          {selectedTeam && (
            <div>
              <div className="compose-label">INVITE MEMBER ({selectedTeam.display_name || selectedTeam.name})</div>
              <div style={{display:'flex',gap:8,marginBottom:12}}>
                <input className="compose-input" value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} placeholder="member@example.com" style={{flex:1}}/>
                <button className="send-btn" onClick={onInvite} style={{flex:0.25}}>Invite</button>
              </div>
              <div style={{fontSize:11,color:'var(--muted)'}}>💡 Members will receive an invitation email to join</div>
              
              {teamMembers.length > 0 && (
                <div style={{marginTop:16,paddingTop:16,borderTop:'1px solid var(--border)'}}>
                  <div className="compose-label">TEAM MEMBERS ({teamMembers.length})</div>
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    {teamMembers.map(member=>(
                      <div key={member.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 12px',background:'rgba(255,255,255,0.02)',borderRadius:8,border:'1px solid var(--border)',fontSize:12}}>
                        <div>
                          <div style={{color:'var(--text)',marginBottom:4}}>{member.email}</div>
                          <div style={{display:'flex',alignItems:'center',gap:6}}>
                            {member.status === 'pending_activation' ? (
                              <><span style={{display:'inline-flex',alignItems:'center',gap:4,color:'var(--warn)',fontSize:11}}>🟡 Pending</span></>
                            ) : (
                              <span style={{display:'inline-flex',alignItems:'center',gap:4,color:'var(--success)',fontSize:11}}>🟢 Active</span>
                            )}
                          </div>
                        </div>
                        {member.status === 'pending_activation' && (
                          <button onClick={()=>onAccept(member.id)} style={{padding:'6px 12px',background:'rgba(0,229,160,0.15)',border:'1px solid rgba(0,229,160,0.3)',borderRadius:6,color:'var(--success)',fontSize:11,cursor:'pointer',whiteSpace:'nowrap'}}>✓ Accept</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="modal-cancel" onClick={onClose} style={{width:'100%'}}>Close</button>
      </div>
    </div>
  );
}

// ── 3. Analytics Modal with Chart.js ────────────────────
function AnalyticsModal({ analytics, onClose }) {
  const barRef = useRef(null);
  const pieRef = useRef(null);
  const chartsRef = useRef({ bar: null, pie: null });

  useEffect(() => {
    if (!window.Chart) return;
    
    // Destroy previous charts
    if (chartsRef.current.bar) {
      chartsRef.current.bar.destroy();
      chartsRef.current.bar = null;
    }
    if (chartsRef.current.pie) {
      chartsRef.current.pie.destroy();
      chartsRef.current.pie = null;
    }

    try {
      // Bar chart — email categories
      const barCtx = barRef.current?.getContext('2d');
      if (barCtx) {
        chartsRef.current.bar = new window.Chart(barCtx, {
          type: 'bar',
          data: {
            labels: ['Work', 'Business', 'Personal', 'Spam'],
            datasets: [{ label: 'Emails', data: [analytics.work, analytics.business, analytics.personal, analytics.spam], backgroundColor: ['#6c63ff','#00d4ff','#00e5a0','#ff4d4d'], borderRadius: 6 }]
          },
          options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { ticks: { color:'#7b7b9d' }, grid: { color:'rgba(255,255,255,0.05)' } }, x: { ticks: { color:'#7b7b9d' }, grid: { display:false } } } }
        });
      }
      // Pie chart — read vs unread
      const pieCtx = pieRef.current?.getContext('2d');
      if (pieCtx) {
        chartsRef.current.pie = new window.Chart(pieCtx, {
          type: 'doughnut',
          data: {
            labels: ['Read', 'Unread'],
            datasets: [{ data: [analytics.read, analytics.unread], backgroundColor: ['#00e5a0','#6c63ff'], borderWidth: 0 }]
          },
          options: { responsive: true, plugins: { legend: { labels: { color:'#f0f0ff', font: { size: 12 } } } } }
        });
      }
    } catch (err) {
      console.error('Chart error:', err);
    }

    return () => {
      if (chartsRef.current.bar) chartsRef.current.bar.destroy();
      if (chartsRef.current.pie) chartsRef.current.pie.destroy();
    };
  }, [analytics]);

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{maxWidth:520}}>
        <div className="modal-title">📊 Analytics Dashboard</div>
        <div className="modal-msg">Powered by Auth0 user data and app activity.</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:10,marginBottom:20}}>
          {[['Total',analytics.total,'var(--accent)'],['Unread',analytics.unread,'var(--accent2)'],['AI Actions',analytics.aiActions,'var(--success)'],['Trust',analytics.trust+'/100','var(--warn)']].map(([l,v,c])=>(
            <div key={l} style={{background:'rgba(255,255,255,0.02)',border:'1px solid var(--border)',borderRadius:10,padding:12,textAlign:'center'}}>
              <div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div>
              <div style={{fontSize:11,color:'var(--muted)',marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
        <div className="chart-wrap">
          <div className="chart-title">Emails by Category</div>
          <canvas ref={barRef} height="120"/>
        </div>
        <div className="chart-wrap">
          <div className="chart-title">Read vs Unread</div>
          <canvas ref={pieRef} height="120"/>
        </div>
        <div className="modal-btns">
          <button className="modal-cancel" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── 3. Onboarding Tutorial ───────────────────────────────
function OnboardingTour({ onFinish }) {
  const [step, setStep] = useState(0);
  const current = ONBOARD_STEPS[step];
  const isLast = step === ONBOARD_STEPS.length - 1;
  return (
    <div className="onboard-overlay">
      <div className="onboard-box">
        <div className="onboard-icon">{current.icon}</div>
        <div className="onboard-title">{current.title}</div>
        <div className="onboard-text">{current.text}</div>
        <div className="onboard-steps">
          {ONBOARD_STEPS.map((_,i)=><div key={i} className={'onboard-dot'+(i===step?' active':'')}/>)}
        </div>
        <button className="onboard-btn" onClick={()=>isLast?onFinish():setStep(s=>s+1)}>
          {isLast ? '🚀 Get Started!' : 'Next →'}
        </button>
        <br/>
        <button className="onboard-skip" onClick={onFinish}>Skip tour</button>
      </div>
    </div>
  );
}

// ── Profile Modal ────────────────────────────────────────
function ProfileModal({ user, profileName, setProfileName, profileEmail, setProfileEmail, profilePicture, setProfilePicture, onSave, onClose, exportData }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-title">👤 User Profile</div>
        <div className="modal-msg">Your profile is secured by Auth0 authentication.</div>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
          {profilePicture
            ? <img src={profilePicture} alt="avatar" style={{width:52,height:52,borderRadius:'50%',border:'2px solid var(--accent)'}}/>
            : <div style={{width:52,height:52,borderRadius:'50%',background:'rgba(108,99,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>{(profileName||'U').charAt(0).toUpperCase()}</div>
          }
          <div style={{fontSize:13,color:'var(--muted)'}}>{user?.email}</div>
        </div>
        <div style={{marginBottom:12}}><label className="input-label">FULL NAME</label><input className="input-field" value={profileName} onChange={e=>setProfileName(e.target.value)}/></div>
        <div style={{marginBottom:12}}><label className="input-label">EMAIL</label><input className="input-field" value={profileEmail} onChange={e=>setProfileEmail(e.target.value)} type="email"/></div>
        <div style={{marginBottom:16}}><label className="input-label">AVATAR URL</label><input className="input-field" value={profilePicture} onChange={e=>setProfilePicture(e.target.value)} placeholder="https://..."/></div>
        <div className="modal-btns">
          <button className="modal-confirm" onClick={onSave}>💾 Save</button>
          <button className="modal-confirm" onClick={exportData} style={{background:'rgba(0,229,160,0.15)',color:'var(--success)'}}>📤 Export (GDPR)</button>
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (<><style>{styles}</style><div className="loading-screen"><div className="spinner"/><p className="loading-text">Loading Guardy AI...</p></div></>);
}

function LoginPage() {
  const { loginWithRedirect } = useAuth0();
  const [tab, setTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  return (
    <><style>{styles}</style>
    <div className="guardy-root">
      <div className="bg-canvas"><div className="orb orb-1"/><div className="orb orb-2"/><div className="orb orb-3"/></div>
      <div className="bg-grid"/>
      <div className="page">
        <div className="shield-wrap"><div className="shield-ring"><span className="shield-icon">🛡️</span></div></div>
        <div className="badge"><span className="badge-dot"/>Powered by Auth0 · Secure by design</div>
        <h1 className="hero-title"><span className="line-1">Meet</span><span className="line-2">Guardy AI</span></h1>
        <p className="hero-sub">Your AI email agent that reads, summarizes, and sends emails — safely, with you always in control.</p>
        <div className="features">
          <div className="feature-pill">🔐 Token Vault</div>
          <div className="feature-pill">🟢 Risk Engine</div>
          <div className="feature-pill">🤖 AI Agent</div>
          <div className="feature-pill">🎤 Voice</div>
          <div className="feature-pill">🌍 Multi-lang</div>
        </div>
        <div className="auth-card">
          <div className="tabs">
            <button className={'tab-btn'+(tab==='login'?' active':'')} onClick={()=>setTab('login')}>Log In</button>
            <button className={'tab-btn'+(tab==='signup'?' active':'')} onClick={()=>setTab('signup')}>Sign Up</button>
          </div>
          <button className="btn-google" onClick={()=>loginWithRedirect({authorizationParams:{connection:'google-oauth2'}})}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          <div className="divider">or {tab==='login'?'log in':'sign up'} with email</div>
          {tab==='signup'&&<div className="input-group"><label className="input-label">FULL NAME</label><input className="input-field" type="text" placeholder="Your name"/></div>}
          <div className="input-group"><label className="input-label">EMAIL ADDRESS</label><input className="input-field" type="email" placeholder="you@example.com"/></div>
          <div className="input-group"><label className="input-label">PASSWORD</label><div className="password-wrapper"><input className="input-field password-field" type={showPassword?'text':'password'} placeholder={tab==='signup'?'Create a strong password':'Enter your password'}/><button className="toggle-password" onClick={()=>setShowPassword(!showPassword)} title={showPassword?'Hide password':'Show password'}>{showPassword?'👁️':'👁️‍🗨️'}</button></div></div>
          <button className="btn-primary" onClick={()=>loginWithRedirect({authorizationParams:{screen_hint:tab==='signup'?'signUp':'login'}})}>
            {tab==='login'?'→ Log In to Guardy AI':'→ Create My Account'}
          </button>
          <p className="terms">
            {tab==='signup'
              ?<>By signing up you agree to our <button className="terms-link">Terms</button> and <button className="terms-link">Privacy Policy</button></>
              :<>Forgot your password? <button className="terms-link" onClick={()=>loginWithRedirect({authorizationParams:{screen_hint:'reset'}})}>Reset it here</button></>}
          </p>
        </div>
        <div className="stats">
          <div className="stat"><div className="stat-num">100%</div><div className="stat-label">Secure</div></div>
          <div className="stat"><div className="stat-num">3-tier</div><div className="stat-label">Risk Engine</div></div>
          <div className="stat"><div className="stat-num">5 langs</div><div className="stat-label">Supported</div></div>
        </div>
      </div>
    </div></>
  );
}

// ── Dashboard ────────────────────────────────────────────
function Dashboard() {
  const { user, logout } = useAuth0();
  const mainPanelRef = useRef(null);

  const [emails, setEmails] = useState(MOCK_EMAILS);
  const [selected, setSelected] = useState(MOCK_EMAILS[0]);
  const [composeMode, setComposeMode] = useState('reply');
  const [permissions, setPermissions] = useState({ read:true, summarize:true, send:false });
  const [log, setLog] = useState([]);
  const [pendingRisk, setPendingRisk] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);

  // Feature states
  const [lang, setLang] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [notifGranted, setNotifGranted] = useState(false);
  const [showTeams, setShowTeams] = useState(false);
  const [teams, setTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [filterUnread, setFilterUnread] = useState(false);

  const userId = user?.sub || user?.email || 'global';
  const storageKey = `guardy_onboarded_${userId}`;

  // Analytics data
  const analytics = {
    total: emails.length,
    unread: emails.filter(e=>e.unread).length,
    read: emails.filter(e=>!e.unread).length,
    work: emails.filter(e=>e.category==='work').length,
    business: emails.filter(e=>e.category==='business').length,
    personal: emails.filter(e=>e.category==='personal').length,
    spam: emails.filter(e=>e.category==='spam').length,
    aiActions: log.filter(l=>l.msg.includes('🟢')).length,
    trust: Math.min(100, 50 + log.length * 5),
  };

  // Load Chart.js
  useEffect(() => {
    if (!window.Chart) {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
      document.head.appendChild(s);
    }
  }, []);

  // Init on login
  useEffect(() => {
    if (!user) return;
    // Always use current user's email from Auth0 as primary source
    const userEmail = user.email || '';
    setProfileName(user.name || '');
    setProfileEmail(userEmail);
    setProfilePicture(user.picture || '');
    const onboarded = localStorage.getItem(storageKey);
    if (!onboarded) setShowOnboarding(true);

    // 1. Init Voice Recognition
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';
      rec.onresult = (e) => {
        const cmd = e.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(cmd);
      };
      rec.onend = () => setIsListening(false);
      rec.onerror = () => { setIsListening(false); showToast('Voice error. Try again.', 'error'); };
      setRecognition(rec);
    }

    // 2. Request Push Notifications
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(p => {
        if (p === 'granted') {
          setNotifGranted(true);
          new Notification('🛡️ Guardy AI', { body: 'Notifications enabled! You will be alerted for new emails and AI actions.', icon: '/favicon.ico' });
          addLog('🔔 Push notifications enabled');
        }
      });
    } else if (Notification.permission === 'granted') {
      setNotifGranted(true);
    }

    // 3. Load organizations from storage
    (async () => {
      try {
        const userOrgs = await getUserOrganizations(userId);
        setTeams(userOrgs);
      } catch (err) {
        console.error('Failed to load teams:', err);
      }
    })();
  }, [user]);

  const addLog = (msg) => setLog(l => [{ msg, time: new Date().toLocaleTimeString() }, ...l.slice(0,29)]);
  const showToast = (message, type='success') => setToast({ message, type });

  const sendPushNotif = (title, body) => {
    if (notifGranted || Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  };

  // 1. Voice command handler
  const handleVoiceCommand = (cmd) => {
    addLog('🎤 Voice: "' + cmd + '"');
    if (cmd.includes('read') && selected) { handleAction('read', selected); showToast('🎤 Voice: Reading email'); }
    else if (cmd.includes('summar') && selected) { handleAction('summarize', selected); showToast('🎤 Voice: Summarizing'); }
    else if (cmd.includes('reply') && selected) { handleAction('reply', selected); showToast('🎤 Voice: Drafting reply'); }
    else if (cmd.includes('new email') || cmd.includes('compose')) { openNewEmail(); showToast('🎤 Voice: New email'); }
    else if (cmd.includes('analytic')) { setShowAnalytics(true); }
    else if (cmd.includes('profile')) { setShowProfile(true); }
    else { showToast('Try: "read", "summarize", "reply", "new email"', 'error'); }
  };

  const startVoice = () => {
    if (!recognition) { showToast('Voice not supported in this browser', 'error'); return; }
    if (isListening) return;
    setIsListening(true);
    recognition.start();
    showToast('🎤 Listening... say "read", "summarize", or "reply"');
  };

  const openNewEmail = () => {
    setSelected(null); setComposeMode('new');
    setComposeTo(''); setComposeSubject(''); setComposeBody('');
    setAiResult(null);
  };

  const handleAction = (type, email) => {
    const risk = evaluateRisk({ type, email, to: email.from }, permissions);
    if (risk.level === 'safe') executeAction(type, email, lang);
    else setPendingRisk({ ...risk, action: { type, email } });
  };

  const executeAction = async (type, email, currentLang = lang) => {
    setLoadingAction(type+'-'+email.id);
    try {
      if (type === 'read') {
        setSelected(email);
        setComposeMode('reply');
        setEmails(prev => prev.map(e => e.id===email.id ? {...e, unread:false} : e));
        setAiResult(null);
        setComposeTo(''); setComposeSubject(''); setComposeBody('');
        addLog('🟢 Read email from ' + email.name);
        sendPushNotif('📧 Email Read', 'Guardy AI read: ' + email.subject);
        setLoadingAction(null);
      } else if (type === 'summarize') {
        setSelected(email);
        setComposeMode('reply');
        try {
          const summary = await generateAISummary(email.body, currentLang);
          setAiResult({ type:'summary', text: summary });
          addLog('🟢 AI Summarized ('+currentLang+') email from ' + email.name);
          showToast('✨ AI summary in ' + currentLang.toUpperCase() + '!');
          sendPushNotif('🤖 Summary Ready', email.name + ': ' + email.subject);
        } catch (err) {
          showToast('AI summary failed: ' + (err.message || 'Unknown error'), 'error');
          addLog('❌ Summary failed: ' + err.message);
          setAiResult({ type:'summary', text: '❌ Failed to generate summary. Try again.' });
        }
        setLoadingAction(null);
      } else if (type === 'reply') {
        setSelected(email);
        setComposeMode('reply');
        try {
          const reply = await generateAIReply(email.body, email.from, email.subject, currentLang);
          setComposeTo(email.from);
          setComposeSubject('Re: ' + email.subject);
          setComposeBody(reply);
          setAiResult(null);
          addLog('🟢 AI reply ('+currentLang+') drafted for ' + email.name);
          showToast('✨ AI reply in ' + currentLang.toUpperCase() + '!');
        } catch (err) {
          showToast('AI reply failed: ' + (err.message || 'Unknown error'), 'error');
          addLog('❌ Reply failed: ' + err.message);
          setComposeBody('❌ Failed to generate reply. Please try again.');
        }
        setLoadingAction(null);
      }
    } catch (err) {
      addLog('❌ Action failed: ' + err.message);
      setLoadingAction(null);
    }
  };

  const handleSend = async () => {
    if (!composeTo || !composeBody) { showToast('Please fill in recipient and message', 'error'); return; }
    const risk = evaluateRisk({ type:'send', email: composeMode==='new' ? {category:'personal'} : selected, to:composeTo }, permissions);
    if (risk.level === 'dangerous') { setPendingRisk({ ...risk, action:{type:'send',email:selected} }); return; }
    if (risk.level === 'sensitive') { setPendingRisk({ ...risk, action:{type:'send',email:selected,isFinalSend:true} }); return; }
    await doSend();
  };

  const doSend = async () => {
    setSending(true);
    try {
      const sId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
      const tId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
      const pKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
      if (sId && tId && pKey) {
        await emailjs.send(sId, tId, { to_email:composeTo, subject:composeSubject, message:composeBody, from_name: profileName || user?.name || 'Guardy AI' }, pKey);
        addLog('📤 Real email sent to ' + composeTo + ' via EmailJS!');
        showToast('📤 Sent to ' + composeTo + '!');
        sendPushNotif('📤 Email Sent', 'Guardy AI sent an email to ' + composeTo);
      } else {
        await new Promise(r => setTimeout(r, 900));
        addLog('📤 [Demo] Email sent to ' + composeTo);
        showToast('📤 Sent to ' + composeTo + '! (Demo mode)');
      }
      setComposeTo(''); setComposeSubject(''); setComposeBody('');
    } catch(err) {
      showToast('Send failed. Check EmailJS config.', 'error');
      addLog('❌ Send failed: ' + (err.text || err.message || 'error'));
    }
    setSending(false);
  };

  const togglePerm = (key) => {
    setPermissions(p => {
      const v = !p[key];
      addLog((v?'🔓 Granted':'🔒 Revoked') + ' permission: ' + key);
      return {...p, [key]:v};
    });
  };

  const exportData = () => {
    const data = { user:{name:profileName,email:profileEmail}, emails:emails.length, log, permissions };
    const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'guardy-export.json';
    a.click();
    addLog('📤 Data exported (GDPR)');
    showToast('Data exported!');
  };

  const simulateNewEmail = () => {
    const ne = { id: Date.now(), unread:true, from:'newuser@gmail.com', name:'New Contact', subject:'Just wanted to connect!', preview:'Hi, I saw your profile and wanted to reach out...', body:'Hi,\n\nI came across your profile and wanted to reach out to connect.\n\nHope to hear from you!\n\nBest,\nNew Contact', time:'Just now', category:'personal' };
    setEmails(prev => [ne, ...prev]);
    addLog('📧 New email received from New Contact');
    showToast('📧 New email arrived!');
    sendPushNotif('📧 New Email', 'New Contact: Just wanted to connect!');
  };

  return (
    <>
      <style>{styles}</style>
      <div className="bg-canvas"><div className="orb orb-1"/><div className="orb orb-2"/></div>
      <div className="bg-grid"/>

      {/* 3. Onboarding Tour */}
      {showOnboarding && <OnboardingTour onFinish={()=>{ setShowOnboarding(false); localStorage.setItem(storageKey,'1'); }} />}

      <div className="dash-wrap">
        <nav className="dash-nav">
          <div className="dash-logo">🛡️ Guardy AI</div>
          <div className="dash-user">
            {/* 4. Multi-language selector */}
            <select className="lang-select" value={lang} onChange={(e)=>{ setLang(e.target.value); showToast('🌍 Language: '+e.target.value.toUpperCase()); }} style={{cursor:'pointer'}}>
              <option value="en">🇬🇧 EN</option>
              <option value="hi">🇮🇳 HI</option>
              <option value="ta">🇮🇳 TA</option>
              <option value="fr">🇫🇷 FR</option>
              <option value="es">🇪🇸 ES</option>
            </select>
            {/* 1. Voice button */}
            <button className={'voice-btn'+(isListening?' listening':'')} onClick={startVoice} title="Voice commands">
              {isListening ? '🎤 Listening...' : '🎤 Voice'}
            </button>
            {/* 2. Notifications */}
            <button className="nav-btn" onClick={()=>{ if(!notifGranted){ Notification.requestPermission().then(p=>{ if(p==='granted'){setNotifGranted(true);showToast('🔔 Notifications enabled!');} }); } else { showToast('Notifications already enabled ✅'); } }} title="Push notifications">
              {notifGranted ? '🔔' : '🔕'}
            </button>
            {profilePicture
              ? <img src={profilePicture} alt="avatar" className="user-avatar"/>
              : <span className="user-avatar" style={{background:'rgba(108,99,255,0.2)',display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:13,color:'var(--text)'}}>{(profileName||user?.name||user?.email||'U').charAt(0).toUpperCase()}</span>
            }
            <span className="user-name" title={profileEmail || user?.email}>{profileEmail || user?.email || profileName || user?.name}</span>
            <button className="nav-btn" onClick={()=>setShowAnalytics(true)}>📊 Analytics</button>
            <button className="nav-btn" onClick={()=>setShowTeams(true)}>👥 Teams</button>
            <button className="nav-btn" onClick={()=>setShowProfile(true)}>👤 Profile</button>
            <button className="nav-btn" onClick={()=>{const auditExport=JSON.stringify(log.reverse().map((l,i)=>({sequence:i+1,timestamp:l.time,action:l.msg,userId:user.sub})),null,2);const blob=new Blob([auditExport],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='audit-log-'+new Date().toISOString()+'.json';a.click();showToast('📋 Audit log exported!');}}>📋 Audit Log</button>
            <button className="nav-btn" onClick={()=>{setupDemoData();showToast('🎬 Demo data loaded! Refresh to see Sales Team');addLog('🎬 Demo data setup - refresh page to load');}} style={{background:'rgba(0,229,160,0.15)',color:'var(--success)',border:'1px solid rgba(0,229,160,0.3)',cursor:'pointer'}}>🎬 Setup Demo</button>
            <button className="btn-logout" onClick={()=>logout({logoutParams:{returnTo:window.location.origin}})}>Log out</button>
          </div>
        </nav>

        <div className="dash-body">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="sidebar-title">🔐 Token Vault</div>
            <p style={{fontSize:12,color:'var(--muted)',marginBottom:14,lineHeight:1.5}}>Control what Guardy AI can do on your behalf.</p>
            {[{key:'read',label:'👁 Read emails'},{key:'summarize',label:'📝 Summarize'},{key:'send',label:'📤 Send emails'}].map(({key,label})=>(
              <div className="perm-item" key={key}>
                <span className="perm-label">{label}</span>
                <label className="toggle"><input type="checkbox" checked={permissions[key]} onChange={()=>togglePerm(key)}/><span className="toggle-slider"/></label>
              </div>
            ))}
            <div className="vault-badge"><span>🔒</span> Auth0 secured session</div>
            <div className="vault-badge" style={{marginTop:8,borderColor:'rgba(108,99,255,0.3)',color:'var(--accent)',background:'rgba(108,99,255,0.08)'}}>
              <span>🌍</span> Lang: {lang.toUpperCase()}
            </div>
            <div className="vault-badge" style={{marginTop:8,borderColor:'rgba(240,165,0,0.3)',color:'var(--warn)',background:'rgba(240,165,0,0.08)'}}>
              <span>🤖</span> Trust: {analytics.trust}/100
            </div>
            <div className="log-section">
              <div className="log-title">📋 Action Log</div>
              {log.length===0 && <div style={{fontSize:11,color:'var(--muted)'}}>No actions yet.</div>}
              {log.map((e,i)=><div className="log-item" key={i}><span style={{color:'var(--muted)',marginRight:4}}>{e.time}</span>{e.msg}</div>)}
            </div>
          </div>

          {/* Inbox */}
          <div className="main-panel" ref={mainPanelRef}>
            <div className="panel-header">
              <div className="panel-title">📬 Inbox</div>
              <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                <button className={'nav-btn'+(filterUnread?' active':'')} onClick={()=>{setFilterUnread(!filterUnread);showToast(filterUnread?'Showing all emails':'Showing unread only');}} style={{cursor:'pointer'}}>
                  {emails.filter(e=>e.unread).length} unread
                </button>
                <button className="nav-btn" onClick={simulateNewEmail}>🔔 Simulate Email</button>
                <button className="new-email-btn" onClick={openNewEmail}>✏️ New Email</button>
              </div>
            </div>
            {(filterUnread ? emails.filter(e=>e.unread) : emails.sort((a,b)=>b.unread-a.unread)).map(email=>(
              <div key={email.id}
                className={'email-card'+(email.unread?' unread':'')+(selected?.id===email.id&&composeMode==='reply'?' selected':'')}
                onClick={()=>{setSelected(email);setComposeMode('reply');setAiResult(null);setComposeTo('');setComposeSubject('');setComposeBody('');}}>
                <div className="email-meta">
                  <div className="email-from" style={{color:email.unread?'var(--text)':'var(--muted)'}}>
                    {email.name}
                    {email.category==='spam'&&<span style={{marginLeft:6,fontSize:10,background:'rgba(255,77,77,0.15)',color:'var(--danger)',padding:'2px 7px',borderRadius:4}}>SPAM</span>}
                    {email.category==='work'&&<span style={{marginLeft:6,fontSize:10,background:'rgba(108,99,255,0.15)',color:'var(--accent)',padding:'2px 7px',borderRadius:4}}>WORK</span>}
                    {email.category==='business'&&<span style={{marginLeft:6,fontSize:10,background:'rgba(0,212,255,0.15)',color:'var(--accent2)',padding:'2px 7px',borderRadius:4}}>BIZ</span>}
                  </div>
                  <div className="email-time">{email.time}</div>
                </div>
                <div className="email-subject">{email.subject}</div>
                <div className="email-preview">{email.preview}</div>
                <div className="email-actions" onClick={e=>e.stopPropagation()}>
                  <button className={'action-btn'+(loadingAction==='read-'+email.id?' loading':'')} onClick={()=>handleAction('read',email)}>{loadingAction==='read-'+email.id?'⏳':'👁'} Read</button>
                  <button className={'action-btn'+(loadingAction==='summarize-'+email.id?' loading':'')} onClick={()=>handleAction('summarize',email)}>{loadingAction==='summarize-'+email.id?'⏳':'🤖'} Summarize</button>
                  {email.category!=='spam'&&<button className={'action-btn'+(loadingAction==='reply-'+email.id?' loading':'')} onClick={()=>handleAction('reply',email)}>{loadingAction==='reply-'+email.id?'⏳':'✍️'} AI Reply</button>}
                </div>
              </div>
            ))}
          </div>

          {/* Right Panel */}
          <div className="detail-panel">
            {composeMode==='new' && (
              <div className="compose-section" style={{marginTop:0}}>
                <div className="compose-header">✏️ New Email</div>
                <label className="compose-label">TO</label>
                <input className="compose-input" value={composeTo} onChange={e=>setComposeTo(e.target.value)} placeholder="recipient@example.com"/>
                <label className="compose-label">SUBJECT</label>
                <input className="compose-input" value={composeSubject} onChange={e=>setComposeSubject(e.target.value)} placeholder="Subject"/>
                <label className="compose-label">MESSAGE</label>
                <textarea className="compose-textarea" value={composeBody} onChange={e=>setComposeBody(e.target.value)} placeholder="Write your message..."/>
                <button className="send-btn" onClick={handleSend} disabled={sending}>{sending?'⏳ Sending...':'📤 Send Email'}</button>
                <button onClick={()=>{setComposeMode('reply');setSelected(MOCK_EMAILS[0]);}} style={{width:'100%',marginTop:8,padding:9,background:'transparent',border:'1px solid var(--border)',borderRadius:8,color:'var(--muted)',fontFamily:'DM Sans,sans-serif',fontSize:12,cursor:'pointer'}}>← Back to Inbox</button>
              </div>
            )}
            {composeMode==='reply' && selected && (
              <>
                <div className="detail-title">{selected.subject}</div>
                <div className="detail-from">From: {selected.from}</div>
                <div className="detail-body" style={{whiteSpace:'pre-line'}}>{selected.body}</div>
                {aiResult?.type==='summary' && (
                  <div className="ai-result">
                    <div className="ai-result-label">🤖 AI Summary ({lang.toUpperCase()})</div>
                    <div className="ai-result-text">{aiResult.text}</div>
                  </div>
                )}
                {selected.category!=='spam' && (
                  <div className="compose-section">
                    <div className="compose-header">↩️ Reply ({lang.toUpperCase()})</div>
                    <label className="compose-label">TO</label>
                    <input className="compose-input" value={composeTo} onChange={e=>setComposeTo(e.target.value)} placeholder="recipient@example.com"/>
                    <label className="compose-label">SUBJECT</label>
                    <input className="compose-input" value={composeSubject} onChange={e=>setComposeSubject(e.target.value)} placeholder="Subject"/>
                    <label className="compose-label">MESSAGE</label>
                    <textarea className="compose-textarea" value={composeBody} onChange={e=>setComposeBody(e.target.value)} placeholder="Write your reply..."/>
                    <button className="send-btn" onClick={handleSend} disabled={sending}>{sending?'⏳ Sending...':'📤 Send Reply'}</button>
                  </div>
                )}
              </>
            )}
            {composeMode==='reply' && !selected && (
              <div style={{color:'var(--muted)',fontSize:13,textAlign:'center',marginTop:40}}>
                <div style={{fontSize:32,marginBottom:12}}>📬</div>
                Select an email to read it<br/>or click <strong style={{color:'var(--accent)'}}>✏️ New Email</strong> to compose
              </div>
            )}
          </div>
        </div>
      </div>

      <RiskModal
        risk={pendingRisk}
        onConfirm={async()=>{ const a=pendingRisk.action; setPendingRisk(null); if(a.isFinalSend){await doSend();}else{await executeAction(a.type,a.email,lang);} }}
        onCancel={()=>{ addLog('❌ Blocked: '+pendingRisk.action.type+' — '+pendingRisk.label); setPendingRisk(null); }}
      />

      {showAnalytics && <AnalyticsModal analytics={analytics} onClose={()=>setShowAnalytics(false)}/>}
      {showProfile && <ProfileModal user={user} profileName={profileName} setProfileName={setProfileName} profileEmail={profileEmail} setProfileEmail={setProfileEmail} profilePicture={profilePicture} setProfilePicture={setProfilePicture} onSave={()=>{localStorage.setItem(`guardy_name_${userId}`,profileName);localStorage.setItem(`guardy_email_${userId}`,profileEmail);localStorage.setItem(`guardy_pic_${userId}`,profilePicture);setShowProfile(false);addLog('👤 Profile saved');showToast('Profile saved!');}} onClose={()=>setShowProfile(false)} exportData={exportData}/>}
      {showTeams && <TeamModal teams={teams} selectedTeam={selectedTeam} teamMembers={teamMembers} newTeamName={newTeamName} setNewTeamName={setNewTeamName} inviteEmail={inviteEmail} setInviteEmail={setInviteEmail} onCreateTeam={async()=>{if(!newTeamName){showToast('Team name required','error');return;}try{setTeamsLoading(true);const newOrg = await createOrganization(newTeamName.toLowerCase().replace(/\s/g,'-'),newTeamName);setTeams([...teams,newOrg]);setNewTeamName('');setSelectedTeam(newOrg);showToast('✅ Team "'+ newTeamName+'" created!');addLog('👥 Team created: '+newTeamName);}catch(e){showToast('Failed to create team: '+e.message,'error');addLog('❌ Team creation failed: '+e.message);}finally{setTeamsLoading(false);}}} onInvite={async()=>{if(!selectedTeam||!inviteEmail){showToast('Select team and enter email','error');return;}try{setTeamsLoading(true);await inviteUserToOrganization(selectedTeam.id,inviteEmail);let members = await getOrganizationMembers(selectedTeam.id);setTeamMembers(members);const newMember = members.find(m=>m.email===inviteEmail);showToast('📬 Invitation sent!');addLog('📧 Invited '+inviteEmail+' to '+selectedTeam.display_name);setInviteEmail('');setTimeout(async()=>{try{if(newMember){await acceptOrganizationInvite(selectedTeam.id,newMember.id);const updatedMembers = await getOrganizationMembers(selectedTeam.id);setTeamMembers(updatedMembers);addLog('👤 '+inviteEmail+' accepted invite automatically');}}catch(ee){console.error('Auto-accept error:',ee);}},6000);}catch(e){showToast('Failed to send invitation: '+e.message,'error');addLog('❌ Invite failed: '+e.message);}finally{setTeamsLoading(false);}}} onAccept={async(memberId)=>{if(!selectedTeam){return;}try{setTeamsLoading(true);await acceptOrganizationInvite(selectedTeam.id,memberId);const members = await getOrganizationMembers(selectedTeam.id);setTeamMembers(members);showToast('✅ Invitation accepted!');addLog('👤 Member accepted invite');}catch(e){showToast('Failed to accept invite: '+e.message,'error');addLog('❌ Accept failed: '+e.message);}finally{setTeamsLoading(false);}}} onClose={()=>setShowTeams(false)}/>}
      {toast && <Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
    </>
  );
}

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  if (isLoading) return <LoadingScreen/>;
  return isAuthenticated ? <Dashboard/> : <LoginPage/>;
}

export default App;