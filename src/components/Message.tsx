import { useState, useEffect } from "react";
export function Message({
  text,
  onClose,
}: {
  text: string;
  onClose: () => void;
}) {
  const [fade, setFade] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
    }, 3000);
    const removeTimer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [onClose]);

  if (!text) return null;
  return (
    <div
      className={`bg-text/20 text-text py-0.5 font-site tracking-wide px-1 rounded-sm backdrop-blur-sm z-50 transition-opacity duration-1000 ${fade ? "opacity-0" : "opacity-100"}`}
    >
      <p className="text-sm">{text}</p>
    </div>
  );
}
