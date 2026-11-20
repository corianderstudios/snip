import { MdOutlineOfflineBolt } from "react-icons/md";

export default function Link({ url, formattedUrl }) {
  return (
    <li>
      <MdOutlineOfflineBolt size={20} />
      <a href={url}>{formattedUrl}</a>
      <button>X</button>
    </li>
  );
}
