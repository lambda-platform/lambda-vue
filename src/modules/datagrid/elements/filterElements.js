import { defineAsyncComponent, inject } from 'vue'
export const elementList = [
    {
        element: "Text",
         component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-Text" */'./Text.vue')),
    },
    {
        element: "Textarea",
         component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-Text" */'./Textarea.vue')),
    },
    {
        element: "Number",
         component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-Number" */'./FilterNumber.vue')),
    },
    {
        element: "Date",
         component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-Date" */'./Date.vue')),
    },
    {
        element: "DateRange",
         component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-Date" */'./DateRange.vue')),
    },

    {
        element: "Select",
         component: defineAsyncComponent(() => import(/* webpackChunkName: "grid-Select" */'./Select.vue')),
    },

]


// export const element = (type) => {
//     if (type !== null) {
//         return require(`./${type}.vue`).default;
//     }
// }


export const element = (type, customDataGridElementList) => {

    if (type !== null && typeof type !== "undefined") {
        const elIndex = elementList.findIndex(el => el.element === type);

        if (elIndex >= 0) {
            return elementList[elIndex].component;
        } else  {
            if(customDataGridElementList){
                if(customDataGridElementList.length >= 1){
                    const elIndex = customDataGridElementList.findIndex(el => el.element === type);

                    if (elIndex >= 0) {
                        return customDataGridElementList[elIndex].component;
                    }
                }
            }
            return elementList[0].component;
        }
    }
}
