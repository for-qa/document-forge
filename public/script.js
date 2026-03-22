const form = document.getElementById('generate-form');
const typeSelect = document.getElementById('typeSelect');
const viewportSettings = document.getElementById('viewportSettings');
const submitBtn = document.getElementById('submitBtn');
const statusMsg = document.getElementById('statusMsg');

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

    const payload = {
        url: document.getElementById('urlInput').value,
        type: typeSelect.value,
        darkMode: document.getElementById('darkModeToggle').checked,
        width: document.getElementById('widthInput').value,
        height: document.getElementById('heightInput').value
    };

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
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
        let filename = payload.type === 'pdf' ? 'document.pdf' : 'capture.png';
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
