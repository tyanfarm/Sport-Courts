import React, { useEffect, useState } from "react";
import 'react-toastify/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { localhost } from "../../../services/server";
import LoadingSpinner from "../../../services/loadingSpinner";

const NewCourt = () => {
    const token = localStorage.getItem('AT');
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        catId: '',
        address: '',
        price: 0,
        discount: 0,
        active: false,
        file: null
    });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, [])

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

    const fetchCategories = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }; 

        try {
            const response = await fetch(`${localhost}/api/v1/Category`, requestOptions);
            const data = await response.json();
            console.log(data);
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
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

        fetch(`${localhost}/api/v1/Court/`, requestOptions)
            .then(res => res.json())
            .then(data => {
                setIsLoading(false);
                console.log(data);
                toast.success("Court added successfully!");
                window.location.replace("/Courts");
            })
            .catch(error => {
                console.error(error);
                toast.error("An error occurred while adding the Court.");
            });
    };

    return (
        <div className="category-form create">
            {isLoading && <LoadingSpinner />} {/* Show the spinner when loading */}
            <h2>Add new Court</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Court Name:</label>
                    <input
                        type="text"
                        required
                        placeholder="Sport name"
                        id="name"
                        name="name"
                        value={formData.name}
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
                <div>
                    <label htmlFor="catId">Category:</label>
                    <select
                        id="catId"
                        name="catId"
                        value={formData.catId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.catId} value={category.catId}>
                                {category.sportName} - {category.type}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="address">Address:</label>
                    <input
                        type="text"
                        placeholder="Address"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="price">Price:</label>
                    <input
                        type="text"
                        placeholder="Price"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="discount">Discount:</label>
                    <input
                        type="text"
                        placeholder="Discount"
                        id="discount"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                    />
                </div>
                <div className="checkbox-group">
                    <label htmlFor="active">Active   .</label>
                    <input
                        type="checkbox"
                        id="active"
                        name="active"
                        checked={formData.active}
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
                <button type="submit">Add Court</button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default NewCourt;
