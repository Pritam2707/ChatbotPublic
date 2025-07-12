import React, { useEffect } from "react";
import { NotificationContextType } from "../types/modals";
import { createContext, useContext, useState, ReactNode } from 'react';
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../firebase";
import { Notification } from "../types/Notification";
import { useAuth } from "./useAuth";
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [openNotification, setOpen] = useState(false);

    useEffect(() => {
        if (isAuthenticated)
            return fetchNotifications();
    }, [isAuthenticated]);

    // Fetch notifications from Firestore
    const fetchNotifications = () => {
        const q = query(collection(db, 'updates'));

        onSnapshot(q, (QuerySnapshot) => {
            const fetchedNotifications: Notification[] = [];
            QuerySnapshot.forEach((doc) => {
                const notification = {
                    text: doc.data().text,
                    id: doc.id
                }
                fetchedNotifications.push(notification as Notification);
            });
            setNotifications(fetchedNotifications);
        });
    };

    function showNotification(show: boolean) {
        setOpen(show);
    }
    return (
        <NotificationContext.Provider value={{ notifications, openNotification, showNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within an NotificationProvider');
    }
    return context;
};
