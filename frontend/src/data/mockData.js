// src/data/mockData.js
 
// Mock users data
export const mockUsers = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    type: "owner", // owner or tenant
    phone: "+1234567890",
    avatar: "https://via.placeholder.com/100"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    type: "tenant",
    phone: "+1234567891",
    avatar: "https://via.placeholder.com/100"
  }
];
 
// Mock rooms data
export const mockRooms = [
  {
    id: 1,
    title: "Cozy Studio Apartment",
    description: "A beautiful studio apartment in the heart of downtown. Perfect for students or young professionals.",
    price: 800,
    location: "Downtown",
    address: "123 Main St, City Center",
    bedrooms: 1,
    bathrooms: 1,
    area: 450, // square feet
    amenities: ["WiFi", "Air Conditioning", "Furnished", "Parking"],
    images: [
      "https://via.placeholder.com/400x300/4a90e2/ffffff?text=Living+Room",
      "https://via.placeholder.com/400x300/7ed321/ffffff?text=Kitchen",
      "https://via.placeholder.com/400x300/f5a623/ffffff?text=Bedroom"
    ],
    ownerId: 1,
    available: true,
    datePosted: "2024-09-15",
    contactInfo: {
      phone: "+1234567890",
      email: "john@example.com"
    }
  },
  {
    id: 2,
    title: "Spacious 2BR Apartment",
    description: "Modern 2-bedroom apartment with great city views. Recently renovated with all new appliances.",
    price: 1200,
    location: "Midtown",
    address: "456 Oak Ave, Midtown District",
    bedrooms: 2,
    bathrooms: 2,
    area: 850,
    amenities: ["WiFi", "Dishwasher", "Laundry", "Balcony", "Gym Access"],
    images: [
      "https://via.placeholder.com/400x300/bd10e0/ffffff?text=Living+Area",
      "https://via.placeholder.com/400x300/b8e986/ffffff?text=Master+Bedroom",
      "https://via.placeholder.com/400x300/9013fe/ffffff?text=Kitchen"
    ],
    ownerId: 1,
    available: true,
    datePosted: "2024-09-10",
    contactInfo: {
      phone: "+1234567890",
      email: "john@example.com"
    }
  },
  {
    id: 3,
    title: "Affordable Single Room",
    description: "Budget-friendly single room in a shared house. Great for students. Includes utilities.",
    price: 500,
    location: "University District",
    address: "789 College Rd, Near Campus",
    bedrooms: 1,
    bathrooms: 1, // shared
    area: 200,
    amenities: ["WiFi", "Shared Kitchen", "Study Area", "Close to Campus"],
    images: [
      "https://via.placeholder.com/400x300/50e3c2/ffffff?text=Bedroom",
      "https://via.placeholder.com/400x300/4a90e2/ffffff?text=Shared+Kitchen",
      "https://via.placeholder.com/400x300/f8e71c/ffffff?text=Study+Area"
    ],
    ownerId: 1,
    available: true,
    datePosted: "2024-09-20",
    contactInfo: {
      phone: "+1234567890",
      email: "john@example.com"
    }
  }
];
 
// Mock API service to simulate backend calls
export class MockRentalService {
  static async getAllRooms() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockRooms;
  }
 
  static async getRoomById(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockRooms.find(room => room.id === parseInt(id));
  }
 
  static async getRoomsByLocation(location) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockRooms.filter(room => 
      room.location.toLowerCase().includes(location.toLowerCase())
    );
  }
 
  static async searchRooms(filters) {
    await new Promise(resolve => setTimeout(resolve, 600));
    let filteredRooms = [...mockRooms];
 
    if (filters.location) {
      filteredRooms = filteredRooms.filter(room =>
        room.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
 
    if (filters.minPrice) {
      filteredRooms = filteredRooms.filter(room => room.price >= filters.minPrice);
    }
 
    if (filters.maxPrice) {
      filteredRooms = filteredRooms.filter(room => room.price <= filters.maxPrice);
    }
 
    if (filters.bedrooms) {
      filteredRooms = filteredRooms.filter(room => room.bedrooms >= filters.bedrooms);
    }
 
    return filteredRooms;
  }
 
  static async addRoom(roomData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newRoom = {
      id: Math.max(...mockRooms.map(r => r.id)) + 1,
      ...roomData,
      datePosted: new Date().toISOString().split('T')[0],
      available: true
    };
    mockRooms.push(newRoom);
    return newRoom;
  }
 
  // Authentication simulation
  static async login(email, password) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const user = mockUsers.find(u => u.email === email);
    if (user && password === "password123") { // Simple mock auth
      return {
        success: true,
        user: user,
        token: "mock_jwt_token_" + user.id
      };
    }
    return { success: false, message: "Invalid credentials" };
  }
 
  static async register(userData) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser = {
      id: Math.max(...mockUsers.map(u => u.id)) + 1,
      ...userData,
      avatar: "https://via.placeholder.com/100"
    };
    mockUsers.push(newUser);
    return {
      success: true,
      user: newUser,
      token: "mock_jwt_token_" + newUser.id
    };
  }
}