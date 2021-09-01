Email Parser

The purpose of this program is to extract the particular statements from the email message. The email will have statements like:
10 May 2021: 9.130
11 May 2021: 12500
12 May 2021: 140.25
10/11/2020: 345
1st March 20: 67.9

The email can have statements with different date format and number format.


The function needs to output an object (dictionary) of dates and values, and the mean of values in the same message:
{
“sender”: “email@example.com”,
“values”: {
“2021-05-10”: 9.130,
“2021-05-11”: 12500,
“2021-05-12”: 140.25
},
“mean”: 4216.46
} 




Dependencies to be installed:

->eml-parser
->jest
->moment
->babel
->node.js


Input:

eml message file. one included in the folder to test the program. 


Assumptions:
-> Each statement with date and number contains a colon ':' separating date with number
->  Date is followed by ':' without any space
->  Colon is followed by Number with a space in between
