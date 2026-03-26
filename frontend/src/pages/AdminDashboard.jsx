// src/pages/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { usersAPI, getStoredUser } from "../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const tabs = [
    "Overview",
    "Users",
    "Rooms",
    "Bookings",
    "Analytics",
    "Settings",
  ];
  const [active, setActive] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);

  // Normalize role to lowercase
  const normalizeRole = (role) =>
    String(role || "")
      .trim()
      .toLowerCase();

  // COMMENTED OUT: Access control disabled
  // // Verify admin access on component mount
  // useEffect(() => {
  //   const user = getStoredUser();
  //   if (!user || normalizeRole(user.role) !== "admin") {
  //     console.warn("Unauthorized: User is not an admin. Redirecting to home.");
  //     navigate("/");
  //     return;
  //   }
  // }, [navigate]);

  const loadUsers = async () => {
    setError("");
    setLoading(true);
    try {
      // If you want filters later: usersAPI.getAllUsers({ role: "owner" })
      const res = await usersAPI.getAllUsers(); // ✅ returns { users: [], pagination: {} }
      const list = res?.users || [];
      setUsers(list);
      setPagination(res?.pagination || null);
    } catch (e) {
      setError(e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const counts = useMemo(() => {
    const total = users.length;
    const admins = users.filter(
      (u) => normalizeRole(u.role) === "admin",
    ).length;
    const owners = users.filter(
      (u) => normalizeRole(u.role) === "owner",
    ).length;
    const tenants = users.filter((u) =>
      ["tenant", "client", "user"].includes(normalizeRole(u.role)),
    ).length;

    return { total, admins, owners, tenants };
  }, [users]);

  const statsCards = useMemo(
    () => [
      { label: "Total Users", value: pagination?.totalUsers ?? counts.total },
      { label: "Admins", value: counts.admins },
      { label: "Owners", value: counts.owners },
      { label: "Tenants", value: counts.tenants },
    ],
    [counts, pagination],
  );

  return (
    <Page>
      <Layout>
        <Sidebar $open={sidebarOpen}>
          <SidebarHeader>
            <Brand>
              <BrandText>
                <b>Admin Dashboard</b>
              </BrandText>
            </Brand>
          </SidebarHeader>

          <Nav>
            {tabs.map((t) => (
              <NavItem
                key={t}
                $active={active === t}
                onClick={() => {
                  setActive(t);
                  setSidebarOpen(false);
                }}
              >
                {t}
              </NavItem>
            ))}
          </Nav>

          <SidebarFooter>
            <DangerBtn onClick={() => navigate("/logout", { replace: true })}>
              Logout
            </DangerBtn>
          </SidebarFooter>
        </Sidebar>

        <Content>
          <Topbar>
            <LeftTop>
              <TitleBlock>
                <h1>{active}</h1>
                <p>Welcome back, Admin</p>
              </TitleBlock>
            </LeftTop>
          </Topbar>

          <Section $pad="20px" $padMobile="14px">
            {loading && (
              <Panel>
                <PanelTitle>Loading...</PanelTitle>
                <p style={{ margin: 0, color: "#546173" }}>Fetching users.</p>
              </Panel>
            )}

            {!loading && error && (
              <Panel>
                <PanelTitle style={{ color: "#b42318" }}>Error</PanelTitle>
                <p style={{ margin: 0, color: "#b42318" }}>{error}</p>
                <div style={{ marginTop: 12 }}>
                  <PrimaryBtn onClick={loadUsers}>Try Again</PrimaryBtn>
                </div>
              </Panel>
            )}

            {!loading && !error && active === "Overview" && (
              <>
                <Grid>
                  {statsCards.map((s) => (
                    <Card key={s.label}>
                      <CardLabel>{s.label}</CardLabel>
                      <CardValue>{s.value ?? "-"}</CardValue>
                      <CardHint>Live data</CardHint>
                    </Card>
                  ))}
                </Grid>

                <TwoCol>
                  <Panel>
                    <PanelTitle>Summary</PanelTitle>
                    <List>
                      <li>
                        Total users: {pagination?.totalUsers ?? users.length}
                      </li>
                      <li>Owners: {counts.owners}</li>
                      <li>Tenants: {counts.tenants}</li>
                    </List>
                  </Panel>

                  <Panel>
                    <PanelTitle>Quick Actions</PanelTitle>
                    <ActionRow>
                      <PrimaryBtn onClick={() => setActive("Users")}>
                        View Users
                      </PrimaryBtn>
                    </ActionRow>
                  </Panel>
                </TwoCol>
              </>
            )}

            {!loading && !error && active === "Users" && (
              <Panel>
                <PanelTitle>
                  All Users{" "}
                  <span
                    style={{ color: "#64748b", fontWeight: 600, fontSize: 13 }}
                  >
                    ({pagination?.totalUsers ?? users.length})
                  </span>
                </PanelTitle>

                {users.length === 0 ? (
                  <p style={{ margin: 0, color: "#546173" }}>No users found.</p>
                ) : (
                  <TableWrap>
                    <Table>
                      <thead>
                        <tr>
                          <th>Full Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id}>
                            <td>{u.full_name || "-"}</td>
                            <td>{u.email || "-"}</td>
                            <td>
                              <RolePill>
                                {normalizeRole(u.role) || "-"}
                              </RolePill>
                            </td>
                            <td>{u.is_active === 0 ? "Inactive" : "Active"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </TableWrap>
                )}
              </Panel>
            )}

            {!loading &&
              !error &&
              active !== "Overview" &&
              active !== "Users" && (
                <Panel>
                  <PanelTitle>{active}</PanelTitle>
                  <p style={{ margin: 0, color: "#546173" }}>
                    Hook this tab to your API when ready.
                  </p>
                </Panel>
              )}
          </Section>
        </Content>
      </Layout>

      {sidebarOpen && <Overlay onClick={() => setSidebarOpen(false)} />}
    </Page>
  );
}

/* ---------------- styles ---------------- */

const Page = styled.div`
  min-height: 100vh;
  background: #f6f8fb;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  background: #ffffff;
  border-right: 1px solid #e7edf5;
  padding: 16px;
  position: sticky;
  top: 0;
  height: 100vh;

  @media (max-width: 960px) {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: 280px;
    transform: translateX(${(p) => (p.$open ? "0" : "-105%")});
    transition: transform 0.2s ease;
    z-index: 50;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoDot = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #22c55e);
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.1;

  small {
    color: #64748b;
  }
`;

const Nav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;

const NavItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid ${(p) => (p.$active ? "#cfe2ff" : "transparent")};
  background: ${(p) => (p.$active ? "#eef6ff" : "transparent")};
  color: ${(p) => (p.$active ? "#1f4fd6" : "#1f2937")};
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: ${(p) => (p.$active ? "#eef6ff" : "#f3f6fb")};
  }
`;

const SidebarFooter = styled.div`
  margin-top: auto;
  padding-top: 14px;
`;

const DangerBtn = styled.button`
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #ffd2d2;
  background: #fff5f5;
  color: #b42318;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #ffecec;
  }
`;

const Content = styled.main`
  padding: 18px;

  @media (max-width: 960px) {
    padding: 14px;
  }
`;

const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  background: #ffffff;
  border: 1px solid #e7edf5;
  border-radius: 16px;
  padding: 14px;
`;

const LeftTop = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TitleBlock = styled.div`
  h1 {
    margin: 0;
    font-size: 22px;
    letter-spacing: -0.3px;
    color: #0f172a;
  }
  p {
    margin: 2px 0 0;
    color: #64748b;
    font-size: 13px;
  }
`;

const IconBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid #e7edf5;
  background: #ffffff;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    background: #f3f6fb;
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #0f172a;
  color: #ffffff;
  font-weight: 800;
`;

const TabRow = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
`;

const Tab = styled.button`
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid ${(p) => (p.$active ? "#cfe2ff" : "#e7edf5")};
  background: ${(p) => (p.$active ? "#eef6ff" : "#ffffff")};
  color: ${(p) => (p.$active ? "#1f4fd6" : "#1f2937")};
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: ${(p) => (p.$active ? "#eef6ff" : "#f3f6fb")};
  }
`;

const Section = styled.section`
  padding: ${(p) => p.$pad || "18px"};

  @media (max-width: 768px) {
    padding: ${(p) => p.$padMobile || "14px"};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e7edf5;
  border-radius: 16px;
  padding: 14px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
`;

const CardLabel = styled.div`
  color: #64748b;
  font-weight: 700;
  font-size: 13px;
`;

const CardValue = styled.div`
  margin-top: 8px;
  font-size: 24px;
  font-weight: 900;
  color: #0f172a;
`;

const CardHint = styled.div`
  margin-top: 6px;
  color: #94a3b8;
  font-size: 12px;
`;

const TwoCol = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 12px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  background: #ffffff;
  border: 1px solid #e7edf5;
  border-radius: 16px;
  padding: 14px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
`;

const PanelTitle = styled.h3`
  margin: 0 0 10px;
  color: #0f172a;
  font-size: 16px;
`;

const List = styled.ul`
  margin: 0;
  padding-left: 18px;
  color: #334155;

  li {
    margin: 6px 0;
  }
`;

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const PrimaryBtn = styled.button`
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #cfe2ff;
  background: #eef6ff;
  color: #1f4fd6;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background: #e3f0ff;
  }
`;

const TableWrap = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    text-align: left;
    padding: 10px 8px;
  }

  th {
    color: #64748b;
    font-size: 13px;
  }

  td {
    color: #0f172a;
    font-size: 14px;
  }

  tbody tr {
    border-top: 1px solid #e7edf5;
  }
`;

const RolePill = styled.span`
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #e7edf5;
  background: #f3f6fb;
  font-weight: 800;
  text-transform: lowercase;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28);
  z-index: 40;

  @media (min-width: 961px) {
    display: none;
  }
`;
