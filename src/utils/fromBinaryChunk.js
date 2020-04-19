import { 
  LETTERS_PER_CHUNK, 
  BITS_PER_LETTER
} from "../../const.js"

export default function fromBinaryChunk(chunk) {
  let result = ''
  for(let i = 0; i < LETTERS_PER_CHUNK; i++) {
    const charCode = parseInt(chunk.substring(i * BITS_PER_LETTER, (i + 1) * BITS_PER_LETTER), 2)
    result += String.fromCharCode(charCode)
  }
  return result
}