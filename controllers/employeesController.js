const Employee = require("../model/Employee")



const getAllEmployees = async(req,res) => {
    const employees = await Employee.find() // find() gets all of the employees from the mongoDB employees collection
    if(!employees) {
        return res.sendStatus(204).json({message : "No employees found"})
    }
    res.json(employees)
}


const createNewEmployee = async(req,res) => {
    if(!req?.body?.firstname || !req?.body?.lastname){
        return res.status(400).json({"message" : "first & last names are required"})
    }

    try {
        const result = await Employee.create({
            firstname : req.body.firstname,
            lastname : req.body.lastname
        })

        res.status(201).json(result)
        
    } catch(err) {
        console.log(err.message)
    }

}

const updateEmployee = async(req,res) => {

    if(!req?.body?.id) {
        return res.status(400).json({"message" : "ID Parameter is required"})
    }

    const employee = await Employee.findOne({ _id: req.body.id}).exec() // Remember that mongoDB automatically adds id property, and you reference them by (_id)
     
    if(!employee) {
        return res.status(204).json({message : `No employee matches ID ${req.body.id}`})
    }

    if(req.body?.firstname) {employee.firstname = req.body.firstname}
    if(req.body?.lastname) {employee.lastname = req.body.lastname}

    const result = await employee.save()

    res.json(result)
}


const deleteEmployee = async(req,res) => {

    if(!req?.body?.id) {
        return res.status(400).json({message : "Employee ID required"})
    }

    const employee = await Employee.findOne({_id : req.body.id}).exec()

    if(!employee) {
        return res.status(204).json({message : `No employee matches ID ${req.body.id}`})
    }

    const result = await employee.deleteOne({ _id : req.body.id})

    res.json(result)
}
  
const getEmployee = async(req, res) => { 

    if(!req?.params?.id) {
        return res.status(400).json({message : "Employee ID required"})
    }

    const employee = await Employee.findOne({_id : req.params.id}).exec()
    if(!employee) {
        return res.status(204).json({message : `No employee matches ID ${req.params.id}`})
    }

    res.json(employee);
}


module.exports = {getAllEmployees,getEmployee,
                updateEmployee,deleteEmployee,
                createNewEmployee}