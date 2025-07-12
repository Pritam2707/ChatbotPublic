import { db } from '../../firebase';
import { collection, query, where, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

async function searchchat(uid: string, recieverUid: string): Promise<QueryDocumentSnapshot<DocumentData> | null> {
  const chatsRef = collection(db, 'chats');

  // Combine both queries into one
  const q = query(chatsRef, where('uid', 'in', [recieverUid + uid, uid + recieverUid]));

  // Execute the query
  const querySnapshot = await getDocs(q);

  // Loop through the results and return the first matching document's reference
  for (const doc of querySnapshot.docs) {
    return doc; // Return the document if found
  }

  return null; // Return null if no matching chat is found
}

export default searchchat;
