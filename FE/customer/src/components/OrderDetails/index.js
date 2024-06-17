import React, { useEffect, useState } from 'react';
import { localhost } from '../../services/server';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {

    const orderId = useParams().id;
    const [orderDetails, setOrderDetails] = useState([]);

    useEffect(() => {
        fetchOrderDetails();
    })

    const fetchOrderDetails = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        fetch(`${localhost}/api/v1/Orderdetails/orders/${orderId}`, requestOptions)
            .then(res => res.json())
            .then(data => setOrderDetails(data))
    }

    return (
        <div>
            <main className="profile-content">
                <div className="account-page-area section-space-y-axis-100">
                    <div className="details-container">
                        <div className="row">
                            <div className="tab-content myaccount-tab-content" id="account-page-tab-content">
                                <div className='profile-content-area'>
                                    <div className="tab-pane fade" id="account-orders" role="tabpanel" aria-labelledby="account-orders-tab">
                                        <div className="myaccount-orders">
                                            <h4 className="small-title">ORDER DETAILS</h4>
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-hover">
                                                    <tbody>
                                                        <tr>
                                                            <th>IMAGE</th>
                                                            <th>NAME</th>
                                                            <th>ADDRESS</th>
                                                            <th>PRICE</th>
                                                            <th>USED DATE</th>
                                                        </tr>
                                                        {
                                                            orderDetails.length === 0 ? (
                                                                <h1 className='font-semibold uppercase'>You haven't had any order details.</h1>
                                                            ) : (
                                                                orderDetails?.map(item => {
                                                                    return (
                                                                        <tr>
                                                                            <td>
                                                                                <a className="w-20">
                                                                                    <img className="h-24" src={item.court.image} alt={item.court.courtId} />
                                                                                </a>
                                                                            </td>
                                                                            <td>{item.court.name}</td>
                                                                            <td style={{width: '270px'}}>{item.court.address}</td>
                                                                            <td>{item.court.price.toLocaleString('en-US')} VNĐ</td>
                                                                            <td>{item.usedDate}</td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            )
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default OrderDetails
