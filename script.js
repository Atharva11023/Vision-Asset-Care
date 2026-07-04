const kpiData = [
    { title: "Total Vehicles", value: 156 },
    { title: "Total Operators", value: 82 },
    { title: "Today's Insp.", value: 41 },
    { title: "Pending", value: 18 },
    { title: "Faulty", value: 12 },
    { title: "Completion %", value: "98%" }
];

function initDashboard() {
    // Populate KPIs
    const grid = document.getElementById('kpi-grid');
    kpiData.forEach(k => {
        grid.innerHTML += `
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 card">
                <p class="text-[10px] text-gray-500 uppercase font-bold">${k.title}</p>
                <h3 class="text-xl font-bold mt-1">${k.value}</h3>
            </div>`;
    });

    // Chart.js Setup
    const config = (label, data, colors) => ({
        type: 'bar',
        data: { labels: ['A', 'B', 'C'], datasets: [{ label: label, data: data, backgroundColor: colors }] },
        options: { responsive: true }
    });

    new Chart(document.getElementById('issueChart'), config('Issues', [12, 5, 16], ['#22c55e', '#f59e0b', '#ef4444']));
    new Chart(document.getElementById('inspectionChart'), config('Inspections', [40, 30, 20], ['#3b82f6', '#60a5fa', '#93c5fd']));
    new Chart(document.getElementById('faultChart'), config('Faults', [8, 10, 4], ['#ef4444', '#f97316', '#eab308']));

    // Live Clock
    setInterval(() => {
        document.getElementById('live-clock').innerText = new Date().toLocaleTimeString();
    }, 1000);
}
// ... existing code above ...

// Populate Recent Inspections Table
const recentInspections = [
    { report: "VIESL001", date: "2026-07-04", vehicle: "VPAV260081", status: "Approved" },
    { report: "VIESL002", date: "2026-07-03", vehicle: "VCON200004", status: "Pending" }
];

const tableBody = document.getElementById('inspection-table-body');
if (tableBody) {
    recentInspections.forEach(item => {
        tableBody.innerHTML += `
            <tr class="border-b">
                <td class="py-3">${item.report}</td>
                <td class="py-3">${item.date}</td>
                <td class="py-3">${item.vehicle}</td>
                <td class="py-3 text-blue-600 font-medium">${item.status}</td>
            </tr>`;
    });
}

// THIS SHOULD BE THE LAST LINE
document.addEventListener('DOMContentLoaded', initDashboard);

document.addEventListener('DOMContentLoaded', initDashboard);