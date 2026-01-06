import { db, storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
    collection, 
    addDoc, 
    serverTimestamp,
    query, 
    orderBy, 
    onSnapshot
} from 'firebase/firestore';
import { Recording } from '../types';

const recordingsCollection = collection(db, "recordings");

export const uploadRecording = async (userId: string, blob: Blob): Promise<string> => {
    const timestamp = Date.now();
    const storageRef = ref(storage, `recordings/${userId}/${timestamp}.webm`);
    
    try {
        const snapshot = await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        return downloadUrl;
    } catch (error) {
        console.error("Error uploading recording: ", error);
        throw new Error("Could not upload recording.");
    }
};

export const saveRecordingMetadata = async (recordingData: Omit<Recording, 'id' | 'createdAt'> & { createdAt?: any }): Promise<void> => {
    try {
        await addDoc(recordingsCollection, {
            ...recordingData,
            createdAt: serverTimestamp()
        });
    } catch (e) {
        console.error("Error adding recording metadata: ", e);
        throw new Error("Could not save recording metadata.");
    }
};

export const getPublicRecordings = (callback: (recordings: Recording[]) => void) => {
    const q = query(recordingsCollection, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const recordings: Recording[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            recordings.push({
                id: doc.id,
                userId: data.userId,
                userDisplayName: data.userDisplayName,
                userPhotoURL: data.userPhotoURL,
                projectId: data.projectId,
                projectName: data.projectName,
                projectEditorType: data.projectEditorType,
                videoUrl: data.videoUrl,
                createdAt: data.createdAt?.toDate().getTime() || Date.now(),
                duration: data.duration
            });
        });
        callback(recordings);
    }, (error) => {
        console.error("Error getting recordings:", error);
    });

    return unsubscribe;
};