import api from "./api";

//login
export const loginUser = async (email: string, password: string) => {
  const response = await api.post("/auth/login/", {
    email,
    password,
  });

  return response.data;
};

//register
export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  password: string,
) => {
  const response = await api.post("/auth/register/", {
    first_name: firstName,
    last_name: lastName,
    email,
    phone_number: phoneNumber,
    password,
  });

  return response.data;
};
