import { useCallback, useSyncExternalStore } from "react";

const URL_CHANGE_EVENT = "mine-server:url-change";

type HistoryMode = "push" | "replace";

const subscribe = (onStoreChange: () => void) => {
    window.addEventListener("popstate", onStoreChange);
    window.addEventListener(URL_CHANGE_EVENT, onStoreChange);

    return () => {
        window.removeEventListener("popstate", onStoreChange);
        window.removeEventListener(URL_CHANGE_EVENT, onStoreChange);
    };
};

const getSnapshot = () => window.location.search;

export const useUrlState = () => {
    const search = useSyncExternalStore(subscribe, getSnapshot, () => "");

    const updateSearchParams = useCallback(
        (
            updater: (params: URLSearchParams) => void,
            historyMode: HistoryMode = "replace",
        ) => {
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);

            updater(params);

            const nextSearch = params.toString();
            const nextUrl = `${url.pathname}${nextSearch ? `?${nextSearch}` : ""}${url.hash}`;

            if (historyMode === "push") {
                window.history.pushState({}, "", nextUrl);
            } else {
                window.history.replaceState({}, "", nextUrl);
            }

            window.dispatchEvent(new Event(URL_CHANGE_EVENT));
        },
        [],
    );

    return {
        searchParams: new URLSearchParams(search),
        updateSearchParams,
    };
};
