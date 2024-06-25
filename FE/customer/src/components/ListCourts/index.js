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
    const [defaultCourts, setDefaultCourts] = useState([]);
    const [allCourts, setAllCourts] = useState([]); // Store all courts data
    const [displayCourts, setDisplayCourts] = useState([]); // Store courts to display on the current page
    const [selectedType, setSelectedType] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 9;

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
        paginateCourts(currentPage);
    }, [allCourts, currentPage, selectedType]);

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
        }
        else {
            url = `${localhost}/api/v1/Court/category/${sportName}`;
        }

        fetch(url, requestOptions)
            .then(res => res.json())
            .then(data => {
                setDefaultCourts(data);
                setAllCourts(data);
                paginateCourts(1);  // Display the first page initially
            });
    }

    const paginateCourts = (page) => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setDisplayCourts(allCourts.slice(startIndex, endIndex));
    }

    const handleFilterClick = (type) => {
        setSelectedType(type);
        fetchCourts(type);
        setCurrentPage(1);
    }

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        
        if (value === '') {
            // If search term is empty, fetch all courts
            fetchCourts(selectedType);
        } else {
            searchCourts(value);
        }
    }

    const searchCourts = async (searchTerm) => {
        const url = `${localhost}/api/v1/Court/SearchFilter?searchString=${searchTerm}`;

        fetch(url, requestOptions)
            .then(res => res.json())
            .then(data => {
                // Filter the search results based on existing allCourts by courtId
                const filteredData = data.filter(court => 
                    defaultCourts.some(existingCourt => existingCourt.courtId === court.courtId)
                );
                setAllCourts(filteredData);
                setCurrentPage(1);
            });
    }

    const totalPages = Math.ceil(allCourts.length / itemsPerPage);

    return (
        <div>
            <div className="section product" >
                <div className="container">

                    <p className="section-subtitle">-- {sportName} --</p>

                    <h2 className="h2 section-title">All {sportName} Courts</h2>
                    <div className='search-area'>
                        <input
                            type="text"
                            placeholder="Search courts..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                        <i className="fas fa-search search-icon"></i>
                    </div>
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
                        {displayCourts.length === 0 ? (
                            <h1 className='font-semibold uppercase'>No Courts</h1>
                        ) : (<></>)}
                        {displayCourts.length !== 0 && displayCourts.map((item, index) => {
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
                                    <a href={`./${sportName}/${item.courtId}`}>
                                        <button className="btn btn-primary">Add to Cart</button>
                                    </a>
                                </li>
                            )
                        })}
                    </ul>

                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button key={index + 1}
                                className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                                onClick={() => setCurrentPage(index + 1)}>
                                {index + 1}
                            </button>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ListCourts
