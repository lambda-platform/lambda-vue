<template>
    <lambda-form-item :label="label" :name="model.component" :meta="meta">
        <a-input-number
            type="number"
            v-if="meta.no_format"
            v-model:value="model.form[model.component]"
            :placeholder="placeholder"
            :disabled="disabled"
            :number="true"
        />
        <a-input-number
            v-else
            v-model:value="model.form[model.component]"
            :formatter="value => {
                if (!value) return '';
                // Round to meta.precision (default to 2 if not set)
                const precision = meta.precision ? meta.precision * 1 : 2;
                const roundedValue = Number(value).toFixed(precision);
                const [integer, fractional] = roundedValue.split('.');
                const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                return fractional ? `${formattedInteger}.${fractional}` : formattedInteger;
            }"
            :parser="value => value.replace(/\$\s?|(,*)/g, '')"
            :placeholder="placeholder"
            :disabled="disabled"
        />
    </lambda-form-item>
</template>

<script>
import mixin from "./_mixin";
export default {
    mixins: [mixin],
};
</script>
