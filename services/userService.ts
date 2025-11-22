export interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  location: string;
  status: "active" | "passive";
}

export interface CreateOrUpdateUser {
  id?: string;
  first_name?: string;
  last_name?: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
  location?: string;
  status?: "active" | "passive";
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch("http://localhost:4000/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}

export async function getUser(id: number): Promise<User> {
  const response = await fetch(`http://localhost:4000/users/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
}

export async function createUser(user: CreateOrUpdateUser): Promise<User> {
  const response = await fetch(`http://localhost:4000/users`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to create user");
  }
  return response.json();
}

export async function updateUser(id: number, user: CreateOrUpdateUser): Promise<User> {
  const response = await fetch(`http://localhost:4000/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to update user");
  }
  return response.json();
}

export async function deleteUser(id: number): Promise<void> {
  const response = await fetch(`http://localhost:4000/users/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
}
