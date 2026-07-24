import { useState } from 'react'
import '../auth.form.scss'
import { useNavigate, Link } from 'react-router-dom' // Standard import
import { useAuth } from '../hooks/useAuth'

const Login = () => { // Capitalized Component Name
    const { loading, handleLogin } = useAuth()
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email || !password) return

        setIsSubmitting(true)
        try {
            // handleLogin response ka wait karein
            const user = await handleLogin({ email, password })
            
            // Agar success hota hai tabhi home page par redirect karein
            if (user) {
                navigate('/')
            }
        } catch (error) {
            console.error("Login failed:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <main><h1>Loading...</h1></main>
        )
    }

    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>
           
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id='email' 
                            name='email' 
                            value={email}
                            placeholder='enter email address'
                            onChange={(e) => setemail(e.target.value)} 
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id='password' 
                            name='password' 
                            value={password}
                            placeholder='enter password'
                            onChange={(e) => setpassword(e.target.value)} 
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className='button primary-button' 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </main>
    )
}

export default Login