import { useEffect, useState } from "react";
import React from "react";
import { useParams } from "react-router-dom";
//import { localhost } from '../../services/server';


const ListUsers = () => {
    const localhost = `http://localhost:5102`

    const [listUsers, setListUsers] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [])

    const fetchUsers = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }; 

        fetch(localhost + `/api/v1/Orders/`, requestOptions)
            .then(res => res.json())
            .then(data => {
                const dataArray = Array.isArray(data) ? data : [];
                //console.log(dataArray);
                setListUsers(dataArray);
            });
    }

    return (
        <div className="admin-container">
            <div className="user-admin-header">
                <div className="user-admin-header-prop">
                    {/* Display name and basic prop */}
                </div>
                {/* Add new button */}
                <button className="new button" />
            </div>
            <div className="user-admin-list">
                {listUsers && listUsers.map((item, index) => {
                    return (
                        <div className="user-admin-props" key={index}>
                            <div className="user-props">
                                <div className="user-info">
                                    {/* Display Category Basic Info */}
                                </div>
                                {/* Modify Button */}
                                <button className="modify button" onClick={null}/>
                                {/* Delete Button */}
                                <button className="delete button" onclick={null}/>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default listOrderDetails;