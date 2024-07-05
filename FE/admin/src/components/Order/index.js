import { useEffect, useState } from "react";
import React from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
//import { localhost } from '../../services/server';
import SideBar from "../Sidebar";

const ListOrders = () => {
    const localhost = `http://localhost:5102`
    const [listOrders, setListOrders] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, [])

    const fetchOrders = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }; 

        fetch(localhost + `/api/v1/Order/`, requestOptions)
            .then(res => res.json())
            .then(data => {
                const dataArray = Array.isArray(data) ? data : [];
                setListOrders(dataArray);
            });
    }

    return (
        <div>
            <div className="admin-container">
                <div className="category-admin-header">
                    <div className="category-admin-header-prop">
                        {/* Display name and basic prop */}
                        Order Prop Here
                    </div>
                </div>
                <div className="category-admin-list">
                    <ul>
                        {/* Header Row */}
                        <li className="category-admin-header-row">
                            <div className="category-props">
                                <div className="category-info">
                                    <div style={{ fontWeight: 'bold' }}>Order Date</div>
                                    <div style={{ fontWeight: 'bold' }}>Paid</div>
                                    <div style={{ fontWeight: 'bold' }}>Transact Status</div>
                                </div>
                                <div className="manipulate-buttons">

                                </div>
                            </div>
                        </li>
                        {listOrders && listOrders.map((item, index) => {
                            return (
                                <li className="category-admin-props" key={index}>
                                    {/* ul?  */}
                                    <div className="category-props">
                                        <div className="category-info">
                                            {/* Display Category Basic Info */}
                                            <div>{item.orderDate}</div>
                                            <div>{(item.paid) ? "Yes" : "No"}</div>
                                            <div>{item.transactStatus.status}</div>
                                        </div>
                                        <nav className="manipulate-buttons">
                                            {/* Modify Button */}
                                            {/* <a className="modify button" href={`./Edit/Category/`}>Edit</a> */}
                                            {/* Delete Button */}
                                            <a className="delete button" href={`./Delete/Order/${item.orderId}`}>Delete</a>
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

export default ListOrders;