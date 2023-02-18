<template>
    <lambda-form-item  :label=label  :name="model.component" :meta="meta">
        <div>{{ lang.notFound }} - {{meta.formType}}</div>
    </lambda-form-item>
</template>

<script>
import mixin from "./_mixin"
export default {
    mixins:[mixin],
    computed: {
        lang() {
            const labels = ['notFound',
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i]);
                return obj;
            }, {});
        },
    },
    methods: {

    },
};
</script>
