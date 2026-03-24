import "./App.css";

function App() {
  return (
    <div className="h-screen bg-bg">
      <nav className="fixed top-0 bg-layer w-screen flex items-center justify-around p-4">
        <div className="flex justify-start px-4 w-2/5">
          <h1 className="text-3xl font-site text-white text-left">
            MathVisualizer
          </h1>
        </div>

        <ul className="flex justify-end space-x-8 text-2xl w-2/5">
          <li>
            <a
              href="/how-to-use"
              className="text-white hover:text-blue-500 font-site"
            >
              How to Use
            </a>
          </li>
          <li>
            <a
              href="/examples"
              className="text-white hover:text-blue-500 font-site"
            >
              Examples
            </a>
          </li>
          <li>
            <a
              href="/about"
              className="text-white hover:text-blue-500 font-site"
            >
              About
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default App;
