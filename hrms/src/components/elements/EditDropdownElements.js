import React from "react"
import {useEffect, useRef} from "react-router-dom"



const EditDropdownElements = (props) => {


    

console.log(props.roles)
    return(
        <div className="row">
            <div className="col-12">
                {props.roles.map(role=>(
                    <>{role.role_title}</>
                )
                    
                )}
            </div>
        </div>
    );
}


export default EditDropdownElements;