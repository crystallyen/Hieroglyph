import AccountMenu from './AccountMenu'

function Dashboard() {
  return (
    <>
    <div className="relative h-screen">
      <div className="absolute top-4 right-12">
        <AccountMenu />
      </div>
    </div>
    </>
  )
}

export default Dashboard;
