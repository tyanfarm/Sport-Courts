import { useEffect, useState } from "react";
import React from "react";
import { useParams } from "react-router-dom";
//import { localhost } from '../../services/server';


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
                //console.log(dataArray);
                setListCourts(dataArray);
            });
    }

    return (
        <div className="admin-container">
            <div className="court-admin-header">
                <div className="court-admin-header-prop">
                    {/* Display name and basic prop */}
                    cor
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

export default ListCourts;