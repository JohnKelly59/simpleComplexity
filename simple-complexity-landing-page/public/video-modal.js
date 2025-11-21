// video-modal.js

const VIDEO_UPLOAD_ENDPOINT = `http://localhost:8000/api/video-upload`;

/**
 * (Internal) Sends the video recording and metadata to the server.
 */
function sendVideoRecording (videoBlob, filename, email, description, fetchWithAuth)
{
    if (!videoBlob || videoBlob.size === 0) return Promise.reject(new Error("Cannot send empty video file."));
    if (!email || !description) return Promise.reject(new Error("Email and description are required."));

    const formData = new FormData();
    formData.append('video', videoBlob, filename);
    formData.append('email', email);
    formData.append('description', description);

    return fetchWithAuth(VIDEO_UPLOAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
    }).then(async resp =>
    {
        if (!resp.ok) throw new Error(`API error ${resp.status}: ${await resp.text()}`);
        return resp.json();
    }).catch(err =>
    {
        console.error('Video upload failed:', err);
        throw err;
    });
}


/**
 * Creates and displays a modal for submitting a video recording.
 * @param {Blob} videoBlob - The recorded video data.
 * @param {string} filename - The default filename for the video.
 * @param {object} helpers - An object containing helper functions { fetchWithAuth, resetRecording }.
 * @returns {object} An object with `host`, `show`, and `hide` methods for the modal.
 */
export function createVideoSubmissionModal (videoBlob, filename, helpers)
{
    if (document.getElementById('sf-video-submission-modal-host')) return;

    const modalHost = document.createElement('div');
    modalHost.id = 'sf-video-submission-modal-host';
    document.body.appendChild(modalHost);

    const shadow = modalHost.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
        <style>
            #sf-video-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background-color: rgba(0, 0, 0, 0.6); z-index: 2147483647;
                display: flex; align-items: center; justify-content: center;
                opacity: 0; transition: opacity 0.3s ease;
            }
            #sf-video-modal-content {
                background: #fff; padding: 24px; border-radius: 12px; width: 90%; max-width: 400px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3); font-family: system-ui, sans-serif;
                transform: scale(0.95); transition: transform 0.3s ease; color: #333;
            }
            h3 { margin-top: 0; margin-bottom: 12px; font-size: 18px; }
            p { margin-top: 0; margin-bottom: 16px; font-size: 14px; color: #555; line-height: 1.5; }
            .sf-form-group { margin-bottom: 16px; }
            label { display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; color: #444; }
            input, textarea { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; box-sizing: border-box; }
            textarea { resize: vertical; min-height: 80px; }
            #sf-video-modal-buttons { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
            .sf-modal-btn { padding: 10px 18px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s; }
            #sf-send-video-btn { background-color: #116530; color: #fff; }
            #sf-send-video-btn:hover { filter: brightness(1.1); }
            #sf-send-video-btn:disabled { background-color: #ccc; cursor: not-allowed; }
            #sf-cancel-video-btn { background-color: #e2e8f0; color: #4a5568; }
            #sf-cancel-video-btn:hover { background-color: #cbd5e0; }
        </style>
        <div id="sf-video-modal-overlay">
            <div id="sf-video-modal-content">
                <h3>Submit Your Recording</h3>
                <p>Please provide your contact information and a brief description of the issue.</p>
                <form id="sf-video-submission-form">
                    <div class="sf-form-group">
                        <label for="sf-video-name">Full Name</label>
                        <input type="text" id="sf-video-name" required placeholder="John Doe">
                    </div>
                    <div class="sf-form-group">
                        <label for="sf-video-email">Email Address</label>
                        <input type="email" id="sf-video-email" required placeholder="you@example.com">
                    </div>
                    <div class="sf-form-group">
                        <label for="sf-video-description">Description</label>
                        <textarea id="sf-video-description" required placeholder="Describe the issue..."></textarea>
                    </div>
                    <div id="sf-video-modal-buttons">
                        <button type="button" id="sf-cancel-video-btn" class="sf-modal-btn">Cancel</button>
                        <button type="submit" id="sf-send-video-btn" class="sf-modal-btn">Send</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    const overlay = shadow.getElementById('sf-video-modal-overlay');
    const content = shadow.getElementById('sf-video-modal-content');
    const form = shadow.getElementById('sf-video-submission-form');
    const sendBtn = shadow.getElementById('sf-send-video-btn');
    const cancelBtn = shadow.getElementById('sf-cancel-video-btn');

    const showModal = () =>
    {
        requestAnimationFrame(() =>
        {
            overlay.style.opacity = '1';
            content.style.transform = 'scale(1)';
        });
    };

    const hideModal = () =>
    {
        overlay.style.opacity = '0';
        content.style.transform = 'scale(0.95)';
        setTimeout(() => modalHost.remove(), 300);
    };

    form.onsubmit = (e) =>
    {
        e.preventDefault();
        const name = shadow.getElementById('sf-video-name').value.trim();
        const email = shadow.getElementById('sf-video-email').value.trim();
        const description = shadow.getElementById('sf-video-description').value.trim();

        if (!name || !email || !description) return;

        sendBtn.disabled = true;
        sendBtn.textContent = 'Sending...';
        const formattedEmail = `${name} (${email})`;

        sendVideoRecording(videoBlob, filename, formattedEmail, description, helpers.fetchWithAuth)
            .then(() =>
            {
                alert('Your recording has been sent successfully!');
                hideModal();
            })
            .catch(err =>
            {
                console.error('Failed to send video:', err);
                alert('There was an error sending your recording. Please try again.');
                sendBtn.disabled = false;
                sendBtn.textContent = 'Send';
            });
    };

    cancelBtn.onclick = () =>
    {
        helpers.resetRecording();
        hideModal();
    };

    showModal();
}