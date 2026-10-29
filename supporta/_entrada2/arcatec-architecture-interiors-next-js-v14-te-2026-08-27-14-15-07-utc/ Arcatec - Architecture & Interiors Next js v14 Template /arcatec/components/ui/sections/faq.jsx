import Link from "next/link";

export default function Faq() {
    return (
        <div className="faq-section section-padding-100">
            <div className="container">
                <div className="row row--custom gutter-y-40 ">
                    <div className="col-xxl-4 col-lg-5 col-md-9">
                        <div className="faq-content">
                            <div className="faq-content__text-block">
                                <span className="subtitle">
                                    Have any question?
                                </span>
                                <h1 className="faq-content__title heading-md text-black mb-res-60">
                                    The most common questions from our clients
                                </h1>
                            </div>
                            <div className="faq-content__button">
                                <Link
                                    href="/faq"
                                    className="btn btn-primary hvr-fill-black"
                                >
                                    Ask your question
                                    <i className="fa-solid fa-arrow-right icon-arrow-corner" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-7 offset-lg-1 col-lg-6">
                        <div className="accordion-style">
                            {/* faq collapse start */}
                            <div className="accordion-style" id="faq-02">
                                <div className="accordion-item">
                                    <button
                                        className="accordion-button "
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#faq-02-item"
                                        aria-expanded="true"
                                        aria-controls="faq-02-item"
                                    >
                                        What services do architects provide?
                                    </button>
                                    <div
                                        id="faq-02-item"
                                        className="accordion-collapse collapse show"
                                        data-bs-parent="#faq-02"
                                    >
                                        <div className="accordion-item__body">
                                            Lorem ipsum dolor sit amet,
                                            consectetur adipiscing elit. Mauris
                                            tempus vitae magna pulvinar laoreet.
                                            Nullam erat ipsum, mattis nec mollis
                                            a enim Nunc at euismod arcu. Aliquam
                                            ullamcorper
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#faq-02-item-2"
                                        aria-expanded="false"
                                        aria-controls="faq-02-item-2"
                                    >
                                        At what point in my project should I
                                        involve an architect?
                                    </button>
                                    <div
                                        id="faq-02-item-2"
                                        className="accordion-collapse collapse"
                                        data-bs-parent="#faq-02"
                                    >
                                        <div className="accordion-item__body">
                                            Lorem ipsum dolor sit amet,
                                            consectetur adipiscing elit. Mauris
                                            tempus vitae magna pulvinar laoreet.
                                            Nullam erat ipsum, mattis nec mollis
                                            a enim Nunc at euismod arcu. Aliquam
                                            ullamcorper
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#faq-02-item-3"
                                        aria-expanded="false"
                                        aria-controls="faq-02-item-3"
                                    >
                                        How do I find the right architect for my
                                        project?
                                    </button>
                                    <div
                                        id="faq-02-item-3"
                                        className="accordion-collapse collapse"
                                        data-bs-parent="#faq-02"
                                    >
                                        <div className="accordion-item__body">
                                            Lorem ipsum dolor sit amet,
                                            consectetur adipiscing elit. Mauris
                                            tempus vitae magna pulvinar laoreet.
                                            Nullam erat ipsum, mattis nec mollis
                                            a enim Nunc at euismod arcu. Aliquam
                                            ullamcorper
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#faq-02-item-4"
                                        aria-expanded="false"
                                        aria-controls="faq-02-item-4"
                                    >
                                        Don&apos;t architects add substantial
                                        cost to a project?
                                    </button>
                                    <div
                                        id="faq-02-item-4"
                                        className="accordion-collapse collapse"
                                        data-bs-parent="#faq-02"
                                    >
                                        <div className="accordion-item__body">
                                            Lorem ipsum dolor sit amet,
                                            consectetur adipiscing elit. Mauris
                                            tempus vitae magna pulvinar laoreet.
                                            Nullam erat ipsum, mattis nec mollis
                                            a enim Nunc at euismod arcu. Aliquam
                                            ullamcorper
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#faq-02-item-5"
                                        aria-expanded="false"
                                        aria-controls="faq-02-item-5"
                                    >
                                        Will you be able to design the style of
                                        building I want?
                                    </button>
                                    <div
                                        id="faq-02-item-5"
                                        className="accordion-collapse collapse"
                                        data-bs-parent="#faq-02"
                                    >
                                        <div className="accordion-item__body">
                                            Lorem ipsum dolor sit amet,
                                            consectetur adipiscing elit. Mauris
                                            tempus vitae magna pulvinar laoreet.
                                            Nullam erat ipsum, mattis nec mollis
                                            a enim Nunc at euismod arcu. Aliquam
                                            ullamcorper
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#faq-02-item-6"
                                        aria-expanded="false"
                                        aria-controls="faq-02-item-6"
                                    >
                                        What’s the largest project you’ve ever
                                        worked on?
                                    </button>
                                    <div
                                        id="faq-02-item-6"
                                        className="accordion-collapse collapse"
                                        data-bs-parent="#faq-02"
                                    >
                                        <div className="accordion-item__body">
                                            Lorem ipsum dolor sit amet,
                                            consectetur adipiscing elit. Mauris
                                            tempus vitae magna pulvinar laoreet.
                                            Nullam erat ipsum, mattis nec mollis
                                            a enim Nunc at euismod arcu. Aliquam
                                            ullamcorper
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* faq collapse end */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
