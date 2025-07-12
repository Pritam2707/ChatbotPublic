import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import React, { useCallback } from "react";
import { useChat } from "../hooks/useChat";
import { useUserInfo } from "../hooks/useUserInfo";

export default function DisplayName() {
  const { reciever, closeChat } = useChat();
  const { setUserInfo, showUserInfo } = useUserInfo();

  // Memoize functions to avoid re-creation on each render
  const handleUserClick = useCallback(() => {
    if (reciever) {
      setUserInfo(reciever);
      showUserInfo(true);
    }
  }, [reciever, setUserInfo, showUserInfo]);

  const handleBackButtonClick = useCallback(() => {
    closeChat();
  }, [closeChat]);

  return (
    <nav className="md:h-16 h-12 text-white bg-gray-900 border-solid border-gray-950 border-t-2">
      <div className="flex items-center justify-between md:p-4 pt-1">
        <button className="w-6" onClick={handleBackButtonClick}>
          <ArrowLeftIcon className="h-6 w-6 text-white" />
        </button>
        <div className="flex items-center cursor-pointer" onClick={handleUserClick}>
          {reciever?.photoURL && (
            <img src={reciever.photoURL} className="h-9 rounded-full w-9 inline mr-2" alt="user avatar" />
          )}
          <span className="text-md md:text-xl">{reciever?.name || "Unknown User"}</span>
        </div>
        <div className="flex items-center">
          {/* Additional buttons/icons can be added here */}
        </div>
      </div>
    </nav>
  );
}
