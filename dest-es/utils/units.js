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
import { isString } from 'util';
import { isBN } from './bn';
import { numberToBN } from './number-to-bn';
const zero = new BN(0);
const negative1 = new BN(-1);
export const unitMap = {
    noether: '0',
    wei: '1',
    kwei: '1000',
    Kwei: '1000',
    babbage: '1000',
    femtoether: '1000',
    mwei: '1000000',
    Mwei: '1000000',
    lovelace: '1000000',
    picoether: '1000000',
    gwei: '1000000000',
    Gwei: '1000000000',
    shannon: '1000000000',
    nanoether: '1000000000',
    nano: '1000000000',
    szabo: '1000000000000',
    microether: '1000000000000',
    micro: '1000000000000',
    finney: '1000000000000000',
    milliether: '1000000000000000',
    milli: '1000000000000000',
    ether: '1000000000000000000',
    kether: '1000000000000000000000',
    grand: '1000000000000000000000',
    mether: '1000000000000000000000000',
    gether: '1000000000000000000000000000',
    tether: '1000000000000000000000000000000',
};
/**
 * Returns value of unit in Wei
 *
 * @method getUnitValue
 * @param {String} unit the unit to convert to, default ether
 * @returns {BN} value of the unit (in Wei)
 * @throws error if the unit is not correct:w
 */
function getUnitValue(unit) {
    unit = unit ? unit.toLowerCase() : 'ether';
    if (!unitMap[unit]) {
        throw new Error('This unit "' +
            unit +
            '" doesn\'t exist, please use the one of the following units' +
            JSON.stringify(unitMap, null, 2));
    }
    return unit;
}
export function fromWei(num, unit) {
    unit = getUnitValue(unit);
    if (!isBN(num) && !isString(num)) {
        throw new Error('Please pass numbers as strings or BigNumber objects to avoid precision errors.');
    }
    return isBN(num) ? new BN(ethjsFromWei(num, unit)) : ethjsFromWei(num, unit);
}
export function toWei(num, unit) {
    unit = getUnitValue(unit);
    if (!isBN(num) && !isString(num)) {
        throw new Error('Please pass numbers as strings or BigNumber objects to avoid precision errors.');
    }
    return isBN(num) ? ethjsToWei(num, unit) : ethjsToWei(num, unit).toString(10);
}
/**
 * Returns value of unit in Wei
 *
 * @method getValueOfUnit
 * @param {String} unit the unit to convert to, default ether
 * @returns {BigNumber} value of the unit (in Wei)
 * @throws error if the unit is not correct:w
 */
function getValueOfUnit(unitInput) {
    const unit = unitInput ? unitInput.toLowerCase() : 'ether';
    const unitValue = unitMap[unit]; // eslint-disable-line
    if (typeof unitValue !== 'string') {
        throw new Error(`[ethjs-unit] the unit provided ${unitInput} doesn't exists, please use the one of the following units ${JSON.stringify(unitMap, null, 2)}`);
    }
    return new BN(unitValue, 10);
}
function numberToString(arg) {
    if (typeof arg === 'string') {
        if (!arg.match(/^-?[0-9.]+$/)) {
            throw new Error(`while converting number to string, invalid number value '${arg}', should be a number matching (^-?[0-9.]+).`);
        }
        return arg;
    }
    else if (typeof arg === 'number') {
        return String(arg);
    }
    else if (typeof arg === 'object' && arg.toString && (arg.toTwos || arg.dividedToIntegerBy)) {
        if (arg.toPrecision) {
            return String(arg.toPrecision());
        }
        else {
            // eslint-disable-line
            return arg.toString(10);
        }
    }
    throw new Error(`while converting number to string, invalid number value '${arg}' type ${typeof arg}.`);
}
function ethjsFromWei(weiInput, unit, optionsInput) {
    let wei = numberToBN(weiInput); // eslint-disable-line
    const negative = wei.lt(zero); // eslint-disable-line
    const base = getValueOfUnit(unit);
    const baseLength = unitMap[unit].length - 1 || 1;
    const options = optionsInput || {};
    if (negative) {
        wei = wei.mul(negative1);
    }
    let fraction = wei.mod(base).toString(10); // eslint-disable-line
    while (fraction.length < baseLength) {
        fraction = `0${fraction}`;
    }
    if (!options.pad) {
        fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1];
    }
    let whole = wei.div(base).toString(10); // eslint-disable-line
    if (options.commify) {
        whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    let value = `${whole}${fraction === '0' ? '' : `.${fraction}`}`; // eslint-disable-line
    if (negative) {
        value = `-${value}`;
    }
    return value;
}
function ethjsToWei(etherInput, unit) {
    let ether = numberToString(etherInput); // eslint-disable-line
    const base = getValueOfUnit(unit);
    const baseLength = unitMap[unit].length - 1 || 1;
    // Is it negative?
    const negative = ether.substring(0, 1) === '-'; // eslint-disable-line
    if (negative) {
        ether = ether.substring(1);
    }
    if (ether === '.') {
        throw new Error(`[ethjs-unit] while converting number ${etherInput} to wei, invalid value`);
    }
    // Split it into a whole and fractional part
    const comps = ether.split('.'); // eslint-disable-line
    if (comps.length > 2) {
        throw new Error(`[ethjs-unit] while converting number ${etherInput} to wei,  too many decimal points`);
    }
    let whole = comps[0];
    let fraction = comps[1];
    if (!whole) {
        whole = '0';
    }
    if (!fraction) {
        fraction = '0';
    }
    if (fraction.length > baseLength) {
        throw new Error(`[ethjs-unit] while converting number ${etherInput} to wei, too many decimal places`);
    }
    while (fraction.length < baseLength) {
        fraction += '0';
    }
    whole = new BN(whole);
    fraction = new BN(fraction);
    let wei = whole.mul(base).add(fraction); // eslint-disable-line
    if (negative) {
        wei = wei.mul(negative1);
    }
    return new BN(wei.toString(10), 10);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvdW5pdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztFQWVFO0FBRUYsT0FBTyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDaEMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM1QixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFNUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkIsTUFBTSxTQUFTLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUU3QixNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUc7SUFDckIsT0FBTyxFQUFFLEdBQUc7SUFDWixHQUFHLEVBQUUsR0FBRztJQUNSLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixPQUFPLEVBQUUsTUFBTTtJQUNmLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLElBQUksRUFBRSxTQUFTO0lBQ2YsSUFBSSxFQUFFLFNBQVM7SUFDZixRQUFRLEVBQUUsU0FBUztJQUNuQixTQUFTLEVBQUUsU0FBUztJQUNwQixJQUFJLEVBQUUsWUFBWTtJQUNsQixJQUFJLEVBQUUsWUFBWTtJQUNsQixPQUFPLEVBQUUsWUFBWTtJQUNyQixTQUFTLEVBQUUsWUFBWTtJQUN2QixJQUFJLEVBQUUsWUFBWTtJQUNsQixLQUFLLEVBQUUsZUFBZTtJQUN0QixVQUFVLEVBQUUsZUFBZTtJQUMzQixLQUFLLEVBQUUsZUFBZTtJQUN0QixNQUFNLEVBQUUsa0JBQWtCO0lBQzFCLFVBQVUsRUFBRSxrQkFBa0I7SUFDOUIsS0FBSyxFQUFFLGtCQUFrQjtJQUN6QixLQUFLLEVBQUUscUJBQXFCO0lBQzVCLE1BQU0s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