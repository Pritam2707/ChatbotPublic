import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import DeleteMessage from '../database/deletemsg';
import { useMessageInfo } from '../hooks/useMessageInfo';
import { useReply } from "../hooks/useReply";
import { useEditMessage } from '../hooks/useEditMessage';
import { useChat } from "../hooks/useChat";
import { useForward } from "../hooks/useForward";
import { AES, enc } from 'crypto-js';
import Searchuser from '../database/searchuser';

export function Messageinfo() {
  const { message, openMessageInfo, showMessageInfo, setMessageInfo, isSentByUser } = useMessageInfo();
  const { setReply, showReply } = useReply();
  const { chatRef, reciever } = useChat();
  const { setEditMessage, setIsEditActive } = useEditMessage();
  const { setForward, showForward } = useForward();

  // Decrypt message text
  const DecodedText = message ? AES.decrypt(message.text, message.reciever).toString(enc.Utf8) : '';

  const handleReply = async () => {
    if (message) {
      try {
        setReply(DecodedText, reciever ? reciever.name : "");
        showReply(true);
        closeMessageInfo();
      } catch (error) {
        console.error("Error fetching user for reply:", error);
      }
    }
  };

  const handleForward = () => {
    if (message) {
      const forwardMessage = { ...message, text: DecodedText };
      setForward(forwardMessage);
      showForward(true);
    }
  };

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(DecodedText);
    const button = e.currentTarget;
    button.innerText = "Copied!";
    setTimeout(() => { button.innerText = "Copy message"; }, 5000);
  };

  const handleEdit = () => {
    if (message && DecodedText) {
      const editMessage = { ...message, text: DecodedText };
      setEditMessage(editMessage);
      setIsEditActive(true);
      closeMessageInfo();
    }
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (message) {
      const docref = `${chatRef}/${message.messageId}`;
      try {
        const res = await DeleteMessage(docref);
        e.currentTarget.innerText = res ? res : "Failed!";
      } catch (error) {
        console.error("Error deleting message:", error);
      }
      setTimeout(() => { closeMessageInfo(); }, 500);
    }
  };

  const closeMessageInfo = () => {
    setMessageInfo(null);
    showMessageInfo(false, false);
  };

  return (
    <Transition.Root show={openMessageInfo} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => { }}>
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
                <h3 className="text-lg font-semibold">Message Info</h3>
              </div>

              <div className="break-words text-white max-w-full p-2 rounded-md bg-purple-900 mb-4">
                {message?.imageURL && <img src={message.imageURL} alt="Message attachment" className="mb-2 rounded" />}
                <p>{DecodedText}</p>
              </div>

              <div className="flex justify-between mb-4">
                <button
                  className="w-1/2 mr-2 py-2 bg-gray-900 text-white rounded-xl transition-all hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  onClick={handleReply}
                  aria-label="Reply to message"
                >
                  Reply message
                </button>
                <button
                  className="w-1/2 ml-2 py-2 bg-gray-900 text-white rounded-xl transition-all hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  onClick={handleForward}
                  aria-label="Forward message"
                >
                  Forward message
                </button>
              </div>

              <div className="flex justify-between mb-4">
                <button
                  className="w-1/2 mr-2 py-2 bg-gray-900 text-white rounded-xl transition-all hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  onClick={handleCopy}
                  aria-label="Copy message to clipboard"
                >
                  Copy message
                </button>
                {isSentByUser && (
                  <button
                    type="button"
                    className="w-1/2 ml-2 py-2 bg-gray-900 text-white rounded-xl transition-all hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    onClick={handleEdit}
                    aria-label="Edit message"
                  >
                    Edit message
                  </button>
                )}
              </div>

              {isSentByUser && message && (
                <button
                  className="w-full py-2 my-2 bg-gray-900 text-white rounded-xl transition-all hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  onClick={handleDelete}
                  aria-label="Delete message for everyone"
                >
                  Delete for everyone
                </button>
              )}

              <div className="text-center">
                <button
                  className="w-full py-2 mt-4 bg-gray-900 text-white rounded-xl transition-all hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  onClick={closeMessageInfo}
                  aria-label="Close message info"
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
