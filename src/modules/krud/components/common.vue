<template>
    <portal to="header-left">
        <div class="flex">
            <div class="page-title ">
                <div class="float-left">
                    <h1 class="text-gray-700 dark:text-gray-200 text-base m-0 ">{{ title }}</h1>
                    <h2 class="text-gray-400 text-xs m-0">
                        <span v-for="(p, index) in parent" :key="p.index">
                            <span v-if="index >= 1"> / </span>{{ p.title }}
                        </span>
                    </h2>
                </div>
            </div>
            <div class=" ml-3 " v-if="!hideAction && permissions.c">
                <span class="divider"></span>
                <a-button type="primary" @click="addAction" shape="round">
                    <template #icon>
                        <span class="anticon align-top ant-btn-svg-icon" style="vertical-align: top">
                            <inline-svg
                                src="/assets/icons/duotune/general/gen041.svg"
                            />
                        </span>
                    </template>
                    {{ lang._add }}
                </a-button>
            </div>
            <portal-target name="grid-left">
            </portal-target>


        </div>

    </portal>
    <portal to="mobile-page-title">
        <div class="page-title mb-3">
            <div>
                <h1 class="text-gray-700 dark:text-gray-200 text-base m-0 ">{{ title }}</h1>
                <h2 class="text-gray-400 text-xs m-0">
                         <span v-for="(p, index) in parent" :key="p.index">
                            <span v-if="index >= 1"> / </span>{{ p.title }}
                        </span>
                </h2>
            </div>
        </div>
    </portal>
    <portal to="header-mobile" v-if="!hideAction && permissions.c">
        <div class="fixed bottom-14 right-2">
            <a-button type="primary" @click="addAction" shape="circle" size="large">
                <template #icon>
                      <span class="settings-btn ant-btn-svg-icon">
                        <inline-svg
                            src="/assets/icons/duotune/general/gen041.svg"
                        />
                      </span>
                </template>
            </a-button>
        </div>
    </portal>
</template>

<script setup>
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { toRefs, defineProps } from 'vue';

const props = defineProps({
    parent: Object,
    addAction: Function,
    title: String,
    hideAction: Boolean,
    permissions: Object,
    CRUD_ID: [Number, String],
});


const { t } = useI18n();

const labels = ['_add', 'Information_viewing_history', 'excelUpload'];
const lang = computed(() => {
    return labels.reduce((obj, key, i) => {
        obj[key] = t('crud.' + labels[i]);
        return obj;
    }, {});
});
</script>
