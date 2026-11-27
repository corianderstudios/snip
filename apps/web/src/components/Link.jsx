import { api } from "../api";

export default function Link({ id, shortUrl, setFormattedLinks }) {
  const handleDeleteLink = async (id) => {
    try {
      await api.deleteLink(id);
      setFormattedLinks((prev) => prev.filter((link) => link.id !== id));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <li>
      <a href={shortUrl} target="_blank" rel="noreferrer">
        {shortUrl}
      </a>
      <button onClick={() => handleDeleteLink(id)}>X</button>
    </li>
  );
}
