import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Client } from "@heroiclabs/nakama-js";

function App() {
  const [isHit, setIsHit] = useState(false);
  const setTiemOutRef = useRef(null);

  useEffect(() => {
    var useSSL = false;
    var client = new Client("defaultkey", "127.0.0.1", "7350", useSSL);

    client.authenticateCustom("test_id").then((session) => {
      console.log(session);
    });
  });

  useEffect(() => {
    window.pc.app.on("boxHit", hitMessageHandler);
    // window.addEventListener("message", hitMessageHandler);
    return () => {
      window.pc.app.off("boxHit", hitMessageHandler);
      // window.removeEventListener("message", hitMessageHandler);
    };
  }, []);

  const hitMessageHandler = (event) => {
    // if (event.origin !== "http://localhost:3000") return;

    clearTimeout(setTiemOutRef.current);

    setIsHit(true);
    setTiemOutRef.current = setTimeout(() => {
      setIsHit(false);
    }, 2000);
  };

  return (
    <div className="App">
      {isHit && <div className="Popup">Box is hit!</div>}
    </div>
  );
}

export default App;
