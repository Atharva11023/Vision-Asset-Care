// ==========================================
// NAVIGATION LOGIC (Preserved)
// ==========================================
function switchView(viewId) {
    document.getElementById('view-dashboard').classList.add('hidden');
    document.getElementById('view-reports').classList.add('hidden');
    document.getElementById(viewId).classList.remove('hidden');

    // Update sidebar UI
    document.getElementById('nav-dashboard').className = viewId === 'view-dashboard' ? 'flex items-center py-2.5 px-4 bg-blue-600 rounded-lg' : 'flex items-center py-2.5 px-4 hover:bg-slate-800 rounded-lg';
    document.getElementById('nav-reports').className = viewId === 'view-reports' ? 'flex items-center py-2.5 px-4 bg-blue-600 rounded-lg' : 'flex items-center py-2.5 px-4 hover:bg-slate-800 rounded-lg';

    if(viewId === 'view-reports') {
        initReportsModule();
    }
}

// ==========================================
// DASHBOARD LOGIC (Preserved Exactly)
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
// INSPECTION REPORTS MODULE (New Logic)
// ==========================================
let allReports = [];
let currentPage = 1;
const rowsPerPage = 10;

function initReportsModule() {
    if(allReports.length === 0) {
        generateDummyData();
        renderReportKPIs();
        loadReportsData(); // Triggers loading state then renders table
    }
}

// 1. Generate 50+ Realistic Dummy Records
function generateDummyData() {
    const statuses = ['Approved', 'Pending', 'Rejected', 'Draft'];
    const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];
    const sites = ['Site Alpha', 'Site Beta', 'Delta Yard', 'HQ'];
    const depts = ['Logistics', 'Construction', 'Maintenance', 'Operations'];
    const vNames = ['Excavator 320', 'Dump Truck 40', 'Forklift T1', 'Bulldozer D9'];

    for(let i=1; i<=55; i++) {
        allReports.push({
            id: `VIESL-${String(1000+i)}`,
            date: `2026-07-${String((i%30)+1).padStart(2, '0')}`,
            vehicleNo: `VPAV${260000+i}`,
            vehicleName: vNames[i % vNames.length],
            site: sites[i % sites.length],
            dept: depts[i % depts.length],
            operator: `Operator ${i}`,
            condition: conditions[i % conditions.length],
            safe: i%6 === 0 ? 'No' : 'Yes',
            faults: i%6 === 0 ? Math.floor(Math.random()*4)+1 : 0,
            status: statuses[i % statuses.length],
            notes: i%3===0 ? "Standard check completed. No major issues." : "Requires minor fluid top-up next week.",
            photos: Math.floor(Math.random()*6)
        });
    }
}

// 2. Render KPIs
function renderReportKPIs() {
    const kpiContainer = document.getElementById('report-kpi-container');
    const kpis = [
        { label: "Total Reports", val: "55", icon: "fa-folder-open", color: "text-blue-500" },
        { label: "Approved", val: "28", icon: "fa-check-circle", color: "text-green-500" },
        { label: "Pending", val: "14", icon: "fa-clock", color: "text-orange-500" },
        { label: "Rejected", val: "8", icon: "fa-times-circle", color: "text-red-500" },
        { label: "Today's Reports", val: "12", icon: "fa-calendar-day", color: "text-indigo-500" },
        { label: "Avg. Insp. Time", val: "14m", icon: "fa-stopwatch", color: "text-teal-500" }
    ];
    
    kpiContainer.innerHTML = kpis.map(k => `
        <div class="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between card">
            <div>
                <p class="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">${k.label}</p>
                <h3 class="text-2xl font-black text-gray-800">${k.val}</h3>
            </div>
            <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border">
                <i class="fas ${k.icon} ${k.color} text-lg"></i>
            </div>
        </div>
    `).join('');
}

// 3. Loading State & Table Render
function loadReportsData() {
    // Show Loading
    document.getElementById('table-loading').classList.remove('hidden');
    document.getElementById('reports-table-body').innerHTML = '';
    
    // Simulate Network Request
    setTimeout(() => {
        document.getElementById('table-loading').classList.add('hidden');
        renderTable();
    }, 600);
}

function renderTable() {
    const tbody = document.getElementById('reports-table-body');
    
    // Pagination slicing
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = allReports.slice(start, end);

    if(paginatedData.length === 0) {
        document.getElementById('table-empty').classList.remove('hidden');
        return;
    }

    document.getElementById('table-empty').classList.add('hidden');

    tbody.innerHTML = paginatedData.map(r => {
        // Status Badge Logic
        let badgeClass = '';
        if(r.status === 'Approved') badgeClass = 'bg-green-100 text-green-700 border-green-200';
        else if(r.status === 'Pending') badgeClass = 'bg-orange-100 text-orange-700 border-orange-200';
        else if(r.status === 'Rejected') badgeClass = 'bg-red-100 text-red-700 border-red-200';
        else badgeClass = 'bg-gray-100 text-gray-700 border-gray-200';

        // Safe Badge
        let safeBadge = r.safe === 'Yes' ? '<i class="fas fa-check text-green-500"></i>' : '<i class="fas fa-times text-red-500"></i>';

        return `
        <tr class="hover:bg-blue-50/50 transition-colors cursor-default group">
            <td class="px-4 py-3 text-center"><input type="checkbox" class="rounded text-blue-600 border-gray-300"></td>
            <td class="px-4 py-3 font-semibold text-blue-600">${r.id}</td>
            <td class="px-4 py-3 text-gray-600">${r.date}</td>
            <td class="px-4 py-3">
                <div class="font-medium text-gray-800">${r.vehicleNo}</div>
                <div class="text-xs text-gray-500">${r.vehicleName}</div>
            </td>
            <td class="px-4 py-3">
                <div class="text-gray-800">${r.site}</div>
                <div class="text-xs text-gray-500">${r.dept}</div>
            </td>
            <td class="px-4 py-3 text-gray-600">${r.operator}</td>
            <td class="px-4 py-3 text-gray-600">${r.condition}</td>
            <td class="px-4 py-3 text-center">${safeBadge}</td>
            <td class="px-4 py-3 text-center"><span class="${r.faults > 0 ? 'bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold' : 'text-gray-400'}">${r.faults}</span></td>
            <td class="px-4 py-3"><span class="px-2.5 py-1 rounded-full text-[11px] font-bold border ${badgeClass}">${r.status}</span></td>
            <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button onclick="openDrawer('${r.id}')" class="p-1.5 text-blue-600 hover:bg-blue-100 rounded" title="View"><i class="fas fa-eye"></i></button>
                    <button class="p-1.5 text-red-600 hover:bg-red-100 rounded" title="Download PDF"><i class="fas fa-file-pdf"></i></button>
                    <button class="p-1.5 text-gray-600 hover:bg-gray-200 rounded" title="More"><i class="fas fa-ellipsis-v px-1"></i></button>
                </div>
            </td>
        </tr>
    `}).join('');

    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(allReports.length / rowsPerPage);
    document.getElementById('pagination-info').innerText = `Showing ${(currentPage - 1) * rowsPerPage + 1} to ${Math.min(currentPage * rowsPerPage, allReports.length)} of ${allReports.length} entries`;
    
    let buttons = `<button class="px-3 py-1 border rounded bg-white text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-50" ${currentPage === 1 ? 'disabled' : ''} onclick="currentPage--; renderTable()">Prev</button>`;
    
    for(let i=1; i<=Math.min(totalPages, 5); i++) {
        buttons += `<button class="px-3 py-1 border rounded text-sm ${currentPage === i ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}" onclick="currentPage=${i}; renderTable()">${i}</button>`;
    }
    
    buttons += `<button class="px-3 py-1 border rounded bg-white text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-50" ${currentPage === totalPages ? 'disabled' : ''} onclick="currentPage++; renderTable()">Next</button>`;
    
    document.getElementById('pagination-controls').innerHTML = buttons;
}

// 4. Drawer/Modal Logic
function toggleDrawer() {
    const drawer = document.getElementById('report-drawer');
    const panel = document.getElementById('drawer-panel');
    
    if (drawer.classList.contains('hidden')) {
        drawer.classList.remove('hidden');
        setTimeout(() => panel.classList.remove('translate-x-full'), 10);
    } else {
        panel.classList.add('translate-x-full');
        setTimeout(() => drawer.classList.add('hidden'), 300);
    }
}

function openDrawer(reportId) {
    const report = allReports.find(r => r.id === reportId);
    if(!report) return;

    let badgeClass = report.status === 'Approved' ? 'bg-green-100 text-green-700' : report.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700';

    document.getElementById('drawer-content').innerHTML = `
        <div class="flex justify-between items-start mb-6">
            <div>
                <h3 class="text-xl font-black text-slate-800">${report.id}</h3>
                <p class="text-sm text-gray-500">${report.date}</p>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-bold ${badgeClass}">${report.status}</span>
        </div>

        <div class="bg-blue-50/50 rounded-xl p-4 border border-blue-100 mb-6">
            <h4 class="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3">Vehicle Details</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div><span class="block text-gray-500 text-xs">Number</span><span class="font-semibold">${report.vehicleNo}</span></div>
                <div><span class="block text-gray-500 text-xs">Name</span><span class="font-semibold">${report.vehicleName}</span></div>
                <div><span class="block text-gray-500 text-xs">Site</span><span class="font-semibold">${report.site}</span></div>
                <div><span class="block text-gray-500 text-xs">Operator</span><span class="font-semibold">${report.operator}</span></div>
            </div>
        </div>

        <div class="space-y-4">
            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2">Inspection Summary</h4>
            <div class="flex justify-between items-center text-sm"><span class="text-gray-600">Overall Condition</span><span class="font-bold">${report.condition}</span></div>
            <div class="flex justify-between items-center text-sm"><span class="text-gray-600">Safe to Use</span><span class="font-bold ${report.safe === 'Yes' ? 'text-green-600' : 'text-red-600'}">${report.safe}</span></div>
            <div class="flex justify-between items-center text-sm"><span class="text-gray-600">Faults Found</span><span class="font-bold ${report.faults > 0 ? 'text-red-600 bg-red-50 px-2 rounded' : ''}">${report.faults}</span></div>
            <div class="flex justify-between items-center text-sm"><span class="text-gray-600">Attached Photos</span><span class="font-bold text-blue-600"><i class="fas fa-camera mr-1"></i> ${report.photos}</span></div>
        </div>

        <div class="mt-6">
            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2 mb-2">Additional Notes</h4>
            <p class="text-sm text-gray-700 bg-gray-50 p-3 rounded border">${report.notes}</p>
        </div>
        
        <div class="mt-6 pt-4 border-t flex items-center justify-between">
            <span class="text-sm text-gray-500">Inspector Signature</span>
            <span class="text-green-600 text-sm font-bold"><i class="fas fa-check-circle mr-1"></i> Verified</span>
        </div>
    `;
    toggleDrawer();
}

function resetFilters() {
    document.querySelectorAll('#view-reports input, #view-reports select').forEach(el => el.value = '');
    loadReportsData();
}

// Initial Boot
document.addEventListener('DOMContentLoaded', initDashboard);