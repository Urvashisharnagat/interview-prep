import React,{useState} from 'react'
import {useNavigate,Link} from 'react-router'
import {useAuth} from '../hooks/useAuth'


const Resgister = () => {

    const navigate = useNavigate()

    const {loading, handleRegister} = useAuth()
    const [username, setusername] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleRegister({username,email,password})
        navigate('/')
    }

    if(loading){
        return (
            <main><H1>Loading...</H1></main>
        )
    }

  return (

    <main>
        <div className="form-container">
            <h1>Register</h1>
       
            <form action="" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id='username' name='username' placeholder='enter username'
                     onChange={(e)=>{
                        setusername(e.target.value)
                     }} />
                </div>

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id='email' name='email' placeholder='enter email addres'
                     onChange={(e)=>{
                        setemail(e.target.value)
                     }} />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id='password' name='password' placeholder='enter password'
                     onChange={(e)=>{
                        setpassword(e.target.value)
                     }} />
                </div>

                <button className='button primary-button'>Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
         </div>
    </main>
  )
}

export default Resgister