const express = require("express")
const router = express.Router()
const employeesController = require("../../controllers/employeesController")
const ROLES_LIST = require("../../config/roles_list")
const verifyRoles = require("../../middleware/verifyRoles")

//each user in the employees.json file has a roles object, which is then used by veryRoles
router.route('/')                      
    .get(employeesController.getAllEmployees) //Any signed in users can view Employees 
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployee) // Only Admins & Editors can POST on Employees
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee) // Only Admins & Editors can PUT on Employees
    .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee); //Only Admins can Delete Employees


router.route("/:id")
.get(employeesController.getEmployee);

module.exports = router