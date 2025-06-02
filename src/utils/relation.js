import axios from "axios";

const getOptionsByRelations = async (baseUrl, schemaID, optionUrl, isGrid)=>{
    let res = await axios.post(`${baseUrl}/lambda/krud${optionUrl}/${schemaID}/${isGrid ? 'filter-': ''}options`, {})
    return res.data;
}

export const  getOptionsData = async (schemaID, optionUrl, isGrid, schema) => {

    if (window.init) {
        if(window.init.microserviceSettings) {
            if (window.init.microserviceSettings.length >= 1) {
                let relationData = {}
                for (const microserviceSetting of window.init.microserviceSettings) {
                    let relations = getSelects(schema, microserviceSetting.project_id);
                    if (Object.keys(relations).length >= 1) {
                        let relationsDataCurrent = await getOptionsByRelations(microserviceSetting.production_url, schemaID, optionUrl, isGrid);
                        relationData = {...relationData, ...relationsDataCurrent}
                    }
                }

                return relationData;
            }else {
                return  await getOptionsByRelations('', schemaID, optionUrl,isGrid)
            }

        } else {
            return  await getOptionsByRelations('', schemaID, optionUrl,isGrid)
        }
    } else {
        return await getOptionsByRelations('', schemaID, optionUrl,isGrid)
    }



}
const getSelects = (schema, microserviceID) =>{
    let selects = {}

    schema.forEach(item => {
        if (item.formType === 'Radio' || item.formType === 'Select' || item.formType === 'ISelect' || item.formType === 'TreeSelect' || item.formType === 'FooterButton') {
            if (item.relation.table) {

                if (item.relation.filter === '' || typeof item.relation.filter === 'undefined') {
                    if (typeof selects[item.relation.table] === 'undefined') {


                        if (microserviceID !== undefined) {
                            if (item.relation.microservice_id == microserviceID) {
                                selects = getSelectItem(item, selects)
                            }
                        } else {
                            selects = getSelectItem(item, selects)
                        }

                    }
                } else {
                    if (typeof selects[item.model] === 'undefined') {


                        if (microserviceID !== undefined) {
                            if (item.relation.microservice_id == microserviceID) {
                                selects = getSelectItem(item, selects)
                            }
                        } else {
                            selects = getSelectItem(item, selects)
                        }

                    }
                }
            }
        }

        if (item.formType === 'AdminMenu') {
            if (item.relation.table)
                selects[item.relation.table] = item.relation
        }

        if (item.formType === 'SubForm') {

            if (item.schema) {
                let pre_selects = getSelects(item.schema, microserviceID)
                if (pre_selects) {
                    selects = {...selects, ...pre_selects}
                }
            }

        }
    })

    return selects
}
const getSelectItem = (item, selects, setSchemaByModel) =>{

    if (item.relation.filterWithUser) {
        if (!!item.relation.filterWithUser && item.relation.filterWithUser.constructor === Array) {
            let userConditions = ''
            item.relation.filterWithUser.forEach(userFilter => {

                let condition = `${userFilter['tableField']} = '${window.init.user[userFilter['userField']]}'`

                if (userConditions == '') {
                    userConditions = condition
                } else {
                    userConditions = userConditions + ' AND ' + condition
                }
            })

            if (item.relation.filter === '' || typeof item.relation.filter === 'undefined') {
                item.relation.filter = userConditions

                if(setSchemaByModel !== undefined){
                    setSchemaByModel(item.model, 'relation', item.relation)
                }



            } else {
                item.relation.filter = `(${item.relation.filter}) AND (${userConditions})`
            }
        } else {
            let condition = `${item.relation.filterWithUser['tableField']} = '${window.init.user[item.relation.filterWithUser['userField']]}'`
            if (item.relation.filter === '' || typeof item.relation.filter === 'undefined') {
                item.relation.filter = condition
            } else {
                item.relation.filter = item.relation.filter + ' AND ' + condition
            }
        }


        item.relation.filterWithUser = undefined


    }

    if (item.relation.filter === '' || typeof item.relation.filter === 'undefined') {

        selects[item.relation.table] = item.relation

    } else {

        selects[item.model] = item.relation
    }
    return selects
}
