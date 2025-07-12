import React, { useState, useEffect, useRef } from "react";
import { PhotoIcon, XMarkIcon, ArrowUturnRightIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import sound from "../../assets/audio/message.mp3";
import MessageComponent from "../Messages";
import DisplayName from "./DisplayName";
import Preview from "./Preview";
import { useChat } from "../hooks/useChat";
import { Message } from "../types/Message";
import { useAuth } from "../hooks/useAuth";
import { useReply } from "../hooks/useReply";
import { useEditMessage } from "../hooks/useEditMessage";
import { useChatbot } from "../hooks/useChatbot";

function Chatbox() {
  const sentAudio = useRef(new Audio(sound)).current;
  const divRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const { uid } = useAuth();
  const { ReplyMessage, openReply, showReply, setReply, ReplyToUser } = useReply();
  const { reciever, chatRef, isChatOpen, SendMsg, isChatBot } = useChat();
  const { isEditActive, EditMessage, setEditMessage, setIsEditActive } = useEditMessage();
  const { sendRequest } = useChatbot();

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement> | undefined = undefined) => {
    if (event) event.preventDefault();
    if (reciever) {
      if (isChatBot) {
        sendRequest(message);
      }
      SendMsg(reciever.uid, selectedFile, message);
      setPreview(undefined);
      setSelectedFile(null);
      setMessage("");
    }
  };

  useEffect(() => {
    if (EditMessage) setMessage(EditMessage.text);
  }, [EditMessage]);

  useEffect(() => {
    setMessages([]);
    if (chatRef !== "" && reciever) {
      const q = query(collection(db, chatRef), orderBy("createdAt", "asc"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedMessages: Message[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedMessages.push(data as Message);
        });

        setMessages(fetchedMessages);

        // Play sound if the new message is not from the current user
        const latestMessage = fetchedMessages[fetchedMessages.length - 1];
        if (latestMessage && latestMessage.sender !== uid) {
          sentAudio.play();
        }
      });
      return () => unsubscribe();
    }
  }, [isChatOpen, uid, chatRef]);

  // Scroll to the bottom whenever messages change or chat opens
  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, [messages, isChatOpen]);

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  return (
    isChatOpen && (
      <div className="absolute r md:static inset-0 md:w-4/6 z-0 right-0">
        <div className="inset-0 flex flex-col w-full h-full bg-gray-800">
          {preview && (
            <div className="absolute md:left-[33.33%] md:w-4/6 max-h-full overflow-y-scroll inset-0 z-50 flex justify-center items-center">
              <div className="absolute inset-0 bg-black opacity-80"></div>
              <div className="relative bg-gray-800 bg-opacity-80 text-white w-5/6 rounded-lg p-4 z-50">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-semibold">Preview</p>
                  <XMarkIcon
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => {
                      setPreview(undefined);
                      setSelectedFile(null);
                    }}
                  />
                </div>
                <div className="flex justify-center overflow-y-scroll items-center">
                  <Preview
                    fileUrl={preview}
                    type={selectedFile && selectedFile.type ? selectedFile.type : ""}
                  />
                </div>
                <form className="flex m-2 items-center" onSubmit={handleSubmit}>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (message.trim()) {
                          handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
                        }
                      }
                    }}
                    rows={1}
                    className="m-2 border-white border bg-gray-600 w-full focus:bg-gray-800 focus:outline-none focus:border-blue-600 text-white p-2.5 rounded-lg bg-gray-800 placeholder-gray-400 text-sm"
                    placeholder="Your message..."
                  ></textarea>
                  <button
                    type="submit"
                    className="inline-flex justify-center p-2 rounded-full cursor-pointer text-blue-500 hover:bg-gray-600"
                  >
                    <svg
                      className="w-5 h-5 rotate-90"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 20"
                    >
                      <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                    </svg>
                    <span className="sr-only">Send message</span>
                  </button>
                </form>
              </div>
            </div>
          )}
          <div ref={divRef} className="flex-1 overflow-y-scroll scrollbar">
            <div className="sticky top-0 z-10 bg-gray-800">
              <DisplayName />
            </div>
            <div className="h-fit scrollbar overflow-y-auto">
              <MessageComponent messages={messages} />
            </div>
          </div>
          <form className="sticky bottom-0 border-t-2 border-gray-950 bg-gray-800 z-50" onSubmit={handleSubmit}>
            {openReply && (
              <div className="flex items-center justify-between p-2 bg-blue-700 bg-opacity-80 text-white rounded-t-lg">
                <ArrowUturnRightIcon className="w-5 h-5" />
                <span className="text-sm">
                  Replying to <strong>{ReplyToUser}</strong>:{" "}
                  {ReplyMessage.length > 40 ? ReplyMessage.substring(0, 40) + "..." : ReplyMessage}
                </span>
                <button
                  type="button"
                  className="ml-2 p-1 rounded-md bg-red-700 bg-opacity-70"
                  onClick={() => {
                    showReply(false);
                    setReply("", "");
                  }}
                >
                  Close
                </button>
              </div>
            )}
            {isEditActive && EditMessage && (
              <div className="flex items-center justify-between p-2 bg-yellow-500 bg-opacity-80 text-black rounded-t-lg">
                <PencilSquareIcon className="w-5 h-5" />
                <span className="text-sm">
                  Editing message: {EditMessage?.text.length > 40 ? EditMessage.text.substring(0, 40) + "..." : EditMessage?.text}
                </span>
                <button
                  type="button"
                  className="ml-2 p-1 rounded-md bg-red-700 bg-opacity-70"
                  onClick={() => {
                    setEditMessage(null);
                    setIsEditActive(false);
                  }}
                >
                  Close
                </button>
              </div>
            )}
            <div className="flex items-center p-2">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                id="file"
                onChange={onSelectFile}
              />
              <label htmlFor="file">
                <PhotoIcon className="w-8 text-blue-300 cursor-pointer mx-1" />
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (message.trim()) {
                      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
                    }
                  }
                }}
                rows={1}
                className="flex-1 border-white border bg-gray-600 w-full focus:bg-gray-800 focus:outline-none focus:border-blue-600 text-white p-2.5 rounded-lg bg-gray-800 placeholder-gray-400 text-sm"
                placeholder="Your message..."
              ></textarea>
              <button
                type="submit"
                className="inline-flex justify-center p-2 rounded-full cursor-pointer text-blue-500 hover:bg-gray-600"
              >
                <svg
                  className="w-5 h-5 rotate-90"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 20"
                >
                  <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                </svg>
                <span className="sr-only">Send message</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}

export default Chatbox;
