import { App } from "vue";
import Dataform from "./Dataform.vue";
import LambdaFormItem from "./elements/_LambdaFormItem.vue";
import '@ckeditor/ckeditor5-vue';
import '@ckeditor/ckeditor5-build-classic';
import "./bootstrap"
/**
 * Initialize DataForm component
 * @param app vue instance
 */
export function installDataForm(app: App<Element>) {

    app.component("dataform", Dataform);
    app.component("LambdaFormItem", LambdaFormItem);
}
