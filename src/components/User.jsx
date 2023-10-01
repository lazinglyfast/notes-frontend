const User = ({ user, handleLogout }) => {
  return (
    <p>
      {user.name} logged in
      <button onClick={handleLogout}>logout</button>
    </p>
  )
}

export default User
