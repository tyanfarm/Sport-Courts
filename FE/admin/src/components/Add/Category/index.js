import { useEffect, useState } from "react";
import React from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import 'react-toastify/ReactToastify.css'
// import { localhost } from '../../services/server';
import { ToastContainer, toast } from 'react-toastify';

const NewCategory = () => {
    const localhost = `http://localhost:5102`

    // tried and fail -> only receive file fakepath
    // const [file, setFile] = useState("");
    // const [sportName, setSportName] = useState("");
    // const [type, setType] = useState("");
    // const [description, setDescription] = useState("");
    // const [published, setPublished] = useState(false);

    // Best not to touch it
    const form = document.querySelector('form')

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        
        // uncomment to view testing
        // for (const pair of formData) {
        //     console.log(pair[0], pair[1]);
        // }
        // using multipart/form-data
        // console.log(Object.fromEntries(formData));
        

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
                console.log(Object.fromEntries(formData));
            })
            .then(() => {
                window.location.replace("/Category");
            })
       
    }

    return (
        <div className="category-form create">
            <h2>Add new category</h2>
            <form onSubmit={handleSubmit}>
                <h2>Sport Name:</h2>
                <div>
                    <input 
                        type="text" required placeholder="Sport name" id="sportName" name="sportName"
                        //value={sportName} onChange={(event) => setSportName(event.target.value)}
                    />
                </div>
                <h2>Sport type:</h2>
                <div>
                    <input 
                        type="text" required placeholder="Sport type" id="type" name="type"
                        //value={type} onChange={(event) => setType(event.target.value)}
                    />
                </div>
                <h2>Description:</h2>
                <div>
                    <input 
                        type="text" placeholder="Description" id="description" name="description"
                        // value={description} onChange={(event) => setDescription(event.target.value)}
                    />
                </div>
                <h2>Publish?</h2>
                <div>
                    <input 
                        type="checkbox" id="published" name="published"
                        // value={published} onChange={(event) => setPublished(!published)}
                    />
                </div>
                <h2>Image:</h2>
                <div>
                    <input 
                        type="file" accept="image/*" id="file" name="file"
                        // value={file} onChange={addImage}
                    />
                </div>
                
                <button type="submit">Add Category</button>
            </form>
        </div>
    )
}

export default NewCategory;