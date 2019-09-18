import ISBox from "./ISBox";
import CellularAutomationGenerator from "../CellularAutomation/CellularAutomationGenerator";
import BinaryNumber from "../BinaryNumber";

const GENERATORS_COUNT = 4
const COLUMNS_COUNT = 16

export class CellularAutomationSBox implements ISBox {

  constructor(
    private generators: CellularAutomationGenerator[]
  ) {
    if(generators.length !== GENERATORS_COUNT) {
      throw new Error('CellularAutomationSBox: generators count should be 4')
    }
  }

  getValue(row: BinaryNumber, col: BinaryNumber, key: BinaryNumber): BinaryNumber {
    // console.log(row.asDecimal, col.asDecimal)
    const generator = this.generators[row.asDecimal]
    const rowValue = generator.generateBinaryNumberFromKey(key)
    return rowValue.split(COLUMNS_COUNT)[col.asDecimal]
  }
}