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
import { isArray, isObject } from 'util';
import { Address } from '../address';
import { isBN } from './bn';
import { isHexStrict, toHex } from './hex';
import { utf8ToHex } from './hex-utf8';
import { leftPad, rightPad } from './padding';
import { sha3 } from './sha3';
const elementaryName = name => {
    /*jshint maxcomplexity:false */
    if (name.startsWith('int[')) {
        return 'int256' + name.slice(3);
    }
    else if (name === 'int') {
        return 'int256';
    }
    else if (name.startsWith('uint[')) {
        return 'uint256' + name.slice(4);
    }
    else if (name === 'uint') {
        return 'uint256';
    }
    else if (name.startsWith('fixed[')) {
        return 'fixed128x128' + name.slice(5);
    }
    else if (name === 'fixed') {
        return 'fixed128x128';
    }
    else if (name.startsWith('ufixed[')) {
        return 'ufixed128x128' + name.slice(6);
    }
    else if (name === 'ufixed') {
        return 'ufixed128x128';
    }
    return name;
};
// Parse N from type<N>
const parseTypeN = type => {
    const typesize = /^\D+(\d+).*$/.exec(type);
    return typesize ? parseInt(typesize[1], 10) : null;
};
// Parse N from type[<N>]
const parseTypeNArray = type => {
    const arraySize = /^\D+\d*\[(\d+)\]$/.exec(type);
    return arraySize ? parseInt(arraySize[1], 10) : null;
};
const parseNumber = arg => {
    const type = typeof arg;
    if (type === 'string') {
        if (isHexStrict(arg)) {
            return new BN(arg.replace(/0x/i, ''), 16);
        }
        else {
            return new BN(arg, 10);
        }
    }
    else if (type === 'number') {
        return new BN(arg);
    }
    else if (isBN(arg)) {
        return arg;
    }
    else {
        throw new Error(arg + ' is not a number');
    }
};
const solidityPack = (type, value, arraySize) => {
    /*jshint maxcomplexity:false */
    let size;
    let num;
    type = elementaryName(type);
    if (type === 'bytes') {
        if (value.replace(/^0x/i, '').length % 2 !== 0) {
            throw new Error('Invalid bytes characters ' + value.length);
        }
        return value;
    }
    else if (type === 'string') {
        return utf8ToHex(value);
    }
    else if (type === 'bool') {
        return value ? '01' : '00';
    }
    else if (type.startsWith('address')) {
        if (arraySize) {
            size = 64;
        }
        else {
            size = 40;
        }
        if (!Address.isAddress(value)) {
            throw new Error(value + ' is not a valid address, or the checksum is invalid.');
        }
        return leftPad(value.toLowerCase(), size);
    }
    size = parseTypeN(type);
    if (type.startsWith('bytes')) {
        if (!size) {
            throw new Error('bytes[] not yet supported in solidity');
        }
        // must be 32 byte slices when in an array
        if (arraySize) {
            size = 32;
        }
        if (size < 1 || size > 32 || size < value.replace(/^0x/i, '').length / 2) {
            throw new Error('Invalid bytes' + size + ' for ' + value);
        }
        return rightPad(value, size * 2);
    }
    else if (type.startsWith('uint')) {
        if (size % 8 || size < 8 || size > 256) {
            throw new Error('Invalid uint' + size + ' size');
        }
        num = parseNumber(value);
        if (num.bitLength() > size) {
            throw new Error('Supplied uint exceeds width: ' + size + ' vs ' + num.bitLength());
        }
        if (num.lt(new BN(0))) {
            throw new Error('Supplied uint ' + num.toString() + ' is negative');
        }
        return size ? leftPad(num.toString('hex'), (size / 8) * 2) : num;
    }
    else if (type.startsWith('int')) {
        if (size % 8 || size < 8 || size > 256) {
            throw new Error('Invalid int' + size + ' size');
        }
        num = parseNumber(value);
        if (num.bitLength() > size) {
            throw new Error('Supplied int exceeds width: ' + size + ' vs ' + num.bitLength());
        }
        if (num.lt(new BN(0))) {
            return num.toTwos(size).toString('hex');
        }
        else {
            return size ? leftPad(num.toString('hex'), (size / 8) * 2) : num;
        }
    }
    else {
        // FIXME: support all other types
        throw new Error('Unsupported or invalid type: ' + type);
    }
};
const processSoliditySha3Args = arg => {
    /*jshint maxcomplexity:false */
    if (isArray(arg)) {
        throw new Error('Autodetection of array types is not supported.');
    }
    let type;
    let value = '';
    let hexArg;
    let arraySize;
    // if type is given
    if (isObject(arg) &&
        (arg.hasOwnProperty('v') || arg.hasOwnProperty('t') || arg.hasOwnProperty('value') || arg.hasOwnProperty('type'))) {
        type = arg.hasOwnProperty('t') ? arg.t : arg.type;
        value = arg.hasOwnProperty('v') ? arg.v : arg.value;
        // otherwise try to guess the type
    }
    else {
        type = toHex(arg, true);
        value = toHex(arg);
        if (!type.startsWith('int') && !type.startsWith('uint')) {
            type = 'bytes';
        }
    }
    if ((type.startsWith('int') || type.startsWith('uint')) && typeof value === 'string' && !/^(-)?0x/i.test(value)) {
        value = new BN(value);
    }
    // get the array size
    if (isArray(value)) {
        arraySize = parseTypeNArray(type);
        if (arraySize && value.length !== arraySize) {
            throw new Error(type + ' is not matching the given array ' + JSON.stringify(value));
        }
        else {
            arraySize = value.length;
        }
    }
    if (isArray(value)) {
        hexArg = value.map(val => {
            return solidityPack(type, val, arraySize)
                .toString('hex')
                .replace('0x', '');
        });
        return hexArg.join('');
    }
    else {
        hexArg = solidityPack(type, value, arraySize);
        return hexArg.toString('hex').replace('0x', '');
    }
};
/**
 * Hashes solidity values to a sha3 hash using keccak 256
 *
 * @method soliditySha3
 * @return {Object} the sha3
 */
export let soliditySha3 = (...args) => {
    /*jshint maxcomplexity:false */
    const hexArgs = args.map(processSoliditySha3Args);
    // console.log(args, hexArgs);
    // console.log('0x'+ hexArgs.join(''));
    return sha3('0x' + hexArgs.join(''));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29saWRpdHktc2hhMy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9zb2xpZGl0eS1zaGEzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7RUFlRTtBQUVGLE9BQU8sRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUN2QixPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN6QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDNUIsT0FBTyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFDM0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN2QyxPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUM5QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBRTlCLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxFQUFFO0lBQzVCLCtCQUErQjtJQUUvQixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDM0IsT0FBTyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNqQztTQUFNLElBQUksSUFBSSxLQUFLLEtBQUssRUFBRTtRQUN6QixPQUFPLFFBQVEsQ0FBQztLQUNqQjtTQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUNuQyxPQUFPLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2xDO1NBQU0sSUFBSSxJQUFJLEtBQUssTUFBTSxFQUFFO1FBQzFCLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO1NBQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxD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