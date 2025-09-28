import { useState } from "react"
import { useNavigate } from "react-router-dom";
import baseURL from "../utils.jsx";

function Add_doc (){
    const [doc, setNewDoc] = useState({name: "", content: ""})
    const navigate = useNavigate()

    async function handleSubmit(e) {
      e.preventDefault()

      const newDoc = {
        name: doc.name,
        content: doc.content,
      };

      const response = await fetch(`${baseURL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDoc),
      });

      if (response.ok) {
        navigate('/docs')
      } else {
        alert('Problem vid uppladdning av dokument.')
      }
    }

    return(
        <>
        <h2>Lägg till en ny dokument</h2>
        <form onSubmit={handleSubmit} className="new-doc">
          <label htmlFor="title">Titel</label>
          <input
            type="text"
            name="name"
            value={doc.name}
            onChange={(e) => setNewDoc({ ...doc, name: e.target.value })}
            required
          />

          <label htmlFor="content">Innehåll</label>
          <textarea
            name="content"
            value={doc.content}
            onChange={(e) => setNewDoc({ ...doc, content: e.target.value })}
            required
          />

          <button type="submit">Skapa</button>
          </form>
        </>
    )
}

export default Add_doc