Good, I want to remind you the project and things to implement. Just keep them well noted, I have implemented landing page, and the auths. before moving to the next recheck the detail of the project by this below further intruction will come on what page is next to buld:
To create a **focused and effective mockup**, we will concentrate on the **core screens** that are essential for the **online campus fundraising system**. These screens will cover the **primary functionalities** for both **users** and **administrators**, ensuring a smooth and intuitive user experience. Below is the list of **core screens** and their detailed descriptions, including the **technology stack** and **components** for each screen.

---

### **Core Screens**

#### **1. Landing Page**
- **Purpose:** Introduce the platform and encourage users to explore campaigns or log in.
- **Technology:** Next.js, Tailwind CSS, Framer Motion.
- **Components:**
  - **Hero Section:**
    - Background image of the campus.
    - Headline: "Support Your Campus, Make a Difference!"
    - Call-to-action buttons: "Explore Campaigns" (primary), "Login/Sign Up" (secondary).
    - Animated using Framer Motion for smooth transitions.
  - **Featured Campaigns:**
    - Showcase 3-4 highlighted campaigns with images, titles, and progress bars.
    - Each card links to the campaign details page.
  - **Footer:**
    - Links to About Us, Contact, Privacy Policy, and Social Media icons.

---

#### **2. Login/Sign Up Page**
- **Purpose:** Allow users to log in or create an account.
- **Technology:** Next.js, Tailwind CSS, React Hook Form, Yup, React Toastify.
- **Components:**
  - **Login Form:**
    - Email and password fields.
    - "Forgot Password?" link.
    - "Login with Google" button (using Next-Auth).
  - **Sign Up Form:**
    - Name, email, password, and confirm password fields.
    - Validation using Yup.
  - **Toggle Button:** Switch between Login and Sign Up forms.
  - **Error Messages:** Displayed using React Toastify for invalid inputs.

---

#### **3. Campaign Browsing Page**
- **Purpose:** Display all active fundraising campaigns.
- **Technology:** Next.js, Tailwind CSS, Axios, Framer Motion.
- **Components:**
  - **Search Bar:**
    - Allows users to search for campaigns by title or category.
  - **Campaign Cards:**
    - Each card displays:
      - Campaign image.
      - Title, description, and goal amount.
      - Progress bar showing the amount raised.
      - "Donate Now" button.
    - Animated hover effects using Framer Motion.
  - **Pagination:** Load more campaigns as the user scrolls.

---

#### **4. Campaign Details Page**
- **Purpose:** Provide detailed information about a specific campaign.
- **Technology:** Next.js, Tailwind CSS, Axios, Framer Motion, WebSocket.
- **Components:**
  - **Campaign Banner:**
    - Large image with the campaign title and progress bar.
  - **Campaign Description:**
    - Detailed description of the campaign.
    - List of goals and how funds will be used.
  - **Donation Section:**
    - "Donate Now" button.
    - Input field for donation amount.
    - Payment options (Stripe integration).
  - **Updates Section:**
    - Real-time updates on the campaign progress (using WebSocket).
  - **Comments Section:**
    - Users can leave comments and see others' comments.

---

#### **5. Donation Payment Page**
- **Purpose:** Process donations securely.
- **Technology:** Next.js, Tailwind CSS, Stripe, React Toastify.
- **Components:**
  - **Donation Form:**
    - Input fields for donation amount, name, and email.
    - Payment details (credit card) using Stripe Elements.
  - **Confirmation:**
    - Display a success message using React Toastify after payment.
    - Redirect to the campaign details page.

---

#### **6. User Dashboard**
- **Purpose:** Allow users to manage their profile and view donation history.
- **Technology:** Next.js, Tailwind CSS, Axios.
- **Components:**
  - **Profile Section:**
    - Display user information (name, email, profile picture).
    - Edit profile button.
  - **Donation History:**
    - List of all donations made by the user.
    - Each entry shows the campaign name, amount, and date.
  - **Saved Campaigns:**
    - List of campaigns the user has saved for later.

---

#### **7. Admin Dashboard**
- **Purpose:** Allow administrators to manage campaigns, donors, and generate reports.
- **Technology:** Next.js, Tailwind CSS, Axios, Chart.js.
- **Components:**
  - **Campaign Management:**
    - List of all campaigns with options to create, edit, or delete.
  - **Donor Management:**
    - List of donors with details (name, email, donation history).
  - **Reports:**
    - Generate reports on fundraising performance using Chart.js.
    - Export reports as PDF or Excel.

---

### **Summary of Core Screens**

| **Screen**               | **Purpose**                                                                 | **Technology**                                                                 |
|--------------------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| **Landing Page**          | Introduce the platform and encourage exploration.                           | Next.js, Tailwind CSS, Framer Motion                                          |
| **Login/Sign Up Page**    | Allow users to log in or create an account.                                 | Next.js, Tailwind CSS, React Hook Form, Yup, React Toastify                   |
| **Campaign Browsing Page**| Display all active fundraising campaigns.                                   | Next.js, Tailwind CSS, Axios, Framer Motion                                   |
| **Campaign Details Page** | Provide detailed information about a specific campaign.                     | Next.js, Tailwind CSS, Axios, Framer Motion, WebSocket                       |
| **Donation Payment Page** | Process donations securely.                                                | Next.js, Tailwind CSS, Stripe, React Toastify                                 |
| **User Dashboard**        | Allow users to manage their profile and view donation history.              | Next.js, Tailwind CSS, Axios                                                  |
| **Admin Dashboard**       | Allow administrators to manage campaigns, donors, and generate reports.     | Next.js, Tailwind CSS, Axios, Chart.js                                        |

---

### **Conclusion**

These **core screens** cover the **essential functionalities** of the **online campus fundraising system**, ensuring a **seamless and engaging experience** for both **users** and **administrators**. Each screen is designed with **specific components** and **technologies** to provide a **modern, scalable, and user-friendly** platform. By focusing on these core screens, the mockup ensures that the **primary features** of the system are well-represented and ready for development.