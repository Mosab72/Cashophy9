function compareLoans() {
    // Loan 1
    const amount1 = parseFloat(document.getElementById('loan1Amount').value) || 0;
    const period1 = parseFloat(document.getElementById('loan1Period').value) || 0;
    const rate1 = parseFloat(document.getElementById('loan1Rate').value) || 0;
    
    // Loan 2
    const amount2 = parseFloat(document.getElementById('loan2Amount').value) || 0;
    const period2 = parseFloat(document.getElementById('loan2Period').value) || 0;
    const rate2 = parseFloat(document.getElementById('loan2Rate').value) || 0;
    
    if (amount1 <= 0 || period1 <= 0 || amount2 <= 0 || period2 <= 0) {
        alert('يرجى إدخال بيانات صحيحة لكلا القرضين');
        return;
    }
    
    // حساب القرض الأول
    const monthly1 = calculateMonthlyPayment(amount1, rate1, period1);
    const total1 = monthly1 * period1 * 12;
    const interest1 = total1 - amount1;
    
    // حساب القرض الثاني
    const monthly2 = calculateMonthlyPayment(amount2, rate2, period2);
    const total2 = monthly2 * period2 * 12;
    const interest2 = total2 - amount2;
    
    // عرض نتائج القرض الأول
    document.getElementById('loan1Monthly').textContent = formatNumber(monthly1) + ' ريال';
    document.getElementById('loan1Interest').textContent = formatNumber(interest1) + ' ريال';
    document.getElementById('loan1Total').textContent = formatNumber(total1) + ' ريال';
    
    // عرض نتائج القرض الثاني
    document.getElementById('loan2Monthly').textContent = formatNumber(monthly2) + ' ريال';
    document.getElementById('loan2Interest').textContent = formatNumber(interest2) + ' ريال';
    document.getElementById('loan2Total').textContent = formatNumber(total2) + ' ريال';
    
    // تحديد الفائز
    const winnerCard = document.getElementById('winnerCard');
    const winnerTitle = document.getElementById('winnerTitle');
    const winnerDesc = document.getElementById('winnerDesc');
    const savingsAmount = document.getElementById('savingsAmount');
    
    if (total1 < total2) {
        winnerTitle.textContent = '🎉 القرض الأول هو الأفضل!';
        winnerDesc.textContent = `المبلغ الكلي أقل والفائدة أقل`;
        savingsAmount.textContent = formatNumber(total2 - total1) + ' ريال';
    } else if (total2 < total1) {
        winnerTitle.textContent = '🎉 القرض الثاني هو الأفضل!';
        winnerDesc.textContent = `المبلغ الكلي أقل والفائدة أقل`;
        savingsAmount.textContent = formatNumber(total1 - total2) + ' ريال';
    } else {
        winnerTitle.textContent = 'القرضان متساويان!';
        winnerDesc.textContent = 'المبلغ الكلي نفسه تقريباً';
        savingsAmount.textContent = '0 ريال';
    }
    
    document.getElementById('comparisonResult').style.display = 'block';
    document.getElementById('comparisonResult').scrollIntoView({ behavior: 'smooth' });
}