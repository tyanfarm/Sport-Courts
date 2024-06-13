import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { localhost } from '../../services/server';

const ListCourts = () => {

    // const { state } = useLocation();
    // const sportName = state.sportName;
    const sportName = useParams().name;

    const [listTypes, setListTypes] = useState([]);
    const [listCourts, setListCourts] = useState([]);
    const [selectedType, setSelectedType] = useState('all');

    useEffect(() => {
        fetchTypes();
        fetchCourts();
    }, [])

    useEffect(() => {
        fetchCourts(selectedType);
    }, [selectedType]);

    const fetchTypes = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };


        fetch(localhost + `/api/v1/Category/types/${sportName}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                const dataArray = Array.isArray(data) ? data : [];

                setListTypes(dataArray);
            });
    }

    const fetchCourts = async (type = 'all') => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        let url = `${localhost}/api/v1/`


        fetch(localhost + `/api/v1/Court/category/${sportName}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                const dataArray = Array.isArray(data) ? data : [];

                setListCourts(dataArray);
            });
    }

    return (
        <div>
            <div className="section product" >
                <div className="container">

                    <p className="section-subtitle">-- {sportName} --</p>

                    <h2 className="h2 section-title">All {sportName} Courts</h2>

                    <div className="filter-section">
                        <button className="filter-btn" data-filter="all">All</button>
                        {listTypes && listTypes.map((item, index) => {
                            return (
                                <button className="filter-btn">{item}</button>
                            )
                        })}
                    </div>

                    <ul className="grid-list">
                        {listCourts && listCourts.map((item, index) => {
                            return (
                                <li className="list-products">
                                    {/* <Link to={`./${item.courtId}`}> */}
                                    <a href={`./${sportName}/${item.courtId}`} >
                                        <div className="product-card">

                                            <figure className="card-banner">
                                                <img src={item.image} loading="lazy" alt={item.name} />
                                            </figure>

                                            <h3 className="h4 card-title">
                                                <a href="">{item.name}</a>
                                            </h3>

                                            <div className="address-wrapper">
                                                <data className="address" value="85.00">{item.address}</data>
                                            </div>
                                        </div>
                                    </a>
                                    {/* </Link> */}
                                    <button className="btn btn-primary">Add to Cart</button>
                                </li>
                            )
                        })}
                    </ul>

                </div>
            </div>
        </div>
    )
}

export default ListCourts
