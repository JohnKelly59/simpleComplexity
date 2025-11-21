// recording.js

let state;
let helpers;
let ui; // To hold references to the UI buttons and timer
let cameraPreview = null;
let recordingTimerInterval = null;

function getSupportedMimeType ()
{
    const videoTypes = ["video/mp4; codecs=avc1", "video/webm; codecs=vp9", "video/webm"];
    for (const videoType of videoTypes)
    {
        if (MediaRecorder.isTypeSupported(videoType))
        {
            const extension = videoType.includes("mp4") ? "mp4" : "webm";
            return { mimeType: videoType, extension };
        }
    }
    return { mimeType: "video/webm", extension: "webm" };
}

function cleanupStreams ()
{
    [state.screenStream, state.userStream].forEach(stream =>
    {
        stream?.getTracks().forEach(track => track.stop());
    });
    state.screenStream = null;
    state.userStream = null;
    if (cameraPreview)
    {
        cameraPreview.remove();
        cameraPreview = null;
    }
}

function updateTimerDisplay ()
{
    if (!state.isRecording || !ui.timerDisplay) return;
    const elapsed = Date.now() - state.recordingStartTime;
    const seconds = Math.floor((elapsed / 1000) % 60).toString().padStart(2, '0');
    const minutes = Math.floor(elapsed / 60000).toString().padStart(2, '0');
    ui.timerDisplay.textContent = `${minutes}:${seconds}`;
}

function updateRecordingButtonsVisibility ()
{
    if (!ui) return;
    const isRecActive = state.isRecording || state.isPaused;
    const hideToggles = state.isRecording || state.recordedChunks.length > 0;

    ui.cameraButton.style.display = hideToggles ? "none" : "flex";
    ui.micButton.style.display = hideToggles ? "none" : "flex";
    ui.playPauseButton.style.display = "flex";
    ui.sendButton.style.display = state.isPaused ? "flex" : "none";
    ui.eraseButton.style.display = isRecActive ? "flex" : "none";
    ui.timerDisplay.style.display = isRecActive ? "block" : "none";
}

export function resetRecordingUI ()
{
    if (recordingTimerInterval) clearInterval(recordingTimerInterval);
    recordingTimerInterval = null;
    if (ui)
    {
        ui.playPauseButton.innerHTML = ui.svgs.play;
        ui.playPauseButton.setAttribute('title', 'Start Recording');
        if (ui.updateCameraAppearance) ui.updateCameraAppearance();
        if (ui.updateMicAppearance) ui.updateMicAppearance();
    }
    updateRecordingButtonsVisibility();
}

/**
 * Initializes the recording module.
 * @param {object} sdkState - The main state object from the SDK.
 * @param {object} sdkHelpers - An object containing helper functions from the SDK.
 * @param {object} uiRefs - An object with references to UI elements.
 */
export function initRecording (sdkState, sdkHelpers, uiRefs)
{
    state = sdkState;
    helpers = sdkHelpers;
    ui = uiRefs;
}

export async function startRecording ()
{
    if (state.isRecording) return;
    state.recordedChunks = [];
    cleanupStreams();

    try
    {
        state.screenStream = await navigator.mediaDevices.getDisplayMedia({ video: { mediaSource: "screen" }, audio: true });
        try
        {
            state.userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        } catch (userMediaError)
        {
            console.warn("Could not get camera/mic permissions.", userMediaError);
        }

        const tracks = [...state.screenStream.getTracks(), ...(state.userStream?.getTracks() || [])];
        state.screenStream.getVideoTracks()[0].onended = () =>
        {
            if (ui.eraseButton) ui.eraseButton.click();
        };

        const { mimeType, extension } = getSupportedMimeType();
        state.mediaRecorder = new MediaRecorder(new MediaStream(tracks), { mimeType });

        const userVideoTrack = state.userStream?.getVideoTracks()[0];
        if (userVideoTrack) userVideoTrack.enabled = state.isCameraEnabled;
        const userAudioTrack = state.userStream?.getAudioTracks()[0];
        if (userAudioTrack) userAudioTrack.enabled = state.isMicEnabled;

        if (userVideoTrack)
        {
            cameraPreview = document.createElement('video');
            cameraPreview.srcObject = new MediaStream([userVideoTrack]);
            cameraPreview.autoplay = true;
            cameraPreview.muted = true;
            Object.assign(cameraPreview.style, {
                position: 'fixed', bottom: '20px', left: '20px', width: '200px',
                height: '150px', borderRadius: '8px', border: '2px solid #fff',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)', zIndex: 2147483647, objectFit: 'cover',
                display: state.isCameraEnabled ? 'block' : 'none'
            });
            document.body.appendChild(cameraPreview);
        }

        state.mediaRecorder.ondataavailable = event => { if (event.data.size > 0) state.recordedChunks.push(event.data); };
        state.mediaRecorder.onstop = () =>
        {
            if (state.recordedChunks.length > 0)
            {
                const { mimeType, extension } = getSupportedMimeType();
                helpers.createVideoSubmissionModal(new Blob(state.recordedChunks, { type: mimeType }), `recording.${extension}`);
            }
            cleanupStreams();
            state.isRecording = false;
        };

        state.mediaRecorder.start();
        state.isRecording = true;
        state.isPaused = false;
        state.recordingStartTime = Date.now();

        ui.playPauseButton.innerHTML = ui.svgs.pause;
        ui.playPauseButton.setAttribute('title', 'Pause Recording');
        if (recordingTimerInterval) clearInterval(recordingTimerInterval);
        recordingTimerInterval = setInterval(updateTimerDisplay, 1000);
        updateRecordingButtonsVisibility();

    } catch (err)
    {
        console.error("Failed to start recording:", err);
        cleanupStreams();
        throw err;
    }
}

export function stopRecording ()
{
    if (state.mediaRecorder?.state !== "inactive")
    {
        state.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        state.mediaRecorder.stop();
    } else
    {
        cleanupStreams();
    }
    state.isRecording = false;
    state.isPaused = false;
    resetRecordingUI();
}

export function pauseRecording ()
{
    if (state.mediaRecorder?.state === "recording")
    {
        state.mediaRecorder.pause();
        state.isPaused = true;
        ui.playPauseButton.innerHTML = ui.svgs.play;
        ui.playPauseButton.setAttribute('title', 'Resume Recording');
        if (recordingTimerInterval) clearInterval(recordingTimerInterval);
        updateRecordingButtonsVisibility();
    }
}

export function resumeRecording ()
{
    if (state.mediaRecorder?.state === "paused")
    {
        state.mediaRecorder.resume();
        state.isPaused = false;
        ui.playPauseButton.innerHTML = ui.svgs.pause;
        ui.playPauseButton.setAttribute('title', 'Pause Recording');
        if (recordingTimerInterval) clearInterval(recordingTimerInterval);
        recordingTimerInterval = setInterval(updateTimerDisplay, 1000);
        updateRecordingButtonsVisibility();
    }
}

export function resetRecording ()
{
    // Check if mediaRecorder exists and is active before trying to access its properties
    if (state.mediaRecorder && state.mediaRecorder.state !== "inactive")
    {
        state.recordedChunks = [];
        state.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        state.mediaRecorder.stop();
    }
    cleanupStreams();
    state.isRecording = false;
    state.isPaused = false;
    state.recordingStartTime = null;
    state.mediaRecorder = null; // Ensure it's null after reset
    resetRecordingUI();
}

export function getCameraPreview ()
{
    return cameraPreview;
}