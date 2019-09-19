import * as fs from 'fs';
import DesBlock from "./DesBlock";
import BinaryNumber from "../BinaryNumber";

const KEY_LENGTH = 64
const TEXT_CHUNK_LENGTH = 64
const BITS_PER_LETTER = 16
const LETTERS_PER_CHUNK = TEXT_CHUNK_LENGTH / BITS_PER_LETTER

export default class DesRunner {

  constructor(
    private readonly desBlock: DesBlock
  ) {}

  public encodeText(text: string, key: string) {
    const binaryKey = BinaryNumber.fromBinaryString(key, KEY_LENGTH)
    const binaryChunks = this.getBinaryChunksFromText(text)

    const encodedChunks = binaryChunks.map(chunk => this.desBlock.encode(chunk, binaryKey))
    return this.getTextFromBinaryChunks(encodedChunks)
  }

  public decodeText(text: string, key: string) {
    const binaryKey = BinaryNumber.fromBinaryString(key, KEY_LENGTH)
    const binaryChunks = this.getBinaryChunksFromText(text)

    const decodedChunks = binaryChunks.map(chunk => this.desBlock.decode(chunk, binaryKey))
    return this.getTextFromBinaryChunks(decodedChunks)
  }

  public writeBinaryArraysToFile(text: string, key: string, fileName: string){
    const binaryKey = BinaryNumber.fromBinaryString(key, KEY_LENGTH)
    const binaryChunks = this.getBinaryChunksFromText(text)
    console.log("Start Encoding")

    let currentPercent = 0
    console.time("t")
    binaryChunks.forEach((chunk, idx) => {
      const newPercent = Math.round(idx / binaryChunks.length * 100)
      if(newPercent !== currentPercent) {
        currentPercent = newPercent
        console.log(newPercent + '%')
        console.timeEnd("t")
      }

      const encoded = this.desBlock.encode(chunk, binaryKey)
      fs.appendFileSync(fileName, encoded.asString, 'binary')
    })

    console.log("Ready")
  }

  public decodeBinaryArraysFromFile(key: string, filename: string) {
    const binaryKey = BinaryNumber.fromBinaryString(key, KEY_LENGTH)
    const data = fs.readFileSync(filename, 'utf8').slice(0, 64*20)
    const chunks = BinaryNumber.fromBinaryString(data).split(20)
    const decodedChunks = chunks.map(chunk => this.desBlock.decode(chunk, binaryKey))
    return this.getTextFromBinaryChunks(decodedChunks)
  }

  private getBinaryChunksFromText(text: string): BinaryNumber[] {
    const lastChunkLettersCount = text.length % LETTERS_PER_CHUNK
    if(lastChunkLettersCount) {
      text += new Array(LETTERS_PER_CHUNK - lastChunkLettersCount).fill(' ').join('')
    }
    const chunks: BinaryNumber[] = []
    let counter = 0
    let temp = []

    text.split('').forEach(char => {
      counter++
      temp.push(char)

      if(counter === LETTERS_PER_CHUNK) {
        chunks.push(BinaryNumber.concat(
          temp.map(char => BinaryNumber.fromNumber(char.charCodeAt(0), BITS_PER_LETTER))
        ))
        counter = 0
        temp = [] 
      }
    })

    return chunks
  }

  private getTextFromBinaryChunks(chunks: BinaryNumber[]): string {
    let result = ''
    chunks.forEach(chunk => {
      chunk.split(LETTERS_PER_CHUNK).forEach(charCode => {
        result += String.fromCharCode(charCode.asDecimal)
      })
    })
    return result
  }
}