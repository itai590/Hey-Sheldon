import {useEffect, useRef, useState} from 'react';

export default function useMessages() {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);
    const abortControllerRef = useRef(null);

    async function loadMessages() {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            const res = await fetch('http://localhost:5100/api/messages', {signal: controller.signal});
            if (!res.ok) throw new Error(`Failed to fetch messages, status: ${res.status}`);

            const data = await res.json();
            setMessages(data);
            setError(null);
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('Fetch aborted');
                return;
            }
            console.error('Fetch error:', err);
            setError('Could not connect to server');
        }
    }

    useEffect(() => {
        function startPolling() {
            if (!intervalRef.current) {
                loadMessages(); // immediate load
                intervalRef.current = setInterval(loadMessages, 5000); // every 5s
            }
        }

        function stopPolling() {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
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

    return {messages, error};
}
