/**
 * FloatingSocialBar
 * ─────────────────
 * A fixed, right-side floating contact widget for the Sploitsystems Academy
 * landing page.  Clicking the main toggle reveals five branded action buttons
 * that slide upward with a staggered Framer-Motion animation.
 *
 * ── Customisation ────────────────────────────────────────────────────────────
 * Replace the href values in SOCIAL_LINKS below with real URLs / addresses.
 * Each entry also accepts a `color` (button background) and `glow` (box-shadow
 * colour) you can adjust to match your brand.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaTimes,
  FaCommentDots,
} from 'react-icons/fa'
import { CONTACT_EMAIL, PRIMARY_PHONE, PRIMARY_PHONE_DIGITS, WHATSAPP_URL } from '../../lib/contact'

/* ── Social / contact data ───────────────────────────────────────────────── */
const SOCIAL_LINKS = [
  {
    id: 'whatsapp',
    label: `Chat on WhatsApp at ${PRIMARY_PHONE}`,
    icon: FaWhatsapp,
    href: WHATSAPP_URL,
    color: '#25D366',
    glow: 'rgba(37,211,102,0.45)',
  },
  {
    id: 'facebook',
    label: 'Visit our Facebook',
    icon: FaFacebook,
    href: 'https://facebook.com/sploitsystems', // ← replace
    color: '#1877F2',
    glow: 'rgba(24,119,242,0.45)',
  },
  {
    id: 'instagram',
    label: 'Follow on Instagram',
    icon: FaInstagram,
    href: 'https://instagram.com/sploitsystems', // ← replace
    color: '#E1306C',
    glow: 'rgba(225,48,108,0.45)',
  },
  {
    id: 'email',
    label: `Send us an email at ${CONTACT_EMAIL}`,
    icon: FaEnvelope,
    href: `mailto:${CONTACT_EMAIL}`,
    color: '#ff7a3c',
    glow: 'rgba(255,122,60,0.45)',
  },
  {
    id: 'call',
    label: `Call us at ${PRIMARY_PHONE}`,
    icon: FaPhone,
    href: `tel:+${PRIMARY_PHONE_DIGITS}`,
    color: '#00d4ff',
    glow: 'rgba(0,212,255,0.45)',
  },
]

/* ── Animation variants ──────────────────────────────────────────────────── */
const containerVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.02 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
}

const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 340, damping: 24 },
  },
  closed: {
    y: 20,
    opacity: 0,
    scale: 0.7,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
}

/* ── Component ───────────────────────────────────────────────────────────── */
export default function FloatingSocialBar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen((prev) => !prev)

  return (
    <div
      aria-label="Floating contact bar"
      style={{
        position: 'fixed',
        right: '20px',
        bottom: '28px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      {/* ── Expandable action buttons (render above the toggle) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="social-list"
            initial="closed"
            animate="open"
            exit="closed"
            variants={containerVariants}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {/* Buttons are rendered in reverse so WhatsApp appears at top */}
            {[...SOCIAL_LINKS].reverse().map((item) => (
              <SocialButton key={item.id} item={item} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main toggle button ── */}
      <ToggleButton isOpen={isOpen} onToggle={toggle} />
    </div>
  )
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function SocialButton({ item }) {
  const Icon = item.icon
  const [hovered, setHovered] = useState(false)

  return (
    <motion.a
      variants={itemVariants}
      href={item.href}
      target={item.href.startsWith('http') ? '_blank' : undefined}
      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
      aria-label={item.label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '46px',
        height: '46px',
        borderRadius: '50%',
        background: item.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontSize: '18px',
        textDecoration: 'none',
        cursor: 'pointer',
        boxShadow: hovered
          ? `0 0 0 3px ${item.glow}, 0 8px 24px ${item.glow}, 0 2px 6px rgba(0,0,0,0.55)`
          : `0 4px 14px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.3)`,
        transform: hovered ? 'translateY(-3px) scale(1.12)' : 'translateY(0) scale(1)',
        transition: 'box-shadow 0.25s ease, transform 0.22s ease',
        /* subtle 3-D bevel */
        background: `radial-gradient(circle at 35% 35%, color-mix(in srgb, ${item.color} 70%, #fff 30%), ${item.color})`,
        border: `1px solid ${item.glow}`,
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <Icon />
    </motion.a>
  )
}

function ToggleButton({ isOpen, onToggle }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      onClick={onToggle}
      aria-label={isOpen ? 'Close contact menu' : 'Open contact menu'}
      aria-expanded={isOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ rotate: isOpen ? 135 : 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      style={{
        width: '54px',
        height: '54px',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        color: '#ffffff',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        /* brand orange gradient */
        background: hovered
          ? 'radial-gradient(circle at 35% 35%, #ffaa6e, #e05a1e)'
          : 'radial-gradient(circle at 35% 35%, #ff9a5c, #ff6010)',
        boxShadow: hovered
          ? '0 0 0 3px rgba(255,122,60,0.5), 0 10px 30px rgba(255,96,16,0.55), 0 2px 8px rgba(0,0,0,0.6)'
          : '0 4px 18px rgba(255,96,16,0.5), 0 2px 6px rgba(0,0,0,0.5)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'box-shadow 0.25s ease, transform 0.2s ease, background 0.25s ease',
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          <motion.span
            key="close"
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.18 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <FaTimes />
          </motion.span>
        ) : (
          <motion.span
            key="open"
            initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
            transition={{ duration: 0.18 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <FaCommentDots />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
