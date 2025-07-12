import React from "react";
import { ErrorContextType } from "../types/modals";
import { createContext, useContext, useState, ReactNode } from 'react';

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [title, setTitle] = useState<string>("");
    const [body, setBody] = useState<string>("");
    const [openError, setOpen] = useState<boolean>(false);
    function setErrorTitle(title: string) {
        setTitle(title);
    }
    function setErrorBody(body: string) {
        setBody(body);
    }
    function setisError(isError: boolean) {
        setOpen(isError);
    }
    return (
        <ErrorContext.Provider value={{ setErrorTitle, setErrorBody, setisError, title, body, openError }}>
            {children}
        </ErrorContext.Provider>
    );
};

export const useError = (): ErrorContextType => {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error('useError must be used within an ErrorProvider');
    }
    return context;
};
