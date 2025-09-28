import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom";
import docsModel from "../models/getDocs.js"
import baseURL from "../utils.jsx";

function View_doc (){
    const [doc, setDoc] = useState({name: "", content: ""})
    const { id } = useParams()
    const navigate = useNavigate()

    async function fetchDoc() {
        const result = await docsModel.getDoc(id)
        setDoc(result)
      }

    useEffect(() => {
        fetchDoc()
      }, [id])

    async function handleSubmit(e) {
      e.preventDefault()

      const updatedDoc = {
        name: doc.name,
        content: doc.content,
      };

      const response = await fetch(`${baseURL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDoc),
      });

      if (response.ok) {
        navigate('/docs')
      } else {
        alert('Problem vid upddatering av dokument.')
      }
    }

    return(
        <>
        <h2>Redigera dokument {doc.name}</h2>
        <form onSubmit={handleSubmit} className="new-doc">
          <label htmlFor="title">Titel</label>
          <input
            type="text"
            name="name"
            value={doc.name}
            onChange={(e) => setDoc({ ...doc, name: e.target.value })}
            required
          />

          <label htmlFor="content">Innehåll</label>
          <textarea
            name="content"
            value={doc.content}
            onChange={(e) => setDoc({ ...doc, content: e.target.value })}
            required
          />

          <input type="submit" value="Uppdatera" />
          </form>
        </>
    )
}

export default View_doc