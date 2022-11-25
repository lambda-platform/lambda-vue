<template>
    <lambda-form-item  :label=label  :name="model.component" :meta="meta">
        <a-range-picker
            v-model:value="model.form[model.component]"

            :disabled="disabled"
            style="width: 100%"
            valueFormat="YYYY-MM-DD"
        ></a-range-picker>
    </lambda-form-item>
</template>
<script>
import mixin from "./_mixin"
export default {
    mixins:[mixin],
};
</script>
