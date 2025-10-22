import { useState, useEffect } from "react"
import docsModel from "../models/getDocs.js"
import { Link, Navigate } from "react-router-dom"

function Home() {
    const [docs, setDocs] = useState([])
    const [shouldRedirect, setShouldRedirect] = useState(false)

    async function fetchDocs() {
        const result = await docsModel.getDocs()
        if (!result) {
            setShouldRedirect(true)
        }
        else {
            setDocs(result)
        }
    }

    useEffect(() => {
        fetchDocs()
      }, [])
    
    if (shouldRedirect) {
        return <Navigate to="/account/login" />
    }
    
    let docsListed = docs.map(doc => <li key={doc._id}><Link to={`/docs/${doc._id}`}>{doc.name}</Link></li>)

    return(
        <>
            <h1>All Documents</h1>
            <ul>
                {docsListed}
            </ul>
            <p><Link to={"/docs/add"}>New document</Link></p>
        </>
    )
}

export default Home