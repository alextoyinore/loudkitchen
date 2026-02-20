import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const Book = () => {
    const { addBooking } = useData();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: 2,
        requests: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error: submitError } = await addBooking({ ...formData, notes: formData.requests });
            if (submitError) throw submitError;
            setSubmitted(true);
        } catch (err) {
            console.error('Booking error:', err);
            setError('Failed to book table. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="container section h-screen flex flex-col items-center justify-center text-center">
                <h1 className="text-accent mb-4">Reservation Received!</h1>
                <p className="text-xl mb-8">Thank you, {formData.name}. We have received your request for a table.</p>
                <p className="text-gray-400">A confirmation email has been sent to {formData.email}.</p>
                <button
                    onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', phone: '', date: '', time: '', guests: 2, requests: '' });
                    }}
                    className="btn btn-primary mt-8"
                >
                    Make Another Booking
                </button>
            </div>
        );
    }

    return (
        <div className="booking-page relative">
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1920"
                    alt="Restaurant Ambiance"
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-transparent to-bg-primary"></div>
            </div>

            <div className="container section relative z-10 flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-1/2">
                    <h1 className="mb-6">Book a <span className="text-accent">Table</span></h1>
                    <p className="text-lg text-gray-300 mb-8">
                        Join us for an unforgettable dining experience.
                        Reservations are recommended, especially for weekend evenings.
                    </p>
                    <div className="contact-info space-y-4 text-gray-400">
                        <p><strong>For large parties (8+):</strong> Please contact us directly.</p>
                        <p><strong>Cancellations:</strong> Please let us know at least 24 hours in advance.</p>
                    </div>
                </div>

                <div className="md:w-1/2 bg-secondary p-8 rounded-lg shadow-2xl border border-gray-800">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1 text-gray-400">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1 text-gray-400">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1 text-gray-400">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1 text-gray-400">Guests</label>
                                <select
                                    name="guests"
                                    value={formData.guests}
                                    onChange={handleChange}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1 text-gray-400">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    value={formData.date}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1 text-gray-400">Time</label>
                                <select
                                    name="time"
                                    required
                                    value={formData.time}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Time</option>
                                    <option value="17:00">5:00 PM</option>
                                    <option value="17:30">5:30 PM</option>
                                    <option value="18:00">6:00 PM</option>
                                    <option value="18:30">6:30 PM</option>
                                    <option value="19:00">7:00 PM</option>
                                    <option value="19:30">7:30 PM</option>
                                    <option value="20:00">8:00 PM</option>
                                    <option value="20:30">8:30 PM</option>
                                    <option value="21:00">9:00 PM</option>
                                </select>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded mb-4 text-sm">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm mb-1 text-gray-400">Special Requests</label>
                            <textarea
                                name="requests"
                                rows="3"
                                value={formData.requests}
                                onChange={handleChange}
                                placeholder="Allergies, anniversaries, seating preference..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full mt-4 flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                'Confirm Reservation'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Book;
