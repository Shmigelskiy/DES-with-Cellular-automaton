import { workerData, parentPort } from "worker_threads"
import splitToBinaryChunks from "../utils/splitToBinaryChunks.js"
import { 
  getSubKeys,
  initialPermitation,
  finalPermitation,
  f,
  xor,
} from "../des/des.functions.js"
import getDESSBoxValue from "../des/getDESSBoxValue.js"
import fromBinaryChunk from "../utils/fromBinaryChunk.js"
import CAdesSBoxesGenerator from "../ca/CAdesSBoxesGenerator.js"

const {
  text,
  key,
  isDecode
} = workerData

perform()

function perform() {
  if(!text.length) {
    parentPort.postMessage(text)
    return
  }

  const chunks = splitToBinaryChunks(text)
  let subKeys = getSubKeys(key)

  if(isDecode) {
    subKeys = subKeys.reverse()
  }

  const sBoxGenerator = new CAdesSBoxesGenerator(subKeys)

  const encodedChunks = chunks.map(chunk => {
    const initialPermutedValue = initialPermitation(chunk)
    let l = initialPermutedValue.substring(0, 32)
    let r = initialPermutedValue.substring(32, 64)

    for (let idx = 0; idx < subKeys.length; idx++) {
      const roundKey = subKeys[idx]

      const prevR = r
      
      r = xor(l, f(r, roundKey, sBoxGenerator.getSBoxValue))
      l = prevR
    }

    const encodedBinaryChunk = finalPermitation(r + l)
    return fromBinaryChunk(encodedBinaryChunk)
  })

  parentPort.postMessage(encodedChunks.join(""))
}
