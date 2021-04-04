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
import { fromRawBlockResponse, fromRawLogResponse, fromRawTransactionReceipt, fromRawTransactionResponse, inputBlockNumberFormatter, inputSignFormatter, outputBigNumberFormatter, outputSyncingFormatter, toRawCallRequest, toRawEstimateRequest, toRawLogRequest, toRawTransactionRequest, } from '../formatters';
import { hexToNumber, isHexStrict, numberToHex } from '../utils';
const identity = () => (result) => result;
export class EthRequestPayloads {
    constructor(defaultFromAddress, defaultBlock = 'latest') {
        this.defaultFromAddress = defaultFromAddress;
        this.defaultBlock = defaultBlock;
    }
    getDefaultBlock() {
        return this.defaultBlock;
    }
    setDefaultBlock(block) {
        this.defaultBlock = block;
    }
    getId() {
        return {
            method: 'net_version',
            format: hexToNumber,
        };
    }
    getNodeInfo() {
        return {
            method: 'web3_clientVersion',
            format: identity(),
        };
    }
    getProtocolVersion() {
        return {
            method: 'eth_protocolVersion',
            format: identity(),
        };
    }
    getCoinbase() {
        return {
            method: 'eth_coinbase',
            format: Address.fromString,
        };
    }
    isMining() {
        return {
            method: 'eth_mining',
            format: identity(),
        };
    }
    getHashrate() {
        return {
            method: 'eth_hashrate',
            format: hexToNumber,
        };
    }
    isSyncing() {
        return {
            method: 'eth_syncing',
            format: outputSyncingFormatter,
        };
    }
    getGasPrice() {
        return {
            method: 'eth_gasPrice',
            format: outputBigNumberFormatter,
        };
    }
    getAccounts() {
        return {
            method: 'eth_accounts',
            format: (result) => result.map(Address.fromString),
        };
    }
    getBlockNumber() {
        return {
            method: 'eth_blockNumber',
            format: hexToNumber,
        };
    }
    getBalance(address, block) {
        return {
            method: 'eth_getBalance',
            params: [address.toString().toLowerCase(), inputBlockNumberFormatter(this.resolveBlock(block))],
            format: outputBigNumberFormatter,
        };
    }
    getStorageAt(address, position, block) {
        return {
            method: 'eth_getStorageAt',
            params: [
                address.toString().toLowerCase(),
                numberToHex(position),
                inputBlockNumberFormatter(this.resolveBlock(block)),
            ],
            format: identity(),
        };
    }
    getCode(address, block) {
        return {
            method: 'eth_getCode',
            params: [address.toString().toLowerCase(), inputBlockNumberFormatter(this.resolveBlock(block))],
            format: identity(),
        };
    }
    getBlock(block, returnTransactionObjects = false) {
        return {
            method: isString(block) && isHexStrict(block) ? 'eth_getBlockByHash' : 'eth_getBlockByNumber',
            params: [inputBlockNumberFormatter(this.resolveBlock(block)), returnTransactionObjects],
            format: fromRawBlockResponse,
        };
    }
    getUncle(block, uncleIndex, returnTransactionObjects = false) {
        return {
            method: isString(block) && isHexStrict(block) ? 'eth_getUncleByBlockHashAndIndex' : 'eth_getUncleByBlockNumberAndIndex',
            params: [inputBlockNumberFormatter(this.resolveBlock(block)), numberToHex(uncleIndex), returnTransactionObjects],
            format: fromRawBlockResponse,
        };
    }
    getBlockTransactionCount(block) {
        return {
            method: isString(block) && isHexStrict(block)
                ? 'eth_getBlockTransactionCountByHash'
                : 'eth_getBlockTransactionCountByNumber',
            params: [inputBlockNumberFormatter(this.resolveBlock(block))],
            format: hexToNumber,
        };
    }
    getBlockUncleCount(block) {
        return {
            method: isString(block) && isHexStrict(block) ? 'eth_getUncleCountByBlockHash' : 'eth_getUncleCountByBlockNumber',
            params: [inputBlockNumberFormatter(this.resolveBlock(block))],
            format: hexToNumber,
        };
    }
    getTransaction(hash) {
        return {
            method: 'eth_getTransactionByHash',
            params: [hash],
            format: fromRawTransactionResponse,
        };
    }
    getTransactionFromBlock(block, index) {
        return {
            method: isString(block) && isHexStrict(block)
                ? 'eth_getTransactionByBlockHashAndIndex'
                : 'eth_getTransactionByBlockNumberAndIndex',
            params: [inputBlockNumberFormatter(block), numberToHex(index)],
            format: fromRawTransactionResponse,
        };
    }
    getTransactionReceipt(hash) {
        return {
            method: 'eth_getTransactionReceipt',
            params: [hash],
            format: fromRawTransactionReceipt,
        };
    }
    getTransactionCount(address, block) {
        return {
            method: 'eth_getTransactionCount',
            params: [address.toString().toLowerCase(), inputBlockNumberFormatter(this.resolveBlock(block))],
            format: hexToNumber,
        };
    }
    signTransaction(tx) {
        tx.from = tx.from || this.defaultFromAddress;
        return {
            method: 'eth_signTransaction',
            params: [toRawTransactionRequest(tx)],
            format: identity(),
        };
    }
    sendSignedTransaction(data) {
        return {
            method: 'eth_sendRawTransaction',
            params: [data],
            format: identity(),
        };
    }
    sendTransaction(tx) {
        const from = tx.from || this.defaultFromAddress;
        if (!from) {
            throw new Error('No from addres specified.');
        }
        return {
            method: 'eth_sendTransaction',
            params: [toRawTransactionRequest({ ...tx, from })],
            format: identity(),
        };
    }
    sign(address, dataToSign) {
        return {
            method: 'eth_sign',
            params: [address.toString().toLowerCase(), inputSignFormatter(dataToSign)],
            format: identity(),
        };
    }
    signTypedData(address, dataToSign) {
        return {
            method: 'eth_signTypedData',
            params: [dataToSign, address.toString().toLowerCase()],
            format: identity(),
        };
    }
    call(tx, block) {
        tx.from = tx.from || this.defaultFromAddress;
        return {
            method: 'eth_call',
            params: [toRawCallRequest(tx), inputBlockNumberFormatter(this.resolveBlock(block))],
            format: identity(),
        };
    }
    estimateGas(tx) {
        tx.from = tx.from || this.defaultFromAddress;
        return {
            method: 'eth_estimateGas',
            params: [toRawEstimateRequest(tx)],
            format: hexToNumber,
        };
    }
    submitWork(nonce, powHash, digest) {
        return {
            method: 'eth_submitWork',
            params: [nonce, powHash, digest],
            format: identity(),
        };
    }
    getWork() {
        return {
            method: 'eth_getWork',
            format: identity(),
        };
    }
    getPastLogs(options) {
        return {
            method: 'eth_getLogs',
            params: [toRawLogRequest(options)],
            format: (result) => result.map(fromRawLogResponse),
        };
    }
    resolveBlock(block) {
        return block === undefined ? this.defaultBlock : block;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoLXJlcXVlc3QtcGF5bG9hZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXRoL2V0aC1yZXF1ZXN0LXBheWxvYWRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7RUFlRTtBQUVGLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDaEMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNyQyxPQUFPLEVBR0wsb0JBQW9CLEVBQ3BCLGtCQUFrQixFQUNsQix5QkFBeUIsRUFDekIsMEJBQTBCLEVBQzFCLHlCQUF5QixFQUN6QixrQkFBa0IsRUFFbEIsd0JBQXdCLEVBQ3hCLHNCQUFzQixFQUd0QixnQkFBZ0IsRUFDaEIsb0JBQW9CLEVBQ3BCLGVBQWUsRUFDZix1QkFBdUIsR0FFeEIsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBSWpFLE1BQU0sUUFBUSxHQUFHLEdBQU0sRUFBRSxDQUFDLENBQUMsTUFBUyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFFaEQsTUFBTSxPQUFPLGtCQUFrQjtJQUM3QixZQUFtQixrQkFBNEIsRUFBVSxlQUEwQixRQUFRO1FBQXhFLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBVTtRQUFVLGlCQUFZLEdBQVosWUFBWSxDQUFzQjtJQUFHLENBQUM7SUFFeEYsZUFBZTtRQUNwQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDM0IsQ0FBQztJQUVNLGVBQWUsQ0FBQyxLQUFnQjtRQUNyQyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztJQUM1QixDQUFDO0lBRU0sS0FBSztRQUNWLE9BQU87WUFDTCxNQUFNLEVBQUUsYUFBYTtZQUNyQixNQUFNLEVBQUUsV0FBVztTQUNwQixDQUFDO0lBQ0osQ0FBQztJQUVNLFdBQVc7UUFD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