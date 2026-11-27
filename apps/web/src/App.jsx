import { useEffect, useState } from "react";
import { api } from "./api";
import Link from "./components/Link";
import URLInput from "./components/URLInput";

export default function App() {
  const [urlValue, setUrlValue] = useState("");
  const [formattedLinks, setFormattedLinks] = useState([]);

  const handleCreateURL = async () => {
    setUrlValue("");
    await api.createLink(urlValue).then((data) => {
      const { id, url, shortCode } = data;
      const urlString = new URL(url);
      const newLink = {
        id,
        url,
        formattedUrl: `${urlString.hostname}/${shortCode}`,
      };
      setFormattedLinks([...formattedLinks, newLink]);
    });
  };

  useEffect(() => {
    async function getLinks() {
      const response = await api.listLinks();
      console.log("response", response);
      // setFormattedLinks(...response);
    }
    getLinks();
  }, []);

  return (
    <div>
      <h1>Snip</h1>
      <h3>link shortener</h3>
      <URLInput
        handleCreateURL={handleCreateURL}
        urlValue={urlValue}
        setUrlValue={setUrlValue}
      />
      <ul>
        {formattedLinks.map(({ id, url, formattedUrl }) => (
          <Link
            key={id}
            id={id}
            url={url}
            formattedUrl={formattedUrl}
            setFormattedLinks={setFormattedLinks}
          />
        ))}
      </ul>
    </div>
  );
}
