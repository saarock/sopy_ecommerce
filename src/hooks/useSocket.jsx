import { useEffect, useState } from 'react';
import useUser from './useUser';
import { socket } from '../socket';
import userService from '../services/userService';
import { toast } from 'react-toastify';

const useSocket = () => {
    const { user } = useUser();
    const [numberOfNotifications, setNumberOfNotifications] = useState(null);
    const [message, setMessage] = useState("");
    const [latestNotification, setLatestNotification] = useState(null);

    useEffect(() => {
        if (!user?._id) return;

        // Fetch initial count
        const fetchInitialCount = async () => {
            try {
                const count = await userService.getUnreadCount(user._id);
                setNumberOfNotifications(count);
            } catch (error) {
                console.error("Error fetching initial count in socket hook:", error);
            }
        };

        fetchInitialCount();

        const handleNotification = ({ notification, totalNotifications }) => {
            console.log('Received notification socket event:', { notification, totalNotifications });
            setNumberOfNotifications(totalNotifications);
            setLatestNotification(notification);

            // Show toast for new notification
            if (notification?.message) {
                toast.info(notification.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        };

        const handleMessage = (msg) => {
            console.log('Received notification-message event:', msg);
            setMessage(msg);
        };

        const onConnect = () => {
            console.log('Socket connected, registering user:', user._id);
            socket.emit('register', { userId: user._id });
        };

        // If already connected, register immediately
        if (socket.connected) {
            onConnect();
        }

        socket.on('connect', onConnect);
        socket.on('notification', handleNotification);
        socket.on('notification-message', handleMessage);

        return () => {
            console.log('Cleaning up socket listeners in hook');
            socket.off('connect', onConnect);
            socket.off('notification', handleNotification);
            socket.off('notification-message', handleMessage);
        };
    }, [user?._id]);

    return { numberOfNotifications, message, latestNotification };
};

export default useSocket;
