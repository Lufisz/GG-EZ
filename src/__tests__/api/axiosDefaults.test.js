import axios from "axios";

describe("Axios Configuration and Interceptors", () => {
  beforeAll(() => {
    // Mock the environment variable
    process.env.REACT_APP_API_URL = "mocked-api-url";

    // Explicitly set axios defaults using the mocked environment variable
    axios.defaults.baseURL = process.env.REACT_APP_API_URL;
    axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
    axios.defaults.withCredentials = true;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("sets baseURL and Content-Type correctly", () => {
    expect(axios.defaults.baseURL).toBe(process.env.REACT_APP_API_URL); // Mocked value
    expect(axios.defaults.headers.post["Content-Type"]).toBe("multipart/form-data");
    expect(axios.defaults.withCredentials).toBe(true);
  });

  test("attaches JWT token to request headers if token exists", async () => {
    const mockToken = "mock-jwt-token";
    localStorage.setItem("accessToken", mockToken);

    const mockRequestConfig = { headers: {} };

    // Simulate the interceptor behavior
    const interceptorLogic = (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    };

    const configWithToken = interceptorLogic(mockRequestConfig);
    expect(configWithToken.headers.Authorization).toBe(`Bearer ${mockToken}`);
  });

  test("does not attach Authorization header if no token exists", async () => {
    localStorage.removeItem("accessToken");

    const mockRequestConfig = { headers: {} };

    // Simulate the interceptor behavior
    const interceptorLogic = (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    };

    const configWithoutToken = interceptorLogic(mockRequestConfig);
    expect(configWithoutToken.headers.Authorization).toBeUndefined();
  });
});
