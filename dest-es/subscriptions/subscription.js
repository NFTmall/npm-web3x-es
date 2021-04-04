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
import { EventEmitter } from 'events';
import { isArray } from 'util';
export class Subscription extends EventEmitter {
    constructor(type, subscription, params, provider, callback, subscribeImmediately = true) {
        super();
        this.type = type;
        this.subscription = subscription;
        this.params = params;
        this.provider = provider;
        this.callback = callback;
        if (subscribeImmediately) {
            this.subscribe();
        }
    }
    async subscribe() {
        if (this.id) {
            this.unsubscribe();
        }
        try {
            this.listener = params => this.notificationHandler(params);
            this.provider.on('notification', this.listener);
            this.id = await this.provider.send(`${this.type}_subscribe`, [this.subscription, ...this.params]);
            if (!this.id) {
                throw new Error(`Failed to subscribe to ${this.subscription}.`);
            }
        }
        catch (err) {
            this.emit('error', err, this);
        }
        return this;
    }
    notificationHandler(params) {
        const { subscription, result } = params;
        if (subscription !== this.id) {
            return;
        }
        if (result instanceof Error) {
            this.unsubscribe();
            this.emit('error', result, this);
            return;
        }
        const resultArr = isArray(result) ? result : [result];
        resultArr.forEach(resultItem => {
            this.callback(resultItem, this);
        });
    }
    unsubscribe() {
        if (this.listener) {
            this.provider.removeListener('notification', this.listener);
        }
        if (this.id) {
            this.provider.send(`${this.type}_unsubscribe`, [this.id]);
        }
        this.id = undefined;
        this.listener = undefined;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N1YnNjcmlwdGlvbnMvc3Vic2NyaXB0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7RUFlRTtBQUVGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDdEMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQVEvQixNQUFNLE9BQU8sWUFBK0MsU0FBUSxZQUFZO0lBSTlFLFlBQ1csSUFBbUIsRUFDbkIsWUFBb0IsRUFDcEIsTUFBYSxFQUNkLFFBQTBCLEVBQzFCLFFBQTJFLEVBQ25GLHVCQUFnQyxJQUFJO1FBRXBDLEtBQUssRUFBRSxDQUFDO1FBUEMsU0FBSSxHQUFKLElBQUksQ0FBZTtRQUNuQixpQkFBWSxHQUFaLFlBQVksQ0FBUTtRQUNwQixXQUFNLEdBQU4sTUFBTSxDQUFPO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7UUFDMUIsYUFBUSxHQUFSLFFBQVEsQ0FBbUU7UUFLbkYsSUFBSSxvQkFBb0IsRUFBRTtZQUN4QixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDbEI7SUFDSCxDQUFDO0lBRU0sS0FBSyxDQUFDLFNBQVM7UUFDcEIsSUFBSSxJQUFJLENBQUMsRUFBRSxFQUFFO1lBQ1gsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3BCO1FBRUQsSUFBSTtZQUNGLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUVoRCxJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxZQUFZLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFFbEcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUU7Z0JBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7YUFDakU7U0FDRjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQy9CO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU8sbUJBQW1CLENBQUMsTUFBMEI7UUFDcEQsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUM7UUFFeEMsSUFBSSxZQUFZLEtBQUssSUFBSSxDQUFDLEVBQUUsRUFBRTtZQUM1QixPQUFPO1NBQ1I7UUFFRCxJQUFJLE1BQU0sWUFBWSxLQUFLLEVBQUU7WUFDM0IsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNqQyxPQUFPO1NBQ1I7UUFFRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV0RCxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLFdBQVc7UUFDaEIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDN0Q7UUFDRCxJQUFJLElBQUksQ0FBQyxFQUFFLEVBQUU7WUFDWCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLGNBQWMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzNEO1FBQ0QsSUFBSSxDQUFDLEVBQUUsR0FBRyxTQUFTLENBQUM7UUFDcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7SUFDNUIsQ0FBQztDQUNGIn0=