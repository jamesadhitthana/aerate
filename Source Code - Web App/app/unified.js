//----------James Adhitthana----------//
//--------------------------------------------------Initialize Firebase--------------------------------------------------//
var config = {
    apiKey: "TODO: CHANGE ME",
    authDomain: "TODO: CHANGE ME",
    databaseURL: "TODO: CHANGE ME",
    projectId: "TODO: CHANGE ME",
    storageBucket: "TODO: CHANGE ME",
    messagingSenderId: "TODO: CHANGE ME",
    appId: "TODO: CHANGE ME",
    measurementId: "TODO: CHANGE ME"
};

firebase.initializeApp(config);
firebase.analytics();
//-END OF: Initialize Firebase-//
//--------------------------------------------------James Adhitthana Functions--------------------------------------------------//
//--------------------***************Calculations***************-------------------------//

//--------------------*Humidex Calculator*-------------------------//
function calculateHumidex(inputCelcius, inputHumidity) {
    
    console.log("Getting humidex for: " + inputCelcius + "C° " + inputHumidity + "%")
    var degreeOfComfort = "";

    var celsius = parseFloat(inputCelcius);
    var humidity = parseFloat(inputHumidity);
    let e = (6.112) * Math.pow(10, (7.5 * (celsius / (237.7 + celsius)))) * (humidity / 100)
    let humidex = Math.round(celsius + (5/9) * (e-10));

    if (humidex > 0 && humidex < 30) {
        degreeOfComfort += "No discomfort";
    }
    if (humidex >= 30 && humidex < 40) {
        degreeOfComfort += "Some discomfort";
    }
    if (humidex >= 40 && humidex < 45) {
        degreeOfComfort += "Great discomfort; avoid exertion";
    }
    if (humidex >= 45) {
        degreeOfComfort += "Dangerous; heat stroke possible";
    }

    if (humidity < 0 || humidity > 100) {
        degreeOfComfort = "Humidity must be between 0 and 100";
    }

    console.log("calculateHumidex Explanation: " + degreeOfComfort)
    console.log("Humidex Value Celsius: " + humidex)
    // iziToast.success({ message: "Humidex Factor In Celsius (TFC): " + humidex });
    // console.log("Humidex Factor In Fahrenheit (TFH): " + tfh)
    // iziToast.success({ message: "Humidex Factor In Fahrenheit (TFH): " + tfh });
    return humidex;
}

//--------------------*Piecewise Linear Function Calculator*-------------------------//
function piecewiseLinear(concentration, concentrationLow, concentrationHigh, indexLow, indexHigh) {
    let bagian1 = (indexHigh - indexLow) / (concentrationHigh - concentrationLow)
    let bagian2 = (concentration - concentrationLow)
    let bagian3 = indexLow;

    index = Math.round(bagian1 * bagian2 + indexLow)
    // console.log('[piecewiseLinear]: ' + index)
    return index
}
//piecewiseLinear(concentration, concentrationLow, concentrationHigh, indexLow, indexHigh)
// console.log(piecewiseLinear(12, 0, 12, 0, 50))//50
// console.log(piecewiseLinear(80.6, 55.5, 150.4, 151, 200)) ///163.9==164

//--------------------*Dust AQI Calculator*-------------------------//
function calculateDustAQI(inputConcentration) {
    let resultAQI;
    let concentration = (Math.floor(10 * inputConcentration)) / 10;

    if (concentration >= 0 && concentration < 12.1) {
        resultAQI = piecewiseLinear(concentration, 0, 12, 0, 50)
    }
    else if (concentration >= 12.1 && concentration < 35.5) {
        resultAQI = piecewiseLinear(concentration, 12.1, 35.4, 51, 100)
    }
    else if (concentration >= 35.5 && concentration < 55.5) {
        resultAQI = piecewiseLinear(concentration, 35.5, 55.4, 101, 150)
    }
    else if (concentration >= 55.5 && concentration < 150.5) {
        resultAQI = piecewiseLinear(concentration, 55.5, 150.4, 151, 200)
    }
    else if (concentration >= 150.5 && concentration < 250.5) {
        resultAQI = piecewiseLinear(concentration, 150.5, 250.4, 201, 300)
    }
    else if (concentration >= 250.5 && concentration < 350.5) {
        resultAQI = piecewiseLinear(concentration, 250.5, 350.4, 301, 400)
    }
    else if (concentration >= 350.5 && concentration < 500.5) {
        resultAQI = piecewiseLinear(concentration, 350.5, 500.4, 401, 500)
    }
    else {
        resultAQI = "Out of range";
    }
    console.log("[calculateDustAQI]: c=" + concentration + " | AQI=" + resultAQI)
    return resultAQI;
}

//--------------------*CO AQI Calculator*-------------------------//
function calculateCOAQI(inputConcentration) {
    let resultAQI;
    let concentration = (Math.floor(10 * inputConcentration)) / 10;

    if (concentration >= 0 && concentration < 4.5) {
        resultAQI = piecewiseLinear(concentration, 0, 4.4, 0, 50)
    }
    else if (concentration >= 4.5 && concentration < 9.5) {
        resultAQI = piecewiseLinear(concentration, 4.5, 9.4, 51, 100)
    }
    else if (concentration >= 9.5 && concentration < 12.5) {
        resultAQI = piecewiseLinear(concentration, 9.5, 12.4, 101, 150)
    }
    else if (concentration >= 12.5 && concentration < 15.5) {
        resultAQI = piecewiseLinear(concentration, 12.5, 15.4, 151, 200)
    }
    else if (concentration >= 15.5 && concentration < 30.5) {
        resultAQI = piecewiseLinear(concentration, 15.5, 30.4, 201, 300)
    }
    else if (concentration >= 30.5 && concentration < 40.5) {
        resultAQI = piecewiseLinear(concentration, 30.5, 40.4, 301, 400)
    }
    else if (concentration >= 40.5 && concentration < 50.5) {
        resultAQI = piecewiseLinear(concentration, 40.5, 50.4, 401, 500)
    }
    else {
        resultAQI = "Out of range";
    }
    console.log("[calculateCOAQI]: c=" + concentration + " | AQI=" + resultAQI)
    return resultAQI;
}


//--------------------*Pollutant AQI to AQI Category Converter*-------------------------//
function calculateAQICategory(indexOfPollutant) {
    var categoryAQI;
    if (indexOfPollutant <= 50) {
        categoryAQI = "Good";
    }
    else if (indexOfPollutant > 50 && indexOfPollutant <= 100) {
        categoryAQI = "Moderate";
    }
    else if (indexOfPollutant > 100 && indexOfPollutant <= 150) {
        categoryAQI = "Unhealthy for Sensitive Groups";
    }
    else if (indexOfPollutant > 150 && indexOfPollutant <= 200) {
        categoryAQI = "Unhealthy";
    }
    else if (indexOfPollutant > 200 && indexOfPollutant <= 300) {
        categoryAQI = "Very Unhealthy";
    }
    else if (indexOfPollutant > 300 && indexOfPollutant <= 500) {
        categoryAQI = "Hazardous";
    }
    else {
        categoryAQI = "Out of Range";
    }
    // console.log("[calculateAQICategory]: pollutantIndex=" + indexOfPollutant +" | categoryAQI="+categoryAQI)
    return categoryAQI;
}
//------------------------//

function showFirebaseError(err) {
    console.log("[jamesDebug] Firebase Error : ")
    console.log(err)
    console.log("END OF: [jamesDebug] Firebase Error---- ")
}

function updateUserProfile(newName) {
    //---Update and set User Profile (displayName and photoURL)---
    // var user = firebase.auth().currentUser;
    aerUnited.getUserCredentials().updateProfile({
        displayName: newName
    }).then(function () {
        console.log("updateProfile successful")
    }).catch(function (error) {
        console.log("An error happened" + error)
    });
    //END OF: Update and set User Profile (displayName and photoURL)
}

function getRandomInt(min, max) {
    var min = Math.ceil(min);
    var max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getLatestDate(all_dates) {//get max date from a list of dates
    var max_dt = all_dates[0],
        max_dtObj = new Date(all_dates[0]);
    all_dates.forEach(function (dt, index) {
        if (new Date(dt) > max_dtObj) {
            max_dt = dt;
            max_dtObj = new Date(dt);
        }
    });
    console.log("[getLatestDate]: SUCESS- Latest date is: " + max_dt)
    return max_dt;//console.log(max_date(['2015-02-01', '2115-01-02', '2011-12-29'])); contoh jaawaban = 2115-01-02
}
//---------------------------Handle and Parse CSV---------------------------//
// Parse CSV string and Convert it to an Array
function parseCSVToArray(targetCSVString) {
    var parsedCSV = Papa.parse(targetCSVString, {
        dynamicTyping: true //automatically convert strings to integer/float/bool/etc.
    });
    // parsedCSV.data[0] //Access Only the data
    //  parsedCSV.data[0][10] //Access [outer firebase string = 0 (DONT CHANGE)][inner csv iterator]
    // console.log("[parsedCSV]: "+parsedCSV.data[0][0]) //Returns an array that contains the data proccessed form csv
    //ex: parsedCSV.data[0][0]= date | parsedCSV.data[0][1]= counter 

    //--Add to DataTables (if available)--//
    try {
        addCSVToDataTables(dataTableSensors, parsedCSV.data[0])
    } catch (err) {
        console.error("[addCSVToDataTables]:ERROR-Failed to add data to csv table: " + err)
    }

    //---


    return parsedCSV.data[0]
}

function addCSVToDataTables(targetDataTableVariable, parsedCSVData) {
    //Dont forget to clear datatables
    targetDataTableVariable.row.add(
        parsedCSVData
    ).draw();
}
function clearDataTables(targetDataTableVariable) {
    // Clearign datatable
    targetDataTableVariable.clear().draw();
    console.log("[clearDataTables]: Cleared DataTables")
}



//---------------------------Desktop Push Notifications---------------------------//
function pushNotificationWelcome() {
    Push.create("aerate", {
        body: "Ahoy! Welcome to aerate!",
        icon: '../../aerate-a-only-logo.png',
        timeout: 4000,
        onClick: function () {
            window.focus();
            this.close();
        }
    });
}
function pushNotificationWarning() {
    Push.create("WARNING: High Levels Detected!", {
        body: "High levels of a contaminant is detected in your room!",
        icon: '../../aerate-a-only-logo.png',
        timeout: 4000,
        onClick: function () {
            window.focus();
            this.close();
        }
    });
}

//---------------------------Chart.js Functionalities---------------------------//
//-----------Variable Manipulation for ChartJS related variables-----------//
function pushNewChartData(dataArrayForChart) {//TODO: This is still using GLOBAL variables, change to local variables//
    aerUnited.pushARDUINO_DATE(dataArrayForChart[0])
    aerUnited.pushARDUINO_counter(dataArrayForChart[1])
    aerUnited.pushMQ8_h2_ppm(dataArrayForChart[2])
    aerUnited.pushMQ2_smk_ppm(dataArrayForChart[3])
    aerUnited.pushMQ6_lpg_ppm(dataArrayForChart[4])
    aerUnited.pushMQ135_co2_ppm(dataArrayForChart[5])
    aerUnited.pushMQ7_co_ppm(dataArrayForChart[6])
    aerUnited.pushMQ3_alc_mgL(dataArrayForChart[7])
    aerUnited.pushDHT_temp_c(dataArrayForChart[8])
    aerUnited.pushDHT_hum(dataArrayForChart[9])
    aerUnited.pushSHARP_dust_ugm3(dataArrayForChart[10])
}

function clearAllChartDataArrays() {
    aerUnited.setARDUINO_DATE([]) //"Date"]
    aerUnited.setARDUINO_counter([]) //"Counter Arduino"]
    aerUnited.setMQ8_h2_ppm([])  //"h2 ppm"]
    aerUnited.setMQ2_smk_ppm([]) //"smoke ppm"]
    aerUnited.setMQ6_lpg_ppm([]) //"lpg ppm"]
    aerUnited.setMQ135_co2_ppm([]) //"c02 ppm"]
    aerUnited.setMQ7_co_ppm([])  //"co ppm"]
    aerUnited.setMQ3_alc_mgL([]) //"alcohol mg/L"]
    aerUnited.setDHT_temp_c([])  //"temperature C"]
    aerUnited.setDHT_hum([])  //"Humidity %"]
    aerUnited.setSHARP_dust_ugm3([]) //"dust density ug/m3"]
    console.log('[clearAllChartDataArrays] SUCCESS-cleared all previous chart data arrays')
    // iziToast.success({ message: '[clearAllChartDataArrays] SUCCESS-cleared all previous chart data arrays' });
}

function refreshAllChartData(chartName) {//TODO: This is still using GLOBAL variables, change to local variables//
    replaceChartDatasetLabel(chartName, aerUnited.getARDUINO_DATE())
    // replaceChartDatasetLabel(chartName, aerUnited.getARDUINO_counter());//Disabled arduino counter (used only for debugging)
    replaceChartDatasetData(chartName, 0, aerUnited.getMQ8_h2_ppm());
    replaceChartDatasetData(chartName, 1, aerUnited.getMQ2_smk_ppm());
    replaceChartDatasetData(chartName, 2, aerUnited.getMQ6_lpg_ppm());
    replaceChartDatasetData(chartName, 3, aerUnited.getMQ135_co2_ppm());
    replaceChartDatasetData(chartName, 4, aerUnited.getMQ7_co_ppm());
    replaceChartDatasetData(chartName, 5, aerUnited.getMQ3_alc_mgL());
    replaceChartDatasetData(chartName, 6, aerUnited.getDHT_temp_c());
    replaceChartDatasetData(chartName, 7, aerUnited.getDHT_hum());
    replaceChartDatasetData(chartName, 8, aerUnited.getSHARP_dust_ugm3());

    console.log("[refreshAllChartData]: SUCCESS-Unloaded ALL old data and loaded ALL new Data to the chart")
    // iziToast.success({ message: '[refreshAllChartData]: SUCCESS-Unloaded ALL old data and loaded ALL new Data to the chart' });
}

//--GET AVERAGE DATA FROM DATES--//
//TODO: 
function getAverageDataFromDates() {
    //WARNING: Dont forget to clear the chart before calling this function//
    let historicalData = {}
    try {
        console.log(Object.keys(aerUnited.getDatabaseRaw()))

        var regexDate = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
        //Access every entry in arduino/raw db //
        for (var i = 0; i < Object.keys(aerUnited.getDatabaseRaw()).length; i++) {//Iterate raw database folders that are full of dates
            //Check if entry is "yyyy-mm-dd", if yes then:
            if (Object.keys(aerUnited.getDatabaseRaw())[i].match(regexDate)) {//access per date level
                let currentDate = Object.keys(aerUnited.getDatabaseRaw())[i]

                //Access Parent folder (ex:2020-03-03)
                let targetParentFolder = aerUnited.getDatabaseRaw()[currentDate]//main folder access

                //Setup temp variables to store data from current date before calculating mean for the date
                let tempARDUINO_DATE = []
                let tempARDUINO_counter = []
                let tempMQ8_h2_ppm = []
                let tempMQ2_smk_ppm = []
                let tempMQ6_lpg_ppm = []
                let tempMQ135_co2_ppm = []
                let tempMQ7_co_ppm = []
                let tempMQ3_alc_mgL = []
                let tempDHT_temp_c = []
                let tempDHT_hum = []
                let tempSHARP_dust_ugm3 = []


                //Access Child folder using the keys (ex:2020-03-03/dateTtime)
                for (let j = 0; j < Object.keys(targetParentFolder).length; j++) {
                    // console.log("child[" + j + "]]")

                    let currentChild = targetParentFolder[Object.keys(targetParentFolder)[j]]
                    // console.log(currentChild)

                    //Parse the CSV string into an array
                    let parsedCSV = Papa.parse(currentChild, {
                        dynamicTyping: true //automatically convert strings to integer/float/bool/etc.
                    });
                    // console.log(parsedCSV.data[0]); //result nya

                    //Add individual sorted data from current date into individual temporary arrays to process for mean/
                    tempARDUINO_DATE.push(parsedCSV.data[0][0])
                    tempARDUINO_counter.push(parsedCSV.data[0][1])
                    tempMQ8_h2_ppm.push(parsedCSV.data[0][2])
                    tempMQ2_smk_ppm.push(parsedCSV.data[0][3])
                    tempMQ6_lpg_ppm.push(parsedCSV.data[0][4])
                    tempMQ135_co2_ppm.push(parsedCSV.data[0][5])
                    tempMQ7_co_ppm.push(parsedCSV.data[0][6])
                    tempMQ3_alc_mgL.push(parsedCSV.data[0][7])
                    tempDHT_temp_c.push(parsedCSV.data[0][8])
                    tempDHT_hum.push(parsedCSV.data[0][9])
                    tempSHARP_dust_ugm3.push(parsedCSV.data[0][10])
                    //--//

                }
                //PRINT THE DATA NECESSARY TO BE EXTRACTED
                console.error("jamesKul")
                console.log(tempMQ2_smk_ppm)
                console.log("smokeme:" +roundToTwo(calculateTruncatedMean(tempMQ2_smk_ppm)))
                console.log("smokeme2:" +(calculateTruncatedMean(tempMQ2_smk_ppm)))
                //---Truncated mean---//
                var meanValues = {//Object of Mean Values
                    // console.log("mean from cleaned array: " + calculateTruncatedMean(tempARDUINO_DATE))
                    // console.log("mean from cleaned array: " + calculateTruncatedMean(tempARDUINO_counter))

                    MQ8_h2_ppm: roundToTwo(calculateTruncatedMean(tempMQ8_h2_ppm)),
                    MQ2_smk_ppm: roundToTwo(calculateTruncatedMean(tempMQ2_smk_ppm)),
                    MQ6_lpg_ppm: roundToTwo(calculateTruncatedMean(tempMQ6_lpg_ppm)),
                    MQ135_co2_ppm: roundToTwo(calculateTruncatedMean(tempMQ135_co2_ppm)),
                    MQ7_co_ppm: roundToTwo(calculateTruncatedMean(tempMQ7_co_ppm)),
                    MQ3_alc_mgL: roundToTwo(calculateTruncatedMean(tempMQ3_alc_mgL)),
                    DHT_temp_c: roundToTwo(calculateTruncatedMean(tempDHT_temp_c)),
                    DHT_hum: roundToTwo(calculateTruncatedMean(tempDHT_hum)),
                    SHARP_dust_ugm3: roundToTwo(calculateTruncatedMean(tempSHARP_dust_ugm3))
                };
                //--//
                historicalData[currentDate] = meanValues;
                console.log("[getAverageDataFromDates] SUCCESSFUL-getting " + currentDate)
            } else {
                console.log("[getAverageDataFromDates] WARNING-Not a date: " + Object.keys(aerUnited.getDatabaseRaw())[i])
            }

        }


    } catch (err) {
        iziToast.error({ message: "Failed to default to getAverageDataFromDates" + err });
        console.log("Failed to default to getAverageDataFromDates" + err)
    }//TODO: Change the calendar date on the dashboardhumidex explanation
    return historicalData;
}

function roundToTwo(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
}
function calculateTruncatedMean(targetSensorData) {
    //Filter all the outliers and get the cleaned array without outliers
    let cleanedArray = targetSensorData.filter(outliers())
    // console.log("Cleaned Array")
    // console.log(cleanedArray);

    //Calculate mean from cleaned array
    let total = 0;
    for (let i = 0; i < cleanedArray.length; i++) {
        total += cleanedArray[i]
    }
    let mean = (total / cleanedArray.length)
    // console.log("[calculateTruncatedMean]: SUCCESS-Removed " + (targetSensorData.length - cleanedArray.length) + " outliers | Mean= " + mean)
    return mean
}















//-----------IMPORTANT: Push Data From Date Chosen to Chart Array inside the AerateUnified Class-----------//
function pushDataFromDateToChartArray(targetDate) {//TODO: move this to aerateUnified??
    //WARNING: Dont forget to clear the chart before calling this function//

    //Checking firebase/arduino/raw in the aerateUnified object for targetDate parent folder
    if (Object.keys(aerUnited.getDatabaseRaw()).includes(targetDate)) {//If targetDate is found in firebase/arduino/raw

        for (var i = 0; i < Object.keys(aerUnited.getDatabaseRaw()[targetDate]).length; i++) {//Iterate through database to print one by one
            pushNewChartData(parseCSVToArray(aerUnited.getDatabaseRaw()[targetDate][Object.keys(aerUnited.getDatabaseRaw()[targetDate])[i]]))
        }
        console.log("[pushDataFromDateToChartArray()]: SUCCESS-Loaded to the class from DatabaseRaw to individual data arrays in the AerateUnified class for the date: " + targetDate)
        // iziToast.success({ message: '[pushDataFromDateToChartArray()]: SUCCESS-Loaded to the class from DatabaseRaw to individual data arrays in the AerateUnified class for the date: " + targetDate' });
    } else {
        console.warn("Failed to find targetDate: " + targetDate)
        //if failed, default to getting the latest date
        console.warn("Defaulting to getting the latest date: ")
        try {
            let latestDate = getLatestDate(Object.keys(aerUnited.getDatabaseRaw()))//TODO: DOING ME!
            for (var i = 0; i < Object.keys(aerUnited.getDatabaseRaw()[latestDate]).length; i++) {//Iterate through database to print one by one
                pushNewChartData(parseCSVToArray(aerUnited.getDatabaseRaw()[latestDate][Object.keys(aerUnited.getDatabaseRaw()[latestDate])[i]]))
            }
            updateCalendarInputTextToLatestDate(latestDate)

            iziToast.info({
                timeout: 12000,
                // overlay: true,
                // overlayClose: true,
                displayMode: 'once',
                title: "Data for chosen date (" + targetDate + ") is not found",
                message: "So the latest date (" + latestDate + ") in the database is loaded instead.",
                // position: 'center',
                titleColor: "#f7fafc",
                messageColor: "#f7fafc",
                iconColor: "#f7fafc",
                color: "#4e73df"
            });

        } catch (err) {
            iziToast.error({ message: "Failed to default to getting the latest date" + err });
            console.log("Failed to default to getting the latest date" + err)
        }//TODO: Change the calendar date on the dashboardhumidex explanation
    }
}
function updateCalendarInputTextToLatestDate(latestDate) {
    //inputTargetDate must exist.
    try {
        // document.getElementById("inputTargetDate").value = latestDate
        document.getElementById("inputTargetDate").value = new Date(latestDate).toDateString();

        //TODO: Add Popper here!!!!!!
        console.log("[updateCalendarInputTextToLatestDate] SUCCESS-Updated the page calendar input text ")
    } catch (err) {
        console.error("[updateCalendarInputTextToLatestDate] FAILED-maybe the element doesnt exist in the page or something else: " + err)
    }

}

//-----------Create Customized Chart Dataset With James Preferences-----------//
function createChartDataset(labelInput, dataInput, borderColorInput, backgroundColorInput) {
    return {
        label: labelInput,  //Top label for data type//
        data: dataInput, //,//Each data corresponds to the data input for the label earlier

        borderColor: borderColorInput,
        backgroundColor: backgroundColorInput,

        fill: true,
        borderWidth: 1//Border of each chart
    }
}

function createHiddenChartDataset(labelInput, dataInput, borderColorInput, backgroundColorInput) {
    return {
        label: labelInput,  //Top label for data type//
        data: dataInput, //,//Each data corresponds to the data input for the label earlier
        hidden: true,
        borderColor: borderColorInput,
        backgroundColor: backgroundColorInput,

        fill: true,
        borderWidth: 1//Border of each chart
    }
}

//-----------Replace Chart Dataset Label (label is a string array type)-----------//
function replaceChartDatasetLabel(chart, newDataArray) {//chart, label, data
    chart.data.labels = newDataArray
    chart.update();
    console.log("[replaceChartDatasetLabel]: SUCCESS-Replaced the labels on the chart chosen")
}
//-----------Replace Chart Dataset Data (data is a dataset type)-----------//
function replaceChartDatasetData(chart, indexOfDataset, newDataArray) {//chart, label, data
    try {
        chart.data.datasets[indexOfDataset].data = newDataArray //if the index is undifined tell me
    } catch (err) {
        console.error("[replaceChartDatasetData] ERROR happened while replacing dataset on index: " + indexOfDataset)
        console.warn(err)
    }

    chart.update();
    // console.log("[replaceChartDatasetData] SUCCESS-Replaced the Dataset with index [" + indexOfDataset + "] on the chosen chart")
}

//Push chart data dynamically pushDynamicChartDataset(arg1,arg2,arg3,...)
function pushDynamicChartDataset() {//arguments are dynamic(arg1,arg2,arg3,...)
    var columnData = []//variable store arguments
    for (var i = 2; i < arguments.length; i++) {//iterate through arguments
        columnData.push(arguments[i]);//push arguments to the column variable
    }

    //Setup Labels
    arguments[0].data.labels = arguments[1]//Dataset label is an array, not a dataset

    //Setup Dataset
    arguments[0].data.datasets = columnData //columnData INPUTS ARE DATASETS, NOT ARRAYS
    arguments[0].update();

    console.log("[pushDynamicChartDataset] SUCCESS-Pushed to the chosen chart")
}
//-----------Individual chart data adding [Depreceated?]-----------//
function addChartLabel(chart, label) {//Push a single new LABEL ONLY into a dataset inside a chart
    //Add label to chart
    chart.data.labels.push(label);
    chart.update();
}

function addChartData(chart, data, targetDataSet) {//Push a single new DATA ONLY into a dataset inside a chart
    //Make sure the label is created already before pushing
    chart.data.datasets[targetDataSet].data.push(data)
    chart.update();
    console.log("pushed and updated " + data + " to " + targetDataSet)
    iziToast.success({ message: "pushed and updated " + data + " to " + targetDataSet });
    //console.log("James Added: " + data)
}
function addChartDataWithLabel(chart, targetDataSet, data, label) {//Push a single new data into a dataset with a label inside a chart

    addChartData(chart, data, targetDataSet);
    addChartLabel(chart, label);
    console.log("[addChartDataWithLabel]:added " + data + " to " + targetDataSet + " with label " + label);
}
function pushAdditionalChartDatasetData(chart, dataSet) {//Push a single new DATASET to chart
    chart.data.datasets.push(dataSet)
    chart.update();
    console.log("[pushAdditionalChartDatasetData]: Pushed new dataSet to chosen chart: ")
}
//------OFFICIAL Chart.js Functions [DEPRECEATED: REPLACED WITH MY OWN CUSTOM FUNCTIONS]------//
function removeChartLatestData(chart) {//Official way of removing chart data (customized a bit)
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}
// function addData(chart, label, data) {//Official way of adding chart data
//     chart.data.labels.push(label);
//     chart.data.datasets.forEach((dataset) => {
//         dataset.data.push(data);
//     });
//     chart.update();
// }
// function updateChartConfigByMutating(chart) {//Official way of updating chart configs by mutating
//     //Contoh ganti title
//     chart.options.title.text = "kuntuuuuuuuuuuuuul";
//     chart.update();
// }
// function updateConfigAsNewObject(chart) {//Official way of updating chart configs as a new object chart data
//     chart.options = {
//         responsive: true,
//         title: {
//             display: true,
//             text: 'Chart.js'
//         },
//         scales: {
//             xAxes: [{
//                 display: true
//             }],
//             yAxes: [{
//                 display: true
//             }]
//         }
//     };
//     chart.update();
//     console.log("Created new object as the chart")
// }
//END OF: OFFICIAL Chart.js Functions//

//-----------ChartJs Return String-----------//
function getAllRawDataString() {
    var currentDatabaseInString = "";
    try {
        if (Object.keys(aerUnited.getDatabaseRaw()).length != null) {
            iziToast.success({ message: 'loading...' });
            console.log("loading stored aerUnited.getDatabaseRaw() db")
            //Checking firebase/arduino/raw for targetDate parent folder
            for (var i = 0; i < Object.keys(aerUnited.getDatabaseRaw()).length; i++) {//Iterate through database to print one by one
                //Check inner database (INDIVIDUAL DATE database)
                currentDatabaseInString += ("[" + Object.keys(aerUnited.getDatabaseRaw())[i] + "]: " + aerUnited.getDatabaseRaw()[Object.keys(aerUnited.getDatabaseRaw())[i]] + "</br>")
            }
        }
    } catch (err) {
        iziToast.error({ message: 'The database is not fully loaded yet' });
        console.log("The database is not fully loaded yet" + err)
    }
    console.log(currentDatabaseInString)
    return currentDatabaseInString
}
function getDataFromDateString(targetDate) {
    var currentDatabaseInString = "";
    try {
        if (Object.keys(aerUnited.getDatabaseRaw()).length != null) {
            //Checking firebase/arduino/raw for targetDate parent folder
            if (Object.keys(aerUnited.getDatabaseRaw()).includes(targetDate)) {//If targetDate is found in firebase/arduino/raw
                iziToast.success({ message: 'loading...' });

                console.log("Found " + targetDate)
                console.log(aerUnited.getDatabaseRaw()[targetDate])

                for (var i = 0; i < Object.keys(aerUnited.getDatabaseRaw()[targetDate]).length; i++) {//Iterate through database to print one by one
                    //Check inner database (INDIVIDUAL DATE database)
                    currentDatabaseInString += ("[" + Object.keys(aerUnited.getDatabaseRaw()[targetDate])[i] + "]: " + aerUnited.getDatabaseRaw()[targetDate][Object.keys(aerUnited.getDatabaseRaw()[targetDate])[i]] + "</br>")
                }
                iziToast.success({ message: 'Found' });
            } else {
                iziToast.error({ message: "Failed to find targetDate: " + targetDate });
                console.log("Failed to find targetDate: " + targetDate)
            }
        }
    } catch (err) {
        iziToast.error({ message: 'The database is not fully loaded yet' });
        console.log('The database is not fully loaded yet' + err)
    }
    return currentDatabaseInString
}
//---MISC---//
function goToHumidexPage()  {
    window.location.href = 'sensor-temp-hum.html';
}
function goToCOPage()  {
    window.location.href = 'sensor-co.html';
}
function goToCO2Page()  {
    window.location.href = 'sensor-co2.html';
}
function goToDustPage()  {
    window.location.href = 'sensor-dust.html';
}

//--------------------------------------------------LOAD FIREBASE Auth and Database--------------------------------------------------//
//moved functionality into aerateUnified() class
//-------------------------Runner-------------------------//
let aerUnited = new AerateUnified();//Create class for loading firebase and its functions
//------------Runtime------------//
// function loadChartAtStartup() { //DEPRECEATED, moved to doWhenDatabaseRawIsUpdated()//
// // Setup interval to try to load chart and refresh every 1 second at startup
//     //Setup interval to try to load chart on target date and refresh every 1 second
//     return setInterval(function () {
//         console.log("[doSomethingAtStartup]: Doing something at startup..")
//         if (someBoolean == true) {
//             clearInterval(doSomethingAtStartup);
//             console.log("doSomethingAtStartup cleared")
//         }
//     }, 1000);
// }
// var doSomethingAtStartup = loadChartAtStartup()
console.log("[unified.js]: Loaded and aerUnited created")