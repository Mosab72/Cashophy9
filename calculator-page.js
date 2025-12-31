// ===== FULL CALCULATOR PAGE =====

function calculateFull() {
    const loanAmount = parseFloat(document.getElementById('calcLoanAmount').value) || 0;
    const loanPeriod = parseFloat(document.getElementById('calcLoanPeriod').value) || 0;
    const interestRate = parseFloat(document.getElementById('calcInterestRate').value) || 0;
    const interestType = document.getElementById('calcInterestType').value;
    
    if (loanAmount <= 0 || loanPeriod <= 0 || interestRate < 0) {
        alert('يرجى إدخال أرقام صحيحة في جميع الحقول');
        return;
    }
    
    let monthlyPayment, totalPayment, totalInterest;
    
    if (interestType === 'decreasing') {
        // فائدة متناقصة (الطريقة الأكثر شيوعاً)
        monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanPeriod);
        totalPayment = monthlyPayment * loanPeriod * 12;
        totalInterest = totalPayment - loanAmount;
    } else {
        // فائدة ثابتة (نادرة)
        totalInterest = (loanAmount * interestRate / 100) * loanPeriod;
        totalPayment = loanAmount + totalInterest;
        monthlyPayment = totalPayment / (loanPeriod * 12);
    }
    
    const totalPayments = loanPeriod * 12;
    const interestPercent = calculateInterestPercentage(totalInterest, loanAmount);
    
    // عرض النتائج الرئيسية
    document.getElementById('fullMonthlyPayment').textContent = formatNumber(monthlyPayment) + ' ريال';
    document.getElementById('fullTotalPayment').textContent = formatNumber(totalPayment) + ' ريال';
    document.getElementById('fullTotalInterest').textContent = formatNumber(totalInterest) + ' ريال';
    document.getElementById('fullInterestPercent').textContent = formatPercent(interestPercent);
    document.getElementById('fullTotalPayments').textContent = formatNumber(totalPayments) + ' قسط';
    
    // التحليل المفصل
    const analysis = analyzeLoan(interestPercent);
    const analysisBox = document.getElementById('fullAnalysis');
    const analysisText = document.getElementById('fullAnalysisText');
    
    // إزالة جميع الكلاسات السابقة
    analysisBox.className = 'analysis-box ' + analysis.class;
    
    // نص التحليل المفصل
    let detailedAnalysis = `<strong>${analysis.text}</strong><br><br>`;
    
    if (interestPercent < 10) {
        detailedAnalysis += `نسبة الفائدة ${formatPercent(interestPercent)} ممتازة! `;
        detailedAnalysis += `راح تدفع ${formatNumber(totalInterest)} ريال فائدة فقط على مدى ${loanPeriod} سنة. `;
        detailedAnalysis += `هذا يعتبر عرض جيد جداً.`;
    } else if (interestPercent < 25) {
        detailedAnalysis += `نسبة الفائدة ${formatPercent(interestPercent)} مقبولة. `;
        detailedAnalysis += `راح تدفع ${formatNumber(totalInterest)} ريال فائدة إضافية. `;
        detailedAnalysis += `<strong>نصيحة:</strong> لو قدرت تقصر المدة لـ ${Math.max(1, loanPeriod - 2)} سنوات، راح توفر الكثير من الفوائد.`;
    } else if (interestPercent < 40) {
        detailedAnalysis += `<strong>تحذير:</strong> نسبة الفائدة ${formatPercent(interestPercent)} عالية! `;
        detailedAnalysis += `راح تدفع ${formatNumber(totalInterest)} ريال فائدة، وهذا مبلغ كبير. `;
        detailedAnalysis += `<strong>خياراتك:</strong><br>`;
        detailedAnalysis += `• قلل المبلغ لو تقدر<br>`;
        detailedAnalysis += `• قصر المدة لتوفير الفوائد<br>`;
        detailedAnalysis += `• قارن مع بنوك أخرى قد تعطيك نسبة أفضل`;
    } else {
        detailedAnalysis += `<strong>خطر شديد!</strong> نسبة الفائدة ${formatPercent(interestPercent)} عالية جداً! `;
        detailedAnalysis += `راح تدفع ${formatNumber(totalInterest)} ريال فائدة، أكثر من نصف مبلغ القرض! `;
        detailedAnalysis += `<strong>لا ننصح بهذا القرض!</strong><br><br>`;
        detailedAnalysis += `<strong>بدائل أفضل:</strong><br>`;
        detailedAnalysis += `• ادخر وقلل المبلغ المطلوب<br>`;
        detailedAnalysis += `• ابحث عن بنوك تعطي نسب أقل<br>`;
        detailedAnalysis += `• قصر المدة لو ممكن (حتى لو زاد القسط)`;
    }
    
    analysisText.innerHTML = detailedAnalysis;
    
    // رسم المخطط البياني
    updateComparisonChart(loanAmount, totalInterest, totalPayment);
    
    // التمرير للنتائج
    document.getElementById('resultsPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateComparisonChart(principal, interest, total) {
    const principalPercent = (principal / total) * 100;
    const interestPercent = (interest / total) * 100;
    
    const principalSegment = document.getElementById('chartPrincipal');
    const interestSegment = document.getElementById('chartInterest');
    const principalLabel = document.getElementById('chartPrincipalLabel');
    const interestLabel = document.getElementById('chartInterestLabel');
    
    // تحديث العرض
    principalSegment.style.width = principalPercent + '%';
    interestSegment.style.width = interestPercent + '%';
    
    // تحديث النصوص
    principalLabel.textContent = principalPercent.toFixed(1) + '%';
    interestLabel.textContent = interestPercent.toFixed(1) + '%';
}

// إعداد الحساب التلقائي
if (document.getElementById('calcLoanAmount')) {
    const inputs = ['calcLoanAmount', 'calcLoanPeriod', 'calcInterestRate'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', function() {
                // لا نحسب تلقائياً، ننتظر الضغط على زر الحساب
                // لكن ممكن نضيف مؤشر بصري أن القيم تغيرت
            });
        }
    });
    
    // تشغيل الحساب عند الضغط على Enter
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    calculateFull();
                }
            });
        }
    });
}