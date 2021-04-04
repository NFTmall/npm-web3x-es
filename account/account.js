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
import bip39 from 'bip39';
import hdkey from 'hdkey';
import { Address } from '../address';
import { create, fromPrivate } from '../eth-lib/account';
import { SentTransaction } from '../eth/send-tx';
import { decrypt, encrypt, randomBuffer } from '../utils';
import { sign } from '../utils/sign';
import { signTransaction } from './sign-transaction';
export class Account {
    constructor(address, privateKey, publicKey) {
        this.address = address;
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }
    static create(entropy = randomBuffer(32)) {
        const { privateKey, address, publicKey } = create(entropy);
        return new Account(Address.fromString(address), privateKey, publicKey);
    }
    static fromPrivate(privateKey) {
        const { address, publicKey } = fromPrivate(privateKey);
        return new Account(Address.fromString(address), privateKey, publicKey);
    }
    static createFromMnemonicAndPath(mnemonic, derivationPath) {
        const seed = bip39.mnemonicToSeed(mnemonic);
        return Account.createFromSeedAndPath(seed, derivationPath);
    }
    static createFromSeedAndPath(seed, derivationPath) {
        const root = hdkey.fromMasterSeed(seed);
        const addrNode = root.derive(derivationPath);
        const privateKey = addrNode.privateKey;
        return Account.fromPrivate(privateKey);
    }
    static async fromKeystore(v3Keystore, password, nonStrict = false) {
        return Account.fromPrivate(await decrypt(v3Keystore, password, nonStrict));
    }
    sendTransaction(tx, eth) {
        const promise = new Promise(async (resolve, reject) => {
            try {
                const signedTx = await signTransaction(tx, this.privateKey, eth);
                resolve(await eth.sendSignedTransaction(signedTx.rawTransaction).getTxHash());
            }
            catch (err) {
                reject(err);
            }
        });
        return new SentTransaction(eth, promise);
    }
    signTransaction(tx, eth) {
        return signTransaction(tx, this.privateKey, eth);
    }
    sign(data) {
        return sign(data, this.privateKey);
    }
    encrypt(password, options) {
        return encrypt(this.privateKey, this.address, password, options);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY2NvdW50L2FjY291bnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztFQWVFO0FBRUYsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRXJDLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDekQsT0FBTyxFQUFVLGVBQWUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXpELE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFZLFlBQVksRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNwRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxlQUFlLEVBQTBCLE1BQU0sb0JBQW9CLENBQUM7QUFZN0UsTUFBTSxPQUFPLE9BQU87SUFDbEIsWUFBcUIsT0FBZ0IsRUFBVyxVQUFrQixFQUFXLFNBQWlCO1FBQXpFLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFBVyxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQVcsY0FBUyxHQUFULFNBQVMsQ0FBUTtJQUFHLENBQUM7SUFFM0YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFrQixZQUFZLENBQUMsRUFBRSxDQUFDO1FBQ3JELE1BQU0sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzRCxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFTSxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQWtCO1FBQzFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZELE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVNLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxRQUFnQixFQUFFLGNBQXNCO1FBQzlFLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUMsT0FBTyxPQUFPLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFTSxNQUFNLENBQUMscUJBQXFCLENBQUMsSUFBWSxFQUFFLGNBQXNCO1FBQ3RFLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM3QyxNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDO1FBQ3ZDLE9BQU8sT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsVUFBNkIsRUFBRSxRQUFnQixFQUFFLFNBQVMsR0FBRyxLQUFLO1FBQ2pHLE9BQU8sT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUVNLGVBQWUsQ0FBQyxFQUFhLEVBQUUsR0FBUTtRQUM1QyxNQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBa0IsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNyRSxJQUFJO2dCQUNGLE1BQU0sUUFBUSxHQUFHLE1BQU0sZUFBZSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNqRSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7YUFDL0U7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDWixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDYjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLGVBQWUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVNLGVBQWUsQ0FBQyxFQUFhLEVBQUUsR0FBUTtRQUM1QyxPQUFPLGVBQWUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRU0sSUFBSSxDQUFDLElBQVk7UUFDdEIsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRU0sT0FBTyxDQUFDLFFBQWdCLEVBQUUsT0FBYTtRQUM1QyxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ25FLENBQUM7Q0FDRiJ9