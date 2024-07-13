import ThemeToggle from "@/app/Components/ThemeToggle"
import Link from "next/link"

const Settings = () => {
  return (
    <div className="min-h-screen bg-blue-100 flex justify-center items-center pt-12">
      <div className="flex flex-col gap-10 bg-white shadow-md rounded-lg p-10 w-full max-w-md">
        <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-6xl text-white">👤</span>
        </div>        
        <div>
          <h2 className="text-lg font-medium text-gray-700">Name</h2>
          <p className="text-xl font-semibold">MATCOTAK BUDI SETIAWAN</p>
          <button className="underline italic">Change name</button>
        </div>
        <div>
          <h2 className="text-lg font-medium text-gray-700">Email</h2>
          <input type="text" value="BUDISET@gmail.com" disabled className="bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4"/><br/>
          <Link href="/" className="underline italic">Change Email</Link>
        </div>
        <div>
          <h2 className="text-lg font-medium text-gray-700">Password</h2>
          <input type="text" value="***********" disabled className="bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4"/><br/>
          <Link href="/" className="underline italic">Change Password</Link>
        </div>
      </div>
      <ThemeToggle />
    </div>

  )
}

export default Settings