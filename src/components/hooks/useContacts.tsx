import React, { useEffect, createContext, useContext, useState, ReactNode } from "react";
import { ContactContextType } from "../types/hook";
import { Contact } from "../types/Contact";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "./useAuth";
import SearchChatbot from "../database/searchChatBot";
import Searchuser from "../database/searchuser";

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const { uid } = useAuth();

    useEffect(() => {
        if (!uid) return; // Make sure uid is available before querying

        const contactsCollectionRef = collection(db, `contacts/${uid}/contacts`);
        const q = query(contactsCollectionRef);

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const contactsList: Contact[] = [];

            const promises = querySnapshot.docs.map(async (doc) => {
                const data = doc.data();
                let about: string | undefined = '';

                if (data.isAi) {
                    const chatbot = await SearchChatbot(doc.id);
                    about = chatbot?.about;
                } else {
                    const user = await Searchuser(doc.id);
                    about = user?.about;
                }

                const contact: Contact = {
                    contact: {
                        name: data.name,
                        uid: doc.id,
                        photoURL: data.photoURL,
                        about: about,
                    },
                };

                contactsList.push(contact);
            });

            await Promise.all(promises); // Wait for all async tasks to complete
            setContacts(contactsList); // Update the state once all promises are resolved
        });

        // Cleanup Firestore subscription when component unmounts
        return () => unsubscribe();
    }, [uid]); // Re-run if uid changes

    return (
        <ContactContext.Provider value={{ contacts }}>
            {children}
        </ContactContext.Provider>
    );
};

export const useContact = (): ContactContextType => {
    const context = useContext(ContactContext);
    if (!context) {
        throw new Error("useContact must be used within a ContactProvider");
    }
    return context;
};
