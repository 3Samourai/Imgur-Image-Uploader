(function() {
    // State
    let state = {
        file: null,
        success: false,
        error: null,
        dragging: false,
        successData: null,
        uploading: false,
        copied: false,
        srcFile: null
    };

    // DOM Elements
    const uploadContainer = document.getElementById('upload-container');
    const dropZone = document.getElementById('drop-zone');
    const noFile = document.getElementById('no-file');
    const fileSelected = document.getElementById('file-selected');
    const previewImg = document.getElementById('preview-img');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const removeBtn = document.getElementById('remove-btn');
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('file-input');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const successMessage = document.getElementById('success-message');
    const successLink = document.getElementById('success-link');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    const copyMp4Btn = document.getElementById('copy-mp4-btn');
    const copyGifvBtn = document.getElementById('copy-gifv-btn');
    const copiedBtn = document.getElementById('copied-btn');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');

    // File type validation
    const allowedTypes = /video|image/;

    // Format file size
    function formatFileSize(size) {
        const units = ['B', 'kB', 'MB', 'GB'];
        let value = size;
        let unitIndex = 0;
        while (Math.abs(value) >= 1000 && unitIndex < units.length - 1) {
            value /= 1000;
            unitIndex++;
        }
        return `${value.toFixed(1)} ${units[unitIndex]}`;
    }

    // Remove file and reset state
    function removeFile() {
        state.file = null;
        state.srcFile = null;
        state.uploading = false;
        state.error = null;
        state.success = false;
        state.successData = null;
        if (progressContainer && progressBar) {
            progressContainer.classList.add('hidden');
            progressBar.style.width = '0%';
        }
        updateUI();
    }

    // Generate image preview
    function setupReader(file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                state.srcFile = e.target.result;
                updateUI();
            };
            reader.readAsDataURL(file);
        }
    }

    // Handle file drop
    function addFile(event) {
        event.preventDefault();
        removeFile();
        const file = event.dataTransfer.files[0];
        if (file && allowedTypes.test(file.type.split('/')[0])) {
            state.file = file;
            setupReader(file);
        } else {
            state.error = `File type not supported: ${file ? file.type : 'unknown type'}. Please upload an image or video.`;
        }
        state.dragging = false;
        updateUI();
    }

    // Handle file input
    function addFileThroughInput(event) {
        removeFile();
        const file = event.target.files[0];
        if (file && allowedTypes.test(file.type.split('/')[0])) {
            state.file = file;
            setupReader(file);
        } else {
            state.error = `File type not supported: ${file ? file.type : 'unknown type'}. Please upload an image or video.`;
        }
        updateUI();
    }

    // Handle paste
    function addFileThroughPaste(event) {
        removeFile();
        const items = event.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith('image/')) {
                state.file = items[i].getAsFile();
                setupReader(state.file);
                break;
            }
        }
        updateUI();
    }

    // Upload file
    function upload() {
        if (!state.file) return;

        state.uploading = true;
        state.error = null;
        state.success = false;
        if (progressContainer) progressContainer.classList.remove('hidden');
        if (progressBar) progressBar.style.width = '0%';
        updateUI();

        const formData = new FormData();
        formData.append('image', state.file);

        const attemptUpload = (clientId) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://api.imgur.com/3/image', true);
            xhr.setRequestHeader('Authorization', `Client-ID ${clientId}`);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = (event.loaded / event.total) * 100;
                    if (progressBar) progressBar.style.width = percent + '%';
                }
            };

            xhr.onload = () => {
                state.uploading = false;
                if (xhr.status === 429 && clientId === 'ff96c0c9eb1788a') {
                    // Try the fallback Client ID
                    attemptUpload('ff96c0c9eb1788a'); // Corrected fallback ID
                    return;
                }

                if (xhr.status >= 200 && xhr.status < 300) {
                    const data = JSON.parse(xhr.responseText);
                    if (data.success) {
                        state.successData = data.data;
                        state.file = null;
                        state.success = true;
                        state.error = null;
                    } else {
                        state.success = false;
                        let errorMsg = "Unknown Imgur API error occurred.";
                        if (data.data && data.data.error) {
                            if (typeof data.data.error === 'string') {
                                errorMsg = data.data.error;
                            } else if (typeof data.data.error === 'object' && data.data.error.message) {
                                errorMsg = data.data.error.message;
                            }
                        } else if (data.data && data.data.errors) {
                            if (Array.isArray(data.data.errors)) {
                                errorMsg = data.data.errors.join(', ');
                            } else if (typeof data.data.errors === 'string') {
                                errorMsg = data.data.errors;
                            }
                        }
                        // Check for specific error messages from Imgur
                        if (errorMsg.includes("File type invalid")) {
                            errorMsg = "Invalid file type. Please upload a valid image or video.";
                        } else if (errorMsg.includes("size") || errorMsg.includes("File is over the size limit")) {
                             errorMsg = "File is too large. Maximum size is 10MB.";
                        } else if (errorMsg.includes("Authentication failed") || errorMsg.includes("auth") || errorMsg.includes("authorization")) {
                            errorMsg = "Authentication with Imgur failed. Please contact support. (Invalid Client-ID)";
                        } else if (errorMsg.includes("limit")) {
                            errorMsg = "Upload limit exceeded. Please try again later.";
                        }
                        state.error = "Imgur API Error: " + errorMsg;
                    }
                } else { // xhr.status is not 2xx
                    let errorDetail = xhr.statusText || 'Unknown server error';
                    try {
                        const data = JSON.parse(xhr.responseText);
                        if (data.data && data.data.error) {
                            if (typeof data.data.error === 'string') {
                                errorDetail = data.data.error;
                            } else if (typeof data.data.error === 'object' && data.data.error.message) {
                                errorDetail = data.data.error.message;
                            }
                        } else if (data.data && data.data.errors) {
                             if (Array.isArray(data.data.errors)) {
                                errorDetail = data.data.errors.join(', ');
                            } else if (typeof data.data.errors === 'string') {
                                errorDetail = data.data.errors;
                            }
                        }
                    } catch (e) {
                        // JSON parsing failed, keep the original errorDetail
                    }
                    state.error = `Upload failed: ${xhr.status} ${errorDetail}.`;
                }
                if (progressContainer) progressContainer.classList.add('hidden');
                updateUI();
            };

            xhr.onerror = () => {
                state.uploading = false;
                state.error = "Upload failed. Please check your network connection and try again.";
                if (progressContainer) progressContainer.classList.add('hidden');
                updateUI();
            };

            xhr.onabort = () => {
                state.uploading = false;
                state.error = 'Upload was aborted by the browser.';
                if (progressContainer) progressContainer.classList.add('hidden');
                updateUI();
            };
            
            xhr.send(formData);
        };

        attemptUpload('ff96c0c9eb1788a'); // Start with the primary Client ID
    }

    // Copy to clipboard
    function copySuccess(text) {
        navigator.clipboard.writeText(text).then(() => {
            state.copied = true;
            updateUI();
            setTimeout(() => {
                state.copied = false;
                updateUI();
            }, 2050);
        });
    }

    // Update UI based on state
    function updateUI() {
        // Drag state
        dropZone.classList.toggle('bg-indigo-900', state.dragging);

        // File selection state
        noFile.classList.toggle('hidden', state.file !== null);
        fileSelected.classList.toggle('hidden', state.file === null);

        if (state.file) {
            fileName.textContent = state.file.name;
            fileSize.textContent = `(${formatFileSize(state.file.size)})`;
            previewImg.src = state.srcFile || '';
            previewImg.classList.toggle('hidden', !state.srcFile);
            uploadBtn.textContent = state.uploading ? 'Uploading...' : 'Upload';
            uploadBtn.disabled = state.uploading;
        } else if (!state.success) { // Hide progress bar if file is removed or after finishing upload (unless successful)
             if (progressContainer) progressContainer.classList.add('hidden');
        }


        if (progressContainer && progressBar) {
            const showProgress = state.uploading && state.file;
            progressContainer.classList.toggle('hidden', !showProgress);
            if (!showProgress) {
                progressBar.style.width = '0%';
            }
        }
        
        // Error state
        errorMessage.classList.toggle('hidden', !state.error);
        errorText.textContent = state.error || '';

        // Success state
        successMessage.classList.toggle('hidden', !state.success);
        if (state.success && state.successData) {
            successLink.href = state.successData.link;
            successLink.textContent = state.successData.link;
            copyMp4Btn.classList.toggle('hidden', !state.successData.mp4);
            copyGifvBtn.classList.toggle('hidden', !state.successData.gifv);
            copyLinkBtn.classList.toggle('hidden', state.copied);
            copiedBtn.classList.toggle('hidden', !state.copied);
            if (progressContainer) progressContainer.classList.add('hidden'); // Hide progress on success
        }
    }

    // Event listeners
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        state.dragging = true;
        updateUI();
    });
    dropZone.addEventListener('dragleave', () => {
        state.dragging = false;
        updateUI();
    });
    dropZone.addEventListener('drop', addFile);
    fileInput.addEventListener('change', addFileThroughInput);
    uploadContainer.addEventListener('paste', addFileThroughPaste);
    removeBtn.addEventListener('click', removeFile);
    uploadBtn.addEventListener('click', upload);
    copyLinkBtn.addEventListener('click', () => copySuccess(state.successData.link));
    copyMp4Btn.addEventListener('click', () => copySuccess(state.successData.mp4));
    copyGifvBtn.addEventListener('click', () => copySuccess(state.successData.gifv));
})();
