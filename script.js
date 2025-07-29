const studentIdInput = document.getElementById('studentId');
const searchBtn = document.getElementById('searchBtn');
const resultContainer = document.getElementById('resultContainer');
const emptyState = document.getElementById('emptyState');
const notFound = document.getElementById('notFound');
const tryAgainBtn = document.getElementById('tryAgainBtn');
const topStudentsContainer = document.getElementById('topStudents');

// عناصر النتيجة
const studentName = document.getElementById('studentName');
const examType = document.getElementById('examType');
const resultStatus = document.getElementById('resultStatus');
const Moy_Bac = document.getElementById('Moy_Bac');
const schoolName = document.getElementById('schoolName');
const centerName = document.getElementById('centerName');
const stateName = document.getElementById('stateName');

let studentsMap = {};
let allStudentsArray = [];

// تحميل البيانات
fetch('data.json')
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        if (!Array.isArray(data)) throw new Error('تنسيق البيانات غير صحيح');

        allStudentsArray = data;

        data.forEach(student => {
            if (student.Num_Bac) {
                studentsMap[student.Num_Bac.toString().trim()] = student;
            }
        });

        console.log("✅ تم تحميل البيانات. عدد الطلاب:", Object.keys(studentsMap).length);
        showTopStudents(); // ✅ عرض الأوائل عند التحميل
    })
    .catch(error => {
        console.error("❌ خطأ في تحميل البيانات:", error);
        alert("حدث خطأ أثناء تحميل البيانات. حاول لاحقًا.");
    });

searchBtn.addEventListener('click', searchResult);
tryAgainBtn.addEventListener('click', resetSearch);
studentIdInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') searchResult();
});

function searchResult() {
    const studentId = studentIdInput.value.trim();
    console.log("🔍 البحث عن الرقم:", studentId);

    hideAllMessages();
    topStudentsContainer.style.display = "none"; // ✅ إخفاء الأوائل دائمًا عند البحث

    if (!studentId) {
        emptyState.classList.remove('hidden');
        return;
    }

    if (Object.keys(studentsMap).length === 0) {
        alert("البيانات لم تُحمّل بعد.");
        return;
    }

    const foundStudent = studentsMap[studentId];

    if (foundStudent) {
        displayResult(foundStudent);
    } else {
        notFound.classList.remove('hidden');
    }
}

function displayResult(data) {
    studentName.textContent = ` الاسم: ${data.NOM_AR || 'غير متوفر'}`;
    examType.textContent = ` الشعبة: ${data.Serie_AR || 'غير متوفر'}`;

    const decision = data.Decision || '';
    if (decision.includes("Admis Sn")) {
        resultStatus.innerHTML = ` القرار: <span class="success">ناجح</span>`;
    } else if (decision.includes("Sessionnaire")) {
        resultStatus.innerHTML = ` القرار: <span class="warning">الدورة التكميلية</span>`;
    } else {
        resultStatus.innerHTML = ` القرار: <span class="danger">راسب</span>`;
    }

    const moy = parseFloat(data.Moy_Bac);
    const truncated = Math.floor(moy * 100) / 100;
Moy_Bac.textContent = ` المعدل: ${isNaN(moy) ? 'غير متوفر' : truncated.toFixed(2)}`;
    schoolName.textContent = data.Etablissement_AR || 'غير متوفر';
    centerName.textContent = data.CentreExamenAR || 'غير متوفر';
    stateName.textContent = data.Wilaya_AR || 'غير متوفر';

    resultContainer.classList.remove('hidden');
}

function hideAllMessages() {
    emptyState.classList.add('hidden');
    notFound.classList.add('hidden');
    resultContainer.classList.add('hidden');
}

function resetSearch() {
    studentIdInput.value = '';
    hideAllMessages();
    resultContainer.classList.add('hidden');
    topStudentsContainer.style.display = "block"; // ✅ إظهار الأوائل من جديد
    studentIdInput.focus();
}

// ✅ عرض الأوائل حسب كل شعبة
function showTopStudents() {
    if (!Array.isArray(allStudentsArray)) return;

    const topStudents = {};

    allStudentsArray.forEach(student => {
        const serie = student.Serie_AR;
        const moy = parseFloat(student.Moy_Bac);
        if (!serie || isNaN(moy)) return;

        if (!topStudents[serie] || moy > parseFloat(topStudents[serie].Moy_Bac)) {
            topStudents[serie] = student;
        }
    });

    let html = "<h3>الأوائل من كل شعبة</h3><ul>";

    Object.keys(topStudents).forEach(serie => {
        const student = topStudents[serie];
        html += `
            <li>
                <strong>${serie}</strong> - ${student.NOM_AR || "???"}<br>
                <span>المعدل: ${parseFloat(student.Moy_Bac).toFixed(2)}</span><br>
                <span>المدرسة: ${student.Etablissement_AR || "غير متوفر"}</span>
            </li>
        `;
    });

    html += "</ul>";
    topStudentsContainer.innerHTML = html;
    topStudentsContainer.style.display = "block";
}
