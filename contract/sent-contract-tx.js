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
import { isArray } from 'util';
import { SentTransaction } from '../eth';
export class SentContractTx extends SentTransaction {
    constructor(eth, contractAbi, promise) {
        super(eth, promise);
        this.contractAbi = contractAbi;
    }
    async handleReceipt(receipt) {
        receipt = await super.handleReceipt(receipt);
        const { logs, to, contractAddress = to } = receipt;
        if (!isArray(logs)) {
            return receipt;
        }
        const isAnonymous = log => !log.address.equals(contractAddress) || !this.contractAbi.findEntryForLog(log);
        const anonymousLogs = logs.filter(isAnonymous);
        const events = logs.reduce((a, log) => {
            if (isAnonymous(log)) {
                return a;
            }
            const ev = this.contractAbi.decodeEvent(log);
            a[ev.event] = a[ev.event] || [];
            a[ev.event].push(ev);
            return a;
        }, {});
        delete receipt.logs;
        return { ...receipt, anonymousLogs, events };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VudC1jb250cmFjdC10eC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cmFjdC9zZW50LWNvbnRyYWN0LXR4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7RUFlRTtBQUVGLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFPLGVBQWUsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUs5QyxNQUFNLE9BQU8sY0FBZSxTQUFRLGVBQWU7SUFDakQsWUFBWSxHQUFRLEVBQVksV0FBd0IsRUFBRSxPQUFpQztRQUN6RixLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRFUsZ0JBQVcsR0FBWCxXQUFXLENBQWE7SUFFeEQsQ0FBQztJQUVTLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBMkI7UUFDdkQsT0FBTyxHQUFHLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QyxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxlQUFlLEdBQUcsRUFBRyxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBRXBELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbEIsT0FBTyxPQUFPLENBQUM7U0FDaEI7UUFFRCxNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUxRyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRS9DLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFDcEMsSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3BCLE9BQU8sQ0FBQyxDQUFDO2FBQ1Y7WUFDRCxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM3QyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3JCLE9BQU8sQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRVAsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBRXBCLE9BQU8sRUFBRSxHQUFHLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLENBQUM7SUFDL0MsQ0FBQztDQUNGIn0=