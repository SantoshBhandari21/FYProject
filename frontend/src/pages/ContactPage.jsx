// src/pages/ContactPage.jsx
import React, { useState } from "react";
import styled from "styled-components";

const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #f1f5f9;
  padding: 32px 16px;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 10px 24px rgba(2, 6, 23, 0.06);
`;

const Title = styled.h1`
  margin: 0 0 8px;
  color: #0f172a;
  font-size: 26px;
  font-weight: 900;
`;

const Sub = styled.p`
  margin: 0 0 18px;
  color: #475569;
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 900;
  color: #475569;
  margin-bottom: 6px;
  display: block;
`;

const Field = styled.div``;

const Input = styled.input`
  width: 100%;
  padding: 12px 12px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #0f172a;

  &:focus {
    outline: none;
    border-color: rgba(37, 99, 235, 0.6);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    background: #ffffff;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 12px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #0f172a;

  &:focus {
    outline: none;
    border-color: rgba(37, 99, 235, 0.6);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    background: #ffffff;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 12px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #0f172a;
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: rgba(37, 99, 235, 0.6);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    background: #ffffff;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #2563eb;
  background: #2563eb;
  color: #ffffff;
  font-weight: 900;
  cursor: pointer;

  &:hover {
    background: #1e40af;
    border-color: #1e40af;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Msg = styled.div`
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 800;
  border: 1px solid ${(p) => (p.type === "error" ? "#fecaca" : "#bbf7d0")};
  background: ${(p) => (p.type === "error" ? "#fee2e2" : "#dcfce7")};
  color: ${(p) => (p.type === "error" ? "#991b1b" : "#166534")};
`;

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // {type, text}

  const setValue = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: "error", text: "Please fill Name, Email, and Message." });
      return;
    }

    setLoading(true);

    try {
      // Prototype only: log it. Later you can POST to backend.
      console.log("Contact form submitted:", form);

      setStatus({ type: "success", text: "Message sent successfully (demo)." });
      setForm({ name: "", email: "", phone: "", subject: "general", message: "" });
    } catch {
      setStatus({ type: "error", text: "Something went wrong. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Container>
        <Card>
          <Title>Contact Us</Title>
          <Sub>
            If you have questions about rooms, booking, or payments, send us a message.
            (This is a prototype contact form for project demo.)
          </Sub>

          {status && <Msg type={status.type}>{status.text}</Msg>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Field>
                <Label>Full Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setValue("name", e.target.value)}
                  placeholder="Your name"
                />
              </Field>

              <Field>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setValue("email", e.target.value)}
                  placeholder="example@email.com"
                />
              </Field>
            </Row>

            <Row>
              <Field>
                <Label>Phone (optional)</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setValue("phone", e.target.value)}
                  placeholder="98XXXXXXXX"
                />
              </Field>

              <Field>
                <Label>Subject</Label>
                <Select
                  value={form.subject}
                  onChange={(e) => setValue("subject", e.target.value)}
                >
                  <option value="general">General</option>
                  <option value="booking">Booking</option>
                  <option value="payment">Payment / Invoice</option>
                  <option value="owner">Owner Listing</option>
                </Select>
              </Field>
            </Row>

            <Field>
              <Label>Message *</Label>
              <TextArea
                value={form.message}
                onChange={(e) => setValue("message", e.target.value)}
                placeholder="Write your message here..."
              />
            </Field>

            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </Form>
        </Card>
      </Container>
    </Page>
  );
};

export default ContactPage;
