import { QueryCache, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { useSnackbar } from '@stores/useSnackbar';
import '@/i18n/i18n';
import './index.css';
import App from '@pages/App';
import UI from '@/ui';

const persister = createAsyncStoragePersister({
    storage: {
        getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
        setItem: (key, value) => Promise.resolve(window.localStorage.setItem(key, value)),
        removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
    },
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: true,
            throwOnError: false,
        },
    },
    queryCache: new QueryCache({
        onError: (error) => {
            useSnackbar.getState().add({
                id: crypto.randomUUID(),
                message: error.message || "Request failed",
                type: "error",
                duration: 5000,
                closeable: true
            });
        },
    }),
});
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}
        >
            <Suspense fallback={<UI.Loading size={'lg'} fullScreen/>}>
                <App />
            </Suspense>
        </PersistQueryClientProvider>
    </StrictMode>
);