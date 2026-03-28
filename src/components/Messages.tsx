import { Message } from "./Message";
import { useCallback } from "react";

type Message = {
  text: string;
  id: number;
};

export function Messages({
  messages,
  setMessages,
}: {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}) {
  const removeFunction = useCallback(
    (id: number) => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    },
    [setMessages],
  );
  return (
    <div
      className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-0.5`}
    >
      {messages.map((msg) => (
        <Message
          key={msg.id}
          text={msg.text}
          onClose={() => removeFunction(msg.id)}
        />
      ))}
    </div>
  );
}
