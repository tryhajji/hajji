import React from 'react';
import { FaPassport, FaHeartbeat, FaPlane, FaBook, FaMapMarkedAlt, FaLanguage, FaPhone, FaHospital, FaMosque, FaMapMarked, FaSearch } from 'react-icons/fa';

interface ResourceCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  links: {
    text: string;
    url: string;
  }[];
  category: string;
}

const Resources = () => {
  const resources: ResourceCard[] = [
    // Essential Documents Section
    {
      title: "Visa Requirements",
      description: "Complete guide to Hajj and Umrah visa requirements and application process.",
      icon: <FaPassport className="w-6 h-6 text-primary" />,
      category: "Essential Documents",
      links: [
        { text: "Saudi e-Visa Portal", url: "https://visa.mofa.gov.sa/" },
        { text: "Visa Requirements Guide", url: "https://www.haj.gov.sa/en/InternalPages/Details/12" }
      ]
    },
    {
      title: "Health Requirements",
      description: "Mandatory vaccinations and health guidelines for pilgrims.",
      icon: <FaHeartbeat className="w-6 h-6 text-primary" />,
      category: "Essential Documents",
      links: [
        { text: "Ministry of Health Guidelines", url: "https://www.moh.gov.sa/en/Hajj/Pages/default.aspx" },
        { text: "Vaccination Requirements", url: "https://www.moh.gov.sa/en/Hajj/HealthGuidelines/" }
      ]
    },
    {
      title: "Travel Documentation",
      description: "Required documents and permits for Hajj and Umrah travel.",
      icon: <FaPlane className="w-6 h-6 text-primary" />,
      category: "Essential Documents",
      links: [
        { text: "Ministry of Hajj Portal", url: "https://www.haj.gov.sa/" },
        { text: "Travel Requirements", url: "https://www.saudia.com/hajj-and-umrah-travel" }
      ]
    },

    // Educational Materials
    {
      title: "IslamQA Resources",
      description: "Comprehensive Islamic knowledge base with authentic answers.",
      icon: <FaMosque className="w-6 h-6 text-primary" />,
      category: "Educational Materials",
      links: [
        { text: "Hajj & Umrah Guides", url: "https://islamqa.info/en/categories/21/hajj-and-umrah" },
        { text: "Common Questions", url: "https://islamqa.info/en/categories/21/hajj-and-umrah/articles" }
      ]
    },
    {
      title: "Sacred Sites Guide",
      description: "Information about holy sites in Makkah and Madinah.",
      icon: <FaMapMarked className="w-6 h-6 text-primary" />,
      category: "Educational Materials",
      links: [
        { text: "Interactive Maps", url: "https://goo.gl/maps/makkah" },
        { text: "Site Information", url: "https://www.gph.gov.sa/en-us/Pages/default.aspx" }
      ]
    },
    {
      title: "Language Guide",
      description: "Essential Arabic phrases and prayers for pilgrims.",
      icon: <FaLanguage className="w-6 h-6 text-primary" />,
      category: "Educational Materials",
      links: [
        { text: "Common Arabic Phrases", url: "https://hajjumrahguide.com/arabic-phrases" },
        { text: "Prayer Guide", url: "https://islamqa.info/en/categories/21/prayers" }
      ]
    },

    // Emergency Information
    {
      title: "Emergency Contacts",
      description: "Important phone numbers and emergency contacts in Saudi Arabia.",
      icon: <FaPhone className="w-6 h-6 text-primary" />,
      category: "Emergency Information",
      links: [
        { text: "Police: 999", url: "tel:999" },
        { text: "Ambulance: 997", url: "tel:997" },
        { text: "Civil Defense: 998", url: "tel:998" }
      ]
    },
    {
      title: "Medical Services",
      description: "List of hospitals and medical facilities near holy sites.",
      icon: <FaHospital className="w-6 h-6 text-primary" />,
      category: "Emergency Information",
      links: [
        { text: "Ajyad Emergency Hospital", url: "tel:+966-12-5566000" },
        { text: "Al-Noor Specialist Hospital", url: "tel:+966-12-5665000" }
      ]
    },
    {
      title: "Lost & Found",
      description: "Contact information for lost belongings and persons.",
      icon: <FaSearch className="w-6 h-6 text-primary" />,
      category: "Emergency Information",
      links: [
        { text: "Makkah Lost & Found", url: "tel:+966-12-5440033" },
        { text: "Madinah Lost & Found", url: "tel:+966-14-8262222" }
      ]
    }
  ];

  // Group resources by category
  const groupedResources = resources.reduce((acc, resource) => {
    (acc[resource.category] = acc[resource.category] || []).push(resource);
    return acc;
  }, {} as Record<string, ResourceCard[]>);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Resources</h1>

      {Object.entries(groupedResources).map(([category, categoryResources]) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryResources.map((resource, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-primary transition-colors duration-200"
              >
                <div className="flex items-center mb-4">
                  <div className="mr-3">
                    {resource.icon}
                  </div>
                  <h3 className="text-xl font-medium text-gray-900">
                    {resource.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  {resource.description}
                </p>
                <div className="space-y-2">
                  {resource.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-primary hover:text-primary-dark transition-colors"
                    >
                      {link.text}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Resources; 