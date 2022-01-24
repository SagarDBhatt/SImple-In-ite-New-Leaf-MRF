import React, {useState, useEffect} from "react";
import { Bar, Line} from "react-chartjs-2";
import axios from "axios";

const Chart_machine_hours = () => {
    const [chartData, setChartData] = useState({});
    const GLOBAL_URL = process.env.REACT_APP_GLOBAL_URL;

    const graph_machine_hours = () => {
        let machine_hours = [];
        let system_efficiency = [];
        let date = [];

        axios
        .get(GLOBAL_URL + "SimpleIn$ite/dashboard/machinehours")
        //.get("http://simpleinsite.us-east-2.elasticbeanstalk.com:5000/SimpleIn$ite/dashboard/machinehours")
        //.get("http://localhost:5000/SimpleIn$ite/dashboard/machinehours")
        .then(response => {
            // console.log(response)

            for(const dataObject of response.data){
                machine_hours.push(dataObject['MACHINE HOURS']);
                date.push(dataObject.DATE);
                system_efficiency.push(dataObject['SYSTEM EFFICIENCY']);

                //console.log("Machine hours = " + machine_hours)
            }

            setChartData({
                labels:date,
                datasets: [
                    {
                        /**
                         * type attribute is used to build the complex graphs with different graph types
                         */
                        type: 'line',
                        label: "Machine running hours",
                        data: machine_hours,
                        yAxisID: 'MRH',
                        backgroundColor: '#29B705',
                        borderColor: '#050505',
                        borderWidth: 0.5,
                        hoverBackgroundColor: 'rgba(155,99,232,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)'
                    },
                    {
                        type:'bar',
                        staked: true,
                        label: "System Efficiency (%)",
                        data: system_efficiency,
                        yAxisID: 'SE',
                        fill: true,
                        borderColor: '#283FF0',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(155,99,232,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)'
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
            graph_machine_hours();
        }, []
    );

    return(
        <div className='App'>
            <div>
                <Line
                    data={chartData}
                    options={{
                        responsive: true,

                        plugins: {
                            title: { 
                                text: "Machine Running hours (hr) & System Efficiency (%)", 
                                display: true,
                                /**
                                 * By default padding value for chart title is 10. Changed value to 4 to 
                                 * acquire more space for chart area.
                                 */
                                padding:4
                            },
                            
                            legend: {
                                display:true,
                                position: 'bottom',
                                /**
                                 * maxHeight prop is used to adjust the height of legend to acquire more space
                                 * for chart area
                                 */
                                maxHeight:24
                            }
                        },
                        
                        scales: {
                            MRH: {
                                type: 'linear',
                                position:'left',
                                ticks:
                                    {
                                        max: 21,
                                        min: 6
                                    }
                            },
                            SE: {
                                type: 'linear',
                                position:'right'
                            },
                        // yAxes: [
                        //     {
                        //         id:'System Efficiency (%)',
                        //         type: 'linear',
                        //         position:'right'
                        //     },
                        //     {
                        //         id:'Machine running hours',
                        //         type:'linear',
                        //         position:'left'
                        //     }
                        // ],
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

export default Chart_machine_hours;
