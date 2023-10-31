const spreadsheetContainer = document.querySelector('.spreadsheet_container');
const exportButton = document.querySelector('.export_btn');
const ROWS = 10;
const COLUMNS = 10;
const spreadsheet = [];
const alphabets = [
    "A", "B", "C", "D", "E", "F", "G",
    "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R",
    "S", "T", "U", "V", "W", "X", "Y", "Z"
];

class Cell {
    constructor(isHeader, disabled, data, row, column,
        rowName, columnName, active = false) {
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.column = column;
        this.rowName = rowName;
        this.columnName = columnName;
        this.active = active;
    }
}
exportButton.addEventListener('click', () => {
    let csv = "";
    for (let i = 1; i < spreadsheet.length; i++) {
        for (let j = 1; j < spreadsheet[i].length; j++) {
            csv += spreadsheet[i][j].data + ",";
        }
        csv += "\r\n";

    }
    const csvFile = new Blob([csv], { type: "text/csv" });
    console.log(csvFile);

    const csvUrl = URL.createObjectURL(csvFile);
    console.log(csvUrl);
    const a = document.createElement('a');
    a.href = csvUrl;
    a.download = "spreadsheet name.csv";
    a.click();
});
initSpreadsheet();

function initSpreadsheet() {
    for (let i = 0; i < ROWS; i++) {
        let spreadsheetRow = [];
        for (let j = 0; j < COLUMNS; j++) {
            let cellData = '';
            let isHeader = false;
            let disabled = false;

            if (j === 0) {
                isHeader = true;
                disabled = true;
                cellData = i;
            }
            if (i === 0) {
                cellData = alphabets[j - 1];
                isHeader = true;
                disabled = true;
            }

            if (!cellData) {
                cellData = '';
            }
            const rowName = i;
            const columnName = alphabets[j - 1];
            const cell = new Cell(isHeader, disabled, cellData,
                i, j, rowName, columnName);
            spreadsheetRow.push(cell);
        }
        spreadsheet.push(spreadsheetRow);
    }
    drawSheet();
}

function createCellEle(cell){
    const cellEle = document.createElement('input');
    cellEle.className = 'cell';
    cellEle.id="cell_"+cell.row +cell.column;
    cellEle.value = cell.data;
    cellEle.disabled = cell.disabled;

    if(cell.isHeader){
    cellEle.classList.add('header');
    }
    cellEle.onclick = () => handleCellClick(cell);
    cellEle.onchange = (e) => handleOnChange(e.target.value, cell);
    return cellEle;
}

function handleOnChange(data, cell){
    cell.data = data;
}

function handleCellClick(cell){
    clearHeaderActiveStates();
    const columnHeader = spreadsheet[0][cell.column];
    const rowHeader = spreadsheet[cell.row][0];
    const columnHeaderEle = getEleFromRowColumn(columnHeader.row, columnHeader.column);
    const rowHeaderEle = getEleFromRowColumn(rowHeader.row, rowHeader.column);
    columnHeaderEle.classList.add('active');
    rowHeaderEle.classList.add('active');
    document.querySelector('#current_cell').innerHTML = cell.columnName+cell.rowName;

}

function clearHeaderActiveStates(){
    const headers = document.querySelectorAll('.header');

    headers.forEach((header) => {
        header.classList.remove('active');
})
}
function getEleFromRowColumn(row, column){
    return document.querySelector('#cell_'+row+column);
}
function drawSheet() {
    for(let i=0; i<spreadsheet.length; i++) {
    const rowContainerEle = document.createElement('div');
    rowContainerEle.className = 'cell_row';
    for(let j =0; j<spreadsheet[i].length; j++) {
    const cell = spreadsheet[i][j];
    rowContainerEle.append(createCellEle(cell));
    }
    spreadsheetContainer.append(rowContainerEle);
    }
}


