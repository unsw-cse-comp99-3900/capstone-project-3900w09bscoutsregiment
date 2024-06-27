
const Settings = () => {
  return (
    <div className="bg-white">
      <div className="text-4xl">👤</div>
      <div>
        <h2 className="text-lg font-medium text-gray-700">Name</h2>
        <p className="text-xl font-semibold">MATCOTAK BUDI SETIAWAN</p>
        <button>Change name</button>
      </div>
      <div>
        <h2 className="text-lg font-medium text-gray-700">Email</h2>
        <input type="text" value="BUDISET@gmail.com" disabled className="bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4"/>
        <button>Change Email</button>
      </div>
      <div>
        <h2 className="text-lg font-medium text-gray-700">Password</h2>
        <input type="text" value="***********" disabled className="bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4"/>
        <button>Change Password</button>
      </div>
    </div>
  )
}

export default Settings