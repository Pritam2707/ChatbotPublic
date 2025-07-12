import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useAddContact } from '../hooks/useAddContact';

export function AddContact() {
  const {
    loading,
    AddContact,
    ContactUid,
    HumanName,
    chatbots,
    isHuman,
    openAddContact,
    setContactUid,
    setHumanName,
    setisHuman,
    showAddContact
  } = useAddContact();

  const [searchInput, setSearchInput] = useState(''); // State for search input

  const handleHumanClick = () => setisHuman(true);
  const handleChatbotClick = () => setisHuman(false);
  const handleCancelClick = () => showAddContact(false);
  const handleAddClick = () => {
    if (isHuman && !loading) {
      AddContact();
    }
  };
  const handleChatbotClickItem = (uid: string) => {
    setContactUid(uid);
    showAddContact(false);
  };
  useEffect(() => {
    if (ContactUid.length > 0 && !isHuman) {
      AddContact(); // Add contact when ContactUid is set and is not human
    }
  }, [ContactUid, isHuman]);

  // Filter chatbots based on search input
  const filteredChatbots = chatbots.filter((chatbot) =>
    chatbot.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <Transition.Root show={openAddContact} as={Fragment}>
      <Dialog onClose={handleCancelClick} as="div" className="fixed inset-0 z-10 overflow-y-auto">
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
            <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-40 transition-opacity" />
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
            <div className="bg-gray-800 bg-opacity-80 rounded-lg p-4 max-w-md w-full mx-auto">
              <div className="flex items-center justify-between mb-4">
                <UserCircleIcon className="h-6 w-6 text-gray-200" />
                <h3 className="text-lg font-semibold text-gray-200">
                  Add New Contact {loading && "(Loading...)"}
                </h3>
                <button className="text-gray-400 hover:text-gray-600" onClick={handleCancelClick}>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="select-none space-y-4 text-gray-200">
                <div>
                  <button
                    type='button'
                    onClick={handleHumanClick}
                    className={`rounded-md cursor-pointer p-1 mr-2 ${isHuman ? 'bg-blue-600' : 'bg-blue-900'}`}
                    aria-pressed={isHuman}
                  >
                    Human
                  </button>
                  <button
                    onClick={handleChatbotClick}
                    className={`rounded-md cursor-pointer p-1 ${!isHuman ? 'bg-blue-600' : 'bg-blue-900'}`}
                    aria-pressed={!isHuman}
                  >
                    Chatbot
                  </button>
                </div>

                {isHuman && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={HumanName}
                      onChange={(e) => setHumanName(e.target.value)}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md bg-gray-700 text-white px-3 py-2"
                      aria-required="true"
                    />

                    <label htmlFor="uid" className="block text-sm font-medium text-gray-200">
                      UID
                    </label>
                    <input
                      id="uid"
                      type="text"
                      value={ContactUid}
                      onChange={(e) => { if (isHuman) setContactUid(e.target.value); }}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md bg-gray-700 text-white px-3 py-2"
                      aria-required="true"
                    />

                    <p className="text-sm text-gray-400">
                      *Please ask the UID of your friend from another source.
                    </p>
                    <p className="text-sm text-gray-400 cursor-pointer hover:underline">
                      How to find UID?
                    </p>
                  </div>
                )}

                {!isHuman && (
                  <div>
                    {/* Search bar for chatbots */}
                    <div className="flex justify-between mb-5">
                      <label htmlFor="search">
                        <svg className="w-6 mt-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                      </label>
                      <input
                        type="text"
                        placeholder="Search Chatbot"
                        id="search"
                        className="my-2 w-full text-sm bg-gray-900 focus:bg-gray-500 text-gray-200 rounded h-10 p-3 focus:outline-none"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                      />
                    </div>

                    <div id="chatbot-list" className="overflow-y-scroll max-h-64 scrollbar bg-gray-700 rounded-md p-2">
                      <h1 className="text-center mb-2">Available chatbots</h1>
                      {filteredChatbots.length > 0 ? (
                        filteredChatbots.map((chatbot) => (
                          <div
                            key={chatbot.uid}
                            className="hover:bg-gray-700 bg-gray-600 rounded-md p-1 m-1 flex items-center cursor-pointer"
                            onClick={() => handleChatbotClickItem(chatbot.uid)}
                          >
                            <img className="w-12 h-12 rounded-full p-1" src={chatbot.photoURL} alt={chatbot.name} />
                            <p className="mx-auto text-md">{chatbot.name}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-400">No chatbots found</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-4 space-x-4">
                {isHuman && !loading && (
                  <button
                    onClick={handleAddClick}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  >
                    Add
                  </button>
                )}
                <button
                  onClick={handleCancelClick}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
