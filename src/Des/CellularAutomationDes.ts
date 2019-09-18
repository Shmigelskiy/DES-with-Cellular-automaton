import DesRunner from "./DesRunner";
import DesBlock from "./DesBlock";
import { CellularAutomationSBox } from "../SBox/CellularAutomationSBox";
import CellularAutomationGenerator from "../CellularAutomation/CellularAutomationGenerator";
import CellularAutomationBinaryRule from "../CellularAutomation/CellularAutomationBinaryRule";
import BinaryNumber from "../BinaryNumber";

const S_BOXES_RULES = [
  [30, 120, 225, 135],
  [110, 184, 55, 44],
  [85, 99, 169, 81],
  [34, 75, 113, 51],
  [69, 90, 111, 222],
  [60, 49, 220, 200],
  [36, 72, 16, 45],
  [184, 129, 58, 33],
]
const S_BOX_RULE_LENGTH = 8

export default class CellularAutomationDes extends DesRunner {
  constructor() {
    const sBoxes = S_BOXES_RULES.map(sBoxRules => (
      new CellularAutomationSBox(sBoxRules.map(rule => (
        new CellularAutomationGenerator(
          new CellularAutomationBinaryRule(
            BinaryNumber.fromNumber(rule, S_BOX_RULE_LENGTH)
          )
        )
      )))
    ))
    super(new DesBlock(sBoxes))
  }
}