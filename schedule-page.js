function generateSchedule() {
    const loanAmount = parseFloat(document.getElementById('schedLoanAmount').value) || 0;
    const period = parseFloat(document.getElementById('schedPeriod').value) || 0;
    const rate = parseFloat(document.getElementById('schedRate').value) || 0;
    
    if (loanAmount <= 0 || period <= 0 || rate < 0) {
        alert('يرجى إدخال بيانات صحيحة');
        return;
    }
    
    const schedule = generateAmortizationSchedule(loanAmount, rate, period);
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    let currentYear = 0;
    schedule.forEach((row, index) => {
        const yearNum = Math.floor(index / 12) + 1;
        
        // إضافة صف للسنة
        if (yearNum !== currentYear) {
            currentYear = yearNum;
            const yearRow = document.createElement('tr');
            yearRow.className = 'year-marker';
            yearRow.innerHTML = `<td colspan="5">السنة ${yearNum}</td>`;
            tableBody.appendChild(yearRow);
        }
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.month}</td>
            <td>${formatNumber(row.payment)} ريال</td>
            <td>${formatNumber(row.principal)} ريال</td>
            <td>${formatNumber(row.interest)} ريال</td>
            <td>${formatNumber(row.balance)} ريال</td>
        `;
        tableBody.appendChild(tr);
    });
    
    document.getElementById('scheduleTable').style.display = 'block';
    document.getElementById('scheduleTable').scrollIntoView({ behavior: 'smooth' });
}

function printSchedule() {
    window.print();
}