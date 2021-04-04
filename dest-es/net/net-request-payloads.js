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
import { hexToNumber } from '../utils';
const identity = result => result;
export class NetRequestPayloads {
    getId() {
        return {
            method: 'net_version',
            format: hexToNumber,
        };
    }
    isListening() {
        return {
            method: 'net_listening',
            format: identity,
        };
    }
    getPeerCount() {
        return {
            method: 'net_peerCount',
            format: hexToNumber,
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0LXJlcXVlc3QtcGF5bG9hZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbmV0L25ldC1yZXF1ZXN0LXBheWxvYWRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7RUFlRTtBQUVGLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFdkMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFFbEMsTUFBTSxPQUFPLGtCQUFrQjtJQUN0QixLQUFLO1FBQ1YsT0FBTztZQUNMLE1BQU0sRUFBRSxhQUFhO1lBQ3JCLE1BQU0sRUFBRSxXQUFXO1NBQ3BCLENBQUM7SUFDSixDQUFDO0lBRU0sV0FBVztRQUNoQixPQUFPO1lBQ0wsTUFBTSxFQUFFLGVBQWU7WUFDdkIsTUFBTSxFQUFFLFFBQVE7U0FDakIsQ0FBQztJQUNKLENBQUM7SUFFTSxZQUFZO1FBQ2pCLE9BQU87WUFDTCxNQUFNLEVBQUUsZUFBZTtZQUN2QixNQUFNLEVBQUUsV0FBVztTQUNwQixDQUFDO0lBQ0osQ0FBQztDQUNGIn0=