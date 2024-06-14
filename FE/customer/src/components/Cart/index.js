import { useParams, Link } from 'react-router-dom';
import { localhost } from '../../services/server';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../../contexts/cartContext';
import { convertStringToInt } from '../../services/userService';

const Cart = () => {

    const { cart, removeFromCart } = useContext(CartContext);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        // Calculate total price whenever the cart changes
        const totalPrice = cart.reduce((acc, item) => acc + convertStringToInt(item.court.price), 0);
        setTotal(totalPrice);
    }, [cart]);

    console.log(total)
    return (
        <div className="container mx-auto mt-10">
            <div className="flex shadow-md my-10">
                <div className="w-3/4 bg-white px-10 py-10">
                    {cart.length !== 0 ? (
                        <>
                            <div className="flex justify-between border-b pb-8">
                                <h1 className="font-semibold text-2xl">Booking Cart</h1>
                                <h2 className="font-semibold text-2xl">Items</h2>
                            </div>
                            <div className="flex mt-10 mb-5">
                                <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">Product Details</h3>
                                <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">Time</h3>
                                <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">Sport</h3>
                                <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">Cost per hour</h3>
                            </div>
                        </>
                    ) : (<></>)}

                    {
                        cart.length === 0 ? (
                            <h1 className='font-semibold uppercase'>Your cart is empty.</h1>
                        ) : (
                            cart?.map((item, index) => {
                                return (
                                    <a href={`/courts/sport/${item.sport}/${item.court.courtId}`} className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5">
                                        <div className="flex w-2/5">
                                            <div className="w-20">
                                                <img className="h-24" src={item?.court.image} alt={item?.court.courtId} />
                                            </div>
                                            <div className="flex flex-col justify-between ml-4 flex-grow">
                                                <span className="font-bold text-sm">{item?.court.name}</span>
                                                <span className="text-red-500 text-xs capitalize">{item?.court.catId}</span>
                                                <div className="font-semibold hover:text-red-500 text-gray-500 text-xs cursor-pointer" onClick={() => removeFromCart(item.court, item.time)}>Remove</div>
                                            </div>
                                        </div>
                                        <span className="text-center w-1/5 font-semibold text-sm">{item?.time}</span>
                                        <span className="text-center w-1/5 font-semibold text-sm">{item?.sport}</span>
                                        <span className="text-center w-1/5 font-semibold text-sm">{item?.court.price} VNĐ</span>
                                    </a>
                                )
                            })
                        )
                    }

                    <Link to={'/home'} className="flex font-semibold text-indigo-600 text-sm mt-10">

                        <svg className="fill-current mr-2 text-indigo-600 w-4" viewBox="0 0 448 512"><path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" /></svg>
                        Continue Booking
                    </Link>
                </div>

                {cart.length !== 0 ? (
                    <>
                        <div id="summary" className="w-1/4 px-8 py-10">
                            <h1 className="font-semibold text-2xl border-b pb-8">Order Summary</h1>
                            <div className="flex justify-between mt-8">
                            </div>
                            <div>
                                <label className="font-medium inline-block mb-3 text-sm uppercase">Shipping</label>
                                <select className="block p-2 text-gray-600 w-full text-sm">
                                    <option>Standard shipping - $10.00</option>
                                </select>
                            </div>
                            <div className="py-10">
                                <label for="promo" className="font-semibold inline-block mb-3 text-sm uppercase">Promo Code</label>
                                <input type="text" id="promo" placeholder="Enter your code" className="p-2 text-sm w-full" />
                            </div>
                            <button className="bg-red-500 hover:bg-red-600 px-5 py-2 text-sm text-white uppercase">Apply</button>
                            <div className="border-t mt-8">
                                <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                                    <span >Total cost</span>
                                    <span style={{fontSize: '17px' }}>{total.toLocaleString('en-US')} VNĐ</span>
                                </div>
                                <button className="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full">Checkout</button>
                            </div>
                        </div>
                    </>
                ) : (<></>)}


            </div>
        </div>
    )
}

export default Cart
