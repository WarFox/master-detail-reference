import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { Toast } from '@base-ui/react/toast'
import './index.css'
import { createAppRouter } from './router.tsx'

const queryClient = new QueryClient()
const router = createAppRouter(queryClient)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toast.Provider>
        <RouterProvider router={router} />
      </Toast.Provider>
    </QueryClientProvider>
  </StrictMode>,
)

