import React, { useEffect } from "react";
import apiClient from "../services/apiClient";
import bookingDialogService from "../services/bookingDialogService";
import { Dialog, DialogContent } from "@material-ui/core";
import HomeBooking from "./HomeBooking";
import Notification from "./Notification";

export default function Homes(){

    const [homesState,setHomesState]=React.useState([]);

    useEffect(()=>{
        const homesDataPromise = apiClient.getHomes();

        homesDataPromise.then(homesData => console.log(homesData) || setHomesState(homesData));
    },[]);

    const [bookingDialogState,setBookingDialogState] = React.useState({
        open: false
    });

    useEffect(()=>{
        const subscription = bookingDialogService.events$.subscribe(state => setBookingDialogState(state));

        return () => subscription.unsubscribe();
    },[]);

    let homes;
    homes = homesState.map(
        (home,index) => {
            return(
                <div className="col-6 col-md-6 col-lg-4 col-xl-3 mb-3"  key={index}>
                    <div data-testid="home" className="card w-100">

                        <img src={home.image} data-testid="home-image" className="card-img-top" alt="couldnt get image bruhh"/>

                        <div className="card-body">
                            <div data-testid="home-title" className="card-title h5">
                                {home.title}
                            </div>

                            <div data-testid="home-location">
                                {home.location}
                            </div>

                            <div data-testid="home-price">
                                ${home.price}/night
                            </div>

                            <div className="d-flex justify-content-end">
                                <button 
                                    data-testid="home-booking-btn"
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => bookingDialogService.open(home)}
                                >
                                    Book
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    )

    console.log('render homes',homes);

    return(
        <div className="container m-2">
            <h1>Homes</h1>
            <div className="row">
                {homes}
            </div>

            <Dialog 
                open={bookingDialogState.open}
                onClose={() => bookingDialogService.close()}
                maxWidth="xs"
                fullWidth={true}
            >
                <DialogContent>
                    <HomeBooking home = {bookingDialogState.home}/>
                </DialogContent>
            </Dialog>    
            <Notification/>       
        </div>
    )
}