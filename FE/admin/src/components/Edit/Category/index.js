import { useEffect, useState } from "react";
import React from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import 'react-toastify/ReactToastify.css'
// import { localhost } from '../../services/server';
import { ToastContainer, toast } from 'react-toastify';

const EditCategory = () => {
    const id = useParams().Id
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

        const requestOptions = {
            method: 'PATCH',
            body: formData,
            headers: {
                'Accept': 'application/json',
            }
            
        }; 

        fetch(`http://localhost:5102/api/v1/Category/${id}`, requestOptions)
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
        <div className="category-form create"> {/* Get data from server -> Better Edit */}
            {/* <h1>{id}</h1>
            
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
                    />
                </div>
                <h2>Sport type:</h2>
                <div>
                    <input 
                        type="text" 
                        required 
                        placeholder="Sport type" 
                        id="type" 
                        name="type"
                        value={type} 
                        onChange={(event) => setType(event.target.value)}
                    />
                </div>
                <h2>Description:</h2>
                <div>
                    <input 
                        type="text" 
                        placeholder="Description" 
                        id="description" 
                        name="description" 
                        value={description} 
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </div>
                <h2>Publish?</h2>
                <div>
                    <input 
                        type="checkbox" 
                        id="published" 
                        name="published" 
                        checked={true}
                        value={published} 
                        onChange={(event) => setPublished(!published)}
                    />
                </div>
                <h2>Image:</h2>
                <form>
                    <input type="file" 
                    accept="image/*" 
                    id="file" 
                    name="file"/>
                </form>
                
                <button 
                    type="submit" 
                    onClick={handleSubmit}>Add Category</button>
            </div> */}
            Not Implemented
        </div>
    )
}

export default EditCategory;