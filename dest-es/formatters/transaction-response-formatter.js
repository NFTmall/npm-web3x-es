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
import { Address } from '../address';
import { hexToNumber, numberToHex } from '../utils';
import { outputBigNumberFormatter } from './output-big-number-formatter';
export function fromRawTransactionResponse(tx) {
    return {
        ...tx,
        blockNumber: tx.blockNumber ? hexToNumber(tx.blockNumber) : null,
        transactionIndex: tx.transactionIndex ? hexToNumber(tx.transactionIndex) : null,
        nonce: hexToNumber(tx.nonce),
        gas: hexToNumber(tx.gas),
        gasPrice: outputBigNumberFormatter(tx.gasPrice),
        value: outputBigNumberFormatter(tx.value),
        to: tx.to ? Address.fromString(tx.to) : null,
        from: Address.fromString(tx.from),
    };
}
export function toRawTransactionResponse(tx) {
    return {
        ...tx,
        blockNumber: tx.blockNumber ? numberToHex(tx.blockNumber) : null,
        transactionIndex: tx.transactionIndex ? numberToHex(tx.transactionIndex) : null,
        nonce: numberToHex(tx.nonce),
        gas: numberToHex(tx.gas),
        gasPrice: numberToHex(tx.gasPrice),
        value: numberToHex(tx.value),
        to: tx.to ? tx.to.toString() : null,
        from: tx.from.toString(),
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24tcmVzcG9uc2UtZm9ybWF0dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Zvcm1hdHRlcnMvdHJhbnNhY3Rpb24tcmVzcG9uc2UtZm9ybWF0dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7RUFlRTtBQUVGLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDckMsT0FBTyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDcEQsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFvQ3pFLE1BQU0sVUFBVSwwQkFBMEIsQ0FBQyxFQUEwQjtJQUNuRSxPQUFPO1FBQ0wsR0FBRyxFQUFFO1FBQ0wsV0FBVyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7UUFDaEUsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7UUFDL0UsS0FBSyxFQUFFLFdBQVcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQzVCLEdBQUcsRUFBRSxXQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztRQUN4QixRQUFRLEVBQUUsd0JBQXdCLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQztRQUMvQyxLQUFLLEVBQUUsd0JBQXdCLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUN6QyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7UUFDNUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztLQUNsQyxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0sVUFBVSx3QkFBd0IsQ0FBQyxFQUF1QjtJQUM5RCxPQUFPO1FBQ0wsR0FBRyxFQUFFO1FBQ0wsV0FBVyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7UUFDaEUsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7UUFDL0UsS0FBSyxFQUFFLFdBQVcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFFO1FBQzdCLEdBQUcsRUFBRSxXQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBRTtRQUN6QixRQUFRLEVBQUUsV0FBVyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUM7UUFDbEMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQzVCLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJO1FBQ25DLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtLQUN6QixDQUFDO0FBQ0osQ0FBQyJ9