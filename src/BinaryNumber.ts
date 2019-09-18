
const ONE = '1'
const ZERO = '0'

const CHAR_TO_STATE = {
  [ONE]: true,
  [ZERO]: false
}

const STATE_TO_CHAR = {
  true: ONE,
  false: ZERO
}


const STATE_VALUES = [true, false]

export default class BinaryNumber {

  static fromBinaryString(binaryString: string, length?: number): BinaryNumber {
    const characters = binaryString.split('').reverse()
    const state: boolean[] = new Array(length || characters.length).fill(false)

    characters.forEach((char, idx) => {
      if(char !== ONE && char !== ZERO) {
        throw new Error('Binary numbers can contain only 1 or 0')
      }
   
      state[idx] = CHAR_TO_STATE[char]
    })

    return new BinaryNumber(state)
  }

  static fromNumber(decimalNumber: number, length?: number): BinaryNumber {
    return BinaryNumber.fromBinaryString(decimalNumber.toString(2), length)
  }

  static createEmpty(length: number) {
    const state = new Array(length).fill(null)
    return new BinaryNumber(state)
  }

  constructor(
    private readonly state: boolean[]
  ) {}

  public get length(): number {
    return this.state.length
  }

  public get isFilled(): boolean {
    return this.state.every(stateItem => STATE_VALUES.includes(stateItem))
  }

  public get asString(): string {
    return this.state.map(stateItem => STATE_TO_CHAR[stateItem.toString()]).reverse().join('')
  }

  public get asDecimal(): number {
    return eval(`0b${this.asString}`)
  }


  public updateBit(index: number, value: boolean): void {
    const storingIndex = this.getStoringIndex(index)
    if(storingIndex < 0) {
      return
    }
    this.state[storingIndex] = value
  }

  public getBit(index: number): boolean {
    const storingIndex = this.getStoringIndex(index)
    return this.state[storingIndex]
  }

  public forEach(cb: (item: boolean, index: number) => void) {
    return this.state.slice().reverse().forEach(cb)
  }

  public fillStartsWith(startIndex: number, source: BinaryNumber): void {
    source.forEach((item, idx) => {
      this.updateBit(startIndex + idx, item)
    })
  }

  public shift(bitsCount): void {
    this.state.forEach((item, idx) => {
      this.updateBit(idx, !!this.getBit(idx + bitsCount))
    })
  }

  public permute(order: number[]): BinaryNumber {
    const state = order.map(sourceIdx => this.getBit(sourceIdx))
    return new BinaryNumber(state)
  }

  public copy(): BinaryNumber {
    return new BinaryNumber(this.state.slice())
  }

  private getStoringIndex(index:number) {
    return this.length - index - 1
  }

}