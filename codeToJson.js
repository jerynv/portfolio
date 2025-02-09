//let input be example.js file as a string 
import fs from 'fs';

let input = fs.readFileSync('example.swift', 'utf8');

//remove all the new lines

let output = JSON.stringify(input);

console.log(output);