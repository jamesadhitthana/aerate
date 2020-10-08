//New Stuff added after migration -James Adhitthana//
function enableExpertView() {
    //If dashboardViewIsForExperts is currently false then enable expert view
    document.getElementById("statsForExperts").style.display = "unset";
    dashboardViewIsForExperts = true;

    //Set button color and text
    document.getElementById("generateReportButton").className = "d-none d-sm-inline-block btn btn-sm btn-info shadow-sm";
    document.getElementById("generateReportButton").innerHTML = '<i class="fas fa-lightbulb fa-sm text-white-50"></i> Expert View Enabled';


    iziToast.success({ message: "Enabled Stats for Experts!" });
}

function disableExpertView() {
    document.getElementById("statsForExperts").style.display = "none";
    dashboardViewIsForExperts = false;
    iziToast.success({ message: "Set dashboard to Simple View" });

    //Set button color and text
    document.getElementById("generateReportButton").className = "d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm";
    document.getElementById("generateReportButton").innerHTML = '<i class="fas fa-lightbulb fa-sm text-white-50"></i> Expert View Disabled';
}

function toggleExpertView() {
    if (dashboardViewIsForExperts == false) {
        //If dashboardViewIsForExperts is currently false then enable expert view
        enableExpertView()
    } else {
        disableExpertView()
    }
}






//-----------------------------------Setup Overview Icons-----------------------------------//
function changeOverviewIconColor(overviewID, pathToIcon) {
    document.getElementById(overviewID).src = pathToIcon;
}
function changeOverviewIconTitle(overviewID, newTitle) {
    document.getElementById(overviewID).title = newTitle;
}

function setOverviewCleanliness(color) {
    changeOverviewIconColor("overviewCleanliness", "img/icon_clean_" + color + ".svg")

    if (color == "green") {
        changeOverviewIconTitle("overviewCleanliness", "The air is clean of dangerous amounts of dust")
    } else if (color == "yellow") {
        changeOverviewIconTitle("overviewCleanliness", "The air is dusty, try to clean up and get dust levels under 35µg/m3")
    } else if (color == "red") {
        changeOverviewIconTitle("overviewCleanliness", "The air is dangerously dusty, clean up immediately and get dust levels under 150.5µg/m3!")
    } else {
        changeOverviewIconTitle("overviewCleanliness", "Check here to see the state of your air!")
    }







}
function setOverviewGas(color) {
    changeOverviewIconColor("overviewGas", "img/icon_gas_" + color + ".svg")

    if (color == "green") {
        changeOverviewIconTitle("overviewGas", "The air is safe from dangerous gasses")
    } else if (color == "yellow") {
        changeOverviewIconTitle("overviewGas", "There are some gasses that are present in the air")
    } else if (color == "red") {
        changeOverviewIconTitle("overviewGas", "Dangerous amounts of gasses detected!")
    } else {
        changeOverviewIconTitle("overviewGas", "Check here to see the state of gases in your air!")
    }



}
function setOverviewVentilation(color) {
    changeOverviewIconColor("overviewVentilation", "img/icon_window_" + color + ".svg")

    if (color == "green") {
        changeOverviewIconTitle("overviewVentilation", "The air is safe, however you can open your window to let more fresh air in")
    } else if (color == "yellow") {
        changeOverviewIconTitle("overviewVentilation", "The state of air is not great, please open your windows and aerate the room")
    } else if (color == "red") {
        changeOverviewIconTitle("overviewVentilation", "The air is dangerous! Open your windows and aerate your room immediately!")
    } else {
        changeOverviewIconTitle("overviewVentilation", "Check here to see whether you have to open your windows or not!")
    }
}
function setOverviewHumidex(color, currentValue) {
    changeOverviewIconColor("overviewHumidex", "img/icon_hot_" + color + ".svg")

    if (color == "green") {
        changeOverviewIconTitle("overviewHumidex", 'The temperature "feels like" it is ' + currentValue + '°C. The air is at a safe and comfortable temperature and humidity')
    } else if (color == "yellow") {
        changeOverviewIconTitle("overviewHumidex", 'The temperature "feels like" it is ' + currentValue + '°C. The temperature and humidity is uncomfortable, decrease temperature/humidity so that the humidex is under 30°C')
    } else if (color == "red") {
        changeOverviewIconTitle("overviewHumidex", 'The temperature "feels like" it is ' + currentValue + '°C. The temperature and humidity is dangerous! Avoid exertion and heatstroke imminent! Decrease temperature/humidity so that the humidex is under 40°C')
    } else {
        changeOverviewIconTitle("overviewHumidex", 'Check here to see what the temperature "feels like" on your skin and the state of temperature and humidity and the discomfort level!')
    }
}

//TODO: function set
function updateOverviewIcons() {//TODO: THIS
    let humidexValue = calculateHumidex(aerUnited.getLatestDHT_temp_c(), aerUnited.getLatestDHT_hum())
    //--Reset Icons--//
    setOverviewCleanliness("green")
    setOverviewVentilation("green")
    setOverviewGas("green")
    setOverviewHumidex("green", humidexValue)
    //--//

    //--Safety ranges--//
    //How it works: Check medium first, enable which icons to enable, then enable the higher ones if the values are actually higher than the medium ones

    //********************YELLOW-MEDIUM Overview Icons********************
    //MEDIUM Threshold for DUST-CLEANLINESS 
    if (aerUnited.getLatestSHARP_dust_ugm3() > 35) {//AQI Unhealthy for Sensitive Groups
        setOverviewCleanliness("yellow")
    }

    //MEDIUM Threshold for GASES
    if (aerUnited.getLatestMQ8_h2_ppm() > 500 ||
        aerUnited.getLatestMQ2_smk_ppm() > 425 ||//calibrated value of smoke
        aerUnited.getLatestMQ135_co2_ppm() > 450 || //OSHA PEL & NIOSH REL = 5000
        aerUnited.getLatestMQ6_lpg_ppm() > 100 ||//100.00 || //OSHA PEL & NIOSH REL
        aerUnited.getLatestMQ7_co_ppm() > 9 ||//NIOSH REL
        aerUnited.getLatestMQ3_alc_mgL() > 0.8// OSHA PEL = 980mg/L 
    ) {
        //If these gases are over the MEDIUM threshold then enable gas overview icon:
        setOverviewGas("yellow")
        setOverviewVentilation("yellow")
    }
    //MEDIUM Threshold for HUMIDEX 
    if (humidexValue >= 30) {//AQI Unhealthy for Sensitive Groups
        setOverviewHumidex("yellow", humidexValue)
    }

    //********************RED-DANGEROUS Overview Icons********************
    //DANGEROUS Threshold for DUST-CLEANLINESS 
    if (aerUnited.getLatestSHARP_dust_ugm3() > 150.5) { //AQI Very Unhealthy
        setOverviewCleanliness("red")
        pushNotificationWarning()
        addWarningInAlertsCenter("Uh oh! The cleanliness levels have gone hazardous!")
    }

    //HIGH Threshold for GASES
    if (aerUnited.getLatestMQ8_h2_ppm() > 7500 ||
        aerUnited.getLatestMQ2_smk_ppm() > 700 ||//calibrated value of dangerous smoke

        aerUnited.getLatestMQ135_co2_ppm() > 800 || // ||//IDLH =40000

        aerUnited.getLatestMQ6_lpg_ppm() > 800 ||//IDLH =2000

        aerUnited.getLatestMQ7_co_ppm() > 35 ||//	CO Max exposure for 8 hour work day (OSHA)

        aerUnited.getLatestMQ3_alc_mgL() > 3.5 ||//IDLH: 2000 

        aerUnited.getLatestSHARP_dust_ugm3() > 150.5 //AQI Very Unhealthy
    ) {
        //If these gases are over the HIGH threshold then enable gas overview icon:
        setOverviewGas("red")
        setOverviewVentilation("red")
        pushNotificationWarning()
        addWarningInAlertsCenter("Uh oh! The gas levels have gone hazardous!")
    }

    //DANGEROUS Threshold for HUMIDEX 
    if (humidexValue >= 40) {//AQI Unhealthy for Sensitive Groups
        setOverviewHumidex("red", humidexValue)
        pushNotificationWarning()
        addWarningInAlertsCenter("Uh oh! The humidex levels have gone hazardous!")
    }




    //-------------------------------------------//
    // aerUnited.getLatestMQ8_h2_ppm() + "ppm")
    // aerUnited.getLatestMQ2_smk_ppm() + "ppm")
    // aerUnited.getLatestMQ6_lpg_ppm() + "ppm")
    // aerUnited.getLatestMQ135_co2_ppm() + "ppm")
    // aerUnited.getLatestMQ7_co_ppm() + "ppm")
    // aerUnited.getLatestMQ3_alc_mgL() + "mg/L")
    // aerUnited.getLatestDHT_temp_c() + "°C | " + 
    // aerUnited.getLatestDHT_hum() + "%")
    // aerUnited.getLatestSHARP_dust_ugm3() + "µg/m3")
    //--/

}

//Get CO Value//#part2 Used for refreshing the chart text ONLY
//------NEW SCORING ALGORITHM 22Mar2020------//
function calcScoreFromRange(currentValue, safestMin, dangerousMax) {

    //contoh range 22 <-> 45//
    let min = dangerousMax//ex: 46 //Minimum range [MOST DANGEROUS] (inverted)
    let max = safestMin//ex: 22//Minimum safety range [SAFEST] (inverted)
    let range = max - min

    let valueInsideRange = currentValue - min;
    let percentageFromMax = roundToTwo(valueInsideRange / range);

    console.log("Range " + safestMin + " <-> " + dangerousMax + " | currentValue-min= " + valueInsideRange + " | valueInsideRange/max= " + percentageFromMax)
    return percentageFromMax
}

function updateDustircularGraphInverted(currentValue) {
    let percentage = calcScoreFromRange(currentValue, 0, 150.5)
    console.log(percentage)
    //IF Above/At MOST DANGEROUS LEVEL Safest (0% NOT OPTIMIZED)
    if (percentage <= 0) {
        circularChartDust.animate(-1);//If the value is more than the MOST DANGEROUS level, then set to 0% Optimized, but then use the full red bar by using -1
        circularChartValueDust = 0
        console.log("Value is " + percentage + "/0 (above MOST DANGEROUS level) therefore the score is set to 0%")
    }
    //IF LESS THAN/At SAFEST LEVEL (100% OPTIMIZED)
    else if (percentage >= 1) {
        circularChartDust.animate(1);//If the value is less than safest level, then set to 100% Optimized
        circularChartValueDust = 1
        console.log("Value is " + percentage + "/0 (less than safest level) therefore the score is set to 100%")
    }
    //IF Value is 1-99% optimized then:
    else {
        circularChartDust.animate(percentage);// Number from 0.0 to 1.0
        circularChartValueDust = percentage
    }
}

function updateCO2CircularGraphInverted(currentValue) {
    let percentage = calcScoreFromRange(currentValue, 250, 800)
    console.log(percentage)
    //IF Above/At MOST DANGEROUS LEVEL Safest (0% NOT OPTIMIZED)
    if (percentage <= 0) {
        circularChartCO2.animate(-1);//If the value is more than the MOST DANGEROUS level, then set to 0% Optimized, but then use the full red bar by using -1
        circularChartValueCO2 = 0
        console.log("Value is " + percentage + "/0 (above MOST DANGEROUS level) therefore the score is set to 0%")
    }
    //IF LESS THAN/At SAFEST LEVEL (100% OPTIMIZED)
    else if (percentage >= 1) {
        circularChartCO2.animate(1);//If the value is less than safest level, then set to 100% Optimized
        circularChartValueCO2 = 1
        console.log("Value is " + percentage + "/0 (less than safest level) therefore the score is set to 100%")
    }
    //IF Value is 1-99% optimized then:
    else {
        circularChartCO2.animate(percentage);// Number from 0.0 to 1.0
        circularChartValueCO2 = percentage
    }
}



function updateCOCircularGraphInverted(currentValue) {
    let percentage = calcScoreFromRange(currentValue, 0, 35)
    console.log(percentage)
    //IF Above/At MOST DANGEROUS LEVEL Safest (0% NOT OPTIMIZED)
    if (percentage <= 0) {
        circularChartCO.animate(-1);//If the value is more than the MOST DANGEROUS level, then set to 0% Optimized, but then use the full red bar by using -1
        circularChartValueCo = 0
        console.log("Value is " + percentage + "/0 (above MOST DANGEROUS level) therefore the score is set to 0%")
    }
    //IF LESS THAN/At SAFEST LEVEL (100% OPTIMIZED)
    else if (percentage >= 1) {
        circularChartCO.animate(1);//If the value is less than safest level, then set to 100% Optimized
        circularChartValueCo = 1
        console.log("Value is " + percentage + "/0 (less than safest level) therefore the score is set to 100%")
    }
    //IF Value is 1-99% optimized then:
    else {
        circularChartCO.animate(percentage);// Number from 0.0 to 1.0
        circularChartValueCo = percentage
    }
}


function updateHumidexCircularGraphInverted(currentValue) {
    let percentage = calcScoreFromRange(currentValue, 22, 46)
    console.log(percentage)
    //IF Above/At MOST DANGEROUS LEVEL Safest (0% NOT OPTIMIZED)
    if (percentage <= 0) {
        circularChartHumidex.animate(-1);//If the value is more than the MOST DANGEROUS level, then set to 0% Optimized, but then use the full red bar by using -1
        circularChartValueHumidex = 0
        console.log("Value is " + percentage + "/0 (above MOST DANGEROUS level) therefore the score is set to 0%")
    }
    //IF LESS THAN/At SAFEST LEVEL (100% OPTIMIZED)
    else if (percentage >= 1) {
        circularChartHumidex.animate(1);//If the value is less than safest level, then set to 100% Optimized
        circularChartValueHumidex = 1
        console.log("Value is " + percentage + "/0 (less than safest level) therefore the score is set to 100%")
    }
    //IF Value is 1-99% optimized then:
    else {
        circularChartHumidex.animate(percentage);// Number from 0.0 to 1.0
        circularChartValueHumidex = percentage
    }
}
//------------------


//--Get Today's date and replace date on page--//
function getTodaysDateTime() {
    var dateToday = new Date();
    return dateToday.toDateString() + ' (' + dateToday.getHours() + ":" + dateToday.getMinutes() + ')';
}

//-------Alert Center Functionalities---------//
function addAlertInAlertsCenter(message) {
    document.getElementById("aerateAlertsCenter").innerHTML +=//Add template literal
        `<a class="dropdown-item d-flex align-items-center" href="#">
        <div class="mr-3">
          <div class="icon-circle bg-primary">
            <i class="fas fa-info text-white"></i>
          </div>
        </div>
        <div>
          <div class="small text-gray-500">`+ getTodaysDateTime() + '</div>' + message + '</div></a>'
    alertsCenterCounter++;
    updateAlertsCenterCounter()
}
function addWarningInAlertsCenter(message) {
    document.getElementById("aerateAlertsCenter").innerHTML +=//Add template literal
        `<a class="dropdown-item d-flex align-items-center" href="#">
          <div class="mr-3">
            <div class="icon-circle bg-warning">
              <i class="fas fa-exclamation-triangle text-white"></i>
            </div>
          </div>
          <div>
            <div class="small text-gray-500">`+ getTodaysDateTime() + '</div>' + message + '</div></a>'
    alertsCenterCounter++;
    updateAlertsCenterCounter()
}
function addSuccessInAlertCenter(message) {
    document.getElementById("aerateAlertsCenter").innerHTML +=//Add template literal
        `<a class="dropdown-item d-flex align-items-center" href="#">
          <div class="mr-3">
            <div class="icon-circle bg-success">
              <i class="fas fa-check-circle text-white"></i>
            </div>
          </div>
          <div>
            <div class="small text-gray-500">`+ getTodaysDateTime() + '</div>' + message + '</div></a>'
    alertsCenterCounter++;
    updateAlertsCenterCounter()
}
function updateAlertsCenterCounter() {
    document.getElementById("alertsCenterCounter").innerHTML = alertsCenterCounter;
    // console.log("[updateAlertsCenterCounter]: SUCCESS- Updated to:" + alertsCenterCounter)
}
//--//

//--LogOut--//
function handleLogout() {

    if (aerUnited.getUserCredentials() == null) {
        window.location.href = 'login.html';
    }

    //Sign Out/Logouts the user
    aerUnited.getAuth().signOut()
        .then(function (data) {
            console.log("--Logged Out--")
            console.log(data)
            iziToast.success({ message: 'See you soon!' });
            document.getElementById("userNameAndEmail").innerHTML = "Signed out";
        })
        .catch(function (err) {
            console.log(err)
            iziToast.error({ message: 'Failed to logout: ' + err.message });
        })
}
//****************************************ORIGINALLY JQUERY SECTION GOES HERE*****************************************//



function updateCardSensorValue(cardValueID, newValue) {
    document.getElementById(cardValueID).innerHTML = newValue
}

function updateAllCards() {
    // updateCardSensorValue("card-dust-value", aerUnited.getLatestARDUINO_DATE())
    // updateCardSensorValue("card-dust-value", aerUnited.getLatestARDUINO_counter())
    updateCardSensorValue("card-h2-value", aerUnited.getLatestMQ8_h2_ppm() + "ppm")
    updateCardSensorValue("card-smk-value", aerUnited.getLatestMQ2_smk_ppm() + "ppm")
    updateCardSensorValue("card-lpg-value", aerUnited.getLatestMQ6_lpg_ppm() + "ppm")
    updateCardSensorValue("card-co2-value", aerUnited.getLatestMQ135_co2_ppm() + "ppm")
    updateCardSensorValue("card-co-value", aerUnited.getLatestMQ7_co_ppm() + "ppm")
    updateCardSensorValue("card-alc-value", aerUnited.getLatestMQ3_alc_mgL() + "mg/L")
    updateCardSensorValue("card-temp-hum-value", aerUnited.getLatestDHT_temp_c() + "°C | " + aerUnited.getLatestDHT_hum() + "%")
    updateCardSensorValue("card-dust-value", aerUnited.getLatestSHARP_dust_ugm3() + "µg/m3")
}

function updateAllCircularGraphs() {

    updateDustircularGraphInverted(aerUnited.getLatestSHARP_dust_ugm3())
    updateCO2CircularGraphInverted(aerUnited.getLatestMQ135_co2_ppm())
    updateCOCircularGraphInverted(aerUnited.getLatestMQ7_co_ppm())
    updateHumidexCircularGraphInverted(calculateHumidex(aerUnited.getLatestDHT_temp_c(), aerUnited.getLatestDHT_hum()))
}

function updateAQICardColor(inputCategory) {
    console.log("[updateAQICardColor] BEFORE: " + document.getElementById("labelAQICard").className) //BEFORE
    let updatedAQICardCLass = ""
    if (inputCategory == "Good") {
        // james-good-gradient 
        updatedAQICardCLass = "card james-good-gradient text-white shadow"
    } else if (inputCategory == "Moderate") {
        // james-moderate-gradient 
        updatedAQICardCLass = "card james-moderate-gradient text-white shadow"
    } else if (inputCategory == "Unhealthy for Sensitive Groups") {
        // james-unhealthy1-sensitivegroups-gradient
        updatedAQICardCLass = "card james-unhealthy1-sensitivegroups-gradient text-white shadow"
    } else if (inputCategory == "Unhealthy") {
        // james-unhealthy2-unhealthy-gradient 
        updatedAQICardCLass = "card james-unhealthy2-unhealthy-gradient text-white shadow"
    } else if (inputCategory == "Very Unhealthy") {
        // james-unhealthy3-veryunhealthy-gradient 
        updatedAQICardCLass = "card james-unhealthy3-veryunhealthy-gradient text-white shadow"
    } else if (inputCategory == "Hazardous") {
        // james-hazardous-gradient
        updatedAQICardCLass = "card james-hazardous-gradient text-white shadow"
    } else {
        // james-loading-gradient                   
        updatedAQICardCLass = "card james-loading-gradient text-white shadow"
    }
    document.getElementById("labelAQICard").className = updatedAQICardCLass;
    console.log("[updateAQICardColor] AFTER: " + document.getElementById("labelAQICard").className) //AFTER
    //goodGreen
    //moderateYellow
    //unhealthy sensOrange
    //unhealthyRed
    //very unheaPurple
    //hazarMaroon
}

function updateAQILabel() {//Calculating US-AQI
    let aqiDust = calculateDustAQI(aerUnited.getLatestSHARP_dust_ugm3())
    let aqiCo = calculateCOAQI(aerUnited.getLatestMQ7_co_ppm())
    let aqiCategory = ""
    if (aqiDust > aqiCo) {
        aqiCategory = calculateAQICategory(aqiDust)
        document.getElementById("labelAQIValue").innerHTML = aqiDust; //DUST
        document.getElementById("labelAQICategory").innerHTML = aqiCategory
        console.log("aqiDust(" + aqiDust + ")" + "> aqiCo(" + aqiCo + ") = " + aqiCategory)
    } else {
        aqiCategory = calculateAQICategory(aqiCo)
        document.getElementById("labelAQIValue").innerHTML = aqiCo //CO
        document.getElementById("labelAQICategory").innerHTML = aqiCategory
        console.log("aqiDust(" + aqiDust + ")" + "< aqiCo(" + aqiCo + ") = " + aqiCategory)
    }
    //TODO: category change
    updateAQICardColor(aqiCategory)
    // document.getElementById("labelAQICard").innerHTML
}

function changeDateAndRefreshMainChart(chartName, targetDate) {//TODO: Edit This on every page used
    // alert("[changeDateAndRefreshChart(chartName)] IF YOU SEE THIS: Please make a new function for each chart to be able to refresh EACH CHART and refresh the datasets the chart uses | follow the tutorial in the comments -James")
    // console.error("[changeDateAndRefreshChart(chartName)] IF YOU SEE THIS: Please make a new function for each chart to be able to refresh EACH CHART and refresh the datasets the chart uses | follow the tutorial in the comments -James")
    //You have to build the function yourself for every chart because
    //each chart has different dataset data and different indexes for the dataset
    //So use this function as a guide to help you build your own.

    //-----Clear Datasets from aerUnified class (must)-----//
    clearAllChartDataArrays();//Clear data arrays
    //-----Clear Datatables(must)-----//
    clearDataTables(dataTableSensors);

    //--Push the data
    pushDataFromDateToChartArray(targetDate); //Get new data for the date and put it in the data array
    //-----Change Label (must)-----//
    replaceChartDatasetLabel(chartName, aerUnited.getARDUINO_DATE()) //replace the labels with desired label array (string array)
    //--Update Overview--//
    //Update all circular graph
    updateAllCircularGraphs()
    //Update AQI card and contents inside it
    updateAQILabel()
    updateOverviewIcons()
    //Update all the cards with new data
    updateAllCards()

    //-----Pick the data-----//
    //Dont forget to change the indexes according to the chart
    replaceChartDatasetData(chartName, 0, aerUnited.getMQ8_h2_ppm());
    replaceChartDatasetData(chartName, 1, aerUnited.getMQ2_smk_ppm());
    replaceChartDatasetData(chartName, 2, aerUnited.getMQ6_lpg_ppm());
    replaceChartDatasetData(chartName, 3, aerUnited.getMQ135_co2_ppm());
    replaceChartDatasetData(chartName, 4, aerUnited.getMQ7_co_ppm());
    replaceChartDatasetData(chartName, 5, aerUnited.getMQ3_alc_mgL());
    replaceChartDatasetData(chartName, 6, aerUnited.getDHT_temp_c());
    replaceChartDatasetData(chartName, 7, aerUnited.getDHT_hum());
    replaceChartDatasetData(chartName, 8, aerUnited.getSHARP_dust_ugm3());

    console.log("[changeDateAndRefreshMainChart]: SUCCESS- Replaced chart data with new data and refreshed main chart")
    iziToast.success({ message: 'Loaded data from chosen date' });
}

function changeDateAndRefreshHumidexChart(humidexchartName) {//TODO: Edit This on every page used
    try {
        let humidexValue = calculateHumidex(aerUnited.getLatestDHT_temp_c(), aerUnited.getLatestDHT_hum())
        humidexGage.refresh(humidexValue)

        let explainer = ""
        if (humidexValue > 0 && humidexValue < 30) {
            explainer = "No discomfort";
        }
        if (humidexValue >= 30 && humidexValue < 40) {
            explainer = "Some discomfort";
        }
        if (humidexValue >= 40 && humidexValue < 45) {
            explainer = "Great discomfort; avoid exertion";
        }
        if (humidexValue >= 45) {
            explainer = "Dangerous; heat stroke possible";
        }
        console.log("--REEEEEEE----" + document.getElementById("humidexExplainer").innerHTML)
        document.getElementById("humidexExplainer").innerHTML = explainer

    } catch (err) {
        console.log("ketemu masalah")
        console.warn(err)
    }


}
// function changeDateAndRefreshChart(chartName) {//TODO: Edit This on every page used
//   alert("[changeDateAndRefreshChart(chartName)] IF YOU SEE THIS: Please make a new function for each chart to be able to refresh EACH CHART and refresh the datasets the chart uses | follow the tutorial in the comments -James")
//   console.error("[changeDateAndRefreshChart(chartName)] IF YOU SEE THIS: Please make a new function for each chart to be able to refresh EACH CHART and refresh the datasets the chart uses | follow the tutorial in the comments -James")
//   //You have to build the function yourself for every chart because
//   //each chart has different dataset data and different indexes for the dataset
//   //So use this function as a guide to help you build your own.

//   //-----Clear Datasets from aerUnified class (must)-----//
//   // clearAllChartDataArrays();//Clear data arrays
//   // pushDataFromDateToChartArray(); //Get new data for the date and put it in the data array

//   //-----Change Label (must)-----//
//   // replaceChartDatasetLabel(chartName, aerUnited.getARDUINO_DATE()) //replace the labels with desired label array (string array)

//   //-----Pick the data-----//
//   //Dont forget to change the indexes according to the chart
//   // replaceChartDatasetData(chartName, 0, aerUnited.getMQ8_h2_ppm());
//   // replaceChartDatasetData(chartName, 1, aerUnited.getMQ2_smk_ppm());
//   // replaceChartDatasetData(chartName, 2, aerUnited.getMQ6_lpg_ppm());
//   // replaceChartDatasetData(chartName, 3, aerUnited.getMQ135_co2_ppm());
//   // replaceChartDatasetData(chartName, 4, aerUnited.getMQ7_co_ppm());
//   // replaceChartDatasetData(chartName, 5, aerUnited.getMQ3_alc_mgL());
//   // replaceChartDatasetData(chartName, 6, aerUnited.getDHT_temp_c());
//   // replaceChartDatasetData(chartName, 7, aerUnited.getDHT_hum());
//   // replaceChartDatasetData(chartName, 8, aerUnited.getSHARP_dust_ugm3());
// }

function updateUserInfoInPage() {//TODO: Edit This on every page used
    if (aerUnited.getUserCredentials() != null) {
        try {
            document.getElementById("userNameAndEmail").innerHTML = aerUnited.getUserName() + " (" + aerUnited.getUserEmail() + ")";
        } catch (err) {
            iziToast.error({ message: '[updateUserInfoInPage]: Failed to updateUserInfoInPage' });
            console.error("[updateUserInfoInPage]: Failed to updateUserInfoInPage - " + err)
        }
    } else {
        console.warn("[updateUserInfoInPage]: User is not logged in, so the page isnt updated")
        document.getElementById("userNameAndEmail").innerHTML = "Signed out";
    }
}


function refreshAllCharts() { //Function for change calendar date button and enter key when changing calendar date
    changeDateAndRefreshMainChart(mainChartJSChart, moment($(inputTargetDate).datepicker('getDate')).format('YYYY-MM-DD'));
    changeDateAndRefreshHumidexChart(humidexGage)
    addSuccessInAlertCenter("Successfuly loaded data from chosen date")
}




//-----------------------------------Abstract Functions Overriding (Copy Paste to every Page)-----------------------------------//
function doWhenAuthIsUpdated() {//ABSTRACT FUNCTION [MANDATORY]
    //Load user data in page
    try {
        updateUserInfoInPage()
        console.log('doWhenAuthIsUpdated() SUCESSFUL');
        // iziToast.success({ message: 'doWhenAuthIsUpdated() SUCESSFUL' });
    } catch (err) {
        iziToast.error({ message: 'doWhenAuthIsUpdated() FAILED' });
        console.error('doWhenAuthIsUpdated() FAILED');
        console.warn(err)
    }
}
function doWhenDatabaseRawIsUpdated() {//ABSTRACT FUNCTION [MANDATORY]
    //Push Data to mainChart
    try {
        //Clear Table Data First
        clearDataTables(dataTableSensors);
        //--Push Data--//
        pushDataFromDateToChartArray(moment($(inputTargetDate).datepicker('getDate')).format('YYYY-MM-DD'));
        refreshAllChartData(mainChartJSChart);

        //Update in page card sensor values
        updateAllCards()

        changeDateAndRefreshHumidexChart(humidexGage)

        updateAllCircularGraphs()

        updateAQILabel()
        updateOverviewIcons()

        if (isFirstTime) {
            //history chart//


            //clear dulu old chartdata_history nya
            //  chartData_history_Date = []
            //  chartData_history_MQ8_h2_ppm = []
            //  chartData_history_MQ2_smk_ppm = []
            //  chartData_history_MQ6_lpg_ppm = []
            //  chartData_history_MQ135_co2_ppm = []
            //  chartData_history_MQ7_co_ppm = []
            //  chartData_history_MQ3_alc_mgL = []
            //  chartData_history_DHT_temp_c = []
            //  chartData_history_DHT_hum = []
            //  chartData_history_SHARP_dust_ugm3 = []
            //  historyChartJSChart.update()

            //push data langsung
            //push data directly into LOCAL Variable Array
            //yang penting ada label, kalau udah ada label dia auto generate from the array!! [thats bloody brilliant]

            historicalData = getAverageDataFromDates()
            for (let i = 0; i < Object.keys(historicalData).length; i++) {
                let currentDate = Object.keys(historicalData)[i]
                chartData_history_MQ8_h2_ppm.push(historicalData[currentDate]["MQ8_h2_ppm"])
                chartData_history_MQ2_smk_ppm.push(historicalData[currentDate]["MQ2_smk_ppm"])
                chartData_history_MQ6_lpg_ppm.push(historicalData[currentDate]["MQ6_lpg_ppm"])
                chartData_history_MQ135_co2_ppm.push(historicalData[currentDate]["MQ135_co2_ppm"])
                chartData_history_MQ7_co_ppm.push(historicalData[currentDate]["MQ7_co_ppm"])
                chartData_history_MQ3_alc_mgL.push(historicalData[currentDate]["MQ3_alc_mgL"])
                chartData_history_DHT_temp_c.push(historicalData[currentDate]["DHT_temp_c"])
                chartData_history_DHT_hum.push(historicalData[currentDate]["DHT_hum"])
                chartData_history_SHARP_dust_ugm3.push(historicalData[currentDate]["SHARP_dust_ugm3"])
                addChartLabel(historyChartJSChart, currentDate)
            }
            //Setup introjs//
            isFirstTime = false;
            //Set cookies for introJS
            if (Cookies.get('cookieSkipIntroJs') != "true") {
                //Start IntroJS when the page is initially loaded (bukan first time cookie tapi first time loaded)
                enableExpertView();
                introJs().setOption("exitOnOverlayClick", false).start().onexit(function () {
                    disableExpertView();
                });




                Cookies.set('cookieSkipIntroJs', 'true', {
                    expires: 0.5 //half a day
                });
                console.log("Started introJS because it is the FirstTime and cookieSkipIntroJs is not true")
            }
        }

        //--------------//

        iziToast.success({ message: 'Updated new data from database' });
        addSuccessInAlertCenter("Successfuly updated new data from database")
        // iziToast.success({ message: 'doWhenDatabaseRawIsUpdated() SUCESSFUL' });

    } catch (err) {
        iziToast.error({ message: 'doWhenDatabaseRawIsUpdated() FAILED: ' + err });
        console.error('doWhenDatabaseRawIsUpdated() FAILED')
        console.warn(err)
    }

    //Push Data to individual charts
    //WARNING: If the date is changed on the main chart using (pushDataFromDateToChartArray), all 
    //subsequent charts who share the same dataset and arrays will be changed according to the date
    // pushDynamicChartDataset(historyChartJSChart, aerUnited.getARDUINO_DATE(), dataSet_MQ8_h2_ppm, dataSet_MQ2_smk_ppm)
    // pushDynamicChartDataset(h2ChartJSChart, aerUnited.getARDUINO_DATE, dataSet_MQ8_h2_ppm)
}
  //END OF: Abstract Functions Overriding (Copy Paste to every Page)--//
