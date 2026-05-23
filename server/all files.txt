import axios from "axios";

const API = "http://localhost:5000";

export const getProducts = () => axios.get(`${API}/products`);