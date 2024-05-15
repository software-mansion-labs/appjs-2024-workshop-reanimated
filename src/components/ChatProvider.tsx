import React, { Dispatch, createContext, useContext, useState } from "react";

interface ChatContextType {
  emojiPopupId: string | undefined;
  setEmojiPopupId: Dispatch<string | undefined>;
}

export const ChatContext = createContext<ChatContextType>({
  emojiPopupId: undefined,
  setEmojiPopupId: () => {},
});

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  // emoji popup id is the message id of the message that the emoji popup is attached to
  const [emojiPopupId, setEmojiPopupId] = useState<string | undefined>();

  return (
    <ChatContext.Provider value={{ emojiPopupId, setEmojiPopupId }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
