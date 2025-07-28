const studentIdInput = document.getElementById('studentId');
const searchBtn = document.getElementById('searchBtn');
const resultContainer = document.getElementById('resultContainer');
const emptyState = document.getElementById('emptyState');
const notFound = document.getElementById('notFound');
const tryAgainBtn = document.getElementById('tryAgainBtn');

// عناصر النتيجة
const studentName = document.getElementById('studentName');
const examType = document.getElementById('examType');
const resultStatus = document.getElementById('resultStatus');
const Moy_Bac = document.getElementById('Moy_Bac');
const schoolName = document.getElementById('schoolName');
const centerName = document.getElementById('centerName');
const stateName = document.getElementById('stateName');

// متغير لتخزين البيانات بشكل سريع
let studentsMap = {}; // ⬅ هذا بدلًا من Array

// جلب البيانات من ملف JSON وتحويلها إلى Object Map
fetch('data.json')
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        if (!Array.isArray(data)) {
            console.error("البيانات ليست في شكل مصفوفة:", data);
            throw new Error('تنسيق البيانات غير صحيح');
        }

        // تحويل المصفوفة إلى كائن بحث سريع
        data.forEach(student => {
            if (student.Num_Bac) {
                studentsMap[student.Num_Bac.toString().trim()] = student;
            }
        });

        console.log("✅ تم تحميل وتحويل البيانات بنجاح. عدد الطلاب:", Object.keys(studentsMap).length);
    })
    .catch(error => {
        console.error("❌ خطأ أثناء تحميل البيانات:", error);
        alert("حدث خطأ أثناء تحميل البيانات. يرجى المحاولة لاحقًا.");
    });

// زر البحث
searchBtn.addEventListener('click', searchResult);

// زر المحاولة مرة أخرى
tryAgainBtn.addEventListener('click', resetSearch);

// البحث عند الضغط على Enter
studentIdInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') searchResult();
});

// دالة البحث السريع باستخدام object map
function searchResult() {
    const studentId = studentIdInput.value.trim();
    console.log("🔍 البحث عن الرقم:", studentId);

    hideAllMessages();

    if (!studentId) {
        emptyState.classList.remove('hidden');
        return;
    }

    if (Object.keys(studentsMap).length === 0) {
        alert("البيانات لم يتم تحميلها بعد، يرجى الانتظار...");
        return;
    }

    const foundStudent = studentsMap[studentId];

    if (foundStudent) {
        displayResult(foundStudent);
    } else {
        notFound.classList.remove('hidden');
    }
}

// عرض النتيجة
function displayResult(data) {
    studentName.textContent =`  الاسم: ${data.NOM_AR || 'غير متوفر'}`;
    examType.textContent =` الشعبة: ${data.Serie_AR || 'غير متوفر'}`;

    const decision = data.Decision || '';
    if (decision.includes("Admis Sn")) {
        resultStatus.innerHTML =` القرار: <span class="success">ناجح</span>`;
    } else if (decision.includes("Sessionnaire")) {
        resultStatus.innerHTML =` القرار: <span class="warning">الدورة التكميلية</span>`;
    } else {
        resultStatus.innerHTML =` القرار: <span class="danger">راسب</span>`;
    }

    Moy_Bac.textContent =` المعدل: ${data.Moy_Bac ? parseFloat(data.Moy_Bac).toFixed(2) : 'غير متوفر'}`;
    schoolName.textContent = data.Etablissement_AR || 'غير متوفر';
    centerName.textContent = data.CentreExamenAR || 'غير متوفر';
    stateName.textContent = data.Wilaya_AR || 'غير متوفر';

    resultContainer.classList.remove('hidden');
}

// إخفاء كل الرسائل
function hideAllMessages() {
    emptyState.classList.add('hidden');
    notFound.classList.add('hidden');
    resultContainer.classList.add('hidden');
}

// إعادة تعيين البحث
function resetSearch() {
    studentIdInput.value = '';
    hideAllMessages();
    studentIdInput.focus();
}
