// ============================================================
//  CareNest – Optimized: Fast Load + Smart Realtime
//  Fixes: parallel fetching, incremental realtime, no re-fetch storms
//  CC 106 · St. Peter's College · Generalao & Sapra
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ── Supabase config ──────────────────────────────────────────
const SUPABASE_URL      = "https://xydocnvlnktvhzeopdib.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_PwF7vicN6W71jJ4djPXu1w_avxaInKJ";

const globalScope = typeof globalThis !== "undefined" ? globalThis : window;
if (!globalScope.__supabase) {
  globalScope.__supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true },
    realtime: { timeout: 30000 },
    global: { headers: { "x-client-info": "carenest/1.0" } },
  });
}
const supabase = globalScope.__supabase;

// ── Design Tokens ────────────────────────────────────────────
const C = {
  jade:"#0D9488", jadeD:"#0F766E", jadeL:"#CCFBF1", jadeXL:"#F0FDF9",
  pine:"#134E4A", onyx:"#0C1117", onyxM:"#1A2535", slate:"#0F172A",
  slateM:"#334155", slateL:"#64748B", slateXL:"#94A3B8",
  cream:"#FAFAF8", white:"#FFFFFF",
  rose:"#F43F5E", amber:"#F59E0B", violet:"#7C3AED", sky:"#0EA5E9",
};

// ── SVG Icons ────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor", strokeWidth = 1.75 }) => {
  const s = { width: size, height: size, display: "block", flexShrink: 0 };
  const p = { stroke: color, strokeWidth, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    home:         <><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" {...p}/><path d="M9 21V12h6v9" {...p}/></>,
    user:         <><circle cx="12" cy="7" r="4" {...p}/><path d="M4 21v-1a8 8 0 0 1 16 0v1" {...p}/></>,
    calendar:     <><rect x="3" y="4" width="18" height="18" rx="2" {...p}/><path d="M16 2v4M8 2v4M3 10h18" {...p}/></>,
    heart:        <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" {...p}/></>,
    message:      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...p}/></>,
    creditcard:   <><rect x="1" y="4" width="22" height="16" rx="2" {...p}/><path d="M1 10h22" {...p}/></>,
    barchart:     <><rect x="18" y="3" width="4" height="18" rx="1" {...p}/><rect x="10" y="8" width="4" height="13" rx="1" {...p}/><rect x="2" y="13" width="4" height="8" rx="1" {...p}/></>,
    settings:     <><circle cx="12" cy="12" r="3" {...p}/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" {...p}/></>,
    plus:         <><path d="M12 5v14M5 12h14" {...p}/></>,
    search:       <><circle cx="11" cy="11" r="8" {...p}/><path d="m21 21-4.35-4.35" {...p}/></>,
    x:            <><path d="M18 6L6 18M6 6l12 12" {...p}/></>,
    send:         <><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" {...p}/></>,
    logout:       <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" {...p}/></>,
    printer:      <><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" {...p}/><rect x="6" y="14" width="12" height="8" {...p}/></>,
    trash:        <><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" {...p}/></>,
    eye:          <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...p}/><circle cx="12" cy="12" r="3" {...p}/></>,
    check:        <><path d="M20 6L9 17l-5-5" {...p}/></>,
    alert:        <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" {...p}/><path d="M12 9v4M12 17h.01" {...p}/></>,
    activity:     <><path d="M22 12h-4l-3 9L9 3l-3 9H2" {...p}/></>,
    users:        <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...p}/><circle cx="9" cy="7" r="4" {...p}/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" {...p}/></>,
    mail:         <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" {...p}/><path d="M22 6l-10 7L2 6" {...p}/></>,
    lock:         <><rect x="3" y="11" width="18" height="11" rx="2" {...p}/><path d="M7 11V7a5 5 0 0 1 10 0v4" {...p}/></>,
    shield:       <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...p}/></>,
    phone:        <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" {...p}/></>,
    mappin:       <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" {...p}/><circle cx="12" cy="10" r="3" {...p}/></>,
    chevronright: <><path d="M9 18l6-6-6-6" {...p}/></>,
    chevronleft:  <><path d="M15 18l-6-6 6-6" {...p}/></>,
    info:         <><circle cx="12" cy="12" r="10" {...p}/><path d="M12 16v-4M12 8h.01" {...p}/></>,
    clipboard:    <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" {...p}/><rect x="8" y="2" width="8" height="4" rx="1" {...p}/></>,
    thermometer:  <><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" {...p}/></>,
    droplet:      <><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" {...p}/></>,
    wind:         <><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" {...p}/></>,
    arrowup:      <><path d="M12 19V5M5 12l7-7 7 7" {...p}/></>,
    edit:         <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" {...p}/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" {...p}/></>,
    refresh:      <><path d="M23 4v6h-6M1 20v-6h6" {...p}/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" {...p}/></>,
    menu:         <><path d="M3 12h18M3 6h18M3 18h18" {...p}/></>,
    bell:         <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" {...p}/></>,
  };
  return (
    <svg viewBox="0 0 24 24" style={s} aria-hidden="true">
      {paths[name] || <circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} fill="none"/>}
    </svg>
  );
};

// ── Global CSS ───────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --jade:#0D9488;--jadeD:#0F766E;--jadeL:#CCFBF1;--jadeXL:#F0FDF9;
    --pine:#134E4A;--onyx:#0C1117;--onyxM:#1A2535;--slate:#0F172A;
    --slateM:#334155;--slateL:#64748B;--slateXL:#94A3B8;
    --cream:#FAFAF8;--white:#FFFFFF;--rose:#F43F5E;--amber:#F59E0B;
    --violet:#7C3AED;--sky:#0EA5E9;
    --radius:16px;--shadow:0 4px 24px rgba(13,148,136,0.08);
    --shadowMd:0 8px 40px rgba(13,148,136,0.14);
    --sidebar-width:252px;--bottom-nav-h:64px;
  }
  html{scroll-behavior:smooth}
  body{font-family:'DM Sans',sans-serif;background:var(--cream);color:var(--slate);min-height:100vh;-webkit-font-smoothing:antialiased;overscroll-behavior:none}
  ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--jadeL);border-radius:99px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideLeft{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:translateX(0)}}
  @keyframes scaleIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
  .fade-up{animation:fadeUp .42s cubic-bezier(.22,1,.36,1) both}
  .scale-in{animation:scaleIn .32s cubic-bezier(.22,1,.36,1) both}
  .slide-left{animation:slideLeft .30s ease both}
  .slide-up{animation:slideUp .36s cubic-bezier(.22,1,.36,1) both}
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
  .btn:disabled{opacity:.55;cursor:not-allowed;transform:none !important;box-shadow:none !important}
  .card{background:#fff;border-radius:var(--radius);border:1px solid rgba(209,229,226,.7);box-shadow:var(--shadow);padding:20px;transition:box-shadow .25s,transform .25s}
  .card:hover{box-shadow:var(--shadowMd)}
  .badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:600;letter-spacing:.3px;text-transform:capitalize}
  .badge::before{content:'';width:5px;height:5px;border-radius:50%;background:currentColor;opacity:.6;flex-shrink:0}
  .badge-green{background:#D1FAE5;color:#059669}.badge-amber{background:#FEF3C7;color:#D97706}.badge-red{background:#FFE4E6;color:var(--rose)}.badge-teal{background:var(--jadeL);color:var(--jadeD)}.badge-purple{background:#EDE9FE;color:var(--violet)}.badge-blue{background:#E0F2FE;color:var(--sky)}
  input,textarea,select{width:100%;padding:11px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;background:#FAFBFC;color:var(--slate);transition:all .2s;outline:none;-webkit-appearance:none}
  input:focus,textarea:focus,select:focus{border-color:var(--jade);box-shadow:0 0 0 4px rgba(13,148,136,.12);background:#fff}
  input::placeholder,textarea::placeholder{color:var(--slateXL)}
  label{display:block;font-size:12px;font-weight:600;color:var(--slateL);margin-bottom:6px;letter-spacing:.3px;text-transform:uppercase}
  .form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  @media(max-width:600px){.form-row{grid-template-columns:1fr}}
  .spinner{width:18px;height:18px;border:2.5px solid rgba(13,148,136,.2);border-top-color:var(--jade);border-radius:50%;animation:spin .65s linear infinite}
  .sidebar{width:var(--sidebar-width);min-height:100vh;background:var(--onyx);display:flex;flex-direction:column;position:fixed;top:0;left:0;z-index:100;border-right:1px solid rgba(255,255,255,.05);transition:transform .3s cubic-bezier(.22,1,.36,1)}
  .sidebar::before{content:'';position:absolute;top:0;left:0;right:0;height:260px;background:radial-gradient(ellipse at 40% -10%,rgba(13,148,136,.22) 0%,transparent 70%);pointer-events:none}
  .sidebar-logo{padding:24px 20px 20px;border-bottom:1px solid rgba(255,255,255,.06);position:relative;z-index:1}
  .sidebar-logo-mark{display:inline-flex;align-items:center;gap:9px;margin-bottom:4px}
  .sidebar-logo-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--jade),var(--jadeD));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(13,148,136,.5);flex-shrink:0}
  .sidebar-logo h1{font-family:'DM Serif Display',serif;font-size:20px;color:#fff;line-height:1;letter-spacing:-.3px}
  .sidebar-logo p{font-size:10px;color:rgba(148,163,184,.6);letter-spacing:1px;text-transform:uppercase;font-weight:500}
  .nav-section-label{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.18);padding:18px 20px 6px}
  .nav-item{display:flex;align-items:center;gap:11px;padding:10px 12px;margin:2px 10px;border-radius:11px;cursor:pointer;font-size:13px;font-weight:500;color:rgba(148,163,184,.8);transition:all .2s;position:relative;overflow:hidden}
  .nav-item:hover{background:rgba(255,255,255,.07);color:#fff}
  .nav-item.active{background:linear-gradient(135deg,rgba(13,148,136,.3),rgba(15,118,110,.2));color:#fff;border:1px solid rgba(13,148,136,.35)}
  .nav-item.active::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:3px;border-radius:0 3px 3px 0;background:var(--jade);box-shadow:0 0 8px var(--jade)}
  .mobile-header{display:none;position:fixed;top:0;left:0;right:0;z-index:90;background:var(--onyx);height:56px;align-items:center;justify-content:space-between;padding:0 16px;border-bottom:1px solid rgba(255,255,255,.06)}
  .sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:99;backdrop-filter:blur(4px);animation:fadeIn .2s ease}
  .bottom-nav{display:none;position:fixed;bottom:0;left:0;right:0;z-index:90;background:var(--onyx);border-top:1px solid rgba(255,255,255,.06);height:var(--bottom-nav-h);align-items:center;justify-content:space-around;padding:0 4px;padding-bottom:env(safe-area-inset-bottom)}
  .bottom-nav-item{display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;padding:8px 4px;cursor:pointer;color:rgba(148,163,184,.6);font-size:9.5px;font-weight:600;letter-spacing:.3px;text-transform:uppercase;transition:color .2s;border-radius:10px;-webkit-tap-highlight-color:transparent;position:relative}
  .bottom-nav-item.active{color:var(--jade)}
  .main-area{margin-left:var(--sidebar-width);min-height:100vh}
  .page-wrap{padding:32px 36px}
  .page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px;gap:12px;flex-wrap:wrap}
  .page-title{font-family:'DM Serif Display',serif;font-size:26px;color:var(--slate);line-height:1.1;letter-spacing:-.3px}
  .page-subtitle{font-size:13px;color:var(--slateL);margin-top:4px}
  .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:28px}
  .stat-card{background:#fff;border-radius:var(--radius);border:1px solid rgba(209,229,226,.7);padding:18px;position:relative;overflow:hidden;transition:transform .25s,box-shadow .25s;box-shadow:var(--shadow)}
  .stat-card:hover{transform:translateY(-3px);box-shadow:var(--shadowMd)}
  .stat-card-bg{position:absolute;right:-20px;bottom:-20px;width:90px;height:90px;border-radius:50%;opacity:.07}
  .stat-icon{width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;margin-bottom:12px}
  .stat-val{font-family:'DM Serif Display',serif;font-size:28px;line-height:1;letter-spacing:-.5px}
  .stat-label{font-size:12px;color:var(--slateL);margin-top:4px;font-weight:500}
  .stat-trend{display:inline-flex;align-items:center;gap:3px;font-size:11px;font-weight:600;margin-top:8px;padding:2px 7px;border-radius:99px}
  .content-grid{display:grid;grid-template-columns:3fr 2fr;gap:18px}
  .data-table{width:100%;border-collapse:collapse;font-size:13.5px}
  .data-table thead th{text-align:left;padding:11px 12px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--slateL);border-bottom:1.5px solid #F1F5F9;background:#FAFBFC;white-space:nowrap}
  .data-table tbody td{padding:12px 12px;border-bottom:1px solid #F8FAFC;vertical-align:middle}
  .data-table tbody tr:last-child td{border:none}
  .data-table tbody tr{transition:background .15s}
  .data-table tbody tr:hover td{background:#F8FEFC}
  .mobile-list{display:none;flex-direction:column;gap:10px}
  .mobile-card{background:#fff;border-radius:14px;padding:14px;border:1px solid rgba(209,229,226,.7);box-shadow:var(--shadow);display:flex;flex-direction:column;gap:8px;animation:fadeUp .3s ease both}
  .mobile-card-header{display:flex;align-items:center;gap:10px}
  .mobile-card-actions{display:flex;gap:6px;margin-top:4px}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px}
  .modal{background:#fff;border-radius:20px;width:100%;max-width:540px;max-height:92vh;overflow-y:auto;padding:24px;box-shadow:0 32px 80px rgba(0,0,0,.22);animation:scaleIn .28s cubic-bezier(.22,1,.36,1);border:1px solid rgba(209,229,226,.5)}
  .modal-title{font-family:'DM Serif Display',serif;font-size:19px;margin-bottom:20px;letter-spacing:-.2px}
  .modal-footer{display:flex;gap:10px;justify-content:flex-end;margin-top:20px;padding-top:16px;border-top:1px solid #F1F5F9}
  @media(max-width:640px){.modal{position:fixed;bottom:0;left:0;right:0;border-radius:20px 20px 0 0;max-height:95vh;max-width:100%;margin:0;animation:slideUp .32s cubic-bezier(.22,1,.36,1)}.modal-overlay{align-items:flex-end;padding:0}}
  .chat-messages{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px;background:#FAFBFC}
  .msg-bubble{max-width:72%;padding:10px 13px;border-radius:16px;font-size:13.5px;line-height:1.55;position:relative;word-break:break-word}
  .msg-out{background:linear-gradient(135deg,var(--jade),var(--jadeD));color:#fff;border-bottom-right-radius:4px;align-self:flex-end;box-shadow:0 4px 14px rgba(13,148,136,.25)}
  .msg-in{background:#fff;color:var(--slate);border-bottom-left-radius:4px;align-self:flex-start;box-shadow:0 2px 8px rgba(0,0,0,.06);border:1px solid #F1F5F9}
  .msg-time{font-size:9.5px;opacity:.55;margin-top:3px}
  .chat-input-row{display:flex;gap:8px;padding:12px 14px;border-top:1px solid #F1F5F9;background:#fff}
  .vital-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #F8FAFC}
  .vital-row:last-child{border:none}
  .vital-label{font-size:12.5px;color:var(--slateL);display:flex;align-items:center;gap:8px}
  .vital-val{font-size:15px;font-weight:700;color:var(--slate)}
  .avatar{border-radius:50%;background:linear-gradient(135deg,var(--jadeL),#A7F3D0);color:var(--jadeD);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;font-family:'DM Sans',sans-serif;border:2px solid rgba(13,148,136,.15)}
  .auth-screen{min-height:100vh;display:flex;background:var(--cream)}
  .auth-left{flex:1.1;background:var(--onyx);display:flex;flex-direction:column;justify-content:center;padding:64px 56px;position:relative;overflow:hidden}
  .auth-left-orb1{position:absolute;top:-120px;right:-80px;width:480px;height:480px;border-radius:50%;background:radial-gradient(circle,rgba(13,148,136,.18) 0%,transparent 70%);pointer-events:none}
  .auth-left-orb2{position:absolute;bottom:-160px;left:-100px;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,rgba(20,184,166,.1) 0%,transparent 70%);pointer-events:none}
  .auth-right{flex:1;display:flex;align-items:center;justify-content:center;padding:48px 40px}
  .auth-card{width:100%;max-width:420px}
  .auth-card-title{font-family:'DM Serif Display',serif;font-size:28px;margin-bottom:6px;letter-spacing:-.4px;color:var(--slate)}
  .auth-card-sub{color:var(--slateL);font-size:13.5px;margin-bottom:26px;line-height:1.6}
  .auth-form-group{margin-bottom:14px}
  .input-icon-wrap{position:relative}
  .input-icon-wrap input{padding-left:40px}
  .input-icon{position:absolute;top:50%;left:12px;transform:translateY(-50%);color:var(--slateXL);pointer-events:none}
  .feature-pill{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);margin-bottom:10px;transition:background .2s}
  .feature-pill:hover{background:rgba(255,255,255,.08)}
  .feature-pill-icon{width:32px;height:32px;border-radius:8px;background:rgba(13,148,136,.2);border:1px solid rgba(13,148,136,.3);display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .toast-wrap{position:fixed;bottom:80px;right:16px;z-index:999;display:flex;flex-direction:column;gap:8px}
  .toast{padding:12px 16px;border-radius:13px;font-size:13.5px;font-weight:500;box-shadow:0 12px 32px rgba(0,0,0,.2);animation:fadeUp .28s cubic-bezier(.22,1,.36,1);display:flex;align-items:center;gap:9px;border:1px solid rgba(255,255,255,.15);backdrop-filter:blur(12px)}
  .toast-success{background:var(--jade);color:#fff}
  .toast-error{background:var(--rose);color:#fff}
  .toast-info{background:var(--sky);color:#fff}
  .progress-track{background:#F1F5F9;border-radius:99px;height:5px}
  .progress-fill{border-radius:99px;height:5px;transition:width .7s cubic-bezier(.22,1,.36,1)}
  .appt-card{border-radius:14px;padding:16px;background:#fff;border:1px solid rgba(209,229,226,.7);box-shadow:var(--shadow);transition:transform .2s,box-shadow .2s;position:relative;overflow:hidden}
  .appt-card:hover{transform:translateY(-3px);box-shadow:var(--shadowMd)}
  .section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
  .section-title{font-family:'DM Serif Display',serif;font-size:16px;letter-spacing:-.2px}
  .empty-state{text-align:center;padding:40px 24px;color:var(--slateL)}
  .empty-state-icon{width:52px;height:52px;border-radius:16px;background:var(--jadeXL);border:1px solid var(--jadeL);display:flex;align-items:center;justify-content:center;margin:0 auto 12px}
  .empty-state p{font-size:13.5px}
  .online-dot{width:8px;height:8px;border-radius:50%;background:#22C55E;box-shadow:0 0 0 2.5px rgba(34,197,94,.25);flex-shrink:0}
  .tag{display:inline-flex;align-items:center;background:#F1F5F9;color:var(--slateM);border-radius:6px;padding:2px 7px;font-size:10.5px;font-weight:600}
  .skeleton{background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:400px 100%;animation:shimmer 1.4s infinite;border-radius:8px}
  .profile-hero{background:linear-gradient(135deg,var(--onyx),var(--pine));border-radius:18px;padding:28px;color:#fff;position:relative;overflow:hidden;margin-bottom:18px}
  .profile-hero::before{content:'';position:absolute;right:-60px;top:-60px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(13,148,136,.25) 0%,transparent 70%)}
  .report-stat{background:#fff;border-radius:14px;padding:18px;border:1px solid rgba(209,229,226,.7);text-align:center;transition:transform .2s;box-shadow:var(--shadow)}
  .report-stat:hover{transform:translateY(-2px)}
  .report-stat-val{font-family:'DM Serif Display',serif;font-size:28px;line-height:1.1}
  .report-stat-label{font-size:11.5px;color:var(--slateL);margin-top:4px}
  .divider{height:1px;background:linear-gradient(90deg,transparent,#E2E8F0,transparent);margin:18px 0}
  .table-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}

  /* Skeleton loader */
  .skel-row{display:flex;gap:12px;margin-bottom:14px;align-items:center}
  .skel-circle{border-radius:50%;flex-shrink:0}
  .skel-line{border-radius:6px}

  @media(max-width:1100px){.stats-grid{grid-template-columns:repeat(2,1fr)}.content-grid{grid-template-columns:1fr}}
  @media(max-width:768px){
    :root{--sidebar-width:0px}
    .sidebar{transform:translateX(-252px);width:252px}
    .sidebar.open{transform:translateX(0)}
    .sidebar-overlay.open{display:block}
    .mobile-header{display:flex}
    .bottom-nav{display:flex}
    .main-area{margin-left:0;padding-top:56px;padding-bottom:var(--bottom-nav-h)}
    .page-wrap{padding:16px}
    .page-header{margin-bottom:18px}
    .page-title{font-size:22px}
    .toast-wrap{bottom:calc(var(--bottom-nav-h) + 12px);right:12px;left:12px}
    .data-table-wrap{display:none}
    .mobile-list{display:flex}
    .auth-left{display:none}
    .auth-right{padding:24px 20px}
  }
  @media(max-width:600px){.stats-grid{grid-template-columns:1fr 1fr;gap:10px}.stat-card{padding:14px}.stat-val{font-size:22px}.card{padding:14px;border-radius:14px}}
  @media(max-width:390px){.stats-grid{grid-template-columns:1fr 1fr;gap:8px}.page-wrap{padding:12px}}
  @supports(padding-top:env(safe-area-inset-top)){
    .mobile-header{padding-top:env(safe-area-inset-top);height:calc(56px + env(safe-area-inset-top))}
    .main-area{padding-top:calc(56px + env(safe-area-inset-top))}
    .bottom-nav{height:calc(var(--bottom-nav-h) + env(safe-area-inset-bottom));padding-bottom:env(safe-area-inset-bottom)}
    .main-area{padding-bottom:calc(var(--bottom-nav-h) + env(safe-area-inset-bottom))}
  }
`;

// ── Toast ────────────────────────────────────────────────────
let _toastFn = null;
function toast(msg, type = "success") { _toastFn?.(msg, type); }

// ── OPTIMIZED Supabase helpers ───────────────────────────────
// Generic safe query — returns [] on error, never throws
async function sbQ(table, queryFn) {
  try {
    const { data, error } = await queryFn(supabase.from(table));
    if (error) {
      console.error(`[${table}]`, error.message);
      toast(`${table}: ${error.message}`, "error");
      return [];
    }
    return data || [];
  } catch (e) {
    console.error(`[${table}] fetch failed:`, e.message);
    return [];
  }
}

// ── Slim selects (only fetch columns the UI actually uses) ──
async function sbGetPatients() {
  return sbQ("patients", q =>
    q.select("id,full_name,age,gender,diagnosis,medical_history,allergies,current_medications,status,assigned_caregiver,family_contact,emergency_contact,address,blood_type,created_by,created_at")
     .order("created_at", { ascending: false })
     .limit(200)
  );
}
async function sbGetAppointments() {
  return sbQ("appointments", q =>
    q.select("id,title,patient_id,caregiver_id,date,time,duration_mins,notes,status,created_at")
     .order("date", { ascending: false })
     .limit(200)
  );
}
async function sbGetMessages(uid) {
  return sbQ("messages", q =>
    q.select("id,sender_id,receiver_id,content,is_read,channel,created_at")
     .or(`sender_id.eq.${uid},receiver_id.eq.${uid},receiver_id.is.null`)
     .order("created_at", { ascending: false })
     .limit(100)
  );
}
async function sbGetHealthUpdates() {
  return sbQ("health_updates", q =>
    q.select("id,patient_id,caregiver_id,blood_pressure,heart_rate,temperature,spo2,respiratory_rate,blood_glucose,weight_kg,notes,severity,created_at")
     .order("created_at", { ascending: false })
     .limit(100)
  );
}
async function sbGetBillings() {
  return sbQ("billings", q =>
    q.select("id,patient_id,description,amount,discount,tax,total,status,payment_method,due_date,paid_at,notes,created_at")
     .order("created_at", { ascending: false })
     .limit(200)
  );
}
async function sbGetNotifications(uid) {
  return sbQ("notifications", q =>
    q.select("id,user_id,title,body,type,is_read,created_at")
     .eq("user_id", uid)
     .order("created_at", { ascending: false })
     .limit(50)
  );
}
async function sbGetCaregivers() {
  return sbQ("profiles", q =>
    q.select("id,role,full_name,avatar_url,phone,is_active")
     .eq("role", "caregiver")
     .limit(100)
  );
}
async function sbGetProfile(uid) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id,role,full_name,avatar_url,phone,address,is_active,created_at")
      .eq("id", uid)
      .single();
    if (error) throw error;
    return data;
  } catch (e) {
    console.error("profiles", e.message);
    return null;
  }
}
async function sbUpdateProfile(uid, fields) {
  const { error } = await supabase.from("profiles").update({ ...fields, updated_at: new Date().toISOString() }).eq("id", uid);
  return !error;
}

// Mutations
async function sbAddPatient(p) {
  const { data, error } = await supabase.from("patients").insert([{
    full_name: p.full_name, age: p.age ? Number(p.age) : null, gender: p.gender || null,
    diagnosis: p.diagnosis, medical_history: p.medical_history || null, allergies: p.allergies || null,
    current_medications: p.current_medications || null, status: p.status || "active",
    family_contact: p.family_contact || null, emergency_contact: p.emergency_contact || null,
    address: p.address || null, blood_type: p.blood_type || null,
    assigned_caregiver: p.assigned_caregiver || null,
  }]).select("id,full_name,age,gender,diagnosis,medical_history,allergies,current_medications,status,assigned_caregiver,family_contact,emergency_contact,address,blood_type,created_by,created_at").single();
  if (error) { toast(error.message, "error"); return null; }
  return data;
}
async function sbUpdatePatient(id, fields) {
  const allowed = ["full_name","age","gender","diagnosis","medical_history","allergies","current_medications","status","family_contact","emergency_contact","address","blood_type","assigned_caregiver"];
  const update = {};
  allowed.forEach(k => { if (fields[k] !== undefined) update[k] = fields[k]; });
  if (update.age) update.age = Number(update.age);
  const { data, error } = await supabase.from("patients").update(update).eq("id", id)
    .select("id,full_name,age,gender,diagnosis,medical_history,allergies,current_medications,status,assigned_caregiver,family_contact,emergency_contact,address,blood_type,created_by,created_at").single();
  if (error) { toast(error.message, "error"); return null; }
  return data;
}
async function sbDeletePatient(id) {
  const { error } = await supabase.from("patients").delete().eq("id", id);
  if (error) { toast(error.message, "error"); return false; }
  return true;
}
async function sbAddAppointment(a) {
  const { data, error } = await supabase.from("appointments").insert([{
    title: a.title, patient_id: a.patient_id, caregiver_id: a.caregiver_id || null,
    date: a.date, time: a.time, duration_mins: Number(a.duration_mins) || 60,
    notes: a.notes || null, status: a.status || "scheduled", created_by: a.created_by || null,
  }]).select("id,title,patient_id,caregiver_id,date,time,duration_mins,notes,status,created_at").single();
  if (error) { toast(error.message, "error"); return null; }
  return data;
}
async function sbUpdateAppointmentStatus(id, status) {
  const { data, error } = await supabase.from("appointments").update({ status, updated_at: new Date().toISOString() }).eq("id", id)
    .select("id,status").single();
  if (error) { toast(error.message, "error"); return false; }
  return data;
}
async function sbSendMessage(msg) {
  const { data, error } = await supabase.from("messages").insert([{
    sender_id: msg.sender_id, receiver_id: msg.receiver_id || null,
    content: msg.content, channel: msg.channel || "general",
  }]).select("id,sender_id,receiver_id,content,is_read,channel,created_at").single();
  if (error) { toast(error.message, "error"); return null; }
  return data;
}
async function sbLogVitals(v) {
  const { data, error } = await supabase.from("health_updates").insert([{
    patient_id: v.patient_id, caregiver_id: v.caregiver_id || null,
    blood_pressure: v.bp || null, heart_rate: v.hr || null,
    temperature: v.temp || null, spo2: v.spo2 || null,
    respiratory_rate: v.respiratory_rate || null, blood_glucose: v.blood_glucose || null,
    weight_kg: v.weight_kg || null,
    vitals: { bp: v.bp, hr: v.hr, temp: v.temp, spo2: v.spo2 },
    notes: v.notes || null, severity: v.severity || "normal",
  }]).select("id,patient_id,caregiver_id,blood_pressure,heart_rate,temperature,spo2,respiratory_rate,blood_glucose,weight_kg,notes,severity,created_at").single();
  if (error) { toast(error.message, "error"); return null; }
  return data;
}
async function sbAddBilling(b) {
  const { data, error } = await supabase.from("billings").insert([{
    patient_id: b.patient_id, description: b.description,
    amount: Number(b.amount), discount: 0, tax: 0,
    status: b.status || "pending", payment_method: b.payment_method || null,
    due_date: b.due_date || null, notes: b.notes || null,
  }]).select("id,patient_id,description,amount,discount,tax,total,status,payment_method,due_date,paid_at,notes,created_at").single();
  if (error) { toast(error.message, "error"); return null; }
  return data;
}
async function sbUpdateBillingStatus(id, status, method) {
  const update = { status, updated_at: new Date().toISOString() };
  if (method) update.payment_method = method;
  if (status === "paid") update.paid_at = new Date().toISOString();
  const { data, error } = await supabase.from("billings").update(update).eq("id", id)
    .select("id,status,payment_method,paid_at").single();
  if (error) { toast(error.message, "error"); return null; }
  return data;
}
async function sbUploadProfileImage(file, profileId) {
  if (!file) return null;
  const ext = file.name.split(".").pop();
  const path = `${profileId}/${Date.now()}.${ext}`;
  const { error: upErr } = await supabase.storage.from("profile-images").upload(path, file, { cacheControl: "3600", upsert: true });
  if (upErr) { console.error("upload", upErr.message); return null; }
  const { data } = supabase.storage.from("profile-images").getPublicUrl(path);
  return data?.publicUrl || null;
}

// ── Helpers ──────────────────────────────────────────────────
function normalizePhone(v) { return String(v || "").replace(/\D/g, ""); }
function resolveLinkedPatient(profile, patients) {
  if (!profile || !Array.isArray(patients)) return null;
  const profilePhone = normalizePhone(profile?.phone);
  return patients.find(p => p.created_by === profile.id)
    || (profilePhone ? patients.find(p => normalizePhone(p.family_contact) === profilePhone) : null)
    || null;
}
function resolveAssignedCaregivers(patient, caregivers) {
  if (!Array.isArray(caregivers)) return [];
  if (!patient) return caregivers;
  if (patient.assigned_caregiver) return caregivers.filter(c => c.id === patient.assigned_caregiver);
  return caregivers;
}

// ── Small components ─────────────────────────────────────────
function Spinner({ size = 18, color }) {
  return <div className="spinner" style={{ width: size, height: size, borderTopColor: color || C.jade }} />;
}
function Avatar({ name, size = 36, src }) {
  if (src) return <img src={src} alt={name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(13,148,136,.15)", flexShrink: 0 }} />;
  const initials = (name || "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const palettes = [["#CCFBF1","#0F766E"],["#D1FAE5","#059669"],["#E0F2FE","#0369A1"],["#EDE9FE","#6D28D9"],["#FEF3C7","#B45309"],["#FFE4E6","#BE123C"]];
  const [bg, fg] = palettes[(name || "?").charCodeAt(0) % palettes.length];
  return <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.36, background: bg, color: fg }}>{initials}</div>;
}
function Badge({ status }) {
  const map = { active:"badge-green", stable:"badge-teal", critical:"badge-red", scheduled:"badge-amber", completed:"badge-green", cancelled:"badge-red", in_progress:"badge-purple", paid:"badge-green", pending:"badge-amber", overdue:"badge-red", discharged:"badge-blue", normal:"badge-green", warning:"badge-amber", caregiver:"badge-teal", admin:"badge-purple", family:"badge-blue", patient:"badge-green", no_show:"badge-red" };
  return <span className={`badge ${map[status] || "badge-teal"}`}>{status?.replace(/_/g, " ") || "—"}</span>;
}
function Modal({ open, onClose, title, children, footer, wide }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: wide ? 640 : 520 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
          <h3 className="modal-title" style={{ margin:0 }}>{title}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:C.slateL, display:"flex", padding:4, borderRadius:8 }}><Icon name="x" size={20}/></button>
        </div>
        {children}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
function FG({ label, children, style }) {
  return <div style={{ marginBottom:12, ...style }}><label>{label}</label>{children}</div>;
}
function EmptyState({ icon, message }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon"><Icon name={icon || "info"} size={22} color={C.jade}/></div>
      <p>{message || "No records found."}</p>
    </div>
  );
}

// Skeleton loader for tables
function SkeletonRows({ rows = 4 }) {
  return Array.from({ length: rows }).map((_, i) => (
    <div key={i} className="skel-row" style={{ animationDelay:`${i*.08}s` }}>
      <div className="skeleton skel-circle" style={{ width:36, height:36 }}/>
      <div style={{ flex:1 }}>
        <div className="skeleton skel-line" style={{ height:13, width:"60%", marginBottom:6 }}/>
        <div className="skeleton skel-line" style={{ height:11, width:"40%" }}/>
      </div>
      <div className="skeleton skel-line" style={{ height:22, width:70, borderRadius:99 }}/>
    </div>
  ));
}

// ── AUTH SCREEN ──────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email:"", password:"", full_name:"", role:"caregiver" });
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]:e.target.value }));

  async function handleSubmit() {
    if (!form.email || !form.password) { toast("Please fill all required fields", "error"); return; }
    setLoading(true);
    try {
      if (mode === "register") {
        if (!form.full_name) { toast("Full name is required", "error"); setLoading(false); return; }
        const res = await supabase.auth.signUp({
          email: form.email, password: form.password,
          options: { data: { full_name: form.full_name, role: form.role } }
        });
        if (res.error) throw res.error;
        let user = res.data?.user, session = res.data?.session;
        if (!session) {
          const s2 = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
          if (s2.error) { toast("Account created. Check email to confirm.", "info"); setLoading(false); return; }
          user = s2.data.user; session = s2.data.session;
        }
        if (user?.id) {
          await supabase.from("profiles").upsert({ id: user.id, full_name: form.full_name, role: form.role });
          const profile = await sbGetProfile(user.id);
          onLogin({ ...profile, email: user.email });
          toast(`Welcome, ${profile?.full_name?.split(" ")[0] || "there"}!`);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) throw error;
        const profile = await sbGetProfile(data.user.id);
        onLogin({ ...profile, email: data.user.email });
        toast(`Welcome back, ${profile?.full_name?.split(" ")[0] || "there"}!`);
      }
    } catch (e) { toast(e.message, "error"); }
    setLoading(false);
  }

  const features = [
    { icon:"users",     title:"Patient Management",  desc:"Complete records, history & care plans" },
    { icon:"calendar",  title:"Smart Scheduling",    desc:"Appointments, reminders & caregiver sync" },
    { icon:"heart",     title:"Health Monitoring",   desc:"Real-time vitals & critical alerts" },
    { icon:"message",   title:"Team Messaging",      desc:"Instant communication across all staff" },
    { icon:"creditcard",title:"Billing & Finance",   desc:"Transparent invoicing & payment tracking" },
  ];

  return (
    <div className="auth-screen">
      <div className="auth-left">
        <div className="auth-left-orb1"/><div className="auth-left-orb2"/>
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:32 }}>
            <div className="sidebar-logo-icon" style={{ width:46, height:46, borderRadius:13 }}>
              <Icon name="heart" size={22} color="#fff"/>
            </div>
            <div>
              <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, color:"#fff", lineHeight:1, letterSpacing:"-.4px" }}>CareNest</h1>
              <p style={{ color:"rgba(148,163,184,.6)", fontSize:11, letterSpacing:"1px", textTransform:"uppercase" }}>Caregiving Platform</p>
            </div>
          </div>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:32, color:"#fff", lineHeight:1.1, letterSpacing:"-.5px", marginBottom:10 }}>
            Compassionate care,<br/><span style={{ color:C.jade }}>beautifully managed.</span>
          </h2>
          <p style={{ color:"rgba(148,163,184,.7)", fontSize:13.5, marginBottom:28, lineHeight:1.7 }}>Your all-in-one platform for modern caregiving.</p>
          {features.map(f => (
            <div key={f.icon} className="feature-pill">
              <div className="feature-pill-icon"><Icon name={f.icon} size={15} color={C.jade}/></div>
              <div>
                <div style={{ color:"#fff", fontWeight:600, fontSize:13 }}>{f.title}</div>
                <div style={{ color:"rgba(148,163,184,.6)", fontSize:11.5, marginTop:1 }}>{f.desc}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop:20, display:"flex", alignItems:"center", gap:8 }}>
            <Icon name="shield" size={13} color={C.jade}/>
            <span style={{ color:"rgba(100,116,139,.7)", fontSize:11.5 }}>Secured with Supabase Auth & Row-Level Security</span>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card fade-up">
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
            <div className="sidebar-logo-icon" style={{ width:40, height:40, borderRadius:11 }}>
              <Icon name="heart" size={18} color="#fff"/>
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:C.slate }}>CareNest</div>
              <div style={{ fontSize:11, color:C.slateL }}>Caregiving Platform</div>
            </div>
          </div>
          <h2 className="auth-card-title">{mode==="login"?"Welcome back":"Create account"}</h2>
          <p className="auth-card-sub">{mode==="login"?"Sign in to continue to your CareNest dashboard.":"Join CareNest and start managing care today."}</p>
          {mode==="register" && (
            <div className="auth-form-group">
              <label>Full Name</label>
              <div className="input-icon-wrap">
                <span className="input-icon"><Icon name="user" size={14}/></span>
                <input placeholder="e.g. Maria Santos" value={form.full_name} onChange={set("full_name")}/>
              </div>
            </div>
          )}
          <div className="auth-form-group">
            <label>Email Address</label>
            <div className="input-icon-wrap">
              <span className="input-icon"><Icon name="mail" size={14}/></span>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
            </div>
          </div>
          <div className="auth-form-group">
            <label>Password</label>
            <div className="input-icon-wrap">
              <span className="input-icon"><Icon name="lock" size={14}/></span>
              <input type="password" placeholder="••••••••" value={form.password} onChange={set("password")} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
            </div>
          </div>
          {mode==="register" && (
            <div className="auth-form-group">
              <label>Role</label>
              <select value={form.role} onChange={set("role")}>
                <option value="admin">Admin</option>
                <option value="caregiver">Caregiver</option>
                <option value="patient">Patient</option>
                <option value="family">Family Member</option>
              </select>
            </div>
          )}
          <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center", padding:"13px 20px", marginTop:8, fontSize:14, borderRadius:13 }}
            onClick={handleSubmit} disabled={loading}>
            {loading ? <Spinner color="#fff"/> : <>{mode==="login"?"Sign In":"Create Account"} <Icon name="chevronright" size={15}/></>}
          </button>
          <p style={{ textAlign:"center", marginTop:18, fontSize:13.5, color:C.slateL }}>
            {mode==="login"?"Don't have an account? ":"Already have an account? "}
            <span style={{ color:C.jade, cursor:"pointer", fontWeight:600 }} onClick={()=>setMode(mode==="login"?"register":"login")}>
              {mode==="login"?"Sign up":"Sign in"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD ────────────────────────────────────────────────
function Dashboard({ patients, appointments, billings, healthUpdates, notifications, onNav }) {
  const today = new Date().toISOString().split("T")[0];
  const todayAppts = appointments.filter(a => a.date === today);
  const critical = patients.filter(p => p.status === "critical").length;
  const pendingBills = billings.filter(b => b.status==="pending").reduce((s,b)=>s+Number(b.amount),0);
  const unreadNotifs = notifications.filter(n=>!n.is_read).length;

  const stats = [
    { icon:"users",      val:patients.length,  label:"Total Patients",   color:C.jade,   bg:"#D1FAE5", trend:`${patients.filter(p=>p.status==="active").length} active` },
    { icon:"calendar",   val:todayAppts.length,label:"Today's Schedule", color:C.violet, bg:"#EDE9FE", trend:`${appointments.filter(a=>a.status==="scheduled").length} scheduled` },
    { icon:"alert",      val:critical,         label:"Critical Cases",   color:C.rose,   bg:"#FFE4E6", trend:"Needs attention" },
    { icon:"creditcard", val:`₱${pendingBills.toLocaleString()}`, label:"Pending Billing", color:C.amber, bg:"#FEF3C7", trend:`${billings.filter(b=>b.status==="pending").length} invoices` },
  ];

  return (
    <div className="fade-up">
      <div className="page-header">
        <div>
          <p style={{ fontSize:11.5, color:C.jade, fontWeight:600, letterSpacing:"1px", textTransform:"uppercase", marginBottom:4 }}>
            {new Date().toLocaleDateString("en-PH",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}
          </p>
          <h2 className="page-title">Good morning 👋</h2>
          <p className="page-subtitle">Here's what's happening in CareNest today.</p>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {unreadNotifs > 0 && (
            <div style={{ display:"flex", alignItems:"center", gap:6, background:"#FEF3C7", color:C.amber, border:"1px solid #FDE68A", borderRadius:10, padding:"7px 12px", fontSize:12, fontWeight:600 }}>
              <Icon name="alert" size={13} color={C.amber}/> {unreadNotifs}
            </div>
          )}
          <button className="btn btn-primary" style={{ padding:"9px 16px", fontSize:13 }} onClick={()=>onNav("patients")}>
            <Icon name="plus" size={14}/> New Patient
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((s,i)=>(
          <div key={i} className="stat-card fade-up" style={{ animationDelay:`${i*.06}s` }}>
            <div className="stat-card-bg" style={{ background:s.color }}/>
            <div className="stat-icon" style={{ background:s.bg }}><Icon name={s.icon} size={18} color={s.color}/></div>
            <div className="stat-val" style={{ color:s.color }}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-trend" style={{ background:s.bg, color:s.color }}>{s.trend}</div>
          </div>
        ))}
      </div>

      <div className="content-grid">
        <div className="card">
          <div className="section-header">
            <h3 className="section-title">Today's Schedule</h3>
            <button className="btn btn-ghost" style={{ padding:"6px 12px", fontSize:12 }} onClick={()=>onNav("appointments")}>View All</button>
          </div>
          {todayAppts.length===0
            ? <EmptyState icon="calendar" message="No appointments today."/>
            : todayAppts.map((a,i)=>(
              <div key={a.id} className="fade-up" style={{ animationDelay:`${i*.05}s`, display:"flex", alignItems:"center", gap:12, padding:"11px 0", borderBottom:i<todayAppts.length-1?"1px solid #F8FAFC":"none" }}>
                <div style={{ background:"linear-gradient(135deg,#CCFBF1,#A7F3D0)", color:C.jadeD, borderRadius:9, padding:"5px 9px", fontSize:12, fontWeight:700, minWidth:48, textAlign:"center", flexShrink:0 }}>{a.time?.slice(0,5)}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.title}</div>
                  <div style={{ fontSize:11.5, color:C.slateL, marginTop:2 }}>{a.notes}</div>
                </div>
                <Badge status={a.status}/>
              </div>
            ))
          }
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div className="card">
            <div className="section-header">
              <h3 className="section-title">Health Alerts</h3>
              <button className="btn btn-ghost" style={{ padding:"6px 12px", fontSize:12 }} onClick={()=>onNav("health")}>View All</button>
            </div>
            {healthUpdates.slice(0,4).map((u,i)=>{
              const pt = patients.find(p=>p.id===u.patient_id);
              const isCrit = u.severity==="critical";
              return (
                <div key={u.id} style={{ display:"flex", gap:9, marginBottom:i<3?10:0, alignItems:"flex-start", padding:9, borderRadius:10, background:isCrit?"#FFF1F2":"transparent", border:isCrit?"1px solid #FFE4E6":"none" }}>
                  <Avatar name={pt?.full_name||"?"} size={30}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontWeight:600, fontSize:12.5 }}>{pt?.full_name||"Unknown"}</span>
                      {isCrit && <span style={{ fontSize:9, fontWeight:700, color:C.rose, background:"#FFE4E6", padding:"1px 5px", borderRadius:99 }}>CRITICAL</span>}
                    </div>
                    <div style={{ fontSize:11.5, color:C.slateL, marginTop:1 }}>{u.notes}</div>
                    <div style={{ display:"flex", gap:4, marginTop:4, flexWrap:"wrap" }}>
                      {u.blood_pressure && <span className="tag">BP: {u.blood_pressure}</span>}
                      {u.heart_rate && <span className="tag">HR: {u.heart_rate}</span>}
                      {u.spo2 && <span className="tag">SpO₂: {u.spo2}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
            {healthUpdates.length===0 && <EmptyState icon="activity" message="No health updates yet."/>}
          </div>

          <div className="card" style={{ background:"linear-gradient(135deg,var(--onyx),var(--pine))", color:"#fff", border:"none" }}>
            <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:14, marginBottom:12, color:"#fff" }}>Billing Overview</h3>
            {[
              { label:"Collected",   val:`₱${billings.filter(b=>b.status==="paid").reduce((s,b)=>s+Number(b.amount),0).toLocaleString()}`,    color:C.jade  },
              { label:"Outstanding", val:`₱${billings.filter(b=>b.status==="pending").reduce((s,b)=>s+Number(b.amount),0).toLocaleString()}`,  color:C.amber },
              { label:"Overdue",     val:`₱${billings.filter(b=>b.status==="overdue").reduce((s,b)=>s+Number(b.amount),0).toLocaleString()}`,  color:C.rose  },
            ].map(r=>(
              <div key={r.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,.06)" }}>
                <span style={{ fontSize:12.5, color:"rgba(148,163,184,.7)" }}>{r.label}</span>
                <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:17, color:r.color }}>{r.val}</span>
              </div>
            ))}
            <button className="btn" style={{ marginTop:12, width:"100%", justifyContent:"center", background:"rgba(255,255,255,.08)", color:"#fff", border:"1px solid rgba(255,255,255,.12)", borderRadius:10, fontSize:13 }} onClick={()=>onNav("billing")}>
              Manage Billing →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PATIENTS MODULE ──────────────────────────────────────────
function PatientsModule({ patients, setPatients, profile, setAppointments, caregivers }) {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [showBook, setShowBook] = useState(null);
  const [bookForm, setBookForm] = useState({ caregiver_id:"", date:"", time:"", notes:"", duration_mins:60 });
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [saving, setSaving] = useState(false);

  const emptyForm = { full_name:"", age:"", gender:"", diagnosis:"", medical_history:"", allergies:"", current_medications:"", status:"active", family_contact:"", emergency_contact:"", blood_type:"", address:"", assigned_caregiver:"" };
  const [form, setForm] = useState(emptyForm);
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  const isPatientRole = profile?.role==="patient";
  const isFamilyRole = profile?.role==="family";
  const linkedPatient = resolveLinkedPatient(profile, patients);
  const visiblePatients = (isPatientRole||isFamilyRole) ? (linkedPatient?[linkedPatient]:[]) : patients;
  const filtered = visiblePatients.filter(p=>{
    const q=search.toLowerCase();
    return (!q || p.full_name.toLowerCase().includes(q) || p.diagnosis.toLowerCase().includes(q))
      && (filterStatus==="all" || p.status===filterStatus);
  });

  useEffect(()=>{
    if (!showBook) { setBookForm({ caregiver_id:"", date:"", time:"", notes:"", duration_mins:60 }); return; }
    const p = patients.find(x=>x.id===showBook)||linkedPatient;
    const assigned = resolveAssignedCaregivers(p, caregivers);
    setBookForm(f=>({...f, caregiver_id: assigned.length?assigned[0].id:(caregivers[0]?.id||"")}));
  },[showBook]);

  async function save() {
    if (!form.full_name||!form.diagnosis) { toast("Name and diagnosis are required","error"); return; }
    setSaving(true);
    const payload = { ...form, age: form.age?Number(form.age):null, assigned_caregiver: form.assigned_caregiver||null };
    if (showEdit) {
      const updated = await sbUpdatePatient(showEdit, payload);
      if (updated) {
        // Optimistically update local state — no full re-fetch
        setPatients(prev => prev.map(p => p.id === showEdit ? { ...p, ...updated } : p));
        toast("Patient updated"); setShowEdit(null);
      }
    } else {
      const created = await sbAddPatient(payload);
      if (created) {
        setPatients(prev => [created, ...prev]);
        toast("Patient added"); setShowAdd(false); setForm(emptyForm);
      }
    }
    setSaving(false);
  }

  async function del(id) {
    if (!window.confirm("Remove this patient record permanently?")) return;
    const ok = await sbDeletePatient(id);
    if (ok) {
      setPatients(prev => prev.filter(p => p.id !== id));
      toast("Patient removed");
    }
  }

  function openEdit(p) { setForm({...emptyForm,...p, age:p.age?.toString()||"", assigned_caregiver:p.assigned_caregiver||""}); setShowEdit(p.id); }
  const statusCounts = ["active","stable","critical","discharged"].map(s=>({status:s, count:visiblePatients.filter(p=>p.status===s).length}));

  return (
    <div className="fade-up">
      <div className="page-header">
        <div>
          <h2 className="page-title">Patients</h2>
          <p className="page-subtitle">{visiblePatients.length} total records</p>
        </div>
        {!(isPatientRole||isFamilyRole) && (
          <button className="btn btn-primary" style={{ padding:"9px 16px", fontSize:13 }} onClick={()=>{setForm(emptyForm);setShowAdd(true);}}>
            <Icon name="plus" size={14}/> Add Patient
          </button>
        )}
      </div>

      <div style={{ display:"flex", gap:7, marginBottom:16, flexWrap:"wrap" }}>
        {[{label:"All",val:"all"}, ...statusCounts.map(s=>({label:`${s.status.charAt(0).toUpperCase()+s.status.slice(1)} (${s.count})`,val:s.status}))].map(f=>(
          <button key={f.val} className={`btn ${filterStatus===f.val?"btn-primary":"btn-ghost"}`}
            style={{ padding:"6px 13px", fontSize:12, borderRadius:99 }}
            onClick={()=>setFilterStatus(f.val)}>{f.label}</button>
        ))}
      </div>

      <div className="card">
        <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:16 }}>
          <div style={{ position:"relative", flex:1, maxWidth:300 }}>
            <span style={{ position:"absolute", top:"50%", left:11, transform:"translateY(-50%)", color:C.slateXL, pointerEvents:"none" }}><Icon name="search" size={14}/></span>
            <input placeholder="Search patients…" value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:34, fontSize:13 }}/>
          </div>
          <span style={{ fontSize:12, color:C.slateL, fontWeight:500, flexShrink:0 }}>{filtered.length} found</span>
        </div>

        <div className="data-table-wrap" style={{ overflowX:"auto" }}>
          <table className="data-table">
            <thead><tr><th>Patient</th><th>Age/Gender</th><th>Diagnosis</th><th>Blood Type</th><th>Status</th><th>Registered</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(p=>(
                <tr key={p.id}>
                  <td>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <Avatar name={p.full_name} size={34}/>
                      <div>
                        <div style={{ fontWeight:600, fontSize:13 }}>{p.full_name}</div>
                        <div style={{ fontSize:11, color:C.slateL }}>{p.family_contact||"No contact"}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color:C.slateM }}>{p.age?`${p.age}y`:""} {p.gender&&<span style={{ fontSize:11, color:C.slateXL, display:"block", textTransform:"capitalize" }}>{p.gender}</span>}</td>
                  <td style={{ fontSize:13, color:C.slateM, maxWidth:160 }}>{p.diagnosis}</td>
                  <td>{p.blood_type?<span className="tag">{p.blood_type}</span>:"—"}</td>
                  <td><Badge status={p.status}/></td>
                  <td style={{ color:C.slateL, fontSize:12 }}>{p.created_at?.split("T")[0]}</td>
                  <td>
                    {(isPatientRole||isFamilyRole) ? (
                      <button className="btn btn-primary" style={{ padding:"6px 10px", fontSize:12, gap:4 }} onClick={()=>setShowBook(p.id)}>
                        <Icon name="calendar" size={12}/> Book
                      </button>
                    ) : (
                      <div style={{ display:"flex", gap:5 }}>
                        <button className="btn btn-ghost" style={{ padding:"6px 10px", fontSize:12, gap:4 }} onClick={()=>openEdit(p)}>
                          <Icon name="edit" size={13}/> Edit
                        </button>
                        <button className="btn btn-danger" style={{ padding:"6px 10px", fontSize:12 }} onClick={()=>del(p.id)}>
                          <Icon name="trash" size={13}/>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length===0 && <tr><td colSpan={7}><EmptyState icon="users" message="No patients found."/></td></tr>}
            </tbody>
          </table>
        </div>

        <div className="mobile-list">
          {filtered.map((p,i)=>(
            <div key={p.id} className="mobile-card" style={{ animationDelay:`${i*.04}s` }}>
              <div className="mobile-card-header">
                <Avatar name={p.full_name} size={42}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:14, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.full_name}</div>
                  <div style={{ fontSize:12, color:C.slateL, marginTop:2 }}>{p.diagnosis}</div>
                </div>
                <Badge status={p.status}/>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {p.age && <span className="tag">{p.age}y</span>}
                {p.gender && <span className="tag" style={{ textTransform:"capitalize" }}>{p.gender}</span>}
                {p.blood_type && <span className="tag">{p.blood_type}</span>}
              </div>
              {p.family_contact && <div style={{ fontSize:12, color:C.slateL, display:"flex", alignItems:"center", gap:5 }}><Icon name="phone" size={11} color={C.slateL}/> {p.family_contact}</div>}
              <div className="mobile-card-actions">
                {(isPatientRole||isFamilyRole) ? (
                  <button className="btn btn-primary" style={{ flex:1, justifyContent:"center", padding:"8px", fontSize:12.5 }} onClick={()=>setShowBook(p.id)}>
                    <Icon name="calendar" size={13}/> Book Caregiver
                  </button>
                ) : (
                  <>
                    <button className="btn btn-ghost" style={{ flex:1, justifyContent:"center", padding:"8px", fontSize:12.5 }} onClick={()=>openEdit(p)}>
                      <Icon name="edit" size={13}/> Edit
                    </button>
                    <button className="btn btn-danger" style={{ padding:"8px 12px", fontSize:12 }} onClick={()=>del(p.id)}>
                      <Icon name="trash" size={13}/>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          {filtered.length===0 && <EmptyState icon="users" message="No patients found."/>}
        </div>
      </div>

      <Modal open={showAdd||!!showEdit} onClose={()=>{setShowAdd(false);setShowEdit(null);}} title={showEdit?"Edit Patient":"Add New Patient"} wide
        footer={<>
          <button className="btn btn-ghost" onClick={()=>{setShowAdd(false);setShowEdit(null);}}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            {saving?<Spinner color="#fff"/>:<><Icon name="check" size={14}/> {showEdit?"Update":"Save"}</>}
          </button>
        </>}>
        <div className="form-row">
          <FG label="Full Name *"><input value={form.full_name} onChange={set("full_name")} placeholder="Juan dela Cruz"/></FG>
          <FG label="Age"><input type="number" value={form.age} onChange={set("age")} placeholder="65"/></FG>
        </div>
        <div className="form-row">
          <FG label="Gender">
            <select value={form.gender} onChange={set("gender")}>
              <option value="">Select…</option>
              <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
            </select>
          </FG>
          <FG label="Blood Type">
            <select value={form.blood_type} onChange={set("blood_type")}>
              <option value="">Select…</option>
              {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bt=><option key={bt} value={bt}>{bt}</option>)}
            </select>
          </FG>
        </div>
        <FG label="Diagnosis *"><input value={form.diagnosis} onChange={set("diagnosis")} placeholder="e.g. Hypertension"/></FG>
        <div className="form-row">
          <FG label="Status">
            <select value={form.status} onChange={set("status")}>
              <option value="active">Active</option><option value="stable">Stable</option>
              <option value="critical">Critical</option><option value="discharged">Discharged</option>
            </select>
          </FG>
          <FG label="Assigned Caregiver">
            <select value={form.assigned_caregiver} onChange={set("assigned_caregiver")}>
              <option value="">None</option>
              {caregivers.map(c=><option key={c.id} value={c.id}>{c.full_name}</option>)}
            </select>
          </FG>
        </div>
        <div className="form-row">
          <FG label="Family Contact"><input value={form.family_contact} onChange={set("family_contact")} placeholder="+63 9XX XXX XXXX"/></FG>
          <FG label="Emergency Contact"><input value={form.emergency_contact} onChange={set("emergency_contact")} placeholder="+63 9XX XXX XXXX"/></FG>
        </div>
        <FG label="Address"><input value={form.address} onChange={set("address")} placeholder="City, Province"/></FG>
        <FG label="Medical History"><textarea rows={2} value={form.medical_history} onChange={set("medical_history")} placeholder="Previous conditions…"/></FG>
        <div className="form-row">
          <FG label="Allergies"><input value={form.allergies} onChange={set("allergies")} placeholder="e.g. Penicillin"/></FG>
          <FG label="Current Medications"><input value={form.current_medications} onChange={set("current_medications")} placeholder="e.g. Amlodipine 5mg"/></FG>
        </div>
      </Modal>

      <Modal open={!!showBook} onClose={()=>setShowBook(null)} title="Book Caregiver"
        footer={<>
          <button className="btn btn-ghost" onClick={()=>setShowBook(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={async()=>{
            if (!bookForm.caregiver_id||!bookForm.date||!bookForm.time) { toast("Select caregiver, date and time","error"); return; }
            const selPt = patients.find(x=>x.id===showBook)||linkedPatient;
            if (!selPt) { toast("No linked patient found","error"); return; }
            const created = await sbAddAppointment({
              title:`Appointment – ${selPt.full_name}`,
              patient_id:selPt.id, caregiver_id:bookForm.caregiver_id,
              date:bookForm.date, time:bookForm.time,
              duration_mins:Number(bookForm.duration_mins)||60,
              notes:bookForm.notes, created_by:profile?.id||null,
            });
            if (created) {
              if (setAppointments) setAppointments(prev=>[created,...prev]);
              toast("Appointment requested"); setShowBook(null);
            }
          }}>Request Appointment</button>
        </>}>
        {(()=>{
          const selPt = patients.find(x=>x.id===showBook)||linkedPatient;
          const assignedCgs = resolveAssignedCaregivers(selPt, caregivers);
          return (
            <>
              <FG label="Patient">
                <div style={{ padding:"10px 12px", borderRadius:8, border:"1px solid #DBEAFE", background:"#F8FAFC", fontWeight:600, fontSize:13 }}>
                  {selPt?.full_name||"No linked patient"}
                </div>
              </FG>
              <FG label="Caregiver *">
                <select value={bookForm.caregiver_id} onChange={e=>setBookForm(f=>({...f,caregiver_id:e.target.value}))}>
                  <option value="">Select caregiver…</option>
                  {(assignedCgs.length?assignedCgs:caregivers).map(c=><option key={c.id} value={c.id}>{c.full_name}</option>)}
                </select>
              </FG>
              <div className="form-row">
                <FG label="Date *"><input type="date" value={bookForm.date} onChange={e=>setBookForm(f=>({...f,date:e.target.value}))}/></FG>
                <FG label="Time *"><input type="time" value={bookForm.time} onChange={e=>setBookForm(f=>({...f,time:e.target.value}))}/></FG>
              </div>
              <FG label="Duration (mins)"><input type="number" value={bookForm.duration_mins} onChange={e=>setBookForm(f=>({...f,duration_mins:e.target.value}))}/></FG>
              <FG label="Notes"><textarea rows={3} value={bookForm.notes} onChange={e=>setBookForm(f=>({...f,notes:e.target.value}))}/></FG>
            </>
          );
        })()}
      </Modal>
    </div>
  );
}

// ── APPOINTMENTS MODULE ──────────────────────────────────────
function AppointmentsModule({ appointments, setAppointments, patients, profile, caregivers }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("all");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title:"", patient_id:"", caregiver_id:"", date:"", time:"", notes:"", status:"scheduled", duration_mins:60 });
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  const linkedPatient = resolveLinkedPatient(profile, patients);
  const isPatientLike = profile?.role==="patient"||profile?.role==="family";
  const filtered = appointments.filter(a=>filter==="all"||a.status===filter);

  async function addAppt() {
    const patientId = isPatientLike ? linkedPatient?.id : form.patient_id;
    if (!form.title||!patientId||!form.date||!form.time) { toast("Fill all required fields","error"); return; }
    setSaving(true);
    const created = await sbAddAppointment({
      ...form, patient_id:patientId, duration_mins:Number(form.duration_mins)||60,
      created_by:profile?.id||null, caregiver_id:form.caregiver_id||null,
    });
    if (created) {
      setAppointments(prev => [created, ...prev]);
      toast("Appointment scheduled");
      setShowAdd(false);
      setForm({ title:"", patient_id:"", caregiver_id:"", date:"", time:"", notes:"", status:"scheduled", duration_mins:60 });
    }
    setSaving(false);
  }

  async function changeStatus(id, status) {
    const updated = await sbUpdateAppointmentStatus(id, status);
    if (updated) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      toast(`Marked as ${status}`);
    }
  }

  const statusColors = { scheduled:C.amber, completed:C.jade, cancelled:C.rose, in_progress:C.violet, no_show:C.slateL };
  const filterTabs = ["all","scheduled","in_progress","completed","cancelled"];

  return (
    <div className="fade-up">
      <div className="page-header">
        <div>
          <h2 className="page-title">Appointments</h2>
          <p className="page-subtitle">Schedule and manage caregiving sessions</p>
        </div>
        <button className="btn btn-primary" style={{ padding:"9px 16px", fontSize:13 }} onClick={()=>setShowAdd(true)}>
          <Icon name="plus" size={14}/> Schedule
        </button>
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:20, flexWrap:"wrap" }}>
        {filterTabs.map(f=>(
          <button key={f} className={`btn ${filter===f?"btn-primary":"btn-ghost"}`}
            style={{ padding:"6px 13px", fontSize:12, borderRadius:99, textTransform:"capitalize" }}
            onClick={()=>setFilter(f)}>
            {f.replace("_"," ")} {f!=="all"&&`(${appointments.filter(a=>a.status===f).length})`}
          </button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
        {filtered.map((a,i)=>{
          const pt = patients.find(p=>p.id===a.patient_id);
          const cg = caregivers.find(c=>c.id===a.caregiver_id);
          const bc = statusColors[a.status]||C.jade;
          return (
            <div key={a.id} className="appt-card slide-left" style={{ animationDelay:`${i*.04}s`, borderTop:`3px solid ${bc}` }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:13.5, marginBottom:3 }}>{a.title}</div>
                  <div style={{ fontSize:12, color:C.slateL, display:"flex", alignItems:"center", gap:4 }}>
                    <Icon name="calendar" size={11} color={C.slateL}/>
                    {a.date} · {a.time?.slice(0,5)} · {a.duration_mins||60}min
                  </div>
                </div>
                <Badge status={a.status}/>
              </div>
              {pt && (
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, padding:"7px 9px", background:"#F8FAFC", borderRadius:9 }}>
                  <Avatar name={pt.full_name} size={24}/>
                  <div><div style={{ fontSize:12.5, fontWeight:600 }}>{pt.full_name}</div><div style={{ fontSize:11, color:C.slateL }}>{pt.diagnosis}</div></div>
                </div>
              )}
              {cg && (
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, padding:"7px 9px", background:"#EFF6FF", borderRadius:9, border:"1px solid #DBEAFE" }}>
                  <Avatar name={cg.full_name} size={24}/>
                  <div><div style={{ fontSize:12.5, fontWeight:700, color:C.violet }}>{cg.full_name}</div><div style={{ fontSize:11, color:C.slateL }}>Caregiver</div></div>
                </div>
              )}
              {a.notes && <p style={{ fontSize:12.5, color:C.slateM, marginBottom:10, lineHeight:1.5 }}>{a.notes}</p>}
              {a.status==="scheduled" && (
                <div style={{ display:"flex", gap:6 }}>
                  <button className="btn btn-primary" style={{ flex:1, justifyContent:"center", padding:"7px", fontSize:12 }} onClick={()=>changeStatus(a.id,"completed")}>
                    <Icon name="check" size={13}/> Done
                  </button>
                  <button className="btn btn-danger" style={{ padding:"7px 11px", fontSize:12 }} onClick={()=>changeStatus(a.id,"cancelled")}>
                    <Icon name="x" size={13}/>
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length===0 && (
          <div style={{ gridColumn:"1/-1" }}><div className="card"><EmptyState icon="calendar" message="No appointments found."/></div></div>
        )}
      </div>

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Schedule Appointment"
        footer={<>
          <button className="btn btn-ghost" onClick={()=>setShowAdd(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={addAppt} disabled={saving}>
            {saving?<Spinner color="#fff"/>:<><Icon name="calendar" size={14}/> Schedule</>}
          </button>
        </>}>
        <FG label="Title *"><input value={form.title} onChange={set("title")} placeholder="Visit / Therapy session"/></FG>
        <div className="form-row">
          <FG label="Patient *">
            {isPatientLike ? (
              <div style={{ padding:"10px 12px", borderRadius:8, border:"1px solid #DBEAFE", background:"#F8FAFC", fontWeight:600, fontSize:13 }}>
                {linkedPatient?.full_name||"No linked patient"}
              </div>
            ) : (
              <select value={form.patient_id} onChange={set("patient_id")}>
                <option value="">Select patient…</option>
                {patients.map(p=><option key={p.id} value={p.id}>{p.full_name}</option>)}
              </select>
            )}
          </FG>
          <FG label="Caregiver">
            <select value={form.caregiver_id} onChange={set("caregiver_id")}>
              <option value="">Select caregiver…</option>
              {(()=>{
                const selPt = isPatientLike ? linkedPatient : patients.find(p=>p.id===form.patient_id);
                return resolveAssignedCaregivers(selPt, caregivers).map(c=><option key={c.id} value={c.id}>{c.full_name}</option>);
              })()}
            </select>
          </FG>
        </div>
        <div className="form-row">
          <FG label="Date *"><input type="date" value={form.date} onChange={set("date")}/></FG>
          <FG label="Time *"><input type="time" value={form.time} onChange={set("time")}/></FG>
        </div>
        <div className="form-row">
          <FG label="Duration (mins)"><input type="number" value={form.duration_mins} onChange={set("duration_mins")}/></FG>
          <FG label="Status">
            <select value={form.status} onChange={set("status")}>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </FG>
        </div>
        <FG label="Notes"><textarea rows={3} value={form.notes} onChange={set("notes")} placeholder="Session notes…"/></FG>
      </Modal>
    </div>
  );
}

// ── HEALTH MODULE ────────────────────────────────────────────
function HealthModule({ healthUpdates, setHealthUpdates, patients, profile }) {
  const [showLog, setShowLog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterPt, setFilterPt] = useState("all");
  const [form, setForm] = useState({ patient_id:"", bp:"", hr:"", temp:"", spo2:"", respiratory_rate:"", blood_glucose:"", weight_kg:"", notes:"", severity:"normal" });
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  async function logVitals() {
    if (!form.patient_id) { toast("Select a patient","error"); return; }
    setSaving(true);
    const created = await sbLogVitals({
      patient_id:form.patient_id,
      caregiver_id:profile?.role==="caregiver"?profile?.id:null,
      bp:form.bp, hr:form.hr, temp:form.temp, spo2:form.spo2,
      respiratory_rate:form.respiratory_rate, blood_glucose:form.blood_glucose,
      weight_kg:form.weight_kg?Number(form.weight_kg):null,
      notes:form.notes, severity:form.severity,
    });
    if (created) {
      setHealthUpdates(prev => [created, ...prev]);
      toast("Vitals logged");
      setShowLog(false);
      setForm({ patient_id:"", bp:"", hr:"", temp:"", spo2:"", respiratory_rate:"", blood_glucose:"", weight_kg:"", notes:"", severity:"normal" });
    }
    setSaving(false);
  }

  const shown = healthUpdates.filter(u=>filterPt==="all"||u.patient_id===filterPt);

  return (
    <div className="fade-up">
      <div className="page-header">
        <div>
          <h2 className="page-title">Health Monitoring</h2>
          <p className="page-subtitle">Track patient vitals and health updates</p>
        </div>
        <button className="btn btn-primary" style={{ padding:"9px 16px", fontSize:13 }} onClick={()=>setShowLog(true)}>
          <Icon name="plus" size={14}/> Log Vitals
        </button>
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:20, flexWrap:"wrap" }}>
        <button className={`btn ${filterPt==="all"?"btn-primary":"btn-ghost"}`} style={{ padding:"6px 13px", fontSize:12, borderRadius:99 }} onClick={()=>setFilterPt("all")}>All</button>
        {patients.map(p=>(
          <button key={p.id} className={`btn ${filterPt===p.id?"btn-primary":"btn-ghost"}`} style={{ padding:"6px 13px", fontSize:12, borderRadius:99 }} onClick={()=>setFilterPt(p.id)}>
            {p.full_name.split(" ")[0]}
          </button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
        {shown.map((u,i)=>{
          const pt = patients.find(p=>p.id===u.patient_id);
          const isCrit = u.severity==="critical";
          return (
            <div key={u.id} className="card fade-up" style={{ animationDelay:`${i*.05}s`, borderLeft:`4px solid ${isCrit?C.rose:C.jade}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <Avatar name={pt?.full_name||"?"} size={38}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:13.5 }}>{pt?.full_name||"Unknown"}</div>
                  <div style={{ fontSize:11.5, color:C.slateL, display:"flex", alignItems:"center", gap:4, marginTop:2 }}>
                    <Icon name="clipboard" size={11} color={C.slateL}/>
                    {new Date(u.created_at).toLocaleString("en-PH",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}
                  </div>
                </div>
                {isCrit && <span style={{ background:"#FFE4E6", color:C.rose, fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:99 }}>⚠ CRITICAL</span>}
              </div>
              {[
                {key:"blood_pressure",label:"Blood Pressure",icon:"droplet"},
                {key:"heart_rate",label:"Heart Rate",icon:"activity"},
                {key:"temperature",label:"Temperature",icon:"thermometer"},
                {key:"spo2",label:"SpO₂",icon:"wind"},
                {key:"respiratory_rate",label:"Resp. Rate",icon:"wind"},
                {key:"blood_glucose",label:"Blood Glucose",icon:"droplet"},
              ].filter(v=>u[v.key]).map(v=>(
                <div key={v.key} className="vital-row">
                  <span className="vital-label"><Icon name={v.icon} size={13} color={C.slateL}/>{v.label}</span>
                  <span className="vital-val" style={{ color:isCrit&&v.key==="blood_pressure"?C.rose:C.slate }}>{u[v.key]}</span>
                </div>
              ))}
              {u.notes && <div style={{ marginTop:10, padding:"7px 10px", background:isCrit?"#FFF1F2":"#F8FAFC", borderRadius:8, fontSize:12.5, color:C.slateM, lineHeight:1.5 }}>{u.notes}</div>}
            </div>
          );
        })}
        {shown.length===0 && <div style={{ gridColumn:"1/-1" }}><div className="card"><EmptyState icon="activity" message="No health records found."/></div></div>}
      </div>

      <Modal open={showLog} onClose={()=>setShowLog(false)} title="Log Patient Vitals"
        footer={<>
          <button className="btn btn-ghost" onClick={()=>setShowLog(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={logVitals} disabled={saving}>
            {saving?<Spinner color="#fff"/>:<><Icon name="check" size={14}/> Save Vitals</>}
          </button>
        </>}>
        <FG label="Patient *">
          <select value={form.patient_id} onChange={set("patient_id")}>
            <option value="">Select patient…</option>
            {patients.map(p=><option key={p.id} value={p.id}>{p.full_name} — {p.status}</option>)}
          </select>
        </FG>
        <div className="form-row">
          <FG label="Blood Pressure"><input value={form.bp} onChange={set("bp")} placeholder="120/80"/></FG>
          <FG label="Heart Rate"><input value={form.hr} onChange={set("hr")} placeholder="72 bpm"/></FG>
        </div>
        <div className="form-row">
          <FG label="Temperature"><input value={form.temp} onChange={set("temp")} placeholder="36.5°C"/></FG>
          <FG label="SpO₂"><input value={form.spo2} onChange={set("spo2")} placeholder="98%"/></FG>
        </div>
        <div className="form-row">
          <FG label="Respiratory Rate"><input value={form.respiratory_rate} onChange={set("respiratory_rate")} placeholder="18 /min"/></FG>
          <FG label="Blood Glucose"><input value={form.blood_glucose} onChange={set("blood_glucose")} placeholder="5.4 mmol/L"/></FG>
        </div>
        <div className="form-row">
          <FG label="Weight (kg)"><input type="number" step="0.1" value={form.weight_kg} onChange={set("weight_kg")} placeholder="65.0"/></FG>
          <FG label="Severity">
            <select value={form.severity} onChange={set("severity")}>
              <option value="normal">Normal</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </FG>
        </div>
        <FG label="Notes"><textarea rows={3} value={form.notes} onChange={set("notes")} placeholder="Clinical observations…"/></FG>
      </Modal>
    </div>
  );
}

// ── MESSAGING MODULE ─────────────────────────────────────────
function MessagingModule({ messages, setMessages, profile }) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  // Show messages newest-last for chat UX (they come back newest-first)
  const sorted = [...messages].reverse();

  useEffect(()=>{ endRef.current?.scrollIntoView({ behavior:"smooth" }); },[messages]);

  async function send() {
    if (!input.trim()) return;
    setSending(true);
    const created = await sbSendMessage({ sender_id:profile?.id, receiver_id:null, content:input.trim(), channel:"general" });
    if (created) {
      setMessages(prev => [created, ...prev]); // prepend (newest-first)
      setInput("");
    }
    setSending(false);
  }

  const grouped = sorted.reduce((acc,m)=>{
    const day = m.created_at?.split("T")[0]||"today";
    if (!acc[day]) acc[day]=[];
    acc[day].push(m);
    return acc;
  },{});

  return (
    <div className="fade-up">
      <div className="page-header">
        <div><h2 className="page-title">Messages</h2><p className="page-subtitle">Team communication hub</p></div>
      </div>

      <div className="card" style={{ padding:0, overflow:"hidden" }}>
        <div style={{ padding:"14px 18px", borderBottom:"1px solid #F1F5F9", display:"flex", alignItems:"center", gap:11, background:"#fff" }}>
          <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg,${C.jade},${C.jadeD})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Icon name="message" size={17} color="#fff"/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:13.5 }}>CareNest Team Channel</div>
            <div style={{ fontSize:12, color:C.slateL, display:"flex", alignItems:"center", gap:5 }}>
              <div className="online-dot"/> General · {messages.length} messages
            </div>
          </div>
        </div>

        <div className="chat-messages" style={{ height:400 }}>
          {Object.entries(grouped).map(([day,msgs])=>(
            <div key={day}>
              <div style={{ textAlign:"center", margin:"8px 0" }}>
                <span style={{ fontSize:11, color:C.slateXL, background:"#F1F5F9", padding:"2px 9px", borderRadius:99 }}>
                  {day===new Date().toISOString().split("T")[0]?"Today":day}
                </span>
              </div>
              {msgs.map(m=>{
                const isOut = m.sender_id===profile?.id;
                return (
                  <div key={m.id} style={{ display:"flex", flexDirection:"column", alignItems:isOut?"flex-end":"flex-start", marginBottom:4 }}>
                    {!isOut && <span style={{ fontSize:10.5, color:C.slateL, marginLeft:4, marginBottom:2 }}>Team</span>}
                    <div className={`msg-bubble ${isOut?"msg-out":"msg-in"}`}>
                      {m.content}
                      <div className="msg-time">{new Date(m.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          {messages.length===0 && <div style={{ textAlign:"center", color:C.slateL, fontSize:13.5, marginTop:48 }}>No messages yet. Say hello!</div>}
          <div ref={endRef}/>
        </div>

        <div className="chat-input-row">
          <input value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
            placeholder="Type a message… (Enter to send)"
            style={{ borderRadius:11, fontSize:14 }}
          />
          <button className="btn btn-primary" onClick={send} disabled={sending||!input.trim()} style={{ flexShrink:0, borderRadius:11, padding:"10px 14px" }}>
            {sending?<Spinner color="#fff" size={16}/>:<Icon name="send" size={16}/>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── BILLING MODULE ───────────────────────────────────────────
function BillingModule({ billings, setBillings, patients }) {
  const [showAdd, setShowAdd] = useState(false);
  const [showPayModal, setShowPayModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [payMethod, setPayMethod] = useState("cash");
  const [form, setForm] = useState({ patient_id:"", amount:"", description:"", status:"pending", due_date:"", payment_method:"", notes:"" });
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  const totalPaid    = billings.filter(b=>b.status==="paid").reduce((s,b)=>s+Number(b.amount),0);
  const totalPending = billings.filter(b=>b.status==="pending").reduce((s,b)=>s+Number(b.amount),0);
  const totalOverdue = billings.filter(b=>b.status==="overdue").reduce((s,b)=>s+Number(b.amount),0);
  const filtered = billings.filter(b=>filterStatus==="all"||b.status===filterStatus);

  async function addBilling() {
    if (!form.patient_id||!form.amount||!form.description) { toast("Fill required fields","error"); return; }
    setSaving(true);
    const created = await sbAddBilling({ ...form, amount:Number(form.amount) });
    if (created) {
      setBillings(prev => [created, ...prev]);
      toast("Billing record added");
      setShowAdd(false);
      setForm({ patient_id:"", amount:"", description:"", status:"pending", due_date:"", payment_method:"", notes:"" });
    }
    setSaving(false);
  }

  async function markPaid(id) {
    const updated = await sbUpdateBillingStatus(id,"paid",payMethod);
    if (updated) {
      setBillings(prev => prev.map(b => b.id===id ? { ...b, status:"paid", payment_method:payMethod, paid_at:updated.paid_at } : b));
      toast("Marked as paid"); setShowPayModal(null);
    }
  }

  return (
    <div className="fade-up">
      <div className="page-header">
        <div><h2 className="page-title">Billing & Payments</h2><p className="page-subtitle">Track service charges and payment status</p></div>
        <button className="btn btn-primary" style={{ padding:"9px 16px", fontSize:13 }} onClick={()=>setShowAdd(true)}>
          <Icon name="plus" size={14}/> Add Bill
        </button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:22 }}>
        {[
          { label:"Collected",   val:`₱${totalPaid.toLocaleString()}`,    color:C.jade,  bg:"#D1FAE5", icon:"check" },
          { label:"Outstanding", val:`₱${totalPending.toLocaleString()}`, color:C.amber, bg:"#FEF3C7", icon:"alert" },
          { label:"Overdue",     val:`₱${totalOverdue.toLocaleString()}`, color:C.rose,  bg:"#FFE4E6", icon:"creditcard" },
        ].map(s=>(
          <div key={s.label} className="card" style={{ display:"flex", alignItems:"center", gap:12, borderLeft:`3px solid ${s.color}`, padding:"14px 16px" }}>
            <div style={{ width:38, height:38, borderRadius:10, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Icon name={s.icon} size={18} color={s.color}/>
            </div>
            <div>
              <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:s.color, lineHeight:1 }}>{s.val}</div>
              <div style={{ fontSize:11.5, color:C.slateL, marginTop:2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
        {["all","pending","paid","overdue","cancelled"].map(f=>(
          <button key={f} className={`btn ${filterStatus===f?"btn-primary":"btn-ghost"}`}
            style={{ padding:"6px 13px", fontSize:12, borderRadius:99, textTransform:"capitalize" }}
            onClick={()=>setFilterStatus(f)}>
            {f} {f!=="all"&&`(${billings.filter(b=>b.status===f).length})`}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="data-table-wrap" style={{ overflowX:"auto" }}>
          <table className="data-table">
            <thead><tr><th>Patient</th><th>Description</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Payment</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(b=>{
                const pt = patients.find(p=>p.id===b.patient_id);
                return (
                  <tr key={b.id}>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <Avatar name={pt?.full_name||"?"} size={28}/>
                        <span style={{ fontWeight:600, fontSize:13 }}>{pt?.full_name||"Unknown"}</span>
                      </div>
                    </td>
                    <td style={{ color:C.slateM, fontSize:13, maxWidth:160 }}>{b.description}</td>
                    <td><span style={{ fontFamily:"'DM Serif Display',serif", fontSize:16 }}>₱{Number(b.amount).toLocaleString()}</span></td>
                    <td style={{ color:C.slateL, fontSize:12 }}>{b.due_date||b.created_at?.split("T")[0]}</td>
                    <td><Badge status={b.status}/></td>
                    <td>{b.payment_method?<span className="tag" style={{ textTransform:"capitalize" }}>{b.payment_method.replace("_"," ")}</span>:<span style={{ color:C.slateXL, fontSize:12 }}>—</span>}</td>
                    <td>
                      {(b.status==="pending"||b.status==="overdue")
                        ? <button className="btn btn-primary" style={{ padding:"6px 11px", fontSize:12, gap:4 }} onClick={()=>{setShowPayModal(b);setPayMethod("cash");}}>
                            <Icon name="check" size={12}/> Mark Paid
                          </button>
                        : <span style={{ color:C.jade, fontSize:12.5, display:"flex", alignItems:"center", gap:3 }}><Icon name="check" size={13} color={C.jade}/> Settled</span>
                      }
                    </td>
                  </tr>
                );
              })}
              {filtered.length===0 && <tr><td colSpan={7}><EmptyState icon="creditcard" message="No billing records found."/></td></tr>}
            </tbody>
          </table>
        </div>

        <div className="mobile-list">
          {filtered.map((b,i)=>{
            const pt = patients.find(p=>p.id===b.patient_id);
            return (
              <div key={b.id} className="mobile-card" style={{ animationDelay:`${i*.04}s` }}>
                <div className="mobile-card-header">
                  <Avatar name={pt?.full_name||"?"} size={38}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:13.5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{pt?.full_name||"Unknown"}</div>
                    <div style={{ fontSize:12, color:C.slateL, marginTop:2 }}>{b.description}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:18 }}>₱{Number(b.amount).toLocaleString()}</div>
                    <Badge status={b.status}/>
                  </div>
                </div>
                {(b.status==="pending"||b.status==="overdue") && (
                  <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center", padding:"9px", fontSize:13 }}
                    onClick={()=>{setShowPayModal(b);setPayMethod("cash");}}>
                    <Icon name="check" size={14}/> Mark as Paid
                  </button>
                )}
              </div>
            );
          })}
          {filtered.length===0 && <EmptyState icon="creditcard" message="No billing records found."/>}
        </div>
      </div>

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Add Billing Record"
        footer={<>
          <button className="btn btn-ghost" onClick={()=>setShowAdd(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={addBilling} disabled={saving}>
            {saving?<Spinner color="#fff"/>:<><Icon name="check" size={14}/> Save</>}
          </button>
        </>}>
        <FG label="Patient *">
          <select value={form.patient_id} onChange={set("patient_id")}>
            <option value="">Select patient…</option>
            {patients.map(p=><option key={p.id} value={p.id}>{p.full_name}</option>)}
          </select>
        </FG>
        <FG label="Description *"><input value={form.description} onChange={set("description")} placeholder="Service description"/></FG>
        <div className="form-row">
          <FG label="Amount (₱) *"><input type="number" value={form.amount} onChange={set("amount")} placeholder="0.00"/></FG>
          <FG label="Due Date"><input type="date" value={form.due_date} onChange={set("due_date")}/></FG>
        </div>
        <div className="form-row">
          <FG label="Status">
            <select value={form.status} onChange={set("status")}>
              <option value="pending">Pending</option><option value="paid">Paid</option><option value="overdue">Overdue</option>
            </select>
          </FG>
          <FG label="Payment Method">
            <select value={form.payment_method} onChange={set("payment_method")}>
              <option value="">Select…</option>
              {["cash","gcash","maya","bank_transfer","insurance","other"].map(m=><option key={m} value={m}>{m.replace("_"," ").toUpperCase()}</option>)}
            </select>
          </FG>
        </div>
        <FG label="Notes"><textarea rows={2} value={form.notes} onChange={set("notes")} placeholder="Additional notes…"/></FG>
      </Modal>

      <Modal open={!!showPayModal} onClose={()=>setShowPayModal(null)} title="Record Payment"
        footer={<>
          <button className="btn btn-ghost" onClick={()=>setShowPayModal(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>markPaid(showPayModal?.id)}>
            <Icon name="check" size={14}/> Confirm Payment
          </button>
        </>}>
        {showPayModal && (
          <div>
            <div style={{ background:"#F8FAFC", borderRadius:12, padding:16, marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                <span style={{ color:C.slateL, fontSize:13 }}>Patient</span>
                <span style={{ fontWeight:600 }}>{patients.find(p=>p.id===showPayModal.patient_id)?.full_name||"—"}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                <span style={{ color:C.slateL, fontSize:13 }}>Description</span>
                <span style={{ fontWeight:500, fontSize:13 }}>{showPayModal.description}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ color:C.slateL, fontSize:13 }}>Amount</span>
                <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:C.jade }}>₱{Number(showPayModal.amount).toLocaleString()}</span>
              </div>
            </div>
            <FG label="Payment Method *">
              <select value={payMethod} onChange={e=>setPayMethod(e.target.value)}>
                {["cash","gcash","maya","bank_transfer","insurance","other"].map(m=><option key={m} value={m}>{m.replace("_"," ").toUpperCase()}</option>)}
              </select>
            </FG>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ── REPORTS MODULE ───────────────────────────────────────────
function ReportsModule({ patients, appointments, billings, healthUpdates }) {
  const totalBilled = billings.reduce((s,b)=>s+Number(b.amount),0);
  const totalPaid   = billings.filter(b=>b.status==="paid").reduce((s,b)=>s+Number(b.amount),0);

  const summaryStats = [
    { label:"Total Patients",     val:patients.length,                                                  color:C.jade },
    { label:"Active",             val:patients.filter(p=>p.status==="active").length,                   color:C.jade },
    { label:"Critical",           val:patients.filter(p=>p.status==="critical").length,                 color:C.rose },
    { label:"Stable",             val:patients.filter(p=>p.status==="stable").length,                   color:C.sky  },
    { label:"Total Appointments", val:appointments.length,                                              color:C.violet },
    { label:"Completed",          val:appointments.filter(a=>a.status==="completed").length,            color:C.jade  },
    { label:"Health Records",     val:healthUpdates.length,                                             color:C.amber },
    { label:"Critical Vitals",    val:healthUpdates.filter(h=>h.severity==="critical").length,          color:C.rose  },
    { label:"Total Billed",       val:`₱${totalBilled.toLocaleString()}`,                              color:C.amber },
    { label:"Collected",          val:`₱${totalPaid.toLocaleString()}`,                                color:C.jade  },
    { label:"Outstanding",        val:`₱${(totalBilled-totalPaid).toLocaleString()}`,                  color:C.rose  },
    { label:"Collection Rate",    val:totalBilled>0?`${Math.round(totalPaid/totalBilled*100)}%`:"0%",  color:C.jade  },
  ];

  const diagCounts = patients.reduce((acc,p)=>{ acc[p.diagnosis]=(acc[p.diagnosis]||0)+1; return acc; },{});
  const maxDiag = Math.max(...Object.values(diagCounts),1);

  return (
    <div className="fade-up">
      <div className="page-header">
        <div><h2 className="page-title">Reports & Analytics</h2><p className="page-subtitle">System-wide insights and summaries</p></div>
        <button className="btn btn-ghost" onClick={()=>window.print()} style={{ gap:7, padding:"9px 14px", fontSize:13 }}>
          <Icon name="printer" size={14}/> Print
        </button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        {summaryStats.map((s,i)=>(
          <div key={i} className="report-stat fade-up" style={{ animationDelay:`${i*.04}s`, borderTop:`2.5px solid ${s.color}` }}>
            <div className="report-stat-val" style={{ color:s.color }}>{s.val}</div>
            <div className="report-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="content-grid">
        <div className="card">
          <h3 className="section-title" style={{ marginBottom:18 }}>Diagnosis Breakdown</h3>
          {Object.keys(diagCounts).length===0
            ? <EmptyState icon="barchart" message="No patient data."/>
            : Object.entries(diagCounts).sort((a,b)=>b[1]-a[1]).map(([diag,cnt])=>(
              <div key={diag} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:5 }}>
                  <span style={{ fontWeight:500 }}>{diag}</span>
                  <span style={{ color:C.slateL, fontSize:12 }}>{cnt} patient{cnt!==1?"s":""}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ background:`linear-gradient(90deg,${C.jade},${C.jadeD})`, width:`${(cnt/maxDiag)*100}%` }}/>
                </div>
              </div>
            ))
          }
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div className="card">
            <h3 className="section-title" style={{ marginBottom:14 }}>Patient Status</h3>
            {[["active",C.jade,"Active"],["stable",C.sky,"Stable"],["critical",C.rose,"Critical"],["discharged",C.slateL,"Discharged"]].map(([s,col,lbl])=>{
              const cnt=patients.filter(p=>p.status===s).length;
              const pct=patients.length>0?Math.round(cnt/patients.length*100):0;
              return (
                <div key={s} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:"1px solid #F8FAFC" }}>
                  <div style={{ width:9, height:9, borderRadius:"50%", background:col, boxShadow:`0 0 0 3px ${col}22`, flexShrink:0 }}/>
                  <span style={{ flex:1, fontWeight:500, fontSize:13.5 }}>{lbl}</span>
                  <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:col }}>{cnt}</span>
                  <span style={{ fontSize:11, color:C.slateXL, width:30, textAlign:"right" }}>{pct}%</span>
                </div>
              );
            })}
          </div>

          <div className="card" style={{ background:"linear-gradient(135deg,var(--onyx),var(--pine))", border:"none", color:"#fff" }}>
            <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:15, marginBottom:14, color:"#fff" }}>Billing Performance</h3>
            <div style={{ marginBottom:11 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5, color:"rgba(148,163,184,.7)" }}>
                <span>Collection Rate</span>
                <span style={{ color:C.jade, fontWeight:700 }}>{totalBilled>0?`${Math.round(totalPaid/totalBilled*100)}%`:"0%"}</span>
              </div>
              <div className="progress-track" style={{ background:"rgba(255,255,255,.1)" }}>
                <div className="progress-fill" style={{ background:`linear-gradient(90deg,${C.jade},#34D399)`, width:totalBilled>0?`${(totalPaid/totalBilled)*100}%`:"0%" }}/>
              </div>
            </div>
            {[{label:"Total Billed",val:totalBilled,color:"#fff"},{label:"Collected",val:totalPaid,color:C.jade},{label:"Remaining",val:totalBilled-totalPaid,color:C.amber}].map(r=>(
              <div key={r.label} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid rgba(255,255,255,.06)" }}>
                <span style={{ fontSize:12.5, color:"rgba(148,163,184,.6)" }}>{r.label}</span>
                <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:17, color:r.color }}>₱{Number(r.val).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SETTINGS MODULE ──────────────────────────────────────────
function SettingsModule({ profile, setProfile, onLogout }) {
  const [form, setForm] = useState({ full_name:profile?.full_name||"", email:profile?.email||"", phone:profile?.phone||"", address:profile?.address||"" });
  const [saving, setSaving] = useState(false);
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  async function save() {
    setSaving(true);
    const ok = await sbUpdateProfile(profile?.id, { full_name:form.full_name, phone:form.phone, address:form.address });
    if (ok) { setProfile(p=>({...p, full_name:form.full_name, phone:form.phone, address:form.address})); toast("Profile updated"); }
    else toast("Failed to update","error");
    setSaving(false);
  }

  return (
    <div className="fade-up">
      <div className="page-header">
        <div><h2 className="page-title">Settings</h2><p className="page-subtitle">Manage your profile and account</p></div>
      </div>

      <div style={{ maxWidth:600 }}>
        <div className="profile-hero">
          <div style={{ display:"flex", alignItems:"center", gap:16, position:"relative", zIndex:1 }}>
            <div style={{ position:"relative" }}>
              <Avatar name={form.full_name} size={64} src={profile?.avatar_url}/>
              <div style={{ position:"absolute", bottom:0, right:0, width:18, height:18, borderRadius:"50%", background:C.jade, border:"2.5px solid white", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div className="online-dot" style={{ width:6, height:6 }}/>
              </div>
            </div>
            <div>
              <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:"#fff", marginBottom:4 }}>{form.full_name}</div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <Badge status={profile?.role||"caregiver"}/>
                <span style={{ fontSize:12, color:"rgba(148,163,184,.7)" }}>{form.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom:14 }}>
          <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:16, marginBottom:18 }}>Profile Information</h3>
          <div className="form-row">
            <FG label="Full Name"><input value={form.full_name} onChange={set("full_name")}/></FG>
            <FG label="Email (read-only)"><input value={form.email} disabled style={{ opacity:.6, cursor:"not-allowed" }}/></FG>
          </div>
          <div className="form-row">
            <FG label="Phone">
              <div className="input-icon-wrap">
                <span className="input-icon"><Icon name="phone" size={13}/></span>
                <input value={form.phone} onChange={set("phone")} placeholder="+63 9XX XXX XXXX" style={{ paddingLeft:36 }}/>
              </div>
            </FG>
            <FG label="Address">
              <div className="input-icon-wrap">
                <span className="input-icon"><Icon name="mappin" size={13}/></span>
                <input value={form.address} onChange={set("address")} placeholder="City, Province" style={{ paddingLeft:36 }}/>
              </div>
            </FG>
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <button className="btn btn-primary" onClick={save} disabled={saving}>
              {saving?<Spinner color="#fff"/>:<><Icon name="check" size={14}/> Save Changes</>}
            </button>
            <label style={{ cursor:"pointer" }}>
              <input type="file" accept="image/*" style={{ display:"none" }} onChange={async e=>{
                const f=e.target.files?.[0]; if (!f) return;
                const url = await sbUploadProfileImage(f,profile.id);
                if (!url) { toast("Upload failed","error"); return; }
                const ok = await sbUpdateProfile(profile.id,{avatar_url:url});
                if (ok) { setProfile(p=>({...p,avatar_url:url})); toast("Profile picture updated"); }
              }}/>
              <span className="btn btn-ghost" style={{ display:"inline-flex", alignItems:"center", gap:7 }}>
                <Icon name="plus" size={13}/> Upload Photo
              </span>
            </label>
          </div>
        </div>

        <div className="card" style={{ marginBottom:14 }}>
          <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:16, marginBottom:14 }}>Account Details</h3>
          {[
            { label:"Role", val:profile?.role||"caregiver", render:v=><Badge status={v}/> },
            { label:"Account ID", val:profile?.id||"—", render:v=><code style={{ fontSize:11, background:"#F1F5F9", padding:"2px 7px", borderRadius:5 }}>{v?.slice(0,18)}…</code> },
            { label:"Platform", val:"Supabase + RLS Secured" },
          ].map(r=>(
            <div key={r.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #F8FAFC" }}>
              <span style={{ fontSize:13.5, color:C.slateL }}>{r.label}</span>
              {r.render?r.render(r.val):<span style={{ fontWeight:500, fontSize:13.5 }}>{r.val}</span>}
            </div>
          ))}
        </div>

        <div className="card" style={{ borderLeft:`3px solid ${C.rose}` }}>
          <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:15, marginBottom:5, color:C.rose }}>Sign Out</h3>
          <p style={{ fontSize:13, color:C.slateL, marginBottom:14 }}>This will end your current session securely.</p>
          <button className="btn btn-danger" onClick={onLogout}><Icon name="logout" size={14}/> Sign Out</button>
        </div>
      </div>
    </div>
  );
}

// ── TOAST MANAGER ────────────────────────────────────────────
function ToastManager() {
  const [toasts, setToasts] = useState([]);
  _toastFn = useCallback((msg,type="success")=>{
    const id = Date.now();
    setToasts(t=>[...t,{id,msg,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3500);
  },[]);
  return (
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

// ── NAV CONFIG ───────────────────────────────────────────────
const NAV = [
  { id:"dashboard",    icon:"home",       label:"Dashboard",  section:"main" },
  { id:"patients",     icon:"users",      label:"Patients",   section:"main" },
  { id:"appointments", icon:"calendar",   label:"Schedule",   section:"main" },
  { id:"health",       icon:"heart",      label:"Health",     section:"main" },
  { id:"messages",     icon:"message",    label:"Messages",   section:"main" },
  { id:"billing",      icon:"creditcard", label:"Billing",    section:"finance" },
  { id:"reports",      icon:"barchart",   label:"Reports",    section:"finance" },
  { id:"settings",     icon:"settings",   label:"Settings",   section:"account" },
];
const BOTTOM_NAV = ["dashboard","patients","appointments","health","messages"];

// ── ROOT APP ─────────────────────────────────────────────────
export default function App() {
  const [profile,       setProfile]       = useState(null);
  const [authChecked,   setAuthChecked]   = useState(false);
  const [active,        setActive]        = useState(()=>{
    try { return localStorage.getItem("cnActive")||"dashboard"; } catch { return "dashboard"; }
  });
  const [patients,      setPatients]      = useState([]);
  const [appointments,  setAppointments]  = useState([]);
  const [caregivers,    setCaregivers]    = useState([]);
  const [messages,      setMessages]      = useState([]);
  const [healthUpdates, setHealthUpdates] = useState([]);
  const [billings,      setBillings]      = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dataLoaded,    setDataLoaded]    = useState(false);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const loadingRef = useRef(false);

  // Inject CSS once
  useEffect(()=>{
    if (!document.getElementById("cn-css3")) {
      const s = document.createElement("style");
      s.id="cn-css3"; s.textContent=CSS;
      document.head.appendChild(s);
    }
  },[]);

  const loadAllData = useCallback(async (uid) => {
  if (loadingRef.current) return;
  loadingRef.current = true;
  try {
    // ── Wave 1: critical for initial render (max 4 concurrent) ──
    const [p, a, cgs, n] = await Promise.all([
      sbGetPatients(),
      sbGetAppointments(),
      sbGetCaregivers(),
      sbGetNotifications(uid),
    ]);
    setPatients(p);
    setAppointments(a);
    setCaregivers(cgs);
    setNotifications(n);
    setDataLoaded(true); // ← skeleton disappears here, UI is usable

    // ── Wave 2: secondary, loads silently in background ──
    const [m, h, b] = await Promise.all([
      sbGetMessages(uid),
      sbGetHealthUpdates(),
      sbGetBillings(),
    ]);
    setMessages(m);
    setHealthUpdates(h);
    setBillings(b);
  } catch (e) {
    console.error("Data load error:", e);
    toast("Some data failed to load", "error");
  } finally {
    loadingRef.current = false;
  }
}, []);

  // ── Auth — check session once, fast ─────────────────────
  useEffect(()=>{
    let mounted = true;
    (async()=>{
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user && mounted) {
          const prof = await sbGetProfile(data.session.user.id);
          if (prof && mounted) {
            const fullProfile = { ...prof, email: data.session.user.email };
            setProfile(fullProfile);
            // Start data load in background immediately
            loadAllData(data.session.user.id);
          }
        }
      } catch (e) { console.error("auth restore", e.message); }
      if (mounted) setAuthChecked(true);
    })();

    const { data: subData } = supabase.auth.onAuthStateChange(async(event, sess)=>{
      try {
        if (event==="SIGNED_IN" && sess?.user) {
          const prof = await sbGetProfile(sess.user.id);
          if (prof) {
            setProfile({ ...prof, email: sess.user.email });
            loadAllData(sess.user.id);
          }
        } else if (event==="SIGNED_OUT") {
          setProfile(null); setDataLoaded(false); loadingRef.current = false;
          setPatients([]); setAppointments([]); setMessages([]);
          setHealthUpdates([]); setBillings([]); setNotifications([]);
        }
      } catch (e) { console.error("auth change", e); }
    });

    return ()=>{ mounted=false; try{subData?.subscription?.unsubscribe();}catch(_){} };
  }, []);

  // ── Smart realtime — only prepend/patch, never full-refetch ──
  useEffect(()=>{
    if (!profile?.id) return;
    const uid = profile.id;

    const ch = supabase.channel("cn-live3")
      // Messages: prepend new ones
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"messages"}, ({new:row})=>{
        setMessages(prev => {
          if (prev.find(m=>m.id===row.id)) return prev;
          return [row, ...prev];
        });
      })
      // Health updates: prepend
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"health_updates"}, ({new:row})=>{
        setHealthUpdates(prev => {
          if (prev.find(h=>h.id===row.id)) return prev;
          return [row, ...prev];
        });
      })
      // Notifications: prepend
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"notifications"}, ({new:row})=>{
        if (row.user_id !== uid) return;
        setNotifications(prev => {
          if (prev.find(n=>n.id===row.id)) return prev;
          return [row, ...prev];
        });
      })
      // Patients: upsert or remove
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"patients"}, ({new:row})=>{
        setPatients(prev => prev.find(p=>p.id===row.id) ? prev : [row, ...prev]);
      })
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"patients"}, ({new:row})=>{
        setPatients(prev => prev.map(p => p.id===row.id ? {...p,...row} : p));
      })
      .on("postgres_changes",{event:"DELETE",schema:"public",table:"patients"}, ({old:row})=>{
        setPatients(prev => prev.filter(p => p.id!==row.id));
      })
      // Appointments: upsert or remove
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"appointments"}, ({new:row})=>{
        setAppointments(prev => prev.find(a=>a.id===row.id) ? prev : [row, ...prev]);
      })
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"appointments"}, ({new:row})=>{
        setAppointments(prev => prev.map(a => a.id===row.id ? {...a,...row} : a));
      })
      .on("postgres_changes",{event:"DELETE",schema:"public",table:"appointments"}, ({old:row})=>{
        setAppointments(prev => prev.filter(a => a.id!==row.id));
      })
      // Billings: upsert or remove
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"billings"}, ({new:row})=>{
        setBillings(prev => prev.find(b=>b.id===row.id) ? prev : [row, ...prev]);
      })
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"billings"}, ({new:row})=>{
        setBillings(prev => prev.map(b => b.id===row.id ? {...b,...row} : b));
      })
      .subscribe();

    return ()=>supabase.removeChannel(ch);
  }, [profile?.id]);

  function handleLogout() {
    supabase.auth.signOut();
    setProfile(null); setDataLoaded(false); loadingRef.current = false;
    setPatients([]); setAppointments([]); setMessages([]);
    setHealthUpdates([]); setBillings([]); setNotifications([]);
    toast("Signed out successfully");
  }

  function navigate(id) {
    setActive(id);
    try { localStorage.setItem("cnActive",id); } catch {}
    setSidebarOpen(false);
  }

  // Show auth screen once we know auth state
  if (!authChecked) {
    return (
      <>
        <style>{CSS}</style>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", flexDirection:"column", gap:16, background:C.cream }}>
          <div style={{ width:50, height:50, borderRadius:15, background:"linear-gradient(135deg,#CCFBF1,#A7F3D0)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="heart" size={22} color={C.jade}/>
          </div>
          <Spinner size={22}/>
        </div>
        <ToastManager/>
      </>
    );
  }

  if (!profile) return (<><AuthScreen onLogin={p=>{ setProfile(p); loadAllData(p.id); }}/><ToastManager/></>);

  const shared = {
    patients, setPatients, appointments, setAppointments,
    messages, setMessages, healthUpdates, setHealthUpdates,
    billings, setBillings, notifications, setNotifications,
    profile, caregivers, setCaregivers,
  };

  const screens = {
    dashboard:    <Dashboard    {...shared} onNav={navigate}/>,
    patients:     <PatientsModule {...shared} setAppointments={setAppointments}/>,
    appointments: <AppointmentsModule {...shared}/>,
    health:       <HealthModule  {...shared}/>,
    messages:     <MessagingModule {...shared}/>,
    billing:      <BillingModule  {...shared}/>,
    reports:      <ReportsModule  {...shared}/>,
    settings:     <SettingsModule profile={profile} setProfile={setProfile} onLogout={handleLogout}/>,
  };

  const sections = ["main","finance","account"];
  const sectionLabels = { main:"",finance:"Finance",account:"Account" };
  const unread = notifications.filter(n=>!n.is_read).length;

  return (
    <>
      <header className="mobile-header">
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <button onClick={()=>setSidebarOpen(v=>!v)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(148,163,184,.8)", display:"flex", padding:6, borderRadius:8 }}>
            <Icon name="menu" size={20}/>
          </button>
          <div className="sidebar-logo-icon" style={{ width:30, height:30, borderRadius:8 }}>
            <Icon name="heart" size={14} color="#fff"/>
          </div>
          <span style={{ fontFamily:"'DM Serif Display',serif", color:"#fff", fontSize:17, letterSpacing:"-.2px" }}>CareNest</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {unread>0 && (
            <div style={{ background:C.rose, color:"#fff", borderRadius:99, fontSize:10, fontWeight:700, padding:"2px 7px", minWidth:20, textAlign:"center" }}>{unread}</div>
          )}
          <Avatar name={profile?.full_name||"U"} size={30} src={profile?.avatar_url}/>
        </div>
      </header>

      <div className={`sidebar-overlay ${sidebarOpen?"open":""}`} onClick={()=>setSidebarOpen(false)}/>

      <nav className={`sidebar ${sidebarOpen?"open":""}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">
            <div className="sidebar-logo-icon"><Icon name="heart" size={17} color="#fff"/></div>
            <h1>CareNest</h1>
          </div>
          <p>Caregiving Platform</p>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"6px 0" }}>
          {sections.map(sec=>{
            const items = NAV.filter(n=>n.section===sec);
            return (
              <div key={sec}>
                {sectionLabels[sec] && <div className="nav-section-label">{sectionLabels[sec]}</div>}
                {items
                  .filter(n=>!(profile?.role==="patient"&&n.id==="patients"))
                  .map(n=>(
                    <div key={n.id} className={`nav-item ${active===n.id?"active":""}`} onClick={()=>navigate(n.id)}>
                      <Icon name={n.icon} size={15} color={active===n.id?"#fff":"rgba(148,163,184,.7)"}/>
                      <span style={{ flex:1 }}>{n.label}</span>
                      {n.id==="messages"&&unread>0&&(
                        <span style={{ background:C.rose, color:"#fff", borderRadius:99, fontSize:10, fontWeight:700, padding:"1px 6px", minWidth:18, textAlign:"center" }}>{unread}</span>
                      )}
                    </div>
                  ))}
              </div>
            );
          })}
        </div>

        <div style={{ padding:"12px 14px", borderTop:"1px solid rgba(255,255,255,.06)", display:"flex", alignItems:"center", gap:9 }}>
          <Avatar name={profile?.full_name||"User"} size={32} src={profile?.avatar_url}/>
          <div style={{ overflow:"hidden", flex:1 }}>
            <div style={{ color:"#fff", fontWeight:600, fontSize:12.5, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{profile?.full_name||"User"}</div>
            <div style={{ color:"rgba(100,116,139,.8)", fontSize:10.5, textTransform:"capitalize" }}>{profile?.role||"member"}</div>
          </div>
          <button onClick={handleLogout} title="Sign out"
            style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(100,116,139,.7)", display:"flex", padding:6, borderRadius:7, transition:"all .15s" }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.08)";e.currentTarget.style.color="#fff"}}
            onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color="rgba(100,116,139,.7)"}}>
            <Icon name="logout" size={14}/>
          </button>
        </div>
      </nav>

      <main className="main-area">
        {!dataLoaded ? (
          <div style={{ padding:"32px 36px" }}>
            {/* Show skeleton immediately instead of blank spinner screen */}
            <div style={{ marginBottom:28 }}>
              <div className="skeleton" style={{ height:14, width:200, marginBottom:10 }}/>
              <div className="skeleton" style={{ height:28, width:280, marginBottom:8 }}/>
              <div className="skeleton" style={{ height:14, width:220 }}/>
            </div>
            <div className="stats-grid" style={{ marginBottom:28 }}>
              {[0,1,2,3].map(i=>(
                <div key={i} className="stat-card">
                  <div className="skeleton" style={{ width:40, height:40, borderRadius:11, marginBottom:12 }}/>
                  <div className="skeleton" style={{ height:28, width:"60%", marginBottom:6 }}/>
                  <div className="skeleton" style={{ height:13, width:"80%" }}/>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="skeleton" style={{ height:18, width:180, marginBottom:20 }}/>
              <SkeletonRows rows={5}/>
            </div>
          </div>
        ) : (
          <div className="page-wrap">{screens[active]}</div>
        )}
      </main>

      <nav className="bottom-nav">
        {BOTTOM_NAV.map(id=>{
          const n = NAV.find(x=>x.id===id);
          if (!n) return null;
          const isActive = active===id;
          return (
            <div key={id} className={`bottom-nav-item ${isActive?"active":""}`} onClick={()=>navigate(id)}>
              {n.id==="messages"&&unread>0 && (
                <span style={{ position:"absolute", top:5, right:"calc(50% - 14px)", background:C.rose, color:"#fff", borderRadius:99, fontSize:8, fontWeight:700, padding:"1px 4px", minWidth:14, textAlign:"center" }}>{unread}</span>
              )}
              <Icon name={n.icon} size={20} color={isActive?C.jade:"rgba(148,163,184,.55)"}/>
              <span style={{ color:isActive?C.jade:"rgba(148,163,184,.55)" }}>{n.label}</span>
            </div>
          );
        })}
        <div className={`bottom-nav-item ${["billing","reports","settings"].includes(active)?"active":""}`}
          onClick={()=>setSidebarOpen(true)}>
          <Icon name="menu" size={20} color={["billing","reports","settings"].includes(active)?C.jade:"rgba(148,163,184,.55)"}/>
          <span style={{ color:["billing","reports","settings"].includes(active)?C.jade:"rgba(148,163,184,.55)" }}>More</span>
        </div>
      </nav>

      <ToastManager/>
    </>
  );
}