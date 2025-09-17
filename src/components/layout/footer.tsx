'use client'

import { Container } from '@/components/ui/container'

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border py-12 px-4 sm:px-6 lg:px-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold text-foreground">DeveloperSuccess</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Empowering developers to build profitable businesses around their expertise. 
              Join 50,000+ developers who&apos;ve transformed their careers with our proven system.
            </p>
            
            {/* Trust Badges */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <span className="text-green-500">🔒</span>
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-blue-500">⚡</span>
                  <span>Fast Support</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-purple-500">💰</span>
                  <span>60-Day Guarantee</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com/developersuccess" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Follow us on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a 
                href="https://github.com/developersuccess" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="View our code on GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a 
                href="https://linkedin.com/company/developersuccess" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Connect with us on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a 
                href="https://youtube.com/@developersuccess" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Subscribe to our YouTube channel"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Success Stories</a></li>
              <li><a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
              <li><a href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="/case-studies" className="text-muted-foreground hover:text-foreground transition-colors">Case Studies</a></li>
              <li><a href="/free-resources" className="text-muted-foreground hover:text-foreground transition-colors">Free Resources</a></li>
            </ul>
          </div>
          
          {/* Legal & Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support & Legal</h3>
            <ul className="space-y-2">
              <li><a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact Support</a></li>
              <li><a href="/help" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="/refund-policy" className="text-muted-foreground hover:text-foreground transition-colors">Refund Policy</a></li>
              <li><a href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Privacy Policy</a></li>
              <li><a href="/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Terms of Service</a></li>
              <li><a href="/cookie-policy" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © 2024 DeveloperSuccess. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Helping developers build profitable businesses since 2019.
              </p>
            </div>
            
            {/* Additional Trust Indicators */}
            <div className="flex items-center space-x-6 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <span>🌟</span>
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>✅</span>
                <span>50K+ Satisfied Developers</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>💎</span>
                <span>Premium Support</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}