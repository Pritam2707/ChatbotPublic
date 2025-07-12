import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import DefaultAvatar from './../../assets/images/default.png';
import { useForward } from '../hooks/useForward';
import { useContact } from '../hooks/useContacts';
import { Contact } from '../types/Contact';
import { useChat } from '../hooks/useChat';
export function ForwardModal() {
  const { openForward, setForward, showForward } = useForward();
  const { contacts } = useContact();
  const { SendMsg } = useChat();

  const handleContactClick = async (contact: Contact) => {
    await SendMsg(contact.contact.uid, null, "");
    showForward(false);
  };

  const handleClose = () => {
    showForward(false);
    setForward(null);
  };

  return (
    <Transition.Root show={openForward} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={handleClose}>
        <div className="flex items-center justify-center min-h-screen px-4 py-6">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="bg-gray-900 bg-opacity-80 rounded-lg p-4 max-w-md w-full mx-auto">
              <div className="text-white text-center mb-4">
                <h3 className="text-lg font-semibold">Forward To</h3>
              </div>

              <div className="h-[50vh] overflow-y-scroll scrollbar text-white">
                {contacts && contacts.map((contact: Contact) => (
                  <div
                    key={contact.contact.uid}
                    onClick={() => handleContactClick(contact)}
                    className="flex items-center w-full p-2 mb-2 rounded-md bg-gray-900 hover:bg-purple-300 hover:text-blue-500 cursor-pointer"
                    role="button"
                    aria-label={`Forward to ${contact.contact.name}`}
                  >
                    <div className="w-12 h-12 overflow-hidden rounded-full">
                      <img
                        src={contact.contact.photoURL || DefaultAvatar}
                        alt={`${contact.contact.name}'s avatar`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-xl pl-2">{contact.contact.name}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleClose}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  aria-label="Close forward modal"
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
