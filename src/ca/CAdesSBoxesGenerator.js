const PADDING = '00000000'
const S_BOXES_RULES = [
  [193, 27, 102, 60],
  [150, 165, 225, 195],
  [101, 30, 89, 105],
  [73, 53, 83, 39],
  [153, 135, 86, 75],
  [137, 103, 109, 61],
  [51, 124, 45, 25],
  [169, 149, 90, 67],
].map(row => row.map(n => {
  const compact = n.toString(2)
  return PADDING.substring(0, PADDING.length - compact.length) + compact
}))

const INITIAL_BORDER = '--------'
const BORDER_CHAR = '-'

export default class CAdesSBoxesGenerator {

  constructor(subKeys) {
    this.subKeys = subKeys
    this.cache = {}
    this.calculateSBoxes()
  }

  getSBoxValue = (sBoxIdx, rowDefinition, colDefinition, roundKey) => {
    const row = parseInt(rowDefinition, 2)
    const col = parseInt(colDefinition, 2)
    return this.cache[roundKey][sBoxIdx][row][col]
  }

  calculateSBoxes() {
    this.subKeys.forEach(subKey => {
      this.cache[subKey] = {}

      S_BOXES_RULES.forEach((rules, sBoxIdx) => {
        this.cache[subKey][sBoxIdx] = {}

        rules.forEach((rule, rowIdx) => {
          this.cache[subKey][sBoxIdx][rowIdx] = this.getSBoxRow(subKey, rule)
        })
      })
    })
  }

  getSBoxRow(key, rule) {
    const row = this.generateBinaryRowFromKey(key, rule)

    const result = []
    for(let idx = 0; idx < 16; idx++) {
      result.push(row.substring(idx * 4, (idx + 1) * 4))
    }

    return result
  }

  generateBinaryRowFromKey(key, rule) {
    let row = INITIAL_BORDER + key + INITIAL_BORDER
  
    while(row.includes(BORDER_CHAR)) {
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