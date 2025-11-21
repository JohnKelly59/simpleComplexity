// src/services/recordingService.js

let mediaRecorder = null;
let screenStream = null;
let userStream = null;
let cameraPreviewElement = null;
let recordedChunks = [];
let onStopCallback = null;

const getSupportedMimeType = () =>
{
    const types = ["video/mp4", "video/webm; codecs=vp9", "video/webm"];
    for (const type of types)
    {
        if (MediaRecorder.isTypeSupported(type))
        {
            return { mimeType: type, extension: type.includes("mp4") ? "mp4" : "webm" };
        }
    }
    return { mimeType: "video/webm", extension: "webm" };
};

const cleanupStreams = () =>
{
    [screenStream, userStream].forEach((stream) =>
    {
        stream?.getTracks().forEach((track) => track.stop());
    });
    screenStream = null;
    userStream = null;
    if (cameraPreviewElement)
    {
        cameraPreviewElement.remove();
        cameraPreviewElement = null;
    }
};

const createCameraPreview = () =>
{
    if (cameraPreviewElement) cameraPreviewElement.remove();
    if (!userStream?.getVideoTracks().length > 0) return;

    cameraPreviewElement = document.createElement('video');
    cameraPreviewElement.srcObject = new MediaStream(userStream.getVideoTracks());
    cameraPreviewElement.autoplay = true;
    cameraPreviewElement.muted = true;
    Object.assign(cameraPreviewElement.style, {
        position: 'fixed', bottom: '20px', left: '20px', width: '200px', height: '150px',
        borderRadius: '8px', border: '2px solid white', zIndex: 2147483647, objectFit: 'cover'
    });
    document.body.appendChild(cameraPreviewElement);
};

export const startRecording = async ({ isCameraEnabled, isMicEnabled, onStop }) =>
{
    if (mediaRecorder?.state === "recording") return;
    recordedChunks = [];
    cleanupStreams();
    onStopCallback = onStop;

    try
    {
        screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });

        try
        {
            userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            // Set initial state based on user's choice
            userStream.getVideoTracks().forEach(track => track.enabled = isCameraEnabled);
            userStream.getAudioTracks().forEach(track => track.enabled = isMicEnabled);
        } catch (err)
        {
            console.warn("Could not get user camera/mic.", err);
            // If the user denies permission, we can continue with just screen recording.
            userStream = null;
        }

        const tracks = [...screenStream.getTracks()];
        if (userStream)
        {
            tracks.push(...userStream.getTracks());
        }

        screenStream.getVideoTracks()[0].onended = () => stopRecording();

        const { mimeType } = getSupportedMimeType();
        mediaRecorder = new MediaRecorder(new MediaStream(tracks), { mimeType });

        if (isCameraEnabled && userStream?.getVideoTracks().length > 0) createCameraPreview();

        mediaRecorder.ondataavailable = (event) =>
        {
            if (event.data.size > 0) recordedChunks.push(event.data);
        };

        mediaRecorder.onstop = () =>
        {
            const { mimeType } = getSupportedMimeType();
            const blob = new Blob(recordedChunks, { type: mimeType });
            if (onStopCallback) onStopCallback(blob);
            cleanupStreams();
            mediaRecorder = null;
        };

        mediaRecorder.start();
        return true;
    } catch (err)
    {
        console.error("Failed to start recording:", err);
        cleanupStreams();
        if (err.name === 'NotAllowedError')
        {
            alert("Screen sharing permission is required to start recording.");
        }
        return false;
    }
};

export const stopRecording = () =>
{
    if (mediaRecorder?.state !== "inactive")
    {
        mediaRecorder.stop();
    }
};

// --- New and improved toggle functions ---

export const toggleCamera = async (enabled) =>
{
    if (!userStream?.getVideoTracks().length > 0)
    {
        console.warn("No camera track to toggle.");
        return false; // No camera track available
    }

    userStream.getVideoTracks().forEach((t) => (t.enabled = enabled));

    if (enabled)
    {
        createCameraPreview();
        if (cameraPreviewElement) cameraPreviewElement.style.display = 'block';
    } else
    {
        if (cameraPreviewElement) cameraPreviewElement.style.display = 'none';
    }

    return true;
};

export const toggleMic = async (enabled) =>
{
    if (!userStream?.getAudioTracks().length > 0)
    {
        console.warn("No mic track to toggle.");
        return false; // No mic track available
    }

    userStream.getAudioTracks().forEach((t) => (t.enabled = enabled));
    return true;
};