import React from "react";
import { ReplyContextType } from "../types/modals";
import { createContext, useContext, useState, ReactNode } from 'react';

const ReplyContext = createContext<ReplyContextType | undefined>(undefined);

export const ReplyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [ReplyMessage, setMessage] = useState<string>("");
    const [ReplyToUser, setUsername] = useState<string>("")
    const [openReply, setOpen] = useState(false);
    function setReply(message: string, ReplyToUser: string) {
        setMessage(message);
        setUsername(ReplyToUser);
    }
    function showReply(show: boolean) {
        setOpen(show);
    }


    return (
        <ReplyContext.Provider value={{ ReplyMessage, ReplyToUser, openReply, setReply, showReply }}>
            {children}
        </ReplyContext.Provider>
    );
};

export const useReply = (): ReplyContextType => {
    const context = useContext(ReplyContext);
    if (!context) {
        throw new Error('useReply must be used within an ReplyProvider');
    }
    return context;
};
