import React from 'react';
import { Quote, Star } from 'lucide-react';

const ReviewCard = ({ review, showDate = false }) => {
    const StarRating = ({ rating }) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <Star
                    key={star}
                    size={14}
                    fill={star <= rating ? 'var(--color-accent, #e8b86d)' : 'transparent'}
                    color={star <= rating ? 'var(--color-accent, #e8b86d)' : '#444'}
                />
            ))}
        </div>
    );

    return (
        <div className="bg-secondary p-8 md:p-10 rounded-[40px] relative border-2 border-white/5 hover:border-accent/10 transition-all duration-700 group shadow-lg">
            <div className="flex justify-between items-start mb-6 md:mb-8">
                <StarRating rating={review.rating} />
                {showDate && (
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                        {new Date(review.created_at).toLocaleDateString()}
                    </span>
                )}
            </div>

            <p className="text-gray-300 mb-8 md:mb-10 leading-relaxed text-sm md:text-base lg:text-lg font-medium italic">
                "{review.feedback}"
            </p>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                        <Quote size={18} className="opacity-50" />
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-white uppercase tracking-[0.1em] text-[10px] md:text-xs">
                        {review.name}
                    </h4>
                    {review.is_featured && (
                        <span className="text-[8px] md:text-[9px] text-accent font-black uppercase tracking-widest mt-1 flex items-center gap-1">
                            Featured Guest
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
