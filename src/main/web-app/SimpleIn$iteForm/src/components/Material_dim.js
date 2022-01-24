import React, { Component } from 'react';
// import AppNav from './AppNav'

class Material_dim extends Component {
    state = { 
        isLoading : true,
        Materials : []
     }

     //Sync: User sends request and wait for the response.... 
     //Async: User sends request and do not wait for response.... 

     async componentDidMount(){
         const response = await fetch('/api/material');
         const body = await response.json();

         this.setState(
             {
                 Materials:body, 
                 isLoading:false
             });
     }


    render() { 
        const {Materials, isLoading} = this.state;

        if(isLoading){
            return (
            <div>
                {/* <AppNav/> */}
                Loading ...</div>);
        }
            
        else{    
        return ( 
            <div>
                {/* <AppNav/> */}
                <h2> Materials </h2>
                {
                   Materials.map(material => 
                        <div id= {material.material_id}> 
                            <h4>{material.material_Type}</h4>
                        </div>
                    )
                }
            </div>
         );
        }
    }
}
 
export default Material_dim;