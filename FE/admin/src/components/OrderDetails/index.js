import { useEffect, useState } from "react";
import React from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
//import { localhost } from '../../services/server';
import SideBar from "../Sidebar";

const ListOrderDetails = () => {
    const localhost = `http://localhost:5102`
    const [listOrderDetails, setListOrderDetails] = useState(null);

    useEffect(() => {
        fetchOrderDetails();
    }, [])

    const fetchOrderDetails = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }; 

        fetch(localhost + `/api/v1/Orderdetails/`, requestOptions)
            .then(res => res.json())
            .then(data => {
                const dataArray = Array.isArray(data) ? data : [];
                setListOrderDetails(dataArray);
            });
    }

    return (
        <div>
            <div className="admin-container">
                <div className="category-admin-header">
                    <div className="category-admin-header-prop">
                        {/* Display name and basic prop */}
                        Order Details Prop Here
                    </div>
                    {/* Add new button */}
                    <nav className="new-section">
                        <a className="new button" href="./Add/Category">New</a>
                    </nav>
                </div>
                <div className="category-admin-list">
                    <ul>
                        {/* Header Row */}
                        <li className="category-admin-header-row">
                            <div className="category-props">
                                <div className="category-info">
                                    <div style={{ fontWeight: 'bold' }}>Order ID</div>
                                    <div style={{ fontWeight: 'bold' }}>Court ID</div>
                                    <div style={{ fontWeight: 'bold' }}>Used Date</div>
                                    <div style={{ fontWeight: 'bold' }}>Total Money</div>
                                </div>
                                <div className="manipulate-buttons">

                                </div>
                            </div>
                        </li>
                        {listOrderDetails && listOrderDetails.map((item, index) => {
                            return (
                                <li className="category-admin-props" key={index}>
                                    {/* ul?  */}
                                    <div className="category-props">
                                        <div className="category-info">
                                            {/* Display Category Basic Info */}
                                            <div>{item.orderId}</div>
                                            <div>{item.courtId}</div>
                                            <div>{item.usedDate}</div>
                                            <div>{item.totalMoney} VNĐ / h</div>
                                        </div>
                                        <nav className="manipulate-buttons">
                                            {/* Modify Button */}
                                            <a className="modify button" href={`./Edit/Category/`}>Edit</a>
                                            {/* Delete Button */}
                                            <a className="delete button" href={`./Delete/Category/${item.courtId}`}>Delete</a>
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

export default ListOrderDetails;