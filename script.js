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

    analyzeBtn.onclick = function() {
        if (uploadedFiles.length < 2) {
            alert('Veuillez télécharger au moins deux documents.');
            return;
        }

        // Simuler l'analyse des fichiers
        fileList.innerHTML = ''; // Vider la liste existante
        analyzeBtn.style.display = 'none';
        fileList.innerHTML = 'Analyse en cours...';

        // Simuler un délai d'analyse
        setTimeout(() => {
            fileList.innerHTML = 'Aucune similarité détectée.';
            uploadedFiles = []; // Réinitialiser le tableau des fichiers après l'analyse
        }, 2000); // Remplacer 2000 par une fonction d'analyse réelle
    }