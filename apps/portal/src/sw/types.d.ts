interface PeriodicSyncEvent extends ExtendableEvent {
    tag: string;
}

interface ServiceWorkerGlobalScope {
    onperiodicsync: ((this: ServiceWorkerGlobalScope, ev: PeriodicSyncEvent) => unknown) | null;
}

declare const self: ServiceWorkerGlobalScope;