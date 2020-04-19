import { 
  LETTERS_PER_CHUNK, 
  BITS_PER_LETTER
} from "../../const.js"

const PADDING = new Array(BITS_PER_LETTER).fill("0").join('')

export default function splitToBinaryChunks(text) {
  const chunks = []
  let temp = ''

  for(let i = 0; i < text.length; i++) {
    const compact = text.charCodeAt(i).toString(2)
    const padded = PADDING.substring(0, PADDING.length - compact.length) + compact

    temp += padded

    if((i + 1) % LETTERS_PER_CHUNK === 0) {
      chunks.push(temp);
      temp = ''
      
    }
  }

  return chunks
}
