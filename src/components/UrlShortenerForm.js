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

const inputBase =
  "block w-full rounded-md border border-input bg-card px-3 py-2 text-base text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition";
const labelBase = "block mb-1 text-sm font-medium text-muted-foreground";
const cardBase =
  "bg-card border border-border rounded-xl shadow p-6 mb-6 flex flex-col gap-4";
const buttonBase =
  "inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 font-semibold shadow hover:bg-primary/90 transition disabled:opacity-50 disabled:pointer-events-none";
const alertBase =
  "rounded-md border border-destructive bg-destructive/10 text-destructive px-4 py-2 mb-2";

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
      <form onSubmit={handleSubmit} className={cardBase}>
        <h1 className="text-2xl font-bold mb-2">Shorten URLs</h1>
        <p className="text-muted-foreground mb-4">Shorten up to 5 URLs at once. Optionally set validity (minutes) and custom shortcode.</p>
        {inputs.map((input, idx) => (
          <div key={idx} className="flex flex-col md:flex-row gap-2 items-end mb-2">
            <div className="flex-1">
              <label className={labelBase}>Long URL</label>
              <input
                className={inputBase}
                value={input.url}
                onChange={(e) => handleInputChange(idx, "url", e.target.value)}
                required
                placeholder="https://example.com"
                type="url"
              />
            </div>
            <div className="w-32">
              <label className={labelBase}>Validity (min)</label>
              <input
                className={inputBase}
                value={input.validity}
                onChange={(e) => handleInputChange(idx, "validity", e.target.value)}
                type="number"
                min="1"
                placeholder="30"
              />
            </div>
            <div className="w-40">
              <label className={labelBase}>Custom Shortcode</label>
              <input
                className={inputBase}
                value={input.shortcode}
                onChange={(e) => handleInputChange(idx, "shortcode", e.target.value)}
                placeholder="(optional)"
              />
            </div>
            {inputs.length > 1 && (
              <button
                type="button"
                className="ml-2 text-destructive hover:underline"
                onClick={() => removeInput(idx)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            className={cn(buttonBase, "bg-muted text-foreground hover:bg-muted/80")}
            onClick={addInput}
            disabled={inputs.length >= MAX_URLS}
          >
            Add URL
          </button>
          <button type="submit" className={buttonBase}>
            Shorten
          </button>
        </div>
        {error && <div className={alertBase}>{error}</div>}
      </form>
      {results.length > 0 && (
        <div className={cardBase}>
          <h2 className="text-lg font-semibold mb-2">Shortened URLs</h2>
          <div className="flex flex-col gap-2">
            {results.map((r, i) => (
              <div key={i} className="rounded-lg border border-border bg-muted/40 px-4 py-3 flex flex-col md:flex-row md:items-center gap-2">
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Original:</div>
                  <div className="font-medium break-all">{r.url}</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Short URL:</div>
                  <a href={r.shortUrl} className="font-mono text-primary underline break-all">{r.shortUrl}</a>
                </div>
                <div className="text-sm text-muted-foreground">
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