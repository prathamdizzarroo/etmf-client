import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api` || 'http://localhost:7000/api';

const studyProtocolService = {
  // Create a new study protocol
  createStudyProtocol: async (protocolData) => {
    try {
      const response = await axios.post(`${API_URL}/study-protocols`, protocolData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all study protocols
  getAllStudyProtocols: async () => {
    try {
      const response = await axios.get(`${API_URL}/study-protocols`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get study protocol by ID
  getStudyProtocolById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/study-protocols/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get study protocol by protocol number
  getStudyProtocolByNumber: async (protocolNumber) => {
    try {
      const response = await axios.get(`${API_URL}/study-protocols/protocol/${protocolNumber}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update study protocol
  updateStudyProtocol: async (id, protocolData) => {
    try {
      const response = await axios.put(`${API_URL}/study-protocols/${id}`, protocolData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete study protocol
  deleteStudyProtocol: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/study-protocols/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default studyProtocolService; 