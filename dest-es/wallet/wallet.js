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
import { isNumber } from 'util';
import { Account } from '../account';
import { decrypt } from '../utils/encryption';
const DEFAULT_KEY_NAME = 'web3js_wallet';
export class Wallet {
    constructor(numberOfAccounts = 0) {
        this.length = 0;
        this.accounts = [];
        this.create(numberOfAccounts);
    }
    static fromMnemonic(mnemonic, numberOfAccounts) {
        const wallet = new Wallet();
        for (let i = 0; i < numberOfAccounts; ++i) {
            const path = `m/44'/60'/0'/0/${i}`;
            wallet.add(Account.createFromMnemonicAndPath(mnemonic, path));
        }
        return wallet;
    }
    static fromSeed(seed, numberOfAccounts) {
        const wallet = new Wallet();
        for (let i = 0; i < numberOfAccounts; ++i) {
            const path = `m/44'/60'/0'/0/${i}`;
            wallet.add(Account.createFromSeedAndPath(seed, path));
        }
        return wallet;
    }
    static async fromKeystores(encryptedWallet, password) {
        const wallet = new Wallet();
        await wallet.decrypt(encryptedWallet, password);
        return wallet;
    }
    static async fromLocalStorage(password, keyName = DEFAULT_KEY_NAME) {
        if (!localStorage) {
            return;
        }
        const keystoreStr = localStorage.getItem(keyName);
        if (!keystoreStr) {
            return;
        }
        try {
            return Wallet.fromKeystores(JSON.parse(keystoreStr), password);
        }
        catch (e) {
            return;
        }
    }
    create(numberOfAccounts, entropy) {
        for (let i = 0; i < numberOfAccounts; ++i) {
            this.add(Account.create(entropy).privateKey);
        }
        return this.accounts;
    }
    get(addressOrIndex) {
        if (isNumber(addressOrIndex)) {
            return this.accounts[addressOrIndex];
        }
        return this.accounts.find(a => a && a.address.toString().toLowerCase() === addressOrIndex.toString().toLowerCase());
    }
    indexOf(addressOrIndex) {
        if (isNumber(addressOrIndex)) {
            return addressOrIndex;
        }
        return this.accounts.findIndex(a => a.address.toString().toLowerCase() === addressOrIndex.toString().toLowerCase());
    }
    add(accountOrKey) {
        const account = Buffer.isBuffer(accountOrKey) ? Account.fromPrivate(accountOrKey) : accountOrKey;
        const existing = this.get(account.address);
        if (existing) {
            return existing;
        }
        const index = this.findSafeIndex();
        this.accounts[index] = account;
        this.length++;
        return account;
    }
    remove(addressOrIndex) {
        const index = this.indexOf(addressOrIndex);
        if (index === -1) {
            return false;
        }
        delete this.accounts[index];
        this.length--;
        return true;
    }
    clear() {
        this.accounts = [];
        this.length = 0;
    }
    encrypt(password, options) {
        return Promise.all(this.currentIndexes().map(index => this.accounts[index].encrypt(password, options)));
    }
    async decrypt(encryptedWallet, password) {
        const decrypted = await Promise.all(encryptedWallet.map(keystore => decrypt(keystore, password)));
        decrypted.forEach(account => {
            if (!account) {
                throw new Error("Couldn't decrypt accounts. Password wrong?");
            }
            this.add(account);
        });
        return this.accounts;
    }
    async saveToLocalStorage(password, keyName = DEFAULT_KEY_NAME) {
        if (!localStorage) {
            return false;
        }
        localStorage.setItem(keyName, JSON.stringify(await this.encrypt(password)));
        return true;
    }
    findSafeIndex(pointer = 0) {
        while (this.accounts[pointer]) {
            ++pointer;
        }
        return pointer;
    }
    currentIndexes() {
        return Object.keys(this.accounts).map(key => +key);
    }
    currentAddresses() {
        return Object.entries(this.accounts).map(([, account]) => account.address);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FsbGV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3dhbGxldC93YWxsZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztFQWVFO0FBRUYsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNoQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRXJDLE9BQU8sRUFBRSxPQUFPLEVBQVksTUFBTSxxQkFBcUIsQ0FBQztBQUV4RCxNQUFNLGdCQUFnQixHQUFHLGVBQWUsQ0FBQztBQUV6QyxNQUFNLE9BQU8sTUFBTTtJQUlqQixZQUFZLG1CQUEyQixDQUFDO1FBSGpDLFdBQU0sR0FBVyxDQUFDLENBQUM7UUFDbkIsYUFBUSxHQUFjLEVBQUUsQ0FBQztRQUc5QixJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBZ0IsRUFBRSxnQkFBd0I7UUFDbkUsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUM1QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDekMsTUFBTSxJQUFJLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxDQUFDO1lBQ25DLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLHlCQUF5QixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQy9EO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVNLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBWSxFQUFFLGdCQUF3QjtRQUMzRCxNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO1FBQzVCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxnQkFBZ0IsRUFBRSxF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