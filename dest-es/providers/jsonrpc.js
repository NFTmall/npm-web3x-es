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
const JsonRpc = {
    messageId: 0,
};
const validateSingleMessage = message => !!message &&
    !message.error &&
    message.jsonrpc === '2.0' &&
    (typeof message.id === 'number' || typeof message.id === 'string') &&
    message.result !== undefined;
/**
 * Should be called to valid json create payload object
 */
export function createJsonRpcPayload(method, params) {
    JsonRpc.messageId++;
    return {
        jsonrpc: '2.0',
        id: JsonRpc.messageId,
        method,
        params: params || [],
    };
}
/**
 * Should be called to check if jsonrpc response is valid
 */
export function isValidJsonRpcResponse(response) {
    return Array.isArray(response) ? response.every(validateSingleMessage) : validateSingleMessage(response);
}
/**
 * Should be called to create batch payload object
 */
export function createJsonRpcBatchPayload(messages) {
    return messages.map(message => createJsonRpcPayload(message.method, message.params));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbnJwYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm92aWRlcnMvanNvbnJwYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0VBZUU7QUFFRixNQUFNLE9BQU8sR0FBRztJQUNkLFNBQVMsRUFBRSxDQUFDO0NBQ2IsQ0FBQztBQUVGLE1BQU0scUJBQXFCLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FDdEMsQ0FBQyxDQUFDLE9BQU87SUFDVCxDQUFDLE9BQU8sQ0FBQyxLQUFLO0lBQ2QsT0FBTyxDQUFDLE9BQU8sS0FBSyxLQUFLO0lBQ3pCLENBQUMsT0FBTyxPQUFPLENBQUMsRUFBRSxLQUFLLFFBQVEsSUFBSSxPQUFPLE9BQU8sQ0FBQyxFQUFFLEtBQUssUUFBUSxDQUFDO0lBQ2xFLE9BQU8sQ0FBQyxNQUFNLEtBQUssU0FBUyxDQUFDO0FBb0IvQjs7R0FFRztBQUNILE1BQU0sVUFBVSxvQkFBb0IsQ0FBQyxNQUFjLEVBQUUsTUFBYztJQUNqRSxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7SUFFcEIsT0FBTztRQUNMLE9BQU8sRUFBRSxLQUFLO1FBQ2QsRUFBRSxFQUFFLE9BQU8sQ0FBQyxTQUFTO1FBQ3JCLE1BQU07UUFDTixNQUFNLEVBQUUsTUFBTSxJQUFJLEVBQUU7S0FDckIsQ0FBQztBQUNKLENBQUM7QUFFRDs7R0FFRztBQUNILE1BQU0sVUFBVSxzQkFBc0IsQ0FBQyxRQUFhO0lBQ2xELE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMzRyxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLFVBQVUseUJBQXlCLENBQUMsUUFBOEM7SUFDdEYsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN2RixDQUFDIn0=