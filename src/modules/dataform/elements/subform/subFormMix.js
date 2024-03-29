import {notification} from "ant-design-vue";

export default {

    data() {
        return {
            preSource: [],
            modal_grid_show: false,
            user_condition: null,
            custom_condition: null,
            sourceGridParentBasedCondition: null,
        };
    },
    mounted() {
        if (this.form.sourceGridUserCondition !== undefined && this.form.sourceGridUserCondition !== null && this.form.sourceGridUserCondition != "") {
            this.user_condition = JSON.parse(this.form.sourceGridUserCondition)
        }
        if (this.form.sourceGridParentBasedCondition !== undefined && this.form.sourceGridParentBasedCondition !== null && this.form.sourceGridParentBasedCondition != "") {
            this.sourceGridParentBasedCondition = JSON.parse(this.form.sourceGridParentBasedCondition)
        }
    },
    methods: {
        showAddSourceModal() {

            if (this.sourceGridParentBasedCondition) {
                this.custom_condition = {}
                let errorFound = false;
                this.sourceGridParentBasedCondition.forEach(parentCondition => {

                    if (parentCondition.hasOwnProperty("parent_sub") && parentCondition.hasOwnProperty("sub_filed") && parentCondition.hasOwnProperty("grid_field")) {



                        if(this.model.form[parentCondition.parent_sub] && this.model.form[parentCondition.parent_sub].length >= 1){
                           let parentValues = this.model.form[parentCondition.parent_sub].map(sub=>sub[parentCondition.sub_filed]);

                           if (parentValues && parentValues.length >= 1){

                               this.custom_condition[parentCondition.grid_field] = parentValues;


                           } else {
                               errorFound = true;

                               notification["error"]({
                                   message:this.lang.informationIsIncomplete,
                                   description:  parentCondition.message,
                               });
                           }
                        } else {
                            errorFound = true;

                            notification["error"]({
                                message:this.lang.informationIsIncomplete,
                                description:  parentCondition.message,
                            });
                        }


                    } else if(parentCondition.hasOwnProperty("parent_field") && parentCondition.hasOwnProperty("grid_field")) {
                        if (this.model.form[parentCondition.parent_field] !== undefined && this.model.form[parentCondition.parent_field] !== null) {
                            this.custom_condition[parentCondition.grid_field] = this.model.form[parentCondition.parent_field];
                        } else {
                            errorFound = true;

                            notification["error"]({
                                message:this.lang.informationIsIncomplete,
                                description:  parentCondition.message,
                            });
                        }
                    }

                });
                if (!errorFound) {
                    this.showAddSourceModalReal();
                }
            } else {
                this.showAddSourceModalReal();
            }


        },
        showAddSourceModalReal() {
            this.modal_grid_show = true;
            // this.$modal.show(`grid-modal-${this.form.sourceGridID}`);
        },
        closeSourceModal() {
            this.modal_grid_show = false;
            // this.$modal.hide(`grid-modal-${this.form.sourceGridID}`);
        },
        addFromPreSource() {
            if (this.preSource && this.form.sourceGridTargetColumns) {
                this.preSource.forEach(preSource => {
                    this.createDataFromSource(preSource)
                })
            }
            this.closeSourceModal();
        },
        createDataFromSource(row) {


            let clonedForm = _.cloneDeep(this.form);


            let clonedFormModel = {

            };



            clonedForm.schema.forEach(item => {
                if (clonedForm.identity !== item.model && item.formType !== null && item.model !== "created_at" && item.model !== "updated_at") {
                   if(item.default !== null){
                       clonedFormModel[item.model] = item.default;
                   }
                }
            });

            this.form.sourceGridTargetColumns.forEach(source => {

                clonedFormModel[source.selfColumn] = row[source.sourceColumn];
            });

            let listItem = {
                form: clonedForm,
                model: clonedFormModel
            };


            if (this.model.form[this.model.component] == undefined) {
                this.model.form[this.model.component] = [];
            }
            if (this.form.sourceUniqueField !== "" && this.form.sourceUniqueField !== undefined && this.form.sourceUniqueField !== null) {

                let savedIndex = this.model.form[this.model.component].findIndex(row => row[this.form.sourceUniqueField] === clonedFormModel[this.form.sourceUniqueField]);

                if (savedIndex !== -1) {
                    return
                }
            }

            this.model.form[this.model.component].push(clonedFormModel);
            this.listData.push(listItem);
            this.rowLength = this.model.form[this.model.component].length;

        },
        onRowSelect(rows) {
            this.preSource = rows;
        },
        sourceGridUrl() {

            if(window.init){
                if (window.init.microserviceSettings) {

                    let si = window.init.microserviceSettings.findIndex(set => set.project_id === this.form.sourceMicroserviceID)

                    if (si >= 0) {
                        return window.init.microserviceSettings[si].production_url
                    } else {
                        return this.url;
                    }
                } else {
                    return this.url;
                }
            } else {
                return this.url;
            }
        },

    }
}
