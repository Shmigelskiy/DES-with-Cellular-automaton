const PADDING = '00000000'
const S_BOXES_RULES = [
  [135, 137, 106, 15],
  [89, 102, 90, 53],
  [150, 105, 83, 61],
  [75, 86, 73, 165],
  [101, 103, 39, 193],
  [149, 51, 27, 210],
  [45, 225, 25, 120],
  [195, 153, 124, 30],
].map(row => row.map(n => {
  const compact = n.toString(2)
  return PADDING.substring(0, PADDING.length - compact.length) + compact
}))

const INITIAL_BORDER = '--------'
const BORDER_CHAR = '-'

const MAX_ADITIONAL_MUTATIONS = 16

export default class CAdesSBoxesGenerator {

  constructor(subKeys) {
    this.subKeys = subKeys
    this.cache = {}
    this.calculateSBoxes()
  }

  getSBoxValue = (sBoxIdx, rowDefinition, colDefinition, roundKey, keyMixedValue) => {
    const additionalMutationsBinary = keyMixedValue[0] + keyMixedValue[1] + keyMixedValue[46] + keyMixedValue[47]
    const additionalMutations = parseInt(additionalMutationsBinary, 2)
    const row = parseInt(rowDefinition, 2)
    const col = parseInt(colDefinition, 2)
    return this.cache[roundKey][sBoxIdx][row][additionalMutations][col]
  }

  calculateSBoxes() {
    this.subKeys.forEach(subKey => {
      this.cache[subKey] = {}

      S_BOXES_RULES.forEach((rules, sBoxIdx) => {
        this.cache[subKey][sBoxIdx] = {}

        rules.forEach((rule, rowIdx) => {
          this.cache[subKey][sBoxIdx][rowIdx] = {}

          for(let aditionalMutations = 0; aditionalMutations < MAX_ADITIONAL_MUTATIONS; aditionalMutations++) {
            this.cache[subKey][sBoxIdx][rowIdx][aditionalMutations] = this.getSBoxRow(subKey, rule, aditionalMutations)
          }
        })
      })
    })
  }

  getSBoxRow(key, rule, aditionalMutations) {
    const row = this.generateBinaryRowFromKey(key, rule, aditionalMutations)

    const result = []
    for(let idx = 0; idx < 16; idx++) {
      result.push(row.substring(idx * 4, (idx + 1) * 4))
    }
    const padding = '0000'
    return new Array(16).fill("").map((e, i) => {
      const compact = i.toString(2)
      return padding.substring(0, padding.length - compact.length) + compact
    }).sort((a, b) => result.indexOf(a) - result.indexOf(b))
  }

  generateBinaryRowFromKey(key, rule, aditionalMutations) {
    let row = INITIAL_BORDER + key + INITIAL_BORDER
    let counter = -1
    
    while(counter < aditionalMutations || row.includes(BORDER_CHAR)) {
      let nextRow = ''
      for(let idx = 0; idx < row.length; idx++) {
        let lIdx = idx - 1
        if(lIdx < 0) {
          lIdx = row.length + lIdx
        }
        let rIdx = idx + 1
        if( rIdx >= row.length) {
          rIdx = row.length - lIdx
        }

        nextRow += this.getNextState(rule, row[lIdx], row[idx], row[rIdx])
      }
      row = nextRow
      if(!row.includes(BORDER_CHAR)) {
        counter++
      }
    }

    return row
  }

  getNextState(rule, l, c, r) {
    if([l, c, r].every(c => c === BORDER_CHAR)) {
      return BORDER_CHAR
    }
    const binaryIdx = [l, c, r].map(bit => bit === '1' ? '1' : '0').join("")
    const idx = parseInt(binaryIdx, 2)
    return rule[rule.length - idx - 1]
  }
}

