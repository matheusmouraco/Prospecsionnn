import Link from "next/link";

export default function AwardWidget({ data }) {
    return (
        <div className="award-widget">
            <span className="date">{data.year}</span>
            <h3 className="award-widget__title">{data.title}</h3>
            <p>{data.brief}</p>
            <Link href="/home-2" className="award-widget__link">
                <i className="fa-solid fa-arrow-right" />
            </Link>
        </div>
    );
}
