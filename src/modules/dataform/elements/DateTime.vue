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
import en_EN from "../../../antlocale/date_en_EN";
export default {
    mixins:[mixin],

    computed:{
        withTimeZone(){
            return window.withTimezone ? true : false;
        },
        locale(){
            if(this.$i18n.locale === "mn_MN"){
                return mn_MN
            } else {
                return en_EN
            }

        }
    },
    methods:{

    },
};
</script>
