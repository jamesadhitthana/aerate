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
      //------------------

//*****************************JQUERY WAS HERE************************************************//

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
      changeDateAndRefreshHumidexChart(humidexGage)
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
        if (Cookies.get('cookieSkipIntroJsInsideSensorPages') != "true") {
          introJs().setOption("exitOnOverlayClick", false).start();
          Cookies.set('cookieSkipIntroJsInsideSensorPages', 'true', {
            expires: 0.5 //half a day
          });
          console.log("Started introJS because it is the FirstTime and cookieSkipIntroJsInsideSensorPages is not true")
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



