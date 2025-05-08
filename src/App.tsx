import "./App.css";
import { AudioProvider } from "./components/context";
import RoutesMiddleware from "./routes/routesMiddleware";

function App() {
  return (
    <AudioProvider>
      <RoutesMiddleware />
    </AudioProvider>
  );
}

export default App;
