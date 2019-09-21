// Add UI menus to document when it is opened
function onOpen(e) {
  
  SpreadsheetApp.getUi().createAddonMenu()
  .addItem("Create Show", "createShowSidebar").addSeparator()
  .addItem("Add Cast and Crew", "createCastCrewSidebar")
  .addItem("Add Roles and Positions", "addRolePosSidebar")
  .addItem("Update Contact Information", "updateAllContactInfo").addSeparator()
  .addItem("Send Email", "createEmailSidebar")
  .addItem("T-Shirt Size Count", "countSizes")
  .addItem("Phone Numbers", "phoneList").addToUi();
  
}


// Set up the UI when add-on is installed
function onInstall(e){
  
  onOpen(e);
  
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Show "Create Show" sidebar
function createShowSidebar() {
  
  var ui = HtmlService.createHtmlOutputFromFile("createshow").setTitle("Create Show");
  SpreadsheetApp.getUi().showSidebar(ui);
  
}

// Show "Add Cast and Crew" sidebar
function createCastCrewSidebar() {
  
  var ui = HtmlService.createHtmlOutputFromFile("addcastcrew").setTitle("Add Cast and Crew");
  SpreadsheetApp.getUi().showSidebar(ui);
  
}

// Show "Add Roles or Positions" sidebar
function addRolePosSidebar() {
  
  var ui = HtmlService.createHtmlOutputFromFile("addrolepos").setTitle("Add Roles or Positions");
  SpreadsheetApp.getUi().showSidebar(ui);
  
}

// Show "Send Email" sidebar
function createEmailSidebar() {
  
  var ui = HtmlService.createHtmlOutputFromFile("sendemail").setTitle("Send Email");
  SpreadsheetApp.getUi().showSidebar(ui);
  
}

/*
function createRemoveStuSidebar() {
 
  var ui = HtmlService.createHtmlOutputFromFile("removestudents").setTitle("Remove Students");
  SpreadsheetApp.getUi().showSidebar(ui);
  
}
*/



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Format the spreadsheet to fit set standard for shows
function createShow(showData) {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetNames = ["Cast Info", "Crew Info", "Cast List", "Crew List", "Cast Points", "Crew Points"];
  var sheets = ss.getSheets();
  
  // Select a mandatory temporary sheet that will not be cleared immediately
  var tempSheet = sheets[0];
  ss.setActiveSheet(ogSheet);
  ss.renameActiveSheet("tmp");
  
  // Remove previous data in spreadsheet
  for (var i = 1; i < sheets.length; i++) {
    ss.deleteSheet(sheets[i]);
  }
  
  // Add in the template sheets
  ss.rename(showData.name + " Cast and Crew");
  Logger.log(sheetNames);
  
  for (var k = 0; k < sheetNames.length; k++) {
    Logger.log(k);
    ss.insertSheet(sheetNames[k], k);
    Logger.log("Inserted: " + sheetNames[k]);
  }
  
  // Delete the temporary sheet
  ss.deleteSheet(tempSheet);
  
  // Get all of the newly created template sheets
  var castInfo = ss.getSheetByName("Cast Info");
  var crewInfo = ss.getSheetByName("Crew Info");
  var castList = ss.getSheetByName("Cast List");
  var crewList = ss.getSheetByName("Crew List");
  var castPoints = ss.getSheetByName("Cast Points");
  var crewPoints = ss.getSheetByName("Crew Points");
  
  // Run specific formatting on each of the three types of spreadsheet
  setupInfo(castInfo);
  setupInfo(crewInfo);
  setupList(castList);
  setupList(crewList);
  setupPoints(castPoints, showData);
  setupPoints(crewPoints, showData);
  
}



// Format the "Cast Info" and "Crew Info" sheets
function setupInfo(sheet) {
 
  var colName = "";
  
  // Select which sheet is being formatted
  if (sheet.getName().toLowerCase().indexOf("cast") !== -1) {
    colName = "Role"; 
  } else {
    colName = "Position";
  }
  
  // Add header to top of sheet
  sheet.appendRow([colName, "Name", "Grade", "Email", "Phone", "T-Shirt Size"]);
  boldIt(sheet);
  
  // Format sheet columns for readibility
  sheet.setColumnWidth(1, 150);
  sheet.setColumnWidth(2, 150);
  sheet.setColumnWidth(3, 50);
  sheet.setColumnWidth(4, 200);
  sheet.setColumnWidth(5, 90);
  sheet.setColumnWidth(6, 80);
  
}



// Format the "Cast List" and "Crew List" sheets
function setupList(sheet) {
  
  var colName = "";
  
  // Select which sheet is being formatted
  if (sheet.getName().toLowerCase().indexOf("cast") !== -1) {
    colName = "Role"; 
  } else {
    colName = "Position";
  }
  
  // Add header to top of sheet
  sheet.appendRow([colName, "Names"]);
  boldIt(sheet);
  
  // Format sheet columns for readibility
  sheet.setColumnWidth(1, 150);
  sheet.setColumnWidth(2, 500);
  
}



// Format the "Cast Points" and "Crew Points" sheets
function setupPoints(sheet, showData) {
 
  var colName = "";
  var rolePosition = "";
  
  // Select which sheet is being formatted
  if (sheet.getName().toLowerCase().indexOf("cast") !== -1) {
    colName = "Role";
    rolePosition = showData.roleData;
  } else {
    colName = "Position";
    rolePosition = showData.positionData;
  }
  
  // Add headers to top of sheet
  sheet.appendRow(["Number of Shows:", showData.numOfShows]);
  sheet.appendRow([colName, "Thespian Denomination"]);
  boldIt(sheet);
  
  // Add each relevant role or position along with its associated point value
  for (var i=0; i<rolePosition.length; i++) {
    sheet.appendRow([rolePosition[i][0], rolePosition[i][1]]);
  }
  
  // Format sheet columns for readibility
  sheet.setColumnWidth(1, 150);
  sheet.setColumnWidth(2, 200);
  sheet.getDataRange().setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Add roles or positions to the "Cast Points" or "Crew Points" sheet
function addRolePos(rolePosList) {
  
  // Select which sheet to modify
  if (rolePosList[0] == "role") {
    var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Cast Points");
  } else {
    var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Crew Points");
  }
  
  // Add each role or position to the relevant sheet
  for (var i=0; i<=rolePosList.length; i++) {
    ss.appendRow([rolePosList[1][i][0], rolePosList[1][i][1]]);
  }
  
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Get list of roles and positions for current show
function compileLists() {
  var nameList = compileStuNameList();
  var roleList = compileRolePosList("Cast Points");
  var positionList = compileRolePosList("Crew Points");
  return [nameList, roleList, positionList];
}



// Collect each registered student's name from the registration sheet and return them for use in sidebar dropboxes
function compileStuNameList() {
  
  // Get all registered students
  var dataSheet = SpreadsheetApp.openByUrl("<Registration Spreadsheet URL>");
  var data = dataSheet.getActiveSheet().getDataRange().getValues();
  data = data.splice(1, data.length);
  
  var nameList = [];
  var first;
  var last;
  
  // Iterate through student names and add them to list
  for (var i=0; i<data.length; i++) {
    first = data[i][1].trim();
    last = data[i][2].trim();
    nameList.push(first + " " + last);
  }
  
  // Return alphabetized list of student names
  return nameList.sort();
  
}



// Return list of roles and positions for current show
function compileRolePosList(sheetName) {
  
  // Access data for roles or positions and their associated point values
  var dataSheet = SpreadsheetApp.getActiveSpreadsheet();
  var data = dataSheet.getSheetByName(sheetName).getDataRange().getValues();
  data = data.splice(2, data.length);
  
  var rolePosList = [];
  
  // Iterate through current
  for (var i = 0; i < data.length; i++) {
    rolePosList.push(data[i][0]);
  }
  
  return rolePosList;
  
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Produces a list of Thespian denominations and associated point values
function compileThespianDenomList() {
  
  // Access Thespian denomination information from relevant spreadsheet
  var dataSheet = SpreadsheetApp.openByUrl("<Thespian Denominations Spreadsheet URL>");
  var data = dataSheet.getActiveSheet().getDataRange().getValues();
  data = data.splice(1, data.length);
  
  // List of Thespian denom types (categories, ex: Acting, Production) and all denominations within
  var denomList = [];
  
  var denomType;
  var denom;
  var oneActPts;
  var fullShowPts;
  var found = false;
  
  // Object will describe a Thespian denom type
  function denomTypeContainer(dType, curDenom) {
    this.name = dType;
    this.denoms = [curDenom];
  }
  
  // Iterate through Thespian denom information
  for (var i = 0; i < data.length; i++) {
    // Gather data for each specific Thespian denom
    denomType = data[i][0].trim();
    denom = data[i][1].trim();
    oneActPts = parseInt(data[i][2]);
    fullShowPts = parseInt(data[i][3]);
    // Iterate through current list of denom types
    for (var j = 0; j < denomList.length; j++) {
      // If list of denom types contains current denom type add current denom info to denom type
      if (denomList[j].name == denomType) {
        denomList[j].denoms.push([denom, oneActPts, fullShowPts]);
        found = true;
        break;
      }
    }
    // If current denom type not in list add new denom type and current denom info
    if (!found) {
      denomList.push(new denomTypeContainer(denomType, [denom, oneActPts, fullShowPts]));
    }
    found = false;
  }
  
  return denomList;
  
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Add students to cast or crew for current show
function addCastCrew(castOrCrewSheet, role, numOfStu, names) {
  
  // Get cast and crew data for current show
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var listSheet = ss.getSheetByName(castOrCrewSheet);
  var listSheetRange = listSheet.getDataRange();
  var sheetData = listSheetRange.getValues();
  sheetData = sheetData.slice(1, sheetData.length);
  
  var nameString = "";
  var curRng;
  var curValues;
  var roleNotPresent = true;
  
  // Iterate through names of students to be added to show
  for (var i = 0; i < names.length; i++) {
    // Construct formatted string of student names
    nameString = nameString + names[i].toString() + ", ";
  }
  
  // Iterate through roles or positions present in show
  for (var i = 0; i < sheetData.length; i++) {
    // If role students are being added to is present add student names
    if (role.toLowerCase() == sheetData[i][0].toLowerCase()) {
      curRng = listSheet.getRange(i+2, 2);
      curValues = curRng.getValue();
      // If role already has students add comma and space to end of names
      if (curValues.length > 0) {
        curValues += ", ";
      }
      curValues = curValues + nameString;
      // Remove cruff from end of list of names
      curRng.setValue(curValues.slice(0, curValues.length-2));
      // Append student names to role
      roleNotPresent = false;
      break;
    }
  }
  
  // If role students are being added to is not present, append a new role with associated students to show
  if (roleNotPresent) {
    listSheet.appendRow([role, nameString.slice(0, nameString.length-2)]);
  }
  
  // Format sheet
  listSheet.getDataRange().setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  SpreadsheetApp.setActiveSheet(listSheet);
  
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
function removeStu() {}
*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Update contact information for all students in show
function updateAllContactInfo() {
  
  updateContactInfo("Cast List", "Cast Info", "Role");
  updateContactInfo("Crew List", "Crew Info", "Position");
  
}



// Upadate contact information for cast or crew
function updateContactInfo(listName, infoName, colName) {
  
  // Get sheets for roles and assigned students as well as student contact information
  var listSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(listName);
  var infoSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(infoName);
  
  // Get data on roles and assigned students as well as student registration info
  var regSheet = SpreadsheetApp.openByUrl("<Registration Spreadsheet URL>").getActiveSheet();
  var listData = listSheet.getDataRange().getValues();
  var regData = regSheet.getDataRange().getValues();
  var ui = SpreadsheetApp.getUi();
  
  listData = listData.slice(1, listData.length);
  regData = regData.slice(1, regData.length);
  
  var row;
  var role;
  var nameList;
  var usedNameList = [];
  var name;
  var firstNlast;
  var notFound = "";
  
  // Format contact information sheet
  infoSheet.getDataRange().clear();
  infoSheet.appendRow([colName, "Name", "Grade", "Email", "Phone", "T-Shirt Size"])
  infoSheet.getDataRange().setFontWeight("bold");
  
  // Iterate through roles
  for (i in listData) {
    // Get name of role and list of names for assigned students
    role = listData[i][0].toString();
    nameList = listData[i][1].toString().split(", ");
    // Iterate through names assigned to role
    for (k in nameList) {
      // Find student registration info
      firstNlast = nameList[k].toString().split(" ");
      row = findStu(firstNlast[0], firstNlast[1], regData);
      // If student registered but his contact info has not been added to show add student contact info and mark name as added
      if (row > -1 && usedNameList.indexOf(nameList[k]) == -1) {
        usedNameList.push(nameList[k]);
        infoSheet.appendRow([role, nameList[k], regData[row][4], regData[row][5], regData[row][6], regData[row][11]]);
      } 
      // If student contact info has already been added do nothing
      else if (usedNameList.indexOf(nameList[k]) != -1) {
      }
      // If student has not registered just add role and name to contact info sheet
      else {
        infoSheet.appendRow([role, nameList[k]]);
      }
    } 
  }
  
  // Format contact info sheet
  infoSheet.getDataRange().setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  SpreadsheetApp.setActiveSheet(SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Cast Info"));
  
  return notFound.slice(0, notFound.length-2);
  
}



// Find row of student registration information
function findStu(firstName, lastName, data) {
  
  var row = -1;
  // Iterate through registration data
  for (i in data) {
    // If name of student matches set row variable to current row number
    if (data[i][1].trim() == firstName.trim() && data[i][2].trim() == lastName.trim()) {   
      row = i;
      break;
    }
  }
  
  return row;
  
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Send email to cast or crew
function sendEmail(infoSheet, subj, msg) {
  
  var emails = emailList(infoSheet);
  GmailApp.sendEmail(emails, subj, msg);
  
}



// Return list of emails for students in cast or crew
function emailList(infoSheet) {
  
  // Get contact information for cast or crew
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(infoSheet);
  var data = sheet.getDataRange().getValues();
  data = data.slice(1, data.length);
  
  var ui = SpreadsheetApp.getUi();
  var emailList = "";
  
  // Iterate through students' personal contact info
  for (i in data) {
    // Add student email to list of emails
    var emailAddress = data[i][3];
    emailList = emailList + emailAddress + ", ";
  }
  
  // Remove cruff from end of email list
  emailList = emailList.slice(0, emailList.length - 2);
  return emailList;
  
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Display count of each shirt size for cast OR crew
function countSizes() {
  
  // Get name of current sheet
  var sheetName = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName();
  
  var ui = SpreadsheetApp.getUi();
  var size;
  
  // Initialize count of each shirt size to 0
  var s = 0;
  var m = 0;
  var l = 0;
  var xl = 0;
  
  var total;
  var data;
  
  // If current sheet is for cast, get personal information for cast
  if (sheetName.slice(0,4) == "Cast") {
    data = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Cast Info").getDataRange().getValues();
  }
  // If current sheet is for crew, get personal info for crew
  else if (sheetName.slice(0,4) == "Crew") {
    data = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Crew Info").getDataRange().getValues();
  }
  
  // Iterate through student personal info
  for (i in data) {
    size = data[i][5];
    // Increment relevant shirt size
    switch (size) {
      case "S":
        s++;
        break;
      case "M":
        m++;
        break;
      case "L":
        l++;
        break;
      case "XL":
        xl++;
        break;
    }
  }
  
  total = s + m + l + xl;
  
  // Notify user of sizes
  ui.alert(sheetName.slice(0,4) +" Shirt Sizes", "Small: " + s + "\nMedium: " + m + "\nLarge: " + l + "\nExtra Large: " + xl + "\n\nTotal: " + total, ui.ButtonSet.OK)
  
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Display list of phone numbers for cast AND crew
function phoneList() {
  
  // Get name of current sheet
  var sheetName = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName();
  var ui = SpreadsheetApp.getUi();
  
  // Display list of phone numbers for cast OR crew
  function genPhoneList(sheetName) {
    
    // Get contact information for cast or crew
    var data = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName).getDataRange().getValues();
    data = data.slice(1, data.length);
    
    var phoneList = "";
    
    // Iterate through contact info
    for (i in data) {
      var phoneNum = data[i][4];
      // If student has registered phone number add number to list
      if (phoneNum.toString().length > 0) {
        phoneList = phoneList + phoneNum.toString() + ", ";
      }
    }
    
    phoneList = phoneList.slice(0, phoneList.length - 2);
    
    // Notify user of phone numbers
    SpreadsheetApp.getUi().alert(sheetName.slice(0, 4)+" Phone Numbers", 
                                 "This is a list of all the recognized phone numbers:\n\n" + phoneList, ui.ButtonSet.OK);
    
  }
  
  // Display phone numbers for both cast AND crew
  genPhoneList("Cast Info");
  genPhoneList("Crew Info");
  
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Bold all text present in the sheet
function boldIt(sheet) {
  
  sheet.getDataRange().setFontWeight("bold");
  
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
