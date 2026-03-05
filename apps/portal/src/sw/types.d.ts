interface PeriodicSyncEvent extends ExtendableEvent {
    tag: string;
}

interface ServiceWorkerGlobalScope {
    onperiodicsync: ((this: ServiceWorkerGlobalScope, ev: PeriodicSyncEvent) => unknown) | null;
}

interface ServiceWorkerGlobalScopeEventMap {
    periodicsync: PeriodicSyncEvent;
}

declare const self: ServiceWorkerGlobalScope;