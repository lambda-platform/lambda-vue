import {App, defineAsyncComponent} from "vue";

/**
 * Initialize Krud component
 * @param app vue instance
 */
export function installKrud(app: App<Element>, screenRecordTargets: Array<bigint> = [], screenRecordSavePath: string = "") {

    const AsyncKrud = defineAsyncComponent(() => import("./krud.vue"));

    app.component("krud", AsyncKrud);

    app.provide('screenRecordTargets', screenRecordTargets);
    app.provide('screenRecordSavePath', screenRecordSavePath);
}
