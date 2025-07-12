import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useError } from '../hooks/useError';

export function Error() {
  const { title, body, openError, setisError } = useError();

  const handleClose = () => setisError(false);

  return (
    <Transition.Root show={openError} as={Fragment}>
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
            <div
              className="bg-gray-900 bg-opacity-80 rounded-lg p-4 max-w-md w-full mx-auto"
              role="alertdialog"
              aria-labelledby="error-title"
              aria-describedby="error-body"
            >
              <div className="flex items-center mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-700 mr-2" aria-hidden="true" />
                <h3 id="error-title" className="text-lg font-semibold text-white">{title}</h3>
              </div>

              <div className="text-white mt-4">
                <p
                  id="error-body"
                  className="p-2 border-r-2 border-solid border-black bg-gray-600 overflow-y-scroll scrollbar rounded-2xl max-h-48"
                >
                  {body}
                </p>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleClose}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
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
