# **GG-EZ - Esports Event Tracker (Frontend)**

Welcome to the GG-EZ frontend! This is the user interface for the **GG-EZ Esports Event Tracker**, which interacts with the backend API to provide users with detailed esports event, match, and team information.

[View live project here!](https://gg-ez-750b5184ca87.herokuapp.com/)

---

## **Table of Contents**

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Testing](#testing)
- [Deployment](#deployment)
- [UX Design](#ux-design)
- [Agile Development](#agile-development)
- [Code Structure](#code-structure)
- [Credits](#credits)
- [Contributing](#contributing)
- [Security Notes](#security-notes)

---

## **Note for Testing and Assessment**  
- Most **CRUD features** are implemented in the **Admin Panel**.  
- During registration, users can select between:
  - **Default User**: Standard user access.
  - **Staff User**: Custom role with access to the **Admin Panel** for editing website data.  
- The **Staff User role** is separate from Django's admin panel, which is reserved for developers.

---

## **Project Overview**

GG-EZ is a responsive, interactive platform for tracking esports events, teams, and matches. Built using **React** and integrated with a **Django REST API**, the app allows users to explore events, matches, and teams while providing administrators with tools to manage data seamlessly.

---

## **Features**

### **Implemented Features**

#### **Event and Match Listings**
- Displays a list of **upcoming events** and matches with filtering options.
- Grid-based responsive design ensures optimal display on all devices.

#### **Detailed Event and Match Views**
- **Event Details**:
  - Shows participating teams, descriptions, and event duration.
- **Match Details**:
  - Displays teams, event association, match status, and scheduled time.

#### **Filters and Search**
- Search events and matches by **name**.  
- Filter matches by **status** (Upcoming, In Progress, Completed).  
- Filter events and matches by **date range**.

#### **Custom Admin Panel**
- Accessible to **Staff Users** for managing content.  
- CRUD Operations for:
  - Events  
  - Matches  
  - Teams  
  - Players  

#### **Responsive Design**
- Fully responsive layout that adjusts to mobile, tablet, and desktop devices.

---

### **Features to be Added**
1. **User Authentication**:
   - Personalized dashboards for favorite events and matches.

2. **Real-Time Match Updates**:
   - Integrate WebSocket for live updates.

3. **Pagination and Infinite Scroll**:
   - Handle large datasets efficiently.

4. **User Profiles**:
   - Save and manage favorite events, matches, and teams.

---

## **Technologies Used**

### **Core Tools**
- **React**: Component-based UI framework.  
- **React Router**: For navigation and routing.  
- **Axios**: For API calls.  
- **Bootstrap**: Responsive components and grid system.  
- **Font Awesome**: For scalable icons.

### **Additional Tools**
- **Heroku**: For deployment.  
- **Cloudinary**: Media and image management.  

---

## **Setup Instructions**

### **1. Prerequisites**
Ensure you have the following installed:
- Node.js and npm
- Git

### **2. Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/gg-ez-frontend.git
   cd gg-ez-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```plaintext
   REACT_APP_API_URL=https://gg-ez-api-ce7093aa17cf.herokuapp.com/
   ```

4. Run the development server:
   ```bash
   npm start
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

---

## **Testing**

### **Manual Testing Results**

| Test Case                          | Expected Result                              | Actual Result | Status |
|------------------------------------|---------------------------------------------|---------------|--------|
| **Event List Display**             | Events display correctly on homepage.       | Pass          | ✅      |
| **Match List Display**             | Matches display with filters applied.       | Pass          | ✅      |
| **Event Details Page**             | Event details render accurately.            | Pass          | ✅      |
| **Match Details Page**             | Match teams, status, and time are displayed.| Pass          | ✅      |
| **Search Events and Matches**      | Search results are accurate.                | Pass          | ✅      |
| **Filter Events by Date**         | Filters events correctly within the range.  | Pass          | ✅      |
| **Filter Matches by Status**      | Filters matches by status (e.g., Upcoming). | Pass          | ✅      |
| **Admin Panel CRUD Operations**    | Create, Edit, and Delete works flawlessly.  | Pass          | ✅      |
| **Reload After Login**             | User remains logged in after reloading.     | Pass          | ✅      |
| **Mobile Responsiveness**          | Layout adjusts correctly on mobile devices. | Pass          | ✅      |
| **Registration Form - Username**   | Username must be between 3-30 characters.   | Pass          | ✅      |
| **Registration Form - Email**      | Ensure valid email format (e.g., user@example.com). | Pass     | ✅      |
| **Registration Form - Password**   | Password must meet strength requirements: min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character. | Pass | ✅ |
| **Registration Form - Password Confirmation** | Password confirmation must match the password. | Pass  | ✅ |
| **Error Messages - Username**      | Display error if username is less than 3 characters or more than 30. | Pass | ✅ |
| **Error Messages - Email**         | Display error for invalid email format or empty email. | Pass  | ✅ |
| **Error Messages - Password**      | Display error for weak password or empty password. | Pass      | ✅ |
| **Error Messages - Password Confirmation** | Display error if passwords do not match. | Pass | ✅ |

---

### **Test Details for the Registration Form**

- **Username**:
  - **Validation**: The username must be between 3-30 characters.
  - **Error Message**: 
    - "Username must be at least 3 characters long."
    - "Username cannot exceed 30 characters."
    - "Username cannot be empty."
  
- **Email**:
  - **Validation**: Ensure a valid email is entered (e.g., user@example.com).
  - **Error Message**: 
    - "The email address you entered is not valid."
    - "Email cannot be empty."

- **Password**:
  - **Validation**: Ensure the password contains:
    - At least 8 characters.
    - At least one uppercase letter.
    - At least one lowercase letter.
    - At least one number.
    - At least one special character.
  - **Error Message**:
    - "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."

- **Password Confirmation**:
  - **Validation**: Ensure the password confirmation field matches the password.
  - **Error Message**: "Passwords do not match."

---

## **Frontend Deployment**

The GG-EZ frontend is deployed on **Heroku**. Below is a step-by-step guide for deploying the project to Heroku using both the CLI and the Heroku website.

---

### **1. Prerequisites**

Before deploying, ensure you have the following:

- A **Heroku account** ([Sign up here](https://signup.heroku.com/)).
- **Git** installed on your machine.
- **Heroku CLI** installed ([Download here](https://devcenter.heroku.com/articles/heroku-cli)).
- **Node.js** version **14.x** or later and **npm** version **7.x** or later installed ([Download Node.js here](https://nodejs.org/)).

---

### **2. Set Environment Variables**

You will need to configure the following environment variables for deployment:

| Variable Name       | Description                                        | Example Value                                      |
|---------------------|----------------------------------------------------|----------------------------------------------------|
| `REACT_APP_API_URL`  | The URL of your backend API                        | `https://your-api-url.herokuapp.com/`              |

#### **Example `.env` File for Local Development**

To run the project locally, create a `.env` file in the root directory and add:

```plaintext
REACT_APP_API_URL=https://your-api-url.herokuapp.com/
```

---

### **3. Deployment Steps on Heroku (CLI)**

1. **Log in to Heroku**:
   ```bash
   heroku login
   ```

2. **Create a Heroku App**:
   ```bash
   heroku create your-app-name
   ```

3. **Add Buildpacks**:
   Ensure Heroku knows how to build the app by setting the Node.js buildpack:
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

4. **Install Dependencies**:
   Ensure all dependencies are installed:
   ```bash
   npm install
   ```

5. **Push the Code to Heroku**:
   Make sure all changes are committed, then push the code to Heroku:
   ```bash
   git add .
   git commit -m "Deploy frontend to Heroku"
   git push heroku main
   ```

6. **Set Environment Variables on Heroku**:
   - Go to the Heroku dashboard.
   - Select your app and navigate to **Settings > Config Vars**.
   - Add the environment variables listed above:
     ```bash
     heroku config:set REACT_APP_API_URL=https://your-api-url.com/
     ```

7. **Build the Project**:
   Build the project for production:
   ```bash
   npm run build
   ```

8. **Deploy the App**:
   Ensure your app is deployed and running:
   ```bash
   git push heroku main
   ```

---

### **4. Deployment via Heroku Website (Optional)**

If you prefer deploying the project through the Heroku website, follow these steps:

1. **Log in to Heroku**:
   - Visit [Heroku](https://www.heroku.com/) and log in to your account.

2. **Create a New App**:
   - Navigate to the **Dashboard** and click **New > Create New App**.
   - Enter a name for your app (e.g., `gg-ez-frontend`) and choose your region.

3. **Connect Your GitHub Repository**:
   - Go to the **Deploy** tab in your app settings.
   - Under **Deployment Method**, select **GitHub**.
   - Search for your repository and connect it.

4. **Enable Automatic Deploys (Optional)**:
   - Once your repository is connected, you can enable **Automatic Deploys** from the main branch to streamline future updates.

5. **Manually Deploy the App**:
   - Scroll down to the **Manual Deploy** section and click **Deploy Branch** to deploy your app.

6. **Set Environment Variables**:
   - Go to the **Settings** tab and click **Reveal Config Vars**.
   - Add all required variables (e.g., `REACT_APP_API_URL`).

---

### **5. Testing the Deployment**

- Access your app using the Heroku URL:
  ```
  https://your-app-name.herokuapp.com
  ```
- Verify the following:
  - The frontend loads correctly and interacts with the backend.
  - The event, match, and team data are correctly displayed.
  - The admin panel functions for CRUD operations if applicable.
  - The UI is responsive and works across different screen sizes.

---

### **Common Pitfalls & Troubleshooting**

- **Heroku Build Failures**: If you encounter build failures, ensure all dependencies are correctly listed in `package.json` and that your `build` script is configured in `package.json`.
  - Example `scripts` section:
    ```json
    "scripts": {
      "start": "react-scripts start",
      "build": "react-scripts build",
      "test": "react-scripts test",
      "eject": "react-scripts eject"
    }
    ```

- **Missing Environment Variables**: Ensure all necessary environment variables (like `REACT_APP_API_URL`) are set correctly. You can check for missing variables with:
  ```bash
  heroku config
  ```

---

## **UX Design**

### **Wireframes**
![Home Page](/media/homepage.png)  
![Event Page](/media/events-page.png)  
![Admin Panel Page](/media/admin-panel-page.png)  
![Manage Players Page](/media/manage-players.png) 

**Design Decisions**:
- Clean navigation and grid-based design for clarity.  
- Accessibility features: Semantic HTML and focus management.  
- Mobile-first design for seamless cross-device use.

---

## **Agile Development**

This project followed Agile methodology with task tracking on GitHub Projects:  
[View GitHub Project Board](https://github.com/users/Dimmanzo/projects/4).

- Development occurred in **sprints**, with user stories mapped to deliverables.  
- Version control through **Git** with meaningful commit messages.

---

## **Code Structure**

### **Main Components**

- **`App.js`**: Main app structure and routing.
- **`contexts/CurrentUserContext.js`**: Context for managing user state.

### **Reusable Components**
- **`CustomToast.js`**: A reusable component for displaying toast notifications. This component can be reused across various pages where notifications are needed.
- **`Footer.js`**: The footer component, which contains links and information to be displayed at the bottom of the app.
- **`NavBar.js`**: The navigation bar component that provides links to different pages and handles user interaction with the app.
- **`AdminPanel.js`**: Admin panel where staff users can manage content, including CRUD operations for events, matches, teams, and players.

### **Pages**:
- **`HomePage.js`**: Main landing page.
- **`EventsPage.js`**: Displays event listings.
- **`MatchesPage.js`**: Displays matches with filters.
- **`EventDetailPage.js`**: Event details.
- **`MatchDetailPage.js`**: Match details.

### **Admin Components**:
- **`TeamsAdmin.js`**: Manage team content for staff users.
- **`MatchesAdmin.js`**: Manage match content for staff users.
- **`EventsAdmin.js`**: Manage event content for staff users.

---

## **Credits**

- **React** for UI development.  
- **Bootstrap** for responsive design.  
- **Heroku** for hosting.  
- **Cloudinary** for image management.  
- **Font Awesome** for icons.

---

## **Contributing**

We welcome contributions to GG-EZ! Follow these steps:  

1. Fork the repository.  
2. Create a feature branch:  
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit:  
   ```bash
   git commit -m "Add feature description"
   ```
4. Push the changes and open a pull request.

---

## **Security Notes**
- **API URLs** are managed securely via environment variables (`.env`).  
- Ensure that `.env` files are excluded from version control using `.gitignore`.