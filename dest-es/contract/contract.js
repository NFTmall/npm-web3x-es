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
import { fromRawLogResponse, toRawLogRequest } from '../formatters';
import { Subscription } from '../subscriptions';
import { hexToBuffer } from '../utils';
import { Tx } from './tx';
import { TxDeploy } from './tx-deploy';
/**
 * Should be called to create new contract instance
 *
 * @method Contract
 * @constructor
 * @param {Array} jsonInterface
 * @param {String} address
 * @param {Object} options
 */
export class Contract {
    constructor(eth, contractAbi, address, defaultOptions = {}) {
        this.eth = eth;
        this.contractAbi = contractAbi;
        this.address = address;
        this.defaultOptions = defaultOptions;
        this.linkTable = {};
        this.methods = this.buildMethods();
        this.events = this.buildEvents();
    }
    link(name, address) {
        this.linkTable[name] = address;
    }
    deployBytecode(data, ...args) {
        const linkedData = Object.entries(this.linkTable).reduce((data, [name, address]) => data.replace(new RegExp(`_+${name}_+`, 'gi'), address
            .toString()
            .slice(2)
            .toLowerCase()), data);
        if (linkedData.includes('_')) {
            throw new Error('Bytecode has not been fully linked.');
        }
        return new TxDeploy(this.eth, this.contractAbi.ctor, this.contractAbi, hexToBuffer(linkedData), args, this.defaultOptions, addr => (this.address = addr));
    }
    once(event, options, callback) {
        this.on(event, options, (err, res, sub) => {
            sub.unsubscribe();
            callback(err, res, sub);
        });
    }
    async getPastEvents(event, options = {}) {
        const logOptions = this.getLogOptions(event, options);
        const result = await this.eth.getPastLogs(logOptions);
        return result.map(log => this.contractAbi.decodeEvent(log));
    }
    on(event, options = {}, callback) {
        const logOptions = this.getLogOptions(event, options);
        const { fromBlock, ...subLogOptions } = logOptions;
        const params = [toRawLogRequest(subLogOptions)];
        const subscription = new Subscription('eth', 'logs', params, this.eth.provider, (result, sub) => {
            const output = fromRawLogResponse(result);
            const eventLog = this.contractAbi.decodeEvent(output);
            sub.emit(output.removed ? 'changed' : 'data', eventLog);
            if (callback) {
                callback(undefined, eventLog, sub);
            }
        }, false);
        subscription.on('error', err => {
            if (callback) {
                callback(err, undefined, subscription);
            }
        });
        if (fromBlock !== undefined) {
            this.eth
                .getPastLogs(logOptions)
                .then(logs => {
                logs.forEach(result => {
                    const output = this.contractAbi.decodeEvent(result);
                    subscription.emit('data', output);
                });
                subscription.subscribe();
            })
                .catch(err => {
                subscription.emit('error', err);
            });
        }
        else {
            subscription.subscribe();
        }
        return subscription;
    }
    executorFactory(functions) {
        return (...args) => {
            if (!this.address) {
                throw new Error('No contract address.');
            }
            const firstMatchingOverload = functions.find(f => args.length === f.numArgs());
            if (!firstMatchingOverload) {
                throw new Error(`No matching method with ${args.length} arguments for ${functions[0].name}.`);
            }
            return new Tx(this.eth, firstMatchingOverload, this.contractAbi, this.address, args, this.defaultOptions);
        };
    }
    buildMethods() {
        const methods = {};
        this.contractAbi.functions.forEach(f => {
            const executor = this.executorFactory([f]);
            methods[f.asString()] = executor;
            methods[f.signature] = executor;
        });
        const grouped = this.contractAbi.functions.reduce((acc, method) => {
            const funcs = [...(acc[method.name] || []), method];
            return { ...acc, [method.name]: funcs };
        }, {});
        Object.entries(grouped).map(([name, funcs]) => {
            methods[name] = this.executorFactory(funcs);
        });
        return methods;
    }
    buildEvents() {
        const events = {};
        this.contractAbi.events.forEach(e => {
            const event = this.on.bind(this, e.signature);
            if (!events[e.name]) {
                events[e.name] = event;
            }
            events[e.asString()] = event;
            events[e.signature] = event;
        });
        events.allEvents = this.on.bind(this, 'allevents');
        return events;
    }
    getLogOptions(eventName = 'allevents', options) {
        if (!this.address) {
            throw new Error('No contract address.');
        }
        if (eventName.toLowerCase() === 'allevents') {
            return {
                ...options,
                address: this.address,
            };
        }
        const event = this.contractAbi.events.find(e => e.name === eventName || e.signature === '0x' + eventName.replace('0x', ''));
        if (!event) {
            throw new Error(`Event ${eventName} not found.`);
        }
        return {
            ...options,
            address: this.address,
            topics: event.getEventTopics(options.filter),
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29udHJhY3QvY29udHJhY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztFQWVFO0FBSUYsT0FBTyxFQUFZLGtCQUFrQixFQUEyQyxlQUFlLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdkgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRWhELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFdkMsT0FBTyxFQUFFLEVBQUUsRUFBYSxNQUFNLE1BQU0sQ0FBQztBQUNyQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBaUN2Qzs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sT0FBTyxRQUFRO0lBS25CLFlBQ1UsR0FBUSxFQUNSLFdBQXdCLEVBQ3pCLE9BQWlCLEVBQ2hCLGlCQUFrQyxFQUFFO1FBSHBDLFFBQUcsR0FBSCxHQUFHLENBQUs7UUFDUixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN6QixZQUFPLEdBQVAsT0FBTyxDQUFVO1FBQ2hCLG1CQUFjLEdBQWQsY0FBYyxDQUFzQjtRQU50QyxjQUFTLEdBQWdDLEVBQUUsQ0FBQztRQVFsRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRU0sSUFBSSxDQUFDLElBQVksRUFBRSxPQUFnQjtRQUN4QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQztJQUNqQyxDQUFDO0lBRU0sY0FBYyxDQUFDLElBQVUsRUFBRSxHQUFHLElBQVc7UUFDOUMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsTUFB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