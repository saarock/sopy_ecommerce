const handleResponse = async (apiCall) => {
    try {

      const response = await apiCall;      
      
      if (!response || response.statusCode !== 200) {
        throw new Error(response?.message || "Something went wrong!");
      }
  
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "An error occurred",
      };
    }
  };
  
  export default handleResponse;
  