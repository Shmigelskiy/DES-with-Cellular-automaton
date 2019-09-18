import DesRunner from "./DesRunner";
import DesBlock from "./DesBlock";
import DesSBox from "../SBox/DesSBox";

export default class Des extends DesRunner {

  constructor() {
    const sBoxes = [
      new DesSBox(0), new DesSBox(1), new DesSBox(2), new DesSBox(3),
      new DesSBox(4), new DesSBox(5), new DesSBox(6), new DesSBox(7)
    ] 
    super(new DesBlock(sBoxes))
  }
}