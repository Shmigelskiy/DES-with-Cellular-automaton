import ICellularAutomationRule from "./ICellularAutomationRule";
import BinaryNumber from "../BinaryNumber";

const GENERATED_NUMBER_LENGTH = 64
const KEY_LENGTH = 48
const START_KEY_POSITION = (GENERATED_NUMBER_LENGTH - KEY_LENGTH) / 2

export default class CellularAutomationGenerator {

  constructor (
    private readonly rule: ICellularAutomationRule
  ) {}

  generateBinaryNumberFromKey(key: BinaryNumber) {
    if(key.length !== KEY_LENGTH) {
      throw new Error('CellularAutomationGenerator: invalid key length')
    }

    let state = BinaryNumber.createEmpty(GENERATED_NUMBER_LENGTH)
    state.fillStartsWith(START_KEY_POSITION, key)

    while(!state.isFilled) {
      state = this.getNextRowState(state)
    }

    return state
  }

  private getNextRowState(beginState: BinaryNumber): BinaryNumber {
    const nextState = BinaryNumber.createEmpty(GENERATED_NUMBER_LENGTH)
    nextState.forEach((item, idx) => {
      const left = beginState.getBit(idx - 1)
      const center = beginState.getBit(idx)
      const right = beginState.getBit(idx + 1)
      if(![left, center, right].some(s => typeof s === 'boolean')) {
        return
      }
      
      const nextBitState = this.rule.getNextState(!!left, !!center, !!right)
      nextState.updateBit(idx, nextBitState)
    })
    return nextState
  }

}