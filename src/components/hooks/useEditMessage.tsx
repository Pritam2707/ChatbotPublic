import React from "react";
import { EditMessageContextType } from "../types/modals";
import { createContext, useContext, useState, ReactNode } from 'react';
import { Message } from "../types/Message";

const EditMessageContext = createContext<EditMessageContextType | undefined>(undefined);

export const EditMessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [EditMessage, setMessage] = useState<Message | null>(null);
    const [isEditActive, setOpen] = useState(false);
    function setEditMessage(message: Message | null) {
        setMessage(message);
    }
    function setIsEditActive(show: boolean) {
        setOpen(show);
    }


    return (
        <EditMessageContext.Provider value={{ EditMessage, isEditActive, setEditMessage, setIsEditActive }}>
            {children}
        </EditMessageContext.Provider>
    );
};

export const useEditMessage = (): EditMessageContextType => {
    const context = useContext(EditMessageContext);
    if (!context) {
        throw new Error('useEditMessage must be used within an EditMessageProvider');
    }
    return context;
};
