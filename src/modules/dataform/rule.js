let ruleModel = null;
let identityColumn = null;
let identity = null;

import axios from "axios"
const isValid = (val) => {
    if (typeof val !== undefined && val != null && val != "") {
        return true;
    }
    return false;
}

export const setModel = (model) => {
    ruleModel = model;
}

export const setIdentity = (column, value) => {
    identity = value;
    identityColumn = column;
}

export const rules = [{
    type: 'required',
    msg: 'Талбарыг бөглөнө үү!'
},
    {
        type: 'email',
        msg: 'Имэйл хаягаа зөв оруулна уу!'
    },
    {
        type: 'number',
        msg: 'Тоон утга оруулна уу!'
    },
    {
        type: 'mongolianMobileNumber',
        msg: '8 оронтой утасны дугаар оруулна уу!'
    },
    {
        type: 'englishAlphabet',
        msg: 'Зөвхөн латин үсэг оруулна уу!'
    },
    {
        type: 'mongolianCyrillic',
        msg: 'Зөвхөн кирилл үсэг оруулна уу!'
    },
    {
        type: 'unique',
        msg: 'Давхацсан утга оруулсан байна!'
    },
    {
        type: 'lambda-account',
        msg: 'Давхацсан утга оруулсан байна!'
    }
];

const unique = async (rule, value, baseUrl) => {

    try {
        const r = await axios.post(`${baseUrl}/lambda/krud/unique`, {
            table: ruleModel,
            identityColumn: identityColumn,
            identity: identity,
            field: rule.field,
            val: value
        });
        if (r.data.status) {
            return Promise.resolve();
        } else {

            return Promise.reject(r.data.msg);
        }
    } catch (err) {
        return Promise.reject(err.response.data.msg);
    }

};
const checkLambdaaccount = async (rule, value, baseUrl) => {
    try {
        const r = await axios.post(`${baseUrl}/lambda/check`, {
            value: value
        });
        if (r.data.status) {
            return Promise.resolve();
        } else {

            return Promise.reject(`'${value} Давхацсан утга оруулсан байна!'`);
        }
    } catch (err) {
        return Promise.reject(`'${value} Давхацсан утга оруулсан байна!'`);
    }

};
const englishAlphabet = async (rule, value, callback) => {
    var letterNumber = /^[a-zA-Z0-9!@#\$%\^\&*\s*)\(+=._,-]+$/;
    if(value.match(letterNumber)){
        return Promise.resolve();
    } else {
        return Promise.reject("Зөвхөн латин үсэг оруулна уу");
    }
};
const mongolianCyrillic = (rule, value, callback) => {
    // var letterNumber = /^[\u0400-\u04FF\s*]+$/;
    var letterNumber = /^[а-яөүёА-ЯӨҮЁ0-9!@#\$%\^\&*\s*)\(+=.,_-]+$/;
    if(value.match(letterNumber)){
        return  Promise.resolve();
    } else {
        return Promise.reject("Зөвхөн кирилл үсэг оруулна уу!");
    }
};
const mongolianMobileNumber = (rule, value, callback) => {

    var letterNumber = /^[0-9]{8}$/;
    if(value.toString().match(letterNumber)){

        return   Promise.resolve();
    } else {

        return Promise.reject('8 оронтой утасны дугаар оруулна уу!');
    }
};

const check_current_password = async (rule, value, baseUrl) => {
    try {
        const r = await axios.post(`${baseUrl}/lambda/krud/check_current_password`, {
            password: value
        });
        if (r.data.status) {
            return Promise.resolve();
        } else {

            return Promise.reject(r.data.msg);
        }
    } catch (err) {
        return Promise.reject(err.response.data.msg);
    }


};
const RegexParser =  (input)=> {

    // Validate input
    if (typeof input !== "string") {
        throw new Error("Invalid input. Input must be a string");
    }

    // Parse input
    var m = input.match(/(\/?)(.+)\1([a-z]*)/i);

    // Invalid flags
    if (m[3] && !/^(?!.*?(.).*?\1)[gmixXsuUAJ]+$/.test(m[3])) {
        return RegExp(input);
    }

    // Create the regular expression
    return new RegExp(m[2], m[3]);
};


const customRegexChecker = async (rule, value, regex) => {
    if(value.toString().match(RegexParser(regex))){
        return Promise.resolve();
    } else {
        return Promise.reject(rule.msg);
    }
};
export const getRule = (rule, baseUrl) => {
    if(!baseUrl){
        baseUrl = ""
    }
    switch (rule.type) {
        case 'custom':
            return {
                validator: async (r, value)=> await customRegexChecker(r, value, rule.regex),
                trigger: 'blur',
                message: rule.msg
            }
        case 'required':
            return {
                required: true,
                message: rule.msg
            }
        case 'array':
            return {
                type: "array",
                required: rule.required,
                message: rule.message
            }
        case 'min':
            return {
                type: 'string',
                min: parseInt(rule.val, 10),
                message: rule.msg
            }
        case 'max':
            return {
                type: 'string',
                max: parseInt(rule.val, 10),
                message: rule.msg
            }
        case 'email':
            return {
                type: 'email',
                trigger: 'blur',
                message: rule.msg
            }
        case 'number':
            return {
                type: 'number',
                message: rule.msg
            }
        case 'mongolianMobileNumber':
            return {
                validator: mongolianMobileNumber,
                trigger: 'blur',
                // message: rule.msg
            }
        case 'unique':
            return {
                validator: async (rule, value)=> await unique(rule, value, baseUrl),
                trigger: 'blur',
                // message: rule.msg
            }
        case 'lambda-account':
            return {
                validator: async (rule, value)=> await checkLambdaaccount(rule, value, baseUrl),
                trigger: 'blur',
                // message: rule.msg
            }
        case 'englishAlphabet':
            return {
                validator: englishAlphabet,
                trigger: 'blur',
                message: rule.msg
            }
        case 'mongolianCyrillic':
            return {
                validator: mongolianCyrillic,
                trigger: 'blur',
                // message: rule.msg
            }
        case 'check_current_password':
            return {
                validator: async (rule, value)=> await check_current_password(rule, value, baseUrl),
                trigger: 'blur',
                // message: rule.msg
            }
        default:
            return null;

    }
}
