import { useEffect, useState } from "react";
import React from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import 'react-toastify/ReactToastify.css'
// import { localhost } from '../../services/server';
import { ToastContainer, toast } from 'react-toastify';

const EditCategory = () => {
    const id = useParams().Id
<<<<<<< HEAD
    // const localhost = `http://localhost:5102`

    const [sportName, setSportName] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [published, setPublished] = useState("");

    // Best not to touch it
    const form = document.querySelector('form')
    console.log(id);

    let getData;

    useEffect(() => {
        getOld(id);
    }, [])
    
    const getOld = (id) => {
        //event.preventDefault();
        console.log("hello")

        return getData = async () => {
            console.log("ssssss");
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }

            console.log("aaaaaaa");

            fetch(`http://localhost:5102/api/v1/Category/${id}`, requestOptions)
            .then(res => res.json)
            .then(data => {
                setSportName(data.sportName);
                console.log(sportName);
                setType(data.type);
                setDescription(data.description);
                setPublished(data.published);
            })
        }
        
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(form)
=======
    const localhost = `http://localhost:5102`

    // tried and fail -> only receive file fakepath
    // const [file, setFile] = useState("");
    // const [sportName, setSportName] = useState("");
    // const [type, setType] = useState("");
    // const [description, setDescription] = useState("");
    // const [published, setPublished] = useState(false);

    // Best not to touch it
    const form = document.querySelector('form')
    console.log(id)

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        
        // uncomment to view testing
        // for (const pair of formData) {
        //     console.log(pair[0], pair[1]);
        // }
        // using multipart/form-data
        // console.log(Object.fromEntries(formData));
        
>>>>>>> 2f3f5a63e1d51e1b82ce9d6828f9d857af32cac4

        const requestOptions = {
            method: 'PATCH',
            body: formData,
            headers: {
                'Accept': 'application/json',
<<<<<<< HEAD
=======
                //'Content-Type': 'multipart/form-data' -> missing boundary
>>>>>>> 2f3f5a63e1d51e1b82ce9d6828f9d857af32cac4
            }
            
        }; 

<<<<<<< HEAD
        fetch(`http://localhost:5102/api/v1/Category/${id}`, requestOptions)
=======
        fetch(`http://localhost:5102/api/v1/Category?id=${id}`, requestOptions)
>>>>>>> 2f3f5a63e1d51e1b82ce9d6828f9d857af32cac4
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
<<<<<<< HEAD
        <div className="category-form create"> {/* Get data from server -> Better Edit */}
            <h1>{id}</h1>
            
            <div >
                <h2>Sport Name:</h2>
                <div>
                    <input 
                        type="text" 
                        required 
                        placeholder={sportName} 
                        id="sportName" 
                        name="sportName" 
                        value={sportName} 
                        onChange={(event) => setSportName(event.target.value)}
=======
        <div className="category-form create">
            
            
            <h1>{id}</h1>
            
            <div>
                <h2>Sport Name:</h2>
                <div>
                    <input 
                        type="text" required placeholder="Sport name" id="sportName" name="sportName"
                        value={sportName} onChange={(event) => setSportName(event.target.value)}
>>>>>>> 2f3f5a63e1d51e1b82ce9d6828f9d857af32cac4
                    />
                </div>
                <h2>Sport type:</h2>
                <div>
                    <input 
<<<<<<< HEAD
                        type="text" 
                        required 
                        placeholder="Sport type" 
                        id="type" 
                        name="type"
                        value={type} 
                        onChange={(event) => setType(event.target.value)}
=======
                        type="text" required placeholder="Sport type" id="type" name="type"
                        value={type} onChange={(event) => setType(event.target.value)}
>>>>>>> 2f3f5a63e1d51e1b82ce9d6828f9d857af32cac4
                    />
                </div>
                <h2>Description:</h2>
                <div>
                    <input 
<<<<<<< HEAD
                        type="text" 
                        placeholder="Description" 
                        id="description" 
                        name="description" 
                        value={description} 
                        onChange={(event) => setDescription(event.target.value)}
=======
                        type="text" placeholder="Description" id="description" name="description"
                        value={description} onChange={(event) => setDescription(event.target.value)}
>>>>>>> 2f3f5a63e1d51e1b82ce9d6828f9d857af32cac4
                    />
                </div>
                <h2>Publish?</h2>
                <div>
                    <input 
<<<<<<< HEAD
                        type="checkbox" 
                        id="published" 
                        name="published" 
                        checked={true}
                        value={published} 
                        onChange={(event) => setPublished(!published)}
=======
                        type="checkbox" id="published" name="published"
                        value={published} onChange={(event) => setPublished(!published)}
>>>>>>> 2f3f5a63e1d51e1b82ce9d6828f9d857af32cac4
                    />
                </div>
                <h2>Image:</h2>
                <form>
<<<<<<< HEAD
                    <input type="file" 
                    accept="image/*" 
                    id="file" 
                    name="file"/>
                </form>
                
                <button 
                    type="submit" 
                    onClick={handleSubmit}>Add Category</button>
=======
                    <input 
                        type="file" accept="image/*" id="file" name="file"
                    />
                </form>
                
                <button type="submit" onClick={handleSubmit}>Add Category</button>
>>>>>>> 2f3f5a63e1d51e1b82ce9d6828f9d857af32cac4
            </div>
        </div>
    )
}

export default EditCategory;