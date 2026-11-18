import { useState } from "react";
import { api } from "./api";
import Link from "./components/Link";
import URLInput from "./components/URLInput";

export default function App() {
  const [urlValue, setUrlValue] = useState("");
  const [formattedLinks, setFormattedLinks] = useState([]);

  const handleCreateURL = async () => {
    setUrlValue("");
    await api.createLink(urlValue).then((data) => {
      const { url, shortCode } = data;
      const urlString = new URL(url);

      const newLink = {
        url,
        formattedUrl: `${urlString.hostname}/${shortCode}`,
      };
      setFormattedLinks([...formattedLinks, newLink]);
    });
  };

  return (
    <div>
      <URLInput
        handleCreateURL={handleCreateURL}
        urlValue={urlValue}
        setUrlValue={setUrlValue}
      />

      <ul>
        {formattedLinks.map(({ url, formattedUrl }) => (
          <Link
            key={crypto.randomUUID()}
            url={url}
            formattedUrl={formattedUrl}
          />
        ))}
      </ul>
    </div>
  );
}
