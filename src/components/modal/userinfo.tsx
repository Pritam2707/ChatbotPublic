import React, { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import DefaultAvatar from './../../assets/images/default.png';
import { useUserInfo } from "../hooks/useUserInfo";
import { useChat } from '../hooks/useChat';

export function Userinfo() {
  const { user, showUserInfo, openUserInfo, setUserInfo } = useUserInfo();
  const { openChat, changeReciever, reciever } = useChat();

  useEffect(() => {
    if (reciever)
      openChat();
  }, [reciever]
  )
  // Handler for closing the dialog

  const handleClose = () => {
    showUserInfo(false);
    setUserInfo(null);
  };

  // Handler for sending a message
  const handleSendMessage = () => {
    if (user) {
      changeReciever(user);
    }
    handleClose();
  };

  return (
    <Transition.Root show={openUserInfo} as={Fragment}>
      <Dialog
        onClose={handleClose}
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4 py-6">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" aria-live="assertive" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition-transform ease-out duration-300"
            enterFrom="translate-y-8 opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transition-transform ease-in duration-300"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="translate-y-8 opacity-0"
          >
            <div
              className="relative z-50 bg-gray-900 rounded-lg p-6 w-full max-w-md mx-auto"
            >
              <button
                type="button"
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
                onClick={handleClose}
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex items-center justify-center">
                <img
                  className="w-24 h-24 rounded-full"
                  src={user ? user.photoURL : DefaultAvatar}
                  alt={user ? `${user.name}'s avatar` : 'Default Avatar'}
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-white">
                  {user ? user.name : 'User'}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {user && user.about ? user.about : 'Hey there!'}
                </p>
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-opacity-50"
                  onClick={handleSendMessage}
                >
                  Send Message
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
