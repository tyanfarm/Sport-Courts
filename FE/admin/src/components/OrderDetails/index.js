import { useEffect, useState } from "react";
import React from "react";
import { useParams } from "react-router-dom";
//import { localhost } from '../../services/server';


const ListOrderDetails = () => {
    const localhost = `http://localhost:5102`
    // const {catId} = useParams.name;

    const [listOrderDetails, setListOrderDetails] = useState(null);

    useEffect(() => {
        fetchOrderDetails();
    }, [])

    const fetchOrderDetails = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }; 

        fetch(localhost + `/api/v1/Orders/`, requestOptions)
            .then(res => res.json())
            .then(data => {
                const dataArray = Array.isArray(data) ? data : [];
                //console.log(dataArray);
                setListOrderDetails(dataArray);
            });
    }

    return (
        <div className="admin-container">
            <div className="order-details-admin-header">
                <div className="order-details-admin-header-prop">
                    {/* Display name and basic prop */}
                </div>
                {/* Add new button */}
                <button className="new button" />
            </div>
            <div className="order-details-admin-list">
                {listOrderDetails && listOrderDetails.map((item, index) => {
                    return (
                        <div className="order-details-admin-props" key={index}>
                            <div className="order-details-props">
                                <div className="order-details-info">
                                    {/* Display Category Basic Info */}
                                </div>
                                {/* Modify Button */}
                                <button className="modify button" onClick={null}/>
                                {/* Delete Button */}
                                <button className="delete button" onclick={null}/>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default listOrderDetails;