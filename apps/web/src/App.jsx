import { useEffect, useState } from "react";
import { API_URL, formatGreeting } from "@repo/shared";

export default function App() {
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/hello`)
      .then((res) => res.json())
      .then((data) => setApiMessage(data.message));
  }, []);

  return (
    <div>
      <h1>{formatGreeting("React")}</h1>
      <p>Server says: {apiMessage}</p>
    </div>
  );
}
