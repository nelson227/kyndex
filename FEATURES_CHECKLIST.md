# Kyndex - Feature Verification Checklist

**Document Status:** Active Reference Document  
**Last Updated:** 27 février 2026  
**Purpose:** Complete feature tracking for all development phases

---

## Table of Contents

1. [Phase 1: MVP](#phase-1-mvp)
2. [Phase 2: Microservices](#phase-2-microservices)
3. [Phase 3: Global Scale](#phase-3-global-scale)
4. [Phase 4: Public API](#phase-4-public-api)

---

# Phase 1: MVP

## 1. Authentication & Authorization

### 1.1 User Registration
- [ ] **Backend**
  - [ ] POST /auth/register endpoint created
  - [ ] Email validation implemented
  - [ ] Password hashing (bcrypt) implemented
  - [ ] Unique email constraint in DB
  - [ ] Input validation with Zod
  - [ ] Error handling (duplicate email, invalid format)
  - [ ] User created with default role "USER"
  - [ ] Profile auto-created with user
  
- [ ] **Frontend**
  - [ ] Registration form component created
  - [ ] Email field with validation
  - [ ] Password field with strength indicator
  - [ ] Password confirmation field
  - [ ] Terms of service checkbox
  - [ ] Submit button with loading state
  - [ ] Success notification/redirect
  - [ ] Error message display
  - [ ] Link to login page

- [ ] **Testing**
  - [ ] Unit test: Valid registration succeeds
  - [ ] Unit test: Duplicate email fails
  - [ ] Unit test: Invalid email format fails
  - [ ] Unit test: Weak password fails
  - [ ] E2E test: Full registration flow
  - [ ] Integration test: User created in DB

### 1.2 User Login
- [ ] **Backend**
  - [ ] POST /auth/login endpoint created
  - [ ] Email/password verification
  - [ ] Password comparison with bcrypt
  - [ ] JWT access token generation
  - [ ] JWT refresh token generation
  - [ ] Token storage in secure cookies
  - [ ] Login attempt logging
  - [ ] Rate limiting on failed attempts
  - [ ] User status check (not banned)

- [ ] **Frontend**
  - [ ] Login form component
  - [ ] Email input field
  - [ ] Password input field
  - [ ] "Remember me" checkbox (optional)
  - [ ] Submit button
  - [ ] "Forgot password" link
  - [ ] "Sign up" link
  - [ ] Error message display
  - [ ] Loading state on submit
  - [ ] Redirect on success

- [ ] **Testing**
  - [ ] Unit test: Valid credentials login succeeds
  - [ ] Unit test: Invalid credentials fails
  - [ ] Unit test: Rate limiting works
  - [ ] E2E test: Complete login flow
  - [ ] Integration test: Tokens generated correctly

### 1.3 JWT Token Management
- [ ] **Backend**
  - [ ] JWT strategy implemented (Passport.js)
  - [ ] JWT access token issued (15m expiry)
  - [ ] JWT refresh token issued (7d expiry)
  - [ ] Token validation on protected routes
  - [ ] Token refresh endpoint (POST /auth/refresh)
  - [ ] Token revocation on logout
  - [ ] Token payload includes user ID, role
  - [ ] Signed with strong secret
  - [ ] Environment variable for secrets

- [ ] **Frontend**
  - [ ] Access token stored securely
  - [ ] Refresh token stored securely
  - [ ] Token included in API requests (Authorization header)
  - [ ] Automatic token refresh before expiry
  - [ ] Logout clears tokens
  - [ ] Handle token expiration errors

- [ ] **Testing**
  - [ ] Unit test: Token generation
  - [ ] Unit test: Token validation
  - [ ] Unit test: Token refresh
  - [ ] Unit test: Expired token rejected

### 1.4 OAuth2 Integration (Google)
- [ ] **Backend**
  - [ ] Google OAuth strategy configured (Passport.js)
  - [ ] Google client ID & secret stored in .env
  - [ ] POST /auth/oauth/google endpoint
  - [ ] ID token validation
  - [ ] User auto-creation on first login
  - [ ] Email extraction from OAuth token
  - [ ] Link OAuth account to existing user (optional)
  - [ ] Tokens issued after successful auth
  - [ ] Redirect URI properly configured

- [ ] **Frontend**
  - [ ] Google sign-in button added
  - [ ] Google SDK loaded
  - [ ] Login flow triggered
  - [ ] Redirect to home on success
  - [ ] Error handling for failed auth

- [ ] **Testing**
  - [ ] Unit test: OAuth token validation
  - [ ] Integration test: User created via OAuth
  - [ ] E2E test: Google login flow

### 1.5 OAuth2 Integration (GitHub)
- [ ] **Backend**
  - [ ] GitHub OAuth strategy configured
  - [ ] GitHub client ID & secret stored
  - [ ] POST /auth/oauth/github endpoint
  - [ ] Authorization code exchange
  - [ ] User data fetched from GitHub API
  - [ ] Email extraction/fallback
  - [ ] User auto-creation on first login
  - [ ] Tokens issued after successful auth

- [ ] **Frontend**
  - [ ] GitHub sign-in button added
  - [ ] Proper redirect URI configured
  - [ ] Authorization flow integrated
  - [ ] Error handling

- [ ] **Testing**
  - [ ] Integration test: GitHub OAuth flow
  - [ ] Unit test: User creation

### 1.6 Password Reset
- [ ] **Backend**
  - [ ] POST /auth/forgot-password endpoint
  - [ ] Email validation
  - [ ] Temporary reset token generated
  - [ ] Reset token stored in DB with expiry (1h)
  - [ ] Reset email sent via SendGrid
  - [ ] POST /auth/reset-password endpoint
  - [ ] Token validation before reset
  - [ ] New password hashed
  - [ ] Old tokens invalidated

- [ ] **Frontend**
  - [ ] Forgot password form
  - [ ] Email input
  - [ ] Success message
  - [ ] Reset link in email
  - [ ] Reset form (new password)
  - [ ] Confirmation message

- [ ] **Testing**
  - [ ] Unit test: Token generation & validation
  - [ ] Unit test: Password reset
  - [ ] E2E test: Full reset flow

### 1.7 2FA TOTP
- [ ] **Backend**
  - [ ] POST /auth/2fa/enable endpoint
  - [ ] TOTP secret generated (speakeasy)
  - [ ] QR code generated
  - [ ] Backup codes generated
  - [ ] POST /auth/2fa/verify endpoint
  - [ ] Code validation (30s window)
  - [ ] Backup codes stored (hashed)
  - [ ] POST /auth/2fa/disable endpoint
  - [ ] Admin can disable (support)

- [ ] **Frontend**
  - [ ] 2FA settings page
  - [ ] Enable button
  - [ ] Secret/QR code display
  - [ ] Verification code input
  - [ ] Backup codes save/print
  - [ ] Success confirmation
  - [ ] Disable option

- [ ] **Testing**
  - [ ] Unit test: TOTP generation
  - [ ] Unit test: Code validation
  - [ ] Unit test: Backup code usage
  - [ ] E2E test: Enable/disable 2FA

### 1.8 Authorization & Roles
- [ ] **Backend**
  - [ ] @Roles() decorator created
  - [ ] RolesGuard implemented
  - [ ] Role check on protected endpoints
  - [ ] Admin-only endpoints protected
  - [ ] User can't access other user's data
  - [ ] Role-based endpoint access documented

- [ ] **Frontend**
  - [ ] Admin-only components hidden for non-admin
  - [ ] User can only edit own profile
  - [ ] Navigation adapted by role

- [ ] **Testing**
  - [ ] Unit test: Role validation
  - [ ] Test: User can't access admin endpoints
  - [ ] Test: User can't modify other users

### 1.9 Protected Routes
- [ ] **Backend**
  - [ ] JwtAuthGuard applied to protected endpoints
  - [ ] Invalid token rejected
  - [ ] Expired token rejected
  - [ ] Missing token rejected
  - [ ] 401 responses on auth fail

- [ ] **Frontend**
  - [ ] Unauthenticated user redirected to login
  - [ ] Protected route guard implemented
  - [ ] Session check on app load

- [ ] **Testing**
  - [ ] Integration test: Protected endpoints require auth

---

## 2. User Management

### 2.1 User Profile (View Own)
- [ ] **Backend**
  - [ ] GET /users/me endpoint
  - [ ] Returns current authenticated user
  - [ ] Includes profile data
  - [ ] Includes skills
  - [ ] Includes reputation score
  - [ ] JwtAuthGuard applied

- [ ] **Frontend**
  - [ ] Profile page component
  - [ ] Display user name, email, bio
  - [ ] Display location, languages, availability
  - [ ] Display avatar
  - [ ] Display reputation score
  - [ ] Display offered/wanted skills
  - [ ] Responsive design

- [ ] **Testing**
  - [ ] Unit test: Endpoint returns correct user
  - [ ] E2E test: Load profile page

### 2.2 User Profile (View Public)
- [ ] **Backend**
  - [ ] GET /users/{userId} endpoint
  - [ ] Returns public user data only
  - [ ] Doesn't return sensitive fields
  - [ ] Returns reputation, skills, location
  - [ ] Handles non-existent user (404)

- [ ] **Frontend**
  - [ ] Public profile page
  - [ ] Can be viewed without auth
  - [ ] Shows user info, skills, reviews
  - [ ] "Message" button to start conversation
  - [ ] User not found page (404)

- [ ] **Testing**
  - [ ] Unit test: Endpoint returns public data only
  - [ ] Test: Sensitive data not returned

### 2.3 Profile Edit
- [ ] **Backend**
  - [ ] PATCH /users/me endpoint
  - [ ] Update name, bio, location
  - [ ] Update availability, timezone
  - [ ] Update languages array
  - [ ] Avatar upload via URL/base64
  - [ ] Input validation
  - [ ] Return updated user data

- [ ] **Frontend**
  - [ ] Edit profile form
  - [ ] All editable fields
  - [ ] Save button
  - [ ] Loading state
  - [ ] Success notification
  - [ ] Error handling
  - [ ] Cancel button

- [ ] **Testing**
  - [ ] Unit test: Valid profile update
  - [ ] Unit test: Invalid input rejected
  - [ ] E2E test: Profile edit flow

### 2.4 Avatar Upload
- [ ] **Backend**
  - [ ] POST /users/me/avatar endpoint
  - [ ] File size validation (max 5MB)
  - [ ] File type validation (jpg, png, webp)
  - [ ] Image resize (200x200 thumbnail)
  - [ ] Upload to S3 or local storage
  - [ ] Return avatar URL
  - [ ] Old avatar deleted

- [ ] **Frontend**
  - [ ] File picker component
  - [ ] Image preview
  - [ ] Drag & drop support
  - [ ] Upload progress indicator
  - [ ] Success/error messages

- [ ] **Testing**
  - [ ] Unit test: File validation
  - [ ] Test: Invalid file rejected
  - [ ] Test: S3 upload succeeds

### 2.5 Password Change
- [ ] **Backend**
  - [ ] PATCH /users/me/password endpoint
  - [ ] Require current password verification
  - [ ] Validate new password strength
  - [ ] Hash new password
  - [ ] Invalidate existing tokens (logout user)
  - [ ] Audit log password change

- [ ] **Frontend**
  - [ ] Change password form
  - [ ] Current password field
  - [ ] New password field
  - [ ] Confirm password field
  - [ ] Password strength indicator
  - [ ] Submit button
  - [ ] Success message

- [ ] **Testing**
  - [ ] Unit test: Current password verified
  - [ ] Unit test: Weak password rejected
  - [ ] E2E test: Change password

### 2.6 Email Verification
- [ ] **Backend**
  - [ ] Email verification token generated
  - [ ] Verification email sent
  - [ ] Email not verified flag in user
  - [ ] GET /auth/verify-email endpoint
  - [ ] Mark email as verified
  - [ ] Prevent unverified user actions (optional)

- [ ] **Frontend**
  - [ ] Verification email modal
  - [ ] Resend verification link button
  - [ ] Verification success page

- [ ] **Testing**
  - [ ] Unit test: Verification token
  - [ ] E2E test: Email verification flow

### 2.7 User List (Admin)
- [ ] **Backend**
  - [ ] GET /admin/users endpoint
  - [ ] Pagination support (limit, offset)
  - [ ] Filter by status, role
  - [ ] Search by name/email
  - [ ] Sort by created date, reputation
  - [ ] RolesGuard (admin only)
  - [ ] Return user count

- [ ] **Frontend**
  - [ ] Admin users page
  - [ ] Table/list of users
  - [ ] Pagination controls
  - [ ] Search box
  - [ ] Filter dropdown
  - [ ] User action buttons (view, ban, etc.)

- [ ] **Testing**
  - [ ] Unit test: Pagination works
  - [ ] Unit test: Filtering works
  - [ ] Test: Non-admin can't access

### 2.8 User Status Management (Admin)
- [ ] **Backend**
  - [ ] PATCH /admin/users/{userId}/status endpoint
  - [ ] Change status (ACTIVE, INACTIVE, SUSPENDED, BANNED)
  - [ ] Ban reason required
  - [ ] Notification sent to user
  - [ ] RolesGuard applied
  - [ ] Audit log recorded

- [ ] **Frontend**
  - [ ] Status dropdown in admin
  - [ ] Confirm dialog before ban
  - [ ] Reason input required
  - [ ] Success notification

- [ ] **Testing**
  - [ ] Unit test: Status change
  - [ ] Test: Banned user can't login

---

## 3. Skills Management

### 3.1 Skills Taxonomy
- [ ] **Backend**
  - [ ] Skills table with 100+ predefined skills
  - [ ] Categories: programming, design, marketing, etc.
  - [ ] Subcategories
  - [ ] Skill descriptions
  - [ ] Icons/emojis for each skill
  - [ ] Difficulty levels as metadata

- [ ] **Database**
  - [ ] Skill seed data inserted
  - [ ] Categories standardized
  - [ ] Full-text search index created

- [ ] **Testing**
  - [ ] Database contains expected skills
  - [ ] Categories are consistent

### 3.2 List All Skills
- [ ] **Backend**
  - [ ] GET /skills endpoint
  - [ ] Returns paginated list
  - [ ] Filter by category
  - [ ] Search by name
  - [ ] No authentication required
  - [ ] Returns icon, description

- [ ] **Frontend**
  - [ ] Skills list component
  - [ ] Category filter dropdown
  - [ ] Search input
  - [ ] Skill cards with icon
  - [ ] Click to view details

- [ ] **Testing**
  - [ ] Unit test: Pagination works
  - [ ] Unit test: Category filter works
  - [ ] Test: Search returns results

### 3.3 Search Skills
- [ ] **Backend**
  - [ ] GET /skills/search endpoint
  - [ ] Full-text search query
  - [ ] Returns top matching skills
  - [ ] Relevance scoring
  - [ ] Limit parameter

- [ ] **Frontend**
  - [ ] Search input with autocomplete
  - [ ] Dropdown with results
  - [ ] Highlight matched text
  - [ ] Select from results

- [ ] **Testing**
  - [ ] Unit test: Search returns relevant results
  - [ ] Test: Partial match works
  - [ ] Test: Case-insensitive

### 3.4 Add Skill to Profile (Offered)
- [ ] **Backend**
  - [ ] POST /users/me/skills/{skillId} endpoint
  - [ ] Create UserSkill record
  - [ ] type = "OFFERED"
  - [ ] level parameter (1-5)
  - [ ] Prevent duplicates (same skill, same type)
  - [ ] Return created skill record

- [ ] **Frontend**
  - [ ] Offered skills section in profile edit
  - [ ] Skill search/select
  - [ ] Level slider (1-5)
  - [ ] Add button
  - [ ] List of offered skills
  - [ ] Delete button per skill

- [ ] **Testing**
  - [ ] Unit test: Skill added correctly
  - [ ] Test: Duplicate prevention
  - [ ] Test: Level validation (1-5)

### 3.5 Add Skill to Profile (Wanted)
- [ ] **Backend**
  - [ ] POST /users/me/skills/{skillId} endpoint
  - [ ] Create UserSkill record
  - [ ] type = "WANTED"
  - [ ] level parameter (desired level 1-5)
  - [ ] Prevent duplicates

- [ ] **Frontend**
  - [ ] Wanted skills section
  - [ ] Skill search/select
  - [ ] Desired level slider
  - [ ] Add button
  - [ ] List of wanted skills

- [ ] **Testing**
  - [ ] Unit test: Wanted skill added
  - [ ] Test: Duplicate prevention

### 3.6 Remove Skill from Profile
- [ ] **Backend**
  - [ ] DELETE /users/me/skills/{skillId} endpoint
  - [ ] Delete UserSkill record
  - [ ] Verify ownership

- [ ] **Frontend**
  - [ ] Delete button on skill
  - [ ] Confirm dialog
  - [ ] Update list after delete

- [ ] **Testing**
  - [ ] Unit test: Skill removed
  - [ ] Test: User can't delete other user's skill

### 3.7 Get User's Skills
- [ ] **Backend**
  - [ ] GET /users/me/skills endpoint
  - [ ] Return offered and wanted skills
  - [ ] Include skill details (name, category, icon)
  - [ ] Include endorsement count

- [ ] **Frontend**
  - [ ] Skills section on profile
  - [ ] Split into offered/wanted
  - [ ] Display level/endorsements

- [ ] **Testing**
  - [ ] Unit test: Returns correct skills
  - [ ] Test: Split between offered/wanted

### 3.8 Skill Endorsement
- [ ] **Backend**
  - [ ] POST /skills/{skillId}/endorse endpoint
  - [ ] User can endorse other user's skill
  - [ ] Prevent self-endorsement
  - [ ] Prevent duplicate endorsement (same user, same skill)
  - [ ] Increment endorsement counter
  - [ ] Notification sent to endorsed user

- [ ] **Frontend**
  - [ ] Endorse button on public profile
  - [ ] Show endorsement count
  - [ ] Disable if already endorsed
  - [ ] Success notification

- [ ] **Testing**
  - [ ] Unit test: Endorsement added
  - [ ] Test: Self-endorsement prevented
  - [ ] Test: Duplicate prevented

### 3.9 Custom Skill Creation
- [ ] **Backend**
  - [ ] POST /skills endpoint
  - [ ] Create custom skill (min 3 chars, max 255)
  - [ ] Validate category
  - [ ] Duplicate check (case-insensitive)
  - [ ] Admin approval workflow (optional Phase 2)
  - [ ] Return created skill

- [ ] **Frontend**
  - [ ] Button to create custom skill
  - [ ] Modal with form
  - [ ] Name, category inputs
  - [ ] Validation feedback
  - [ ] Success confirmation

- [ ] **Testing**
  - [ ] Unit test: Custom skill created
  - [ ] Test: Validation works
  - [ ] Test: Duplicate name rejected

---

## 4. Matching Engine

### 4.1 Matching Algorithm
- [ ] **Backend**
  - [ ] Scoring function defined
  - [ ] Skills similarity calculation (cosine/weighted)
  - [ ] Location proximity scoring (optional)
  - [ ] Reputation weighting
  - [ ] Combined score = (skills * 0.5) + (location * 0.3) + (rep * 0.2)
  - [ ] Score range 0-1 normalized

- [ ] **Testing**
  - [ ] Unit test: Score calculation
  - [ ] Test: Edge cases (empty skills, etc.)

### 4.2 Recommendations API
- [ ] **Backend**
  - [ ] GET /matching/recommendations endpoint
  - [ ] JwtAuthGuard applied
  - [ ] Pagination (limit, offset)
  - [ ] Return matching users
  - [ ] Include match score, reason, common skills
  - [ ] Include user name, location, reputation
  - [ ] Cache results (Redis 30m TTL)
  - [ ] Optional filters (location, skill category)

- [ ] **Frontend**
  - [ ] Recommendations page/section
  - [ ] Cards with user info
  - [ ] Match score display (percentage)
  - [ ] Common skills display
  - [ ] "View Profile" button
  - [ ] "Message" button
  - [ ] Pagination controls
  - [ ] Filter options

- [ ] **Testing**
  - [ ] Unit test: Score calculation
  - [ ] Integration test: Recommendations returned
  - [ ] Test: Caching works
  - [ ] E2E test: View recommendations

### 4.3 Batch Matching (Admin)
- [ ] **Backend**
  - [ ] POST /matching/batch endpoint
  - [ ] RolesGuard (admin only)
  - [ ] Trigger matching for all users
  - [ ] Background job processing (BullMQ)
  - [ ] Update matching results cache
  - [ ] Return batch ID & status

- [ ] **Frontend**
  - [ ] Admin page for batch operations
  - [ ] "Run matching" button
  - [ ] Status/progress display
  - [ ] Completion notification

- [ ] **Testing**
  - [ ] Integration test: Batch matching
  - [ ] Test: Results cached correctly

### 4.4 Exclude User from Matching
- [ ] **Backend**
  - [ ] Soft block preventing user from recommendations
  - [ ] Option to exclude specific user
  - [ ] Store in user preferences/blocklist
  - [ ] Respect in algorithm

- [ ] **Frontend**
  - [ ] "Block" button on profile
  - [ ] Blocked users list
  - [ ] Unblock option

- [ ] **Testing**
  - [ ] Test: Blocked user not in recommendations

### 4.5 Matching Filters
- [ ] **Backend**
  - [ ] Filter in algorithm by location radius
  - [ ] Filter by skill category
  - [ ] Filter by reputation min/max
  - [ ] Filter by availability

- [ ] **Frontend**
  - [ ] Filter UI controls
  - [ ] Apply filters button
  - [ ] Reset filters option

- [ ] **Testing**
  - [ ] Test: Filters applied correctly

---

## 5. Messaging System

### 5.1 Conversations
- [ ] **Backend**
  - [ ] POST /conversations endpoint
  - [ ] Create conversation with 2 participants
  - [ ] Include initial message (optional)
  - [ ] JwtAuthGuard applied
  - [ ] Return conversation ID

- [ ] **Frontend**
  - [ ] "Message" button on profiles
  - [ ] Modal or redirect to conversation
  - [ ] Compose initial message

- [ ] **Testing**
  - [ ] Unit test: Conversation created
  - [ ] Test: Can't message self
  - [ ] E2E test: Create conversation

### 5.2 Conversation List
- [ ] **Backend**
  - [ ] GET /conversations endpoint
  - [ ] Return user's conversations
  - [ ] Include last message preview
  - [ ] Include unread count
  - [ ] Pagination support
  - [ ] Sort by recent (lastMessageAt)
  - [ ] Search by participant name

- [ ] **Frontend**
  - [ ] Conversations sidebar/list
  - [ ] Last message preview
  - [ ] Unread badge
  - [ ] Participant avatar
  - [ ] Click to open conversation
  - [ ] Search box

- [ ] **Testing**
  - [ ] Unit test: Returns correct conversations
  - [ ] Test: Pagination works
  - [ ] Test: Sorting by recency

### 5.3 Message History
- [ ] **Backend**
  - [ ] GET /conversations/{conversationId}/messages
  - [ ] JwtAuthGuard + conversation membership check
  - [ ] Pagination (limit, offset)
  - [ ] Sort by createdAt (oldest first)
  - [ ] Include sender info
  - [ ] Include attachments

- [ ] **Frontend**
  - [ ] Messages list
  - [ ] Chronological order
  - [ ] Sender avatar & name
  - [ ] Timestamps
  - [ ] Message actions (delete own messages)
  - [ ] Pagination/infinite scroll

- [ ] **Testing**
  - [ ] Unit test: Returns messages in order
  - [ ] Test: User can only see own conversations
  - [ ] Test: Pagination works

### 5.4 Send Message
- [ ] **Backend**
  - [ ] POST /conversations/{conversationId}/messages
  - [ ] JwtAuthGuard applied
  - [ ] Membership check
  - [ ] Message content validation (non-empty)
  - [ ] Save to database
  - [ ] Broadcast via Socket.io
  - [ ] Update conversation's lastMessageAt
  - [ ] Trigger notification to other participant

- [ ] **Frontend**
  - [ ] Message input box
  - [ ] Send button
  - [ ] Loading state
  - [ ] Auto-focus input
  - [ ] Emoji picker (optional)
  - [ ] Optimistic message update

- [ ] **Testing**
  - [ ] Unit test: Message created
  - [ ] Test: Invalid message rejected
  - [ ] E2E test: Send and receive message

### 5.5 Real-time Messaging (WebSocket)
- [ ] **Backend**
  - [ ] Socket.io server setup
  - [ ] Authentication middleware
  - [ ] Join conversation room
  - [ ] Emit message:new event
  - [ ] Broadcast to participants
  - [ ] Handle disconnect gracefully
  - [ ] Redis adapter for multi-server scalability

- [ ] **Frontend**
  - [ ] Socket.io client setup
  - [ ] Connect on mount
  - [ ] Join conversation room
  - [ ] Listen for message:new events
  - [ ] Append new messages to UI
  - [ ] Typing indicator (optional)
  - [ ] Connection status indicator

- [ ] **Testing**
  - [ ] Integration test: Message broadcast
  - [ ] Test: Multi-client messaging
  - [ ] Test: Disconnect handling

### 5.6 Edit Message
- [ ] **Backend**
  - [ ] PATCH /messages/{messageId} endpoint
  - [ ] Only message sender can edit
  - [ ] Time window (? 1 hour after creation)
  - [ ] Mark message as edited
  - [ ] Broadcast update via Socket.io

- [ ] **Frontend**
  - [ ] Edit button on sent messages
  - [ ] Modal to edit content
  - [ ] Save button
  - [ ] "edited" indicator

- [ ] **Testing**
  - [ ] Unit test: Owner can edit
  - [ ] Test: Other user can't edit
  - [ ] Test: Time window enforced

### 5.7 Delete Message
- [ ] **Backend**
  - [ ] DELETE /messages/{messageId} endpoint
  - [ ] Only owner or admin can delete
  - [ ] Soft delete (keep for history)
  - [ ] Broadcast deletion via Socket.io

- [ ] **Frontend**
  - [ ] Delete button on messages
  - [ ] Confirm dialog
  - [ ] Remove from UI

- [ ] **Testing**
  - [ ] Unit test: Owner can delete
  - [ ] Test: Other user can't delete

### 5.8 Message Attachments
- [ ] **Backend**
  - [ ] Support file attachments in messages
  - [ ] File size validation (max 10MB per file, 5 files max)
  - [ ] Store in S3/local storage
  - [ ] Return attachment URLs
  - [ ] Include in message object

- [ ] **Frontend**
  - [ ] File picker in message input
  - [ ] Preview thumbnails
  - [ ] Upload progress
  - [ ] Remove file before send
  - [ ] Display attachments in message

- [ ] **Testing**
  - [ ] Unit test: File validation
  - [ ] Test: S3 upload succeeds

### 5.9 Typing Indicator
- [ ] **Backend**
  - [ ] Socket event for typing:start
  - [ ] Socket event for typing:stop
  - [ ] Broadcast to other participant

- [ ] **Frontend**
  - [ ] Emit typing:start on input focus
  - [ ] Emit typing:stop on blur/submit
  - [ ] Display "[User] is typing..."

- [ ] **Testing**
  - [ ] Integration test: Typing event

### 5.10 Unread Messages
- [ ] **Backend**
  - [ ] Track unread count per conversation
  - [ ] Mark messages as read
  - [ ] PUT /conversations/{conversationId}/read endpoint
  - [ ] Update lastReadAt timestamp

- [ ] **Frontend**
  - [ ] Show unread badge
  - [ ] Auto-mark as read on open
  - [ ] Update count in list

- [ ] **Testing**
  - [ ] Unit test: Unread count correct
  - [ ] Test: Read status updates

---

## 6. Transactions & Payments

### 6.1 Stripe Integration Setup
- [ ] **Backend**
  - [ ] Stripe SDK installed
  - [ ] Environment variables configured
  - [ ] Webhook secret stored
  - [ ] Stripe customer ID stored per user (optional)

- [ ] **Testing**
  - [ ] Stripe test keys working
  - [ ] SDK initialization

### 6.2 Create Transaction
- [ ] **Backend**
  - [ ] POST /transactions endpoint
  - [ ] Create transaction record
  - [ ] type: MONEY, CREDITS, or HYBRID
  - [ ] amount, toUserId parameters
  - [ ] Initial status: PENDING
  - [ ] Optional description
  - [ ] JwtAuthGuard applied
  - [ ] User can't send to self

- [ ] **Frontend**
  - [ ] Transaction form
  - [ ] Select recipient (or pre-filled)
  - [ ] Amount input
  - [ ] Transaction type selection
  - [ ] Description (optional)
  - [ ] Submit button

- [ ] **Testing**
  - [ ] Unit test: Transaction created
  - [ ] Test: Self-transaction rejected
  - [ ] Test: Invalid amount rejected

### 6.3 Stripe Payment Processing
- [ ] **Backend**
  - [ ] Accept payment method token
  - [ ] Create Stripe payment intent
  - [ ] Capture payment intent
  - [ ] Handle Stripe responses
  - [ ] Update transaction status to COMPLETED
  - [ ] Create transaction ledger entry
  - [ ] Handle payment failures

- [ ] **Frontend**
  - [ ] Integrate Stripe Elements
  - [ ] Card input form
  - [ ] CVV, expiry, postal code
  - [ ] Processing indicator
  - [ ] Error messages
  - [ ] Success confirmation

- [ ] **Testing**
  - [ ] Integration test: Payment succeeds
  - [ ] Test: Invalid card rejected
  - [ ] Test: Insufficient funds handled

### 6.4 Stripe Webhooks
- [ ] **Backend**
  - [ ] POST /webhooks/stripe endpoint
  - [ ] Verify webhook signature
  - [ ] Handle payment_intent.succeeded
  - [ ] Handle payment_intent.payment_failed
  - [ ] Handle charge.refunded
  - [ ] Update transaction status
  - [ ] Send notifications to users

- [ ] **Testing**
  - [ ] Unit test: Webhook verification
  - [ ] Test: Transaction status updated on webhook

### 6.5 Internal Credit System
- [ ] **Backend**
  - [ ] CreditWallet table per user
  - [ ] Initial balance = 0
  - [ ] POST /credits/transfer endpoint
  - [ ] Transfer credits between users
  - [ ] Update wallet balance
  - [ ] Create transaction ledger entries
  - [ ] No Stripe involved for credits

- [ ] **Frontend**
  - [ ] Credit transfer form
  - [ ] Display current balance
  - [ ] Select recipient
  - [ ] Amount input
  - [ ] Message (optional)
  - [ ] Confirm and send

- [ ] **Testing**
  - [ ] Unit test: Credit transfer
  - [ ] Test: Insufficient balance rejected
  - [ ] Integration test: Ledger entries created

### 6.6 Transaction Ledger
- [ ] **Backend**
  - [ ] TransactionLedger table (append-only)
  - [ ] Record all credit movements
  - [ ] Immutable historical record
  - [ ] Include description, user, amount, type (debit/credit)

- [ ] **Testing**
  - [ ] Test: Ledger entries created on transaction
  - [ ] Test: Ledger is append-only (no deletes)

### 6.7 Wallet Balance
- [ ] **Backend**
  - [ ] GET /wallet endpoint
  - [ ] Return current balance
  - [ ] Return currency
  - [ ] Return lastUpdated timestamp
  - [ ] JwtAuthGuard applied

- [ ] **Frontend**
  - [ ] Display balance in header/sidebar
  - [ ] Update on transactions
  - [ ] Wallet detail page with history

- [ ] **Testing**
  - [ ] Unit test: Balance returned correctly
  - [ ] Test: Balance updated after transaction

### 6.8 Transaction History
- [ ] **Backend**
  - [ ] GET /transactions endpoint
  - [ ] Return user's transactions
  - [ ] Pagination (limit, offset)
  - [ ] Filter by status, type
  - [ ] Sort by date (newest first)
  - [ ] Include other user info (name, avatar)

- [ ] **Frontend**
  - [ ] Transactions list/table
  - [ ] With date, amount, other party, status
  - [ ] Filter dropdown
  - [ ] Status badges (pending, completed, failed)
  - [ ] Click for details

- [ ] **Testing**
  - [ ] Unit test: Returns correct transactions
  - [ ] Test: Filtering works
  - [ ] Test: Pagination works

### 6.9 Refund Processing
- [ ] **Backend**
  - [ ] POST /transactions/{id}/refund endpoint
  - [ ] Only admin/receiver can refund
  - [ ] Stripe refund request
  - [ ] Update transaction status to REFUNDED
  - [ ] Reverse ledger entries
  - [ ] Notify users

- [ ] **Frontend**
  - [ ] Refund button (relevant cases only)
  - [ ] Reason input
  - [ ] Confirmation dialog

- [ ] **Testing**
  - [ ] Integration test: Refund succeeds
  - [ ] Test: Ledger reversed

### 6.10 Transaction Notifications
- [ ] **Backend**
  - [ ] Send email on payment received
  - [ ] Send email on payment failed
  - [ ] Push notification (future)

- [ ] **Frontend**
  - [ ] Toast notification on transaction

- [ ] **Testing**
  - [ ] Integration test: Email sent

---

## 7. Reputation & Reviews

### 7.1 Create Review
- [ ] **Backend**
  - [ ] POST /reviews endpoint
  - [ ] rating (1-5), comment, category
  - [ ] fromUserId = current user
  - [ ] toUserId = mentioned in request
  - [ ] Only one review per user pair per category
  - [ ] JwtAuthGuard applied
  - [ ] User can't review self
  - [ ] Notification to reviewed user

- [ ] **Frontend**
  - [ ] Review form
  - [ ] Star rating (1-5 interactive)
  - [ ] Category dropdown (communication, reliability, quality, etc.)
  - [ ] Comment textarea
  - [ ] Submit button
  - [ ] Success notification

- [ ] **Testing**
  - [ ] Unit test: Review created
  - [ ] Test: Duplicate review prevented
  - [ ] Test: Self-review rejected
  - [ ] Test: Validation works

### 7.2 Get User Reviews
- [ ] **Backend**
  - [ ] GET /users/{userId}/reviews endpoint
  - [ ] Return all reviews for user
  - [ ] Include reviewer name & avatar
  - [ ] Include rating, comment, category, date
  - [ ] Pagination

- [ ] **Frontend**
  - [ ] Reviews section on public profile
  - [ ] Reviewer name with avatar
  - [ ] Star display
  - [ ] Comment text
  - [ ] Date posted
  - [ ] Pagination/infinite scroll

- [ ] **Testing**
  - [ ] Unit test: Reviews returned
  - [ ] Test: Pagination works

### 7.3 Average Reputation Score
- [ ] **Backend**
  - [ ] Calculate average rating for user
  - [ ] Weighted by recency (optional)
  - [ ] Update User profile on review creation
  - [ ] Stored in reputationScore field
  - [ ] Rounded to 2 decimals

- [ ] **Frontend**
  - [ ] Display as stars or percentage
  - [ ] Show in profile header
  - [ ] Show in match cards
  - [ ] Show count (e.g., "4.7 (24 reviews)")

- [ ] **Testing**
  - [ ] Unit test: Average calculated correctly
  - [ ] Test: Score updates on new review

### 7.4 Edit Review
- [ ] **Backend**
  - [ ] PATCH /reviews/{reviewId} endpoint
  - [ ] Only reviewer can edit
  - [ ] Can edit rating and comment
  - [ ] Limit edit window (e.g., 48 hours)
  - [ ] Update reputation score

- [ ] **Frontend**
  - [ ] Edit button on own reviews
  - [ ] Modal to edit
  - [ ] Save/cancel buttons

- [ ] **Testing**
  - [ ] Unit test: Owner can edit
  - [ ] Test: Other user can't edit

### 7.5 Delete Review
- [ ] **Backend**
  - [ ] DELETE /reviews/{reviewId} endpoint
  - [ ] Only reviewer or admin can delete
  - [ ] Update reputation score
  - [ ] Soft delete (optional)

- [ ] **Frontend**
  - [ ] Delete button
  - [ ] Confirm dialog
  - [ ] Remove from UI

- [ ] **Testing**
  - [ ] Unit test: Owner can delete
  - [ ] Test: Score updated

### 7.6 Review Badges/Achievements
- [ ] **Backend**
  - [ ] Optional: Badge system
  - [ ] "Highly Rated" (avg > 4.5)
  - [ ] "Trusted Partner" (20+ reviews)
  - [ ] "Responsive" (reply < 24h)
  - [ ] Store with user

- [ ] **Frontend**
  - [ ] Display badges on profile
  - [ ] Tooltip with explanation

- [ ] **Testing**
  - [ ] Test: Badges awarded correctly

---

## 8. Admin & Moderation

### 8.1 Report System
- [ ] **Backend**
  - [ ] POST /reports endpoint
  - [ ] Report user for violation
  - [ ] Reason (harassment, fraud, spam, etc.)
  - [ ] Description
  - [ ] reportedUserId, reportedByUserId
  - [ ] Initial status: PENDING
  - [ ] Notification to admins

- [ ] **Frontend**
  - [ ] Report button on profiles
  - [ ] Report form/modal
  - [ ] Reason dropdown
  - [ ] Description textarea
  - [ ] Anonymous option (optional)
  - [ ] Confirmation message

- [ ] **Testing**
  - [ ] Unit test: Report created
  - [ ] Test: Required fields validation

### 8.2 Admin Report Dashboard
- [ ] **Backend**
  - [ ] GET /admin/reports endpoint
  - [ ] RolesGuard (admin only)
  - [ ] Return pending reports
  - [ ] Filter by status
  - [ ] Pagination
  - [ ] Include reporter name, reported user, reason, date

- [ ] **Frontend**
  - [ ] Admin reports page
  - [ ] Table of reports
  - [ ] Filter (pending, investigating, resolved)
  - [ ] Click to view details
  - [ ] Action buttons

- [ ] **Testing**
  - [ ] Test: Non-admin can't access
  - [ ] Test: Returns correct reports

### 8.3 Investigate Report
- [ ] **Backend**
  - [ ] PATCH /reports/{id} endpoint
  - [ ] Update status to INVESTIGATING
  - [ ] admin can set notes
  - [ ] RolesGuard applied

- [ ] **Frontend**
  - [ ] Update status in admin panel
  - [ ] Notes field
  - [ ] Save button

- [ ] **Testing**
  - [ ] Test: Status updated

### 8.4 Resolve Report
- [ ] **Backend**
  - [ ] PATCH /reports/{id} endpoint
  - [ ] Update status to RESOLVED
  - [ ] Include resolution/action taken
  - [ ] Possible actions: ban, suspend, warn, dismiss
  - [ ] Optional: Apply action (ban user, etc.)

- [ ] **Frontend**
  - [ ] Resolution dropdown
  - [ ] Notes/reason field
  - [ ] Apply action button
  - [ ] Confirmation

- [ ] **Testing**
  - [ ] Test: Report resolved
  - [ ] Test: Associated action executed

### 8.5 Suspend User
- [ ] **Backend**
  - [ ] PATCH /admin/users/{userId}/suspend endpoint
  - [ ] Update user status to SUSPENDED
  - [ ] Duration (e.g., 7 days, 30 days, permanent)
  - [ ] Reason required
  - [ ] Auto-unsuspend if date-based
  - [ ] Email notification to user
  - [ ] RolesGuard applied
  - [ ] Audit log

- [ ] **Frontend**
  - [ ] Suspend button in admin
  - [ ] Duration dropdown
  - [ ] Reason textarea
  - [ ] Confirmation dialog

- [ ] **Testing**
  - [ ] Unit test: User suspended
  - [ ] Test: Suspended user can't login
  - [ ] Test: Auto-unsuspend works (date-based)

### 8.6 Ban User
- [ ] **Backend**
  - [ ] PATCH /admin/users/{userId}/ban endpoint
  - [ ] Update user status to BANNED
  - [ ] Reason required
  - [ ] Permanent action
  - [ ] Email notification
  - [ ] RolesGuard applied
  - [ ] Audit log

- [ ] **Frontend**
  - [ ] Ban button
  - [ ] Reason field
  - [ ] Confirmation dialog
  - [ ] Warning message

- [ ] **Testing**
  - [ ] Unit test: User banned
  - [ ] Test: Banned user can't login
  - [ ] Test: Can't send/receive messages

### 8.7 Admin Dashboard
- [ ] **Backend**
  - [ ] GET /admin/dashboard endpoint
  - [ ] Return key metrics:
    - Total users, active users
    - Transactions count & value
    - Reported users count
    - System uptime
  - [ ] RolesGuard applied

- [ ] **Frontend**
  - [ ] Dashboard page
  - [ ] KPI cards (users, transactions, reports)
  - [ ] Charts (users over time, transactions)
  - [ ] Recent reports list
  - [ ] System status

- [ ] **Testing**
  - [ ] Test: Non-admin can't access
  - [ ] Test: Metrics calculated correctly

### 8.8 Audit Logs
- [ ] **Backend**
  - [ ] Log user logins
  - [ ] Log admin actions (ban, suspend, etc.)
  - [ ] Log transactions
  - [ ] GET /admin/audit-logs endpoint
  - [ ] Filter by action, user, date range
  - [ ] RolesGuard applied

- [ ] **Frontend**
  - [ ] Audit logs page (admin)
  - [ ] Table with action, user, timestamp, details
  - [ ] Filter/search

- [ ] **Testing**
  - [ ] Test: Actions logged
  - [ ] Test: Filter works

### 8.9 Message Moderation
- [ ] **Backend**
  - [ ] Flag potentially toxic messages
  - [ ] Admin can delete message
  - [ ] Soft delete (history kept)
  - [ ] User notification on deletion
  - [ ] Optional: AI toxicity detection (Phase 2)

- [ ] **Frontend**
  - [ ] Report message button
  - [ ] Admin interface to review/delete

- [ ] **Testing**
  - [ ] Test: Message deleted
  - [ ] Test: History kept

---

## 9. Notifications

### 9.1 Email Service Setup
- [ ] **Backend**
  - [ ] SendGrid or Resend SDK configured
  - [ ] API key in environment
  - [ ] From email configured

- [ ] **Testing**
  - [ ] Test email sent successfully

### 9.2 Welcome Email
- [ ] **Backend**
  - [ ] Send on user registration
  - [ ] HTML template with links
  - [ ] Include verification link (if email verification enabled)
  - [ ] Personalized greeting

- [ ] **Frontend**
  - [ ] N/A

- [ ] **Testing**
  - [ ] Integration test: Email sent
  - [ ] Test: Contains expected data

### 9.3 Transaction Notifications
- [ ] **Backend**
  - [ ] Email on payment received
  - [ ] Email on payment failed
  - [ ] Include amount, date, other party
  - [ ] Link to transaction details

- [ ] **Frontend**
  - [ ] Toast notification on transaction

- [ ] **Testing**
  - [ ] Test: Email sent on receipt
  - [ ] Test: Email sent on failure

### 9.4 Message Notifications
- [ ] **Backend**
  - [ ] Email on new message (optional - per preference)
  - [ ] Include message preview
  - [ ] Link to conversation

- [ ] **Frontend**
  - [ ] Toast notification on new message
  - [ ] Badge on conversations list
  - [ ] Browser notification (PWA)

- [ ] **Testing**
  - [ ] Test: Notification sent
  - [ ] Test: Per user preferences respected

### 9.5 Review Notifications
- [ ] **Backend**
  - [ ] Email when user receives review
  - [ ] Include reviewer name, rating, comment
  - [ ] Link to profile/review

- [ ] **Frontend**
  - [ ] Toast notification

- [ ] **Testing**
  - [ ] Test: Email sent on review

### 9.6 Notification Preferences
- [ ] **Backend**
  - [ ] User notification settings table
  - [ ] Flag for each notification type:
    - EMAIL_ON_MESSAGE
    - EMAIL_ON_TRANSACTION
    - EMAIL_ON_REVIEW
    - EMAIL_ON_MATCH
    - etc.
  - [ ] GET/PATCH /users/me/notifications

- [ ] **Frontend**
  - [ ] Notification preferences page
  - [ ] Toggle each type
  - [ ] Save button
  - [ ] Success message

- [ ] **Testing**
  - [ ] Unit test: Preferences saved
  - [ ] Test: Notifications respect preferences

### 9.7 Unsubscribe Link
- [ ] **Backend**
  - [ ] Add unsubscribe token to emails
  - [ ] GET /emails/unsubscribe/{token} endpoint
  - [ ] Disable email notifications
  - [ ] Confirmation page

- [ ] **Frontend**
  - [ ] Unsubscribe confirmation page

- [ ] **Testing**
  - [ ] Test: Unsubscribe works

---

## 10. Frontend - General

### 10.1 Layout Components
- [ ] **Header**
  - [ ] Logo/branding
  - [ ] Navigation links
  - [ ] User avatar dropdown
  - [ ] Notifications bell
  - [ ] Logout button
  - [ ] Responsive (mobile menu)

- [ ] **Sidebar (if applicable)**
  - [ ] Navigation menu
  - [ ] Collapse/expand
  - [ ] Highlight active page

- [ ] **Footer**
  - [ ] Links (terms, privacy, contact)
  - [ ] Social links
  - [ ] Copyright

- [ ] **Testing**
  - [ ] Responsive design (mobile, tablet, desktop)
  - [ ] Navigation works

### 10.2 Forms & Validation
- [ ] **General**
  - [ ] Client-side validation (React Hook Form + Zod)
  - [ ] Server-side validation errors displayed
  - [ ] Loading states on submit
  - [ ] Error messages clear
  - [ ] Success notifications
  - [ ] Form accessibility (labels, aria)

- [ ] **Testing**
  - [ ] Test: Validation works
  - [ ] Test: Errors displayed
  - [ ] Test: Accessibility compliant

### 10.3 Theme & Styling
- [ ] **Design**
  - [ ] Tailwind CSS applied
  - [ ] shadcn/ui components used
  - [ ] Consistent color palette
  - [ ] Typography hierarchy
  - [ ] Dark mode support (optional Phase 2)

- [ ] **Testing**
  - [ ] Visual consistency across pages
  - [ ] Responsive design verified

### 10.4 Loading States
- [ ] **UI**
  - [ ] Skeleton loaders
  - [ ] Spinners on buttons
  - [ ] Loading placeholders

- [ ] **Testing**
  - [ ] Test: Loading states show during requests

### 10.5 Error Handling
- [ ] **UI**
  - [ ] Error toasts/notifications
  - [ ] Error pages (404, 500)
  - [ ] Network error handling
  - [ ] Fallback UI

- [ ] **Testing**
  - [ ] Test: Errors displayed correctly

### 10.6 Internationalization (i18n)
- [ ] **Setup**
  - [ ] i18n framework (next-i18n-router)
  - [ ] Translation files (en, fr, es optional)
  - [ ] Default language selector
  - [ ] RTL support (optional)

- [ ] **Content**
  - [ ] All user-facing text translated
  - [ ] Date/number formatting per locale
  - [ ] Links updated for locale

- [ ] **Testing**
  - [ ] Test: Language switcher works
  - [ ] Test: Content translates
  - [ ] Test: Routes include locale

---

## 11. Security & Privacy

### 11.1 Password Security
- [ ] **Backend**
  - [ ] Bcrypt hashing (10+ rounds)
  - [ ] No plain passwords logged
  - [ ] Password reset token handling
  - [ ] Strong password requirements enforced

- [ ] **Frontend**
  - [ ] No password storage in localStorage
  - [ ] Only in secure cookies
  - [ ] Password strength indicator

- [ ] **Testing**
  - [ ] Test: Password hashing works
  - [ ] Test: Plain password never logged

### 11.2 HTTPS/TLS
- [ ] **Backend**
  - [ ] SSL certificate installed
  - [ ] HTTPS enforced
  - [ ] HSTS header set
  - [ ] Redirect HTTP to HTTPS

- [ ] **Frontend**
  - [ ] All assets served over HTTPS
  - [ ] External resources HTTPS

- [ ] **Testing**
  - [ ] Test: HTTPS enforced

### 11.3 CSRF Protection
- [ ] **Backend**
  - [ ] CSRF tokens generated
  - [ ] Validated on state-changing requests
  - [ ] Tokens in cookies + body/header

- [ ] **Frontend**
  - [ ] Include CSRF token in requests
  - [ ] Updated per session

- [ ] **Testing**
  - [ ] Test: CSRF token validation

### 11.4 SQL Injection Prevention
- [ ] **Backend**
  - [ ] Use Prisma ORM (parameterized queries)
  - [ ] No raw SQL (or carefully escaped)
  - [ ] Input validation

- [ ] **Testing**
  - [ ] Test: Malicious input rejected

### 11.5 XSS Prevention
- [ ] **Backend**
  - [ ] Content-Security-Policy header
  - [ ] Input sanitization (if storing HTML)
  - [ ] Output encoding

- [ ] **Frontend**
  - [ ] React auto-escapes by default
  - [ ] dangerouslySetInnerHTML avoided
  - [ ] Sanitize user-generated content before display

- [ ] **Testing**
  - [ ] Test: XSS payload rejected

### 11.6 Rate Limiting
- [ ] **Backend**
  - [ ] Rate limiter on login endpoint (failed attempts)
  - [ ] Global rate limiter on API (100 req/min per user)
  - [ ] Per-endpoint limits (transaction creation, etc.)

- [ ] **Frontend**
  - [ ] Prevent double-submit (button disabled)
  - [ ] Ignore rapid repeated requests

- [ ] **Testing**
  - [ ] Test: Rate limit enforced
  - [ ] Test: Error on exceeding limit

### 11.7 Data Encryption
- [ ] **Backend**
  - [ ] Sensitive data encrypted at rest (passwords, API keys)
  - [ ] Encryption key managed securely
  - [ ] TLS in transit

- [ ] **Testing**
  - [ ] Test: Data encrypted in database

### 11.8 GDPR Compliance
- [ ] **Backend**
  - [ ] Data export endpoint (user data JSON)
  - [ ] Account deletion endpoint (soft delete or full)
  - [ ] Audit trail for deletion
  - [ ] No retention of deleted data (except audit)
  - [ ] Privacy policy linked
  - [ ] Cookie consent banner

- [ ] **Frontend**
  - [ ] "Download my data" button
  - [ ] "Delete account" button
  - [ ] Confirmation dialog
  - [ ] Cookie consent banner on first visit

- [ ] **Testing**
  - [ ] Test: Data export works
  - [ ] Test: Account deletion works
  - [ ] Test: Deleted data not accessible

### 11.9 Third-party Libraries Security
- [ ] **Dependency Management**
  - [ ] npm audit regularly
  - [ ] Dependabot enabled
  - [ ] Security patches applied promptly
  - [ ] Unused dependencies removed

- [ ] **Testing**
  - [ ] CI runs npm audit

---

## 12. Performance & Optimization

### 12.1 Database Query Optimization
- [ ] **Backend**
  - [ ] Indexes on frequently queried columns
  - [ ] N+1 query prevention (select/include)
  - [ ] Query execution plans analyzed
  - [ ] Pagination on large result sets
  - [ ] Soft deletes for historical data

- [ ] **Testing**
  - [ ] Test: Slow queries identified and fixed

### 12.2 Caching Strategy
- [ ] **Backend**
  - [ ] Redis caching for:
    - User data (1h TTL)
    - Skills (24h TTL)
    - Matching results (30m TTL)
    - Conversation last message (5m TTL)
  - [ ] Cache invalidation on updates
  - [ ] Graceful degradation if cache fails

- [ ] **Frontend**
  - [ ] Browser caching headers set
  - [ ] Static assets cached
  - [ ] API response caching (React Query)

- [ ] **Testing**
  - [ ] Test: Cache hit/miss
  - [ ] Test: Cache invalidation works

### 12.3 Frontend Bundle Optimization
- [ ] **Frontend**
  - [ ] Code splitting per route
  - [ ] Dynamic imports for heavy components
  - [ ] Tree-shaking enabled
  - [ ] Image optimization (WebP, CDN)
  - [ ] CSS purging (Tailwind)
  - [ ] Bundle size < 150KB gzipped

- [ ] **Testing**
  - [ ] Test: Bundle size tracked
  - [ ] Test: Load time < 3s on 3G

### 12.4 API Response Time
- [ ] **Backend**
  - [ ] Average response time < 200ms (p95)
  - [ ] Async processing for long operations
  - [ ] Queue jobs (BullMQ) for send emails, etc.

- [ ] **Testing**
  - [ ] Monitoring/alerting on response times

### 12.5 Image Optimization
- [ ] **Backend**
  - [ ] Resize uploads to reasonable dimensions
  - [ ] Generate thumbnails for profiles
  - [ ] Store on CDN/S3 with compression

- [ ] **Frontend**
  - [ ] Use next/image component
  - [ ] Lazy loading
  - [ ] Responsive srcset

- [ ] **Testing**
  - [ ] Test: Images optimized

### 12.6 Database Connection Pooling
- [ ] **Backend**
  - [ ] Connection pool configured
  - [ ] Max connections per service
  - [ ] Connection timeout handling

- [ ] **Testing**
  - [ ] Test: Connection pool doesn't exhaust

---

## 13. Testing Coverage

### 13.1 Unit Tests
- [ ] **Backend**
  - [ ] All services tested
  - [ ] Controller endpoints tested
  - [ ] Guard logic tested
  - [ ] Validation logic tested
  - [ ] Target coverage: 80%+

- [ ] **Frontend**
  - [ ] Components tested (React Testing Library)
  - [ ] Hooks tested
  - [ ] Utilities tested
  - [ ] Target coverage: 70%+

- [ ] **Testing**
  - [ ] `npm run test` passes
  - [ ] Coverage reports generated

### 13.2 Integration Tests
- [ ] **Backend**
  - [ ] Database operations tested
  - [ ] API endpoints tested end-to-end
  - [ ] Cache interactions tested
  - [ ] Third-party API mocks

- [ ] **Testing**
  - [ ] `npm run test:integration` passes

### 13.3 E2E Tests
- [ ] **Frontend**
  - [ ] Critical user journeys tested (login, match, message, pay)
  - [ ] Form submissions tested
  - [ ] Navigation tested
  - [ ] WebSocket comms tested

- [ ] **Testing**
  - [ ] `npm run test:e2e` passes
  - [ ] Test on multiple browsers (Chrome, Firefox)

---

## 14. Deployment & DevOps

### 14.1 CI/CD Pipeline
- [ ] **GitHub Actions**
  - [ ] Tests run on PR
  - [ ] Linting checked
  - [ ] Build succeeds
  - [ ] Coverage reports
  - [ ] Auto-deploy on merge to main

- [ ] **Testing**
  - [ ] Workflow file configured
  - [ ] All checks pass

### 14.2 Docker & Containerization
- [ ] **Backend**
  - [ ] Dockerfile created
  - [ ] Multi-stage build (dev vs prod)
  - [ ] .dockerignore configured
  - [ ] Image size optimized

- [ ] **Frontend**
  - [ ] Dockerfile for Next.js
  - [ ] Production build optimized

- [ ] **Testing**
  - [ ] Docker build succeeds
  - [ ] Container runs correctly

### 14.3 Database Migrations
- [ ] **Setup**
  - [ ] Prisma migrations created
  - [ ] Migration files reviewed
  - [ ] Rollback tested
  - [ ] Seed data script (optional)

- [ ] **Testing**
  - [ ] Migrations apply cleanly
  - [ ] Schema correct after migration

### 14.4 Environment Configuration
- [ ] **Setup**
  - [ ] .env.example populated
  - [ ] Dev, staging, prod configs separate
  - [ ] Secrets not in code
  - [ ] Vault or AWS Secrets Manager integration (optional Phase 2)

- [ ] **Testing**
  - [ ] App starts with correct env vars

### 14.5 Logging & Monitoring
- [ ] **Backend**
  - [ ] Structured logging (Pino/Winston)
  - [ ] Log level configurable
  - [ ] Request ID tracking
  - [ ] Error stack traces logged
  - [ ] No sensitive data in logs

- [ ] **Frontend**
  - [ ] Console errors captured
  - [ ] Error reporting (Sentry)

- [ ] **Testing**
  - [ ] Log output verified
  - [ ] Sensitive data not logged

### 14.6 Production Readiness
- [ ] **Checklist**
  - [ ] HTTPS/SSL configured
  - [ ] Database backups scheduled
  - [ ] Monitoring alerting set up
  - [ ] Uptime tracking
  - [ ] Error tracking (Sentry)
  - [ ] Performance monitoring
  - [ ] Security headers set
  - [ ] CORS configured
  - [ ] Rate limiting enabled
  - [ ] Health check endpoint
  - [ ] Graceful shutdown

- [ ] **Testing**
  - [ ] Production checklist reviewed

---

# Phase 2: Microservices

## 1. Service Extraction

- [ ] Messaging Service extracted
- [ ] AI Service created
- [ ] Notification Service extracted
- [ ] API Gateway setup
- [ ] Event streaming (Kafka/RabbitMQ)
- [ ] Inter-service communication

---

# Phase 3: Global Scale

## 1. Multi-region Deployment

- [ ] CDN setup (Cloudflare)
- [ ] Multi-region database replication
- [ ] Load balancing
- [ ] Geographic routing
- [ ] Failover

---

# Phase 4: Public API

## 1. Public API Development

- [ ] API key management
- [ ] Developer portal
- [ ] SDK generation
- [ ] Rate limiting by tier
- [ ] Marketplace setup

---

## Usage Instructions

### How to Reference This Document

1. **For Development**: Check feature checklist before implementation
2. **For QA**: Use as comprehensive test plan
3. **For PM**: Track progress of phases
4. **For Status Reports**: Copy relevant sections

### Status Legend

- [ ] Not started (TODO)
- [x] Completed
- Status can be updated in-place

### Example: Tracking a Feature

```
### 2.1 User Profile (View Own)
- [x] **Backend**
  - [x] GET /users/me endpoint ← Done Mar 15
  - [x] Returns current authenticated user
  - [x] Includes profile data
  - [x] Includes skills
  - [ ] Includes reputation score ← In Progress
  - [x] JwtAuthGuard applied

- [ ] **Frontend**
  - [x] Profile page component
  - [ ] Display user name, email, bio ← In Progress
  ...
```

---

**Next Review Date:** 15 avril 2026  
**Document Owner:** Tech Lead  
**Last Modified:** 27 février 2026
