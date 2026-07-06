// ==========================================
// NAVIGATION LOGIC
// ==========================================
function switchView(viewId, masterFilter = null) {
    const views = ['view-dashboard', 'view-analytics', 'view-reports', 'view-checklists', 'view-vehicles', 'view-operators', 'view-sites', 'view-masters'];
    views.forEach(v => document.getElementById(v).classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');

    const activeClass = 'flex items-center py-2.5 px-4 bg-blue-600 rounded-lg text-white';
    const inactiveClass = 'flex items-center py-2.5 px-4 hover:bg-slate-800 rounded-lg transition-colors text-white';
    
    const navs = ['nav-dashboard', 'nav-analytics', 'nav-reports', 'nav-checklists', 'nav-vehicles', 'nav-operators', 'nav-sites'];
    navs.forEach(n => {
        if(document.getElementById(n)) document.getElementById(n).className = (viewId === n.replace('nav-', 'view-')) ? activeClass : inactiveClass;
    });

    const mdGroup = document.getElementById('nav-masters-group');
    if (viewId === 'view-masters') {
        mdGroup.className = 'flex items-center justify-between py-2.5 px-4 bg-blue-600 rounded-lg transition-colors text-white';
        initMastersModule(masterFilter);
    } else {
        mdGroup.className = 'flex items-center justify-between py-2.5 px-4 hover:bg-slate-800 rounded-lg transition-colors text-white';
    }

    if(viewId === 'view-analytics') initAnalyticsModule();
    if(viewId === 'view-reports') initReportsModule();
    if(viewId === 'view-checklists') initChecklistsModule();
    if(viewId === 'view-vehicles') initVehiclesModule();
    if(viewId === 'view-operators') initOperatorsModule();
    if(viewId === 'view-sites') initSitesModule();
}

function toggleMasterMenu() {
    const sub = document.getElementById('nav-masters-submenu');
    const arrow = document.getElementById('nav-masters-arrow');
    if(sub.classList.contains('hidden')) { sub.classList.remove('hidden'); sub.classList.add('flex'); arrow.style.transform = 'rotate(180deg)'; } 
    else { sub.classList.add('hidden'); sub.classList.remove('flex'); arrow.style.transform = 'rotate(0deg)'; }
}

// ==========================================
// PREVIOUS MODULES (DASHBOARD, REPORTS, ETC.)
// ==========================================
function initDashboard() {
    const kpiData = [{title: "Vehicles", val: "156"}, {title: "Operators", val: "82"}, {title: "Inspection", val: "41"}, {title: "Pending", val: "18"}, {title: "Faulty", val: "12"}, {title: "Complete", val: "98%"}];
    const grid = document.getElementById('kpi-grid');
    if(grid && grid.innerHTML === '') kpiData.forEach(k => grid.innerHTML += `<div class="bg-white p-4 rounded-xl shadow-sm border card"><p class="text-[10px] text-gray-400 font-bold">${k.title}</p><h3 class="text-xl font-bold">${k.val}</h3></div>`);
    setInterval(() => { const c = document.getElementById('live-clock'); if(c) c.innerText = new Date().toLocaleTimeString(); }, 1000);
}

let allReports = []; let allChecklists = []; let allVehicles = []; let allOperators = []; let allSites = []; let allMasters = [];
const rowsPerPage = 10;

function initReportsModule() { if(allReports.length === 0) { allReports = Array.from({length: 5}, (_, i) => ({ id: `VIESL-${1000+i}` })); document.getElementById('reports-table-body').innerHTML = allReports.map(r => `<tr class="border-b"><td class="px-4 py-3">${r.id}</td></tr>`).join(''); } }
function initChecklistsModule() { if(allChecklists.length === 0) { allChecklists = Array.from({length: 5}, (_, i) => ({ id: `CHK-100${i}` })); document.getElementById('checklists-table-body').innerHTML = allChecklists.map(r => `<tr class="border-b"><td class="px-4 py-3">${r.id}</td></tr>`).join(''); } }
function initVehiclesModule() { if(allVehicles.length === 0) { allVehicles = Array.from({length: 5}, (_, i) => ({ id: `VPAV${260000+i}` })); document.getElementById('vehicles-table-body').innerHTML = allVehicles.map(r => `<tr class="border-b"><td class="px-4 py-3">${r.id}</td></tr>`).join(''); } }
function initOperatorsModule() { if(allOperators.length === 0) { allOperators = Array.from({length: 5}, (_, i) => ({ id: `EMP-${2000+i}` })); document.getElementById('operators-table-body').innerHTML = allOperators.map(r => `<tr class="border-b"><td class="px-4 py-3">${r.id}</td></tr>`).join(''); } }
function initSitesModule() { if(allSites.length === 0) { allSites = Array.from({length: 5}, (_, i) => ({ id: `SIT-${1000+i}` })); document.getElementById('sites-table-body').innerHTML = allSites.map(r => `<tr class="border-b"><td class="px-4 py-3">${r.id}</td></tr>`).join(''); } }
function initMastersModule(filterCat) { if(allMasters.length === 0) { allMasters = Array.from({length: 5}, (_, i) => ({ id: `MST-${1000+i}` })); document.getElementById('masters-table-body').innerHTML = allMasters.map(r => `<tr class="border-b"><td class="px-4 py-3">${r.id}</td></tr>`).join(''); } }

// ==========================================
// ANALYTICS & KPI DASHBOARD (NEW)
// ==========================================
let analyticsInitDone = false;
let chartInstances = {};

function initAnalyticsModule() {
    if(!analyticsInitDone) {
        renderAnalyticsKPIs();
        renderAnalyticsAlerts();
        renderAdvancedAnalytics();
        renderPerformanceTable();
        // Delay chart initialization slightly to ensure containers are fully rendered
        setTimeout(initAnalyticsCharts, 100); 
        analyticsInitDone = true;
    }
}

function renderAnalyticsKPIs() {
    const kpis = [
        { label: "Total Inspections", val: "1,450", trend: "+12% vs last month", icon: "fa-clipboard-list", color: "text-blue-600" },
        { label: "Insp. Completion %", val: "94%", trend: "+2.1% vs last month", icon: "fa-check-double", color: "text-green-500" },
        { label: "Fleet Health Score", val: "88/100", trend: "Stable", icon: "fa-heartbeat", color: "text-teal-500" },
        { label: "Vehicle Availability", val: "92%", trend: "-1.5% vs last month", icon: "fa-truck-moving", color: "text-indigo-500" },
        { label: "Open Issues", val: "45", trend: "-5 vs last month", icon: "fa-exclamation-circle", color: "text-orange-500" },
        { label: "Critical Issues", val: "8", trend: "+2 vs last month", icon: "fa-radiation", color: "text-red-600" },
        { label: "Avg Insp. Time", val: "14m", trend: "-2m vs last month", icon: "fa-stopwatch", color: "text-purple-500" },
        { label: "Operator Prod.", val: "8.5/day", trend: "+0.5 vs last month", icon: "fa-user-clock", color: "text-blue-400" },
        { label: "Maintenance Due", val: "24", trend: "Upcoming 7 days", icon: "fa-tools", color: "text-yellow-600" },
        { label: "Breakdowns", val: "12", trend: "-3 vs last month", icon: "fa-car-crash", color: "text-red-500" }
    ];

    document.getElementById('analytics-kpi-grid').innerHTML = kpis.map(k => `
        <div class="bg-white p-4 rounded-xl shadow-sm border card flex flex-col justify-between">
            <div class="flex justify-between items-start mb-2">
                <p class="text-[11px] text-gray-500 font-bold uppercase tracking-wider">${k.label}</p>
                <i class="fas ${k.icon} ${k.color} text-lg opacity-80"></i>
            </div>
            <div>
                <h3 class="text-2xl font-black text-gray-800">${k.val}</h3>
                <p class="text-[10px] font-medium text-gray-400 mt-1">${k.trend}</p>
            </div>
        </div>`).join('');
}

function renderAnalyticsAlerts() {
    const alerts = [
        { title: "Critical Vehicles", count: 5, color: "bg-red-50 text-red-700 border-red-200" },
        { title: "Pending Approvals", count: 12, color: "bg-orange-50 text-orange-700 border-orange-200" },
        { title: "Maintenance Due", count: 24, color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
        { title: "Overdue Inspections", count: 8, color: "bg-purple-50 text-purple-700 border-purple-200" },
        { title: "High Risk Sites", count: 2, color: "bg-rose-50 text-rose-700 border-rose-200" }
    ];
    document.getElementById('analytics-alerts').innerHTML = alerts.map(a => `
        <div class="${a.color} border p-3 rounded-lg flex items-center justify-between shadow-sm cursor-pointer hover:opacity-80 transition-opacity">
            <span class="text-xs font-bold uppercase tracking-wide">${a.title}</span>
            <span class="text-lg font-black">${a.count}</span>
        </div>`).join('');
}

function renderAdvancedAnalytics() {
    // Mini-list templates for Top Analytics
    const faulty = [{n: 'CAT Excavator (VPAV201)', v: '6 Faults'}, {n: 'Volvo Dumper (VPAV105)', v: '4 Faults'}, {n: 'JCB Loader (VPAV302)', v: '3 Faults'}];
    const defects = [{n: 'Hydraulic Leak', v: '24 Incidents'}, {n: 'Brake Pad Wear', v: '18 Incidents'}, {n: 'Engine Overheat', v: '12 Incidents'}];
    const sites = [{n: 'Site Alpha', v: '98% Pass Rate'}, {n: 'Omega Quarry', v: '95% Pass Rate'}, {n: 'Delta Yard', v: '92% Pass Rate'}];

    const makeList = (data, icon, color) => data.map(d => `<div class="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0"><div class="flex items-center gap-2"><i class="fas ${icon} ${color} w-4 text-center"></i><span class="font-medium text-gray-700">${d.n}</span></div><span class="font-bold text-gray-600">${d.v}</span></div>`).join('');

    document.getElementById('adv-faulty-veh').innerHTML = makeList(faulty, 'fa-truck', 'text-red-500');
    document.getElementById('adv-common-defects').innerHTML = makeList(defects, 'fa-tools', 'text-orange-500');
    document.getElementById('adv-top-sites').innerHTML = makeList(sites, 'fa-map-marker-alt', 'text-green-500');
}

function renderPerformanceTable() {
    const data = [
        { d: 'Logistics', s: 'Site Alpha', i: 450, p: '96%', f: '4%', pd: 12, t: '12m', h: '92/100' },
        { d: 'Mining', s: 'Omega Quarry', i: 620, p: '88%', f: '12%', pd: 5, t: '18m', h: '84/100' },
        { d: 'Construction', s: 'Delta Yard', i: 380, p: '94%', f: '6%', pd: 8, t: '15m', h: '89/100' }
    ];
    document.getElementById('analytics-perf-table').innerHTML = data.map(r => `
        <tr class="hover:bg-blue-50/50 transition-colors">
            <td class="px-6 py-3 font-medium text-gray-800">${r.d}</td>
            <td class="px-6 py-3 text-gray-600">${r.s}</td>
            <td class="px-6 py-3 text-center font-bold text-blue-600">${r.i}</td>
            <td class="px-6 py-3 text-center text-green-600 font-bold">${r.p}</td>
            <td class="px-6 py-3 text-center text-red-600 font-bold">${r.f}</td>
            <td class="px-6 py-3 text-center text-orange-500">${r.pd}</td>
            <td class="px-6 py-3 text-center text-gray-600">${r.t}</td>
            <td class="px-6 py-3 text-center text-teal-600 font-bold">${r.h}</td>
        </tr>
    `).join('');
}

// 8 Chart.js Instances
function initAnalyticsCharts() {
    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
    Chart.defaults.color = '#64748b';
    const commonOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };

    // 1. Inspection Trend (Line)
    chartInstances.trend = new Chart(document.getElementById('chartInspTrend'), {
        type: 'line',
        data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ label: 'Inspections', data: [120, 150, 180, 140, 210, 90, 85], borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, tension: 0.4 }] },
        options: commonOptions
    });

    // 2. Fleet Health (Donut)
    chartInstances.health = new Chart(document.getElementById('chartFleetHealth'), {
        type: 'doughnut',
        data: { labels: ['Excellent', 'Good', 'Fair', 'Critical'], datasets: [{ data: [45, 35, 15, 5], backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'] }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
    });

    // 3. Inspection Status (Stacked Bar)
    chartInstances.status = new Chart(document.getElementById('chartInspStatus'), {
        type: 'bar',
        data: { labels: ['W1', 'W2', 'W3', 'W4'], datasets: [
            { label: 'Passed', data: [300, 320, 290, 350], backgroundColor: '#22c55e' },
            { label: 'Failed', data: [20, 25, 15, 30], backgroundColor: '#ef4444' }
        ]},
        options: { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }
    });

    // 4. Department Performance (Column)
    chartInstances.dept = new Chart(document.getElementById('chartDeptPerf'), {
        type: 'bar',
        data: { labels: ['Logistics', 'Mining', 'Const.', 'Ops'], datasets: [{ data: [96, 88, 94, 91], backgroundColor: '#6366f1', borderRadius: 4 }] },
        options: { ...commonOptions, scales: { y: { max: 100 } } }
    });

    // 5. Site Performance (Column)
    chartInstances.site = new Chart(document.getElementById('chartSitePerf'), {
        type: 'bar',
        data: { labels: ['Alpha', 'Beta', 'Omega', 'Delta'], datasets: [{ data: [150, 120, 210, 180], backgroundColor: '#14b8a6', borderRadius: 4 }] },
        options: commonOptions
    });

    // 6. Operator Performance (Column)
    chartInstances.op = new Chart(document.getElementById('chartOpPerf'), {
        type: 'bar',
        data: { labels: ['Top 20%', 'Avg 60%', 'Btm 20%'], datasets: [{ data: [98, 85, 72], backgroundColor: '#8b5cf6', borderRadius: 4 }] },
        options: { ...commonOptions, scales: { y: { max: 100 } } }
    });

    // 7. Fault Categories (Horizontal Bar)
    chartInstances.fault = new Chart(document.getElementById('chartFaultCat'), {
        type: 'bar',
        data: { labels: ['Hydraulics', 'Engine', 'Electrical', 'Brakes', 'Body'], datasets: [{ data: [45, 38, 29, 22, 15], backgroundColor: '#f97316', borderRadius: 4 }] },
        options: { ...commonOptions, indexAxis: 'y' }
    });
}

// Initial Boot
document.addEventListener('DOMContentLoaded', initDashboard);