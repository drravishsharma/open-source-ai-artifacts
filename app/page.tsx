use client
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SNCU Graduate Follow-Up System — BRD Medical College</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
<style>
:root {
  --teal:       #1A6B6B;
  --teal-mid:   #2E8B8B;
  --teal-light: #E6F4F4;
  --teal-dark:  #0D4444;
  --red:        #922B21;
  --red-light:  #FDF2F2;
  --amber:      #D97706;
  --amber-light:#FFFBEB;
  --green:      #166534;
  --green-light:#F0FDF4;
  --slate:      #1E293B;
  --slate-mid:  #475569;
  --slate-light:#F8FAFC;
  --border:     #E2E8F0;
  --white:      #FFFFFF;
  --shadow-sm:  0 1px 3px rgba(0,0,0,.08);
  --shadow-md:  0 4px 16px rgba(0,0,0,.10);
  --shadow-lg:  0 8px 32px rgba(0,0,0,.13);
  --radius:     10px;
  --radius-lg:  16px;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:14px;scroll-behavior:smooth}
body{
  font-family:'DM Sans',sans-serif;
  background:#F0F5F5;
  color:var(--slate);
  min-height:100vh;
}

/* ─── TOP NAV ─────────────────────────────────────────────── */
.topnav{
  background:var(--teal-dark);
  color:#fff;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 24px;
  height:56px;
  position:sticky;top:0;z-index:100;
  box-shadow:0 2px 12px rgba(0,0,0,.25);
}
.topnav-brand{display:flex;align-items:center;gap:12px}
.topnav-brand .logo{
  width:34px;height:34px;border-radius:8px;
  background:var(--teal-mid);
  display:flex;align-items:center;justify-content:center;
  font-size:18px;font-weight:700;
}
.topnav-brand h1{font-size:1rem;font-weight:600;letter-spacing:.01em;line-height:1.2}
.topnav-brand small{font-size:.72rem;color:#B2DFDB;font-weight:400}
.topnav-right{display:flex;align-items:center;gap:10px}
.api-input-wrap{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,.1);border-radius:7px;padding:4px 10px}
.api-input-wrap label{font-size:.72rem;color:#B2DFDB;white-space:nowrap}
.api-input-wrap input{
  background:transparent;border:none;outline:none;color:#fff;
  font-size:.78rem;font-family:inherit;width:210px;
  placeholder-color:#B2DFDB;
}
.api-input-wrap input::placeholder{color:#B2DFDB}

/* ─── TAB BAR ─────────────────────────────────────────────── */
.tabbar{
  background:var(--teal);
  display:flex;gap:0;
  padding:0 24px;
  border-bottom:3px solid var(--teal-dark);
}
.tabbar button{
  background:transparent;border:none;cursor:pointer;
  color:rgba(255,255,255,.65);font-family:inherit;font-size:.82rem;font-weight:500;
  padding:12px 20px;position:relative;transition:color .2s;letter-spacing:.02em;
}
.tabbar button.active{color:#fff;font-weight:600}
.tabbar button.active::after{
  content:'';position:absolute;bottom:-3px;left:0;right:0;height:3px;
  background:#4DD0E1;border-radius:2px 2px 0 0;
}
.tabbar button:hover:not(.active){color:rgba(255,255,255,.85)}

/* ─── MAIN LAYOUT ─────────────────────────────────────────── */
.main{max-width:1280px;margin:0 auto;padding:24px 24px 40px}
.tab-panel{display:none}
.tab-panel.active{display:block}

/* ─── CARDS ───────────────────────────────────────────────── */
.card{
  background:var(--white);border-radius:var(--radius-lg);
  box-shadow:var(--shadow-sm);border:1px solid var(--border);
  overflow:hidden;
}
.card-header{
  padding:14px 20px;
  background:linear-gradient(135deg,var(--teal) 0%,var(--teal-mid) 100%);
  color:#fff;display:flex;align-items:center;gap:10px;
}
.card-header h2{font-size:.95rem;font-weight:600;letter-spacing:.02em}
.card-header .badge{
  background:rgba(255,255,255,.2);
  border-radius:20px;padding:2px 10px;font-size:.72rem;font-weight:500;
}
.card-body{padding:20px}

/* ─── FORM GRID ───────────────────────────────────────────── */
.section-label{
  font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
  color:var(--teal);margin:20px 0 10px;
  display:flex;align-items:center;gap:8px;
}
.section-label::after{content:'';flex:1;height:1px;background:var(--teal-light)}
.form-grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(180px,1fr))}
.form-grid.cols-3{grid-template-columns:repeat(3,1fr)}
.form-grid.cols-4{grid-template-columns:repeat(4,1fr)}
.form-grid.cols-6{grid-template-columns:repeat(6,1fr)}
.form-group{display:flex;flex-direction:column;gap:4px}
.form-group.span-2{grid-column:span 2}
.form-group.span-3{grid-column:span 3}
.form-group.span-full{grid-column:1/-1}
label.field-label{
  font-size:.7rem;font-weight:600;color:var(--slate-mid);
  letter-spacing:.04em;text-transform:uppercase;
}
.req{color:var(--red);margin-left:1px}
input[type=text],input[type=number],input[type=date],select,textarea{
  border:1.5px solid var(--border);border-radius:7px;
  padding:7px 10px;font-family:inherit;font-size:.82rem;color:var(--slate);
  background:#FAFCFC;transition:border-color .15s,box-shadow .15s;outline:none;width:100%;
}
input:focus,select:focus,textarea:focus{
  border-color:var(--teal-mid);box-shadow:0 0 0 3px rgba(46,139,139,.12);
  background:#fff;
}
select{cursor:pointer;appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231A6B6B' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 10px center;
  padding-right:28px;
}
textarea{resize:vertical;min-height:60px}
.computed{background:var(--teal-light)!important;color:var(--teal-dark)!important;font-family:'DM Mono',monospace;font-size:.78rem;font-weight:500}

/* checkbox groups */
.check-group{display:flex;flex-wrap:wrap;gap:6px 12px;margin-top:4px}
.check-item{display:flex;align-items:center;gap:5px;cursor:pointer;font-size:.78rem;color:var(--slate)}
.check-item input[type=checkbox]{
  width:14px;height:14px;accent-color:var(--teal);cursor:pointer;flex-shrink:0;
}

/* status badges */
.status-pill{
  display:inline-flex;align-items:center;gap:4px;
  border-radius:20px;padding:3px 10px;font-size:.72rem;font-weight:600;
}
.pill-sam{background:#FEE2E2;color:#991B1B}
.pill-mam{background:#FEF9C3;color:#854D0E}
.pill-normal{background:#DCFCE7;color:#166534}
.pill-subopt{background:#FFEDD5;color:#9A3412}
.pill-loss{background:#FEE2E2;color:#991B1B}
.pill-nrc{background:#EDE9FE;color:#5B21B6}

/* ─── BUTTONS ─────────────────────────────────────────────── */
.btn{
  display:inline-flex;align-items:center;gap:7px;
  border:none;border-radius:8px;cursor:pointer;font-family:inherit;
  font-weight:600;letter-spacing:.02em;transition:all .15s;white-space:nowrap;
}
.btn-primary{background:var(--teal);color:#fff;padding:10px 22px;font-size:.85rem}
.btn-primary:hover{background:var(--teal-mid);transform:translateY(-1px);box-shadow:var(--shadow-md)}
.btn-secondary{background:var(--teal-light);color:var(--teal);padding:9px 18px;font-size:.82rem;border:1.5px solid rgba(26,107,107,.2)}
.btn-secondary:hover{background:#d0eded}
.btn-danger{background:#FEE2E2;color:var(--red);padding:7px 14px;font-size:.78rem;border:1.5px solid #FECACA}
.btn-danger:hover{background:#FECACA}
.btn-ai{background:linear-gradient(135deg,#7C3AED,#4F46E5);color:#fff;padding:10px 20px;font-size:.85rem}
.btn-ai:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 4px 14px rgba(124,58,237,.35)}
.btn-sm{padding:6px 12px;font-size:.75rem}
.actions-bar{display:flex;gap:10px;justify-content:flex-end;margin-top:22px;flex-wrap:wrap;align-items:center}

/* ─── DASHBOARD KPIs ──────────────────────────────────────── */
.kpi-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px;margin-bottom:24px}
.kpi-card{
  background:var(--white);border-radius:var(--radius-lg);
  border:1px solid var(--border);padding:16px 18px;
  box-shadow:var(--shadow-sm);position:relative;overflow:hidden;
}
.kpi-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:var(--kpi-color,var(--teal));
}
.kpi-icon{font-size:1.3rem;margin-bottom:8px}
.kpi-value{font-size:2rem;font-weight:700;color:var(--kpi-color,var(--teal));line-height:1;font-family:'Playfair Display',serif}
.kpi-label{font-size:.72rem;color:var(--slate-mid);font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-top:4px}
.kpi-sub{font-size:.68rem;color:#94A3B8;margin-top:2px}

/* ─── CHARTS ──────────────────────────────────────────────── */
.charts-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:24px}
.chart-card{background:var(--white);border-radius:var(--radius-lg);border:1px solid var(--border);padding:18px;box-shadow:var(--shadow-sm)}
.chart-title{font-size:.8rem;font-weight:700;color:var(--slate);text-transform:uppercase;letter-spacing:.06em;margin-bottom:16px;display:flex;align-items:center;gap:6px}
canvas{width:100%!important}

/* ─── TABLE ───────────────────────────────────────────────── */
.table-wrap{overflow-x:auto;border-radius:var(--radius);border:1px solid var(--border)}
table{width:100%;border-collapse:collapse;font-size:.78rem}
thead th{
  background:var(--teal-dark);color:#fff;padding:10px 12px;text-align:left;
  font-weight:600;letter-spacing:.04em;font-size:.7rem;text-transform:uppercase;
  white-space:nowrap;position:sticky;top:0;z-index:10;
}
tbody tr{border-bottom:1px solid var(--border);transition:background .1s}
tbody tr:hover{background:var(--teal-light)}
tbody td{padding:9px 12px;vertical-align:middle}
tbody tr:last-child{border-bottom:none}
.table-actions{display:flex;gap:5px}

/* ─── AI PANEL ────────────────────────────────────────────── */
.ai-panel{
  background:linear-gradient(135deg,#1E0A3C 0%,#2D1B69 100%);
  border-radius:var(--radius-lg);padding:20px;color:#fff;margin-bottom:20px;
}
.ai-panel h3{font-size:.9rem;font-weight:600;margin-bottom:6px;display:flex;align-items:center;gap:8px}
.ai-panel p{font-size:.78rem;color:#C4B5FD;line-height:1.55;margin-bottom:14px}
.ai-prompts{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}
.ai-prompt-btn{
  background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);
  border-radius:20px;padding:5px 12px;font-size:.72rem;color:#E0D9FF;
  cursor:pointer;font-family:inherit;transition:all .15s;
}
.ai-prompt-btn:hover{background:rgba(255,255,255,.22)}
.ai-input-row{display:flex;gap:8px}
.ai-input-row input{
  flex:1;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);
  border-radius:8px;padding:9px 14px;color:#fff;font-family:inherit;font-size:.82rem;outline:none;
}
.ai-input-row input::placeholder{color:#A78BFA}
.ai-input-row input:focus{border-color:#A78BFA;background:rgba(255,255,255,.15)}
.ai-response{
  background:rgba(255,255,255,.08);border-radius:10px;padding:14px;margin-top:14px;
  font-size:.8rem;line-height:1.7;color:#E0D9FF;white-space:pre-wrap;min-height:40px;
  border:1px solid rgba(255,255,255,.1);max-height:320px;overflow-y:auto;
}
.ai-response.loading{color:#A78BFA;font-style:italic}
.ai-response.error{color:#FCA5A5}
.ai-response strong{color:#fff}
.ai-response h3{color:#C4B5FD;font-size:.85rem;margin:10px 0 4px}

/* ─── TOAST ───────────────────────────────────────────────── */
#toast{
  position:fixed;bottom:24px;right:24px;z-index:9999;
  background:var(--teal-dark);color:#fff;
  padding:12px 20px;border-radius:10px;font-size:.82rem;font-weight:500;
  box-shadow:var(--shadow-lg);transform:translateY(80px);opacity:0;
  transition:all .3s;pointer-events:none;max-width:340px;
}
#toast.show{transform:translateY(0);opacity:1}
#toast.error{background:var(--red)}
#toast.success{background:#166534}

/* ─── MODAL ───────────────────────────────────────────────── */
.modal-overlay{
  display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);
  z-index:200;align-items:center;justify-content:center;
}
.modal-overlay.open{display:flex}
.modal{
  background:#fff;border-radius:var(--radius-lg);max-width:680px;width:95vw;
  max-height:88vh;overflow-y:auto;box-shadow:var(--shadow-lg);
}
.modal-header{
  padding:16px 20px;background:var(--teal);color:#fff;
  display:flex;align-items:center;justify-content:space-between;
  position:sticky;top:0;z-index:5;
}
.modal-header h2{font-size:.95rem;font-weight:600}
.modal-close{background:none;border:none;color:#fff;font-size:1.4rem;cursor:pointer;line-height:1;padding:0 4px}
.modal-body{padding:20px}

/* ─── EMPTY STATE ─────────────────────────────────────────── */
.empty-state{text-align:center;padding:40px 20px;color:var(--slate-mid)}
.empty-state .icon{font-size:2.5rem;margin-bottom:12px;opacity:.5}
.empty-state p{font-size:.85rem}

/* ─── MISC ────────────────────────────────────────────────── */
.alert{border-radius:8px;padding:10px 14px;font-size:.78rem;font-weight:500;margin:10px 0;display:flex;align-items:flex-start;gap:8px}
.alert-nrc{background:#F5F3FF;border:1.5px solid #7C3AED;color:#5B21B6}
.alert-warn{background:#FFFBEB;border:1.5px solid #D97706;color:#92400E}
.alert-sam{background:#FEF2F2;border:1.5px solid #DC2626;color:#991B1B}
.divider{height:1px;background:var(--border);margin:18px 0}
.text-muted{color:var(--slate-mid);font-size:.75rem}
.badge-count{background:var(--teal);color:#fff;border-radius:20px;padding:1px 8px;font-size:.68rem;font-weight:700;margin-left:5px}
</style>
</head>
<body>

<!-- TOP NAV -->
<nav class="topnav">
  <div class="topnav-brand">
    <div class="logo">🏥</div>
    <div>
      <h1>SNCU Graduate Follow-Up System</h1>
      <small>BRD Medical College, Gorakhpur  ·  UNICEF-BRD Partnership</small>
    </div>
  </div>
  <div class="topnav-right">
    <div class="api-input-wrap">
      <label>🔑 Gemini API Key:</label>
      <input type="password" id="apiKeyInput" placeholder="Paste your API key here…" autocomplete="off">
    </div>
  </div>
</nav>

<!-- TAB BAR -->
<div class="tabbar">
  <button class="active" onclick="showTab('dashboard')">📊 Dashboard</button>
  <button onclick="showTab('entry')">➕ New Entry</button>
  <button onclick="showTab('records')">📋 All Records</button>
  <button onclick="showTab('ai')">🤖 AI Insights</button>
</div>

<!-- ═══════════════════════════════════════════════════════════
     TAB 1: DASHBOARD
══════════════════════════════════════════════════════════════ -->
<div class="main">
<div id="tab-dashboard" class="tab-panel active">

  <!-- KPIs -->
  <div class="kpi-grid" id="kpiGrid"></div>

  <!-- Charts -->
  <div class="charts-grid">
    <div class="chart-card">
      <div class="chart-title">📈 Nutritional Status Distribution (W/L)</div>
      <canvas id="chartNutrition" height="200"></canvas>
    </div>
    <div class="chart-card">
      <div class="chart-title">⚖️ Weight Gain Status</div>
      <canvas id="chartWtGain" height="200"></canvas>
    </div>
    <div class="chart-card">
      <div class="chart-title">🍼 Feeding Type (Last 24 hrs)</div>
      <canvas id="chartFeeding" height="200"></canvas>
    </div>
    <div class="chart-card">
      <div class="chart-title">🔄 Referrals by Visit Number</div>
      <canvas id="chartVisit" height="200"></canvas>
    </div>
  </div>

  <!-- Recent entries -->
  <div class="card">
    <div class="card-header">
      <span>🕐</span>
      <h2>Recent Entries</h2>
      <span class="badge" id="recentBadge">0 records</span>
    </div>
    <div class="card-body" style="padding:0">
      <div class="table-wrap">
        <table id="recentTable">
          <thead>
            <tr>
              <th>Child</th><th>Visit Date</th><th>Visit No.</th>
              <th>Wt (g)</th><th>W/L Status</th><th>Wt Gain</th>
              <th>NRC Ref.</th><th>Actions</th>
            </tr>
          </thead>
          <tbody id="recentTbody"></tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════
     TAB 2: DATA ENTRY
══════════════════════════════════════════════════════════════ -->
<div id="tab-entry" class="tab-panel">
<div class="card">
  <div class="card-header">
    <span>📝</span>
    <h2 id="formTitle">New Follow-Up Entry</h2>
    <span class="badge" id="formMode">New Record</span>
  </div>
  <div class="card-body">
  <form id="entryForm" onsubmit="return false">
    <input type="hidden" id="editId">

    <!-- S1: IDENTIFICATION -->
    <div class="section-label">Section 1 · Child Identification & SNCU History</div>
    <div class="form-grid cols-4">
      <div class="form-group span-2">
        <label class="field-label">Child Name <span class="req">*</span></label>
        <input type="text" id="childName" placeholder="First name or full name" required>
      </div>
      <div class="form-group">
        <label class="field-label">SNCU ID <span class="req">*</span></label>
        <input type="text" id="sncuId" placeholder="e.g. SNCU2024001" required>
      </div>
      <div class="form-group">
        <label class="field-label">Date of Birth <span class="req">*</span></label>
        <input type="date" id="dob" required onchange="calcAges()">
      </div>
      <div class="form-group span-2">
        <label class="field-label">Mother's Name</label>
        <input type="text" id="motherName" placeholder="Full name">
      </div>
      <div class="form-group">
        <label class="field-label">Sex <span class="req">*</span></label>
        <select id="sex" required>
          <option value="">Select…</option>
          <option>Male</option><option>Female</option><option>Ambiguous</option>
        </select>
      </div>
      <div class="form-group">
        <label class="field-label">GA at Birth (weeks)</label>
        <input type="number" id="gaAtBirth" min="24" max="42" placeholder="e.g. 32" onchange="calcAges()">
      </div>
      <div class="form-group">
        <label class="field-label">Birth Weight (g)</label>
        <input type="number" id="birthWeight" min="400" max="5000" placeholder="grams">
      </div>
      <div class="form-group">
        <label class="field-label">SNCU Admission Date</label>
        <input type="date" id="sncuAdmDate">
      </div>
      <div class="form-group">
        <label class="field-label">SNCU Discharge Date</label>
        <input type="date" id="sncuDiscDate">
      </div>
      <div class="form-group">
        <label class="field-label">Discharge Weight (g)</label>
        <input type="number" id="discWeight" placeholder="grams">
      </div>
      <div class="form-group span-2">
        <label class="field-label">Discharge Feeding Status</label>
        <select id="discFeeding">
          <option value="">Select…</option>
          <option>Direct_Breastfeeding</option><option>EBM_Paladai</option>
          <option>EBM_Cup_Spoon</option><option>EBM_Gavage</option>
          <option>Mixed</option><option>Formula</option>
        </select>
      </div>
    </div>

    <!-- S2: VISIT & ANTHROPOMETRY -->
    <div class="section-label">Section 2 · Visit Details & Anthropometry</div>
    <div class="form-grid cols-4">
      <div class="form-group">
        <label class="field-label">Visit Number <span class="req">*</span></label>
        <select id="visitNo" required>
          <option value="">Select…</option>
          <option>1st (8 days)</option><option>2nd (1 month)</option>
          <option>3rd (3 months)</option><option>4th (6 months)</option>
          <option>5th (12 months)</option><option>Unscheduled</option>
        </select>
      </div>
      <div class="form-group">
        <label class="field-label">Visit Date <span class="req">*</span></label>
        <input type="date" id="visitDate" required onchange="calcAges()">
      </div>
      <div class="form-group">
        <label class="field-label">Chronological Age (Days)</label>
        <input type="text" id="chronoAgeDays" class="computed" readonly placeholder="Auto-calc">
      </div>
      <div class="form-group">
        <label class="field-label">Corrected Age (Weeks)</label>
        <input type="text" id="correctedAge" class="computed" readonly placeholder="Preterm only">
      </div>
      <div class="form-group">
        <label class="field-label">Weight Today (g) <span class="req">*</span></label>
        <input type="number" id="weightToday" min="400" max="15000" placeholder="grams" required onchange="calcWtGain()">
      </div>
      <div class="form-group">
        <label class="field-label">Length Today (cm)</label>
        <input type="number" id="lengthToday" min="30" max="100" step="0.1" placeholder="cm">
      </div>
      <div class="form-group">
        <label class="field-label">MUAC (cm) <span class="text-muted">≥6m only</span></label>
        <input type="number" id="muac" min="5" max="20" step="0.1" placeholder="cm">
      </div>
      <div class="form-group">
        <label class="field-label">Reviewer Name</label>
        <input type="text" id="reviewer" placeholder="Doctor/Nurse name">
      </div>
      <div class="form-group">
        <label class="field-label">Previous Visit Weight (g)</label>
        <input type="number" id="prevWeight" placeholder="grams" onchange="calcWtGain()">
      </div>
      <div class="form-group">
        <label class="field-label">Previous Visit Date</label>
        <input type="date" id="prevDate" onchange="calcWtGain()">
      </div>
      <div class="form-group">
        <label class="field-label">Wt Gain (g/day)</label>
        <input type="text" id="wtGainPerDay" class="computed" readonly placeholder="Auto-calc">
      </div>
      <div class="form-group">
        <label class="field-label">Weight Gain Status</label>
        <input type="text" id="wtGainStatus" class="computed" readonly placeholder="Auto-calc">
      </div>
    </div>

    <!-- Alert for suboptimal -->
    <div id="wtAlert" style="display:none"></div>

    <div class="form-grid cols-3" style="margin-top:12px">
      <div class="form-group">
        <label class="field-label">Weight-for-Age</label>
        <select id="wfa">
          <option value="">Select…</option>
          <option>Normal (≥−2SD)</option>
          <option>Underweight (−2 to −3SD)</option>
          <option>Severely Underweight (<−3SD)</option>
        </select>
      </div>
      <div class="form-group">
        <label class="field-label">Weight-for-Length ★ <span class="req">*</span></label>
        <select id="wfl" required onchange="checkNRC()">
          <option value="">Select…</option>
          <option>Normal (≥−2SD)</option>
          <option>MAM (−2 to −3SD)</option>
          <option>SAM (<−3SD)</option>
          <option>Not_Applicable</option>
        </select>
      </div>
      <div class="form-group">
        <label class="field-label">Length-for-Age</label>
        <select id="lfa">
          <option value="">Select…</option>
          <option>Normal (≥−2SD)</option>
          <option>Stunted (−2 to −3SD)</option>
          <option>Severely Stunted (<−3SD)</option>
        </select>
      </div>
    </div>

    <!-- NRC alert -->
    <div id="nrcAlert" style="display:none"></div>

    <!-- S3: FEEDING -->
    <div class="section-label">Section 3 · Feeding Assessment — Last 24 Hours</div>
    <div class="form-grid cols-3">
      <div class="form-group">
        <label class="field-label">What was fed?</label>
        <select id="feedingType">
          <option value="">Select…</option>
          <option>Only_Mothers_Milk</option>
          <option>Mothers_Milk+Other_Milk</option>
          <option>Mothers_Milk+Water</option>
          <option>Mothers_Milk+Complementary</option>
          <option>Only_Other_Milk</option>
          <option>Complementary+Other_Milk</option>
          <option>No_Feeds</option>
        </select>
      </div>
      <div class="form-group">
        <label class="field-label">Feeding Mode</label>
        <select id="feedMode">
          <option value="">Select…</option>
          <option>Direct_Breastfeeding</option><option>Katori_Chamach</option>
          <option>Paladai</option><option>Bottle</option>
          <option>Gavage</option><option>Mixed</option>
        </select>
      </div>
      <div class="form-group">
        <label class="field-label">Feeding Frequency (feeds/24h)</label>
        <input type="number" id="feedFreq" min="0" max="20" placeholder="e.g. 8">
      </div>
    </div>
    <div class="form-group" style="margin-top:10px">
      <label class="field-label">Breastfeeding Difficulties <span class="text-muted">(check all that apply)</span></label>
      <div class="check-group">
        <label class="check-item"><input type="checkbox" id="bfLatch"> Latching difficulty</label>
        <label class="check-item"><input type="checkbox" id="bfLowSupply"> Low milk supply</label>
        <label class="check-item"><input type="checkbox" id="bfNipple"> Nipple pain/cracked</label>
        <label class="check-item"><input type="checkbox" id="bfInfreq"> Infrequent feeding (&lt;8×/day)</label>
        <label class="check-item"><input type="checkbox" id="bfTires"> Baby tires at breast</label>
        <label class="check-item"><input type="checkbox" id="bfRefuses"> Baby refuses breast</label>
        <label class="check-item"><input type="checkbox" id="bfNone"> No difficulties</label>
      </div>
    </div>

    <!-- S4: CLINICAL -->
    <div class="section-label">Section 4 · Clinical Status & Lactation</div>
    <div class="form-grid cols-4">
      <div class="form-group">
        <label class="field-label">Illness Last 7 Days?</label>
        <select id="illness7d" onchange="checkNRC()">
          <option value="">Select…</option>
          <option>No</option><option>Yes</option>
        </select>
      </div>
      <div class="form-group span-3">
        <label class="field-label">Illness Description (if Yes)</label>
        <input type="text" id="illnessDesc" placeholder="Describe illness…">
      </div>
    </div>
    <div class="form-group" style="margin-top:10px">
      <label class="field-label">Current Symptoms <span class="text-muted">(check all that apply)</span></label>
      <div class="check-group">
        <label class="check-item"><input type="checkbox" id="sxFever"> Fever</label>
        <label class="check-item"><input type="checkbox" id="sxCough"> Cough/Cold</label>
        <label class="check-item"><input type="checkbox" id="sxDiarrhea"> Diarrhea</label>
        <label class="check-item"><input type="checkbox" id="sxVomiting"> Vomiting</label>
        <label class="check-item"><input type="checkbox" id="sxFeedDiff"> Not feeding well</label>
        <label class="check-item"><input type="checkbox" id="sxJaundice"> Jaundice</label>
        <label class="check-item"><input type="checkbox" id="sxBreathing"> Breathing difficulty</label>
        <label class="check-item"><input type="checkbox" id="sxLethargy"> Lethargy</label>
        <label class="check-item"><input type="checkbox" id="sxSeizures"> Seizures</label>
        <label class="check-item"><input type="checkbox" id="sxNone"> None</label>
      </div>
    </div>
    <div class="form-group" style="margin-top:10px">
      <label class="field-label">Lactation Challenges <span class="text-muted">(check all that apply)</span></label>
      <div class="check-group">
        <label class="check-item"><input type="checkbox" id="lactInsuff" onchange="checkNRC()"> Insufficient milk production</label>
        <label class="check-item"><input type="checkbox" id="lactPainful" onchange="checkNRC()"> Painful breastfeeding</label>
        <label class="check-item"><input type="checkbox" id="lactUnwell" onchange="checkNRC()"> Mother unwell/on medication</label>
        <label class="check-item"><input type="checkbox" id="lactSep" onchange="checkNRC()"> Mother separated from baby</label>
        <label class="check-item"><input type="checkbox" id="lactNone"> None</label>
      </div>
    </div>

    <!-- S5: REFERRAL -->
    <div class="section-label">Section 5 · Referral Decision</div>
    <div class="form-grid cols-4">
      <div class="form-group">
        <label class="field-label">Referral Needed?</label>
        <select id="referralNeeded">
          <option value="">Select…</option>
          <option>No</option><option>Yes</option>
        </select>
      </div>
      <div class="form-group">
        <label class="field-label">Referral to NRC?</label>
        <select id="refNRC">
          <option value="">Select…</option>
          <option>No</option><option>Yes</option>
        </select>
      </div>
      <div class="form-group">
        <label class="field-label">Referral to DEIC?</label>
        <select id="refDEIC">
          <option value="">Select…</option>
          <option>No</option><option>Yes</option>
        </select>
      </div>
      <div class="form-group">
        <label class="field-label">Referral to PICU?</label>
        <select id="refPICU">
          <option value="">Select…</option>
          <option>No</option><option>Yes</option>
        </select>
      </div>
      <div class="form-group span-2">
        <label class="field-label">Reason for Referral</label>
        <input type="text" id="refReason" placeholder="Brief reason…">
      </div>
      <div class="form-group">
        <label class="field-label">Referral Note Given?</label>
        <select id="refNote">
          <option value="">Select…</option>
          <option>No</option><option>Yes</option>
        </select>
      </div>
      <div class="form-group">
        <label class="field-label">Counseling Done?</label>
        <select id="counseling">
          <option value="">Select…</option>
          <option>No</option><option>Yes</option>
        </select>
      </div>
      <div class="form-group">
        <label class="field-label">NRC Admitted?</label>
        <select id="nrcAdmitted">
          <option value="">Select…</option>
          <option>No</option><option>Yes</option><option>Pending</option>
        </select>
      </div>
      <div class="form-group">
        <label class="field-label">NRC Admission Date</label>
        <input type="date" id="nrcAdmDate">
      </div>
    </div>

    <!-- S6: FOLLOW-UP -->
    <div class="section-label">Section 6 · Follow-Up Plan & Sign-Off</div>
    <div class="form-grid cols-4">
      <div class="form-group">
        <label class="field-label">Next Visit Scheduled?</label>
        <select id="nextVisitSched">
          <option value="">Select…</option>
          <option>No</option><option>Yes</option>
        </select>
      </div>
      <div class="form-group">
        <label class="field-label">Date of Next Visit</label>
        <input type="date" id="nextVisitDate">
      </div>
      <div class="form-group span-2">
        <label class="field-label">Special Instructions</label>
        <input type="text" id="specialInstr" placeholder="Any notes for next visit…">
      </div>
      <div class="form-group">
        <label class="field-label">Data Collector Name</label>
        <input type="text" id="dataCollector" placeholder="Name">
      </div>
      <div class="form-group span-3">
        <label class="field-label">Remarks</label>
        <textarea id="remarks" placeholder="Any additional observations…" rows="2"></textarea>
      </div>
    </div>

    <div class="actions-bar">
      <button type="button" class="btn btn-secondary" onclick="resetForm()">🗑 Clear Form</button>
      <button type="button" class="btn btn-primary" onclick="saveRecord()">💾 Save Record</button>
    </div>
  </form>
  </div>
</div>
</div>

<!-- ═══════════════════════════════════════════════════════════
     TAB 3: ALL RECORDS
══════════════════════════════════════════════════════════════ -->
<div id="tab-records" class="tab-panel" style="display:none">
<div class="card">
  <div class="card-header">
    <span>📋</span>
    <h2>All Records</h2>
    <span class="badge" id="allRecordsBadge">0</span>
  </div>
  <div class="card-body" style="padding:14px 16px 8px">
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;align-items:center">
      <input type="text" id="searchInput" placeholder="🔍  Search by name, SNCU ID…" style="max-width:260px;padding:7px 12px" oninput="renderRecordsTable()">
      <select id="filterVisit" onchange="renderRecordsTable()" style="max-width:160px">
        <option value="">All Visits</option>
        <option>1st (8 days)</option><option>2nd (1 month)</option>
        <option>3rd (3 months)</option><option>4th (6 months)</option>
        <option>5th (12 months)</option>
      </select>
      <select id="filterNutr" onchange="renderRecordsTable()" style="max-width:160px">
        <option value="">All Nutritional Status</option>
        <option>SAM (<−3SD)</option><option>MAM (−2 to −3SD)</option><option>Normal (≥−2SD)</option>
      </select>
      <select id="filterNRC" onchange="renderRecordsTable()" style="max-width:140px">
        <option value="">All NRC Status</option>
        <option value="Yes">NRC Referred</option>
        <option value="No">Not Referred</option>
      </select>
      <button class="btn btn-secondary btn-sm" onclick="exportCSV()">⬇ Export CSV</button>
      <button class="btn btn-danger btn-sm" onclick="clearAllData()">🗑 Clear All Data</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Child</th><th>SNCU ID</th><th>Visit Date</th>
            <th>Visit No.</th><th>Wt (g)</th><th>Wt Gain</th>
            <th>W/L Status</th><th>Feeding</th><th>NRC</th><th>Actions</th>
          </tr>
        </thead>
        <tbody id="allRecordsTbody"></tbody>
      </table>
    </div>
  </div>
</div>
</div>

<!-- ═══════════════════════════════════════════════════════════
     TAB 4: AI INSIGHTS
══════════════════════════════════════════════════════════════ -->
<div id="tab-ai" class="tab-panel" style="display:none">
  <div class="ai-panel">
    <h3>🤖 Gemini AI Clinical Insights</h3>
    <p>Ask Gemini to analyse your SNCU follow-up data, flag clinical concerns, suggest interventions, or generate a programme summary. Your data is summarised and sent — no patient identifiers are included in the API call.</p>
    <div class="ai-prompts">
      <button class="ai-prompt-btn" onclick="runPrompt('Summarise the overall nutritional status of all recorded SNCU graduates and highlight key concerns.')">📊 Overall Summary</button>
      <button class="ai-prompt-btn" onclick="runPrompt('List all SAM cases and recommend immediate clinical actions for each.')">🚨 SAM Case Review</button>
      <button class="ai-prompt-btn" onclick="runPrompt('Analyse breastfeeding difficulties patterns and suggest targeted lactation support strategies.')">🍼 BF Difficulties</button>
      <button class="ai-prompt-btn" onclick="runPrompt('Review referral patterns and assess whether NRC referral criteria are being applied correctly.')">🏥 Referral Audit</button>
      <button class="ai-prompt-btn" onclick="runPrompt('Identify children with suboptimal weight gain and suggest possible causes and interventions.')">⚖️ Weight Gain Alerts</button>
      <button class="ai-prompt-btn" onclick="runPrompt('Generate a concise programme monitoring report suitable for the State PMU.')">📄 PMU Report</button>
    </div>
    <div class="ai-input-row">
      <input type="text" id="aiCustomPrompt" placeholder="Type a custom question about your data…" onkeydown="if(event.key==='Enter')runPrompt()">
      <button class="btn btn-ai" onclick="runPrompt()">✨ Ask Gemini</button>
    </div>
    <div id="aiResponse" class="ai-response" style="display:none"></div>
  </div>

  <div class="card">
    <div class="card-header"><span>🚨</span><h2>Auto-Flagged Cases</h2></div>
    <div class="card-body" id="flaggedCases"></div>
  </div>
</div>

</div><!-- /main -->

<!-- VIEW MODAL -->
<div class="modal-overlay" id="viewModal">
  <div class="modal">
    <div class="modal-header">
      <h2>📋 Record Details</h2>
      <button class="modal-close" onclick="closeModal('viewModal')">×</button>
    </div>
    <div class="modal-body" id="viewModalBody"></div>
  </div>
</div>

<!-- TOAST -->
<div id="toast"></div>

<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<script>
// ═══════════════════════════════════════════════════════════════
// DATA LAYER
// ═══════════════════════════════════════════════════════════════
const DB_KEY = 'sncuFollowUpData_v1';

function getRecords() {
  try { return JSON.parse(localStorage.getItem(DB_KEY) || '[]'); } catch { return []; }
}
function saveRecords(arr) {
  localStorage.setItem(DB_KEY, JSON.stringify(arr));
}

// ═══════════════════════════════════════════════════════════════
// TAB NAVIGATION
// ═══════════════════════════════════════════════════════════════
function showTab(tab) {
  document.querySelectorAll('.tab-panel').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
  document.querySelectorAll('.tabbar button').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('tab-' + tab);
  panel.classList.add('active');
  panel.style.display = 'block';
  document.querySelectorAll('.tabbar button').forEach(b => {
    if (b.textContent.toLowerCase().includes(tab === 'ai' ? 'ai' : tab === 'entry' ? 'new' : tab === 'records' ? 'all' : 'dashboard')) {
      b.classList.add('active');
    }
  });
  if (tab === 'dashboard') refreshDashboard();
  if (tab === 'records') renderRecordsTable();
  if (tab === 'ai') renderFlaggedCases();
}

// ═══════════════════════════════════════════════════════════════
// AUTO-CALCULATIONS
// ═══════════════════════════════════════════════════════════════
function calcAges() {
  const dob = document.getElementById('dob').value;
  const visitDate = document.getElementById('visitDate').value;
  const ga = parseFloat(document.getElementById('gaAtBirth').value);
  if (!dob || !visitDate) return;
  const dobD = new Date(dob), visD = new Date(visitDate);
  const days = Math.round((visD - dobD) / 86400000);
  document.getElementById('chronoAgeDays').value = days >= 0 ? `${days} days (${(days/30.4).toFixed(1)} months)` : '';
  if (!isNaN(ga) && ga < 37 && days >= 0) {
    const corr = (ga + days / 7) - 40;
    document.getElementById('correctedAge').value = corr >= 0 ? `${corr.toFixed(1)} weeks` : `${corr.toFixed(1)} wks (still correcting)`;
  } else {
    document.getElementById('correctedAge').value = ga >= 37 ? 'Term — N/A' : '';
  }
}

function calcWtGain() {
  const today = parseFloat(document.getElementById('weightToday').value);
  const prev = parseFloat(document.getElementById('prevWeight').value);
  const prevDate = document.getElementById('prevDate').value;
  const visitDate = document.getElementById('visitDate').value;
  const ga = parseFloat(document.getElementById('gaAtBirth').value);
  const el = document.getElementById('wtGainPerDay');
  const statusEl = document.getElementById('wtGainStatus');
  const alertEl = document.getElementById('wtAlert');
  alertEl.style.display = 'none';
  if (!today || !prev || !prevDate || !visitDate) { el.value = ''; statusEl.value = ''; return; }
  const days = Math.round((new Date(visitDate) - new Date(prevDate)) / 86400000);
  if (days <= 0) { el.value = 'Invalid dates'; statusEl.value = ''; return; }
  const gainPerDay = (today - prev) / days;
  el.value = gainPerDay.toFixed(1) + ' g/day';
  const isPreterm = !isNaN(ga) && ga < 37;
  let status;
  if (gainPerDay < 0) status = 'Weight_Loss';
  else if (isPreterm ? gainPerDay < 10 : gainPerDay < 20) status = 'Suboptimal';
  else status = 'Adequate';
  statusEl.value = status;
  if (status === 'Weight_Loss' || status === 'Suboptimal') {
    alertEl.innerHTML = `<div class="alert alert-warn">⚠️ <strong>${status === 'Weight_Loss' ? 'Weight loss detected!' : 'Suboptimal weight gain.'}</strong> Assess breastfeeding technique, check for infection, consider feeding volume increase.</div>`;
    alertEl.style.display = 'block';
  }
}

function checkNRC() {
  const wfl = document.getElementById('wfl').value;
  const illness = document.getElementById('illness7d').value;
  const lact = ['lactInsuff','lactPainful','lactUnwell','lactSep'].some(id => document.getElementById(id).checked);
  const alertEl = document.getElementById('nrcAlert');
  const refNRC = document.getElementById('refNRC');
  const dob = document.getElementById('dob').value;
  const visitDate = document.getElementById('visitDate').value;
  let ageMonths = null;
  if (dob && visitDate) ageMonths = (new Date(visitDate) - new Date(dob)) / 86400000 / 30.4;

  alertEl.style.display = 'none';
  if (wfl === 'SAM (<−3SD)') {
    const under6 = ageMonths !== null && ageMonths < 6;
    const over6 = ageMonths !== null && ageMonths >= 6;
    if (under6 && (illness === 'Yes' || lact)) {
      alertEl.innerHTML = `<div class="alert alert-sam">🚨 <strong>NRC REFERRAL CRITERIA MET</strong> — SAM infant &lt;6 months with medical complication/lactation challenge. Refer to NRC immediately.</div>`;
      alertEl.style.display = 'block';
      refNRC.value = 'Yes';
      document.getElementById('referralNeeded').value = 'Yes';
    } else if (over6 && illness === 'Yes') {
      alertEl.innerHTML = `<div class="alert alert-sam">🚨 <strong>NRC REFERRAL CRITERIA MET</strong> — SAM infant ≥6 months with medical complication. Refer to NRC immediately.</div>`;
      alertEl.style.display = 'block';
      refNRC.value = 'Yes';
      document.getElementById('referralNeeded').value = 'Yes';
    } else {
      alertEl.innerHTML = `<div class="alert alert-warn">⚠️ <strong>SAM detected.</strong> Monitor for complications. NRC referral required if medical complication or lactation challenge present.</div>`;
      alertEl.style.display = 'block';
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// FORM SAVE / EDIT / DELETE
// ═══════════════════════════════════════════════════════════════
function getCheckboxes(ids) {
  const out = {};
  ids.forEach(id => { out[id] = document.getElementById(id).checked; });
  return out;
}

function saveRecord() {
  const req = ['childName','sncuId','dob','sex','visitNo','visitDate','weightToday','wfl'];
  for (const id of req) {
    if (!document.getElementById(id).value) {
      showToast('Please fill required fields (*)', 'error');
      document.getElementById(id).focus();
      return;
    }
  }

  const bfDiff = getCheckboxes(['bfLatch','bfLowSupply','bfNipple','bfInfreq','bfTires','bfRefuses','bfNone']);
  const sx = getCheckboxes(['sxFever','sxCough','sxDiarrhea','sxVomiting','sxFeedDiff','sxJaundice','sxBreathing','sxLethargy','sxSeizures','sxNone']);
  const lact = getCheckboxes(['lactInsuff','lactPainful','lactUnwell','lactSep','lactNone']);

  const records = getRecords();
  const editId = document.getElementById('editId').value;

  const rec = {
    id: editId || Date.now().toString(),
    ts: new Date().toISOString(),
    childName:    document.getElementById('childName').value.trim(),
    sncuId:       document.getElementById('sncuId').value.trim(),
    motherName:   document.getElementById('motherName').value.trim(),
    dob:          document.getElementById('dob').value,
    sex:          document.getElementById('sex').value,
    gaAtBirth:    document.getElementById('gaAtBirth').value,
    birthWeight:  document.getElementById('birthWeight').value,
    sncuAdmDate:  document.getElementById('sncuAdmDate').value,
    sncuDiscDate: document.getElementById('sncuDiscDate').value,
    discWeight:   document.getElementById('discWeight').value,
    discFeeding:  document.getElementById('discFeeding').value,
    visitNo:      document.getElementById('visitNo').value,
    visitDate:    document.getElementById('visitDate').value,
    chronoAge:    document.getElementById('chronoAgeDays').value,
    correctedAge: document.getElementById('correctedAge').value,
    reviewer:     document.getElementById('reviewer').value,
    weightToday:  document.getElementById('weightToday').value,
    lengthToday:  document.getElementById('lengthToday').value,
    muac:         document.getElementById('muac').value,
    prevWeight:   document.getElementById('prevWeight').value,
    prevDate:     document.getElementById('prevDate').value,
    wtGainPerDay: document.getElementById('wtGainPerDay').value,
    wtGainStatus: document.getElementById('wtGainStatus').value,
    wfa:          document.getElementById('wfa').value,
    wfl:          document.getElementById('wfl').value,
    lfa:          document.getElementById('lfa').value,
    feedingType:  document.getElementById('feedingType').value,
    feedMode:     document.getElementById('feedMode').value,
    feedFreq:     document.getElementById('feedFreq').value,
    bfDiff,
    illness7d:    document.getElementById('illness7d').value,
    illnessDesc:  document.getElementById('illnessDesc').value,
    sx,
    lact,
    referralNeeded: document.getElementById('referralNeeded').value,
    refNRC:       document.getElementById('refNRC').value,
    refDEIC:      document.getElementById('refDEIC').value,
    refPICU:      document.getElementById('refPICU').value,
    refReason:    document.getElementById('refReason').value,
    refNote:      document.getElementById('refNote').value,
    counseling:   document.getElementById('counseling').value,
    nrcAdmitted:  document.getElementById('nrcAdmitted').value,
    nrcAdmDate:   document.getElementById('nrcAdmDate').value,
    nextVisitSched: document.getElementById('nextVisitSched').value,
    nextVisitDate:  document.getElementById('nextVisitDate').value,
    specialInstr:   document.getElementById('specialInstr').value,
    dataCollector:  document.getElementById('dataCollector').value,
    remarks:        document.getElementById('remarks').value,
  };

  if (editId) {
    const idx = records.findIndex(r => r.id === editId);
    if (idx > -1) records[idx] = rec; else records.push(rec);
    showToast('Record updated successfully!', 'success');
  } else {
    records.push(rec);
    showToast('Record saved successfully!', 'success');
  }
  saveRecords(records);
  resetForm();
  showTab('dashboard');
}

function editRecord(id) {
  const records = getRecords();
  const rec = records.find(r => r.id === id);
  if (!rec) return;
  const fields = ['childName','sncuId','motherName','dob','sex','gaAtBirth','birthWeight',
    'sncuAdmDate','sncuDiscDate','discWeight','discFeeding','visitNo','visitDate',
    'reviewer','weightToday','lengthToday','muac','prevWeight','prevDate',
    'wfa','wfl','lfa','feedingType','feedMode','feedFreq','illness7d','illnessDesc',
    'referralNeeded','refNRC','refDEIC','refPICU','refReason','refNote','counseling',
    'nrcAdmitted','nrcAdmDate','nextVisitSched','nextVisitDate','specialInstr','dataCollector','remarks'];
  fields.forEach(f => { if (document.getElementById(f)) document.getElementById(f).value = rec[f] || ''; });
  document.getElementById('editId').value = id;

  // checkboxes
  if (rec.bfDiff) Object.keys(rec.bfDiff).forEach(k => { if(document.getElementById(k)) document.getElementById(k).checked = rec.bfDiff[k]; });
  if (rec.sx) Object.keys(rec.sx).forEach(k => { if(document.getElementById(k)) document.getElementById(k).checked = rec.sx[k]; });
  if (rec.lact) Object.keys(rec.lact).forEach(k => { if(document.getElementById(k)) document.getElementById(k).checked = rec.lact[k]; });

  // recompute
  setTimeout(() => { calcAges(); calcWtGain(); checkNRC(); }, 100);

  document.getElementById('formTitle').textContent = 'Edit Record — ' + rec.childName;
  document.getElementById('formMode').textContent = 'Editing';
  showTab('entry');
  window.scrollTo(0, 0);
}

function deleteRecord(id) {
  if (!confirm('Delete this record? This cannot be undone.')) return;
  const records = getRecords().filter(r => r.id !== id);
  saveRecords(records);
  renderRecordsTable();
  refreshDashboard();
  showToast('Record deleted.', 'success');
}

function resetForm() {
  document.getElementById('entryForm').reset();
  document.getElementById('editId').value = '';
  document.getElementById('formTitle').textContent = 'New Follow-Up Entry';
  document.getElementById('formMode').textContent = 'New Record';
  document.getElementById('chronoAgeDays').value = '';
  document.getElementById('correctedAge').value = '';
  document.getElementById('wtGainPerDay').value = '';
  document.getElementById('wtGainStatus').value = '';
  document.getElementById('wtAlert').style.display = 'none';
  document.getElementById('nrcAlert').style.display = 'none';
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════
let chartInstances = {};

function refreshDashboard() {
  const records = getRecords();
  renderKPIs(records);
  renderCharts(records);
  renderRecentTable(records);
}

function renderKPIs(records) {
  const total = records.length;
  const sam = records.filter(r => r.wfl === 'SAM (<−3SD)').length;
  const mam = records.filter(r => r.wfl === 'MAM (−2 to −3SD)').length;
  const nrcRef = records.filter(r => r.refNRC === 'Yes').length;
  const deicRef = records.filter(r => r.refDEIC === 'Yes').length;
  const subopt = records.filter(r => r.wtGainStatus === 'Suboptimal' || r.wtGainStatus === 'Weight_Loss').length;
  const excBF = records.filter(r => r.feedingType === 'Only_Mothers_Milk').length;
  const uniqueKids = new Set(records.map(r => r.sncuId)).size;

  const kpis = [
    { label:'Total Visits', value:total, icon:'📊', color:'#1A6B6B', sub:`${uniqueKids} unique children` },
    { label:'SAM Cases', value:sam, icon:'🚨', color:'#DC2626', sub:`${total?((sam/total)*100).toFixed(0):0}% of visits` },
    { label:'MAM Cases', value:mam, icon:'⚠️', color:'#D97706', sub:`${total?((mam/total)*100).toFixed(0):0}% of visits` },
    { label:'NRC Referred', value:nrcRef, icon:'🏥', color:'#7C3AED', sub:`${total?((nrcRef/total)*100).toFixed(0):0}% referral rate` },
    { label:'DEIC Referred', value:deicRef, icon:'🏫', color:'#2980B1', sub:'Early intervention' },
    { label:'Suboptimal Gain', value:subopt, icon:'⚖️', color:'#9A3412', sub:'Wt loss or suboptimal' },
    { label:'Exclusive BF', value:excBF, icon:'🍼', color:'#166534', sub:`${total?((excBF/total)*100).toFixed(0):0}% on mothers milk` },
  ];

  const grid = document.getElementById('kpiGrid');
  grid.innerHTML = kpis.map(k => `
    <div class="kpi-card" style="--kpi-color:${k.color}">
      <div class="kpi-icon">${k.icon}</div>
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-sub">${k.sub}</div>
    </div>`).join('');
}

function renderCharts(records) {
  const chartDefs = [
    {
      id:'chartNutrition', type:'doughnut',
      getData: () => {
        const c = { 'SAM (<−3SD)':0, 'MAM (−2 to −3SD)':0, 'Normal (≥−2SD)':0, 'Not_Applicable':0 };
        records.forEach(r => { if(r.wfl && c[r.wfl]!==undefined) c[r.wfl]++; });
        return { labels:Object.keys(c), data:Object.values(c), colors:['#DC2626','#D97706','#16A34A','#94A3B8'] };
      }
    },
    {
      id:'chartWtGain', type:'bar',
      getData: () => {
        const c = { Adequate:0, Suboptimal:0, Weight_Loss:0 };
        records.forEach(r => { if(r.wtGainStatus && c[r.wtGainStatus]!==undefined) c[r.wtGainStatus]++; });
        return { labels:Object.keys(c), data:Object.values(c), colors:['#16A34A','#D97706','#DC2626'] };
      }
    },
    {
      id:'chartFeeding', type:'bar',
      getData: () => {
        const c = {};
        records.forEach(r => { if(r.feedingType) c[r.feedingType] = (c[r.feedingType]||0)+1; });
        const sorted = Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,6);
        return {
          labels: sorted.map(([k])=>k.replace(/_/g,' ').replace(/\+/g,' + ')),
          data: sorted.map(([,v])=>v),
          colors: ['#1A6B6B','#2E8B8B','#4AABAB','#68BFBF','#86D3D3','#A4E7E7']
        };
      }
    },
    {
      id:'chartVisit', type:'bar',
      getData: () => {
        const visits = ['1st (8 days)','2nd (1 month)','3rd (3 months)','4th (6 months)','5th (12 months)'];
        const total = visits.map(v => records.filter(r=>r.visitNo===v).length);
        const nrc = visits.map(v => records.filter(r=>r.visitNo===v && r.refNRC==='Yes').length);
        return { labels:visits.map(v=>v.replace(' days','d').replace(' month','m').replace(' months','m')), total, nrc };
      }
    }
  ];

  chartDefs.forEach(def => {
    const canvas = document.getElementById(def.id);
    if (!canvas) return;
    if (chartInstances[def.id]) { chartInstances[def.id].destroy(); }
    const ctx = canvas.getContext('2d');
    const d = def.getData();
    if (def.id === 'chartVisit') {
      chartInstances[def.id] = new Chart(ctx, {
        type:'bar',
        data:{
          labels:d.labels,
          datasets:[
            { label:'Total Visits', data:d.total, backgroundColor:'rgba(26,107,107,0.7)', borderRadius:4 },
            { label:'NRC Referred', data:d.nrc, backgroundColor:'rgba(124,58,237,0.7)', borderRadius:4 }
          ]
        },
        options:{ responsive:true, plugins:{ legend:{ position:'bottom', labels:{font:{size:10}} } }, scales:{ y:{ beginAtZero:true, ticks:{stepSize:1} } } }
      });
    } else {
      chartInstances[def.id] = new Chart(ctx, {
        type:def.type,
        data:{ labels:d.labels, datasets:[{ data:d.data, backgroundColor:d.colors, borderRadius:def.type==='bar'?4:0, borderWidth:def.type==='doughnut'?2:0 }] },
        options:{
          responsive:true,
          plugins:{ legend:{ position:'bottom', labels:{font:{size:10}, padding:8 } } },
          ...(def.type==='bar' ? { scales:{ y:{ beginAtZero:true, ticks:{stepSize:1} } } } : {})
        }
      });
    }
  });
}

function renderRecentTable(records) {
  const recent = [...records].sort((a,b)=>new Date(b.ts)-new Date(a.ts)).slice(0,10);
  document.getElementById('recentBadge').textContent = `${records.length} records`;
  const tbody = document.getElementById('recentTbody');
  if (!recent.length) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><div class="icon">📭</div><p>No records yet. <a href="#" onclick="showTab('entry')">Add your first entry.</a></p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = recent.map(r => `
    <tr>
      <td><strong>${r.childName}</strong><br><span class="text-muted">${r.sncuId}</span></td>
      <td>${r.visitDate || '—'}</td>
      <td>${r.visitNo || '—'}</td>
      <td>${r.weightToday ? Number(r.weightToday).toLocaleString() : '—'}</td>
      <td>${wflBadge(r.wfl)}</td>
      <td>${wtGainBadge(r.wtGainStatus, r.wtGainPerDay)}</td>
      <td>${r.refNRC === 'Yes' ? '<span class="status-pill pill-nrc">🏥 NRC</span>' : '—'}</td>
      <td class="table-actions">
        <button class="btn btn-secondary btn-sm" onclick="viewRecord('${r.id}')">👁</button>
        <button class="btn btn-secondary btn-sm" onclick="editRecord('${r.id}')">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="deleteRecord('${r.id}')">🗑</button>
      </td>
    </tr>`).join('');
}

function wflBadge(wfl) {
  if (!wfl) return '—';
  if (wfl.includes('SAM')) return '<span class="status-pill pill-sam">SAM</span>';
  if (wfl.includes('MAM')) return '<span class="status-pill pill-mam">MAM</span>';
  if (wfl.includes('Normal')) return '<span class="status-pill pill-normal">Normal</span>';
  return wfl;
}
function wtGainBadge(status, val) {
  if (!status) return val || '—';
  const pill = status === 'Adequate' ? 'pill-normal' : status === 'Suboptimal' ? 'pill-subopt' : 'pill-loss';
  return `<span class="status-pill ${pill}">${val || status}</span>`;
}

// ═══════════════════════════════════════════════════════════════
// RECORDS TABLE
// ═══════════════════════════════════════════════════════════════
function renderRecordsTable() {
  const records = getRecords();
  const search = document.getElementById('searchInput').value.toLowerCase();
  const fVisit = document.getElementById('filterVisit').value;
  const fNutr = document.getElementById('filterNutr').value;
  const fNRC = document.getElementById('filterNRC').value;

  let filtered = records.filter(r => {
    if (search && !r.childName.toLowerCase().includes(search) && !r.sncuId.toLowerCase().includes(search)) return false;
    if (fVisit && r.visitNo !== fVisit) return false;
    if (fNutr && r.wfl !== fNutr) return false;
    if (fNRC && r.refNRC !== fNRC) return false;
    return true;
  }).sort((a,b)=>new Date(b.ts)-new Date(a.ts));

  document.getElementById('allRecordsBadge').textContent = `${filtered.length} of ${records.length}`;
  const tbody = document.getElementById('allRecordsTbody');
  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="11"><div class="empty-state"><div class="icon">🔍</div><p>No records match your filters.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = filtered.map((r,i) => `
    <tr>
      <td class="text-muted" style="font-family:'DM Mono',monospace;font-size:.7rem">${(i+1).toString().padStart(3,'0')}</td>
      <td><strong>${r.childName}</strong><br><span class="text-muted">${r.sex||''} · ${r.gaAtBirth ? r.gaAtBirth+'wk' : ''}</span></td>
      <td style="font-family:'DM Mono',monospace;font-size:.75rem">${r.sncuId}</td>
      <td>${r.visitDate || '—'}</td>
      <td>${r.visitNo || '—'}</td>
      <td>${r.weightToday ? Number(r.weightToday).toLocaleString()+'g' : '—'}</td>
      <td>${wtGainBadge(r.wtGainStatus, r.wtGainPerDay)}</td>
      <td>${wflBadge(r.wfl)}</td>
      <td style="font-size:.72rem">${(r.feedingType||'—').replace(/_/g,' ')}</td>
      <td>${r.refNRC === 'Yes' ? '<span class="status-pill pill-nrc">Yes</span>' : '<span style="color:#94A3B8">No</span>'}</td>
      <td class="table-actions">
        <button class="btn btn-secondary btn-sm" onclick="viewRecord('${r.id}')">👁</button>
        <button class="btn btn-secondary btn-sm" onclick="editRecord('${r.id}')">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="deleteRecord('${r.id}')">🗑</button>
      </td>
    </tr>`).join('');
}

// ═══════════════════════════════════════════════════════════════
// VIEW MODAL
// ═══════════════════════════════════════════════════════════════
function viewRecord(id) {
  const r = getRecords().find(x => x.id === id);
  if (!r) return;
  const row = (label, val) => val ? `<tr><td style="font-weight:600;color:#475569;font-size:.75rem;padding:6px 10px;white-space:nowrap;width:200px">${label}</td><td style="font-size:.8rem;padding:6px 10px">${val}</td></tr>` : '';
  const sec = (title) => `<tr><td colspan="2" style="background:#E6F4F4;padding:8px 10px;font-weight:700;color:#1A6B6B;font-size:.72rem;text-transform:uppercase;letter-spacing:.06em">${title}</td></tr>`;

  document.getElementById('viewModalBody').innerHTML = `
    <table style="width:100%;border-collapse:collapse;border:1px solid #E2E8F0;border-radius:8px;overflow:hidden">
      ${sec('Child Identification')}
      ${row('Child Name', r.childName)} ${row('SNCU ID', r.sncuId)}
      ${row('Mother', r.motherName)} ${row('DOB', r.dob)}
      ${row('Sex', r.sex)} ${row('GA at Birth', r.gaAtBirth ? r.gaAtBirth+' weeks' : '')}
      ${row('Birth Weight', r.birthWeight ? r.birthWeight+'g' : '')}
      ${row('Discharge Date', r.sncuDiscDate)} ${row('Discharge Weight', r.discWeight ? r.discWeight+'g' : '')}
      ${row('Discharge Feeding', r.discFeeding)}
      ${sec('Visit & Anthropometry')}
      ${row('Visit Number', r.visitNo)} ${row('Visit Date', r.visitDate)}
      ${row('Chronological Age', r.chronoAge)} ${row('Corrected Age', r.correctedAge)}
      ${row('Weight Today', r.weightToday ? r.weightToday+'g' : '')}
      ${row('Length Today', r.lengthToday ? r.lengthToday+'cm' : '')}
      ${row('MUAC', r.muac ? r.muac+'cm' : '')}
      ${row('Weight Gain', r.wtGainPerDay)} ${row('Wt Gain Status', r.wtGainStatus)}
      ${row('W/L Status', r.wfl)} ${row('W/A Status', r.wfa)} ${row('L/A Status', r.lfa)}
      ${sec('Feeding')}
      ${row('Feeding Type', r.feedingType)} ${row('Feeding Mode', r.feedMode)}
      ${row('Frequency', r.feedFreq ? r.feedFreq+' feeds/day' : '')}
      ${sec('Clinical')}
      ${row('Illness Last 7d', r.illness7d)} ${row('Description', r.illnessDesc)}
      ${sec('Referral')}
      ${row('Referral Needed', r.referralNeeded)} ${row('NRC Referral', r.refNRC)}
      ${row('DEIC Referral', r.refDEIC)} ${row('PICU Referral', r.refPICU)}
      ${row('Reason', r.refReason)} ${row('NRC Admitted', r.nrcAdmitted)}
      ${sec('Follow-Up')}
      ${row('Next Visit', r.nextVisitDate)} ${row('Data Collector', r.dataCollector)}
      ${row('Remarks', r.remarks)}
    </table>`;
  document.getElementById('viewModal').classList.add('open');
}
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ═══════════════════════════════════════════════════════════════
// AI INSIGHTS (GEMINI)
// ═══════════════════════════════════════════════════════════════
function buildDataSummary() {
  const records = getRecords();
  if (!records.length) return 'No data available yet.';
  const total = records.length;
  const sam = records.filter(r=>r.wfl==='SAM (<−3SD)');
  const mam = records.filter(r=>r.wfl==='MAM (−2 to −3SD)');
  const nrcRef = records.filter(r=>r.refNRC==='Yes');
  const subopt = records.filter(r=>r.wtGainStatus==='Suboptimal'||r.wtGainStatus==='Weight_Loss');
  const excBF = records.filter(r=>r.feedingType==='Only_Mothers_Milk');

  const bfDiffCounts = {};
  const bfLabels = {bfLatch:'Latching',bfLowSupply:'Low supply',bfNipple:'Nipple pain',bfInfreq:'Infrequent',bfTires:'Baby tires',bfRefuses:'Baby refuses'};
  records.forEach(r => { if(r.bfDiff) Object.keys(bfLabels).forEach(k => { if(r.bfDiff[k]) bfDiffCounts[bfLabels[k]]=(bfDiffCounts[bfLabels[k]]||0)+1; }); });

  const samCases = sam.slice(0,5).map(r=>`Child:${r.childName}, Age:${r.chronoAge||'?'}, Illness:${r.illness7d||'?'}, NRC:${r.refNRC||'?'}`).join('; ');

  return `SNCU FOLLOW-UP DATA SUMMARY (${new Date().toLocaleDateString()}):
Total visits: ${total} | Unique children: ${new Set(records.map(r=>r.sncuId)).size}
SAM cases: ${sam.length} (${((sam.length/total)*100).toFixed(1)}%) | MAM cases: ${mam.length} (${((mam.length/total)*100).toFixed(1)}%)
Suboptimal/weight loss: ${subopt.length} | Exclusive breastfeeding: ${excBF.length} (${((excBF.length/total)*100).toFixed(1)}%)
NRC referred: ${nrcRef.length} | DEIC referred: ${records.filter(r=>r.refDEIC==='Yes').length}
BF difficulties: ${Object.entries(bfDiffCounts).map(([k,v])=>`${k}(n=${v})`).join(', ')||'none recorded'}
SAM case details (up to 5): ${samCases||'none'}
Visit distribution: ${['1st (8 days)','2nd (1 month)','3rd (3 months)','4th (6 months)','5th (12 months)'].map(v=>`${v}:${records.filter(r=>r.visitNo===v).length}`).join(', ')}`;
}

async function runPrompt(presetPrompt) {
  const apiKey = document.getElementById('apiKeyInput').value.trim();
  if (!apiKey) { showToast('Please enter your Gemini API key in the top bar.', 'error'); return; }
  const records = getRecords();
  if (!records.length) { showToast('No data to analyse. Add some records first.', 'error'); return; }

  const prompt = presetPrompt || document.getElementById('aiCustomPrompt').value.trim();
  if (!prompt) { showToast('Please enter a question.', 'error'); return; }

  const responseEl = document.getElementById('aiResponse');
  responseEl.style.display = 'block';
  responseEl.className = 'ai-response loading';
  responseEl.textContent = '✨ Analysing data with Gemini…';

  const dataSummary = buildDataSummary();
  const systemContext = `You are a clinical nutrition expert and SNCU (Special Newborn Care Unit) quality improvement specialist supporting the BRD Medical College – UNICEF partnership in Gorakhpur, Uttar Pradesh. You are given a statistical summary of SNCU graduate follow-up data. Provide specific, actionable, evidence-based clinical insights. Use clear structure with headers. Be concise but comprehensive. Flag any urgent concerns prominently.`;
  const fullPrompt = `${systemContext}\n\nDATA:\n${dataSummary}\n\nQUESTION: ${prompt}`;

  try {
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1200 }
      })
    });
    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.error?.message || `HTTP ${resp.status}`);
    }
    const data = await resp.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
    responseEl.className = 'ai-response';
    responseEl.innerHTML = formatAIResponse(text);
  } catch(e) {
    responseEl.className = 'ai-response error';
    responseEl.textContent = `❌ Error: ${e.message}\n\nPlease check your API key and ensure the Gemini API is enabled for your project.`;
  }
}

function formatAIResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h3>$1</h3>')
    .replace(/^# (.*$)/gm, '<h3>$1</h3>')
    .replace(/^- (.*$)/gm, '• $1')
    .replace(/\n{2,}/g, '\n\n');
}

// ═══════════════════════════════════════════════════════════════
// AUTO-FLAGGED CASES
// ═══════════════════════════════════════════════════════════════
function renderFlaggedCases() {
  const records = getRecords();
  const container = document.getElementById('flaggedCases');
  const flags = [];

  records.forEach(r => {
    const issues = [];
    if (r.wfl === 'SAM (<−3SD)') issues.push({ type:'sam', msg:'SAM detected — check NRC referral criteria' });
    if (r.wtGainStatus === 'Weight_Loss') issues.push({ type:'loss', msg:'Weight loss since last visit' });
    if (r.wtGainStatus === 'Suboptimal') issues.push({ type:'subopt', msg:'Suboptimal weight gain' });
    if (r.refNRC === 'Yes' && r.nrcAdmitted === 'Pending') issues.push({ type:'nrc', msg:'NRC referral pending admission confirmation' });
    if (issues.length) flags.push({ r, issues });
  });

  if (!flags.length) {
    container.innerHTML = `<div class="empty-state"><div class="icon">✅</div><p>No critical flags in current data.</p></div>`;
    return;
  }
  container.innerHTML = flags.map(f => `
    <div style="border:1px solid #E2E8F0;border-radius:10px;padding:14px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
      <div>
        <strong style="font-size:.88rem">${f.r.childName}</strong>
        <span class="text-muted"> · ${f.r.sncuId} · Visit: ${f.r.visitDate||'?'}</span>
        <div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:6px">
          ${f.issues.map(i => `<span class="alert ${i.type==='sam'||i.type==='loss'?'alert-sam':'alert-warn'}" style="padding:4px 10px;margin:0">
            ${i.type==='sam'?'🚨':i.type==='loss'?'📉':'⚠️'} ${i.msg}
          </span>`).join('')}
        </div>
      </div>
      <div style="display:flex;gap:6px;flex-shrink:0">
        <button class="btn btn-secondary btn-sm" onclick="viewRecord('${f.r.id}')">👁 View</button>
        <button class="btn btn-secondary btn-sm" onclick="editRecord('${f.r.id}')">✏️ Edit</button>
      </div>
    </div>`).join('');
}

// ═══════════════════════════════════════════════════════════════
// EXPORT CSV
// ═══════════════════════════════════════════════════════════════
function exportCSV() {
  const records = getRecords();
  if (!records.length) { showToast('No data to export.', 'error'); return; }
  const headers = ['ID','Child_Name','SNCU_ID','Mother_Name','DOB','Sex','GA_Birth_Wks',
    'Birth_Wt_g','SNCU_Adm','SNCU_Disc','Disc_Wt_g','Disc_Feeding',
    'Visit_No','Visit_Date','Chrono_Age','Corrected_Age','Wt_Today_g',
    'Length_cm','MUAC_cm','Prev_Wt_g','Prev_Date','Wt_Gain_g_day',
    'Wt_Gain_Status','WFA_Status','WFL_Status','LFA_Status',
    'Feeding_Type','Feeding_Mode','Feed_Freq',
    'BF_Latch','BF_LowSupply','BF_Nipple','BF_Infreq','BF_Tires','BF_Refuses',
    'Illness_7d','Sx_Fever','Sx_Cough','Sx_Diarrhea','Sx_Vomiting',
    'Lact_Insuff','Lact_Painful','Lact_Unwell','Lact_Separated',
    'Referral_Needed','Ref_NRC','Ref_DEIC','Ref_PICU','Ref_Reason',
    'NRC_Admitted','NRC_Adm_Date','Next_Visit_Date','Data_Collector','Remarks'];

  const rows = records.map(r => [
    r.id, r.childName, r.sncuId, r.motherName, r.dob, r.sex, r.gaAtBirth,
    r.birthWeight, r.sncuAdmDate, r.sncuDiscDate, r.discWeight, r.discFeeding,
    r.visitNo, r.visitDate, r.chronoAge, r.correctedAge, r.weightToday,
    r.lengthToday, r.muac, r.prevWeight, r.prevDate, r.wtGainPerDay,
    r.wtGainStatus, r.wfa, r.wfl, r.lfa,
    r.feedingType, r.feedMode, r.feedFreq,
    r.bfDiff?.bfLatch?'Yes':'No', r.bfDiff?.bfLowSupply?'Yes':'No',
    r.bfDiff?.bfNipple?'Yes':'No', r.bfDiff?.bfInfreq?'Yes':'No',
    r.bfDiff?.bfTires?'Yes':'No', r.bfDiff?.bfRefuses?'Yes':'No',
    r.illness7d, r.sx?.sxFever?'Yes':'No', r.sx?.sxCough?'Yes':'No',
    r.sx?.sxDiarrhea?'Yes':'No', r.sx?.sxVomiting?'Yes':'No',
    r.lact?.lactInsuff?'Yes':'No', r.lact?.lactPainful?'Yes':'No',
    r.lact?.lactUnwell?'Yes':'No', r.lact?.lactSep?'Yes':'No',
    r.referralNeeded, r.refNRC, r.refDEIC, r.refPICU, r.refReason,
    r.nrcAdmitted, r.nrcAdmDate, r.nextVisitDate, r.dataCollector, r.remarks
  ].map(v => `"${(v||'').toString().replace(/"/g,'""')}"`));

  const csv = [headers.join(','), ...rows.map(r=>r.join(','))].join('\n');
  const blob = new Blob([csv], { type:'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `SNCU_FollowUp_Export_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  showToast('CSV exported successfully!', 'success');
}

function clearAllData() {
  if (!confirm('DELETE ALL DATA? This cannot be undone!')) return;
  localStorage.removeItem(DB_KEY);
  refreshDashboard();
  renderRecordsTable();
  showToast('All data cleared.', 'success');
}

// ═══════════════════════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════════════════════
let toastTimer;
function showToast(msg, type='success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.className = '', 3000);
}

// ═══════════════════════════════════════════════════════════════
// MODAL CLOSE ON OVERLAY CLICK
// ═══════════════════════════════════════════════════════════════
document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); });
});

// ═══════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════
refreshDashboard();
</script>
</body>
</html>
