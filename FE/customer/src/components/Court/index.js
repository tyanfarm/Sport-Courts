import { useParams, Link } from 'react-router-dom';
import { localhost } from '../../services/server';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import './style.css';

const Court = () => {

    const courtId = useParams().courtId;        // Get CourtId
    const sportName = useParams().sportname;
    const [courtDetails, setCourtDetails] = useState(Object);

    const [selectedTime, setSelectedTime] = useState('');
    const [currentWeek, setCurrentWeek] = useState(0); // Tracks the current week
    const [isMorning, setIsMorning] = useState(true); // Tracks whether morning or afternoon sessions are shown
    const [selectedDate, setSelectedDate] = useState(new Date()); // Tracks the selected date

    const getWeekDates = (weekOffset) => {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1 + weekOffset * 7); // Start from Monday

        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            weekDates.push(date);
        }
        return weekDates;
    };

    const [timeSlots, setTimeSlots] = useState([]);

    useEffect(() => {
        // window.scrollTo(0, 0);
        fetchCourt();
        updateTimeSlots();
    }, [currentWeek, selectedDate]);

    const fetchCourt = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        fetch(localhost + `/api/v1/Court/${courtId}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                data.price = data.price.toLocaleString('en-US');
                setCourtDetails(data);
            });
    }

    const updateTimeSlots = () => {
        const weekDates = getWeekDates(currentWeek);
        const currentTimeSlots = weekDates.map(date => {
            return {
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                fullDate: date.toLocaleDateString('en-US'),
                times: {
                    morning: ['06:00 - 07:00', '07:00 - 08:00', '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00'].map(time => ({
                        time,
                        past: new Date() > new Date(date.toDateString() + ' ' + time.split(' - ')[1])
                    })),
                    afternoon: ['16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00', '21:00 - 22:00'].map(time => ({
                        time,
                        past: new Date() > new Date(date.toDateString() + ' ' + time.split(' - ')[1])
                    }))
                }
            };
        });
        setTimeSlots(currentTimeSlots);
    };

    const handleTimeSlotClick = (day, time) => {
        setSelectedTime(`Selected time: ${day} ${time}`);
        openModal();
    };

    const handleDateChange = (event) => {
        const selectedDate = new Date(event.target.value);
        setSelectedDate(selectedDate);
        setCurrentWeek(Math.floor((selectedDate - new Date()) / (7 * 24 * 60 * 60 * 1000)));
    };

    const OrderCourt = () => {
        window.scrollTo({ top: 600, behavior: 'smooth' });
        // toast.success('Add To Cart');
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const confirmBooking = () => {
        toast.success('Booking confirmed!');
        closeModal();
    };

    return (
        <div>
            <ToastContainer />
            <div className="field-details-container">
                <div className="image-section">
                    <img src={courtDetails.image} alt={courtDetails.courtId} loading='lazy' className="field-image" />
                </div>
                <div className="details-section">
                    <p className="court-id"></p>
                    <h1 className="court-name">{courtDetails.name}</h1>
                    <Link to={`/courts/sport/${sportName}`}>
                        <p>Thể Loại: <a className="court-cat">{sportName}</a></p>
                    </Link>
                    <p className="description">{courtDetails.description}</p>
                    <p className="description">Địa Chỉ: {courtDetails.address}</p>
                    <p className="price">Giá thuê mỗi giờ: <span className="price-amount">{courtDetails.price} VND</span></p>
                    <a onClick={() => OrderCourt()} className="button-reserve">Đặt sân</a>
                </div>
            </div>
            <div className="container">
                <div className="navigation">
                    <button onClick={() => setCurrentWeek(currentWeek - 1)}>Previous Week</button>
                    <button onClick={() => setCurrentWeek(currentWeek + 1)}>Next Week</button>
                </div>
                <div className="session-navigation">
                    <button className={isMorning ? 'active' : ''} onClick={() => setIsMorning(true)}>Morning</button>
                    <button className={!isMorning ? 'active' : ''} onClick={() => setIsMorning(false)}>Afternoon</button>
                </div>
                <div className="date-picker">
                    <input type="date" onChange={handleDateChange} value={selectedDate.toISOString().split('T')[0]} />
                </div>
                <table className="booking-table">
                    <thead>
                        <tr>
                            <th></th>
                            {isMorning ? (
                                <>
                                    <th>06:00 - 07:00</th>
                                    <th>07:00 - 08:00</th>
                                    <th>08:00 - 09:00</th>
                                    <th>09:00 - 10:00</th>
                                    <th>10:00 - 11:00</th>
                                    <th>11:00 - 12:00</th>
                                </>
                            ) : (
                                <>
                                    <th>16:00 - 17:00</th>
                                    <th>17:00 - 18:00</th>
                                    <th>18:00 - 19:00</th>
                                    <th>19:00 - 20:00</th>
                                    <th>20:00 - 21:00</th>
                                    <th>21:00 - 22:00</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map((slot, index) => (
                            <tr key={index}>
                                <td className={`day ${selectedDate.toDateString() === new Date(slot.fullDate).toDateString() ? 'selected' : ''}`}>
                                    {slot.day}<br />{slot.fullDate}
                                </td>
                                {(isMorning ? slot.times.morning : slot.times.afternoon).map((timeSlot, i) => (
                                    <td
                                        key={i}
                                        className={`time-slot ${timeSlot.past ? 'past' : ''}`}
                                        onClick={() => !timeSlot.past && handleTimeSlotClick(slot.fullDate, timeSlot.time)}
                                    >
                                        {timeSlot.time}<br />{timeSlot.past ? 'Expired' : `${courtDetails.price} VND`}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* <!-- Modal --> */}

                <div id="confirmationModal" className={isModalOpen ? 'modal active' : 'modal'}>
                    <div className="modal-content">
                        <div className="close" onClick={closeModal}>&times;</div>
                        <p>Bạn có chắc chắn muốn chốt đơn không?</p>
                        <div id="selected-time">{selectedTime}</div>
                        <button className="modal-button yes" onClick={confirmBooking}>YES</button>
                        <button className="modal-button no" onClick={closeModal}>NO</button>
                    </div>
                </div>

        </div>
    );
};

export default Court;
