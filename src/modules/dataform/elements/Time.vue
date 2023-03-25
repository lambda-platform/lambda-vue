<template>
    <lambda-form-item :label=label :name="model.component" :meta="meta">
        <a-time-picker
            v-model:value="model.form[model.component]"

            :disabled="disabled"
            valueFormat="HH:mm:ss"
        ></a-time-picker>
    </lambda-form-item>
</template>
<script>
import mixin from './_mixin'

export default {
    mixins: [mixin],
}
</script>
