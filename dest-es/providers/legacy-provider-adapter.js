import { EventEmitter } from 'events';
import { createJsonRpcPayload, isValidJsonRpcResponse } from './jsonrpc';
export class LegacyProviderAdapter {
    constructor(provider) {
        this.provider = provider;
        this.eventEmitter = new EventEmitter();
    }
    subscribeToLegacyProvider() {
        if (!this.provider.on) {
            throw new Error('Legacy provider does not support subscriptions.');
        }
        this.provider.on('data', (result, deprecatedResult) => {
            result = result || deprecatedResult;
            if (!result.method) {
                return;
            }
            this.eventEmitter.emit('notification', result.params);
        });
    }
    send(method, params) {
        return new Promise((resolve, reject) => {
            const payload = createJsonRpcPayload(method, params);
            this.provider.send(payload, (err, message) => {
                if (err) {
                    return reject(err);
                }
                if (!message) {
                    return reject(new Error('No response.'));
                }
                if (!isValidJsonRpcResponse(message)) {
                    const msg = message.error && message.error.message
                        ? message.error.message
                        : 'Invalid JSON RPC response: ' + JSON.stringify(message);
                    return reject(new Error(msg));
                }
                const response = message;
                if (response.error) {
                    const message = response.error.message ? response.error.message : JSON.stringify(response);
                    return reject(new Error('Returned error: ' + message));
                }
                if (response.id && payload.id !== response.id) {
                    return reject(new Error(`Wrong response id ${payload.id} != ${response.id} in ${JSON.stringify(payload)}`));
                }
                resolve(response.result);
            });
        });
    }
    on(notification, listener) {
        if (notification !== 'notification') {
            throw new Error('Legacy providers only support notification event.');
        }
        if (this.eventEmitter.listenerCount('notification') === 0) {
            this.subscribeToLegacyProvider();
        }
        this.eventEmitter.on('notification', listener);
        return this;
    }
    removeListener(notification, listener) {
        if (!this.provider.removeListener) {
            throw new Error('Legacy provider does not support subscriptions.');
        }
        if (notification !== 'notification') {
            throw new Error('Legacy providers only support notification event.');
        }
        this.eventEmitter.removeListener('notification', listener);
        if (this.eventEmitter.listenerCount('notification') === 0) {
            this.provider.removeAllListeners('data');
        }
        return this;
    }
    removeAllListeners(notification) {
        this.eventEmitter.removeAllListeners('notification');
        if (this.provider.removeAllListeners) {
            this.provider.removeAllListeners('data');
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVnYWN5LXByb3ZpZGVyLWFkYXB0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcHJvdmlkZXJzL2xlZ2FjeS1wcm92aWRlci1hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFFdEMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLHNCQUFzQixFQUFtQixNQUFNLFdBQVcsQ0FBQztBQUcxRixNQUFNLE9BQU8scUJBQXFCO0lBR2hDLFlBQW9CLFFBQXdCO1FBQXhCLGFBQVEsR0FBUixRQUFRLENBQWdCO1FBRnBDLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQUVLLENBQUM7SUFFeEMseUJBQXlCO1FBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRTtZQUNyQixNQUFNLElBQUksS0FBSyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7U0FDcEU7UUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFXLEVBQUUsZ0JBQXNCLEVBQUUsRUFBRTtZQUMvRCxNQUFNLEdBQUcsTUFBTSxJQUFJLGdCQUFnQixDQUFDO1lBQ3BDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO2dCQUNsQixPQUFPO2FBQ1I7WUFFRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLElBQUksQ0FBQyxNQUFjLEVBQUUsTUFBYztRQUN4QyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3JDLE1BQU0sT0FBTyxHQUFHLG9CQUFvQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUVyRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUU7Z0JBQzNDLElBQUksR0FBRyxFQUFFO29CQUNQLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNwQjtnQkFDRCxJQUFJLENBQUMsT0FBTyxFQUFFO29CQUNaLE9BQU8sTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7aUJBQzFDO2dCQUNELElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsRUFBRTtvQkFDcEMsTUFBTSxHQUFHLEdBQ1AsT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU87d0JBQ3BDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU87d0JBQ3ZCLENBQUMsQ0FBQyw2QkFBNkIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUM5RCxPQUFPLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUMvQjtnQkFDRCxNQUFNLFFBQVEsR0FBRyxPQUEwQixDQUFDO2dCQUU1QyxJQUFJLFFBQVEsQ0FBQyxLQUFLLEVBQUU7b0JBQ2xCLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDM0YsT0FBTyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsa0JBQWtCLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztpQkFDeEQ7Z0JBQ0QsSUFBSSxRQUFRLENBQUMsRUFBRSxJQUFJLE9BQU8sQ0FBQyxFQUFFLEtBQUssUUFBUSxDQUFDLEVBQUUsRUFBRTtvQkFDN0MsT0FBTyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMscUJBQXFCLE9BQU8sQ0FBQyxFQUFFLE9BQU8sUUFBUSxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUM3RztnQkFFRCxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBT00sRUFBRSxDQUFDLFlBQTJDLEVBQUUsUUFBa0M7UUFDdkYsSUFBSSxZQUFZLEtBQUssY0FBYyxFQUFFO1lBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsbURBQW1ELENBQUMsQ0FBQztTQUN0RTtRQUNELElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3pELElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1NBQ2xDO1FBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQy9DLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQU9NLGNBQWMsQ0FBQyxZQUEyQyxFQUFFLFFBQWtDO1FBQ25HLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRTtZQUNqQyxNQUFNLElBQUksS0FBSyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7U0FDcEU7UUFDRCxJQUFJLFlBQVksS0FBSyxjQUFjLEVBQUU7WUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO1NBQ3RFO1FBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsY0FBYyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzNELElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3pELElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDM0M7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxrQkFBa0IsQ0FBQyxZQUEyQztRQUNuRSxJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3JELElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTtZQUNwQyxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzFDO0lBQ0gsQ0FBQztDQUNGIn0=