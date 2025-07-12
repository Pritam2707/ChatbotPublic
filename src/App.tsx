// Import necessary dependencies and components
import React from 'react'; // React core library
import Welcome from './components/welcome'; // Welcome component
import Body from './components/body'; // Main screen content
import Navbar from './components/navbar'; // Navbar component
import { Notifications } from './components/modal/notifs'; // Notifications modal component
import { AddContact } from './components/modal/add'; // Add contact modal component
import Settings from './components/settings'; // Settings component
import { Messageinfo } from './components/modal/messageinfo'; // Message information modal component
import { Userinfo } from './components/modal/userinfo'; // User information modal component
import { Error } from './components/modal/error'; // Error modal component
import { useAuth } from './components/hooks/useAuth';
import { ErrorProvider } from './components/hooks/useError';
import { AddContactProvider } from './components/hooks/useAddContact';
import { SettingProvider } from './components/hooks/useSettings';
import { NotificationProvider } from './components/hooks/useNotification';
import { MessageInfoProvider } from './components/hooks/useMessageInfo';
import { UserInfoProvider } from './components/hooks/useUserInfo';
import { ForwardProvider } from './components/hooks/useForward';
import { ReplyProvider } from './components/hooks/useReply';
import { ChatProvider } from './components/hooks/useChat';
import { ContactProvider } from './components/hooks/useContacts';
import { EditMessageProvider } from './components/hooks/useEditMessage';
import { ChatbotProvider } from './components/hooks/useChatbot';

function App() {

  const { isAuthenticated } = useAuth();

  // Conditional rendering based on user login state
  if (isAuthenticated) {
    return (
      <div className="bg-gray-800 w-screen h-screen App">
        <ErrorProvider>
          <AddContactProvider>
            <SettingProvider>
              <NotificationProvider>
                <Navbar />
                <Notifications />
                <AddContact />
                <Settings />
              </NotificationProvider>
            </SettingProvider>
            <ForwardProvider>
              <ReplyProvider>
                <EditMessageProvider>
                  <ChatbotProvider>
                    <ChatProvider>
                      <MessageInfoProvider>
                        <UserInfoProvider>
                          <ContactProvider>
                            <Body />
                          </ContactProvider>
                          <Userinfo />
                        </UserInfoProvider>
                        <Messageinfo />
                      </MessageInfoProvider>
                    </ChatProvider>
                  </ChatbotProvider>
                </EditMessageProvider>
              </ReplyProvider>
            </ForwardProvider>
            <Error />
          </AddContactProvider>
        </ErrorProvider>
      </div >
    );
  } else {
    return (
      <div className="bg-gray-700 w-screen h-screen App">
        <ErrorProvider>


          <AddContactProvider>
            <SettingProvider>
              <NotificationProvider>
                <Navbar />
                <AddContact />

              </NotificationProvider>
            </SettingProvider>
          </AddContactProvider>

          <Welcome />
        </ErrorProvider>

      </div>
    );
  }
}

export default App;
