import React, {useState, useEffect} from "react";
import { Bar, Line} from "react-chartjs-2";
import axios from "axios";

const Chart_sold_weight = () => {
    const [chartData, setChartData] = useState({});
    const GLOBAL_URL = process.env.REACT_APP_GLOBAL_URL;

    const graph_sold_weight = () => {
        let sold_weight = [];
        //let date = [];
        let material_type = [];

        axios
        .get(GLOBAL_URL + "SimpleIn$ite/dashboard/soldweight")
        //.get("http://simpleinsite.us-east-2.elasticbeanstalk.com:5000/SimpleIn$ite/dashboard/soldweight")
        //.get("http://localhost:5000/SimpleIn$ite/dashboard/soldweight")
        .then(response => {
            // console.log(response)

            for(const dataObject of response.data){
                sold_weight.push(dataObject['Sold_Weight_Tons']);
                material_type.push(dataObject['Material_Type']);
            }

            setChartData({
                labels:material_type,
                datasets: [
                    {
                        type: 'pie',
                        label: "Sold Weight",
                        data: sold_weight,
                        backgroundColor: ['#E6F028','#29B705', 'rgba(0, 0, 255, 0.5)', 'rgba(0, 200, 255, 0.8)']
                    }
                ]
            })
        })
        .catch(error => {
            console.log(error);
        });

    };//end of graph_sold_weight functional component

    useEffect( () => {
        graph_sold_weight();}, []
    );

    return(
        <div className='App'>
            <div>
                <Line
                    data={chartData}
                    options={{
                        responsive: true,

                        /**
                         * Plugins is required to wrap the tile, legend ect properties
                         */
                        plugins: {
                            title: {
                                 text: "Sold inventory (tons) ", 
                                 display: true,
                                 padding: 4
                            },
                            legend: {
                                display: false
                            }
                            
                        },

                        scales: {
                        yAxes: [
                            {
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 10,
                                beginAtZero: true
                            },
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
                    }}
                />  
            </div>
        </div>
    );

}//end of chart_inventory_count

export default Chart_sold_weight;
