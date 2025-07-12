import React from "react";
import { MessageInfoContextType } from "../types/modals";
import { createContext, useContext, useState, ReactNode } from 'react';
import { Message } from "../types/Message";

const MessageInfoContext = createContext<MessageInfoContextType | undefined>(undefined);

export const MessageInfoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState<Message | null>(null);
    const [isSentByUser, setIsSentByUser] = useState<boolean>(false);
    const [openMessageInfo, setOpen] = useState(false);
    function setMessageInfo(message: Message | null) {
        setMessage(message);
    }
    function showMessageInfo(show: boolean, isSentByUser: boolean) {
        setIsSentByUser(isSentByUser)
        setOpen(show);
    }


    return (
        <MessageInfoContext.Provider value={{ message, openMessageInfo, showMessageInfo, setMessageInfo, isSentByUser }}>
            {children}
        </MessageInfoContext.Provider>
    );
};

export const useMessageInfo = (): MessageInfoContextType => {
    const context = useContext(MessageInfoContext);
    if (!context) {
        throw new Error('useMessageInfor must be used within an MessageInfoProvider');
    }
    return context;
};
