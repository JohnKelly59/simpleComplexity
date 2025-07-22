// contentScripts/screenRecorder.js
import { state } from './mainState.js';
import { sendVideoRecording } from './api.js';

let cameraPreview = null;

function cleanupStreams ()
{
    const streams = [state.screenStream, state.userStream];
    streams.forEach(stream =>
    {
        if (stream)
        {
            stream.getTracks().forEach(track => track.stop());
        }
    });
    state.screenStream = null;
    state.userStream = null;

    if (cameraPreview)
    {
        cameraPreview.remove();
        cameraPreview = null;
    }
}

export async function startRecording ()
{
    cleanupStreams();
    state.recordedChunks = [];

    try
    {
        // Step 1: Get media streams.
        state.screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: { mediaSource: "screen" },
            audio: true
        });

        try
        {
            state.userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        } catch (userMediaError)
        {
            console.warn("Could not get camera/mic permissions.", userMediaError);
            // Recording will proceed without camera/mic if permissions are denied.
        }

        // Step 2: Consolidate all desired tracks into a single array, preventing duplicates.
        const tracks = [];

        // Add screen video track.
        const screenVideoTrack = state.screenStream.getVideoTracks()[0];
        if (screenVideoTrack)
        {
            tracks.push(screenVideoTrack);
            // Handle the user stopping the recording via the browser's native UI.
            screenVideoTrack.onended = () =>
            {
                const eraseButton = document.getElementById('eraseBtn');
                if (eraseButton) eraseButton.click();
            };
        }

        // Add screen audio track (system audio).
        const screenAudioTrack = state.screenStream.getAudioTracks()[0];
        if (screenAudioTrack)
        {
            tracks.push(screenAudioTrack);
        }

        // Add user video track (camera) if it exists.
        const userVideoTrack = state.userStream?.getVideoTracks()[0];
        if (userVideoTrack)
        {
            userVideoTrack.enabled = state.isCameraEnabled; // Set initial enabled state.
            tracks.push(userVideoTrack);
        }

        // Add user audio track (microphone) if it exists.
        const userAudioTrack = state.userStream?.getAudioTracks()[0];
        if (userAudioTrack)
        {
            userAudioTrack.enabled = state.isMicEnabled; // Set initial enabled state.
            tracks.push(userAudioTrack);
        }

        // Step 3: Create camera preview if the camera is available.
        if (userVideoTrack)
        {
            cameraPreview = document.createElement('video');
            cameraPreview.srcObject = new MediaStream([userVideoTrack]); // Stream with only the camera track
            cameraPreview.autoplay = true;
            cameraPreview.muted = true;
            Object.assign(cameraPreview.style, {
                position: 'fixed', bottom: '20px', left: '20px', width: '200px',
                height: '150px', borderRadius: '8px', border: '2px solid #fff',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)', zIndex: 2147483647, objectFit: 'cover',
                display: state.isCameraEnabled ? 'block' : 'none' // Visibility based on initial state
            });
            document.body.appendChild(cameraPreview);
        }

        // Step 4: Initialize MediaRecorder with the clean, combined stream.
        const combinedStream = new MediaStream(tracks);
        state.mediaRecorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });

        state.mediaRecorder.ondataavailable = event =>
        {
            if (event.data.size > 0) state.recordedChunks.push(event.data);
        };

        state.mediaRecorder.onstop = () =>
        {
            if (state.recordedChunks.length > 0)
            {
                const videoBlob = new Blob(state.recordedChunks, { type: 'video/webm' });
                sendVideoRecording(videoBlob)
                    .then(response => console.log("Video upload successful:", response))
                    .catch(err => console.error("Video upload failed:", err));
            } else
            {
                console.log("Recording stopped with no data, likely due to an issue with the media stream.");
            }
            cleanupStreams();
            state.isRecording = false;
        };

        state.mediaRecorder.start();
        state.isRecording = true;
        state.isPaused = false;
        state.recordingStartTime = Date.now();

    } catch (err)
    {
        console.error("Error starting screen recording:", err);
        cleanupStreams();
        // Propagate the error to the UI handler in speedDial.js
        throw err;
    }
}

export function stopRecording ()
{
    if (state.mediaRecorder && state.mediaRecorder.state !== "inactive")
    {
        state.mediaRecorder.stop();
    } else
    {
        cleanupStreams();
    }
    state.isRecording = false;
    state.isPaused = false;
}

export function pauseRecording ()
{
    if (state.mediaRecorder?.state === "recording")
    {
        state.mediaRecorder.pause();
        state.isPaused = true;
    }
}

export function resumeRecording ()
{
    if (state.mediaRecorder?.state === "paused")
    {
        state.mediaRecorder.resume();
        state.isPaused = false;
    }
}

export function resetRecording ()
{
    if (state.mediaRecorder && state.mediaRecorder.state !== "inactive")
    {
        state.recordedChunks = []; // Clear chunks to prevent upload on stop
        state.mediaRecorder.stop();
    } else
    {
        cleanupStreams();
    }
    state.isRecording = false;
    state.isPaused = false;
    state.recordingStartTime = null;
    state.mediaRecorder = null;
}

export function getCameraPreview ()
{
    return cameraPreview;
}