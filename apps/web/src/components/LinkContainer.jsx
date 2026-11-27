import Link from "./Link";

export default function LinkContainer({ formattedLinks, setFormattedLinks }) {
  return (
    <div>
      <h3>Your Links</h3>
      <ul>
        {formattedLinks.map(({ id, shortUrl }) => (
          <Link
            key={id}
            id={id}
            shortUrl={shortUrl}
            setFormattedLinks={setFormattedLinks}
          />
        ))}
      </ul>
    </div>
  );
}
