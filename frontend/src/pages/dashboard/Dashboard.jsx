import AccountMenu from './AccountMenu'

function Dashboard() {
  return (
    <>
      {/*<h1 className="dark:text-white">Hi</h1>*/}
    <div className="relative h-screen">
      <div className="absolute top-4 right-12">
        <AccountMenu />
      </div>
    </div>
    </>
  )
}

export default Dashboard;
