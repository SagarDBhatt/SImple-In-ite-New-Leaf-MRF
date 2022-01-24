import React, {useState, useEffect} from "react";
import { Bar, Line} from "react-chartjs-2";
import axios from "axios";

const Chart_inventory_count = () => {
    const [chartData, setChartData] = useState({});
    const GLOBAL_URL = process.env.REACT_APP_GLOBAL_URL;

    const graph_inv_ct = () => {
        let material_type = [];
        let inventory_count = [];
        let target = [];

        axios
        .get(GLOBAL_URL +"SimpleIn$ite/dashboard/inventoryCount")
        //.get("http://simpleinsite.us-east-2.elasticbeanstalk.com:5000/SimpleIn$ite/dashboard/inventoryCount")
        //.get('http://localhost:5000/SimpleIn$ite/dashboard/inventoryCount')
        .then(response => {
            console.log(response)

            for(const dataObject of response.data){
                material_type.push(dataObject.Material_Type);
                inventory_count.push(dataObject.Inventory);
                target.push(dataObject.Target);
            }

            setChartData({
                labels:material_type,
                datasets: [
                    {
                        type: 'line',

                        /**
                         * showLine:false : hide the line. Shows just a marker
                         *  pointStyle: 'triangle' : Attribute to change the shape of the marker
                         */
                        showLine:false,
                        pointStyle: 'triangle',
                        
                        radius: 4,
                        label: "Truckload Target",
                        backgroundColor: 'rgba(255, 0, 0, 1)',
                        borderWidth: 1,
                        data: target, 
                        //id: "x2"
                    },
                    {
                        label: "Inventory count",

                        /**
                         * To create a stack bar graph, there are 2 updates. 
                         * I. Use "stack" attribute in each dataset and give any unique name. The same unique name should be given to all the datasets that needs to be stacked together. 
                         * II. In Scales property of Options, set "stacked: true" for both X-axes and Y-axes
                         */
                        //stack: 'stack 0',
                        backgroundColor: 'rgba(0, 0, 255, 0.5)',
                        borderWidth: 1,
                        data: inventory_count,
                        //id: 'x1'
                      } 
                ]
            })
        })
        .catch(error => {
            console.log(error);
        });

    };//end of graph_inv_ct

    useEffect( 
        () => {
            graph_inv_ct();
        }, []
    );

    return(
        <div className='App'>
            <div>
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,

                        plugins: {
                            title: { 
                                text: "Current Inventory & truckload target", 
                                display: true, 
                                padding: 2
                            },

                            legend:{
                                display: true,
                                position: 'bottom',
                                maxHeight: 24
                            }
                        },
                        
                        scales: {
                            
                            yAxes: [
                                {
                                    stacked: true,
                                    ticks: {
                                        autoSkip: true,
                                        maxTicksLimit: 10,
                                        beginAtZero: true
                                    },
                                    gridLines: {
                                        display: true
                                    }
                                }
                            ],
                            xAxes: [
                                {
                                    //id: 'x1',
                                    stacked: true,
                                    barThickness: 30,
                                    gridLines: {
                                        display: false
                                    }
                                },
                                {
                                    //id: 'x2',
                                    stacked: true,
                                    barThickness: 70,
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

}//end of chart_inventory_count

export default Chart_inventory_count;
