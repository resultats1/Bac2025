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

// متغير لتخزين بيانات الطلاب
let studentsData = [];

// جلب البيانات من ملف JSON
fetch('data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (!Array.isArray(data)) {
            console.error("Les données ne sont pas un tableau:", data);
            throw new Error('Format de données invalide');
        }
        studentsData = data;
        console.log("Données chargées avec succès. Nombre d'étudiants:", studentsData.length);
        console.log("Exemple de données:", studentsData[0]);
    })
    .catch(error => {
        console.error("Erreur de chargement des données:", error);
        alert("Erreur de chargement des données. Veuillez réessayer plus tard.");
    });

// زر البحث
searchBtn.addEventListener('click', searchResult);

// زر المحاولة مرة أخرى
tryAgainBtn.addEventListener('click', resetSearch);

// البحث عند الضغط على Enter
studentIdInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchResult();
    }
});

// دالة البحث
function searchResult() {
    const studentId = studentIdInput.value.trim();
    console.log("Recherche pour l'ID:", studentId);
    
    hideAllMessages();
    
    if (!studentId) {
        emptyState.classList.remove('hidden');
        return;
    }
    
    if (!studentsData || studentsData.length === 0) {
        alert("البيانات لم يتم تحميلها بعد، يرجى الانتظار...");
        console.error("Données non chargées");
        return;
    }
    
    // Recherche insensible à la casse et avec trim
    const foundStudent = studentsData.find(student => {
        return student.Num_Bac && student.Num_Bac.toString().trim() === studentId;
    });
    
    console.log("Résultat de la recherche:", foundStudent);
    
    if (foundStudent) {
        displayResult(foundStudent);
    } else {
        console.warn("Aucun étudiant trouvé avec l'ID:", studentId);
        notFound.classList.remove('hidden');
    }
}

// عرض النتيجة
function displayResult(data) {
    console.log("Affichage des résultats pour:", data);
    
    studentName.textContent = `الاسم: ${data.NOM_AR || 'غير متوفر'}`;
    examType.textContent = `الشعبة: ${data.Serie_AR || 'غير متوفر'}`;
    
const decision = data.Decision || '';
if (decision.includes("Admis Sn")) {
    resultStatus.innerHTML =` القرار: <span class="success">ناجح</span>`;
} else if (decision.includes("Sessionnaire")) {
    resultStatus.innerHTML =` القرار: <span class="warning"> الدورة التكميلية</span>`;
} else if (decision.includes("Ajourné Sn")) {
    resultStatus.innerHTML =` القرار: <span class="danger">راسب</span>`;
} else {
    resultStatus.innerHTML =` القرار: <span class="danger">راسب</span>`;
}
     Moy_Bac.textContent = `المعدل: ${data.Moy_Bac || 'غير متوفر'}`;
    schoolName.textContent = data.Etablissement_AR || 'غير متوفر';
    centerName.textContent = data["Centre Examen_AR"] || data["Centre Examen_AR"] || 'غير متوفر';
    stateName.textContent = data.Wilaya_AR || 'غير متوفر';
    
    resultContainer.classList.remove('hidden');
}

// إخفاء جميع الرسائل
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