// Area Chart Example
    // Set new default font family and font color to mimic Bootstrap's default styling
    //// Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    //// Chart.defaults.global.defaultFontColor = '#858796';

    var mainChartJSChart = new Chart(document.getElementById("mainChartJsCanvas"), {
        type: 'line',
        data: {
          labels://THIS IS AN ARRAY, NOT A DATASET
            aerUnited.getARDUINO_DATE(),//Name for the dataset (label underneath the each data in the chart)datasets:
          datasets: [ // dataSet_ARDUINO_DATE, //Date moved to chart label
            // dataSet_ARDUINO_counter, Disabled from chart
            dataSet_MQ8_h2_ppm, dataSet_MQ2_smk_ppm, dataSet_MQ6_lpg_ppm,
            dataSet_MQ135_co2_ppm, dataSet_MQ7_co_ppm, dataSet_MQ3_alc_mgL,
            dataSet_DHT_temp_c, dataSet_DHT_hum, dataSet_SHARP_dust_ugm3
          ],
        },
        options: {
          maintainAspectRatio: false,
          // title: {
          //   display: true,
          //   text: 'mainChartJSChart'
          // },
          layout: {
            padding: {
              left: 10,
              right: 25,
              top: 25,
              bottom: 0
            }
          },
          scales: {
            xAxes: [{
              time: {
                unit: 'date'
              },
              gridLines: {
                display: false,
                drawBorder: false
              },
              ticks: {
                maxTicksLimit: 7
              },
              scaleLabel: {
                display: true,
                labelString: 'Date/Time'
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true,
                maxTicksLimit: 5,
                padding: 10,
              },
              gridLines: {
                color: "rgb(234, 236, 244)",
                zeroLineColor: "rgb(234, 236, 244)",
                drawBorder: false,
                borderDash: [2],
                zeroLineBorderDash: [2]
              },
              scaleLabel: {
                display: true,
                labelString: 'Sensor Value'
              }
            }],
          },
          tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            titleMarginBottom: 3,
            titleFontColor: '#6e707e',
            titleFontSize: 12,
            borderColor: '#dddfeb',
            borderWidth: 1,
            intersect: false,
            mode: 'index'
          }
        }
      });