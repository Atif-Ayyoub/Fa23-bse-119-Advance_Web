import { Navigate, Route, Routes } from 'react-router-dom'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { ROLES } from '../constants/roles'
import { APP_ROUTES } from '../constants/routes'
import { AdminAdsPage } from '../pages/admin/AdminAdsPage'
import { AdminAnalyticsPage } from '../pages/admin/AdminAnalyticsPage'
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage'
import { AdminCitiesPage } from '../pages/admin/AdminCitiesPage'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminPackagesPage } from '../pages/admin/AdminPackagesPage'
import { AdminPaymentsPage } from '../pages/admin/AdminPaymentsPage'
import { AdminTraceabilityPage } from '../pages/admin/AdminTraceabilityPage'
import { AdminSystemHealthPage } from '../pages/admin/AdminSystemHealthPage'
import { AdminUsersPage } from '../pages/admin/AdminUsersPage'
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { ClientAdCreatePage } from '../pages/client/ClientAdCreatePage'
import { ClientAdsPage } from '../pages/client/ClientAdsPage'
import { ClientDashboardPage } from '../pages/client/ClientDashboardPage'
import { ClientNotificationsPage } from '../pages/client/ClientNotificationsPage'
import { ClientPaymentsPage } from '../pages/client/ClientPaymentsPage'
import { ModeratorFlagsPage } from '../pages/moderator/ModeratorFlagsPage'
import { ModeratorHistoryPage } from '../pages/moderator/ModeratorHistoryPage'
import { ModeratorQueuePage } from '../pages/moderator/ModeratorQueuePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { AdDetailsPage } from '../pages/public/AdDetailsPage'
import { ContactPage } from '../pages/public/ContactPage'
import { CityPage } from '../pages/public/CityPage'
import { CategoryPage } from '../pages/public/CategoryPage'
import { ExplorePage } from '../pages/public/ExplorePage'
import { FaqPage } from '../pages/public/FaqPage'
import { LegalPage } from '../pages/public/LegalPage'
import { HomePage } from '../pages/public/HomePage'
import { PrivacyPage } from '../pages/public/PrivacyPage'
import { PackagesPage } from '../pages/public/PackagesPage'
import { TermsPage } from '../pages/public/TermsPage'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicOnlyRoute } from './PublicOnlyRoute'
import { RoleRoute } from './RoleRoute'

export function AppRouter() {
  return (
    <Routes>
      <Route path={APP_ROUTES.HOME} element={<HomePage />} />
      <Route path={APP_ROUTES.EXPLORE} element={<ExplorePage />} />
      <Route path={APP_ROUTES.AD_DETAILS} element={<AdDetailsPage />} />
      <Route path={APP_ROUTES.CATEGORY_PAGE} element={<CategoryPage />} />
      <Route path={APP_ROUTES.CITY_PAGE} element={<CityPage />} />
      <Route path={APP_ROUTES.PACKAGES} element={<PackagesPage />} />
      <Route path={APP_ROUTES.FAQ} element={<FaqPage />} />
      <Route path={APP_ROUTES.CONTACT} element={<ContactPage />} />
      <Route path={APP_ROUTES.TERMS} element={<TermsPage />} />
      <Route path={APP_ROUTES.PRIVACY} element={<PrivacyPage />} />
      <Route path={APP_ROUTES.LEGAL} element={<LegalPage />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={APP_ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={APP_ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route element={<RoleRoute allowedRoles={[ROLES.CLIENT]} />}>
            <Route path={APP_ROUTES.CLIENT_DASHBOARD} element={<ClientDashboardPage />} />
            <Route path={APP_ROUTES.CLIENT_ADS} element={<ClientAdsPage />} />
            <Route path={APP_ROUTES.CLIENT_ADS_NEW} element={<ClientAdCreatePage />} />
            <Route path={APP_ROUTES.CLIENT_PAYMENTS} element={<ClientPaymentsPage />} />
            <Route path={APP_ROUTES.CLIENT_NOTIFICATIONS} element={<ClientNotificationsPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={[ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN]} />}>
            <Route path={APP_ROUTES.MODERATOR_QUEUE} element={<ModeratorQueuePage />} />
            <Route path={APP_ROUTES.MODERATOR_FLAGS} element={<ModeratorFlagsPage />} />
            <Route path={APP_ROUTES.MODERATOR_HISTORY} element={<ModeratorHistoryPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]} />}>
            <Route path={APP_ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
            <Route path={APP_ROUTES.ADMIN_PAYMENTS} element={<AdminPaymentsPage />} />
            <Route path={APP_ROUTES.ADMIN_ADS} element={<AdminAdsPage />} />
            <Route path={APP_ROUTES.ADMIN_PACKAGES} element={<AdminPackagesPage />} />
            <Route path={APP_ROUTES.ADMIN_CATEGORIES} element={<AdminCategoriesPage />} />
            <Route path={APP_ROUTES.ADMIN_CITIES} element={<AdminCitiesPage />} />
            <Route path={APP_ROUTES.ADMIN_USERS} element={<AdminUsersPage />} />
            <Route path={APP_ROUTES.ADMIN_TRACEABILITY} element={<AdminTraceabilityPage />} />
            <Route path={APP_ROUTES.ADMIN_ANALYTICS} element={<AdminAnalyticsPage />} />
            <Route path={APP_ROUTES.ADMIN_SYSTEM_HEALTH} element={<AdminSystemHealthPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
      <Route path="/auth/login" element={<Navigate to={APP_ROUTES.LOGIN} replace />} />
      <Route path="/client" element={<Navigate to={APP_ROUTES.CLIENT_DASHBOARD} replace />} />
      <Route path="/moderator" element={<Navigate to={APP_ROUTES.MODERATOR_QUEUE} replace />} />
      <Route path="/admin" element={<Navigate to={APP_ROUTES.ADMIN_DASHBOARD} replace />} />
      <Route path="/admin/control-center" element={<Navigate to={APP_ROUTES.ADMIN_DASHBOARD} replace />} />
      <Route path="/admin/audit-trail" element={<Navigate to={APP_ROUTES.ADMIN_TRACEABILITY} replace />} />
    </Routes>
  )
}
