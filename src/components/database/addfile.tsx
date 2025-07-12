import { storage } from "../../firebase";
import { ref, uploadBytes } from 'firebase/storage';
//TODO generate Random name
export default async function uploadFile(file: File) {
  const storageRef = ref(storage, `media/${file.name}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    console.log("File uploaded successfully:", snapshot.ref.fullPath);
    return snapshot;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error; // Re-throw the error to propagate it to the caller
  }
}
