import React, { createContext, useContext } from "react";

const LoggerContext = createContext();

export const useLogger = () => useContext(LoggerContext);

const LOG_STORAGE_KEY = "app_logs";

function saveLogToStorage(log) {
  const logs = JSON.parse(localStorage.getItem(LOG_STORAGE_KEY) || "[]");
  logs.push(log);
  localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
}

const LoggerProvider = ({ children }) => {
  const log = (message, meta = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message,
      ...meta,
    };
    saveLogToStorage(logEntry);
    // Optionally, display logs in development UI (not console)
  };

  return (
    <LoggerContext.Provider value={{ log }}>
      {children}
    </LoggerContext.Provider>
  );
};

export default LoggerProvider; 