import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    window.addEventListener("message", hitMessageHandler);
    return () => {
      window.removeEventListener("message", hitMessageHandler);
    };
  }, []);

  const hitMessageHandler = (event) => {
    if (event.origin !== "http://localhost:3000") return;

    if (event.data.type === "boxHit") {
      console.log("boxHit Message Received");
    }
  };

  return <></>;
}

export default App;
