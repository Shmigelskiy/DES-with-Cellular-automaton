export default interface ICellularAutomationRule {
  getNextState(left: boolean, center: boolean, right: boolean): boolean
}