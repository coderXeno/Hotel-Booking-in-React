import { Snackbar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import notificationService from "../services/notificationService";

export default function Notification(props){

    const [notificationState, setNotificationState] = useState({
        open: false
    });

    useEffect(() => {
        const subscription = notificationService.events$.subscribe(notification => setNotificationState(notification));

        return () => subscription.unsubscribe();
    });

    const handleNotifClose = () => {
        notificationService.close();
    }

    return(
        <Snackbar
            open = { notificationState.open }
            onClose={handleNotifClose}
            message = {notificationState.message}
            autoHideDuration={ 5000 }
        />
    );
}