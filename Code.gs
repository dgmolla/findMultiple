//This is the Apps Script server code

function onOpen() {
 DocumentApp
   .getUi()
   .createMenu("Find Terms")
   //in the future, iteratively generate x amount of menu items based on playbook
   .addItem("Termination", "showTermsSidebar")
   .addToUi();
}

function getPlaybook() {
  var playbook = {};

  //in the future, generalize spreadsheet identification
  var ss = SpreadsheetApp.openById("1JuBTlyAU77_191oIy8-AQFUTscxgOXYUOwpttAfkPE8");
  SpreadsheetApp.setActiveSpreadsheet(ss);
  var rows = ss.getActiveSheet().getDataRange().getValues();
  Logger.log(rows)

  for(let row of rows) {
    playbook[row[0]] = row[1]
  }

  return playbook
}

function showTermsSidebar() {
 var widget = HtmlService.createHtmlOutputFromFile("TermsSidebar.html").setTitle("Terms Sidebar");
 DocumentApp.getUi().showSidebar(widget);
}

function myFunction() {
  var playbook = getPlaybook();
  var body = DocumentApp.getActiveDocument().getBody();

  const terms = []
  const data = []

  for(let play in playbook) {
    terms.push(play)
  }

  for(let term of terms.sort()) {
    let ind = body.findText(term)
    while(ind){
      let text = ind.getElement().asText().getText().split(". ")[0]
      if (text.length > 5) {
        data.push([term, text, ind]);
      }
      ind = body.findText(term, ind);
    }
    data.push(playbook[term] ? playbook[term] : "none")
  }

  return data

}

function scrollToTerm(i) {
  var doc = DocumentApp.getActiveDocument();
  var rangeBuilder = doc.newRange();
  var data = myFunction();

  rangeBuilder.addElement(data[i][2].getElement());
  var pos = doc.newPosition(data[i][2].getElement(), data[i][2].getStartOffset());
  doc.setCursor(pos);
  doc.setSelection(rangeBuilder.build());
}
