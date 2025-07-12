import React, { Dialog, Transition } from '@headlessui/react';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import { Fragment, useState } from 'react';
import { useSetting } from './hooks/useSettings';
import { useAuth } from './hooks/useAuth';

export default function Settings() {
  const [copyText, setCopyText] = useState('Copy');
  const { showSetting, openSetting } = useSetting();
  const { uid, name, photoURL, isAuthenticated } = useAuth();

  const handleCopyClick = () => {
    navigator.clipboard.writeText(uid || '');
    setCopyText('Copied!');
    setTimeout(() => {
      setCopyText('Copy');
    }, 2000);
  };

  return (
    <Transition.Root show={openSetting} as={Fragment}>
      <Dialog onClose={() => showSetting(false)} className="fixed inset-0 z-50 overflow-y-auto">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
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
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-lg p-6 text-gray-100">
              {/* User Details */}
              <div className="flex items-center space-x-4">
                {isAuthenticated && (
                  <img src={photoURL || ''} alt="User avatar" className="w-12 h-12 rounded-full" />
                )}
                <p className="text-lg font-semibold">{name}</p>
              </div>

              {/* UID */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <ClipboardIcon className="w-5 h-5 text-gray-400" />
                  <p className="text-sm font-medium text-gray-400">UID:</p>
                </div>
                <button
                  className="flex items-center justify-center px-3 py-1 text-sm font-medium text-gray-400 transition-colors duration-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  onClick={handleCopyClick}
                >
                  {copyText}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">{uid}</p>

              {/* Other Settings */}
              <div className="mt-6 space-y-4">
                <div className="text-gray-400 text-sm font-semibold">Profile</div>
                <div className="text-sm cursor-pointer hover:bg-gray-700 rounded-md p-2 transition-colors">
                  Update profile picture
                </div>
                <div className="text-sm cursor-pointer hover:bg-gray-700 rounded-md p-2 transition-colors">
                  Update about
                </div>
                <div className="text-gray-400 text-sm font-semibold">About</div>
                <div className="text-sm">Chatbot version: 2.0.4</div>
                <div className="text-sm">No ads. Enjoy! :)</div>
                <div className="text-gray-400 text-sm font-semibold">Note</div>
                <p className="text-sm">
                  Some features are still under development and might not work as expected.
                </p>
                <div className="text-gray-400 text-sm font-semibold">Credits</div>
                <p className="text-sm">
                  Illustration for app logo:{' '}
                  <a
                    href="https://www.freepik.com/free-vector/cute-robot-holding-phone-with-laptop-cartoon-vector-icon-illustration-science-technology-isolated_26569089.htm#query=technology%20cartoon&position=3&from_view=keyword&track=ais"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Image by catalyststuff on Freepik
                  </a>
                </p>
              </div>

              {/* Close Button */}
              <button
                className="block w-full px-4 py-2 mt-6 text-sm font-medium text-gray-100 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={() => showSetting(false)}
              >
                Close
              </button>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
}
