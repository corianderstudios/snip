export default function URLInput({ handleCreateURL, urlValue, setUrlValue }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    setUrlValue("");
    handleCreateURL(urlValue);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="short-url">Enter url: </label>
      <input
        id="short-url"
        required
        type="url"
        value={urlValue}
        onChange={(e) => setUrlValue(e.target.value)}
      />
      <button type="submit">+ shorten link</button>
    </form>
  );
}
