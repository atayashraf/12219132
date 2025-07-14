import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLogger } from "./LoggerProvider";

function getStoredShortUrls() {
  return JSON.parse(localStorage.getItem("short_urls") || "[]");
}

function saveShortUrls(urls) {
  localStorage.setItem("short_urls", JSON.stringify(urls));
}

async function getGeoLocation() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) return null;
    const data = await res.json();
    return data.city ? `${data.city}, ${data.country_name}` : data.country_name || null;
  } catch {
    return null;
  }
}

export default function RedirectHandler() {
  const { shortcode } = useParams();
  const { log } = useLogger();
  const [error, setError] = useState("");

  useEffect(() => {
    async function handleRedirect() {
      const urls = getStoredShortUrls();
      const idx = urls.findIndex((u) => u.shortcode === shortcode);
      if (idx === -1) {
        setError("Short URL not found or expired.");
        log("Redirection failed: shortcode not found", { shortcode });
        return;
      }
      const urlEntry = urls[idx];
      if (new Date(urlEntry.expiresAt) < new Date()) {
        setError("This short URL has expired.");
        log("Redirection failed: shortcode expired", { shortcode });
        return;
      }
      // Log click
      const click = {
        timestamp: new Date().toISOString(),
        source: document.referrer || "direct",
        geo: await getGeoLocation(),
      };
      urlEntry.clicks.push(click);
      urls[idx] = urlEntry;
      saveShortUrls(urls);
      log("Short URL clicked", { shortcode, click });
      // Redirect
      window.location.href = urlEntry.url;
    }
    handleRedirect();
    // eslint-disable-next-line
  }, [shortcode]);

  if (error) {
    return (
      <div style={{minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div className="alert">{error}</div>
        <a href="/" className="text-primary underline" style={{marginTop: '1rem'}}>Go Home</a>
      </div>
    );
  }
  return (
    <div style={{minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div className="spinner" />
      <div className="text-muted-foreground text-center" style={{marginTop: '1rem'}}>Redirecting...</div>
    </div>
  );
} 