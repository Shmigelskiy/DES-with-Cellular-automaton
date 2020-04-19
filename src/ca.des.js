import splitToWorkerChunks from './utils/splitToWorkerChunks.js'
import runWorker from "./workers/runWorker.js"

const WORKER_NAME = 'ca.des.worker'

export async function encode(text, key) {
  return runWorkers(text, key, false).catch(err => console.error(err)) 
}

export async function decode(text, key) {
  return runWorkers(text, key, true).catch(err => console.error(err)) 
}

async function runWorkers(sourse, key, isDecode) {
  const workerChunks = splitToWorkerChunks(sourse)

  const result = await Promise.all(
    workerChunks.map(text => {
      return runWorker(WORKER_NAME, { text, key, isDecode })
    })
  )

  return result.join("")
}

