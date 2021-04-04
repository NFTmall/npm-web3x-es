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
import http from 'http';
import https from 'https';
import fetch from 'isomorphic-fetch';
import { LegacyProviderAdapter } from './legacy-provider-adapter';
export class HttpProvider extends LegacyProviderAdapter {
    constructor(host, options = {}) {
        super(new LegacyHttpProvider(host, options));
    }
}
class LegacyHttpProvider {
    constructor(host, options = {}) {
        this.host = host;
        this.options = options;
        this.host = host || 'http://localhost:8545';
        if (options.keepAlive) {
            this.options.agent = /^https/.test(this.host)
                ? new https.Agent({ keepAlive: true })
                : new http.Agent({ keepAlive: true });
        }
    }
    send(payload, callback) {
        fetch(this.host, {
            ...this.options,
            method: 'POST',
            credentials: 'include',
            headers: {
                ...this.options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(json => callback(undefined, json))
            .catch(callback);
    }
    disconnect() { }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm92aWRlcnMvaHR0cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0VBZUU7QUFFRixPQUFPLElBQUksTUFBTSxNQUFNLENBQUM7QUFDeEIsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sS0FBSyxNQUFNLGtCQUFrQixDQUFDO0FBRXJDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRWxFLE1BQU0sT0FBTyxZQUFhLFNBQVEscUJBQXFCO0lBQ3JELFlBQVksSUFBWSxFQUFFLFVBQWUsRUFBRTtRQUN6QyxLQUFLLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUMvQyxDQUFDO0NBQ0Y7QUFFRCxNQUFNLGtCQUFrQjtJQUN0QixZQUFvQixJQUFZLEVBQVUsVUFBZSxFQUFFO1FBQXZDLFNBQUksR0FBSixJQUFJLENBQVE7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFVO1FBQ3pELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLHVCQUF1QixDQUFDO1FBRTVDLElBQUksT0FBTyxDQUFDLFNBQVMsRUFBRTtZQUNyQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQzNDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7Z0JBQ3RDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUN6QztJQUNILENBQUM7SUFFTSxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVE7UUFDM0IsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDZixHQUFHLElBQUksQ0FBQyxPQUFPO1lBQ2YsTUFBTSxFQUFFLE1BQU07WUFDZCxXQUFXLEVBQUUsU0FBUztZQUN0QixPQUFPLEVBQUU7Z0JBQ1AsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU87Z0JBQ3ZCLGNBQWMsRUFBRSxrQkFBa0I7YUFDbkM7WUFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7U0FDOUIsQ0FBQzthQUNDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ3ZDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRU0sVUFBVSxLQUFJLENBQUM7Q0FDdkIifQ==