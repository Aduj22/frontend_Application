import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { Navigate } from "react-router-dom"
import docsModel from "../models/getDocs.js"
import baseURL from "../utils.jsx";
import { io } from "socket.io-client";


function View_doc (){
  const [doc, setDoc] = useState({name: "", content: ""})
  const [userEmail, setEmail] = useState("")
  const [emailBox, setEmailBox] = useState("hide")

  const { id } = useParams()
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const navigate = useNavigate()
  const socketRef = useRef(null)

  async function fetchDoc() {
    const result = await docsModel.getDoc(id)
    if (!result) {
      setShouldRedirect(true)
    }
      setDoc(result)
    }

  useEffect(() => {
      fetchDoc()
    }, [id])

    useEffect(() => {
      const socket = io(baseURL);
      socketRef.current = socket;
  
      socket.emit("joinDoc", id);
  
      socket.on("doc:update", (newContent) => {
        setDoc((doc) => ({ ...doc, content: newContent }));
      });
  
      return () => {
        socket.disconnect();
      };
    }, [id]);

    if (shouldRedirect) {
      return <Navigate to="/account/login" />
    }

  async function handleSubmit(e) {
    e.preventDefault()

    const updatedDoc = {
      name: doc.name,
      content: doc.content
    };

    const token = localStorage.getItem("token");
    const response = await fetch(`${baseURL}/docs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization" : `Bearer ${token}` },
      body: JSON.stringify(updatedDoc),
    });

    if (response.ok) {
      navigate('/docs')
    } else {
      alert('Problem vid upddatering av dokument.')
    }
  }

  function showEmailBox() {
    if (emailBox == "hide") {
      setEmailBox("show")
    } else {
      setEmailBox("hide")
    }
  }

  async function handleShare() {
    const result = await docsModel.shareDoc(id, userEmail);
    if (result) {
      alert(`Delningsinbjudan skickad till ${userEmail}`);
      setEmail("");
    } else {
      alert("Kunde inte dela dokumentet.");
    }
  }

  return(
      <>
      <nav>
        <ul className="icons-list">
          <li className="share-font" onClick={showEmailBox}><i className="fa-solid fa-share-nodes"></i></li>
        </ul>
      </nav>
      <div className="view-doc">
        <form onSubmit={handleSubmit} className="new-doc">
          <label htmlFor="title">Titel</label>
          <input
            className="title-input"
            type="text"
            name="name"
            value={doc.name}
            onChange={(e) => setDoc({ ...doc, name: e.target.value })}
            required
          />

          <label htmlFor="content">Innehåll</label>
          <textarea
            className="document-text"
            name="content"
            value={doc.content}
            onChange={(e) => {
              const newContent = e.target.value;
              setDoc({ ...doc, content: newContent });
              if (socketRef.current) {
                socketRef.current.emit("doc:update", {
                  docId: id,
                  content: newContent,
                });
              }
            }}
            required
          />

          <input className="update-doc-button" type="submit" value="Uppdatera" />
          </form>
        </div>

        <div className={`email-section-overlay ${emailBox}`}>
          <div id="share-email-section">
            <h2>Share "{doc.name}"</h2>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="userEmail"
              value={userEmail}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="share-buttons">
              <button onClick={handleShare}>Dela dokument</button>
              <button onClick={showEmailBox}>Stäng</button>
            </div>
          </div>
        </div>

      </>
  )
}

export default View_doc