// ==========================================
// NAVIGATION LOGIC
// ==========================================
function switchView(viewId) {
    document.getElementById('view-dashboard').classList.add('hidden');
    document.getElementById('view-reports').classList.add('hidden');
    document.getElementById('view-checklists').classList.add('hidden');
    document.getElementById('view-vehicles').classList.add('hidden');
    document.getElementById('view-operators').classList.add('hidden');
    document.getElementById('view-sites').classList.add('hidden');
    
    document.getElementById(viewId).classList.remove('hidden');

    const activeClass = 'flex items-center py-2.5 px-4 bg-blue-600 rounded-lg';
    const inactiveClass = 'flex items-center py-2.5 px-4 hover:bg-slate-800 rounded-lg';
    
    document.getElementById('nav-dashboard').className = viewId === 'view-dashboard' ? activeClass : inactiveClass;
    document.getElementById('nav-reports').className = viewId === 'view-reports' ? activeClass : inactiveClass;
    document.getElementById('nav-checklists').className = viewId === 'view-checklists' ? activeClass : inactiveClass;
    document.getElementById('nav-vehicles').className = viewId === 'view-vehicles' ? activeClass : inactiveClass;
    document.getElementById('nav-operators').className = viewId === 'view-operators' ? activeClass : inactiveClass;
    document.getElementById('nav-sites').className = viewId === 'view-sites' ? activeClass : inactiveClass;

    if(viewId === 'view-reports') initReportsModule();
    if(viewId === 'view-checklists') initChecklistsModule();
    if(viewId === 'view-vehicles') initVehiclesModule();
    if(viewId === 'view-operators') initOperatorsModule();
    if(viewId === 'view-sites') initSitesModule();
}

// ==========================================
// DASHBOARD, REPORTS, CHECKLISTS, VEHICLES, OPERATORS (Preserved Logic)
// ==========================================
function initDashboard() {
    const kpiData = [{title: "Vehicles", val: "156"}, {title: "Operators", val: "82"}, {title: "Inspection", val: "41"}, {title: "Pending", val: "18"}, {title: "Faulty", val: "12"}, {title: "Complete", val: "98%"}];
    const grid = document.getElementById('kpi-grid');
    if(grid && grid.innerHTML === '') kpiData.forEach(k => grid.innerHTML += `<div class="bg-white p-4 rounded-xl shadow-sm border card"><p class="text-[10px] text-gray-400 font-bold">${k.title}</p><h3 class="text-xl font-bold">${k.val}</h3></div>`);
    setInterval(() => { const c = document.getElementById('live-clock'); if(c) c.innerText = new Date().toLocaleTimeString(); }, 1000);
}

let allReports = []; let allChecklists = []; let allVehicles = []; let allOperators = [];
const rowsPerPage = 10;

function initReportsModule() { if(allReports.length === 0) { allReports = Array.from({length: 55}, (_, i) => ({ id: `VIESL-${1000+i}`, date: '2026-07-01', vehicleNo: `VPAV${260000+i}`, vehicleName: 'Excavator', site: 'Site Alpha', dept: 'Logistics', operator: `Operator ${i}`, condition: 'Good', safe: 'Yes', faults: 0, status: 'Approved', notes: '', photos: 2 })); document.getElementById('report-kpi-container').innerHTML = `<div class="bg-white p-4 rounded-xl shadow-sm border card"><p class="text-[11px] text-gray-500 font-bold">Total Reports</p><h3 class="text-2xl font-black text-gray-800">55</h3></div>`; document.getElementById('reports-table-body').innerHTML = allReports.slice(0, rowsPerPage).map(r => `<tr class="border-b"><td class="px-4 py-3"><input type="checkbox"></td><td class="px-4 py-3">${r.id}</td><td class="px-4 py-3 text-right"><button class="text-blue-600"><i class="fas fa-eye"></i></button></td></tr>`).join(''); } }
function initChecklistsModule() { if(allChecklists.length === 0) { allChecklists = Array.from({length: 28}, (_, i) => ({ id: `CHK-100${i}`, name: 'Daily Check', category: 'Engine', vType: 'Heavy', dept: 'Logistics', items: 25, author: 'Admin', updated: '2026-07-01', status: 'Active', version: 'v1.0' })); document.getElementById('checklist-kpi-container').innerHTML = `<div class="bg-white p-4 rounded-xl shadow-sm border card"><p class="text-[11px] text-gray-500 font-bold">Total Templates</p><h3 class="text-2xl font-black text-gray-800">28</h3></div>`; document.getElementById('checklists-table-body').innerHTML = allChecklists.slice(0, rowsPerPage).map(r => `<tr class="border-b"><td class="px-4 py-3"><input type="checkbox"></td><td class="px-4 py-3">${r.name}</td><td class="px-4 py-3 text-right"><button class="text-blue-600"><i class="fas fa-eye"></i></button></td></tr>`).join(''); } }
function initVehiclesModule() { if(allVehicles.length === 0) { allVehicles = Array.from({length: 105}, (_, i) => ({ id: `VPAV${260000+i}`, name: 'Caterpillar 320', type: 'Heavy Machinery', dept: 'Mining', site: 'Site Alpha', operator: 'John Doe', model: '2022', make: 'CAT', vin: '1HGCM826X123456', engine: '1200', odo: '15000', fuel: 'Diesel', lastInsp: '2026-07-01', status: 'Active' })); document.getElementById('vehicle-kpi-container').innerHTML = `<div class="bg-white p-4 rounded-xl shadow-sm border card"><p class="text-[11px] text-gray-500 font-bold">Total Vehicles</p><h3 class="text-2xl font-black text-gray-800">105</h3></div>`; document.getElementById('vehicles-table-body').innerHTML = allVehicles.slice(0, rowsPerPage).map(r => `<tr class="border-b"><td class="px-4 py-3"><input type="checkbox"></td><td class="px-4 py-3">${r.id}</td><td class="px-4 py-3 text-right"><button class="text-blue-600"><i class="fas fa-eye"></i></button></td></tr>`).join(''); } }
function initOperatorsModule() { if(allOperators.length === 0) { allOperators = Array.from({length: 82}, (_, i) => ({ id: `EMP-${2000+i}`, name: 'James Smith', avatar: `https://ui-avatars.com/api/?name=James+Smith`, mobile: '+1 555-0000', email: 'james@vac.com', dept: 'Mining', site: 'Site Alpha', assignedVehicles: 2, assignedChecklists: 4, exp: '5 Yrs', joinDate: '2022-01-15', lastLogin: 'Today', status: 'Active' })); document.getElementById('operator-kpi-container').innerHTML = `<div class="bg-white p-4 rounded-xl shadow-sm border card"><p class="text-[11px] text-gray-500 font-bold">Total Operators</p><h3 class="text-2xl font-black text-gray-800">82</h3></div>`; document.getElementById('operators-table-body').innerHTML = allOperators.slice(0, rowsPerPage).map(r => `<tr class="border-b"><td class="px-4 py-3"><input type="checkbox"></td><td class="px-4 py-3">${r.id}</td><td class="px-4 py-3 text-right"><button class="text-blue-600"><i class="fas fa-eye"></i></button></td></tr>`).join(''); } }


// ==========================================
// SITE MANAGEMENT MODULE (NEW)
// ==========================================
let allSites = [];
let siteCurrentPage = 1;

function initSitesModule() {
    if(allSites.length === 0) {
        generateDummySites();
        renderSiteKPIs();
        renderSitesTable();
    }
}

// 1. Generate 40+ Realistic Sites
function generateDummySites() {
    const sNames = ['Alpha Base', 'Omega Quarry', 'Metro Line C', 'Highway Ext 4', 'Central Hub', 'Coastal Plant'];
    const projects = ['City Infrastructure', 'Mining Op Delta', 'Highway Expansion', 'Logistics Network', 'Renewable Energy Plant'];
    const regions = ['North', 'South', 'East', 'West', 'Central'];
    const states = ['Maharashtra', 'Gujarat', 'Karnataka', 'Delhi', 'Texas', 'California'];
    const statuses = ['Active', 'Active', 'Active', 'Under Construction', 'On Hold', 'Completed', 'Inactive'];
    
    for(let i=1; i<=45; i++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        allSites.push({
            id: `SIT-${1000+i}`,
            name: `${sNames[Math.floor(Math.random() * sNames.length)]} ${i}`,
            region: regions[i % regions.length],
            state: states[i % states.length],
            project: projects[i % projects.length],
            manager: `Manager ${i%10 + 1}`,
            address: `${Math.floor(Math.random() * 900) + 100} Industrial Way, ${states[i % states.length]}`,
            lat: (Math.random() * (28 - 18) + 18).toFixed(4),
            lng: (Math.random() * (80 - 72) + 72).toFixed(4),
            assignedVehicles: status === 'Active' || status === 'Under Construction' ? Math.floor(Math.random() * 15) + 5 : 0,
            assignedOperators: status === 'Active' || status === 'Under Construction' ? Math.floor(Math.random() * 25) + 10 : 0,
            createdDate: `202${Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random()*12)+1).padStart(2,'0')}-01`,
            status: status,
            // Project Summary Stats
            progress: Math.floor(Math.random() * 100),
            startDate: `2023-05-10`,
            endDate: `2027-12-31`,
            compInsp: Math.floor(Math.random() * 500) + 100,
            pendInsp: Math.floor(Math.random() * 20) + 2
        });
    }
}

// 2. Render Site KPIs
function renderSiteKPIs() {
    const counts = { total: allSites.length, active: 0, inactive: 0, proj: new Set(), ops: 0, veh: 0 };
    allSites.forEach(s => {
        if(s.status === 'Active' || s.status === 'Under Construction') counts.active++;
        else counts.inactive++;
        
        if(s.status === 'Active' || s.status === 'Under Construction') counts.proj.add(s.project);
        
        counts.ops += s.assignedOperators;
        counts.veh += s.assignedVehicles;
    });

    const kpis = [
        { label: "Total Sites", val: counts.total, icon: "fa-map-marked-alt", color: "text-blue-500" },
        { label: "Active Sites", val: counts.active, icon: "fa-check-circle", color: "text-green-500" },
        { label: "Projects Running", val: counts.proj.size, icon: "fa-hard-hat", color: "text-orange-500" },
        { label: "Operators Assigned", val: counts.ops, icon: "fa-users", color: "text-purple-500" },
        { label: "Vehicles Deployed", val: counts.veh, icon: "fa-truck", color: "text-teal-500" },
        { label: "Inactive / Hold", val: counts.inactive, icon: "fa-pause-circle", color: "text-gray-500" }
    ];
    document.getElementById('site-kpi-container').innerHTML = kpis.map(k => `
        <div class="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between card">
            <div>
                <p class="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">${k.label}</p>
                <h3 class="text-2xl font-black text-gray-800">${k.val}</h3>
            </div>
            <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border"><i class="fas ${k.icon} ${k.color} text-lg"></i></div>
        </div>`).join('');
}

// 3. Render Table
function renderSitesTable() {
    const tbody = document.getElementById('sites-table-body');
    const start = (siteCurrentPage - 1) * rowsPerPage;
    const paginatedData = allSites.slice(start, start + rowsPerPage);
    
    tbody.innerHTML = paginatedData.map(r => {
        // Status Badge Logic
        let bClass = '';
        if(r.status === 'Active') bClass = 'bg-green-100 text-green-700 border-green-200';
        else if(r.status === 'Under Construction') bClass = 'bg-orange-100 text-orange-700 border-orange-200';
        else if(r.status === 'On Hold') bClass = 'bg-yellow-100 text-yellow-700 border-yellow-200';
        else if(r.status === 'Completed') bClass = 'bg-blue-100 text-blue-700 border-blue-200';
        else bClass = 'bg-gray-100 text-gray-700 border-gray-200';

        return `
        <tr class="hover:bg-blue-50/50 transition-colors group border-b border-gray-100">
            <td class="px-4 py-3 text-center"><input type="checkbox" onchange="siteSelectionChange()" class="site-row-checkbox rounded text-blue-600 border-gray-300"></td>
            <td class="px-4 py-3 font-semibold text-blue-600">${r.id}</td>
            <td class="px-4 py-3 font-medium text-gray-800">${r.name}</td>
            <td class="px-4 py-3 text-gray-600">${r.region} / ${r.state}</td>
            <td class="px-4 py-3 text-gray-600">${r.project}</td>
            <td class="px-4 py-3 text-gray-600">${r.manager}</td>
            <td class="px-4 py-3 text-center font-bold text-gray-600">${r.assignedVehicles}</td>
            <td class="px-4 py-3 text-center font-bold text-gray-600">${r.assignedOperators}</td>
            <td class="px-4 py-3 text-xs font-mono text-gray-500">${r.lat}, ${r.lng}</td>
            <td class="px-4 py-3 text-gray-600">${r.createdDate}</td>
            <td class="px-4 py-3 text-center"><span class="px-2.5 py-1 rounded-full text-[11px] font-bold border ${bClass}">${r.status}</span></td>
            <td class="px-4 py-3 text-right sticky right-0 bg-white group-hover:bg-blue-50/50 transition-colors z-10 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] border-l">
                <div class="flex items-center justify-end gap-2">
                    <button onclick="openSiteDrawer('${r.id}')" class="p-1.5 text-blue-600 hover:bg-blue-100 rounded" title="View Details"><i class="fas fa-map-marked-alt"></i></button>
                    <button class="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded" title="Assign Resources"><i class="fas fa-link"></i></button>
                    <button class="p-1.5 text-gray-600 hover:bg-gray-200 rounded" title="More"><i class="fas fa-ellipsis-v px-1"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');

    // Pagination
    const totalPages = Math.ceil(allSites.length / rowsPerPage);
    document.getElementById('site-pagination-info').innerText = `Showing ${start + 1} to ${Math.min(start + rowsPerPage, allSites.length)} of ${allSites.length} entries`;
    
    let buttons = `<button class="px-3 py-1 border rounded bg-white text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-50" ${siteCurrentPage === 1 ? 'disabled' : ''} onclick="siteCurrentPage--; renderSitesTable()">Prev</button>`;
    for(let i=1; i<=Math.min(totalPages, 5); i++) buttons += `<button class="px-3 py-1 border rounded text-sm ${siteCurrentPage === i ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}" onclick="siteCurrentPage=${i}; renderSitesTable()">${i}</button>`;
    buttons += `<button class="px-3 py-1 border rounded bg-white text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-50" ${siteCurrentPage === totalPages ? 'disabled' : ''} onclick="siteCurrentPage++; renderSitesTable()">Next</button>`;
    document.getElementById('site-pagination-controls').innerHTML = buttons;
}

// Bulk Selection
function toggleAllSites(source) { document.querySelectorAll('.site-row-checkbox').forEach(cb => cb.checked = source.checked); siteSelectionChange(); }
function siteSelectionChange() {
    const count = document.querySelectorAll('.site-row-checkbox:checked').length;
    const bar = document.getElementById('site-bulk-actions');
    document.getElementById('site-selected-count').innerText = count;
    if(count > 0) bar.classList.remove('hidden'); else bar.classList.add('hidden');
}

// 4. Site Drawer with Map Placeholder and Project Summary
function toggleSiteDrawer() {
    const d = document.getElementById('site-drawer'); const p = document.getElementById('site-drawer-panel');
    if (d.classList.contains('hidden')) { d.classList.remove('hidden'); setTimeout(() => p.classList.remove('translate-x-full'), 10); } 
    else { p.classList.add('translate-x-full'); setTimeout(() => d.classList.add('hidden'), 300); }
}

function openSiteDrawer(id) {
    const r = allSites.find(x => x.id === id); if(!r) return;
    
    let bClass = 'bg-gray-100 text-gray-700';
    if(r.status === 'Active') bClass = 'bg-green-100 text-green-700';
    else if(r.status === 'Under Construction') bClass = 'bg-orange-100 text-orange-700';
    else if(r.status === 'On Hold') bClass = 'bg-yellow-100 text-yellow-700';
    else if(r.status === 'Completed') bClass = 'bg-blue-100 text-blue-700';

    document.getElementById('site-drawer-content').innerHTML = `
        <div class="flex justify-between items-start mb-6">
            <div>
                <h3 class="text-xl font-black text-slate-800">${r.name}</h3>
                <p class="text-sm text-gray-500">${r.id} • ${r.project}</p>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-bold ${bClass}">${r.status}</span>
        </div>

        <!-- Google Maps UI Placeholder -->
        <div class="bg-slate-200 rounded-xl h-40 mb-6 flex flex-col items-center justify-center border shadow-inner relative overflow-hidden">
            <div class="absolute inset-0 bg-blue-100 opacity-20" style="background-image: repeating-linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), repeating-linear-gradient(45deg, #ccc 25%, #f3f4f6 25%, #f3f4f6 75%, #ccc 75%, #ccc); background-position: 0 0, 10px 10px; background-size: 20px 20px;"></div>
            <i class="fas fa-map-marker-alt text-4xl text-red-500 mb-2 drop-shadow-md z-10"></i>
            <span class="text-xs font-bold text-gray-700 z-10 bg-white/80 px-2 py-1 rounded">Map Integration Placeholder</span>
            <span class="text-[10px] font-mono text-gray-600 mt-1 z-10">Lat: ${r.lat} | Lng: ${r.lng}</span>
        </div>
        
        <div class="bg-blue-50/50 rounded-xl p-4 border border-blue-100 mb-6">
            <h4 class="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3">Project Summary</h4>
            <div class="mb-4">
                <div class="flex justify-between text-xs mb-1"><span class="font-bold text-gray-700">Project Progress</span><span class="text-blue-600 font-bold">${r.progress}%</span></div>
                <div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-blue-600 h-2 rounded-full" style="width: ${r.progress}%"></div></div>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div><span class="block text-gray-500 text-xs">Start Date</span><span class="font-semibold">${r.startDate}</span></div>
                <div><span class="block text-gray-500 text-xs">Est. Completion</span><span class="font-semibold">${r.endDate}</span></div>
                <div><span class="block text-gray-500 text-xs">Completed Insps.</span><span class="font-bold text-green-600">${r.compInsp}</span></div>
                <div><span class="block text-gray-500 text-xs">Pending Insps.</span><span class="font-bold text-orange-600">${r.pendInsp}</span></div>
            </div>
        </div>

        <div class="space-y-4">
            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2">Operational Details</h4>
            <div class="flex justify-between items-center text-sm"><span class="text-gray-600">Site Manager</span><span class="font-bold">${r.manager}</span></div>
            <div class="flex justify-between items-center text-sm"><span class="text-gray-600">Address</span><span class="font-bold text-right">${r.address}</span></div>
        </div>
        
        <div class="mt-6 pt-4 border-t space-y-3">
            <button class="w-full text-left p-3 rounded-lg border hover:bg-gray-50 flex justify-between items-center text-sm font-medium"><span class="text-gray-700"><i class="fas fa-truck text-teal-500 mr-2"></i> View Assigned Vehicles (${r.assignedVehicles})</span><i class="fas fa-chevron-right text-gray-400"></i></button>
            <button class="w-full text-left p-3 rounded-lg border hover:bg-gray-50 flex justify-between items-center text-sm font-medium"><span class="text-gray-700"><i class="fas fa-users text-purple-500 mr-2"></i> View Assigned Operators (${r.assignedOperators})</span><i class="fas fa-chevron-right text-gray-400"></i></button>
            <button class="w-full text-left p-3 rounded-lg border hover:bg-gray-50 flex justify-between items-center text-sm font-medium"><span class="text-gray-700"><i class="fas fa-file-contract text-red-500 mr-2"></i> View Site Documents</span><i class="fas fa-chevron-right text-gray-400"></i></button>
        </div>
    `;
    toggleSiteDrawer();
}

// 5. Add Site Wizard
let siteWizStep = 1;
const siteWizTitles = ["Basic Info", "Location", "Project", "Assignments", "Documents", "Preview"];

function toggleSiteWizard() {
    const w = document.getElementById('site-wizard-modal');
    if (w.classList.contains('hidden')) { w.classList.remove('hidden'); siteWizStep = 1; renderSiteWizardUI(); } 
    else { w.classList.add('hidden'); }
}
function confirmCloseSiteWizard() { if(confirm("Discard new site entry?")) { toggleSiteWizard(); } }

function renderSiteWizardUI() {
    document.getElementById('site-wizard-stepper').innerHTML = siteWizTitles.map((title, index) => {
        let st = index + 1; let isActive = st === siteWizStep; let isDone = st < siteWizStep;
        let bg = isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100' : isDone ? 'bg-green-500 text-white' : 'bg-white text-gray-400 border-2 border-gray-200';
        return `<div class="flex flex-col items-center relative z-10 w-1/6"><div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${bg} transition-all">${isDone ? '<i class="fas fa-check"></i>' : st}</div><span class="text-xs font-bold mt-2 ${isActive ? 'text-blue-600' : isDone ? 'text-green-600' : 'text-gray-400'}">${title}</span></div>`;
    }).join('');

    const contentArea = document.getElementById('site-wizard-step-content');
    if (siteWizStep === 1) {
        contentArea.innerHTML = `
            <h3 class="text-lg font-bold mb-4">Step 1: Basic Information</h3>
            <div class="grid grid-cols-2 gap-4 max-w-3xl">
                <div><label class="block text-sm font-medium text-gray-700 mb-1">Site Name *</label><input type="text" class="w-full border rounded-lg px-4 py-2 outline-none focus:border-blue-500" placeholder="e.g. Metro Line C Hub"></div>
                <div><label class="block text-sm font-medium text-gray-700 mb-1">Site Code *</label><input type="text" class="w-full border rounded-lg px-4 py-2 outline-none focus:border-blue-500" placeholder="e.g. SIT-1045"></div>
                <div><label class="block text-sm font-medium text-gray-700 mb-1">Site Manager</label><input type="text" class="w-full border rounded-lg px-4 py-2 outline-none" placeholder="Manager Name"></div>
                <div><label class="block text-sm font-medium text-gray-700 mb-1">Contact Number</label><input type="text" class="w-full border rounded-lg px-4 py-2 outline-none" placeholder="+1 555-0000"></div>
            </div>`;
    } else if (siteWizStep === 2) {
        contentArea.innerHTML = `
            <h3 class="text-lg font-bold mb-4">Step 2: Location Data</h3>
            <div class="grid grid-cols-2 gap-4 max-w-3xl mb-4">
                <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Full Address *</label><input type="text" class="w-full border rounded-lg px-4 py-2 outline-none" placeholder="123 Industrial Way..."></div>
                <div><label class="block text-sm font-medium text-gray-700 mb-1">Latitude</label><input type="text" class="w-full border rounded-lg px-4 py-2 outline-none" placeholder="19.0760"></div>
                <div><label class="block text-sm font-medium text-gray-700 mb-1">Longitude</label><input type="text" class="w-full border rounded-lg px-4 py-2 outline-none" placeholder="72.8777"></div>
            </div>
            <div class="bg-slate-200 rounded-xl h-32 flex items-center justify-center border shadow-inner"><i class="fas fa-map-marker-alt text-3xl text-gray-400"></i><span class="ml-2 text-sm text-gray-500 font-medium">Map Preview Placeholder</span></div>
            `;
    } else if (siteWizStep === 6) {
        contentArea.innerHTML = `<div class="text-center py-12"><div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"><i class="fas fa-check"></i></div><h3 class="text-xl font-bold text-gray-800">Ready to Save</h3><p class="text-gray-500 mt-2">Site configuration is complete and ready for deployment.</p></div>`;
    } else {
        contentArea.innerHTML = `<div class="flex flex-col items-center justify-center h-40 text-gray-400"><i class="fas fa-cog fa-spin text-3xl mb-3"></i><p>Configure ${siteWizTitles[siteWizStep-1]} Settings</p></div>`;
    }

    document.getElementById('site-wiz-btn-prev').disabled = siteWizStep === 1;
    const btnNext = document.getElementById('site-wiz-btn-next');
    if (siteWizStep === 6) {
        btnNext.innerHTML = '<i class="fas fa-save mr-2"></i> Save Site';
        btnNext.className = "px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium shadow hover:bg-green-700";
    } else {
        btnNext.innerHTML = 'Next Step <i class="fas fa-arrow-right ml-2"></i>';
        btnNext.className = "px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow hover:bg-blue-700";
    }
}
function nextSiteWizardStep() { if(siteWizStep < 6) { siteWizStep++; renderSiteWizardUI(); } else { alert("Site Added Successfully!"); toggleSiteWizard(); } }
function prevSiteWizardStep() { if(siteWizStep > 1) { siteWizStep--; renderSiteWizardUI(); } }

// Initial Boot
document.addEventListener('DOMContentLoaded', initDashboard);