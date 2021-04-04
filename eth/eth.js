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
import { LegacyProviderAdapter } from '../providers';
import { EthRequestPayloads } from './eth-request-payloads';
import { SentTransaction } from './send-tx';
import { subscribeForLogs } from './subscriptions/logs';
import { subscribeForNewHeads } from './subscriptions/new-heads';
import { subscribeForNewPendingTransactions } from './subscriptions/new-pending-transactions';
import { subscribeForSyncing } from './subscriptions/syncing';
export class Eth {
    constructor(provider) {
        this.provider = provider;
        this.request = new EthRequestPayloads(undefined, 'latest');
    }
    static fromCurrentProvider() {
        if (typeof web3 === 'undefined') {
            return;
        }
        const provider = web3.currentProvider || web3.ethereumProvider;
        if (!provider) {
            return;
        }
        return new Eth(new LegacyProviderAdapter(provider));
    }
    get defaultFromAddress() {
        return this.request.defaultFromAddress;
    }
    set defaultFromAddress(address) {
        this.request.defaultFromAddress = address;
    }
    async send({ method, params, format }) {
        return format(await this.provider.send(method, params));
    }
    async getId() {
        return await this.send(this.request.getId());
    }
    async getNodeInfo() {
        return await this.send(this.request.getNodeInfo());
    }
    async getProtocolVersion() {
        return await this.send(this.request.getProtocolVersion());
    }
    async getCoinbase() {
        return await this.send(this.request.getCoinbase());
    }
    async isMining() {
        return await this.send(this.request.isMining());
    }
    async getHashrate() {
        return await this.send(this.request.getHashrate());
    }
    async isSyncing() {
        return await this.send(this.request.isSyncing());
    }
    async getGasPrice() {
        return await this.send(this.request.getGasPrice());
    }
    async getAccounts() {
        return await this.send(this.request.getAccounts());
    }
    async getBlockNumber() {
        return await this.send(this.request.getBlockNumber());
    }
    async getBalance(address, block) {
        return await this.send(this.request.getBalance(address, block));
    }
    async getStorageAt(address, position, block) {
        return await this.send(this.request.getStorageAt(address, position, block));
    }
    async getCode(address, block) {
        return await this.send(this.request.getCode(address, block));
    }
    async getBlock(block, returnTxs) {
        return await this.send(this.request.getBlock(block, returnTxs));
    }
    async getUncle(block, uncleIndex, returnTxs) {
        return await this.send(this.request.getUncle(block, uncleIndex, returnTxs));
    }
    async getBlockTransactionCount(block) {
        return await this.send(this.request.getBlockTransactionCount(block));
    }
    async getBlockUncleCount(block) {
        return await this.send(this.request.getBlockUncleCount(block));
    }
    async getTransaction(hash) {
        return await this.send(this.request.getTransaction(hash));
    }
    async getTransactionFromBlock(block, index) {
        return await this.send(this.request.getTransactionFromBlock(block, index));
    }
    async getTransactionReceipt(txHash) {
        return await this.send(this.request.getTransactionReceipt(txHash));
    }
    async getTransactionCount(address, block) {
        return await this.send(this.request.getTransactionCount(address, block));
    }
    async signTransaction(tx) {
        return await this.send(this.request.signTransaction(tx));
    }
    sendSignedTransaction(data) {
        const { method, params } = this.request.sendSignedTransaction(data);
        const txHashPromise = this.provider.send(method, params);
        return new SentTransaction(this, txHashPromise);
    }
    sendTransaction(tx) {
        const promise = new Promise(async (resolve, reject) => {
            try {
                if (!tx.gasPrice) {
                    tx.gasPrice = await this.getGasPrice();
                }
                const account = this.getAccount(tx.from);
                if (!account) {
                    const { method, params, format } = this.request.sendTransaction(tx);
                    const txHash = format(await this.provider.send(method, params));
                    resolve(txHash);
                }
                else {
                    const { from, ...fromlessTx } = tx;
                    const signedTx = await account.signTransaction(fromlessTx, this);
                    const { method, params, format } = this.request.sendSignedTransaction(signedTx.rawTransaction);
                    const txHash = format(await this.provider.send(method, params));
                    resolve(txHash);
                }
            }
            catch (err) {
                reject(err);
            }
        });
        return new SentTransaction(this, promise);
    }
    getAccount(address) {
        address = address || this.defaultFromAddress;
        if (this.wallet && address) {
            return this.wallet.get(address);
        }
    }
    async sign(address, dataToSign) {
        const account = this.getAccount(address);
        if (!account) {
            return await this.send(this.request.sign(address, dataToSign));
        }
        else {
            const sig = account.sign(dataToSign);
            return sig.signature;
        }
    }
    async signTypedData(address, dataToSign) {
        return await this.send(this.request.signTypedData(address, dataToSign));
    }
    async call(tx, block) {
        return await this.send(this.request.call(tx, block));
    }
    async estimateGas(tx) {
        return await this.send(this.request.estimateGas(tx));
    }
    async submitWork(nonce, powHash, digest) {
        return await this.send(this.request.submitWork(nonce, powHash, digest));
    }
    async getWork() {
        return await this.send(this.request.getWork());
    }
    async getPastLogs(options) {
        return await this.send(this.request.getPastLogs(options));
    }
    subscribe(type, ...args) {
        switch (type) {
            case 'logs':
                return subscribeForLogs(this, ...args);
            case 'syncing':
                return subscribeForSyncing(this.provider);
            case 'newBlockHeaders':
                return subscribeForNewHeads(this.provider);
            case 'pendingTransactions':
                return subscribeForNewPendingTransactions(this.provider);
            default:
                throw new Error(`Unknown subscription type: ${type}`);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2V0aC9ldGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztFQWVFO0FBY0YsT0FBTyxFQUFrQixxQkFBcUIsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQU1yRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM1RCxPQUFPLEVBQVUsZUFBZSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3BELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxrQ0FBa0MsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQzlGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBTTlELE1BQU0sT0FBTyxHQUFHO0lBSWQsWUFBcUIsUUFBMEI7UUFBMUIsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7UUFDN0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRU0sTUFBTSxDQUFDLG1CQUFtQjtRQUMvQixJQUFJLE9BQU8sSUFBSSxLQUFLLFdBQVcsRUFBRTtZQUMvQixPQUFPO1NBQ1I7UUFDRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUMvRCxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2IsT0FBTztTQUNSO1FBQ0QsT0FBTyxJQUFJLEdBQUcsQ0FBQyxJQUFJLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELElBQVcsa0JBQWtCO1FBQzNCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztJQUN6QyxDQUFD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