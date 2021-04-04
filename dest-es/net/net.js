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
import { bufferToHex } from '../utils';
import { NetRequestPayloads } from './net-request-payloads';
export class Net {
    constructor(eth) {
        this.eth = eth;
        this.request = new NetRequestPayloads();
    }
    async send({ method, params, format }) {
        return format(await this.eth.provider.send(method, params));
    }
    async getId() {
        const payload = this.request.getId();
        return payload.format(await this.send(payload));
    }
    async isListening() {
        const payload = this.request.isListening();
        return payload.format(await this.send(payload));
    }
    async getPeerCount() {
        const payload = this.request.getPeerCount();
        return payload.format(await this.send(payload));
    }
    async getNetworkType() {
        const block = await this.eth.getBlock(0);
        const genesisHash = bufferToHex(block.hash);
        const id = await this.getId();
        if (genesisHash === '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3' && id === 1) {
            return 'main';
        }
        else if (genesisHash === '0cd786a2425d16f152c658316c423e6ce1181e15c3295826d7c9904cba9ce303' && id === 2) {
            return 'morden';
        }
        else if (genesisHash === '0x41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d' && id === 3) {
            return 'ropsten';
        }
        else if (genesisHash === '0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177' && id === 4) {
            return 'rinkeby';
        }
        else if (genesisHash === '0xa3c565fc15c7478862d50ccd6561e3c06b24cc509bf388941c25ea985ce32cb9' && id === 42) {
            return 'kovan';
        }
        else {
            return 'private';
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL25ldC9uZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztFQWVFO0FBR0YsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUN2QyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUU1RCxNQUFNLE9BQU8sR0FBRztJQUVkLFlBQW9CLEdBQVE7UUFBUixRQUFHLEdBQUgsR0FBRyxDQUFLO1FBRHBCLFlBQU8sR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7SUFDWixDQUFDO0lBRXhCLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBbUQ7UUFDNUYsT0FBTyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVNLEtBQUssQ0FBQyxLQUFLO1FBQ2hCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDckMsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBRSxDQUFDO0lBQ25ELENBQUM7SUFFTSxLQUFLLENBQUMsV0FBVztRQUN0QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzNDLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRU0sS0FBSyxDQUFDLFlBQVk7UUFDdkIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUM1QyxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFFLENBQUM7SUFDbkQsQ0FBQztJQUVNLEtBQUssQ0FBQyxjQUFjO1FBQ3pCLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsTUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFLLENBQUMsQ0FBQztRQUM3QyxNQUFNLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU5QixJQUFJLFdBQVcsS0FBSyxvRUFBb0UsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ3BHLE9BQU8sTUFBTSxDQUFDO1NBQ2Y7YUFBTSxJQUFJLFdBQVcsS0FBSyxrRUFBa0UsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ3pHLE9BQU8sUUFBUSxDQUFDO1NBQ2pCO2FBQU0sSUFBSSxXQUFXLEtBQUssb0VBQW9FLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTtZQUMzRyxPQUFPLFNBQVMsQ0FBQztTQUNsQjthQUFNLElBQUksV0FBVyxLQUFLLG9FQUFvRSxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUU7WUFDM0csT0FBTyxTQUFTLENBQUM7U0FDbEI7YUFBTSxJQUFJLFdBQVcsS0FBSyxvRUFBb0UsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQzVHLE9BQU8sT0FBTyxDQUFDO1NBQ2hCO2FBQU07WUFDTCxPQUFPLFNBQVMsQ0FBQztTQUNsQjtJQUNILENBQUM7Q0FDRiJ9