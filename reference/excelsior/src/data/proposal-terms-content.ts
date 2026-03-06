import { BlockType } from "@/components/blocks";

export const proposalTermsContent = {
  hero: {
    icon: "file-text",
    headline: "Proposal Terms &",
    headlineAccent: "Conditions",
    lastUpdated: "January 8, 2026",
  },
  blocks: [
    {
      blockType: "legal-content-block",
      sections: [
        {
          heading: "Introduction",
          content: [
            'These Terms and Conditions ("Terms") govern the provision of services by Excelsior Creative LLC, a California limited liability company with its principal place of business in Orange County, California ("Provider," "we," or "us"), to you, the client ("Client," "you," or "your"). By accepting a proposal from Provider that incorporates or links to these Terms, or by otherwise engaging Provider\'s services, you agree to be bound by these Terms. If you are entering into these Terms on behalf of an entity, you represent and warrant that you have the authority to bind that entity.',
            'These Terms, together with any proposal, statement of work, or agreement referencing them (collectively, the "Agreement"), form the entire understanding between the parties. In the event of a conflict between these Terms and any specific proposal or statement of work, the proposal or statement of work shall prevail unless it explicitly states otherwise.',
          ],
        },
        {
          heading: "1. Services",
          content: [
            '1.1 **Scope of Services.** Provider agrees to perform the services described in the applicable proposal or statement of work ("Services"), which may include, but are not limited to, web development (e.g., WordPress, Elementor, React, Next.js), agentic solutions (AI chatbots, automation), software development (SaaS, mobile apps), brand development, managed web hosting, SEO services, social media marketing, and startup incubation. Services are provided on a project-based, hourly, retainer, or subscription basis as specified in the proposal.',
            "1.2 **Changes to Scope.** Any changes to the scope of Services must be agreed upon in writing via a change order. Provider reserves the right to charge additional fees for changes, including rush fees as specified in the proposal or hourly rates for revisions beyond the included rounds (e.g., beyond the included rounds at the hourly rates specified in the proposal).",
            "1.3 **Client Cooperation.** Client agrees to provide all necessary information, materials, access, and approvals in a timely manner. Delays caused by Client may result in adjusted timelines and additional fees. Provider is not responsible for delays or issues arising from Client's failure to cooperate.",
            "1.4 **Third-Party Services.** Services may involve third-party tools, platforms, or integrations (e.g., APIs, hosting providers, AI models). Client is responsible for any third-party fees, compliance, and risks associated therewith. Provider makes no warranties regarding third-party services.",
          ],
        },
        {
          heading: "2. Payment Terms",
          content: [
            "2.1 **Fees.** Fees are as outlined in the proposal, which may include hourly rates, fixed fees, retainers, tiers, or custom quotes. All fees are in U.S. dollars and exclusive of taxes.",
            "2.2 **Invoicing and Payment.** Invoices are issued upon milestones, monthly, or as specified. Payment is due net 15 days from invoice date unless otherwise stated. Client may be required to pay a deposit (e.g., as specified in the proposal). Late payments accrue interest at the rate specified in the proposal or the maximum rate allowed by California law, whichever is lower. Provider may suspend Services for non-payment.",
            "2.3 **Taxes.** Client is responsible for all applicable sales, use, value-added, or other taxes. Provider will add taxes to invoices where required.",
            "2.4 **Expenses.** Client reimburses Provider for reasonable out-of-pocket expenses (e.g., travel, software licenses) with prior approval.",
            "2.5 **Equity Arrangements.** For startup incubation or similar, any equity grants must be documented in a separate agreement. Provider's discounted rates (e.g., at a discounted rate) apply only with an equity stake as specified in the separate agreement, subject to vesting and other terms.",
          ],
        },
        {
          heading: "3. Intellectual Property",
          content: [
            '3.1 **Ownership.** Upon full payment, Provider grants Client a non-exclusive, worldwide, royalty-free license to use the deliverables ("Deliverables") for Client\'s internal business purposes. Provider retains ownership of all pre-existing materials, tools, methodologies, and any enhancements thereto (e.g., custom code libraries, AI prompts).',
            "3.2 **Client Materials.** Client grants Provider a limited license to use Client's materials (e.g., logos, content) solely to perform Services. Client represents that it has all rights to such materials and indemnifies Provider against any claims.",
            "3.3 **Third-Party IP.** Deliverables may incorporate open-source or third-party IP. Client agrees to comply with applicable licenses.",
            "3.4 **Infringement.** If a Deliverable infringes third-party IP, Provider's sole obligation is to modify it or procure rights, at Provider's expense. This does not apply if infringement arises from Client modifications or materials.",
          ],
        },
        {
          heading: "4. Confidentiality",
          content: [
            '4.1 **Definition.** Each party agrees to treat the other\'s non-public information (e.g., business plans, code, client data) as confidential ("Confidential Information").',
            "4.2 **Obligations.** Confidential Information shall not be disclosed without consent, except as required by law, and shall be protected using reasonable care for at least three (3) years after disclosure (or indefinitely for trade secrets).",
            "4.3 **Exceptions.** Confidentiality does not apply to information that is public, independently developed, or rightfully received from a third party.",
          ],
        },
        {
          heading: "5. Warranties and Disclaimers",
          content: [
            "5.1 **Provider Warranties.** Provider warrants that: (i) Services will be performed in a professional manner consistent with industry standards; (ii) Deliverables will substantially conform to the agreed specifications for 30 days after delivery (warranty period); and (iii) Provider has the right to provide the Services.",
            "5.2 **Client Warranties.** Client warrants that: (i) it has the right to enter this Agreement; (ii) its materials do not infringe third-party rights; and (iii) it will comply with all laws (e.g., data privacy, accessibility).",
            '5.3 **Disclaimers.** EXCEPT AS EXPRESSLY STATED, SERVICES AND DELIVERABLES ARE PROVIDED "AS IS." PROVIDER DISCLAIMS ALL IMPLIED WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. PROVIDER DOES NOT GUARANTEE RESULTS (E.G., SEO RANKINGS, AI PERFORMANCE, UPTIME BEYOND SLA), AND AI-RELATED SERVICES MAY PRODUCE UNEXPECTED OUTPUTS DUE TO MODEL LIMITATIONS.',
            "5.4 **AI-Specific.** AI solutions rely on evolving technologies. Provider is not liable for AI-generated content errors, biases, or hallucinations. Client must review and approve all outputs.",
          ],
        },
        {
          heading: "6. Limitation of Liability",
          content: [
            "6.1 **General.** TO THE MAXIMUM EXTENT PERMITTED BY CALIFORNIA LAW, NEITHER PARTY SHALL BE LIABLE FOR INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES (E.G., LOST PROFITS, DATA LOSS), EVEN IF ADVISED OF THE POSSIBILITY.",
            "6.2 **Cap.** PROVIDER'S TOTAL LIABILITY SHALL NOT EXCEED THE FEES PAID BY CLIENT IN THE 12 MONTHS PRECEDING THE CLAIM. THIS LIMITATION APPLIES TO ALL CLAIMS, INCLUDING CONTRACT, TORT, AND STRICT LIABILITY.",
            "6.3 **Exceptions.** Limitations do not apply to gross negligence, willful misconduct, IP infringement indemnification, or breaches of confidentiality.",
          ],
        },
        {
          heading: "7. Indemnification",
          content: [
            "Client agrees to indemnify, defend, and hold harmless Provider, its officers, directors, employees, and agents from any claims, losses, or damages arising from: (i) Client's materials or instructions; (ii) Client's use of Deliverables; (iii) violations of law by Client; or (iv) third-party claims related to Client's business.",
          ],
        },
        {
          heading: "8. Termination",
          content: [
            "8.1 **By Either Party.** Either party may terminate for material breach with 30 days' written notice if the breach is not cured. Provider may terminate immediately for non-payment.",
            "8.2 **By Client.** Client may terminate for convenience with 30 days' notice, paying for all Services rendered to date plus any non-cancellable commitments.",
            "8.3 **Effects.** Upon termination, Client pays all outstanding fees. Provider delivers paid-for Deliverables. Confidentiality and IP licenses survive.",
          ],
        },
        {
          heading: "9. Force Majeure",
          content: [
            "Neither party is liable for delays caused by events beyond reasonable control (e.g., natural disasters, wars, pandemics, cyber-attacks), provided prompt notice is given and efforts are made to mitigate.",
          ],
        },
        {
          heading: "10. Non-Solicitation",
          content: [
            "During the term and for one (1) year after, Client shall not solicit or hire Provider's employees or contractors without Provider's consent. Violation requires payment of one year's salary as liquidated damages.",
          ],
        },
        {
          heading: "11. Governing Law and Dispute Resolution",
          content: [
            "11.1 **Governing Law.** This Agreement is governed by California law, without regard to conflicts of laws principles.",
            "11.2 **Venue.** Any disputes shall be resolved exclusively in the state or federal courts located in Orange County, California. Parties consent to personal jurisdiction therein.",
            "11.3 **Arbitration Option.** At Provider's election, disputes may be resolved by binding arbitration under AAA rules in Orange County, California. The prevailing party recovers attorneys' fees.",
          ],
        },
        {
          heading: "12. Miscellaneous",
          content: [
            "12.1 **Entire Agreement.** This Agreement supersedes all prior understandings. Amendments must be in writing signed by both parties.",
            "12.2 **Severability.** If any provision is invalid, the remainder remains enforceable.",
            "12.3 **Assignment.** Client may not assign this Agreement without Provider's consent. Provider may assign to affiliates or in a merger/acquisition.",
            "12.4 **Waiver.** No waiver is effective unless in writing.",
            "12.5 **Notices.** Notices must be in writing via email or certified mail to the addresses in the proposal.",
            "12.6 **Independent Contractor.** Provider is an independent contractor; no agency, partnership, or employment relationship is created.",
            "12.7 **Data Privacy.** Provider complies with applicable data privacy laws (e.g., CCPA). Client consents to data processing as needed for Services.",
            "12.8 **Export Controls.** Client agrees not to use Services in violation of U.S. export laws.",
            "12.9 **Updates.** Provider may update these Terms with 30 days' notice. Continued use constitutes acceptance.",
          ],
        },
      ],
      contactInfo: {
        show: true,
        companyName: "Excelsior Creative LLC",
        location: "Orange County, California",
        email: "hello@excelsiorcreative.com",
      },
    } as BlockType,
  ],
};
