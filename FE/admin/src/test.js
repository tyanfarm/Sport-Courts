
const localhost = 'http://localhost:5102';
const requestOptions = {
    mode: 'no-cors',
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
};

var datas;
var res = await fetch('http://localhost:5102/api/v1/Category', requestOptions);
var data = await res.json();
console.log(data);