import { query, collection, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import searchchat from "./searchchat";

async function loadrecent(uid, contacts, setContacts) {
  if (contacts) {
    let newcontacts = [];
    await Promise.all(contacts.map(async contact => {
      const chatRefobj = await searchchat(uid, contact[1]);
      const chatRef = chatRefobj ? `chats/${chatRefobj.id}/messages` : "";

      if (chatRef) {
        try {
          // Create a query to order messages by 'createdAt' in descending order and limit to 1 result
          const q = query(
            collection(db, chatRef),
            orderBy('createdAt', 'desc'), // Order by 'createdAt' in descending order
            limit(1) // Limit the result to one document
          );

          // Fetch the most recent message
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            let mostRecentMessage = snapshot.docs[0].data().text;
            mostRecentMessage = mostRecentMessage.length > 30 ? mostRecentMessage.substring(0, 20) + '...' : mostRecentMessage;
            newcontacts.push([...contact, mostRecentMessage]);
          } else {
            newcontacts.push([...contact, "No recent messages"]); // Add placeholder if no recent message found
          }
        } catch (error) {
          console.error('Error fetching the most recent message:', error);
        }
      }
    }));
    console.log(newcontacts);
    setContacts(newcontacts);
  }
}

export default loadrecent;
