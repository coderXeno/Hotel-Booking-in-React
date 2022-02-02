import React, { useEffect, useState } from "react";
import moment from "moment";
import apiClient from "../services/apiClient";
import bookingDialogService from "../services/bookingDialogService";
import notificationService from "../services/notificationService";

export default function HomeBooking(props){

    const [checkInState,setCheckInState] = useState();
    const [checkOutState,setCheckOutState] = useState();
    const [totalPriceState,setTotalPriceState] = useState();
    const [emailState, setEmailState] = useState();
    const [nameState,setNameState] = useState();

    useEffect(()=>{

        const price = props.home ? props.home.price : 0;
        const checkInDate = moment(checkInState,'YYYY-MM-DD');
        const checkOutDate = moment(checkOutState,'YYYY-MM-DD');
        const nights = checkOutDate.diff(checkInDate,'days');

        const total = nights * price;

        if(total > 0){
            setTotalPriceState(total);
        } else {
            setTotalPriceState('--');
        }

    },[checkInState,checkOutState,props]);

    if(!props.home){
        return <div data-testid="empty">

        </div>
    }

    const handleEmailSubmit = (e) => {
        setEmailState(e.target.value);
    }

    const handleNameChange = (e) => {
        setNameState(e.target.value);
    }

    const handleBooking = () => {
        apiClient.bookHome(props.home, checkInState, checkOutState).then(
            response => {
                bookingDialogService.close();
                notificationService.open(response.message);
            }
        );
    }

    return(
        <>
            <h2 data-testid="title">
                {props.home.title}
            </h2>

            <div 
                data-testid="price"
                className="mb-3"
            >
                <span className="font-weight-bold text-primary text-large">
                    ${props.home.price}
                </span> per night
            </div>

            <div className="form-group">
                <label htmlFor="checkInDate"> -- Choose your Check In Date -- </label>
                <input 
                    data-testid="check-in"
                    type="date"
                    className="form-control"
                    id="checkInDate"
                    onChange={e => setCheckInState(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="checkOutDate"> -- Choose your Check Out Date -- </label>
                <input 
                    data-testid="check-out" 
                    type="date"
                    className="form-control"
                    id="checkOutDate"
                    onChange={e => setCheckOutState(e.target.value)}
                />
            </div>

            <div 
                data-testid="total"
                className="my-3 text-right"
            >
                <span className="font-weight-bold text-large">
                    Total: ${ totalPriceState }
                </span>
            </div>

            <div className="d-flex justify-content-end">
                <button 
                    data-testid="book-btn"
                    type="button"
                    className="btn btn-primary"
                    onClick={handleBooking}
                >Book</button>
            </div>
        </>
    )
}   