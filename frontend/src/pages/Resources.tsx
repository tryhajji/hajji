import { FC } from 'react';

interface BaseResourceItem {
  id: string;
  title: string;
  description: string;
  type: 'link' | 'download' | 'content';
  category: string;
  tags: string[];
}

interface LinkResourceItem extends BaseResourceItem {
  type: 'link';
  link: string;
}

interface DownloadResourceItem extends BaseResourceItem {
  type: 'download';
  downloadLink: string;
  fileSize?: string;
  fileType?: string;
}

interface ContentResourceItem extends BaseResourceItem {
  type: 'content';
  content: string[];
}

type ResourceItem = LinkResourceItem | DownloadResourceItem | ContentResourceItem;

interface ResourceSection {
  title: string;
  items: ResourceItem[];
}

const Resources: FC = () => {
  const resources: ResourceItem[] = [
    {
      id: '1',
      title: 'Visa Requirements',
      description: 'Complete guide to Hajj and Umrah visa requirements and application process.',
      type: 'link',
      category: 'Essential Documents',
      tags: [],
      link: 'https://visa.mofa.gov.sa/'
    },
    {
      id: '2',
      title: 'Health Requirements',
      description: 'Mandatory vaccinations and health guidelines for pilgrims.',
      type: 'link',
      category: 'Essential Documents',
      tags: [],
      link: 'https://www.moh.gov.sa/en/Hajj/Pages/default.aspx'
    },
    {
      id: '3',
      title: 'Travel Documentation',
      description: 'Required documents and permits for Hajj and Umrah travel.',
      type: 'link',
      category: 'Essential Documents',
      tags: [],
      link: 'https://www.haj.gov.sa/'
    },
    {
      id: '4',
      title: 'IslamQA',
      description: 'Comprehensive Islamic knowledge base with authentic answers',
      type: 'link',
      category: 'Educational Materials',
      tags: [],
      link: 'https://islamqa.info/en'
    },
    {
      id: '5',
      title: 'IslamQA Questions',
      description: 'Authentic answers to common questions about Islam',
      type: 'link',
      category: 'Educational Materials',
      tags: [],
      link: 'https://islamqa.info/en'
    },
    {
      id: '6',
      title: 'IslamQA Resources',
      description: 'Collection of scholarly articles and resources',
      type: 'link',
      category: 'Educational Materials',
      tags: [],
      link: 'https://islamqa.info/en'
    },
    {
      id: '7',
      title: 'Maps and Locations',
      description: 'Detailed maps of Mecca, Medina, and sacred sites.',
      type: 'download',
      category: 'Educational Materials',
      tags: [],
      downloadLink: '/resources/maps.pdf'
    },
    {
      id: '8',
      title: 'Accommodation Guide',
      description: 'Information about hotels and accommodation in Mecca and Medina.',
      type: 'link',
      category: 'Practical Information',
      tags: [],
      link: 'https://www.booking.com/mecca-hotels'
    },
    {
      id: '9',
      title: 'Transportation Guide',
      description: 'Guide to transportation services during Hajj and Umrah.',
      type: 'link',
      category: 'Practical Information',
      tags: [],
      link: 'https://www.saptco.com.sa/'
    },
    {
      id: '10',
      title: 'Weather Information',
      description: 'Seasonal weather information and what to pack.',
      type: 'link',
      category: 'Practical Information',
      tags: [],
      link: 'https://www.accuweather.com/en/sa/mecca/'
    },
    {
      id: '11',
      title: 'Hajj and Umrah App',
      description: 'Official app by the Ministry of Hajj and Umrah.',
      type: 'link',
      category: 'Mobile Applications',
      tags: [],
      link: 'https://play.google.com/store/apps/details?id=sa.gov.haj.smart.app'
    },
    {
      id: '12',
      title: 'Holy Sites Navigator',
      description: 'GPS navigation for holy sites in Mecca and Medina.',
      type: 'link',
      category: 'Mobile Applications',
      tags: [],
      link: 'https://apps.apple.com/app/holy-sites-navigator'
    },
    {
      id: '13',
      title: 'Manasik App',
      description: 'Step-by-step guide to Hajj and Umrah rituals.',
      type: 'link',
      category: 'Mobile Applications',
      tags: [],
      link: 'https://play.google.com/store/apps/details?id=com.manasik'
    },
    {
      id: '14',
      title: 'Emergency Contacts',
      description: 'Important phone numbers and emergency contacts in Saudi Arabia.',
      type: 'content',
      category: 'Emergency Information',
      tags: [],
      content: [
        'Police: 999',
        'Ambulance: 997',
        'Traffic Police: 993',
        'Civil Defense: 998'
      ]
    },
    {
      id: '15',
      title: 'Medical Services',
      description: 'List of hospitals and medical facilities near holy sites.',
      type: 'content',
      category: 'Emergency Information',
      tags: [],
      content: [
        'Ajyad Emergency Hospital: +966-12-5566000',
        'Al-Noor Specialist Hospital: +966-12-5665000',
        'King Abdullah Medical City: +966-12-5549999'
      ]
    }
  ];

  const renderResourceContent = (resource: ResourceItem) => {
    switch (resource.type) {
      case 'link':
        return (
          <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-dark"
          >
            Visit Resource
          </a>
        );
      case 'download':
        return (
          <a
            href={resource.downloadLink}
            download
            className="text-primary hover:text-primary-dark"
          >
            Download Resource
          </a>
        );
      case 'content':
        return (
          <div className="prose prose-sm max-w-none">
            {resource.content.map((line, lineIndex: number) => (
              <p key={lineIndex}>{line}</p>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Resources</h1>

        {resources.map((resource, index) => (
          <div key={resource.id} className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{resource.title}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                
                {renderResourceContent(resource)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources; 