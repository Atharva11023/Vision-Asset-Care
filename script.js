// ==========================================
// NAVIGATION LOGIC
// ==========================================
function switchView(viewId, masterFilter = null) {
    const views = ['view-dashboard', 'view-analytics', 'view-reports', 'view-checklists', 'view-vehicles', 'view-operators', 'view-sites', 'view-masters', 'view-settings'];
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

    const setGroup = document.getElementById('nav-settings-group');
    if(viewId === 'view-settings') {
        setGroup.className = 'flex items-center justify-between py-2.5 px-4 bg-blue-600 rounded-lg transition-colors text-white';
        initSettingsModule();
    } else {
        setGroup.className = 'flex items-center justify-between py-2.5 px-4 hover:bg-slate-800 rounded-lg transition-colors text-white';
    }

    if(viewId === 'view-analytics') initAnalyticsModule();
    if(viewId === 'view-reports') initReportsModule();
    if(viewId === 'view-checklists') initChecklistsModule();
    if(viewId === 'view-vehicles') initVehiclesModule();
    if(viewId === 'view-operators') initOperatorsModule();
    if(viewId === 'view-sites') initSitesModule();
}

function toggleMasterMenu() {
    const sub = document.getElementById('nav-masters-submenu'); const arrow = document.getElementById('nav-masters-arrow');
    if(sub.classList.contains('hidden')) { sub.classList.remove('hidden'); sub.classList.add('flex'); arrow.style.transform = 'rotate(180deg)'; } 
    else { sub.classList.add('hidden'); sub.classList.remove('flex'); arrow.style.transform = 'rotate(0deg)'; }
}

function toggleSettingsMenu() {
    const sub = document.getElementById('nav-settings-submenu'); const arrow = document.getElementById('nav-settings-arrow');
    if(sub.classList.contains('hidden')) { sub.classList.remove('hidden'); sub.classList.add('flex'); arrow.style.transform = 'rotate(180deg)'; } 
    else { sub.classList.add('hidden'); sub.classList.remove('flex'); arrow.style.transform = 'rotate(0deg)'; }
}

// ==========================================
// PREVIOUS MODULES (DASHBOARD TO MASTERS)
// ==========================================
function initDashboard() {
    const kpiData = [{title: "Vehicles", val: "156"}, {title: "Operators", val: "82"}, {title: "Inspection", val: "41"}, {title: "Pending", val: "18"}, {title: "Faulty", val: "12"}, {title: "Complete", val: "98%"}];
    const grid = document.getElementById('kpi-grid');
    if(grid && grid.innerHTML === '') kpiData.forEach(k => grid.innerHTML += `<div class="bg-white p-4 rounded-xl shadow-sm border card"><p class="text-[10px] text-gray-400 font-bold">${k.title}</p><h3 class="text-xl font-bold">${k.val}</h3></div>`);
    setInterval(() => { const c = document.getElementById('live-clock'); if(c) c.innerText = new Date().toLocaleTimeString(); }, 1000);
}

let allReports = []; let allChecklists = []; let allVehicles = []; let allOperators = []; let allSites = []; let allMasters = [];
const rowsPerPage = 10;
function initReportsModule() { if(allReports.length === 0) { allReports = Array.from({length: 5}, (_, i) => ({ id: `VIESL-${1000+i}` })); document.getElementById('reports-table-body').innerHTML = allReports.map(r => `<tr class="border-b"><td class="px-4 py-3"><input type="checkbox"></td><td class="px-4 py-3">${r.id}</td><td class="px-4 py-3 text-right">...</td></tr>`).join(''); } }
function initChecklistsModule() { if(allChecklists.length === 0) { allChecklists = Array.from({length: 5}, (_, i) => ({ id: `CHK-100${i}` })); document.getElementById('checklists-table-body').innerHTML = allChecklists.map(r => `<tr class="border-b"><td class="px-4 py-3"><input type="checkbox"></td><td class="px-4 py-3">${r.id}</td><td class="px-4 py-3 text-right">...</td></tr>`).join(''); } }
function initVehiclesModule() { if(allVehicles.length === 0) { allVehicles = Array.from({length: 5}, (_, i) => ({ id: `VPAV${260000+i}` })); document.getElementById('vehicles-table-body').innerHTML = allVehicles.map(r => `<tr class="border-b"><td class="px-4 py-3"><input type="checkbox"></td><td class="px-4 py-3">${r.id}</td><td class="px-4 py-3 text-right">...</td></tr>`).join(''); } }
function initOperatorsModule() { if(allOperators.length === 0) { allOperators = Array.from({length: 5}, (_, i) => ({ id: `EMP-${2000+i}` })); document.getElementById('operators-table-body').innerHTML = allOperators.map(r => `<tr class="border-b"><td class="px-4 py-3"><input type="checkbox"></td><td class="px-4 py-3">${r.id}</td><td class="px-4 py-3 text-right">...</td></tr>`).join(''); } }
function initSitesModule() { if(allSites.length === 0) { allSites = Array.from({length: 5}, (_, i) => ({ id: `SIT-${1000+i}` })); document.getElementById('sites-table-body').innerHTML = allSites.map(r => `<tr class="border-b"><td class="px-4 py-3"><input type="checkbox"></td><td class="px-4 py-3">${r.id}</td><td class="px-4 py-3 text-right">...</td></tr>`).join(''); } }
function initMastersModule(filterCat) { if(allMasters.length === 0) { allMasters = Array.from({length: 5}, (_, i) => ({ id: `MST-${1000+i}` })); document.getElementById('masters-table-body').innerHTML = allMasters.map(r => `<tr class="border-b"><td class="px-4 py-3"><input type="checkbox"></td><td class="px-4 py-3">${r.id}</td><td class="px-4 py-3 text-right">...</td></tr>`).join(''); } }
let analyticsInitDone = false; function initAnalyticsModule() { if(!analyticsInitDone) { analyticsInitDone = true; } }

// ==========================================
// SYSTEM SETTINGS & ADMINISTRATION (NEW)
// ==========================================
let settingsInitDone = false;

function initSettingsModule() {
    if(!settingsInitDone) {
        switchSettingsTab('General Settings');
        renderApiIntegrations();
        renderAuditLogs();
        renderSystemLogs();
        settingsInitDone = true;
    }
}

function switchSettingsTab(tabName) {
    document.getElementById('settings-current-tab-title').innerText = tabName;
    const tabs = document.querySelectorAll('.settings-tab');
    tabs.forEach(t => t.classList.add('hidden'));

    const links = document.querySelectorAll('#nav-settings-submenu a');
    links.forEach(l => {
        if(l.innerText === tabName) { l.classList.remove('text-gray-400'); l.classList.add('text-blue-400', 'font-bold'); }
        else { l.classList.add('text-gray-400'); l.classList.remove('text-blue-400', 'font-bold'); }
    });

    const tabMap = {
        'General Settings': 'set-tab-general', 'Company Profile': 'set-tab-company', 'Role & Permissions': 'set-tab-roles',
        'Notification Settings': 'set-tab-notif', 'Inspection Settings': 'set-tab-insp', 'Vehicle Settings': 'set-tab-veh',
        'Storage Settings': 'set-tab-store', 'Email Settings': 'set-tab-email', 'SMS Settings': 'set-tab-sms',
        'Backup & Restore': 'set-tab-backup', 'API & Integrations': 'set-tab-api', 'Audit Logs': 'set-tab-audit',
        'System Logs': 'set-tab-syslogs', 'About System': 'set-tab-about'
    };
    
    const targetId = tabMap[tabName];
    if(targetId) document.getElementById(targetId).classList.remove('hidden');
}

// 3. Permission Matrix Drawer
function toggleRoleDrawer() {
    const d = document.getElementById('role-drawer'); const p = document.getElementById('role-drawer-panel');
    if (d.classList.contains('hidden')) { d.classList.remove('hidden'); setTimeout(() => p.classList.remove('translate-x-full'), 10); } 
    else { p.classList.add('translate-x-full'); setTimeout(() => d.classList.add('hidden'), 300); }
}

function openRoleDrawer(roleName) {
    document.getElementById('role-drawer-title').innerText = roleName === 'New' ? 'Create New Role' : 'Edit Role Matrix';
    document.getElementById('role-name-input').value = roleName === 'New' ? '' : roleName;
    
    const modules = ['Dashboard', 'Inspection Reports', 'Inspection Checklist', 'Vehicle Management', 'Operator Management', 'Site Management', 'Master Data', 'Analytics & KPIs', 'Settings'];
    
    document.getElementById('permission-matrix-body').innerHTML = modules.map(m => {
        const isChecked = (roleName === 'Admin' || roleName === 'Manager') ? 'checked' : '';
        const chk = `<input type="checkbox" class="w-4 h-4 text-blue-600 rounded" ${isChecked}>`;
        return `<tr class="hover:bg-gray-50 border-b">
            <td class="px-4 py-3 font-bold text-gray-700 text-left">${m}</td>
            <td>${chk}</td><td>${chk}</td><td>${chk}</td><td>${chk}</td><td>${chk}</td><td>${chk}</td><td>${chk}</td>
        </tr>`;
    }).join('');

    toggleRoleDrawer();
}

// 11. API & Integrations
function renderApiIntegrations() {
    const apis = [
        { name: "Firebase Authentication", type: "Identity", key: "AIzaSyD***************P8K", env: "Production", status: "Connected", icon: "fa-fire", color: "text-yellow-500" },
        { name: "Cloud Firestore", type: "Database", key: "AIzaSyD***************X2L", env: "Production", status: "Connected", icon: "fa-database", color: "text-orange-500" },
        { name: "Firebase Storage", type: "Cloud Storage", key: "AIzaSyD***************M9Q", env: "Production", status: "Connected", icon: "fa-cloud-upload-alt", color: "text-blue-500" },
        { name: "Firebase Cloud Messaging", type: "Push Notifications", key: "AAAAOq***************T6H", env: "Production", status: "Connected", icon: "fa-bell", color: "text-yellow-600" },
        { name: "Maps API", type: "Google Maps", key: "AIzaSyA***************K1P", env: "Production", status: "Connected", icon: "fa-map-marked-alt", color: "text-green-600" },
        { name: "Places API", type: "Google Maps", key: "AIzaSyB***************L2M", env: "Production", status: "Connected", icon: "fa-map-marker-alt", color: "text-green-500" },
        { name: "Email Service", type: "SMTP Provider", key: "SMTP-O365***************881", env: "Production", status: "Connected", icon: "fa-envelope", color: "text-blue-400" },
        { name: "SMS Gateway", type: "Twilio", key: "SK2a8******************9b3", env: "Production", status: "Error", icon: "fa-sms", color: "text-indigo-500" },
        { name: "PDF Service", type: "Doc Generation", key: "PDF-GEN******************12A", env: "Production", status: "Connected", icon: "fa-file-pdf", color: "text-red-500" }
    ];

    document.getElementById('api-integration-grid').innerHTML = apis.map(a => `
        <div class="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
            <div class="p-4 border-b flex justify-between items-center bg-gray-50">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded bg-white border flex items-center justify-center shadow-sm"><i class="fas ${a.icon} ${a.color}"></i></div>
                    <div><h4 class="font-bold text-gray-800 text-sm">${a.name}</h4><p class="text-[10px] uppercase font-bold text-gray-500">${a.type}</p></div>
                </div>
                <div class="flex items-center gap-1 ${a.status === 'Connected' ? 'text-green-600' : 'text-red-500'} bg-white px-2 py-1 border rounded shadow-sm text-xs font-bold">
                    <i class="fas ${a.status === 'Connected' ? 'fa-circle' : 'fa-exclamation-circle'} text-[8px]"></i> ${a.status}
                </div>
            </div>
            <div class="p-4 flex-1 space-y-4 text-sm">
                <div><span class="block text-xs text-gray-500 font-bold mb-1">Masked API Key</span>
                <div class="flex items-center justify-between bg-gray-100 px-3 py-2 rounded border font-mono text-xs text-gray-700">
                    <span>${a.key}</span><button class="text-gray-400 hover:text-blue-600" title="Copy Key"><i class="fas fa-copy"></i></button>
                </div></div>
                <div class="flex justify-between items-center"><span class="text-xs text-gray-500 font-bold">Environment</span><span class="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold border border-purple-200">${a.env}</span></div>
                <div class="flex justify-between items-center"><span class="text-xs text-gray-500 font-bold">Last Tested</span><span class="text-gray-700 text-xs font-medium">Today, 08:30 AM</span></div>
            </div>
            <div class="p-4 border-t bg-gray-50 flex gap-2">
                <button class="flex-1 bg-white border text-gray-700 py-1.5 rounded text-xs font-bold shadow-sm hover:bg-gray-100"><i class="fas fa-plug mr-1"></i>Test Conn.</button>
                <button class="flex-1 bg-white border text-gray-700 py-1.5 rounded text-xs font-bold shadow-sm hover:bg-gray-100"><i class="fas fa-book mr-1"></i>Docs</button>
                <label class="relative inline-flex items-center cursor-pointer ml-1">
                    <input type="checkbox" class="sr-only peer" ${a.status === 'Connected' ? 'checked' : ''}>
                    <div class="w-9 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
            </div>
        </div>
    `).join('');
}

// 12. Audit Logs
function renderAuditLogs() {
    const modules = ['Authentication', 'Vehicle Management', 'Inspection Reports', 'Settings', 'Operator Management'];
    const actions = ['Login Success', 'Created Record', 'Exported PDF', 'Updated Configuration', 'Deleted Record'];
    const users = ['admin@vac.com', 'manager1@vac.com', 'j.doe@vac.com'];
    let logs = [];
    
    for(let i=0; i<30; i++) {
        logs.push({
            ts: `2026-07-06 1${Math.floor(Math.random()*2)}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}`,
            user: users[Math.floor(Math.random()*users.length)],
            mod: modules[Math.floor(Math.random()*modules.length)],
            act: actions[Math.floor(Math.random()*actions.length)],
            desc: `User performed action on object ID ${Math.floor(Math.random()*9000)+1000}`,
            ip: `192.168.1.${Math.floor(Math.random()*255)}`,
            sys: i%2===0 ? 'Windows 11 / Chrome' : 'macOS / Safari'
        });
    }

    document.getElementById('audit-table-body').innerHTML = logs.map(l => `
        <tr class="hover:bg-blue-50/50 border-b border-gray-100 transition-colors">
            <td class="px-4 py-2 font-mono text-xs text-gray-500">${l.ts}</td>
            <td class="px-4 py-2 font-bold text-gray-700">${l.user}</td>
            <td class="px-4 py-2 text-indigo-600 font-bold">${l.mod}</td>
            <td class="px-4 py-2 text-gray-800 font-medium">${l.act}</td>
            <td class="px-4 py-2 text-gray-500 text-xs">${l.desc}</td>
            <td class="px-4 py-2 font-mono text-xs text-gray-400">${l.ip}</td>
            <td class="px-4 py-2 text-gray-500 text-xs">${l.sys}</td>
        </tr>
    `).join('');
}

// 13. System Logs
function renderSystemLogs() {
    let logs = '';
    for(let i=0; i<60; i++) {
        const rand = Math.random();
        let sev = 'INFO '; let color = 'text-blue-400';
        if(rand > 0.8) { sev = 'WARN '; color = 'text-yellow-400'; }
        if(rand > 0.95) { sev = 'ERROR'; color = 'text-red-400'; }
        
        logs += `<div class="py-1.5 border-b border-slate-800 hover:bg-slate-800 flex gap-4 transition-colors">
            <span class="text-slate-500 w-32 shrink-0">2026-07-06 12:${String(i).padStart(2,'0')}:15</span>
            <span class="${color} font-bold w-12 shrink-0">[${sev}]</span>
            <span class="text-slate-300">System daemon processed routine health check on cluster node worker-${i%5+1}. Latency: ${Math.floor(Math.random()*40)+10}ms.</span>
        </div>`;
    }
    document.getElementById('syslog-container').innerHTML = logs;
}

// Initial Boot
document.addEventListener('DOMContentLoaded', initDashboard);