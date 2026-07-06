// ==========================================
// NAVIGATION LOGIC
// ==========================================
function switchView(viewId) {
    document.getElementById('view-dashboard').classList.add('hidden');
    document.getElementById('view-reports').classList.add('hidden');
    document.getElementById('view-checklists').classList.add('hidden');
    
    document.getElementById(viewId).classList.remove('hidden');

    // Update sidebar UI
    document.getElementById('nav-dashboard').className = viewId === 'view-dashboard' ? 'flex items-center py-2.5 px-4 bg-blue-600 rounded-lg' : 'flex items-center py-2.5 px-4 hover:bg-slate-800 rounded-lg';
    document.getElementById('nav-reports').className = viewId === 'view-reports' ? 'flex items-center py-2.5 px-4 bg-blue-600 rounded-lg' : 'flex items-center py-2.5 px-4 hover:bg-slate-800 rounded-lg';
    document.getElementById('nav-checklists').className = viewId === 'view-checklists' ? 'flex items-center py-2.5 px-4 bg-blue-600 rounded-lg' : 'flex items-center py-2.5 px-4 hover:bg-slate-800 rounded-lg';

    if(viewId === 'view-reports') initReportsModule();
    if(viewId === 'view-checklists') initChecklistsModule();
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
let allReports = [];
let currentPage = 1;
const rowsPerPage = 10;

function initReportsModule() {
    if(allReports.length === 0) {
        generateDummyReports();
        renderReportKPIs();
        loadReportsData();
    }
}

function generateDummyReports() {
    const statuses = ['Approved', 'Pending', 'Rejected', 'Draft'];
    const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];
    const sites = ['Site Alpha', 'Site Beta', 'Delta Yard', 'HQ'];
    const depts = ['Logistics', 'Construction', 'Maintenance', 'Operations'];
    const vNames = ['Excavator 320', 'Dump Truck 40', 'Forklift T1', 'Bulldozer D9'];

    for(let i=1; i<=55; i++) {
        allReports.push({
            id: `VIESL-${String(1000+i)}`, date: `2026-07-${String((i%30)+1).padStart(2, '0')}`,
            vehicleNo: `VPAV${260000+i}`, vehicleName: vNames[i % vNames.length],
            site: sites[i % sites.length], dept: depts[i % depts.length], operator: `Operator ${i}`,
            condition: conditions[i % conditions.length], safe: i%6 === 0 ? 'No' : 'Yes',
            faults: i%6 === 0 ? Math.floor(Math.random()*4)+1 : 0, status: statuses[i % statuses.length],
            notes: i%3===0 ? "Standard check completed." : "Requires minor fluid top-up.", photos: Math.floor(Math.random()*6)
        });
    }
}

function renderReportKPIs() {
    const kpis = [ { label: "Total Reports", val: "55", icon: "fa-folder-open", color: "text-blue-500" }, { label: "Approved", val: "28", icon: "fa-check-circle", color: "text-green-500" }, { label: "Pending", val: "14", icon: "fa-clock", color: "text-orange-500" }, { label: "Rejected", val: "8", icon: "fa-times-circle", color: "text-red-500" }, { label: "Today's Reports", val: "12", icon: "fa-calendar-day", color: "text-indigo-500" }, { label: "Avg. Insp. Time", val: "14m", icon: "fa-stopwatch", color: "text-teal-500" } ];
    document.getElementById('report-kpi-container').innerHTML = kpis.map(k => `<div class="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between card"><div><p class="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">${k.label}</p><h3 class="text-2xl font-black text-gray-800">${k.val}</h3></div><div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border"><i class="fas ${k.icon} ${k.color} text-lg"></i></div></div>`).join('');
}

function loadReportsData() {
    document.getElementById('table-loading').classList.remove('hidden');
    document.getElementById('reports-table-body').innerHTML = '';
    setTimeout(() => { document.getElementById('table-loading').classList.add('hidden'); renderTable(); }, 600);
}

function renderTable() {
    const tbody = document.getElementById('reports-table-body');
    const start = (currentPage - 1) * rowsPerPage;
    const paginatedData = allReports.slice(start, start + rowsPerPage);
    if(paginatedData.length === 0) return document.getElementById('table-empty').classList.remove('hidden');
    
    document.getElementById('table-empty').classList.add('hidden');
    tbody.innerHTML = paginatedData.map(r => {
        let bClass = r.status === 'Approved' ? 'bg-green-100 text-green-700' : r.status === 'Pending' ? 'bg-orange-100 text-orange-700' : r.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700';
        return `<tr class="hover:bg-blue-50/50 transition-colors cursor-default group"><td class="px-4 py-3 text-center"><input type="checkbox" class="rounded text-blue-600 border-gray-300"></td><td class="px-4 py-3 font-semibold text-blue-600">${r.id}</td><td class="px-4 py-3 text-gray-600">${r.date}</td><td class="px-4 py-3"><div class="font-medium text-gray-800">${r.vehicleNo}</div><div class="text-xs text-gray-500">${r.vehicleName}</div></td><td class="px-4 py-3"><div class="text-gray-800">${r.site}</div><div class="text-xs text-gray-500">${r.dept}</div></td><td class="px-4 py-3 text-gray-600">${r.operator}</td><td class="px-4 py-3 text-gray-600">${r.condition}</td><td class="px-4 py-3 text-center">${r.safe === 'Yes' ? '<i class="fas fa-check text-green-500"></i>' : '<i class="fas fa-times text-red-500"></i>'}</td><td class="px-4 py-3 text-center"><span class="${r.faults > 0 ? 'bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold' : 'text-gray-400'}">${r.faults}</span></td><td class="px-4 py-3"><span class="px-2.5 py-1 rounded-full text-[11px] font-bold border ${bClass}">${r.status}</span></td><td class="px-4 py-3 text-right"><div class="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity"><button onclick="openDrawer('${r.id}')" class="p-1.5 text-blue-600 hover:bg-blue-100 rounded"><i class="fas fa-eye"></i></button><button class="p-1.5 text-red-600 hover:bg-red-100 rounded"><i class="fas fa-file-pdf"></i></button></div></td></tr>`;
    }).join('');

    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(allReports.length / rowsPerPage);
    document.getElementById('pagination-info').innerText = `Showing ${(currentPage - 1) * rowsPerPage + 1} to ${Math.min(currentPage * rowsPerPage, allReports.length)} of ${allReports.length} entries`;
    let buttons = `<button class="px-3 py-1 border rounded bg-white text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-50" ${currentPage === 1 ? 'disabled' : ''} onclick="currentPage--; renderTable()">Prev</button>`;
    for(let i=1; i<=Math.min(totalPages, 5); i++) buttons += `<button class="px-3 py-1 border rounded text-sm ${currentPage === i ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}" onclick="currentPage=${i}; renderTable()">${i}</button>`;
    buttons += `<button class="px-3 py-1 border rounded bg-white text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-50" ${currentPage === totalPages ? 'disabled' : ''} onclick="currentPage++; renderTable()">Next</button>`;
    document.getElementById('pagination-controls').innerHTML = buttons;
}

function toggleDrawer() {
    const d = document.getElementById('report-drawer'); const p = document.getElementById('drawer-panel');
    if (d.classList.contains('hidden')) { d.classList.remove('hidden'); setTimeout(() => p.classList.remove('translate-x-full'), 10); } 
    else { p.classList.add('translate-x-full'); setTimeout(() => d.classList.add('hidden'), 300); }
}

function openDrawer(id) {
    const r = allReports.find(x => x.id === id); if(!r) return;
    document.getElementById('drawer-content').innerHTML = `<div class="mb-6"><h3 class="text-xl font-black">${r.id}</h3><p class="text-gray-500">${r.date}</p></div><div class="bg-gray-50 p-4 border rounded mb-6 text-sm"><p><strong>Vehicle:</strong> ${r.vehicleNo}</p><p><strong>Status:</strong> ${r.status}</p></div>`;
    toggleDrawer();
}


// ==========================================
// INSPECTION CHECKLIST MODULE (NEW)
// ==========================================
let allChecklists = [];
let chkCurrentPage = 1;

function initChecklistsModule() {
    if(allChecklists.length === 0) {
        generateDummyChecklists();
        renderChecklistKPIs();
        renderChecklistTable();
    }
}

// 1. Generate 25 Realistic Dummy Templates
function generateDummyChecklists() {
    const names = ['Pre-Trip Heavy Excavator', 'Daily Forklift Check', 'Weekly Crane Inspection', 'Monthly Generator Service', 'Light Vehicle Pre-Start', 'Bulldozer End-of-Shift', 'Trailer Safety Checklist'];
    const categories = ['Engine', 'Hydraulic', 'Safety', 'Electrical', 'Tyres'];
    const vTypes = ['Heavy Machinery', 'Light Vehicle', 'Lifting Eqp', 'Power'];
    const depts = ['Logistics', 'Construction', 'Maintenance', 'Operations'];
    const statuses = ['Active', 'Active', 'Active', 'Inactive', 'Draft', 'Archived']; // Weighted Active

    for(let i=1; i<=28; i++) {
        allChecklists.push({
            id: `CHK-100${i}`,
            name: names[i % names.length] + ` v${Math.floor(i/7)+1}.0`,
            category: categories[i % categories.length],
            vType: vTypes[i % vTypes.length],
            dept: depts[i % depts.length],
            items: Math.floor(Math.random() * 30) + 10,
            author: `Admin ${i%3+1}`,
            updated: `2026-07-${String((i%30)+1).padStart(2, '0')}`,
            status: statuses[i % statuses.length],
            version: `v${Math.floor(i/7)+1}.0`
        });
    }
}

// 2. Render Checklists KPIs
function renderChecklistKPIs() {
    const kpis = [
        { label: "Total Templates", val: "28", icon: "fa-list-alt", color: "text-blue-500" },
        { label: "Categories", val: "10", icon: "fa-tags", color: "text-purple-500" },
        { label: "Active", val: "18", icon: "fa-check-circle", color: "text-green-500" },
        { label: "Inactive/Draft", val: "8", icon: "fa-pause-circle", color: "text-orange-500" },
        { label: "Recently Updated", val: "5", icon: "fa-sync-alt", color: "text-indigo-500" },
        { label: "Total Items Configured", val: "450+", icon: "fa-clipboard-check", color: "text-teal-500" }
    ];
    document.getElementById('checklist-kpi-container').innerHTML = kpis.map(k => `
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

// 3. Render Checklist Table
function renderChecklistTable() {
    const tbody = document.getElementById('checklists-table-body');
    const start = (chkCurrentPage - 1) * rowsPerPage;
    const paginatedData = allChecklists.slice(start, start + rowsPerPage);
    
    tbody.innerHTML = paginatedData.map(r => {
        let bClass = '';
        if(r.status === 'Active') bClass = 'bg-green-100 text-green-700 border-green-200';
        else if(r.status === 'Inactive') bClass = 'bg-gray-100 text-gray-600 border-gray-200';
        else if(r.status === 'Draft') bClass = 'bg-orange-100 text-orange-700 border-orange-200';
        else bClass = 'bg-red-100 text-red-700 border-red-200';

        return `
        <tr class="hover:bg-blue-50/50 transition-colors group border-b border-gray-100">
            <td class="px-4 py-3 text-center"><input type="checkbox" onchange="chkSelectionChange()" class="chk-row-checkbox rounded text-blue-600 border-gray-300"></td>
            <td class="px-4 py-3">
                <div class="font-semibold text-gray-800">${r.name}</div>
                <div class="text-xs text-gray-500">${r.id} • ${r.version}</div>
            </td>
            <td class="px-4 py-3 text-gray-600"><span class="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs border border-purple-100">${r.category}</span></td>
            <td class="px-4 py-3 text-gray-600">${r.vType}</td>
            <td class="px-4 py-3 text-gray-600">${r.dept}</td>
            <td class="px-4 py-3 text-center font-bold text-gray-700">${r.items}</td>
            <td class="px-4 py-3 text-gray-600">${r.author}</td>
            <td class="px-4 py-3 text-gray-600">${r.updated}</td>
            <td class="px-4 py-3 text-center"><span class="px-2.5 py-1 rounded-full text-[11px] font-bold border ${bClass}">${r.status}</span></td>
            <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button onclick="openChecklistDrawer('${r.id}')" class="p-1.5 text-blue-600 hover:bg-blue-100 rounded" title="View"><i class="fas fa-eye"></i></button>
                    <button class="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="p-1.5 text-green-600 hover:bg-green-100 rounded" title="Duplicate"><i class="fas fa-copy"></i></button>
                    <button class="p-1.5 text-gray-600 hover:bg-gray-200 rounded" title="More"><i class="fas fa-ellipsis-v px-1"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');

    // Update Pagination (Reusing logic)
    const totalPages = Math.ceil(allChecklists.length / rowsPerPage);
    document.getElementById('chk-pagination-info').innerText = `Showing ${start + 1} to ${Math.min(start + rowsPerPage, allChecklists.length)} of ${allChecklists.length} entries`;
    
    let buttons = `<button class="px-3 py-1 border rounded bg-white text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-50" ${chkCurrentPage === 1 ? 'disabled' : ''} onclick="chkCurrentPage--; renderChecklistTable()">Prev</button>`;
    for(let i=1; i<=Math.min(totalPages, 5); i++) buttons += `<button class="px-3 py-1 border rounded text-sm ${chkCurrentPage === i ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}" onclick="chkCurrentPage=${i}; renderChecklistTable()">${i}</button>`;
    buttons += `<button class="px-3 py-1 border rounded bg-white text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-50" ${chkCurrentPage === totalPages ? 'disabled' : ''} onclick="chkCurrentPage++; renderChecklistTable()">Next</button>`;
    document.getElementById('chk-pagination-controls').innerHTML = buttons;
}

// 4. Checklist Bulk Selection Logic
function toggleAllChecklists(source) {
    const checkboxes = document.querySelectorAll('.chk-row-checkbox');
    checkboxes.forEach(cb => cb.checked = source.checked);
    chkSelectionChange();
}

function chkSelectionChange() {
    const count = document.querySelectorAll('.chk-row-checkbox:checked').length;
    const bar = document.getElementById('chk-bulk-actions');
    document.getElementById('chk-selected-count').innerText = count;
    if(count > 0) bar.classList.remove('hidden');
    else bar.classList.add('hidden');
}

// 5. Checklist Drawer Logic
function toggleChecklistDrawer() {
    const d = document.getElementById('checklist-drawer'); const p = document.getElementById('chk-drawer-panel');
    if (d.classList.contains('hidden')) { d.classList.remove('hidden'); setTimeout(() => p.classList.remove('translate-x-full'), 10); } 
    else { p.classList.add('translate-x-full'); setTimeout(() => d.classList.add('hidden'), 300); }
}

function openChecklistDrawer(id) {
    const r = allChecklists.find(x => x.id === id); if(!r) return;
    let bClass = r.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600';
    
    document.getElementById('chk-drawer-content').innerHTML = `
        <div class="flex justify-between items-start mb-6">
            <div><h3 class="text-xl font-black text-slate-800">${r.name}</h3><p class="text-sm text-gray-500">${r.id} • ${r.version}</p></div>
            <span class="px-3 py-1 rounded-full text-xs font-bold ${bClass}">${r.status}</span>
        </div>
        <div class="bg-blue-50/50 rounded-xl p-4 border border-blue-100 mb-6">
            <h4 class="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3">Assignment Rules</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div><span class="block text-gray-500 text-xs">Vehicle Type</span><span class="font-semibold">${r.vType}</span></div>
                <div><span class="block text-gray-500 text-xs">Department</span><span class="font-semibold">${r.dept}</span></div>
            </div>
        </div>
        <div class="space-y-4">
            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2">Configuration Summary</h4>
            <div class="flex justify-between items-center text-sm"><span class="text-gray-600">Total Items</span><span class="font-bold">${r.items}</span></div>
            <div class="flex justify-between items-center text-sm"><span class="text-gray-600">Categories Included</span><span class="font-bold bg-gray-100 px-2 rounded">Engine, Safety, Body</span></div>
            <div class="flex justify-between items-center text-sm"><span class="text-gray-600">Mandatory Photos</span><span class="font-bold text-green-600">Enabled</span></div>
        </div>
    `;
    toggleChecklistDrawer();
}

// 6. Create Checklist Wizard Logic
let currentWizStep = 1;
const totalWizSteps = 6;
const stepTitles = ["Basic Info", "Assignments", "Categories", "Items Builder", "Validation", "Preview"];

function toggleWizardDrawer() {
    const w = document.getElementById('wizard-modal');
    if (w.classList.contains('hidden')) { 
        w.classList.remove('hidden'); 
        currentWizStep = 1; 
        renderWizardUI(); 
    } else { 
        w.classList.add('hidden'); 
    }
}

function confirmCloseWizard() {
    if(confirm("You have unsaved changes. Are you sure you want to close this?")) { toggleWizardDrawer(); }
}

function renderWizardUI() {
    // Stepper header
    document.getElementById('wizard-stepper').innerHTML = stepTitles.map((title, index) => {
        let st = index + 1;
        let isActive = st === currentWizStep;
        let isDone = st < currentWizStep;
        let bg = isActive ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-100' : isDone ? 'bg-green-500 text-white' : 'bg-white text-gray-400 border-2 border-gray-200';
        return `
            <div class="flex flex-col items-center relative z-10 w-1/6">
                <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${bg} transition-all duration-300">
                    ${isDone ? '<i class="fas fa-check"></i>' : st}
                </div>
                <span class="text-xs font-bold mt-2 ${isActive ? 'text-blue-600' : isDone ? 'text-green-600' : 'text-gray-400'}">${title}</span>
            </div>`;
    }).join('');

    // Dynamic Step Content
    const contentArea = document.getElementById('wizard-step-content');
    if (currentWizStep === 1) {
        contentArea.innerHTML = `
            <h3 class="text-lg font-bold mb-4">Step 1: Basic Information</h3>
            <div class="space-y-4 max-w-2xl">
                <div><label class="block text-sm font-medium text-gray-700 mb-1">Checklist Name <span class="text-red-500">*</span></label>
                <input type="text" class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Daily Pre-start Check"></div>
                <div><label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea class="w-full border rounded-lg px-4 py-2 focus:ring-2 outline-none h-24" placeholder="Brief description of this template..."></textarea></div>
            </div>`;
    } else if (currentWizStep === 4) {
        // Inspection Item Builder Mockup
        contentArea.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold">Step 4: Inspection Item Builder</h3>
                <button class="bg-blue-50 text-blue-600 px-3 py-1.5 rounded text-sm font-medium border border-blue-100"><i class="fas fa-plus mr-1"></i> Add Category Section</button>
            </div>
            <!-- Accordion Category 1 -->
            <div class="border rounded-xl mb-4 overflow-hidden bg-gray-50 shadow-sm">
                <div class="px-4 py-3 bg-white border-b flex justify-between items-center cursor-pointer">
                    <div class="font-bold text-gray-800"><i class="fas fa-chevron-down mr-2 text-gray-400"></i> Engine System</div>
                    <button class="text-blue-600 text-sm font-medium"><i class="fas fa-plus mr-1"></i> Add Item</button>
                </div>
                <div class="p-4 space-y-3">
                    <!-- Configurable Item row -->
                    <div class="bg-white p-3 rounded border shadow-sm flex items-center gap-4">
                        <i class="fas fa-grip-vertical text-gray-300 cursor-move"></i>
                        <input type="text" value="Check Engine Oil Level" class="flex-1 border-b px-2 py-1 outline-none text-sm font-medium">
                        <select class="border rounded px-2 py-1 text-sm text-gray-600"><option>High Priority</option><option>Medium</option></select>
                        <div class="flex gap-2">
                            <label class="flex items-center text-xs gap-1 bg-gray-100 px-2 py-1 rounded"><input type="checkbox" checked> Req. Photo</label>
                            <label class="flex items-center text-xs gap-1 bg-gray-100 px-2 py-1 rounded"><input type="checkbox"> Req. Note</label>
                        </div>
                        <div class="flex text-xs bg-gray-100 rounded p-1 gap-1">
                            <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded">OK</span>
                            <span class="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Repair</span>
                            <span class="bg-red-100 text-red-700 px-2 py-0.5 rounded">Replace</span>
                        </div>
                        <button class="text-red-400 hover:text-red-600"><i class="fas fa-trash"></i></button>
                    </div>
                    <!-- Item 2 -->
                    <div class="bg-white p-3 rounded border shadow-sm flex items-center gap-4">
                        <i class="fas fa-grip-vertical text-gray-300 cursor-move"></i>
                        <input type="text" value="Inspect Coolant Levels" class="flex-1 border-b px-2 py-1 outline-none text-sm font-medium">
                        <select class="border rounded px-2 py-1 text-sm text-gray-600"><option>Medium Priority</option></select>
                        <div class="flex gap-2">
                            <label class="flex items-center text-xs gap-1 bg-gray-100 px-2 py-1 rounded"><input type="checkbox"> Req. Photo</label>
                            <label class="flex items-center text-xs gap-1 bg-gray-100 px-2 py-1 rounded"><input type="checkbox"> Req. Note</label>
                        </div>
                        <div class="flex text-xs bg-gray-100 rounded p-1 gap-1">
                            <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded">OK</span>
                            <span class="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Repair</span>
                        </div>
                        <button class="text-red-400 hover:text-red-600"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>`;
    } else if (currentWizStep === 6) {
        contentArea.innerHTML = `<div class="text-center py-12"><div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"><i class="fas fa-check"></i></div><h3 class="text-xl font-bold text-gray-800">Ready to Publish</h3><p class="text-gray-500 mt-2">Your checklist template has been configured successfully.</p></div>`;
    } else {
        contentArea.innerHTML = `<div class="flex flex-col items-center justify-center h-40 text-gray-400"><i class="fas fa-cog fa-spin text-3xl mb-3"></i><p>Configure ${stepTitles[currentWizStep-1]} Settings</p></div>`;
    }

    // Update buttons
    document.getElementById('wiz-btn-prev').disabled = currentWizStep === 1;
    const btnNext = document.getElementById('wiz-btn-next');
    if (currentWizStep === totalWizSteps) {
        btnNext.innerHTML = '<i class="fas fa-save mr-2"></i> Save & Publish';
        btnNext.className = "px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium shadow hover:bg-green-700";
    } else {
        btnNext.innerHTML = 'Next Step <i class="fas fa-arrow-right ml-2"></i>';
        btnNext.className = "px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow hover:bg-blue-700";
    }
}

function nextWizardStep() {
    if(currentWizStep < totalWizSteps) { currentWizStep++; renderWizardUI(); }
    else { alert("Checklist Published Successfully!"); toggleWizardDrawer(); }
}

function prevWizardStep() {
    if(currentWizStep > 1) { currentWizStep--; renderWizardUI(); }
}

// Initial Boot
document.addEventListener('DOMContentLoaded', initDashboard);