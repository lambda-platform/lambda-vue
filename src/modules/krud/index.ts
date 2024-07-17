import {App, defineAsyncComponent} from "vue";

/**
 * Initialize Krud component
 * @param app vue instance
 */
export function installKrud(app: App<Element>) {

    const AsyncKrud = defineAsyncComponent(() => import("./krud.vue"));

    app.component("krud", AsyncKrud);
}
