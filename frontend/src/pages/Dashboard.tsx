import { useNavigate, useLocation } from 'react-router-dom'

const Dashboard = () => {
  const location = useLocation()
  const { state } = location

  const navigate = useNavigate()

  const handleSignOut = () => {
    localStorage.removeItem('jwtKey')
    navigate('/')
  }

  return (
    <div className="h-screen">
      <div className="h-20 flex items-center bg-[#3a244a] justify-between p-2 px-4">
        <h1 className="text-white text-3xl font-semibold">Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="bg-white px-6 py-3 rounded-lg text-[#3a244a] text-xl font-semibold"
        >
          Sign Out
        </button>
      </div>
      <div className="">
        <div
          className="p-6 sm:p-11 m-8"
          style={{
            boxShadow:
              'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
          }}
        >
          <h1 className="sm:text-5xl text-4xl">Welcome {state.name}!</h1>
          <h1 className="sm:text-xl text-lg mt-6">
            <span className="font-bold">Email: </span> {state.email}
          </h1>
        </div>
      </div>
      <div className="absolute w-full bottom-0 bg-[#3a244a] h-16"></div>
    </div>
  )
}

export default Dashboard
