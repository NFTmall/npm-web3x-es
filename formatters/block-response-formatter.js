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
import { Address } from '../address';
import { bufferToHex, hexToBuffer, hexToNumber, hexToNumberString, numberToHex } from '../utils';
import { fromRawTransactionResponse, toRawTransactionResponse, } from './transaction-response-formatter';
export function toRawBlockHeaderResponse(block) {
    return {
        hash: block.hash ? bufferToHex(block.hash) : null,
        parentHash: bufferToHex(block.parentHash),
        sha3Uncles: bufferToHex(block.sha3Uncles),
        miner: block.miner.toString(),
        stateRoot: bufferToHex(block.stateRoot),
        transactionsRoot: bufferToHex(block.transactionsRoot),
        receiptsRoot: bufferToHex(block.receiptsRoot),
        logsBloom: block.logsBloom ? bufferToHex(block.logsBloom) : null,
        difficulty: numberToHex(block.difficulty),
        number: block.number ? numberToHex(block.number) : null,
        gasLimit: numberToHex(block.gasLimit),
        gasUsed: numberToHex(block.gasUsed),
        timestamp: numberToHex(block.timestamp),
        extraData: bufferToHex(block.extraData),
        nonce: block.nonce ? bufferToHex(block.nonce) : null,
    };
}
export function toRawBlockResponse(block) {
    return {
        ...toRawBlockHeaderResponse(block),
        totalDifficulty: numberToHex(block.totalDifficulty),
        size: numberToHex(block.size),
        transactions: block.transactions.map(tx => (Buffer.isBuffer(tx) ? bufferToHex(tx) : toRawTransactionResponse(tx))),
        uncles: block.uncles,
    };
}
export function fromRawBlockHeaderResponse(block) {
    return {
        hash: block.hash ? hexToBuffer(block.hash) : null,
        parentHash: hexToBuffer(block.parentHash),
        sha3Uncles: hexToBuffer(block.sha3Uncles),
        miner: Address.fromString(block.miner),
        stateRoot: hexToBuffer(block.stateRoot),
        transactionsRoot: hexToBuffer(block.transactionsRoot),
        receiptsRoot: hexToBuffer(block.receiptsRoot),
        logsBloom: block.logsBloom ? hexToBuffer(block.logsBloom) : null,
        difficulty: hexToNumberString(block.difficulty),
        number: block.number ? hexToNumber(block.number) : null,
        gasLimit: hexToNumber(block.gasLimit),
        gasUsed: hexToNumber(block.gasUsed),
        timestamp: hexToNumber(block.timestamp),
        extraData: hexToBuffer(block.extraData),
        nonce: block.nonce ? hexToBuffer(block.nonce) : null,
    };
}
export function fromRawBlockResponse(block) {
    return {
        ...fromRawBlockHeaderResponse(block),
        totalDifficulty: hexToNumberString(block.totalDifficulty),
        size: hexToNumber(block.size),
        transactions: block.transactions.map(tx => (isString(tx) ? hexToBuffer(tx) : fromRawTransactionResponse(tx))),
        uncles: block.uncles,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvY2stcmVzcG9uc2UtZm9ybWF0dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Zvcm1hdHRlcnMvYmxvY2stcmVzcG9uc2UtZm9ybWF0dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7RUFlRTtBQUVGLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDaEMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNyQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ2pHLE9BQU8sRUFDTCwwQkFBMEIsRUFFMUIsd0JBQXdCLEdBRXpCLE1BQU0sa0NBQWtDLENBQUM7QUFvRDFDLE1BQU0sVUFBVSx3QkFBd0IsQ0FBQyxLQUEwQjtJQUNqRSxPQUFPO1FBQ0wsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7UUFDakQsVUFBVSxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQ3pDLFVBQVUsRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUN6QyxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7UUFDN0IsU0FBUyxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQ3ZDLGdCQUFnQixFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUM7UUFDckQsWUFBWSxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQzdDLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFD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