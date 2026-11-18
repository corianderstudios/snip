export default function Link({ url, formattedUrl }) {
  return (
    <div>
      <a href={url}>{formattedUrl}</a>
      <button>X</button>
    </div>
  );
}
