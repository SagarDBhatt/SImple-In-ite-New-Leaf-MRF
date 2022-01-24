import React, { Component } from 'react';
import AuthService from '../Services/AuthService'

import Bar_daily_production from '../Charts/Bar_Daily_Production'
import Bar_daily_inbound from '../Charts/Bar_daily_inbound'
import Bar_inventory_count from '../Charts/Bar_inventory_count'
import Line_daily_sold_weight from '../Charts/Line_daily_sold_weight'
import Line_daily_machine_hours from '../Charts/Line_daily_machine_hours'
import Line_monthly_recycle_reject from '../Charts/Line_monthly_recycle_rejects'

class Home extends Component {
    constructor(props){
        super(props);

        this.state = {
            currentUser : AuthService.getCurrentUser(),
            st_ResidueRate : [],
            st_prod_machineHr : [],
        }
    }

    async componentDidMount(){
        const user = JSON.parse(localStorage.getItem('user'));

        if(!user){
          this.props.history.push("/login")
        }
        else{
          const myHeaders = new Headers(); 
          myHeaders.append("Authorization", "Bearer " + user.accessToken);
          const GLOBAL_URL = process.env.REACT_APP_GLOBAL_URL;
          
          /**
           * Fetch() used to call the API endpoint. The response is Object so first convert the object into JSON file
           * Then fetch the body of the JSON file. 
           */
          //fetch('http://simpleinsite.us-east-2.elasticbeanstalk.com:5000/SimpleIn$ite/dashboard/residueRate'
          fetch(GLOBAL_URL + "SimpleIn$ite/dashboard/residueRate", 
          {
            method: 'GET',
            headers: myHeaders,
          })
          .then((response) => response.json())
          .then(data => {
            this.setState({
              st_ResidueRate: data
            })   
          });

          // /**
          //  * Fetch() used to call the API endpoint. The response is Object so first convert the object into JSON file
          //  * Then fetch the body of the JSON file. 
          //  */
          // //fetch('http://simpleinsite.us-east-2.elasticbeanstalk.com:5000/SimpleIn$ite/dashboard/residueRate'
          // fetch(GLOBAL_URL + "SimpleIn$ite/dashboard/residueRate", 
          // {
          //   method: 'GET',
          //   headers: myHeaders,
          // })
          // .then((response) => response.json())
          // .then(data => {
          //   this.setState({
          //     st_ResidueRate: data
          //   })   
          // });

          /**
           * Fetch() used to call the API endpoint. The response is Object so first convert the object into JSON file
           * Then fetch the body of the JSON file. 
           */
           //fetch('http://simpleinsite.us-east-2.elasticbeanstalk.com:5000/SimpleIn$ite/dashboard/production/machinehour'
           fetch(GLOBAL_URL + "SimpleIn$ite/dashboard/production/machinehour", 
           {
             method: 'GET',
             headers: myHeaders,
           })
           .then((response) => response.json())
           .then(data => {
             this.setState({
               st_prod_machineHr: data
             })   
           });
         
        }
    }

    render() {

      const rowStyle = {
        height: '200'
      }

      return (
        /**
         * Implemented fetch() to call REST API and stored the payload in a state variable. Fetch the state variable
         * via map fucntion to get the ResidueRate.
         */
        <div>
          <table width='60%' border='1'>
          <tr>
              <td width='25%' style={{textAlign: 'center'}}>Residue Rate (%): 
                <h6>{
                    this.state.st_ResidueRate.map(data => <div key={data.id}>{data.ResidueRate}</div>)
                }</h6>
              </td>
              
              <td width='25%' style={{textAlign: 'center'}}>Production/manhour (tons): <h6> 0.1 </h6></td>
              
              <td width='35%' style={{textAlign: 'center'}}>Production/machinehr (tons): <h6>{
                this.state.st_prod_machineHr.map(data => <div key={data.id}> {data['Production per machineHour']} </div>)
              }</h6>
              </td>
              
              {/* <td width='25%' style={{textAlign: 'center'}}> --- <h4>---</h4></td> */}
            </tr>
          </table>

          <table height= '100%' width="100%" border="1" >
            <tr>
              <td style={{width: '33%'}}><Bar_daily_production /></td>
              <td style={{width: '33%'}}><Line_daily_sold_weight /></td>
              <td style={{width: '33%'}}><Bar_inventory_count /></td>
            </tr>

            <tr>
              <td style={{width: '33%'}}><Bar_daily_inbound /></td>
              <td style={{width: '33%'}}><Line_monthly_recycle_reject /></td>
              <td style={{width: '33%'}}><Line_daily_machine_hours /></td>
            </tr>
          
          </table>
          
        </div>

        
      );
    }
}
 
export default Home;