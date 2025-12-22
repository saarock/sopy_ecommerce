import React, { useEffect, useState } from 'react';
import useSocket from '../hooks/useSocket';

const NotificationToast = () => {
    const { latestNotification, message } = useSocket();
    const [show, setShow] = useState(false);
    const [displayNotification, setDisplayNotification] = useState(null);

    useEffect(() => {
        if (latestNotification) {
            setDisplayNotification(latestNotification);
            setShow(true);

            // Auto-hide after 5 seconds
            const timer = setTimeout(() => {
                setShow(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [latestNotification]);

    useEffect(() => {
        if (message) {
            // Show message toast
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!show || (!displayNotification && !message)) return null;

    return (
        <>
            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                .notification-toast {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    background-color: #1a1a2e;
                    color: #fff;
                    padding: 16px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    z-index: 10000;
                    min-width: 300px;
                    max-width: 400px;
                    border: 1px solid #00d4ff;
                    animation: slideIn 0.3s ease-out;
                }

                @media (max-width: 768px) {
                    .notification-toast {
                        left: 10px;
                        right: 10px;
                        top: 10px;
                        min-width: auto;
                        max-width: calc(100vw - 20px);
                        padding: 12px 16px;
                    }
                }

                @media (max-width: 480px) {
                    .notification-toast {
                        left: 8px;
                        right: 8px;
                        top: 8px;
                        max-width: calc(100vw - 16px);
                        padding: 10px 14px;
                        font-size: 13px;
                    }
                }
            `}</style>
            <div className="notification-toast">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, wordBreak: 'break-word' }}>
                        {displayNotification && (
                            <>
                                <div style={{
                                    fontSize: '12px',
                                    color: '#00d4ff',
                                    marginBottom: '8px',
                                    fontWeight: '600',
                                    textTransform: 'uppercase'
                                }}>
                                    {displayNotification.actionType?.replace(/_/g, ' ')}
                                </div>
                                <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                                    {displayNotification.message}
                                </div>
                                <div style={{
                                    fontSize: '11px',
                                    color: '#888',
                                    marginTop: '8px'
                                }}>
                                    {new Date(displayNotification.createdAt).toLocaleTimeString()}
                                </div>
                            </>
                        )}
                        {!displayNotification && message && (
                            <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                                {message}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setShow(false)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#888',
                            cursor: 'pointer',
                            fontSize: '18px',
                            marginLeft: '12px',
                            padding: '0',
                            lineHeight: '1',
                            flexShrink: 0
                        }}
                    >
                        ×
                    </button>
                </div>
            </div>
        </>
    );
};

export default NotificationToast;
