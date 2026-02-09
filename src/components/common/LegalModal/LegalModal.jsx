import React, { useState, useRef, useEffect } from 'react';
import { FiCheck } from 'react-icons/fi';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';

const LegalModal = ({ isOpen, onClose, onAccept, type = 'terms' }) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setHasScrolledToBottom(false);
    }
  }, [isOpen]);

  const handleScroll = (e) => {
    const element = e.target;
    const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 10;
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const handleAccept = () => {
    onAccept();
    onClose();
  };

  const termsContent = (
    <div className="p-6 space-y-6">
      <section>
        <h3 className="text-xl font-bold text-text mb-3">1. Acceptance of Terms</h3>
        <p className="text-base text-text-secondary leading-relaxed">
          By accessing and using Chefio ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-text mb-3">2. Description of Service</h3>
        <p className="text-base text-text-secondary leading-relaxed mb-3">
          Chefio is a smart menu generator platform designed for students and aspiring chefs. The Service provides:
        </p>
        <ul className="list-disc list-inside space-y-2 text-base text-text-secondary ml-4">
          <li>AI-powered recipe generation based on available ingredients</li>
          <li>Ingredient scanning and identification</li>
          <li>Nutritional information and analysis</li>
          <li>QR code generation for recipe sharing</li>
          <li>Recipe saving and management features</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold text-text mb-3">3. User Accounts</h3>
        <p className="text-base text-text-secondary leading-relaxed mb-3">
          To access certain features of the Service, you must create an account. You agree to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-base text-text-secondary ml-4">
          <li>Provide accurate, current, and complete information during registration</li>
          <li>Maintain and promptly update your account information</li>
          <li>Maintain the security of your password and account</li>
          <li>Accept responsibility for all activities that occur under your account</li>
          <li>Notify us immediately of any unauthorized use of your account</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold text-text mb-3">4. User Conduct</h3>
        <p className="text-base text-text-secondary leading-relaxed mb-3">
          You agree not to use the Service to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-base text-text-secondary ml-4">
          <li>Upload or share content that is illegal, harmful, or offensive</li>
          <li>Impersonate any person or entity</li>
          <li>Interfere with or disrupt the Service or servers</li>
          <li>Attempt to gain unauthorized access to any portion of the Service</li>
          <li>Use the Service for any commercial purpose without our consent</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold text-text mb-3">5. Content and Intellectual Property</h3>
        <p className="text-base text-text-secondary leading-relaxed">
          All content provided through the Service, including recipes, text, graphics, logos, and software, is the property of Chefio or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from any content without explicit permission.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-text mb-3">6. Disclaimer of Warranties</h3>
        <p className="text-base text-text-secondary leading-relaxed">
          The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free. Nutritional information is provided for informational purposes only and should not be considered medical or dietary advice.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-text mb-3">7. Limitation of Liability</h3>
        <p className="text-base text-text-secondary leading-relaxed">
          Chefio shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service. This includes any damages related to food allergies, dietary restrictions, or health issues arising from recipes or nutritional information provided.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-text mb-3">8. Modifications to Service</h3>
        <p className="text-base text-text-secondary leading-relaxed">
          We reserve the right to modify or discontinue the Service at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-text mb-3">9. Termination</h3>
        <p className="text-base text-text-secondary leading-relaxed">
          We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-text mb-3">10. Changes to Terms</h3>
        <p className="text-base text-text-secondary leading-relaxed">
          We reserve the right to update these Terms at any time. We will notify users of any material changes by posting the new Terms on this page. Your continued use of the Service after such changes constitutes acceptance of the new Terms.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-text mb-3">11. Contact Information</h3>
        <p className="text-base text-text-secondary leading-relaxed">
          If you have any questions about these Terms, please contact us at support@chefio.com
        </p>
      </section>

      <section className="pt-4 border-t border-gray-200">
        <p className="text-sm text-text-tertiary italic">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </section>
    </div>
  );

  const privacyContent = (
    <div className="p-6 space-y-6">
      <section>
        <h3 className="text-xl font-bold text-text mb-3">1. Information We Collect</h3>
        <p className="text-base text-text-secondary leading-relaxed mb-3">
          We collect information that you provide directly to us, including:
        </p>
        <ul className="list-disc list-inside space-y-2 text-base text-text-secondary ml-4">
          <li>Account information (name, email address, password)</li>
          <li>Profile information and preferences</li>
          <li>Recipes you create, save, or share</li>
          <li>Ingredients you scan or input</li>
          <li>Usage data and interaction with the Service</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold text-text mb-3">2. How We Use Your Information</h3>
        <p className="text-base text-text-secondary leading-relaxed mb-3">
          We use the information we collect to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-base text-text-secondary ml-4">
          <li>Provide, maintain, and improve the Service</li>
          <li>Generate personalized recipe recommendations</li>
          <li>Process and complete transactions</li>
          <li>Send you technical notices and support messages</li>
          <li>Respond to your comments and questions</li>
          <li>Analyze usage patterns and trends</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold text-text mb-3">3. Information Sharing</h3>
        <p className="text-base text-text-secondary leading-relaxed mb-3">
          We do not sell your personal information. We may share your information in the following circumstances:
        </p>
        <ul className="list-disc list-inside space-y-2 text-base text-text-secondary ml-4">
          <li>With your consent or at your direction</li>
          <li>With service providers who perform services on our behalf</li>
          <li>To comply with legal obligations</li>
          <li>To protect the rights and safety of Chefio and our users</li>
          <li>In connection with a merger, sale, or acquisition</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold text-text mb-3">4. Data Security</h3>
        <p className="text-base text-text-secondary leading-relaxed">
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-text mb-3">5. Cookies and Tracking</h3>
        <p className="text-base text-text-secondary leading-relaxed">
          We use cookies and similar tracking technologies to collect information about your browsing activities. You can control cookies through your browser settings, but disabling cookies may affect your ability to use certain features of the Service.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-text mb-3">6. Your Rights and Choices</h3>
        <p className="text-base text-text-secondary leading-relaxed mb-3">
          You have the right to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-base text-text-secondary ml-4">
          <li>Access and update your personal information</li>
          <li>Request deletion of your account and data</li>
          <li>Opt-out of marketing communications</li>
          <li>Request a copy of your data</li>
          <li>Object to certain processing of your information</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold text-text mb-3">7. Children's Privacy</h3>
        <p className="text-base text-text-secondary leading-relaxed">
          The Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-text mb-3">8. International Data Transfers</h3>
        <p className="text-base text-text-secondary leading-relaxed">
          Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using the Service, you consent to such transfers.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-text mb-3">9. Changes to Privacy Policy</h3>
        <p className="text-base text-text-secondary leading-relaxed">
          We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-text mb-3">10. Contact Us</h3>
        <p className="text-base text-text-secondary leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us at privacy@chefio.com
        </p>
      </section>

      <section className="pt-4 border-t border-gray-200">
        <p className="text-sm text-text-tertiary italic">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </section>
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={type === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
      size="large"
    >
      {/* Scrollable Content */}
      <div 
        ref={contentRef}
        onScroll={handleScroll}
        className="overflow-y-auto max-h-[60vh]"
      >
        {type === 'terms' ? termsContent : privacyContent}
      </div>

      {/* Scroll Indicator */}
      {!hasScrolledToBottom && (
        <div className="px-6 py-3 bg-amber-50 border-t border-amber-200">
          <p className="text-sm text-amber-800 text-center">
            Please scroll to the bottom to accept
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 flex gap-3">
        <Button 
          variant="outline" 
          fullWidth 
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          fullWidth 
          onClick={handleAccept}
          disabled={!hasScrolledToBottom}
          icon={hasScrolledToBottom ? <FiCheck /> : null}
        >
          {hasScrolledToBottom ? 'I Accept' : 'Scroll to Accept'}
        </Button>
      </div>
    </Modal>
  );
};

export default LegalModal;
