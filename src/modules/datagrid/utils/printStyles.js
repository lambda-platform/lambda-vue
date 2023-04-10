export const getPrintStyles = `

    .no-print {
        display: none
    }
    .A3.landscape {
        width: 420mm;
    }
    .A3, .A4.landscape {
        width: 297mm
    }
    .A4, .A5.landscape {
        width: 210mm
    }
    .A5 {
        width: 148mm !important;
    }
    .print-table {
	 max-width: 100%;
	 width: 100%;
	 border-collapse: collapse;
	 border: 0;
	 border-left: 0;
	 border-right: 0;
	 border-top: 0;
	 margin-top: -1px;
}
 .print-table thead tr {
  background-color: #ffffff;
            border-top: 1px solid #3f3fe7;
            border-bottom: 1px solid #3f3fe7;

            }
 .print-table thead td {
    border-color:#fff !important;
 }
 .print-table tbody {
	 background: #fff;
}
 .print-table tbody td {
    border-color:#fff !important;
 }
 .print-table thead tr td, .print-table tbody tr td {
	 font-size: 10px;
	 color: #545454;
	 text-align: center;
	 vertical-align: middle;

	 padding: 3px 2px;
	 overflow: hidden;
}
 .print-table thead tr td > div, .print-table tbody tr td > div {
	 font-size: 12px;
	 text-align: center;
}
 .print-table tbody {
	 background: #fff;
}
}
.print-table tbody tr:nth-child(odd) {
            background-color: #ffffff;
        }
.print-table tbody tr:nth-child(even) {
            background-color: #f2f2f2 !important;
}
.print-table tbody tr:nth-child(even) td {

            border-color:#f2f2f2 !important;
}
.print-title, .print-table{
    font-family: Arial !important;
}
h2{
   margin-top: 0;
        margin-bottom: 0.5em;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
        font-size: 18px;
    text-align: center;
}
.filter-info {
  list-style: none;
  padding-left: 0;
}

.filter-info li {
  list-style: none;
  display: inline-block;
  padding-right: 10px;
  font-size: 12px;
}

.filter-info .info-label {
  color: #3f3fe7;
}

`;
