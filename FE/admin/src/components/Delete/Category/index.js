import { useEffect, useState } from "react";
import React from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import 'react-toastify/ReactToastify.css'
// import { localhost } from '../../services/server';
import { ToastContainer, toast } from 'react-toastify';

let deleteJSON;
const DeleteCategory = () => {

    let id = useParams().Id;

    const DeleteCat = (Id) => {
        return deleteJSON = async () => {
            const localhost = `http://localhost:5102`;  
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json'
                }
            }; 
            console.log(Id);
    
            fetch(localhost + `/api/v1/Category?id=${Id}`, requestOptions)
                .then(() => {
                    console.log("deleted");
                    window.location.replace("/Category");
                });
            }
    }

    return (
        <div>
            <div>
                Are you sure?
            </div>
            <div>
                <nav>
                    <div>
                        <a href="/">No</a>
                    </div>
                    <div>
                        <button className="delete button" onClick={DeleteCat(id)}>Yes</button>
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default DeleteCategory;
