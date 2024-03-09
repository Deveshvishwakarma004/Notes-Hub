import React , {useState} from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
    
    const [credentials, setCredentials] = useState({Email: "", password: ""}) 
    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Email: credentials.Email, password: credentials.password})
        });
        const json = await response.json()
        console.log(json);

        if(json.success){
            // Save the auth toke and redirect the user
            localStorage.setItem('token' , json.authtoken)
            navigate('/');
            props.showAlert("Logged In Succesfully", 'success')
        }
        else{
            props.showAlert("Invalid Credentials", 'danger')
        }
    }
        const onChange = (e)=>{
            setCredentials({...credentials, [e.target.name]: e.target.value})
        }
  return (
    <div className='mt-2'>
        <h2>Welcome Back! Login to continue acces iNoteBook</h2>
    <div className='container'>
    <form  onSubmit={handleSubmit}>
        <div className="mb-3 my-4">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" value={credentials.Email} onChange={onChange} id="Email" name="Email" aria-describedby="emailHelp" />
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" value={credentials.password} onChange={onChange} name="password" id="password" />
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
    </form>
</div>
</div>
  )
}

export default Login
