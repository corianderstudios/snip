import React from "react";

export default function URLInput() {
  const [value, setValue] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setValue("");
  };

  return (
    <form>
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
  );
}
