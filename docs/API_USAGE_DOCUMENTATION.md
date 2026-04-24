# MyLoanBook API Usage Documentation

## Overview

This document lists the APIs currently used in the React Native app, which frontend service calls them, which screen uses them, and what each API is used for.

Base configuration:

- Frontend API client: [src/services/apiClient.js](/g:/CodeX/NewProject/MyLoanBook/src/services/apiClient.js:1)
- Current base URL: `http://192.168.18.10:5000/api`
- Auth token: sent automatically in `Authorization: Bearer <token>` when a saved session exists

## API Client Behavior

Shared client:

- `apiRequest(path, config)`
- Handles:
  - base URL
  - auth token injection
  - timeout handling
  - backend error message parsing

Used by:

- `authApi.js`
- `contactApi.js`
- `dashboardApi.js`
- `transactionApi.js`
- `reportsApi.js`
- `notificationApi.js`
- `legalApi.js`

## Auth APIs

Source file:

- [src/services/authApi.js](/g:/CodeX/NewProject/MyLoanBook/src/services/authApi.js:1)

### `POST /auth/register`

- Service function: `registerUser`
- Used in: [RegisterScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/auth/RegisterScreen.jsx:1)
- Purpose:
  - create a new user account
  - send `fullName`, `email`, `phone`, `password`

### `POST /auth/login`

- Service function: `loginUser`
- Used in: [LoginScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/auth/LoginScreen.jsx:1)
- Purpose:
  - log user in
  - send `phone` and `password`
  - returned session/token is stored in local auth storage

### `POST /auth/forgot-password`

- Service function: `forgotPassword`
- Used in: [ForgotPasswordScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/auth/ForgotPasswordScreen.jsx:1)
- Purpose:
  - trigger forgot-password flow
  - send `email`

### `POST /auth/reset-password`

- Service function: `resetPassword`
- Used in: [ResetPasswordScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/auth/ResetPasswordScreen.jsx:1)
- Purpose:
  - reset password using reset token
  - send `token`, `password`, `confirmPassword`

### `PATCH /auth/me`

- Service function: `updateProfile`
- Used in: [EditProfileScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/app/EditProfileScreen.jsx:1)
- Purpose:
  - update current user profile
  - send `fullName`, `email`, `phone`, `profilePhoto`

### `PATCH /auth/change-password`

- Service function: `changePassword`
- Used in: [ChangePasswordScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/app/ChangePasswordScreen.jsx:1)
- Purpose:
  - change current password while logged in
  - send `currentPassword`, `password`, `confirmPassword`

## Contact APIs

Source file:

- [src/services/contactApi.js](/g:/CodeX/NewProject/MyLoanBook/src/services/contactApi.js:1)

### `GET /contacts`

- Service function: `getContacts`
- Used in:
  - [MyPeopleScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/app/MyPeopleScreen.jsx:1)
  - [AddTransactionScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/app/AddTransactionScreen.jsx:1)
- Purpose:
  - fetch all contacts of logged-in user
  - in `MyPeopleScreen`, used to show contact list
  - in `AddTransactionScreen`, used to choose a contact before creating a transaction

### `GET /contacts/:contactId`

- Service function: `getContact`
- Used in:
  - [ContactDetailScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/app/ContactDetailScreen.jsx:1)
  - [RecordRepaymentScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/app/RecordRepaymentScreen.jsx:1)
- Purpose:
  - fetch one contact with full detail
  - used to render ledger/contact info and repayment context

### `POST /contacts`

- Service function: `addContactByRegCode`
- Used in: [MyPeopleScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/app/MyPeopleScreen.jsx:1)
- Purpose:
  - add a contact using registration code
  - request body sends `reg_code`

## Dashboard API

Source file:

- [src/services/dashboardApi.js](/g:/CodeX/NewProject/MyLoanBook/src/services/dashboardApi.js:1)

### `GET /dashboard`

- Service function: `getDashboard`
- Used in: [DashboardScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/app/DashboardScreen.jsx:1)
- Purpose:
  - load dashboard summary cards
  - load contacts preview
  - load pending approvals
  - load recent activity

## Transaction APIs

Source file:

- [src/services/transactionApi.js](/g:/CodeX/NewProject/MyLoanBook/src/services/transactionApi.js:1)

### `GET /transactions`

- Service function: `getTransactions`
- Used in:
  - [TransactionHistoryScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/app/TransactionHistoryScreen.jsx:1)
  - [ContactDetailScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/app/ContactDetailScreen.jsx:1)
- Purpose:
  - fetch transaction list
  - optional query params:
    - `contactId`
    - `type`
  - in `ContactDetailScreen`, used to show a contact-specific ledger/history
  - in `TransactionHistoryScreen`, used to show broader transaction history and filters

### `GET /transactions/:transactionId`

- Service function: `getTransaction`
- Current screen usage:
  - no active screen currently importing this function
- Purpose:
  - fetch one transaction by id
  - available for future transaction detail usage

### `POST /transactions`

- Service function: `createTransaction`
- Used in: [AddTransactionScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/app/AddTransactionScreen.jsx:1)
- Purpose:
  - create a normal loan/borrow transaction
  - payload depends on form fields selected in Add Transaction screen

### `POST /transactions/repayment-requests`

- Service function: `createRepaymentRequest`
- Used in: [RecordRepaymentScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/app/RecordRepaymentScreen.jsx:1)
- Purpose:
  - borrower submits a repayment/payment request
  - backend creates pending repayment for lender review

### `PATCH /transactions/:transactionId/approve-repayment`

- Service function: `approveRepaymentRequest`
- Used in:
  - [DashboardScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/app/DashboardScreen.jsx:1)
  - [ContactDetailScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/app/ContactDetailScreen.jsx:1)
- Purpose:
  - lender approves a pending repayment request
  - used from pending-approval UI blocks

## Reports API

Source file:

- [src/services/reportsApi.js](/g:/CodeX/NewProject/MyLoanBook/src/services/reportsApi.js:1)

### `GET /reports`

- Service function: `getReports`
- Used in: [ReportsScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/app/ReportsScreen.jsx:1)
- Purpose:
  - fetch monthly reports data
  - optional query params:
    - `month`
    - `year`
  - used for donut chart, totals, and monthly history

## Notification APIs

Source file:

- [src/services/notificationApi.js](/g:/CodeX/NewProject/MyLoanBook/src/services/notificationApi.js:1)

### `GET /notifications`

- Service function: `getNotifications`
- Used in: [NotificationsScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/app/NotificationsScreen.jsx:1)
- Purpose:
  - fetch all notifications for current user
  - screen currently filters and shows unread-only items

### `GET /notifications/unread-count`

- Service function: `getUnreadNotificationCount`
- Used in: [AppShellHeader.jsx](/g:/CodeX/NewProject/MyLoanBook/src/navigation/AppShellHeader.jsx:1)
- Purpose:
  - fetch unread notification count
  - used to show unread badge on the global header bell icon

### `PATCH /notifications/:id/read`

- Service function: `markNotificationAsRead`
- Used in: [NotificationsScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/app/NotificationsScreen.jsx:1)
- Purpose:
  - mark a single notification as read
  - currently triggered when user taps one unread notification

### `PATCH /notifications/read-all`

- Service function: `markAllNotificationsAsRead`
- Used in: [NotificationsScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/app/NotificationsScreen.jsx:1)
- Purpose:
  - mark all notifications as read
  - used by `Mark All As Read` button

## Legal APIs

Source file:

- [src/services/legalApi.js](/g:/CodeX/NewProject/MyLoanBook/src/services/legalApi.js:1)

### `GET /legal/privacy-policy`

- Service function: `getPrivacyPolicy`
- Used in: [PrivacyPolicyScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/app/PrivacyPolicyScreen.jsx:1)
- Purpose:
  - fetch privacy policy content from backend
  - used to render legal text sections dynamically

### `GET /legal/terms-and-conditions`

- Service function: `getTermsAndConditions`
- Used in: [TermsAndConditionsScreen.jsx](/g:/CodeX/NewProject/MyLoanBook/src/screens/app/TermsAndConditionsScreen.jsx:1)
- Purpose:
  - fetch terms & conditions content from backend
  - used to render legal text sections dynamically

## Screen-Wise API Map

### Auth Screens

- `LoginScreen` -> `POST /auth/login`
- `RegisterScreen` -> `POST /auth/register`
- `ForgotPasswordScreen` -> `POST /auth/forgot-password`
- `ResetPasswordScreen` -> `POST /auth/reset-password`

### App Screens

- `DashboardScreen`
  - `GET /dashboard`
  - `PATCH /transactions/:id/approve-repayment`
- `MyPeopleScreen`
  - `GET /contacts`
  - `POST /contacts`
- `AddTransactionScreen`
  - `GET /contacts`
  - `POST /transactions`
- `ReportsScreen`
  - `GET /reports`
- `ContactDetailScreen`
  - `GET /contacts/:contactId`
  - `GET /transactions`
  - `PATCH /transactions/:id/approve-repayment`
- `TransactionHistoryScreen`
  - `GET /transactions`
- `RecordRepaymentScreen`
  - `GET /contacts/:contactId`
  - `POST /transactions/repayment-requests`
- `EditProfileScreen`
  - `PATCH /auth/me`
- `ChangePasswordScreen`
  - `PATCH /auth/change-password`
- `NotificationsScreen`
  - `GET /notifications`
  - `PATCH /notifications/:id/read`
  - `PATCH /notifications/read-all`
- `PrivacyPolicyScreen`
  - `GET /legal/privacy-policy`
- `TermsAndConditionsScreen`
  - `GET /legal/terms-and-conditions`

### Navigation / Shared Components

- `AppShellHeader`
  - `GET /notifications/unread-count`

## APIs Present But Not Currently Used By A Screen

- `GET /transactions/:transactionId`
  - service function exists as `getTransaction`
  - no current screen import found

## Notes

- `DisclaimerScreen` is currently hardcoded and does not use any API
- `DeveloperScreen` is currently hardcoded and does not use any API
- Session persistence is handled through local storage helpers in [authStorage.js](/g:/CodeX/NewProject/MyLoanBook/src/services/authStorage.js:1), not backend API docs
- If you later add new backend endpoints like reject repayment or developer/disclaimer APIs, this document should be updated too
