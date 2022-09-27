<template>
    <component :is="renderTemplate(property.template)" v-bind="property"/>
</template>
<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
import { useBreakpoints, breakpointsAntDesign } from '@vueuse/core';
// { "xs": 480, "sm": 576, "md": 768, "lg": 992, "xl": 1200, "xxl": 1600 }
const breakpoints = useBreakpoints(breakpointsAntDesign);
export const isMobile = breakpoints.smaller('sm');
const templates = {
    'canvas': defineAsyncComponent(() => import('./templates/canvas.vue')),
    'drawer': defineAsyncComponent(() => import('./templates/drawer.vue')),
    'window': defineAsyncComponent(() => import('./templates/window.vue')),
    'popup': defineAsyncComponent(() => import('./templates/popup.vue')),
    'edit': defineAsyncComponent(() => import('./templates/edit.vue')),
    'create': defineAsyncComponent(() => import('./templates/create.vue')),
}

export default defineComponent({
    props: {
        template: {
            type: String,
            required: false,
            default: 'canvas'
        },
        property: {
            type: Object,
            required: true,
            default: {}
        },

    },
    setup () {
        const renderKrud = (template)=>{
            if (templates.hasOwnProperty(template)) {
                return templates[template]
            } else {
                return templates.canvas
            }
        }
        const renderTemplate = (template) => {
            if(!isMobile.value){
                renderKrud(template)
            } else {
                if(template === 'drawer' || template === 'popup'){
                    return templates.canvas
                } else {
                    renderKrud(template)
                }
            }


        }
        return {
            renderTemplate,
            renderKrud,
        }

    }

})
</script>
