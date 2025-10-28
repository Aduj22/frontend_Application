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
  const [comments, setComments] = useState([])
  const [selectedLine, setSelectedLine] = useState(null)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [newComment, setNewComment] = useState("")

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

  async function fetchComments() {
    const result = await docsModel.getComments(id)
    if (result) setComments(result)
  }

  useEffect(() => {
    fetchDoc()
    fetchComments()
  }, [id])

  useEffect(() => {
    const socket = io(baseURL);
    socketRef.current = socket;

    socket.emit("joinDoc", id);

    socket.on("doc:update", (newContent) => {
      setDoc((doc) => ({ ...doc, content: newContent }));
    });

    socket.on("comment:add", (newComment) => {
      setComments(prev => [...prev, newComment]);
    });

    socket.on("comment:delete", (deletedCommentId) => {
      setComments(prev => prev.filter(comment => comment._id !== deletedCommentId));
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
      alert('Problem vid uppdatering av dokument.')
    }
  }

  function showEmailBox() {
    setEmailBox(emailBox === "hide" ? "show" : "hide")
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

  // Kommentar-funktioner
  const getCommentsForLine = (lineNumber) => {
    return comments.filter(comment => comment.lineNumber === lineNumber);
  };

  const getCurrentLineNumber = () => {
    const textarea = document.querySelector('.document-text');
    if (!textarea) return 1;
    const text = textarea.value;
    const cursorPos = textarea.selectionStart;
    const lines = text.substring(0, cursorPos).split('\n');
    return lines.length;
  };

  const handleCommentClick = () => {
    const lineNumber = getCurrentLineNumber();
    setSelectedLine(lineNumber);
    setIsCommentModalOpen(true);
  };

  const handleAddComment = async () => {
    if (newComment.trim() && selectedLine !== null) {
      const result = await docsModel.addComment(id, selectedLine, newComment);
      if (result) {
        setNewComment("");
        setIsCommentModalOpen(false);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    await docsModel.deleteComment(id, commentId);
  };

  return(
      <>
      <nav>
        <ul className="icons-list">
          <li className="share-font" onClick={showEmailBox}><i className="fa-solid fa-share-nodes"></i></li>
          <li className="comment-font" onClick={handleCommentClick}>
            <i className="fa-regular fa-comment"></i>
          </li>
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

      {/* Comment Modal */}
      {isCommentModalOpen && (
        <div className="comment-modal-overlay">
          <div className="comment-modal">
            <div className="comment-modal-header">
              <h3>Kommentarer för rad {selectedLine}</h3>
              <button className="close-button" onClick={() => setIsCommentModalOpen(false)}>×</button>
            </div>
            
            <div className="existing-comments">
              {getCommentsForLine(selectedLine).map(comment => (
                <div key={comment._id} className="comment-item">
                  <div className="comment-header">
                    <strong>{comment.author}</strong>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleString('sv-SE')}
                    </span>
                    <button 
                      className="delete-comment"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="comment-content">{comment.content}</div>
                </div>
              ))}
            </div>

            <div className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Skriv din kommentar..."
                rows="3"
              />
              <div className="comment-buttons">
                <button type="button" onClick={handleAddComment}>Lägg till kommentar</button>
                <button type="button" onClick={() => setIsCommentModalOpen(false)}>Avbryt</button>
              </div>
            </div>
          </div>
        </div>
      )}

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