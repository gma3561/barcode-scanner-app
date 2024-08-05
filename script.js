const API_KEY = '여기에_API_키를_넣으세요';
const SPREADSHEET_ID = '여기에_스프레드시트_ID를_넣으세요';
const RANGE = 'Sheet1!A:C';

function handleClientLoad() {
    gapi.load('client', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(function () {
        console.log('Google Sheets API 초기화 완료');
    });
}

document.getElementById('barcodeInput').addEventListener('change', function(e) {
    const barcode = e.target.value;
    searchProduct(barcode);
});

function searchProduct(barcode) {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
    }).then(function(response) {
        const values = response.result.values;
        const product = values.find(row => row[0] === barcode);
        
        if (product) {
            displayProduct(product[1], product[2]);
        } else {
            displayProduct('제품을 찾을 수 없습니다', '');
        }
    }, function(response) {
        console.error('오류 발생:', response.result.error.message);
    });
}

function displayProduct(name, price) {
    const productInfo = document.getElementById('productInfo');
    productInfo.innerHTML = `<h2>${name}</h2><p>가격: ${price}원</p>`;
}

document.getElementById('printButton').addEventListener('click', function() {
    window.print();
});

handleClientLoad();