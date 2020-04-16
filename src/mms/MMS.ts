import Context from "../context/Context";
import { getTermSet, toTermTree } from "./mmsUtils";

export default class MMS {
  private ctx: Context;
  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  getTermset = (termGroup: string, termset: string) => {
    return getTermSet(termGroup, termset, this.ctx.webUrl);
  };
  getTermTree = async (termGroup: string, termset: string) => {
    let flatTerms = await getTermSet(termGroup, termset, this.ctx.webUrl);
    return toTermTree(flatTerms);
  };
}
