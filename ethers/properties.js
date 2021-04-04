'use strict';
import * as errors from './errors';
export function defineReadOnly(object, name, value) {
    Object.defineProperty(object, name, {
        enumerable: true,
        value: value,
        writable: false,
    });
}
// There are some issues with instanceof with npm link, so we use this
// to ensure types are what we expect.
export function setType(object, type) {
    Object.defineProperty(object, '_ethersType', { configurable: false, value: type, writable: false });
}
export function isType(object, type) {
    return object && object._ethersType === type;
}
export function resolveProperties(object) {
    let result = {};
    let promises = [];
    Object.keys(object).forEach(key => {
        let value = object[key];
        if (value instanceof Promise) {
            promises.push(value.then(value => {
                result[key] = value;
            }));
        }
        else {
            result[key] = value;
        }
    });
    return Promise.all(promises).then(() => {
        return result;
    });
}
export function checkProperties(object, properties) {
    if (!object || typeof object !== 'object') {
        return errors.throwError('invalid object', errors.INVALID_ARGUMENT, {
            argument: 'object',
            value: object,
        });
    }
    Object.keys(object).forEach(key => {
        if (!properties[key]) {
            return errors.throwError('invalid object key - ' + key, errors.INVALID_ARGUMENT, {
                argument: 'transaction',
                value: object,
                key: key,
            });
        }
    });
}
export function shallowCopy(object) {
    let result = {};
    for (var key in object) {
        result[key] = object[key];
    }
    return result;
}
let opaque = { boolean: true, number: true, string: true };
export function deepCopy(object, frozen) {
    // Opaque objects are not mutable, so safe to copy by assignment
    if (object === undefined || object === null || opaque[typeof object]) {
        return object;
    }
    // Arrays are mutable, so we need to create a copy
    if (Array.isArray(object)) {
        let result = object.map(item => deepCopy(item, frozen));
        if (frozen) {
            Object.freeze(result);
        }
        return result;
    }
    if (typeof object === 'object') {
        // Some internal objects, which are already immutable
        if (isType(object, 'BigNumber')) {
            return object;
        }
        if (isType(object, 'Description')) {
            return object;
        }
        if (isType(object, 'Indexed')) {
            return object;
        }
        let result = {};
        for (let key in object) {
            let value = object[key];
            if (value === undefined) {
                continue;
            }
            defineReadOnly(result, key, deepCopy(value, frozen));
        }
        if (frozen) {
            Object.freeze(result);
        }
        return result;
    }
    // The function type is also immutable, so safe to copy by assignment
    if (typeof object === 'function') {
        return object;
    }
    throw new Error('Cannot deepCopy ' + typeof object);
}
// See: https://github.com/isaacs/inherits/blob/master/inherits_browser.js
function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true,
        },
    });
}
export function inheritable(parent) {
    return function (child) {
        inherits(child, parent);
        defineReadOnly(child, 'inherits', inheritable(child));
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ldGhlcnMvcHJvcGVydGllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFFYixPQUFPLEtBQUssTUFBTSxNQUFNLFVBQVUsQ0FBQztBQUVuQyxNQUFNLFVBQVUsY0FBYyxDQUFDLE1BQVcsRUFBRSxJQUFZLEVBQUUsS0FBVTtJQUNsRSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUU7UUFDbEMsVUFBVSxFQUFFLElBQUk7UUFDaEIsS0FBSyxFQUFFLEtBQUs7UUFDWixRQUFRLEVBQUUsS0FBSztLQUNoQixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsc0VBQXNFO0FBQ3RFLHNDQUFzQztBQUV0QyxNQUFNLFVBQVUsT0FBTyxDQUFDLE1BQVcsRUFBRSxJQUFZO0lBQy9DLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLGFBQWEsRUFBRSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUN0RyxDQUFDO0FBRUQsTUFBTSxVQUFVLE1BQU0sQ0FBQyxNQUFXLEVBQUUsSUFBWTtJQUM5QyxPQUFPLE1BQU0sSUFBSSxNQUFNLENBQUMsV0FBVyxLQUFLLElBQUksQ0FBQztBQUMvQyxDQUFDO0FBRUQsTUFBTSxVQUFVLGlCQUFpQixDQUFDLE1BQVc7SUFDM0MsSUFBSSxNQUFNLEdBQVEsRUFBRSxDQUFDO0lBRXJCLElBQUksUUFBUSxHQUF5QixFQUFFLENBQUM7SUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDaEMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLElBQUksS0FBSyxZQUFZLE9BQU8sRUFBRTtZQUM1QixR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