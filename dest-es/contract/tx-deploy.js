/*
  This file is part of web3x.

  web3x is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  web3x is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public License
  along with web3x.  If not, see <http://www.gnu.org/licenses/>.
*/
import { SentDeployContractTx } from './sent-deploy-contract-tx';
import { Tx } from './tx';
export class TxDeploy extends Tx {
    constructor(eth, contractEntry, contractAbi, deployData, args = [], defaultOptions = {}, onDeployed = x => x) {
        super(eth, contractEntry, contractAbi, undefined, args, defaultOptions);
        this.deployData = deployData;
        this.onDeployed = onDeployed;
    }
    send(options) {
        const sentTx = super.send(options);
        return new SentDeployContractTx(this.eth, this.contractAbi, sentTx.getTxHash(), this.onDeployed);
    }
    encodeABI() {
        return Buffer.concat([this.deployData, this.contractEntry.encodeParameters(this.args)]);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHgtZGVwbG95LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnRyYWN0L3R4LWRlcGxveS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0VBZUU7QUFLRixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNqRSxPQUFPLEVBQStCLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUV2RCxNQUFNLE9BQU8sUUFBUyxTQUFRLEVBQUU7SUFDOUIsWUFDRSxHQUFRLEVBQ1IsYUFBb0MsRUFDcEMsV0FBd0IsRUFDaEIsVUFBa0IsRUFDMUIsT0FBYyxFQUFFLEVBQ2hCLGlCQUFpQyxFQUFFLEVBQzNCLGFBQXlDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV2RCxLQUFLLENBQUMsR0FBRyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQztRQUxoRSxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBR2xCLGVBQVUsR0FBVixVQUFVLENBQXFDO0lBR3pELENBQUM7SUFFTSxJQUFJLENBQUMsT0FBb0I7UUFDOUIsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuQyxPQUFPLElBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbkcsQ0FBQztJQUVNLFNBQVM7UUFDZCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxRixDQUFDO0NBQ0YifQ==