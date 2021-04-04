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
import { Address } from '../address';
import { hexToNumber, utf8ToHex } from '../utils';
import { inputBlockNumberFormatter } from './input-block-number-formatter';
export function toRawLogRequest(logRequest = {}) {
    const rawLogRequest = {};
    if (logRequest.fromBlock !== undefined) {
        rawLogRequest.fromBlock = inputBlockNumberFormatter(logRequest.fromBlock);
    }
    if (logRequest.toBlock !== undefined) {
        rawLogRequest.toBlock = inputBlockNumberFormatter(logRequest.toBlock);
    }
    // Convert topics to hex.
    rawLogRequest.topics = (logRequest.topics || []).map(topic => {
        const toTopic = value => {
            if (value === null || typeof value === 'undefined') {
                return null;
            }
            value = String(value);
            return value.indexOf('0x') === 0 ? value : utf8ToHex(value);
        };
        return isArray(topic) ? topic.map(toTopic) : toTopic(topic);
    });
    if (logRequest.address) {
        rawLogRequest.address = isArray(logRequest.address)
            ? logRequest.address.map(a => a.toString().toLowerCase())
            : logRequest.address.toString().toLowerCase();
    }
    return rawLogRequest;
}
export function fromRawLogRequest(rawLogRequest) {
    const { toBlock, fromBlock, address, topics } = rawLogRequest;
    return {
        toBlock: toBlock ? hexToNumber(toBlock) : undefined,
        fromBlock: fromBlock ? hexToNumber(fromBlock) : undefined,
        address: address ? (isArray(address) ? address.map(Address.fromString) : Address.fromString(address)) : undefined,
        topics,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLXJlcXVlc3QtZm9ybWF0dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Zvcm1hdHRlcnMvbG9nLXJlcXVlc3QtZm9ybWF0dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7RUFlRTtBQUVGLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQztBQUVyQyxPQUFPLEVBQUUsV0FBVyxFQUFnQyxTQUFTLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDaEYsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFpQjNFLE1BQU0sVUFBVSxlQUFlLENBQUMsYUFBeUIsRUFBRTtJQUN6RCxNQUFNLGFBQWEsR0FBa0IsRUFBRSxDQUFDO0lBRXhDLElBQUksVUFBVSxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUU7UUFDdEMsYUFBYSxDQUFDLFNBQVMsR0FBRyx5QkFBeUIsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDM0U7SUFFRCxJQUFJLFVBQVUsQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFO1FBQ3BDLGFBQWEsQ0FBQyxPQUFPLEdBQUcseUJBQXlCLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3ZFO0lBRUQseUJBQXlCO0lBQ3pCLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUMzRCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsRUFBRTtZQUN0QixJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksT0FBTyxLQUFLLEtBQUssV0FBVyxFQUFFO2dCQUNsRCxPQUFPLElBQUksQ0FBQzthQUNiO1lBQ0QsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0QixPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5RCxDQUFDLENBQUM7UUFDRixPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlELENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFO1FBQ3RCLGFBQWEsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7WUFDakQsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3pELENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQ2pEO0lBRUQsT0FBTyxhQUFhLENBQUM7QUFDdkIsQ0FBQztBQUVELE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxhQUE0QjtJQUM1RCxNQUFNLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsYUFBYSxDQUFDO0lBQzlELE9BQU87UUFDTCxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDbkQsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQ3pELE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQ2pILE1BQU07S0FDUCxDQUFDO0FBQ0osQ0FBQyJ9