# **GG-EZ - Esports Event Tracker (Frontend)**

Welcome to the GG-EZ frontend! This is the user interface for the **GG-EZ Esports Event Tracker**, which interacts with the backend API to provide users with detailed esports event, match, and team information.

[View live project here!](https://gg-ez-750b5184ca87.herokuapp.com/)

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
| Event List Display                 | Events display correctly on homepage.       | Pass          | ✅      |
| Match List Display                 | Matches display with filters applied.       | Pass          | ✅      |
| Event Details Page                 | Event details render accurately.            | Pass          | ✅      |
| Match Details Page                 | Match teams, status, and time are displayed.| Pass          | ✅      |
| Search Events and Matches          | Search results are accurate.                | Pass          | ✅      |
| Filter Events by Date              | Filters events correctly within the range.  | Pass          | ✅      |
| Filter Matches by Status           | Filters matches by status (e.g., Upcoming). | Pass          | ✅      |
| Admin Panel CRUD Operations        | Create, Edit, and Delete works flawlessly.  | Pass          | ✅      |
| Reload After Login                 | User remains logged in after reloading.     | Pass          | ✅      |
| Mobile Responsiveness              | Layout adjusts correctly on mobile devices. | Pass          | ✅      |

---

## **Deployment**

### **Steps to Deploy**

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Heroku:
   ```bash
   heroku login
   heroku create
   git push heroku main
   ```

3. Set up environment variables:
   ```bash
   heroku config:set REACT_APP_API_URL=https://your-api-url.com/
   ```

---

## **UX Design**

### **Wireframes**
- ![Home Page](/media/homepage.png)  
- ![Event Page](/media/events-page.png)  
- ![Admin Panel Page](/media/admin-panel-page.png)  
- ![Manage Players Page](/media/manage-players.png) 

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
- **Pages**:
  - `HomePage.js`: Main landing page.
  - `EventsPage.js`: Displays event listings.
  - `MatchesPage.js`: Displays matches with filters.
  - `EventDetailPage.js`: Event details.
  - `MatchDetailPage.js`: Match details.
- **Admin Components**:
  - `TeamsAdmin`, `MatchesAdmin`, `EventsAdmin`: Manage content for staff users.

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