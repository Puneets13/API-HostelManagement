// // excelUtils.js
// const moment = require('moment');
// const ExcelJS = require('exceljs');

// function generateExcelFileName() {
//     return `output_${moment().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;
// }

// async function exportDataToExcel(collectionData) {
//     const fileName = generateExcelFileName();
//     const workbook = new ExcelJS.Workbook();
//     const sheet = workbook.addWorksheet('Sheet1');

//     const mainDocumentHeaderValues = Object.keys(collectionData[0] || {});
//     sheet.addRow(mainDocumentHeaderValues);

//     // Add data for each main document
//     collectionData.forEach((document) => {
//         const mainDocumentValues = Object.values(document);
//         sheet.addRow(mainDocumentValues);

//         // Add headers for the meals array
//         const mealsHeaderValues = Object.keys(document.meals[0] || {});
//         sheet.addRow(mealsHeaderValues.map((header) => `meal_${header}`));

//         // Add data for each meal in the meals array
//         document.meals.forEach((meal) => {
//             const mealValues = Object.values(meal);
//             sheet.addRow(mealValues);
//         });
//     });



//     await workbook.xlsx.writeFile(fileName);
//     console.log(`Excel file (${fileName}) updated.`);
// }

// module.exports = { generateExcelFileName, exportDataToExcel };













// // excelUtils.js
// const moment = require('moment');
// const ExcelJS = require('exceljs');

// let currentDate;
// let currentFileName;

// function generateExcelFileName() {
//     // Use the date only as the file name
//     return `output_${moment().format('YYYY-MM-DD')}.xlsx`;
// }

// async function exportDataToExcel(collectionData) {
//     const todayDate = moment().format('YYYY-MM-DD');

//     if (!currentDate || currentDate !== todayDate) {
//         // If it's a new day, update the current date and generate a new file name
//         currentDate = todayDate;
//         currentFileName = generateExcelFileName();
//     }

//     const workbook = new ExcelJS.Workbook();
//     let sheet;

//     try {
//         // If the file already exists, load it to update the changes
//         await workbook.xlsx.readFile(currentFileName);
//         sheet = workbook.getWorksheet('Sheet1');
//     } catch (error) {
//         // If the file doesn't exist, create a new sheet
//         sheet = workbook.addWorksheet('Sheet1');

//         // Add headers for the main document properties
//         const mainDocumentHeaderValues = Object.keys(collectionData[0] || {});
//         sheet.addRow(mainDocumentHeaderValues);
//     }

//     // Add data for each main document
//     collectionData.forEach((document) => {
//         const mainDocumentValues = Object.values(document);
//         sheet.addRow(mainDocumentValues);

//         // Add headers for the meals array
//         const mealsHeaderValues = Object.keys(document.meals[0] || {});
//         sheet.addRow(mealsHeaderValues.map((header) => `meal_${header}`));

//         // Add data for each meal in the meals array
//         document.meals.forEach((meal) => {
//             const mealValues = Object.values(meal);
//             sheet.addRow(mealValues);
//         });
//     });

//     await workbook.xlsx.writeFile(currentFileName);
//     console.log(`Excel file (${currentFileName}) updated.`);
// }

// module.exports = { generateExcelFileName, exportDataToExcel };




// 29//01//2024
// excelUtils.js
const moment = require('moment');
const ExcelJS = require('exceljs');
const mongoose = require('mongoose');

// Assuming you have a Mongoose model named 'Diet'
const DietModel = require('../models/diet.js'); // Make sure to adjust the path based on your project structure

let workbook;
let sheet;

async function initExcelFile() {
    workbook = new ExcelJS.Workbook();
    try {
        // Try to load the existing file
        await workbook.xlsx.readFile('output.xlsx');
        sheet = workbook.getWorksheet('Sheet1');
    } catch (error) {
        // If the file doesn't exist, create a new sheet
        sheet = workbook.addWorksheet('Sheet1');
        // Add headers for the main document properties
        const mainDocumentHeaderValues = ['_id', 'rollNumber', 'roomNumber', 'hostelName', 'month', 'year', '__v'];
        sheet.addRow(mainDocumentHeaderValues);
          // Add headers for the main document properties
        // const mainDocumentHeaderValues = Object.keys(collectionData[0] || {});
        // sheet.addRow(mainDocumentHeaderValues);
    }
}

async function exportDataToExcel(hostelName) {
const todayDate = moment().format('YYYY-MM-DD');
    // Get the current date
const currentDate = moment();

// Extract the year and month
const year = currentDate.year();
const month = currentDate.month() + 1; // Note: Months are zero-based, so add 1 to get the correct month


    // Find documents in MongoDB based on conditions (e.g., current date)
    const collectionData = await DietModel.find({
        hostelName:hostelName,
        month:month,
        year:year
        // Add more conditions if needed
    }).lean();

    console.log(collectionData);

    if (!workbook || !sheet) {
        await initExcelFile();
    }

    // // Iterate over the documents and update or add rows in the Excel sheet
    // collectionData.forEach(async (document) => {
    //     const existingRow = sheet.findRow(1, document._id.toString());

    //     if (existingRow) {
    //         // If the row exists, update the values
    //         existingRow.values = Object.values(document);
    //     } else {
    //         // If the row doesn't exist, add a new row
    //         sheet.addRow(Object.values(document));
    //     }
    // });


    // Iterate over the documents and update or add rows in the Excel sheet
    collectionData.forEach(async (document) => {
        const existingRow = sheet.findRow(1, document._id.toString());

        if (existingRow) {
            // If the row exists, update the values
            existingRow.values = Object.values(document);
        } else {
            // If the row doesn't exist, add a new row
            sheet.addRow(Object.values(document));
        }

        // Iterate inside the meals array and search for the current date
        document.meals.forEach(async (meal) => {
            if (meal.date === todayDate) {
                const existingMealRow = sheet.findRow(1, meal._id.toString());

                if (existingMealRow) {
                    // If the meal row exists, update the values
                    existingMealRow.values = Object.values(meal);
                } else {
                    // If the meal row doesn't exist, add a new row
                    sheet.addRow(Object.values(meal));
                }
            }
        });
    });

    // Save the changes to the Excel file
    await workbook.xlsx.writeFile('output.xlsx');
    console.log(`Excel file (output.xlsx) updated.`);
}

module.exports = { exportDataToExcel };
