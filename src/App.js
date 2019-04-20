import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const App = () => {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("react hooks");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchInputRef = useRef();

  useEffect(() => {
    getResults();
  }, []);

  const getResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://hn.algolia.com/api/v1/search?query=${query}`
      );
      const data = await response.data.hits;
      setResults(data);
    } catch (err) {
      setError(err);
    }

    setLoading(false);
  };

  const handleInput = e => {
    setQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setQuery("");
    searchInputRef.current.focus();
  };

  const handleSubmit = e => {
    e.preventDefault();
    getResults();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={handleInput}
          value={query}
          ref={searchInputRef}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={handleClearSearch}>
          Clear input
        </button>
      </form>
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <ul style={{ listStyle: "none" }}>
          {results.map(result => (
            <li style={{ padding: "5px 0" }} key={result.objectID}>
              <a
                style={{ textDecoration: "none" }}
                href={result.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {result.title}
              </a>
            </li>
          ))}
        </ul>
      )}
      {error && <h3>{error.message}</h3>}
    </>
  );
};

export default App;
