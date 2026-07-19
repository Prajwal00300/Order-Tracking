const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Fetch all orders, with optional status filter
 */
export const getOrders = async (status = '') => {
  try {
    const url = status ? `${API_URL}/orders?status=${status}` : `${API_URL}/orders`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch orders');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in getOrders:', error);
    throw error;
  }
};

/**
 * Fetch a single order by ID
 */
export const getOrderById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/orders/${id}`);
    if (!response.ok) throw new Error('Failed to fetch order');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in getOrderById:', error);
    throw error;
  }
};

/**
 * Create a new order
 */
export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create order');
    return data;
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
};

/**
 * Update an existing order
 */
export const updateOrder = async (id, orderData) => {
  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update order');
    return data;
  } catch (error) {
    console.error('Error in updateOrder:', error);
    throw error;
  }
};

/**
 * Delete an order
 */
export const deleteOrder = async (id) => {
  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete order');
    return data;
  } catch (error) {
    console.error('Error in deleteOrder:', error);
    throw error;
  }
};
