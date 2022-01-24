import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const Chart_monthly_recyle_reject = () => {

    const [chartData, setChartData] = useState({});
    const GLOBAL_URL = process.env.REACT_APP_GLOBAL_URL;

    const graph_recycle_reject = () => {
        
        let recycled_materials = [];
        let rejected_materials = [];
        let reject_percentage = [];
        let month = [];

        //fetch('http://localhost:5000/SimpleIn$ite/dashboard/utilization')
        //fetch('http://simpleinsite.us-east-2.elasticbeanstalk.com:5000/SimpleIn$ite/dashboard/utilization')
        fetch(GLOBAL_URL + "SimpleIn$ite/dashboard/utilization")
        .then((response) => response.json())
        .then(data => {

            for(const dataObject of data){
                month.push(dataObject.MONTH_NAME);
                recycled_materials.push(dataObject.RECYCLE);
                rejected_materials.push(dataObject.TRASHOUT);
                reject_percentage.push(dataObject['REJECT PERCENTAGE']);
            }

            //console.log('Response of Recyled Reject = ' + data)

            setChartData({
                labels:month,
                datasets: [
                    {
                        label: "Rejected Materials",
                        data: rejected_materials,
                        fill: false,
                        borderColor: '#081300',
                        borderWidth: 0.5,
                        backgroundColor: '#E6F028',
                        fill: true
                    },
                    {
                        label: "Recycled Materials",
                        data: recycled_materials,
                        backgroundColor: '#E6FEE8',
                        fill: true,
                        borderColor: '#131513',
                        borderWidth: 0.5,
                        hoverBackgroundColor: 'rgba(155,99,232,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)'
                    }
                ]
            })
        })
        .catch(err => {
            console.log('Error in Recycle Reject Material' + err)
        })

    };//end of functional component graph_recycle_reject

    useEffect( 
        () => {
            graph_recycle_reject();
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
                                text: "Monthly Recycled & Rejected material (lbs)", 
                                display: true,
                                /**
                                 * By default padding value for chart title is 10. Changed value to 4 to 
                                 * acquire more space for chart area.
                                 */
                                padding: 4
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
                            
                            yAxes: [
                                {
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


} //end of functional component chart_monthly_recyle_reject.

export default Chart_monthly_recyle_reject;