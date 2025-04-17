## Backend Documentation

### Server Setup (server.js)

- The server is set up using Express.js.
- **Middleware:**
  - `express.json()`: Parses incoming requests with JSON payloads.
  - `cors`: Enables Cross-Origin Resource Sharing (CORS) to allow requests from the frontend (running on `http://localhost:5173`).
- **Routes:**
  - User routes: Handles user-related operations (e.g., registration, login).
  - Asset routes: Manages asset-related operations within the ITAM module (e.g., creating, retrieving, updating assets).

### Routes


#### User Functionalities

##### User Model

-   **File:** `backend/core/user/user.model.js`
-   **Description:** Defines the structure and schema for user data stored in the database.
-   **Fields:**
    -   `username`: User's unique username.
    -   `password`: Hashed password for security.
    -   `email`: User's email address.
    -   `role`: User role like admin or user

##### User Service

-   **File:** `backend/core/user/user.service.js`
-   **Description:** Contains the business logic for user-related operations.
-   **Functions:**
    -   `createUser`: Creates a new user.
    -   `findUserByUsername`: Finds a user by their username.
    -   `findUserById`: find user by id.
    -   (Other methods for updating, deleting users, etc., would be listed here).

##### User Controller

-   **File:** `backend/core/user/user.controller.js`
-   **Description:** Handles incoming HTTP requests related to users and interacts with the user service.
-   **Actions:**
    -   `register`: Handles user registration.
    -   `login`: Handles user login.
    -   (Other actions for managing user profiles, etc., would be listed here).



### Routes




#### User Routes
- Located in `backend/routes/user.routes.js`.
- Handles API endpoints related to user management.
- (Further details about specific endpoints and their functionalities would be listed here, if available in the provided context).

#### Asset Routes
- Located in `backend/modules/itam/routes/asset.routes.js`.
- Handles API endpoints for managing assets within the ITAM (IT Asset Management) module.
- (Further details about specific endpoints and their functionalities would be listed here, if available in the provided context).

#### Asset Functionalities
##### Asset Model

-   **File:** `backend/modules/itam/models/asset.model.js`
-   **Description:** Defines the structure and schema for asset data.
-   **Fields:**
    -   `assetId`: Unique identifier for an asset.
    -   `name`: Name of the asset.
    -   `description`: Description of the asset.
    -   `category`: Category of the asset (e.g., hardware, software).
    -   `status`: Current status of the asset.
    -   (Other relevant fields like purchase date, owner, etc., would be listed here).

##### Asset Service

-   **File:** `backend/modules/itam/services/asset.service.js`
-   **Description:** Contains the business logic for asset-related operations.
-   **Functions:**
    -   `createAsset`: Creates a new asset.
    -   `getAssetById`: Retrieves an asset by its ID.
    -   `getAllAssets`: Retrieves all assets.
    -   `updateAsset`: Updates an existing asset.
    -   `deleteAsset`: Deletes an asset.
    -   (Other methods for filtering, searching, or asset lifecycle management would be listed here).

##### Asset Controller

-   **File:** `backend/modules/itam/controllers/asset.controller.js`
-   **Description:** Handles incoming HTTP requests related to assets and interacts with the asset service.
-   **Actions:**
    -   `create`: Creates a new asset.
    -   `findAll`: Retrieves all assets.
    -   `findOne`: Retrieves a specific asset by ID.
    -   `update`: Updates an existing asset.
    -   `delete`: Deletes an asset.
    -   (Other actions for managing assets, such as bulk operations or reporting, would be listed here).




## Frontend Documentation

### SettingsList component

-   **File:** `frontend/src/components/SettingsList.jsx`
-   **Description:** This component is a reusable list for displaying settings options in a formatted list.
-   **Props:**
    -   `items`: An array of setting items, each item should have `name` and `link`.
- **Functionalities:**
   - create a dynamic list with the prop item.

### Main Application Component (App.jsx)

#### ITAM Settings Page

    -   **File:** `frontend/src/pages/ITAM/ITAMSettingsPage.jsx`
    -   **Description:** This page serves as a hub for managing various ITAM-related settings.
    -   **Functionalities:**
        -   Provides navigation links to other settings pages, such as `ITAMCustomSettingsPage`, `LifecycleConfigPage`, and `DropdownConfigPage`.
        - Manages settings related to the IT Asset Management module.


- The main application component is responsible for setting up the application's routing and handling authentication.
- (Further details about the routing logic and authentication implementation would be listed here, if available in the provided context).

### Main Pages

- **Dashboard:** The main landing page for authenticated users, providing an overview of the system.
- **Login:** Allows users to log in to the application.
- **Register:** Enables new users to create an account.
- **ITAM Dashboard:** Provides an overview of IT asset management functionalities.
- **Asset List Page:** Displays a list of assets.
- **Asset Details Page:** Shows detailed information about a specific asset.
- **Asset Form Page:** Allows users to create or edit asset information.
- **Asset Form Config Page:**  (Functionality would be described here if available)
- **Dropdown Config Page:** (Functionality would be described here if available)
- **ITAM Custom Settings Page:** (Functionality would be described here if available)
- **ITAM Settings Page:**  (Functionality would be described here if available)
- **Lifecycle Config Page:** (Functionality would be described here if available)