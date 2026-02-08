import { useState } from "react";
import { usePWAUpdate } from "@/app/pwa/usePWAUpdate";
// import { Toast } from "@lytos/design-system";

export const PWAEvents = () => {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [offlineReady, setOfflineReady] = useState(false);

    usePWAUpdate({
        onNeedRefresh: () => setUpdateAvailable(true),
        onOfflineReady: () => setOfflineReady(true),
    });

    return (
        <>
            {updateAvailable && (
                <div>Nueva versión disponible</div>
                // <Toast
                //     message="Nueva versión disponible"
                //     actionLabel="Actualizar"
                //     onAction={() => window.location.reload()}
                // />
            )}
            {offlineReady && (
                <div>App lista para usar sin conexión 🎉</div>
                // <Toast message="App lista para usar sin conexión 🎉" />
            )}
        </>
    );
}
