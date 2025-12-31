// ===== LOAN CALCULATION FUNCTIONS =====

/**
 * حساب القسط الشهري بنظام الفائدة المتناقصة
 * PMT = [P × r × (1 + r)^n] / [(1 + r)^n - 1]
 */
function calculateMonthlyPayment(principal, annualRate, years) {
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;
    
    if (monthlyRate === 0) {
        return principal / numberOfPayments;
    }
    
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return payment;
}

/**
 * حساب إجمالي الفائدة
 */
function calculateTotalInterest(monthlyPayment, years, principal) {
    const totalPayment = monthlyPayment * years * 12;
    return totalPayment - principal;
}

/**
 * حساب نسبة الفائدة من القرض
 */
function calculateInterestPercentage(totalInterest, principal) {
    return (totalInterest / principal) * 100;
}

/**
 * تحليل القرض وإعطاء رأي
 */
function analyzeLoan(interestPercent) {
    if (interestPercent < 10) {
        return {
            text: "ممتاز! نسبة الفائدة منخفضة جداً. القرض مقبول من الناحية المالية.",
            class: "success"
        };
    } else if (interestPercent < 25) {
        return {
            text: "جيد. نسبة الفائدة معقولة، لكن حاول تخفيض المدة لو تقدر.",
            class: "success"
        };
    } else if (interestPercent < 40) {
        return {
            text: "تحذير: راح تدفع فائدة كبيرة! حاول تقصر مدة القرض أو تقلل المبلغ.",
            class: "warning"
        };
    } else {
        return {
            text: "خطر! نسبة الفائدة عالية جداً. راح تدفع تقريباً ضعف المبلغ!",
            class: "danger"
        };
    }
}

/**
 * حساب القرض السريع (للصفحة الرئيسية)
 */
function calculateQuick() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
    const loanPeriod = parseFloat(document.getElementById('loanPeriod').value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
    
    if (loanAmount <= 0 || loanPeriod <= 0 || interestRate < 0) {
        alert('يرجى إدخال أرقام صحيحة');
        return;
    }
    
    // الحسابات
    const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanPeriod);
    const totalPayment = monthlyPayment * loanPeriod * 12;
    const totalInterest = totalPayment - loanAmount;
    const interestPercent = calculateInterestPercentage(totalInterest, loanAmount);
    
    // التحليل
    const analysis = analyzeLoan(interestPercent);
    
    // عرض النتائج
    document.getElementById('monthlyPayment').textContent = formatNumber(monthlyPayment) + ' ريال';
    document.getElementById('totalInterest').textContent = formatNumber(totalInterest) + ' ريال';
    document.getElementById('interestPercent').textContent = formatPercent(interestPercent);
    document.getElementById('totalPayment').textContent = formatNumber(totalPayment) + ' ريال';
    
    const analysisElement = document.getElementById('analysis');
    analysisElement.textContent = analysis.text;
    analysisElement.className = 'result-desc analysis ' + analysis.class;
    
    // إظهار النتائج
    document.getElementById('quickResults').style.display = 'block';
}

/**
 * حساب جدول السداد الكامل
 */
function generateAmortizationSchedule(principal, annualRate, years) {
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;
    const monthlyPayment = calculateMonthlyPayment(principal, annualRate, years);
    
    let schedule = [];
    let balance = principal;
    
    for (let i = 1; i <= numberOfPayments; i++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        balance -= principalPayment;
        
        // تجنب الأرقام السالبة الصغيرة بسبب التقريب
        if (balance < 0.01) balance = 0;
        
        schedule.push({
            month: i,
            payment: monthlyPayment,
            principal: principalPayment,
            interest: interestPayment,
            balance: balance
        });
    }
    
    return schedule;
}

/**
 * حساب نسبة الاستقطاع من الراتب
 */
function calculateDeductionRatio(monthlyPayment, salary) {
    return (monthlyPayment / salary) * 100;
}

/**
 * تقييم نسبة الاستقطاع
 */
function evaluateDeductionRatio(ratio) {
    if (ratio <= 25) {
        return {
            text: "ممتاز! نسبة الاستقطاع ضمن الحد الآمن (أقل من 25%)",
            class: "success",
            level: "آمن"
        };
    } else if (ratio <= 33) {
        return {
            text: "مقبول. نسبة الاستقطاع ضمن الحد المعتمد بنكياً (حتى 33%)",
            class: "success",
            level: "مقبول"
        };
    } else if (ratio <= 50) {
        return {
            text: "تحذير! نسبة الاستقطاع عالية. راح يأثر على نمط حياتك",
            class: "warning",
            level: "خطر"
        };
    } else {
        return {
            text: "خطر شديد! أكثر من نص راتبك راح يروح للقرض!",
            class: "danger",
            level: "خطر شديد"
        };
    }
}

/**
 * حساب القدرة على الاقتراض
 */
function calculateBorrowingCapacity(salary, commitments, interestRate, years) {
    const maxDeduction = 0.33; // 33% الحد الأقصى المعتمد بنكياً
    const availableForLoan = (salary * maxDeduction) - commitments;
    
    if (availableForLoan <= 0) {
        return {
            maxLoan: 0,
            maxMonthlyPayment: 0,
            message: "عذراً، التزاماتك الحالية تتجاوز 33% من الراتب. لا يمكنك الحصول على قرض إضافي."
        };
    }
    
    // حساب أقصى قرض ممكن بناءً على القسط المتاح
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = years * 12;
    
    let maxLoan;
    if (monthlyRate === 0) {
        maxLoan = availableForLoan * numberOfPayments;
    } else {
        maxLoan = availableForLoan * (Math.pow(1 + monthlyRate, numberOfPayments) - 1) / 
                  (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));
    }
    
    return {
        maxLoan: maxLoan,
        maxMonthlyPayment: availableForLoan,
        message: "بناءً على راتبك والتزاماتك، تقدر تحصل على قرض بحد أقصى:"
    };
}

// إعداد الحساب التلقائي عند تحميل الصفحة
if (document.getElementById('loanAmount')) {
    setupAutoCalculate(calculateQuick);
}