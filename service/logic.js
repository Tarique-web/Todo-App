const moment = require("moment");

exports.prettyfyTodo =async(userDetail)=>{
 
    var todoArr=[]
    userDetail.forEach(element => {
        const todo= {
            text:element.text,
            assignedTo:{
                id:element.id,
                name:element.name,
                eMail:element.email,
                age:element.Age,
                city:{
                    id:element.Id,
                    name:element.city
                }
            },
            dueDate:element.dueDate
        }
        todoArr.push(todo)
    });
    return await todoArr
}


exports.prettyfyUserDetails=async(userDetail)=>{
    let userArr=[]
    userDetail.forEach(element => {
        let properUserDetail = {
            id:element.id,
            name:element.name,
            eMail:element.email,
            age:element.Age,
            city:{
                id:element.cityId,
                name:element.city
            }   
  
        }
        userArr.push(properUserDetail)
            
    });
    
    return await userArr
}



exports.assignedToQyery = async(assignedTo)=>{
    if(assignedTo!==undefined){
        b=assignedTo.split `,`.map(x=>x)
        if(b.includes(NaN)){
            return false
        }else{return b}
    }else{return true}
    
}


exports.dueDate = async(query)=>{
    let fromDueDate = query.fromDueDate
    let toDueDate = query.toDueDate
    if((fromDueDate!==undefined&&toDueDate!==undefined)){
        if(fromDueDate==moment(fromDueDate).format("YYYY-MM-DD")&&toDueDate==moment(toDueDate).format("YYYY-MM-DD")){
            return {fromDueDate,toDueDate}
        }else{return false}
        
    }else{return true}
}
