const API_URL = process.env.REACT_APP_API_URL || 'https://mkl-admin-backend.onrender.com/api';

export const getCustomers = async (excludeImages = true) => {
  try {
    const url = excludeImages 
      ? `${API_URL}/customers?excludeImages=true` 
      : `${API_URL}/customers`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch customers');
    return response.json();
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
};

export const addCustomer = async (customer) => {
  try {
    const response = await fetch(`${API_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add customer');
    }
    return response.json();
  } catch (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
};

export const updateCustomer = async (id, data) => {
  try {
    const response = await fetch(`${API_URL}/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update customer');
    return response.json();
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await fetch(`${API_URL}/customers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete customer');
    return response.json();
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

export const searchCustomers = async (name) => {
  try {
    const response = await fetch(`${API_URL}/customers/search/${name}`);
    if (!response.ok) throw new Error('Failed to search customers');
    return response.json();
  } catch (error) {
    console.error('Error searching customers:', error);
    return [];
  }
};





