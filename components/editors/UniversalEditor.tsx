import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

// --- ICONS ---

const CameraOnIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m22 8-6 4 6 4V8Z" />
        <rect x="2" y="6" width="14" height="12" rx="2" ry="2" />
    </svg>
);

const CameraOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2 2 20 20" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 13.5 22 10v8l-6.5-4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 14a4 4 0 0 1-4-4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V6a2 2 0 0 1 2-2h1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 6h2a2 2 0 0 1 2 2v2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18H6a2 2 0 0 1-2-2V9" />
    </svg>
);

const PlaceholderCameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[var(--text-color-light)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2 2 20 20" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 13.5 22 10v8l-6.5-4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 14a4 4 0 0 1-4-4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V6a2 2 0 0 1 2-2h1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 6h2a2 2 0 0 1 2 2v2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18H6a2 2 0 0 1-2-2V9" />
    </svg>
);

const ErrorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" x2="12" y1="9" y2="13" />
        <line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
);


interface UniversalEditorProps {
    onBack?: () => void;
}

const UniversalEditor: React.FC<UniversalEditorProps> = ({ onBack }) => {
    const { t } = useSettings();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);

    useEffect(() => {
        const stopCamera = () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                }
            }
        };

        const startCamera = async () => {
            stopCamera(); 

            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoInputs = devices.filter(device => device.kind === 'videoinput');
                setVideoDevices(videoInputs);

                if (videoInputs.length === 0) {
                    throw new DOMException(t.universal_editor_error_no_camera, 'NotFoundError');
                }

                const constraints: MediaStreamConstraints = {
                    video: {
                        deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined
                    }
                };

                const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
                
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
                
                const currentTrackDeviceId = mediaStream.getVideoTracks()[0].getSettings().deviceId;
                if (selectedDeviceId !== currentTrackDeviceId) {
                    setSelectedDeviceId(currentTrackDeviceId);
                }

                setError(null);
            } catch (err) {
                console.error("Error accessing camera:", err);
                let errorMessage = t.universal_editor_error_generic;
                if (err instanceof DOMException) {
                    if (err.name === 'NotFoundError') {
                        errorMessage = t.universal_editor_error_no_camera;
                    } else if (err.name === 'NotAllowedError') {
                        errorMessage = t.universal_editor_error_denied;
                    }
                }
                setError(errorMessage);
                setIsCameraOn(false);
                setVideoDevices([]);
            }
        };

        if (isCameraOn) {
            startCamera();
        } else {
            stopCamera();
            setVideoDevices([]);
        }

        return () => {
            stopCamera();
        };
    }, [isCameraOn, selectedDeviceId, t]); 

    const toggleCamera = () => {
        setIsCameraOn(prev => !prev);
    };

    const handleCameraChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDeviceId(event.target.value);
    };

    return (
        <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] h-full flex flex-col overflow-hidden text-[var(--text-color)] rounded-xl">
            <div className="flex-shrink-0 bg-[var(--bg-color)] border-b border-[var(--border-color)] p-4 flex items-center justify-between">
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path strokeLinecap="round" d="M6 4v4" />
                        <path strokeLinecap="round" d="M10 4v4" />
                    </svg>
                    <h3 className="font-bold text-sm">{t.universal_editor_title}</h3>
                </div>
                <div className="flex items-center space-x-3">
                    {isCameraOn && videoDevices.length > 1 && (
                         <select
                            value={selectedDeviceId}
                            onChange={handleCameraChange}
                            className="bg-[var(--input-bg)] border border-[var(--border-color)] text-sm rounded-md px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                            aria-label={t.universal_editor_select_camera_aria}
                         >
                            {videoDevices.map((device, index) => (
                                <option key={device.deviceId} value={device.deviceId} className="font-semibold text-black bg-white">
                                    {device.label || `${t.universal_editor_camera} ${index + 1}`}
                                </option>
                            ))}
                        </select>
                    )}
                    <button
                        onClick={toggleCamera}
                        aria-label={isCameraOn ? t.universal_editor_stop_camera : t.universal_editor_start_camera}
                        className={`active:scale-95 flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${isCameraOn ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-[var(--accent-color)] hover:bg-[var(--accent-color-hover)] text-white'}`}
                    >
                        {isCameraOn ? <CameraOffIcon /> : <CameraOnIcon />}
                        <span>{isCameraOn ? t.universal_editor_stop_camera : t.universal_editor_start_camera}</span>
                    </button>
                </div>
            </div>
            <div className="flex-grow flex justify-center items-center p-8 bg-[var(--bg-color)]">
                <div className="w-full h-full max-w-6xl aspect-video bg-[var(--panel-bg)] border border-[var(--border-color)] flex items-center justify-center relative overflow-hidden rounded-lg">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-contain transition-opacity duration-300 ${stream ? 'opacity-100' : 'opacity-0'}`}
                        aria-hidden={!stream}
                    />
                    {!stream && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                            {error ? (
                                <>
                                    <ErrorIcon />
                                    <h3 className="text-xl font-bold text-red-400" role="alert">{t.universal_editor_error_title}</h3>
                                    <p className="text-[var(--text-color-light)] mt-1 max-w-md">{error}</p>
                                </>
                            ) : (
                                <>
                                    <PlaceholderCameraIcon />
                                    <h3 className="text-xl font-bold">{t.universal_editor_camera_off}</h3>
                                    <p className="text-[var(--text-color-light)] mt-1">{t.universal_editor_camera_off_subtitle}</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UniversalEditor;
