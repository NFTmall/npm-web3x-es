'use strict';
// Unknown Error
export const UNKNOWN_ERROR = 'UNKNOWN_ERROR';
// Not implemented
export const NOT_IMPLEMENTED = 'NOT_IMPLEMENTED';
// Missing new operator to an object
//  - name: The name of the class
export const MISSING_NEW = 'MISSING_NEW';
// Call exception
//  - transaction: the transaction
//  - address?: the contract address
//  - args?: The arguments passed into the function
//  - method?: The Solidity method signature
//  - errorSignature?: The EIP848 error signature
//  - errorArgs?: The EIP848 error parameters
//  - reason: The reason (only for EIP848 "Error(string)")
export const CALL_EXCEPTION = 'CALL_EXCEPTION';
// Invalid argument (e.g. value is incompatible with type) to a function:
//   - arg: The argument name that was invalid
//   - value: The value of the argument
export const INVALID_ARGUMENT = 'INVALID_ARGUMENT';
// Missing argument to a function:
//   - count: The number of arguments received
//   - expectedCount: The number of arguments expected
export const MISSING_ARGUMENT = 'MISSING_ARGUMENT';
// Too many arguments
//   - count: The number of arguments received
//   - expectedCount: The number of arguments expected
export const UNEXPECTED_ARGUMENT = 'UNEXPECTED_ARGUMENT';
// Numeric Fault
//   - operation: the operation being executed
//   - fault: the reason this faulted
export const NUMERIC_FAULT = 'NUMERIC_FAULT';
// Insufficien funds (< value + gasLimit * gasPrice)
//   - transaction: the transaction attempted
export const INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS';
// Nonce has already been used
//   - transaction: the transaction attempted
export const NONCE_EXPIRED = 'NONCE_EXPIRED';
// The replacement fee for the transaction is too low
//   - transaction: the transaction attempted
export const REPLACEMENT_UNDERPRICED = 'REPLACEMENT_UNDERPRICED';
// Unsupported operation
//   - operation
export const UNSUPPORTED_OPERATION = 'UNSUPPORTED_OPERATION';
let _permanentCensorErrors = false;
let _censorErrors = false;
// @TODO: Enum
export function throwError(message, code = UNKNOWN_ERROR, params = {}) {
    if (_censorErrors) {
        throw new Error('unknown error');
    }
    let messageDetails = [];
    Object.keys(params).forEach(key => {
        try {
            messageDetails.push(key + '=' + JSON.stringify(params[key]));
        }
        catch (error) {
            messageDetails.push(key + '=' + JSON.stringify(params[key].toString()));
        }
    });
    messageDetails.push('version=1');
    let reason = message;
    if (messageDetails.length) {
        message += ' (' + messageDetails.join(', ') + ')';
    }
    // @TODO: Any??
    let error = new Error(message);
    error.reason = reason;
    error.code = code;
    Object.keys(params).forEach(function (key) {
        error[key] = params[key];
    });
    throw error;
}
export function checkNew(self, kind) {
    if (!(self instanceof kind)) {
        throwError('missing new', MISSING_NEW, { name: kind.name });
    }
}
export function checkArgumentCount(count, expectedCount, suffix) {
    if (!suffix) {
        suffix = '';
    }
    if (count < expectedCount) {
        throwError('missing argument' + suffix, MISSING_ARGUMENT, { count: count, expectedCount: expectedCount });
    }
    if (count > expectedCount) {
        throwError('too many arguments' + suffix, UNEXPECTED_ARGUMENT, { count: count, expectedCount: expectedCount });
    }
}
export function setCensorship(censorship, permanent) {
    if (_permanentCensorErrors) {
        throwError('error censorship permanent', UNSUPPORTED_OPERATION, { operation: 'setCersorship' });
    }
    _censorErrors = !!censorship;
    _permanentCensorErrors = !!permanent;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2V0aGVycy9lcnJvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDO0FBRWIsZ0JBQWdCO0FBQ2hCLE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxlQUFlLENBQUM7QUFFN0Msa0JBQWtCO0FBQ2xCLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRyxpQkFBaUIsQ0FBQztBQUVqRCxvQ0FBb0M7QUFDcEMsaUNBQWlDO0FBQ2pDLE1BQU0sQ0FBQyxNQUFNLFdBQVcsR0FBRyxhQUFhLENBQUM7QUFFekMsaUJBQWlCO0FBQ2pCLGtDQUFrQztBQUNsQyxvQ0FBb0M7QUFDcEMsbURBQW1EO0FBQ25ELDRDQUE0QztBQUM1QyxpREFBaUQ7QUFDakQsNkNBQTZDO0FBQzdDLDBEQUEwRDtBQUMxRCxNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUcsZ0JBQWdCLENBQUM7QUFFL0MseUVBQXlFO0FBQ3pFLDhDQUE4QztBQUM5Qyx1Q0FBdUM7QUFDdkMsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsa0JBQWtCLENBQUM7QUFFbkQsa0NBQWtDO0FBQ2xDLDhDQUE4QztBQUM5QyxzREFBc0Q7QUFDdEQsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsa0JBQWtCLENBQUM7QUFFbkQscUJBQXFCO0FBQ3JCLDhDQUE4QztBQUM5QyxzREFBc0Q7QUFDdEQsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQUcscUJBQXFCLENBQUM7QUFFekQsZ0JBQWdCO0FBQ2hCLDhDQUE4QztBQUM5QyxxQ0FBcUM7QUFDckMsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLGVBQWUsQ0FBQztBQUU3QyxvREFBb0Q7QUFDcEQsNkNBQTZDO0FBQzdDLE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHLG9CQUFvQixDQUFDO0FBRXZELDhCQUE4QjtBQUM5Qiw2Q0FBNkM7QUFDN0MsTUFBTSxDQUFDLE1BQU0s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