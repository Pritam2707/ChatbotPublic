import React from 'react';
import login from './authentication/login';
import googleLogo from '../assets/images/google_logo.png';

function Welcome() {
    const handleLogin = async () => {
        login();
    };

    return (
        <div className="text-white h-screen flex flex-col justify-center items-center bg-gray-700 relative">
            <h1 className="text-3xl text-center md:text-6xl animate-slidedown mb-10 z-10 absolute top-0">Welcome to Chatbot!!</h1>
            <div className="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-gray-700 bg-opacity-80">
                <div className="w-5/6 md:w-1/2 lg:w-1/3 rounded-xl bg-white dark:bg-gray-800 shadow-xl p-8 animate-slide z-20">
                    <div className="space-y-4">
                        <svg className="inline w-5 h-5 fill-current text-cyan-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z" /></svg>
                        <h2 className="text-2xl text-cyan-900 dark:text-white font-bold">Log in Chatbot!</h2>
                    </div>

                    <div className="mt-10 grid space-y-4">
                        <button onClick={handleLogin} className="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100">
                            <div className="flex items-center space-x-1 justify-center">
                                <img src={googleLogo} className="w-5" alt="Google logo" />
                                <span className="block font-semibold tracking-wide text-gray-700 dark:text-white text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">Continue with Google</span>
                            </div>
                        </button>
                    </div>

                    <div className="mt-14 space-y-4 py-3 text-gray-600 dark:text-gray-400 text-center">
                        <p className="text-xs">By proceeding, you agree to our <a href="terms" target='_blank' rel="noopener noreferrer" className="underline">Terms of Use</a> and confirm you have read our <a href="terms" target='_blank' rel="noopener noreferrer" className="underline">Privacy and Cookie Statement</a>.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Welcome;
