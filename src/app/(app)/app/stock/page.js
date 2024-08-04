"use client"
import React, { useEffect, useState } from 'react'
import MyTable from '../component/MyTable'
import services from '../services/services'

function stock() {
const [data, setdata] = useState([])

  useEffect(() => {
    let req ={
      'table':'doctype',
      'filters':[]
    }
   services.get_data_from_table(req).then(r=>{
    console.log(r)
    setdata(r)
   })
  }, [])
  


  return (
    <div>
            <h3> <b>Stock List</b></h3>
            {data?(MyTable):('')}
            <MyTable tdata={data} />
            
            

    </div>
  )
}

export default stock