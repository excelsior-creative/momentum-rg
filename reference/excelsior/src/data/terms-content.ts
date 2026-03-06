import { BlockType } from "@/components/blocks";

export const termsContent = {
  hero: {
    icon: "file-text",
    headline: "Terms of",
    headlineAccent: "Service",
    lastUpdated: "December 31, 2024",
  },
  blocks: [
    {
      blockType: "legal-content-block",
      sections: [
        {
          heading: "1. Acceptance of Terms",
          content: [
            'These Terms of Service ("Terms") are entered into by and between you and Excelsior Creative ("Company," "we," or "us"). The following terms and conditions, together with any documents they expressly incorporate by reference, govern your access to and use of excelsiorcreative.com, including any content, functionality, and services offered on or through excelsiorcreative.com (the "Website").',
            "Please read the Terms of Service carefully before you start to use the Website. By using the Website, you accept and agree to be bound and abide by these Terms of Service and our Privacy Policy, incorporated herein by reference. If you do not want to agree to these Terms of Service or the Privacy Policy, you must not access or use the Website.",
          ],
        },
        {
          heading: "2. Changes to the Terms of Service",
          content: [
            "We may revise and update these Terms of Service from time to time in our sole discretion. All changes are effective immediately when we post them, and apply to all access to and use of the Website thereafter. Your continued use of the Website following the posting of revised Terms of Service means that you accept and agree to the changes.",
          ],
        },
        {
          heading: "3. Accessing the Website and Account Security",
          content: [
            "We reserve the right to withdraw or amend this Website, and any service or material we provide on the Website, in our sole discretion without notice. We will not be liable if for any reason all or any part of the Website is unavailable at any time or for any period.",
            "To access the Website or some of the resources it offers, you may be asked to provide certain registration details or other information. It is a condition of your use of the Website that all the information you provide on the Website is correct, current, and complete.",
          ],
        },
        {
          heading: "4. Intellectual Property Rights",
          content: [
            "The Website and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by the Company, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.",
            "These Terms of Service permit you to use the Website for your personal, non-commercial use only. You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Website.",
          ],
        },
        {
          heading: "5. Prohibited Uses",
          content: [
            'You may use the Website only for lawful purposes and in accordance with these Terms of Service. You agree not to use the Website: (a) In any way that violates any applicable federal, state, local, or international law or regulation; (b) For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way; (c) To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation.',
          ],
        },
        {
          heading: "6. Disclaimer of Warranties",
          content: [
            "You understand that we cannot and do not guarantee or warrant that files available for downloading from the internet or the Website will be free of viruses or other destructive code. You are responsible for implementing sufficient procedures and checkpoints to satisfy your particular requirements for anti-virus protection and accuracy of data input and output.",
            'YOUR USE OF THE WEBSITE, ITS CONTENT, AND ANY SERVICES OR ITEMS OBTAINED THROUGH THE WEBSITE IS AT YOUR OWN RISK. THE WEBSITE, ITS CONTENT, AND ANY SERVICES OR ITEMS OBTAINED THROUGH THE WEBSITE ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.',
          ],
        },
        {
          heading: "7. Limitation on Liability",
          content: [
            "TO THE FULLEST EXTENT PROVIDED BY LAW, IN NO EVENT WILL THE COMPANY, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE WEBSITE, ANY WEBSITES LINKED TO IT, ANY CONTENT ON THE WEBSITE OR SUCH OTHER WEBSITES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.",
          ],
        },
        {
          heading: "8. Governing Law and Jurisdiction",
          content: [
            "All matters relating to the Website and these Terms of Service, and any dispute or claim arising therefrom or related thereto (in each case, including non-contractual disputes or claims), shall be governed by and construed in accordance with the internal laws of the State of California without giving effect to any choice or conflict of law provision or rule.",
            "Any legal suit, action, or proceeding arising out of, or related to, these Terms of Service or the Website shall be instituted exclusively in the federal courts of the United States or the courts of the State of California, in each case located in the County of Orange.",
          ],
        },
      ],
      contactInfo: {
        show: true,
        companyName: "Excelsior Creative",
        location: "Orange County, California",
        email: "hello@excelsiorcreative.com",
      },
    } as BlockType,
  ],
};
