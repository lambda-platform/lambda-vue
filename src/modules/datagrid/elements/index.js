import { defineAsyncComponent, inject } from 'vue'
export const elementList = [
    {
        element: "Text",
         component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-Text" */'./Text.vue')),
    },
    {
        element: "Number",
         component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-Number" */'./Number.vue')),
    },
    {
        element: "Date",
         component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-Date" */'./Date.vue')),
    },
    {
        element: "Image",
         component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-Image" */'./Image.vue')),
    },
    {
        element: "File",
         component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-File" */'./File.vue')),
    },
    {
        element: "Checkbox",
        component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-Checkbox" */'./Check.vue')),
    },
    {
        element: "Custom",
         component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-Custom" */'./Custom.vue')),
    },

    {
        element: "File",
         component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-File" */'./File.vue')),
    },
    {
        element: "Html",
         component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-Html" */'./Html.vue')),
    },
    {
        element: "Input",
         component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-Input" */'./Input.vue')),
    },
    {
        element: "InputNumber",
        component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-InputNumber" */'./Number.vue')),
    },
    {
        element: "Link",
         component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-Link" */'./Link.vue')),
    },
    {
        element: "Radio",
         component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-Radio" */'./Radio.vue')),
    },
    {
        element: "Select",
         component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-Select" */'./Select.vue')),
    },
    {
        element: "Set-Filter",
        component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-Text" */'./SetFilter.vue')),
    },
    {
        element: "Selectable-Input",
         component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-SetFilter" */'./SetFilter.vue')),
    },
    {
        element: "Set-Filter-Date",
         component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-SetFilterDate" */'./SetFilterDate.vue')),
    },
    {
        element: "Set-Filter-Altered",
         component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-SetFilterAltered" */'./SetFilterAltered.vue')),
    },

    {
        element: "SVG",
        component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-Text" */'./Image.vue')),
    },

    {
        element: "Tag",
         component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-Tag" */'./Tag.vue')),
    },
    {
        element: "Textarea",
         component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-Textarea" */'./Textarea.vue')),
    }
]


// export const element = (type) => {
//     if (type !== null) {
//         return require(`./${type}.vue`).default;
//     }
// }


export const element = (type) => {

    if (type !== null && typeof type !== "undefined") {
        try {
            const elIndex = elementList.findIndex(el => el.element == type);
            if (elIndex >= 0) {
                return elementList[elIndex].component;
            }
        } catch (e) {
            const customElementList = inject('customDataGridElementList')
            if(customElementList){
                if(customElementList.length >= 1){
                    const elIndex = customElementList.findIndex(el => el.element === type);
                    if (elIndex >= 0) {
                        return customElementList[elIndex].component
                    }
                }
            }
        }
    }
}
