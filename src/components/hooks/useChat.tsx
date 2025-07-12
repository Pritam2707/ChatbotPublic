import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";
import { serverTimestamp, addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { AES } from "crypto-js";
import sound from "../../assets/audio/message.mp3";
import { db } from "../../firebase";
import { useAuth } from "./useAuth";
import { useError } from "./useError";
import { useReply } from "./useReply";
import { useForward } from "./useForward";
import { useEditMessage } from "./useEditMessage";
import searchchat from "../database/searchchat";
import UploadFile from "../database/addfile";
import getUrl from "../database/getfile";
import { User } from "../types/User";
import { Message } from "../types/Message";
import { ChatContextType } from "../types/hook";
import { useChatbot } from "./useChatbot";
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [reciever, setReciever] = useState<User | null>(null);
    const [chatRef, setChatref] = useState<string>("");
    const [isChatOpen, setOpen] = useState<boolean>(false);
    const [isChatBot, setisChatbot] = useState<boolean>(false);

    const { uid } = useAuth();
    const { openReply, setReply, showReply, ReplyMessage, ReplyToUser } = useReply();
    const { openForward, message } = useForward();
    const { setErrorTitle, setErrorBody, setisError } = useError();
    const { EditMessage, isEditActive, setEditMessage, setIsEditActive } = useEditMessage();
    const { setCurrentChatbot, Currentchatbot } = useChatbot();
    const changeReciever = useCallback((newReciever: User | null) => {
        setReciever(newReciever);
    }, []);

    const closeChat = useCallback(() => {
        if (Currentchatbot) {
            setCurrentChatbot(null);
            setisChatbot(false);
        }
        setOpen(false);
        setChatref("");
        setReciever(null);
    }, [Currentchatbot, reciever, isChatBot, isChatOpen]);

    const openChat = useCallback(async (contact?: User) => {
        if (contact) setReciever(contact);
        if (!reciever || !uid) return;

        try {
            const chatCollection = await searchchat(uid, reciever.uid);
            const data = chatCollection?.data();
            if (data && data.isAi) {
                setisChatbot(data.isAi);
                setCurrentChatbot(reciever);
            }
            if (chatCollection) {
                setChatref(`chats/${chatCollection.id}/messages`);
                setOpen(true);
            } else {
                throw new Error("An error occurred while retrieving chat from database");
            }
        } catch (err: any) {
            setErrorTitle("Error opening chat");
            setErrorBody(err.message);
            setisError(true);
        }
    }, [reciever, uid, setErrorTitle, setErrorBody, setisError]);

    const SendMsg = useCallback(async (RecieverUid: string, file: File | null, NonForwardedmessage: string) => {
        const sentAudio = new Audio(sound);
        const chatCollection = await searchchat(uid as string, RecieverUid);
        if (!chatCollection) return;

        if (!openForward && !NonForwardedmessage.trim()) {
            setErrorTitle("Error sending message");
            setErrorBody("Your message is empty!");
            setisError(true);
            return;
        }
        if (!navigator.onLine) {
            setErrorTitle("Error sending message");
            setErrorBody("You are offline!");
            setisError(true);
            return;
        }

        try {
            if (isEditActive && EditMessage) {
                const MessageRef = doc(db, `chats/${chatCollection.id}/messages/${EditMessage.messageId}`);
                await updateDoc(MessageRef, {
                    text: AES.encrypt(NonForwardedmessage, EditMessage.reciever).toString(),
                    isEdited: true
                });
                setEditMessage(null);
                setIsEditActive(false);
                sentAudio.play();
                return;
            }

            let currentMessage = openForward ? message?.text : NonForwardedmessage;
            const encryptedMsg = AES.encrypt(currentMessage || '', RecieverUid).toString();
            const messageObj: Message = {
                text: encryptedMsg,
                reciever: RecieverUid,
                createdAt: serverTimestamp(),
                sender: uid as string,
                imageURL: openForward ? message?.imageURL : "",
                isAFile: openForward && message ? message.isAFile : false,
                isAReply: openReply,
                isEdited: false,
                messageId: ""
            };

            if (openReply) {
                messageObj.isAReply = true;
                messageObj.ReplyTo = {
                    Username: ReplyToUser,
                    UserText: AES.encrypt(ReplyMessage, RecieverUid).toString()
                };
            }

            if (file) {
                const snapshot = await UploadFile(file);
                const url = await getUrl(`media/${file.name}`);
                if (url) {
                    messageObj.isAFile = true;
                    messageObj.imageURL = url ? url : "";
                }
            }

            const res = await addDoc(collection(db, `chats/${chatCollection.id}/messages`), messageObj);
            await updateDoc(res, { messageId: res.id });
            setReply("", "");
            showReply(false);
            sentAudio.play();
        } catch (err: any) {
            setErrorTitle("Error sending message");
            setErrorBody(`An error occurred while sending the message!\n${err}`);
            setisError(true);
        }
    }, [uid, openForward, message, openReply, isEditActive, EditMessage, ReplyMessage, ReplyToUser, setReply, showReply, setErrorBody, setErrorTitle, setisError]);

    const contextValue = useMemo(() => ({
        SendMsg,
        reciever,
        chatRef,
        isChatOpen,
        closeChat,
        changeReciever,
        openChat,
        isChatBot,
    }), [SendMsg, reciever, chatRef, , isChatOpen, isChatBot, closeChat, changeReciever, openChat]);

    return (
        <ChatContext.Provider value={contextValue}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
