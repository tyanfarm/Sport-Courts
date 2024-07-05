import { useEffect, useState } from "react";
import React from "react";
import { localhost } from "../../services/server";

const ListUsers = () => {
    const token = localStorage.getItem('AT');

    const [listUsers, setListUsers] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [])

    const fetchUsers = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            }
        }; 

        fetch(localhost + `/api/v1/User/`, requestOptions)
            .then(res => res.json())
            .then(data => {
                const dataArray = Array.isArray(data) ? data : [];
                setListUsers(dataArray);
            });
    }

    return (
        <div>
            <div className="admin-container">
                <div className="category-admin-header">
                    <div className="category-admin-header-prop">
                        {/* Display name and basic prop */}
                        User Prop Here
                    </div>
                </div>
                <div className="category-admin-list">
                    <ul>
                        {/* Header Row */}
                        <li className="category-admin-header-row">
                            <div className="category-props">
                                <div className="category-info">
                                    <div style={{ fontWeight: 'bold' }}>Username</div>
                                    <div style={{ fontWeight: 'bold' }}>Email</div>
                                    <div style={{ fontWeight: 'bold' }}>Email Confirmed</div>
                                </div>
                                <div className="manipulate-buttons">

                                </div>
                            </div>
                        </li>
                        {listUsers && listUsers.map((item, index) => {
                            return (
                                <li className="category-admin-props" key={index}>
                                    {/* ul?  */}
                                    <div className="category-props">
                                        <div className="category-info">
                                            {/* Display Category Basic Info */}
                                            <div>{item.userName}</div>
                                            <div>{item.email}</div>
                                            <div>{(item.emailConfirmed) ? "Yes" : "No"}</div>
                                        </div>
                                        <nav className="manipulate-buttons">
                                            {/* Modify Button */}
                                            {/* <a className="modify button" href={`./Edit/Category/`}>Edit</a> */}
                                            {/* Delete Button */}
                                            <a className="delete button" href={`./Delete/User/${item.id}`}>Delete</a>
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

export default ListUsers;