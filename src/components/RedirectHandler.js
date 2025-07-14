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

const alertBase =
  "rounded-md border border-destructive bg-destructive/10 text-destructive px-4 py-2 mb-2 text-center";

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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className={alertBase}>{error}</div>
        <a href="/" className="mt-4 text-primary underline">Go Home</a>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      <div className="mt-4 text-muted-foreground">Redirecting...</div>
    </div>
  );
} 