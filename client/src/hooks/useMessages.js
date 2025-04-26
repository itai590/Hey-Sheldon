import { useState, useEffect, useRef } from 'react';
const SERVER_URL = "http://hey-sheldon-server:5100";

export default function useMessages() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  async function loadMessages() {
    try {
      const res = await fetch(`${SERVER_URL}/api/messages`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Could not connect to server');
    }
  }

  useEffect(() => {
    function startPolling() {
      if (!intervalRef.current) {
        loadMessages(); // immediate fetch when tab becomes visible
        intervalRef.current = setInterval(loadMessages, 5000); // every 5s
      }
    }

    function stopPolling() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        startPolling();
      } else {
        stopPolling();
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start immediately if visible
    if (document.visibilityState === 'visible') {
      startPolling();
    }

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return { messages, error };
}
