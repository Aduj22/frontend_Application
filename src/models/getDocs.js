import baseURL from "../utils.jsx";

const docsModel = {
    getDocs: async function getDocs() {
        try {
            const response = await fetch(baseURL);
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
            const response = await fetch(`${baseURL}/${id}`);
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }
        
            const result = await response.json();
            return result
        } catch (error) {
            console.error(error.message);
        }
    }

};

export default docsModel;