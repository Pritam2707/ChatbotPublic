import { Contact } from "./Contact";
import { User } from "./User";

export interface AuthContextType {
    uid: string | undefined;
    photoURL: string | undefined | null;
    name: string | undefined | null;
    isAuthenticated: boolean;
    logout: () => void;
}
export interface ChatContextType {
    SendMsg: (RecieverUid: string, file: File | null, NonForwardedmessage: string) => Promise<void>;  // Now returns a promise for async handling
    reciever: User | null;
    chatRef: string;
    isChatOpen: boolean;
    closeChat: () => void;
    changeReciever: (reciever: User | null) => void;  // Updated to allow null for resetting receiver
    openChat: (contact?: User) => Promise<void>;  // Now returns a promise for async handling
    isChatBot: boolean;
}

export interface ContactContextType {
    contacts: Contact[];
}
export interface ChatbotContextType {
    Currentchatbot: User | null;
    sendRequest: (promt: string) => void;
    setCurrentChatbot: (chatbot: User | null) => void;
}