import { App } from "vue";

import widget from "./views/widget.vue";

/**
 * Initialize DataForm component
 * @param app vue instance
 */
export function installNotification(app: App<Element>) {


    app.component("notif-widget", widget);


}
