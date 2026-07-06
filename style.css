function switchView(viewId) {
    document.getElementById('view-dashboard').classList.add('hidden');
    document.getElementById('view-reports').classList.add('hidden');
    document.getElementById(viewId).classList.remove('hidden');
}

function initDashboard() {
    const kpiData = [{title: "Vehicles", val: "156"}, {title: "Operators", val: "82"}, {title: "Inspection", val: "41"}, {title: "Pending", val: "18"}, {title: "Faulty", val: "12"}, {title: "Complete", val: "98%"}];
    const grid = document.getElementById('kpi-grid');
    if(grid) kpiData.forEach(k => grid.innerHTML += `<div class="bg-white p-4 rounded-xl shadow-sm border card"><p class="text-[10px] text-gray-400 font-bold">${k.title}</p><h3 class="text-xl font-bold">${k.val}</h3></div>`);

    new Chart(document.getElementById('issueChart'), { type: 'bar', data: { labels: ['R', 'P', 'P'], datasets: [{ data: [12, 5, 16], backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'] }] } });
    new Chart(document.getElementById('inspectionChart'), { type: 'doughnut', data: { labels: ['Good', 'Faulty'], datasets: [{ data: [177, 17], backgroundColor: ['#22c55e', '#ec4899'] }] } });
    new Chart(document.getElementById('faultChart'), { type: 'bar', data: { labels: ['F', 'R', 'R'], datasets: [{ data: [17, 21, 8], backgroundColor: ['#ef4444', '#eab308', '#3b82f6'] }] } });

    const topLists = { faulty: [{name: "VPAV260081", count: 12}], repair: [{name: "Brake Pads", count: 15}], replace: [{name: "Tires", count: 6}] };
    Object.keys(topLists).forEach(key => {
        const list = document.getElementById(`${key}-vehicles-list`) || document.getElementById(`${key}-items-list`);
        if(list) topLists[key].forEach(i => list.innerHTML += `<div class="flex justify-between text-sm border-b pb-2"><span>${i.name}</span><span class="font-bold">${i.count}</span></div>`);
    });

    const tbody = document.getElementById('reports-table-body');
    if(tbody) tbody.innerHTML = [{id: "VIESL001", v: "VPAV260081", s: "Approved"}, {id: "VIESL002", v: "VCON200004", s: "Pending"}].map(r => `<tr class="border-b"><td class="p-4 font-bold">${r.id}</td><td class="p-4">${r.v}</td><td class="p-4 text-blue-600">${r.s}</td></tr>`).join('');
    
    setInterval(() => { const c = document.getElementById('live-clock'); if(c) c.innerText = new Date().toLocaleTimeString(); }, 1000);
}
document.addEventListener('DOMContentLoaded', initDashboard);