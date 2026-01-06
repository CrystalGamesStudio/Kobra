import { useState, useRef, useCallback } from 'react';

type OnStopCallback = (blob: Blob, duration: number) => void;

export const useRecorder = (onStop: OnStopCallback) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const recordingStartRef = useRef<number>(0);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        if(streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsRecording(false);
    }, []);

    const startRecording = useCallback(async () => {
        try {
            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: { frameRate: { ideal: 30 }, cursor: 'always' } as any,
                audio: true
            });

            // Ensure we have an audio track from the screen share if possible
            const hasScreenAudio = displayStream.getAudioTracks().length > 0;
            const audioConstraints = hasScreenAudio ? false : { echoCancellation: true, noiseSuppression: true };
            
            const userAudioStream = audioConstraints ? await navigator.mediaDevices.getUserMedia({ audio: audioConstraints }) : new MediaStream();

            const combinedStream = new MediaStream([
                ...displayStream.getVideoTracks(),
                ...(hasScreenAudio ? displayStream.getAudioTracks() : []),
                ...userAudioStream.getAudioTracks()
            ]);
            
            streamRef.current = combinedStream;
            
            const recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });
            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const duration = (Date.now() - recordingStartRef.current) / 1000;
                const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                onStop(blob, duration);
                recordedChunksRef.current = [];
            };
            
            // Listen for the user stopping screen sharing via the browser UI
            displayStream.getVideoTracks()[0].onended = () => {
                stopRecording();
            };

            recordedChunksRef.current = [];
            recorder.start();
            recordingStartRef.current = Date.now();
            setIsRecording(true);

        } catch (error) {
            console.error('Error starting recording:', error);
            setIsRecording(false);
            if (error instanceof DOMException && error.name === 'NotAllowedError') {
              alert("Screen recording permission was denied. Please allow it to record your stream.");
            } else {
              alert("Could not start screen recording. Please check your browser permissions.");
            }
        }
    }, [onStop, stopRecording]);

    return { isRecording, startRecording, stopRecording };
};