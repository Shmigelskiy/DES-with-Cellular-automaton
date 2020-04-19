import { LETTERS_PER_CHUNK, THREADS_COUNT } from "../../const.js"

export default function splitToWorkerChunks(text) {
  text = addSpaces(text)
  const encodingChunksCount = text.length / LETTERS_PER_CHUNK
  const encodingChunksPerWorker = Math.ceil(encodingChunksCount / THREADS_COUNT)
  const lettersPerWorker = encodingChunksPerWorker * LETTERS_PER_CHUNK
  
  const chunks = []
  
  for(let i = 0; i < THREADS_COUNT; i++) {
    chunks.push(text.substring(i * lettersPerWorker, (i + 1) * lettersPerWorker))
  }

  return chunks
}

function addSpaces(text) {
  const lastChunkLettersCount = text.length % LETTERS_PER_CHUNK
  if(lastChunkLettersCount) {
    let remain = LETTERS_PER_CHUNK - lastChunkLettersCount
    while(remain) {
      text += " "
      remain--
    }
  }
  return text
}