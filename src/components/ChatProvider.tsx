import React, { Dispatch, createContext, useContext, useState } from "react";

interface ChatContextType {
  currentPopupId: string | undefined;
  setCurrentPopupId: Dispatch<string | undefined>;
}

export const ChatContext = createContext<ChatContextType>({
  currentPopupId: undefined,
  setCurrentPopupId: () => {},
});

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  // emoji popup id is the message id of the message that the emoji popup is attached to
  const [currentPopupId, setCurrentPopupId] = useState<string | undefined>();

  return (
    <ChatContext.Provider value={{ currentPopupId, setCurrentPopupId }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
