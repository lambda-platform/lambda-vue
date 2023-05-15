import axios from "axios";

const getOptionsByRelations = async (baseUrl, relationsData, optionUrl)=>{
    if (Object.keys(relationsData).length >= 1) {
       let res = await axios.post(`${baseUrl}/lambda/puzzle/get_options${optionUrl}`, {relations: relationsData})

        Object.keys(res.data).map(relation => {
            let r = {...relationsData[relation], data: res.data[relation]}
            relationsData[relation] = r;

        })
    }
    return relationsData
}

export const  getOptionsData = async (schema, setSchemaByModel, optionUrl) => {
    let relationsData = getSelects(schema, undefined, setSchemaByModel)
    if (window.init) {
        if (window.init.microserviceSettings.length >= 1) {

            let relationData = {}
            for (const microserviceSetting of window.init.microserviceSettings) {
                let relations = getSelects(schema, microserviceSetting.project_id)
                let relationsDataCurrent = await getOptionsByRelations(microserviceSetting.production_url, relations, optionUrl);

                relationData = {...relationData, ...relationsDataCurrent}

            }


            return relationData;
        } else {
            return  await getOptionsByRelations('', relationsData, optionUrl)
        }
    } else {
        return await getOptionsByRelations('', relationsData, optionUrl)
    }



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
