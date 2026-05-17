'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="w-8 h-8 bg-primary-foreground rounded-full flex items-center justify-center text-primary font-bold text-sm">
                DP
              </div>
              Dr. Physio
            </div>
            <p className="text-sm opacity-80">
              Professional physical therapy and rehabilitation services dedicated to your recovery.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:underline opacity-80 hover:opacity-100">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:underline opacity-80 hover:opacity-100">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/therapists" className="hover:underline opacity-80 hover:opacity-100">
                  Therapists
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline opacity-80 hover:opacity-100">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 opacity-80">
                <Phone size={16} />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 opacity-80">
                <Mail size={16} />
                info@drphysio.com
              </li>
              <li className="flex items-center gap-2 opacity-80">
                <MapPin size={16} />
                123 Health St, Wellness City
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-primary-foreground/20"
              >
                <Facebook size={20} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-primary-foreground/20"
              >
                <Twitter size={20} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-primary-foreground/20"
              >
                <Instagram size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-80">
            <p>&copy; {currentYear} Dr. Physio. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
