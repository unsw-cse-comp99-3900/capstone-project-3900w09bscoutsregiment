import Link from "next/link"
export default function Page() {
  return (
    <>
    <div className="flex flex-row justify-between">
      COTAM
      <div>
        <Link href = "/login"> Login </Link>
      </div>
    </div>
    </>
  )
}