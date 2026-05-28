// ============================================================
//  CareNest – Enhanced Mobile + Caregiver DM + Booking
//  CC 106 · St. Peter's College · Generalao & Sapra
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL      = "https://xydocnvlnktvhzeopdib.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_PwF7vicN6W71jJ4djPXu1w_avxaInKJ";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Design Tokens ────────────────────────────────────────────
const C = {
  jade:"#0D9488",jadeD:"#0F766E",jadeL:"#CCFBF1",jadeXL:"#F0FDF9",
  pine:"#134E4A",onyx:"#0C1117",onyxM:"#1A2535",slate:"#0F172A",
  slateM:"#334155",slateL:"#64748B",slateXL:"#94A3B8",
  cream:"#FAFAF8",white:"#FFFFFF",rose:"#F43F5E",
  amber:"#F59E0B",violet:"#7C3AED",sky:"#0EA5E9",
};

// ── Icon Library ─────────────────────────────────────────────
const Icon = ({ name, size=18, color="currentColor", strokeWidth=1.75 }) => {
  const s={width:size,height:size,display:"block",flexShrink:0};
  const p={stroke:color,strokeWidth,fill:"none",strokeLinecap:"round",strokeLinejoin:"round"};
  const paths={
    home:<><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"{...p}/><path d="M9 21V12h6v9"{...p}/></>,
    user:<><circle cx="12" cy="7" r="4"{...p}/><path d="M4 21v-1a8 8 0 0 1 16 0v1"{...p}/></>,
    calendar:<><rect x="3" y="4" width="18" height="18" rx="2"{...p}/><path d="M16 2v4M8 2v4M3 10h18"{...p}/></>,
    heart:<><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"{...p}/></>,
    message:<><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"{...p}/></>,
    creditcard:<><rect x="1" y="4" width="22" height="16" rx="2"{...p}/><path d="M1 10h22"{...p}/></>,
    barchart:<><rect x="18" y="3" width="4" height="18" rx="1"{...p}/><rect x="10" y="8" width="4" height="13" rx="1"{...p}/><rect x="2" y="13" width="4" height="8" rx="1"{...p}/></>,
    settings:<><circle cx="12" cy="12" r="3"{...p}/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"{...p}/></>,
    plus:<><path d="M12 5v14M5 12h14"{...p}/></>,
    search:<><circle cx="11" cy="11" r="8"{...p}/><path d="m21 21-4.35-4.35"{...p}/></>,
    x:<><path d="M18 6L6 18M6 6l12 12"{...p}/></>,
    send:<><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"{...p}/></>,
    logout:<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"{...p}/></>,
    trash:<><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"{...p}/></>,
    check:<><path d="M20 6L9 17l-5-5"{...p}/></>,
    alert:<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"{...p}/><path d="M12 9v4M12 17h.01"{...p}/></>,
    activity:<><path d="M22 12h-4l-3 9L9 3l-3 9H2"{...p}/></>,
    users:<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"{...p}/><circle cx="9" cy="7" r="4"{...p}/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"{...p}/></>,
    mail:<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"{...p}/><path d="M22 6l-10 7L2 6"{...p}/></>,
    lock:<><rect x="3" y="11" width="18" height="11" rx="2"{...p}/><path d="M7 11V7a5 5 0 0 1 10 0v4"{...p}/></>,
    shield:<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"{...p}/></>,
    phone:<><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"{...p}/></>,
    mappin:<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"{...p}/><circle cx="12" cy="10" r="3"{...p}/></>,
    chevronright:<><path d="M9 18l6-6-6-6"{...p}/></>,
    chevronleft:<><path d="M15 18l-6-6 6-6"{...p}/></>,
    info:<><circle cx="12" cy="12" r="10"{...p}/><path d="M12 16v-4M12 8h.01"{...p}/></>,
    clipboard:<><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"{...p}/><rect x="8" y="2" width="8" height="4" rx="1"{...p}/></>,
    thermometer:<><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"{...p}/></>,
    droplet:<><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"{...p}/></>,
    wind:<><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"{...p}/></>,
    star:<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"{...p}/></>,
    edit:<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"{...p}/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"{...p}/></>,
    printer:<><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"{...p}/><rect x="6" y="14" width="12" height="8"{...p}/></>,
    arrowup:<><path d="M12 19V5M5 12l7-7 7 7"{...p}/></>,
    bellring:<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"{...p}/></>,
    stethoscope:<><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"{...p}/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"{...p}/><circle cx="20" cy="10" r="2"{...p}/></>,
    usercircle:<><circle cx="12" cy="8" r="4"{...p}/><path d="M20 21a8 8 0 1 0-16 0"{...p}/></>,
  };
  return <svg viewBox="0 0 24 24" style={s} aria-hidden="true">{paths[name]||<circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} fill="none"/>}</svg>;
};

// ── CSS ──────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --jade:#0D9488;--jadeD:#0F766E;--jadeL:#CCFBF1;--jadeXL:#F0FDF9;
  --pine:#134E4A;--onyx:#0C1117;--onyxM:#1A2535;--slate:#0F172A;
  --slateM:#334155;--slateL:#64748B;--slateXL:#94A3B8;
  --cream:#FAFAF8;--white:#FFFFFF;--rose:#F43F5E;
  --amber:#F59E0B;--violet:#7C3AED;--sky:#0EA5E9;
  --radius:16px;--shadow:0 4px 24px rgba(13,148,136,.08);
  --shadowMd:0 8px 40px rgba(13,148,136,.14);
  --nav-h:70px;
}
body{font-family:'DM Sans',sans-serif;background:var(--cream);color:var(--slate);min-height:100vh;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--jadeL);border-radius:99px}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideLeft{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:translateX(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes popIn{from{opacity:0;transform:scale(.8) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
.fade-up{animation:fadeUp .42s cubic-bezier(.22,1,.36,1) both}
.scale-in{animation:scaleIn .32s cubic-bezier(.22,1,.36,1) both}
.slide-left{animation:slideLeft .30s ease both}
.pop-in{animation:popIn .25s cubic-bezier(.22,1,.36,1) both}

/* ─ Buttons */
.btn{display:inline-flex;align-items:center;gap:7px;padding:10px 20px;border-radius:12px;border:none;font-family:'DM Sans',sans-serif;font-size:13.5px;font-weight:500;cursor:pointer;transition:all .2s cubic-bezier(.22,1,.36,1);white-space:nowrap;position:relative;overflow:hidden;letter-spacing:.01em}
.btn::after{content:'';position:absolute;inset:0;background:white;opacity:0;transition:opacity .15s}
.btn:hover::after{opacity:.08}
.btn-primary{background:linear-gradient(135deg,var(--jade),var(--jadeD));color:#fff;box-shadow:0 4px 16px rgba(13,148,136,.35)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(13,148,136,.45)}
.btn-primary:active{transform:translateY(0)}
.btn-ghost{background:transparent;color:var(--slateM);border:1.5px solid rgba(203,213,225,.9)}
.btn-ghost:hover{border-color:var(--jade);color:var(--jade);background:var(--jadeXL)}
.btn-danger{background:#FFF1F2;color:var(--rose);border:1.5px solid #FFE4E6}
.btn-danger:hover{background:var(--rose);color:#fff;border-color:var(--rose)}
.btn:disabled{opacity:.55;cursor:not-allowed;transform:none!important;box-shadow:none!important}
.btn-icon{width:38px;height:38px;padding:0;justify-content:center;border-radius:10px}

/* ─ Cards */
.card{background:#fff;border-radius:var(--radius);border:1px solid rgba(209,229,226,.7);box-shadow:var(--shadow);padding:24px;transition:box-shadow .25s,transform .25s}
.card:hover{box-shadow:var(--shadowMd)}
.card-mobile{background:#fff;border-radius:18px;border:1px solid rgba(209,229,226,.7);box-shadow:0 2px 16px rgba(13,148,136,.06);padding:18px}

/* ─ Badges */
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:600;letter-spacing:.3px;text-transform:capitalize}
.badge::before{content:'';width:5px;height:5px;border-radius:50%;background:currentColor;opacity:.6;flex-shrink:0}
.badge-green{background:#D1FAE5;color:#059669}
.badge-amber{background:#FEF3C7;color:#D97706}
.badge-red{background:#FFE4E6;color:var(--rose)}
.badge-teal{background:var(--jadeL);color:var(--jadeD)}
.badge-purple{background:#EDE9FE;color:var(--violet)}
.badge-blue{background:#E0F2FE;color:var(--sky)}

/* ─ Form inputs */
input,textarea,select{width:100%;padding:11px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:13.5px;background:#FAFBFC;color:var(--slate);transition:all .2s;outline:none}
input:focus,textarea:focus,select:focus{border-color:var(--jade);box-shadow:0 0 0 4px rgba(13,148,136,.12);background:#fff}
input::placeholder,textarea::placeholder{color:var(--slateXL)}
label{display:block;font-size:12px;font-weight:600;color:var(--slateL);margin-bottom:6px;letter-spacing:.3px;text-transform:uppercase}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:600px){.form-row{grid-template-columns:1fr}}

/* ─ Spinner */
.spinner{width:18px;height:18px;border:2.5px solid rgba(13,148,136,.2);border-top-color:var(--jade);border-radius:50%;animation:spin .65s linear infinite}

/* ─ DESKTOP Sidebar */
.sidebar{width:248px;min-height:100vh;background:var(--onyx);display:flex;flex-direction:column;position:fixed;top:0;left:0;z-index:100;border-right:1px solid rgba(255,255,255,.05)}
.sidebar::before{content:'';position:absolute;top:0;left:0;right:0;height:260px;background:radial-gradient(ellipse at 40% -10%,rgba(13,148,136,.22) 0%,transparent 70%);pointer-events:none}
.sidebar-logo{padding:26px 22px 22px;border-bottom:1px solid rgba(255,255,255,.06);position:relative;z-index:1}
.sidebar-logo-mark{display:inline-flex;align-items:center;gap:9px;margin-bottom:6px}
.sidebar-logo-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--jade),var(--jadeD));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(13,148,136,.5)}
.sidebar-logo h1{font-family:'DM Serif Display',serif;font-size:20px;color:#fff;line-height:1;letter-spacing:-.3px}
.sidebar-logo p{font-size:10px;color:rgba(148,163,184,.6);letter-spacing:1px;text-transform:uppercase;font-weight:500}
.nav-section-label{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.18);padding:20px 22px 8px}
.nav-item{display:flex;align-items:center;gap:11px;padding:10px 12px;margin:2px 12px;border-radius:11px;cursor:pointer;font-size:13px;font-weight:500;color:rgba(148,163,184,.8);transition:all .2s;position:relative;overflow:hidden}
.nav-item:hover{background:rgba(255,255,255,.07);color:#fff}
.nav-item.active{background:linear-gradient(135deg,rgba(13,148,136,.3),rgba(15,118,110,.2));color:#fff;border:1px solid rgba(13,148,136,.35)}
.nav-item.active::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:3px;border-radius:0 3px 3px 0;background:var(--jade);box-shadow:0 0 8px var(--jade)}
.main-area{margin-left:248px;min-height:100vh}

/* ─ MOBILE Bottom Nav */
.mobile-nav{display:none;position:fixed;bottom:0;left:0;right:0;z-index:200;background:rgba(12,17,23,.97);backdrop-filter:blur(20px) saturate(180%);border-top:1px solid rgba(255,255,255,.07);padding:0 8px;padding-bottom:env(safe-area-inset-bottom,0px);height:var(--nav-h)}
.mobile-nav-inner{display:flex;align-items:center;justify-content:space-around;height:100%}
.mob-nav-item{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 12px;border-radius:14px;cursor:pointer;transition:all .25s cubic-bezier(.22,1,.36,1);position:relative;min-width:52px;border:none;background:transparent}
.mob-nav-item.active{background:rgba(13,148,136,.15)}
.mob-nav-item span{font-size:9.5px;font-weight:600;letter-spacing:.3px;color:rgba(148,163,184,.6);transition:color .2s}
.mob-nav-item.active span{color:var(--jade)}
.mob-nav-badge{position:absolute;top:4px;right:8px;background:var(--rose);color:#fff;border-radius:99px;font-size:9px;font-weight:700;padding:1px 5px;min-width:16px;text-align:center;border:2px solid var(--onyx)}

/* ─ Mobile header */
.mobile-header{display:none;position:fixed;top:0;left:0;right:0;z-index:150;background:rgba(250,250,248,.95);backdrop-filter:blur(16px);border-bottom:1px solid rgba(209,229,226,.6);padding:0 18px;height:60px;align-items:center;justify-content:space-between}
.mobile-header-logo{display:flex;align-items:center;gap:10px}

/* ─ Page */
.page-wrap{padding:32px 36px}
@media(max-width:768px){
  .sidebar{display:none}
  .main-area{margin-left:0;padding-bottom:var(--nav-h)}
  .mobile-nav{display:block}
  .mobile-header{display:flex}
  .page-wrap{padding:76px 16px 24px}
}

/* ─ Page header */
.page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:32px;gap:16px}
.page-title{font-family:'DM Serif Display',serif;font-size:28px;color:var(--slate);line-height:1.1;letter-spacing:-.3px}
.page-subtitle{font-size:13px;color:var(--slateL);margin-top:4px}
@media(max-width:768px){
  .page-title{font-size:22px}
  .page-header{margin-bottom:20px}
}

/* ─ Stats */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px}
@media(max-width:1100px){.stats-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.stats-grid{grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:20px}}
.stat-card{background:#fff;border-radius:var(--radius);border:1px solid rgba(209,229,226,.7);padding:22px;position:relative;overflow:hidden;transition:transform .25s,box-shadow .25s;box-shadow:var(--shadow)}
.stat-card:hover{transform:translateY(-3px);box-shadow:var(--shadowMd)}
@media(max-width:600px){.stat-card{padding:16px 14px}}
.stat-card-bg{position:absolute;right:-20px;bottom:-20px;width:90px;height:90px;border-radius:50%;opacity:.07}
.stat-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:16px}
@media(max-width:600px){.stat-icon{width:36px;height:36px;margin-bottom:10px}}
.stat-val{font-family:'DM Serif Display',serif;font-size:32px;line-height:1;letter-spacing:-.5px}
@media(max-width:600px){.stat-val{font-size:24px}}
.stat-label{font-size:12px;color:var(--slateL);margin-top:5px;font-weight:500}
@media(max-width:600px){.stat-label{font-size:11px}}
.stat-trend{display:inline-flex;align-items:center;gap:3px;font-size:11px;font-weight:600;margin-top:8px;padding:2px 7px;border-radius:99px}

/* ─ Content grid */
.content-grid{display:grid;grid-template-columns:3fr 2fr;gap:20px}
@media(max-width:960px){.content-grid{grid-template-columns:1fr}}

/* ─ Table */
.data-table{width:100%;border-collapse:collapse;font-size:13.5px}
.data-table thead th{text-align:left;padding:12px 14px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--slateL);border-bottom:1.5px solid #F1F5F9;background:#FAFBFC;white-space:nowrap}
.data-table tbody td{padding:13px 14px;border-bottom:1px solid #F8FAFC;vertical-align:middle}
.data-table tbody tr:last-child td{border:none}
.data-table tbody tr{transition:background .15s}
.data-table tbody tr:hover td{background:#F8FEFC}

/* ─ Mobile patient cards */
.patient-card{background:#fff;border-radius:18px;border:1px solid rgba(209,229,226,.7);box-shadow:0 2px 12px rgba(13,148,136,.06);padding:16px;transition:transform .2s,box-shadow .2s;position:relative;overflow:hidden}
.patient-card:hover,.patient-card:active{transform:translateY(-2px);box-shadow:0 6px 24px rgba(13,148,136,.12)}
.patient-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:18px 18px 0 0}

/* ─ Modal */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(8px);z-index:300;display:flex;align-items:center;justify-content:center;padding:20px}
.modal{background:#fff;border-radius:20px;width:100%;max-width:540px;max-height:90vh;overflow-y:auto;padding:32px;box-shadow:0 32px 80px rgba(0,0,0,.22);animation:scaleIn .28s cubic-bezier(.22,1,.36,1);border:1px solid rgba(209,229,226,.5)}
@media(max-width:600px){
  .modal-overlay{align-items:flex-end;padding:0}
  .modal{border-radius:24px 24px 0 0;max-height:95vh;padding:28px 20px;animation:slideUp .3s cubic-bezier(.22,1,.36,1)}
  .modal-handle{width:40px;height:4px;background:#E2E8F0;border-radius:99px;margin:0 auto 20px}
}
.modal-title{font-family:'DM Serif Display',serif;font-size:20px;margin-bottom:22px;letter-spacing:-.2px}
.modal-footer{display:flex;gap:10px;justify-content:flex-end;margin-top:24px;padding-top:20px;border-top:1px solid #F1F5F9}
@media(max-width:600px){.modal-footer{flex-direction:column-reverse}.modal-footer .btn{width:100%;justify-content:center}}

/* ─ Chat */
.chat-wrap{display:flex;flex-direction:column;border-radius:var(--radius);overflow:hidden}
.chat-header{padding:16px 20px;border-bottom:1px solid #F1F5F9;display:flex;align-items:center;gap:12px;background:#fff;flex-shrink:0}
.chat-messages{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:10px;background:#FAFBFC}
.msg-bubble{max-width:75%;padding:10px 14px;border-radius:16px;font-size:13.5px;line-height:1.55;position:relative;word-break:break-word}
.msg-out{background:linear-gradient(135deg,var(--jade),var(--jadeD));color:#fff;border-bottom-right-radius:4px;align-self:flex-end;box-shadow:0 4px 14px rgba(13,148,136,.25)}
.msg-in{background:#fff;color:var(--slate);border-bottom-left-radius:4px;align-self:flex-start;box-shadow:0 2px 8px rgba(0,0,0,.06);border:1px solid #F1F5F9}
.msg-time{font-size:9.5px;opacity:.55;margin-top:3px}
.chat-input-row{display:flex;gap:10px;padding:14px 16px;border-top:1px solid #F1F5F9;background:#fff;flex-shrink:0}

/* ─ DM Thread List */
.thread-item{display:flex;align-items:center;gap:13px;padding:14px 16px;cursor:pointer;border-bottom:1px solid #F8FAFC;transition:background .15s;position:relative}
.thread-item:hover{background:#F8FEFC}
.thread-item.active{background:var(--jadeXL);border-right:3px solid var(--jade)}
.thread-unread{width:8px;height:8px;border-radius:50%;background:var(--rose);flex-shrink:0;box-shadow:0 0 0 2px #fff}

/* ─ Vital row */
.vital-row{display:flex;align-items:center;justify-content:space-between;padding:11px 0;border-bottom:1px solid #F8FAFC}
.vital-row:last-child{border:none}
.vital-label{font-size:12.5px;color:var(--slateL);display:flex;align-items:center;gap:8px}
.vital-val{font-size:16px;font-weight:700;color:var(--slate)}

/* ─ Avatar */
.avatar{border-radius:50%;background:linear-gradient(135deg,var(--jadeL),#A7F3D0);color:var(--jadeD);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;font-family:'DM Sans',sans-serif;border:2px solid rgba(13,148,136,.15)}

/* ─ Auth */
.auth-screen{min-height:100vh;display:flex;background:var(--cream)}
.auth-left{flex:1.1;background:var(--onyx);display:flex;flex-direction:column;justify-content:center;padding:64px 56px;position:relative;overflow:hidden}
.auth-left-orb1{position:absolute;top:-120px;right:-80px;width:480px;height:480px;border-radius:50%;background:radial-gradient(circle,rgba(13,148,136,.18) 0%,transparent 70%);pointer-events:none}
.auth-left-orb2{position:absolute;bottom:-160px;left:-100px;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,rgba(20,184,166,.1) 0%,transparent 70%);pointer-events:none}
.auth-left-grid{position:absolute;inset:0;opacity:.04;background-image:linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px);background-size:40px 40px}
.auth-right{flex:1;display:flex;align-items:center;justify-content:center;padding:48px 40px}
.auth-card{width:100%;max-width:420px}
.auth-card-title{font-family:'DM Serif Display',serif;font-size:30px;margin-bottom:6px;letter-spacing:-.4px;color:var(--slate)}
.auth-card-sub{color:var(--slateL);font-size:14px;margin-bottom:30px;line-height:1.6}
.auth-form-group{margin-bottom:16px}
.input-icon-wrap{position:relative}
.input-icon-wrap input{padding-left:40px}
.input-icon{position:absolute;top:50%;left:12px;transform:translateY(-50%);color:var(--slateXL);pointer-events:none}
.feature-pill{display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);margin-bottom:12px}
.feature-pill-icon{width:34px;height:34px;border-radius:9px;background:rgba(13,148,136,.2);border:1px solid rgba(13,148,136,.3);display:flex;align-items:center;justify-content:center;flex-shrink:0}
@media(max-width:768px){.auth-left{display:none}.auth-right{padding:24px}}

/* ─ Toast */
.toast-wrap{position:fixed;bottom:88px;right:16px;z-index:999;display:flex;flex-direction:column;gap:8px}
@media(min-width:769px){.toast-wrap{bottom:24px;right:24px}}
.toast{padding:12px 18px;border-radius:13px;font-size:13.5px;font-weight:500;box-shadow:0 12px 32px rgba(0,0,0,.2);animation:fadeUp .28s cubic-bezier(.22,1,.36,1);display:flex;align-items:center;gap:9px;border:1px solid rgba(255,255,255,.15);backdrop-filter:blur(12px)}
.toast-success{background:var(--jade);color:#fff}
.toast-error{background:var(--rose);color:#fff}
.toast-info{background:var(--sky);color:#fff}

/* ─ Progress */
.progress-track{background:#F1F5F9;border-radius:99px;height:5px}
.progress-fill{border-radius:99px;height:5px;transition:width .7s cubic-bezier(.22,1,.36,1)}

/* ─ Appt card */
.appt-card{border-radius:14px;padding:18px;background:#fff;border:1px solid rgba(209,229,226,.7);box-shadow:var(--shadow);transition:transform .2s,box-shadow .2s;position:relative;overflow:hidden}
.appt-card:hover{transform:translateY(-3px);box-shadow:var(--shadowMd)}

/* ─ Section header */
.section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.section-title{font-family:'DM Serif Display',serif;font-size:17px;letter-spacing:-.2px}

/* ─ Empty state */
.empty-state{text-align:center;padding:48px 24px;color:var(--slateL)}
.empty-state-icon{width:56px;height:56px;border-radius:16px;background:var(--jadeXL);border:1px solid var(--jadeL);display:flex;align-items:center;justify-content:center;margin:0 auto 14px}
.empty-state p{font-size:13.5px}

/* ─ Online dot */
.online-dot{width:8px;height:8px;border-radius:50%;background:#22C55E;box-shadow:0 0 0 2.5px rgba(34,197,94,.25);flex-shrink:0}

/* ─ Tag */
.tag{display:inline-flex;align-items:center;background:#F1F5F9;color:var(--slateM);border-radius:6px;padding:2px 7px;font-size:10.5px;font-weight:600}

/* ─ Profile hero */
.profile-hero{background:linear-gradient(135deg,var(--onyx),var(--pine));border-radius:18px;padding:32px;color:#fff;position:relative;overflow:hidden;margin-bottom:20px}
.profile-hero::before{content:'';position:absolute;right:-60px;top:-60px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(13,148,136,.25) 0%,transparent 70%)}

/* ─ Report stat */
.report-stat{background:#fff;border-radius:14px;padding:20px;border:1px solid rgba(209,229,226,.7);text-align:center;transition:transform .2s;box-shadow:var(--shadow)}
.report-stat:hover{transform:translateY(-2px)}
.report-stat-val{font-family:'DM Serif Display',serif;font-size:30px;line-height:1.1}
.report-stat-label{font-size:11.5px;color:var(--slateL);margin-top:5px}

/* ─ Mobile greeting hero */
.mobile-hero{background:linear-gradient(135deg,var(--onyx) 0%,var(--pine) 100%);border-radius:24px;padding:24px;position:relative;overflow:hidden;margin-bottom:20px}
.mobile-hero::before{content:'';position:absolute;top:-40px;right:-40px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(13,148,136,.3) 0%,transparent 70%);pointer-events:none}
.mobile-hero::after{content:'';position:absolute;bottom:-60px;left:-40px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(20,184,166,.15) 0%,transparent 70%);pointer-events:none}

/* ─ Caregiver card */
.caregiver-card{background:#fff;border-radius:16px;border:1px solid rgba(209,229,226,.7);padding:16px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:all .2s;box-shadow:0 2px 10px rgba(13,148,136,.05)}
.caregiver-card:hover{border-color:var(--jade);box-shadow:0 4px 20px rgba(13,148,136,.15);transform:translateY(-2px)}
.caregiver-card.selected{border-color:var(--jade);background:var(--jadeXL);box-shadow:0 0 0 2px rgba(13,148,136,.25)}

/* ─ DM Sidebar */
.dm-layout{display:grid;grid-template-columns:280px 1fr;height:560px;border-radius:var(--radius);overflow:hidden;border:1px solid rgba(209,229,226,.7);box-shadow:var(--shadow)}
@media(max-width:768px){.dm-layout{grid-template-columns:1fr;height:auto}}
.dm-sidebar{background:#fff;border-right:1px solid #F1F5F9;display:flex;flex-direction:column;overflow:hidden}
.dm-sidebar-header{padding:18px 16px 12px;border-bottom:1px solid #F1F5F9}
.dm-main{display:flex;flex-direction:column;background:#FAFBFC;overflow:hidden}

/* ─ Mobile DM */
@media(max-width:768px){
  .dm-sidebar.dm-hidden{display:none}
  .dm-main.dm-hidden{display:none}
  .dm-layout{height:calc(100vh - 140px)}
}
`;

// ── Toast ─────────────────────────────────────────────────────
let _toastFn = null;
function toast(msg, type="success"){ _toastFn?.(msg, type); }

// ── Mock data ─────────────────────────────────────────────────
const MOCK = {
  profile:{id:"mock-uid",role:"admin",full_name:"Dr. Maria Santos",email:"admin@carenest.ph",phone:"+63 912 000 0001",address:"Zamboanga City"},
  patients:[
    {id:"p1",full_name:"Jose Reyes",age:72,gender:"male",diagnosis:"Hypertension",medical_history:"On amlodipine since 2015",status:"active",family_contact:"+63 912 111 1111",blood_type:"B+",created_at:"2026-01-10",assigned_caregiver:"c1"},
    {id:"p2",full_name:"Lourdes Cruz",age:65,gender:"female",diagnosis:"Diabetes Type 2",medical_history:"Insulin-dependent",status:"active",family_contact:"+63 912 222 2222",blood_type:"O+",created_at:"2026-02-15",assigned_caregiver:"c2"},
    {id:"p3",full_name:"Pedro Flores",age:80,gender:"male",diagnosis:"Post-stroke care",medical_history:"Ischemic stroke Jan 2026",status:"critical",family_contact:"+63 912 333 3333",blood_type:"A+",created_at:"2026-03-01",assigned_caregiver:"c1"},
    {id:"p4",full_name:"Elena Mendoza",age:58,gender:"female",diagnosis:"Rheumatoid Arthritis",medical_history:"On methotrexate",status:"stable",family_contact:"+63 912 444 4444",blood_type:"AB+",created_at:"2026-03-20"},
    {id:"p5",full_name:"Ramon Diaz",age:70,gender:"male",diagnosis:"COPD",medical_history:"Chronic smoker; bronchodilators",status:"active",family_contact:"+63 912 555 5555",blood_type:"O-",created_at:"2026-04-05",assigned_caregiver:"c2"},
  ],
  appointments:[
    {id:"a1",title:"Morning Check-up",patient_id:"p1",caregiver_id:"c1",date:"2026-05-28",time:"08:00",status:"scheduled",notes:"Blood pressure monitoring",duration_mins:30},
    {id:"a2",title:"Insulin Admin",patient_id:"p2",caregiver_id:"c2",date:"2026-05-28",time:"10:00",status:"completed",notes:"Regular insulin dose",duration_mins:20},
    {id:"a3",title:"Physical Therapy",patient_id:"p3",caregiver_id:"c1",date:"2026-05-29",time:"14:00",status:"scheduled",notes:"Upper limb exercises",duration_mins:60},
    {id:"a4",title:"Weekly Assessment",patient_id:"p4",date:"2026-05-30",time:"09:30",status:"scheduled",notes:"Joint pain evaluation",duration_mins:45},
    {id:"a5",title:"COPD Review",patient_id:"p5",caregiver_id:"c2",date:"2026-05-31",time:"11:00",status:"scheduled",notes:"Spirometry and O2 saturation",duration_mins:30},
  ],
  caregivers:[
    {id:"c1",full_name:"Nurse Ana Reyes",role:"caregiver",phone:"+63 917 111 0001",email:"ana@carenest.ph",specialty:"Geriatric Care",is_active:true},
    {id:"c2",full_name:"Caregiver Ben Torres",role:"caregiver",phone:"+63 917 222 0002",email:"ben@carenest.ph",specialty:"Chronic Disease Management",is_active:true},
    {id:"c3",full_name:"Nurse Clara Lim",role:"caregiver",phone:"+63 917 333 0003",email:"clara@carenest.ph",specialty:"Physical Therapy",is_active:true},
  ],
  messages:[
    {id:"m1",sender_id:"c1",receiver_id:null,content:"Good morning! Jose's BP is 130/85 today.",created_at:"2026-05-28T08:15:00",isOut:false,sender_name:"Nurse Ana",channel:"general"},
    {id:"m2",sender_id:"mock-uid",receiver_id:null,content:"Thank you. Please continue monitoring.",created_at:"2026-05-28T08:20:00",isOut:true,channel:"general"},
    {id:"m3",sender_id:"c2",receiver_id:null,content:"Lourdes had her insulin on time. Glucose 6.2 mmol/L.",created_at:"2026-05-28T10:05:00",isOut:false,sender_name:"Caregiver Ben",channel:"general"},
    {id:"dm1",sender_id:"c1",receiver_id:"mock-uid",content:"Doc, Pedro is showing signs of agitation. Should I give his PRN?",created_at:"2026-05-28T11:00:00",isOut:false,sender_name:"Nurse Ana",channel:"dm"},
    {id:"dm2",sender_id:"mock-uid",receiver_id:"c1",content:"Yes, go ahead. Monitor every 30 minutes after.",created_at:"2026-05-28T11:05:00",isOut:true,channel:"dm"},
  ],
  health_updates:[
    {id:"h1",patient_id:"p1",blood_pressure:"130/85",heart_rate:"72 bpm",temperature:"36.5°C",spo2:"97%",vitals:{bp:"130/85",hr:"72 bpm",temp:"36.5°C",spo2:"97%"},notes:"Stable. BP slightly elevated.",severity:"normal",created_at:"2026-05-28T08:00:00"},
    {id:"h2",patient_id:"p2",blood_pressure:"125/80",heart_rate:"68 bpm",temperature:"36.8°C",spo2:"98%",vitals:{},notes:"Post-meal glucose normal",severity:"normal",created_at:"2026-05-28T10:00:00"},
    {id:"h3",patient_id:"p3",blood_pressure:"160/95",heart_rate:"88 bpm",temperature:"37.2°C",spo2:"94%",vitals:{},notes:"Elevated BP — alert sent",severity:"critical",created_at:"2026-05-28T11:30:00"},
  ],
  billings:[
    {id:"b1",patient_id:"p1",amount:1500,description:"Weekly caregiving service",status:"paid",created_at:"2026-05-20",payment_method:"cash",discount:0,tax:0,total:1500},
    {id:"b2",patient_id:"p2",amount:2000,description:"Monthly insulin management",status:"pending",created_at:"2026-05-25",payment_method:null,discount:0,tax:0,total:2000},
    {id:"b3",patient_id:"p3",amount:3500,description:"24hr critical care support",status:"pending",created_at:"2026-05-26",payment_method:null,discount:0,tax:0,total:3500},
    {id:"b4",patient_id:"p4",amount:1200,description:"Physical therapy session x4",status:"paid",created_at:"2026-05-15",payment_method:"gcash",discount:0,tax:0,total:1200},
    {id:"b5",patient_id:"p5",amount:900,description:"Pulmonary assessment fee",status:"overdue",created_at:"2026-05-10",payment_method:null,discount:0,tax:0,total:900},
  ],
  notifications:[
    {id:"n1",title:"Critical Vital Alert",body:"Pedro Flores — BP 160/95 recorded",type:"alert",is_read:false,created_at:"2026-05-28T11:31:00"},
    {id:"n2",title:"Appointment Reminder",body:"Morning Check-up at 08:00 today",type:"info",is_read:false,created_at:"2026-05-28T07:00:00"},
    {id:"n3",title:"Payment Received",body:"Jose Reyes — ₱1,500 collected",type:"success",is_read:true,created_at:"2026-05-20T14:00:00"},
  ],
};

// ── Supabase helpers ──────────────────────────────────────────
let _demoMode = false;
async function sbQ(table, queryFn){
  if(_demoMode) return [];
  const {data,error}=await queryFn(supabase.from(table));
  if(error){console.error(`[${table}]`,error.message);return [];}
  return data||[];
}
async function sbGetProfile(uid){
  if(_demoMode) return MOCK.profile;
  const {data,error}=await supabase.from("profiles").select("*").eq("id",uid).single();
  if(error) return null;
  return data;
}
async function sbUpdateProfile(uid,fields){
  if(_demoMode){Object.assign(MOCK.profile,fields);return true;}
  const {error}=await supabase.from("profiles").update({...fields,updated_at:new Date().toISOString()}).eq("id",uid);
  return !error;
}
async function sbGetPatients(){
  if(_demoMode) return MOCK.patients;
  return (await sbQ("patients",q=>q.select("*").order("created_at",{ascending:false})))||[];
}
async function sbAddPatient(p){
  if(_demoMode){MOCK.patients.unshift({...p,id:"p"+Date.now(),created_at:new Date().toISOString()});return true;}
  const {error}=await supabase.from("patients").insert([p]);
  if(error){toast(error.message,"error");return false;}return true;
}
async function sbUpdatePatient(id,fields){
  if(_demoMode){const p=MOCK.patients.find(x=>x.id===id);if(p)Object.assign(p,fields);return true;}
  const {error}=await supabase.from("patients").update(fields).eq("id",id);return !error;
}
async function sbDeletePatient(id){
  if(_demoMode){const i=MOCK.patients.findIndex(x=>x.id===id);if(i>=0)MOCK.patients.splice(i,1);return true;}
  const {error}=await supabase.from("patients").delete().eq("id",id);return !error;
}
async function sbGetAppointments(){
  if(_demoMode) return MOCK.appointments;
  return (await sbQ("appointments",q=>q.select("*,patient:patients(*),caregiver:profiles(*)").order("date").order("time")))||[];
}
async function sbAddAppointment(a){
  if(_demoMode){MOCK.appointments.push({...a,id:"a"+Date.now(),created_at:new Date().toISOString()});return true;}
  const payload={
    ...a,
    caregiver_id: a.caregiver_id||null,
    patient_id: a.patient_id||null,
  };
  const {error}=await supabase.from("appointments").insert([payload]);
  if(error){toast(error.message,"error");return false;}return true;
}
async function sbUpdateAppointmentStatus(id,status){
  if(_demoMode){const a=MOCK.appointments.find(x=>x.id===id);if(a)a.status=status;return true;}
  const {error}=await supabase.from("appointments").update({status}).eq("id",id);return !error;
}
// Messages - channel "general" = group, "dm" + receiver_id = direct
async function sbGetAllMessages(uid){
  if(_demoMode) return MOCK.messages;
  const {data,error}=await supabase.from("messages").select("*")
    .or(`channel.eq.general,and(channel.eq.dm,sender_id.eq.${uid}),and(channel.eq.dm,receiver_id.eq.${uid})`)
    .order("created_at");
  if(error) return [];
  return data||[];
}
async function sbSendMessage(msg){
  if(_demoMode){
    MOCK.messages.push({...msg,id:"m"+Date.now(),created_at:new Date().toISOString(),isOut:true});
    return true;
  }
  const {error}=await supabase.from("messages").insert([msg]);return !error;
}
async function sbGetHealthUpdates(){
  if(_demoMode) return MOCK.health_updates;
  return (await sbQ("health_updates",q=>q.select("*").order("created_at",{ascending:false})))||[];
}
async function sbLogVitals(v){
  if(_demoMode){MOCK.health_updates.unshift({...v,id:"h"+Date.now(),created_at:new Date().toISOString()});return true;}
  const {patient_id,vitals={},notes,severity="normal"}=v;
  const {error}=await supabase.from("health_updates").insert([{patient_id,notes,severity,blood_pressure:vitals.bp,heart_rate:vitals.hr,temperature:vitals.temp,spo2:vitals.spo2,vitals}]);
  return !error;
}
async function sbGetBillings(){
  if(_demoMode) return MOCK.billings;
  return (await sbQ("billings",q=>q.select("*").order("created_at",{ascending:false})))||[];
}
async function sbAddBilling(b){
  if(_demoMode){MOCK.billings.unshift({...b,id:"b"+Date.now(),created_at:new Date().toISOString(),total:b.amount});return true;}
  const {error}=await supabase.from("billings").insert([{...b,discount:0,tax:0}]);return !error;
}
async function sbUpdateBillingStatus(id,status,method){
  if(_demoMode){const b=MOCK.billings.find(x=>x.id===id);if(b){b.status=status;if(method)b.payment_method=method;}return true;}
  const {error}=await supabase.from("billings").update({status,payment_method:method||null}).eq("id",id);return !error;
}
async function sbGetNotifications(uid){
  if(_demoMode) return MOCK.notifications;
  return (await sbQ("notifications",q=>q.select("*").eq("user_id",uid).order("created_at",{ascending:false})))||[];
}
async function sbGetProfiles(){
  if(_demoMode) return MOCK.caregivers;
  return await sbQ("profiles",q=>q.select("*").order("created_at",{ascending:false}));
}
async function sbUploadProfileImage(file,profileId){
  if(!file||_demoMode) return null;
  const ext=file.name.split(".").pop();
  const path=`${profileId}/${Date.now()}.${ext}`;
  const {error:upErr}=await supabase.storage.from("profile-images").upload(path,file,{cacheControl:"3600",upsert:true});
  if(upErr){console.error("upload",upErr.message);return null;}
  const {data}=await supabase.storage.from("profile-images").getPublicUrl(path);
  return data?.publicUrl||null;
}

function normalizePhone(v){return String(v||"").replace(/\D/g,"");}
function resolveLinkedPatient(profile,patients){
  if(!profile||!Array.isArray(patients)) return null;
  const ph=normalizePhone(profile?.phone);
  return patients.find(p=>p.created_by===profile.id)
    ||(ph?patients.find(p=>normalizePhone(p.family_contact)===ph):null)||null;
}
function resolveAssignedCaregivers(patient,caregivers){
  if(!Array.isArray(caregivers)) return [];
  if(!patient) return caregivers;
  if(patient.assigned_caregiver) return caregivers.filter(c=>c.id===patient.assigned_caregiver);
  if(Array.isArray(patient.assigned_caregivers)&&patient.assigned_caregivers.length)
    return caregivers.filter(c=>patient.assigned_caregivers.includes(c.id));
  return caregivers;
}

// ── Small components ──────────────────────────────────────────
function Spinner({size=18,color}){
  return <div className="spinner" style={{width:size,height:size,borderTopColor:color||C.jade}}/>;
}
function Avatar({name,size=36,src}){
  if(src) return <img src={src} alt={name||"avatar"} style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",border:"2px solid rgba(13,148,136,.15)"}}/>;
  const initials=(name||"?").split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();
  const colors=[["#CCFBF1","#0F766E"],["#D1FAE5","#059669"],["#E0F2FE","#0369A1"],["#EDE9FE","#6D28D9"],["#FEF3C7","#B45309"],["#FFE4E6","#BE123C"]];
  const idx=(name||"?").charCodeAt(0)%colors.length;
  const [bg,fg]=colors[idx];
  return <div className="avatar" style={{width:size,height:size,fontSize:size*0.35,background:bg,color:fg}}>{initials}</div>;
}
function Badge({status}){
  const map={active:"badge-green",stable:"badge-teal",critical:"badge-red",scheduled:"badge-amber",completed:"badge-green",cancelled:"badge-red",in_progress:"badge-purple",paid:"badge-green",pending:"badge-amber",overdue:"badge-red",discharged:"badge-blue",normal:"badge-green",warning:"badge-amber",caregiver:"badge-teal",admin:"badge-purple",family:"badge-blue",patient:"badge-green"};
  return <span className={`badge ${map[status]||"badge-teal"}`}>{status?.replace(/_/g," ")||"—"}</span>;
}
function Modal({open,onClose,title,children,footer,wide}){
  if(!open) return null;
  return(
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{maxWidth:wide?680:540}}>
        <div className="modal-handle" style={{display:'block'}}/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22}}>
          <h3 className="modal-title" style={{margin:0}}>{title}</h3>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:C.slateL,display:"flex",padding:4,borderRadius:8}}>
            <Icon name="x" size={20}/>
          </button>
        </div>
        {children}
        {footer&&<div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
function FG({label,children,style}){
  return <div style={{marginBottom:14,...style}}><label>{label}</label>{children}</div>;
}
function EmptyState({icon,message}){
  return(
    <div className="empty-state">
      <div className="empty-state-icon"><Icon name={icon||"info"} size={22} color={C.jade}/></div>
      <p>{message||"No records found."}</p>
    </div>
  );
}

// ── AUTH SCREEN ───────────────────────────────────────────────
function AuthScreen({onLogin}){
  const [mode,setMode]=useState("login");
  const [form,setForm]=useState({email:"",password:"",full_name:"",role:"caregiver"});
  const [loading,setLoading]=useState(false);
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));

  async function handleSubmit(){
    if(!form.email||!form.password){toast("Please fill all required fields","error");return;}
    setLoading(true);
    try{
      if(mode==="register"){
        if(!form.full_name){toast("Full name is required","error");setLoading(false);return;}
        const res=await supabase.auth.signUp({email:form.email,password:form.password,options:{data:{full_name:form.full_name,role:form.role}}});
        if(res.error) throw res.error;
        let user=res.data?.user,session=res.data?.session;
        if(!session){
          const s2=await supabase.auth.signInWithPassword({email:form.email,password:form.password});
          if(s2.error){toast("Account created. Check your email to confirm.");setLoading(false);return;}
          user=s2.data.user;session=s2.data.session;
        }
        if(user?.id){
          await supabase.from("profiles").upsert({id:user.id,full_name:form.full_name,role:form.role});
          const profile=await sbGetProfile(user.id);
          onLogin({...profile,email:user.email});
          toast(`Welcome, ${profile?.full_name?.split(" ")[0]||"there"}!`);
        }
      } else {
        const {data,error}=await supabase.auth.signInWithPassword({email:form.email,password:form.password});
        if(error) throw error;
        const profile=await sbGetProfile(data.user.id);
        onLogin({...profile,email:data.user.email});
        toast(`Welcome back, ${profile?.full_name?.split(" ")[0]||"there"}!`);
      }
    }catch(e){
      // Try demo mode
      _demoMode=true;
      onLogin(MOCK.profile);
      toast("Demo Mode — Supabase not connected");
    }
    setLoading(false);
  }
  const features=[
    {icon:"users",title:"Patient Management",desc:"Complete records, history & care plans"},
    {icon:"calendar",title:"Smart Scheduling",desc:"Appointments, reminders & caregiver sync"},
    {icon:"heart",title:"Health Monitoring",desc:"Real-time vitals & critical alerts"},
    {icon:"message",title:"Direct Messaging",desc:"Message caregivers directly anytime"},
    {icon:"creditcard",title:"Billing & Finance",desc:"Transparent invoicing & payment tracking"},
  ];
  return(
    <div className="auth-screen">
      <div className="auth-left">
        <div className="auth-left-orb1"/><div className="auth-left-orb2"/><div className="auth-left-grid"/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:36}}>
            <div className="sidebar-logo-icon" style={{width:46,height:46,borderRadius:13}}><Icon name="heart" size={22} color="#fff"/></div>
            <div>
              <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:28,color:"#fff",lineHeight:1,letterSpacing:"-.4px"}}>CareNest</h1>
              <p style={{color:"rgba(148,163,184,.6)",fontSize:11,letterSpacing:"1px",textTransform:"uppercase"}}>Caregiving Platform</p>
            </div>
          </div>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:34,color:"#fff",lineHeight:1.1,letterSpacing:"-.5px",marginBottom:10}}>
            Compassionate care,<br/><span style={{color:C.jade}}>beautifully managed.</span>
          </h2>
          <p style={{color:"rgba(148,163,184,.7)",fontSize:14,marginBottom:32,lineHeight:1.7}}>Your all-in-one platform for modern caregiving.</p>
          {features.map(f=>(
            <div key={f.icon} className="feature-pill">
              <div className="feature-pill-icon"><Icon name={f.icon} size={16} color={C.jade}/></div>
              <div>
                <div style={{color:"#fff",fontWeight:600,fontSize:13}}>{f.title}</div>
                <div style={{color:"rgba(148,163,184,.6)",fontSize:12,marginTop:1}}>{f.desc}</div>
              </div>
            </div>
          ))}
          <div style={{marginTop:24,display:"flex",alignItems:"center",gap:8}}>
            <Icon name="shield" size={13} color={C.jade}/>
            <span style={{color:"rgba(100,116,139,.7)",fontSize:11.5}}>Secured with Supabase Auth & Row-Level Security</span>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card fade-up">
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
            <div className="sidebar-logo-icon" style={{width:40,height:40,borderRadius:11}}><Icon name="heart" size={18} color="#fff"/></div>
            <div><div style={{fontWeight:700,fontSize:14,color:C.slate}}>CareNest</div><div style={{fontSize:11,color:C.slateL}}>Caregiving Platform</div></div>
          </div>
          <h2 className="auth-card-title">{mode==="login"?"Welcome back":"Create account"}</h2>
          <p className="auth-card-sub">{mode==="login"?"Sign in to continue to your CareNest dashboard.":"Join the CareNest platform and start managing care today."}</p>
          {mode==="register"&&(
            <div className="auth-form-group">
              <label>Full Name</label>
              <div className="input-icon-wrap"><span className="input-icon"><Icon name="user" size={14}/></span><input placeholder="e.g. Maria Santos" value={form.full_name} onChange={set("full_name")}/></div>
            </div>
          )}
          <div className="auth-form-group">
            <label>Email Address</label>
            <div className="input-icon-wrap"><span className="input-icon"><Icon name="mail" size={14}/></span><input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/></div>
          </div>
          <div className="auth-form-group">
            <label>Password</label>
            <div className="input-icon-wrap"><span className="input-icon"><Icon name="lock" size={14}/></span><input type="password" placeholder="••••••••" value={form.password} onChange={set("password")} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/></div>
          </div>
          {mode==="register"&&(
            <div className="auth-form-group">
              <label>Role</label>
              <select value={form.role} onChange={set("role")}>
                <option value="admin">Admin</option><option value="caregiver">Caregiver</option>
                <option value="patient">Patient</option><option value="family">Family Member</option>
              </select>
            </div>
          )}
          <button className="btn btn-primary" style={{width:"100%",justifyContent:"center",padding:"13px 20px",marginTop:8,fontSize:14,borderRadius:13}} onClick={handleSubmit} disabled={loading}>
            {loading?<Spinner color="#fff"/>:<>{mode==="login"?"Sign In":"Create Account"}<Icon name="chevronright" size={15}/></>}
          </button>
          <p style={{textAlign:"center",marginTop:20,fontSize:13.5,color:C.slateL}}>
            {mode==="login"?"Don't have an account? ":"Already have an account? "}
            <span style={{color:C.jade,cursor:"pointer",fontWeight:600}} onClick={()=>setMode(mode==="login"?"register":"login")}>
              {mode==="login"?"Sign up":"Sign in"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────
function Dashboard({patients,appointments,billings,healthUpdates,notifications,onNav}){
  const today=new Date().toISOString().split("T")[0];
  const todayAppts=appointments.filter(a=>a.date===today);
  const critical=patients.filter(p=>p.status==="critical").length;
  const pendingBills=billings.filter(b=>b.status==="pending").reduce((s,b)=>s+Number(b.amount),0);
  const unreadNotifs=notifications.filter(n=>!n.is_read).length;
  const stats=[
    {icon:"users",val:patients.length,label:"Total Patients",color:C.jade,bg:"#D1FAE5",trend:"+2 this month"},
    {icon:"calendar",val:todayAppts.length,label:"Today's Appts",color:C.violet,bg:"#EDE9FE",trend:`${appointments.filter(a=>a.status==="scheduled").length} scheduled`},
    {icon:"alert",val:critical,label:"Critical Cases",color:C.rose,bg:"#FFE4E6",trend:"Needs attention"},
    {icon:"creditcard",val:`₱${pendingBills.toLocaleString()}`,label:"Pending Bills",color:C.amber,bg:"#FEF3C7",trend:`${billings.filter(b=>b.status==="pending").length} invoices`},
  ];
  const recentHealth=healthUpdates.slice(0,4);

  return(
    <div className="fade-up">
      {/* Mobile hero */}
      <div className="mobile-hero" style={{display:"none"}}>
        <div style={{position:"relative",zIndex:1}}>
          <p style={{fontSize:11,color:C.jade,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:6}}>
            {new Date().toLocaleDateString("en-PH",{weekday:"long",month:"long",day:"numeric"})}
          </p>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:26,color:"#fff",lineHeight:1.1,marginBottom:6}}>Good morning 👋</h2>
          <p style={{color:"rgba(148,163,184,.7)",fontSize:13,marginBottom:18}}>Here's what's happening in CareNest today.</p>
          {unreadNotifs>0&&(
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(244,63,94,.15)",color:"#FCA5A5",border:"1px solid rgba(244,63,94,.3)",borderRadius:99,padding:"6px 14px",fontSize:12,fontWeight:600}}>
              <Icon name="bellring" size={13} color="#FCA5A5"/> {unreadNotifs} alert{unreadNotifs>1?"s":""}
            </div>
          )}
        </div>
      </div>

      <div className="page-header" style={{display:"block"}}>
        <p style={{fontSize:12,color:C.jade,fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>
          {new Date().toLocaleDateString("en-PH",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}
        </p>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16}}>
          <div>
            <h2 className="page-title">Good morning 👋</h2>
            <p className="page-subtitle">Here's what's happening in CareNest today.</p>
          </div>
          <div style={{display:"flex",gap:10,flexShrink:0}}>
            {unreadNotifs>0&&(
              <div style={{display:"flex",alignItems:"center",gap:7,background:"#FEF3C7",color:C.amber,border:"1px solid #FDE68A",borderRadius:10,padding:"8px 14px",fontSize:12.5,fontWeight:600}}>
                <Icon name="alert" size={14} color={C.amber}/> {unreadNotifs} alert{unreadNotifs>1?"s":""}
              </div>
            )}
            <button className="btn btn-primary" onClick={()=>onNav("patients")}><Icon name="plus" size={15}/> New Patient</button>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((s,i)=>(
          <div key={i} className="stat-card fade-up" style={{animationDelay:`${i*0.06}s`,cursor:"pointer"}} onClick={()=>onNav(["patients","appointments","health","billing"][i])}>
            <div className="stat-card-bg" style={{background:s.color}}/>
            <div className="stat-icon" style={{background:s.bg}}><Icon name={s.icon} size={20} color={s.color}/></div>
            <div className="stat-val" style={{color:s.color}}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-trend" style={{background:s.bg,color:s.color}}>{s.trend}</div>
          </div>
        ))}
      </div>

      <div className="content-grid">
        <div className="card">
          <div className="section-header">
            <h3 className="section-title">Today's Schedule</h3>
            <button className="btn btn-ghost" style={{padding:"6px 14px",fontSize:12}} onClick={()=>onNav("appointments")}>View All</button>
          </div>
          {todayAppts.length===0?<EmptyState icon="calendar" message="No appointments today."/>:todayAppts.map((a,i)=>(
            <div key={a.id} className="fade-up" style={{animationDelay:`${i*0.05}s`,display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:i<todayAppts.length-1?"1px solid #F8FAFC":"none"}}>
              <div style={{background:"linear-gradient(135deg,#CCFBF1,#A7F3D0)",color:C.jadeD,borderRadius:10,padding:"6px 10px",fontSize:12,fontWeight:700,minWidth:52,textAlign:"center",flexShrink:0}}>
                {a.time}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:13.5,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{a.title}</div>
                <div style={{fontSize:12,color:C.slateL,marginTop:2}}>{a.notes}</div>
              </div>
              <Badge status={a.status}/>
            </div>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:18}}>
          <div className="card">
            <div className="section-header">
              <h3 className="section-title">Health Alerts</h3>
              <button className="btn btn-ghost" style={{padding:"6px 14px",fontSize:12}} onClick={()=>onNav("health")}>View All</button>
            </div>
            {recentHealth.map((u,i)=>{
              const pt=patients.find(p=>p.id===u.patient_id);
              const isCrit=u.severity==="critical";
              return(
                <div key={u.id} style={{display:"flex",gap:10,marginBottom:i<recentHealth.length-1?12:0,padding:"10px",borderRadius:10,background:isCrit?"#FFF1F2":"transparent",border:isCrit?"1px solid #FFE4E6":"none"}}>
                  <Avatar name={pt?.full_name||"?"} size={32}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontWeight:600,fontSize:12.5}}>{pt?.full_name||"Unknown"}</span>
                      {isCrit&&<span style={{fontSize:10,fontWeight:700,color:C.rose,background:"#FFE4E6",padding:"1px 6px",borderRadius:99}}>CRITICAL</span>}
                    </div>
                    <div style={{fontSize:11.5,color:C.slateL,marginTop:1}}>{u.notes}</div>
                    <div style={{display:"flex",gap:5,marginTop:5,flexWrap:"wrap"}}>
                      {u.blood_pressure&&<span className="tag">BP: {u.blood_pressure}</span>}
                      {u.heart_rate&&<span className="tag">HR: {u.heart_rate}</span>}
                      {u.spo2&&<span className="tag">SpO₂: {u.spo2}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
            {recentHealth.length===0&&<EmptyState icon="activity" message="No health updates yet."/>}
          </div>
          <div className="card" style={{background:"linear-gradient(135deg,var(--onyx),var(--pine))",color:"#fff",border:"none"}}>
            <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:15,marginBottom:14,color:"#fff"}}>Billing Overview</h3>
            {[{label:"Collected",val:`₱${billings.filter(b=>b.status==="paid").reduce((s,b)=>s+Number(b.amount),0).toLocaleString()}`,color:C.jade},
              {label:"Outstanding",val:`₱${billings.filter(b=>b.status==="pending").reduce((s,b)=>s+Number(b.amount),0).toLocaleString()}`,color:C.amber},
              {label:"Overdue",val:`₱${billings.filter(b=>b.status==="overdue").reduce((s,b)=>s+Number(b.amount),0).toLocaleString()}`,color:C.rose},
            ].map(r=>(
              <div key={r.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
                <span style={{fontSize:13,color:"rgba(148,163,184,.7)"}}>{r.label}</span>
                <span style={{fontFamily:"'DM Serif Display',serif",fontSize:18,color:r.color}}>{r.val}</span>
              </div>
            ))}
            <button className="btn" style={{marginTop:14,width:"100%",justifyContent:"center",background:"rgba(255,255,255,.08)",color:"#fff",border:"1px solid rgba(255,255,255,.12)",borderRadius:10}} onClick={()=>onNav("billing")}>
              Manage Billing →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PATIENTS MODULE ───────────────────────────────────────────
function PatientsModule({patients,setPatients,profile,setAppointments,caregivers,setCaregivers}){
  const [showAdd,setShowAdd]=useState(false);
  const [showEdit,setShowEdit]=useState(null);
  const [showBook,setShowBook]=useState(null);
  const [showDetail,setShowDetail]=useState(null);
  const [bookForm,setBookForm]=useState({caregiver_id:"",date:"",time:"",notes:"",duration_mins:60,title:""});
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("all");
  const [loading,setLoading]=useState(false);
  const emptyForm={full_name:"",age:"",gender:"",diagnosis:"",medical_history:"",allergies:"",current_medications:"",status:"active",family_contact:"",emergency_contact:"",blood_type:"",address:""};
  const [form,setForm]=useState(emptyForm);
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));

  const isPatientRole=profile?.role==="patient";
  const isFamilyRole=profile?.role==="family";
  const linkedPatient=resolveLinkedPatient(profile,patients);
  const isLimitedRole=isPatientRole||isFamilyRole;

  const filteredBase=patients.filter(p=>{
    const q=search.toLowerCase();
    const matchSearch=!q||p.full_name.toLowerCase().includes(q)||p.diagnosis.toLowerCase().includes(q);
    const matchStatus=filterStatus==="all"||p.status===filterStatus;
    return matchSearch&&matchStatus;
  });
  const filtered=isLimitedRole?(linkedPatient?[linkedPatient]:[]):filteredBase;

  // When opening book modal, pre-select caregiver
  useEffect(()=>{
    if(!showBook)return;
    const p=patients.find(x=>x.id===showBook)||linkedPatient;
    const assigned=resolveAssignedCaregivers(p,caregivers);
    const first=assigned?.length?assigned[0].id:(caregivers[0]?.id||"");
    setBookForm(f=>({...f,caregiver_id:first,title:`Visit – ${p?.full_name||""}`}));
  },[showBook]);

  async function save(){
    if(!form.full_name||!form.diagnosis){toast("Name and diagnosis are required","error");return;}
    setLoading(true);
    if(showEdit){
      const ok=await sbUpdatePatient(showEdit,{...form,age:form.age?Number(form.age):null});
      if(ok){setPatients(await sbGetPatients());toast("Patient updated");setShowEdit(null);}
      else toast("Failed to update","error");
    }else{
      const ok=await sbAddPatient({...form,age:form.age?Number(form.age):null});
      if(ok){setPatients(await sbGetPatients());toast("Patient added");setShowAdd(false);setForm(emptyForm);}
      else toast("Failed to add patient","error");
    }
    setLoading(false);
  }
  async function del(id){
    if(!window.confirm("Remove this patient record permanently?")) return;
    const ok=await sbDeletePatient(id);
    if(ok){setPatients(await sbGetPatients());toast("Patient removed");}
    else toast("Failed to remove","error");
  }
  function openEdit(p){setForm({...emptyForm,...p,age:p.age?.toString()||""});setShowEdit(p.id);}

  const statusCounts=["active","stable","critical","discharged"].map(s=>({status:s,count:patients.filter(p=>p.status===s).length}));
  const statusColorMap={active:C.jade,stable:C.sky,critical:C.rose,discharged:C.slateL};

  async function bookAppointment(){
    if(!bookForm.caregiver_id||!bookForm.date||!bookForm.time){toast("Select caregiver, date and time","error");return;}
    const pt=patients.find(x=>x.id===showBook)||linkedPatient;
    if(!pt){toast("No linked patient found","error");return;}
    const appt={
      title:bookForm.title||`Appointment – ${pt.full_name}`,
      patient_id:pt.id,caregiver_id:bookForm.caregiver_id||null,
      date:bookForm.date,time:bookForm.time,
      duration_mins:Number(bookForm.duration_mins)||60,
      notes:bookForm.notes||"",created_by:profile?.id||null,status:"scheduled"
    };
    const ok=await sbAddAppointment(appt);
    if(ok){
      toast("Appointment booked!");
      setShowBook(null);
      setBookForm({caregiver_id:"",date:"",time:"",notes:"",duration_mins:60,title:""});
      if(setAppointments) setAppointments(await sbGetAppointments());
    } else toast("Failed to create appointment","error");
  }

  return(
    <div className="fade-up">
      <div className="page-header">
        <div>
          <h2 className="page-title">Patients</h2>
          <p className="page-subtitle">{filtered.length} record{filtered.length!==1?"s":""}</p>
        </div>
        {!isLimitedRole&&(
          <button className="btn btn-primary" onClick={()=>{setForm(emptyForm);setShowAdd(true);}}>
            <Icon name="plus" size={15}/> Add Patient
          </button>
        )}
      </div>

      {!isLimitedRole&&(
        <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
          {[{label:"All",val:"all"},...statusCounts.map(s=>({label:`${s.status.charAt(0).toUpperCase()+s.status.slice(1)} (${s.count})`,val:s.status}))].map(f=>(
            <button key={f.val} className={`btn ${filterStatus===f.val?"btn-primary":"btn-ghost"}`}
              style={{padding:"7px 16px",fontSize:12.5,borderRadius:99}} onClick={()=>setFilterStatus(f.val)}>
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Mobile card view */}
      <div style={{display:"none"}} className="mobile-patient-grid">
        <div style={{position:"relative",marginBottom:16}}>
          <span style={{position:"absolute",top:"50%",left:12,transform:"translateY(-50%)",color:C.slateXL}}><Icon name="search" size={15}/></span>
          <input placeholder="Search patients…" value={search} onChange={e=>setSearch(e.target.value)} style={{paddingLeft:38}}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {filtered.map((p,i)=>{
            const assigned=resolveAssignedCaregivers(p,caregivers);
            const bgColor=statusColorMap[p.status]||C.jade;
            return(
              <div key={p.id} className="patient-card fade-up" style={{animationDelay:`${i*0.05}s`,borderTop:`3px solid ${bgColor}`}} onClick={()=>setShowDetail(p)}>
                <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:12}}>
                  <Avatar name={p.full_name} size={44}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:15,marginBottom:2}}>{p.full_name}</div>
                    <div style={{fontSize:12,color:C.slateL,marginBottom:6}}>{p.diagnosis}</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                      <Badge status={p.status}/>
                      {p.blood_type&&<span className="tag">{p.blood_type}</span>}
                      {p.age&&<span className="tag">{p.age} yrs</span>}
                    </div>
                  </div>
                </div>
                {assigned.length>0&&(
                  <div style={{padding:"8px 10px",background:"#F0FDF9",borderRadius:10,marginBottom:10,display:"flex",alignItems:"center",gap:8,border:"1px solid #CCFBF1"}}>
                    <Avatar name={assigned[0].full_name} size={24}/>
                    <span style={{fontSize:11.5,color:C.jadeD,fontWeight:600}}>{assigned[0].full_name}</span>
                    <span style={{fontSize:10.5,color:C.slateL,marginLeft:"auto"}}>{assigned[0].specialty||"Caregiver"}</span>
                  </div>
                )}
                <div style={{display:"flex",gap:8}}>
                  {isLimitedRole?(
                    <button className="btn btn-primary" style={{flex:1,justifyContent:"center",padding:"9px",fontSize:12.5}} onClick={e=>{e.stopPropagation();setShowBook(p.id);}}>
                      <Icon name="calendar" size={14}/> Book Appointment
                    </button>
                  ):(
                    <>
                      <button className="btn btn-ghost" style={{flex:1,justifyContent:"center",padding:"9px",fontSize:12}} onClick={e=>{e.stopPropagation();openEdit(p);}}>
                        <Icon name="edit" size={13}/> Edit
                      </button>
                      <button className="btn btn-primary" style={{flex:1,justifyContent:"center",padding:"9px",fontSize:12}} onClick={e=>{e.stopPropagation();setShowBook(p.id);}}>
                        <Icon name="calendar" size={13}/> Book
                      </button>
                      <button className="btn btn-danger" style={{padding:"9px 13px"}} onClick={e=>{e.stopPropagation();del(p.id);}}>
                        <Icon name="trash" size={13}/>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length===0&&<div className="card"><EmptyState icon="users" message="No patients found."/></div>}
        </div>
      </div>

      {/* Desktop table view */}
      <div className="card desktop-only">
        <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:20}}>
          <div style={{position:"relative",flex:1,maxWidth:340}}>
            <span style={{position:"absolute",top:"50%",left:12,transform:"translateY(-50%)",color:C.slateXL}}><Icon name="search" size={15}/></span>
            <input placeholder="Search by name or diagnosis…" value={search} onChange={e=>setSearch(e.target.value)} style={{paddingLeft:38}}/>
          </div>
          <div style={{marginLeft:"auto",fontSize:12,color:C.slateL,fontWeight:500}}>{filtered.length} record{filtered.length!==1?"s":""}</div>
        </div>
        <div style={{overflowX:"auto"}}>
          <table className="data-table">
            <thead>
              <tr><th>Patient</th><th>Age/Gender</th><th>Diagnosis</th><th>Caregiver</th><th>Blood Type</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(p=>{
                const assigned=resolveAssignedCaregivers(p,caregivers);
                return(
                  <tr key={p.id}>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:11}}>
                        <Avatar name={p.full_name} size={36}/>
                        <div>
                          <div style={{fontWeight:600,fontSize:13.5}}>{p.full_name}</div>
                          <div style={{fontSize:11,color:C.slateL}}>{p.family_contact||"No contact"}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{color:C.slateM}}>{p.age?`${p.age} yrs`:"—"}{p.gender&&<span style={{display:"block",fontSize:11,color:C.slateXL,textTransform:"capitalize"}}>{p.gender}</span>}</td>
                    <td style={{maxWidth:180,color:C.slateM,fontSize:13}}>{p.diagnosis}</td>
                    <td>
                      {assigned.length>0?(
                        <div style={{display:"flex",alignItems:"center",gap:7}}>
                          <Avatar name={assigned[0].full_name} size={26}/>
                          <span style={{fontSize:12.5,fontWeight:600,color:C.jadeD}}>{assigned[0].full_name}</span>
                        </div>
                      ):<span style={{color:C.slateXL,fontSize:12}}>Unassigned</span>}
                    </td>
                    <td>{p.blood_type?<span className="tag">{p.blood_type}</span>:"—"}</td>
                    <td><Badge status={p.status}/></td>
                    <td>
                      <div style={{display:"flex",gap:6}}>
                        {isLimitedRole?(
                          <button className="btn btn-primary" style={{padding:"6px 11px",gap:5}} onClick={()=>setShowBook(p.id)}>
                            <Icon name="calendar" size={13}/><span style={{fontSize:12}}>Book</span>
                          </button>
                        ):(
                          <>
                            <button className="btn btn-ghost" style={{padding:"6px 11px",gap:5}} onClick={()=>openEdit(p)}>
                              <Icon name="edit" size={13}/><span style={{fontSize:12}}>Edit</span>
                            </button>
                            <button className="btn btn-primary" style={{padding:"6px 11px",gap:5}} onClick={()=>setShowBook(p.id)}>
                              <Icon name="calendar" size={13}/><span style={{fontSize:12}}>Book</span>
                            </button>
                            <button className="btn btn-danger" style={{padding:"6px 11px",gap:5}} onClick={()=>del(p.id)}>
                              <Icon name="trash" size={13}/>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length===0&&<tr><td colSpan={7}><EmptyState icon="users" message="No patients found."/></td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal open={showAdd||!!showEdit} onClose={()=>{setShowAdd(false);setShowEdit(null);}} title={showEdit?"Edit Patient":"Add New Patient"} wide
        footer={<>
          <button className="btn btn-ghost" onClick={()=>{setShowAdd(false);setShowEdit(null);}}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={loading}>
            {loading?<Spinner color="#fff"/>:<><Icon name="check" size={14}/>{showEdit?"Update Patient":"Save Patient"}</>}
          </button>
        </>}>
        <div className="form-row">
          <FG label="Full Name *"><input value={form.full_name} onChange={set("full_name")} placeholder="Juan dela Cruz"/></FG>
          <FG label="Age"><input type="number" value={form.age} onChange={set("age")} placeholder="65"/></FG>
        </div>
        <div className="form-row">
          <FG label="Gender"><select value={form.gender} onChange={set("gender")}><option value="">Select…</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></FG>
          <FG label="Blood Type"><select value={form.blood_type} onChange={set("blood_type")}><option value="">Select…</option>{["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bt=><option key={bt} value={bt}>{bt}</option>)}</select></FG>
        </div>
        <FG label="Diagnosis *"><input value={form.diagnosis} onChange={set("diagnosis")} placeholder="e.g. Hypertension"/></FG>
        <div className="form-row">
          <FG label="Status"><select value={form.status} onChange={set("status")}><option value="active">Active</option><option value="stable">Stable</option><option value="critical">Critical</option><option value="discharged">Discharged</option></select></FG>
          <FG label="Assigned Caregiver">
            <select value={form.assigned_caregiver||""} onChange={e=>setForm(f=>({...f,assigned_caregiver:e.target.value}))}>
              <option value="">None</option>
              {caregivers.map(c=><option key={c.id} value={c.id}>{c.full_name}</option>)}
            </select>
          </FG>
        </div>
        <div className="form-row">
          <FG label="Family Contact"><input value={form.family_contact} onChange={set("family_contact")} placeholder="+63 9XX XXX XXXX"/></FG>
          <FG label="Emergency Contact"><input value={form.emergency_contact} onChange={set("emergency_contact")} placeholder="+63 9XX XXX XXXX"/></FG>
        </div>
        <FG label="Medical History"><textarea rows={2} value={form.medical_history} onChange={set("medical_history")} placeholder="Previous conditions, hospitalizations…"/></FG>
        <div className="form-row">
          <FG label="Allergies"><input value={form.allergies} onChange={set("allergies")} placeholder="e.g. Penicillin"/></FG>
          <FG label="Current Medications"><input value={form.current_medications} onChange={set("current_medications")} placeholder="e.g. Amlodipine 5mg"/></FG>
        </div>
      </Modal>

      {/* Book Appointment Modal — Enhanced with caregiver selection */}
      <Modal open={!!showBook} onClose={()=>{setShowBook(null);setBookForm({caregiver_id:"",date:"",time:"",notes:"",duration_mins:60,title:""});}} title="Book Appointment" wide
        footer={<>
          <button className="btn btn-ghost" onClick={()=>setShowBook(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={bookAppointment}>
            <Icon name="calendar" size={14}/> Confirm Booking
          </button>
        </>}>
        {(()=>{
          const selectedPatient=patients.find(x=>x.id===showBook)||linkedPatient;
          const assignedCaregivers=resolveAssignedCaregivers(selectedPatient,caregivers);
          const caregiverOptions=assignedCaregivers.length?assignedCaregivers:caregivers;
          return(
            <>
              {/* Patient info chip */}
              <div style={{background:"linear-gradient(135deg,#F0FDF9,#CCFBF1)",border:"1px solid #A7F3D0",borderRadius:14,padding:"12px 16px",marginBottom:20,display:"flex",alignItems:"center",gap:12}}>
                <Avatar name={selectedPatient?.full_name||"?"} size={44}/>
                <div>
                  <div style={{fontWeight:700,fontSize:15}}>{selectedPatient?.full_name||"No linked patient"}</div>
                  <div style={{fontSize:12,color:C.jadeD,display:"flex",alignItems:"center",gap:4,marginTop:2}}>
                    <Icon name="stethoscope" size={12} color={C.jadeD}/>{selectedPatient?.diagnosis||"—"}
                  </div>
                </div>
                {selectedPatient&&<Badge status={selectedPatient.status}/>}
              </div>

              <FG label="Appointment Title"><input value={bookForm.title} onChange={e=>setBookForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Morning Check-up"/></FG>

              {/* Caregiver cards */}
              <label style={{marginBottom:10,display:"block"}}>Select Caregiver</label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                {caregiverOptions.map(c=>(
                  <div key={c.id} className={`caregiver-card ${bookForm.caregiver_id===c.id?"selected":""}`}
                    onClick={()=>setBookForm(f=>({...f,caregiver_id:c.id}))}>
                    <Avatar name={c.full_name} size={40}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.full_name}</div>
                      <div style={{fontSize:11,color:C.slateL,marginTop:2}}>{c.specialty||"Caregiver"}</div>
                      {c.is_active&&<div style={{fontSize:10,color:"#059669",fontWeight:700,marginTop:3,display:"flex",alignItems:"center",gap:3}}><div style={{width:5,height:5,borderRadius:"50%",background:"#22C55E"}}/>Available</div>}
                    </div>
                    {bookForm.caregiver_id===c.id&&<div style={{color:C.jade}}><Icon name="check" size={18}/></div>}
                  </div>
                ))}
              </div>

              <div className="form-row">
                <FG label="Date *"><input type="date" value={bookForm.date} onChange={e=>setBookForm(f=>({...f,date:e.target.value}))}/></FG>
                <FG label="Time *"><input type="time" value={bookForm.time} onChange={e=>setBookForm(f=>({...f,time:e.target.value}))}/></FG>
              </div>
              <div className="form-row">
                <FG label="Duration (mins)"><input type="number" value={bookForm.duration_mins} onChange={e=>setBookForm(f=>({...f,duration_mins:e.target.value}))}/></FG>
              </div>
              <FG label="Notes / Special Instructions"><textarea rows={3} value={bookForm.notes} onChange={e=>setBookForm(f=>({...f,notes:e.target.value}))} placeholder="Any specific care instructions…"/></FG>
            </>
          );
        })()}
      </Modal>

      {/* Patient detail modal (mobile) */}
      <Modal open={!!showDetail} onClose={()=>setShowDetail(null)} title="Patient Details">
        {showDetail&&(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20,padding:"16px",background:"#F8FAFC",borderRadius:14}}>
              <Avatar name={showDetail.full_name} size={56}/>
              <div>
                <div style={{fontWeight:700,fontSize:16,marginBottom:4}}>{showDetail.full_name}</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <Badge status={showDetail.status}/>
                  {showDetail.blood_type&&<span className="tag">{showDetail.blood_type}</span>}
                  {showDetail.age&&<span className="tag">{showDetail.age} yrs</span>}
                </div>
              </div>
            </div>
            {[
              {label:"Diagnosis",val:showDetail.diagnosis},
              {label:"Medical History",val:showDetail.medical_history||"—"},
              {label:"Allergies",val:showDetail.allergies||"None"},
              {label:"Current Medications",val:showDetail.current_medications||"None"},
              {label:"Family Contact",val:showDetail.family_contact||"—"},
              {label:"Address",val:showDetail.address||"—"},
            ].map(r=>(
              <div key={r.label} style={{padding:"10px 0",borderBottom:"1px solid #F8FAFC",display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
                <span style={{fontSize:12,fontWeight:600,color:C.slateL,textTransform:"uppercase",letterSpacing:".5px",flexShrink:0}}>{r.label}</span>
                <span style={{fontSize:13.5,color:C.slate,textAlign:"right"}}>{r.val}</span>
              </div>
            ))}
            <div style={{display:"flex",gap:10,marginTop:20}}>
              <button className="btn btn-primary" style={{flex:1,justifyContent:"center"}} onClick={()=>{setShowBook(showDetail.id);setShowDetail(null);}}>
                <Icon name="calendar" size={14}/> Book Appointment
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ── APPOINTMENTS MODULE ───────────────────────────────────────
function AppointmentsModule({appointments,setAppointments,patients,profile,caregivers}){
  const [showAdd,setShowAdd]=useState(false);
  const [filter,setFilter]=useState("all");
  const [loading,setLoading]=useState(false);
  const [form,setForm]=useState({title:"",patient_id:"",caregiver_id:"",date:"",time:"",notes:"",status:"scheduled",duration_mins:60});
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  const linkedPatient=resolveLinkedPatient(profile,patients);
  const isLimitedRole=profile?.role==="patient"||profile?.role==="family";
  const filtered=appointments.filter(a=>filter==="all"||a.status===filter);

  async function addAppt(){
    const patientId=isLimitedRole?linkedPatient?.id:form.patient_id;
    if(!form.title||!patientId||!form.date||!form.time){toast("Fill all required fields","error");return;}
    setLoading(true);
    const ok=await sbAddAppointment({...form,patient_id:patientId,duration_mins:Number(form.duration_mins)||60,status:"scheduled"});
    if(ok){setAppointments(await sbGetAppointments());toast("Appointment scheduled");setShowAdd(false);setForm({title:"",patient_id:"",caregiver_id:"",date:"",time:"",notes:"",status:"scheduled",duration_mins:60});}
    setLoading(false);
  }

  async function changeStatus(id,status){
    const ok=await sbUpdateAppointmentStatus(id,status);
    if(ok){setAppointments(await sbGetAppointments());toast(`Marked as ${status}`);}
  }

  const statusColors={scheduled:C.amber,completed:C.jade,cancelled:C.rose,in_progress:C.violet,no_show:C.slateL};
  const filterTabs=["all","scheduled","in_progress","completed","cancelled"];

  return(
    <div className="fade-up">
      <div className="page-header">
        <div><h2 className="page-title">Appointments</h2><p className="page-subtitle">Manage caregiving sessions</p></div>
        <button className="btn btn-primary" onClick={()=>setShowAdd(true)}><Icon name="plus" size={15}/> Schedule</button>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap",overflowX:"auto",paddingBottom:4}}>
        {filterTabs.map(f=>(
          <button key={f} className={`btn ${filter===f?"btn-primary":"btn-ghost"}`}
            style={{padding:"7px 16px",fontSize:12.5,borderRadius:99,textTransform:"capitalize",whiteSpace:"nowrap"}}
            onClick={()=>setFilter(f)}>
            {f.replace("_"," ")} {f!=="all"&&`(${appointments.filter(a=>a.status===f).length})`}
          </button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(295px,1fr))",gap:16}}>
        {filtered.map((a,i)=>{
          const pt=a.patient||patients.find(p=>p.id===a.patient_id);
          const cg=a.caregiver||caregivers.find(c=>c.id===a.caregiver_id);
          const borderColor=statusColors[a.status]||C.jade;
          return(
            <div key={a.id} className="appt-card slide-left" style={{animationDelay:`${i*0.04}s`,borderTop:`3px solid ${borderColor}`}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>{a.title}</div>
                  <div style={{fontSize:12,color:C.slateL,display:"flex",alignItems:"center",gap:5}}>
                    <Icon name="calendar" size={11} color={C.slateL}/>{a.date} · {a.time} · {a.duration_mins||60}min
                  </div>
                </div>
                <Badge status={a.status}/>
              </div>
              {pt&&(
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:cg?8:12,padding:"8px 10px",background:"#F8FAFC",borderRadius:9}}>
                  <Avatar name={pt.full_name} size={26}/>
                  <div>
                    <div style={{fontSize:12.5,fontWeight:600}}>{pt.full_name}</div>
                    <div style={{fontSize:11,color:C.slateL}}>{pt.diagnosis}</div>
                  </div>
                </div>
              )}
              {cg&&(
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,padding:"8px 10px",background:"#EFF6FF",borderRadius:9,border:"1px solid #DBEAFE"}}>
                  <Avatar name={cg.full_name} size={26}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12.5,fontWeight:700,color:C.violet}}>{cg.full_name}</div>
                    <div style={{fontSize:11,color:C.slateL}}>{cg.specialty||"Caregiver"}</div>
                  </div>
                  <div style={{fontSize:10,color:"#059669",fontWeight:700,display:"flex",alignItems:"center",gap:2}}>
                    <div style={{width:5,height:5,borderRadius:"50%",background:"#22C55E"}}/>On duty
                  </div>
                </div>
              )}
              {a.notes&&<p style={{fontSize:12.5,color:C.slateM,marginBottom:12,lineHeight:1.5,background:"#FAFBFC",padding:"8px 10px",borderRadius:8}}>{a.notes}</p>}
              {a.status==="scheduled"&&(
                <div style={{display:"flex",gap:6}}>
                  <button className="btn btn-primary" style={{flex:1,justifyContent:"center",padding:"7px",fontSize:12}} onClick={()=>changeStatus(a.id,"completed")}>
                    <Icon name="check" size={13}/> Done
                  </button>
                  <button className="btn btn-ghost" style={{padding:"7px 12px",fontSize:12}} onClick={()=>changeStatus(a.id,"in_progress")}>
                    In Progress
                  </button>
                  <button className="btn btn-danger" style={{padding:"7px 12px",fontSize:12}} onClick={()=>changeStatus(a.id,"cancelled")}>
                    <Icon name="x" size={13}/>
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length===0&&(
          <div style={{gridColumn:"1/-1"}}><div className="card"><EmptyState icon="calendar" message="No appointments found."/></div></div>
        )}
      </div>
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Schedule Appointment"
        footer={<>
          <button className="btn btn-ghost" onClick={()=>setShowAdd(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={addAppt} disabled={loading}>
            {loading?<Spinner color="#fff"/>:<><Icon name="calendar" size={14}/> Schedule</>}
          </button>
        </>}>
        <div className="form-row">
          <FG label="Title"><input value={form.title} onChange={set("title")} placeholder="Visit / Therapy session"/></FG>
          <FG label="Patient">
            {isLimitedRole?(
              <div style={{padding:"10px 12px",borderRadius:8,border:"1px solid #DBEAFE",background:"#F8FAFC",fontWeight:600,fontSize:13}}>{linkedPatient?.full_name||"No linked patient"}</div>
            ):(
              <select value={form.patient_id} onChange={set("patient_id")}>
                <option value="">Select patient…</option>
                {patients.map(p=><option key={p.id} value={p.id}>{p.full_name}</option>)}
              </select>
            )}
          </FG>
        </div>
        {/* Caregiver cards in schedule modal too */}
        <label style={{marginBottom:10,display:"block"}}>Select Caregiver</label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          {caregivers.map(c=>(
            <div key={c.id} className={`caregiver-card ${form.caregiver_id===c.id?"selected":""}`}
              onClick={()=>setForm(f=>({...f,caregiver_id:c.id}))}>
              <Avatar name={c.full_name} size={34}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:12.5,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.full_name}</div>
                <div style={{fontSize:11,color:C.slateL}}>{c.specialty||"Caregiver"}</div>
              </div>
              {form.caregiver_id===c.id&&<Icon name="check" size={16} color={C.jade}/>}
            </div>
          ))}
        </div>
        <div className="form-row">
          <FG label="Date *"><input type="date" value={form.date} onChange={set("date")}/></FG>
          <FG label="Time *"><input type="time" value={form.time} onChange={set("time")}/></FG>
        </div>
        <div className="form-row">
          <FG label="Duration (mins)"><input type="number" value={form.duration_mins} onChange={set("duration_mins")}/></FG>
        </div>
        <FG label="Notes"><textarea rows={3} value={form.notes} onChange={set("notes")}/></FG>
      </Modal>
    </div>
  );
}

// ── HEALTH MODULE ─────────────────────────────────────────────
function HealthModule({healthUpdates,setHealthUpdates,patients}){
  const [showLog,setShowLog]=useState(false);
  const [loading,setLoading]=useState(false);
  const [filterPt,setFilterPt]=useState("all");
  const [form,setForm]=useState({patient_id:"",bp:"",hr:"",temp:"",spo2:"",respiratory_rate:"",blood_glucose:"",notes:"",severity:"normal"});
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  async function logVitals(){
    if(!form.patient_id){toast("Select a patient","error");return;}
    setLoading(true);
    const ok=await sbLogVitals({patient_id:form.patient_id,vitals:{bp:form.bp,hr:form.hr,temp:form.temp,spo2:form.spo2},blood_pressure:form.bp,heart_rate:form.hr,temperature:form.temp,spo2:form.spo2,respiratory_rate:form.respiratory_rate,blood_glucose:form.blood_glucose,notes:form.notes,severity:form.severity});
    if(ok){setHealthUpdates(await sbGetHealthUpdates());toast("Vitals logged");setShowLog(false);setForm({patient_id:"",bp:"",hr:"",temp:"",spo2:"",respiratory_rate:"",blood_glucose:"",notes:"",severity:"normal"});}
    else toast("Failed to log","error");
    setLoading(false);
  }
  const shown=healthUpdates.filter(u=>filterPt==="all"||u.patient_id===filterPt);
  return(
    <div className="fade-up">
      <div className="page-header">
        <div><h2 className="page-title">Health Monitoring</h2><p className="page-subtitle">Track patient vitals and health updates</p></div>
        <button className="btn btn-primary" onClick={()=>setShowLog(true)}><Icon name="plus" size={15}/> Log Vitals</button>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:24,flexWrap:"wrap",overflowX:"auto",paddingBottom:4}}>
        <button className={`btn ${filterPt==="all"?"btn-primary":"btn-ghost"}`} style={{padding:"7px 16px",fontSize:12.5,borderRadius:99,whiteSpace:"nowrap"}} onClick={()=>setFilterPt("all")}>All Patients</button>
        {patients.map(p=>(
          <button key={p.id} className={`btn ${filterPt===p.id?"btn-primary":"btn-ghost"}`} style={{padding:"7px 14px",fontSize:12.5,borderRadius:99,whiteSpace:"nowrap"}} onClick={()=>setFilterPt(p.id)}>
            {p.full_name.split(" ")[0]}
          </button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:18}}>
        {shown.map((u,i)=>{
          const pt=patients.find(p=>p.id===u.patient_id);
          const isCrit=u.severity==="critical";
          return(
            <div key={u.id} className="card fade-up" style={{animationDelay:`${i*0.05}s`,borderLeft:isCrit?`4px solid ${C.rose}`:`4px solid ${C.jade}`}}>
              <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:16}}>
                <Avatar name={pt?.full_name||"?"} size={40}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14}}>{pt?.full_name||"Unknown Patient"}</div>
                  <div style={{fontSize:11.5,color:C.slateL,marginTop:2}}>{new Date(u.created_at).toLocaleString("en-PH",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
                </div>
                {isCrit&&<span style={{background:"#FFE4E6",color:C.rose,fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:99}}>⚠ CRITICAL</span>}
              </div>
              {[["Blood Pressure","blood_pressure","droplet"],["Heart Rate","heart_rate","activity"],["Temperature","temperature","thermometer"],["SpO₂","spo2","wind"]].map(([label,key,icon])=>{
                const val=u[key];if(!val) return null;
                return(
                  <div key={key} className="vital-row">
                    <span className="vital-label"><Icon name={icon} size={14} color={C.slateL}/>{label}</span>
                    <span className="vital-val" style={{color:isCrit&&key==="blood_pressure"?C.rose:C.slate}}>{val}</span>
                  </div>
                );
              })}
              {u.notes&&<div style={{marginTop:12,padding:"8px 11px",background:isCrit?"#FFF1F2":"#F8FAFC",borderRadius:9,fontSize:12.5,color:C.slateM,lineHeight:1.5}}>{u.notes}</div>}
            </div>
          );
        })}
        {shown.length===0&&<div style={{gridColumn:"1/-1"}}><div className="card"><EmptyState icon="activity" message="No health records found."/></div></div>}
      </div>
      <Modal open={showLog} onClose={()=>setShowLog(false)} title="Log Patient Vitals"
        footer={<>
          <button className="btn btn-ghost" onClick={()=>setShowLog(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={logVitals} disabled={loading}>
            {loading?<Spinner color="#fff"/>:<><Icon name="check" size={14}/> Save Vitals</>}
          </button>
        </>}>
        <FG label="Patient *"><select value={form.patient_id} onChange={set("patient_id")}><option value="">Select patient…</option>{patients.map(p=><option key={p.id} value={p.id}>{p.full_name} — {p.status}</option>)}</select></FG>
        <div className="form-row">
          <FG label="Blood Pressure"><input value={form.bp} onChange={set("bp")} placeholder="120/80"/></FG>
          <FG label="Heart Rate"><input value={form.hr} onChange={set("hr")} placeholder="72 bpm"/></FG>
        </div>
        <div className="form-row">
          <FG label="Temperature"><input value={form.temp} onChange={set("temp")} placeholder="36.5°C"/></FG>
          <FG label="SpO₂"><input value={form.spo2} onChange={set("spo2")} placeholder="98%"/></FG>
        </div>
        <div className="form-row">
          <FG label="Respiratory Rate"><input value={form.respiratory_rate} onChange={set("respiratory_rate")} placeholder="18 breaths/min"/></FG>
          <FG label="Blood Glucose"><input value={form.blood_glucose} onChange={set("blood_glucose")} placeholder="5.4 mmol/L"/></FG>
        </div>
        <FG label="Severity"><select value={form.severity} onChange={set("severity")}><option value="normal">Normal</option><option value="warning">Warning</option><option value="critical">Critical</option></select></FG>
        <FG label="Notes"><textarea rows={3} value={form.notes} onChange={set("notes")} placeholder="Clinical observations…"/></FG>
      </Modal>
    </div>
  );
}

// ── MESSAGING MODULE (Group + DM) ─────────────────────────────
function MessagingModule({messages,setMessages,profile,caregivers}){
  const [activeThread,setActiveThread]=useState("general"); // "general" or caregiver id
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [showMobileList,setShowMobileList]=useState(true);
  const endRef=useRef(null);

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[messages,activeThread]);

  // Group general messages
  const generalMsgs=messages.filter(m=>m.channel==="general"||(!m.receiver_id&&!m.channel));
  
  // DM messages with a specific caregiver
  const dmMsgs=(cgId)=>messages.filter(m=>
    m.channel==="dm"&&(
      (m.sender_id===profile?.id&&m.receiver_id===cgId)||
      (m.sender_id===cgId&&(m.receiver_id===profile?.id||m.receiver_id===profile?.id))
    )
  );

  const currentMsgs=activeThread==="general"?generalMsgs:dmMsgs(activeThread);
  const unreadDMs=caregivers.reduce((acc,c)=>{
    const unread=messages.filter(m=>m.channel==="dm"&&m.sender_id===c.id&&!m.is_read).length;
    acc[c.id]=unread;return acc;
  },{});

  async function send(){
    if(!input.trim()) return;
    setLoading(true);
    const isGeneral=activeThread==="general";
    const msg={
      sender_id:profile?.id||"mock-uid",
      receiver_id:isGeneral?null:activeThread,
      content:input.trim(),
      channel:isGeneral?"general":"dm",
      is_read:false,
    };
    const ok=await sbSendMessage(msg);
    if(ok){setMessages(await sbGetAllMessages(profile?.id||"mock-uid"));setInput("");}
    else toast("Send failed","error");
    setLoading(false);
  }

  const threadName=activeThread==="general"?"Team Channel":caregivers.find(c=>c.id===activeThread)?.full_name||"Direct Message";
  const threadSubtitle=activeThread==="general"?"All caregivers & staff · General":"Direct message";
  const threadAvatar=activeThread==="general"?null:caregivers.find(c=>c.id===activeThread);

  const msgGroups=currentMsgs.reduce((acc,m)=>{
    const day=m.created_at?.split("T")[0]||"today";
    if(!acc[day])acc[day]=[];acc[day].push(m);return acc;
  },{});

  return(
    <div className="fade-up">
      <div className="page-header" style={{marginBottom:20}}>
        <div>
          <h2 className="page-title">Messages</h2>
          <p className="page-subtitle">Team chat & direct messages</p>
        </div>
      </div>

      <div className="dm-layout">
        {/* Thread list */}
        <div className={`dm-sidebar ${!showMobileList?"dm-hidden":""}`}>
          <div className="dm-sidebar-header">
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:15,marginBottom:4}}>Conversations</div>
            <div style={{fontSize:12,color:C.slateL}}>{1+caregivers.length} threads</div>
          </div>
          <div style={{flex:1,overflowY:"auto"}}>
            {/* General group */}
            <div className={`thread-item ${activeThread==="general"?"active":""}`} onClick={()=>{setActiveThread("general");setShowMobileList(false);}}>
              <div style={{width:42,height:42,borderRadius:12,background:"linear-gradient(135deg,var(--jade),var(--jadeD))",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon name="users" size={18} color="#fff"/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:13.5,marginBottom:2}}>Team Channel</div>
                <div style={{fontSize:12,color:C.slateL,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {generalMsgs.slice(-1)[0]?.content||"No messages yet"}
                </div>
              </div>
              {generalMsgs.length>0&&(
                <div style={{fontSize:10.5,color:C.slateXL,flexShrink:0}}>
                  {new Date(generalMsgs.slice(-1)[0]?.created_at||"").toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{padding:"10px 16px 6px"}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:C.slateXL}}>Direct Messages</div>
            </div>

            {/* Caregiver DMs */}
            {caregivers.map(c=>{
              const dms=dmMsgs(c.id);
              const lastMsg=dms.slice(-1)[0];
              const unread=unreadDMs[c.id]||0;
              return(
                <div key={c.id} className={`thread-item ${activeThread===c.id?"active":""}`} onClick={()=>{setActiveThread(c.id);setShowMobileList(false);}}>
                  <div style={{position:"relative"}}>
                    <Avatar name={c.full_name} size={42}/>
                    <div style={{position:"absolute",bottom:0,right:0,width:11,height:11,background:"#22C55E",border:"2px solid #fff",borderRadius:"50%"}}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:13.5,marginBottom:2}}>{c.full_name}</div>
                    <div style={{fontSize:12,color:C.slateL,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {lastMsg?.content||c.specialty||"Tap to message"}
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                    {lastMsg&&<div style={{fontSize:10.5,color:C.slateXL}}>{new Date(lastMsg.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>}
                    {unread>0&&<div className="thread-unread"/>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat area */}
        <div className={`dm-main ${showMobileList?"dm-hidden":""}`} style={{display:"flex",flexDirection:"column"}}>
          <div className="chat-header">
            {/* Mobile back button */}
            <button className="btn btn-ghost" style={{padding:"6px 8px",borderRadius:8,display:"none"}} onClick={()=>setShowMobileList(true)} id="dm-back-btn">
              <Icon name="chevronleft" size={18}/>
            </button>
            {activeThread==="general"?(
              <div style={{width:40,height:40,borderRadius:11,background:"linear-gradient(135deg,var(--jade),var(--jadeD))",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon name="users" size={18} color="#fff"/>
              </div>
            ):(
              <div style={{position:"relative"}}>
                <Avatar name={threadAvatar?.full_name||"?"} size={40}/>
                <div style={{position:"absolute",bottom:0,right:0,width:11,height:11,background:"#22C55E",border:"2px solid #fff",borderRadius:"50%"}}/>
              </div>
            )}
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:14}}>{threadName}</div>
              <div style={{fontSize:12,color:C.slateL,display:"flex",alignItems:"center",gap:5}}>
                {activeThread==="general"&&<div className="online-dot"/>}
                {threadSubtitle}
              </div>
            </div>
            {activeThread!=="general"&&(
              <div style={{display:"flex",gap:6}}>
                <button className="btn btn-ghost btn-icon" title="Call" style={{borderRadius:10}}>
                  <Icon name="phone" size={15}/>
                </button>
              </div>
            )}
          </div>

          <div className="chat-messages" style={{flex:1,height:activeThread!=="general"?380:380,minHeight:0}}>
            {Object.entries(msgGroups).map(([day,msgs])=>(
              <div key={day}>
                <div style={{textAlign:"center",margin:"10px 0"}}>
                  <span style={{fontSize:11,color:C.slateXL,background:"#F1F5F9",padding:"3px 10px",borderRadius:99}}>
                    {day===new Date().toISOString().split("T")[0]?"Today":day}
                  </span>
                </div>
                {msgs.map(m=>{
                  const isOut=m.isOut||m.sender_id===profile?.id;
                  return(
                    <div key={m.id} style={{display:"flex",flexDirection:"column",alignItems:isOut?"flex-end":"flex-start",marginBottom:4}}>
                      {!isOut&&m.sender_name&&<span style={{fontSize:10.5,color:C.slateL,marginLeft:4,marginBottom:2}}>{m.sender_name}</span>}
                      <div className={`msg-bubble ${isOut?"msg-out":"msg-in"}`}>
                        {m.content}
                        <div className="msg-time">{new Date(m.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            {currentMsgs.length===0&&(
              <div style={{textAlign:"center",color:C.slateL,fontSize:13.5,marginTop:48,display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
                <div style={{width:52,height:52,borderRadius:16,background:C.jadeXL,border:`1px solid ${C.jadeL}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Icon name="message" size={22} color={C.jade}/>
                </div>
                {activeThread==="general"?"No messages yet — say hello to the team!":
                  `Start a conversation with ${caregivers.find(c=>c.id===activeThread)?.full_name||"this caregiver"}`}
              </div>
            )}
            <div ref={endRef}/>
          </div>

          <div className="chat-input-row">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
              placeholder={activeThread==="general"?"Message the team… (Enter to send)":`Message ${threadName}…`}
              style={{borderRadius:12}}/>
            <button className="btn btn-primary" onClick={send} disabled={loading||!input.trim()} style={{flexShrink:0,borderRadius:12}}>
              {loading?<Spinner color="#fff" size={16}/>:<Icon name="send" size={16}/>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile CSS injection for back button */}
      <style>{`
        @media(max-width:768px){
          #dm-back-btn{display:flex!important}
          .dm-main.dm-hidden{display:none!important}
          .dm-sidebar.dm-hidden{display:none!important}
          .dm-layout{display:block!important}
          .dm-main{height:calc(100vh - 200px)}
          .chat-messages{height:auto!important;flex:1!important}
        }
      `}</style>
    </div>
  );
}

// ── BILLING MODULE ────────────────────────────────────────────
function BillingModule({billings,setBillings,patients}){
  const [showAdd,setShowAdd]=useState(false);
  const [showPayModal,setShowPayModal]=useState(null);
  const [loading,setLoading]=useState(false);
  const [filterStatus,setFilterStatus]=useState("all");
  const [payMethod,setPayMethod]=useState("cash");
  const [form,setForm]=useState({patient_id:"",amount:"",description:"",status:"pending",due_date:"",payment_method:""});
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  const totalPaid=billings.filter(b=>b.status==="paid").reduce((s,b)=>s+Number(b.amount),0);
  const totalPending=billings.filter(b=>b.status==="pending").reduce((s,b)=>s+Number(b.amount),0);
  const totalOverdue=billings.filter(b=>b.status==="overdue").reduce((s,b)=>s+Number(b.amount),0);
  const filtered=billings.filter(b=>filterStatus==="all"||b.status===filterStatus);
  async function addBilling(){
    if(!form.patient_id||!form.amount||!form.description){toast("Fill required fields","error");return;}
    setLoading(true);
    const ok=await sbAddBilling({...form,amount:Number(form.amount)});
    if(ok){setBillings(await sbGetBillings());toast("Billing record added");setShowAdd(false);setForm({patient_id:"",amount:"",description:"",status:"pending",due_date:"",payment_method:""});}
    setLoading(false);
  }
  async function markPaid(id){
    const ok=await sbUpdateBillingStatus(id,"paid",payMethod);
    if(ok){setBillings(await sbGetBillings());toast("Marked as paid");setShowPayModal(null);}
  }
  return(
    <div className="fade-up">
      <div className="page-header">
        <div><h2 className="page-title">Billing & Payments</h2><p className="page-subtitle">Track service charges</p></div>
        <button className="btn btn-primary" onClick={()=>setShowAdd(true)}><Icon name="plus" size={15}/> Add Bill</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:28}}>
        {[{label:"Collected",val:`₱${totalPaid.toLocaleString()}`,color:C.jade,bg:"#D1FAE5",icon:"check"},
          {label:"Outstanding",val:`₱${totalPending.toLocaleString()}`,color:C.amber,bg:"#FEF3C7",icon:"alert"},
          {label:"Overdue",val:`₱${totalOverdue.toLocaleString()}`,color:C.rose,bg:"#FFE4E6",icon:"creditcard"},
        ].map(s=>(
          <div key={s.label} className="card" style={{display:"flex",alignItems:"center",gap:14,borderLeft:`3px solid ${s.color}`,padding:"16px 20px"}}>
            <div style={{width:44,height:44,borderRadius:12,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name={s.icon} size={20} color={s.color}/></div>
            <div>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:s.color}}>{s.val}</div>
              <div style={{fontSize:12,color:C.slateL}}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {["all","pending","paid","overdue","cancelled"].map(f=>(
          <button key={f} className={`btn ${filterStatus===f?"btn-primary":"btn-ghost"}`}
            style={{padding:"7px 16px",fontSize:12.5,borderRadius:99,textTransform:"capitalize"}}
            onClick={()=>setFilterStatus(f)}>
            {f} {f!=="all"&&`(${billings.filter(b=>b.status===f).length})`}
          </button>
        ))}
      </div>
      <div className="card">
        <div style={{overflowX:"auto"}}>
          <table className="data-table">
            <thead><tr><th>Patient</th><th>Description</th><th>Amount</th><th>Due</th><th>Status</th><th>Payment</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(b=>{
                const pt=patients.find(p=>p.id===b.patient_id);
                return(
                  <tr key={b.id}>
                    <td><div style={{display:"flex",alignItems:"center",gap:9}}><Avatar name={pt?.full_name||"?"} size={30}/><span style={{fontWeight:600,fontSize:13}}>{pt?.full_name||"Unknown"}</span></div></td>
                    <td style={{color:C.slateM,fontSize:13,maxWidth:180}}>{b.description}</td>
                    <td><span style={{fontFamily:"'DM Serif Display',serif",fontSize:16,color:C.slate}}>₱{Number(b.amount).toLocaleString()}</span></td>
                    <td style={{color:C.slateL,fontSize:12}}>{b.due_date||b.created_at?.split("T")[0]}</td>
                    <td><Badge status={b.status}/></td>
                    <td>{b.payment_method?<span className="tag" style={{textTransform:"capitalize"}}>{b.payment_method.replace("_"," ")}</span>:<span style={{color:C.slateXL,fontSize:12}}>—</span>}</td>
                    <td>
                      {b.status==="pending"||b.status==="overdue"
                        ?<button className="btn btn-primary" style={{padding:"6px 13px",fontSize:12,gap:5}} onClick={()=>{setShowPayModal(b);setPayMethod("cash");}}>
                          <Icon name="check" size={12}/> Mark Paid
                        </button>
                        :<div style={{display:"flex",alignItems:"center",gap:4,color:C.jade,fontSize:12.5}}><Icon name="check" size={13} color={C.jade}/> Settled</div>}
                    </td>
                  </tr>
                );
              })}
              {filtered.length===0&&<tr><td colSpan={7}><EmptyState icon="creditcard" message="No billing records found."/></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Add Billing Record"
        footer={<><button className="btn btn-ghost" onClick={()=>setShowAdd(false)}>Cancel</button><button className="btn btn-primary" onClick={addBilling} disabled={loading}>{loading?<Spinner color="#fff"/>:<><Icon name="check" size={14}/>Save</>}</button></>}>
        <FG label="Patient *"><select value={form.patient_id} onChange={set("patient_id")}><option value="">Select patient…</option>{patients.map(p=><option key={p.id} value={p.id}>{p.full_name}</option>)}</select></FG>
        <FG label="Description *"><input value={form.description} onChange={set("description")} placeholder="Service description"/></FG>
        <div className="form-row">
          <FG label="Amount (₱) *"><input type="number" value={form.amount} onChange={set("amount")} placeholder="0.00"/></FG>
          <FG label="Due Date"><input type="date" value={form.due_date} onChange={set("due_date")}/></FG>
        </div>
        <div className="form-row">
          <FG label="Status"><select value={form.status} onChange={set("status")}><option value="pending">Pending</option><option value="paid">Paid</option><option value="overdue">Overdue</option></select></FG>
          <FG label="Payment Method"><select value={form.payment_method} onChange={set("payment_method")}><option value="">Select…</option>{["cash","gcash","maya","bank_transfer","insurance","other"].map(m=><option key={m} value={m}>{m.replace("_"," ").toUpperCase()}</option>)}</select></FG>
        </div>
      </Modal>
      <Modal open={!!showPayModal} onClose={()=>setShowPayModal(null)} title="Record Payment"
        footer={<><button className="btn btn-ghost" onClick={()=>setShowPayModal(null)}>Cancel</button><button className="btn btn-primary" onClick={()=>markPaid(showPayModal?.id)}><Icon name="check" size={14}/> Confirm</button></>}>
        {showPayModal&&(
          <div>
            <div style={{background:"#F8FAFC",borderRadius:12,padding:16,marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{color:C.slateL,fontSize:13}}>Patient</span><span style={{fontWeight:600}}>{patients.find(p=>p.id===showPayModal.patient_id)?.full_name||"—"}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{color:C.slateL,fontSize:13}}>Description</span><span style={{fontWeight:500,fontSize:13}}>{showPayModal.description}</span></div>
              <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.slateL,fontSize:13}}>Amount</span><span style={{fontFamily:"'DM Serif Display',serif",fontSize:20,color:C.jade}}>₱{Number(showPayModal.amount).toLocaleString()}</span></div>
            </div>
            <FG label="Payment Method *"><select value={payMethod} onChange={e=>setPayMethod(e.target.value)}>{["cash","gcash","maya","bank_transfer","insurance","other"].map(m=><option key={m} value={m}>{m.replace("_"," ").toUpperCase()}</option>)}</select></FG>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ── REPORTS MODULE ────────────────────────────────────────────
function ReportsModule({patients,appointments,billings,healthUpdates}){
  const totalBilled=billings.reduce((s,b)=>s+Number(b.amount),0);
  const totalPaid=billings.filter(b=>b.status==="paid").reduce((s,b)=>s+Number(b.amount),0);
  const summaryStats=[
    {label:"Total Patients",val:patients.length,color:C.jade},
    {label:"Active",val:patients.filter(p=>p.status==="active").length,color:C.jade},
    {label:"Critical",val:patients.filter(p=>p.status==="critical").length,color:C.rose},
    {label:"Stable",val:patients.filter(p=>p.status==="stable").length,color:C.sky},
    {label:"Total Appts",val:appointments.length,color:C.violet},
    {label:"Completed",val:appointments.filter(a=>a.status==="completed").length,color:C.jade},
    {label:"Health Records",val:healthUpdates.length,color:C.amber},
    {label:"Critical Vitals",val:healthUpdates.filter(h=>h.severity==="critical").length,color:C.rose},
    {label:"Total Billed",val:`₱${totalBilled.toLocaleString()}`,color:C.amber},
    {label:"Collected",val:`₱${totalPaid.toLocaleString()}`,color:C.jade},
    {label:"Outstanding",val:`₱${(totalBilled-totalPaid).toLocaleString()}`,color:C.rose},
    {label:"Collection Rate",val:totalBilled>0?`${Math.round(totalPaid/totalBilled*100)}%`:"0%",color:C.jade},
  ];
  const diagnosisCounts=patients.reduce((acc,p)=>{acc[p.diagnosis]=(acc[p.diagnosis]||0)+1;return acc;},{});
  const maxDiag=Math.max(...Object.values(diagnosisCounts),1);
  return(
    <div className="fade-up">
      <div className="page-header">
        <div><h2 className="page-title">Reports & Analytics</h2><p className="page-subtitle">System-wide insights</p></div>
        <button className="btn btn-ghost" onClick={()=>window.print()} style={{gap:7}}><Icon name="printer" size={14}/> Print</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
        {summaryStats.map((s,i)=>(
          <div key={i} className="report-stat fade-up" style={{animationDelay:`${i*0.04}s`,borderTop:`2.5px solid ${s.color}`}}>
            <div className="report-stat-val" style={{color:s.color}}>{s.val}</div>
            <div className="report-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="content-grid">
        <div className="card">
          <h3 className="section-title" style={{marginBottom:20}}>Diagnosis Breakdown</h3>
          {Object.keys(diagnosisCounts).length===0?<EmptyState icon="barchart" message="No patient data."/>:
            Object.entries(diagnosisCounts).sort((a,b)=>b[1]-a[1]).map(([diag,count])=>(
              <div key={diag} style={{marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6,alignItems:"center"}}>
                  <span style={{fontWeight:500}}>{diag}</span>
                  <span style={{color:C.slateL,fontSize:12}}>{count} patient{count!==1?"s":""}</span>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{background:`linear-gradient(90deg,${C.jade},${C.jadeD})`,width:`${(count/maxDiag)*100}%`}}/></div>
              </div>
            ))
          }
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:18}}>
          <div className="card">
            <h3 className="section-title" style={{marginBottom:16}}>Patient Status</h3>
            {[["active",C.jade,"Active"],["stable",C.sky,"Stable"],["critical",C.rose,"Critical"],["discharged",C.slateL,"Discharged"]].map(([s,col,lbl])=>{
              const cnt=patients.filter(p=>p.status===s).length;
              const pct=patients.length>0?Math.round(cnt/patients.length*100):0;
              return(
                <div key={s} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid #F8FAFC"}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:col,flexShrink:0}}/>
                  <span style={{flex:1,fontWeight:500,fontSize:13.5}}>{lbl}</span>
                  <span style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:col}}>{cnt}</span>
                  <span style={{fontSize:11,color:C.slateXL,width:32,textAlign:"right"}}>{pct}%</span>
                </div>
              );
            })}
          </div>
          <div className="card" style={{background:"linear-gradient(135deg,var(--onyx),var(--pine))",border:"none",color:"#fff"}}>
            <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:16,marginBottom:16,color:"#fff"}}>Billing Performance</h3>
            <div style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,marginBottom:6,color:"rgba(148,163,184,.7)"}}><span>Collection Rate</span><span style={{color:C.jade,fontWeight:700}}>{totalBilled>0?`${Math.round(totalPaid/totalBilled*100)}%`:"0%"}</span></div>
              <div className="progress-track" style={{background:"rgba(255,255,255,.1)"}}><div className="progress-fill" style={{background:`linear-gradient(90deg,${C.jade},#34D399)`,width:totalBilled>0?`${(totalPaid/totalBilled)*100}%`:"0%"}}/></div>
            </div>
            {[{label:"Total Billed",val:totalBilled,color:"#fff"},{label:"Collected",val:totalPaid,color:C.jade},{label:"Remaining",val:totalBilled-totalPaid,color:C.amber}].map(r=>(
              <div key={r.label} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
                <span style={{fontSize:13,color:"rgba(148,163,184,.6)"}}>{r.label}</span>
                <span style={{fontFamily:"'DM Serif Display',serif",fontSize:18,color:r.color}}>₱{Number(r.val).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SETTINGS MODULE ───────────────────────────────────────────
function SettingsModule({profile,setProfile,onLogout}){
  const [form,setFormState]=useState({full_name:profile?.full_name||"",email:profile?.email||"",phone:profile?.phone||"",address:profile?.address||""});
  const [loading,setLoading]=useState(false);
  const set=k=>e=>setFormState(f=>({...f,[k]:e.target.value}));
  async function save(){
    setLoading(true);
    const ok=await sbUpdateProfile(profile?.id,{full_name:form.full_name,phone:form.phone,address:form.address});
    if(ok){setProfile(prev=>({...prev,full_name:form.full_name,phone:form.phone,address:form.address}));toast("Profile updated");}
    else toast("Failed to update","error");
    setLoading(false);
  }
  return(
    <div className="fade-up">
      <div className="page-header"><div><h2 className="page-title">Settings</h2><p className="page-subtitle">Manage your profile and account</p></div></div>
      <div style={{maxWidth:620}}>
        <div className="profile-hero">
          <div style={{display:"flex",alignItems:"center",gap:18,position:"relative",zIndex:1}}>
            <Avatar name={form.full_name} size={68} src={profile?.avatar_url}/>
            <div>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:"#fff",marginBottom:4}}>{form.full_name}</div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}><Badge status={profile?.role||"caregiver"}/><span style={{fontSize:12,color:"rgba(148,163,184,.7)"}}>{form.email}</span></div>
            </div>
          </div>
        </div>
        <div className="card" style={{marginBottom:18}}>
          <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:17,marginBottom:22}}>Profile Information</h3>
          <div className="form-row"><FG label="Full Name"><input value={form.full_name} onChange={set("full_name")}/></FG><FG label="Email (read-only)"><input value={form.email} disabled style={{opacity:.6,cursor:"not-allowed"}}/></FG></div>
          <div className="form-row">
            <FG label="Phone"><div className="input-icon-wrap"><span className="input-icon"><Icon name="phone" size={14}/></span><input value={form.phone} onChange={set("phone")} placeholder="+63 9XX XXX XXXX" style={{paddingLeft:38}}/></div></FG>
            <FG label="Address"><div className="input-icon-wrap"><span className="input-icon"><Icon name="mappin" size={14}/></span><input value={form.address} onChange={set("address")} placeholder="City, Province" style={{paddingLeft:38}}/></div></FG>
          </div>
          <button className="btn btn-primary" onClick={save} disabled={loading}>{loading?<Spinner color="#fff"/>:<><Icon name="check" size={14}/> Save Changes</>}</button>
        </div>
        <div className="card" style={{marginBottom:18}}>
          <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:17,marginBottom:16}}>Account Details</h3>
          {[{label:"Role",val:profile?.role||"caregiver",render:v=><Badge status={v}/>},{label:"Account ID",val:profile?.id||"—",render:v=><code style={{fontSize:11.5,background:"#F1F5F9",padding:"2px 8px",borderRadius:6}}>{v?.slice(0,18)}…</code>},{label:"Platform",val:"Supabase + RLS Secured"}].map(r=>(
            <div key={r.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:"1px solid #F8FAFC"}}>
              <span style={{fontSize:13.5,color:C.slateL}}>{r.label}</span>
              {r.render?r.render(r.val):<span style={{fontWeight:500,fontSize:13.5}}>{r.val}</span>}
            </div>
          ))}
        </div>
        <div className="card" style={{borderLeft:`3px solid ${C.rose}`}}>
          <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:16,marginBottom:6,color:C.rose}}>Sign Out</h3>
          <p style={{fontSize:13,color:C.slateL,marginBottom:16}}>This will end your current session securely.</p>
          <button className="btn btn-danger" onClick={onLogout}><Icon name="logout" size={14}/> Sign Out</button>
        </div>
      </div>
    </div>
  );
}

// ── TOAST MANAGER ─────────────────────────────────────────────
function ToastManager(){
  const [toasts,setToasts]=useState([]);
  _toastFn=useCallback((msg,type="success")=>{
    const id=Date.now();
    setToasts(t=>[...t,{id,msg,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3500);
  },[]);
  return(
    <div className="toast-wrap">
      {toasts.map(t=>(
        <div key={t.id} className={`toast toast-${t.type}`}>
          <Icon name={t.type==="error"?"alert":t.type==="info"?"info":"check"} size={15}/>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ── NAV CONFIG ────────────────────────────────────────────────
const NAV=[
  {id:"dashboard",icon:"home",label:"Dashboard",section:"main"},
  {id:"patients",icon:"users",label:"Patients",section:"main"},
  {id:"appointments",icon:"calendar",label:"Appointments",section:"main"},
  {id:"health",icon:"heart",label:"Health",section:"main"},
  {id:"messages",icon:"message",label:"Messages",section:"main"},
  {id:"billing",icon:"creditcard",label:"Billing",section:"finance"},
  {id:"reports",icon:"barchart",label:"Reports",section:"finance"},
  {id:"settings",icon:"settings",label:"Settings",section:"account"},
];

// Mobile bottom nav items (max 5)
const MOB_NAV=[
  {id:"dashboard",icon:"home",label:"Home"},
  {id:"patients",icon:"users",label:"Patients"},
  {id:"appointments",icon:"calendar",label:"Schedule"},
  {id:"messages",icon:"message",label:"Messages"},
  {id:"settings",icon:"settings",label:"More"},
];

// ── ROOT APP ──────────────────────────────────────────────────
export default function App(){
  const [profile,setProfile]=useState(null);
  const [active,setActive]=useState(()=>localStorage.getItem("careNestActive")||"dashboard");
  const [patients,setPatients]=useState([]);
  const [appointments,setAppointments]=useState([]);
  const [caregivers,setCaregivers]=useState([]);
  const [messages,setMessages]=useState([]);
  const [healthUpdates,setHealthUpdates]=useState([]);
  const [billings,setBillings]=useState([]);
  const [notifications,setNotifications]=useState([]);
  const [dataLoaded,setDataLoaded]=useState(false);

  useEffect(()=>{
    if(!document.getElementById("cn-css")){
      const s=document.createElement("style");
      s.id="cn-css";s.textContent=CSS;document.head.appendChild(s);
    }
    // Mobile-specific show/hide helpers
    const mobileExtra=document.createElement("style");
    mobileExtra.id="cn-mobile-extra";
    mobileExtra.textContent=`
      @media(max-width:768px){
        .mobile-patient-grid{display:block!important}
        .desktop-only{display:none!important}
        .mobile-hero{display:block!important}
        .page-header>*:not(:first-child){display:none}
      }
    `;
    document.head.appendChild(mobileExtra);
  },[]);

  useEffect(()=>{
    if(!supabase) return;
    let mounted=true;
    (async()=>{
      try{
        const {data}=await supabase.auth.getSession();
        const session=data?.session;
        if(session?.user&&mounted){
          const prof=await sbGetProfile(session.user.id);
          setProfile({...prof,email:session.user.email});
        }
      }catch(e){console.error("auth restore",e);}
    })();
    const {data:subData}=supabase.auth.onAuthStateChange(async(event,sess)=>{
      try{
        if(event==="SIGNED_IN"&&sess?.user){const prof=await sbGetProfile(sess.user.id);setProfile({...prof,email:sess.user.email});}
        else if(event==="SIGNED_OUT") setProfile(null);
      }catch(e){console.error("auth change",e);}
    });
    return()=>{mounted=false;try{subData?.subscription?.unsubscribe();}catch(_){}};
  },[]);

  useEffect(()=>{
    if(!profile||dataLoaded) return;
    (async()=>{
      const[p,a,m,h,b,n]=await Promise.all([
        sbGetPatients(),sbGetAppointments(),sbGetAllMessages(profile.id),
        sbGetHealthUpdates(),sbGetBillings(),sbGetNotifications(profile.id),
      ]);
      setPatients(p);setAppointments(a);setMessages(m);
      setHealthUpdates(h);setBillings(b);setNotifications(n);
      const profs=await sbGetProfiles();
      setCaregivers((profs||[]).filter(x=>x.role==="caregiver"));
      setDataLoaded(true);
    })();
  },[profile]);

  useEffect(()=>{
    if(!supabase||!profile||_demoMode) return;
    const ch=supabase.channel("cn-live")
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"messages"},()=>sbGetAllMessages(profile.id).then(setMessages))
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"health_updates"},()=>sbGetHealthUpdates().then(setHealthUpdates))
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"notifications"},()=>sbGetNotifications(profile.id).then(setNotifications))
      .on("postgres_changes",{event:"*",schema:"public",table:"patients"},()=>sbGetPatients().then(setPatients))
      .on("postgres_changes",{event:"*",schema:"public",table:"appointments"},()=>sbGetAppointments().then(setAppointments))
      .on("postgres_changes",{event:"*",schema:"public",table:"billings"},()=>sbGetBillings().then(setBillings))
      .subscribe();
    return()=>supabase.removeChannel(ch);
  },[profile]);

  function handleLogout(){
    supabase?.auth.signOut();
    _demoMode=false;
    setProfile(null);setDataLoaded(false);
    setPatients([]);setAppointments([]);setMessages([]);
    setHealthUpdates([]);setBillings([]);setNotifications([]);
    toast("Signed out successfully");
  }

  function nav(id){setActive(id);localStorage.setItem("careNestActive",id);}

  if(!profile) return(<><AuthScreen onLogin={setProfile}/><ToastManager/></>);

  const shared={patients,setPatients,appointments,setAppointments,messages,setMessages,healthUpdates,setHealthUpdates,billings,setBillings,notifications,setNotifications,profile,caregivers,setCaregivers};
  const screens={
    dashboard:<Dashboard {...shared} onNav={nav}/>,
    patients:<PatientsModule {...shared}/>,
    appointments:<AppointmentsModule {...shared}/>,
    health:<HealthModule {...shared}/>,
    messages:<MessagingModule {...shared}/>,
    billing:<BillingModule {...shared}/>,
    reports:<ReportsModule {...shared}/>,
    settings:<SettingsModule profile={profile} setProfile={setProfile} onLogout={handleLogout}/>,
  };

  const sections=["main","finance","account"];
  const sectionLabels={main:"",finance:"Finance",account:"Account"};
  const unread=notifications.filter(n=>!n.is_read).length;
  const unreadMsg=messages.filter(m=>m.channel==="dm"&&m.sender_id!==profile?.id&&!m.is_read).length;

  return(
    <>
      {/* Desktop Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">
            <div className="sidebar-logo-icon"><Icon name="heart" size={18} color="#fff"/></div>
            <h1>CareNest</h1>
          </div>
          <p>Caregiving Platform</p>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
          {sections.map(sec=>{
            const items=NAV.filter(n=>n.section===sec);
            return(
              <div key={sec}>
                {sectionLabels[sec]&&<div className="nav-section-label">{sectionLabels[sec]}</div>}
                {items.filter(n=>!(profile?.role==="patient"&&n.id==="patients")).map(n=>(
                  <div key={n.id} className={`nav-item ${active===n.id?"active":""}`} onClick={()=>nav(n.id)}>
                    <Icon name={n.icon} size={16} color={active===n.id?"#fff":"rgba(148,163,184,.7)"}/>
                    <span style={{flex:1}}>{n.label}</span>
                    {n.id==="messages"&&(unread+unreadMsg)>0&&(
                      <span style={{background:C.rose,color:"#fff",borderRadius:99,fontSize:10,fontWeight:700,padding:"1px 6px",minWidth:18,textAlign:"center"}}>{unread+unreadMsg}</span>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <div style={{padding:"14px 16px",borderTop:"1px solid rgba(255,255,255,.06)",display:"flex",alignItems:"center",gap:10}}>
          <Avatar name={profile?.full_name||"User"} size={34}/>
          <div style={{overflow:"hidden",flex:1}}>
            <div style={{color:"#fff",fontWeight:600,fontSize:12.5,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{profile?.full_name||"User"}</div>
            <div style={{color:"rgba(100,116,139,.8)",fontSize:10.5,textTransform:"capitalize"}}>{profile?.role||"member"}</div>
          </div>
          <button onClick={handleLogout} title="Sign out" style={{background:"none",border:"none",cursor:"pointer",color:"rgba(100,116,139,.7)",display:"flex",padding:"6px",borderRadius:8,transition:"all .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.08)";e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color="rgba(100,116,139,.7)";}}>
            <Icon name="logout" size={15}/>
          </button>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="mobile-header-logo">
          <div style={{width:32,height:32,borderRadius:9,background:"linear-gradient(135deg,var(--jade),var(--jadeD))",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon name="heart" size={15} color="#fff"/>
          </div>
          <span style={{fontFamily:"'DM Serif Display',serif",fontSize:18,fontWeight:700,color:C.slate,letterSpacing:"-.3px"}}>CareNest</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {(unread+unreadMsg)>0&&(
            <div style={{width:32,height:32,borderRadius:9,background:"#FEF3C7",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",cursor:"pointer"}} onClick={()=>nav("messages")}>
              <Icon name="bellring" size={15} color={C.amber}/>
              <span style={{position:"absolute",top:-3,right:-3,background:C.rose,color:"#fff",borderRadius:99,fontSize:9,fontWeight:700,padding:"1px 4px",border:"2px solid white"}}>{unread+unreadMsg}</span>
            </div>
          )}
          <Avatar name={profile?.full_name||"User"} size={32}/>
        </div>
      </header>

      {/* Main */}
      <main className="main-area">
        {!dataLoaded?(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",flexDirection:"column",gap:16}}>
            <div style={{width:52,height:52,borderRadius:16,background:"linear-gradient(135deg,#CCFBF1,#A7F3D0)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Icon name="heart" size={24} color={C.jade}/>
            </div>
            <Spinner size={24}/>
            <p style={{color:C.slateL,fontSize:14,marginTop:4}}>Loading CareNest…</p>
          </div>
        ):(
          <div className="page-wrap">{screens[active]}</div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        <div className="mobile-nav-inner">
          {MOB_NAV.map(n=>(
            <button key={n.id} className={`mob-nav-item ${active===n.id?"active":""}`} onClick={()=>nav(n.id)}>
              <Icon name={n.icon} size={20} color={active===n.id?C.jade:"rgba(148,163,184,.7)"}/>
              <span>{n.label}</span>
              {n.id==="messages"&&(unread+unreadMsg)>0&&(
                <span className="mob-nav-badge">{unread+unreadMsg}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

      <ToastManager/>
    </>
  );
}