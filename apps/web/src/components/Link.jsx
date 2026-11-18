export default function Link({ url, formattedUrl }) {
  return (
    <li>
      <a href={url}>{formattedUrl}</a>
      <button>X</button>
    </li>
  );
}
