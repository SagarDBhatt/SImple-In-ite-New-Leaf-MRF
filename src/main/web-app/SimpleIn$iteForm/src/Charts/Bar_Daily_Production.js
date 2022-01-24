import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import axios from "axios";


const Chart = () => {
  const [chartData, setChartData] = useState({});
  const GLOBAL_URL = process.env.REACT_APP_GLOBAL_URL;

  const chart = () => {
    let material_type = [];
    let prod_weight = [];
    let date = [];


    axios
      .get(GLOBAL_URL + "SimpleIn$ite/dashboard/production/daily")
      //.get("http://simpleinsite.us-east-2.elasticbeanstalk.com:5000/SimpleIn$ite/dashboard/production/daily")
      //.get("http://localhost:5000/SimpleIn$ite/dashboard/production/daily")
      .then(res => {
        //console.log(res);

        for (const dataObj of res.data) {
            material_type.push(dataObj.Material_Type);
            prod_weight.push(parseInt(dataObj.Total_Weight));
            date.push(dataObj.Date);

          console.log("DataObject = " + dataObj)
          console.log("production weight = " + prod_weight + " date = " + date)
        }
        
        setChartData({
          labels: date,
          datasets: [
            {
              label: "Daily Production (tons)",
              data: prod_weight,
              stacked: true,
              backgroundColor: "#90ADF7",
              borderWidth: 1,
              borderColor: '#121111',
              hoverBackgroundColor: '#EC500D',
              hoverBorderColor: 'rgba(255,99,132,1)',

              trendlineLinear: {
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
      <div>
        
      {/* <label for="filter">Select Data Range</label>{" "}
      <select
        name="filter"
        id="filter"
        // onChange={this.handleChange}
      >
        <option>Last 30 days</option>
        <option>Last Quarter</option>
      </select> */}

        <Bar
          data={chartData}
          
          options={{
            responsive: true,

            plugins: {
              title: {
                  display: true,
                  text: 'Daily Production (tons)',
                  // padding: {
                  //     top: 10,
                  //     bottom: 30
                  // }
              },

              legend: {
                display: false,
                labels: {
                    color: 'rgb(255, 99, 132)'
                }
              },

              scales: {
                yAxes: [
                  {
                    ticks: {
                      autoSkip: true,
                      min: 0,
                      max:10,
                      stepSize: 0.5,
                      maxTicksLimit: 20,
                      beginAtZero: false                    },
                    gridLines: {
                      display: false
                    }
                  }
                ],
                xAxes: [
                  {
                    gridLines: {
                      display: false
                    }
                  }
                ]
              }

            }

            
          }}
        />
      </div>
    </div>
  );
};

export default Chart;