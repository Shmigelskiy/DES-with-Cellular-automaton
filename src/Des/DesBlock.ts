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

const KEY_PERMUTATION = [
  14, 17, 11, 24, 1, 5, 3, 28,
  15, 6, 21, 10, 23, 19, 12, 4,
  26, 08, 16, 7, 27, 20, 13, 2,
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

  encode(value: BinaryNumber, key: BinaryNumber) {
    const subKeys = this.getSubKeys(key, 1)
  }

  decode(value: BinaryNumber, key: BinaryNumber) {
    const subKeys = this.getSubKeys(key, -1).reverse()
  }

  getSubKeys(key64: BinaryNumber, modeCoef: number) {
    const subKeys = []
    let c = key64.permute(C_PERMUTATION)
    let d = key64.permute(D_PERMUTATION)

    for (let idx = 0; idx < ROUNDS_COUNT; idx++) {
      c.shift(ROUND_SHIFT_VALUE[idx] * modeCoef)
      d.shift(ROUND_SHIFT_VALUE[idx] * modeCoef)

      const cd = BinaryNumber.fromBinaryString(c.asString + d.asString)
      subKeys.push(cd.permute(KEY_PERMUTATION))
    }

    return subKeys
  }
}