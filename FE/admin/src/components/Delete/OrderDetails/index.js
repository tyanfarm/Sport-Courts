import { useEffect, useState } from "react";
import React from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import 'react-toastify/ReactToastify.css'
import { localhost } from "../../../services/server";

let deleteJSON;
const DeleteOrderDetail = () => {
    const token = localStorage.getItem('AT');

    let id = useParams().Id;

    const DeleteAction = (Id) => {
        return deleteJSON = async () => { 
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                }
            }; 
            console.log(Id);
    
            fetch(localhost + `/api/v1/Orderdetails?id=${Id}`, requestOptions)
                .then(() => {
                    console.log("deleted");
                    window.location.replace("/OrderDetail");
                });
            }
    }

    return (
        <div className="confirmation-wrapper">
            <div className="confirmation-message">
                Are you sure?
            </div>
            <div className="confirmation-actions">
                <nav>
                    <div className="action-no">
                        <a href="/OrderDetail" className="button no">No</a>
                    </div>
                    <div className="action-yes">
                        <button className="button yes" onClick={DeleteAction(id)}>Yes</button>
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default DeleteOrderDetail;
