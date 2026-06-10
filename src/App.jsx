import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastProvider } from './components/common/Toast'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import { AuthProvider } from './hooks/useAuth'
import Home from './pages/Home'
import { AboutLayout } from './pages/about/Overview'
import Overview from './pages/about/Overview'
import History from './pages/about/History'
import Location from './pages/about/Location'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import BoardList from './pages/board/BoardList'
import BoardDetail from './pages/board/BoardDetail'
import BoardWrite from './pages/board/BoardWrite'
import BoardEdit from './pages/board/BoardEdit'
import ContactWrite from './pages/contact/ContactWrite'
import ContactMy from './pages/contact/ContactMy'
import MyPage from './pages/MyPage'
import NotFound from './pages/NotFound'
import ProductList from './pages/products/ProductList'
import ProductDetail from './pages/products/ProductDetail'
import ProductWrite from './pages/products/ProductWrite'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />

              {/* 회사소개 */}
              <Route path="/about" element={<AboutLayout />}>
                <Route index element={<Overview />} />
                <Route path="overview" element={<Overview />} />
                <Route path="history" element={<History />} />
                <Route path="location" element={<Location />} />
              </Route>

              {/* 제품 */}
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetail />} />

              {/* 보호된 라우트 — admin */}
              <Route element={<ProtectedRoute role="admin" />}>
                <Route path="/products/new" element={<ProductWrite />} />
              </Route>

              {/* 게시판 */}
              <Route path="/board" element={<BoardList />} />
              <Route path="/board/:id" element={<BoardDetail />} />

              {/* 인증 */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />

              {/* 보호된 라우트 */}
              <Route element={<ProtectedRoute />}>
                <Route path="/board/write" element={<BoardWrite />} />
                <Route path="/board/:id/edit" element={<BoardEdit />} />
                <Route path="/contact/write" element={<ContactWrite />} />
                <Route path="/contact/my" element={<ContactMy />} />
                <Route path="/mypage" element={<MyPage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
