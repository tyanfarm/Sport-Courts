import { useEffect, useState } from "react";
import React from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import 'react-toastify/ReactToastify.css'
// import { localhost } from '../../services/server';
import { ToastContainer, toast } from 'react-toastify';

const NewCourt = () => {
    const localhost = `http://localhost:5102`
    const form = document.querySelector('form')

    const [listCourts, setListCourts] = useState(null);

    useEffect(() => {
        fetchCourts();
    }, [])

    const fetchCourts = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }; 

        fetch(localhost + `/api/v1/Court/`, requestOptions)
            .then(res => res.json())
            .then(data => {
                const dataArray = Array.isArray(data) ? data : [];
                //console.log(dataArray);
                setListCourts(dataArray);
            });
    }

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
                window.location.replace("/Court");
            })
       
    }

    return (
        <div className="form-input">
            <h2>Add new category</h2>
            <form onSubmit={handleSubmit}>
                <h2>Court Name:</h2>
                <div>
                    <input 
                        type="text" required placeholder="Court name" id="courtName" name="courtName"
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
                <h2>Address:</h2>
                <div>
                    <input 
                        type="text" placeholder="address" id="address" name="address"
                    />
                </div>
                <h2>Category:</h2>
                <div>
                    <ul>
                        {listCategories && listCategories.map((item, index) => {
                            return (
                                <li className="props" key={index}>
                                    {/* ul?  */}
                                    <input type="checkbox">{item.catId}</input>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <h2>Price:</h2>
                <div>
                    <input 
                        type="number" placeholder="price" id="price" name="price"
                    />
                </div>
                <h2>Discount:</h2>
                <div>
                    <input 
                        type="number" placeholder="discount" id="discount" name="discount"
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
                
                <button type="submit">Add Category</button>
            </form>
        </div>
    )
}

export default NewCourt;