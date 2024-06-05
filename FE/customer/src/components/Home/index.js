import React from 'react'

const Home = () => {
    return (
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
    )
}

export default Home
