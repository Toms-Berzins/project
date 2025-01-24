import { useEffect } from 'react';

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
          <p>By accessing or using our website and services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use of Services</h2>
          <p>Our services are intended for:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Requesting powder coating quotes</li>
            <li>Viewing our portfolio and services</li>
            <li>Communicating with our team</li>
            <li>Creating and managing your account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Quote Requests</h2>
          <p>When submitting a quote request:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>All information provided must be accurate and complete</li>
            <li>Quotes are estimates and subject to change upon inspection</li>
            <li>Final pricing may vary based on actual project requirements</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. User Accounts</h2>
          <p>When creating an account:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>You must provide accurate and complete information</li>
            <li>You are responsible for maintaining account security</li>
            <li>You must notify us of any unauthorized access</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
          <p>All content on this website, including text, graphics, logos, and images, is our property and protected by intellectual property laws.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
          <p>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. We will notify users of any material changes via email or website notice.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
          <p>For questions about these Terms of Service, please contact us at:</p>
          <p className="mt-2">{process.env.COMPANY_CONTACT_EMAIL || 'contact@example.com'}</p>
        </section>
      </div>
    </div>
  );
} 