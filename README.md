# SkillCart — Complete Full-Stack Course Platform

SkillCart is a modern Udemy-like course buying and learning platform.

## Features

- Register/Login with JWT
- Admin user auto-created
- Admin course + lesson management
- Optional demo course seeding
- Public course browsing and search
- Razorpay test payment gateway
- Hidden mock-payment backend endpoint for emergency local testing
- Enrollment after successful payment
- My Learning page
- Text-based lesson reader
- Lesson completion and progress tracking
- Modern responsive UI using plain CSS, no Tailwind/PostCSS issues

## Project Structure

```text
skillcart-complete/
├── skillcart-backend/
└── skillcart-frontend/
```

## Backend Setup

1. Start MySQL.
2. Open `skillcart-backend/src/main/resources/application.properties`.
3. Change DB password if needed:

```properties
spring.datasource.username=root
spring.datasource.password=root
```

4. Razorpay setup is required for the main Buy button:

```properties
razorpay.key.id=rzp_test_xxxxx
razorpay.key.secret=xxxxx
```

5. Run backend:

```bash
cd skillcart-backend
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`.

Default admin:

```text
admin@skillcart.com
admin123
```

Demo courses are enabled by default:

```properties
app.seed.demo-courses=true
```

Set to `false` later when you only want real admin-added courses.

## Frontend Setup

```bash
cd skillcart-frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Demo Flow

1. Login as admin: `admin@skillcart.com / admin123`.
2. Manage courses from Admin page.
3. Register/login as a user.
4. Open a course.
5. Use Razorpay test checkout to buy a course.
6. Go to My Learning.
7. Read lessons and mark them complete.

## Razorpay Test Card

Use Razorpay's test checkout details from your Razorpay dashboard documentation. This project only stores Razorpay order/payment ids, never card details.


## Razorpay Notes

The frontend Buy button uses Razorpay only. Replace the placeholders in `application.properties` before testing payment:

```properties
razorpay.key.id=rzp_test_your_key_id
razorpay.key.secret=your_test_secret
```

Do not put quotes around the values. Restart the backend after changing these keys.
