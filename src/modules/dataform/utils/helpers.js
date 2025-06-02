export const applyDrag = (arr, dragResult) => {
    const {removedIndex, addedIndex, payload} = dragResult
    if (removedIndex === null && addedIndex === null) return arr

    const result = [...arr]
    let itemToAdd = payload

    if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0]
    }

    if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd)
    }

    return result
}
export const generateItems = (count, creator) => {
    const result = []
    for (let i = 0; i < count; i++) {
        result.push(creator(i))
    }
    return result
}

export const getTableMeta = (table) => {
    if (table) {
        if (window.init.dbSchema.tableMeta[table]) {
            return window.init.dbSchema.tableMeta[table]
        }
    }
    return []
    // let res = await axios.get(`/lambda/puzzle/table-schema/${table}`);
    // if(!window.init.dbSchema.tableMeta) {
    //     window.init.dbSchema.tableMeta = {}
    // }
    // window.init.dbSchema.tableMeta[table] = res.data
    // return res.data
}

export const getRelationData = (item, relations) => {
    let tableNameWithoutSchema = getTableName(item.relation.table)

    if (item.relation.filter === '' || typeof item.relation.filter === "undefined") {
        if (relations[item.relation.table])
            return relations[item.relation.table]
        else if (relations[tableNameWithoutSchema])
            return relations[tableNameWithoutSchema]
        else if (item.relation.filterWithUser) {
            if (relations[item.model])
                return relations[item.model]
            else
                return []
        } else
            return []
    } else {
        if (relations[item.model])
            return relations[item.model]
        else if (relations[item.relation.table])
            return relations[item.relation.table]
        else if (relations[tableNameWithoutSchema]) {
            return relations[tableNameWithoutSchema]
        } else {
            return []
        }

    }
}

function getTableName(fullTableName) {
    // Remove any leading/trailing whitespace
    fullTableName = fullTableName.trim();

    // Check if the string contains a dot (.)
    if (fullTableName.includes('.')) {
        // Split the string by dot and get the part after the dot (table name)
        const tableParts = fullTableName.split('.');
        // Return the last part, trimmed of any whitespace
        return tableParts[tableParts.length - 1].trim();
    }

    // If no dot is found, return the original string trimmed
    return fullTableName;
}
