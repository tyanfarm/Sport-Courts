import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from '../../contexts/cartContext'
import { convertStringToInt } from '../../services/userService';
import { localhost } from '../../services/server';
import { AuthContext } from '../../contexts/authContext';
import LoadingSpinner from '../../services/loadingSpinner';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const [isLoading, setIsLoading] = useState(false); // Add loading state

    const { cart } = useContext(CartContext);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const token = localStorage.getItem('AT');
    const [user, setUser] = useState({});
    const [total, setTotal] = useState(0);
    const [activePayment, setActivePayment] = useState('');

    const handlePaymentClick = (paymentType) => {
        setActivePayment(paymentType);
    };

    useEffect(() => {

        if (!auth.isAuthenticated) {
            window.scrollTo(0, 0);
            navigate('/login');
        }

        fetchUser();
    })

    useEffect(() => {
        const totalPrice = cart.reduce((acc, item) => acc + convertStringToInt(item.court.price), 0);
        setTotal(totalPrice);

    }, [cart])

    const fetchUser = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        fetch(`${localhost}/api/v1/User/${token}`, requestOptions)
            .then(res => res.json())
            .then(data => setUser(data));
    }

    const postOrder = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                customerId: user.id,
                payment: activePayment,
                paid: false,
                totalMoney: total
            })
        };

        const response = await fetch(`${localhost}/api/v1/Order`, requestOptions);
        const data = await response.json();
        console.log(data);
        return data;
    }

    const postOrderDetails = async (detail) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId: detail.orderId,
                courtId: detail.courtId,
                totalMoney: detail.totalMoney,
                usedDate: detail.usedDate
            })
        };

        const response = await fetch(`${localhost}/api/v1/Orderdetails`, requestOptions);
        const data = await response.json();
        console.log(data);
    }

    const handleCheckout = async () => {
        setIsLoading(true); // Set loading state to true when the request starts
        const createdOrder = await postOrder();

        const details = cart.map(item => ({
            orderId: createdOrder.orderId,
            courtId: item.court.courtId,
            totalMoney: convertStringToInt(item.court.price),
            usedDate: item.time
        }));
        
        for (const detail of details) {
            await postOrderDetails(detail);
        }

        setIsLoading(false);

    }

    return (
        <div className="checkout-area section-space-y-axis-100">
            {isLoading && <LoadingSpinner />} {/* Show the spinner when loading */}
            <div className="checkout-container">
                <div className="row">
                    <div className="col-12">
                        <div className="coupon-accordion">
                            <h3>Have a coupon? <span id="showcoupon">Don't wait any longer and enter right now</span></h3>
                            <div id="checkout_coupon active" className="coupon-checkout-content">
                                <div className="coupon-info">
                                    <form action="javascript:void(0)">
                                        <p className="checkout-coupon">
                                            <input placeholder="Coupon code" type="text" />
                                            <input className="coupon-inner_btn" value="Apply Coupon" type="submit" />
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6 col-12">
                        <form action="javascript:void(0)">
                            <div className="checkbox-form">
                                <h3>Billing Details</h3>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="checkout-form-list">
                                            <label>Full Name <span className="required">*</span></label>
                                            <input placeholder="Fullname" type="text" value={user.userName !== null ? user.userName : ''} />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="checkout-form-list">
                                            <label>Address <span className="required">*</span></label>
                                            <input placeholder="Address" type="text" value={user.address !== null ? user.address : ''} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="checkout-form-list">
                                            <label>Phone <span className="required">*</span></label>
                                            <input placeholder="Phone number" type="text" value={user.phoneNumber !== null ? user.phoneNumber : ''} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-lg-6 col-12">
                        <div className="your-order">
                            <h3>Your order</h3>
                            <div className="your-order-table table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th className="cart-product-name">Court</th>
                                            <th className="cart-product-name">Time</th>
                                            <th className="cart-product-total">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.map(item => {
                                            return (
                                                <tr className="cart_item">
                                                    <td className="cart-product-name">{item.court.name}</td>
                                                    <td><strong className="product-quantity">{item.time}</strong></td>
                                                    <td className="cart-product-total"><span className="amount">{item.court.price} VNĐ</span></td>
                                                </tr>
                                            )
                                        })}

                                    </tbody>
                                    <tfoot>
                                        <tr className="cart-subtotal">
                                            <th>Cart Subtotal</th>
                                            <th></th>
                                            <th><span className="amount">{total.toLocaleString('en-US')} VNĐ</span></th>
                                        </tr>
                                        <tr className="order-total">
                                            <th>Order Total</th>
                                            <th></th>
                                            <th><strong><span className="amount">{total.toLocaleString('en-US')} VNĐ</span></strong></th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            
                        </div>
                    </div>
                    <div className="col-lg-6 col-12">
                        <div className="your-order">
                            <h3>Payment</h3>
                            <div className="payment-options">
                                <button className={`payment-button ${activePayment === 'bank-transfer' ? 'active' : ''}`} id="bank-transfer"
                                onClick={() => handlePaymentClick('bank-transfer')}>Direct Bank Transfer</button>
                                <button className={`payment-button ${activePayment === 'cheque-payment' ? 'active' : ''}`} id="cheque-payment"
                                onClick={() => handlePaymentClick('cheque-payment')}>By Cash</button>
                                <button className={`payment-button ${activePayment === 'paypal' ? 'active' : ''}`} id="paypal"
                                onClick={() => handlePaymentClick('paypal')}>Momo</button>
                            </div>
                            <div className="payment-method">
                                <div className="payment-accordion">
                                    <div className="order-button-payment">
                                        <input onClick={() => handleCheckout()} value="Place order" type="submit" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout
