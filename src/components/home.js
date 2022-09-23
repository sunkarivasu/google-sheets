import {useEffect, useState} from "react";
import axios from "axios";
import "../index.css"
import {FaEdit, FaPen, FaRemoveFormat, FaSave} from "react-icons/fa"
import {AiFillDelete} from "react-icons/ai";
import {GiCancel} from "react-icons/gi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from "./loadingSpinner";
import { Audio,Circles, ColorRing, Oval, Rings } from 'react-loader-spinner'

function Home()
{
    var newEmployeeInitialDetials = {
        name:"",
        age:"",
        gender:"Female",
        role:"",
        nameErr:"",
        ageErr:"",
        roleErr:""
    }
    var [employeeDetials,setEmployeeDetials] = useState(null);
    var [addNewMemberBtnClicked,setAddNewMemberBtnClicked] = useState(false);
    var [newEmployeeDetials,setNewEmployeeDetials] = useState(newEmployeeInitialDetials);
    var [rowToBeModified,setRowToBeModified] = useState(-1);
    var [loading,setLoading] = useState(true);
    var [isAdding,setIsAdding] = useState(false);
    var [isModifying,setIsModifying] = useState(false);
    var [isDeleting,setIsDeleting] = useState(false);
    var [deleteIndex,setDeleteIndex] = useState(-1);
    var [modifiedRecord,setModifiedRecord] = useState(
        {
            name:"",
            age:"",
            gender:"",
            role:"",
            nameErr:"",
            ageErr:"",
            roleErr:""
        }
    );

    const handleChangeInput = (e) => {
        console.log(e.target.placeholder);
        console.log(e.target.value);
        setNewEmployeeDetials({
            ...newEmployeeDetials,
            [e.target.name]:e.target.value
        })
    }

    const handleChangeModifiedRecordInput = (e) => 
    {
        setModifiedRecord({
            ...modifiedRecord,
            [e.target.name]:e.target.value
        });
    }

    // const setLocalLoader = (name) => {
    //     const ele = document.getElementsByName(name)[0]
    //     console.log(ele);
    //     ele.append("<h1><Oval visible={true} height={18} width={18} strokeWidth={6} strokeWidthSecondary={6} color={'white'}/></h1>");
        

    // }

    const validateForm = (name) => {
        var nameErr = ""
        var ageErr = ""
        var roleErr = ""
        if(name==="modifiedForm")
        {
            //name Validation
            if(modifiedRecord.name === "")
                nameErr = "Enter Name";
            else if(!modifiedRecord.name.match(/^[a-zA-Z ]{1,}$/gm))
                nameErr = "Name should contain only alphabets & spaces"
            else
                nameErr = "";

            //age validation
            if(modifiedRecord.age == "")
                ageErr = "Enter Age";
            else if(parseInt(modifiedRecord.age)<0)
                ageErr = "Age Should be positive"
            else
                ageErr = ""

            // role validation
            if(modifiedRecord.role === "")
                roleErr = "Enter Role";
            else if(!modifiedRecord.role.match(/^[a-zA-Z ]{1,}$/gm))
                roleErr = "Role should contain only alphabets & spaces"
            else
                roleErr = "";

            setModifiedRecord({
                ...modifiedRecord,
                nameErr:nameErr,
                ageErr:ageErr,
                roleErr:roleErr
            })

            if(nameErr === "" && ageErr ==="" && roleErr === "")
                return true
            return false
        }
        else if(name==="newForm")
        {
            console.log("heelo");
            //name Validation
            if(newEmployeeDetials.name === "")
                nameErr = "Enter Name";
            else if(!newEmployeeDetials.name.match(/^[a-zA-Z ]{1,}$/gm))
                nameErr = "Name should contain only aplhabets & spaces"
            else
                nameErr = "";

            //age validation
            if(newEmployeeDetials.age == "")
                ageErr = "Enter Age";
            else if (parseInt(newEmployeeDetials.age)<0)
                ageErr = "Age should be positive"
            else
                ageErr = ""

            // role validation
            if(newEmployeeDetials.role === "")
                roleErr = "Enter Role";
            else if(!newEmployeeDetials.role.match(/^[a-zA-Z ]{1,}$/gm))
                roleErr = "Role should contain only aplhabets & spaces"
            else
                roleErr = "";

            setNewEmployeeDetials({
                ...newEmployeeDetials,
                nameErr:nameErr,
                ageErr:ageErr,
                roleErr:roleErr
            })

            // console.log(nameErr,roleErr,ageErr);

            if(nameErr === "" && ageErr === "" && roleErr ==="")
                return true
            return false
            
        }
    }

    const deleteEmployeeDetials = (rowNumber) => {
        console.log(rowNumber);
        setIsDeleting(true);
        axios.post("https://script.google.com/macros/s/AKfycbzpqwCydm-iHOaSiC1Q7OAvCwdsUmqShXa_8PyOIZkKoFTpbTFU14AVOXK8tCPje4jz/exec?action=deleteEmployee",
        {"rowNumber":rowNumber},{
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
              }
        })
        .then((res) => {
            console.log(res.data);
            fetchEmployeeDetials();
            setIsDeleting(false);
            setDeleteIndex(-1);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    const modifyEmployeeDetials = (rowNumber,data) => {
        console.log(data);
        if(validateForm("modifiedForm"))
        {
            setIsModifying(true);
            axios.post("https://script.google.com/macros/s/AKfycbzpqwCydm-iHOaSiC1Q7OAvCwdsUmqShXa_8PyOIZkKoFTpbTFU14AVOXK8tCPje4jz/exec?action=modifyEmployee",
            {
                "rowNumber":rowNumber,
                "data":data
            },{
                headers: {
                    "Content-Type": "text/plain;charset=utf-8",
                }
            })
            .then((res) => {
                console.log(res.data);
                fetchEmployeeDetials();
                setRowToBeModified(-1);
                setIsModifying(false);
            })
            .catch((err) => 
            {
                console.log(err);
            })
        }
        
    }
     

    const fetchEmployeeDetials = () => {
        axios.get("https://script.google.com/macros/s/AKfycbzpqwCydm-iHOaSiC1Q7OAvCwdsUmqShXa_8PyOIZkKoFTpbTFU14AVOXK8tCPje4jz/exec")
        .then((res) => {console.log(res.data.data);
        setEmployeeDetials(res.data.data);
        setLoading(false);
    })
        .catch((err) => console.log(err))
    }

    const addEmployee = () =>
    {
        if(validateForm("newForm") && isAdding===false)
        {
            setIsAdding(true);
            axios.post("https://script.google.com/macros/s/AKfycbyFxcv1wl2fMoQz8ZwSoxWV-nqiz4Ooo1qk-sctvn9_THxIJdBkITzKUHGcLsEUdEMf/exec?action=addEmployee",
            newEmployeeDetials,{
                headers: {
                    "Content-Type": "text/plain;charset=utf-8",
                }
            })
            .then((res) => {console.log(res.data);
            setAddNewMemberBtnClicked(false);
            setIsAdding(false);
            setNewEmployeeDetials(newEmployeeInitialDetials);
            fetchEmployeeDetials();
            })
            .catch((err) => console.log(err))
        }
        
    }

    useEffect(() => {
        fetchEmployeeDetials();
    },[])

    return <div className="home-page">
        <div className="home-page-main-container">
            <div className="top-container">
                <div>
                    <p className="heading">Riktam Technologies</p>
                    <p className="company-description">We, the engineers at Riktam build Web and Mobile Applications using the latest technologies, for startups around the world.</p>
                </div>
                <div >
                    <button className="btn add-new-member-btn" onClick={() => setAddNewMemberBtnClicked(true)} disabled={addNewMemberBtnClicked}>Add New Employee</button>
                </div>
            </div>
            <hr style={{"height":"5px"}}/>
            <div className="employee-detials-tabular-data">
                <div className="row">
                    <div className="th col-3 detials head-detials">Name</div>
                    <div className="th col-2 detials head-detials">Age</div>
                    <div className="th col-2 detials head-detials">Gender</div>
                    <div className="th col-3 detials head-detials">Role</div>
                    <div className="th col-2 detials head-detials"></div>
                </div>
                <hr className="shortMargin"/>
                {loading?<div className="spinner-container">
                    <LoadingSpinner/>
                </div>:employeeDetials && 
                    employeeDetials.map((employee,index) => 
                    {
                        if(rowToBeModified === index)
                        {
                            return <div className="row" key={index}>
                                <div className="col-3 detials "><input type="text" value={modifiedRecord.name} name="name" onChange={handleChangeModifiedRecordInput}/><p className="err">{modifiedRecord.nameErr}</p></div>
                                <div className="col-2 detials head-detials"><input type="number" value={modifiedRecord.age} name="age" onChange={handleChangeModifiedRecordInput}/><p className="err">{modifiedRecord.ageErr}</p></div>
                                <div className="col-2 detials head-detials"><select  value={modifiedRecord.gender} name="gender" onChange={handleChangeModifiedRecordInput}>
                                    <option vlaue="Male">Male</option>
                                    <option vlaue="Female">Female</option>
                                    </select></div>
                                <div className="col-3 detials head-detials"><input type="text" value={modifiedRecord.role} name="role" onChange={handleChangeModifiedRecordInput}/><p className="err">{modifiedRecord.roleErr}</p></div>
                                <div className="col-2 detials head-detials">
                                    <button className="btn btn-icon" id={index} onClick={() => {modifyEmployeeDetials(index,[modifiedRecord.name,modifiedRecord.age,modifiedRecord.gender,modifiedRecord.role]);}}>{isModifying?<Oval width={15} height={15} color={"black"} strokeWidth={6} strokeWidthSecondary={6}/>:<FaSave/>}</button>
                                    <button className="btn btn-icon" id={index} onClick={() => {setRowToBeModified(-1)}}><GiCancel/></button>
                                </div>
                                <hr/>
                            </div>
                        }
                        else
                        {
                            return <div className="flex-container row" key={index}>
                                    <div className="col-3 detials">{employee.name}</div>
                                    <div className="col-2 detials">{employee.age}</div>
                                    <div className="col-2 detials">{employee.gender}</div>
                                    <div className="col-3 detials">{employee.role}</div>
                                    <div className="col-2 detials">
                                        <button className="btn btn-icon" id={index} onClick={() => {setRowToBeModified(index);setModifiedRecord(employee);}}><FaEdit/></button>
                                        <button className="btn btn-icon" id={index} onClick={() => {setDeleteIndex(index);deleteEmployeeDetials(index)}}>{isDeleting && deleteIndex===index?<Oval width={15} height={15} color={"black"} strokeWidth={6} strokeWidthSecondary={6}/>:<AiFillDelete/>}</button>
                                    </div>
                                    <hr/>
                                </div>
                        }
                    })
                }
                    
            
            { addNewMemberBtnClicked && 
                    <div className="row bottom-form">
                    <div className="col-2"><input type="text" name="name" placeholder="name" value={newEmployeeDetials.name} onChange={handleChangeInput}/><p className="err">{newEmployeeDetials.nameErr}</p></div>
                    <div className="col-2 "><input type="number" name="age" placeholder="age" value={newEmployeeDetials.age} onChange={handleChangeInput}/><p className="err">{newEmployeeDetials.ageErr}</p></div>
                    <div className="col-2"><select placeholder="gender" name="gender" value={newEmployeeDetials.gender} onChange={handleChangeInput}>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        </select>
                    </div>
                    <div className="col-3"><input type="text" name="role" placeholder="role" value={newEmployeeDetials.role} onChange={handleChangeInput}/><p className="err">{newEmployeeDetials.roleErr}</p></div>
                    <div className="col-3">
                        <button className="btn add-new-member-btn " name="a" onClick={() => {addEmployee();}} disabled={false}>{isAdding?<Oval visible={true} height={18} width={18} strokeWidth={6} strokeWidthSecondary={6} color={'white'}/>:"Add"}</button>
                        <button className="btn add-new-member-btn" onClick={() => {setAddNewMemberBtnClicked(false);setNewEmployeeDetials(newEmployeeInitialDetials)}}>Cancel</button>
                    </div>
                </div>
                }
            </div>
            
        </div>
        
    </div>
}

export default Home