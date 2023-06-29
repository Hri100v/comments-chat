import { useCallback, useEffect, useState } from "react";

export function useAsync(func, dependencies = []) {
    const { execute, ...state } = useAsyncInternal(func, dependencies, true);

    useEffect(() => {
        execute();
    }, [execute]);

    return { execute, ...state };
}

export function useAsyncFn(func, dependencies = []) {
    return useAsyncInternal(func, dependencies, false);
}

function useAsyncInternal(func, dependencies, internalloading = false) {
    const [loading, setLoading] = useState(internalloading);
    const [error, setError] = useState();
    const [value, setValue] = useState();

    const execute = useCallback((...params) => {
        setLoading(true);
        return func(...params).then(data => {
            setValue(data);
            setError(undefined);
            return data;
        }).catch(error => {
            setValue(undefined);
            setError(error);
            return Promise.reject(error);
        }).finally(() => {
            setLoading(false);
        });
    }, dependencies);

    return { loading, error, value, execute };
}