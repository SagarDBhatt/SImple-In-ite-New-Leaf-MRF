import React from 'react'
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    LineChart, Line,Pie,PieChart,ResponsiveContainer,Label,LabelList,
  } from 'recharts';

function widgetColumn(props){
    return(

        <div className="widgetWrap">
            <div className="widgetTitle">
                {props.title}

                <BarChart
                    width={500}
                    height={300}
                    data={props.data}
                    margin={{
                    top: 10, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Inbound" fill="#8884d8" />
                    {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
                </BarChart>


            </div>
        
            <div className="widgetValue">


            </div>
        
        </div>
    )
}

export default widgetColumn;