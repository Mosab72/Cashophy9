// ===== SALARY & DEDUCTION CALCULATOR =====

function calculateSalaryImpact() {
    // جلب البيانات
    const basicSalary = parseFloat(document.getElementById('monthlySalary').value) || 0;
    const allowances = parseFloat(document.getElementById('allowances').value) || 0;
    const currentCommitments = parseFloat(document.getElementById('currentCommitments').value) || 0;
    const loanAmount = parseFloat(document.getElementById('salaryLoanAmount').value) || 0;
    const loanPeriod = parseFloat(document.getElementById('salaryLoanPeriod').value) || 0;
    const interestRate = parseFloat(document.getElementById('salaryInterestRate').value) || 0;
    
    // التحقق من البيانات
    if (basicSalary <= 0) {
        alert('يرجى إدخال الراتب الشهري');
        return;
    }
    
    if (loanAmount <= 0 || loanPeriod <= 0 || interestRate < 0) {
        alert('يرجى إدخال بيانات القرض بشكل صحيح');
        return;
    }
    
    // حساب إجمالي الدخل
    const totalIncome = basicSalary + allowances;
    
    // حساب قسط القرض الجديد
    const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanPeriod);
    
    // حساب إجمالي الاستقطاعات
    const totalDeductions = currentCommitments + monthlyPayment;
    
    // حساب الراتب المتبقي
    const remainingSalary = totalIncome - totalDeductions;
    
    // حساب النسب
    const currentPercent = (currentCommitments / totalIncome) * 100;
    const newLoanPercent = (monthlyPayment / totalIncome) * 100;
    const totalPercent = (totalDeductions / totalIncome) * 100;
    const availablePercent = ((totalIncome - totalDeductions) / totalIncome) * 100;
    
    // عرض النتائج الأساسية
    document.getElementById('totalIncome').textContent = formatNumber(totalIncome) + ' ريال';
    document.getElementById('currentDeduction').textContent = formatNumber(currentCommitments) + ' ريال';
    document.getElementById('currentPercent').textContent = formatPercent(currentPercent);
    document.getElementById('newLoanPayment').textContent = formatNumber(monthlyPayment) + ' ريال';
    document.getElementById('newLoanPercent').textContent = formatPercent(newLoanPercent);
    document.getElementById('totalDeductions').textContent = formatNumber(totalDeductions) + ' ريال';
    document.getElementById('totalPercent').textContent = formatPercent(totalPercent);
    document.getElementById('remainingSalary').textContent = formatNumber(remainingSalary) + ' ريال';
    
    // تحديث صندوق الراتب المتبقي
    const remainingBox = document.getElementById('remainingSalaryBox');
    const remainingDesc = document.getElementById('remainingDesc');
    
    if (remainingSalary < 0) {
        remainingBox.className = 'remaining-salary danger';
        remainingDesc.textContent = 'مستحيل! راتبك لا يكفي حتى للأقساط!';
    } else if (totalPercent <= 25) {
        remainingBox.className = 'remaining-salary success';
        remainingDesc.textContent = 'ممتاز! راح يبقى معك مبلغ جيد للمعيشة';
    } else if (totalPercent <= 33) {
        remainingBox.className = 'remaining-salary warning';
        remainingDesc.textContent = 'مقبول، لكن راح تحتاج تنظم مصاريفك';
    } else if (totalPercent <= 50) {
        remainingBox.className = 'remaining-salary danger';
        remainingDesc.textContent = 'خطر! نص راتبك راح للأقساط';
    } else {
        remainingBox.className = 'remaining-salary danger';
        remainingDesc.textContent = 'خطر شديد! أغلب راتبك راح يروح للأقساط';
    }
    
    // تقييم الوضع وإظهار التنبيه
    updateStatusAlert(totalPercent, remainingSalary, totalIncome);
    
    // تحديث الرسم البياني
    updateSalaryVisual(availablePercent, totalPercent);
    
    // حساب القدرة على الاقتراض
    calculateBorrowingCapacityDisplay(totalIncome, currentCommitments, interestRate, loanPeriod);
    
    // التمرير للنتائج
    document.getElementById('salaryResultsPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateStatusAlert(totalPercent, remainingSalary, totalIncome) {
    const alertBox = document.getElementById('statusAlert');
    const alertContent = document.getElementById('alertContent');
    
    if (remainingSalary < 0) {
        alertBox.className = 'status-alert danger';
        alertContent.innerHTML = `<strong>مستحيل!</strong> راتبك لا يكفي لتغطية الأقساط. يرجى:<br>
        • تقليل مبلغ القرض<br>
        • تقليل الالتزامات الحالية<br>
        • زيادة فترة القرض (رغم زيادة الفوائد)`;
    } else if (totalPercent <= 25) {
        alertBox.className = 'status-alert success';
        alertContent.innerHTML = `<strong>✓ ممتاز!</strong> نسبة الاستقطاع ${formatPercent(totalPercent)} ضمن الحد الآمن (أقل من 25%). 
        وضعك المالي مريح وتقدر تحافظ على نمط حياتك.`;
    } else if (totalPercent <= 33) {
        alertBox.className = 'status-alert success';
        alertContent.innerHTML = `<strong>✓ مقبول</strong> نسبة الاستقطاع ${formatPercent(totalPercent)} ضمن الحد المعتمد بنكياً (حتى 33%). 
        لكن انتبه لمصاريفك الشهرية عشان ما تتضايق.`;
    } else if (totalPercent <= 50) {
        alertBox.className = 'status-alert warning';
        alertContent.innerHTML = `<strong>⚠ تحذير!</strong> نسبة الاستقطاع ${formatPercent(totalPercent)} عالية جداً! 
        راح يأثر على نمط حياتك. <strong>البنوك غالباً راح ترفض طلبك</strong> لأنك تجاوزت 33%.`;
    } else {
        alertBox.className = 'status-alert danger';
        alertContent.innerHTML = `<strong>✗ خطر شديد!</strong> نسبة الاستقطاع ${formatPercent(totalPercent)} غير عملية أبداً! 
        <strong>البنك راح يرفض طلبك 100%</strong>. يرجى إعادة النظر في خطتك المالية بالكامل.`;
    }
}

function updateSalaryVisual(availablePercent, committedPercent) {
    const barAvailable = document.getElementById('barAvailable');
    const barCommitted = document.getElementById('barCommitted');
    const barAvailableLabel = document.getElementById('barAvailableLabel');
    const barCommittedLabel = document.getElementById('barCommittedLabel');
    
    barAvailable.style.width = availablePercent + '%';
    barCommitted.style.width = committedPercent + '%';
    
    barAvailableLabel.textContent = availablePercent.toFixed(1) + '%';
    barCommittedLabel.textContent = committedPercent.toFixed(1) + '%';
}

function calculateBorrowingCapacityDisplay(totalIncome, currentCommitments, interestRate, loanPeriod) {
    const capacity = calculateBorrowingCapacity(totalIncome, currentCommitments, interestRate, loanPeriod);
    
    document.getElementById('maxMonthlyPayment').textContent = formatNumber(capacity.maxMonthlyPayment) + ' ريال';
    document.getElementById('maxLoanAmount').textContent = formatNumber(capacity.maxLoan) + ' ريال';
    
    const messageElement = document.getElementById('capacityMessage');
    
    if (capacity.maxLoan <= 0) {
        messageElement.className = 'capacity-message error';
        messageElement.innerHTML = capacity.message;
    } else {
        messageElement.className = 'capacity-message';
        messageElement.innerHTML = `${capacity.message}<br><br>
        <strong>ملاحظة:</strong> هذا الحد الأقصى بناءً على قاعدة 33% من دخلك. 
        لكن ننصحك بعدم تجاوز 25% للحفاظ على راحتك المالية.`;
    }
}

// إعداد الحساب عند الضغط على Enter
if (document.getElementById('monthlySalary')) {
    const inputs = [
        'monthlySalary', 'allowances', 'currentCommitments',
        'salaryLoanAmount', 'salaryLoanPeriod', 'salaryInterestRate'
    ];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    calculateSalaryImpact();
                }
            });
        }
    });
}