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
import BN from 'bn.js';
import { numberToBN } from './number-to-bn';
/**
 * Returns true if object is BN, otherwise false
 *
 * @method isBN
 * @param {Object} object
 * @return {Boolean}
 */
export function isBN(object) {
    return object instanceof BN || (object && object.constructor && object.constructor.name === 'BN');
}
/**
 * Takes an input and transforms it into an BN
 *
 * @method toBN
 * @param {Number|String|BN} num, string, HEX string or BN
 * @return {BN} BN
 */
export function toBN(num) {
    try {
        return numberToBN(num);
    }
    catch (e) {
        throw new Error(e + ' Given value: "' + num + '"');
    }
}
/**
 * Takes and input transforms it into BN and if it is negative value, into two's complement
 *
 * @method toTwosComplement
 * @param {Number|String|BN} num
 * @return {String}
 */
export function toTwosComplement(num) {
    return ('0x' +
        toBN(num)
            .toTwos(256)
            .toString(16, 64));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvYm4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztFQWVFO0FBRUYsT0FBTyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU1Qzs7Ozs7O0dBTUc7QUFDSCxNQUFNLFVBQVUsSUFBSSxDQUFDLE1BQU07SUFDekIsT0FBTyxNQUFNLFlBQVksRUFBRSxJQUFJLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxXQUFXLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUM7QUFDcEcsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILE1BQU0sVUFBVSxJQUFJLENBQUMsR0FBeUI7SUFDNUMsSUFBSTtRQUNGLE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3hCO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixNQUFNLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxpQkFBaUIsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7S0FDcEQ7QUFDSCxDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsTUFBTSxVQUFVLGdCQUFnQixDQUFDLEdBQXlCO0lBQ3hELE9BQU8sQ0FDTCxJQUFJO1FBQ0osSUFBSSxDQUFDLEdBQUcsQ0FBQzthQUNOLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDWCxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUNwQixDQUFDO0FBQ0osQ0FBQyJ9