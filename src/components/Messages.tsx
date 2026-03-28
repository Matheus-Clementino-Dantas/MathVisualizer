import { Message } from "./Message";

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
  return (
    <div
      className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-0.5 w-4/5`}
    >
      {messages.map((msg) => (
        <Message
          key={msg.id}
          text={msg.text}
          onClose={() =>
            setMessages((prev) => prev.filter((m) => m.id !== msg.id))
          }
        />
      ))}
    </div>
  );
}
