import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { User } from "../types/User";

async function GetChatbotList() {
    const botRef = collection(db, 'chatbots');
    const res = await getDocs(botRef);
    const chatbots: User[] = [];
    res.forEach((doc) => {

        const data = doc.data();
        const chatbot = { name: data.name, uid: doc.id, photoURL: data.photoURL, about: data.about };
        chatbots.push(chatbot as User);
    });
    return chatbots;
}

export default GetChatbotList;
