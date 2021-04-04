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
import { isArray, isString } from 'util';
import { Address } from '../address';
import { hexToNumber, numberToHex } from '../utils';
import { fromRawLogResponse, toRawLogResponse } from './log-response-formatter';
export function fromRawTransactionReceipt(receipt) {
    if (!receipt || !receipt.blockHash) {
        return null;
    }
    return {
        ...receipt,
        to: receipt.to ? Address.fromString(receipt.to) : undefined,
        from: Address.fromString(receipt.from),
        blockNumber: hexToNumber(receipt.blockNumber),
        transactionIndex: hexToNumber(receipt.transactionIndex),
        cumulativeGasUsed: hexToNumber(receipt.cumulativeGasUsed),
        gasUsed: hexToNumber(receipt.gasUsed),
        logs: isArray(receipt.logs) ? receipt.logs.map(fromRawLogResponse) : undefined,
        contractAddress: receipt.contractAddress ? Address.fromString(receipt.contractAddress) : undefined,
        status: isString(receipt.status) ? Boolean(hexToNumber(receipt.status)) : undefined,
    };
}
export function toRawTransactionReceipt(receipt) {
    return {
        ...receipt,
        to: receipt.to ? receipt.to.toString() : undefined,
        from: receipt.from.toString(),
        blockNumber: numberToHex(receipt.blockNumber),
        transactionIndex: numberToHex(receipt.transactionIndex),
        cumulativeGasUsed: numberToHex(receipt.cumulativeGasUsed),
        gasUsed: numberToHex(receipt.gasUsed),
        logs: isArray(receipt.logs) ? receipt.logs.map(toRawLogResponse) : undefined,
        contractAddress: receipt.contractAddress ? receipt.contractAddress.toString() : undefined,
        status: receipt.status !== undefined ? numberToHex(receipt.status ? 1 : 0) : undefined,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24tcmVjZWlwdC1mb3JtYXR0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZm9ybWF0dGVycy90cmFuc2FjdGlvbi1yZWNlaXB0LWZvcm1hdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0VBZUU7QUFFRixPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN6QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3BELE9BQU8sRUFBRSxrQkFBa0IsRUFBK0IsZ0JBQWdCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQStDN0csTUFBTSxVQUFVLHlCQUF5QixDQUFDLE9BQStCO0lBQ3ZFLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFO1FBQ2xDLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRCxPQUFPO1FBQ0wsR0FBRyxPQUFPO1FBQ1YsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQzNELElBQUksRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDdEMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO1FBQzdDLGdCQUFnQixFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7UUFDdkQsaUJBQWlCLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztRQUN6RCxPQUFPLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDckMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDOUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQ2xHLE1BQU0sRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO0tBQ3BGLENBQUM7QUFDSixDQUFDO0FBRUQsTUFBTSxVQUFVLHVCQUF1QixDQUFDLE9BQTJCO0lBQ2pFLE9BQU87UUFDTCxHQUFHLE9BQU87UUFDVixFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUztRQUNsRCxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7UUFDN0IsV0FBVyxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO1FBQzdDLGdCQUFnQixFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7UUFDdkQsaUJBQWlCLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztRQUN6RCxPQUFPLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUU7UUFDdEMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDNUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDekYsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztLQUN2RixDQUFDO0FBQ0osQ0FBQyJ9