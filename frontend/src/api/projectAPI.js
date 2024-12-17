import axios from 'axios';  

const API_URL = process.env.REACT_APP_API_URL;  

export const fetchAllProjects = async () => {
    try {
        const response = await axios.get(`${API_URL}/projects`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to load projects');
    }
};

export const fetchProjectDetails = async (projectId) => {
    try {  
        const response = await axios.get(`/api/projects/${projectId}`);  
        return response.data;  
    } catch (error) {  
        throw new Error('Failed to fetch project');  
    }  

};

export const addProject = async (projectData) => {  
    try {  
        const response = await axios.post(`${API_URL}/projects`, projectData);  
        return response.data;  
    } catch (error) {  
        throw new Error('Failed to add project');  
    }  
};  

export const updateProject = async (projectId, projectData) => {  
    try {  
        const response = await axios.put(`${API_URL}/projects/${projectId}`, projectData);  
        return response.data;  
    } catch (error) {  
        throw new Error('Failed to update project');  
    }  
};  

export const deleteProject = async (projectId) => {  
    try {  
        await axios.delete(`${API_URL}/projects/${projectId}`);  
    } catch (error) {  
        throw new Error('Failed to delete project');  
    }  
};