import React from "react";
import { ForwardContextType } from "../types/modals";
import { createContext, useContext, useState, ReactNode } from 'react';
import { Message } from "../types/Message";

const ForwardContext = createContext<ForwardContextType | undefined>(undefined);

export const ForwardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState<Message | null>(null);
    const [openForward, setOpen] = useState(false);
    function setForward(message: Message | null) {
        setMessage(message);
    }
    function showForward(show: boolean) {
        setOpen(show);
    }


    return (
        <ForwardContext.Provider value={{ message, openForward, showForward, setForward }}>
            {children}
        </ForwardContext.Provider>
    );
};

export const useForward = (): ForwardContextType => {
    const context = useContext(ForwardContext);
    if (!context) {
        throw new Error('useForward must be used within an ForwardProvider');
    }
    return context;
};
