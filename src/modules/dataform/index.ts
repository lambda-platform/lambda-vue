import { App } from "vue";
import { defineAsyncComponent } from 'vue'

import "./bootstrap"
/**
 * Initialize DataForm component
 * @param app vue instance
 */
export function installDataForm(app: App<Element>) {

    const AsyncDataform = defineAsyncComponent(() => import("./Dataform.vue"));
    const AsyncLambdaFormItem = defineAsyncComponent(() => import("./elements/_LambdaFormItem.vue"));

    app.component("dataform", AsyncDataform);
    app.component("LambdaFormItem", AsyncLambdaFormItem);

}
