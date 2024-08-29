import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

function Header() {
  const { currentUser } = useSelector(state => state.user)

  return (
    <div className='bg-white'>
      <div className='container flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <img src={logo} alt="FraudShieldAI" className="h-8 sm:h-10 md:h-12 lg:h-14" />
        </Link>
        <ul className='flex gap-8 font-bold'>
          <Link to='/' className="hover:text-blue-600 transition">
            <li>Inicio</li>
          </Link>
          <Link to='/about' className="hover:text-blue-600 transition">
            <li>Nosotras</li>
          </Link>
          <Link to='/' className="hover:text-blue-600 transition">
            <li>Contáctanos</li>
          </Link>
          <Link to='/sign-in' className="hover:text-blue-600 transition">
            <li>Mi cuenta</li>
          </Link>
          <Link  to='/profile'>
          {currentUser && (
            <li>{currentUser.username}</li>
          )}
          </Link>
        </ul>
      </div>
    </div>
  )
}

export default Header
