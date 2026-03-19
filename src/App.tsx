import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from './hooks/use-auth'
import { ProtectedRoute } from './components/ProtectedRoute'
import Layout from './components/Layout'

// Pages
import NotFound from './pages/NotFound'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import PacientesList from './pages/pacientes/PacientesList'
import ProcedimentosList from './pages/procedimentos/ProcedimentosList'
import OpmeList from './pages/opme/OpmeList'
import PedidosList from './pages/pedidos/PedidosList'
import PedidoCreate from './pages/pedidos/PedidoCreate'
import PedidoDetail from './pages/pedidos/PedidoDetail'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pacientes" element={<PacientesList />} />
              <Route path="/procedimentos" element={<ProcedimentosList />} />
              <Route path="/opme" element={<OpmeList />} />
              <Route path="/pedidos" element={<PedidosList />} />
              <Route path="/pedidos/novo" element={<PedidoCreate />} />
              <Route path="/pedidos/:id" element={<PedidoDetail />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
