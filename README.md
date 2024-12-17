# The Wild Oasis Website

**The Wild Oasis Website** is a modern booking platform for cabins and hotels, featuring a seamless user experience for managing reservations. Built with Next.js and TypeScript.

---

## Features

- **CRUD Operations**: Create, read, update, and delete reservations.
- **Authentication & Authorization**: Secure login with Google OAuth powered by NextAuth (Auth.js).
- **Guest Profile Management**: Update and manage guest profile.
- **Advanced Filtering**: filter cabins by max capacity of guests.
- **Data-Driven UI**: Dynamic updates with server-side rendering, caching, and revalidation.

---

## Key Concepts Learned

This project serves as an in-depth exploration of **Next.js** fundamentals and advanced features, including:

- **Project Structure**: Organizing files and folders for scalability and maintainability.
- **Routing**: Using file-based routing and dynamic route handlers.
- **Rendering Methods**: Static Site Generation (SSG), Server-Side Rendering (SSR), and Incremental Static Regeneration (ISR).
- **Data Fetching**: Utilizing `getServerSideProps`, `getStaticProps`, and API routes.
- **Caching & Revalidation**: Efficiently managing and invalidating cached data.
- **Error Handling**: Building resilient applications with robust error boundaries.
- **NextAuth**: Implementing secure authentication workflows.
- **Server Actions**: Handling logic directly on the server using `useFormStatus` and `useTransitionHook`.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Roenan12/the-wild-oasis-website.git
   ```
2. Navigate to the project directory:

```bash
  cd the-wild-oasis-website
```

3. Install dependencies:

```bash
    npm install
```

4. Configure environment variables:

```bash
    cp .env.example .env.local
```

- Add the required environment variables.

5. Start the development server:

```bash
npm run dev
```

6. Open your browser and visit `http://localhost:3000`.

## Usage

- Sign in using your Google account to access the app.
- Browse and filter available cabins to find your ideal stay.
- Create a reservation, update details, or cancel bookings as needed.
- Manage your guest profile to keep your information up-to-date.

---

## Technologies Used

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Hosting**: [Supabase](https://supabase.com/)
- **Authentication**: [NextAuth/Auth.js](https://authjs.dev/)
- **Other libraries**:
  - [date-fns](https://date-fns.org/)
  - [React Day Picker](https://react-day-picker.js.org/)
  - [React Hero Icons](https://heroicons.com/)

---

## Acknowledgements

This app was developed as part of the [Udemy course](https://www.udemy.com/course/the-ultimate-react-course/) by Jonas Schmedtmann.  
Special thanks to Jonas for his excellent teaching and guidance throughout the course.
