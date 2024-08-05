const API_KEY = 'AIzaSyAoBsyYaBLDPphqhwBx-feeLkgAtenIcdY';
const SPREADSHEET_ID = '1EQtoYa_8EcvGZnRiyWK7tODe5J_HYMeGJUqMUi2xtUY';

let productCount = 0;
let gapiInitialized = false;

function initClient() {
    gapi.client.init({
        'apiKey': API_KEY,
        'discoveryDocs': ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(function() {
        console.log('Google Sheets API client initialized');
        gapiInitialized = true;
    }, function(error) {
        console.error('Error initializing Google Sheets API client:', error);
    });
}

function handleClientLoad() {
    gapi.load('client', initClient);
}

function addProductToList(name, price) {
    productCount++;
    const tbody = document.querySelector('#productList tbody');
    const row = tbody.insertRow();
    const quantity = 1; // 기본 수량을 1로 설정
    const priceValue = parseInt(price.replace(/,/g, '')); // 가격에서 쉼표 제거 후 정수로 변환
    const totalPrice = priceValue * quantity;
    row.innerHTML = `
        <td>${productCount}</td>
        <td>${name}</td>
        <td>${price}</td>
        <td><input type="number" value="${quantity}" min="1" onchange="updateTotalPrice(this)"></td>
        <td>${totalPrice.toLocaleString()}</td> <!-- 쉼표 추가 -->
    `;
    updateTotalSum();
}

function updateTotalPrice(input) {
    const row = input.closest('tr');
    const price = parseInt(row.cells[2].textContent.replace(/,/g, '')); // 가격에서 쉼표 제거 후 정수로 변환
    const quantity = parseInt(input.value);
    const totalPrice = price * quantity;
    row.cells[4].textContent = totalPrice.toLocaleString(); // 쉼표 추가
    updateTotalSum();
}

function updateTotalSum() {
    const totalSum = Array.from(document.querySelectorAll('#productList tbody tr'))
        .reduce((sum, row) => {
            return sum + parseFloat(row.cells[4].textContent.replace(/,/g, '')); // parseFloat로 변경하고 쉼표 제거
        }, 0);
    document.getElementById('totalSum').textContent = totalSum.toLocaleString(); // 쉼표 추가
}
function searchProduct(barcode) {
    if (!gapiInitialized) {
        console.log('Google Sheets API not initialized yet. Trying again in 1 second.');
        setTimeout(() => searchProduct(barcode), 1000);
        return;
    }

    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet1!A1:C',
    }).then(function(response) {
        const values = response.result.values;
        const product = values.find(row => row[0] === barcode);
        if (product) {
            addProductToList(product[1], product[2]);
        } else {
            console.log('Product not found for barcode:', barcode);
            alert('Product not found for barcode: ' + barcode);
        }
    }, function(response) {
        console.error('Error: ' + response.result.error.message);
        alert('Error searching for product: ' + response.result.error.message);
    });
}

document.getElementById('barcodeInput').addEventListener('input', function(e) {
    const barcode = this.value.trim();
    if (barcode.length === 13) {  // Assuming barcode is 13 digits
        searchProduct(barcode);
        this.value = ''; // Clear input field
    }
});

document.getElementById('printButton').addEventListener('click', function() {
    // Create a new element for date and time
    const dateTimeElement = document.createElement('div');
    dateTimeElement.id = 'printDateTime';
    const now = new Date();
    dateTimeElement.textContent = `Printed on: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    
    // Add the element to the page
    document.body.appendChild(dateTimeElement);
    
    // Print the page
    window.print();
    
    // Remove the element after printing
    setTimeout(() => {
        document.body.removeChild(dateTimeElement);
    }, 0);
});

handleClientLoad();

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}