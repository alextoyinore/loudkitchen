import React from 'react';
import { useData } from '../context/DataContext';

const Staff = () => {
    const { staffMembers } = useData();

    return (
        <div className="staff-page">
            <div className="container section text-center">
                <h1 className="mb-4">The <span className="text-accent">Band</span></h1>
                <p className="max-w-2xl mx-auto text-gray-400 mb-12">
                    Meet the rockstars behind the line and behind the bar.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {staffMembers.map(member => (
                        <div key={member.id} className="staff-card bg-secondary p-8 rounded-lg border border-gray-800 text-center hover:border-accent transition-all duration-300 hover:transform hover:-translate-y-2">
                            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-2 border-accent">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-3xl mb-2 font-heading uppercase">{member.name}</h3>
                            <p className="text-accent text-base uppercase tracking-wider mb-6 font-bold">{member.role}</p>
                            <p className="text-gray-400 italic text-lg">"{member.bio}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Staff;
