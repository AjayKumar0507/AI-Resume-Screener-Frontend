import { Link } from 'react-router'
import { useAuth } from '~/context/AuthContext'

const Navbar = () => {

  const {isLoggedIn, logout} = useAuth();

  return (
    <nav className='navbar' >
        <Link to="/">
            <p className='text-2xl font-bold text-gradient' >RESUMEIND</p>
        </Link>
        {isLoggedIn && 
        <button className='primary-button w-fit' onClick={logout}  >Log Out</button>
        }
        <Link to="/upload" className='primary-button w-fit' >
            Upload Resume
        </Link>
    </nav>
  )
}

export default Navbar