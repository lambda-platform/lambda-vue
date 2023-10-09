<template>
    <lambda-form-item  :label=label  :name="model.component" :meta="meta">

        <a-date-picker
            v-model:value="model.form[model.component]"
            show-time
            :placeholder="placeholder"
            :disabled="disabled"
            v-if="!withTimeZone"
            :locale="locale"
            value-format="YYYY-MM-DDTHH:mm:ss[Z]"
            ></a-date-picker>

        <a-date-picker
            v-model:value="model.form[model.component]"
            show-time
            :placeholder="placeholder"
            :disabled="disabled"
            v-if="withTimeZone"
            :locale="locale"

        ></a-date-picker>

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
    },
    computed:{
        withTimeZone(){
            return window.withTimezone ? true : false;
        }
    },
    methods:{

    },
};
</script>
