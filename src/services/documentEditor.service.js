import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/documentEditor';
const API_URL = `${process.env.REACT_APP_API_URL}/api/documentEditor`;
const docuemtEditorService = {
  // In documentEditor.service.js
  createSection: async (sectionData) => {
    try {
      // Send the section data directly, not wrapped in a sections array
      const response = await axios.post(`${API_URL}/create`, sectionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get ALL Sections Available in the Database
  getAllSections: async () => {
    try {
      const response = await axios.get(`${API_URL}/all`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },


//Update Section from database
  updateSection: async (sectionId, updateData) => {
    try {
      const response = await axios.put(`${API_URL}/update/${sectionId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  //Delete Section from database
  deleteSection: async (sectionId) => {
    try {
      const response = await axios.delete(`${API_URL}/delete/${sectionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  //Delete All Sections from database
  deleteAllSections: async () => {
    try {
      const response = await axios.delete(`${API_URL}/deleteAll`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  //AddNew Version of the Document (Sections)
  addNewVersion: async (versionData) => {
    try {
      const response = await axios.post(`${API_URL}/createVersion`, versionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get ALL Versions Available in the Database
  getAllVersions: async (sectionId) => {
    try {
      const response = await axios.get(`${API_URL}/allVersions/${sectionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
}


export default docuemtEditorService; 