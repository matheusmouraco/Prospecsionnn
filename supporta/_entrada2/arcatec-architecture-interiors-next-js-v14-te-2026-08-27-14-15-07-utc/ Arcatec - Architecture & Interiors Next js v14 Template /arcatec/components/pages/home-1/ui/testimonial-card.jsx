export default function TestimonialCard({ data }) {
    return (
        <div className="single-slide">
            <div className="testimonial-widget">
                <div className="testimonial-widget__icon">
                    <img src={data.icon} alt="icon" />
                </div>
                <div className="testimonial-widget__body">
                    <p>{data.quote}</p>
                    <span>{data.name}</span>
                </div>
            </div>
        </div>
    );
}
