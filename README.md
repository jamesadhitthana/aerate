<div align="center">
<a href="https://aerate.web.app/"><img src="https://raw.githubusercontent.com/jamesadhitthana/aerate/main/Source%20Code%20-%20Web%20App/aerate-a-only-logo.png?token=AINQE252Z5HX6QFZJNXDNQK7RA7OE" alt="Ducktionary Icon" width="100" height="100"></a>
<h1 >aerate</h1>
<p ><sup><b>A cloud-based IoT and Web Application for indoor air quality monitoring using Arduino </b></sup></p>
</div>

![aerate-poster-cropped](https://raw.githubusercontent.com/jamesadhitthana/aerate/main/Documentation/James%20Adhitthana%20-%20aerate%20Poster%20-%20cropped.jpg?token=AINQE23PEVUTNR56DMQ7HBC7RCDJ2)

# Introduction

Did you know the air quality indoors matters as much as the quality of air outdoors? Bad indoor air quality has been linked to debilitating effects, most commonly, lung diseases, stroke, heart disease, and even lung cancer. Not only that, but bad indoor air quality may affect your ability to focus and work. The worst part is, most of these bad things floating around in your room are odorless and invisible to the naked eye.

## Introducing aerate

Aerate is a user-friendly cloud-based web application and hardware device that visualizes and informs you of the air quality in your room caused by exposure to dust particles, gasses, chemicals, and more! The application allows monitoring of your room while visualizing it in colorful, user-friendly graphics and even provides tips on increasing air quality! The app also acts as an alarm if a pollutant in your room passes a dangerous threshold.
Working using cloud technology, the app works on all your devices and can be used even when you are not at home, keeping your family safe from dangerous air. 

#### Here is the big picture of aerate:

![aerate-big-picture](https://raw.githubusercontent.com/jamesadhitthana/aerate/main/Documentation/big%20picture%20-%20aerate%20james%20adhitthana.PNG?token=AINQE27SD77XLLRNLTDN3E27RA6HO)

## Features:

### 🏡 Understand Your Indoor Air Quality

Using simple overview icons, US AQI, and air quality scores, aerate allows you to monitor the pollutants in your room and provide improvement tips to increase the air quality in your room.

### 🧖 Get Your Room's Discomfort Levels & Humidex

Did you know that the temperature and humidity inside your room affects your overall comfort level? Aerate can calculate the humidex (what the temperature "feels like" on your skin) and calculate the comfort score to help you shape your room to the upmost optimal conditions.

### 📊 Colorful and Helpful Graphics

Aerate provides easy to understand graphics for everything! You can view how much your air has improved using the historical data graphs, use gauges just like your car's speed gauge to understand if pollutant levels are currently dangerous or not, view real-time pollutant data color-coded on graphs, and much more!

### 😍 Optimizing air quality made easy!

Designed to be user-friendly, aerate provides two viewing options. The first is "Simple Dashboard" view, where you can view a summary of the vital information about your air quality and get tips on improving it. The second is "Dashboard for Experts," designed for people who want to know in-depth information about the current air quality.

### 🧹 Monitors Dust & Particulate Matter (PM2.5)

Aerate detects small particles invisible to the naked eye small enough to be breathed into your lungs and absorbed into the bloodstream. Long term research has proven that PM2.5 increases risk of stroke, cancers, heart attack, and birth-defects.

### 🏭 Monitors Carbon Dioxide (CO2)

Aerate detects CO2 which is an odourless, colourless gas produced naturally and artificially through human activities. High levels of CO2 is responsible for making crowded rooms feel uncomfortable and even impair the ability to think clearly since CO2 from people's breath can be 2.5 times more than the air outside.

### ☠️ Monitors Carbon Monoxide (CO)

Aerate detects Carbon Monoxide, a poisonous gas that is colorless and odorless that is usually formed from cooking fuels, vehicles, cigarette smoke, and water heaters. Breathing carbon monoxide will cause dizziness, tiredness and confusion, memory loss, and can even be fatal if the dosage is high enough.

### 🔥 Monitors Flammable Gasses

Colorless and odorless, flammable gases can quickly spread and fill a room. Inhaling these gases intoxicates you and causes increased blood pressure, increased heart rate, impaired coordination, disorientation, and hallucinations. Aerate detects these gasses and sets an alarm and sends notifications when the gasses are detected.

### 🚬 Monitors Smoke

Constant exposure to smoke is correlated to heart and lung disease. Aerate can detect the compilation of small solids, chemicals, gas particles, and liquids that make up smoke.

### 🧪 Monitors Common Hazardous Substances Produced/Involved in Labs

Chemicals in experimentations involved may displace oxygen in a room and cause difficulty breathing and gas poisoning. Aerate comes with an alcohol and hydrogen (H2) sensor to detect dangerous levels of these used experimentation materials/byproducts.

# Hardware: Arduino

![aerate-hardware-gallery](https://raw.githubusercontent.com/jamesadhitthana/aerate/main/Documentation/hardware%20aerate%20james%20adhitthana.PNG?token=AINQE25IGVJUBHVKCWLEFX27RCCYG)

# Software: Aerate Web App Dashboard

![aerate-software-gallery](https://raw.githubusercontent.com/jamesadhitthana/aerate/main/Documentation/software%20aerate%20james%20adhitthana.PNG?token=AINQE25IGVJUBHVKCWLEFX27RCCYG)

# Getting Started

### User Manual:

- [User Manual](https://github.com/jamesadhitthana/aerate/raw/main/Documentation/User%20Manual.pdf)

### Documentation:

- [API Reference](https://github.com/jamesadhitthana/aerate/raw/main/Documentation/API%20Reference.pdf)

### Notes:

- On esp.ino, define your own FIREBASE_HOST and FIREBASE_AUTH using your own Firebase credentials (if you don't have one, you need to create one first on firebase.google.com).
- On login.html, register.html, unified.js, and index.html, change the Firebase API Keys to your own.
- aerate was built for my university dissertation and therefore we will not be liable for any loss or damage of any nature.

## Built With

- [Arduino](https://www.arduino.cc/) - Arduino
- [Firebase](https://firebase.google.com/) - Firebase
- [JavaScript](https://www.javascript.com/) - JavaScript
- [Bootstrap](https://getbootstrap.com/) - Bootstrap

## Authors

- **James Adhitthana** - [jamesadhitthana](https://github.com/jamesadhitthana)
- **Hareva, David Habsara** (Thesis advisor)
- **Murwantara, I Made** (Thesis advisor)

<!-- ![screenshot-aerate-end](https://raw.githubusercontent.com/jamesadhitthana/aerate/main/Source%20Code%20-%20Web%20App/aerate-logo-top.png?token=AINQE24KXG7NT7GTSP6AQJK7RA7FW) -->

<div align="center">
<a href="https://aerate.web.app/"><img src="https://raw.githubusercontent.com/jamesadhitthana/aerate/main/Source%20Code%20-%20Web%20App/aerate-logo-top.png?token=AINQE24KXG7NT7GTSP6AQJK7RA7FW" alt="Ducktionary Icon" ></a>

</div>
