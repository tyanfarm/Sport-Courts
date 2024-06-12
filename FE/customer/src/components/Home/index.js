import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { localhost } from '../../services/server'

const Home = () => {

    const [listCategories, setListCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []); // Tham số thứ hai là một mảng rỗng để chỉ chạy một lần khi component mount

    const fetchCategories = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        };

        fetch(localhost + '/api/v1/Category/sports', requestOptions)
            .then(res => res.json())
            .then(data => {
                const dataArray = Array.isArray(data) ? data : [];

                setListCategories(dataArray);
            });
    }

    return (
        <div>
            <ToastContainer />
            <div className="features">
                <div className="feature-item">
                    <img src="assets/field-icon.png" alt="Field icon" />
                    <h3>Tìm kiếm vị trí sân</h3>
                    <p>Dữ liệu sân đấu dồi dào, liên tục cập nhật, giúp bạn dễ dàng tìm kiếm theo khu vực mong muốn</p>
                </div>
                <div className="feature-item">
                    <img src="assets/booking-icon.png" alt="Booking icon" />
                    <h3>Đặt lịch online</h3>
                    <p>Không cần đến trực tiếp, không cần gọi điện đặt lịch, bạn hoàn toàn có thể đặt sân ở bất kì đâu có internet</p>
                </div>
                <div className="feature-item">
                    <img src="assets/team-icon.png" alt="Team icon" />
                    <h3>Tìm đối, bắt cặp đấu</h3>
                    <p>Tìm kiếm, giao lưu các đội thi đấu thể thao, kết nối, xây dựng cộng đồng thể thao sôi nổi, mạnh mẽ</p>
                </div>
            </div>
            <div className="court-cards">
                {listCategories && listCategories.map((item, index) => {
                    return (
                    <Link to={`/courts/sport/${item.sportName}`} state={{sportName: item.sportName}}>
                        <div key={index} className="court-card">
                            <img src={item.image} alt="Football Court" className="court-logo" />
                            <div className="court-info">
                                <h3>{item.sportName}</h3>
                            </div>
                            <div className="court-schedule">
                                <p>Giờ mở cửa: 6:00 - 22:00</p>
                                <p>Ngày mở cửa: Thứ 2 - Chủ Nhật</p>
                            </div>
                        </div>
                    </Link>
                    )
                })}
            </div>
        </div>

    )
}

export default Home
