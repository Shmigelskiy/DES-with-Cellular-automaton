import Des from "./src/Des/Des";
import CellularAutomationDes from "./src/Des/CellularAutomationDes";
import * as fs from 'fs';

const SOURCE_FILENAME = 'data/PlainText.txt'
const RESULT_FILENAME = 'data/CADesResult.txt'
const KEY = '1110110010100001111010101000000101010100011101001010100101010111'

const des = new CellularAutomationDes()


const data = fs.readFileSync(SOURCE_FILENAME, 'utf8').slice(0, 100000000)
const decoded = des.decodeBinaryArraysFromFile(KEY, RESULT_FILENAME)
console.log( data.split('').filter(c=>c==='e').length / data.length )
