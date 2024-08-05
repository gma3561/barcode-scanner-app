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

function searchProduct(barcode) {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet1!A:C',
    }).then(function(response) {
        const values = response.result.values;
        const product = values.find(row => row[0] === barcode);
        if (product) {
            document.getElementById('productName').textContent = product[1];
            document.getElementById('productPrice').textContent = product[2];
        } else {
            document.getElementById('productName').textContent = '제품을 찾을 수 없습니다';
            document.getElementById('productPrice').textContent = '';
        }
    }, function(response) {
        console.error('Error: ' + response.result.error.message);
    });
}

document.getElementById('barcodeInput').addEventListener('change', function(e) {
    searchProduct(e.target.value);
});

document.getElementById('printButton').addEventListener('click', function() {
    window.print();
});

handleClientLoad();