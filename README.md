# VITAR - Web-based Campus Navigator with WebAR

A modern, full-stack campus navigation application that combines WebAR technology with a fallback 3D map interface for seamless wayfinding across campus.

## Features

### Core Navigation
- **WebAR Navigation**: Real-time AR overlays showing directions, building names, and waypoints
- **3D Fallback Map**: Interactive 2D canvas-based map for devices without AR support
- **GPS-based Positioning**: Accurate location tracking with real-time updates
- **Route Calculation**: Automatic route generation between buildings with waypoint visualization

### AI-Powered Assistance
- **Campus Chatbot**: AI assistant for answering questions about buildings, routes, and campus facilities
- **Context-Aware Responses**: Chatbot understands campus-specific queries and provides helpful guidance

### Developer Tools
- **Route Scanner**: GPS-based tool to trace and record campus routes
- **Waypoint Capture**: Manual waypoint creation at specific locations
- **Building Manager**: Create and manage campus buildings with amenities and categories

### Technical Features
- **Device Capability Detection**: Automatic detection of AR support (WebXR, ARCore, ARKit)
- **Permission Management**: Comprehensive permission flow for camera, location, and device orientation
- **Firestore Integration**: Cloud-based data storage for buildings, routes, and waypoints
- **Real-time Updates**: Live location tracking and route updates

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase project with Firestore enabled
- OpenAI API key for chatbot functionality

### Environment Variables

Create a `.env.local` file with:

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
OPENAI_API_KEY=your_openai_key
\`\`\`

### Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit `http://localhost:3000` to start using VITAR.

## Project Structure

\`\`\`
app/
├── page.tsx                 # Landing page
├── navigator/
│   └── page.tsx            # Main navigation interface
├── developer/
│   └── page.tsx            # Developer tools hub
└── api/
    ├── chat/route.ts       # Chatbot API
    ├── buildings/route.ts  # Buildings API
    ├── routes/route.ts     # Routes API
    └── waypoints/route.ts  # Waypoints API

components/
├── camera-permission-flow.tsx  # Permission request UI
├── webxr-scene.tsx            # WebAR scene component
├── campus-map.tsx             # 2D map interface
├── campus-chatbot.tsx         # Chat widget
├── route-scanner.tsx          # Route scanning tool
├── waypoint-capture.tsx       # Waypoint capture tool
└── building-manager.tsx       # Building management tool

lib/
├── firebase.ts            # Firebase configuration
├── types.ts              # TypeScript type definitions
├── ar-utils.ts           # AR utility functions
├── camera-utils.ts       # Camera and device utilities
└── firestore-service.ts  # Firestore database service
\`\`\`

## Usage

### For Users

1. **Start Navigation**: Click "Start Navigation" on the home page
2. **Grant Permissions**: Allow camera, location, and device orientation access
3. **Navigate**: Use AR overlays or 3D map to navigate campus
4. **Ask Questions**: Use the chatbot for campus information

### For Developers

1. **Access Developer Tools**: Click "Developer Tools" on the home page
2. **Scan Routes**: Use the route scanner to trace campus paths
3. **Capture Waypoints**: Mark important locations with waypoints
4. **Manage Buildings**: Create and organize campus buildings
5. **Export Data**: Download route and building data as JSON

## API Endpoints

### Buildings
- `GET /api/buildings` - Fetch all buildings
- `GET /api/buildings?category=academic` - Fetch buildings by category
- `POST /api/buildings` - Create a new building

### Routes
- `GET /api/routes` - Fetch all routes
- `GET /api/routes?start=id&end=id` - Fetch route between buildings
- `POST /api/routes` - Create a new route

### Waypoints
- `GET /api/waypoints` - Fetch all waypoints
- `GET /api/waypoints?buildingId=id` - Fetch waypoints for a building
- `POST /api/waypoints` - Create a new waypoint

### Chat
- `POST /api/chat` - Send message to campus chatbot

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+ (iOS 15+)
- Samsung Internet 14+

## Deployment

Deploy to Vercel:

\`\`\`bash
vercel deploy
\`\`\`

## License

MIT

## Support

For issues or questions, please open an issue on GitHub or contact the development team.
