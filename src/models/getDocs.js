import baseURL from "../utils.jsx";

const docsModel = {
    getDocs: async function getDocs() {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${baseURL}/docs`, {
                headers: { "Content-Type": "application/json", "Authorization" : `Bearer ${token}` }
            });
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }
        
            const result = await response.json();
            return result
        } catch (error) {
            console.error(error.message);
        }
    },

    getDoc: async function getDoc(id) {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${baseURL}/docs/${id}`, {
                headers: { "Content-Type": "application/json", "Authorization" : `Bearer ${token}` }
            });
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }
        
            const result = await response.json();
            return result
        } catch (error) {
            console.error(error.message);
        }
    },

    shareDoc: async function shareDoc(id, email) {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${baseURL}/docs/${id}/share`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization" : `Bearer ${token}` },
                body: JSON.stringify({ userEmail: email }),
            });
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }
        
            const result = await response.json();
            return result
        } catch (error) {
            console.error(error.message);
        }
    },

    getComments: async function getComments(id) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${baseURL}/docs/${id}/comments`, {
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}` 
            }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error.message);
        return null;
    }
},

addComment: async function addComment(id, lineNumber, content) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${baseURL}/docs/${id}/comments`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ lineNumber, content }),
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error.message);
        return null;
    }
},

deleteComment: async function deleteComment(id, commentId) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${baseURL}/docs/${id}/comments/${commentId}`, {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}` 
            }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

};

export default docsModel;