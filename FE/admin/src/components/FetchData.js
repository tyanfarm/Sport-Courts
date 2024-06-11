import React, { useEffect, useState } from "react";

function Fetch() {
    const localhost = 'http://localhost:5102';
    const requestOptions = {
        mode: 'no-cors',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    let [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            fetch('http://localhost:5102/api/v1/Category', requestOptions)
                .then(res => res.json())
                .then(datas => {
                    //const dataArray = Array.isArray(datas) ? datas : [];
                    console.log(datas);
                    setData({data: datas});
                    // return dataArray;
                });
            
        }

        fetchData();
    }, []);

    // fetch('http://localhost:5102/api/v1/Category', requestOptions)
    //     .then(res => res.json())
    //     .then(data => {
    //     const dataArray = Array.isArray(data) ? data : [];
    //     console.log(dataArray)
    //     return dataArray;
    //     });
    return (
        <div>
            <p>data</p>
        </div>
    )
}



export default Fetch;