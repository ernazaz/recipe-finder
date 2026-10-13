import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout";
import { ErrorPage } from "@/pages/ErrorPage";
import { FridgePage } from "@/pages/FridgePage";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { RecipePage } from "@/pages/RecipePage";
import { SavedPage } from "@/pages/SavedPage";
import { ShoppingListPage } from "@/pages/ShoppingListPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        // Errors render inside the layout so navigation stays available.
        errorElement: <ErrorPage />,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/recipes/:recipeId", element: <RecipePage /> },
          { path: "/fridge", element: <FridgePage /> },
          { path: "/saved", element: <SavedPage /> },
          { path: "/shopping-list", element: <ShoppingListPage /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
