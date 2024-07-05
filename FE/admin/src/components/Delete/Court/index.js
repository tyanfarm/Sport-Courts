import { useEffect, useState } from "react";
import React from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import 'react-toastify/ReactToastify.css'
// import { localhost } from '../../services/server';
import { localhost } from "../../../services/server";
import { ToastContainer, toast } from 'react-toastify';

let deleteJSON;
const DeleteCourt = () => {
    const token = localStorage.getItem('AT');
    let id = useParams().Id;

    const DeleteCou = (Id) => {
        return deleteJSON = async () => { 
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                }
            }; 
            console.log(Id);
    
            fetch(localhost + `/api/v1/Court?id=${Id}`, requestOptions)
                .then(() => {
                    console.log("deleted");
                    window.location.replace("/Courts");
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
                        <a href="/" className="button no">No</a>
                    </div>
                    <div className="action-yes">
                        <button className="button yes" onClick={DeleteCou(id)}>Yes</button>
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default DeleteCourt;
