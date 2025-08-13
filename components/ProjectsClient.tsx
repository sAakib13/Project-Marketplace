'use client';

import { useState, useEffect } from 'react';
// import ProjectCard from './ProjectCard';
// import SearchAndFilter from './SearchAndFilter';
import { Loader2, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  demoUrl: string;
  githubUrl: string;
  technologies: string[];
  category: string;
  useCases: string[];
  features: string[];
  stats: {
    stars: number;
    forks: number;
    contributors: number;
  };
  lastUpdated: string;
}

interface ProjectsClientProps {
  initialData: {
    projects: Project[];
    total: number;
    categories: string[];
  };
}

export default function ProjectsClient({ initialData }: ProjectsClientProps) {
  const [projects, setProjects] = useState<Project[]>(initialData.projects);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(initialData.projects);
  const [categories, setCategories] = useState<string[]>(initialData.categories);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    filterProjects();
  }, [projects, selectedCategory, searchQuery]);

  const filterProjects = () => {
    let filtered = projects;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some(tech => 
          tech.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredProjects(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const stats = [
    { label: 'Active Projects', value: projects.length, icon: Sparkles },
    { label: 'Technologies', value: 25, icon: TrendingUp },
    { label: 'Contributors', value: 150, icon: Users },
    { label: 'Live Demos', value: projects.length, icon: Zap },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Discover Amazing{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Demo Projects
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore a curated collection of high-quality demo projects showcasing modern web technologies,
              best practices, and innovative solutions for real-world use cases.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mb-4">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Browse Projects
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
              Filter by category, search by technology, or explore all projects to find inspiration for your next build.
            </p>
{/*             
            <SearchAndFilter
              onSearch={handleSearch}
              onCategoryFilter={handleCategoryFilter}
              categories={categories}
              selectedCategory={selectedCategory}
            /> */}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading amazing projects...</p>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          {!isLoading && (
            <>
              {filteredProjects.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* {filteredProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))} */}
                  </div>
                  
                  {filteredProjects.length !== projects.length && (
                    <div className="text-center mt-12">
                      <p className="text-gray-600">
                        Showing {filteredProjects.length} of {projects.length} projects
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="text-gray-400 mb-4">
                    <Sparkles className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DemoHub
                </span>
              </div>
              <p className="text-gray-600 max-w-md">
                Discover, explore, and get inspired by high-quality demo projects built with modern technologies.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Tutorials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contributors</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 DemoHub. Built with Next.js and Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </>
  );
}