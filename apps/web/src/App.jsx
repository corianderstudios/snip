import { useEffect, useState } from "react";

export default function App() {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setValue("");
  };

  useEffect(() => {}, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="short-url">Enter url: </label>
        <input
          id="short-url"
          required
          type="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
