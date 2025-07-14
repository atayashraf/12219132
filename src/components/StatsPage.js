import React, { useEffect, useState } from "react";
import { useLogger } from "./LoggerProvider";
import { cn } from "../utils/cn";
import { BarChart2 } from "lucide-react";

function getStoredShortUrls() {
  return JSON.parse(localStorage.getItem("short_urls") || "[]");
}

const cardBase =
  "bg-card border border-border rounded-xl shadow p-6 mb-6 flex flex-col gap-4";
const tableBase =
  "min-w-full divide-y divide-border text-sm text-left";
const thBase =
  "px-4 py-2 font-semibold text-muted-foreground bg-muted/40";
const tdBase =
  "px-4 py-2 border-b border-border align-top";
const badgeBase =
  "inline-block rounded-full px-2 py-0.5 text-xs font-semibold bg-muted text-foreground";

export default function StatsPage() {
  const { log } = useLogger();
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    setUrls(getStoredShortUrls());
    log("Viewed statistics page");
  }, [log]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className={cardBase}>
        <div className="flex items-center gap-2 mb-2">
          <BarChart2 className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Shortened URL Statistics</h1>
        </div>
        {urls.length === 0 ? (
          <div className="text-muted-foreground">No shortened URLs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className={tableBase}>
              <thead>
                <tr>
                  <th className={thBase}>Short URL</th>
                  <th className={thBase}>Created</th>
                  <th className={thBase}>Expires</th>
                  <th className={thBase}>Clicks</th>
                  <th className={thBase}>Details</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((url, idx) => (
                  <tr key={idx} className="hover:bg-muted/40 transition">
                    <td className={tdBase}>
                      <a href={url.shortUrl} className="text-primary underline font-mono break-all">
                        {url.shortUrl}
                      </a>
                    </td>
                    <td className={tdBase}>{new Date(url.createdAt).toLocaleString()}</td>
                    <td className={tdBase}>{new Date(url.expiresAt).toLocaleString()}</td>
                    <td className={tdBase}>
                      <span className={badgeBase}>{url.clicks.length}</span>
                    </td>
                    <td className={tdBase}>
                      {url.clicks.length === 0 ? (
                        <span className="text-muted-foreground">No clicks</span>
                      ) : (
                        <details>
                          <summary className="cursor-pointer text-primary underline">View</summary>
                          <div className="mt-2">
                            <table className="w-full text-xs border border-border rounded-md">
                              <thead>
                                <tr>
                                  <th className="px-2 py-1 bg-muted/40">Timestamp</th>
                                  <th className="px-2 py-1 bg-muted/40">Source</th>
                                  <th className="px-2 py-1 bg-muted/40">Geo-Location</th>
                                </tr>
                              </thead>
                              <tbody>
                                {url.clicks.map((click, i) => (
                                  <tr key={i}>
                                    <td className="px-2 py-1 border-b border-border">
                                      {new Date(click.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-2 py-1 border-b border-border">
                                      {click.source || "-"}
                                    </td>
                                    <td className="px-2 py-1 border-b border-border">
                                      {click.geo || "-"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </details>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 