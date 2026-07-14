# Gaurav Space

Gaurav Space is an interactive 3D portfolio designed as a virtual environment where visitors can learn more about me, my projects, technical skills, and coding journey through exploration instead of traditional web pages.

The portfolio uses a space-themed environment built with 3D models and GLB assets. Visitors can navigate through the scene and interact with different objects and locations, each representing  something about me.

## Features

- Interactive 3D environment built using custom GLB models
- Space-themed navigation experience with a spaceship
- Interactive sections for projects, skills, experience, and contact information
- Real-time coding profile dashboard that combines data from multiple platforms
- Custom API integrations to fetch and display coding statistics
- Responsive design for desktop and mobile devices

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS

**3D**
- Three.js
- React Three Fiber
- Drei
- GLB / GLTF Models

**Animation**
- GSAP
- Framer Motion

**Deployment**
- Vercel


# Portfolio Backend

The backend powers the portfolio by fetching, processing, and serving data used across the application. It integrates with multiple external services, caches responses to reduce repeated requests, and provides a single interface for the frontend.

## Features

- Fetches coding profile data from multiple platforms
- Aggregates data into a unified response for the frontend
- Caches API responses to improve performance and reduce rate-limit issues
- Handles error responses and fallback scenarios
- Configured with security and logging middleware

## Tech Stack

- Node.js
- Express
- Axios
- GraphQL Request
- Node Cache
- dotenv
- CORS
- Helmet
- Morgan


## Coding Profile Integration

The portfolio collects and displays coding data from multiple platforms in a single place.

Supported platforms include:

- LeetCode
- GeeksforGeeks
- CodeChef
- GitHub

Allowing visitors to view my coding activity and problem-solving progress without visiting each platform individually.
