# Mood-Based Music Recommender

A modern web application that recommends music based on your mood, built with Angular and YouTube API.

## Features

- Mood-based music recommendations
- YouTube video playback
- Playlist management
- Dark/Light theme
- Responsive design
- Music search functionality

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI (v19 or higher)
- YouTube Data API Key

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mood-music.git
cd mood-music
```

2. Install dependencies:
```bash
npm install
```

3. Create a YouTube Developer account and get an API key from the Google Cloud Console.

4. Create a `.env` file in the root directory and add your YouTube API key:
```
YOUTUBE_API_KEY=your_api_key_here
```

5. Start the development server:
```bash
ng serve
```

6. Open your browser and navigate to `http://localhost:4200`

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── mood-selector/
│   │   ├── music-player/
│   │   ├── playlist/
│   │   └── search/
│   ├── services/
│   │   └── youtube.service.ts
│   ├── store/
│   │   └── music/
│   │       ├── music.actions.ts
│   │       ├── music.effects.ts
│   │       ├── music.reducer.ts
│   │       └── music.state.ts
│   ├── app.component.ts
│   └── app.config.ts
└── environments/
    └── environment.ts
```

## Technologies Used

- Angular
- NgRx (State Management)
- YouTube Data API
- Angular Material
- RxJS

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- YouTube for providing the API
- Angular team for the amazing framework
- All contributors who have helped shape this project