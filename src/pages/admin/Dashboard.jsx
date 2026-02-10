import React from 'react';
import { useData } from '../../context/DataContext';
import { Users, Utensils, BookOpen, DollarSign } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center gap-4">
        <div className={`p-3 rounded-full ${color} bg-opacity-20 text-white`}>
            <Icon size={24} />
        </div>
        <div>
            <h3 className="text-gray-400 text-sm uppercase">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const { bookings, menuItems, blogPosts } = useData();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Bookings"
                    value={bookings.length}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Menu Items"
                    value={menuItems.length}
                    icon={Utensils}
                    color="bg-green-500"
                />
                <StatCard
                    title="Blog Posts"
                    value={blogPosts.length}
                    icon={BookOpen}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Pending Requests"
                    value={bookings.filter(b => b.status === 'pending').length}
                    icon={DollarSign}
                    color="bg-yellow-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Bookings */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-gray-400 border-b border-gray-700">
                                    <th className="pb-3">Name</th>
                                    <th className="pb-3">Date</th>
                                    <th className="pb-3">Guests</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {bookings.slice(-5).reverse().map(booking => (
                                    <tr key={booking.id}>
                                        <td className="py-3">{booking.name}</td>
                                        <td className="py-3">{booking.date}</td>
                                        <td className="py-3">{booking.guests}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded text-xs ${booking.status === 'confirmed' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions or Other Stats */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Quick Tasks</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-700 rounded flex justify-between items-center">
                            <span>Review pending bookings</span>
                            <button className="text-sm bg-accent text-black px-3 py-1 rounded">View</button>
                        </div>
                        <div className="p-4 bg-gray-700 rounded flex justify-between items-center">
                            <span>Update daily special</span>
                            <button className="text-sm bg-accent text-black px-3 py-1 rounded">Edit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
