import {App, defineAsyncComponent} from "vue";
/**
 * Initialize DataForm component
 * @param app vue instance
 */
export function installNotification(app: App<Element>) {

    const AsyncWidget = defineAsyncComponent(() => import("./views/widget.vue"));

    app.component("notif-widget", AsyncWidget);


}
