import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

async function GetContactList(userId, setContacts) {
  const userRef = collection(db, 'contacts', userId, 'contacts');
  const q = query(userRef);

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const contacts = [];
    querySnapshot.forEach((doc) => {
      const contact = [doc.data().name, doc.id, doc.data().photoUrl];
      contacts.push(contact);
    });
    setContacts(contacts);
  });

  // Return the unsubscribe function to stop listening to changes when needed
  return unsubscribe;
}

export default GetContactList;
