import { useEffect, useState } from "react";
import React from "react";
import { useParams } from "react-router-dom";
//import { localhost } from '../../services/server';


const ListOrders = () => {
    const localhost = `http://localhost:5102`

    const [listOrders, setListOrders] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, [])

    const fetchOrders = async () => {
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
                setListOrders(dataArray);
            });
    }

    return (
        <div className="admin-container">
            <div className="order-admin-header">
                <div className="order-admin-header-prop">
                    {/* Display name and basic prop */}
                </div>
                {/* Add new button */}
                <button className="new button" />
            </div>
            <div className="order-admin-list">
                {listOrders && listOrders.map((item, index) => {
                    return (
                        <div className="order-admin-props" key={index}>
                            <div className="order-props">
                                <div className="order-info">
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

export default listOrders;