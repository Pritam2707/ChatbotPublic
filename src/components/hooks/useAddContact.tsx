import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from "react";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import GetChatbotList from "../database/getchatbot";
import searchuser from "../database/searchuser";
import { useAuth } from "./useAuth";
import { useError } from "./useError";
import { AddContactContextType } from "../types/modals";
import { User } from "../types/User";

const AddContactContext = createContext<AddContactContextType | undefined>(undefined);

export const AddContactProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { uid, isAuthenticated, name, photoURL } = useAuth();
    const { setErrorBody, setErrorTitle, setisError } = useError();
    const [openAddContact, setOpen] = useState(false);
    const [chatbots, setChatbots] = useState<User[]>([]);
    const [isHuman, setisHuman] = useState(true);
    const [HumanName, setHumanName] = useState('');
    const [ContactUid, setContactUid] = useState('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (isAuthenticated) {
            GetChatbotList().then(setChatbots).catch(() => {
                setErrorTitle("Error fetching chatbots");
                setErrorBody("Failed to fetch chatbot list");
                setisError(true);
            });
        }
    }, [isAuthenticated, setErrorBody, setErrorTitle, setisError]);

    const showAddContact = useCallback((show: boolean) => setOpen(show), []);

    const storeContact = useCallback(async (ContactphotoURL: string, chatbot?: User) => {
        try {
            const userContactsRef = collection(db, `contacts/${uid}/contacts`);
            const recieverContactsRef = collection(db, `contacts/${ContactUid}/contacts`);
            const contactRef = doc(userContactsRef, ContactUid);
            const recieverContactRef = doc(recieverContactsRef, uid);

            await setDoc(contactRef, {
                name: isHuman ? HumanName : chatbot?.name,
                photoURL: ContactphotoURL,
                isAi: !isHuman
            });
            if (isHuman)
                await setDoc(recieverContactRef, {
                    name: name,
                    photoURL: isHuman ? photoURL : ''
                });
        } catch (err) {
            setErrorTitle("Error adding contact");
            setErrorBody(`Could not push contact to database!\n${err}`);
            setisError(true);
        }
    }, [uid, ContactUid, HumanName, isHuman, name, photoURL, setErrorBody, setErrorTitle, setisError]);

    const AddContact = useCallback(async () => {
        setLoading(true);
        console.log(isHuman)
        try {
            if (isHuman) {
                const user = await searchuser(ContactUid);
                if (!user) {
                    throw new Error("The user does not exist!");
                }
                await storeContact(user.photoURL);
            } else {
                console.log(chatbots, ContactUid)
                const chatbot = chatbots.find(chatbot => chatbot.uid === ContactUid);
                console.log(chatbot)
                if (chatbot) {
                    await storeContact(chatbot.photoURL, chatbot);
                }
            }
            await addDoc(collection(db, 'chats'), { uid: `${uid}${ContactUid}`, isAi: !isHuman });
            setHumanName("");
            setContactUid("");
            showAddContact(false);
        } catch (err: any) {
            setErrorTitle("Error adding contact");
            setErrorBody(err.message);
            setisError(true);
        } finally {
            setLoading(false);
        }
    }, [isHuman, uid, ContactUid, chatbots, storeContact, setErrorBody, setErrorTitle, setisError, showAddContact]);

    const contextValue = useMemo(() => ({
        loading, setLoading, openAddContact, showAddContact, chatbots, isHuman, setisHuman, HumanName, setHumanName, ContactUid, setContactUid, AddContact
    }), [loading, openAddContact, chatbots, isHuman, HumanName, ContactUid, AddContact]);

    return (
        <AddContactContext.Provider value={contextValue}>
            {children}
        </AddContactContext.Provider>
    );
};

export const useAddContact = (): AddContactContextType => {
    const context = useContext(AddContactContext);
    if (!context) {
        throw new Error('useAddContact must be used within an AddContactProvider');
    }
    return context;
};
