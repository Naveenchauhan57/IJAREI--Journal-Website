import React, { useState, useEffect } from 'react';
import '../styles/EditorialBoard.css';
// Mock data - in a real app, this would come from an API
const mockEditorialData = [
  {
    id: 1,
    name: "Dr. Gabriel Julien",
    qualifications: "Ph.D. in Education, M.Ed. in Special & Inclusive Education",
    position: "Research Supervisor, Second Examiner, U.W.I., Kingston, Jamaica",
    email: "gabriel.julien@open.uwi.edu",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    universityLink: "https://www.uwi.edu/",
    category: "Editor-in-Chief"
  },
  {
    id: 2,
    name: "Dr. Maria Rodriguez",
    qualifications: "Ph.D. in Psychology, M.A. in Clinical Psychology",
    position: "Associate Professor, Department of Psychology, University of Miami",
    email: "m.rodriguez@miami.edu",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b1a0?w=200&h=200&fit=crop&crop=face",
    universityLink: "https://www.miami.edu/",
    category: "Associate Editor"
  },
  {
    id: 3,
    name: "Prof. James Thompson",
    qualifications: "Ph.D. in Educational Research, M.Ed. in Curriculum Development",
    position: "Head of Education Department, Oxford University",
    email: "j.thompson@ox.ac.uk",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    universityLink: "https://www.ox.ac.uk/",
    category: "Associate Editor"
  },
  {
    id: 4,
    name: "Dr. Sarah Chen",
    qualifications: "Ph.D. in Educational Technology, M.S. in Computer Science",
    position: "Director of Digital Learning, Stanford University",
    email: "s.chen@stanford.edu",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    universityLink: "https://www.stanford.edu/",
    category: "Editorial Board Member"
  }
];

const EditorialBoard = () => {
  const [editorialMembers, setEditorialMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simulate API call - replace with actual API integration
  useEffect(() => {
    const fetchEditorialMembers = async () => {
      try {
        // In a real app, this would be:
        // const response = await fetch('/api/editorial-members');
        // const data = await response.json();
        
        setEditorialMembers(mockEditorialData);
      } catch (error) {
        console.error('Error fetching editorial members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEditorialMembers();
  }, []);

  // Group members by category for organized display
  const groupedMembers = editorialMembers.reduce((acc, member) => {
    const category = member.category || 'Editorial Board Member';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(member);
    return acc;
  }, {});

  // Define category order for consistent display
  const categoryOrder = ['Editor-in-Chief', 'Associate Editor', 'Editorial Board Member'];

  if (loading) {
    return (
      <div className="editorialBoard-container">
        <div className="editorialBoard-loadingSpinner">
          <div className="editorialBoard-spinner"></div>
          <p>Loading Editorial Board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="editorialBoard-container">
      {/* Header with content wrapper */}
      <header className="editorialBoard-header">
        <div className="editorialBoard-headerContent">
          <h1 className="editorialBoard-mainTitle">Editorial Board</h1>
          <p className="editorialBoard-subtitle">
            Meet our distinguished editorial team committed to advancing academic excellence
          </p>
        </div>
      </header>

      {/* Main content with proper wrapper */}
      <main className="editorialBoard-main">
        {categoryOrder.map(category => {
          const members = groupedMembers[category];
          if (!members || members.length === 0) return null;

          return (
            <section key={category} className="editorialBoard-categorySection">
              <h2 className="editorialBoard-categoryTitle">{category}</h2>
              <div className="editorialBoard-membersGrid">
                {members.map(member => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
};

// Individual member card component
const MemberCard = ({ member }) => {
  const handleUniversityClick = () => {
    window.open(member.universityLink, '_blank', 'noopener,noreferrer');
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${member.email}`;
  };

  return (
    <article className="editorialBoard-memberCard">
      <div className="editorialBoard-cardHeader">
        <div className="editorialBoard-imageContainer">
          <img 
            src={member.profileImage} 
            alt={`${member.name} profile`}
            className="editorialBoard-profileImage"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgODBDMTEwLjQ5MyA4MCAxMTkgNzEuNDkzNCAxMTkgNjFDMTE5IDUwLjUwNjYgMTEwLjQ5MyA0MiAxMDAgNDJDODkuNTA2NiA0MiA4MSA1MC41MDY2IDgxIDYxQzgxIDcxLjQ5MzQgODkuNTA2NiA4MCAxMDAgODBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xMDAgOTBDNzguNjcxNCA5MCA2MS4zMzA2IDEwNy4zNDEgNjEuMzMwNiAxMjguNjY5VjE1OEgxMzguNjY5VjEyOC42NjlDMTM4LjY2OSAxMDcuMzQxIDEyMS4zMjkgOTAgMTAwIDkwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
            }}
          />
        </div>
      </div>
      
      <div className="editorialBoard-cardContent">
        <h3 className="editorialBoard-memberName">{member.name}</h3>
        <p className="editorialBoard-qualifications">{member.qualifications}</p>
        <p className="editorialBoard-position">{member.position}</p>
        
        <div className="editorialBoard-contactInfo">
          <button 
            className="editorialBoard-emailButton"
            onClick={handleEmailClick}
            aria-label={`Email ${member.name}`}
          >
            📧 {member.email}
          </button>
        </div>
      </div>
      
      <div className="editorialBoard-cardFooter">
        <button 
          className="editorialBoard-universityButton"
          onClick={handleUniversityClick}
          aria-label={`Visit ${member.name}'s university`}
        >
          🏫 University Link
        </button>
      </div>
    </article>
  );
};

export default EditorialBoard;