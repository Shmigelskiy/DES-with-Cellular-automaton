import BinaryNumber from './src/BinaryNumber'
import CellularAutomationBinaryRule from './src/CellularAutomation/CellularAutomationBinaryRule'
import CellularAutomationGenerator from './src/CellularAutomation/CellularAutomationGenerator'

const b30 = BinaryNumber.fromNumber(30, 8)
console.log(b30.asString)
b30.shift(1)
console.log(b30.asString)

// const rule = new CellularAutomationBinaryRule(b30)
// const generator = new CellularAutomationGenerator(rule)

// const key = BinaryNumber.createEmpty(48)
// key.updateBit(1, true)

// const state = generator.generateBinaryNumberFromKey(key)

// console.log(state.asString)