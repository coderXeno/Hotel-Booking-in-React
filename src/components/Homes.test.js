import React from "react";
import { act, getAllByTestId, getNodeText, render } from "@testing-library/react";
import Homes from "./Homes";
import apiClient from "../services/apiClient";
import bookingDialogService from "../services/bookingDialogService";

let container = null;

beforeEach(async()=>{

    jest.spyOn(apiClient,'getHomes').mockImplementation(()=>{
        return Promise.resolve([
            {
                title: "Test home 1",
                image: "listing.jpg",
                location: "Test Location 1",
                price: "1"
            },
            {
                title: "Test home 2",
                image: "listing.jpg",
                location: "Test Location 2",
                price: "2"
            },
            {
                title: "Test home 3",
                image: "listing.jpg",
                location: "Test Location 3",
                price: "3"
            }
        ]);
    });

    container = render(<Homes/>).container;

    await act(async ()=> {});
});

it('should show homes',()=>{
    
    const homes = getAllByTestId(container, 'home');

    console.log(container.innerHTML);
    expect(homes.length).toBeGreaterThan(0);
});

it('should show home title',()=>{
    
    const homeTitles = getAllByTestId(container, 'home-title');

    expect(getNodeText(homeTitles[0])).toBe('Test home 1');
});

it('should show home image',()=>{
    
    const homeImages = getAllByTestId(container, 'home-image');

    expect(homeImages[0]).toBeTruthy();
});

it('should show home location',()=>{
    
    const homeLocations = getAllByTestId(container, 'home-location');

    expect(getNodeText(homeLocations[0])).toBe('Test Location 1');
});

it('should show home price',()=>{
    
    const homePrices = getAllByTestId(container, 'home-price');

    expect(getNodeText(homePrices[0])).toBe('$1/night');
});

it('should show home booking button',()=>{
    
    const homeBookingBtn = getAllByTestId(container, 'home-booking-btn');

    expect(homeBookingBtn[0]).toBeTruthy();
});

it('should open home booking dialog on button click',()=>{

    jest.spyOn(bookingDialogService, 'open').mockImplementation(()=>{});
    
    const homeBookingBtn = getAllByTestId(container, 'home-booking-btn');

    homeBookingBtn[0].click();

    expect(bookingDialogService.open).toHaveBeenCalledWith({
        title: "Test home 1",
        image: "listing.jpg",
        location: "Test Location 1",
        price: "1"
    });
});