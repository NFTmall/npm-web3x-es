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
import { SentContractTx } from './sent-contract-tx';
export class Tx {
    constructor(eth, contractEntry, contractAbi, contractAddress, args = [], defaultOptions = {}) {
        this.eth = eth;
        this.contractEntry = contractEntry;
        this.contractAbi = contractAbi;
        this.contractAddress = contractAddress;
        this.args = args;
        this.defaultOptions = defaultOptions;
    }
    async estimateGas(options = {}) {
        return await this.eth.estimateGas(this.getTx(options));
    }
    async call(options = {}, block) {
        const result = await this.eth.call(this.getTx(options), block);
        return this.contractEntry.decodeReturnValue(result);
    }
    getCallRequestPayload(options, block) {
        const result = this.eth.request.call(this.getTx(options), block);
        return {
            ...result,
            format: (result) => this.contractEntry.decodeReturnValue(result),
        };
    }
    send(options) {
        const tx = this.getTx(options);
        if (!this.contractEntry.payable && tx.value !== undefined && tx.value > 0) {
            throw new Error('Can not send value to non-payable contract method.');
        }
        const promise = this.eth.sendTransaction(tx).getTxHash();
        return new SentContractTx(this.eth, this.contractAbi, promise);
    }
    getSendRequestPayload(options) {
        return this.eth.request.sendTransaction(this.getTx(options));
    }
    encodeABI() {
        return this.contractEntry.encodeABI(this.args);
    }
    getTx(options = {}) {
        return {
            to: this.contractAddress,
            from: options.from || this.defaultOptions.from,
            gasPrice: options.gasPrice || this.defaultOptions.gasPrice,
            gas: options.gas || this.defaultOptions.gas,
            value: options.value,
            data: this.encodeABI(),
            nonce: options.nonce,
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29udHJhY3QvdHgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztFQWVFO0FBT0YsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBNkNwRCxNQUFNLE9BQU8sRUFBRTtJQUNiLFlBQ1ksR0FBUSxFQUNSLGFBQW9DLEVBQ3BDLFdBQXdCLEVBQ3hCLGVBQXlCLEVBQ3pCLE9BQWMsRUFBRSxFQUNoQixpQkFBaUMsRUFBRTtRQUxuQyxRQUFHLEdBQUgsR0FBRyxDQUFLO1FBQ1Isa0JBQWEsR0FBYixhQUFhLENBQXVCO1FBQ3BDLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLG9CQUFlLEdBQWYsZUFBZSxDQUFVO1FBQ3pCLFNBQUksR0FBSixJQUFJLENBQVk7UUFDaEIsbUJBQWMsR0FBZCxjQUFjLENBQXFCO0lBQzVDLENBQUM7SUFFRyxLQUFLLENBQUMsV0FBVyxDQUFDLFVBQTJCLEVBQUU7UUFDcEQsT0FBTyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUksQ0FBQyxVQUF1QixFQUFFLEVBQUUsS0FBaUI7UUFDNUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQy9ELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRU0scUJBQXFCLENBQUMsT0FBb0IsRUFBRSxLQUFjO1FBQy9ELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2pFLE9BQU87WUFDTCxHQUFHLE1BQU07WUFDVCxNQUFNLEVBQUUsQ0FBQyxNQUFjLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDO1NBQ3pFLENBQUM7SUFDSixDQUFDO0lBRU0sSUFBSSxDQUFDLE9BQW9CO1FBQzlCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ3pFLE1BQU0sSUFBSSxLQUFLLENBQUMsb0RBQW9ELENBQUMsQ0FBQztTQUN2RTtRQUVELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBRXpELE9BQU8sSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFTSxxQkFBcUIsQ0FBQyxPQUFvQjtRQUMvQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVNLFNBQVM7UUFDZCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRU8sS0FBSyxDQUFDLFVBQWUsRUFBRTtRQUM3QixPQUFPO1lBQ0wsRUFBRSxFQUFFLElBQUksQ0FBQyxlQUFlO1lBQ3hCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSTtZQUM5QyxRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVE7WUFDMUQsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHO1lBQzNDLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSztZQUNwQixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUN0QixLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUs7U0FDckIsQ0FBQztJQUNKLENBQUM7Q0FDRiJ9