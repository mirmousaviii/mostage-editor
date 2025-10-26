# Google Analytics Setup

## Setting up Google Analytics 4

To enable analytics in your project, follow these steps:

### 1. Create Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new account
3. Create a new Property for your website
4. Copy the Measurement ID (format: `G-XXXXXXXXXX`)

### 2. Environment Variable Setup

#### For Local Development:

Create `.env.local` file in the project root:

```bash
# Google Analytics 4 Measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### For GitHub Pages/Production:

1. Go to your repository **Settings**
2. Navigate to **Secrets and variables** → **Actions**
3. Add new repository secret:
   - **Name**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value**: Your actual GA4 Measurement ID

#### For GitHub Pages Environment Variables:

1. Go to **Pages** settings
2. Add environment variable:
   - **Name**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value**: Your actual GA4 Measurement ID

### 3. Tracked Events

The analytics system tracks the following events:

- **Site visits**: Automatic
- **Theme changes**: `theme_change` (dark/light)
- **File export**: `export` (with format)
- **File import**: `import` (with format)
- **About modal view**: `about_view`
- **AI usage**: `ai_usage` (generate_content/insert_content)
- **Presentation Settings tabs**: `presentation_tab` (general/header-footer/background/plugins)
- **Fullscreen toggle**: `fullscreen_toggle` (on/off)
- **Authentication modal open**: `auth_modal_open` (login/signup)
- **Authentication attempt**: `auth_attempt` (login/signup)
- **Authentication error**: `auth_error` (login_error/signup_error)
- **Authentication mode switch**: `auth_mode_switch` (login/signup)

### 4. Testing Analytics

1. Run the project: `npm run dev`
2. Go to Google Analytics
3. Check Real-time > Events to see events

### 5. Important Notes

- Analytics only works in production or with correct environment variable
- For local testing, use Google Analytics DebugView
- All events are implemented with user privacy in mind
