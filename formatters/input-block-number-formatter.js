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
import { isString } from 'util';
import { isHexStrict, numberToHex } from '../utils';
export function inputBlockNumberFormatter(block) {
    if (block === undefined) {
        return;
    }
    else if (block === 'genesis' || block === 'earliest') {
        return '0x0';
    }
    else if (block === 'latest' || block === 'pending') {
        return block;
    }
    else if (isString(block) && isHexStrict(block)) {
        return block.toLowerCase();
    }
    return numberToHex(block);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtYmxvY2stbnVtYmVyLWZvcm1hdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtYXR0ZXJzL2lucHV0LWJsb2NrLW51bWJlci1mb3JtYXR0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztFQWVFO0FBRUYsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUVoQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUVwRCxNQUFNLFVBQVUseUJBQXlCLENBQUMsS0FBd0M7SUFDaEYsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1FBQ3ZCLE9BQU87S0FDUjtTQUFNLElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssVUFBVSxFQUFFO1FBQ3RELE9BQU8sS0FBSyxDQUFDO0tBQ2Q7U0FBTSxJQUFJLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtRQUNwRCxPQUFPLEtBQUssQ0FBQztLQUNkO1NBQU0sSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ2hELE9BQU8sS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQzVCO0lBQ0QsT0FBTyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUIsQ0FBQyJ9