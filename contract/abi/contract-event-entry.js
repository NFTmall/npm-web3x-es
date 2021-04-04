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
import { abiCoder } from '../abi-coder';
import { ContractEntry } from './contract-entry';
export class ContractEventEntry extends ContractEntry {
    constructor(entry) {
        super(entry);
        this.signature = abiCoder.encodeEventSignature(abiCoder.abiMethodToString(entry));
    }
    getEventTopics(filter = {}) {
        const topics = [];
        if (!this.entry.anonymous && this.signature) {
            topics.push(this.signature);
        }
        const indexedTopics = (this.entry.inputs || [])
            .filter(input => input.indexed === true)
            .map(input => {
            const value = filter[input.name];
            if (!value) {
                return null;
            }
            // TODO: https://github.com/ethereum/web3.js/issues/344
            // TODO: deal properly with components
            if (isArray(value)) {
                return value.map(v => abiCoder.encodeParameter(input.type, v));
            }
            else {
                return abiCoder.encodeParameter(input.type, value);
            }
        });
        return [...topics, ...indexedTopics];
    }
    decodeEvent(log) {
        const { data = '', topics = [], ...formattedLog } = log;
        const { anonymous, inputs = [], name = '' } = this.entry;
        const argTopics = anonymous ? topics : topics.slice(1);
        const returnValues = abiCoder.decodeLog(inputs, data, argTopics);
        delete returnValues.__length__;
        return {
            ...formattedLog,
            event: name,
            returnValues,
            signature: anonymous || !topics[0] ? null : topics[0],
            raw: {
                data,
                topics,
            },
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QtZXZlbnQtZW50cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29udHJhY3QvYWJpL2NvbnRyYWN0LWV2ZW50LWVudHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7RUFlRTtBQUVGLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFL0IsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUV4QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFakQsTUFBTSxPQUFPLGtCQUFtQixTQUFRLGFBQWE7SUFHbkQsWUFBWSxLQUE4QjtRQUN4QyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBRU0sY0FBYyxDQUFDLFNBQWlCLEVBQUU7UUFDdkMsTUFBTSxNQUFNLEdBQTBCLEVBQUUsQ0FBQztRQUV6QyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUM3QjtRQUVELE1BQU0sYUFBYSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO2FBQzVDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDO2FBQ3ZDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNYLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDVixPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsdURBQXVEO1lBQ3ZELHNDQUFzQztZQUV0QyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDbEIsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDaEU7aUJBQU07Z0JBQ0wsT0FBTyxRQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDcEQ7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVMLE9BQU8sQ0FBQyxHQUFHLE1BQU0sRUFBRSxHQUFHLGFBQWEsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFTSxXQUFXLENBQUMsR0FBZ0I7UUFDakMsTUFBTSxFQUFFLElBQUksR0FBRyxFQUFFLEVBQUUsTUFBTSxHQUFHLEVBQUUsRUFBRSxHQUFHLFlBQVksRUFBRSxHQUFHLEdBQUcsQ0FBQztRQUN4RCxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sR0FBRyxFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFFekQsTUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2pFLE9BQU8sWUFBWSxDQUFDLFVBQVUsQ0FBQztRQUUvQixPQUFPO1lBQ0wsR0FBRyxZQUFZO1lBQ2YsS0FBSyxFQUFFLElBQUk7WUFDWCxZQUFZO1lBQ1osU0FBUyxFQUFFLFNBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3JELEdBQUcsRUFBRTtnQkFDSCxJQUFJO2dCQUNKLE1BQU07YUFDUDtTQUNGLENBQUM7SUFDSixDQUFDO0NBQ0YifQ==