// Mock Data for Admin Dashboard

export const usersData = [
    { id: 1, name: 'Jane Doe', email: 'jane.doe@example.com', phone: '+1 (555) 012-3456', bookings: 42, joinDate: 'Oct 12, 2023', status: 'Active' },
    { id: 2, name: 'Michael Smith', email: 'mike.smith@provider.net', phone: '+1 (555) 098-7654', bookings: 18, joinDate: 'Dec 01, 2023', status: 'Suspended' },
    { id: 3, name: 'Sarah Wilson', email: 'swilson@agency.co', phone: '+1 (555) 012-3456', bookings: 125, joinDate: 'Aug 15, 2022', status: 'Active' },
    { id: 4, name: 'Robert Brown', email: 'robert.b@mail.com', phone: '+1 (555) 765-4321', bookings: 3, joinDate: 'Jan 20, 2024', status: 'Active' },
    { id: 5, name: 'Emily Davis', email: 'emily.d@test.com', phone: '+1 (555) 111-2222', bookings: 0, joinDate: 'Feb 10, 2024', status: 'Pending' },
];

export const partnersData = [
    { id: 1, name: 'Robert Fox', email: 'robert.fox@example.com', category: 'Home Cleaning', rating: 4.9, reviews: 128, status: 'Verified', earnings: '$12,450.00' },
    { id: 2, name: 'Jane Cooper', email: 'jane.c@partner.com', category: 'Electrical', rating: 4.5, reviews: 94, status: 'Pending', earnings: '$3,120.00' },
    { id: 3, name: 'Marvin Weaver', email: 'm.weaver@domain.io', category: 'Plumbing', rating: 4.7, reviews: 215, status: 'Verified', earnings: '$8,940.00' },
    { id: 4, name: 'Cody Fisher', email: 'cody.f@outlook.com', category: 'Painting', rating: 3.8, reviews: 12, status: 'Suspended', earnings: '$540.00' },
    { id: 5, name: 'Esther Howard', email: 'esther.h@gmail.com', category: 'Home Repair', rating: 4.8, reviews: 310, status: 'Verified', earnings: '$15,200.00' },
];

export const bookingsData = [
    { id: 'ORD-92841', customer: 'Jane Doe', service: 'Deep Cleaning', partner: 'CleanPro Solutions', schedule: 'Oct 26, 2023 10:00 AM', status: 'Assigned' },
    { id: 'ORD-92842', customer: 'Mark Smith', service: 'Plumbing Repair', partner: 'Unassigned', schedule: 'Oct 26, 2023 02:00 PM', status: 'Pending' },
    { id: 'ORD-92843', customer: 'Anna Lee', service: 'AC Maintenance', partner: 'CoolAir Tech', schedule: 'Oct 25, 2023 11:30 AM', status: 'Completed' },
    { id: 'ORD-92844', customer: 'Ben King', service: 'Electrical Wiring', partner: 'VoltFix Pros', schedule: 'Oct 27, 2023 01:00 PM', status: 'Assigned' },
];

export const transactionsData = [
    { id: 'TXN-56214', service: 'Swift Delivery Co.', date: 'Oct 24, 2023 14:22', amount: '$1,240.00', commission: '$186.00', status: 'Completed' },
    { id: 'TXN-56215', service: 'HomePro Solutions', date: 'Oct 24, 2023 12:45', amount: '$850.00', commission: '$127.50', status: 'Pending' },
    { id: 'TXN-56216', service: 'Urban Eats Group', date: 'Oct 23, 2023 21:10', amount: '$4,200.00', commission: '$630.00', status: 'Completed' },
    { id: 'TXN-56217', service: 'Zen Wellness Hub', date: 'Oct 23, 2023 18:30', amount: '$210.00', commission: '$31.50', status: 'Failed' },
];

export const settingsConfig = {
    serviceRadius: 25,
    commission: 12,
    maintenanceMode: false,
    twoFactor: true,
    adminName: 'Alexander Wright',
    adminEmail: 'alex.admin@company.com',
    adminPhone: '+1 (555) 012-3456'
};
