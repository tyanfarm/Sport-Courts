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

    const requestOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    useEffect(() => {
        fetchTypes();
        fetchCourts();
    }, [])

    useEffect(() => {
        fetchCourts(selectedType);
    }, [selectedType]);

    const fetchTypes = async () => {
        fetch(localhost + `/api/v1/Category/types/${sportName}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                const dataArray = Array.isArray(data) ? data : [];

                setListTypes(dataArray);
            });
    }

    const fetchCatId = async (type) => {
        const response = await fetch(`${localhost}/api/v1/Category/getId/${sportName}/${type}`, requestOptions)
        const data = await response.json();
        return data;
    }

    const fetchCourts = async (type = 'all') => {
        let url = "";
        if (type !== 'all') {
            const categoryId = await fetchCatId(type);
            url = `${localhost}/api/v1/Court/category/${categoryId}`;
            console.log(url);
        }
        else {
            url = `${localhost}/api/v1/Court/category/${sportName}`;
        }

        fetch(url, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setListCourts(data);
            });
    }

    const handleFilterClick = (type) => {
        setSelectedType(type);
    }

    return (
        <div>
            <div className="section product" >
                <div className="container">

                    <p className="section-subtitle">-- {sportName} --</p>

                    <h2 className="h2 section-title">All {sportName} Courts</h2>

                    <div className="filter-section">
                        <button className={`filter-btn ${selectedType === 'all' ? 'active' : ''}`} 
                        onClick={() => handleFilterClick('all')}>All</button>
                        {listTypes && listTypes.map((item, index) => {
                            return (
                                <button key={index} 
                                className={`filter-btn ${selectedType === item ? 'active' : ''}`}
                                onClick={() => handleFilterClick(item)}>
                                    {item}
                                </button>
                            )
                        })}
                    </div>

                    <ul className="grid-list">
                        {listCourts.length === 0 ? (
                            <h1 className='font-semibold uppercase'>No Courts</h1>
                        ) : (<></>)} 
                        {listCourts.length !== 0 && listCourts.map((item, index) => {
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
