import { useEffect, useState } from "react";
import React from "react";
import { localhost } from "../../services/server";

const ListCourts = () => {
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
                setListCourts(dataArray);
            });
    }

    return (
        <div>
            <div className="admin-container">
                <div className="category-admin-header">
                    <div className="category-admin-header-prop">
                        {/* Display name and basic prop */}
                        Court Prop Here
                    </div>
                    {/* Add new button */}
                    <nav className="new-section">
                        <a className="new button" href="./Add/Court">New</a>
                    </nav>
                </div>
                <div className="category-admin-list">
                    <ul>
                        {/* Header Row */}
                        <li className="category-admin-header-row">
                            <div className="category-props">
                                <div className="category-info">
                                    <div style={{ fontWeight: 'bold' }}>Name</div>
                                    <div style={{ fontWeight: 'bold' }}>Active</div>
                                    <div style={{ fontWeight: 'bold' }}>Price</div>
                                </div>
                                <div className="manipulate-buttons">

                                </div>
                            </div>
                        </li>
                        {listCourts && listCourts.map((item, index) => {
                            return (
                                <li className="category-admin-props" key={index}>
                                    {/* ul?  */}
                                    <div className="category-props">
                                        <div className="category-info">
                                            {/* Display Category Basic Info */}
                                            <div>{item.name}</div>
                                            <div>{(item.active) ? "Yes" : "No"}</div>
                                            <div>{item.price} VNĐ / h</div>
                                        </div>
                                        <nav className="manipulate-buttons">
                                            {/* Modify Button */}
                                            <a className="modify button" href={`./Edit/Category/`}>Edit</a>
                                            {/* Delete Button */}
                                            <a className="delete button" href={`./Delete/Court/${item.courtId}`}>Delete</a>
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

export default ListCourts;