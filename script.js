const API_KEY = 'AIzaSyAoBsyYaBLDPphqhwBx-feeLkgAtenIcdY';
const SPREADSHEET_ID = '1EQtoYa_8EcvGZnRiyWK7tODe5J_HYMeGJUqMUi2xtUY';

function initClient() {
    gapi.client.init({
        'apiKey': API_KEY,
        'discoveryDocs': ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(function() {
        console.log('Google Sheets API 클라이언트 초기화 완료');
    });
}

function handleClientLoad() {
    gapi.load('client', initClient);
}

function addProductToList(name, price) {
    const tbody = document.querySelector('#productList tbody');
    const row = tbody.insertRow();
    const nameCell = row.insertCell(0);
    const priceCell = row.insertCell(1);
    nameCell.textContent = name;
    priceCell.textContent = price;
}

function searchProduct(barcode) {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet1!A:C',
    }).then(function(response) {
        const values = response.result.values;
        const product = values.find(row => row[0] === barcode);
        if (product) {
            addProductToList(product[1], product[2]);
        } else {
            console.log('제품을 찾을 수 없습니다');
        }
    }, function(response) {
        console.error('Error: ' + response.result.error.message);
    });
}

document.getElementById('barcodeInput').addEventListener('change', function(e) {
    searchProduct(e.target.value);
    this.value = ''; // 입력 필드 초기화
});

document.getElementById('printButton').addEventListener('click', function() {
    window.print();
});

handleClientLoad();