// components/driver/DriverReviews.tsx
'use client';

import { Star } from 'lucide-react';

interface Review {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
}

interface DriverReviewsProps {
    reviews: Review[];
}

export default function DriverReviews({ reviews }: DriverReviewsProps) {
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${
                    i < Math.floor(rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : i < rating
                            ? 'fill-yellow-200 text-yellow-400'
                            : 'text-zinc-300'
                }`}
            />
        ));
    };

    return (
        <div className="bg-zinc-900 rounded-2xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white mb-6">
                Отзывы ({reviews.length})
            </h2>
            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="border-b border-zinc-700 last:border-b-0 pb-6 last:pb-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {review.userName[0]}
                  </span>
                                </div>
                                <div>
                                    <div className="font-semibold text-white">{review.userName}</div>
                                    <div className="flex items-center gap-1">
                                        {renderStars(review.rating)}
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm text-zinc-400 sm:text-right">
                                {review.date}
                            </div>
                        </div>
                        <p className="text-zinc-300 leading-relaxed pl-0 sm:pl-13">
                            {review.comment}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}