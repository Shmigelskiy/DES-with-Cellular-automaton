import ICellularAutomationRule from "./ICellularAutomationRule";
import BinaryNumber from "../BinaryNumber";

const POSSIBLE_PREV_STATES = ['111', '110', '101', '100', '011', '010', '001', '000']
const RULE_LENGTH = 8

export default class CellularAutomationBinaryRule implements ICellularAutomationRule {
  
  constructor(
    private readonly ruleNumber: BinaryNumber
  ) {
    if(this.ruleNumber.length !== RULE_LENGTH) {
      throw new Error('CellularAutomationBinaryRule: ruleNumber length must be 8')
    }
  }

  getNextState(left: boolean, center: boolean, right: boolean): boolean {
    const prevStateString = new BinaryNumber([left, center, right]).asString
    const nextStateIndex = POSSIBLE_PREV_STATES.indexOf(prevStateString)
    const nextState = this.ruleNumber.getBit(nextStateIndex)

    if(typeof nextState !== 'boolean') {
      throw new Error('CellularAutomationBinaryRule: incorrect ruleNumber')
    }

    return nextState
  }
}