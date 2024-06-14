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

export { checkPassword, convertStringToInt }