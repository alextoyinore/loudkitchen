import React from 'react';
import { useData } from '../context/DataContext';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
    const { siteSettings } = useData();

    return (
        <div className="contact-page">
            <div className="container section">
                <h1 className="text-center mb-16">Get in <span className="text-accent">Touch</span></h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Info */}
                    <div className="space-y-8">
                        <div className="flex gap-4 items-start">
                            <div className="bg-secondary p-3 rounded-full text-accent">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl mb-2">Location</h3>
                                <p className="text-gray-400">{siteSettings.address}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="bg-secondary p-3 rounded-full text-accent">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl mb-2">Phone</h3>
                                <p className="text-gray-400">{siteSettings.phone}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="bg-secondary p-3 rounded-full text-accent">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl mb-2">Email</h3>
                                <p className="text-gray-400">{siteSettings.contactEmail}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="bg-secondary p-3 rounded-full text-accent">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl mb-2">Hours</h3>
                                <ul className="text-gray-400 space-y-1">
                                    <li>Mon - Thu: 17:00 - 23:00</li>
                                    <li>Fri - Sat: 17:00 - 01:00</li>
                                    <li>Sunday: 16:00 - 22:00</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Map (Placeholder) */}
                    <div className="bg-secondary h-80 md:h-full rounded-lg flex items-center justify-center border border-gray-800">
                        <span className="text-gray-500">Map Integration Placeholder</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
