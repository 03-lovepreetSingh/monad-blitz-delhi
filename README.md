# LearnFast API

The LearnFast API is a backend service designed to help users create and manage personalized learning schedules from YouTube playlists. It allows users to generate schedules based on either the number of hours they want to study per day or a target number of days to complete the playlist.

## Features

-   **Dynamic Schedule Generation:** Create learning schedules from any public YouTube playlist.
-   **Two Scheduling Strategies:**
    -   **Time-Based:** Specify the number of hours to study each day.
    -   **Day-Based:** Specify the total number of days to complete the playlist.
-   **Progress Tracking:** Mark videos as complete and track your progress.
-   **Schedule Adjustment:** Adjust your daily study hours for an existing schedule.
-   **User-Specific Schedules:** Manages schedules on a per-user basis.
-   **RESTful API:** A clear and easy-to-use API for all functionalities.

## Getting Started

Follow these instructions to get the LearnFast API server running on your local machine for development and testing purposes.

### Prerequisites

-   Python 3.8+
-   Pip (Python package installer)
-   MongoDB account and a database
-   Google API Key with YouTube Data API v3 enabled

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd learnfast-backend
    ```

2.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

### Configuration

1.  Create a `.env` file in the root directory of the project.
2.  Add the following environment variables to the `.env` file:

    ```env
    MONGODB_URI="your_mongodb_connection_string"
    DB_NAME="your_database_name"
    GOOGLE_API_KEY="your_google_api_key"
    ```

    -   `MONGODB_URI`: Your connection string for the MongoDB database.
    -   `DB_NAME`: The name of the database to use.
    -   `GOOGLE_API_KEY`: Your API key from the Google Cloud Platform console.

### Running the Server

Start the Flask development server with the following command:

```bash
python app.py
```

The server will start on `http://127.0.0.1:5000`.

## API Endpoints

Here is a summary of the available API endpoints.

| Method | Endpoint                                       | Description                                      |
| :----- | :--------------------------------------------- | :----------------------------------------------- |
| `POST` | `/api/schedule`                                | Creates a new learning schedule.                 |
| `GET` | `/api/schedules/<user_id>`                     | Retrieves all schedules for a specific user.     |
| `GET` | `/api/schedules/detail/<schedule_id>`          | Retrieves the detailed information for a schedule. |
| `PUT` | `/api/schedules/<schedule_id>/progress`        | Updates the completion status of a video.        |
| `POST` | `/api/schedules/<schedule_id>/adjust`          | Adjusts the daily hours for a schedule.          |
| `DELETE` | `/api/schedules/<schedule_id>`                 | Deletes a schedule.                              |
| `GET` | `/api/health`                                  | Checks the health of the API and its services.   |

### Create Schedule (`POST /api/schedule`)

**Request Body (Time-Based):**

```json
{
  "userId": "your_user_id",
  "playlistUrl": "youtube_playlist_url",
  "scheduleType": "daily",
  "dailyHours": 1.5,
  "title": "My Daily Learning Schedule"
}
```

**Request Body (Day-Based):**

```json
{
  "userId": "your_user_id",
  "playlistUrl": "youtube_playlist_url",
  "scheduleType": "day-based",
  "targetDays": 10,
  "title": "My 10-Day Learning Plan"
}
```

## Postman Collections

To help with testing, two Postman collection files are included in the `postman/` directory:

-   [`create_schedule.json`](postman/create_schedule.json): For creating a `daily` (time-based) schedule.
-   [`create_schedule_day_based.json`](postman/create_schedule_day_based.json): For creating a `day-based` schedule.

You can import these files into Postman. Remember to set up a `base_url` environment variable in Postman pointing to your running server (e.g., `http://127.0.0.1:5000`).

## Technologies Used

-   **Flask:** A lightweight WSGI web application framework in Python.
-   **MongoDB:** A NoSQL database for storing schedule data.
-   **Pymongo:** The official Python driver for MongoDB.
-   **Google API Python Client:** To interact with the YouTube Data API.
-   **python-dotenv:** For managing environment variables.
