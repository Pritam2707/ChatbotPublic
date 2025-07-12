import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useNotification } from '../hooks/useNotification';

export function Notifications() {
  const { notifications, openNotification, showNotification } = useNotification();

  // Handler for closing the dialog
  const handleClose = () => showNotification(false);

  return (
    <Transition.Root show={openNotification} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={handleClose}
        aria-labelledby="notifications-title"
        aria-describedby="notifications-description"
      >
        <div className="flex items-center justify-center min-h-screen px-4 py-6">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition-transform ease-out duration-300"
            enterFrom="translate-y-8 opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transition-transform ease-in duration-200"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="translate-y-8 opacity-0"
          >
            <div className="relative z-50 bg-gray-900 rounded-lg p-6 w-full max-w-md mx-auto">
              <div className="flex items-center mb-4">
                <BellIcon className="h-6 w-6 text-gray-200" aria-hidden="true" />
                <h3 id="notifications-title" className="ml-2 text-lg font-semibold text-gray-200">
                  Notifications
                </h3>
              </div>
              <div id="notifications-description overflow-y-scroll scrollbar">
                {notifications.length === 0 ? (
                  <p className="text-gray-400">No notifications available.</p>
                ) : (
                  <ul className="divide-y divide-gray-700">
                    {notifications.map((notification) => (
                      <li key={notification.id} className="py-2">
                        <p className="text-gray-200">{notification.text}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-opacity-50"
                  onClick={handleClose}
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
