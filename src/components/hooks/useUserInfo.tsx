import React from "react";
import { UserInfoContextType } from "../types/modals";
import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from "../types/User";

const UserInfoContext = createContext<UserInfoContextType | undefined>(undefined);

export const UserInfoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [openUserInfo, setOpen] = useState(false);
    function setUserInfo(user: User | null) {
        setUser(user);
    }
    function showUserInfo(show: boolean) {
        setOpen(show);
    }


    return (
        <UserInfoContext.Provider value={{ user, setUserInfo, showUserInfo, openUserInfo }}>
            {children}
        </UserInfoContext.Provider>
    );
};

export const useUserInfo = (): UserInfoContextType => {
    const context = useContext(UserInfoContext);
    if (!context) {
        throw new Error('useUserInfo must be used within an UserInfoProvider');
    }
    return context;
};
