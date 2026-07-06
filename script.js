// ==========================================
// NAVIGATION LOGIC
// ==========================================
function switchView(viewId) {
    document.getElementById('view-dashboard').classList.add('hidden');
    document.getElementById('view-reports').classList.add('hidden');
    document.getElementById('view-checklists').classList.add('hidden');
    document.getElementById('view-vehicles').classList.add('hidden');
    document.getElementById('view-operators').classList.add('hidden');
    
    document.getElementById(viewId).classList.remove('hidden');

    const activeClass = 'flex items-center py-2.5 px-4 bg-blue-600 rounded-lg';
    const inactiveClass = 'flex items-center py-2.5 px-4 hover:bg-slate-800 rounded-lg';
    
    document.getElementById('nav-dashboard').className = viewId === 'view-dashboard' ? activeClass : inactiveClass;
    document.getElementById('nav-reports').className = viewId === 'view-reports' ? activeClass : inactiveClass;
    document.getElementById('nav-checklists').className = viewId === 'view-checklists' ? activeClass : inactiveClass;
    document.getElementById('nav-vehicles').className = viewId === 'view-vehicles' ? activeClass : inactiveClass;
    document.getElementById('nav-operators').className = viewId === 'view-operators' ? activeClass : inactiveClass;

    if(viewId === 'view-reports') initReportsModule();
    if(viewId === 'view-checklists') initChecklistsModule();
    if(viewId === 'view-vehicles') initVehiclesModule();
    if(viewId === 'view-operators') initOperatorsModule();
}

// ==========================================
// DASHBOARD, REPORTS, CHECKLISTS, VEHICLES (Preserved Logic Block)
// ==========================================
// Dashboard
function initDashboard() {
    const kpiData = [{title: "Vehicles", val: "156"}, {title: "Operators", val: "82"}, {title: "Inspection", val: "41"}, {title: "Pending", val: "18"}, {title: "Faulty", val: "12"}, {title: "Complete", val: "98%"}];
    const grid = document.getElementById('kpi-grid');
    if(grid && grid.innerHTML === '') kpiData.forEach(k => grid.innerHTML += `<div class="bg-white p-4 rounded-xl shadow-sm border card"><p class="text-[10px] text-gray-400 font-bold">${k.title}</p><h3 class="text-xl font-bold">${k.val}</h3></div>`);
    setInterval(() => { const c = document.getElementById('live-clock'); if(c) c.innerText = new Date().toLocaleTimeString(); }, 1000);
}

// Reports
let allReports = []; let currentPage = 1; const rowsPerPage = 10;
function initReportsModule() { if(allReports.length === 0) { for(let i=1; i<=55; i++) { allReports.push({ id: `VIESL-${1000+i}`, date: '2026-07-01', vehicleNo: `VPAV${260000+i}`, vehicleName: 'Excavator', site: 'Site Alpha', dept: 'Logistics', operator: `Operator ${i}`, condition: 'Good', safe: 'Yes', faults: 0, status: 'Approved', notes: '', photos: 2 }); } document.getElementById('report-kpi-container').innerHTML = `<div class="bg-white p-4 rounded-xl shadow-sm border card"><p class="text-[11px] text-gray-500 font-bold">Total Reports</p><h3 class="text-2xl font-black text-gray-800">55</h3></div>`; renderTable(); } }
function renderTable() { const tbody = document.getElementById('reports-table-body'); if(tbody) tbody.innerHTML = allReports.slice(0, rowsPerPage).map(r => `<tr class="border-b"><td class="px-4 py-3"><input type="checkbox"></td><td class="px-4 py-3">${r.id}</td><td class="px-4 py-3 text-right"><button class="text-blue-600"><i class="fas fa-eye"></i></button></td></tr>`).join(''); }

// Checklists
let allChecklists = []; let chkCurrentPage = 1;
function initChecklistsModule() { if(allChecklists.length === 0) { for(let i=1; i<=28; i++) { allChecklists.push({ id: `CHK-100${i}`, name: 'Daily Check', category: 'Engine', vType: 'Heavy', dept: 'Logistics', items: 25, author: 'Admin', updated: '2026-07-01', status: 'Active', version: 'v1.0' }); } document.getElementById('checklist-kpi-container').innerHTML = `<div class="bg-white p-4 rounded-xl shadow-sm border card"><p class="text-[11px] text-gray-500 font-bold">Total Templates</p><h3 class="text-2xl font-black text-gray-800">28</h3></div>`; renderChecklistTable(); } }
function renderChecklistTable() { const tbody = document.getElementById('checklists-table-body'); if(tbody) tbody.innerHTML = allChecklists.slice(0, rowsPerPage).map(r => `<tr class="border-b"><td class="px-4 py-3"><input type="checkbox"></td><td class="px-4 py-3">${r.name}</td><td class="px-4 py-3 text-right"><button class="text-blue-600"><i class="fas fa-eye"></i></button></td></tr>`).join(''); }

// Vehicles
let allVehicles = []; let vehCurrentPage = 1;
function initVehiclesModule() { if(allVehicles.length === 0) { for(let i=1; i<=105; i++) { allVehicles.push({ id: `VPAV${260000+i}`, name: 'Caterpillar 320', type: 'Heavy Machinery', dept: 'Mining', site: 'Site Alpha', operator: 'John Doe', model: '2022', make: 'CAT', vin: '1HGCM826X123456', engine: '1200', odo: '15000', fuel: 'Diesel', lastInsp: '2026-07-01', status: 'Active' }); } document.getElementById('vehicle-kpi-container').innerHTML = `<div class="bg-white p-4 rounded-xl shadow-sm border card"><p class="text-[11px] text-gray-500 font-bold">Total Vehicles</p><h3 class="text-2xl font-black text-gray-800">105</h3></div>`; renderVehiclesTable(); } }
function renderVehiclesTable() { const tbody = document.getElementById('vehicles-table-body'); if(tbody) tbody.innerHTML = allVehicles.slice(0, rowsPerPage).map(r => `<tr class="border-b"><td class="px-4 py-3"><input type="checkbox"></td><td class="px-4 py-3">${r.id}</td><td class="px-4 py-3 text-right"><button class="text-blue-600"><i class="fas fa-eye"></i></button></td></tr>`).join(''); }


// ==========================================
// OPERATOR MANAGEMENT MODULE (NEW)
// ==========================================
let allOperators = [];
let opCurrentPage = 1;

function initOperatorsModule() {
    if(allOperators.length === 0) {
        generateDummyOperators();
        renderOperatorKPIs();
        renderOperatorsTable();
    }
}

// 1. Generate 75+ Realistic Operators
function generateDummyOperators() {
    const fNames = ['James', 'Michael', 'Robert', 'Maria', 'David', 'Sarah', 'William', 'Richard', 'Jessica', 'Thomas'];
    const lNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const depts = ['Construction', 'Mining', 'Logistics', 'Operations', 'Maintenance'];
    const sites = ['Site Alpha', 'Site Beta', 'Delta Yard', 'Omega Quarry'];
    const statuses = ['Active', 'Active', 'Active', 'Active', 'On Leave', 'Training', 'Suspended', 'Inactive'];
    
    for(let i=1; i<=82; i++) {
        const first = fNames[Math.floor(Math.random() * fNames.length)];
        const last = lNames[Math.floor(Math.random() * lNames.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        allOperators.push({
            id: `EMP-${2000+i}`,
            name: `${first} ${last}`,
            avatar: `https://ui-avatars.com/api/?name=${first}+${last}&background=random&color=fff`,
            mobile: `+1 (555) ${String(Math.floor(Math.random()*900)+100)}-${String(Math.floor(Math.random()*9000)+1000)}`,
            email: `${first.toLowerCase()}.${last.toLowerCase()}@vac-corp.com`,
            dept: depts[i % depts.length],
            site: sites[i % sites.length],
            assignedVehicles: status === 'Active' ? Math.floor(Math.random() * 3) + 1 : 0,
            assignedChecklists: status === 'Active' ? Math.floor(Math.random() * 5) + 2 : 0,
            exp: `${Math.floor(Math.random() * 10) + 1} Yrs`,
            joinDate: `202${Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random()*12)+1).padStart(2,'0')}-15`,
            lastLogin: status === 'Active' ? 'Today, 08:30 AM' : '2 weeks ago',
            status: status,
            // Analytics stats for drawer
            rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
            accuracy: (Math.random() * (100 - 85) + 85).toFixed(1) + '%',
            monthInsp: Math.floor(Math.random() * 40) + 10
        });
    }
}

// 2. Render Operator KPIs
function renderOperatorKPIs() {
    const counts = { total: allOperators.length, active: 0, inactive: 0, leave: 0, assigned: 0 };
    allOperators.forEach(o => {
        if(o.status === 'Active') counts.active++;
        else if(o.status === 'Inactive' || o.status === 'Suspended') counts.inactive++;
        else if(o.status === 'On Leave') counts.leave++;
        
        if(o.assignedVehicles > 0) counts.assigned++;
    });

    const kpis = [
        { label: "Total Operators", val: counts.total, icon: "fa-users", color: "text-blue-500" },
        { label: "Active", val: counts.active, icon: "fa-user-check", color: "text-green-500" },
        { label: "Inactive / Suspended", val: counts.inactive, icon: "fa-user-times", color: "text-red-500" },
        { label: "Assigned to Vehicles", val: counts.assigned, icon: "fa-steering-wheel", color: "text-purple-500" },
        { label: "Available / Pool", val: counts.active - counts.assigned, icon: "fa-user-clock", color: "text-teal-500" },
        { label: "Today's Attendance", val: Math.floor(counts.active * 0.95), icon: "fa-calendar-check", color: "text-indigo-500" }
    ];
    document.getElementById('operator-kpi-container').innerHTML = kpis.map(k => `
        <div class="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between card">
            <div>
                <p class="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">${k.label}</p>
                <h3 class="text-2xl font-black text-gray-800">${k.val}</h3>
            </div>
            <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border"><i class="fas ${k.icon} ${k.color} text-lg"></i></div>
        </div>`).join('');
}

// 3. Render Table
function renderOperatorsTable() {
    const tbody = document.getElementById('operators-table-body');
    const start = (opCurrentPage - 1) * rowsPerPage;
    const paginatedData = allOperators.slice(start, start + rowsPerPage);
    
    tbody.innerHTML = paginatedData.map(r => {
        // Status Badge Logic
        let bClass = '';
        if(r.status === 'Active') bClass = 'bg-green-100 text-green-700 border-green-200';
        else if(r.status === 'On Leave') bClass = 'bg-orange-100 text-orange-700 border-orange-200';
        else if(r.status === 'Suspended') bClass = 'bg-red-100 text-red-700 border-red-200';
        else if(r.status === 'Training') bClass = 'bg-blue-100 text-blue-700 border-blue-200';
        else bClass = 'bg-gray-100 text-gray-700 border-gray-200';

        return `
        <tr class="hover:bg-blue-50/50 transition-colors group border-b border-gray-100">
            <td class="px-4 py-3 text-center"><input type="checkbox" onchange="opSelectionChange()" class="op-row-checkbox rounded text-blue-600 border-gray-300"></td>
            <td class="px-4 py-3 font-semibold text-blue-600">${r.id}</td>
            <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                    <img src="${r.avatar}" class="w-8 h-8 rounded-full border">
                    <div class="font-medium text-gray-800">${r.name}</div>
                </div>
            </td>
            <td class="px-4 py-3">
                <div class="text-gray-800">${r.mobile}</div>
                <div class="text-xs text-gray-500">${r.email}</div>
            </td>
            <td class="px-4 py-3 text-gray-600">${r.dept}</td>
            <td class="px-4 py-3 text-gray-600">${r.site}</td>
            <td class="px-4 py-3 text-center font-bold ${r.assignedVehicles > 0 ? 'text-purple-600' : 'text-gray-400'}">${r.assignedVehicles}</td>
            <td class="px-4 py-3 text-gray-600">${r.exp}</td>
            <td class="px-4 py-3 text-gray-600">${r.joinDate}</td>
            <td class="px-4 py-3 text-gray-600 text-xs">${r.lastLogin}</td>
            <td class="px-4 py-3 text-center"><span class="px-2.5 py-1 rounded-full text-[11px] font-bold border ${bClass}">${r.status}</span></td>
            <td class="px-4 py-3 text-right sticky right-0 bg-white group-hover:bg-blue-50/50 transition-colors z-10 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] border-l">
                <div class="flex items-center justify-end gap-2">
                    <button onclick="openOpDrawer('${r.id}')" class="p-1.5 text-blue-600 hover:bg-blue-100 rounded" title="View Profile"><i class="fas fa-id-card"></i></button>
                    <button class="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded" title="Assign Vehicle"><i class="fas fa-steering-wheel"></i></button>
                    <button class="p-1.5 text-gray-600 hover:bg-gray-200 rounded" title="More"><i class="fas fa-ellipsis-v px-1"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');

    // Pagination
    const totalPages = Math.ceil(allOperators.length / rowsPerPage);
    document.getElementById('op-pagination-info').innerText = `Showing ${start + 1} to ${Math.min(start + rowsPerPage, allOperators.length)} of ${allOperators.length} entries`;
    
    let buttons = `<button class="px-3 py-1 border rounded bg-white text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-50" ${opCurrentPage === 1 ? 'disabled' : ''} onclick="opCurrentPage--; renderOperatorsTable()">Prev</button>`;
    for(let i=1; i<=Math.min(totalPages, 5); i++) buttons += `<button class="px-3 py-1 border rounded text-sm ${opCurrentPage === i ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}" onclick="opCurrentPage=${i}; renderOperatorsTable()">${i}</button>`;
    buttons += `<button class="px-3 py-1 border rounded bg-white text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-50" ${opCurrentPage === totalPages ? 'disabled' : ''} onclick="opCurrentPage++; renderOperatorsTable()">Next</button>`;
    document.getElementById('op-pagination-controls').innerHTML = buttons;
}

// Bulk Selection
function toggleAllOperators(source) { document.querySelectorAll('.op-row-checkbox').forEach(cb => cb.checked = source.checked); opSelectionChange(); }
function opSelectionChange() {
    const count = document.querySelectorAll('.op-row-checkbox:checked').length;
    const bar = document.getElementById('op-bulk-actions');
    document.getElementById('op-selected-count').innerText = count;
    if(count > 0) bar.classList.remove('hidden'); else bar.classList.add('hidden');
}

// 4. Operator Drawer with Analytics
function toggleOpDrawer() {
    const d = document.getElementById('operator-drawer'); const p = document.getElementById('op-drawer-panel');
    if (d.classList.contains('hidden')) { d.classList.remove('hidden'); setTimeout(() => p.classList.remove('translate-x-full'), 10); } 
    else { p.classList.add('translate-x-full'); setTimeout(() => d.classList.add('hidden'), 300); }
}

function openOpDrawer(id) {
    const r = allOperators.find(x => x.id === id); if(!r) return;
    
    let bClass = 'bg-gray-100 text-gray-700';
    if(r.status === 'Active') bClass = 'bg-green-100 text-green-700';
    else if(r.status === 'On Leave') bClass = 'bg-orange-100 text-orange-700';
    else if(r.status === 'Suspended') bClass = 'bg-red-100 text-red-700';
    else if(r.status === 'Training') bClass = 'bg-blue-100 text-blue-700';

    document.getElementById('op-drawer-content').innerHTML = `
        <div class="flex justify-between items-start mb-6">
            <div class="flex gap-4 items-center">
                <img src="${r.avatar}" class="w-16 h-16 rounded-full border shadow-sm">
                <div>
                    <h3 class="text-xl font-black text-slate-800">${r.name}</h3>
                    <p class="text-sm text-gray-500">${r.id} • ${r.dept}</p>
                </div>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-bold ${bClass}">${r.status}</span>
        </div>
        
        <div class="bg-blue-50/50 rounded-xl p-4 border border-blue-100 mb-6">
            <h4 class="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3">Performance Analytics</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="bg-white p-3 rounded shadow-sm border text-center">
                    <span class="block text-gray-500 text-xs mb-1">Performance Rating</span>
                    <span class="font-black text-lg text-yellow-500"><i class="fas fa-star text-sm mr-1"></i>${r.rating}</span>
                </div>
                <div class="bg-white p-3 rounded shadow-sm border text-center">
                    <span class="block text-gray-500 text-xs mb-1">Fault Detection</span>
                    <span class="font-black text-lg text-green-600">${r.accuracy}</span>
                </div>
                <div class="bg-white p-3 rounded shadow-sm border text-center col-span-2 flex justify-between items-center">
                    <span class="block text-gray-500 text-xs">Inspections This Month</span>
                    <span class="font-black text-xl text-blue-600">${r.monthInsp}</span>
                </div>
            </div>
        </div>

        <div class="space-y-4">
            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2">Employment & Contact</h4>
            <div class="flex justify-between items-center text-sm"><span class="text-gray-600">Mobile</span><span class="font-bold">${r.mobile}</span></div>
            <div class="flex justify-between items-center text-sm"><span class="text-gray-600">Email</span><span class="font-bold">${r.email}</span></div>
            <div class="flex justify-between items-center text-sm"><span class="text-gray-600">Base Site</span><span class="font-bold">${r.site}</span></div>
            <div class="flex justify-between items-center text-sm"><span class="text-gray-600">Experience</span><span class="font-bold">${r.exp}</span></div>
        </div>
        
        <div class="mt-6 pt-4 border-t space-y-3">
            <button class="w-full text-left p-3 rounded-lg border hover:bg-gray-50 flex justify-between items-center text-sm font-medium"><span class="text-gray-700"><i class="fas fa-steering-wheel text-purple-500 mr-2"></i> Assigned Vehicles (${r.assignedVehicles})</span><i class="fas fa-chevron-right text-gray-400"></i></button>
            <button class="w-full text-left p-3 rounded-lg border hover:bg-gray-50 flex justify-between items-center text-sm font-medium"><span class="text-gray-700"><i class="fas fa-folder-open text-red-500 mr-2"></i> View KYC Documents</span><i class="fas fa-chevron-right text-gray-400"></i></button>
        </div>
    `;
    toggleOpDrawer();
}

// 5. Add Operator Wizard
let opWizStep = 1;
const opWizTitles = ["Personal", "Employment", "Assignments", "Permissions", "Documents", "Preview"];

function toggleOpWizard() {
    const w = document.getElementById('operator-wizard-modal');
    if (w.classList.contains('hidden')) { w.classList.remove('hidden'); opWizStep = 1; renderOpWizardUI(); } 
    else { w.classList.add('hidden'); }
}
function confirmCloseOpWizard() { if(confirm("Discard new operator entry?")) { toggleOpWizard(); } }

function renderOpWizardUI() {
    document.getElementById('op-wizard-stepper').innerHTML = opWizTitles.map((title, index) => {
        let st = index + 1; let isActive = st === opWizStep; let isDone = st < opWizStep;
        let bg = isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100' : isDone ? 'bg-green-500 text-white' : 'bg-white text-gray-400 border-2 border-gray-200';
        return `<div class="flex flex-col items-center relative z-10 w-1/6"><div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${bg} transition-all">${isDone ? '<i class="fas fa-check"></i>' : st}</div><span class="text-xs font-bold mt-2 ${isActive ? 'text-blue-600' : isDone ? 'text-green-600' : 'text-gray-400'}">${title}</span></div>`;
    }).join('');

    const contentArea = document.getElementById('op-wizard-step-content');
    if (opWizStep === 1) {
        contentArea.innerHTML = `
            <h3 class="text-lg font-bold mb-4">Step 1: Personal Information</h3>
            <div class="grid grid-cols-2 gap-4 max-w-3xl">
                <div><label class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" class="w-full border rounded-lg px-4 py-2 outline-none focus:border-blue-500" placeholder="e.g. John Doe"></div>
                <div><label class="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label><input type="text" class="w-full border rounded-lg px-4 py-2 outline-none focus:border-blue-500" placeholder="+1 (555) 000-0000"></div>
                <div><label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label><input type="email" class="w-full border rounded-lg px-4 py-2 outline-none" placeholder="john.doe@company.com"></div>
                <div><label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label><input type="date" class="w-full border rounded-lg px-4 py-2 outline-none"></div>
            </div>`;
    } else if (opWizStep === 5) {
        contentArea.innerHTML = `
            <h3 class="text-lg font-bold mb-4">Step 5: KYC & Documents</h3>
            <p class="text-sm text-gray-500 mb-4">Upload mandatory identification and training certificates.</p>
            <div class="space-y-4 max-w-3xl">
                <div class="flex items-center justify-between p-4 border rounded-xl bg-gray-50">
                    <div class="flex items-center gap-3"><i class="fas fa-id-card text-2xl text-blue-500"></i><div><p class="text-sm font-bold text-gray-800">Driving License *</p><p class="text-xs text-gray-500">PDF or JPG</p></div></div>
                    <button class="bg-white border text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-100">Browse</button>
                </div>
                <div class="flex items-center justify-between p-4 border rounded-xl bg-gray-50">
                    <div class="flex items-center gap-3"><i class="fas fa-address-card text-2xl text-purple-500"></i><div><p class="text-sm font-bold text-gray-800">Aadhar / PAN Card *</p><p class="text-xs text-gray-500">PDF or JPG</p></div></div>
                    <button class="bg-white border text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-100">Browse</button>
                </div>
                <div class="flex items-center justify-between p-4 border rounded-xl bg-gray-50">
                    <div class="flex items-center gap-3"><i class="fas fa-certificate text-2xl text-orange-500"></i><div><p class="text-sm font-bold text-gray-800">Training Certificates</p><p class="text-xs text-gray-500">Optional</p></div></div>
                    <button class="bg-white border text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-100">Browse</button>
                </div>
            </div>`;
    } else if (opWizStep === 6) {
        contentArea.innerHTML = `<div class="text-center py-12"><div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"><i class="fas fa-check"></i></div><h3 class="text-xl font-bold text-gray-800">Ready to Save</h3><p class="text-gray-500 mt-2">Operator profile is fully configured and ready for deployment.</p></div>`;
    } else {
        contentArea.innerHTML = `<div class="flex flex-col items-center justify-center h-40 text-gray-400"><i class="fas fa-cog fa-spin text-3xl mb-3"></i><p>Configure ${opWizTitles[opWizStep-1]} Settings</p></div>`;
    }

    document.getElementById('op-wiz-btn-prev').disabled = opWizStep === 1;
    const btnNext = document.getElementById('op-wiz-btn-next');
    if (opWizStep === 6) {
        btnNext.innerHTML = '<i class="fas fa-save mr-2"></i> Save Operator';
        btnNext.className = "px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium shadow hover:bg-green-700";
    } else {
        btnNext.innerHTML = 'Next Step <i class="fas fa-arrow-right ml-2"></i>';
        btnNext.className = "px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow hover:bg-blue-700";
    }
}
function nextOpWizardStep() { if(opWizStep < 6) { opWizStep++; renderOpWizardUI(); } else { alert("Operator Added Successfully!"); toggleOpWizard(); } }
function prevOpWizardStep() { if(opWizStep > 1) { opWizStep--; renderOpWizardUI(); } }

// Initial Boot
document.addEventListener('DOMContentLoaded', initDashboard);