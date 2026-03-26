import React, { useState } from "react";
import styled from "styled-components";
import { X, MapPin, Bed, Bath, Wifi, Car, Utensils, Home } from "lucide-react";
import { getStoredUser, bookingsAPI } from "../services/api";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
  overflow-y: auto;
`;

const Modal = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: #f1f5f9;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background 0.2s ease;

  &:hover {
    background: #e2e8f0;
  }
`;

const Header = styled.div`
  position: relative;
  height: 300px;
  overflow: hidden;
  background: #f1f5f9;

  @media (max-width: 768px) {
    height: 250px;
  }
`;

const HeaderImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Title = styled.h1`
  margin: 0 0 0.5rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: #0f172a;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const LocationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
`;

const Description = styled.p`
  color: #475569;
  line-height: 1.6;
  margin: 0 0 1.5rem;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const DetailCard = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: #2563eb;
    flex-shrink: 0;
  }
`;

const DetailText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  span:first-child {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 600;
  }

  span:last-child {
    font-size: 1rem;
    font-weight: 700;
    color: #0f172a;
  }
`;

const AmenitiesSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
`;

const AmenitiesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
`;

const AmenityTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  color: #1e40af;
  font-size: 0.9rem;
  font-weight: 500;
`;

const BookingSection = styled.div`
  background: #f0f9ff;
  border: 2px solid #bfdbfe;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const BookingTitle = styled.h3`
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #475569;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0f172a;
  background: white;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }

  &:disabled {
    background: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0f172a;
  background: white;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }

  &:disabled {
    background: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
  }
`;

const PriceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  margin: 1rem 0;

  span:first-child {
    color: #64748b;
    font-weight: 600;
  }

  span:last-child {
    font-size: 1.5rem;
    font-weight: 900;
    color: #2563eb;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BookButton = styled(Button)`
  background: #2563eb;
  color: white;

  &:hover:not(:disabled) {
    background: #1d4ed8;
    transform: translateY(-1px);
  }
`;

const CancelButton = styled(Button)`
  background: transparent;
  color: #2563eb;
  border: 1px solid #2563eb;

  &:hover:not(:disabled) {
    background: #f0f9ff;
  }
`;

const Message = styled.div`
  padding: 0.875rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;

  ${(props) =>
    props.$type === "error"
      ? `
    background: #fee2e2;
    border: 1px solid #fecaca;
    color: #991b1b;
  `
      : `
    background: #dcfce7;
    border: 1px solid #bbf7d0;
    color: #166534;
  `}
`;

const getAmenityIcon = (amenity) => {
  const name = typeof amenity === "string" ? amenity.toLowerCase() : "";
  if (name.includes("wifi")) return <Wifi size={18} />;
  if (name.includes("parking")) return <Car size={18} />;
  if (name.includes("kitchen")) return <Utensils size={18} />;
  if (name.includes("gym")) return <Home size={18} />;
  return <Home size={18} />;
};

const RoomDetailsModal = ({ room, onClose, onBookingSuccess }) => {
  const user = getStoredUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    moveInDate: "",
    moveOutDate: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const calculatePrice = () => {
    if (!formData.moveInDate || !formData.moveOutDate) return 0;
    const checkIn = new Date(formData.moveInDate);
    const checkOut = new Date(formData.moveOutDate);
    const days = Math.max(0, (checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return Math.ceil(days * room.price);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Please log in to make a booking");
      return;
    }

    if (!formData.moveInDate || !formData.moveOutDate) {
      setError("Please select check-in and check-out dates");
      return;
    }

    const checkIn = new Date(formData.moveInDate);
    const checkOut = new Date(formData.moveOutDate);

    if (checkOut <= checkIn) {
      setError("Check-out date must be after check-in date");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const bookingData = {
        roomId: room.id,
        moveInDate: formData.moveInDate,
        moveOutDate: formData.moveOutDate,
        message: formData.message,
      };

      await bookingsAPI.createBooking(bookingData);
      setSuccess("Booking request submitted successfully!");
      setTimeout(() => {
        onBookingSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to submit booking");
    } finally {
      setLoading(false);
    }
  };

  const amenities = (() => {
    if (!room.amenities) return [];
    if (typeof room.amenities === "string") {
      try {
        return JSON.parse(room.amenities);
      } catch {
        return [];
      }
    }
    return Array.isArray(room.amenities) ? room.amenities : [];
  })();

  const imageUrl = room.main_image
    ? room.main_image.startsWith("http")
      ? room.main_image
      : `http://localhost:5000${room.main_image}`
    : "https://via.placeholder.com/800x300?text=Room+Image";

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseBtn onClick={onClose} title="Close modal">
          <X size={24} />
        </CloseBtn>

        <Header>
          <HeaderImg
            src={imageUrl}
            alt={room.title}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/800x300?text=Room+Image";
            }}
          />
        </Header>

        <Content>
          <Title>{room.title}</Title>

          <LocationRow>
            <MapPin size={18} />
            {room.location}
          </LocationRow>

          {room.description && <Description>{room.description}</Description>}

          <DetailsGrid>
            <DetailCard>
              <Bed size={20} />
              <DetailText>
                <span>Bedrooms</span>
                <span>{room.bedrooms}</span>
              </DetailText>
            </DetailCard>

            <DetailCard>
              <Bath size={20} />
              <DetailText>
                <span>Bathrooms</span>
                <span>{room.bathrooms}</span>
              </DetailText>
            </DetailCard>

            <DetailCard>
              <Home size={20} />
              <DetailText>
                <span>Area</span>
                <span>{room.area} sq ft</span>
              </DetailText>
            </DetailCard>

            <DetailCard>
              <span style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                Rs {room.price.toLocaleString()}
              </span>
              <DetailText>
                <span>Price</span>
                <span>/month</span>
              </DetailText>
            </DetailCard>
          </DetailsGrid>

          {amenities.length > 0 && (
            <AmenitiesSection>
              <SectionTitle>Amenities</SectionTitle>
              <AmenitiesList>
                {amenities.map((amenity, idx) => (
                  <AmenityTag key={idx}>
                    {getAmenityIcon(amenity)}
                    {typeof amenity === "string"
                      ? amenity
                      : amenity.name || amenity}
                  </AmenityTag>
                ))}
              </AmenitiesList>
            </AmenitiesSection>
          )}

          {user ? (
            <BookingSection>
              <BookingTitle>Book This Room</BookingTitle>

              {error && <Message $type="error">{error}</Message>}
              {success && <Message $type="success">{success}</Message>}

              <Form onSubmit={handleSubmitBooking}>
                <FormRow>
                  <FormGroup>
                    <Label htmlFor="moveInDate">Check-in Date</Label>
                    <Input
                      id="moveInDate"
                      type="date"
                      name="moveInDate"
                      value={formData.moveInDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      disabled={loading}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="moveOutDate">Check-out Date</Label>
                    <Input
                      id="moveOutDate"
                      type="date"
                      name="moveOutDate"
                      value={formData.moveOutDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      disabled={loading}
                    />
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <Label htmlFor="message">Message to Owner (Optional)</Label>
                  <TextArea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell the owner about yourself or ask any questions..."
                    disabled={loading}
                  />
                </FormGroup>

                {formData.moveInDate && formData.moveOutDate && (
                  <PriceInfo>
                    <span>Estimated Total Price:</span>
                    <span>Rs {calculatePrice().toLocaleString()}</span>
                  </PriceInfo>
                )}

                <ButtonGroup>
                  <CancelButton
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </CancelButton>
                  <BookButton type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Booking Request"}
                  </BookButton>
                </ButtonGroup>
              </Form>
            </BookingSection>
          ) : (
            <BookingSection>
              <Message $type="error">
                Please{" "}
                <a
                  href="/login"
                  style={{ textDecoration: "underline", fontWeight: "bold" }}
                >
                  log in
                </a>{" "}
                to make a booking.
              </Message>
            </BookingSection>
          )}
        </Content>
      </Modal>
    </Overlay>
  );
};

export default RoomDetailsModal;
