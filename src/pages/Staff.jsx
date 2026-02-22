import { useData } from '../context/DataContext';
import { Instagram, Twitter } from 'lucide-react';

const Staff = () => {
    const { staffMembers } = useData();

    return (
        <div className="staff-page bg-[#080808] min-h-screen pb-24 font-outfit relative overflow-hidden">
            {/* Header Section with Background */}
            <div className="relative pt-48 pb-32 mb-16 md:mb-24 overflow-hidden">
                {/* Background Image with Dark Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=2000"
                        alt="Staff Background"
                        className="w-full h-full object-cover grayscale-[0.8] brightness-[0.2]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]"></div>
                </div>

                <div className="container relative z-10 px-4 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="w-12 h-1 bg-accent"></div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter text-white">
                                THE <br />
                                <span className="text-accent italic">CREW</span>
                            </h1>
                        </div>
                        <p className="max-w-md text-gray-400 font-medium italic text-lg leading-relaxed">
                            Meet the maestros behind the rhythm. A world-class collective of culinary and hospitality experts.
                        </p>
                    </div>
                </div>
            </div>

            {/* Ambient Background */}
            <div className="fixed top-0 right-0 w-[50vw] h-[50vw] bg-accent/3 blur-[160px] pointer-events-none rounded-full"></div>
            <div className="fixed -bottom-20 -left-20 w-[40vw] h-[40vw] bg-white/5 blur-[140px] pointer-events-none rounded-full"></div>

            <div className="container relative z-10 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {staffMembers.map(member => (
                        <div key={member.id} className="group flex flex-col items-center text-center">
                            <div className="relative mb-8 w-full aspect-square rounded-[40px] overflow-hidden border-2 border-white/5 shadow-2xl group-hover:border-accent/20 transition-all duration-700">
                                <img
                                    src={member.image_url}
                                    alt={member.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                    <div className="w-10 h-10 rounded-2xl bg-accent text-black flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"><Instagram size={18} /></div>
                                    <div className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"><Twitter size={18} /></div>
                                </div>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black italic text-white mb-2 uppercase tracking-tight">{member.name}</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4 px-4 py-1.5 bg-accent/5 rounded-full border border-accent/10">{member.role}</p>
                            <p className="text-gray-500 font-medium text-sm italic max-w-xs leading-relaxed">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Staff;
