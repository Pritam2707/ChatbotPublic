import { db } from '../../firebase';
import { doc, getDoc } from "firebase/firestore";
import { User } from '../types/User';

async function SearchChatbot(ChatBotuid: string) {
    try {
        const userRef = doc(db, `chatbots/${ChatBotuid}`);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            return docSnap.data() as User;
        } else {
            console.error("Chatbot does not exist")
        }
    } catch (error) {
        console.error(error)
    }
}
export default SearchChatbot;