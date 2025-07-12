import React from "react";
import { SettingContextType } from "../types/modals";
import { createContext, useContext, useState, ReactNode } from 'react';

const SettingContext = createContext<SettingContextType | undefined>(undefined);

export const SettingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [openSetting, setOpen] = useState<boolean>(false);


    function showSetting(show: boolean) {
        setOpen(show);
    }
    return (
        <SettingContext.Provider value={{ openSetting, showSetting }}>
            {children}
        </SettingContext.Provider>
    );
};

export const useSetting = (): SettingContextType => {
    const context = useContext(SettingContext);
    if (!context) {
        throw new Error('useSetting must be used within an SettingProvider');
    }
    return context;
};
