import { useEffect, useState } from "react";
import React from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
//import { localhost } from '../../services/server';
import SideBar from "../Sidebar";

const ListCourts = () => {
    const localhost = `http://localhost:5102`

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
                console.log(dataArray);
                setListCourts(dataArray);
            });
    }

    return (
        <div className="admin-container">
            <div className="court-admin-header">
                <div className="court-admin-header-prop">
                </div>
                {/* Add new button */}
                <button className="new button" />
            </div>
            <div className="court-admin-list">
                {listCourts && listCourts.map((item, index) => {
                    return (
                        <div className="court-admin-props" key={index}>
                            <div className="court-props">
                                <div className="court-info">
                                    <div>{item.name}</div>
                                    <div>{item.address}</div>
                                    <div>{item.price}</div>
                                </div>
                                {/* Modify Button */}
                                <a className="modify button" href={`./Edit/Category`}>Edit</a>
                                {/* Delete Button */}
                                <a className="delete button" href={`./Delete/Court/${item.CourtId}`}>Delete</a>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ListCourts;