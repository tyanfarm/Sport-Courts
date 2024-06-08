import React from 'react'

const Home = () => {
    return (
        <div>
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
                <div className="court-card">
                    <img src="assets/footbal_logo.jpg" alt="Football Court" className="court-logo"/>
                        <div className="court-info">
                            <h3>Bóng đá</h3>
                        </div>
                        <div className="court-schedule">
                            <p>Giờ mở cửa: 6:00 - 22:00</p>
                            <p>Ngày mở cửa: Thứ 2 - Chủ Nhật</p>
                        </div>
                </div>

                <div className="court-card">
                    <img src="https://firebasestorage.googleapis.com/v0/b/sport-courts-ab2d8.appspot.com/o/categories%2Fbadminton.jpg?alt=media&token=a95e74b5-60bb-4155-9c57-f34ab8592779" alt="Badminton Court" className="court-logo"/>
                        <div className="court-info">
                            <h3>Badminton</h3>
                        </div>
                        <div className="court-schedule">
                            <p>Giờ mở cửa: 7:00 - 21:00</p>
                            <p>Ngày mở cửa: Thứ 2 - Chủ Nhật</p>
                        </div>
                </div>

                <div className="court-card">
                    <img src="assets/tennis_logo.jpg" alt="Tennis Court" className="court-logo"/>
                        <div className="court-info">
                            <h3>Tennis</h3>
                        </div>
                        <div className="court-schedule">
                            <p>Giờ mở cửa: 6:00 - 22:00</p>
                            <p>Ngày mở cửa: Thứ 2 - Chủ Nhật</p>
                        </div>
                </div>
            </div>
        </div>

    )
}

export default Home
