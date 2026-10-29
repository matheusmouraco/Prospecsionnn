import React from 'react';

function Map() {
  return (
    <section className="tc-map-style1">
      <div className="map-card wow zoomIn slow" data-wow-delay="0.2s">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18542.46505157743!2d14.887766312855979!3d38.13861377046686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13169bb09ae2f91d%3A0x260b042a9d31dd31!2s98063%20San%20Francesco%2C%20Metropolitan%20City%20of%20Messina%2C%20Italy!5e0!3m2!1sen!2seg!4v1700594341684!5m2!1sen!2seg"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
}

export default Map;
