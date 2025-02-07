import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PilgrimageGuides = () => {
  const [activeTab, setActiveTab] = useState('hajj');

  const guides = {
    hajj: {
      title: 'Comprehensive Hajj Guide',
      sections: [
        {
          title: 'Prerequisites & Preparation',
          content: [
            'Being Muslim',
            'Being of sound mind and physically capable',
            'Having the financial means without incurring debt',
            'For women, having a Mahram',
            'Having valid documentation and permits',
            'Completing required vaccinations',
            'Physical fitness preparation',
            'Learning essential duas and adhkar'
          ],
          source: 'Sahih Al-Bukhari 1513, Sahih Muslim 1337'
        },
        {
          title: 'Types of Hajj',
          content: [
            'Ifrad: Hajj only, remaining in ihram until completion',
            'Tamattu: Umrah first, then Hajj with a new ihram (most common)',
            'Qiran: Hajj and Umrah with one continuous ihram',
            'Differences in requirements and obligations for each type',
            'Choosing the most suitable type based on circumstances'
          ],
          source: 'Sahih Muslim 1211, 1216'
        },
        {
          title: 'Essential Steps of Hajj',
          content: [
            'Ihram: Sacred state with specific clothing and prohibitions',
            'Tawaf al-Qudum: Initial circumambulation upon arrival',
            'Sa\'i: Walking between Safa and Marwa seven times',
            'Staying in Mina: 8th of Dhul Hijjah',
            'Standing at Arafat: 9th of Dhul Hijjah (most important)',
            'Muzdalifah: Overnight stay and collecting pebbles',
            'Jamarat: Stoning the pillars over three days',
            'Tawaf al-Ifadah: Main pillar of Hajj',
            'Tawaf al-Wada: Farewell circumambulation'
          ],
          source: 'Sahih Al-Bukhari 1643, Sahih Muslim 1218'
        },
        {
          title: 'Prohibitions During Ihram',
          content: [
            'Wearing fitted/stitched clothing (for men)',
            'Using perfume or scented products',
            'Cutting hair or nails',
            'Hunting or harming animals',
            'Intimate relations',
            'Covering the face (for men)',
            'Wearing gloves (for women)',
            'Business dealings'
          ],
          source: 'Sahih Al-Bukhari 1838, Sunan Abu Dawud 1819'
        },
        {
          title: 'Common Mistakes to Avoid',
          content: [
            'Rushing during tawaf or sa\'i',
            'Missing the boundaries of Arafat',
            'Leaving Muzdalifah before Fajr without excuse',
            'Incorrect stoning technique at Jamarat',
            'Delegating rituals without valid excuse',
            'Neglecting mandatory prayers',
            'Not maintaining proper ihram restrictions'
          ],
          source: 'Various scholarly sources'
        }
      ],
      references: [
        'The Prophet\'s Farewell Hajj (Sahih Muslim)',
        'Sunan Abu Dawud',
        'Sahih Al-Bukhari',
        'IslamQA Scholarly Articles on Hajj',
        'Ministry of Hajj and Umrah Guidelines',
        'Contemporary Scholarly Works on Hajj Fiqh'
      ]
    },
    umrah: {
      title: 'Detailed Umrah Guide',
      sections: [
        {
          title: 'Essential Steps of Umrah',
          content: [
            'Entering Ihram from the appropriate Miqat',
            'Making the intention (niyyah) for Umrah',
            'Reciting Talbiyah continuously',
            'Performing Tawaf al-Umrah (7 rounds)',
            'Praying two rakats at Maqam Ibrahim',
            'Performing Sa\'i between Safa and Marwa',
            'Shaving or trimming the hair (Halq or Taqsir)',
            'Maintaining proper sequence of rituals'
          ],
          source: 'Sahih Al-Bukhari 1533, Sahih Muslim 1184'
        },
        {
          title: 'Preparation & Requirements',
          content: [
            'Valid Umrah visa and documentation',
            'Appropriate Ihram clothing',
            'Physical preparation and cleanliness',
            'Learning necessary duas and adhkar',
            'Understanding ritual requirements',
            'Health check and vaccinations',
            'Travel arrangements and accommodation'
          ],
          source: 'Ministry Guidelines, Scholarly Recommendations'
        },
        {
          title: 'Detailed Tawaf Guide',
          content: [
            'Starting from the Black Stone (Hajar al-Aswad)',
            'Keeping the Kaaba on your left',
            'Completing seven full rounds',
            'Recommended duas during each round',
            'Walking briskly in first three rounds (for men)',
            'Proper etiquette and behavior',
            'What invalidates Tawaf'
          ],
          source: 'Sahih Muslim 1218, Scholarly Works'
        },
        {
          title: 'Sa\'i Detailed Guide',
          content: [
            'Starting at Safa and ending at Marwa',
            'Recommended duas at each mount',
            'Walking normally except between green lights',
            'Counting rounds accurately',
            'Maintaining proper intention',
            'Common mistakes to avoid'
          ],
          source: 'Sahih Al-Bukhari 1643, Fiqh Literature'
        }
      ],
      references: [
        'Sahih Al-Bukhari',
        'Sahih Muslim',
        'Bulugh al-Maram',
        'IslamQA Detailed Umrah Guides',
        'Contemporary Scholarly Works',
        'Official Saudi Guidelines'
      ]
    },
    practical: {
      title: 'Practical Guidelines',
      sections: [
        {
          title: 'Health & Safety',
          content: [
            'Maintaining proper hydration',
            'Heat exhaustion prevention',
            'Essential medications and prescriptions',
            'Emergency contact information',
            'Location of medical facilities',
            'Physical preparation before travel',
            'Managing chronic conditions',
            'Food safety guidelines'
          ],
          source: 'WHO Guidelines, Saudi Ministry of Health'
        },
        {
          title: 'Travel Tips',
          content: [
            'Packing essentials checklist',
            'Transportation in holy cities',
            'Currency and money management',
            'Communication solutions',
            'Accommodation guidelines',
            'Local customs and etiquette',
            'Weather considerations',
            'Group travel tips'
          ],
          source: 'Travel Guidelines, Experienced Pilgrims'
        },
        {
          title: 'Documentation',
          content: [
            'Required permits and visas',
            'Vaccination certificates',
            'Travel insurance',
            'Emergency contacts',
            'Copies of important documents',
            'Registration procedures',
            'Group identification'
          ],
          source: 'Ministry Requirements, Embassy Guidelines'
        }
      ],
      references: [
        'WHO Travel Guidelines',
        'Saudi Ministry of Health',
        'Ministry of Hajj and Umrah',
        'Experienced Tour Operators'
      ]
    }
  };

  const additionalResources = [
    {
      title: 'Official Sources',
      links: [
        {
          name: 'Ministry of Hajj and Umrah',
          url: 'https://www.haj.gov.sa/',
          description: 'Official portal for Hajj and Umrah information and services'
        },
        {
          name: 'IslamQA',
          url: 'https://islamqa.info/en/categories/52/hajj-and-umrah',
          description: 'Comprehensive scholarly answers about Hajj and Umrah'
        },
        {
          name: 'Saudi Ministry of Health',
          url: 'https://www.moh.gov.sa/',
          description: 'Health guidelines and requirements for pilgrims'
        },
        {
          name: 'General Authority of Islamic Affairs',
          url: 'https://www.awqaf.gov.ae/',
          description: 'Religious guidance and fatawa'
        }
      ]
    },
    {
      title: 'Educational Resources',
      links: [
        {
          name: 'Hajj and Umrah Academy',
          url: '#',
          description: 'Online courses and educational materials'
        },
        {
          name: 'Scholarly Lectures',
          url: '#',
          description: 'Video lectures from prominent scholars'
        },
        {
          name: 'Interactive Guides',
          url: '#',
          description: '3D visualizations of rituals and locations'
        }
      ]
    },
    {
      title: 'Mobile Applications',
      links: [
        {
          name: 'Official Hajj App',
          url: '#',
          description: 'Navigation, scheduling, and ritual guidance'
        },
        {
          name: 'Manasik VR',
          url: '#',
          description: 'Virtual reality training for pilgrimage rituals'
        },
        {
          name: 'Pilgrim Assistant',
          url: '#',
          description: 'Offline maps, duas, and checklist'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Pilgrimage Guides</h1>
        
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          {Object.keys(guides).map((key) => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                window.scrollTo(0, 0);
              }}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === key
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)} Guide
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Guide Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {guides[activeTab as keyof typeof guides].title}
              </h2>
              
              {guides[activeTab as keyof typeof guides].sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-8 last:mb-0">
                  <h3 className="text-xl font-medium text-gray-900 mb-4">
                    {section.title}
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-500 mt-2">Source: {section.source}</p>
                </div>
              ))}
              
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-2">References:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  {guides[activeTab as keyof typeof guides].references.map((ref, refIndex) => (
                    <li key={refIndex} className="text-gray-700 text-sm">{ref}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Additional Resources */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Resources</h2>
              {additionalResources.map((resource, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">{resource.title}</h3>
                  <ul className="space-y-3">
                    {resource.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <span className="text-primary hover:text-primary-dark font-medium">
                            {link.name}
                          </span>
                          <p className="text-sm text-gray-600 mt-1">
                            {link.description}
                          </p>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
              <div className="space-y-3">
                <Link
                  to="/packages/hajj"
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <span className="font-medium text-gray-900">Browse Hajj Packages</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Find and compare available Hajj packages
                  </p>
                </Link>
                <Link
                  to="/packages/umrah"
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <span className="font-medium text-gray-900">Browse Umrah Packages</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Explore Umrah packages for all seasons
                  </p>
                </Link>
                <Link
                  to="/resources"
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <span className="font-medium text-gray-900">Download Resources</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Access downloadable guides and checklists
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PilgrimageGuides; 