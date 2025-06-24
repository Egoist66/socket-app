export const useWebScoket = (url: string) => {
    const ws = new WebSocket(url);


    return {
        ws
    }
}