const Tesseract  = require('tesseract.js');
const path = require('path');
const regex_Pattern = "(0[1-9]|1[0-9]|2[0-9]|3[01]).(0[1-9]|1[012]).([19]{2})?([1-9]{2})";
const image = path.resolve(__dirname, '../../../../../Downloads/aadhar\ Nidhi_page-0001.jpg');

// Pdf reading is not supported
async function convertToText(name){
    try{
        // image format supported by Tesseract are jpg, png, bmp and pbm
        let imgText = await Tesseract.recognize(name,'eng');
        actualText = imgText.data.text
       let result = actualText.match(regex_Pattern)
       console.log(result[0])
    }catch(error){
        console.error("Error during text recognition:",error)
    }
}

convertToText(image)
