import React from "react";
import { AES, enc } from "crypto-js";
import { Message } from "./types/Message";
import { useAuth } from "./hooks/useAuth";
import { useMessageInfo } from "./hooks/useMessageInfo";

function MessageComponent({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-2"> {/* Added space between messages */}
      {messages.map((message) => (
        <MessageItem key={message.messageId} message={message} />
      ))}
    </div>
  );
}

function MessageItem({ message }: { message: Message }) {
  const { uid } = useAuth();
  const isSentByUser = uid === message.sender;
  const { setMessageInfo, showMessageInfo } = useMessageInfo();

  const renderMessageContent = () => {
    const baseClasses = `p-2 my-1 max-w-[80%] w-fit shadow-md rounded-md text-sm ${isSentByUser ? 'ml-auto bg-green-800' : 'mr-auto bg-blue-800'}`;
    const replyClasses = `bg-gray-800 rounded-md p-1 text-gray-200`;

    return message.isAFile ? (
      <div
        className={`${baseClasses} max-w-[300px] w-[70%] select-none break-words`}
        id={message.messageId}
        onContextMenu={(e) => {
          e.preventDefault();
          setMessageInfo(message);
          showMessageInfo(true, isSentByUser);
        }}
      >
        {message.isAReply && message.ReplyTo && (
          <div className={replyClasses}>
            <span className="font-semibold">{message.ReplyTo.Username}:</span>
            <div className="text-xs mt-1">{AES.decrypt(message.ReplyTo.UserText, message.reciever).toString(enc.Utf8).substring(0, 40) + "..."}</div>
          </div>
        )}
        <div className="flex flex-col items-center justify-center p-2">
          <img src={message.imageURL} className="max-w-full h-auto rounded-md mb-2" alt="File" loading="lazy" />
          <p className="text-center text-white">{AES.decrypt(message.text, message.reciever).toString(enc.Utf8)}</p>
          {message.isEdited && <p className="text-xs text-gray-300 text-right mt-1">Edited</p>}
        </div>
      </div>
    ) : (
      <div
        className={`${baseClasses} select-none break-words`}
        id={message.messageId}
        onContextMenu={(e) => {
          e.preventDefault();
          setMessageInfo(message);
          showMessageInfo(true, isSentByUser);
        }}
      >
        {message.isAReply && message.ReplyTo && (
          <div className={replyClasses}>
            <span className="font-semibold">{message.ReplyTo.Username}:</span>
            <div className="text-xs mt-1">{AES.decrypt(message.ReplyTo.UserText, message.reciever).toString(enc.Utf8).substring(0, 40) + "..."}</div>
          </div>
        )}
        <p className="text-white">{AES.decrypt(message.text, message.reciever).toString(enc.Utf8)}</p>
        {message.isEdited && <p className="text-xs text-gray-300 text-right mt-1">Edited</p>}
      </div>
    );
  };

  return (
    <div className={`flex ${isSentByUser ? 'justify-end' : 'justify-start'} mb-2`}>
      {renderMessageContent()}
    </div>
  );
}

export default MessageComponent;
