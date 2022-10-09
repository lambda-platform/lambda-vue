<template>
    <div>
        <lambda-form-item  :label=label  :name="model.component" :meta="meta">
            <a-input v-model:value="model.form[model.component]"
                     :placeholder="placeholder"
                     :disabled="disabled"
            />
        </lambda-form-item>
    </div>
</template>
<script>
import mixin from "./_mixin"
export default {
    mixins:[mixin]
};
</script>
