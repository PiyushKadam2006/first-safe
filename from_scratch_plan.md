# RoadSoS: From Scratch Build Plan

This plan outlines how to build a fully functional RoadSoS application using the UI designs provided in the Stitch AI zip files. We will build a unified system where the Mobile App detects accidents and the Dashboard listens in real-time.

## User Review Required

> [!IMPORTANT]
> This plan assumes we are moving from single-file HTML (from Stitch) to a structured React/Node environment.
> We will need to set up a new project structure and install dependencies.

## Proposed Changes

### Phase 1: Backend Setup [NEW]
- Create `backend/` directory.
- Initialize with `express`, `mongoose`, `cors`, and `dotenv`.
- Implement `POST /api/sos/trigger` and `GET /api/incidents`.
- Connect to MongoDB.

### Phase 2: Dashboard Integration [NEW]
- Create `dashboard/` using Vite.
- Integrate the **AEGIS_COMMAND** UI from the zip file.
- Convert the HTML/Tailwind code into React components.
- Use `fetch` to display live data from the Backend.

### Phase 3: Mobile App Integration [NEW]
- Create `mobile/` using Expo.
- Integrate the **Safety-First UI** (Countdown & SOS button) from the zip file.
- Connect the **Accelerometer** sensors to trigger the UI.
- Implement the GPS fetch and Backend notification.

## Verification Plan

### Automated Tests
- Once the backend is up, I will use `curl` or `Postman` logic to verify the API.
- Use `browser_subagent` to verify the extracted Dashboard load.

### Manual Verification
- You will be able to shake your phone (Expo Go) and see the AEGIS_COMMAND dashboard pulse red in real-time.
