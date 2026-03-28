import { AudioWaveform, SunMoon, Play } from "lucide-react";
import { GithubIcon } from "./Githubicon";
import { useState, useEffect } from "react";

export function NavBar({
  processCommand,
}: {
  processCommand: (input: string) => void;
}) {
  const [command, setCommand] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">(
    (localStorage.getItem("theme") as "dark" | "light") || "dark",
  );

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          <div className="shrink-0 ">
            <h1 className="text-lg font-site font-bold text-text tracking-wider lg:text-2xl ">
              <span className="text-green-500">Math</span>Visualizer
              <AudioWaveform className="inline" />
            </h1>
          </div>
          <div className="min-w-80 max-w-xl fixed bottom-4 left-1/2 -translate-x-1/2 md:relative md:flex-1 md:mx-8 md:bottom-0 md:translate-x-0 md:left-0 backdrop-blur-sm">
            <div className="flex items-center  border border-gray-700 rounded-lg px-4 py-2 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-all">
              <span className="text-green-500 font-site font-bold mr-3 animate-pulse">
                &gt;
              </span>

              <input
                type="text"
                className="bg-transparent text-text font-site tracking-wider w-full outline-none placeholder-gray-600 text-sm md:text-lg "
                placeholder="commands ex: quad 2 -4 5"
                autoComplete="off"
                spellCheck="false"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    processCommand(command);
                    setCommand("");
                  }
                }}
              />
              <button
                className="text-green-500 cursor-pointer"
                aria-label="execute"
                onClick={() => {
                  processCommand(command);
                  setCommand("");
                }}
              >
                <Play />
              </button>
            </div>
          </div>

          <ul className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
            <li>
              <a
                href="#willbeimplementedsoon"
                className="text-text hover:text-green-500 transition-colors text-sm font-medium lg:text-lg"
              >
                Guide
              </a>
            </li>
            <li>
              <a
                href="#willbeimplementedsoon"
                className="text-text hover:text-green-500 transition-colors text-sm font-medium lg:text-lg"
              >
                About
              </a>
            </li>
            <li className="text-text hover:text-green-500">
              <a
                href="https://github.com/Matheus-Clementino-Dantas/MathVisualizer"
                target="_blank"
              >
                <GithubIcon className="w-4 h-4 sm:w-6 sm:h-6" />
              </a>
            </li>
            <li>
              <button
                className={`cursor-pointer flex text-text justify-center transition-colors items-center ${theme === "light" ? "hover:text-indigo-400" : "hover:text-amber-300"}`}
                onClick={toggleTheme}
              >
                <SunMoon className="w-5 h-5 sm:w-8 sm:h-8" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
