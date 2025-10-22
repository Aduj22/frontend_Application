import { useState } from "react"
import { useNavigate } from "react-router-dom";
import baseURL from "../../utils.jsx";

function Register (){
    const [user, setNewUser] = useState({email: "", password: ""})
    const navigate = useNavigate()

    async function handleSubmit(e) {
      e.preventDefault()

      const newUser = {
        email: user.email,
        password: user.password,
      };

      const response = await fetch(`${baseURL}/account/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        navigate('/account/login')
      } else {
        alert('Problem vid registrering')
      }
    }

    return(
        <>
        <div className="login-section">
          <h2>Registrera dig</h2>
          <form onSubmit={handleSubmit} className="user-form">
            <label htmlFor="email">E-post</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={(e) => setNewUser({ ...user, email: e.target.value })}
              required
            />

            <label htmlFor="password">Lösenord</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={(e) => setNewUser({ ...user, password: e.target.value })}
              required
            />

            <button type="submit">Skapa konto</button>
            </form>
          </div>
        </>
    )
}

export default Register