//James Adhitthana//
class AerateUnified {//Main Object//

    //How it works:
    //Declare AerateUnified
    //Then use the class to do stuff on.
    constructor() {

        //They say it is bad practice to call its own function on the constructor//
        //However since we are working with dynamic contents, we must call its own function in the constructor//
        //This is because the constructor creates objects that listens to changes in the auth & db//
        //Therefore, when the auth/db is changed, the function created in the constructor will run again//
        //Therefore this is why I decided to call its own function//
        //-James Adhitthana//
        //---------------Firebase Auth---------------//
        var auth = firebase.auth();
        var userCredentials = null;
        auth.onAuthStateChanged(function (user) {//Listen if user is logged in//
            if (user) { //If a user is logged in
                //List of user variables: name, email, photoUrl, uid, emailVerified;
                userCredentials = user
                aerUnited.setUserCredentials(user); //dynamically change

                console.group("--[fbAuth]: " + user.email + " Logged in--")
                console.log("  Name: " + user.displayName);
                console.log("  Email: " + user.email);
                console.log("  Photo URL: " + user.photoURL);
                console.log("  UID: " + user.uid);
                console.log("  emailVerified: " + user.emailVerified);
                console.groupEnd()
                iziToast.success({ message: "Welcome back "+ user.displayName+"!" });
                //iziToast.success({ message: user.email + " (" + user.uid + ") is logged in." });

                //---------User Profile Information [previously databaseUser]---------//
                //Try to execute abstract function (must have this function on every page that needs it)
                try {//TODO: Replace user database functionalities here
                    doWhenAuthIsUpdated()//REPLACE THIS for EVERY PAGE (basically acts as an abstract function)
                    console.log("[doWhenAuthIsUpdated()]: SUCCESSFUL")
                } catch (err) {
                    console.error("doWhenAuthIsUpdated() is not implemented in the page OR something else is wrong-James")
                    console.warn(err)
                    // iziToast.error({ message: "doWhenAuthIsUpdated() is not implemented in the page OR something else is wrong" });
                    iziToast.error({ message: "Oops, an error happened while updating your auth! Please wait a couple seconds and refresh the page." });
                }
            } else { //If no user
                aerUnited.setUserCredentials(null);//dynamically change
                console.log("[fbAuth]: No user is logged in")
                iziToast.info({ message: "Login to enjoy all of aerate's functionalities" });
            }

            // //---------User Profile Information [previously databaseUser]---------//
            // //Try to execute abstract function (must have this function on every page that needs it)
            // try {//TODO: Replace user database functionalities here
            //     doWhenAuthIsUpdated()//REPLACE THIS for EVERY PAGE (basically acts as an abstract function)
            //     console.log("[doWhenAuthIsUpdated()]: SUCCESSFUL")
            // } catch (err) {
            //     console.error("doWhenAuthIsUpdated() is not implemented in the page OR something else is wrong-James")
            //     console.warn(err)
            //     iziToast.error({ message: "doWhenAuthIsUpdated() is not implemented in the page OR something else is wrong" });
            // }
        })




        //---------------Firebase Realtime Database---------------//
        var db = firebase.database();//Load main database//
        //databaseTarget.once('value', doSomething);
        // function doSomething(data) {...}
        //databaseTarget.on('value', doAnotherThing, showFirebaseError);
        // function doAnotherThing(data) {...}
        //databaseTarget.on('child_added', doSomethingElse);
        // function addDataFirebase() {...}

        //-on value (listens for ANY SMALL changes)//
        // databaseKu.on('value', showUserDBData, showFirebaseError);
        // function showUserDBData(data) {
        //     console.log("Loaded the most updated user database successfuly!")
        //     console.log(data.val())
        // }
        //-on child_added (loads once unless there is a new child)//
        // databaseKu.on('child_added', addDataFirebase);
        // function addDataFirebase() {
        //     console.log("Added databaseKu data")
        // }


        //---------Database: Logs---------//
        //---Read Value from Logs Database---//
        var databaseRawListener = db.ref("arduino/raw");
        var databaseRaw = null;//set the variable for the object being returned
        var databaseLoaded = false;
        //-on value (LISTENS for ANY SMALL changes)//
        databaseRawListener.on('value', updateDatabaseRaw, showFirebaseError);//on value callback
        function updateDatabaseRaw(data) {
            //Try to update databaseRaw with new data from Firebase
            try {
                databaseRaw = data.val()
                aerUnited.setDatabaseRaw(data.val());
                aerUnited.setDatabaseLoaded(true);
                databaseLoaded = true;
                console.log("[databaseRawListener]: SUCCESS-Updated databaseRaw with new data from Firebase");
            } catch (err) {
                console.log("[databaseRawListener]: FAILED-failed to update databaseRaw with new data from Firebase");
            }

            //Try to execute abstract function (must have this function on every page that needs it)
            try {//TODO: Replace dynamic Chart capabilities here.
                //This section will load data into the charts according to the date that is chosen on the page/
                if (Object.keys(aerUnited.getDatabaseRaw()).length != null) {//If database is loaded
                    try {
                        //Clear chart data arrays before loading a new data array with the specified target date
                        clearAllChartDataArrays();
                    }
                    catch (err) {
                        iziToast.error({ message: 'The database is not fully loaded yet or error: ' + err });
                        console.error('The database is not fully loaded yet')
                        console.warn(err)
                    }
                }


                doWhenDatabaseRawIsUpdated()//REPLACE THIS for EVERY PAGE (basically acts as an abstract function)
                //TODO: Extract doWhen so that the loading part is here instead of being in the thing


                console.log("[doWhenDatabaseRawIsUpdated()]: SUCCESSFUL")
            } catch (err) {
                console.error("doWhenDatabaseRawIsUpdated() is not implemented in the page OR something else is wrong-James")
                console.warn(err)
                iziToast.error({ message: "Failed to load database (bad internet connection), please wait a few seconds then click the 'Reload Database' button" });
                // iziToast.error({ message: "doWhenDatabaseRawIsUpdated() is not implemented in the page OR something else is wrong" });
            }
        }

        //END OF: Read Value from Logs Database--//

        //Set variables in constructor//
        this.auth = auth;
        this.userCredentials = userCredentials;
        this.db = db;//main firebase db object
        this.databaseRaw = databaseRaw;
        this.databaseLoaded = databaseLoaded

        //Create Chart Array to be loaded in chart and fill it with placeholder data
        this.ARDUINO_DATE = ["date1", "date2", "date3"]//"Date"]
        this.ARDUINO_counter = [9, 19]//"Counter Arduino"]
        this.MQ8_h2_ppm = [1, 2]//"h2 ppm"]
        this.MQ2_smk_ppm = [3, 4]//"smoke ppm"]
        this.MQ6_lpg_ppm = [5, 6]//"lpg ppm"]
        this.MQ135_co2_ppm = [7, 8]//"c02 ppm"]
        this.MQ7_co_ppm = [9, 10]//"co ppm"]
        this.MQ3_alc_mgL = [11, 12]//"alcohol mg/L"]
        this.DHT_temp_c = [13, 14]//"temperature C"]
        this.DHT_hum = [15, 16]//"Humidity %"]
        this.SHARP_dust_ugm3 = [17, 18]//"dust density ug/m3"]
    }
    //---Setter Getter for Constructors---//
    getUserName() {
        return this.userCredentials.displayName;
    }
    getUserEmail() {
        return this.userCredentials.email
    }
    getUserPhotoUrl() {
        return this.userCredentials.photoURL;
    }
    getUserEmailVerified() {
        return this.userCredentials.emailVerified;
    }
    getUserUID() {
        return this.userCredentials.uid
    }


    getAuth() {
        return this.auth;
    }
    getUserCredentials() {
        return this.userCredentials;
    }

    getDB() {
        return this.db;
    }
    getDatabaseRaw() {
        return this.databaseRaw;
    }

    getDatabaseLoaded() {
        return this.databaseLoaded;
    }
    setUserCredentials(userCredentials) {
        this.userCredentials = userCredentials;
    }
    setDB(db) {
        this.db = db;
    }
    setDatabaseRaw(databaseRaw) {
        this.databaseRaw = databaseRaw;
    }

    setDatabaseLoaded(databaseLoaded) {
        this.databaseLoaded = databaseLoaded;
    }

    //--Data Array Manipulation Functions-//
    getARDUINO_DATE() {
        return this.ARDUINO_DATE;
    }
    getARDUINO_counter() {
        return this.ARDUINO_counter;
    }
    getMQ8_h2_ppm() {
        return this.MQ8_h2_ppm;
    }
    getMQ2_smk_ppm() {
        return this.MQ2_smk_ppm;
    }
    getMQ6_lpg_ppm() {
        return this.MQ6_lpg_ppm;
    }
    getMQ135_co2_ppm() {
        return this.MQ135_co2_ppm;
    }
    getMQ7_co_ppm() {
        return this.MQ7_co_ppm;
    }
    getMQ3_alc_mgL() {
        return this.MQ3_alc_mgL;
    }
    getDHT_temp_c() {
        return this.DHT_temp_c;
    }
    getDHT_hum() {
        return this.DHT_hum;
    }
    getSHARP_dust_ugm3() {
        return this.SHARP_dust_ugm3;
    }
    //-
    getLatestARDUINO_DATE() {
        return this.ARDUINO_DATE[this.ARDUINO_DATE.length - 1];
    }
    getLatestARDUINO_counter() {
        return this.ARDUINO_counter[this.ARDUINO_counter.length - 1];
    }
    getLatestMQ8_h2_ppm() {
        return this.MQ8_h2_ppm[this.MQ8_h2_ppm.length - 1];
    }
    getLatestMQ2_smk_ppm() {
        return this.MQ2_smk_ppm[this.MQ2_smk_ppm.length - 1];
    }
    getLatestMQ6_lpg_ppm() {
        return this.MQ6_lpg_ppm[this.MQ6_lpg_ppm.length - 1];
    }
    getLatestMQ135_co2_ppm() {
        return this.MQ135_co2_ppm[this.MQ135_co2_ppm.length - 1];
    }
    getLatestMQ7_co_ppm() {
        return this.MQ7_co_ppm[this.MQ7_co_ppm.length - 1];
    }
    getLatestMQ3_alc_mgL() {
        return this.MQ3_alc_mgL[this.MQ3_alc_mgL.length - 1];
    }
    getLatestDHT_temp_c() {
        return this.DHT_temp_c[this.DHT_temp_c.length - 1];
    }
    getLatestDHT_hum() {
        return this.DHT_hum[this.DHT_hum.length - 1];
    }
    getLatestSHARP_dust_ugm3() {
        return this.SHARP_dust_ugm3[this.SHARP_dust_ugm3.length - 1];
    }
    //--
    pushARDUINO_DATE(dataArrayForChart) {
        this.ARDUINO_DATE.push(dataArrayForChart);
    }
    pushARDUINO_counter(dataArrayForChart) {
        this.ARDUINO_counter.push(dataArrayForChart)
    }
    pushMQ8_h2_ppm(dataArrayForChart) {
        this.MQ8_h2_ppm.push(dataArrayForChart)
    }
    pushMQ2_smk_ppm(dataArrayForChart) {
        this.MQ2_smk_ppm.push(dataArrayForChart)
    }
    pushMQ6_lpg_ppm(dataArrayForChart) {
        this.MQ6_lpg_ppm.push(dataArrayForChart)
    }
    pushMQ135_co2_ppm(dataArrayForChart) {
        this.MQ135_co2_ppm.push(dataArrayForChart)
    }
    pushMQ7_co_ppm(dataArrayForChart) {
        this.MQ7_co_ppm.push(dataArrayForChart)
    }
    pushMQ3_alc_mgL(dataArrayForChart) {
        this.MQ3_alc_mgL.push(dataArrayForChart)
    }
    pushDHT_temp_c(dataArrayForChart) {
        this.DHT_temp_c.push(dataArrayForChart)
    }
    pushDHT_hum(dataArrayForChart) {
        this.DHT_hum.push(dataArrayForChart)
    }
    pushSHARP_dust_ugm3(dataArrayForChart) {
        this.SHARP_dust_ugm3.push(dataArrayForChart)
    }
    //-//
    setARDUINO_DATE(dataArrayForChart) {
        this.ARDUINO_DATE = dataArrayForChart;
    }
    setARDUINO_counter(dataArrayForChart) {
        this.ARDUINO_counter = dataArrayForChart;
    }
    setMQ8_h2_ppm(dataArrayForChart) {
        this.MQ8_h2_ppm = dataArrayForChart;
    }
    setMQ2_smk_ppm(dataArrayForChart) {
        this.MQ2_smk_ppm = dataArrayForChart;
    }
    setMQ6_lpg_ppm(dataArrayForChart) {
        this.MQ6_lpg_ppm = dataArrayForChart;
    }
    setMQ135_co2_ppm(dataArrayForChart) {
        this.MQ135_co2_ppm = dataArrayForChart;
    }
    setMQ7_co_ppm(dataArrayForChart) {
        this.MQ7_co_ppm = dataArrayForChart;
    }
    setMQ3_alc_mgL(dataArrayForChart) {
        this.MQ3_alc_mgL = dataArrayForChart;
    }
    setDHT_temp_c(dataArrayForChart) {
        this.DHT_temp_c = dataArrayForChart;
    }
    setDHT_hum(dataArrayForChart) {
        this.DHT_hum = dataArrayForChart;
    }
    setSHARP_dust_ugm3(dataArrayForChart) {
        this.SHARP_dust_ugm3 = dataArrayForChart;
    }
    //----//

}