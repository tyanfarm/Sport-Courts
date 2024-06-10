import React, { useState, useEffect } from 'react';
import './style.css';

const Court = () => {
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

        updateTimeSlots();
    }, [currentWeek, selectedDate]);

    const handleTimeSlotClick = (day, time) => {
        setSelectedTime(`Selected time: ${day} ${time}`);
    };

    const handleDateChange = (event) => {
        const selectedDate = new Date(event.target.value);
        setSelectedDate(selectedDate);
        setCurrentWeek(Math.floor((selectedDate - new Date()) / (7 * 24 * 60 * 60 * 1000)));
    };

    return (
        <div>
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
                                        {timeSlot.time}<br />{timeSlot.past ? 'Expired' : '350K'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div id="selected-time">{selectedTime}</div>
            </div>
        </div>
    );
};

export default Court;
