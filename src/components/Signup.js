import React , {useState} from 'react'
import { useNavigate } from 'react-router-dom'
const Signup = (props) => {
 const[credentials , setCredentials] = useState({Name:"" , Email:"", password:"" , cpassword:""})
 let navigate = useNavigate();
 const handleSubmit = async (e) => {
     e.preventDefault();
     const {Name , Email , password} = credentials;
     const response = await fetch("http://localhost:5000/api/auth/createuser", {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify({Name , Email , password})
     });
     const json = await response.json()
     console.log(json);
     if(json.success){
      // Save the auth toke and redirect the user
         localStorage.setItem('token' , json.authtoken)
         navigate('/');
         props.showAlert("Account Created Succesfully", 'success')
     }
     else{
      props.showAlert("Invalid Details", 'danger')
     }
   
 }
    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

  return (
    <div className='mt-2'>
    <h2>Sign Up to use iNoteBook</h2>
    <div className='container my-3'>
     <form onSubmit={handleSubmit}>
  <div className="mb-3">
    <label htmlFor="exampleInputEmail" className="form-label">Name</label>
    <input type="text" className="form-control" id="Name" name="Name" onChange={onChange}/>
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
    <input type="email" className="form-control" id="exampleInputEmail1" name="Email" onChange={onChange}/>
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
    <input type="password" className="form-control" id="Password"  name="password" onChange={onChange} minLength={5} required/>
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputPassword1" className="form-label">Confirm Password</label>
    <input type="password" className="form-control" id="cPassword" name="cpassword" onChange={onChange} minLength={5} required/>
  </div>
  <button type="submit" className="btn btn-primary">Submit</button>
</form>
    </div>
    </div>
  )
}

export default Signup
