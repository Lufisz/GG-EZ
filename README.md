# GG-EZ - Esports Event Tracker (Frontend)

Welcome to the GG-EZ frontend! This is the user interface for the GG-EZ esports event tracker. It interacts with the backend API to display all the latest esports events, matches, and teams. 

[View live project here!](#)

---

## **Project Overview**

GG-EZ is a platform for tracking esports events, teams, and matches. The frontend is built using **React** and connects to a **Django REST API** for managing events, teams, and players. The app is designed to be responsive, offering a smooth user experience across both desktop and mobile devices.

---

## **Table of Contents**

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Credits](#credits)

---

## **Features**

### **Existing Features**
- Display a list of upcoming events.
- View event details, including teams and match schedules.
- Mobile-friendly design to access the site on any device.

### **Features to be Added**
- User authentication to manage event preferences.
- Improved filtering options for matches and teams.
- User profiles to save favorite events and teams.

---

## **Technologies Used**

- **React**: For building the user interface.
- **Axios**: For making API requests.
- **Bootstrap**: For responsive and stylish components.
- **React Router**: For routing between pages.
- **Font Awesome**: For icons.

---

## **Setup Instructions**

### **Installing Dependencies**

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/your-username/gg-ez-frontend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd gg-ez-frontend
   ```

3. Install the necessary dependencies:

   ```bash
   npm install
   ```

### **Running the Development Server**

After installing the dependencies, you can start the development server:

```bash
npm start
```

This will open the app in your browser. By default, it runs at `http://localhost:3000`.

---

## **Testing**

- For now, testing is minimal, but I aim to add **unit tests** and **integration tests** using **Jest** and **React Testing Library** in the future.

---

## **Deployment**

This project is deployed on **Heroku** and connected to the live backend API.

To deploy your own version of this app, follow the instructions:

1. Set up a new **Heroku** app.
2. Link this repository to your Heroku app.
3. Set up the necessary environment variables.
4. Push the changes to Heroku.

---

## **Contributing**

We are always open to contributions! If you have ideas, fixes, or improvements, feel free to open an issue or submit a pull request.

### **How to contribute:**
- Fork the repository.
- Create a new branch (`git checkout -b feature-name`).
- Make your changes.
- Commit your changes (`git commit -am 'Add new feature'`).
- Push to the branch (`git push origin feature-name`).
- Create a new pull request.

---

## **Credits**

- **React** team for creating the powerful front-end library.
- **Axios** for simplifying HTTP requests.
- **Heroku** for hosting the app.
- **Bootstrap** for the beautiful, responsive layout.
- **Cloudinary** for media management.

---