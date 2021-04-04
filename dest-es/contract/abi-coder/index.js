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
import { isArray, isObject } from 'util';
import { AbiCoder as EthersAbi } from '../../ethers/abi-coder';
import { sha3 } from '../../utils';
/**
 * ABICoder prototype should be used to encode/decode solidity params of any type
 */
export class ABICoder {
    constructor() {
        this.ethersAbiCoder = new EthersAbi((type, value) => {
            if (type.match(/^u?int/) && !isArray(value) && (!isObject(value) || value.constructor.name !== 'BN')) {
                return value.toString();
            }
            return value;
        });
    }
    /**
     * Encodes the function name to its ABI representation, which are the first 4 bytes of the sha3 of the function name including  types.
     *
     * @method encodeFunctionSignature
     * @param {String|Object} functionName
     * @return {String} encoded function name
     */
    encodeFunctionSignature(functionName) {
        if (isObject(functionName)) {
            functionName = this.abiMethodToString(functionName);
        }
        return sha3(functionName).slice(0, 10);
    }
    /**
     * Encodes the function name to its ABI representation, which are the first 4 bytes of the sha3 of the function name including  types.
     *
     * @method encodeEventSignature
     * @param {String|Object} functionName
     * @return {String} encoded function name
     */
    encodeEventSignature(functionName) {
        if (isObject(functionName)) {
            functionName = this.abiMethodToString(functionName);
        }
        return sha3(functionName);
    }
    /**
     * Should be used to encode plain param
     *
     * @method encodeParameter
     * @param {String} type
     * @param {Object} param
     * @return {String} encoded plain param
     */
    encodeParameter(type, param) {
        return this.encodeParameters([type], [param]);
    }
    /**
     * Should be used to encode list of params
     *
     * @method encodeParameters
     * @param {Array} types
     * @param {Array} params
     * @return {String} encoded list of params
     */
    encodeParameters(types, params) {
        return this.ethersAbiCoder.encode(this.mapTypes(types), params);
    }
    /**
     * Encodes a function call from its json interface and parameters.
     *
     * @method encodeFunctionCall
     * @param {Array} jsonInterface
     * @param {Array} params
     * @return {String} The encoded ABI for this function call
     */
    encodeFunctionCall(jsonInterface, params) {
        return (this.encodeFunctionSignature(jsonInterface) +
            this.encodeParameters(jsonInterface.inputs, params).replace('0x', ''));
    }
    /**
     * Should be used to decode bytes to plain param
     *
     * @method decodeParameter
     * @param {String} type
     * @param {String} bytes
     * @return {Object} plain param
     */
    decodeParameter(type, bytes) {
        return this.decodeParameters([type], bytes)[0];
    }
    /**
     * Should be used to decode list of params
     *
     * @method decodeParameter
     * @param {Array} outputs
     * @param {String} bytes
     * @return {Array} array of plain params
     */
    decodeParameters(outputs, bytes) {
        if (!bytes || bytes === '0x' || bytes === '0X') {
            throw new Error("Returned values aren't valid, did it run Out of Gas?");
        }
        const res = this.ethersAbiCoder.decode(this.mapTypes(outputs), '0x' + bytes.replace(/0x/i, ''));
        const returnValue = {};
        returnValue.__length__ = 0;
        outputs.forEach((output, i) => {
            let decodedValue = res[returnValue.__length__];
            decodedValue = decodedValue === '0x' ? null : decodedValue;
            returnValue[i] = decodedValue;
            if (isObject(output) && output.name) {
                returnValue[output.name] = decodedValue;
            }
            returnValue.__length__++;
        });
        return returnValue;
    }
    /**
     * Decodes events non- and indexed parameters.
     *
     * @method decodeLog
     * @param {Object} inputs
     * @param {String} data
     * @param {Array} topics
     * @return {Array} array of plain params
     */
    decodeLog(inputs, data, topics) {
        topics = isArray(topics) ? topics : [topics];
        data = data || '';
        const notIndexedInputs = [];
        const indexedParams = [];
        let topicCount = 0;
        // TODO check for anonymous logs?
        inputs.forEach((input, i) => {
            if (input.indexed) {
                indexedParams[i] = ['bool', 'int', 'uint', 'address', 'fixed', 'ufixed'].some(t => input.type.includes(t))
                    ? this.decodeParameter(input.type, topics[topicCount])
                    : topics[topicCount];
                topicCount++;
            }
            else {
                notIndexedInputs[i] = input;
            }
        });
        const nonIndexedData = data;
        const notIndexedParams = nonIndexedData && nonIndexedData !== '0x' ? this.decodeParameters(notIndexedInputs, nonIndexedData) : [];
        const returnValue = {};
        returnValue.__length__ = 0;
        inputs.forEach((res, i) => {
            returnValue[i] = res.type === 'string' ? '' : null;
            if (typeof notIndexedParams[i] !== 'undefined') {
                returnValue[i] = notIndexedParams[i];
            }
            if (typeof indexedParams[i] !== 'undefined') {
                returnValue[i] = indexedParams[i];
            }
            if (res.name) {
                returnValue[res.name] = returnValue[i];
            }
            returnValue.__length__++;
        });
        return returnValue;
    }
    /**
     * Map types if simplified format is used
     *
     * @method mapTypes
     * @param {Array} types
     * @return {Array}
     */
    mapTypes(types) {
        const mappedTypes = [];
        types.forEach(type => {
            if (this.isSimplifiedStructFormat(type)) {
                const structName = Object.keys(type)[0];
                mappedTypes.push(Object.assign(this.mapStructNameAndType(structName), {
                    components: this.mapStructToCoderFormat(type[structName]),
                }));
                return;
            }
            mappedTypes.push(type);
        });
        return mappedTypes;
    }
    /**
     * Check if type is simplified struct format
     *
     * @method isSimplifiedStructFormat
     * @param {string | Object} type
     * @returns {boolean}
     */
    isSimplifiedStructFormat(type) {
        return typeof type === 'object' && typeof type.components === 'undefined' && typeof type.name === 'undefined';
    }
    /**
     * Maps the correct tuple type and name when the simplified format in encode/decodeParameter is used
     *
     * @method mapStructNameAndType
     * @param {string} structName
     * @return {{type: string, name: *}}
     */
    mapStructNameAndType(structName) {
        let type = 'tuple';
        if (structName.indexOf('[]') > -1) {
            type = 'tuple[]';
            structName = structName.slice(0, -2);
        }
        return { type, name: structName };
    }
    /**
     * Maps the simplified format in to the expected format of the ABICoder
     *
     * @method mapStructToCoderFormat
     * @param {Object} struct
     * @return {Array}
     */
    mapStructToCoderFormat(struct) {
        const components = [];
        Object.keys(struct).forEach(key => {
            if (typeof struct[key] === 'object') {
                components.push(Object.assign(this.mapStructNameAndType(key), {
                    components: this.mapStructToCoderFormat(struct[key]),
                }));
                return;
            }
            components.push({
                name: key,
                type: struct[key],
            });
        });
        return components;
    }
    /**
     * Should be used to create full function/event name from json abi
     *
     * @method jsonInterfaceMethodToString
     * @param {Object} json
     * @return {String} full function/event name
     */
    abiMethodToString(json) {
        if (isObject(json) && json.name && json.name.indexOf('(') !== -1) {
            return json.name;
        }
        return json.name + '(' + flattenTypes(false, json.inputs).join(',') + ')';
    }
}
/**
 * Should be used to flatten json abi inputs/outputs into an array of type-representing-strings
 *
 * @method flattenTypes
 * @param {bool} includeTuple
 * @param {Object} puts
 * @return {Array} parameters as strings
 */
function flattenTypes(includeTuple, puts) {
    // console.log("entered _flattenTypes. inputs/outputs: " + puts)
    const types = [];
    puts.forEach(param => {
        if (typeof param.components === 'object') {
            if (param.type.substring(0, 5) !== 'tuple') {
                throw new Error('components found but type is not tuple; report on GitHub');
            }
            let suffix = '';
            const arrayBracket = param.type.indexOf('[');
            if (arrayBracket >= 0) {
                suffix = param.type.substring(arrayBracket);
            }
            const result = flattenTypes(includeTuple, param.components);
            // console.log("result should have things: " + result)
            if (isArray(result) && includeTuple) {
                // console.log("include tuple word, and its an array. joining...: " + result.types)
                types.push('tuple(' + result.join(',') + ')' + suffix);
            }
            else if (!includeTuple) {
                // console.log("don't include tuple, but its an array. joining...: " + result)
                types.push('(' + result.join(',') + ')' + suffix);
            }
            else {
                // console.log("its a single type within a tuple: " + result.types)
                types.push('(' + result + ')');
            }
        }
        else {
            // console.log("its a type and not directly in a tuple: " + param.type)
            types.push(param.type);
        }
    });
    return types;
}
export const abiCoder = new ABICoder();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29udHJhY3QvYWJpLWNvZGVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7RUFlRTtBQUVGLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxRQUFRLElBQUksU0FBUyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDL0QsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUduQzs7R0FFRztBQUNILE1BQU0sT0FBTyxRQUFRO0lBR25CO1FBQ0UsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUNsRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsRUFBRTtnQkFDcEcsT0FBTyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDekI7WUFDRCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLHVCQUF1QixDQUFDLFlBQVk7UUFDekMsSUFBSSxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDMUIsWUFBWSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNyRDtRQUVELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLG9CQUFvQixDQUFDLFlBQVk7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