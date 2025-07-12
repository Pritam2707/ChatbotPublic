import { db } from '../../firebase'; // Get database object
import {
  doc,
  collection,
  setDoc,
} from "firebase/firestore"; // Used to query Firebase

async function StoreUser({ name, photoURL, uid }: {
  name: string;
  photoURL: string;
  uid: string;
}) {
  try {
    const usersCollection = collection(db, 'users');

    // Get notification token
    // let token = await requestForToken().catch(err => {
    //   throw new Error(err.toString());
    // });

    // Update the user document in Firestore
    const userRef = doc(usersCollection, uid);
    const userData = {
      name,
      photoURL
      // token
      // Other relevant user data
    };

    // Set the user's data in Firestore
    await setDoc(userRef, userData);
  } catch (err) {
    console.error("Error storing User")
  }
}

export default StoreUser;
