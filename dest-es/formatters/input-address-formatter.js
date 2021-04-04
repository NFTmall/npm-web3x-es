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
import { Iban } from '../iban';
export function inputAddressFormatter(address) {
    if (isString(address)) {
        const iban = new Iban(address);
        if (iban.isValid() && iban.isDirect()) {
            return iban
                .toAddress()
                .toString()
                .toLowerCase();
        }
        else if (Address.isAddress(address)) {
            return Address.fromString(address)
                .toString()
                .toLowerCase();
        }
        throw new Error(`Address ${address} is invalid, the checksum failed, or its an indrect IBAN address.`);
    }
    else if (address instanceof Iban) {
        return address
            .toAddress()
            .toString()
            .toLowerCase();
    }
    else {
        return address.toString().toLowerCase();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtYWRkcmVzcy1mb3JtYXR0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZm9ybWF0dGVycy9pbnB1dC1hZGRyZXNzLWZvcm1hdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0VBZUU7QUFFRixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2hDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDckMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUUvQixNQUFNLFVBQVUscUJBQXFCLENBQUMsT0FBZ0M7SUFDcEUsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDckIsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0IsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBQ3JDLE9BQU8sSUFBSTtpQkFDUixTQUFTLEVBQUU7aUJBQ1gsUUFBUSxFQUFFO2lCQUNWLFdBQVcsRUFBRSxDQUFDO1NBQ2xCO2FBQU0sSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3JDLE9BQU8sT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7aUJBQy9CLFFBQVEsRUFBRTtpQkFDVixXQUFXLEVBQUUsQ0FBQztTQUNsQjtRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsV0FBVyxPQUFPLG1FQUFtRSxDQUFDLENBQUM7S0FDeEc7U0FBTSxJQUFJLE9BQU8sWUFBWSxJQUFJLEVBQUU7UUFDbEMsT0FBTyxPQUFPO2FBQ1gsU0FBUyxFQUFFO2FBQ1gsUUFBUSxFQUFFO2FBQ1YsV0FBVyxFQUFFLENBQUM7S0FDbEI7U0FBTTtRQUNMLE9BQU8sT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQ3pDO0FBQ0gsQ0FBQyJ9