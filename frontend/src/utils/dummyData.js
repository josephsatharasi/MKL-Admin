export const dummyCustomers = [
  {
    id: 1001,
    name: 'Rajesh Kumar',
    phone: '+91 9876543210',
    email: 'rajesh.kumar@email.com',
    address: 'Flat 301, Green Valley Apartments, Banjara Hills, Hyderabad - 500034',
    plan: '12',
    startDate: '2024-12-20',
    endDate: '2025-12-20',
    createdAt: '2024-12-20T10:00:00.000Z'
  },
  {
    id: 1002,
    name: 'Priya Sharma',
    phone: '+91 9123456789',
    email: 'priya.sharma@email.com',
    address: 'House No 45, Jubilee Hills, Hyderabad - 500033',
    plan: '6',
    startDate: '2024-06-25',
    endDate: '2025-12-25',
    createdAt: '2024-06-25T11:30:00.000Z'
  },
  {
    id: 1003,
    name: 'Amit Patel',
    phone: '+91 9988776655',
    email: 'amit.patel@email.com',
    address: 'Plot 12, Gachibowli, Hyderabad - 500032',
    plan: '3',
    startDate: '2024-09-22',
    endDate: '2025-12-22',
    createdAt: '2024-09-22T09:15:00.000Z'
  },
  {
    id: 1004,
    name: 'Sneha Reddy',
    phone: '+91 9876512345',
    email: 'sneha.reddy@email.com',
    address: 'Villa 8, Kondapur, Hyderabad - 500084',
    plan: '12',
    startDate: '2025-01-05',
    endDate: '2026-01-05',
    createdAt: '2025-01-05T14:20:00.000Z'
  },
  {
    id: 1005,
    name: 'Vikram Singh',
    phone: '+91 9123498765',
    email: 'vikram.singh@email.com',
    address: 'Flat 502, Madhapur, Hyderabad - 500081',
    plan: '6',
    startDate: '2024-07-28',
    endDate: '2025-12-28',
    createdAt: '2024-07-28T16:45:00.000Z'
  },
  {
    id: 1006,
    name: 'Ananya Iyer',
    phone: '+91 9876501234',
    email: 'ananya.iyer@email.com',
    address: 'Apartment 201, Kukatpally, Hyderabad - 500072',
    plan: '3',
    startDate: '2024-09-23',
    endDate: '2025-12-23',
    createdAt: '2024-09-23T10:30:00.000Z'
  },
  {
    id: 1007,
    name: 'Karthik Rao',
    phone: '+91 9988112233',
    email: 'karthik.rao@email.com',
    address: 'House 15, Miyapur, Hyderabad - 500049',
    plan: '12',
    startDate: '2025-01-10',
    endDate: '2026-01-10',
    createdAt: '2025-01-10T12:00:00.000Z'
  },
  {
    id: 1008,
    name: 'Divya Menon',
    phone: '+91 9123445566',
    email: 'divya.menon@email.com',
    address: 'Flat 405, Ameerpet, Hyderabad - 500016',
    plan: '6',
    startDate: '2024-08-08',
    endDate: '2026-01-08',
    createdAt: '2024-08-08T15:30:00.000Z'
  }
];

export const initializeDummyData = () => {
  const existing = localStorage.getItem('customers');
  if (!existing || JSON.parse(existing).length === 0) {
    localStorage.setItem('customers', JSON.stringify(dummyCustomers));
  }
};
