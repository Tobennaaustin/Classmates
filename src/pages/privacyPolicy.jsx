import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800 bg-white">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Effective Date: <strong>[Insert Date]</strong></p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Account Information: name, email address, display name, and password.</li>
          <li>Classroom Data: messages, files, and shared content within classrooms.</li>
          <li>Optional Profile Data: profile photos or other optional fields you provide.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>To create and manage your account.</li>
          <li>To enable classroom chats and participation.</li>
          <li>To send notifications like invites and updates.</li>
          <li>To analyze app usage and improve functionality.</li>
          <li>To respond to support inquiries and provide customer service.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">3. Sharing of Information</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>We never sell or rent your personal data.</li>
          <li>We may share data with classroom members or service providers (e.g., Firebase).</li>
          <li>We may disclose data when required by law or legal process.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">4. Data Security</h2>
        <p>We implement security measures such as:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>End-to-end message encryption.</li>
          <li>Secure authentication via Firebase.</li>
          <li>Routine system updates and threat monitoring.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">5. Your Rights</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>You may access or update your personal data.</li>
          <li>You may request deletion of your account and data.</li>
          <li>You may opt out of communications where applicable.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">6. Children’s Privacy</h2>
        <p>
          Classmate is intended for users aged 13 and older. If you are under 13,
          please do not use this app without a parent or guardian’s consent.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">7. Third-Party Services</h2>
        <p>
          We use trusted third-party services. Please review their policies:
        </p>
        <ul className="list-disc ml-6 space-y-1">
          <li>
            <a href="https://firebase.google.com/support/privacy" className="text-blue-600 underline" target="_blank" rel="noreferrer">
              Firebase Privacy Policy
            </a>
          </li>
          <li>
            <a href="https://cloudinary.com/privacy" className="text-blue-600 underline" target="_blank" rel="noreferrer">
              Cloudinary Privacy Policy
            </a>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">8. Changes to This Policy</h2>
        <p>
          We may update this policy occasionally. Users will be notified via email or in-app alerts when significant changes occur.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">9. Contact Us</h2>
        <p>
          Have questions or concerns? Contact us:
        </p>
        <p className="mt-2">
          📧 <strong>Email:</strong> tobennaaustin@gmail.com<br />
          🌐 <strong>Website:</strong> <a href="https://classmates-lilac.vercel.app/" target="_blank" rel="noreferrer" className="text-blue-600 underline">classmate.app</a>
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
