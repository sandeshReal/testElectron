import React, { useEffect } from 'react'

const ShowPath = ({path,handlePathSelection,selectedPathActive,setSelectedPathActive}) => {

    const newPathArray={};
    console.log(path);
   Object.keys(path).forEach((key)=>{
  
    if(key.includes("PREVJOB")){
        newPathArray[key]=path[key];
    }
   })
   useEffect(()=>{
    onHandlePathSelection(Object.keys(newPathArray)[0]);
  },[])

   const onHandlePathSelection=(path)=>{
  
    handlePathSelection(path)
   }
  return (
    <div className={`showpath-container ${Object.keys(path).length>0 ?"scroll":""}` }>
    
        <div className='showpath-lists'>
            {Object.keys(newPathArray).map((key,index)=>{
                return <div key={key}className={`showpath-list ${selectedPathActive===index?'active':''}`} onClick={()=>{
                    setSelectedPathActive(index)
                    onHandlePathSelection(`${path[key]}`)}}>{`${key}:${path[key]}`
                    }</div>
            })}
            
        </div>
    </div>
  )
}

export default ShowPath