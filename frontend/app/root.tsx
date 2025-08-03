// src/app/root.tsx
import {
  Outlet,
  ScrollRestoration,
  Scripts,
  Meta,
  Links,
  isRouteErrorResponse,
} from "react-router";
import { Toaster } from "react-hot-toast";
import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
    <Toaster
       
        toastOptions={{
          style: {
            background: "#000",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "16px",
            border: "1px solid #383939",
          },
          success: {
            iconTheme: {
              primary: "#4ade80",
              secondary: "#1d1d1d",
            },
          },
          error: {
            style: {
              background: "black",
              color: "#fff",
            },
             iconTheme: {
              primary: "#3d3d3d",
              secondary: "#fff",
            },
          },
        }}
      />
    <Outlet />
    </>
   
  )
  
}

export function ErrorBoundary({ error }: { error: any }) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
    </main>
  );
}
