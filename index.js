let moment = require('moment');
let emlParser = require("eml-parser");
let fs = require('fs');

// Using eml-parser to read eml message and convert it to html string for manipulation
let file = fs.createReadStream('./Email Parsing.eml');
new emlParser(file)
    .getEmailAsHtml()
    .then(htmlString => {

        // extracting and trimming unnecessary parts of senders email
        let senderString = htmlString.match(/mailto:\S+(?=")/g)[0];
        let sender = senderString.replace(/mailto:/g, '');


        let bodyString = stripHtml(htmlString); // Strip all the html code and returns original message as string
        let bodyArray = stringToArray(bodyString); // break down string to array
        let indices = getIndices(bodyArray); // Get Indexes of ':' to look for valid statements

        //console.log(bodyArr);

        let output = {};
        let values = {};
        let total = 0;
        let totalValues = 0;

        // Possible date formats to be checked against input.
        let dateFormats = ["DD/MM/YYYY", "D/MM/YYYY", "DD/M/YYYY", "D/M/YYYY", "D/M/YY", "DD/MM/YY", "D/MM/YY", "DD-MM-YYYY", "D-MM-YYYY", "DD-M-YYYY", "D-M-YYYY", "D-M-YY", "DD-MM-YY", "D-MM-YY",
            "DMMMYY", "DDMMMYY", "DMMMYYYY", "DMMMMYY", "DMMMMYYYY", "DDMMMMYYYY", "DDMMMYY", "DDMMMYY", "DDMMMYYYY", "DDMMMMYY", "DoMMMYY", "DoMMMYY", "DoMMMYYYY", "DoMMMMYY", "DoMMMMYYYY"];

        let dateFormatsWithString = ["D MMM YY", "DD MMM YY", "D MMM YYYY", "D MMMM YY", "D MMMM YYYY", "DD MMMM YYYY", "DD MMM YY", "DD MMM YY", "DD MMM YYYY", "DD MMMM YY",
            "Do MMM YY", "Do MMM YY", "Do MMM YYYY", "Do MMMM YY", "Do MMMM YYYY", "DMMMYY", "DDMMMYY", "DMMMYYYY", "DMMMMYY", "DMMMMYYYY", "DDMMMMYYYY", "DDMMMYY", "DDMMMYY",
            "DDMMMYYYY", "DDMMMMYY", "DoMMMYY", "DoMMMYY", "DoMMMYYYY", "DoMMMMYY", "DoMMMMYYYY"];

        /*
            Assumptions
        -> Each statement with date and number contains a colon ':' separating date with number
        ->  Date is followed by ':' without any space
        ->  Colon is followed by Number with a space in between
         */

        for (let i = 0; i < indices.length; i++) {
            let possibleNum = bodyArray[indices[i] + 1]; // Next element to the one containing ':', which might be a number in valid statement
            let possibleDate = stripDate(bodyArray[indices[i]]); // Remove colons from the date
            let possibleDateWithString = bodyArray[indices[i] - 2] + bodyArray[indices[i] - 1] + possibleDate; //  If date is in a format with spaces in between such as 10 May 2021, get all the elements and arrange them

            let isNum = isNaN(possibleNum);

            //  if it's a valid number after colon check if it's followed by a valid date
            if (!isNum) {
                let formattedValue = parseFloat(possibleNum);

                if (moment(possibleDate, dateFormats, true).isValid()) {
                    // if date matches the format, convert it to MM-DD-YYYY and pass to moment to be converted to required format
                    possibleDate = possibleDate.replace(/-/g, '/');
                    let dateSplit = possibleDate.split('/');

                    let momentDate = getMomentDateObject(dateSplit[1] + '-' + dateSplit[0] + '-' + dateSplit[2]);
                    values[momentDate] = formattedValue;
                    total += formattedValue;
                    totalValues++;
                } else if (moment(possibleDateWithString, dateFormatsWithString, true).isValid()) {

                    let momentDate = getMomentDateObject(possibleDateWithString);
                    values[momentDate] = formattedValue;
                    total += formattedValue;
                    totalValues++;
                }
                // else {console.log("No Valid Statements")}
            }
        }


        output['sender'] = sender;
        output['values'] = values;
        output['mean'] = total / totalValues;

        console.log('output', output);


    })
    .catch(err => {
        console.log(err);
    })

/**
 * Strip all the HTML code from the string
 * @param body with html text
 * @returns string with no html text
 */
function stripHtml(body) {
    //let bodyArr = body.split(' ');

    // let bodyStr = body.split('<body>').pop().split('</body>')[0];
    //let fg = bodyStr.replace(/<\/div>/ig, ' ');
    let strippedStr = body.replace(/<[^>]+>/g, ' ');
    let nospaceStr = strippedStr.replace(/&nbsp;/g, '');
    return nospaceStr.replace(/\s+/g, ' ').trim();
}

/**
 *  Split the string at whitespace and saves all the elements in an array
 * @param bodyString
 * @returns Array
 */
function stringToArray(bodyString) {
    return bodyString.split(" ");
}

/**
 * Find all the indexes of the elements containing :
 * @param body
 * @returns Array
 */

function getIndices(body) {
    let indices = [];
    for (let i = 0; i < body.length; i++) {
        if (body[i].includes(":")) indices.push(i);
    }
    return indices;
}

/**
 * Remove : from the date string element
 * @param dateStr
 * @returns String
 */

function stripDate(dateStr) {
    return dateStr.replace(/:/g, '');
}

/**
 *  Return date string in YYYY-MM-DD
 * @param date
 * @returns {string}
 */
function getMomentDateObject(date) {
    return moment(date).format("YYYY-MM-DD");
}


//export {getMomentDateObject};
//export {getIndices};




