import {localeText} from "./agMN.js";
import {isDesktop, isTablet} from "../../../utils/device";

export const data = () => {
    return {
        showMobileFilter:false,
        isLoading: true,
        identity: "id",
        overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Түр хүлээнэ үү</span>',
        init: false,
        model: null,
        template: 2,
        theme: 'normal',
        gridTheme: 'material',
        isClient: false,
        isPrint: false,
        isNumbered: false,
        printSize: 'A4',
        sideBar: false,
        header: null,
        tableWidth: null,
        fullWidth: false,
        fullText: false,
        editableAction: null,
        editType: null,
        editCellValue: null,
        editRowValue: null,
        postModels: [],
        updateModels: [],
        cellStatus: '',
        singleClickEdit: true,
        flashChanges: false,
        editableShouldSubmit: false,
        defaultColDef: {
            sortable: true,
            resizable: true,
            filter: true,
            floatingFilter: false
        },
        gridOptions: {
            debug: false,
            // floatingFilter: false,
            localeText: localeText,
            suppressMultiSort: true,
            suppressRowClickSelection: true,
            allowContextMenuWithControlKey: true,
            animateRows: false,
            // suppressCellFocus: true,
            groupIncludeFooter: false,
            groupIncludeTotalFooter: false,
            suppressNoRowsOverlay: true,

            // enableCharts: true,
            // enableRangeSelection: true

        },
        info: {
            total: 0,
            totalPage: 0
        },
        query: {
            src: "",
            paginate: 50,
            currentPage:1,
            sort: "",
            order: ""
        },
        gridActions: [],
        hasContextMenu: false,
        actionPosition: 0,
        schema: [],
        formula: [],
        aggregations: {
            columnAggregations: [],
            columnAggregationsFormula: [],
            data: [],
            loading: true,
            forumlaResult: ""
        },
        columns: null,
        data: [],
        filterModel: {},
        searchModel: null,
        isStatic: false,
        //for header filter
        selectionMethod: 'multiple',
        selected: [],
        autoSelect: false,
        autoSelectModel: null,
        deleteModal: false,
        delLoading: false,
        currentRow: {
            rowId: null,
            rowIndex: null
        },
        frameworkComponents: null,
        changedRowsData: [],
        colMenu: false,
        colFilterButton: true,
        showGrid: false,
        saveFilter: false,
        selectInputModels: [],

    }
}




export const tableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{header}{rows}</table></body></html>'
        , base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        }
        , format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            })
        };
    return function (header, rows, name) {

        var ctx = {worksheet: name || 'Worksheet', header: header, rows: rows};

        var a = document.createElement("a");
        a.download = name + ".xls";
        a.href = uri + base64(format(template, ctx));


        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);
    }
})();

// export default {
//     computed: {
//         lang(){
//             const labels = ['delete',
//             ];
//             return labels.reduce((obj, key, i) => {
//                 obj[key] = this.$t('dataGrid.' + labels[i]);
//                 return obj;
//             }, {});
//         },
//     },
// };
