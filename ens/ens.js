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
import { Address } from '../address';
import { Net } from '../net';
import { config } from './config';
import { Registry } from './registry';
import { namehash } from './registry/namehash';
/**
 * Constructs a new instance of ENS
 *
 * @method ENS
 * @param {Object} eth
 * @constructor
 */
export class ENS {
    constructor(eth) {
        this.eth = eth;
        this.registry = new Registry(this);
        this.net = new Net(eth);
    }
    getRegistry() {
        return this.registry;
    }
    /**
     * @param {string} name
     * @returns {Promise<Contract>}
     */
    getResolver(name) {
        return this.registry.resolver(name);
    }
    /**
     * Returns the address record associated with a name.
     *
     * @method getAddress
     * @param {string} name
     * @param {function} callback
     * @return {eventifiedPromise}
     */
    async getAddress(name) {
        const resolver = await this.registry.resolver(name);
        return await resolver.methods.addr(namehash(name)).call();
    }
    /**
     * Sets a new address
     *
     * @method setAddress
     * @param {string} name
     * @param {string} address
     * @param {Object} sendOptions
     * @param {function} callback
     * @returns {eventifiedPromise}
     */
    async setAddress(name, address, sendOptions) {
        const resolver = await this.registry.resolver(name);
        return await resolver.methods.setAddr(namehash(name), address).send(sendOptions);
    }
    /**
     * Returns the public key
     *
     * @method getPubkey
     * @param {string} name
     * @param {function} callback
     * @returns {eventifiedPromise}
     */
    async getPubkey(name) {
        const resolver = await this.registry.resolver(name);
        return await resolver.methods.pubkey(namehash(name)).call();
    }
    /**
     * Set the new public key
     *
     * @method setPubkey
     * @param {string} name
     * @param {string} x
     * @param {string} y
     * @param {Object} sendOptions
     * @param {function} callback
     * @returns {eventifiedPromise}
     */
    async setPubkey(name, x, y, sendOptions) {
        const resolver = await this.registry.resolver(name);
        return await resolver.methods.setPubkey(namehash(name), x, y).send(sendOptions);
    }
    /**
     * Returns the content
     *
     * @method getContent
     * @param {string} name
     * @param {function} callback
     * @returns {eventifiedPromise}
     */
    async getContent(name) {
        const resolver = await this.registry.resolver(name);
        return await resolver.methods.content(namehash(name)).call();
    }
    /**
     * Set the content
     *
     * @method setContent
     * @param {string} name
     * @param {string} hash
     * @param {function} callback
     * @param {Object} sendOptions
     * @returns {eventifiedPromise}
     */
    async setContent(name, hash, sendOptions) {
        const resolver = await this.registry.resolver(name);
        return await resolver.methods.setContent(namehash(name), hash).send(sendOptions);
    }
    /**
     * Get the multihash
     *
     * @method getMultihash
     * @param {string} name
     * @param {function} callback
     * @returns {eventifiedPromise}
     */
    async getMultihash(name) {
        const resolver = await this.registry.resolver(name);
        return await resolver.methods.multihash(namehash(name)).call();
    }
    /**
     * Set the multihash
     *
     * @method setMultihash
     * @param {string} name
     * @param {string} hash
     * @param {Object} sendOptions
     * @param {function} callback
     * @returns {eventifiedPromise}
     */
    async setMultihash(name, hash, sendOptions) {
        const resolver = await this.registry.resolver(name);
        return await resolver.methods.setMultihash(namehash(name), hash).send(sendOptions);
    }
    /**
     * Checks if the current used network is synced and looks for ENS support there.
     * Throws an error if not.
     *
     * @returns {Promise<Block>}
     */
    async checkNetwork() {
        const block = await this.eth.getBlock('latest');
        const headAge = new Date().getTime() / 1000 - block.timestamp;
        if (headAge > 3600) {
            throw new Error('Network not synced; last block was ' + headAge + ' seconds ago');
        }
        const networkType = await this.net.getNetworkType();
        const addr = config.addresses[networkType];
        if (typeof addr === 'undefined') {
            throw new Error('ENS is not supported on network ' + networkType);
        }
        return Address.fromString(addr);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Vucy9lbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztFQWVFO0FBRUYsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQztBQUdyQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQzdCLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDbEMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN0QyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFL0M7Ozs7OztHQU1HO0FBQ0gsTUFBTSxPQUFPLEdBQUc7SUFJZCxZQUFxQixHQUFRO1FBQVIsUUFBRyxHQUFILEdBQUcsQ0FBSztRQUhyQixhQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFJcEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRU0sV0FBVztRQUNoQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLFdBQVcsQ0FBQyxJQUFZO1FBQzdCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSSxLQUFLLENBQUMsVUFBVSxDQUFDLElBQVk7UUFDbEMsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwRCxPQUFPLE1BQU0sUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDNUQsQ0FBQztJQUVEOzs7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