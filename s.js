const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const analyzeBtn = document.getElementById('analyzeBtn');
const modal = document.getElementById('myModal');
const closeModal = document.querySelector('.close');
const openModal = document.getElementById('openModal');
const uploadFiles = document.getElementById('uploadFiles');

// Tableau pour stocker les fichiers ajoutés
let uploadedFiles = [];

openModal.onclick = function() {
    modal.style.display = "block";
}

closeModal.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

uploadFiles.onclick = function() {
    const files = fileInput.files;
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            uploadedFiles.push(files[i]); // Ajouter chaque fichier au tableau
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            // Ajouter l'icône PDF
            const fileIcon = document.createElement('i');
            fileIcon.className = 'fas fa-file-pdf file-icon'; // Classe pour l'icône PDF
            fileItem.appendChild(fileIcon);
            
            // Ajouter le nom du fichier
            const fileName = document.createElement('span');
            fileName.textContent = files[i].name;
            fileItem.appendChild(fileName);
            
            fileList.appendChild(fileItem);
        }
        analyzeBtn.style.display = 'inline-block';
        modal.style.display = 'none';
        fileInput.value = ''; // Réinitialiser l'input
    }
}

analyzeBtn.onclick = async function() {
    if (uploadedFiles.length < 2) {
        alert('Veuillez télécharger au moins deux documents.');
        return;
    }

    // Simuler l'analyse des fichiers
    fileList.innerHTML = ''; // Vider la liste existante
    analyzeBtn.style.display = 'none';
    fileList.innerHTML = 'Analyse en cours...';

    // Simuler la logique de détection de plagiat
    const plagiarismResult = await checkForPlagiarism(uploadedFiles);
    
    // Afficher le résultat
    if (plagiarismResult.similarity > 0) {
        fileList.innerHTML = `Plagiat détecté : ${plagiarismResult.similarity.toFixed(2)}% similaires.`;
    } else {
        fileList.innerHTML = 'Aucune similarité détectée.';
    }
    
    // Réinitialiser le tableau des fichiers après l'analyse
    uploadedFiles = [];
}

// Fonction pour simuler la détection de plagiat
async function checkForPlagiarism(files) {
    const fileContents = {}; // Un objet pour stocker le contenu de chaque fichier

    // Simuler le contenu des fichiers
    for (let i = 0; i < files.length; i++) {
        fileContents[files[i].name] = await readFileContent(files[i]);
    }

    // Comparaison des deux premiers fichiers
    const content1 = fileContents[files[0].name];
    const content2 = fileContents[files[1].name];

    // Calculer le pourcentage de similarité
    const similarity = calculateSimilarity(content1, content2);

    return {
        similarity: similarity
    };
}

// Fonction pour lire le contenu d'un fichier
function readFileContent(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            resolve(event.target.result);
        };
        reader.readAsText(file); // Lire le contenu du fichier comme texte
    });
}

// Fonction pour calculer le pourcentage de similarité
function calculateSimilarity(content1, content2) {
    const words1 = content1.split(/\s+/).filter(Boolean); // Séparer et filtrer les mots
    const words2 = content2.split(/\s+/).filter(Boolean);

    const uniqueWords = new Set([...words1, ...words2]); // Ensemble des mots uniques
    let matches = 0;

    uniqueWords.forEach(word => {
        if (words1.includes(word) && words2.includes(word)) {
            matches++;
        }
    });

    // Calculer le pourcentage de similarité
    const totalWords = uniqueWords.size;
    const similarityPercentage = (matches / totalWords) * 100;

    return similarityPercentage;
}