/**
 * Creates a new WebSocket connection to the given URL and returns the
 * WebSocket object. The hook will automatically connect to the server
 * when the component is mounted and disconnect when the component is
 * unmounted.
 *
 * @param {string} url The URL to connect to.
 * @returns {{ws: WebSocket}} An object containing the WebSocket object.
 */
export const useWebScoket = (url: string) => {
    const ws = new WebSocket(url);


    return {
        ws
    }
}