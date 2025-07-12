import React, { useState, useEffect } from "react";
import searchchat from "./database/searchchat";
import { orderBy, limit, collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import DefaultAvatar from '../assets/images/default.png';
import { AES, enc } from "crypto-js";
import { useContact } from "./hooks/useContacts";
import { useChat } from "./hooks/useChat";
import { useUserInfo } from "./hooks/useUserInfo";
import { useAuth } from "./hooks/useAuth";
import { Message } from "./types/Message"; // Assuming you have a Message type

function Contacts() {
  const [searchInput, setSearchInput] = useState("");
  const [recentMessages, setRecentMessages] = useState<{ [uid: string]: string }>({});
  const { contacts } = useContact();
  const { openChat, changeReciever, reciever } = useChat();
  const { setUserInfo, showUserInfo } = useUserInfo();
  const { uid, isAuthenticated } = useAuth();
  useEffect(() => {
    if (reciever)
      openChat();
  }, [reciever]
  )
  const loadContacts = () => {
    return (
      <div className="resize-x h-full">
        {contacts.length === 0 &&
          <div>
            <h1 className="w-fit my-5 text-3xl mx-auto text-purple-300">Feels empty</h1>
            <p className="w-fit mx-auto my-2 text-orange-200">How about adding some contacts?</p>
            <p className="w-fit mx-auto my-2 text-green-200">Click menu to find add option.</p>
            <p className="w-fit mx-auto my-2 text-cyan-200">Have a good day! :D</p>
          </div>
        }
        {contacts !== null && contacts
          .filter((contact) =>
            contact.contact.name.toLowerCase().includes(searchInput.toLowerCase())
          )
          .map((contact) => (
            <div
              key={contact.contact.uid}
              onClick={() => {
                changeReciever(contact.contact);
              }}
              className="w-full contact hover:text-blue-500 hover:bg-purple-300 rounded-md mr-2 mb-2 bg-gray-900 p-2 cursor-pointer"
            >
              <div className="flex my-1 rounded">
                <div
                  className="rounded-full w-12 h-12 my-auto overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserInfo(contact.contact);
                    showUserInfo(true);
                  }}
                >
                  <img src={contact.contact.photoURL ? contact.contact.photoURL : DefaultAvatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="w-4/5 h-16 pt-2 px-1">
                  <p className="text-xl">{contact.contact.name}</p>
                  <p id={contact.contact.uid} className="text-sm text-gray-400">
                    {recentMessages[contact.contact.uid] || ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  useEffect(() => {
    const unsubscribe = () => {
      contacts.forEach(async (contact) => {
        const chatRefId = await searchchat(uid as string, contact.contact.uid);
        if (chatRefId) {
          const chatRef = chatRefId ? `chats/${chatRefId.id}/messages` : "";
          const q = query(
            collection(db, chatRef),
            orderBy('createdAt', 'desc'),
            limit(1)
          );


          return onSnapshot(q, (snapshot) => {
            if (!snapshot.empty && !searchInput) {
              const mostRecentMessage = snapshot.docs[0].data() as Message;
              let mostRecentMessageText = AES.decrypt(mostRecentMessage.text, mostRecentMessage.reciever).toString(enc.Utf8);
              mostRecentMessageText = mostRecentMessageText.length > 30 ? mostRecentMessageText.substring(0, 20) + '...' : mostRecentMessageText;

              setRecentMessages(prevMessages => ({
                ...prevMessages,
                [contact.contact.uid]: mostRecentMessageText
              }));
            }
          });
        }
      });
    }

    unsubscribe();

    return () => {
      if (isAuthenticated) {

        // Clean up function to unsubscribe from listeners
        contacts.forEach(async (contact) => {
          const chatRefId = await searchchat(uid as string, contact.contact.uid);
          const chatRef = chatRefId ? `chats/${chatRefId.id}/messages` : "";
          const q = query(
            collection(db, chatRef),
            orderBy('createdAt', 'desc'),
            limit(1)
          );
          const snapshotUnsubscribe = onSnapshot(q, () => { });
          snapshotUnsubscribe(); // Unsubscribe to prevent memory leaks

        });
      }
    };
  }, [contacts, searchInput, uid]);

  return (
    <div className="bg-gray-800 border-solid text-white border-gray-950 border-t-2 border-r-2 w-full md:w-2/6 h-[calc(100vh-12rem)]">
      <div className="inline-flex w-full h-full px-2 py-4">
        <div className="flex-grow">
          <h3 className="font-normal text-center px-2 py-3 w-full text-xl leading-tight">Contacts</h3>
          <div className="flex justify-between mb-5">
            <label htmlFor="search">
              <svg className="w-6 mt-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </label>
            <input
              type="text"
              placeholder="Search Contact"
              id="search"
              className="my-2 w-full text-sm bg-gray-900 focus:bg-gray-500 text-gray-200 rounded h-10 p-3 focus:outline-none"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="h-full overflow-y-scroll overflow-x-hidden scrollbar">
            {loadContacts()}
          </div>
        </div>
      </div>
    </div>
  );


}

export default Contacts;
