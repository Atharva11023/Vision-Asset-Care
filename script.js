// ==========================================
// NAVIGATION LOGIC
// ==========================================
function switchView(viewId, masterFilter = null) {
    document.getElementById('view-dashboard').classList.add('hidden');
    document.getElementById('view-reports').classList.add('hidden');
    document.getElementById('view-checklists').classList.add('hidden');
    document.getElementById('view-vehicles').classList.add('hidden');
    document.getElementById('view-operators').classList.add('hidden');
    document.getElementById('view-sites').classList.add('hidden');
    document.getElementById('view-masters').classList.add('hidden');
    
    document.getElementById(viewId).classList.remove('hidden');

    const activeClass = 'flex items-center py-2.5 px-4 bg-blue-600 rounded-lg';
    const inactiveClass = 'flex items-center py-2.5 px-4 hover:bg-slate-800 rounded-lg transition-colors';
    
    document.getElementById('nav-dashboard').className = viewId === 'view-dashboard' ? activeClass : inactiveClass;
    document.getElementById('nav-reports').className = viewId === 'view-reports' ? activeClass : inactiveClass;
    document.getElementById('nav-checklists').className = viewId === 'view-checklists' ? activeClass : inactiveClass;
    document.getElementById('nav-vehicles').className = viewId === 'view-vehicles' ? activeClass : inactiveClass;
    document.getElementById('nav-operators').className = viewId === 'view-operators' ? activeClass : inactiveClass;
    document.getElementById('nav-sites').className = viewId === 'view-sites' ? activeClass : inactiveClass;

    // Master Data special handling
    const mdGroup = document.getElementById('nav-masters-group');
    if (viewId === 'view-masters') {
        mdGroup.className = 'flex items-center justify-between py-2.5 px-4 bg-blue-600 rounded-lg transition-colors';
        initMastersModule(masterFilter);
    } else {
        mdGroup.className = 'flex items-center justify-between py-2.5 px-4 hover:bg-slate-800 rounded-lg transition-colors';
    }

    if(viewId === 'view-reports') initReportsModule();
    if(viewId === 'view-checklists') initChecklistsModule();
    if(viewId === 'view-vehicles') initVehiclesModule();
    if(viewId === 'view-operators') initOperatorsModule();
    if(viewId === 'view-sites') initSitesModule();
}

function toggleMasterMenu() {
    const sub = document.getElementById('nav-masters-submenu');
    const arrow = document.getElementById('nav-masters-arrow');
    if(sub.classList.contains('hidden')) {
        sub.classList.remove('hidden');
        sub.classList.add('flex');
        arrow.style.transform = 'rotate(180deg)';
    } else {
        sub.classList.add('hidden');
        sub.classList.remove('flex');
        arrow.style.transform = 'rotate(0deg)';
    }
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

let allReports = []; let allChecklists = []; let allVehicles = []; let allOperators = []; let allSites = [];
const rowsPerPage = 10;

function initReportsModule() { if(allReports.length === 0) { allReports = Array.from({length: 5}, (_, i) => ({ id: `VIESL-${1000+i}` })); document.getElementById('reports-table-body').innerHTML = allReports.map(r => `<tr class="border-b"><td class="px-4 py-3">${r.id}</td></tr>`).join(''); } }
function initChecklistsModule() { if(allChecklists.length === 0) { allChecklists = Array.from({length: 5}, (_, i) => ({ id: `CHK-100${i}` })); document.getElementById('checklists-table-body').innerHTML = allChecklists.map(r => `<tr class="border-b"><td class="px-4 py-3">${r.id}</td></tr>`).join(''); } }
function initVehiclesModule() { if(allVehicles.length === 0) { allVehicles = Array.from({length: 5}, (_, i) => ({ id: `VPAV${260000+i}` })); document.getElementById('vehicles-table-body').innerHTML = allVehicles.map(r => `<tr class="border-b"><td class="px-4 py-3">${r.id}</td></tr>`).join(''); } }
function initOperatorsModule() { if(allOperators.length === 0) { allOperators = Array.from({length: 5}, (_, i) => ({ id: `EMP-${2000+i}` })); document.getElementById('operators-table-body').innerHTML = allOperators.map(r => `<tr class="border-b"><td class="px-4 py-3">${r.id}</td></tr>`).join(''); } }
function initSitesModule() { if(allSites.length === 0) { allSites = Array.from({length: 5}, (_, i) => ({ id: `SIT-${1000+i}` })); document.getElementById('sites-table-body').innerHTML = allSites.map(r => `<tr class="border-b"><td class="px-4 py-3">${r.id}</td></tr>`).join(''); } }

// ==========================================
// MASTER DATA MODULE (NEW)
// ==========================================
let allMasters = [];
let masterFiltered = [];
let masterCurrentPage = 1;

function initMastersModule(filterCategory = null) {
    if(allMasters.length === 0) {
        generateDummyMasters();
    }
    
    // Update the dropdown filter if navigated from sidebar
    if (filterCategory) {
        document.getElementById('master-type-filter').value = filterCategory;
    }
    
    filterMasters();
    renderMasterKPIs();
}

// 1. Generate Realistic Master Records (Hierarchical Data)
function generateDummyMasters() {
    const rawData = [
        // Regions, States, Cities
        { code: 'REG-01', name: 'North America', cat: 'Regions', parent: '-', desc: 'North America Operations' },
        { code: 'STA-CA', name: 'California', cat: 'States', parent: 'REG-01 (North America)', desc: 'West Coast' },
        { code: 'CIT-LA', name: 'Los Angeles', cat: 'Cities', parent: 'STA-CA (California)', desc: 'LA Hub' },
        // Departments & Teams
        { code: 'DEP-MN', name: 'Mining', cat: 'Departments', parent: '-', desc: 'Core Mining Operations' },
        { code: 'DEP-LG', name: 'Logistics', cat: 'Departments', parent: '-', desc: 'Transport and Supply' },
        { code: 'TM-EX', name: 'Excavation Team Alpha', cat: 'Teams', parent: 'DEP-MN (Mining)', desc: 'Primary Dig Team' },
        // Vehicles
        { code: 'VCAT-HV', name: 'Heavy Machinery', cat: 'Vehicle Categories', parent: '-', desc: 'Earthmoving & Heavy' },
        { code: 'VTYP-EX', name: 'Excavator', cat: 'Vehicle Types', parent: 'VCAT-HV (Heavy Machinery)', desc: 'Tracked Excavators' },
        { code: 'MFR-CAT', name: 'Caterpillar', cat: 'Manufacturers', parent: '-', desc: 'CAT Equipment' },
        { code: 'MOD-320', name: 'CAT 320', cat: 'Models', parent: 'MFR-CAT (Caterpillar)', desc: 'Hydraulic Excavator' },
        { code: 'FUEL-DSL', name: 'Diesel', cat: 'Fuel Types', parent: '-', desc: 'Standard Diesel Fuel' },
        // Checklists & Inspections
        { code: 'CHK-CAT-ENG', name: 'Engine System', cat: 'Checklist Categories', parent: '-', desc: 'Engine & Powertrain' },
        { code: 'INSP-CAT-DLY', name: 'Daily Pre-Start', cat: 'Inspection Categories', parent: '-', desc: 'Mandatory daily check' },
        { code: 'DEF-LEAK', name: 'Fluid Leak', cat: 'Defect Types', parent: 'CHK-CAT-ENG (Engine System)', desc: 'Oil or coolant leak' },
        { code: 'PRI-CRIT', name: 'Critical (Safety)', cat: 'Priority Levels', parent: '-', desc: 'Must fix immediately' }
    ];

    // Multiply to generate ~50 records
    rawData.forEach((item, idx) => {
        allMasters.push({
            id: item.code, name: item.name, cat: item.cat, parent: item.parent,
            desc: item.desc, author: 'System Admin', 
            updated: `2026-07-${String((idx%28)+1).padStart(2,'0')}`,
            status: idx % 7 === 0 ? 'Inactive' : (idx % 11 === 0 ? 'Archived' : 'Active'),
            usageCount: Math.floor(Math.random() * 500) + 10
        });
        
        // Generate duplicates for bulk
        for(let i=1; i<=2; i++) {
            allMasters.push({
                id: `${item.code}-0${i}`, name: `${item.name} Var ${i}`, cat: item.cat, parent: item.parent,
                desc: `${item.desc} (Variant ${i})`, author: 'System Admin', 
                updated: `2026-07-${String((idx%28)+1).padStart(2,'0')}`,
                status: 'Active', usageCount: Math.floor(Math.random() * 100)
            });
        }
    });
}

function filterMasters() {
    const filterCat = document.getElementById('master-type-filter').value;
    if(filterCat === 'All') {
        masterFiltered = [...allMasters];
    } else {
        masterFiltered = allMasters.filter(m => m.cat === filterCat);
    }
    masterCurrentPage = 1;
    renderMastersTable();
}

// 2. Render KPIs
function renderMasterKPIs() {
    const counts = { total: allMasters.length, depts: 0, vTypes: 0, cCats: 0, iCats: 0, locs: 0 };
    allMasters.forEach(m => {
        if(m.cat === 'Departments') counts.depts++;
        if(m.cat === 'Vehicle Types') counts.vTypes++;
        if(m.cat === 'Checklist Categories') counts.cCats++;
        if(m.cat === 'Inspection Categories') counts.iCats++;
        if(['Regions', 'States', 'Cities', 'Locations'].includes(m.cat)) counts.locs++;
    });

    const kpis = [
        { label: "Total Masters", val: counts.total, icon: "fa-database", color: "text-blue-500" },
        { label: "Departments", val: counts.depts, icon: "fa-building", color: "text-indigo-500" },
        { label: "Vehicle Types", val: counts.vTypes, icon: "fa-truck", color: "text-orange-500" },
        { label: "Checklist Cats", val: counts.cCats, icon: "fa-list-ul", color: "text-purple-500" },
        { label: "Inspection Cats", val: counts.iCats, icon: "fa-clipboard-check", color: "text-green-500" },
        { label: "Locations/Regions", val: counts.locs, icon: "fa-map-marker-alt", color: "text-red-500" }
    ];
    document.getElementById('master-kpi-container').innerHTML = kpis.map(k => `
        <div class="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between card">
            <div>
                <p class="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">${k.label}</p>
                <h3 class="text-2xl font-black text-gray-800">${k.val}</h3>
            </div>
            <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border"><i class="fas ${k.icon} ${k.color} text-lg"></i></div>
        </div>`).join('');
}

// 3. Render Table
function renderMastersTable() {
    const tbody = document.getElementById('masters-table-body');
    const start = (masterCurrentPage - 1) * rowsPerPage;
    const paginatedData = masterFiltered.slice(start, start + rowsPerPage);
    
    tbody.innerHTML = paginatedData.map(r => {
        let bClass = '';
        if(r.status === 'Active') bClass = 'bg-green-100 text-green-700 border-green-200';
        else if(r.status === 'Archived') bClass = 'bg-red-100 text-red-700 border-red-200';
        else bClass = 'bg-gray-100 text-gray-700 border-gray-200';

        return `
        <tr class="hover:bg-blue-50/50 transition-colors group border-b border-gray-100">
            <td class="px-4 py-3 text-center"><input type="checkbox" onchange="masterSelectionChange()" class="master-row-checkbox rounded text-blue-600 border-gray-300"></td>
            <td class="px-4 py-3 font-semibold text-blue-600">${r.id}</td>
            <td class="px-4 py-3 font-bold text-gray-800">${r.name}</td>
            <td class="px-4 py-3"><span class="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs border border-indigo-100">${r.cat}</span></td>
            <td class="px-4 py-3 text-gray-600 max-w-[200px] truncate" title="${r.desc}">${r.desc}</td>
            <td class="px-4 py-3 text-gray-500 text-xs">${r.parent}</td>
            <td class="px-4 py-3 text-gray-600">${r.author}</td>
            <td class="px-4 py-3 text-gray-600">${r.updated}</td>
            <td class="px-4 py-3 text-center"><span class="px-2.5 py-1 rounded-full text-[11px] font-bold border ${bClass}">${r.status}</span></td>
            <td class="px-4 py-3 text-right sticky right-0 bg-white group-hover:bg-blue-50/50 transition-colors z-10 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] border-l">
                <div class="flex items-center justify-end gap-2">
                    <button onclick="openMasterDrawer('${r.id}')" class="p-1.5 text-blue-600 hover:bg-blue-100 rounded" title="View Details"><i class="fas fa-sitemap"></i></button>
                    <button class="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="p-1.5 text-gray-600 hover:bg-gray-200 rounded" title="More"><i class="fas fa-ellipsis-v px-1"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');

    // Pagination
    const totalPages = Math.ceil(masterFiltered.length / rowsPerPage) || 1;
    document.getElementById('master-pagination-info').innerText = `Showing ${masterFiltered.length > 0 ? start + 1 : 0} to ${Math.min(start + rowsPerPage, masterFiltered.length)} of ${masterFiltered.length} entries`;
    
    let buttons = `<button class="px-3 py-1 border rounded bg-white text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-50" ${masterCurrentPage === 1 ? 'disabled' : ''} onclick="masterCurrentPage--; renderMastersTable()">Prev</button>`;
    for(let i=1; i<=Math.min(totalPages, 5); i++) buttons += `<button class="px-3 py-1 border rounded text-sm ${masterCurrentPage === i ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}" onclick="masterCurrentPage=${i}; renderMastersTable()">${i}</button>`;
    buttons += `<button class="px-3 py-1 border rounded bg-white text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-50" ${masterCurrentPage === totalPages ? 'disabled' : ''} onclick="masterCurrentPage++; renderMastersTable()">Next</button>`;
    document.getElementById('master-pagination-controls').innerHTML = buttons;
}

function toggleAllMasters(source) { document.querySelectorAll('.master-row-checkbox').forEach(cb => cb.checked = source.checked); masterSelectionChange(); }
function masterSelectionChange() {
    const count = document.querySelectorAll('.master-row-checkbox:checked').length;
    const bar = document.getElementById('master-bulk-actions');
    document.getElementById('master-selected-count').innerText = count;
    if(count > 0) bar.classList.remove('hidden'); else bar.classList.add('hidden');
}

// 4. Master Details Drawer
function toggleMasterDrawer() {
    const d = document.getElementById('master-drawer'); const p = document.getElementById('master-drawer-panel');
    if (d.classList.contains('hidden')) { d.classList.remove('hidden'); setTimeout(() => p.classList.remove('translate-x-full'), 10); } 
    else { p.classList.add('translate-x-full'); setTimeout(() => d.classList.add('hidden'), 300); }
}

function openMasterDrawer(id) {
    const r = masterFiltered.find(x => x.id === id); if(!r) return;
    
    let bClass = r.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';

    document.getElementById('master-drawer-content').innerHTML = `
        <div class="flex justify-between items-start mb-6">
            <div>
                <h3 class="text-xl font-black text-slate-800">${r.name}</h3>
                <p class="text-sm text-gray-500">${r.id} • <span class="text-indigo-600 font-medium">${r.cat}</span></p>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-bold ${bClass}">${r.status}</span>
        </div>
        
        <div class="bg-blue-50/50 rounded-xl p-4 border border-blue-100 mb-6">
            <h4 class="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3">Hierarchy & Relations</h4>
            <div class="grid grid-cols-1 gap-3 text-sm">
                <div><span class="block text-gray-500 text-xs">Parent Record</span>
                    <span class="font-semibold ${r.parent === '-' ? 'text-gray-400' : 'text-gray-800'}"><i class="fas fa-level-up-alt mr-1"></i> ${r.parent}</span>
                </div>
                <div><span class="block text-gray-500 text-xs">Description</span><span class="font-medium text-gray-700">${r.desc}</span></div>
            </div>
        </div>

        <div class="space-y-4">
            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2">System Usage Information</h4>
            <div class="flex justify-between items-center text-sm"><span class="text-gray-600">Total Usage Count</span><span class="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">${r.usageCount} times</span></div>
            <div class="flex justify-between items-center text-sm"><span class="text-gray-600">Created By</span><span class="font-bold">${r.author}</span></div>
            <div class="flex justify-between items-center text-sm"><span class="text-gray-600">Last Modified</span><span class="font-bold">${r.updated}</span></div>
        </div>
        
        <div class="mt-6 pt-4 border-t space-y-3">
            <button class="w-full text-left p-3 rounded-lg border hover:bg-gray-50 flex justify-between items-center text-sm font-medium"><span class="text-gray-700"><i class="fas fa-link text-purple-500 mr-2"></i> View Linked Modules</span><i class="fas fa-chevron-right text-gray-400"></i></button>
            <button class="w-full text-left p-3 rounded-lg border hover:bg-gray-50 flex justify-between items-center text-sm font-medium"><span class="text-gray-700"><i class="fas fa-history text-teal-500 mr-2"></i> View Audit History</span><i class="fas fa-chevron-right text-gray-400"></i></button>
        </div>
    `;
    toggleMasterDrawer();
}

// 5. Add Master Wizard (4 Steps)
let masterWizStep = 1;
const masterWizTitles = ["Basic Info", "Relationships", "Rules", "Preview"];

function toggleMasterWizard() {
    const w = document.getElementById('master-wizard-modal');
    if (w.classList.contains('hidden')) { w.classList.remove('hidden'); masterWizStep = 1; renderMasterWizardUI(); } 
    else { w.classList.add('hidden'); }
}
function confirmCloseMasterWizard() { if(confirm("Discard new master record?")) { toggleMasterWizard(); } }

function renderMasterWizardUI() {
    document.getElementById('master-wizard-stepper').innerHTML = masterWizTitles.map((title, index) => {
        let st = index + 1; let isActive = st === masterWizStep; let isDone = st < masterWizStep;
        let bg = isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100' : isDone ? 'bg-green-500 text-white' : 'bg-white text-gray-400 border-2 border-gray-200';
        return `<div class="flex flex-col items-center relative z-10 w-1/4"><div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${bg} transition-all">${isDone ? '<i class="fas fa-check"></i>' : st}</div><span class="text-xs font-bold mt-2 ${isActive ? 'text-blue-600' : isDone ? 'text-green-600' : 'text-gray-400'}">${title}</span></div>`;
    }).join('');

    const contentArea = document.getElementById('master-wizard-step-content');
    if (masterWizStep === 1) {
        contentArea.innerHTML = `
            <h3 class="text-lg font-bold mb-4">Step 1: Basic Information</h3>
            <div class="grid grid-cols-2 gap-4 max-w-2xl">
                <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Master Category *</label>
                    <select class="w-full border rounded-lg px-4 py-2 outline-none focus:border-blue-500">
                        <option>Departments</option><option>Vehicle Types</option><option>Checklist Categories</option>
                    </select>
                </div>
                <div><label class="block text-sm font-medium text-gray-700 mb-1">Master Code *</label><input type="text" class="w-full border rounded-lg px-4 py-2 outline-none focus:border-blue-500" placeholder="e.g. DEP-01"></div>
                <div><label class="block text-sm font-medium text-gray-700 mb-1">Master Name *</label><input type="text" class="w-full border rounded-lg px-4 py-2 outline-none focus:border-blue-500" placeholder="e.g. Logistics"></div>
                <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea class="w-full border rounded-lg px-4 py-2 outline-none h-20" placeholder="Brief description..."></textarea></div>
            </div>`;
    } else if (masterWizStep === 2) {
        contentArea.innerHTML = `
            <h3 class="text-lg font-bold mb-4">Step 2: Hierarchical Relationships</h3>
            <div class="space-y-4 max-w-2xl">
                <div><label class="block text-sm font-medium text-gray-700 mb-1">Parent Record (Optional)</label>
                    <select class="w-full border rounded-lg px-4 py-2 outline-none focus:border-blue-500 text-gray-600">
                        <option value="">-- No Parent (Root Level) --</option>
                        <option>DEP-MN (Mining)</option>
                        <option>VCAT-HV (Heavy Machinery)</option>
                    </select>
                    <p class="text-xs text-gray-500 mt-1">Select a parent record if this is a sub-category or child element.</p>
                </div>
            </div>`;
    } else if (masterWizStep === 4) {
        contentArea.innerHTML = `<div class="text-center py-12"><div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"><i class="fas fa-check"></i></div><h3 class="text-xl font-bold text-gray-800">Ready to Save</h3><p class="text-gray-500 mt-2">The master record configuration is complete.</p></div>`;
    } else {
        contentArea.innerHTML = `<div class="flex flex-col items-center justify-center h-40 text-gray-400"><i class="fas fa-cog fa-spin text-3xl mb-3"></i><p>Configure ${masterWizTitles[masterWizStep-1]} Settings</p></div>`;
    }

    document.getElementById('master-wiz-btn-prev').disabled = masterWizStep === 1;
    const btnNext = document.getElementById('master-wiz-btn-next');
    if (masterWizStep === 4) {
        btnNext.innerHTML = '<i class="fas fa-save mr-2"></i> Save Record';
        btnNext.className = "px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium shadow hover:bg-green-700";
    } else {
        btnNext.innerHTML = 'Next Step <i class="fas fa-arrow-right ml-2"></i>';
        btnNext.className = "px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow hover:bg-blue-700";
    }
}
function nextMasterWizardStep() { if(masterWizStep < 4) { masterWizStep++; renderMasterWizardUI(); } else { alert("Master Record Added!"); toggleMasterWizard(); } }
function prevMasterWizardStep() { if(masterWizStep > 1) { masterWizStep--; renderMasterWizardUI(); } }

// Initial Boot
document.addEventListener('DOMContentLoaded', initDashboard);