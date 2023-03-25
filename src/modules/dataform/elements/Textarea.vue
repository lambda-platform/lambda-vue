<template>
    <lambda-form-item  :label=label  :name="model.component" :meta="meta">
        <a-textarea v-model:value="model.form[model.component]"
                    :disabled="disabled"
        />
    </lambda-form-item>
</template>
<script>
import mixin from "./_mixin"
export default {
    mixins:[mixin],
};
</script>
