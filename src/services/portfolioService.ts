import { PortfolioItem } from '../components/portfolio/types';

// Portfolio data
const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: 'automotive-1',
    title: 'Classic Car Wheels',
    category: 'Automotive',
    image: 'https://images.unsplash.com/photo-1623861397259-55dd5eb79958?auto=format&fit=crop&q=80&w=800',
    description: 'Complete powder coating restoration of vintage car wheels. Process involved chemical stripping, media blasting, and multi-stage coating application. Achieved showroom-quality finish with enhanced durability using our premium ceramic-infused coating system. The wheels received a UV-resistant clear coat for long-lasting protection against brake dust and road debris.'
  },
  {
    id: 'automotive-2',
    title: 'Engine Components',
    category: 'Automotive',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=800',
    description: 'High-temperature powder coating for critical engine components. Utilized specialized ceramic-based coating rated for 2000°F. Process included ultrasonic cleaning, phosphate treatment, and precision masking of critical surfaces. Multiple quality control checks ensured perfect coverage while maintaining strict tolerances. Final result combines superior heat resistance with excellent surface finish.'
  },
  {
    id: 'industrial-1',
    title: 'Manufacturing Equipment',
    category: 'Industrial',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    description: 'Industrial machinery coating project requiring exceptional chemical and wear resistance. Implemented a three-layer coating system: zinc-rich primer for corrosion protection, high-build intermediate coat, and TGIC-free polyester topcoat. Extensive surface preparation included abrasive blasting to SSPC-SP10 standard. Result provides 10+ years of protection in harsh industrial environments.'
  },
  {
    id: 'industrial-2',
    title: 'Steel Framework',
    category: 'Industrial',
    image: 'https://images.unsplash.com/photo-1565939974240-455934b1e88d?auto=format&fit=crop&q=80&w=800',
    description: 'Large-scale structural steel coating project for marine environment application. Treatment included zinc thermal spraying followed by epoxy primer and marine-grade powder coating. Rigorous testing performed including salt spray resistance (ASTM B117) and adhesion testing. Coating system provides 25+ years of corrosion protection even in saltwater exposure.'
  },
  {
    id: 'custom-1',
    title: 'Modern Furniture',
    category: 'Custom',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=800',
    description: 'Custom furniture coating with designer color matching and texture development. Created unique metallic finish through specialized application techniques and custom powder formulation. Process involved multiple test panels to achieve perfect color and texture match. Final pieces feature exceptional durability while maintaining sophisticated aesthetic appeal.'
  },
  {
    id: 'custom-2',
    title: 'Decorative Elements',
    category: 'Custom',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&q=80&w=800',
    description: 'Artistic powder coating for high-end architectural installations. Developed custom color-shifting effect through innovative application methods and specialized powder selection. Process required precise temperature control and custom masking techniques. Achieved unique visual effects while maintaining excellent weather resistance and color stability.'
  },
  {
    id: 'automotive-3',
    title: 'Motorcycle Parts',
    category: 'Automotive',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800',
    description: 'Custom motorcycle components featuring candy-coat finish over chrome-like base. Multi-stage process included specialized base coat, candy translucent layer, and high-gloss clear coat. Extensive preparation ensured perfect surface finish. Final result provides exceptional depth and clarity while maintaining excellent chip and scratch resistance.'
  },
  {
    id: 'industrial-3',
    title: 'Heavy Equipment',
    category: 'Industrial',
    image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&q=80&w=800',
    description: 'Heavy machinery coating project requiring maximum abrasion resistance. Implemented innovative dual-coat system with high-build epoxy base and ultra-durable polyester topcoat. Surface preparation included aggressive grit blasting and phosphate treatment. Coating system tested to withstand extreme impact and abrasion while maintaining excellent edge coverage.'
  },
  {
    id: 'custom-3',
    title: 'Architectural Details',
    category: 'Custom',
    image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=800',
    description: 'Precision architectural elements requiring perfect finish quality. Utilized advanced pre-treatment system and custom powder formulation for optimal flow and leveling. Process included specialized racking methods and controlled cooling. Achieved Class A finish quality with excellent UV stability and weather resistance for exterior applications.'
  }
];

class PortfolioService {
  private items: PortfolioItem[];

  constructor() {
    this.items = PORTFOLIO_DATA;
  }

  // Get all portfolio items
  getAllItems(): PortfolioItem[] {
    return this.items;
  }

  // Get items by category
  getItemsByCategory(category: string): PortfolioItem[] {
    if (category === 'All') {
      return this.items;
    }
    return this.items.filter(item => item.category === category);
  }

  // Get unique categories
  getCategories(): string[] {
    const categories = new Set(this.items.map(item => item.category));
    return ['All', ...Array.from(categories)];
  }

  // Get item by ID
  getItemById(id: string): PortfolioItem | undefined {
    return this.items.find(item => item.id === id);
  }

  // Get paginated items
  getPaginatedItems(page: number, itemsPerPage: number, category: string = 'All'): {
    items: PortfolioItem[];
    hasMore: boolean;
    total: number;
  } {
    const filteredItems = this.getItemsByCategory(category);
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    
    return {
      items: filteredItems.slice(start, end),
      hasMore: end < filteredItems.length,
      total: filteredItems.length
    };
  }

  // Search items
  searchItems(query: string): PortfolioItem[] {
    const searchTerm = query.toLowerCase();
    return this.items.filter(item => 
      item.title.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm)
    );
  }
}

// Create a singleton instance
const portfolioService = new PortfolioService();

export default portfolioService; 