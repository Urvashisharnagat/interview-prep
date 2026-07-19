import { useContext , useEffect} from "react";
import { AuthContext } from "../auth.context.jsx";
import{login, register, logout, getMe} from '../services/auth.api'

export const useAuth = ()=>{

    const context = useContext(AuthContext)
    const {user,setuser,loading,setloading} = context
    

    const handleLogin = async ({email,password})=>{
        setloading(true)
        try{
            const data = await login(email,password)
            setuser(data.user)
            
        }
        catch(err){
        }
        finally{
            setloading(false)
        }
    }

    const handleRegister = async ({username,email,password})=>{
        setloading(true)
        try{
            const data = await  register(username,email,password)
            setuser(data.user)
        }
        catch(err){
        }
        finally{
            setloading(false)
        }
    }

    const handleLogout = async ()=>{
        setloading(true)
        try{
            const data = await logout()
            setuser(null)
        }
        catch(err){
        }
        finally{
            setloading(false)
        }
    }

    useEffect(() => {
    const getAndsetUser = async () => {
        try {
            const data = await getMe()

            setuser(data.user)
        } 
        catch(err) {
            console.log(err)
            setuser(null)
        }
        finally {
            setloading(false)
        }
    }

    getAndsetUser()
}, [])
    
    return {user,loading,handleLogin,handleRegister,handleLogout}

}