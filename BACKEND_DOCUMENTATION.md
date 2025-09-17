# BoringFunnel Backend Documentation

## Overview

This document provides comprehensive documentation for the BoringFunnel backend infrastructure, including database schema, API endpoints, and implementation details.

## Database Schema

### Tables Overview

The database consists of 5 main tables designed for comprehensive CRO and analytics tracking:

1. **contacts** - Contact form submissions
2. **subscribers** - Email newsletter subscriptions
3. **analytics_events** - General analytics event tracking
4. **form_analytics** - Detailed form interaction tracking
5. **conversion_events** - Conversion and revenue tracking

### Table Details

#### 1. contacts

Stores contact form submissions with comprehensive tracking data.

**Columns:**
- `id` (UUID, Primary Key) - Unique identifier
- `name` (VARCHAR, NOT NULL) - Contact name
- `email` (VARCHAR, NOT NULL) - Contact email
- `company` (VARCHAR, NULLABLE) - Company name
- `message` (TEXT, NOT NULL) - Contact message
- `status` (VARCHAR, DEFAULT 'new') - Contact status (new, in_progress, responded, closed)
- `source` (VARCHAR, DEFAULT 'contact_form') - Submission source
- `ip_address` (INET) - Client IP address
- `user_agent` (TEXT) - Client user agent
- `referrer` (TEXT) - Page referrer
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` - UTM tracking
- `created_at`, `updated_at` (TIMESTAMPTZ) - Timestamps

**Indexes:**
- `idx_contacts_email` - Email lookup
- `idx_contacts_created_at` - Date sorting
- `idx_contacts_status` - Status filtering
- `idx_contacts_source` - Source filtering

#### 2. subscribers

Manages email newsletter subscriptions with status tracking.

**Columns:**
- `id` (UUID, Primary Key) - Unique identifier
- `email` (VARCHAR, UNIQUE, NOT NULL) - Subscriber email
- `status` (VARCHAR, DEFAULT 'active') - Status (active, unsubscribed, bounced)
- `source` (VARCHAR, DEFAULT 'newsletter_signup') - Subscription source
- `tags` (TEXT[]) - Subscriber tags
- `metadata` (JSONB) - Additional subscriber data
- `ip_address` (INET) - Client IP address
- `user_agent` (TEXT) - Client user agent
- `referrer` (TEXT) - Page referrer
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` - UTM tracking
- `confirmed_at` (TIMESTAMPTZ) - Email confirmation timestamp
- `unsubscribed_at` (TIMESTAMPTZ) - Unsubscribe timestamp
- `created_at`, `updated_at` (TIMESTAMPTZ) - Timestamps

**Indexes:**
- `idx_subscribers_email` - Email lookup
- `idx_subscribers_status` - Status filtering
- `idx_subscribers_created_at` - Date sorting
- `idx_subscribers_source` - Source filtering

#### 3. analytics_events

General purpose analytics event tracking.

**Columns:**
- `id` (UUID, Primary Key) - Unique identifier
- `session_id` (VARCHAR) - User session identifier
- `user_id` (VARCHAR) - User identifier
- `event_name` (VARCHAR, NOT NULL) - Event name
- `event_category` (VARCHAR) - Event category
- `event_action` (VARCHAR) - Event action
- `event_label` (VARCHAR) - Event label
- `event_value` (DECIMAL) - Event value
- `page_path`, `page_title`, `page_referrer` - Page information
- `custom_parameters` (JSONB) - Custom event data
- `ip_address` (INET) - Client IP address
- `user_agent` (TEXT) - Client user agent
- `device_type`, `browser`, `os` - Device information
- `country`, `city` - Geographic information
- `created_at` (TIMESTAMPTZ) - Timestamp

**Indexes:**
- `idx_analytics_events_session_id` - Session tracking
- `idx_analytics_events_event_name` - Event filtering
- `idx_analytics_events_created_at` - Date sorting
- `idx_analytics_events_page_path` - Page filtering

#### 4. form_analytics

Detailed form interaction tracking for CRO optimization.

**Columns:**
- `id` (UUID, Primary Key) - Unique identifier
- `session_id` (VARCHAR) - User session identifier
- `form_id` (VARCHAR, NOT NULL) - Form identifier
- `form_name` (VARCHAR) - Form name
- `field_name` (VARCHAR) - Field name
- `event_type` (VARCHAR, NOT NULL) - Event type (focus, blur, input, submit, abandon)
- `field_value_length` (INTEGER) - Length of field value
- `time_spent_seconds` (INTEGER) - Time spent on field
- `completion_rate` (DECIMAL) - Form completion rate
- `step_number`, `total_steps` - Multi-step form tracking
- `page_path` (VARCHAR) - Page path
- `custom_data` (JSONB) - Custom form data
- `created_at` (TIMESTAMPTZ) - Timestamp

**Indexes:**
- `idx_form_analytics_session_id` - Session tracking
- `idx_form_analytics_form_id` - Form filtering
- `idx_form_analytics_created_at` - Date sorting

#### 5. conversion_events

Conversion and revenue tracking.

**Columns:**
- `id` (UUID, Primary Key) - Unique identifier
- `session_id` (VARCHAR) - User session identifier
- `user_id` (VARCHAR) - User identifier
- `event_name` (VARCHAR, NOT NULL) - Conversion event name
- `conversion_value` (DECIMAL) - Conversion value
- `currency` (VARCHAR, DEFAULT 'USD') - Currency code
- `transaction_id` (VARCHAR) - Transaction identifier
- `items` (JSONB) - Transaction items
- `source`, `medium`, `campaign` - Attribution data
- `custom_parameters` (JSONB) - Custom conversion data
- `created_at` (TIMESTAMPTZ) - Timestamp

**Indexes:**
- `idx_conversion_events_session_id` - Session tracking
- `idx_conversion_events_event_name` - Event filtering
- `idx_conversion_events_created_at` - Date sorting

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### Public Access Policies
- **INSERT**: Public users can insert data into all tables (for form submissions and analytics)
- **UPDATE**: Limited update access (e.g., unsubscribe functionality for subscribers)

### Service Role Policies
- **FULL ACCESS**: Service role has complete access to all tables for admin operations

## API Endpoints

### 1. Contact Form API

**Endpoint:** `POST /api/contact`

**Description:** Handles contact form submissions with validation and analytics tracking.

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "company": "string (optional)",
  "message": "string (required, min 10 chars)"
}
```

**Response:**
```json
{
  "message": "Contact form submitted successfully",
  "data": {
    "id": "uuid"
  }
}
```

**Features:**
- Input validation with detailed error messages
- Automatic IP address and user agent tracking
- UTM parameter extraction from referrer
- Automatic analytics event tracking
- Proper error handling

### 2. Newsletter Subscription API

**Endpoint:** `POST /api/subscribe`

**Description:** Handles newsletter subscriptions with duplicate checking and reactivation.

**Request Body:**
```json
{
  "email": "string (required, valid email)",
  "source": "string (optional)",
  "tags": ["string"] (optional),
  "metadata": {} (optional)
}
```

**Response:**
```json
{
  "message": "Subscribed successfully",
  "data": {
    "id": "uuid"
  }
}
```

**Endpoint:** `PATCH /api/subscribe`

**Description:** Handles newsletter unsubscriptions.

**Request Body:**
```json
{
  "email": "string (required, valid email)"
}
```

**Features:**
- Duplicate email handling with reactivation
- Automatic confirmation
- UTM parameter tracking
- Analytics event tracking
- Unsubscribe functionality

### 3. Analytics APIs

#### General Analytics Events

**Endpoint:** `POST /api/analytics/events`

**Description:** Tracks general analytics events (supports batch processing).

**Request Body:**
```json
{
  "event_name": "string (required)",
  "event_category": "string (optional)",
  "event_action": "string (optional)",
  "event_label": "string (optional)",
  "event_value": "number (optional)",
  "session_id": "string (optional)",
  "user_id": "string (optional)",
  "page_path": "string (optional)",
  "page_title": "string (optional)",
  "custom_parameters": {} (optional)
}
```

#### Form Analytics

**Endpoint:** `POST /api/analytics/form`

**Description:** Tracks detailed form interactions (supports batch processing).

**Request Body:**
```json
{
  "form_id": "string (required)",
  "event_type": "focus|blur|input|submit|abandon (required)",
  "form_name": "string (optional)",
  "field_name": "string (optional)",
  "field_value_length": "number (optional)",
  "time_spent_seconds": "number (optional)",
  "completion_rate": "number (optional, 0-100)",
  "session_id": "string (optional)",
  "custom_data": {} (optional)
}
```

#### Conversion Events

**Endpoint:** `POST /api/analytics/conversions`

**Description:** Tracks conversion events and revenue (supports batch processing).

**Request Body:**
```json
{
  "event_name": "string (required)",
  "conversion_value": "number (optional)",
  "currency": "string (optional, default: USD)",
  "transaction_id": "string (optional)",
  "items": [] (optional),
  "session_id": "string (optional)",
  "user_id": "string (optional)",
  "custom_parameters": {} (optional)
}
```

## Error Handling

All APIs implement comprehensive error handling:

- **400 Bad Request**: Validation errors with detailed messages
- **404 Not Found**: Resource not found
- **405 Method Not Allowed**: Unsupported HTTP methods
- **500 Internal Server Error**: Server-side errors

Error Response Format:
```json
{
  "error": "Error message",
  "details": ["Detailed error messages"]
}
```

## Security Features

1. **Input Validation**: All inputs are validated for type, format, and constraints
2. **Row Level Security**: Database-level access control
3. **IP Address Tracking**: For security monitoring and geolocation
4. **Rate Limiting**: Can be implemented at the reverse proxy level
5. **SQL Injection Protection**: Parameterized queries via Supabase
6. **XSS Protection**: Input sanitization and validation

## TypeScript Integration

Full TypeScript support with generated database types:

```typescript
import { Database } from '@/types/database'
import { supabase } from '@/lib/supabase'

// Fully typed database operations
const { data, error } = await supabase
  .from('contacts')
  .insert([contactData])
  .select()
```

## Analytics Integration

The backend is designed to integrate with:

- Google Analytics 4 (GA4)
- Custom analytics dashboards
- CRO optimization tools
- Email marketing platforms
- Customer relationship management (CRM) systems

## Monitoring and Observability

Recommended monitoring setup:

1. **Database Monitoring**: Query performance, connection pools
2. **API Monitoring**: Response times, error rates
3. **Security Monitoring**: Failed login attempts, suspicious IPs
4. **Analytics Monitoring**: Event tracking accuracy, data quality

## Deployment Considerations

1. **Environment Variables**: Properly configured Supabase URLs and keys
2. **Database Migrations**: Version-controlled schema changes
3. **Index Monitoring**: Performance optimization as data grows
4. **Backup Strategy**: Regular database backups
5. **Scaling**: Consider read replicas for analytics queries

## Future Enhancements

Potential improvements:

1. **Real-time Analytics**: WebSocket connections for live data
2. **Advanced Segmentation**: User cohort analysis
3. **A/B Testing**: Built-in experimentation framework
4. **Machine Learning**: Predictive analytics and recommendations
5. **API Rate Limiting**: Enhanced security and performance
6. **Data Export**: CSV/JSON export functionality
7. **Admin Dashboard**: Web interface for data management

---

This backend infrastructure provides a solid foundation for the BoringFunnel project with comprehensive CRO features, analytics tracking, and scalability considerations.