# Ocean SIH Frontend

An integrated platform for ocean hazard reporting that empowers citizens, analysts, and authorities with real-time crowdsourced hazard reports and social media insights for safer coasts. This project was developed as part of Smart India Hackathon (SIH).

## Overview

The Ocean Hazard Reporting Platform bridges the gap between early warning models and real-time ground reports. It helps authorities, analysts, and citizens work together to mitigate risks from tsunamis, storm surges, high waves, and coastal flooding. The platform is supported by the Indian National Centre for Ocean Information Services (INCOIS).

## Features

### Crowdsourced Reporting
- Citizens and coastal residents can submit real-time hazard reports
- Support for geotagged reports with photos, videos, and audio evidence
- Real-time submission and tracking of hazard incidents

### Role-Based Dashboards
- **Admin Dashboard**: Manage users, view reports, and analyze comprehensive hazard data
- **Analyst Dashboard**: Access hazard reports, social media trends, and map-based analytics
- **Public Access**: Home page with platform overview and quick access to reporting features

### Data Visualization
- Interactive charts and graphs using Recharts
- ML model output visualizations by calamity type
- INCOIS prediction data visualization (wave heights, current speeds)
- Confidence distribution charts
- Scatter plots for relationship analysis

### Social Media Analytics
- Monitor Twitter, YouTube, and other social platforms
- Natural Language Processing (NLP) for hazard detection
- Sentiment analysis and trend detection

### Security
- Private route protection for role-based access
- Authentication system with login and signup functionality
- Secure API integration

## Technology Stack

- **Frontend Framework**: React 19.1.1
- **Routing**: React Router DOM 7.9.1
- **Styling**: Tailwind CSS 3.4.17
- **Data Visualization**: Recharts 3.2.1
- **HTTP Client**: Axios 1.12.2
- **Build Tool**: Create React App (React Scripts 5.0.1)

## Project Structure

```
ocean-sih-frontend/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── GraphDashboard.jsx
│   │   ├── PrivateRoute.js
│   │   └── ReportsCard.js
│   ├── pages/
│   │   ├── AdminDashboard.js
│   │   ├── AnalystDashboard.js
│   │   ├── Home.js
│   │   ├── Login.js
│   │   └── Signup.js
│   ├── api.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── speechToText.js
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Prerequisites

Before running this application, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn
- Backend API server running on `http://localhost:5000`

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Tanny2709/ocean-sih-frontend.git
cd ocean-sih-frontend
```

2. Install dependencies:
```bash
npm install
```

## Configuration

The application expects a backend API server running on `http://localhost:5000`. Update the API base URL in `src/api.js` if your backend is running on a different port or host.

## Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload automatically when you make changes.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run eject`
**Note: This is a one-way operation. Once you eject, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can eject at any time. This command will remove the single build dependency from your project.

## API Integration

The frontend integrates with the following API endpoints:

- `/api/reports` - Fetch hazard reports
- `/api/ml-model-outputs` - Fetch ML model predictions
- `/api/incois-prediction` - Fetch INCOIS prediction data

Make sure your backend API server is running and these endpoints are accessible before using the application.

## Routes

- `/` - Home page with platform overview
- `/login` - User login page
- `/signup` - User registration page
- `/admin-dashboard` - Admin dashboard (protected route)
- `/analyst-dashboard` - Analyst dashboard (protected route)

## Role-Based Access

The application implements role-based access control:

- **Admin**: Full access to admin dashboard with user management capabilities
- **Analyst**: Access to analyst dashboard with reporting and analytics features
- **Public**: Access to home page and authentication pages

Protected routes are handled by the `PrivateRoute` component which verifies user roles before granting access.

## Contributing

This project was developed for Smart India Hackathon. For contributions, please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Acknowledgments

- Indian National Centre for Ocean Information Services (INCOIS)
- Smart India Hackathon organizers
- React and open-source community

## Support

For issues, questions, or contributions, please contact the development team or open an issue in the repository.
