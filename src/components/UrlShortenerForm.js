import React, { useState } from "react";
import { useLogger } from "./LoggerProvider";
import { generateShortcode, isValidUrl, isValidShortcode } from "../utils/shortenerUtils";
import { cn } from "../utils/cn";

const MAX_URLS = 5;
const DEFAULT_VALIDITY = 30;

function getStoredShortUrls() {
  return JSON.parse(localStorage.getItem("short_urls") || "[]");
}

function saveShortUrls(urls) {
  localStorage.setItem("short_urls", JSON.stringify(urls));
}

const UrlShortenerForm = () => {
  const { log } = useLogger();
  const [inputs, setInputs] = useState([
    { url: "", validity: "", shortcode: "" },
  ]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleInputChange = (idx, field, value) => {
    setInputs((prev) => {
      const copy = [...prev];
      copy[idx][field] = value;
      return copy;
    });
  };

  const addInput = () => {
    if (inputs.length < MAX_URLS) {
      setInputs([...inputs, { url: "", validity: "", shortcode: "" }]);
    }
  };

  const removeInput = (idx) => {
    setInputs(inputs.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setResults([]);
    const stored = getStoredShortUrls();
    const newResults = [];
    const usedShortcodes = new Set(stored.map((u) => u.shortcode));
    for (let i = 0; i < inputs.length; i++) {
      const { url, validity, shortcode } = inputs[i];
      if (!isValidUrl(url)) {
        setError(`Row ${i + 1}: Invalid URL.`);
        log("Invalid URL input", { url });
        return;
      }
      let code = shortcode.trim();
      if (code) {
        if (!isValidShortcode(code)) {
          setError(`Row ${i + 1}: Invalid shortcode (alphanumeric, 4-12 chars).`);
          log("Invalid shortcode input", { shortcode: code });
          return;
        }
        if (usedShortcodes.has(code)) {
          setError(`Row ${i + 1}: Shortcode already in use.`);
          log("Shortcode collision", { shortcode: code });
          return;
        }
      } else {
        code = generateShortcode(usedShortcodes);
      }
      usedShortcodes.add(code);
      let validMins = parseInt(validity, 10);
      if (isNaN(validMins) || validMins <= 0) validMins = DEFAULT_VALIDITY;
      const now = new Date();
      const expires = new Date(now.getTime() + validMins * 60000);
      const shortUrl = `${window.location.origin}/${code}`;
      const entry = {
        url,
        shortcode: code,
        createdAt: now.toISOString(),
        expiresAt: expires.toISOString(),
        shortUrl,
        clicks: [],
      };
      stored.push(entry);
      newResults.push(entry);
      log("Short URL created", { shortcode: code, url });
    }
    saveShortUrls(stored);
    setResults(newResults);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="card">
        <h1 className="form-title">Shorten URLs</h1>
        <p className="form-desc">Shorten up to 5 URLs at once. Optionally set validity (minutes) and custom shortcode.</p>
        {inputs.map((input, idx) => (
          <div key={idx} className="form-row">
            <div className="form-group">
              <label className="form-label">Long URL</label>
              <input
                className="input"
                value={input.url}
                onChange={(e) => handleInputChange(idx, "url", e.target.value)}
                required
                placeholder="https://example.com"
                type="url"
              />
            </div>
            <div className="form-group" style={{maxWidth: 128}}>
              <label className="form-label">Validity (min)</label>
              <input
                className="input"
                value={input.validity}
                onChange={(e) => handleInputChange(idx, "validity", e.target.value)}
                type="number"
                min="1"
                placeholder="30"
              />
            </div>
            <div className="form-group" style={{maxWidth: 160}}>
              <label className="form-label">Custom Shortcode</label>
              <input
                className="input"
                value={input.shortcode}
                onChange={(e) => handleInputChange(idx, "shortcode", e.target.value)}
                placeholder="(optional)"
              />
            </div>
            {inputs.length > 1 && (
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeInput(idx)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <div className="form-actions">
          <button
            type="button"
            className="button secondary"
            onClick={addInput}
            disabled={inputs.length >= MAX_URLS}
          >
            Add URL
          </button>
          <button type="submit" className="button">
            Shorten
          </button>
        </div>
        {error && <div className="alert">{error}</div>}
      </form>
      {results.length > 0 && (
        <div className="card">
          <h2 className="form-title" style={{fontSize: '1.15rem'}}>Shortened URLs</h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            {results.map((r, i) => (
              <div key={i} style={{borderRadius: '0.75rem', border: '1px solid var(--border)', background: 'var(--muted)', padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.25rem'}}>
                <div style={{fontSize: '0.95rem', color: 'var(--muted-foreground)'}}>Original:</div>
                <div style={{fontWeight: 500, wordBreak: 'break-all'}}>{r.url}</div>
                <div style={{fontSize: '0.95rem', color: 'var(--muted-foreground)'}}>Short URL:</div>
                <a href={r.shortUrl} className="font-mono text-primary underline break-all">{r.shortUrl}</a>
                <div style={{fontSize: '0.95rem', color: 'var(--muted-foreground)'}}>
                  Expires: {new Date(r.expiresAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlShortenerForm; 