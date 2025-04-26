import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="rounded shadow-md w-full max-w-sm">
        <SignIn />
      </div>
    </div>
  )
}