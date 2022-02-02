import React from "react";
import { fireEvent, getByTestId, render } from "@testing-library/react";
import Header from "./Header";
import HomeBooking from "./HomeBooking";
import apiClient from "../services/apiClient";
import bookingDialogService from "../services/bookingDialogService";
import notificationService from "../services/notificationService";
import { act } from "react-dom/test-utils";

let container = null;

const mockedHome = {
    title: "Test home 1",
    image: "listing.jpg",
    location: "Test Location 1",
    price: "125"
};

beforeEach(()=>{
    container = render(<HomeBooking home = {mockedHome}/>).container;
});

it('should show title',()=>{

    console.log(container.innerHTML);

    expect(getByTestId(container,'title').textContent).toBe('Test home 1');
});

it('should show price',()=>{

    expect(getByTestId(container,'price').textContent).toBe('$125 per night');
});

it('should show check in date field',()=>{

    expect(getByTestId(container,'check-in')).toBeTruthy();
});


it('should show check out date field',()=>{

    expect(getByTestId(container,'check-out')).toBeTruthy();
});


it('should show empty when no home provided',()=>{

    container = render(<HomeBooking home = {null}/>).container;

    expect(getByTestId(container,'empty')).toBeTruthy();
});


it('should calculate total',()=>{

    fireEvent.change(
        getByTestId(container,'check-in'),
        {
            target: {
                value: '2020-12-04'
            }
        }
    );

    fireEvent.change(
        getByTestId(container,'check-out'),
        {
            target: {
                value: '2020-12-07'
            }
        }
    );

    expect(getByTestId(container,'total').textContent).toBe('Total: $375');
});

it('should calculate "--" for invalid dates',()=>{

    fireEvent.change(
        getByTestId(container,'check-in'),
        {
            target: {
                value: '2020-12-04'
            }
        }
    );

    fireEvent.change(
        getByTestId(container,'check-out'),
        {
            target: {
                value: '2020-12-02'
            }
        }
    );

    expect(getByTestId(container,'total').textContent).toBe('Total: $--');
});

it('should book home after clicking the book button',()=>{

    jest.spyOn(apiClient,'bookHome').mockImplementation(()=>{
        return Promise.resolve({
            message: 'Mocked Home Booked!'
        });
    });

    fireEvent.change(
        getByTestId(container,'check-in'),
        {
            target: {
                value: '2020-12-04'
            }
        }
    );

    fireEvent.change(
        getByTestId(container,'check-out'),
        {
            target: {
                value: '2020-12-07'
            }
        }
    );

    getByTestId(container,'book-btn').click();

    expect(apiClient.bookHome).toHaveBeenCalledWith(mockedHome, '2020-12-04', '2020-12-07');

});

it('should close the dialog and show notification after booking home',async ()=>{

    jest.spyOn(apiClient, 'bookHome').mockImplementation(() => 
        Promise.resolve({
            message: 'Mocked Home Booked!'
        })
    );

    jest.spyOn(bookingDialogService, 'close').mockImplementation(() => {});

    jest.spyOn(notificationService,'open').mockImplementation(() => {});

    fireEvent.change(
        getByTestId(container,'check-in'),
        {
            target: {
                value: '2020-12-04'
            }
        }
    );

    fireEvent.change(
        getByTestId(container,'check-out'),
        {
            target: {
                value: '2020-12-07'
            }
        }
    );

    getByTestId(container,'book-btn').click();
    await act(async () => {});

    expect(bookingDialogService.close).toHaveBeenCalled();
    expect(notificationService.open).toHaveBeenCalledWith('Mocked Home Booked!');
});