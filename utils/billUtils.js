// function generateBillNumber() {
//     const currentDate = new Date();
//     const year = currentDate.getFullYear;
//     const month = (currentDate.getMonth()+1).toString().padStart(2,'0');
//     const day = currentDate.getDate().toString().padStart(2,'0');
//     const hours = currentDate.getHours().toString().padStart(2,'0');
//     const minutes = currentDate.getMinutes().toString().padStart(2,'0');
//     const seconds = currentDate.getSeconds().toString().padStart(2,'0');

//     const randomPart = Math.floor(Math.random()*9000)+1000;

//     const billNumber = `${year}${month}${day}${hours}${minutes}${seconds}${randomPart}`;
//     return billNumber;
// };

let billCounter = 1001; // Initial bill number

function generateBillNumber() {
    const billNumber = `BILL-${billCounter}`;
    billCounter++; // Increment for the next bill
    return billNumber;
}


module.exports = { generateBillNumber };