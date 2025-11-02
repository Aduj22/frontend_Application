import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom"
import baseURL from "../utils.jsx";

function Add_doc (){
    const [doc, setNewDoc] = useState({name: "", content: ""})
    const navigate = useNavigate()
    const [shouldRedirect, setShouldRedirect] = useState(false)

    async function handleSubmit(e) {
      e.preventDefault()

      const newDoc = {
        name: doc.name,
        content: doc.content,
      };

      const token = localStorage.getItem("token");
      const response = await fetch(`${baseURL}/docs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization" : `Bearer ${token}` },
        body: JSON.stringify(newDoc),
      });

      if (!response) {
        const result = await docsModel.getDoc(id)
        if (!result) {
          setShouldRedirect(true)
        }
      }

      if (shouldRedirect) {
        return <Navigate to="/account/login" />
      }

      if (response.ok) {
        navigate('/docs')
      } else {
        alert('Problem vid uppladdning av dokument.')
      }
    }

    return(
        <>
        <div className="view-doc">
          <h2>Lägg till en ny dokument</h2>
          <form onSubmit={handleSubmit} className="new-doc">
            <label htmlFor="title">Titel</label>
            <input
              className="title-input"
              type="text"
              name="name"
              value={doc.name}
              onChange={(e) => setNewDoc({ ...doc, name: e.target.value })}
              required
            />

            <label htmlFor="content">Innehåll</label>
            <textarea
              className="document-text"
              name="content"
              value={doc.content}
              onChange={(e) => setNewDoc({ ...doc, content: e.target.value })}
              required
            />

            <button className="update-doc-button" type="submit">Skapa</button>
            </form>
        </div>
        </>
    )
}

export default Add_doc