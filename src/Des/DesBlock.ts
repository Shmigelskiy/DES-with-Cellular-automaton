import ISBox from "../SBox/ISBox";
import BinaryNumber from "../BinaryNumber";

const S_BOXES_COUNT = 8
const ROUNDS_COUNT = 16

const INITIAL_PERMUTATION = [
  58, 50, 42, 34, 26, 18, 10, 2,
  60, 52, 44, 36, 28, 20, 12, 4,
  62, 54, 46, 38, 30, 22, 14, 6,
  64, 56, 48, 40, 32, 24, 16, 8,
  57, 49, 41, 33, 25, 17, 9, 1,
  59, 51, 43, 35, 27, 19, 11, 3,
  61, 53, 45, 37, 29, 21, 13, 5,
  63, 55, 47, 39, 31, 23, 15, 7
].map(i => i - 1)

const FINAL_PERMUTATION = [
  40, 8, 48, 16, 56, 24, 64, 32,
  39, 7, 47, 15, 55, 23, 63, 31,
  38, 6, 46, 14, 54, 22, 62, 30,
  37, 5, 45, 13, 53, 21, 61, 29,
  36, 4, 44, 12, 52, 20, 60, 28,
  35, 3, 43, 11, 51, 19, 59, 27,
  34, 2, 42, 10, 50, 18, 58, 26,
  33, 1, 41, 9, 49, 17, 57, 25
].map(i => i - 1)

const EXPANSION_PERMUTATION = [
  32, 1, 2, 3, 4, 5,
  4, 5, 6, 7, 8, 9,
  8, 9, 10, 11, 12, 13,
  12, 13, 14, 15, 16, 17,
  16, 17, 18, 19, 20, 21,
  20, 21, 22, 23, 24, 25,
  24, 25, 26, 27, 28, 29,
  28, 29, 30, 31, 32, 1
].map(i => i - 1)

const PERMUTATION = [
  16, 7, 20, 21, 29, 12, 28, 17,
  1, 15, 23, 26, 5, 18, 31, 10,
  2, 8, 24, 14, 32, 27, 3, 9,
  19, 13, 30, 6, 22, 11, 4, 25
].map(i => i - 1)

const KEY_PERMUTATION = [
  14, 17, 11, 24, 1, 5, 3, 28,
  15, 6, 21, 10, 23, 19, 12, 4,
  26, 8, 16, 7, 27, 20, 13, 2,
  41, 52, 31, 37, 47, 55, 30, 40,
  51, 45, 33, 48, 44, 49, 39, 56,
  34, 53, 46, 42, 50, 36, 29, 32
].map(i => i - 1)

const C_PERMUTATION = [
  57, 49, 41, 33, 25, 17, 9,
  1, 58, 50, 42, 34, 26, 18,
  10, 2, 59, 51, 43, 35, 27,
  19, 11, 3, 60, 52, 44, 36
].map(i => i - 1)

const D_PERMUTATION = [
  63, 55, 47, 39, 31, 23, 15,
  7, 62, 54, 46, 38, 30, 22,
  14, 6, 61, 53, 45, 37, 29,
  21, 13, 5, 28, 20, 12, 4
].map(i => i - 1)

const ROUND_SHIFT_VALUE = [
  1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1
]

export default class DesBlock {

  constructor(private readonly sBoxes: ISBox[]) {
    if (sBoxes.length !== S_BOXES_COUNT) {
      throw new Error('Des: incorrect sBoxes count')
    }
  }

  public encode(value: BinaryNumber, key: BinaryNumber) {
    const subKeys = this.getSubKeys(key)
    return this.procces(value, subKeys)
  }

  public decode(value: BinaryNumber, key: BinaryNumber) {
    const subKeys = this.getSubKeys(key).reverse()
    return this.procces(value, subKeys)
  }

  private getSubKeys(key64: BinaryNumber): BinaryNumber[] {
    const subKeys: BinaryNumber[] = []
    let c = key64.permute(C_PERMUTATION)
    let d = key64.permute(D_PERMUTATION)

    for (let idx = 0; idx < ROUNDS_COUNT; idx++) {
      c.shift(ROUND_SHIFT_VALUE[idx])
      d.shift(ROUND_SHIFT_VALUE[idx])

      const cd = BinaryNumber.fromBinaryString(c.asString + d.asString)
      subKeys.push(cd.permute(KEY_PERMUTATION))
    }

    return subKeys
  }

  private procces(value: BinaryNumber, subKeys: BinaryNumber[]) {
    const initialPermutedValue = value.permute(INITIAL_PERMUTATION)
    let [l, r] = initialPermutedValue.split(2)

    for (let idx = 0; idx < ROUNDS_COUNT; idx++) {
      const roundKey = subKeys[idx]

      const prevR = r
      r = l.xor(this.f(r, roundKey))
      l = prevR
    }

    const rl = BinaryNumber.fromBinaryString(r.asString + l.asString)
    return rl.permute(FINAL_PERMUTATION)
  }

  private f(prevR: BinaryNumber, roundKey: BinaryNumber): BinaryNumber {
    const expandedR = prevR.permute(EXPANSION_PERMUTATION)
    const keyMixedValue = expandedR.xor(roundKey)

    const parts = keyMixedValue.split(S_BOXES_COUNT)

    const sBoxesResult = BinaryNumber.concat(parts.map((part, idx) => {
      const sBox = this.sBoxes[idx]

      const rowDefinition = new BinaryNumber([
        part.getBit(0),
        part.getBit(5)
      ])

      const colDefinition = new BinaryNumber([
        part.getBit(1),
        part.getBit(2),
        part.getBit(3),
        part.getBit(4)
      ])

      return sBox.getValue(rowDefinition, colDefinition, roundKey)
    }))

    return sBoxesResult.permute(PERMUTATION)
  }
}