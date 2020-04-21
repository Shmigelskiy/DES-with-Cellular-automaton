import * as fs from 'fs'
import { encode, decode } from "./src/ca.des.js"

const SOURCE_FILENAME = 'data/pi.txt'
const RESULT_FILENAME = 'data/CAdes/CADESPI.txt'
const KEY = '1110110010100001111010101000000101010100011101001010100101010111'


const data = fs.readFileSync(SOURCE_FILENAME, 'utf8')

run()

async function run() {
  const res = await encode(data, KEY)
  fs.writeFileSync(RESULT_FILENAME, res, 'binary')
}



async function test() {
  const encoded = await encode("Test row", KEY)
  console.log("Encoded - ", encoded)
  const decoded = await decode(encoded, KEY)
  console.log("Decoded - ", decoded)
}
