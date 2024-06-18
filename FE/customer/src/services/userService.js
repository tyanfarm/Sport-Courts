const checkPassword = (str) => {
    // Kiểm tra xem chuỗi có chứa ký tự số không
    var containsNumber = /[0-9]/.test(str);

    // Kiểm tra xem chuỗi có chứa ký tự in hoa không
    var containsUpperCase = /[A-Z]/.test(str);

    // Kiểm tra xem chuỗi có chứa ký tự kí hiệu không
    var containsSymbol = /[^a-zA-Z0-9]/.test(str); // ^a-zA-Z0-9 nghĩa là không phải là chữ cái hoặc số

    // Trả về true nếu chuỗi thoả mãn tất cả các điều kiện, ngược lại trả về false
    return containsNumber && containsUpperCase && containsSymbol;
}

const convertStringToInt = (str) => {
    // Loại bỏ dấu phân cách và chuyển đổi thành số nguyên
    const intValue = parseInt(str.replace(/,/g, ''), 10);

    return intValue;
}

const formatDate = (dateString) => {
    // Tạo đối tượng Date từ chuỗi
    const date = new Date(dateString);

    // Định nghĩa mảng tên các tháng
    const monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
    ];

    // Lấy tên tháng và năm từ đối tượng Date
    const monthName = monthNames[date.getUTCMonth()];
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();

    const formattedDate = `${monthName} ${day}, ${year}`;

    return formattedDate;
}

const encodeToken = async (str) => {
    const result = await str.replace(/\//g, "_");

    return result;
}

const decodeToken = async (str) => {
    const result = await str.replace(/_/g, "/");

    return result;
}

export { checkPassword, convertStringToInt, formatDate, encodeToken, decodeToken }