import React from 'react'

const ShowPath = ({path,handlePathSelection,selectedPathActive,setSelectedPathActive}) => {
   const newPathArray={};
   Object.keys(path).forEach((key)=>{
  
    if(key.includes("PREVJOB")){
        newPathArray[key]=path[key];
    }
   })
   const onHandlePathSelection=(path)=>{
  
    handlePathSelection(path)
   }
  return (
    <div className={`showpath-container ${Object.keys(path).length>0 ?"scroll":""}` }>
        <div className='showpath-lists'>
            {Object.keys(newPathArray).map((key)=>{
                return <div key={key}className={`showpath-list ${selectedPathActive===`${key}:${path[key]}`?'active':''}`} onClick={()=>{
                    setSelectedPathActive(`${key}:${path[key]}`)
                    onHandlePathSelection(`${path[key]}`)}}>{`${key}:${path[key]}`
                    }</div>
            })}
            
        </div>
    </div>
  )
}

export default ShowPath