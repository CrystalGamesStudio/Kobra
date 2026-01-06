import { db } from '../firebase/config';
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    orderBy, 
    onSnapshot, 
    serverTimestamp,
    doc,
    deleteDoc,
    updateDoc
} from 'firebase/firestore';
import { Project, EditorType } from '../types';

const projectsCollection = collection(db, "projects");

// Create a new project for a user
export const createProject = async (userId: string, name: string, editorType: EditorType, description?: string): Promise<Project> => {
    try {
        const docRef = await addDoc(projectsCollection, {
            userId,
            name,
            editorType,
            description: description || '',
            createdAt: serverTimestamp()
        });
        
        // Return a client-side representation of the project immediately.
        // The real-time listener will update the state with the server-generated timestamp.
        return {
            id: docRef.id,
            name,
            description: description || '',
            editorType,
            createdAt: Date.now(),
            userId
        };

    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Could not create project.");
    }
};

// Get a real-time stream of a user's projects
export const getProjects = (userId: string, callback: (projects: Project[]) => void) => {
    const q = query(projectsCollection, where("userId", "==", userId), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const projects: Project[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            projects.push({
                id: doc.id,
                name: data.name,
                description: data.description,
                editorType: data.editorType,
                createdAt: data.createdAt?.toDate().getTime() || Date.now(),
                userId: data.userId
            });
        });
        callback(projects);
    }, (error) => {
        console.error("Error getting projects:", error);
        // In a real app, you'd want to show a user-facing error here
    });

    return unsubscribe;
};

// Delete a project by its ID
export const deleteProject = async (projectId: string): Promise<void> => {
    try {
        const projectDoc = doc(db, "projects", projectId);
        await deleteDoc(projectDoc);
    } catch (e) {
        console.error("Error deleting document: ", e);
        throw new Error("Could not delete project.");
    }
};

// Update a project's name and description
export const updateProject = async (projectId: string, name: string, description: string): Promise<void> => {
    try {
        const projectDoc = doc(db, "projects", projectId);
        await updateDoc(projectDoc, {
            name,
            description
        });
    } catch (e) {
        console.error("Error updating document: ", e);
        throw new Error("Could not update project.");
    }
};