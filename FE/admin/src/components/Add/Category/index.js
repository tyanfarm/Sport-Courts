import { useEffect, useState } from "react";
import React from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import 'react-toastify/ReactToastify.css'
// import { localhost } from '../../services/server';
import { ToastContainer, toast } from 'react-toastify';

const NewCategory = () => {
    const localhost = `http://localhost:5102`
    const form = document.querySelector('form')

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const requestOptions = {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                //'Content-Type': 'multipart/form-data' -> missing boundary
            }
            
        }; 

        fetch(`http://localhost:5102/api/v1/Category/`, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data);
            })
            .then(() => {
                window.location.replace("/Category");
            })
       
    }

    return (
        <div className="category-form create">
            <h2>Add new category</h2>
            <form>
                <h2>Sport Name:</h2>
                <div>
                    <input 
                        type="text" required placeholder="Sport name" id="sportName" name="sportName"
                    />
                </div>
                <h2>Sport type:</h2>
                <div>
                    <input 
                        type="text" required placeholder="Sport type" id="type" name="type"
                    />
                </div>
                <h2>Description:</h2>
                <div>
                    <input 
                        type="text" placeholder="Description" id="description" name="description"
                    />
                </div>
                <h2>Publish?</h2>
                <div>
                    <input 
                        type="checkbox" id="published" name="published"
                    />
                </div>
                <h2>Image:</h2>
                <div>
                    <input 
                        type="file" accept="image/*" id="file" name="file"
                    />
                </div>
                
                <button type="submit" onClick={handleSubmit}>Add Category</button>
            </form>
        </div>
    )
}

export default NewCategory;