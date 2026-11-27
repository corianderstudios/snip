import { MdOutlineOfflineBolt } from "react-icons/md";
import { api } from "../api";

export default function Link({ id, formattedUrl, setFormattedLinks }) {
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
      <MdOutlineOfflineBolt size={20} />
      <a>{formattedUrl}</a>
      <button onClick={() => handleDeleteLink(id)}>X</button>
    </li>
  );
}
