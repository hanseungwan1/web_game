import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [isHit, setIsHit] = useState(false);
  const setTiemOutRef = useRef(null);

  useEffect(() => {
    window.addEventListener("message", hitMessageHandler);
    return () => {
      window.removeEventListener("message", hitMessageHandler);
    };
  }, []);

  const hitMessageHandler = (event) => {
    if (event.origin !== "http://localhost:3000") return;

    clearTimeout(setTiemOutRef.current);

    if (event.data.type === "boxHit") {
      setIsHit(true);
      setTiemOutRef.current = setTimeout(() => {
        setIsHit(false);
      }, 2000);
    }
  };

  return (
    <div className="App">
      {isHit && <div className="Popup">Box is hit!</div>}
    </div>
  );
}

export default App;
