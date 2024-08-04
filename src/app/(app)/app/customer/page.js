"use client"
import React, { useEffect, useState } from 'react'
import MyTable from '../component/MyTable'
import services from '../services/services'
import { Button } from '@/components/ui/button'

export default function customer() {

  const [datalist, setdatalist] = useState([])
  useEffect(() => {
    getData()
  }, [])

  const getData =async()=>{
    let req ={
      table:'ledgers',
      filters:[['parent','=','Sundry Debtors']]
    }
    await services.get_data_from_table(req).then(r=>{
      console.log('response',r)
    }).catch(e=>{
      console.log('error on api',e)
    })
  }
  
  return (
    <div>
      <h3> <b>Customer List</b></h3>
<div onClick={()=>{getData()}}>

</div>

      <MyTable  />
    </div>
  )
}

