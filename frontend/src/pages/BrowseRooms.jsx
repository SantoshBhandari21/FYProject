import React, { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Home,
  Star,
  Filter,
  X,
  Bed,
  Bath,
  Square,
  Wifi,
  Car,
  Utensils,
  Heart,
  Grid,
  List,
} from "lucide-react";
import styled, { css } from "styled-components";
import { useNavigate } from "react-router-dom";

/* -------------------- Static Data (unchanged) -------------------- */
const ROOMS = [
  {
    id: 1,
    title: "Cozy Studio Apartment",
    location: "Downtown, Pokhara",
    address: "Mahendrapul, Pokhara-8",
    price: 15000,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    rating: 4.8,
    reviews: 24,
    type: "Studio",
    bedrooms: 1,
    bathrooms: 1,
    area: 450,
    amenities: ["wifi", "parking", "kitchen"],
    owner: "Ram Kumar",
    available: true,
    description:
      "A comfortable studio apartment perfect for students or young professionals.",
  },
  {
    id: 2,
    title: "Spacious 2BHK Near Lake",
    location: "Lakeside, Pokhara",
    address: "Baidam Road, Pokhara-6",
    price: 25000,
    image:
      "https://images.unsplash.com/photo-1502672260066-6bc358d4b278?w=800&h=600&fit=crop",
    rating: 4.9,
    reviews: 38,
    type: "2BHK",
    bedrooms: 2,
    bathrooms: 2,
    area: 850,
    amenities: ["wifi", "parking", "kitchen", "balcony"],
    owner: "Sita Sharma",
    available: true,
    description: "Beautiful apartment with lake view, perfect for families.",
  },
  {
    id: 3,
    title: "Modern Single Room",
    location: "New Road, Pokhara",
    address: "New Road, Pokhara-9",
    price: 12000,
    image:
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop",
    rating: 4.7,
    reviews: 19,
    type: "Single",
    bedrooms: 1,
    bathrooms: 1,
    area: 300,
    amenities: ["wifi", "kitchen"],
    owner: "Hari Bahadur",
    available: true,
    description: "Clean and modern single room with all basic amenities.",
  },
  {
    id: 4,
    title: "Luxury Penthouse",
    location: "Hill View, Pokhara",
    address: "Gaurighat, Pokhara-4",
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop",
    rating: 5.0,
    reviews: 42,
    type: "Penthouse",
    bedrooms: 3,
    bathrooms: 3,
    area: 1500,
    amenities: ["wifi", "parking", "kitchen", "balcony", "gym"],
    owner: "Gita Thapa",
    available: true,
    description: "Luxurious penthouse with stunning mountain views.",
  },
  {
    id: 5,
    title: "Budget Friendly Room",
    location: "Prithvi Chowk, Pokhara",
    address: "Prithvi Chowk, Pokhara-11",
    price: 8000,
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    rating: 4.5,
    reviews: 15,
    type: "Single",
    bedrooms: 1,
    bathrooms: 1,
    area: 250,
    amenities: ["wifi"],
    owner: "Krishna Tamang",
    available: true,
    description: "Affordable room for students, close to colleges.",
  },
  {
    id: 6,
    title: "Family Apartment 3BHK",
    location: "Srijana Chowk, Pokhara",
    address: "Srijana Chowk, Pokhara-10",
    price: 32000,
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
    rating: 4.8,
    reviews: 31,
    type: "3BHK",
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    amenities: ["wifi", "parking", "kitchen", "balcony"],
    owner: "Laxmi Gurung",
    available: true,
    description: "Spacious family apartment with modern amenities.",
  },
  {
    id: 7,
    title: "Shared Room for Students",
    location: "Chipledhunga, Pokhara",
    address: "Chipledhunga, Pokhara-12",
    price: 6000,
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop",
    rating: 4.3,
    reviews: 12,
    type: "Shared",
    bedrooms: 1,
    bathrooms: 1,
    area: 350,
    amenities: ["wifi", "kitchen"],
    owner: "Bikash Rai",
    available: true,
    description: "Shared accommodation perfect for budget-conscious students.",
  },
  {
    id: 8,
    title: "Executive Suite Room",
    location: "Zero KM, Pokhara",
    address: "Zero KM, Pokhara-7",
    price: 28000,
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
    rating: 4.9,
    reviews: 27,
    type: "1BHK",
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    amenities: ["wifi", "parking", "kitchen", "gym"],
    owner: "Dipak Poudel",
    available: true,
    description: "Premium executive suite for professionals.",
  },
  {
    id: 9,
    title: "Garden View Apartment",
    location: "Yamdi, Pokhara",
    address: "Yamdi, Pokhara-3",
    price: 22000,
    image:
      "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=800&h=600&fit=crop",
    rating: 4.6,
    reviews: 20,
    type: "2BHK",
    bedrooms: 2,
    bathrooms: 1,
    area: 750,
    amenities: ["wifi", "parking", "kitchen", "balcony"],
    owner: "Maya Shrestha",
    available: true,
    description: "Peaceful apartment with beautiful garden views.",
  },
  {
    id: 10,
    title: "Modern Loft Space",
    location: "Bagar, Pokhara",
    address: "Bagar, Pokhara-2",
    price: 35000,
    image:
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop",
    rating: 4.9,
    reviews: 35,
    type: "Loft",
    bedrooms: 2,
    bathrooms: 2,
    area: 950,
    amenities: ["wifi", "parking", "kitchen", "balcony", "gym"],
    owner: "Suresh Karki",
    available: true,
    description: "Contemporary loft with high ceilings and open layout.",
  },
  {
    id: 11,
    title: "Compact Studio Near College",
    location: "Parsyang, Pokhara",
    address: "Parsyang, Pokhara-17",
    price: 10000,
    image:
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=600&fit=crop",
    rating: 4.4,
    reviews: 18,
    type: "Studio",
    bedrooms: 1,
    bathrooms: 1,
    area: 320,
    amenities: ["wifi", "kitchen"],
    owner: "Ramesh Adhikari",
    available: true,
    description: "Perfect for students, walking distance to colleges.",
  },
  {
    id: 12,
    title: "Deluxe 4BHK Villa",
    location: "Amarsingh Chowk, Pokhara",
    address: "Amarsingh Chowk, Pokhara-1",
    price: 65000,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
    rating: 5.0,
    reviews: 48,
    type: "4BHK",
    bedrooms: 4,
    bathrooms: 4,
    area: 2200,
    amenities: ["wifi", "parking", "kitchen", "balcony", "gym", "pool"],
    owner: "Binod Shah",
    available: true,
    description: "Luxurious villa with premium amenities and spacious layout.",
  },
];

const AMENITIES = [
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "parking", label: "Parking", icon: Car },
  { id: "kitchen", label: "Kitchen", icon: Utensils },
  { id: "balcony", label: "Balcony", icon: Home },
  { id: "gym", label: "Gym", icon: Home },
];

/* -------------------- Styles -------------------- */
const controlFocus = css`
  &:focus {
    outline: none;
    border-color: rgba(37, 99, 235, 0.6);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    background: #fff;
  }
`;

const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #f1f5f9;
`;

const StickyTop = styled.div`
  position: sticky;
  top: 0;
  z-index: 50;
`;

const SearchPanel = styled.div`
  background: linear-gradient(135deg, #dbeafe 0%, #eef2ff 100%);
  border-bottom: 1px solid #e2e8f0;
`;

const SearchInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 16px;
`;

const SearchGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const InputWrap = styled.div`
  position: relative;
`;

const IconLeft = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  background: rgba(255, 255, 255, 0.95);
  color: #0f172a;
  font-size: 14px;
  ${controlFocus}
`;

const FilterBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  background: rgba(255, 255, 255, 0.9);
  color: #0f172a;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #fff;
    border-color: #94a3b8;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 16px 40px;
`;

const ResultsBar = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin: 14px 0 18px;
`;

const TitleBlock = styled.div``;

const H2 = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 900;
  color: #0f172a;
`;

const P = styled.p`
  margin: 6px 0 0;
  color: #475569;
  font-size: 14px;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 8px;
`;

const IconBtn = styled.button`
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  background: ${(p) => (p.active ? "#2563eb" : "white")};
  color: ${(p) => (p.active ? "white" : "#0f172a")};
  cursor: pointer;

  &:hover {
    border-color: #94a3b8;
  }
`;

const FiltersPanel = styled.div`
  margin-top: 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 10px 24px rgba(2, 6, 23, 0.06);
`;

const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const FiltersTitle = styled.div`
  font-weight: 900;
  color: #0f172a;
`;

const CloseBtn = styled.button`
  padding: 8px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: #f1f5f9;
  cursor: pointer;

  &:hover {
    background: #e2e8f0;
  }
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div``;

const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 800;
  color: #475569;
  margin-bottom: 6px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #0f172a;
  ${controlFocus}
`;

const NumberRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const NumInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #0f172a;
  ${controlFocus}
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid ${(p) => (p.active ? "rgba(37, 99, 235, 0.35)" : "#cbd5e1")};
  background: ${(p) => (p.active ? "rgba(37, 99, 235, 0.10)" : "white")};
  color: ${(p) => (p.active ? "#1d4ed8" : "#0f172a")};
  font-weight: 800;
  cursor: pointer;

  &:hover {
    border-color: #94a3b8;
  }
`;

const GridWrap = styled.div`
  display: grid;
  grid-template-columns: ${(p) => (p.view === "grid" ? "repeat(3, 1fr)" : "1fr")};
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: ${(p) => (p.view === "grid" ? "repeat(2, 1fr)" : "1fr")};
  }
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 22px rgba(2, 6, 23, 0.06);
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 28px rgba(2, 6, 23, 0.1);
  }

  display: ${(p) => (p.list ? "grid" : "block")};
  grid-template-columns: ${(p) => (p.list ? "260px 1fr" : "none")};

  @media (max-width: 820px) {
    grid-template-columns: ${(p) => (p.list ? "1fr" : "none")};
  }
`;

const ImgWrap = styled.div`
  position: relative;
  height: ${(p) => (p.list ? "260px" : "210px")};

  @media (max-width: 820px) {
    height: 220px;
  }
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const BadgeRow = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TypeBadge = styled.span`
  padding: 7px 10px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.92);
  color: white;
  font-weight: 900;
  font-size: 12px;
`;

const FavBtn = styled.button`
  padding: 8px;
  border-radius: 999px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  background: rgba(255, 255, 255, 0.92);
  cursor: pointer;

  &:hover {
    background: #fff;
  }
`;

const CardBody = styled.div`
  padding: 14px 14px 16px;
`;

const CardTitle = styled.h3`
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #475569;
  font-size: 13px;
  margin-bottom: 10px;
`;

const Specs = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  color: #475569;
  font-size: 13px;
  margin-bottom: 10px;
`;

const Spec = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const AmenityTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

const Tag = styled.span`
  padding: 6px 10px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-weight: 800;
  font-size: 12px;
  text-transform: capitalize;
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const Rating = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #0f172a;
  font-weight: 800;
  font-size: 13px;

  span {
    color: #64748b;
    font-weight: 700;
  }
`;

const Price = styled.div`
  font-weight: 900;
  color: #1d4ed8;
`;

const DetailsBtn = styled.button`
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #2563eb;
  background: #2563eb;
  color: white;
  font-weight: 900;
  cursor: pointer;

  &:hover {
    background: #1e40af;
    border-color: #1e40af;
  }
`;

const Empty = styled.div`
  text-align: center;
  padding: 60px 12px;
  color: #475569;
`;

/* -------------------- Component -------------------- */
const BrowseRooms = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    roomType: "all",
    amenities: [],
    bedrooms: "all",
    sortBy: "featured",
  });

  const toggleFavorite = (roomId) => {
    setFavorites((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    );
  };

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (amenity) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const filteredRooms = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const loc = location.toLowerCase();

    return ROOMS.filter((room) => {
      const matchesSearch =
        room.title.toLowerCase().includes(q) || room.location.toLowerCase().includes(q);

      const matchesLocation = !loc || room.location.toLowerCase().includes(loc);

      const matchesPrice =
        room.price >= filters.priceRange[0] && room.price <= filters.priceRange[1];

      const matchesType = filters.roomType === "all" || room.type === filters.roomType;

      const matchesBedrooms =
        filters.bedrooms === "all" || room.bedrooms === Number(filters.bedrooms);

      const matchesAmenities =
        filters.amenities.length === 0 ||
        filters.amenities.every((a) => room.amenities.includes(a));

      return (
        matchesSearch &&
        matchesLocation &&
        matchesPrice &&
        matchesType &&
        matchesBedrooms &&
        matchesAmenities
      );
    });
  }, [searchQuery, location, filters]);

  const sortedRooms = useMemo(() => {
    const list = [...filteredRooms];
    switch (filters.sortBy) {
      case "price-low":
        return list.sort((a, b) => a.price - b.price);
      case "price-high":
        return list.sort((a, b) => b.price - a.price);
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      default:
        return list;
    }
  }, [filteredRooms, filters.sortBy]);

  const goToLoginForRoom = (roomId) => {
    navigate("/login", {
      state: { returnTo: `/rooms/${roomId}` },
    });
  };

  const RoomCard = ({ room, isListView }) => {
    const isFavorite = favorites.includes(room.id);

    return (
      <Card list={isListView}>
        <ImgWrap list={isListView}>
          <Img src={room.image} alt={room.title} />

          <BadgeRow>
            <TypeBadge>{room.type}</TypeBadge>

            <FavBtn type="button" onClick={() => toggleFavorite(room.id)} aria-label="favorite">
              <Heart
                size={18}
                style={{
                  color: isFavorite ? "#ef4444" : "#94a3b8",
                  fill: isFavorite ? "#ef4444" : "transparent",
                }}
              />
            </FavBtn>
          </BadgeRow>
        </ImgWrap>

        <CardBody>
          <CardTitle>{room.title}</CardTitle>

          <Meta>
            <MapPin size={16} />
            <span>{isListView ? room.address : room.location}</span>
          </Meta>

          <Specs>
            <Spec>
              <Bed size={16} /> {room.bedrooms} Bed
            </Spec>
            <Spec>
              <Bath size={16} /> {room.bathrooms} Bath
            </Spec>
            <Spec>
              <Square size={16} /> {room.area} sqft
            </Spec>
          </Specs>

          {isListView && <P style={{ marginBottom: 10 }}>{room.description}</P>}

          <AmenityTags>
            {room.amenities.slice(0, 4).map((a) => (
              <Tag key={a}>{a}</Tag>
            ))}
            {room.amenities.length > 4 && <Tag>+{room.amenities.length - 4}</Tag>}
          </AmenityTags>

          <BottomRow>
            <Rating>
              <Star size={16} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
              {room.rating} <span>({room.reviews})</span>
            </Rating>

            <Price>Rs {room.price.toLocaleString()}/mo</Price>

            <DetailsBtn type="button" onClick={() => goToLoginForRoom(room.id)}>
              View Details
            </DetailsBtn>
          </BottomRow>
        </CardBody>
      </Card>
    );
  };

  return (
    <Page>
      <StickyTop>
        <SearchPanel>
          <SearchInner>
            <SearchGrid>
              <InputWrap>
                <IconLeft>
                  <Search size={18} />
                </IconLeft>
                <Input
                  type="text"
                  placeholder="Search rooms, apartments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputWrap>

              <InputWrap>
                <IconLeft>
                  <MapPin size={18} />
                </IconLeft>
                <Input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </InputWrap>

              <FilterBtn type="button" onClick={() => setShowFilters((s) => !s)}>
                <Filter size={18} />
                Filters
              </FilterBtn>
            </SearchGrid>

            {showFilters && (
              <FiltersPanel>
                <FiltersHeader>
                  <FiltersTitle>Filters</FiltersTitle>
                  <CloseBtn type="button" onClick={() => setShowFilters(false)} aria-label="close">
                    <X size={18} />
                  </CloseBtn>
                </FiltersHeader>

                <FiltersGrid>
                  <Field>
                    <Label>Price Range (Rs/month)</Label>
                    <NumberRow>
                      <NumInput
                        type="number"
                        placeholder="Min"
                        value={filters.priceRange[0]}
                        onChange={(e) =>
                          setFilter("priceRange", [Number(e.target.value) || 0, filters.priceRange[1]])
                        }
                      />
                      <NumInput
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                          setFilter("priceRange", [filters.priceRange[0], Number(e.target.value) || 100000])
                        }
                      />
                    </NumberRow>
                  </Field>

                  <Field>
                    <Label>Room Type</Label>
                    <Select value={filters.roomType} onChange={(e) => setFilter("roomType", e.target.value)}>
                      <option value="all">All Types</option>
                      <option value="Single">Single</option>
                      <option value="Studio">Studio</option>
                      <option value="1BHK">1BHK</option>
                      <option value="2BHK">2BHK</option>
                      <option value="3BHK">3BHK</option>
                      <option value="4BHK">4BHK</option>
                      <option value="Shared">Shared</option>
                      <option value="Penthouse">Penthouse</option>
                      <option value="Loft">Loft</option>
                    </Select>
                  </Field>

                  <Field>
                    <Label>Bedrooms</Label>
                    <Select value={filters.bedrooms} onChange={(e) => setFilter("bedrooms", e.target.value)}>
                      <option value="all">Any</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4+</option>
                    </Select>
                  </Field>

                  <Field>
                    <Label>Sort By</Label>
                    <Select value={filters.sortBy} onChange={(e) => setFilter("sortBy", e.target.value)}>
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </Select>
                  </Field>
                </FiltersGrid>

                <div style={{ marginTop: 12 }}>
                  <Label>Amenities</Label>
                  <Chips>
                    {AMENITIES.map((a) => {
                      const Icon = a.icon;
                      const active = filters.amenities.includes(a.id);
                      return (
                        <Chip key={a.id} type="button" active={active} onClick={() => toggleAmenity(a.id)}>
                          <Icon size={16} />
                          {a.label}
                        </Chip>
                      );
                    })}
                  </Chips>
                </div>
              </FiltersPanel>
            )}
          </SearchInner>
        </SearchPanel>
      </StickyTop>

      <Container>
        <ResultsBar>
          <TitleBlock>
            <H2>{sortedRooms.length} Properties Available</H2>
            <P>Find your perfect room in Pokhara</P>
          </TitleBlock>

          <ViewToggle>
            <IconBtn type="button" active={viewMode === "grid"} onClick={() => setViewMode("grid")} aria-label="grid">
              <Grid size={18} />
            </IconBtn>
            <IconBtn type="button" active={viewMode === "list"} onClick={() => setViewMode("list")} aria-label="list">
              <List size={18} />
            </IconBtn>
          </ViewToggle>
        </ResultsBar>

        <GridWrap view={viewMode}>
          {sortedRooms.map((room) => (
            <RoomCard key={room.id} room={room} isListView={viewMode === "list"} />
          ))}
        </GridWrap>

        {sortedRooms.length === 0 && (
          <Empty>
            <Home size={52} style={{ color: "#94a3b8" }} />
            <h3 style={{ margin: "12px 0 6px", color: "#0f172a" }}>No properties found</h3>
            <p style={{ margin: 0 }}>Try adjusting your filters or search criteria.</p>
          </Empty>
        )}
      </Container>
    </Page>
  );
};

export default BrowseRooms;
