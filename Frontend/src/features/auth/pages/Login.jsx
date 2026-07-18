import {useState} from 'react'
import '../auth.form.scss'
import {useNavigate,Link} from 'react-router'
import { useAuth } from '../hooks/useAuth'


const login = () => {
    
    const {loading, handleLogin} = useAuth()
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleLogin({email, password})
        navigate('/')
    }

    if(loading){
        return (
            <main><h1>Loading...</h1></main>
        )
    }

  return (

    <main>
        <div className="form-container">
            <h1>Login</h1>
       
            <form action="" onSubmit={handleSubmit}>
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

                <button className='button primary-button'>Login</button>
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
         </div>
    </main>
  )
}

export default login