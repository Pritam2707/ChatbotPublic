import React, { useEffect } from "react";
import { AuthContextType } from "../types/hook";
import { createContext, useContext, useState, ReactNode } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import Searchuser from "../database/searchuser";
import StoreUser from "../database/storeuser";
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user] = useAuthState(auth);
    useEffect(() => {
        if (user && name && photoURL && uid) {
            Searchuser(user.uid).then((userfromDB) => {
                if (userfromDB === undefined) {
                    StoreUser({
                        name: name,
                        photoURL: photoURL,
                        uid: uid
                    });
                }
            });
        }
        setisAuthenticated(user ? true : false);
    }, [user])
    const [isAuthenticated, setisAuthenticated] = useState<boolean>(user ? true : false);
    const uid = user?.uid;
    const name = user?.displayName;
    const photoURL = user?.photoURL;
    function logout() {
        setisAuthenticated(false);
    }


    return (
        <AuthContext.Provider value={{ uid, photoURL, name, isAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};