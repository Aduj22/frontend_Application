import { useState } from "react"
import { useNavigate } from "react-router-dom";
import baseURL from "../../utils";
import { Link } from "react-router-dom";

function Login (){
    const [user, setUser] = useState({email: "", password: ""})
    const [signUpMessage, setSignUp] = useState("")
    const navigate = useNavigate()

    async function handleSubmit(e) {
      e.preventDefault()

      const userCreds = {
        email: user.email,
        password: user.password,
      };

      const response = await fetch(`${baseURL}/account/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userCreds),
      });

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("token", data.token)
        navigate('/docs')
      } else {
        alert('Problem vid inloggning')
        setSignUp(`Det verkar som att du inte har ett konto. Använd länken nedan för att registrera dig.`)
      }
    }

    return(
        <>
        <div className="login-section">
        <h2>Logga in</h2>
          <form onSubmit={handleSubmit} className="user-form">
            <label htmlFor="email">E-post</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />

            <label htmlFor="password">Lösenord</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />

            <button type="submit">Logga in</button>
            <p className="signup-message">
              {signUpMessage && (
                  <>
                  {signUpMessage} <Link to="/account/signup">Register here</Link>.
                  </>
              )}
            </p>
            </form>
          </div>
        </>
    )
}

export default Login