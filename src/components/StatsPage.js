import React, { useEffect, useState } from "react";
import { useLogger } from "./LoggerProvider";
import { BarChart2 } from "lucide-react";

function getStoredShortUrls() {
  return JSON.parse(localStorage.getItem("short_urls") || "[]");
}

export default function StatsPage() {
  const { log } = useLogger();
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    setUrls(getStoredShortUrls());
    log("Viewed statistics page");
  }, [log]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="card">
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
          <BarChart2 className="text-primary" style={{width: 24, height: 24}} />
          <h1 className="form-title">Shortened URL Statistics</h1>
        </div>
        {urls.length === 0 ? (
          <div className="text-muted-foreground">No shortened URLs found.</div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Short URL</th>
                  <th>Created</th>
                  <th>Expires</th>
                  <th>Clicks</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((url, idx) => (
                  <tr key={idx}>
                    <td>
                      <a href={url.shortUrl} className="font-mono text-primary underline break-all">
                        {url.shortUrl}
                      </a>
                    </td>
                    <td>{new Date(url.createdAt).toLocaleString()}</td>
                    <td>{new Date(url.expiresAt).toLocaleString()}</td>
                    <td>
                      <span className="badge">{url.clicks.length}</span>
                    </td>
                    <td>
                      {url.clicks.length === 0 ? (
                        <span className="text-muted-foreground">No clicks</span>
                      ) : (
                        <details>
                          <summary className="text-primary underline" style={{cursor: 'pointer'}}>View</summary>
                          <div style={{marginTop: '0.5rem'}}>
                            <table className="stats-table" style={{fontSize: '0.92em', border: '1px solid var(--border)', borderRadius: '0.5rem'}}>
                              <thead>
                                <tr>
                                  <th>Timestamp</th>
                                  <th>Source</th>
                                  <th>Geo-Location</th>
                                </tr>
                              </thead>
                              <tbody>
                                {url.clicks.map((click, i) => (
                                  <tr key={i}>
                                    <td>{new Date(click.timestamp).toLocaleString()}</td>
                                    <td>{click.source || "-"}</td>
                                    <td>{click.geo || "-"}</td>
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