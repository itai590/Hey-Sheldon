import React, {useEffect, useState} from 'react';
import {Box} from "@material-ui/core";
import Center from './components/Center';
import ErrorBanner from './components/ErrorBanner';
import useMessages from './hooks/useMessages';

export default function Home() {
    const {messages, error} = useMessages();
    const [barkDetected, setBarkDetected] = useState(false);

    useEffect(() => {
        if (messages.length > 0) {
            const latest = messages
                .sort((a, b) => new Date(b.update_time || b.create_time) - new Date(a.update_time || a.create_time))[0];
            const timeDiff = (new Date() - new Date(latest.update_time || latest.create_time)) / 1000;
            setBarkDetected(timeDiff < 10);
        } else {
            setBarkDetected(false);
        }
    }, [messages]);

    return (
        <Box
            p={2}
            className="fill"
            style={{
                backgroundColor: 'transparent',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                overflowY: 'auto',
                fontFamily: 'sans-serif',
            }}
        >
            <Center>
                <div
                    style={{
                        width: 150,
                        height: 150,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '5px solid',
                        borderColor: barkDetected ? 'red' : 'green',
                        animation: barkDetected ? 'pulseRed 1s infinite' : 'pulseGreen 2s infinite',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255,255,255,0.09)',
                    }}
                >
                    <img
                        alt="sheldon"
                        src="Sheldon.jpeg"
                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                    />
                </div>
            </Center>

            <h1 style={{marginTop: '2rem', marginBottom: '1rem', color: 'white'}}>
                <span role="img" aria-label="dog">🐶</span> Bark History
            </h1>

            {error ? (
                <ErrorBanner message={error}/>
            ) : messages.length === 0 ? (
                <p style={{marginTop: '1rem'}}>
                    No barks yet... <span role="img" aria-label="sleeping">💤</span>
                </p>
            ) : (
                <ul style={{listStyle: 'none', padding: 0, width: '100%', maxWidth: '600px'}}>
                    {messages
                        .sort((a, b) => new Date(b.update_time || b.create_time) - new Date(a.update_time || a.create_time))
                        .map((msg) => (
                            <li
                                key={msg.id}
                                style={{
                                    marginBottom: '1rem',
                                    background: 'rgba(0,0,0,0.44)',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                                    textAlign: 'center',
                                    color: 'white',
                                }}
                            >
                                <div><strong>{new Date(msg.update_time || msg.create_time).toLocaleString()}</strong>
                                </div>
                                <div>{msg.text}</div>
                            </li>
                        ))}
                </ul>
            )}

            {/* Pulse + flashing animations */}
            <style>
                {`
          @keyframes pulseRed {
            0% { transform: scale(1); border-color: red; box-shadow: 0 0 10px red; }
            50% { transform: scale(1.1); border-color: rgb(245, 144, 132); box-shadow: 0 0 20px red; }
            100% { transform: scale(1); border-color: red; box-shadow: 0 0 10px red; }
          }

          @keyframes pulseGreen {
            0% { transform: scale(1); border-color: green; box-shadow: 0 0 10px green; }
            50% { transform: scale(1.1); border-color: lightgreen; box-shadow: 0 0 20px green; }
            100% { transform: scale(1); border-color: green; box-shadow: 0 0 10px green; }
          }
        `}
            </style>
        </Box>
    );
}
