import { Message } from "./Message";
import { User } from "./User";
import { Notification } from "./Notification";
export interface ErrorContextType {
    setErrorTitle: (title: string) => void;
    setErrorBody: (body: string) => void;
    setisError: (isError: boolean) => void;
    title: string;
    body: string;
    openError: boolean;
}
export interface UserInfoContextType {
    user: User | null;
    setUserInfo: (user: User | null) => void;
    showUserInfo: (show: boolean) => void;
    openUserInfo: boolean;
}
export interface MessageInfoContextType {
    message: Message | null;
    openMessageInfo: boolean;
    isSentByUser: boolean;
    showMessageInfo: (show: boolean, isSentByUser: boolean) => void;
    setMessageInfo: (message: Message | null) => void;
}
export interface ReplyContextType {
    ReplyToUser: string;
    ReplyMessage: string;
    openReply: boolean;
    setReply: (message: string, ReplyToUser: string) => void;
    showReply: (show: boolean) => void;
}
export interface ForwardContextType {
    message: Message | null;
    openForward: boolean;
    showForward: (show: boolean) => void;
    setForward: (message: Message | null) => void;
}
export interface EditMessageContextType {
    EditMessage: Message | null;
    isEditActive: boolean;
    setIsEditActive: (show: boolean) => void;
    setEditMessage: (message: Message | null) => void;
}
export interface NotificationContextType {
    notifications: Notification[];
    openNotification: boolean;
    showNotification: (show: boolean) => void
}
export interface SettingContextType {
    openSetting: boolean;
    showSetting: (show: boolean) => void;
}
export interface AddContactContextType {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    openAddContact: boolean
    showAddContact: (show: boolean) => void;
    chatbots: User[];
    isHuman: boolean;
    setisHuman: React.Dispatch<React.SetStateAction<boolean>>;
    HumanName: string;
    setHumanName: React.Dispatch<React.SetStateAction<string>>;
    ContactUid: string;
    setContactUid: React.Dispatch<React.SetStateAction<string>>;
    AddContact: () => void;
}