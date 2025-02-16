import { useLocation } from 'react-router-dom';

const ReviewsPage = () => {
  const location = useLocation();
  const reviews = location.state?.reviews || [];

  return (
    <div className="p-6 bg-slate-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold text-sky-400">Reviews</h1>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className="bg-slate-700 p-3 rounded-lg mt-2">
            <p className="text-slate-300">{review.content}</p>
          </div>
        ))
      ) : (
        <p className="text-slate-400 text-center">No reviews available.</p>
      )}
    </div>
  );
};

export default ReviewsPage;
