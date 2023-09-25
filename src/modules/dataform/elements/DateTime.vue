<template>
    <lambda-form-item  :label=label  :name="model.component" :meta="meta">
        <a-config-provider

            :locale="locale">
        <a-date-picker
            v-model:value="model.form[model.component]"
            show-time
            :placeholder="placeholder"
            :disabled="disabled"

            :locale="locale"

            ></a-date-picker>
        </a-config-provider>

    </lambda-form-item>
</template>
<script>
import mixin from "./_mixin"
import mn_MN from "../../../antlocale/date_mn_MN";
export default {
    mixins:[mixin],
    data(){
        return {
            locale:mn_MN

        }
    }
};
</script>
