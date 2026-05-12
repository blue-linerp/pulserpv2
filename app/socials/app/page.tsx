"use client"

import { useState, useEffect, useRef } from "react"

/* REPLACE: your brand name */
const BRAND_NAME = "ItsGavinGG"

/* REPLACE: default password */
const ADMIN_PASSWORD = "admin123"

const STORAGE_KEY_PROFILE = "linktree_profile"
const STORAGE_KEY_LINKS = "linktree_links"

const DEFAULT_PROFILE = {
  name: "Your Name",
  bio: "Creator • Streamer • Dev",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=YourName",
}

const DEFAULT_LINKS = [
  { id: 1, label: "Join My Discord", iconType: "fa", iconValue: "fa-brands fa-discord", url: "#", enabled: true },
  { id: 2, label: "Watch on Twitch", iconType: "fa", iconValue: "fa-brands fa-twitch", url: "#", enabled: true },
  { id: 3, label: "Follow on Instagram", iconType: "fa", iconValue: "fa-brands fa-instagram", url: "#", enabled: true },
  { id: 4, label: "My YouTube", iconType: "fa", iconValue: "fa-brands fa-youtube", url: "#", enabled: true },
  { id: 5, label: "My Store", iconType: "fa", iconValue: "fa-solid fa-store", url: "#", enabled: true },
]

// ---------- Theme ----------
const T = {
  bg: "#0d0d0d",
  card: "#1a1a1a",
  primary: "#cc0000",
  hover: "#ff1a1a",
  border: "#333333",
  textPrimary: "#ffffff",
  textSecondary: "#aaaaaa",
  inputBg: "#111111",
  glow: "0 0 14px #cc000099",
}

export default function App() {
  const [view, setView] = useState<"public" | "admin">("public")
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [links, setLinks] = useState(DEFAULT_LINKS)
  const [hydrated, setHydrated] = useState(false)

  // Inject Font Awesome 6 + Inter font + global keyframes
  useEffect(() => {
    if (!document.getElementById("fa6-link")) {
      const fa = document.createElement("link")
      fa.id = "fa6-link"
      fa.rel = "stylesheet"
      fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      document.head.appendChild(fa)
    }
    if (!document.getElementById("inter-font-link")) {
      const pre1 = document.createElement("link")
      pre1.rel = "preconnect"
      pre1.href = "https://fonts.googleapis.com"
      document.head.appendChild(pre1)

      const pre2 = document.createElement("link")
      pre2.rel = "preconnect"
      pre2.href = "https://fonts.gstatic.com"
      pre2.crossOrigin = "anonymous"
      document.head.appendChild(pre2)

      const inter = document.createElement("link")
      inter.id = "inter-font-link"
      inter.rel = "stylesheet"
      inter.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
      document.head.appendChild(inter)
    }
    if (!document.getElementById("linktree-keyframes")) {
      const style = document.createElement("style")
      style.id = "linktree-keyframes"
      style.innerHTML = `
        @keyframes ltSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ltModalIn {
          from { opacity: 0; transform: scale(0.94); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes ltOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        body { background: ${T.bg}; }
        input::placeholder, textarea::placeholder { color: #666; }
        .lt-link-card:hover {
          background: #232323 !important;
          border-color: ${T.primary} !important;
          box-shadow: ${T.glow} !important;
        }
        .lt-btn-primary:hover {
          background: ${T.hover} !important;
          box-shadow: 0 0 18px ${T.hover}aa !important;
        }
        .lt-btn-secondary:hover {
          background: #2a2a2a !important;
          border-color: #555 !important;
        }
        .lt-btn-danger:hover {
          background: ${T.hover} !important;
        }
        .lt-icon-btn:hover {
          background: #232323 !important;
          border-color: ${T.primary} !important;
          color: ${T.primary} !important;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  // Load from localStorage
  useEffect(() => {
    try {
      const p = localStorage.getItem(STORAGE_KEY_PROFILE)
      const l = localStorage.getItem(STORAGE_KEY_LINKS)
      if (p) setProfile(JSON.parse(p))
      if (l) setLinks(JSON.parse(l))
    } catch (e) {
      console.log("[v0] Failed to read localStorage:", e)
    }
    setHydrated(true)
  }, [])

  // Persist profile
  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile))
  }, [profile, hydrated])

  // Persist links
  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(links))
  }, [links, hydrated])

  const openPasswordPrompt = () => {
    setPasswordInput("")
    setPasswordError("")
    setShowPasswordModal(true)
  }

  const submitPassword = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setShowPasswordModal(false)
      setView("admin")
      setPasswordInput("")
      setPasswordError("")
    } else {
      setPasswordError("Incorrect password")
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        color: T.textPrimary,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {view === "public" ? (
        <PublicProfile profile={profile} links={links} onOpenAdmin={openPasswordPrompt} />
      ) : (
        <AdminPanel
          profile={profile}
          setProfile={setProfile}
          links={links}
          setLinks={setLinks}
          onBack={() => setView("public")}
        />
      )}

      {showPasswordModal && (
        <PasswordModal
          value={passwordInput}
          onChange={setPasswordInput}
          onSubmit={submitPassword}
          onCancel={() => setShowPasswordModal(false)}
          error={passwordError}
        />
      )}
    </div>
  )
}

// ============================================================
// PUBLIC PROFILE PAGE
// ============================================================
function PublicProfile({
  profile,
  links,
  onOpenAdmin,
}: {
  profile: typeof DEFAULT_PROFILE
  links: typeof DEFAULT_LINKS
  onOpenAdmin: () => void
}) {
  const visible = links.filter((l) => l.enabled)

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px 20px 48px",
      }}
    >
      {/* Gear icon */}
      <button
        aria-label="Open admin panel"
        onClick={onOpenAdmin}
        className="lt-icon-btn"
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 40,
          height: 40,
          borderRadius: 10,
          background: T.card,
          border: `1px solid ${T.border}`,
          color: T.textSecondary,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
        }}
      >
        <i className="fa-solid fa-gear" style={{ fontSize: 16 }} />
      </button>

      <div style={{ width: "100%", maxWidth: 480, marginTop: 24 }}>
        {/* Profile section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: 32,
            animation: "ltSlideUp 0.5s ease both",
          }}
        >
          <div
            style={{
              width: 104,
              height: 104,
              borderRadius: "50%",
              overflow: "hidden",
              border: `2px solid ${T.border}`,
              boxShadow: T.glow,
              background: T.card,
              marginBottom: 16,
            }}
          >
            {profile.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar || "/placeholder.svg"}
                alt={`${profile.name} avatar`}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: T.textSecondary,
                }}
              >
                <i className="fa-solid fa-user" style={{ fontSize: 36 }} />
              </div>
            )}
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 800,
              color: T.textPrimary,
              letterSpacing: "-0.02em",
            }}
          >
            {profile.name}
          </h1>
          <p
            style={{
              marginTop: 6,
              marginBottom: 0,
              fontSize: 15,
              color: T.textSecondary,
              lineHeight: 1.5,
            }}
          >
            {profile.bio}
          </p>
        </div>

        {/* Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {visible.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: T.textSecondary,
                padding: "32px 16px",
                border: `1px dashed ${T.border}`,
                borderRadius: 14,
              }}
            >
              No links yet. Open the admin panel to add some.
            </div>
          )}
          {visible.map((link, i) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="lt-link-card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                width: "100%",
                padding: "14px 16px",
                background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                color: T.textPrimary,
                textDecoration: "none",
                transition: "all 0.2s ease",
                opacity: 0,
                animation: `ltSlideUp 0.5s ease forwards`,
                animationDelay: `${0.1 + i * 0.07}s`,
              }}
            >
              <LinkIcon iconType={link.iconType} iconValue={link.iconValue} size={36} />
              <span
                style={{
                  flex: 1,
                  fontSize: 15,
                  fontWeight: 600,
                  textAlign: "center",
                  marginLeft: -36, // visually center label, accounting for icon
                }}
              >
                {link.label}
              </span>
              <i
                className="fa-solid fa-arrow-up-right-from-square"
                style={{ color: T.textSecondary, fontSize: 12 }}
                aria-hidden="true"
              />
            </a>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 48,
            textAlign: "center",
            color: T.textSecondary,
            fontSize: 12,
            lineHeight: 1.6,
          }}
        >
          <div>© {new Date().getFullYear()} {profile.name}. All rights reserved.</div>
          <div style={{ marginTop: 4, opacity: 0.8 }}>
            Powered by <span style={{ color: T.primary, fontWeight: 600 }}>{BRAND_NAME}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// ADMIN PANEL
// ============================================================
function AdminPanel({
  profile,
  setProfile,
  links,
  setLinks,
  onBack,
}: {
  profile: typeof DEFAULT_PROFILE
  setProfile: (p: typeof DEFAULT_PROFILE) => void
  links: typeof DEFAULT_LINKS
  setLinks: (l: typeof DEFAULT_LINKS) => void
  onBack: () => void
}) {
  const [draftProfile, setDraftProfile] = useState(profile)
  const [savedFlash, setSavedFlash] = useState(false)

  const [editorOpen, setEditorOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<(typeof DEFAULT_LINKS)[number] | null>(null)

  useEffect(() => {
    setDraftProfile(profile)
  }, [profile])

  const saveProfile = () => {
    setProfile(draftProfile)
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1500)
  }

  const toggleLink = (id: number) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l)))
  }

  const deleteLink = (id: number) => {
    setLinks(links.filter((l) => l.id !== id))
  }

  const moveLink = (id: number, direction: -1 | 1) => {
    const idx = links.findIndex((l) => l.id === id)
    if (idx === -1) return
    const target = idx + direction
    if (target < 0 || target >= links.length) return
    const next = [...links]
    const [item] = next.splice(idx, 1)
    next.splice(target, 0, item)
    setLinks(next)
  }

  const openNewLink = () => {
    setEditingLink({
      id: 0,
      label: "",
      url: "",
      iconType: "fa",
      iconValue: "fa-solid fa-link",
      enabled: true,
    })
    setEditorOpen(true)
  }

  const openEditLink = (link: (typeof DEFAULT_LINKS)[number]) => {
    setEditingLink({ ...link })
    setEditorOpen(true)
  }

  const saveLink = (link: (typeof DEFAULT_LINKS)[number]) => {
    if (link.id === 0) {
      const nextId = links.length > 0 ? Math.max(...links.map((l) => l.id)) + 1 : 1
      setLinks([...links, { ...link, id: nextId }])
    } else {
      setLinks(links.map((l) => (l.id === link.id ? link : l)))
    }
    setEditorOpen(false)
    setEditingLink(null)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px 20px 64px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 640 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
          }}
        >
          <button
            onClick={onBack}
            className="lt-icon-btn"
            aria-label="Back to public profile"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: T.card,
              border: `1px solid ${T.border}`,
              color: T.textSecondary,
              padding: "8px 14px",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
              transition: "all 0.2s ease",
              fontFamily: "inherit",
            }}
          >
            <i className="fa-solid fa-arrow-left" />
            Back
          </button>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: T.textPrimary,
              letterSpacing: "-0.01em",
            }}
          >
            Admin Panel
          </h2>
          <div style={{ width: 86 }} />
        </div>

        {/* Section 1: Profile Settings */}
        <Section title="Profile Settings" icon="fa-solid fa-id-card">
          <Field label="Display Name">
            <Input
              value={draftProfile.name}
              onChange={(v) => setDraftProfile({ ...draftProfile, name: v })}
              placeholder="Your Name"
            />
          </Field>
          <Field label="Bio / Tagline">
            <Input
              value={draftProfile.bio}
              onChange={(v) => setDraftProfile({ ...draftProfile, bio: v })}
              placeholder="Creator • Streamer • Dev"
            />
          </Field>
          <Field label="Avatar Image URL">
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Input
                value={draftProfile.avatar}
                onChange={(v) => setDraftProfile({ ...draftProfile, avatar: v })}
                placeholder="https://..."
              />
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  overflow: "hidden",
                  flexShrink: 0,
                  border: `1px solid ${T.border}`,
                  background: T.inputBg,
                }}
              >
                {draftProfile.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={draftProfile.avatar || "/placeholder.svg"}
                    alt="Avatar preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: T.textSecondary,
                    }}
                  >
                    <i className="fa-solid fa-user" />
                  </div>
                )}
              </div>
            </div>
          </Field>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
            <PrimaryButton onClick={saveProfile}>
              <i className="fa-solid fa-floppy-disk" style={{ marginRight: 8 }} />
              Save Profile
            </PrimaryButton>
            {savedFlash && (
              <span style={{ color: T.primary, fontSize: 13, fontWeight: 600 }}>
                <i className="fa-solid fa-check" style={{ marginRight: 6 }} />
                Saved
              </span>
            )}
          </div>
        </Section>

        {/* Section 2: Manage Links */}
        <Section title="Manage Links" icon="fa-solid fa-link">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {links.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  color: T.textSecondary,
                  padding: "20px 16px",
                  border: `1px dashed ${T.border}`,
                  borderRadius: 12,
                  fontSize: 14,
                }}
              >
                No links yet — add your first one below.
              </div>
            )}
            {links.map((link, idx) => (
              <div
                key={link.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  background: T.inputBg,
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <button
                    onClick={() => moveLink(link.id, -1)}
                    disabled={idx === 0}
                    aria-label={`Move ${link.label} up`}
                    title="Move up"
                    style={{
                      width: 22,
                      height: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "transparent",
                      border: `1px solid ${T.border}`,
                      borderRadius: 6,
                      color: idx === 0 ? "#555" : T.textSecondary,
                      cursor: idx === 0 ? "not-allowed" : "pointer",
                      padding: 0,
                      fontSize: 10,
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (idx === 0) return
                      e.currentTarget.style.color = T.textPrimary
                      e.currentTarget.style.borderColor = T.primary
                    }}
                    onMouseLeave={(e) => {
                      if (idx === 0) return
                      e.currentTarget.style.color = T.textSecondary
                      e.currentTarget.style.borderColor = T.border
                    }}
                  >
                    <i className="fa-solid fa-chevron-up" />
                  </button>
                  <button
                    onClick={() => moveLink(link.id, 1)}
                    disabled={idx === links.length - 1}
                    aria-label={`Move ${link.label} down`}
                    title="Move down"
                    style={{
                      width: 22,
                      height: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "transparent",
                      border: `1px solid ${T.border}`,
                      borderRadius: 6,
                      color: idx === links.length - 1 ? "#555" : T.textSecondary,
                      cursor: idx === links.length - 1 ? "not-allowed" : "pointer",
                      padding: 0,
                      fontSize: 10,
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (idx === links.length - 1) return
                      e.currentTarget.style.color = T.textPrimary
                      e.currentTarget.style.borderColor = T.primary
                    }}
                    onMouseLeave={(e) => {
                      if (idx === links.length - 1) return
                      e.currentTarget.style.color = T.textSecondary
                      e.currentTarget.style.borderColor = T.border
                    }}
                  >
                    <i className="fa-solid fa-chevron-down" />
                  </button>
                </div>
                <LinkIcon iconType={link.iconType} iconValue={link.iconValue} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: T.textPrimary,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {link.label || <span style={{ color: T.textSecondary }}>Untitled</span>}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: T.textSecondary,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {link.url || "—"}
                  </div>
                </div>
                <Toggle checked={link.enabled} onChange={() => toggleLink(link.id)} />
                <button
                  onClick={() => openEditLink(link)}
                  className="lt-btn-secondary"
                  aria-label={`Edit ${link.label}`}
                  style={iconButtonStyle()}
                >
                  <i className="fa-solid fa-pen" />
                </button>
                <button
                  onClick={() => deleteLink(link.id)}
                  className="lt-btn-danger"
                  aria-label={`Delete ${link.label}`}
                  style={{
                    ...iconButtonStyle(),
                    background: T.primary,
                    borderColor: T.primary,
                    color: T.textPrimary,
                  }}
                >
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <PrimaryButton onClick={openNewLink} fullWidth>
              <i className="fa-solid fa-plus" style={{ marginRight: 8 }} />
              Add New Link
            </PrimaryButton>
          </div>
        </Section>
      </div>

      {editorOpen && editingLink && (
        <LinkEditorModal
          link={editingLink}
          onSave={saveLink}
          onCancel={() => {
            setEditorOpen(false)
            setEditingLink(null)
          }}
        />
      )}
    </div>
  )
}

// ============================================================
// LINK EDITOR MODAL
// ============================================================
function LinkEditorModal({
  link,
  onSave,
  onCancel,
}: {
  link: (typeof DEFAULT_LINKS)[number]
  onSave: (l: (typeof DEFAULT_LINKS)[number]) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState(() => {
    // Prefill URL with "https://" if the field is empty or just "#"
    const initialUrl = !link.url || link.url === "#" ? "https://" : link.url
    return { ...link, url: initialUrl }
  })

  const isFa = draft.iconType === "fa"

  const handleUrlChange = (v: string) => {
    // Always keep the "https://" prefix locked in front of whatever the user types
    const prefix = "https://"
    let next = v
    if (!next.startsWith(prefix)) {
      // If user deleted into the prefix, restore it; otherwise prepend
      if (prefix.startsWith(next)) next = prefix
      else next = prefix + next.replace(/^https?:\/\//, "")
    }
    setDraft({ ...draft, url: next })
  }

  return (
    <ModalShell onClose={onCancel} dismissOnOverlayClick={false}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T.textPrimary }}>
          {link.id === 0 ? "Add New Link" : "Edit Link"}
        </h3>
        <button
          onClick={onCancel}
          aria-label="Close"
          className="lt-icon-btn"
          style={{
            ...iconButtonStyle(),
            background: "transparent",
          }}
        >
          <i className="fa-solid fa-xmark" />
        </button>
      </div>

      <Field label="Label">
        <Input
          value={draft.label}
          onChange={(v) => setDraft({ ...draft, label: v })}
          placeholder="Join My Discord"
        />
      </Field>
      <Field label="URL">
        <Input
          value={draft.url}
          onChange={handleUrlChange}
          placeholder="https://..."
        />
      </Field>

      <Field label="Icon Type">
        <div style={{ display: "flex", gap: 8 }}>
          <SegmentButton
            active={isFa}
            onClick={() =>
              setDraft({
                ...draft,
                iconType: "fa",
                iconValue: isFa ? draft.iconValue : "fa-solid fa-link",
              })
            }
          >
            <i className="fa-solid fa-icons" style={{ marginRight: 6 }} />
            Font Awesome
          </SegmentButton>
          <SegmentButton
            active={!isFa}
            onClick={() =>
              setDraft({
                ...draft,
                iconType: "image",
                iconValue: !isFa ? draft.iconValue : "",
              })
            }
          >
            <i className="fa-solid fa-image" style={{ marginRight: 6 }} />
            Image URL
          </SegmentButton>
        </div>
      </Field>

      {isFa ? (
        <Field label="Font Awesome Class">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Input
              value={draft.iconValue}
              onChange={(v) => setDraft({ ...draft, iconValue: v })}
              placeholder="fa-brands fa-discord"
            />
            <PreviewCircle>
              <i className={draft.iconValue || "fa-solid fa-link"} style={{ color: T.textPrimary }} />
            </PreviewCircle>
          </div>
        </Field>
      ) : (
        <Field label="Image URL">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Input
              value={draft.iconValue}
              onChange={(v) => setDraft({ ...draft, iconValue: v })}
              placeholder="https://.../icon.png"
            />
            <PreviewCircle>
              {draft.iconValue ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={draft.iconValue || "/placeholder.svg"}
                  alt="Icon preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <i className="fa-solid fa-image" style={{ color: T.textSecondary }} />
              )}
            </PreviewCircle>
          </div>
        </Field>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <PrimaryButton onClick={() => onSave(draft)} fullWidth>
          <i className="fa-solid fa-floppy-disk" style={{ marginRight: 8 }} />
          Save Link
        </PrimaryButton>
        <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
      </div>
    </ModalShell>
  )
}

// ============================================================
// PASSWORD MODAL
// ============================================================
function PasswordModal({
  value,
  onChange,
  onSubmit,
  onCancel,
  error,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  onCancel: () => void
  error: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  return (
    <ModalShell onClose={onCancel} maxWidth={380}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div
          style={{
            width: 52,
            height: 52,
            margin: "0 auto 12px",
            borderRadius: "50%",
            background: T.inputBg,
            border: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: T.primary,
            boxShadow: T.glow,
          }}
        >
          <i className="fa-solid fa-lock" style={{ fontSize: 20 }} />
        </div>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T.textPrimary }}>Admin Access</h3>
        <p style={{ marginTop: 6, marginBottom: 0, color: T.textSecondary, fontSize: 13 }}>
          Enter the password to manage your profile
        </p>
      </div>

      <Field label="Password">
        <input
          ref={inputRef}
          type="password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit()
            if (e.key === "Escape") onCancel()
          }}
          placeholder="••••••••"
          style={inputStyle()}
        />
      </Field>

      {error && (
        <div
          style={{
            color: T.hover,
            fontSize: 13,
            marginTop: -4,
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <i className="fa-solid fa-circle-exclamation" />
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <PrimaryButton onClick={onSubmit} fullWidth>
          <i className="fa-solid fa-unlock" style={{ marginRight: 8 }} />
          Unlock
        </PrimaryButton>
        <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
      </div>
    </ModalShell>
  )
}

// ============================================================
// REUSABLE PIECES
// ============================================================
function ModalShell({
  children,
  onClose,
  maxWidth = 480,
  dismissOnOverlayClick = true,
}: {
  children: React.ReactNode
  onClose: () => void
  maxWidth?: number
  dismissOnOverlayClick?: boolean
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={dismissOnOverlayClick ? onClose : undefined}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "ltOverlayIn 0.2s ease both",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth,
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 12px 48px rgba(0,0,0,0.6)",
          animation: "ltModalIn 0.22s ease both",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {children}
      </div>
    </div>
  )
}

function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon: string
  children: React.ReactNode
}) {
  return (
    <section
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        padding: 22,
        marginBottom: 18,
      }}
    >
      <h3
        style={{
          margin: "0 0 18px 0",
          fontSize: 14,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: T.textSecondary,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <i className={icon} style={{ color: T.primary }} />
        {title}
      </h3>
      {children}
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 600,
          color: T.textSecondary,
          marginBottom: 6,
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyle()}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = T.primary
        e.currentTarget.style.boxShadow = T.glow
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = T.border
        e.currentTarget.style.boxShadow = "none"
      }}
    />
  )
}

function PrimaryButton({
  children,
  onClick,
  fullWidth,
}: {
  children: React.ReactNode
  onClick: () => void
  fullWidth?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className="lt-btn-primary"
      style={{
        background: T.primary,
        color: T.textPrimary,
        border: "none",
        padding: "12px 20px",
        borderRadius: 12,
        fontWeight: 600,
        fontSize: 14,
        cursor: "pointer",
        boxShadow: T.glow,
        transition: "all 0.2s ease",
        width: fullWidth ? "100%" : undefined,
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  )
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="lt-btn-secondary"
      style={{
        background: T.inputBg,
        color: T.textPrimary,
        border: `1px solid ${T.border}`,
        padding: "12px 18px",
        borderRadius: 12,
        fontWeight: 600,
        fontSize: 14,
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  )
}

function SegmentButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "10px 12px",
        borderRadius: 10,
        border: `1px solid ${active ? T.primary : T.border}`,
        background: active ? "rgba(204,0,0,0.12)" : T.inputBg,
        color: active ? T.textPrimary : T.textSecondary,
        boxShadow: active ? T.glow : "none",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 600,
        transition: "all 0.2s ease",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  )
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      style={{
        width: 42,
        height: 24,
        borderRadius: 999,
        border: "none",
        background: checked ? T.primary : "#3a3a3a",
        position: "relative",
        cursor: "pointer",
        boxShadow: checked ? T.glow : "none",
        transition: "all 0.2s ease",
        flexShrink: 0,
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 21 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: T.textPrimary,
          transition: "all 0.2s ease",
        }}
      />
    </button>
  )
}

function PreviewCircle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: T.inputBg,
        border: `1px solid ${T.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  )
}

function LinkIcon({
  iconType,
  iconValue,
  size = 36,
}: {
  iconType: string
  iconValue: string
  size?: number
}) {
  if (iconType === "image" && iconValue) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          background: T.inputBg,
          border: `1px solid ${T.border}`,
          flexShrink: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconValue || "/placeholder.svg"}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
    )
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: T.inputBg,
        border: `1px solid ${T.border}`,
        color: T.textPrimary,
        fontSize: Math.round(size * 0.45),
        flexShrink: 0,
      }}
    >
      <i className={iconValue || "fa-solid fa-link"} aria-hidden="true" />
    </div>
  )
}

// ---------- Style helpers ----------
function inputStyle(): React.CSSProperties {
  return {
    width: "100%",
    background: T.inputBg,
    border: `1px solid ${T.border}`,
    borderRadius: 10,
    color: T.textPrimary,
    padding: "10px 12px",
    fontSize: 14,
    outline: "none",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
    boxSizing: "border-box",
  }
}

function iconButtonStyle(): React.CSSProperties {
  return {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: T.inputBg,
    border: `1px solid ${T.border}`,
    color: T.textSecondary,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    fontSize: 13,
    flexShrink: 0,
  }
}
