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
import { fromRawLogResponse, toRawLogRequest } from '../../formatters';
import { Subscription } from '../../subscriptions';
export function subscribeForLogs(eth, logRequest = {}) {
    const { fromBlock, ...subscriptionLogRequest } = logRequest;
    const params = [toRawLogRequest(subscriptionLogRequest)];
    const subscription = new Subscription('eth', 'logs', params, eth.provider, (result, sub) => {
        const output = fromRawLogResponse(result);
        sub.emit(output.removed ? 'changed' : 'data', output, sub);
    }, false);
    if (fromBlock !== undefined) {
        eth
            .getPastLogs(logRequest)
            .then(logs => {
            logs.forEach(log => subscription.emit('data', log, subscription));
            subscription.subscribe();
        })
            .catch(err => {
            subscription.emit('error', err, subscription);
        });
    }
    else {
        subscription.subscribe();
    }
    return subscription;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ldGgvc3Vic2NyaXB0aW9ucy9sb2dzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7RUFlRTtBQUdGLE9BQU8sRUFBRSxrQkFBa0IsRUFBMkMsZUFBZSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDaEgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRW5ELE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxHQUFRLEVBQUUsYUFBeUIsRUFBRTtJQUNwRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsc0JBQXNCLEVBQUUsR0FBRyxVQUFVLENBQUM7SUFDNUQsTUFBTSxNQUFNLEdBQUcsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO0lBRXpELE1BQU0sWUFBWSxHQUFHLElBQUksWUFBWSxDQUNuQyxLQUFLLEVBQ0wsTUFBTSxFQUNOLE1BQU0sRUFDTixHQUFHLENBQUMsUUFBUSxFQUNaLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQ2QsTUFBTSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDN0QsQ0FBQyxFQUNELEtBQUssQ0FDTixDQUFDO0lBRUYsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFO1FBQzNCLEdBQUc7YUFDQSxXQUFXLENBQUMsVUFBVSxDQUFDO2FBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNYLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNsRSxZQUFZLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDM0IsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ1gsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQyxDQUFDO0tBQ047U0FBTTtRQUNMLFlBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUMxQjtJQUVELE9BQU8sWUFBWSxDQUFDO0FBQ3RCLENBQUMifQ==