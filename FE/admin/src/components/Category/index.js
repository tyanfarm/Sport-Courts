import { useEffect, useState } from "react";
import React from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
//import { localhost } from '../../services/server';
import SideBar from "../Sidebar";

let deleteJSON;

const ListCategories = () => {
    const localhost = `http://localhost:5102`
    const [listCategories, setListCategories] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, [])

    const fetchCategories = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }; 

        fetch(localhost + `/api/v1/Category/`, requestOptions)
            .then(res => res.json())
            .then(data => {
                const dataArray = Array.isArray(data) ? data : [];
                setListCategories(dataArray);
            });
    }

    return (
        <div>
            <div className="admin-type">
                    <h1>Category</h1>
            </div>
            <div className="admin-container">
                <div className="category-admin-header">
                    <div className="category-admin-header-prop">
                        {/* Display name and basic prop */}
                        Category Prop Here
                    </div>
                    {/* Add new button */}
                    <nav className="new-section">
                        <a className="new button" href="./Add/Category">New</a>
                    </nav>
                </div>
                <div className="category-admin-list">
                    <ul>
                        {listCategories && listCategories.map((item, index) => {
                            return (
                                <li className="category-admin-props" key={index}>
                                    {/* ul?  */}
                                    <div className="category-props">
                                        <div className="category-info">
                                            {/* Display Category Basic Info */}
                                            <div>{item.sportName}</div>
                                            <div>{item.type}</div>
                                            <div>{(item.published) ? "Yes" : "No"}</div>
                                        </div>
                                        <nav className="manipulate-buttons">
                                            {/* Modify Button */}
                                            <a className="modify button" href={`./Edit/Category/`}>Edit</a>
                                            {/* Delete Button */}
                                            <a className="delete button" href={`./Delete/Category/${item.catId}`}>Delete</a>
                                        </nav>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ListCategories;