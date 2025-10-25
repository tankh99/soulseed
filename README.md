# Soulseed Mobile Application

## 🌟 Project Overview

**Soulseed** is a mental wellness and journaling mobile application designed to foster self-discovery and consistent reflection through **gamification**. Users cultivate a digital "soulseed," a visual manifestation of their personality and emotional well-being, which evolves based on their journaling habits and engagement with in-app quests.

The core flow involves a personality assessment, daily check-ins, **LLM-powered emotional unpacking**, and a visible evolution loop that ties user action directly to visual feedback.

## ✨ Features

### Core User Flow & Onboarding

  * **Personality Assessment:** Shortened 15-question **OCEAN personality test** on first launch.
  * **Soulseed Generation:** Visual generation of the user's Soulseed based on their initial OCEAN trait scores.
  * **BetterAuth Integration:** Seamless user registration and authentication handled by **BetterAuth**.
  * **Localized Onboarding:** Collection of personal details, including an education field tailored to the **Singaporean education system** (Primary, Secondary, JC/Poly/ITE).

### Daily Engagement & Wellness

  * **Daily Check-In:** Allows users to select a mood and write a journal entry.
  * **LLM Unpacking:** An "Unpack It" feature that sends the journal entry to an integrated **LLM** for real-time clarifying questions to deepen self-understanding.
  * **Journaling Streak:** A Duolingo-style streak counter and a visual meter to track consecutive days of check-ins.
  * **Quests/Tasks:** Daily tasks sourced from the backend, rewarding users with points that contribute to the Soulseed's growth.

### Gamification & Growth

  * **Soulseed Evolution:** The Soulseed visually transforms (with sparkles and aura animations) based on accumulated points and evolving personality traits.
  * **Collectibles:** Earning a weekly **Collectible Fruit** after achieving a 7-day journaling streak.

### Self-Discovery & Reflection

  * **Weekly Summary:** Provides users with a summary of their journal entries and a mood trend analysis from the past seven days.
  * **Trait Education:** Dedicated section explaining the five OCEAN traits, promoting **self-acceptance** and uniqueness.
  * **Growth Strategies:** Content providing evidence-based **coping strategies** and actionable steps to grow specific personality traits (e.g., Openness, Conscientiousness).

## 🛠️ Technical Stack

| Component | Technology/Framework | Notes |
| :--- | :--- | :--- |
| **Mobile App** | **Expo (React Native)** | Targets iOS and Android; utilizes Expo SDK for rapid development. |
| **Authentication** | **BetterAuth** | Handles all user sign-up, login, and session management. |
| **Frontend UI/UX** | React Native components | Must adhere to provided wireframes and include custom animations (for Soulseed, streak meter, evolution effects). |
| **Backend API** | *External API Required* | Handles user data, journal storage, quest retrieval, and LLM communication. |
| **AI/LLM** | *Integrated LLM* | Used for real-time "Unpack It" feature (frontend) and journal entry analysis (backend). |

## 🚀 Getting Started (Frontend)

These instructions will get you a copy of the project up and running on your local machine for development and testing.

### Prerequisites

You need to have **Node.js**, **npm/yarn**, and **Expo CLI** installed.

```bash
# Install Expo CLI globally
npm install -g expo-cli
```

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/tankh99/soulseed.git
    cd soulseed
    ```

2.  **Install dependencies:**

    ```bash
    yarn install
    # OR
    npm install
    ```

3.  **Start the Expo Development Server:**

    ```bash
    npx expo start
    ```

4.  Scan the QR code with the **Expo Go** app on your phone, or press `i` for iOS Simulator / `a` for Android Emulator.

### Configuration

You will need to configure environment variables for the following external services. Create a file named `.env` in the root directory:

```
# BetterAuth API Key
BETTERAUTH_API_KEY="[Your BetterAuth Key]"

# Backend API Endpoints (for Journaling, Quests, Soulseed Data)
API_BASE_URL="[Your Backend Base URL]"

# Frontend LLM Key (for Unpack It feature)
LLM_API_KEY="[Your LLM Key]"
```

## ⚠️ Clarifications & Development Notes

  * **Wireframes:** Refer to the uploaded wireframes (iPhone 16.png, Evolution.png, etc.) for visual design and screen flow. The **Soulseed view** and **Evolution animation** are high-priority visual tasks.
  * **Backend Dependency:** The frontend requires robust API endpoints for:
      * Submitting the 15-question OCEAN test results.
      * Retrieving daily quests and updating quest status.
      * Sending and retrieving journal entries.
      * Retrieving weekly summaries and trend data.
  * **Singapore Context:** Ensure the school year dropdown logic accurately maps to the Singaporean education system.
