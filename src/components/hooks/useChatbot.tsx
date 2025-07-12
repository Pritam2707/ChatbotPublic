import React, { useCallback, useEffect } from "react";
import { ChatbotContextType } from "../types/hook";
import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from "../types/User";
import { AES } from "crypto-js";
import { updateDoc, serverTimestamp, addDoc, collection } from "firebase/firestore";
import { Message } from "../types/Message";
import { db } from "../../firebase";
import searchchat from "../database/searchchat";
import { useAuth } from "./useAuth";

interface ChatbotResponse {
    response: string;
    error?: string;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);


export const ChatbotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [Currentchatbot, setChatbot] = useState<User | null>(null);
    const [response, setResponse] = useState<string>("");

    const { uid, name } = useAuth();

    const setCurrentChatbot = (chatbot: User | null) => {
        setChatbot(chatbot);
    }


    const SendMsg = useCallback(async () => {
        if (uid && Currentchatbot) {
            const chatCollection = await searchchat(uid, Currentchatbot.uid);
            if (!chatCollection) return;
            try {
                let currentMessage = response;
                const encryptedMsg = AES.encrypt(currentMessage, uid).toString();
                const messageObj: Message = {
                    text: encryptedMsg,
                    reciever: uid,
                    createdAt: serverTimestamp(),
                    sender: Currentchatbot.uid,
                    imageURL: "",
                    isAFile: false,
                    isAReply: false,
                    isEdited: false,
                    messageId: "",
                };
                const res = await addDoc(collection(db, `chats/${chatCollection.id}/messages`), messageObj);
                await updateDoc(res, { messageId: res.id });
            } catch (err: any) {
                throw err;
            }
        }
    }, [uid, Currentchatbot, response]);

    useEffect(() => {
        if (response.length > 0) {
            SendMsg();
            setResponse("");
        }
    }, [response, SendMsg])

    const sendRequest = async (prompt: string) => {
        if (Currentchatbot) {
            try {
                const res = await fetch("https://chat-listener-iok0.onrender.com/api/chatbot", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': process.env.REACT_APP_CHATBOT_API_KEY as string,
                    },
                    body: JSON.stringify({
                        chatbotUid: Currentchatbot.uid,
                        prompt: prompt,
                        user: {
                            uid: uid,
                            name: name,
                        }
                    }),
                });
                const data: ChatbotResponse = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Something went wrong');
                }

                setResponse(data.response);

            } catch (err: any) {
                console.log(err);
            }
        }
    }

    return (
        <ChatbotContext.Provider value={{ Currentchatbot, setCurrentChatbot, sendRequest }}>
            {children}
        </ChatbotContext.Provider>
    );
};


export const useChatbot = (): ChatbotContextType => {
    const context = useContext(ChatbotContext);
    if (!context) {
        throw new Error('useChatbot must be used within an ChatbotProvider');
    }
    return context;
};
