export function useHandleCache() {
    function get(): string | null {
        return localStorage.getItem("handle-cache") || null
    }

    function set(handle: string | null) {
        if (!handle)
            localStorage.removeItem("handle-cache")

        localStorage.setItem("handle-cache", handle!)
    }

    return {
        get,
        set,
    }
}
