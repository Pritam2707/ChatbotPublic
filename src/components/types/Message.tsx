import { FieldValue } from "firebase/firestore";

export interface Message {
    text: string,
    sender: string;
    reciever: string;
    imageURL?: string;
    messageId: string;
    isEdited: boolean;
    isAReply: boolean;
    isAFile: boolean;
    createdAt: FieldValue;
    ReplyTo?: {
        Username: string;
        UserText: string;
    }
}