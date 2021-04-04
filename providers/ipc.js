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
import { isArray, isFunction } from 'util';
import { LegacyProviderAdapter } from './legacy-provider-adapter';
export class IpcProvider extends LegacyProviderAdapter {
    constructor(path, net) {
        super(new LegacyIpcProvider(path, net));
    }
}
class LegacyIpcProvider {
    constructor(path, net) {
        this.path = path;
        this.responseCallbacks = {};
        this.notificationCallbacks = [];
        this.path = path;
        this.connected = false;
        this.connection = net.connect({ path: this.path });
        this.addDefaultEvents();
        // LISTEN FOR CONNECTION RESPONSES
        const callback = function (result) {
            let id = null;
            // get the id which matches the returned id
            if (isArray(result)) {
                result.forEach(load => {
                    if (this.responseCallbacks[load.id]) {
                        id = load.id;
                    }
                });
            }
            else {
                id = result.id;
            }
            // notification
            if (!id && result.method.indexOf('_subscription') !== -1) {
                this.notificationCallbacks.forEach(callback => {
                    if (isFunction(callback)) {
                        callback(result);
                    }
                });
                // fire the callback
            }
            else if (this.responseCallbacks[id]) {
                this.responseCallbacks[id](null, result);
                delete this.responseCallbacks[id];
            }
        };
        this.connection.on('data', data => {
            this._parseResponse(data.toString()).forEach(callback);
        });
    }
    addDefaultEvents() {
        this.connection.on('connect', () => {
            this.connected = true;
        });
        this.connection.on('close', () => {
            this.connected = false;
        });
        this.connection.on('error', () => {
            this._timeout();
        });
        this.connection.on('end', () => {
            this._timeout();
        });
        this.connection.on('timeout', () => {
            this._timeout();
        });
    }
    _parseResponse(data) {
        const returnValues = [];
        // DE-CHUNKER
        const dechunkedData = data
            .replace(/\}[\n\r]?\{/g, '}|--|{') // }{
            .replace(/\}\][\n\r]?\[\{/g, '}]|--|[{') // }][{
            .replace(/\}[\n\r]?\[\{/g, '}|--|[{') // }[{
            .replace(/\}\][\n\r]?\{/g, '}]|--|{') // }]{
            .split('|--|');
        dechunkedData.forEach(data => {
            // prepend the last chunk
            if (this.lastChunk) {
                data = this.lastChunk + data;
            }
            let result = null;
            try {
                result = JSON.parse(data);
            }
            catch (e) {
                this.lastChunk = data;
                // start timeout to cancel all requests
                clearTimeout(this.lastChunkTimeout);
                this.lastChunkTimeout = setTimeout(() => {
                    this._timeout();
                    throw new Error('Timeout');
                }, 1000 * 15);
                return;
            }
            // cancel timeout and set chunk to null
            clearTimeout(this.lastChunkTimeout);
            this.lastChunk = null;
            if (result) {
                returnValues.push(result);
            }
        });
        return returnValues;
    }
    _addResponseCallback(payload, callback) {
        const id = payload.id || payload[0].id;
        const method = payload.method || payload[0].method;
        this.responseCallbacks[id] = callback;
        this.responseCallbacks[id].method = method;
    }
    _timeout() {
        for (const key in this.responseCallbacks) {
            if (this.responseCallbacks.hasOwnProperty(key)) {
                this.responseCallbacks[key](new Error(`CONNECTION ERROR: Couldn't connect to node on IPC.`));
                delete this.responseCallbacks[key];
            }
        }
    }
    reconnect() {
        this.connection.connect({ path: this.path });
    }
    send(payload, callback) {
        // try reconnect, when connection is gone
        if (!this.connection.writable) {
            this.connection.connect({ path: this.path });
        }
        this.connection.write(JSON.stringify(payload));
        this._addResponseCallback(payload, callback);
    }
    on(type, callback) {
        if (typeof callback !== 'function') {
            throw new Error('The second parameter callback must be a function.');
        }
        switch (type) {
            case 'data':
                this.notificationCallbacks.push(callback);
                break;
            // adds error, end, timeout, connect
            default:
                this.connection.on(type, callback);
                break;
        }
    }
    once(type, callback) {
        if (typeof callback !== 'function') {
            throw new Error('The second parameter callback must be a function.');
        }
        this.connection.once(type, callback);
    }
    removeListener(type, callback) {
        switch (type) {
            case 'data':
                this.notificationCallbacks.forEach((cb, index) => {
                    if (cb === callback) {
                        this.notificationCallbacks.splice(index, 1);
                    }
                });
                break;
            default:
                this.connection.removeListener(type, callback);
                break;
        }
    }
    removeAllListeners(type) {
        switch (type) {
            case 'data':
                this.notificationCallbacks = [];
                break;
            default:
                this.connection.removeAllListeners(type);
                break;
        }
    }
    reset() {
        this._timeout();
        this.notificationCallbacks = [];
        this.connection.removeAllListeners('error');
        this.connection.removeAllListeners('end');
        this.connection.removeAllListeners('timeout');
        this.addDefaultEvents();
    }
    disconnect() {
        this.connection.close();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXBjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Byb3ZpZGVycy9pcGMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztFQWVFO0FBRUYsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFM0MsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFbEUsTUFBTSxPQUFPLFdBQVksU0FBUSxxQkFBcUI7SUFDcEQsWUFBWSxJQUFZLEVBQUUsR0FBUTtRQUNoQyxLQUFLLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMxQyxDQUFDO0NBQ0Y7QUFFRCxNQUFNLGlCQUFpQjtJQVFyQixZQUFvQixJQUFZLEVBQUUsR0FBUTtRQUF0QixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQzlCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLHFCQUFxQixHQUFHLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUV2QixJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFFbkQsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFFeEIsa0NBQWtDO1FBQ2xDLE1BQU0sUUFBUSxHQUFHLFVBQVMsTUFBTTtZQUM5QixJQUFJLEVBQUUsR0FBUSxJQUFJLENBQUM7WUFFbkIsMkNBQTJDO1lBQzNDLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNuQixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNwQixJQUFJLElBQUksQ0FBQyxpQkFB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