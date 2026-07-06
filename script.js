// ==========================================
// NAVIGATION LOGIC
// ==========================================
function switchView(viewId) {
    document.getElementById('view-dashboard').classList.add('hidden');
    document.getElementById('view-reports').classList.add('hidden');
    document.getElementById('view-checklists').classList.add('hidden');
    document.getElementById('view-vehicles').classList.add('hidden');
    
    document.getElementById(viewId).classList.remove('hidden');

    const activeClass = 'flex items-center py-2.5 px-4 bg-blue-600 rounded-lg';
    const inactiveClass = 'flex items-center py-2.5 px-4 hover:bg-slate-800 rounded-lg';
    
    document.getElementById('nav-dashboard').className = viewId === 'view-dashboard' ? activeClass : inactiveClass;
    document.getElementById('nav-reports').className = viewId === 'view-reports' ? activeClass : inactiveClass;
    document.getElementById('nav-checklists').className = viewId === 'view-checklists' ? activeClass : inactiveClass;
    document.getElementById('nav-vehicles').className = viewId === 'view-vehicles' ? activeClass : inactiveClass;

    if(viewId === 'view-reports') initReportsModule();
    if(viewId === 'view-checklists') initChecklistsModule();
    if(viewId === 'view-vehicles') initVehiclesModule();
}

// ==========================================
// DASHBOARD LOGIC (Preserved)
// ==========================================
function initDashboard() {
    const kpiData = [{title: "Vehicles", val: "156"}, {title: "Operators", val: "82"}, {title: "Inspection", val: "41"}, {title: "Pending", val: "18"}, {title: "Faulty", val: "12"}, {title: "Complete", val: "98%"}];
    const grid = document.getElementById('kpi-grid');
    if(grid) kpiData.forEach(k => grid.innerHTML += `<div class="bg-white p-4 rounded-xl shadow-sm border card"><p class="text-[10px] text-gray-400 font-bold">${k.title}</p><h3 class="text-xl font-bold">${k.val}</h3></div>`);

    if(document.getElementById('issueChart')) {
        new Chart(document.getElementById('issueChart'), { type: 'bar', data: { labels: ['R', 'P', 'P'], datasets: [{ data: [12, 5, 16], backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'] }] } });
        new Chart(document.getElementById('inspectionChart'), { type: 'doughnut', data: { labels: ['Good', 'Faulty'], datasets: [{ data: [177, 17], backgroundColor: ['#22c55e', '#ec4899'] }] } });
        new Chart(document.getElementById('faultChart'), { type: 'bar', data: { labels: ['F', 'R', 'R'], datasets: [{ data: [17, 21, 8], backgroundColor: ['#ef4444', '#eab308', '#3b82f6'] }] } });
    }

    const topLists = { faulty: [{name: "VPAV260081", count: 12}], repair: [{name: "Brake Pads", count: 15}], replace: [{name: "Tires", count: 6}] };
    Object.keys(topLists).forEach(key => {
        const list = document.getElementById(`${key}-vehicles-list`) || document.getElementById(`${key}-items-list`);
        if(list) topLists[key].forEach(i => list.innerHTML += `<div class="flex justify-between text-sm border-b pb-2"><span>${i.name}</span><span class="font-bold">${i.count}</span></div>`);
    });

    setInterval(() => { const c = document.getElementById('live-clock'); if(c) c.innerText = new Date().toLocaleTimeString(); }, 1000);
}

// ==========================================
// INSPECTION REPORTS MODULE (Preserved)
// ==========================================
let allReports = []; let currentPage = 1; const rowsPerPage = 10;
function initReportsModule() { if(allReports.length === 0) { generateDummyReports(); renderReportKPIs(); loadReportsData(); } }
function generateDummyReports() { for(let i=1; i<=55; i++) { allReports.push({ id: `VIESL-${1000+i}`, date: `2026-07-${String((i%30)+1).padStart(2, '0')}`, vehicleNo: `VPAV${260000+i}`, vehicleName: 'Excavator', site: 'Site Alpha', dept: 'Logistics', operator: `Operator ${i}`, condition: 'Good', safe: i%6===0?'No':'Yes', faults: i%6===0?2:0, status: ['Approved','Pending','Rejected','Draft'][i%4], notes: 'Standard check.', photos: 2 }); } }
function renderReportKPIs() { document.getElementById('report-kpi-container').innerHTML = [ { label: "Total Reports", val: "55", icon: "fa-folder-open", color: "text-blue-500" }, { label: "Approved", val: "28", icon: "fa-check-circle", color: "text-green-500" }, { label: "Pending", val: "14", icon: "fa-clock", color: "text-orange-500" }, { label: "Rejected", val: "8", icon: "fa-times-circle", color: "text-red-500" }, { label: "Today's Reports", val: "12", icon: "fa-calendar-day", color: "text-indigo-500" }, { label: "Avg. Insp. Time", val: "14m", icon: "fa-stopwatch", color: "text-teal-500" } ].map(k => `<div class="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between card"><div><p class="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">${k.label}</p><h3 class="text-2xl font-black text-gray-800">${k.val}</h3></div><div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border"><i class="fas ${k.icon} ${k.color} text-lg"></i></div></div>`).join(''); }
function loadReportsData() { renderTable(); }
function renderTable() {
    const tbody = document.getElementById('reports-table-body'); const start = (currentPage - 1) * rowsPerPage; const pag = allReports.slice(start, start + rowsPerPage);
    tbody.innerHTML = pag.map(r => `<tr class="hover:bg-blue-50/50 transition-colors cursor-default group border-b"><td class="px-4 py-3 text-center"><input type="checkbox" class="rounded text-blue-600 border-gray-300"></td><td class="px-4 py-3 font-semibold text-blue-600">${r.id}</td><td class="px-4 py-3 text-gray-600">${r.date}</td><td class="px-4 py-3"><div class="font-medium text-gray-800">${r.vehicleNo}</div><div class="text-xs text-gray-500">${r.vehicleName}</div></td><td class="px-4 py-3"><div class="text-gray-800">${r.site}</div><div class="text-xs text-gray-500">${r.dept}</div></td><td class="px-4 py-3 text-gray-600">${r.operator}</td><td class="px-4 py-3 text-gray-600">${r.condition}</td><td class="px-4 py-3 text-center">${r.safe === 'Yes' ? '<i class="fas fa-check text-green-500"></i>' : '<i class="fas fa-times text-red-500"></i>'}</td><td class="px-4 py-3 text-center"><span class="${r.faults > 0 ? 'bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold' : 'text-gray-400'}">${r.faults}</span></td><td class="px-4 py-3"><span class="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-gray-100">${r.status}</span></td><td class="px-4 py-3 text-right"><button onclick="openDrawer('${r.id}')" class="p-1.5 text-blue-600 hover:bg-blue-100 rounded"><i class="fas fa-eye"></i></button></td></tr>`).join('');
    document.getElementById('pagination-info').innerText = `Showing ${start + 1} to ${Math.min(start + rowsPerPage, allReports.length)} of ${allReports.length} entries`;
}
function toggleDrawer() { const d = document.getElementById('report-drawer'); const p = document.getElementById('drawer-panel'); if (d.classList.contains('hidden')) { d.classList.remove('hidden'); setTimeout(() => p.classList.remove('translate-x-full'), 10); } else { p.classList.add('translate-x-full'); setTimeout(() => d.classList.add('hidden'), 300); } }
function openDrawer(id) { toggleDrawer(); }

// ==========================================
// INSPECTION CHECKLIST MODULE (Preserved)
// ==========================================
let allChecklists = []; let chkCurrentPage = 1;
function initChecklistsModule() { if(allChecklists.length === 0) { generateDummyChecklists(); renderChecklistKPIs(); renderChecklistTable(); } }
function generateDummyChecklists() { for(let i=1; i<=28; i++) { allChecklists.push({ id: `CHK-100${i}`, name: 'Daily Check', category: 'Engine', vType: 'Heavy', dept: 'Logistics', items: 25, author: 'Admin', updated: '2026-07-01', status: 'Active', version: 'v1.0' }); } }
function renderChecklistKPIs() { document.getElementById('checklist-kpi-container').innerHTML = [ { label: "Total Templates", val: "28", icon: "fa-list-alt", color: "text-blue-500" }, { label: "Categories", val: "10", icon: "fa-tags", color: "text-purple-500" }, { label: "Active", val: "18", icon: "fa-check-circle", color: "text-green-500" }, { label: "Inactive/Draft", val: "8", icon: "fa-pause-circle", color: "text-orange-500" }].map(k => `<div class="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between card"><div><p class="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">${k.label}</p><h3 class="text-2xl font-black text-gray-800">${k.val}</h3></div><div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border"><i class="fas ${k.icon} ${k.color} text-lg"></i></div></div>`).join(''); }
function renderChecklistTable() { 
    const tbody = document.getElementById('checklists-table-body'); const start = (chkCurrentPage - 1) * rowsPerPage; const pag = allChecklists.slice(start, start + rowsPerPage);
    tbody.innerHTML = pag.map(r => `<tr class="hover:bg-blue-50/50 border-b"><td class="px-4 py-3 text-center"><input type="checkbox" onchange="chkSelectionChange()" class="chk-row-checkbox rounded text-blue-600 border-gray-300"></td><td class="px-4 py-3 font-semibold">${r.name}</td><td class="px-4 py-3">${r.category}</td><td class="px-4 py-3">${r.vType}</td><td class="px-4 py-3">${r.dept}</td><td class="px-4 py-3 text-center">${r.items}</td><td class="px-4 py-3">${r.author}</td><td class="px-4 py-3">${r.updated}</td><td class="px-4 py-3 text-center"><span class="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-green-100 text-green-700">${r.status}</span></td><td class="px-4 py-3 text-right"><button onclick="openChecklistDrawer('${r.id}')" class="p-1.5 text-blue-600 hover:bg-blue-100 rounded"><i class="fas fa-eye"></i></button></td></tr>`).join('');
    document.getElementById('chk-pagination-info').innerText = `Showing ${start + 1} to ${Math.min(start + rowsPerPage, allChecklists.length)} of ${allChecklists.length} entries`;
}
function toggleAllChecklists(source) { document.querySelectorAll('.chk-row-checkbox').forEach(cb => cb.checked = source.checked); chkSelectionChange(); }
function chkSelectionChange() { const count = document.querySelectorAll('.chk-row-checkbox:checked').length; const bar = document.getElementById('chk-bulk-actions'); document.getElementById('chk-selected-count').innerText = count; if(count > 0) bar.classList.remove('hidden'); else bar.classList.add('hidden'); }
function toggleChecklistDrawer() { const d = document.getElementById('checklist-drawer'); const p = document.getElementById('chk-drawer-panel'); if (d.classList.contains('hidden')) { d.classList.remove('hidden'); setTimeout(() => p.classList.remove('translate-x-full'), 10); } else { p.classList.add('translate-x-full'); setTimeout(() => d.classList.add('hidden'), 300); } }
function openChecklistDrawer(id) { toggleChecklistDrawer(); }
let currentWizStep = 1; function toggleWizardDrawer() { const w = document.getElementById('wizard-modal'); if (w.classList.contains('hidden')) { w.classList.remove('hidden'); } else { w.classList.add('hidden'); } }
function confirmCloseWizard() { toggleWizardDrawer(); }

// ==========================================
// VEHICLE MANAGEMENT MODULE (NEW)
// ==========================================
let allVehicles = [];
let vehCurrentPage = 1;

function initVehiclesModule() {
    if(allVehicles.length === 0) {
        generateDummyVehicles();
        renderVehicleKPIs();
        renderVehiclesTable();
    }
}

// 1. Generate 100+ Realistic Vehicles
function generateDummyVehicles() {
    const vNames = ['Caterpillar 320', 'Volvo A40G', 'Toyota Hilux', 'Komatsu D155A', 'JCB 3DX', 'Scania R500', 'Bobcat S590'];
    const vTypes = ['Heavy Machinery', 'Articulated Truck', 'Light Vehicle', 'Bulldozer', 'Backhoe Loader', 'Haulage', 'Skid Steer'];
    const depts = ['Construction', 'Mining', 'Logistics', 'Operations', 'Maintenance'];
    const sites = ['Site Alpha', 'Site Beta', 'Delta Yard', 'Omega Quarry'];
    const makes = ['Caterpillar', 'Volvo', 'Toyota', 'Komatsu', 'JCB', 'Scania', 'Bobcat'];
    const statuses = ['Active', 'Active', 'Active', 'Maintenance', 'Breakdown', 'In Transit', 'Inactive'];

    for(let i=1; i<=105; i++) {
        const randIdx = i % vNames.length;
        allVehicles.push({
            id: `VPAV${String(260000+i)}`,
            name: vNames[randIdx],
            type: vTypes[randIdx],
            dept: depts[i % depts.length],
            site: sites[i % sites.length],
            operator: i%4===0 ? 'Unassigned' : `Operator ${i%20 + 1}`,
            model: `Model ${Math.floor(Math.random()*100)+2000}`,
            make: makes[randIdx],
            vin: `1HGCM826X${String(Math.floor(Math.random()*1000000)).padStart(6,'0')}`,
            engine: (Math.random() * 5000).toFixed(0),
            odo: (Math.random() * 150000).toFixed(0),
            fuel: i%2===0 ? 'Diesel' : 'Electric',
            lastInsp: `2026-07-${String((i%30)+1).padStart(2, '0')}`,
            status: statuses[Math.floor(Math.random() * statuses.length)]
        });
    }
}

// 2. Render Vehicle KPIs
function renderVehicleKPIs() {
    const counts = { total: allVehicles.length, active: 0, inactive: 0, maint: 0, break: 0, transit: 0 };
    allVehicles.forEach(v => {
        if(v.status === 'Active') counts.active++;
        else if(v.status === 'Inactive') counts.inactive++;
        else if(v.status === 'Maintenance') counts.maint++;
        else if(v.status === 'Breakdown') counts.break++;
        else if(v.status === 'In Transit') counts.transit++;
    });

    const kpis = [
        { label: "Total Vehicles", val: counts.total, icon: "fa-truck", color: "text-blue-500" },
        { label: "Active", val: counts.active, icon: "fa-check-circle", color: "text-green-500" },
        { label: "In Transit", val: counts.transit, icon: "fa-route", color: "text-indigo-500" },
        { label: "Maintenance", val: counts.maint, icon: "fa-tools", color: "text-orange-500" },
        { label: "Breakdown", val: counts.break, icon: "fa-exclamation-triangle", color: "text-red-500" },
        { label: "Inactive", val: counts.inactive, icon: "fa-power-off", color: "text-gray-500" }
    ];
    document.getElementById('vehicle-kpi-container').innerHTML = kpis.map(k => `
        <div class="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between card">
            <div>
                <p class="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">${k.label}</p>
                <h3 class="text-2xl font-black text-gray-800">${k.val}</h3>
            </div>
            <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border">
                <i class="fas ${k.icon} ${k.color} text-lg"></i>
            </div>
        </div>`).join('');
}

// 3. Render Table
function renderVehiclesTable() {
    const tbody = document.getElementById('vehicles-table-body');
    const start = (vehCurrentPage - 1) * rowsPerPage;
    const paginatedData = allVehicles.slice(start, start + rowsPerPage);
    
    tbody.innerHTML = paginatedData.map(r => {
        // Status Badge Logic
        let bClass = '';
        if(r.status === 'Active') bClass = 'bg-green-100 text-green-700 border-green-200';
        else if(r.status === 'Maintenance') bClass = 'bg-orange-100 text-orange-700 border-orange-200';
        else if(r.status === 'Breakdown') bClass = 'bg-red-100 text-red-700 border-red-200';
        else if(r.status === 'In Transit') bClass = 'bg-blue-100 text-blue-700 border-blue-200';
        else bClass = 'bg-gray-100 text-gray-700 border-gray-200';

        return `
        <tr class="hover:bg-blue-50/50 transition-colors group border-b border-gray-100">
            <td class="px-4 py-3 text-center"><input type="checkbox" onchange="vehSelectionChange()" class="veh-row-checkbox rounded text-blue-600 border-gray-300"></td>
            <td class="px-4 py-3 font-semibold text-blue-600">${r.id}</td>
            <td class="px-4 py-3 font-medium text-gray-800">${r.name}</td>
            <td class="px-4 py-3 text-gray-600">${r.type}</td>
            <td class="px-4 py-3 text-gray-600">${r.dept}</td>
            <td class="px-4 py-3 text-gray-600">${r.site}</td>
            <td class="px-4 py-3 text-gray-600 ${r.operator==='Unassigned'?'italic opacity-70':''}">${r.operator}</td>
            <td class="px-4 py-3 text-gray-600">${r.model}</td>
            <td class="px-4 py-3 text-gray-600">${r.make}</td>
            <td class="px-4 py-3 text-xs font-mono text-gray-500">${r.vin}</td>
            <td class="px-4 py-3 text-gray-600">${r.engine}h / ${r.odo}km</td>
            <td class="px-4 py-3 text-gray-600">${r.fuel}</td>
            <td class="px-4 py-3 text-gray-600">${r.lastInsp}</td>
            <td class="px-4 py-3 text-center"><span class="px-2.5 py-1 rounded-full text-[11px] font-bold border ${bClass}">${r.status}</span></td>
            <td class="px-4 py-3 text-right sticky right-0 bg-white group-hover:bg-blue-50/50 transition-colors z-10 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] border-l">
                <div class="flex items-center justify-end gap-2">
                    <button onclick="openVehicleDrawer('${r.id}')" class="p-1.5 text-blue-600 hover:bg-blue-100 rounded" title="View"><i class="fas fa-eye"></i></button>
                    <button class="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="p-1.5 text-gray-600 hover:bg-gray-200 rounded" title="More"><i class="fas fa-ellipsis-v px-1"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');

    // Pagination
    const totalPages = Math.ceil(allVehicles.length / rowsPerPage);
    document.getElementById('veh-pagination-info').innerText = `Showing ${start + 1} to ${Math.min(start + rowsPerPage, allVehicles.length)} of ${allVehicles.length} entries`;
    
    let buttons = `<button class="px-3 py-1 border rounded bg-white text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-50" ${vehCurrentPage === 1 ? 'disabled' : ''} onclick="vehCurrentPage--; renderVehiclesTable()">Prev</button>`;
    for(let i=1; i<=Math.min(totalPages, 5); i++) buttons += `<button class="px-3 py-1 border rounded text-sm ${vehCurrentPage === i ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}" onclick="vehCurrentPage=${i}; renderVehiclesTable()">${i}</button>`;
    buttons += `<button class="px-3 py-1 border rounded bg-white text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-50" ${vehCurrentPage === totalPages ? 'disabled' : ''} onclick="vehCurrentPage++; renderVehiclesTable()">Next</button>`;
    document.getElementById('veh-pagination-controls').innerHTML = buttons;
}

// Bulk Selection
function toggleAllVehicles(source) { document.querySelectorAll('.veh-row-checkbox').forEach(cb => cb.checked = source.checked); vehSelectionChange(); }
function vehSelectionChange() {
    const count = document.querySelectorAll('.veh-row-checkbox:checked').length;
    const bar = document.getElementById('veh-bulk-actions');
    document.getElementById('veh-selected-count').innerText = count;
    if(count > 0) bar.classList.remove('hidden'); else bar.classList.add('hidden');
}

// 4. Vehicle Drawer
function toggleVehicleDrawer() {
    const d = document.getElementById('vehicle-drawer'); const p = document.getElementById('veh-drawer-panel');
    if (d.classList.contains('hidden')) { d.classList.remove('hidden'); setTimeout(() => p.classList.remove('translate-x-full'), 10); } 
    else { p.classList.add('translate-x-full'); setTimeout(() => d.classList.add('hidden'), 300); }
}

function openVehicleDrawer(id) {
    const r = allVehicles.find(x => x.id === id); if(!r) return;
    
    let bClass = 'bg-gray-100 text-gray-700';
    if(r.status === 'Active') bClass = 'bg-green-100 text-green-700';
    else if(r.status === 'Maintenance') bClass = 'bg-orange-100 text-orange-700';
    else if(r.status === 'Breakdown') bClass = 'bg-red-100 text-red-700';
    else if(r.status === 'In Transit') bClass = 'bg-blue-100 text-blue-700';

    document.getElementById('veh-drawer-content').innerHTML = `
        <div class="flex justify-between items-start mb-6">
            <div><h3 class="text-xl font-black text-slate-800">${r.name}</h3><p class="text-sm text-gray-500">${r.id} • ${r.type}</p></div>
            <span class="px-3 py-1 rounded-full text-xs font-bold ${bClass}">${r.status}</span>
        </div>
        
        <div class="bg-blue-50/50 rounded-xl p-4 border border-blue-100 mb-6">
            <h4 class="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3">Registration & Info</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div><span class="block text-gray-500 text-xs">Manufacturer</span><span class="font-semibold">${r.make}</span></div>
                <div><span class="block text-gray-500 text-xs">Model Year</span><span class="font-semibold">${r.model}</span></div>
                <div class="col-span-2"><span class="block text-gray-500 text-xs">VIN Number</span><span class="font-mono font-semibold">${r.vin}</span></div>
            </div>
        </div>

        <div class="space-y-4">
            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2">Operational Details</h4>
            <div class="flex justify-between items-center text-sm"><span class="text-gray-600">Assigned Operator</span><span class="font-bold">${r.operator}</span></div>
            <div class="flex justify-between items-center text-sm"><span class="text-gray-600">Current Site</span><span class="font-bold">${r.site}</span></div>
            <div class="flex justify-between items-center text-sm"><span class="text-gray-600">Engine Hours</span><span class="font-bold">${r.engine} h</span></div>
            <div class="flex justify-between items-center text-sm"><span class="text-gray-600">Odometer</span><span class="font-bold">${r.odo} km</span></div>
        </div>
        
        <div class="mt-6 pt-4 border-t space-y-3">
            <button class="w-full text-left p-3 rounded-lg border hover:bg-gray-50 flex justify-between items-center text-sm font-medium"><span class="text-gray-700"><i class="fas fa-history text-blue-500 mr-2"></i> Inspection History</span><i class="fas fa-chevron-right text-gray-400"></i></button>
            <button class="w-full text-left p-3 rounded-lg border hover:bg-gray-50 flex justify-between items-center text-sm font-medium"><span class="text-gray-700"><i class="fas fa-file-pdf text-red-500 mr-2"></i> Documents (RC, PUC, Ins.)</span><i class="fas fa-chevron-right text-gray-400"></i></button>
        </div>
    `;
    toggleVehicleDrawer();
}

// 5. Add Vehicle Wizard
let vehWizStep = 1;
const vehWizTitles = ["Basic Info", "Technical", "Assignment", "Inspections", "Documents", "Preview"];

function toggleVehicleWizard() {
    const w = document.getElementById('vehicle-wizard-modal');
    if (w.classList.contains('hidden')) { w.classList.remove('hidden'); vehWizStep = 1; renderVehWizardUI(); } 
    else { w.classList.add('hidden'); }
}
function confirmCloseVehWizard() { if(confirm("Discard new vehicle entry?")) { toggleVehicleWizard(); } }

function renderVehWizardUI() {
    document.getElementById('veh-wizard-stepper').innerHTML = vehWizTitles.map((title, index) => {
        let st = index + 1; let isActive = st === vehWizStep; let isDone = st < vehWizStep;
        let bg = isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100' : isDone ? 'bg-green-500 text-white' : 'bg-white text-gray-400 border-2 border-gray-200';
        return `<div class="flex flex-col items-center relative z-10 w-1/6"><div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${bg} transition-all">${isDone ? '<i class="fas fa-check"></i>' : st}</div><span class="text-xs font-bold mt-2 ${isActive ? 'text-blue-600' : isDone ? 'text-green-600' : 'text-gray-400'}">${title}</span></div>`;
    }).join('');

    const contentArea = document.getElementById('veh-wizard-step-content');
    if (vehWizStep === 1) {
        contentArea.innerHTML = `
            <h3 class="text-lg font-bold mb-4">Step 1: Basic Information</h3>
            <div class="grid grid-cols-2 gap-4 max-w-3xl">
                <div><label class="block text-sm font-medium text-gray-700 mb-1">Vehicle Name *</label><input type="text" class="w-full border rounded-lg px-4 py-2 outline-none focus:border-blue-500" placeholder="e.g. Caterpillar 320"></div>
                <div><label class="block text-sm font-medium text-gray-700 mb-1">Vehicle Number *</label><input type="text" class="w-full border rounded-lg px-4 py-2 outline-none focus:border-blue-500" placeholder="e.g. VPAV260100"></div>
                <div><label class="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label><input type="text" class="w-full border rounded-lg px-4 py-2 outline-none" placeholder="e.g. Caterpillar"></div>
                <div><label class="block text-sm font-medium text-gray-700 mb-1">Model Year</label><input type="number" class="w-full border rounded-lg px-4 py-2 outline-none" placeholder="2026"></div>
            </div>`;
    } else if (vehWizStep === 5) {
        contentArea.innerHTML = `
            <h3 class="text-lg font-bold mb-4">Step 5: Document Uploads</h3>
            <div class="space-y-3 max-w-2xl">
                <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 cursor-pointer">
                    <i class="fas fa-cloud-upload-alt text-3xl text-blue-500 mb-2"></i>
                    <p class="text-sm font-medium text-gray-700">Drag & drop files or click to upload</p>
                    <p class="text-xs text-gray-500 mt-1">Upload RC, Insurance, PUC, Permits (PDF, JPG)</p>
                </div>
            </div>`;
    } else if (vehWizStep === 6) {
        contentArea.innerHTML = `<div class="text-center py-12"><div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"><i class="fas fa-check"></i></div><h3 class="text-xl font-bold text-gray-800">Ready to Save</h3><p class="text-gray-500 mt-2">Vehicle profile has been configured successfully.</p></div>`;
    } else {
        contentArea.innerHTML = `<div class="flex flex-col items-center justify-center h-40 text-gray-400"><i class="fas fa-cog fa-spin text-3xl mb-3"></i><p>Configure ${vehWizTitles[vehWizStep-1]} Settings</p></div>`;
    }

    document.getElementById('veh-wiz-btn-prev').disabled = vehWizStep === 1;
    const btnNext = document.getElementById('veh-wiz-btn-next');
    if (vehWizStep === 6) {
        btnNext.innerHTML = '<i class="fas fa-save mr-2"></i> Save Vehicle';
        btnNext.className = "px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium shadow hover:bg-green-700";
    } else {
        btnNext.innerHTML = 'Next Step <i class="fas fa-arrow-right ml-2"></i>';
        btnNext.className = "px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow hover:bg-blue-700";
    }
}
function nextVehWizardStep() { if(vehWizStep < 6) { vehWizStep++; renderVehWizardUI(); } else { alert("Vehicle Added Successfully!"); toggleVehicleWizard(); } }
function prevVehWizardStep() { if(vehWizStep > 1) { vehWizStep--; renderVehWizardUI(); } }

// Initial Boot
document.addEventListener('DOMContentLoaded', initDashboard);