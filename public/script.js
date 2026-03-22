const form = document.getElementById('generate-form');
const typeSelect = document.getElementById('typeSelect');
const viewportSettings = document.getElementById('viewportSettings');
const submitBtn = document.getElementById('submitBtn');
const statusMsg = document.getElementById('statusMsg');
const sourceRadios = document.getElementsByName('sourceType');
const urlInputContainer = document.getElementById('urlInputContainer');
const fileInputContainer = document.getElementById('fileInputContainer');
const fileUpload = document.getElementById('fileUpload');
const fileNameDisplay = document.getElementById('fileNameDisplay');

// Update filename display dynamically when a local file is chosen
fileUpload.addEventListener('change', function() {
    if (this.files && this.files.length > 0) {
        fileNameDisplay.textContent = this.files[0].name;
        fileNameDisplay.style.color = 'var(--text-main)';
    } else {
        fileNameDisplay.textContent = 'No file chosen';
        fileNameDisplay.style.color = 'var(--text-muted)';
    }
});

// Toggle visually between URL string input or File upload
sourceRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'url') {
            urlInputContainer.style.display = 'flex';
            fileInputContainer.style.display = 'none';
        } else {
            urlInputContainer.style.display = 'none';
            fileInputContainer.style.display = 'flex';
        }
    });
});

// Show/Hide viewport settings based on type
typeSelect.addEventListener('change', (e) => {
    if(e.target.value === 'image') {
        viewportSettings.style.display = 'block';
    } else {
        viewportSettings.style.display = 'none';
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Reset status
    statusMsg.textContent = '';
    statusMsg.className = 'status-msg';
    
    // UI Loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const sourceType = document.querySelector('input[name="sourceType"]:checked').value;
    const urlInput = document.getElementById('urlInput').value;
    const fileUpload = document.getElementById('fileUpload').files[0];
    const type = typeSelect.value;
    const darkMode = document.getElementById('darkModeToggle').checked;
    const width = document.getElementById('widthInput').value;
    const height = document.getElementById('heightInput').value;

    if (sourceType === 'url' && !urlInput) {
        statusMsg.textContent = 'Please enter a valid URL.';
        statusMsg.classList.add('status-msg', 'error', 'show');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        return;
    }

    if (sourceType === 'file' && !fileUpload) {
        statusMsg.textContent = 'Please upload an HTML file.';
        statusMsg.classList.add('status-msg', 'error', 'show');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        return;
    }

    // Convert everything to a multipart FormData object to support strict file payloads
    const formData = new FormData();
    formData.append('type', type);
    formData.append('darkMode', darkMode);
    formData.append('width', width);
    formData.append('height', height);

    if (sourceType === 'url') {
        formData.append('url', urlInput);
    } else {
        formData.append('htmlFile', fileUpload);
    }

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate file');
        }

        // Handle File Download Trigger
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        const disposition = response.headers.get('content-disposition');
        let filename = type === 'pdf' ? 'document.pdf' : 'capture.png';
        if (disposition && disposition.indexOf('filename=') !== -1) {
            const matches = /filename="([^"]+)"/.exec(disposition);
            if (matches != null && matches[1]) { 
                filename = matches[1];
            }
        }

        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        a.remove();

        statusMsg.textContent = 'Success! Document generated and downloaded.';
        statusMsg.classList.add('status-msg', 'success', 'show');
    } catch (error) {
        statusMsg.textContent = error.message;
        statusMsg.classList.add('status-msg', 'error', 'show');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});
