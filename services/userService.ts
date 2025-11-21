interface UserName {
  firstname: string;
  lastname: string;
}

interface UserGeolocation {
  lat: string;
  long: string;
}

interface UserAddress {
  geolocation: UserGeolocation;
  city: string;
  street: string;
  number: number;
  zipcode: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  name: UserName;
  phone: string;
  address: UserAddress;
  __v: number;
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch("https://fakestoreapi.com/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}

export async function getUser(id: number): Promise<User> {
  const response = await fetch(`https://fakestoreapi.com/users/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
}
