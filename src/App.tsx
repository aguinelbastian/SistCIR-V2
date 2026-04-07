import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from './hooks/use-auth'
import { ProtectedRoute } from './components/ProtectedRoute'
import Layout from './components/Layout'

// Pages
import NotFound from './pages/NotFound'
import Login from './pages/auth/Login'
import Cadastro from './pages/auth/Cadastro'
import Aguardando from './pages/auth/Aguardando'
import Dashboard from './pages/dashboard/Dashboard'
import PacientesList from './pages/pacientes/PacientesList'
import ProcedimentosList from './pages/procedimentos/ProcedimentosList'
import OpmeList from './pages/opme/OpmeList'
import PedidosList from './pages/pedidos/PedidosList'
import PedidoCreate from './pages/pedidos/PedidoCreate'
import PedidoDetail from './pages/pedidos/PedidoDetail'
import AdminPage from './pages/admin/AdminPage'
import UsersPage from './pages/admin/UsersPage'
import AdminOpmeList from './pages/admin/AdminOpmeList'
import MinhaConta from './pages/account/MinhaConta'
import RelatoriosPage from './pages/relatorios/RelatoriosPage'
import SurgicalRoomsList from './pages/surgical-rooms/SurgicalRoomsList'
import SurgicalRoomCreate from './pages/surgical-rooms/SurgicalRoomCreate'
import SurgicalRoomEdit from './pages/surgical-rooms/SurgicalRoomEdit'
import RoboticSystemsList from './pages/robotic-systems/RoboticSystemsList'
import RoboticSystemCreate from './pages/robotic-systems/RoboticSystemCreate'
import RoboticSystemEdit from './pages/robotic-systems/RoboticSystemEdit'
import SurgicalBlocksList from './pages/surgical-blocks/SurgicalBlocksList'
import SurgicalBlockCreate from './pages/surgical-blocks/SurgicalBlockCreate'
import SurgicalBlockEdit from './pages/surgical-blocks/SurgicalBlockEdit'
import ResourceAllocationsList from './pages/resource-allocations/ResourceAllocationsList'
import ResourceAllocationCreate from './pages/resource-allocations/ResourceAllocationCreate'
import ResourceAllocationEdit from './pages/resource-allocations/ResourceAllocationEdit'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/aguardando-aprovacao" element={<Aguardando />} />

            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/minha-conta" element={<MinhaConta />} />
              <Route path="/relatorios" element={<RelatoriosPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/usuarios" element={<UsersPage />} />
              <Route path="/admin/opme" element={<AdminOpmeList />} />
              <Route path="/pacientes" element={<PacientesList />} />
              <Route path="/procedimentos" element={<ProcedimentosList />} />
              <Route path="/opme" element={<OpmeList />} />
              <Route path="/pedidos" element={<PedidosList />} />
              <Route path="/pedidos/novo" element={<PedidoCreate />} />
              <Route path="/pedidos/:id" element={<PedidoDetail />} />
              <Route path="/salas-cirurgicas" element={<SurgicalRoomsList />} />
              <Route path="/salas-cirurgicas/nova" element={<SurgicalRoomCreate />} />
              <Route path="/salas-cirurgicas/:id/editar" element={<SurgicalRoomEdit />} />
              <Route path="/sistemas-roboticos" element={<RoboticSystemsList />} />
              <Route path="/sistemas-roboticos/novo" element={<RoboticSystemCreate />} />
              <Route path="/sistemas-roboticos/:id/editar" element={<RoboticSystemEdit />} />
              <Route path="/blocos-cirurgicos" element={<SurgicalBlocksList />} />
              <Route path="/blocos-cirurgicos/novo" element={<SurgicalBlockCreate />} />
              <Route path="/blocos-cirurgicos/:id/editar" element={<SurgicalBlockEdit />} />
              <Route path="/alocacao-recursos" element={<ResourceAllocationsList />} />
              <Route path="/alocacao-recursos/nova" element={<ResourceAllocationCreate />} />
              <Route path="/alocacao-recursos/:id/editar" element={<ResourceAllocationEdit />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
