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
import { inputSignFormatter, toRawTransactionRequest } from '../formatters';
import { bufferToHex } from '../utils';
const identity = () => (result) => result;
export class PersonalRequestPayloads {
    getAccounts() {
        return {
            method: 'personal_listAccounts',
            format: (result) => result.map(Address.fromString),
        };
    }
    newAccount(password) {
        return {
            method: 'personal_newAccount',
            params: [password],
            format: Address.fromString,
        };
    }
    unlockAccount(address, password, duration) {
        return {
            method: 'personal_unlockAccount',
            params: [address.toString().toLowerCase(), password, duration],
            format: identity(),
        };
    }
    lockAccount(address) {
        return {
            method: 'personal_lockAccount',
            params: [address.toString().toLowerCase()],
            format: identity(),
        };
    }
    importRawKey(privateKey, password) {
        return {
            method: 'personal_importRawKey',
            params: [bufferToHex(privateKey), password],
            format: Address.fromString,
        };
    }
    sendTransaction(tx, password) {
        return {
            method: 'personal_sendTransaction',
            params: [{ ...toRawTransactionRequest(tx), condition: tx.condition }, password],
            format: identity(),
        };
    }
    signTransaction(tx, password) {
        return {
            method: 'personal_signTransaction',
            params: [{ ...toRawTransactionRequest(tx), condition: tx.condition }, password],
            format: identity(),
        };
    }
    sign(message, address, password) {
        return {
            method: 'personal_sign',
            params: [inputSignFormatter(message), address.toString().toLowerCase(), password],
            format: identity(),
        };
    }
    ecRecover(message, signedData) {
        return {
            method: 'personal_ecRecover',
            params: [inputSignFormatter(message), signedData],
            format: Address.fromString,
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyc29uYWwtcmVxdWVzdC1wYXlsb2Fkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wZXJzb25hbC9wZXJzb25hbC1yZXF1ZXN0LXBheWxvYWRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7RUFlRTtBQUVGLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDckMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLHVCQUF1QixFQUFzQixNQUFNLGVBQWUsQ0FBQztBQUNoRyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBV3ZDLE1BQU0sUUFBUSxHQUFHLEdBQU0sRUFBRSxDQUFDLENBQUMsTUFBUyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFFaEQsTUFBTSxPQUFPLHVCQUF1QjtJQUMzQixXQUFXO1FBQ2hCLE9BQU87WUFDTCxNQUFNLEVBQUUsdUJBQXVCO1lBQy9CLE1BQU0sRUFBRSxDQUFDLE1BQWdCLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztTQUM3RCxDQUFDO0lBQ0osQ0FBQztJQUVNLFVBQVUsQ0FBQyxRQUFnQjtRQUNoQyxPQUFPO1lBQ0wsTUFBTSxFQUFFLHFCQUFxQjtZQUM3QixNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7WUFDbEIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxVQUFVO1NBQzNCLENBQUM7SUFDSixDQUFDO0lBRU0sYUFBYSxDQUFDLE9BQWdCLEVBQUUsUUFBZ0IsRUFBRSxRQUFnQjtRQUN2RSxPQUFPO1lBQ0wsTUFBTSxFQUFFLHdCQUF3QjtZQUNoQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsV0FBVyxFQUFFLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQztZQUM5RCxNQUFNLEVBQUUsUUFBUSxFQUFXO1NBQzVCLENBQUM7SUFDSixDQUFDO0lBRU0sV0FBVyxDQUFDLE9BQWdCO1FBQ2pDLE9BQU87WUFDTCxNQUFNLEVBQUUsc0JBQXNCO1lBQzlCLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUMxQyxNQUFNLEVBQUUsUUFBUSxFQUFRO1NBQ3pCLENBQUM7SUFDSixDQUFDO0lBRU0sWUFBWSxDQUFDLFVBQWtCLEVBQUUsUUFBZ0I7UUFDdEQsT0FBTztZQUNMLE1BQU0sRUFBRSx1QkFBdUI7WUFDL0IsTUFBTSxFQUFFLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFFBQVEsQ0FBQztZQUMzQyxNQUFNLEVBQUUsT0FBTyxDQUFDLFVBQVU7U0FDM0IsQ0FBQztJQUNKLENBQUM7SUFFTSxlQUFlLENBQUMsRUFBZSxFQUFFLFFBQWdCO1FBQ3RELE9BQU87WUFDTCxNQUFNLEVBQUUsMEJBQTBCO1lBQ2xDLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyx1QkFBdUIsQ0FBQyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLFNBQVMsRUFBRSxFQUFFLFFBQVEsQ0FBQztZQUMvRSxNQUFNLEVBQUUsUUFBUSxFQUFVO1NBQzNCLENBQUM7SUFDSixDQUFDO0lBRU0sZUFBZSxDQUFDLEVBQWUsRUFBRSxRQUFnQjtRQUN0RCxPQUFPO1lBQ0wsTUFBTSxFQUFFLDBCQUEwQjtZQUNsQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsdUJBQXVCLENBQUMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxTQUFTLEVBQUUsRUFBRSxRQUFRLENBQUM7WUFDL0UsTUFBTSxFQUFFLFFBQVEsRUFBcUI7U0FDdEMsQ0FBQztJQUNKLENBQUM7SUFFTSxJQUFJLENBQUMsT0FBZSxFQUFFLE9BQWdCLEVBQUUsUUFBZ0I7UUFDN0QsT0FBTztZQUNMLE1BQU0sRUFBRSxlQUFlO1lBQ3ZCLE1BQU0sRUFBRSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLEVBQUUsRUFBRSxRQUFRLENBQUM7WUFDakYsTUFBTSxFQUFFLFFBQVEsRUFBVTtTQUMzQixDQUFDO0lBQ0osQ0FBQztJQUVNLFNBQVMsQ0FBQyxPQUFlLEVBQUUsVUFBa0I7UUFDbEQsT0FBTztZQUNMLE1BQU0sRUFBRSxvQkFBb0I7WUFDNUIsTUFBTSxFQUFFLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLEVBQUUsVUFBVSxDQUFDO1lBQ2pELE1BQU0sRUFBRSxPQUFPLENBQUMsVUFBVTtTQUMzQixDQUFDO0lBQ0osQ0FBQztDQUNGIn0=