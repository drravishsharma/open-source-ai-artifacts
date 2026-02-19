'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── CHART.JS DYNAMIC IMPORT HELPER ───────────────────────────
let Chart;
if (typeof window !== 'undefined') {
  import('chart.js/auto').then(m => { Chart = m.default; });
}

// ─── CONSTANTS ─────────────────────────────────────────────────
const DB_KEY = 'sncuFollowUpData_v1';

const VISIT_OPTIONS = ['1st (8 days)','2nd (1 month)','3rd (3 months)','4th (6 months)','5th (12 months)','Unscheduled'];
const FEEDING_TYPE_OPTIONS = ['Only_Mothers_Milk','Mothers_Milk+Other_Milk','Mothers_Milk+Water','Mothers_Milk+Complementary','Only_Other_Milk','Complementary+Other_Milk','No_Feeds'];
const FEEDING_MODE_OPTIONS = ['Direct_Breastfeeding','Katori_Chamach','Paladai','Bottle','Gavage','Mixed'];
const DISC_FEEDING_OPTIONS = ['Direct_Breastfeeding','EBM_Paladai','EBM_Cup_Spoon','EBM_Gavage','Mixed','Formula'];
const WFL_OPTIONS = ['Normal (≥−2SD)','MAM (−2 to −3SD)','SAM (<−3SD)','Not_Applicable'];
const WFA_OPTIONS = ['Normal (≥−2SD)','Underweight (−2 to −3SD)','Severely Underweight (<−3SD)'];
const LFA_OPTIONS = ['Normal (≥−2SD)','Stunted (−2 to −3SD)','Severely Stunted (<−3SD)'];

// ─── STORAGE HELPERS ────────────────────────────────────────────
function getRecords() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(DB_KEY) || '[]'); } catch { return []; }
}
function saveRecords(arr) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DB_KEY, JSON.stringify(arr));
}

// ─── UTILITY FUNCTIONS ──────────────────────────────────────────
function calcAgesUtil(dob, visitDate, gaAtBirth) {
  if (!dob || !visitDate) return { chronoAge: '', correctedAge: '' };
  const dobD = new Date(dob), visD = new Date(visitDate);
  const days = Math.round((visD - dobD) / 86400000);
  const chronoAge = days >= 0 ? `${days} days (${(days/30.4).toFixed(1)} months)` : '';
  const ga = parseFloat(gaAtBirth);
  let correctedAge = '';
  if (!isNaN(ga) && ga < 37 && days >= 0) {
    const corr = (ga + days / 7) - 40;
    correctedAge = corr >= 0 ? `${corr.toFixed(1)} weeks` : `${corr.toFixed(1)} wks (still correcting)`;
  } else if (!isNaN(ga) && ga >= 37) {
    correctedAge = 'Term — N/A';
  }
  return { chronoAge, correctedAge };
}

function calcWtGainUtil(weightToday, prevWeight, prevDate, visitDate, gaAtBirth) {
  const today = parseFloat(weightToday), prev = parseFloat(prevWeight);
  if (!today || !prev || !prevDate || !visitDate) return { gainPerDay: '', status: '' };
  const days = Math.round((new Date(visitDate) - new Date(prevDate)) / 86400000);
  if (days <= 0) return { gainPerDay: 'Invalid dates', status: '' };
  const gainPerDay = (today - prev) / days;
  const isPreterm = !isNaN(parseFloat(gaAtBirth)) && parseFloat(gaAtBirth) < 37;
  let status;
  if (gainPerDay < 0) status = 'Weight_Loss';
  else if (isPreterm ? gainPerDay < 10 : gainPerDay < 20) status = 'Suboptimal';
  else status = 'Adequate';
  return { gainPerDay: gainPerDay.toFixed(1) + ' g/day', status };
}

function wflBadge(wfl) {
  if (!wfl) return '—';
  if (wfl.includes('SAM')) return <span style={PILL.sam}>SAM</span>;
  if (wfl.includes('MAM')) return <span style={PILL.mam}>MAM</span>;
  if (wfl.includes('Normal')) return <span style={PILL.normal}>Normal</span>;
  return wfl;
}
function wtGainBadge(status, val) {
  if (!status) return val || '—';
  const s = status === 'Adequate' ? PILL.normal : status === 'Suboptimal' ? PILL.subopt : PILL.loss;
  return <span style={s}>{val || status}</span>;
}

// ─── STYLES ─────────────────────────────────────────────────────
const C = {
  teal: '#1A6B6B', tealMid: '#2E8B8B', tealLight: '#E6F4F4', tealDark: '#0D4444',
  red: '#922B21', redLight: '#FDF2F2', amber: '#D97706', amberLight: '#FFFBEB',
  green: '#166534', greenLight: '#F0FDF4', slate: '#1E293B', slateMid: '#475569',
  slateLight: '#F8FAFC', border: '#E2E8F0', white: '#FFFFFF', bg: '#F0F5F5',
};
const PILL = {
  base: { display:'inline-flex', alignItems:'center', borderRadius:20, padding:'3px 10px', fontSize:'.72rem', fontWeight:600 },
  sam: { display:'inline-flex', alignItems:'center', borderRadius:20, padding:'3px 10px', fontSize:'.72rem', fontWeight:600, background:'#FEE2E2', color:'#991B1B' },
  mam: { display:'inline-flex', alignItems:'center', borderRadius:20, padding:'3px 10px', fontSize:'.72rem', fontWeight:600, background:'#FEF9C3', color:'#854D0E' },
  normal: { display:'inline-flex', alignItems:'center', borderRadius:20, padding:'3px 10px', fontSize:'.72rem', fontWeight:600, background:'#DCFCE7', color:'#166534' },
  subopt: { display:'inline-flex', alignItems:'center', borderRadius:20, padding:'3px 10px', fontSize:'.72rem', fontWeight:600, background:'#FFEDD5', color:'#9A3412' },
  loss: { display:'inline-flex', alignItems:'center', borderRadius:20, padding:'3px 10px', fontSize:'.72rem', fontWeight:600, background:'#FEE2E2', color:'#991B1B' },
  nrc: { display:'inline-flex', alignItems:'center', borderRadius:20, padding:'3px 10px', fontSize:'.72rem', fontWeight:600, background:'#EDE9FE', color:'#5B21B6' },
};

const s = {
  page: { fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: C.bg, minHeight: '100vh', color: C.slate, fontSize: 14 },
  topnav: { background: C.tealDark, color: '#fff', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', height:56, position:'sticky', top:0, zIndex:100, boxShadow:'0 2px 12px rgba(0,0,0,.25)' },
  tabbar: { background: C.teal, display:'flex', padding:'0 24px', borderBottom:`3px solid ${C.tealDark}` },
  main: { maxWidth:1280, margin:'0 auto', padding:'24px 24px 40px' },
  card: { background:'#fff', borderRadius:16, boxShadow:'0 1px 3px rgba(0,0,0,.08)', border:`1px solid ${C.border}`, overflow:'hidden', marginBottom:20 },
  cardHeader: { padding:'14px 20px', background:`linear-gradient(135deg,${C.teal} 0%,${C.tealMid} 100%)`, color:'#fff', display:'flex', alignItems:'center', gap:10 },
  cardBody: { padding:20 },
  input: { border:`1.5px solid ${C.border}`, borderRadius:7, padding:'7px 10px', fontFamily:'inherit', fontSize:'.82rem', color:C.slate, background:'#FAFCFC', outline:'none', width:'100%', boxSizing:'border-box' },
  computed: { border:`1.5px solid ${C.border}`, borderRadius:7, padding:'7px 10px', fontFamily:"'DM Mono', monospace", fontSize:'.78rem', color:C.tealDark, background:C.tealLight, outline:'none', width:'100%', boxSizing:'border-box', fontWeight:500 },
  label: { fontSize:'.7rem', fontWeight:600, color:C.slateMid, letterSpacing:'.04em', textTransform:'uppercase', display:'block', marginBottom:4 },
  btnPrimary: { display:'inline-flex', alignItems:'center', gap:7, background:C.teal, color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontFamily:'inherit', fontWeight:600, fontSize:'.85rem', padding:'10px 22px' },
  btnSecondary: { display:'inline-flex', alignItems:'center', gap:7, background:C.tealLight, color:C.teal, border:`1.5px solid rgba(26,107,107,.2)`, borderRadius:8, cursor:'pointer', fontFamily:'inherit', fontWeight:600, fontSize:'.82rem', padding:'9px 18px' },
  btnDanger: { display:'inline-flex', alignItems:'center', gap:7, background:'#FEE2E2', color:C.red, border:'1.5px solid #FECACA', borderRadius:8, cursor:'pointer', fontFamily:'inherit', fontWeight:600, fontSize:'.78rem', padding:'7px 14px' },
  btnAI: { display:'inline-flex', alignItems:'center', gap:7, background:'linear-gradient(135deg,#7C3AED,#4F46E5)', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontFamily:'inherit', fontWeight:600, fontSize:'.85rem', padding:'10px 20px' },
  btnSm: { padding:'6px 12px', fontSize:'.75rem' },
  kpiGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:14, marginBottom:24 },
  chartsGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:18, marginBottom:24 },
  tableWrap: { overflowX:'auto', borderRadius:10, border:`1px solid ${C.border}` },
};

// ─── FORM INITIAL STATE ─────────────────────────────────────────
function emptyForm() {
  return {
    childName:'', sncuId:'', motherName:'', dob:'', sex:'', gaAtBirth:'', birthWeight:'',
    sncuAdmDate:'', sncuDiscDate:'', discWeight:'', discFeeding:'',
    visitNo:'', visitDate:'', reviewer:'', weightToday:'', lengthToday:'', muac:'',
    prevWeight:'', prevDate:'', wfa:'', wfl:'', lfa:'',
    feedingType:'', feedMode:'', feedFreq:'',
    bfLatch:false, bfLowSupply:false, bfNipple:false, bfInfreq:false, bfTires:false, bfRefuses:false, bfNone:false,
    illness7d:'', illnessDesc:'',
    sxFever:false, sxCough:false, sxDiarrhea:false, sxVomiting:false, sxFeedDiff:false, sxJaundice:false, sxBreathing:false, sxLethargy:false, sxSeizures:false, sxNone:false,
    lactInsuff:false, lactPainful:false, lactUnwell:false, lactSep:false, lactNone:false,
    referralNeeded:'', refNRC:'', refDEIC:'', refPICU:'', refReason:'', refNote:'', counseling:'',
    nrcAdmitted:'', nrcAdmDate:'', nextVisitSched:'', nextVisitDate:'', specialInstr:'',
    dataCollector:'', remarks:'',
  };
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function SncuFollowUpSystem() {
  const [tab, setTab] = useState('dashboard');
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState({ show:false, msg:'', type:'success' });
  const [apiKey, setApiKey] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [viewRecord, setViewRecord] = useState(null);
  const [search, setSearch] = useState('');
  const [filterVisit, setFilterVisit] = useState('');
  const [filterNutr, setFilterNutr] = useState('');
  const [filterNRC, setFilterNRC] = useState('');

  // Computed fields
  const [chronoAge, setChronoAge] = useState('');
  const [correctedAge, setCorrectedAge] = useState('');
  const [wtGainPerDay, setWtGainPerDay] = useState('');
  const [wtGainStatus, setWtGainStatus] = useState('');
  const [nrcAlert, setNrcAlert] = useState('');
  const [wtAlert, setWtAlert] = useState('');

  const chartRefs = { nutrition: useRef(null), wtGain: useRef(null), feeding: useRef(null), visit: useRef(null) };
  const chartInstances = useRef({});
  const toastTimer = useRef(null);

  // Load from localStorage on mount
  useEffect(() => { setRecords(getRecords()); }, []);

  // Auto-calc ages
  useEffect(() => {
    const { chronoAge: ca, correctedAge: co } = calcAgesUtil(form.dob, form.visitDate, form.gaAtBirth);
    setChronoAge(ca); setCorrectedAge(co);
  }, [form.dob, form.visitDate, form.gaAtBirth]);

  // Auto-calc weight gain
  useEffect(() => {
    const { gainPerDay, status } = calcWtGainUtil(form.weightToday, form.prevWeight, form.prevDate, form.visitDate, form.gaAtBirth);
    setWtGainPerDay(gainPerDay); setWtGainStatus(status);
    if (status === 'Weight_Loss') setWtAlert('Weight loss detected! Assess breastfeeding technique, check for infection, consider feeding volume increase.');
    else if (status === 'Suboptimal') setWtAlert('Suboptimal weight gain. Assess breastfeeding technique, check for infection, consider feeding volume increase.');
    else setWtAlert('');
  }, [form.weightToday, form.prevWeight, form.prevDate, form.visitDate, form.gaAtBirth]);

  // NRC alert logic
  useEffect(() => {
    const lact = form.lactInsuff || form.lactPainful || form.lactUnwell || form.lactSep;
    if (form.wfl === 'SAM (<−3SD)') {
      let ageMonths = null;
      if (form.dob && form.visitDate) ageMonths = (new Date(form.visitDate) - new Date(form.dob)) / 86400000 / 30.4;
      const under6 = ageMonths !== null && ageMonths < 6;
      const over6 = ageMonths !== null && ageMonths >= 6;
      if (under6 && (form.illness7d === 'Yes' || lact)) {
        setNrcAlert('critical');
        setForm(f => ({ ...f, refNRC:'Yes', referralNeeded:'Yes' }));
      } else if (over6 && form.illness7d === 'Yes') {
        setNrcAlert('critical');
        setForm(f => ({ ...f, refNRC:'Yes', referralNeeded:'Yes' }));
      } else {
        setNrcAlert('warn');
      }
    } else {
      setNrcAlert('');
    }
  }, [form.wfl, form.illness7d, form.lactInsuff, form.lactPainful, form.lactUnwell, form.lactSep, form.dob, form.visitDate]);

  // Charts
  useEffect(() => {
    if (tab === 'dashboard') renderCharts(records);
  }, [tab, records]);

  // Toast helper
  const showToast = useCallback((msg, type='success') => {
    setToast({ show:true, msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show:false })), 3000);
  }, []);

  // ── Field change handler ────────────────────────────────────
  const setField = (name, val) => setForm(f => ({ ...f, [name]: val }));

  // ── Save record ─────────────────────────────────────────────
  const saveRecord = () => {
    const req = { childName: form.childName, sncuId: form.sncuId, dob: form.dob, sex: form.sex, visitNo: form.visitNo, visitDate: form.visitDate, weightToday: form.weightToday, wfl: form.wfl };
    for (const [, v] of Object.entries(req)) {
      if (!v) { showToast('Please fill all required fields (*)', 'error'); return; }
    }
    const rec = {
      id: editId || Date.now().toString(),
      ts: new Date().toISOString(),
      ...form,
      chronoAge, correctedAge, wtGainPerDay, wtGainStatus,
    };
    const recs = getRecords();
    if (editId) {
      const idx = recs.findIndex(r => r.id === editId);
      if (idx > -1) recs[idx] = rec; else recs.push(rec);
      showToast('Record updated!', 'success');
    } else {
      recs.push(rec);
      showToast('Record saved!', 'success');
    }
    saveRecords(recs);
    setRecords(recs);
    resetForm();
    setTab('dashboard');
  };

  const editRecordById = (id) => {
    const recs = getRecords();
    const r = recs.find(x => x.id === id);
    if (!r) return;
    const f = emptyForm();
    Object.keys(f).forEach(k => { if (r[k] !== undefined) f[k] = r[k]; });
    setForm(f);
    setEditId(id);
    setTab('entry');
  };

  const deleteRecord = (id) => {
    if (!confirm('Delete this record? This cannot be undone.')) return;
    const recs = getRecords().filter(r => r.id !== id);
    saveRecords(recs);
    setRecords(recs);
    showToast('Record deleted.');
  };

  const resetForm = () => {
    setForm(emptyForm());
    setEditId(null);
    setChronoAge(''); setCorrectedAge(''); setWtGainPerDay(''); setWtGainStatus('');
    setWtAlert(''); setNrcAlert('');
  };

  // ── Charts ──────────────────────────────────────────────────
  function renderCharts(records) {
    if (!Chart) return;

    const destroyAndCreate = (id, ref, config) => {
      if (chartInstances.current[id]) { chartInstances.current[id].destroy(); }
      if (ref.current) chartInstances.current[id] = new Chart(ref.current.getContext('2d'), config);
    };

    const wflCounts = { 'SAM (<−3SD)':0, 'MAM (−2 to −3SD)':0, 'Normal (≥−2SD)':0, 'Not_Applicable':0 };
    records.forEach(r => { if (r.wfl && wflCounts[r.wfl] !== undefined) wflCounts[r.wfl]++; });
    destroyAndCreate('nutrition', chartRefs.nutrition, {
      type:'doughnut',
      data:{ labels:Object.keys(wflCounts), datasets:[{ data:Object.values(wflCounts), backgroundColor:['#DC2626','#D97706','#16A34A','#94A3B8'], borderWidth:2 }] },
      options:{ responsive:true, plugins:{ legend:{ position:'bottom', labels:{font:{size:10}} } } }
    });

    const wtGainCounts = { Adequate:0, Suboptimal:0, Weight_Loss:0 };
    records.forEach(r => { if (r.wtGainStatus && wtGainCounts[r.wtGainStatus] !== undefined) wtGainCounts[r.wtGainStatus]++; });
    destroyAndCreate('wtGain', chartRefs.wtGain, {
      type:'bar',
      data:{ labels:Object.keys(wtGainCounts), datasets:[{ data:Object.values(wtGainCounts), backgroundColor:['#16A34A','#D97706','#DC2626'], borderRadius:4 }] },
      options:{ responsive:true, plugins:{ legend:{display:false} }, scales:{ y:{ beginAtZero:true, ticks:{stepSize:1} } } }
    });

    const feedCounts = {};
    records.forEach(r => { if(r.feedingType) feedCounts[r.feedingType] = (feedCounts[r.feedingType]||0)+1; });
    const feedSorted = Object.entries(feedCounts).sort((a,b)=>b[1]-a[1]).slice(0,6);
    destroyAndCreate('feeding', chartRefs.feeding, {
      type:'bar',
      data:{ labels:feedSorted.map(([k])=>k.replace(/_/g,' ')), datasets:[{ data:feedSorted.map(([,v])=>v), backgroundColor:['#1A6B6B','#2E8B8B','#4AABAB','#68BFBF','#86D3D3','#A4E7E7'], borderRadius:4 }] },
      options:{ responsive:true, plugins:{ legend:{display:false} }, scales:{ y:{ beginAtZero:true, ticks:{stepSize:1} } } }
    });

    const visits = VISIT_OPTIONS.slice(0,5);
    destroyAndCreate('visit', chartRefs.visit, {
      type:'bar',
      data:{
        labels: visits.map(v=>v.replace(' days','d').replace(' month','m').replace(' months','m')),
        datasets:[
          { label:'Total', data: visits.map(v=>records.filter(r=>r.visitNo===v).length), backgroundColor:'rgba(26,107,107,0.7)', borderRadius:4 },
          { label:'NRC Ref', data: visits.map(v=>records.filter(r=>r.visitNo===v && r.refNRC==='Yes').length), backgroundColor:'rgba(124,58,237,0.7)', borderRadius:4 }
        ]
      },
      options:{ responsive:true, plugins:{ legend:{ position:'bottom', labels:{font:{size:10}} } }, scales:{ y:{ beginAtZero:true, ticks:{stepSize:1} } } }
    });
  }

  // ── AI Insights ─────────────────────────────────────────────
  function buildDataSummary() {
    if (!records.length) return 'No data available yet.';
    const total = records.length;
    const sam = records.filter(r=>r.wfl==='SAM (<−3SD)');
    const mam = records.filter(r=>r.wfl==='MAM (−2 to −3SD)');
    const nrcRef = records.filter(r=>r.refNRC==='Yes');
    const subopt = records.filter(r=>r.wtGainStatus==='Suboptimal'||r.wtGainStatus==='Weight_Loss');
    const excBF = records.filter(r=>r.feedingType==='Only_Mothers_Milk');
    const bfLabels = {bfLatch:'Latching',bfLowSupply:'Low supply',bfNipple:'Nipple pain',bfInfreq:'Infrequent',bfTires:'Baby tires',bfRefuses:'Baby refuses'};
    const bfDiffCounts = {};
    records.forEach(r => { Object.keys(bfLabels).forEach(k => { if(r[k]) bfDiffCounts[bfLabels[k]]=(bfDiffCounts[bfLabels[k]]||0)+1; }); });
    const samCases = sam.slice(0,5).map(r=>`Child:${r.childName}, Age:${r.chronoAge||'?'}, Illness:${r.illness7d||'?'}, NRC:${r.refNRC||'?'}`).join('; ');
    return `SNCU FOLLOW-UP DATA SUMMARY (${new Date().toLocaleDateString()}):
Total visits: ${total} | Unique children: ${new Set(records.map(r=>r.sncuId)).size}
SAM cases: ${sam.length} (${((sam.length/total)*100).toFixed(1)}%) | MAM cases: ${mam.length} (${((mam.length/total)*100).toFixed(1)}%)
Suboptimal/weight loss: ${subopt.length} | Exclusive breastfeeding: ${excBF.length} (${((excBF.length/total)*100).toFixed(1)}%)
NRC referred: ${nrcRef.length} | DEIC referred: ${records.filter(r=>r.refDEIC==='Yes').length}
BF difficulties: ${Object.entries(bfDiffCounts).map(([k,v])=>`${k}(n=${v})`).join(', ')||'none recorded'}
SAM case details (up to 5): ${samCases||'none'}
Visit distribution: ${VISIT_OPTIONS.slice(0,5).map(v=>`${v}:${records.filter(r=>r.visitNo===v).length}`).join(', ')}`;
  }

  async function runPrompt(presetPrompt) {
    if (!apiKey) { showToast('Please enter your Gemini API key in the top bar.', 'error'); return; }
    if (!records.length) { showToast('No data to analyse. Add some records first.', 'error'); return; }
    const prompt = presetPrompt || aiCustomPrompt;
    if (!prompt) { showToast('Please enter a question.', 'error'); return; }
    setAiLoading(true); setAiError(false); setAiResponse('✨ Analysing data with Gemini…');
    const dataSummary = buildDataSummary();
    const systemContext = `You are a clinical nutrition expert and SNCU quality improvement specialist supporting BRD Medical College – UNICEF partnership in Gorakhpur, UP. Given a statistical summary of SNCU graduate follow-up data, provide specific, actionable, evidence-based clinical insights. Use clear structure with headers. Be concise but comprehensive. Flag urgent concerns prominently.`;
    const fullPrompt = `${systemContext}\n\nDATA:\n${dataSummary}\n\nQUESTION: ${prompt}`;
    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ contents:[{ parts:[{ text:fullPrompt }] }], generationConfig:{ temperature:0.3, maxOutputTokens:1200 } })
      });
      if (!resp.ok) { const e = await resp.json(); throw new Error(e.error?.message || `HTTP ${resp.status}`); }
      const data = await resp.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
      setAiResponse(text); setAiLoading(false);
    } catch(e) {
      setAiError(true); setAiResponse(`❌ Error: ${e.message}\n\nCheck your API key and ensure Gemini API is enabled.`); setAiLoading(false);
    }
  }

  // ── Export CSV ──────────────────────────────────────────────
  function exportCSV() {
    if (!records.length) { showToast('No data to export.', 'error'); return; }
    const headers = ['ID','Child_Name','SNCU_ID','DOB','Sex','GA_Birth_Wks','Visit_No','Visit_Date','Chrono_Age','Wt_Today_g','Wt_Gain_g_day','Wt_Gain_Status','WFL_Status','Feeding_Type','Ref_NRC','Remarks'];
    const rows = records.map(r => [r.id,r.childName,r.sncuId,r.dob,r.sex,r.gaAtBirth,r.visitNo,r.visitDate,r.chronoAge,r.weightToday,r.wtGainPerDay,r.wtGainStatus,r.wfl,r.feedingType,r.refNRC,r.remarks].map(v=>`"${(v||'').toString().replace(/"/g,'""')}"`));
    const csv = [headers.join(','), ...rows.map(r=>r.join(','))].join('\n');
    const blob = new Blob([csv], { type:'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `SNCU_Export_${new Date().toISOString().slice(0,10)}.csv`; a.click();
    showToast('CSV exported!', 'success');
  }

  // ── Filtered records ────────────────────────────────────────
  const filtered = records.filter(r => {
    if (search && !r.childName?.toLowerCase().includes(search.toLowerCase()) && !r.sncuId?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterVisit && r.visitNo !== filterVisit) return false;
    if (filterNutr && r.wfl !== filterNutr) return false;
    if (filterNRC && r.refNRC !== filterNRC) return false;
    return true;
  }).sort((a,b)=>new Date(b.ts)-new Date(a.ts));

  // ── KPIs ────────────────────────────────────────────────────
  const total = records.length;
  const sam = records.filter(r=>r.wfl==='SAM (<−3SD)').length;
  const mam = records.filter(r=>r.wfl==='MAM (−2 to −3SD)').length;
  const nrcRef = records.filter(r=>r.refNRC==='Yes').length;
  const deicRef = records.filter(r=>r.refDEIC==='Yes').length;
  const subopt = records.filter(r=>r.wtGainStatus==='Suboptimal'||r.wtGainStatus==='Weight_Loss').length;
  const excBF = records.filter(r=>r.feedingType==='Only_Mothers_Milk').length;
  const uniqueKids = new Set(records.map(r=>r.sncuId)).size;

  const kpis = [
    { label:'Total Visits', value:total, icon:'📊', color:'#1A6B6B', sub:`${uniqueKids} unique children` },
    { label:'SAM Cases', value:sam, icon:'🚨', color:'#DC2626', sub:`${total?((sam/total)*100).toFixed(0):0}% of visits` },
    { label:'MAM Cases', value:mam, icon:'⚠️', color:'#D97706', sub:`${total?((mam/total)*100).toFixed(0):0}% of visits` },
    { label:'NRC Referred', value:nrcRef, icon:'🏥', color:'#7C3AED', sub:`${total?((nrcRef/total)*100).toFixed(0):0}% referral rate` },
    { label:'DEIC Referred', value:deicRef, icon:'🏫', color:'#2980B1', sub:'Early intervention' },
    { label:'Suboptimal Gain', value:subopt, icon:'⚖️', color:'#9A3412', sub:'Wt loss or suboptimal' },
    { label:'Exclusive BF', value:excBF, icon:'🍼', color:'#166534', sub:`${total?((excBF/total)*100).toFixed(0):0}% on mothers milk` },
  ];

  // ── Auto-flagged cases ──────────────────────────────────────
  const flagged = records.map(r => {
    const issues = [];
    if (r.wfl==='SAM (<−3SD)') issues.push({ type:'sam', msg:'SAM detected — check NRC referral criteria' });
    if (r.wtGainStatus==='Weight_Loss') issues.push({ type:'loss', msg:'Weight loss since last visit' });
    if (r.wtGainStatus==='Suboptimal') issues.push({ type:'subopt', msg:'Suboptimal weight gain' });
    if (r.refNRC==='Yes' && r.nrcAdmitted==='Pending') issues.push({ type:'nrc', msg:'NRC referral pending admission' });
    return issues.length ? { r, issues } : null;
  }).filter(Boolean);

  // ── Select helper ───────────────────────────────────────────
  const Select = ({ id, value, onChange, options, placeholder = 'Select…' }) => (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ ...s.input, cursor:'pointer', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231A6B6B' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 10px center', paddingRight:28, appearance:'none' }}
    >
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o.replace(/_/g,' ')}</option>)}
    </select>
  );

  const FG = ({ label, req, children, span }) => (
    <div style={{ display:'flex', flexDirection:'column', gap:4, gridColumn: span ? `span ${span}` : undefined }}>
      <label style={s.label}>{label}{req && <span style={{ color:C.red }}> *</span>}</label>
      {children}
    </div>
  );

  const SectionLabel = ({ children }) => (
    <div style={{ fontSize:'.7rem', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:C.teal, margin:'20px 0 10px', display:'flex', alignItems:'center', gap:8 }}>
      {children}
      <div style={{ flex:1, height:1, background:C.tealLight }} />
    </div>
  );

  // ── RENDER ──────────────────────────────────────────────────
  return (
    <div style={s.page}>
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');*{box-sizing:border-box}`}</style>

      {/* TOP NAV */}
      <nav style={s.topnav}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:34, height:34, borderRadius:8, background:C.tealMid, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700 }}>🏥</div>
          <div>
            <div style={{ fontSize:'1rem', fontWeight:600 }}>SNCU Graduate Follow-Up System</div>
            <div style={{ fontSize:'.72rem', color:'#B2DFDB' }}>BRD Medical College, Gorakhpur · UNICEF-BRD Partnership</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,.1)', borderRadius:7, padding:'4px 10px' }}>
          <label style={{ fontSize:'.72rem', color:'#B2DFDB', whiteSpace:'nowrap' }}>🔑 Gemini API Key:</label>
          <input type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="Paste your API key here…" style={{ background:'transparent', border:'none', outline:'none', color:'#fff', fontSize:'.78rem', width:210 }} />
        </div>
      </nav>

      {/* TAB BAR */}
      <div style={s.tabbar}>
        {[['dashboard','📊 Dashboard'],['entry','➕ New Entry'],['records','📋 All Records'],['ai','🤖 AI Insights']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ background:'transparent', border:'none', cursor:'pointer', color: tab===id ? '#fff' : 'rgba(255,255,255,.65)', fontFamily:'inherit', fontSize:'.82rem', fontWeight: tab===id ? 600 : 500, padding:'12px 20px', position:'relative', letterSpacing:'.02em' }}>
            {label}
            {tab===id && <div style={{ position:'absolute', bottom:-3, left:0, right:0, height:3, background:'#4DD0E1', borderRadius:'2px 2px 0 0' }} />}
          </button>
        ))}
      </div>

      <div style={s.main}>

        {/* ═══ DASHBOARD ═══ */}
        {tab === 'dashboard' && (
          <div>
            <div style={s.kpiGrid}>
              {kpis.map(k => (
                <div key={k.label} style={{ background:'#fff', borderRadius:16, border:`1px solid ${C.border}`, padding:'16px 18px', boxShadow:'0 1px 3px rgba(0,0,0,.08)', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:k.color }} />
                  <div style={{ fontSize:'1.3rem', marginBottom:8 }}>{k.icon}</div>
                  <div style={{ fontSize:'2rem', fontWeight:700, color:k.color, lineHeight:1 }}>{k.value}</div>
                  <div style={{ fontSize:'.72rem', color:C.slateMid, fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em', marginTop:4 }}>{k.label}</div>
                  <div style={{ fontSize:'.68rem', color:'#94A3B8', marginTop:2 }}>{k.sub}</div>
                </div>
              ))}
            </div>
            <div style={s.chartsGrid}>
              {[
                { title:'📈 Nutritional Status (W/L)', ref:chartRefs.nutrition, id:'nutrition' },
                { title:'⚖️ Weight Gain Status', ref:chartRefs.wtGain, id:'wtGain' },
                { title:'🍼 Feeding Type (Last 24 hrs)', ref:chartRefs.feeding, id:'feeding' },
                { title:'🔄 Referrals by Visit Number', ref:chartRefs.visit, id:'visit' },
              ].map(c => (
                <div key={c.id} style={{ background:'#fff', borderRadius:16, border:`1px solid ${C.border}`, padding:18, boxShadow:'0 1px 3px rgba(0,0,0,.08)' }}>
                  <div style={{ fontSize:'.8rem', fontWeight:700, color:C.slate, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:16 }}>{c.title}</div>
                  <canvas ref={c.ref} height={200} />
                </div>
              ))}
            </div>
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span>🕐</span><h2 style={{ fontSize:'.95rem', fontWeight:600, margin:0 }}>Recent Entries</h2>
                <span style={{ background:'rgba(255,255,255,.2)', borderRadius:20, padding:'2px 10px', fontSize:'.72rem', fontWeight:500 }}>{records.length} records</span>
              </div>
              <div style={{ padding:0 }}>
                <div style={s.tableWrap}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.78rem' }}>
                    <thead>
                      <tr>{['Child','Visit Date','Visit No.','Wt (g)','W/L Status','Wt Gain','NRC Ref.','Actions'].map(h => (
                        <th key={h} style={{ background:C.tealDark, color:'#fff', padding:'10px 12px', textAlign:'left', fontWeight:600, letterSpacing:'.04em', fontSize:'.7rem', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {[...records].sort((a,b)=>new Date(b.ts)-new Date(a.ts)).slice(0,10).map(r => (
                        <tr key={r.id} style={{ borderBottom:`1px solid ${C.border}` }}>
                          <td style={{ padding:'9px 12px' }}><strong>{r.childName}</strong><br/><span style={{ color:C.slateMid, fontSize:'.72rem' }}>{r.sncuId}</span></td>
                          <td style={{ padding:'9px 12px' }}>{r.visitDate||'—'}</td>
                          <td style={{ padding:'9px 12px' }}>{r.visitNo||'—'}</td>
                          <td style={{ padding:'9px 12px' }}>{r.weightToday ? Number(r.weightToday).toLocaleString() : '—'}</td>
                          <td style={{ padding:'9px 12px' }}>{wflBadge(r.wfl)}</td>
                          <td style={{ padding:'9px 12px' }}>{wtGainBadge(r.wtGainStatus, r.wtGainPerDay)}</td>
                          <td style={{ padding:'9px 12px' }}>{r.refNRC==='Yes' ? <span style={PILL.nrc}>🏥 NRC</span> : '—'}</td>
                          <td style={{ padding:'9px 12px' }}>
                            <div style={{ display:'flex', gap:5 }}>
                              <button style={{ ...s.btnSecondary, ...s.btnSm }} onClick={()=>setViewRecord(r)}>👁</button>
                              <button style={{ ...s.btnSecondary, ...s.btnSm }} onClick={()=>editRecordById(r.id)}>✏️</button>
                              <button style={{ ...s.btnDanger, ...s.btnSm }} onClick={()=>deleteRecord(r.id)}>🗑</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {!records.length && <tr><td colSpan={8} style={{ padding:'40px 20px', textAlign:'center', color:C.slateMid }}>📭 No records yet. <button style={{ ...s.btnSecondary, ...s.btnSm }} onClick={()=>setTab('entry')}>Add your first entry</button></td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ ENTRY ═══ */}
        {tab === 'entry' && (
          <div style={s.card}>
            <div style={s.cardHeader}>
              <span>📝</span>
              <h2 style={{ fontSize:'.95rem', fontWeight:600, margin:0 }}>{editId ? `Edit Record — ${form.childName}` : 'New Follow-Up Entry'}</h2>
              <span style={{ background:'rgba(255,255,255,.2)', borderRadius:20, padding:'2px 10px', fontSize:'.72rem' }}>{editId ? 'Editing' : 'New Record'}</span>
            </div>
            <div style={s.cardBody}>

              <SectionLabel>Section 1 · Child Identification & SNCU History</SectionLabel>
              <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(4,1fr)' }}>
                <FG label="Child Name" req span={2}><input style={s.input} value={form.childName} onChange={e=>setField('childName',e.target.value)} placeholder="First name or full name" /></FG>
                <FG label="SNCU ID" req><input style={s.input} value={form.sncuId} onChange={e=>setField('sncuId',e.target.value)} placeholder="e.g. SNCU2024001" /></FG>
                <FG label="Date of Birth" req><input type="date" style={s.input} value={form.dob} onChange={e=>setField('dob',e.target.value)} /></FG>
                <FG label="Mother's Name" span={2}><input style={s.input} value={form.motherName} onChange={e=>setField('motherName',e.target.value)} /></FG>
                <FG label="Sex" req><Select value={form.sex} onChange={v=>setField('sex',v)} options={['Male','Female','Ambiguous']} /></FG>
                <FG label="GA at Birth (weeks)"><input type="number" style={s.input} value={form.gaAtBirth} onChange={e=>setField('gaAtBirth',e.target.value)} min={24} max={42} placeholder="e.g. 32" /></FG>
                <FG label="Birth Weight (g)"><input type="number" style={s.input} value={form.birthWeight} onChange={e=>setField('birthWeight',e.target.value)} min={400} max={5000} /></FG>
                <FG label="SNCU Admission Date"><input type="date" style={s.input} value={form.sncuAdmDate} onChange={e=>setField('sncuAdmDate',e.target.value)} /></FG>
                <FG label="SNCU Discharge Date"><input type="date" style={s.input} value={form.sncuDiscDate} onChange={e=>setField('sncuDiscDate',e.target.value)} /></FG>
                <FG label="Discharge Weight (g)"><input type="number" style={s.input} value={form.discWeight} onChange={e=>setField('discWeight',e.target.value)} /></FG>
                <FG label="Discharge Feeding" span={2}><Select value={form.discFeeding} onChange={v=>setField('discFeeding',v)} options={DISC_FEEDING_OPTIONS} /></FG>
              </div>

              <SectionLabel>Section 2 · Visit Details & Anthropometry</SectionLabel>
              <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(4,1fr)' }}>
                <FG label="Visit Number" req><Select value={form.visitNo} onChange={v=>setField('visitNo',v)} options={VISIT_OPTIONS} /></FG>
                <FG label="Visit Date" req><input type="date" style={s.input} value={form.visitDate} onChange={e=>setField('visitDate',e.target.value)} /></FG>
                <FG label="Chronological Age (Days)"><input style={s.computed} readOnly value={chronoAge} /></FG>
                <FG label="Corrected Age (Weeks)"><input style={s.computed} readOnly value={correctedAge} /></FG>
                <FG label="Weight Today (g)" req><input type="number" style={s.input} value={form.weightToday} onChange={e=>setField('weightToday',e.target.value)} min={400} max={15000} /></FG>
                <FG label="Length Today (cm)"><input type="number" style={s.input} value={form.lengthToday} onChange={e=>setField('lengthToday',e.target.value)} step={0.1} /></FG>
                <FG label="MUAC (cm)"><input type="number" style={s.input} value={form.muac} onChange={e=>setField('muac',e.target.value)} step={0.1} /></FG>
                <FG label="Reviewer Name"><input style={s.input} value={form.reviewer} onChange={e=>setField('reviewer',e.target.value)} /></FG>
                <FG label="Previous Visit Weight (g)"><input type="number" style={s.input} value={form.prevWeight} onChange={e=>setField('prevWeight',e.target.value)} /></FG>
                <FG label="Previous Visit Date"><input type="date" style={s.input} value={form.prevDate} onChange={e=>setField('prevDate',e.target.value)} /></FG>
                <FG label="Wt Gain (g/day)"><input style={s.computed} readOnly value={wtGainPerDay} /></FG>
                <FG label="Weight Gain Status"><input style={s.computed} readOnly value={wtGainStatus} /></FG>
              </div>
              {wtAlert && <div style={{ background:'#FFFBEB', border:'1.5px solid #D97706', color:'#92400E', borderRadius:8, padding:'10px 14px', fontSize:'.78rem', marginTop:10 }}>⚠️ <strong>{wtAlert.includes('loss') ? 'Weight loss detected!' : 'Suboptimal weight gain.'}</strong> {wtAlert}</div>}

              <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(3,1fr)', marginTop:12 }}>
                <FG label="Weight-for-Age"><Select value={form.wfa} onChange={v=>setField('wfa',v)} options={WFA_OPTIONS} /></FG>
                <FG label="Weight-for-Length ★" req><Select value={form.wfl} onChange={v=>setField('wfl',v)} options={WFL_OPTIONS} /></FG>
                <FG label="Length-for-Age"><Select value={form.lfa} onChange={v=>setField('lfa',v)} options={LFA_OPTIONS} /></FG>
              </div>
              {nrcAlert === 'critical' && <div style={{ background:'#FEF2F2', border:'1.5px solid #DC2626', color:'#991B1B', borderRadius:8, padding:'10px 14px', fontSize:'.78rem', marginTop:8 }}>🚨 <strong>NRC REFERRAL CRITERIA MET</strong> — Refer to NRC immediately.</div>}
              {nrcAlert === 'warn' && <div style={{ background:'#FFFBEB', border:'1.5px solid #D97706', color:'#92400E', borderRadius:8, padding:'10px 14px', fontSize:'.78rem', marginTop:8 }}>⚠️ <strong>SAM detected.</strong> Monitor for complications. NRC referral required if medical complication or lactation challenge present.</div>}

              <SectionLabel>Section 3 · Feeding Assessment — Last 24 Hours</SectionLabel>
              <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(3,1fr)' }}>
                <FG label="What was fed?"><Select value={form.feedingType} onChange={v=>setField('feedingType',v)} options={FEEDING_TYPE_OPTIONS} /></FG>
                <FG label="Feeding Mode"><Select value={form.feedMode} onChange={v=>setField('feedMode',v)} options={FEEDING_MODE_OPTIONS} /></FG>
                <FG label="Feeding Frequency (feeds/24h)"><input type="number" style={s.input} value={form.feedFreq} onChange={e=>setField('feedFreq',e.target.value)} min={0} max={20} /></FG>
              </div>
              <div style={{ marginTop:10 }}>
                <label style={s.label}>Breastfeeding Difficulties (check all that apply)</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'6px 12px', marginTop:4 }}>
                  {[['bfLatch','Latching difficulty'],['bfLowSupply','Low milk supply'],['bfNipple','Nipple pain/cracked'],['bfInfreq','Infrequent feeding (<8×/day)'],['bfTires','Baby tires at breast'],['bfRefuses','Baby refuses breast'],['bfNone','No difficulties']].map(([k,l])=>(
                    <label key={k} style={{ display:'flex', alignItems:'center', gap:5, cursor:'pointer', fontSize:'.78rem' }}>
                      <input type="checkbox" checked={form[k]} onChange={e=>setField(k,e.target.checked)} style={{ accentColor:C.teal }} />{l}
                    </label>
                  ))}
                </div>
              </div>

              <SectionLabel>Section 4 · Clinical Status & Lactation</SectionLabel>
              <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(4,1fr)' }}>
                <FG label="Illness Last 7 Days?"><Select value={form.illness7d} onChange={v=>setField('illness7d',v)} options={['No','Yes']} /></FG>
                <FG label="Illness Description (if Yes)" span={3}><input style={s.input} value={form.illnessDesc} onChange={e=>setField('illnessDesc',e.target.value)} placeholder="Describe illness…" /></FG>
              </div>
              <div style={{ marginTop:10 }}>
                <label style={s.label}>Current Symptoms (check all that apply)</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'6px 12px', marginTop:4 }}>
                  {[['sxFever','Fever'],['sxCough','Cough/Cold'],['sxDiarrhea','Diarrhea'],['sxVomiting','Vomiting'],['sxFeedDiff','Not feeding well'],['sxJaundice','Jaundice'],['sxBreathing','Breathing difficulty'],['sxLethargy','Lethargy'],['sxSeizures','Seizures'],['sxNone','None']].map(([k,l])=>(
                    <label key={k} style={{ display:'flex', alignItems:'center', gap:5, cursor:'pointer', fontSize:'.78rem' }}>
                      <input type="checkbox" checked={form[k]} onChange={e=>setField(k,e.target.checked)} style={{ accentColor:C.teal }} />{l}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ marginTop:10 }}>
                <label style={s.label}>Lactation Challenges (check all that apply)</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'6px 12px', marginTop:4 }}>
                  {[['lactInsuff','Insufficient milk production'],['lactPainful','Painful breastfeeding'],['lactUnwell','Mother unwell/on medication'],['lactSep','Mother separated from baby'],['lactNone','None']].map(([k,l])=>(
                    <label key={k} style={{ display:'flex', alignItems:'center', gap:5, cursor:'pointer', fontSize:'.78rem' }}>
                      <input type="checkbox" checked={form[k]} onChange={e=>setField(k,e.target.checked)} style={{ accentColor:C.teal }} />{l}
                    </label>
                  ))}
                </div>
              </div>

              <SectionLabel>Section 5 · Referral Decision</SectionLabel>
              <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(4,1fr)' }}>
                <FG label="Referral Needed?"><Select value={form.referralNeeded} onChange={v=>setField('referralNeeded',v)} options={['No','Yes']} /></FG>
                <FG label="Referral to NRC?"><Select value={form.refNRC} onChange={v=>setField('refNRC',v)} options={['No','Yes']} /></FG>
                <FG label="Referral to DEIC?"><Select value={form.refDEIC} onChange={v=>setField('refDEIC',v)} options={['No','Yes']} /></FG>
                <FG label="Referral to PICU?"><Select value={form.refPICU} onChange={v=>setField('refPICU',v)} options={['No','Yes']} /></FG>
                <FG label="Reason for Referral" span={2}><input style={s.input} value={form.refReason} onChange={e=>setField('refReason',e.target.value)} /></FG>
                <FG label="Referral Note Given?"><Select value={form.refNote} onChange={v=>setField('refNote',v)} options={['No','Yes']} /></FG>
                <FG label="Counseling Done?"><Select value={form.counseling} onChange={v=>setField('counseling',v)} options={['No','Yes']} /></FG>
                <FG label="NRC Admitted?"><Select value={form.nrcAdmitted} onChange={v=>setField('nrcAdmitted',v)} options={['No','Yes','Pending']} /></FG>
                <FG label="NRC Admission Date"><input type="date" style={s.input} value={form.nrcAdmDate} onChange={e=>setField('nrcAdmDate',e.target.value)} /></FG>
              </div>

              <SectionLabel>Section 6 · Follow-Up Plan & Sign-Off</SectionLabel>
              <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(4,1fr)' }}>
                <FG label="Next Visit Scheduled?"><Select value={form.nextVisitSched} onChange={v=>setField('nextVisitSched',v)} options={['No','Yes']} /></FG>
                <FG label="Date of Next Visit"><input type="date" style={s.input} value={form.nextVisitDate} onChange={e=>setField('nextVisitDate',e.target.value)} /></FG>
                <FG label="Special Instructions" span={2}><input style={s.input} value={form.specialInstr} onChange={e=>setField('specialInstr',e.target.value)} /></FG>
                <FG label="Data Collector Name"><input style={s.input} value={form.dataCollector} onChange={e=>setField('dataCollector',e.target.value)} /></FG>
                <FG label="Remarks" span={3}><textarea style={{ ...s.input, minHeight:60, resize:'vertical' }} value={form.remarks} onChange={e=>setField('remarks',e.target.value)} rows={2} /></FG>
              </div>

              <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:22, flexWrap:'wrap' }}>
                <button style={s.btnSecondary} onClick={resetForm}>🗑 Clear Form</button>
                <button style={s.btnPrimary} onClick={saveRecord}>💾 Save Record</button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ RECORDS ═══ */}
        {tab === 'records' && (
          <div style={s.card}>
            <div style={s.cardHeader}>
              <span>📋</span><h2 style={{ fontSize:'.95rem', fontWeight:600, margin:0 }}>All Records</h2>
              <span style={{ background:'rgba(255,255,255,.2)', borderRadius:20, padding:'2px 10px', fontSize:'.72rem' }}>{filtered.length} of {records.length}</span>
            </div>
            <div style={{ padding:'14px 16px 8px' }}>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:14, alignItems:'center' }}>
                <input style={{ ...s.input, maxWidth:260 }} placeholder="🔍  Search by name, SNCU ID…" value={search} onChange={e=>setSearch(e.target.value)} />
                <select style={{ ...s.input, maxWidth:160 }} value={filterVisit} onChange={e=>setFilterVisit(e.target.value)}>
                  <option value="">All Visits</option>
                  {VISIT_OPTIONS.slice(0,5).map(o=><option key={o} value={o}>{o}</option>)}
                </select>
                <select style={{ ...s.input, maxWidth:200 }} value={filterNutr} onChange={e=>setFilterNutr(e.target.value)}>
                  <option value="">All Nutritional Status</option>
                  {['SAM (<−3SD)','MAM (−2 to −3SD)','Normal (≥−2SD)'].map(o=><option key={o} value={o}>{o}</option>)}
                </select>
                <select style={{ ...s.input, maxWidth:160 }} value={filterNRC} onChange={e=>setFilterNRC(e.target.value)}>
                  <option value="">All NRC Status</option>
                  <option value="Yes">NRC Referred</option>
                  <option value="No">Not Referred</option>
                </select>
                <button style={{ ...s.btnSecondary, ...s.btnSm }} onClick={exportCSV}>⬇ Export CSV</button>
                <button style={{ ...s.btnDanger, ...s.btnSm }} onClick={()=>{if(!confirm('DELETE ALL DATA?'))return;localStorage.removeItem(DB_KEY);setRecords([]);}}>🗑 Clear All</button>
              </div>
              <div style={s.tableWrap}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.78rem' }}>
                  <thead>
                    <tr>{['#','Child','SNCU ID','Visit Date','Visit No.','Wt (g)','Wt Gain','W/L Status','Feeding','NRC','Actions'].map(h=>(
                      <th key={h} style={{ background:C.tealDark, color:'#fff', padding:'10px 12px', textAlign:'left', fontWeight:600, fontSize:'.7rem', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {filtered.map((r,i)=>(
                      <tr key={r.id} style={{ borderBottom:`1px solid ${C.border}` }}>
                        <td style={{ padding:'9px 12px', fontFamily:'monospace', fontSize:'.7rem', color:C.slateMid }}>{(i+1).toString().padStart(3,'0')}</td>
                        <td style={{ padding:'9px 12px' }}><strong>{r.childName}</strong><br/><span style={{ color:C.slateMid, fontSize:'.72rem' }}>{r.sex||''} · {r.gaAtBirth ? r.gaAtBirth+'wk' : ''}</span></td>
                        <td style={{ padding:'9px 12px', fontFamily:'monospace', fontSize:'.75rem' }}>{r.sncuId}</td>
                        <td style={{ padding:'9px 12px' }}>{r.visitDate||'—'}</td>
                        <td style={{ padding:'9px 12px' }}>{r.visitNo||'—'}</td>
                        <td style={{ padding:'9px 12px' }}>{r.weightToday ? Number(r.weightToday).toLocaleString()+'g' : '—'}</td>
                        <td style={{ padding:'9px 12px' }}>{wtGainBadge(r.wtGainStatus, r.wtGainPerDay)}</td>
                        <td style={{ padding:'9px 12px' }}>{wflBadge(r.wfl)}</td>
                        <td style={{ padding:'9px 12px', fontSize:'.72rem' }}>{(r.feedingType||'—').replace(/_/g,' ')}</td>
                        <td style={{ padding:'9px 12px' }}>{r.refNRC==='Yes' ? <span style={PILL.nrc}>Yes</span> : <span style={{ color:'#94A3B8' }}>No</span>}</td>
                        <td style={{ padding:'9px 12px' }}>
                          <div style={{ display:'flex', gap:5 }}>
                            <button style={{ ...s.btnSecondary, ...s.btnSm }} onClick={()=>setViewRecord(r)}>👁</button>
                            <button style={{ ...s.btnSecondary, ...s.btnSm }} onClick={()=>editRecordById(r.id)}>✏️</button>
                            <button style={{ ...s.btnDanger, ...s.btnSm }} onClick={()=>deleteRecord(r.id)}>🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!filtered.length && <tr><td colSpan={11} style={{ padding:'40px 20px', textAlign:'center', color:C.slateMid }}>🔍 No records match your filters.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══ AI INSIGHTS ═══ */}
        {tab === 'ai' && (
          <div>
            <div style={{ background:'linear-gradient(135deg,#1E0A3C 0%,#2D1B69 100%)', borderRadius:16, padding:20, color:'#fff', marginBottom:20 }}>
              <h3 style={{ fontSize:'.9rem', fontWeight:600, marginBottom:6 }}>🤖 Gemini AI Clinical Insights</h3>
              <p style={{ fontSize:'.78rem', color:'#C4B5FD', lineHeight:1.55, marginBottom:14 }}>Ask Gemini to analyse your SNCU follow-up data, flag clinical concerns, suggest interventions, or generate a programme summary.</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:14 }}>
                {[
                  ['📊 Overall Summary', 'Summarise the overall nutritional status of all recorded SNCU graduates and highlight key concerns.'],
                  ['🚨 SAM Case Review', 'List all SAM cases and recommend immediate clinical actions for each.'],
                  ['🍼 BF Difficulties', 'Analyse breastfeeding difficulties patterns and suggest targeted lactation support strategies.'],
                  ['🏥 Referral Audit', 'Review referral patterns and assess whether NRC referral criteria are being applied correctly.'],
                  ['⚖️ Weight Gain Alerts', 'Identify children with suboptimal weight gain and suggest possible causes and interventions.'],
                  ['📄 PMU Report', 'Generate a concise programme monitoring report suitable for the State PMU.'],
                ].map(([label, prompt]) => (
                  <button key={label} onClick={()=>runPrompt(prompt)} style={{ background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.2)', borderRadius:20, padding:'5px 12px', fontSize:'.72rem', color:'#E0D9FF', cursor:'pointer', fontFamily:'inherit' }}>{label}</button>
                ))}
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <input value={aiCustomPrompt} onChange={e=>setAiCustomPrompt(e.target.value)} onKeyDown={e=>e.key==='Enter'&&runPrompt()} placeholder="Type a custom question about your data…" style={{ flex:1, background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)', borderRadius:8, padding:'9px 14px', color:'#fff', fontFamily:'inherit', fontSize:'.82rem', outline:'none' }} />
                <button style={s.btnAI} onClick={()=>runPrompt()}>✨ Ask Gemini</button>
              </div>
              {aiResponse && (
                <div style={{ background:'rgba(255,255,255,.08)', borderRadius:10, padding:14, marginTop:14, fontSize:'.8rem', lineHeight:1.7, color: aiError ? '#FCA5A5' : (aiLoading ? '#A78BFA' : '#E0D9FF'), whiteSpace:'pre-wrap', minHeight:40, border:'1px solid rgba(255,255,255,.1)', maxHeight:320, overflowY:'auto' }}
                  dangerouslySetInnerHTML={{ __html: aiLoading ? aiResponse : aiResponse.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/^### (.*$)/gm,'<h3 style="color:#C4B5FD;font-size:.85rem;margin:10px 0 4px">$1</h3>').replace(/^- (.*$)/gm,'• $1') }}
                />
              )}
            </div>

            <div style={s.card}>
              <div style={s.cardHeader}><span>🚨</span><h2 style={{ fontSize:'.95rem', fontWeight:600, margin:0 }}>Auto-Flagged Cases</h2></div>
              <div style={s.cardBody}>
                {!flagged.length ? (
                  <div style={{ textAlign:'center', padding:'40px 20px', color:C.slateMid }}>✅ No critical flags in current data.</div>
                ) : flagged.map(({ r, issues }) => (
                  <div key={r.id} style={{ border:`1px solid ${C.border}`, borderRadius:10, padding:14, marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
                    <div>
                      <strong style={{ fontSize:'.88rem' }}>{r.childName}</strong>
                      <span style={{ color:C.slateMid, fontSize:'.75rem' }}> · {r.sncuId} · Visit: {r.visitDate||'?'}</span>
                      <div style={{ marginTop:6, display:'flex', flexWrap:'wrap', gap:6 }}>
                        {issues.map((issue,ii) => (
                          <span key={ii} style={{ background: issue.type==='sam'||issue.type==='loss' ? '#FEF2F2' : '#FFFBEB', border: `1.5px solid ${issue.type==='sam'||issue.type==='loss'?'#DC2626':'#D97706'}`, color: issue.type==='sam'||issue.type==='loss'?'#991B1B':'#92400E', borderRadius:8, padding:'4px 10px', fontSize:'.78rem', fontWeight:500 }}>
                            {issue.type==='sam'?'🚨':issue.type==='loss'?'📉':'⚠️'} {issue.msg}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                      <button style={{ ...s.btnSecondary, ...s.btnSm }} onClick={()=>setViewRecord(r)}>👁 View</button>
                      <button style={{ ...s.btnSecondary, ...s.btnSm }} onClick={()=>editRecordById(r.id)}>✏️ Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* VIEW MODAL */}
      {viewRecord && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }} onClick={e=>e.target===e.currentTarget&&setViewRecord(null)}>
          <div style={{ background:'#fff', borderRadius:16, maxWidth:680, width:'95vw', maxHeight:'88vh', overflowY:'auto', boxShadow:'0 8px 32px rgba(0,0,0,.13)' }}>
            <div style={{ padding:'16px 20px', background:C.teal, color:'#fff', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:5, borderRadius:'16px 16px 0 0' }}>
              <h2 style={{ fontSize:'.95rem', fontWeight:600, margin:0 }}>📋 Record Details — {viewRecord.childName}</h2>
              <button style={{ background:'none', border:'none', color:'#fff', fontSize:'1.4rem', cursor:'pointer' }} onClick={()=>setViewRecord(null)}>×</button>
            </div>
            <div style={{ padding:20 }}>
              {[
                { title:'Child Identification', rows:[['Child Name',viewRecord.childName],['SNCU ID',viewRecord.sncuId],['Mother',viewRecord.motherName],['DOB',viewRecord.dob],['Sex',viewRecord.sex],['GA at Birth',viewRecord.gaAtBirth?viewRecord.gaAtBirth+' weeks':''],['Birth Weight',viewRecord.birthWeight?viewRecord.birthWeight+'g':'']] },
                { title:'Visit & Anthropometry', rows:[['Visit Number',viewRecord.visitNo],['Visit Date',viewRecord.visitDate],['Chronological Age',viewRecord.chronoAge],['Weight Today',viewRecord.weightToday?viewRecord.weightToday+'g':''],['Length',viewRecord.lengthToday?viewRecord.lengthToday+'cm':''],['Wt Gain',viewRecord.wtGainPerDay],['Wt Gain Status',viewRecord.wtGainStatus],['W/L Status',viewRecord.wfl]] },
                { title:'Feeding', rows:[['Feeding Type',(viewRecord.feedingType||'').replace(/_/g,' ')],['Mode',viewRecord.feedMode],['Frequency',viewRecord.feedFreq?viewRecord.feedFreq+' feeds/day':'']] },
                { title:'Clinical', rows:[['Illness Last 7d',viewRecord.illness7d],['Description',viewRecord.illnessDesc]] },
                { title:'Referral', rows:[['NRC Referral',viewRecord.refNRC],['DEIC Referral',viewRecord.refDEIC],['NRC Admitted',viewRecord.nrcAdmitted],['Reason',viewRecord.refReason]] },
                { title:'Follow-Up', rows:[['Next Visit',viewRecord.nextVisitDate],['Data Collector',viewRecord.dataCollector],['Remarks',viewRecord.remarks]] },
              ].map(sec => (
                <div key={sec.title} style={{ marginBottom:16 }}>
                  <div style={{ background:C.tealLight, padding:'8px 10px', fontWeight:700, color:C.teal, fontSize:'.72rem', textTransform:'uppercase', letterSpacing:'.06em', borderRadius:'6px 6px 0 0' }}>{sec.title}</div>
                  <table style={{ width:'100%', borderCollapse:'collapse', border:`1px solid ${C.border}`, borderTop:'none' }}>
                    <tbody>
                      {sec.rows.filter(([,v])=>v).map(([k,v])=>(
                        <tr key={k} style={{ borderBottom:`1px solid ${C.border}` }}>
                          <td style={{ padding:'6px 10px', fontWeight:600, color:C.slateMid, fontSize:'.75rem', width:180 }}>{k}</td>
                          <td style={{ padding:'6px 10px', fontSize:'.8rem' }}>{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast.show && (
        <div style={{ position:'fixed', bottom:24, right:24, zIndex:9999, background: toast.type==='error' ? C.red : toast.type==='success' ? '#166534' : C.tealDark, color:'#fff', padding:'12px 20px', borderRadius:10, fontSize:'.82rem', fontWeight:500, boxShadow:'0 8px 32px rgba(0,0,0,.13)', maxWidth:340 }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
