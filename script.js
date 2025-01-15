class BTreeNode {
    constructor(leaf = true) {
        this.leaf = leaf;
        this.keys = [];
        this.children = [];
    }
}

class BTree {
    constructor(degree) {
        this.root = new BTreeNode(true);
        this.degree = degree;
    }

    insert(key) {
        if (this.root.keys.length === (2 * this.degree) - 1) {
            let newRoot = new BTreeNode(false);
            newRoot.children.push(this.root);
            this.splitChild(newRoot, 0);
            this.root = newRoot;
        }
        this.insertNonFull(this.root, key);
    }

    splitChild(parentNode, index) {
        let degree = this.degree;
        let childNode = parentNode.children[index];
        let newNode = new BTreeNode(childNode.leaf);

        parentNode.keys.splice(index, 0, childNode.keys[degree - 1]);

        newNode.keys = childNode.keys.splice(degree, degree - 1);

        if (!childNode.leaf) {
            newNode.children = childNode.children.splice(degree, degree);
        }

        parentNode.children.splice(index + 1, 0, newNode);
    }

    insertNonFull(node, key) {
        let i = node.keys.length - 1;

        if (node.leaf) {
            while (i >= 0 && node.keys[i] > key) {
                node.keys[i + 1] = node.keys[i];
                i--;
            }
            node.keys[i + 1] = key;
        } else {
            while (i >= 0 && node.keys[i] > key) {
                i--;
            }
            i++;

            if (node.children[i].keys.length === (2 * this.degree) - 1) {
                this.splitChild(node, i);
                if (key > node.keys[i]) {
                    i++;
                }
            }
            this.insertNonFull(node.children[i], key);
        }
    }

    search(key) {
        return this.searchNode(this.root, key);
    }

    searchNode(node, key) {
        let i = 0;
        while (i < node.keys.length && key > node.keys[i]) {
            i++;
        }

        if (i < node.keys.length && key === node.keys[i]) {
            return true;
        }

        if (node.leaf) {
            return false;
        }

        return this.searchNode(node.children[i], key);
    }
}

class BSTNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    insert(value) {
        const newNode = new BSTNode(value);
        if (!this.root) {
            this.root = newNode;
            return;
        }
        this.insertNode(this.root, newNode);
    }

    insertNode(node, newNode) {
        if (newNode.value < node.value) {
            if (!node.left) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (!node.right) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }
}


function createFingerprint(text, k = 5) {
    const ngrams = new Set();
    for (let i = 0; i <= text.length - k; i++) {
        ngrams.add(text.slice(i, i + k));
    }
    return ngrams;
}

function calculateFingerprintSimilarity(set1, set2) {
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return (intersection.size / union.size) * 100;
}

function calculateSimilarity(doc1, doc2) {
    const words1 = doc1.replace(/[^\w\s]/gi, '').split(/\s+/);
    const words2 = doc2.replace(/[^\w\s]/gi, '').split(/\s+/);

    const uniqueWords1 = new Set(words1);
    const uniqueWords2 = new Set(words2);

    const commonWords = [...uniqueWords1].filter(word => uniqueWords2.has(word));
    const similarity = (commonWords.length / Math.max(uniqueWords1.size, uniqueWords2.size)) * 100;

    return similarity.toFixed(2);
}


async function calculateEnhancedSimilarity(doc1, doc2) {

    const basicSimilarity = calculateSimilarity(doc1, doc2);
    const fingerprint1 = createFingerprint(doc1);
    const fingerprint2 = createFingerprint(doc2);
    const fingerprintSimilarity = calculateFingerprintSimilarity(fingerprint1, fingerprint2);

    const btree = new BTree(3);
    const patterns = findFrequentPatterns(doc1, doc2);
    patterns.forEach(pattern => btree.insert(pattern));

    const weightedSimilarity = (
        basicSimilarity * 0.25 +
        fingerprintSimilarity * 0.75
    ).toFixed(2);

    return {
        total: weightedSimilarity,
        basic: basicSimilarity,
        fingerprint: fingerprintSimilarity,
        patterns: patterns.length
    };
}

function findFrequentPatterns(text1, text2, minLength = 3) {
    const patterns = new Set();
    for (let i = 0; i < text1.length - minLength; i++) {
        for (let len = minLength; len <= Math.min(10, text1.length - i); len++) {
            const pattern = text1.substr(i, len);
            if (text2.includes(pattern)) {
                patterns.add(pattern);
            }
        }
    }
    return Array.from(patterns);
}





window.selectedFiles = [];

function formatDate(date) {
    return date.toLocaleString();
}

function formatFileSize(size) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    let i = 0;
    while (size >= 1024 && i < sizes.length - 1) {
        size /= 1024;
        i++;
    }
    return `${size.toFixed(2)} ${sizes[i]}`;
}

function generateUniqueId() {
    return 'file-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

function addDocuments() {
    const files = document.getElementById("files").files;

    if (files.length === 0) {
        alert("No files selected.");
        return;
    }

    const table = document.getElementById("documentTable").getElementsByTagName('tbody')[0];

    for (let file of files) {
        const fileId = generateUniqueId();
        const uploadTime = new Date();

        const row = table.insertRow();
        row.setAttribute('data-file-id', fileId);

        const nameCell = row.insertCell(0);
        nameCell.innerHTML = file.name;

        const timeCell = row.insertCell(1);
        timeCell.innerHTML = formatDate(uploadTime);

        const sizeCell = row.insertCell(2);
        sizeCell.innerHTML = formatFileSize(file.size);

        const actionsCell = row.insertCell(3);
        const removeButton = document.createElement("button");
        removeButton.innerHTML = "Supprimer";
        removeButton.onclick = () => removeDocument(fileId);
        actionsCell.appendChild(removeButton);

        window.selectedFiles.push({
            id: fileId,
            name: file.name,
            file: file,
            uploadTime: uploadTime,
            size: formatFileSize(file.size)
        });
    }

    document.getElementById("compareBtn").style.display = "block";
}

function removeDocument(fileId) {
    const row = document.querySelector(`tr[data-file-id="${fileId}"]`);
    if (row) {
        row.parentNode.removeChild(row);
    }
    window.selectedFiles = window.selectedFiles.filter(item => item.id !== fileId);
    if (window.selectedFiles.length < 2) {
        document.getElementById("compareBtn").style.display = "none";
    }
}

async function readFile(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension === 'txt') {
        return await readTxt(file);
    } else if (extension === 'docx') {
        return await readDocx(file);
    } else if (extension === 'pdf') {
        return await readPdf(file);
    } else {
        throw new Error('Fichier non supporté. veuillez uploader les fichiers .pdf, .txt, ou .docx.');
    }
}


async function readTxt(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

async function readDocx(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const result = await mammoth.extractRawText({ arrayBuffer: reader.result });
                resolve(result.value);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

async function readPdf(file) {
    const pdfData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(new Uint8Array(reader.result));
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });

    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ');
    }
    return text;
}


async function compareDocuments() {
    const fileContents = window.selectedFiles;

    if (fileContents.length < 1) {
        document.getElementById("results").innerHTML = "Veuillez uploader au moins un document.";
        return;
    }

    document.getElementById("results").innerHTML = "<div class='progress-bar'><div class='progress' style='width: 0%'></div></div><p>Analyse des documents...</p>";

    const fileTextContents = [];
    for (let file of fileContents) {
        try {
            const content = await readFile(file.file);
            fileTextContents.push({
                id: file.id,
                name: file.name,
                content: content.toLowerCase().trim(),
                uploadTime: file.uploadTime
            });
        } catch (error) {
            document.getElementById("results").innerHTML = `Erreur de lecture du fichier ${file.name}: ${error.message}`;
            return;
        }
    }

    let resultsHTML = `
        <table border="1" cellspacing="0" cellpadding="5">
            <tr>
                <th>Document 1</th>
                <th>Document 2</th>
                <th>Pourcentage total de similarité (%)</th>
                <th>Details</th>
            </tr>`;

    let totalComparisons;
    let completedComparisons = 0;

    if (fileTextContents.length === 1) {

        const singleFile = fileTextContents[0];
        const similarity = await calculateEnhancedSimilarity(
            singleFile.content,
            singleFile.content
        );

        resultsHTML += `
            <tr class="similarity-high">
                <td>${singleFile.name}<br>
                    <span class="file-info">(Uploadé: ${formatDate(singleFile.uploadTime)})</span>
                </td>
                <td>${singleFile.name}<br>
                    <span class="file-info">(Uploadé: ${formatDate(singleFile.uploadTime)})</span>
                </td>
                <td>${similarity.total}%</td>
                <td>
                    <div class="analysis-method">
                        <strong>Similarité Basique:</strong> ${similarity.basic}%<br>
                        <strong> Similarité Gloutonne:</strong> ${similarity.fingerprint}%<br>
                        <strong>Patterns Communs:</strong> ${similarity.patterns}
                    </div>
                </td>
            </tr>`;
    } else {

        totalComparisons = (fileTextContents.length * (fileTextContents.length - 1)) / 2;

        for (let i = 0; i < fileTextContents.length; i++) {
            for (let j = i + 1; j < fileTextContents.length; j++) {
                const similarity = await calculateEnhancedSimilarity(
                    fileTextContents[i].content,
                    fileTextContents[j].content
                );

                const similarityClass = similarity.total > 80 ? 'similarity-high' :
                    similarity.total > 50 ? 'similarity-medium' : '';

                resultsHTML += `
                    <tr class="${similarityClass}">
                        <td>${fileTextContents[i].name}<br>
                            <span class="file-info">(Uploadé: ${formatDate(fileTextContents[i].uploadTime)})</span>
                        </td>
                        <td>${fileTextContents[j].name}<br>
                            <span class="file-info">(Uploadé: ${formatDate(fileTextContents[j].uploadTime)})</span>
                        </td>
                        <td>${similarity.total}%</td>
                        <td>
                           <div class="analysis-method">
                        <strong>Similarité Basique:</strong> ${similarity.basic}%<br>
                        <strong> Similarité Gloutonne:</strong> ${similarity.fingerprint}%<br>
                        <strong>Patterns Communs:</strong> ${similarity.patterns}
                    </div>
                        </td>
                    </tr>`;

                completedComparisons++;
                const progress = (completedComparisons / totalComparisons) * 100;
                document.querySelector('.progress').style.width = `${progress}%`;
            }
        }
    }

    resultsHTML += "</table>";
    document.getElementById("results").innerHTML = resultsHTML;
}
