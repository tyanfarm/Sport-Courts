import React, { useState } from "react";
import 'react-toastify/ReactToastify.css';
import LoadingSpinner from "../../../services/loadingSpinner";
import { ToastContainer, toast } from 'react-toastify';
import { localhost } from "../../../services/server";

const NewCategory = () => {
    const token = localStorage.getItem('AT');
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const [formData, setFormData] = useState({
        sportName: '',
        type: '',
        description: '',
        published: false,
        file: null
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked
            });
        } else if (type === 'file') {
            setFormData({
                ...formData,
                [name]: files[0]
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData();
        for (let key in formData) {
            data.append(key, formData[key]);
        }

        const requestOptions = {
            method: 'POST',
            body: data,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`, 
            }
        };
        setIsLoading(true); // Set loading state to true when the request starts

        fetch(`${localhost}/api/v1/Category/`, requestOptions)
            .then(res => res.json())
            .then(data => {
                setIsLoading(false);
                console.log(data);
                toast.success("Category added successfully!");
                window.location.replace("/Category");
            })
            .catch(error => {
                console.error(error);
                toast.error("An error occurred while adding the category.");
            });
    };

    return (
        <div className="category-form create">
            {isLoading && <LoadingSpinner />} {/* Show the spinner when loading */}
            <h2>Add new category</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="sportName">Sport Name:</label>
                    <input
                        type="text"
                        required
                        placeholder="Sport name"
                        id="sportName"
                        name="sportName"
                        value={formData.sportName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="type">Sport Type:</label>
                    <input
                        type="text"
                        required
                        placeholder="Sport type"
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <input
                        type="text"
                        placeholder="Description"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="checkbox-group">
                    <label htmlFor="published">Publish   .</label>
                    <input
                        type="checkbox"
                        id="published"
                        name="published"
                        checked={formData.published}
                        onChange={handleChange}
                    />
                </div>
                <div className="file-input">
                    <label htmlFor="file">Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        id="file"
                        name="file"
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Add Category</button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default NewCategory;
