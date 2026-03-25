import React from 'react';

export default function SEO() {
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://rohan.fouralpha.org/#person",
        "name": "Rohan Krishnagoudar",
        "jobTitle": "System Architect & Co-Founder",
        "url": "https://rohan.fouralpha.org",
        "sameAs": [
          "https://linkedin.com/in/rohan-krishnagoudar",
          "https://github.com/rohan5kumar"
        ],
        "worksFor": {
          "@id": "https://explyra.com/#organization"
        },
        "description": "System Architect and Co-Founder at Explyra, specializing in high-performance computing, resilient microservices, and AI orchestration."
      },
      {
        "@type": "Organization",
        "@id": "https://explyra.com/#organization",
        "name": "Explyra",
        "url": "https://explyra.com",
        "founder": {
          "@id": "https://rohan.fouralpha.org/#person"
        },
        "description": "High-Performance API Documentation & AI Delivery platform."
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
