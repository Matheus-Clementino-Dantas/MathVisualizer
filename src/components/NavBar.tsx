import { AudioWaveform } from "lucide-react";
import { GithubIcon } from "./Githubicon";

export function NavBar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-layer/80 border-b border-gray-900 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          <div className="shrink-0">
            <h1 className="text-lg font-site font-bold text-white tracking-wider md:text-2xl">
              <span className="text-green-500">Math</span>Visualizer
              <AudioWaveform className="inline" />
            </h1>
          </div>

          <ul className="flex items-center space-x-4 sm:space-x-6">
            <li>
              <a
                href="#grafico"
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium sm:text-lg"
              >
                Guide
              </a>
            </li>
            <li>
              <a
                href="#teoria"
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium sm:text-lg"
              >
                About
              </a>
            </li>
            <li className="text-white">
              <a href="https://github.com/seu-user" target="_blank">
                <GithubIcon className="w-6 h-6" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
