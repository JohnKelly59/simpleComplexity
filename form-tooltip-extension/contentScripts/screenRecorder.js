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
    // Only clear chunks for a completely new recording session
    if (!state.isRecording)
    {
        state.recordedChunks = [];
    }
    cleanupStreams();

    try
    {
        state.screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: { mediaSource: "screen" },
            audio: true
        });

        try
        {
            state.userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        } catch (userMediaError)
        {
            // Camera/mic permissions not granted
        }

        const tracks = [];
        const screenVideoTrack = state.screenStream.getVideoTracks()[0];
        if (screenVideoTrack)
        {
            tracks.push(screenVideoTrack);
            screenVideoTrack.onended = () =>
            {
                const eraseButton = document.getElementById('eraseBtn');
                if (eraseButton) eraseButton.click();
            };
        }

        const screenAudioTrack = state.screenStream.getAudioTracks()[0];
        if (screenAudioTrack)
        {
            tracks.push(screenAudioTrack);
        }

        // Always add user media tracks to the initial stream
        const userVideoTrack = state.userStream?.getVideoTracks()[0];
        if (userVideoTrack)
        {
            tracks.push(userVideoTrack);
        }
        const userAudioTrack = state.userStream?.getAudioTracks()[0];
        if (userAudioTrack)
        {
            tracks.push(userAudioTrack);
        }

        const combinedStream = new MediaStream(tracks);
        state.mediaRecorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });

        // Set the initial enabled state based on the UI toggles
        if (userVideoTrack)
        {
            userVideoTrack.enabled = state.isCameraEnabled;
        }
        if (userAudioTrack)
        {
            userAudioTrack.enabled = state.isMicEnabled;
        }

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
                    .then(response => { })
                    .catch(err => { });
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
        cleanupStreams();
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
