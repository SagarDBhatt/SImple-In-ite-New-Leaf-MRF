import React, { useState, useEffect } from "react";
import { Bar, Line, HorizontalBar } from "react-chartjs-2";
import axios from "axios";

/**
 * chartjs-plugin-trendline. 
 * This plugin draws an linear trendline in your Chart.
 */
import trendline from "chartjs-plugin-trendline";
const pluginTrendlineLinear = require('chartjs-plugin-trendline');

const Chart_inbound = () => {
  const [chartData, setChartData] = useState({});
  const GLOBAL_URL = process.env.REACT_APP_GLOBAL_URL;

  const chart = () => {
    let inbound_weight = [];
    let date = [];

    axios
      .get( GLOBAL_URL +"SimpleIn$ite/dashboard/inbound/daily")
      //.get('http://localhost:5000/SimpleIn$ite/dashboard/inbound/daily')
      .then(res => {

        for (const dataObj of res.data) {
            inbound_weight.push(parseInt(dataObj.Total_Weight));
            date.push(dataObj.Date);

        }
        
        setChartData({
          labels: date,
          datasets: [
            {
                label: "Daily Inbound (tons)",
                data: inbound_weight,
                backgroundColor: '#68BF3F',
                borderColor: '#121111',
                borderWidth: 1,
                hoverBackgroundColor: '#EC500D',
                hoverBorderColor: 'rgba(255,99,132,1)',
                width: 4,

                /**
                 * To configure the trendline plugin you simply add a new config options to your dataset in your chart config.
                 */
                 pluginTrendlineLinear: {
                  style: "rgba(255,105,180, .8)",
                  lineStyle: "solid",
                  width: 2
                }
            }
          ]
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    chart();
  }, []);


  return (
    <div className="App">
      {/* <h1>Daily Production (tons) </h1> */}
      <div>

        <Bar
          data={chartData}
          options={{
              /**
               * Use indexAxis : 'y' to coonvert the Bar graph into horizonatal Bar Graphs. 
               */
              //indexAxis: 'y',

              responsive: true,

              plugins: {
                pluginTrendlineLinear,
                title: { 
                  text: "Daily Inbound (tons)", 
                  display: true,
                  /**
                  * By default padding value for chart title is 10. Changed value to 4 to 
                  * acquire more space for chart area.
                  */
                  padding: 2
                },
                legend: {
                  display: false
                }

            },
           
            scales: {
              yAxes: [
                {
                  gridLines: {
                    display: true
                  }
                }
              ],
              xAxes: [
                {
                  barPercentage: 0.2,
                  gridLines: {
                    display: false
                  }
                }
              ]
            }
          }}
        />
      </div>
    </div>
  );
};

export default Chart_inbound;